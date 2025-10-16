export type PolicyDecision = "PERMIT" | "DENY" | "REDACT";

export interface PolicyReason {
  readonly code: string;
  readonly message: string;
}

export interface PolicyDecisionResult<TDto = unknown> {
  readonly decision: PolicyDecision;
  readonly reasons?: PolicyReason[];
  readonly obligations?: string[];
  readonly dto?: TDto;
  readonly auditIds?: string[];
  readonly policySnapshotId?: string;
}

export interface PoliciesAdapter {
  authorizeViewMoment: (
    viewerContext: unknown,
    resource: unknown
  ) => Promise<PolicyDecisionResult>;
  authorizeEditAgreement: (
    viewerContext: unknown,
    resource: unknown
  ) => Promise<PolicyDecisionResult>;
  evaluateGuard: (
    name: string,
    input: {
      viewerContext: unknown;
      params?: Record<string, unknown>;
    }
  ) => Promise<PolicyDecisionResult>;
}

export const createPermitDecision = (overrides: Partial<PolicyDecisionResult> = {}): PolicyDecisionResult => ({
  decision: "PERMIT",
  ...overrides,
});
