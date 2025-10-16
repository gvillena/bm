import type { GuardExecutionContext, GuardRef, SceneNode } from "../graph/types.js";
import type { PolicyDecisionResult, PolicyReason } from "../integration/policies.adapter.js";

export interface GuardExecutionResult {
  readonly decision: "PERMIT" | "DENY" | "REDACT";
  readonly reasons?: PolicyReason[];
  readonly obligations?: string[];
  readonly redactedDto?: unknown;
  readonly auditIds?: string[];
  readonly policySnapshotId?: string;
}

export type GuardHandler = (
  context: GuardExecutionContext & { viewerContext: unknown }
) => Promise<GuardExecutionResult>;

export type GuardRegistry = Record<string, GuardHandler>;

export const policyResultToGuard = (result: PolicyDecisionResult): GuardExecutionResult => ({
  decision: result.decision,
  reasons: result.reasons,
  obligations: result.obligations,
  redactedDto: result.dto,
  auditIds: result.auditIds,
  policySnapshotId: result.policySnapshotId,
});

export const permitResult: GuardExecutionResult = { decision: "PERMIT" };

export class ConstraintError extends Error {
  constructor(message: string, readonly meta?: Record<string, unknown>) {
    super(message);
    this.name = "ConstraintError";
  }
}

export const ensureNodeExists = (nodeId: string, nodes: Record<string, SceneNode>): SceneNode => {
  const node = nodes[nodeId];
  if (!node) {
    throw new ConstraintError(`Node ${nodeId} does not exist`, { nodeId });
  }
  return node;
};

export const ensureGuardRegistered = (guard: GuardRef, registry: GuardRegistry): GuardHandler => {
  const handler = registry[guard.name];
  if (!handler) {
    throw new ConstraintError(`Guard ${guard.name} is not registered`, { guard });
  }
  return handler;
};
