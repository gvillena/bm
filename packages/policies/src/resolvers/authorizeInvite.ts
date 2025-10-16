import { canInvite } from "../rules/canInvite.js";
import { resolveAccessRequirement } from "../rules/resolveAccessRequirement.js";
import type { PolicyInput } from "../viewerContext.js";
import type { Decision, MomentDTO, Obligation, PolicyTelemetry } from "../types.js";
import type { InviteContext } from "../types.js";
import { composeReasons } from "../utils/reasons.js";

export interface InviteResource {
  moment: MomentDTO;
  invite?: InviteContext;
}

/**
 * Autoriza la emisión de una invitación a un Moment.
 */
export function authorizeInvite(
  input: PolicyInput<InviteResource>,
  telemetry?: PolicyTelemetry,
): Decision {
  const start = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  const { viewerContext, resource, policySnapshotId, now } = input;

  const access = resolveAccessRequirement(viewerContext, {
    ...resource.moment.accessRequirements,
    minTier: resource.invite?.momentTierRequired ?? resource.moment.accessRequirements?.minTier,
  });
  const invite = canInvite(viewerContext, resource.invite, now);

  const reasons = composeReasons(access.reasons, invite.reasons);
  const obligations = mergeObligations(access.obligations, invite.obligations);
  const allowed = access.allowed && invite.allowed;

  const decision: Decision = {
    effect: allowed ? "PERMIT" : "DENY",
    reasons: reasons.length ? reasons : [{ code: allowed ? "OK" : "INVITE_BLOCKED" }],
    obligations,
    metrics: {
      evalMs: (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now()) - start,
    },
  };

  telemetry?.onEvaluate("authorizeInvite", decision.effect, {
    policySnapshotId: policySnapshotId ?? null,
  });

  return decision;
}

function mergeObligations(...groups: Array<readonly Obligation[] | undefined>): Obligation[] | undefined {
  const acc: Obligation[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    if (!group) continue;
    for (const obligation of group) {
      const key = `${obligation.code}:${JSON.stringify(obligation.params ?? {})}`;
      if (!seen.has(key)) {
        seen.add(key);
        acc.push(obligation);
      }
    }
  }
  return acc.length ? acc : undefined;
}
