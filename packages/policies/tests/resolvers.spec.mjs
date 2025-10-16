import test from "node:test";
import assert from "node:assert/strict";
import {
  authorizeViewMoment,
  authorizeInvite,
  authorizeEditAgreement,
  applyRedaction,
} from "../dist/index.js";

const baseMoment = {
  id: "moment-10",
  teaser: "Cuidarnos en presente",
  details: "Detalles profundos",
  intimacy: { possible: true },
  visibility: "INVITE_ONLY",
  accessRequirements: {
    invitationRequired: true,
  },
};

test("retorna PERMIT y DTO completo para dueñe", () => {
  const viewer = {
    userId: "user-1",
    role: "owner",
    tier: "SUPER_ALQUIMIA",
    relation: "approved",
    consentState: "valid",
  };

  const telemetryCalls = [];
  const telemetry = { onEvaluate: (...args) => telemetryCalls.push(args) };
  const decision = authorizeViewMoment({ viewerContext: viewer, resource: baseMoment, now: new Date() }, telemetry);

  assert.equal(decision.effect, "PERMIT");
  assert.equal(decision.dto?.details, "Detalles profundos");
  assert.equal(decision.redact, undefined);
  assert.equal(telemetryCalls[0][0], "authorizeViewMoment");
  assert.equal(telemetryCalls[0][1], "PERMIT");
});

test("retorna REDACT para invitade sin aprobación", () => {
  const viewer = {
    role: "viewer",
    tier: "FREE",
    relation: "invited",
    consentState: "valid",
  };

  const decision = authorizeViewMoment({ viewerContext: viewer, resource: baseMoment, now: new Date() });
  assert.equal(decision.effect, "REDACT");
  assert.equal(decision.dto?.teaser, baseMoment.teaser);
  assert.equal(decision.dto?.details, undefined);
  assert.deepEqual(decision.redact?.allow, ["id", "teaser", "visibility"]);
});

test("retorna DENY cuando falta invitación", () => {
  const viewer = {
    role: "viewer",
    tier: "FREE",
    relation: "none",
    consentState: "missing",
  };

  const decision = authorizeViewMoment({ viewerContext: viewer, resource: baseMoment, now: new Date() });
  assert.equal(decision.effect, "DENY");
  assert.equal(decision.dto, undefined);
  assert(decision.reasons.map((reason) => reason.code).includes("INVITATION_REQUIRED"));
});

test("autoriza invitación cuando se cumplen límites", () => {
  const viewer = {
    role: "participant",
    tier: "ALQUIMIA",
    relation: "approved",
    consentState: "valid",
    reciprocityScore: "mid",
    careScore: "mid",
  };

  const telemetryCalls = [];
  const telemetry = { onEvaluate: (...args) => telemetryCalls.push(args) };
  const decision = authorizeInvite(
    {
      viewerContext: viewer,
      resource: { moment: baseMoment, invite: { maxInvites: 5, pendingInvites: 0 } },
      now: new Date(),
    },
    telemetry,
  );

  assert.equal(decision.effect, "PERMIT");
  assert(decision.reasons.some((reason) => reason.code === "OK"));
  assert.equal(telemetryCalls[0][0], "authorizeInvite");
  assert.equal(telemetryCalls[0][1], "PERMIT");
});

test("deniega edición cuando acuerdo está archivado", () => {
  const viewer = {
    userId: "user-2",
    role: "viewer",
    tier: "FREE",
    consentState: "stale",
  };

  const agreement = {
    id: "agr-2",
    ownerId: "user-1",
    state: "archived",
    consentState: "missing",
    requiresFreshConsent: true,
  };

  const decision = authorizeEditAgreement({ viewerContext: viewer, resource: agreement, now: new Date() });
  assert.equal(decision.effect, "DENY");
  assert(decision.obligations?.some((obligation) => obligation.code === "CONFIRM_CONSENT_SERVER"));
});

test("aplica redacción respetando whitelist", () => {
  const dto = applyRedaction({ id: "1", secret: "no", teaser: "sí" }, { allow: ["id", "teaser"] });
  assert.deepEqual(dto, { id: "1", teaser: "sí" });
});
