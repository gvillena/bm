import test from "node:test";
import assert from "node:assert/strict";
import { evaluateERD } from "../dist/index.js";

test("rellena valores por defecto cuando faltan señales", () => {
  const ctx = {
    role: "viewer",
    tier: "FREE",
  };

  assert.deepEqual(evaluateERD(ctx), {
    plan: "FREE",
    reciprocity: "low",
    care: "low",
    emotion: "unknown",
    consent: "missing",
  });
});

test("respeta señales explícitas del contexto", () => {
  const ctx = {
    role: "participant",
    tier: "ALQUIMIA",
    reciprocityScore: "high",
    careScore: "mid",
    emotionalState: "calm",
    consentState: "valid",
  };

  assert.deepEqual(evaluateERD(ctx), {
    plan: "ALQUIMIA",
    reciprocity: "high",
    care: "mid",
    emotion: "calm",
    consent: "valid",
  });
});
