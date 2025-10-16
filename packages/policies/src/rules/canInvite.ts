import type { InviteContext, Obligation, Reason, Tier } from "../types.js";
import type { ViewerContext } from "../viewerContext.js";

export interface InviteEvaluation {
  allowed: boolean;
  reasons: Reason[];
  obligations?: Obligation[];
}

/**
 * Determina si el viewer puede emitir una invitación a un Moment.
 */
export function canInvite(vc: ViewerContext, invite: InviteContext = {}, now: Date = new Date()): InviteEvaluation {
  const reasons: Reason[] = [];
  const obligations: Obligation[] = [];

  if (invite.momentTierRequired && tierRank(vc.tier) < tierRank(invite.momentTierRequired)) {
    reasons.push({ code: "INVITE_TIER_REQUIRED", detail: `Se requiere ${invite.momentTierRequired}` });
  }
  if (invite.requireCareScore && rank3(vc.careScore ?? "low") < rank3(invite.requireCareScore)) {
    reasons.push({ code: "CARE_REQUIRED", detail: `Se requiere ${invite.requireCareScore}` });
  }
  if ((invite.maxInvites ?? Infinity) <= (invite.pendingInvites ?? 0)) {
    reasons.push({ code: "INVITE_LIMIT_REACHED", detail: "Se alcanzó el máximo de invitaciones" });
  }
  if (invite.cooldownMs && invite.lastInviteAt) {
    const diff = now.getTime() - invite.lastInviteAt.getTime();
    if (diff < invite.cooldownMs) {
      reasons.push({ code: "INVITE_COOLDOWN_ACTIVE", detail: `Disponible en ${Math.ceil((invite.cooldownMs - diff) / 1000)}s` });
    }
  }
  if (vc.reciprocityScore === "low") {
    reasons.push({ code: "RECIPROCITY_REQUIRED", detail: "Se requiere historial de cuidado previo" });
  }
  if (vc.consentState !== "valid") {
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
