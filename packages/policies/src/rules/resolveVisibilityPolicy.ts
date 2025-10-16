import type { MomentDTO, Obligation, Reason } from "../types.js";
import type { ViewerContext } from "../viewerContext.js";
import { resolveAccessRequirement } from "./resolveAccessRequirement.js";
import type { AccessEvaluation } from "./resolveAccessRequirement.js";

export interface VisibilityResolution {
  visibility: "teaser" | "full" | "none";
  fields: string[];
  reasons: Reason[];
  obligations?: Obligation[];
  accessEvaluation: AccessEvaluation;
}

const TEASER_FIELDS = ["id", "teaser", "visibility"] as const;
const FULL_FIELDS = ["id", "teaser", "details", "rules", "intimacy", "visibility"] as const;

/**
 * Determina la visibilidad efectiva de un `Moment` para un viewer.
 */
export function resolveVisibilityPolicy(vc: ViewerContext, moment: MomentDTO): VisibilityResolution {
  const requirements = {
    ...moment.accessRequirements,
    requireSharedHistory: moment.gating?.requireSharedHistory || moment.accessRequirements?.requireSharedHistory,
    requireEmotionalMatch: moment.gating?.requireEmotionalMatch || moment.accessRequirements?.requireEmotionalMatch,
    requireConsentValid: moment.gating?.requireConsentFresh || moment.accessRequirements?.requireConsentValid,
  };

  const accessEvaluation = resolveAccessRequirement(vc, requirements);
  const obligations = accessEvaluation.obligations;

  if ((moment.visibility ?? "PUBLIC") === "PUBLIC") {
    if (accessEvaluation.allowed) {
      return {
        visibility: "full",
        fields: [...FULL_FIELDS],
        reasons: accessEvaluation.reasons,
        obligations,
        accessEvaluation,
      };
    }
    return {
      visibility: "teaser",
      fields: [...TEASER_FIELDS],
      reasons: accessEvaluation.reasons.length ? accessEvaluation.reasons : [{ code: "TEASER_ONLY" }],
      obligations,
      accessEvaluation,
    };
  }

  if (vc.role === "owner") {
    return {
      visibility: "full",
      fields: [...FULL_FIELDS],
      reasons: [{ code: "OWNER_FULL_ACCESS" }],
      obligations,
      accessEvaluation,
    };
  }

  if (vc.relation === "approved" && accessEvaluation.allowed) {
    return {
      visibility: "full",
      fields: [...FULL_FIELDS],
      reasons: accessEvaluation.reasons,
      obligations,
      accessEvaluation,
    };
  }

  if (vc.relation === "invited") {
    if (accessEvaluation.allowed) {
      return {
        visibility: "teaser",
        fields: [...TEASER_FIELDS],
        reasons: [{ code: "TEASER_PENDING_APPROVAL", detail: "Falta confirmación del consentimiento vivo" }],
        obligations,
        accessEvaluation,
      };
    }
    return {
      visibility: "teaser",
      fields: [...TEASER_FIELDS],
      reasons: accessEvaluation.reasons,
      obligations,
      accessEvaluation,
    };
  }

  return {
    visibility: "none",
    fields: [],
    reasons: accessEvaluation.reasons.length ? accessEvaluation.reasons : [{ code: "NO_VISIBILITY" }],
    obligations,
    accessEvaluation,
  };
}
