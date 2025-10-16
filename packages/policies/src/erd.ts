import type { ConsentState, EmotionalState, ViewerContext } from "./viewerContext.js";
import type { Tier } from "./types.js";

export interface ERDVector {
  plan: Tier;
  reciprocity: "low" | "mid" | "high";
  care: "low" | "mid" | "high";
  emotion: EmotionalState;
  consent: ConsentState;
}

/**
 * Calcula un vector ERD (Exposición Relacional Dinámica) agregando señales del `ViewerContext`.
 *
 * La función no procesa datos sensibles crudos; únicamente opera sobre valores previamente agregados.
 */
export function evaluateERD(vc: ViewerContext): ERDVector {
  return {
    plan: vc.tier,
    reciprocity: vc.reciprocityScore ?? "low",
    care: vc.careScore ?? "low",
    emotion: vc.emotionalState ?? "unknown",
    consent: vc.consentState ?? "missing",
  };
}
