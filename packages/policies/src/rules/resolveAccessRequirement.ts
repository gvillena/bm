import type { AccessRequirement, Obligation, Reason, Tier } from "../types.js";
import type { ViewerContext } from "../viewerContext.js";

export interface AccessEvaluation {
  allowed: boolean;
  reasons: Reason[];
  obligations?: Obligation[];
}

/**
 * Evalúa si un `ViewerContext` satisface un conjunto de requisitos de acceso.
 */
export function resolveAccessRequirement(vc: ViewerContext, req: AccessRequirement = {}): AccessEvaluation {
  const reasons: Reason[] = [];
  const obligations: Obligation[] = [];

  if (req.minTier && tierRank(vc.tier) < tierRank(req.minTier)) {
    reasons.push({ code: "VISIBILITY_TIER_REQUIRED", detail: `Se requiere ${req.minTier}` });
  }
  if (req.invitationRequired && !["invited", "approved"].includes(vc.relation ?? "none")) {
    reasons.push({ code: "INVITATION_REQUIRED", detail: "Falta invitación previa aceptada" });
  }
  if (req.manualApproval && vc.relation !== "approved") {
    reasons.push({ code: "APPROVAL_REQUIRED", detail: "Falta aprobación manual" });
  }
  if ((req.minVerificationLevel ?? 0) > (vc.verificationLevel ?? 0)) {
    reasons.push({ code: "VERIFICATION_REQUIRED", detail: `Nivel >= ${req.minVerificationLevel}` });
    obligations.push({ code: "CHECK_VERIFICATION_LEVEL" });
  }
  if (req.requireReciprocity && rank3(vc.reciprocityScore ?? "low") < rank3(req.requireReciprocity)) {
    reasons.push({ code: "RECIPROCITY_REQUIRED", detail: `Se requiere ${req.requireReciprocity}` });
  }
  if (req.requireCare && rank3(vc.careScore ?? "low") < rank3(req.requireCare)) {
    reasons.push({ code: "CARE_REQUIRED", detail: `Se requiere ${req.requireCare}` });
  }
  if (req.requireSharedHistory && !vc.hasSharedHistory) {
    reasons.push({ code: "SHARED_HISTORY_REQUIRED", detail: "Se requiere historial compartido" });
  }
  if (req.requireEmotionalMatch && (vc.ariaMatch === "mismatch" || vc.ariaMatch === "unknown")) {
    reasons.push({ code: "EMOTIONAL_MATCH_REQUIRED", detail: "Se requiere match emocional ARIA" });
  }
  if (req.requireConsentValid && vc.consentState !== "valid") {
    reasons.push({ code: "CONSENT_REQUIRED", detail: "Consentimiento vivo verificado" });
    obligations.push({ code: "CONFIRM_CONSENT_SERVER" });
  }

  const allowed = reasons.length === 0;
  return { allowed, reasons, obligations: obligations.length ? obligations : undefined };
}

function tierRank(t: Tier): number {
  return tiers.indexOf(t);
}

function rank3(value: "low" | "mid" | "high"): number {
  return threeRank.indexOf(value);
}

const tiers: Tier[] = ["FREE", "CIRCLE", "ALQUIMIA", "SUPER_ALQUIMIA"];
const threeRank: Array<"low" | "mid" | "high"> = ["low", "mid", "high"];
