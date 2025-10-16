import type { GuardHandler } from "./constraints.js";
import type { PoliciesAdapter } from "../integration/policies.adapter.js";

interface GuardActionPolicyParams {
  readonly action: string;
  readonly resource?: unknown;
}

export const createGuardActionPolicy = (policies: PoliciesAdapter): GuardHandler => {
  return async ({ viewerContext, params }) => {
    const { action, resource } = (params ?? {}) as Partial<GuardActionPolicyParams>;
    if (!action) {
      return {
        decision: "DENY",
        reasons: [{ code: "missing-action", message: "Action is required" }],
        obligations: [],
      };
    }
    const result = await policies.authorizeEditAgreement(viewerContext, resource ?? { action });
    return {
      decision: result.decision,
      reasons: result.reasons,
      obligations: result.obligations,
      redactedDto: result.dto,
      auditIds: result.auditIds,
      policySnapshotId: result.policySnapshotId,
    };
  };
};
