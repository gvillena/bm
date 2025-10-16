import { createEventBus, type EventBus } from "../events/bus.js";
import type { UiDirectives } from "../integration/aria/directives.js";
import type { AriaAdapter } from "../integration/aria/adapter.js";
import type { PoliciesAdapter } from "../integration/policies.adapter.js";
import { policyResultToGuard, type GuardRegistry, ConstraintError } from "../guards/constraints.js";
import { createGuardNodeAccess } from "../guards/guardNodeAccess.js";
import { createGuardActionPolicy } from "../guards/guardActionPolicy.js";
import type { SceneFlowGraph, SceneNode } from "./types.js";
import { traverse, GuardDeniedError, AbortError } from "./traversal.js";
import { validateGraph } from "./schema.js";
import type { RuntimeContext, RuntimeState } from "../state/runtimeState.js";
import { createInitialState } from "../state/runtimeState.js";
import { defaultClock } from "../utils/time.js";
import type { Telemetry } from "../telemetry/index.js";
import type { RuntimeActionResult, RuntimeActionExecutor } from "../actions/types.js";
import { createExecutor, type EffectsAdapter } from "../actions/effects.js";

export type RuntimeErrorCode =
  | "guard-denied"
  | "transition-aborted"
  | "transition-error"
  | "action-error"
  | "constraint-error";

export interface RuntimeErrorMeta {
  readonly guardName?: string;
  readonly obligations?: string[];
  readonly auditIds?: string[];
  readonly reasons?: { code: string; message: string }[];
}

export class RuntimeError extends Error {
  constructor(readonly code: RuntimeErrorCode, message: string, readonly meta?: RuntimeErrorMeta) {
    super(message);
    this.name = "RuntimeError";
  }
}

export class GuardDenyError extends RuntimeError {
  constructor(readonly guardName: string, meta: RuntimeErrorMeta) {
    super("guard-denied", `Guard ${guardName} denied transition`, meta);
  }
}

export class TransitionError extends RuntimeError {
  constructor(message: string, meta?: RuntimeErrorMeta) {
    super("transition-error", message, meta);
  }
}

export class ActionError extends RuntimeError {
  constructor(message: string, meta?: RuntimeErrorMeta) {
    super("action-error", message, meta);
  }
}

export class EffectError extends RuntimeError {
  constructor(message: string, meta?: RuntimeErrorMeta) {
    super("constraint-error", message, meta);
  }
}

export type TransitionResult =
  | { ok: true; state: RuntimeState; ui?: UiDirectives; obligations?: string[] }
  | { ok: false; error: RuntimeError; recoverable: boolean };

export interface ExperienceEngineArgs {
  readonly graph: SceneFlowGraph;
  readonly context: RuntimeContext;
  readonly state?: RuntimeState;
  readonly policies: PoliciesAdapter;
  readonly aria?: AriaAdapter;
  readonly telemetry?: Telemetry;
  readonly effects?: EffectsAdapter;
  readonly clock?: () => number;
}

export class ExperienceEngine {
  private state: RuntimeState;
  private readonly graph: SceneFlowGraph;
  private readonly context: RuntimeContext;
  private readonly guardRegistry: GuardRegistry;
  private readonly eventBus: EventBus;
  private readonly telemetry?: Telemetry;
  private readonly aria?: AriaAdapter;
  private readonly executeAction: RuntimeActionExecutor;

  constructor(private readonly args: ExperienceEngineArgs) {
    this.telemetry = args.telemetry;
    this.aria = args.aria;
    const parsed = validateGraph(args.graph);
    this.graph = parsed;
    const clock = args.clock ?? args.context.now ?? defaultClock;
    this.context = {
      ...args.context,
      now: () => clock(),
    };
    this.state = args.state ?? createInitialState(parsed.id, parsed.start, this.context.now());
    this.eventBus = createEventBus();
    this.guardRegistry = this.createGuardRegistry(args.policies);
    this.executeAction = createExecutor(args.effects);
  }

  getState(): Readonly<RuntimeState> {
    return this.state;
  }

  currentNode(): SceneNode {
    return this.graph.nodes[this.state.currentNodeId];
  }

