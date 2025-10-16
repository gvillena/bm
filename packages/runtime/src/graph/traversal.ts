import type { GuardRef, SceneEdge, SceneFlowGraph, SceneNode } from "./types.js";
import type { GuardRegistry, GuardExecutionResult } from "../guards/constraints.js";
import type { RuntimeContext, RuntimeState, TransitionRecord } from "../state/runtimeState.js";
import type { EventBus } from "../events/bus.js";
import type { Telemetry } from "../telemetry/index.js";
import type { PolicyReason } from "../integration/policies.adapter.js";
import type { UiDirectives } from "../integration/aria/directives.js";
import { ConstraintError, ensureGuardRegistered, ensureNodeExists } from "../guards/constraints.js";
import { appendRecord } from "../state/history.js";

export interface GuardAggregate {
  readonly decision: "PERMIT" | "REDACT";
  readonly reasons?: PolicyReason[];
  readonly obligations?: string[];
  readonly auditIds?: string[];
  readonly policySnapshotId?: string;
  readonly redactedDto?: unknown;
  readonly ui?: UiDirectives;
}

export interface TraversalResult {
  readonly state: RuntimeState;
  readonly record: TransitionRecord;
  readonly guard: GuardAggregate;
}

export interface TraversalDependencies {
  readonly graph: SceneFlowGraph;
  readonly context: RuntimeContext;
  readonly guardRegistry: GuardRegistry;
  readonly eventBus: EventBus;
  readonly telemetry?: Telemetry;
}

export const runGuardSequence = async (
  deps: TraversalDependencies,
  node: SceneNode,
  guardRefs: readonly GuardRef[] | undefined,
  edge: SceneEdge | undefined,
  target: SceneNode | undefined,
  signal?: AbortSignal
): Promise<GuardAggregate> => {
  let aggregate: GuardAggregate = { decision: "PERMIT", reasons: [], obligations: [], auditIds: [] };
  if (!guardRefs || guardRefs.length === 0) {
    return aggregate;
  }

  for (const guard of guardRefs) {
    if (signal?.aborted) {
      throw new AbortError();
    }
    const handler = ensureGuardRegistered(guard, deps.guardRegistry);
    const result = await handler({
      graph: deps.graph,
      currentNode: node,
      edge,
      targetNode: target,
      params: guard.params,
      viewerContext: deps.context.viewerContext,
    });

    const outcome = normalizeOutcome(result);

    deps.telemetry?.onGuard?.({
      node,
      guard,
      outcome: result.decision.toLowerCase() as "permit" | "deny" | "redact",
      reasons: result.reasons,
    });
    deps.eventBus.emit({
      type: "guard",
      payload: {
        node,
        guard,
        outcome: result.decision.toLowerCase() as "permit" | "deny" | "redact",
      },
      timestamp: deps.context.now(),
    });

    if (result.decision === "DENY") {
      throw new GuardDeniedError(guard.name, outcome);
    }

    aggregate = mergeGuardOutcomes(aggregate, outcome);
  }

  return aggregate;
};

const normalizeOutcome = (outcome: GuardExecutionResult): GuardAggregate => ({
  decision: outcome.decision === "REDACT" ? "REDACT" : "PERMIT",
  reasons: outcome.reasons ?? [],
  obligations: outcome.obligations ?? [],
  auditIds: outcome.auditIds ?? [],
  policySnapshotId: outcome.policySnapshotId,
  redactedDto: outcome.redactedDto,
});

const mergeGuardOutcomes = (prev: GuardAggregate, next: GuardAggregate): GuardAggregate => {
  const decision = next.decision === "REDACT" ? "REDACT" : prev.decision;
  const reasons = [...(prev.reasons ?? []), ...(next.reasons ?? [])];
  const obligations = [...new Set([...(prev.obligations ?? []), ...(next.obligations ?? [])])];
  const auditIds = [...new Set([...(prev.auditIds ?? []), ...(next.auditIds ?? [])])];
  return {
    decision,
    reasons,
    obligations,
    auditIds,
    policySnapshotId: next.policySnapshotId ?? prev.policySnapshotId,
    redactedDto: next.decision === "REDACT" ? next.redactedDto : prev.redactedDto,
  };
};

export class GuardDeniedError extends Error {
  readonly code = "guard-denied";
  constructor(readonly guardName: string, readonly aggregate: GuardAggregate) {
    super(`Guard ${guardName} denied transition`);
  }
}

export class AbortError extends Error {
  readonly code = "transition-aborted";
  constructor() {
    super("Transition aborted");
  }
}

export const traverse = async (
  deps: TraversalDependencies,
  state: RuntimeState,
  targetNodeId: string,
  signal?: AbortSignal
): Promise<TraversalResult> => {
  if (signal?.aborted) {
    throw new AbortError();
  }
  const currentNode = ensureNodeExists(state.currentNodeId, deps.graph.nodes);
  const targetNode = ensureNodeExists(targetNodeId, deps.graph.nodes);
  const edge = currentNode.transitions.find((transition) => transition.to === targetNodeId);

  if (!edge) {
    throw new ConstraintError(`Transition to ${targetNodeId} is not allowed from ${currentNode.id}`, {
      from: currentNode.id,
      to: targetNodeId,
    });
  }

  deps.eventBus.emit({ type: "willExit", payload: { node: currentNode }, timestamp: deps.context.now() });
  const exitAggregate = await runGuardSequence(deps, currentNode, currentNode.onExit, edge, targetNode, signal);
  deps.eventBus.emit({ type: "didExit", payload: { node: currentNode }, timestamp: deps.context.now() });

  deps.eventBus.emit({ type: "willEnter", payload: { node: targetNode }, timestamp: deps.context.now() });
  const edgeGuard = await runGuardSequence(
    deps,
    currentNode,
    edge.condition ? [edge.condition] : undefined,
    edge,
    targetNode,
    signal
  );
  const nodeGuard = await runGuardSequence(deps, targetNode, targetNode.onEnter, edge, targetNode, signal);

  const guardAggregate = mergeGuardOutcomes(exitAggregate, mergeGuardOutcomes(edgeGuard, nodeGuard));

  const now = deps.context.now();
  const record: TransitionRecord = {
    from: currentNode.id,
    to: targetNode.id,
    at: now,
    reasons: guardAggregate.reasons,
    auditIds: guardAggregate.auditIds,
  };

  const newState: RuntimeState = {
    ...state,
    currentNodeId: targetNode.id,
    updatedAt: now,
    history: appendRecord(state.history, record),
    sequence: state.sequence + 1,
  };

  deps.eventBus.emit({ type: "didEnter", payload: { node: targetNode }, timestamp: now });
  deps.eventBus.emit({ type: "transition", payload: { record, state: newState }, timestamp: now });
  deps.telemetry?.onTransition?.({ record, state: newState });

  return { state: newState, record, guard: guardAggregate };
};
