import type { ViewerContext } from "@bm/policies";
import type { PolicyDecisionResult } from "@bm/runtime";
import { requireClients } from "@bm/sdk";

type ObligationInput = string | { code: string; params?: Record<string, unknown> };

interface DecisionLike {
  effect: PolicyDecisionResult["decision"];
  reasons?: { code: string; detail?: string }[];
  obligations?: ObligationInput[];
  dto?: unknown;
}

function mapDecision(decision: DecisionLike): PolicyDecisionResult {
  return {
    decision: decision.effect,
    reasons: decision.reasons?.map((reason) => ({ code: reason.code, message: reason.detail ?? "" })),
    obligations: decision.obligations?.map((obligation) =>
      typeof obligation === "string" ? obligation : obligation.code
    ),
    dto: decision.dto
  } satisfies PolicyDecisionResult;
}

export async function authorizeViewMoment(viewerContext: ViewerContext, momentId: string): Promise<PolicyDecisionResult> {
  const { policies } = requireClients();
  const decision = await policies.authorizeViewMoment(viewerContext, momentId);
  return mapDecision(decision);
}

export async function authorizeAgreementReview(
  viewerContext: ViewerContext,
  agreementId: string
): Promise<PolicyDecisionResult> {
  const { policies } = requireClients();
  const decision = await policies.authorizeEditAgreement(viewerContext, agreementId);
  return mapDecision(decision);
}

export async function fetchPolicySnapshot(): Promise<{ policySnapshotId: string }> {
  const { policies } = requireClients();
  return policies.getPolicySnapshot();
}
