import { canEditAgreement } from "../rules/canEditAgreement.js";
import type { PolicyInput } from "../viewerContext.js";
import type { AgreementDTO, Decision, PolicyTelemetry } from "../types.js";

/**
 * Autoriza la edición optimista de un acuerdo.
 */
export function authorizeEditAgreement(
  input: PolicyInput<AgreementDTO>,
  telemetry?: PolicyTelemetry,
): Decision {
  const start = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  const { viewerContext, resource, policySnapshotId } = input;

  const evaluation = canEditAgreement(viewerContext, resource);
  const decision: Decision = {
    effect: evaluation.allowed ? "PERMIT" : "DENY",
    reasons: evaluation.reasons.length ? evaluation.reasons : [{ code: evaluation.allowed ? "OK" : "AGREEMENT_EDIT_BLOCKED" }],
    obligations: evaluation.obligations,
    metrics: {
      evalMs: (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now()) - start,
    },
  };

  telemetry?.onEvaluate("authorizeEditAgreement", decision.effect, {
    policySnapshotId: policySnapshotId ?? null,
    agreementState: resource.state,
  });

  return decision;
}
