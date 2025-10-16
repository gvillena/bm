import type { Decision, Obligation } from "@bm/policies";
import { decisionToDirectives, buildObligationActions } from "../adapters/policies.adapter.js";
import { filterDirectives } from "../policies/filters.js";
import type { Guardrails } from "../policies/guardrails.js";
import type { AriaTelemetry } from "../telemetry/index.js";
import { createId } from "../utils/id.js";
import { PresenceBudget } from "./budget.js";
import type { AuraPreset, PresenceLevel, RuntimeCtx, RuntimeSignal, UiDirectives } from "./types.js";
import { COPY } from "../prompts/system-copy.js";
import { getIntentStrategy } from "../intent/registry.js";
import type { IntentContext, RelationalIntent } from "../intent/types.js";

function resolveNodeId(signal: RuntimeSignal, ctx: RuntimeCtx): string | undefined {
  return ctx.nodeId ?? ("nodeId" in signal.payload ? (signal.payload as { nodeId?: string }).nodeId : undefined);
}

interface ObligationSource {
  obligations?: Obligation[];
  policyDecision?: Decision | null;
}

function ensureConsentActions(
  directives: UiDirectives | null,
  source: ObligationSource,
  nodeId: string
): UiDirectives | null {
  const obligations = source.obligations ?? source.policyDecision?.obligations ?? [];
  const actions = buildObligationActions(obligations, { nodeId });
  if (actions.length === 0) {
    return directives;
  }
  const base: UiDirectives = directives ?? {};
  const currentActions = base.actions ?? [];
  const missingActions = actions.filter(
    (action) => !currentActions.some((existing) => existing.actionRef.name === action.actionRef.name)
  );
  if (missingActions.length === 0) {
    return directives;
  }
  const hints = obligations.some((obligation: Obligation) => obligation.code === "CONFIRM_CONSENT_SERVER")
    ? [...(base.hints ?? []), COPY.consent.needConfirm]
    : base.hints ?? [];
  return {
    ...base,
    hints,
    actions: [...currentActions, ...missingActions],
    tone: base.tone ?? "protective"
  };
}

export interface PresenceControllerArgs {
  budget: PresenceBudget;
  guardrails: Guardrails;
  telemetry?: AriaTelemetry;
}

export class PresenceController {
  private level: PresenceLevel = "minimal";

  private aura: AuraPreset = "calm";

  private readonly budget: PresenceBudget;

  private readonly guardrails: Guardrails;

  private readonly telemetry?: AriaTelemetry;

  constructor(args: PresenceControllerArgs) {
    this.budget = args.budget;
    this.guardrails = args.guardrails;
    this.telemetry = args.telemetry;
  }

  setLevel(level: PresenceLevel): void {
    this.level = level;
  }

  setAura(aura: AuraPreset): void {
    this.aura = aura;
  }

  getLevel(): PresenceLevel {
    return this.level;
  }

  getAura(): AuraPreset {
    return this.aura;
  }

  onRuntimeEvent(signal: RuntimeSignal, ctx: RuntimeCtx): UiDirectives | null {
    const nodeId = resolveNodeId(signal, ctx);
    if (!nodeId) {
      return null;
    }
    if (!this.budget.canShow(signal.timestamp, nodeId)) {
      return null;
    }

    const base = this.resolveDirectives(signal, ctx, nodeId);
    if (!base) {
      return null;
    }

    const withConsent = ensureConsentActions(base, ctx, nodeId);
    if (!withConsent) {
      return null;
    }
    const filtered = filterDirectives(withConsent);
    const guardrailResult = this.guardrails.apply(filtered, {
      policySnapshotId: ctx.policySnapshotId,
      nodeId,
      graphId: ctx.graphId
    });

    if (!guardrailResult.directives) {
      return null;
    }

    this.budget.recordShown(signal.timestamp, nodeId);

    const directivesId = createId("ui");
    if (this.telemetry?.onPresenceShown) {
      this.telemetry.onPresenceShown({
        directivesId,
        graphId: ctx.graphId,
        nodeId,
        policySnapshotId: ctx.policySnapshotId,
        level: this.level,
        aura: this.aura
      });
    }
    if (guardrailResult.triggers.length > 0 && this.telemetry?.onGuardrail) {
      for (const trigger of guardrailResult.triggers) {
        this.telemetry.onGuardrail({
          code: trigger.code,
          detail: trigger.detail,
          graphId: ctx.graphId,
          nodeId
        });
      }
    }

    return guardrailResult.directives;
  }

  handleIntent(
    intent: RelationalIntent,
    baseContext: Omit<IntentContext, "aura" | "level"> & Partial<Pick<IntentContext, "aura" | "level">>
  ): UiDirectives | null {
    const nodeId = baseContext.node.id;
    const timestamp = Date.now();
    if (!this.budget.canShow(timestamp, nodeId)) {
      return null;
    }
    const strategy = getIntentStrategy(intent);
    const context: IntentContext = {
      ...baseContext,
      aura: baseContext.aura ?? this.aura,
      level: baseContext.level ?? this.level
    };
    const base = strategy.handle(context);
    const withConsent = ensureConsentActions(base, context, nodeId);
    if (!withConsent) {
      return null;
    }
    const filtered = filterDirectives(withConsent);
    const guardrailResult = this.guardrails.apply(filtered, {
      policySnapshotId: context.policySnapshotId,
      nodeId,
      graphId: context.graphId
    });
    if (!guardrailResult.directives) {
      return null;
    }
    this.budget.recordShown(timestamp, nodeId);
    if (this.telemetry?.onIntentHandled) {
      this.telemetry.onIntentHandled({ intent, nodeId, graphId: context.graphId });
    }
    return guardrailResult.directives;
  }

  private resolveDirectives(signal: RuntimeSignal, ctx: RuntimeCtx, nodeId: string): UiDirectives | null {
    switch (signal.type) {
      case "didEnter":
        return this.applySafetyTone(decisionToDirectives(ctx.policyDecision, { nodeId }), ctx);
      case "guard":
        if (signal.payload.outcome === "permit") {
          return null;
        }
        return this.applySafetyTone(decisionToDirectives(ctx.policyDecision, { nodeId }), ctx);
      case "action":
        if (signal.payload.result === "rejected") {
          this.budget.recordDismiss(signal.timestamp, nodeId);
        }
        return null;
      case "error":
        return this.applySafetyTone(
          {
            tone: "protective",
            explain: "Ocurrió un error en el flujo. Podemos pausar y reintentar.",
            actions: [
              {
                label: "Reintentar",
                actionRef: { name: "retryNode", params: { nodeId } },
                kind: "secondary"
              },
              {
                label: COPY.actions.pause,
                actionRef: { name: "pauseExperience", params: { nodeId } },
                kind: "primary"
              }
            ]
          },
          ctx
        );
      default:
        return null;
    }
  }

  private applySafetyTone(directives: UiDirectives | null, ctx: RuntimeCtx): UiDirectives | null {
    if (!directives) {
      return null;
    }
    const tone = ctx.viewerContext.emotionalState === "stressed" ? "protective" : directives.tone;
    return { ...directives, tone: tone ?? this.defaultToneForAura() };
  }

  private defaultToneForAura(): UiDirectives["tone"] {
    switch (this.aura) {
      case "calm":
        return "warm";
      case "clear":
        return "neutral";
      case "protective":
        return "protective";
      default:
        return "neutral";
    }
  }
}

