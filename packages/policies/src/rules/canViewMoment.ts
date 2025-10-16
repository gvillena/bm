import type { MomentDTO, Obligation, Reason } from "../types.js";
import type { ViewerContext } from "../viewerContext.js";
import { resolveVisibilityPolicy } from "./resolveVisibilityPolicy.js";

export interface MomentViewResult {
  level: "full" | "teaser" | "none";
  reasons: Reason[];
  obligations?: Obligation[];
  fields: string[];
}

/**
 * Determina si el viewer puede observar un `Moment` y en qué nivel de detalle.
 */
export function canViewMoment(vc: ViewerContext, moment: MomentDTO): MomentViewResult {
  const resolution = resolveVisibilityPolicy(vc, moment);
  return {
    level: resolution.visibility,
    reasons: resolution.reasons,
    obligations: resolution.obligations,
    fields: resolution.fields,
  };
}
