import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveAccessRequirement,
  resolveVisibilityPolicy,
  canViewMoment,
  canInvite,
  canEditAgreement,
  resolveIntimacyFrame,
} from "../dist/index.js";

const baseViewer = {
  role: "viewer",
  tier: "CIRCLE",
  relation: "invited",
  reciprocityScore: "mid",
  careScore: "mid",
  consentState: "valid",
  verificationLevel: 1,
};

test("evalúa requisitos de acceso restringiendo por tier y verificación", () => {
  const evaluation = resolveAccessRequirement(baseViewer, {
    minTier: "ALQUIMIA",
    minVerificationLevel: 2,
  });

  assert.equal(evaluation.allowed, false);
  const codes = evaluation.reasons.map((reason) => reason.code);
  assert(codes.includes("VISIBILITY_TIER_REQUIRED"));
  assert(codes.includes("VERIFICATION_REQUIRED"));
  assert.equal(evaluation.obligations?.[0]?.code, "CHECK_VERIFICATION_LEVEL");
});

test("permite visibilidad completa cuando se cumplen requisitos", () => {
  const viewer = { ...baseViewer, tier: "SUPER_ALQUIMIA", relation: "approved", verificationLevel: 2 };
  const moment = {
    id: "moment-1",
    teaser: "Teaser",
    details: "Detalles",
    visibility: "INVITE_ONLY",
  };

  const resolution = resolveVisibilityPolicy(viewer, moment);
  assert.equal(resolution.visibility, "full");
  assert(resolution.fields.includes("details"));
});

test("redacta a teaser para invitades sin aprobación", () => {
  const moment = {
    id: "moment-2",
    teaser: "Teaser",
    details: "Detalles",
    visibility: "INVITE_ONLY",
    accessRequirements: { invitationRequired: true },
  };

  const result = canViewMoment(baseViewer, moment);
  assert.equal(result.level, "teaser");
  assert.deepEqual(result.fields, ["id", "teaser", "visibility"]);
});

test("bloquea invitaciones cuando hay cooldown activo", () => {
  const now = new Date("2024-01-02T00:00:30Z");
  const viewer = { ...baseViewer, reciprocityScore: "low" };

  const evaluation = canInvite(
    viewer,
    {
      pendingInvites: 1,
      maxInvites: 1,
      cooldownMs: 60000,
      lastInviteAt: new Date("2024-01-02T00:00:10Z"),
      momentTierRequired: "ALQUIMIA",
      requireCareScore: "high",
    },
    now,
  );

  assert.equal(evaluation.allowed, false);
  const codes = new Set(evaluation.reasons.map((reason) => reason.code));
  [
    "INVITE_LIMIT_REACHED",
    "INVITE_COOLDOWN_ACTIVE",
    "INVITE_TIER_REQUIRED",
    "CARE_REQUIRED",
    "RECIPROCITY_REQUIRED",
  ].forEach((code) => assert(codes.has(code)));
  assert.equal(evaluation.obligations, undefined);
});

test("autoriza edición de acuerdo para dueñe con consentimiento válido", () => {
  const viewer = { ...baseViewer, userId: "user-1", role: "owner" };
  const agreement = {
    id: "agr-1",
    ownerId: "user-1",
    state: "draft",
    consentState: "valid",
  };

  const evaluation = canEditAgreement(viewer, agreement);
  assert.equal(evaluation.allowed, true);
});

test("bloquea intimidad cuando el consentimiento está pendiente", () => {
  const viewer = { ...baseViewer, consentState: "stale", emotionalState: "stressed" };
  const moment = {
    id: "moment-3",
    teaser: "Teaser",
    visibility: "PUBLIC",
    intimacy: { possible: true },
    gating: { requireEmotionalMatch: true },
  };

  const resolution = resolveIntimacyFrame(viewer, moment);
  const codes = new Set(resolution.reasons.map((reason) => reason.code));
  assert.equal(resolution.show, false);
  ["CONSENT_REQUIRED", "EMOTIONAL_STATE_STRESSED", "EMOTIONAL_MATCH_REQUIRED"].forEach((code) =>
    assert(codes.has(code)),
  );
  assert.equal(resolution.obligations?.[0]?.code, "CONFIRM_CONSENT_SERVER");
});