  async transition(to: string, opts?: { signal?: AbortSignal }): Promise<TransitionResult> {
    try {
      const traversal = await traverse(
        {
          graph: this.graph,
          context: this.context,
          guardRegistry: this.guardRegistry,
          eventBus: this.eventBus,
          telemetry: this.telemetry,
        },
        this.state,
        to,
        opts?.signal
      );

      const actionResult = await this.executeEdgeAction(to, opts?.signal);
      const ariaUi = this.aria?.onNodeEnter?.(this.graph.nodes[traversal.state.currentNodeId], {
        viewerContext: this.context.viewerContext,
      });

      const ui = mergeUi(actionResult?.ui, ariaUi);
      if (traversal.guard.policySnapshotId) {
        (this.context as RuntimeContext).policySnapshotId = traversal.guard.policySnapshotId;
      }

      const obligations = [...(traversal.guard.obligations ?? []), ...(actionResult?.obligations ?? [])];

      this.state = {
        ...traversal.state,
        lastUi: ui,
      };

      return { ok: true, state: this.state, ui, obligations: obligations.length ? obligations : undefined };
    } catch (error) {
      return this.handleTransitionError(error);
    }
  }

  async next(opts?: { signal?: AbortSignal }): Promise<TransitionResult> {
    const node = this.currentNode();
    for (const edge of node.transitions) {
      const result = await this.transition(edge.to, opts);
      if (result.ok) {
        return result;
      }
    }
    return {
      ok: false,
      recoverable: false,
      error: new TransitionError(`No available transition from ${node.id}`),
    };
  }

  reset(hard = false): void {
    const now = this.context.now();
    this.state = hard
      ? createInitialState(this.graph.id, this.graph.start, now)
      : {
          ...this.state,
          currentNodeId: this.graph.start,
          updatedAt: now,
        };
  }

  private async executeEdgeAction(to: string, signal?: AbortSignal): Promise<RuntimeActionResult | undefined> {
    const node = this.graph.nodes[this.state.currentNodeId];
    const edge = node.transitions.find((transition) => transition.to === to);
    if (!edge?.action) {
      return undefined;
    }

    const start = this.context.now();
    try {
      const result = await this.executeAction({ action: edge.action, signal });
      const durationMs = this.context.now() - start;
      this.telemetry?.onAction?.({ action: edge.action.name, durationMs });
      return result ?? undefined;
    } catch (error) {
      this.telemetry?.onError?.({ error: error as Error });
      throw new ActionError(`Action ${edge.action.name} failed`, {
        reasons: [{ code: "action", message: String(error) }],
      });
    }
  }

  private createGuardRegistry(policies: PoliciesAdapter): GuardRegistry {
    const base: GuardRegistry = {
      guardNodeAccess: createGuardNodeAccess(policies),
      guardActionPolicy: createGuardActionPolicy(policies),
    };

    return new Proxy(base, {
      get: (target, prop: string | symbol) => {
        if (typeof prop !== "string") {
          return undefined;
        }
        const existing = (target as Record<string, unknown>)[prop];
        if (existing) {
          return existing;
        }
        return async (ctx: Parameters<GuardRegistry[string]>[0]) => {
          const policyResult = await policies.evaluateGuard(prop, {
            viewerContext: ctx.viewerContext,
            params: ctx.params,
          });
          return policyResultToGuard(policyResult);
        };
      },
    }) as GuardRegistry;
  }

  private handleTransitionError(error: unknown): TransitionResult {
    if (error instanceof GuardDeniedError) {
      const runtimeError = new GuardDenyError(error.guardName, {
        obligations: error.aggregate.obligations,
        auditIds: error.aggregate.auditIds,
        reasons: error.aggregate.reasons,
      });
      const ui = this.aria?.onGuardDenied?.(
        error.aggregate.reasons?.map((reason) => reason.message ?? reason.code) ?? []
      );
      if (ui) {
        this.state = { ...this.state, lastUi: ui };
      }
      this.telemetry?.onError?.({ error: runtimeError });
      return { ok: false, error: runtimeError, recoverable: true };
    }

    if (error instanceof AbortError) {
      const runtimeError = new TransitionError("Transition aborted");
      return { ok: false, error: runtimeError, recoverable: true };
    }

    if (error instanceof ConstraintError) {
      const runtimeError = new TransitionError(error.message);
      this.telemetry?.onError?.({ error: runtimeError });
      return { ok: false, error: runtimeError, recoverable: false };
    }

    if (error instanceof RuntimeError) {
      this.telemetry?.onError?.({ error });
      return { ok: false, error, recoverable: false };
    }

    const runtimeError = new TransitionError("Unknown transition error", {
      reasons: [{ code: "unknown", message: String(error) }],
    });
    this.telemetry?.onError?.({ error: runtimeError });
    return { ok: false, error: runtimeError, recoverable: false };
  }
}

const mergeUi = (a?: UiDirectives, b?: UiDirectives): UiDirectives | undefined => {
  if (!a) return b;
  if (!b) return a;
  return {
    hints: [...(a.hints ?? []), ...(b.hints ?? [])],
    actions: [...(a.actions ?? []), ...(b.actions ?? [])],
    tone: b.tone ?? a.tone,
  };
};
