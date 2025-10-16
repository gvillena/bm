import type { GuardHandler, GuardExecutionResult } from "./constraints.js";
import type { PoliciesAdapter } from "../integration/policies.adapter.js";

interface GuardNodeAccessParams {
  readonly resource: unknown;
}

export const createGuardNodeAccess = (policies: PoliciesAdapter): GuardHandler => {
  return async ({ viewerContext, params }) => {
    const { resource } = (params ?? {}) as Partial<GuardNodeAccessParams>;
    const result = await policies.authorizeViewMoment(viewerContext, resource);
    return {
      decision: result.decision,
      reasons: result.reasons,
      obligations: result.obligations,
      redactedDto: result.dto,
      auditIds: result.auditIds,
      policySnapshotId: result.policySnapshotId,
    } satisfies GuardExecutionResult;
  };
};
