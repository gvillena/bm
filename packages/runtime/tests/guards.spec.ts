import { describe, it, expect } from "vitest";
import { createGuardNodeAccess } from "../src/guards/guardNodeAccess.js";
import { createGuardActionPolicy } from "../src/guards/guardActionPolicy.js";
import type { PoliciesAdapter, PolicyDecisionResult } from "../src/integration/policies.adapter.js";
import type { GuardExecutionContext } from "../src/graph/types.js";

const baseContext: GuardExecutionContext & { viewerContext: unknown } = {
  graph: { id: "demo", version: "1", start: "a", nodes: {} },
  currentNode: { id: "a", kind: "view", transitions: [] },
  viewerContext: { id: "viewer" },
};

const createPolicies = (result: PolicyDecisionResult): PoliciesAdapter => ({
  authorizeViewMoment: async () => result,
  authorizeEditAgreement: async () => result,
  evaluateGuard: async () => result,
});

describe("guards", () => {
  it("propagates PERMIT decisions", async () => {
    const guard = createGuardNodeAccess(createPolicies({ decision: "PERMIT" }));
    const outcome = await guard(baseContext);
    expect(outcome.decision).toBe("PERMIT");
  });

  it("propagates REDACT decisions with dto", async () => {
    const guard = createGuardNodeAccess(createPolicies({ decision: "REDACT", dto: { safe: true } }));
    const outcome = await guard(baseContext);
    expect(outcome.decision).toBe("REDACT");
    expect(outcome.redactedDto).toEqual({ safe: true });
  });

  it("denies missing action", async () => {
    const guard = createGuardActionPolicy(createPolicies({ decision: "PERMIT" }));
    const outcome = await guard({ ...baseContext, params: {} });
    expect(outcome.decision).toBe("DENY");
    expect(outcome.reasons?.[0]?.code).toBe("missing-action");
  });

  it("propagates obligations", async () => {
    const guard = createGuardActionPolicy(createPolicies({ decision: "PERMIT", obligations: ["CONFIRM_CONSENT_SERVER"] }));
    const outcome = await guard({ ...baseContext, params: { action: "confirmConsent" } });
    expect(outcome.obligations).toContain("CONFIRM_CONSENT_SERVER");
  });
});
