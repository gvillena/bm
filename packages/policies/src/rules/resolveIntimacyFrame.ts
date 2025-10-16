import type { MomentDTO, Obligation, Reason } from "../types.js";
import type { ViewerContext } from "../viewerContext.js";

export interface IntimacyResolution {
  show: boolean;
  reasons: Reason[];
  obligations?: Obligation[];
}

/**
 * Determina si se debe mostrar la posibilidad de intimidad para un Moment.
 */
export function resolveIntimacyFrame(vc: ViewerContext, moment: MomentDTO): IntimacyResolution {
  const reasons: Reason[] = [];
  const obligations: Obligation[] = [];

  if (!moment.intimacy?.possible) {
    reasons.push({ code: "INTIMACY_NOT_AVAILABLE", detail: "El Moment no habilita intimidad" });
    return { show: false, reasons };
  }

  if (vc.consentState !== "valid") {
    reasons.push({ code: "CONSENT_REQUIRED", detail: "Consentimiento vivo necesario" });
    obligations.push({ code: "CONFIRM_CONSENT_SERVER" });
  }

  if (vc.emotionalState === "stressed") {
    reasons.push({ code: "EMOTIONAL_STATE_STRESSED", detail: "Esperar a regular el estado emocional" });
  }

  if (moment.gating?.requireEmotionalMatch && vc.ariaMatch !== "match") {
    reasons.push({ code: "EMOTIONAL_MATCH_REQUIRED", detail: "Se requiere match emocional ARIA" });
  }

  const show = reasons.every((reason) => !reason.code.startsWith("EMOTIONAL") && reason.code !== "CONSENT_REQUIRED");

  return {
    show,
    reasons,
    obligations: obligations.length ? obligations : undefined,
  };
}
