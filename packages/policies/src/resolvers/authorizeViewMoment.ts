import { resolveVisibilityPolicy } from "../rules/resolveVisibilityPolicy.js";
import { resolveIntimacyFrame } from "../rules/resolveIntimacyFrame.js";
import type { PolicyInput } from "../viewerContext.js";
import type { Decision, DecisionEffect, MomentDTO, Obligation, PolicyTelemetry, Reason } from "../types.js";
import { applyRedaction } from "./applyRedaction.js";
import { composeReasons } from "../utils/reasons.js";

export interface ViewMomentAuthorization extends Decision {
  visibility: "teaser" | "full" | "none";
  dto?: Partial<MomentDTO>;
}

/**
 * Autoriza la visualización optimista de un `Moment`.
 */
export function authorizeViewMoment(
  input: PolicyInput<MomentDTO>,
  telemetry?: PolicyTelemetry,
): ViewMomentAuthorization {
  const start = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  const { viewerContext, resource, policySnapshotId } = input;

  const visibility = resolveVisibilityPolicy(viewerContext, resource);
  const intimacy = resolveIntimacyFrame(viewerContext, resource);

  let fields = [...visibility.fields];
  let intimacyReasons: Reason[] | undefined;
  let intimacyObligations = intimacy.obligations;

  if (!intimacy.show) {
    fields = fields.filter((field) => field !== "intimacy");
    intimacyReasons = intimacy.reasons;
  }

  const uniqueFields = Array.from(new Set(fields));
  const redaction = { allow: uniqueFields } as const;
  const dto = uniqueFields.length ? applyRedaction(resource, redaction) : undefined;

  let effect: DecisionEffect;
  if (visibility.visibility === "none") {
    effect = "DENY";
  } else if (visibility.visibility === "teaser") {
    effect = "REDACT";
  } else {
    effect = fields.length === 0 ? "DENY" : "PERMIT";
  }

  const reasons = composeReasons(visibility.reasons, intimacyReasons);
  const normalizedReasons =
    reasons.length > 0
      ? reasons
      : [
          {
            code:
              effect === "PERMIT"
                ? "OK"
                : effect === "REDACT"
                  ? "TEASER_ONLY"
                  : "NO_VISIBILITY",
          },
        ];
  const obligations = dedupeObligations(visibility.obligations, intimacyObligations);
  const metrics = { evalMs: (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now()) - start };

  const decision: ViewMomentAuthorization = {
    effect,
    reasons: normalizedReasons,
    obligations,
    redact: effect === "PERMIT" ? undefined : redaction,
    dto,
    visibility: visibility.visibility,
    metrics,
  };

  telemetry?.onEvaluate("authorizeViewMoment", decision.effect, {
    visibility: decision.visibility,
    policySnapshotId: policySnapshotId ?? null,
  });

  return decision;
}

function dedupeObligations(...groups: Array<readonly Obligation[] | undefined>): Obligation[] | undefined {
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
