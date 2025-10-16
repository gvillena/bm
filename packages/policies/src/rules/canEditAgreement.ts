import type { AgreementDTO, Obligation, Reason } from "../types.js";
import type { ViewerContext } from "../viewerContext.js";

export interface AgreementEditEvaluation {
  allowed: boolean;
  reasons: Reason[];
  obligations?: Obligation[];
}

/**
 * Determina si el viewer puede editar un acuerdo existente.
 */
export function canEditAgreement(vc: ViewerContext, agreement: AgreementDTO): AgreementEditEvaluation {
  const reasons: Reason[] = [];
  const obligations: Obligation[] = [];

  const isOwner = vc.userId && vc.userId === agreement.ownerId;
  const isCoCreator = agreement.coCreatorIds?.includes(vc.userId ?? "") ?? false;
  const isModerator = vc.role === "moderator";

  if (!isOwner && !isCoCreator && !isModerator) {
    reasons.push({ code: "NOT_AUTHORIZED", detail: "No eres parte del acuerdo" });
  }

  if (agreement.state === "archived") {
    reasons.push({ code: "AGREEMENT_ARCHIVED", detail: "Los acuerdos archivados no se editan" });
  }

  if (agreement.state === "active" && !isOwner && !isModerator) {
    reasons.push({ code: "AGREEMENT_LOCKED", detail: "Sólo la persona dueña o moderadora puede editar un acuerdo activo" });
  }

  if (agreement.requiresFreshConsent && agreement.consentState !== "valid") {
    reasons.push({ code: "CONSENT_STALE", detail: "Actualiza el consentimiento antes de editar" });
    obligations.push({ code: "CONFIRM_CONSENT_SERVER" });
  }

  const allowed = reasons.length === 0;
  return { allowed, reasons, obligations: obligations.length ? obligations : undefined };
}
