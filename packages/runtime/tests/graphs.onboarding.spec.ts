import { describe, it, expect, vi } from "vitest";
import { OnboardingGraph } from "../src/graph/registry.js";
import { ExperienceEngine } from "../src/graph/engine.js";
import type { PoliciesAdapter, PolicyDecisionResult } from "../src/integration/policies.adapter.js";

const permit = { decision: "PERMIT" } satisfies PolicyDecisionResult;

describe("Onboarding graph", () => {
  const viewerContext = { id: "viewer-1" };

  const createPolicies = (): PoliciesAdapter => ({
    authorizeViewMoment: vi.fn(async () => permit),
    authorizeEditAgreement: vi.fn(async () => ({ decision: "PERMIT", obligations: ["CONFIRM_CONSENT_SERVER"] })),
    evaluateGuard: vi.fn(async () => permit),
  });

  it("evaluates view moment policy before review", async () => {
    const policies = createPolicies();
    const engine = new ExperienceEngine({
      graph: OnboardingGraph,
      context: { viewerContext, now: () => Date.now() },
      policies,
    });

    await engine.transition("moment");
    expect(policies.authorizeViewMoment).toHaveBeenCalledTimes(1);

    await engine.transition("visibility");
    const consentResult = await engine.transition("consent");
    expect(consentResult.ok).toBe(true);
    if (consentResult.ok) {
      expect(consentResult.obligations).toContain("CONFIRM_CONSENT_SERVER");
    }
    expect(policies.authorizeEditAgreement).toHaveBeenCalledTimes(1);

    const reviewResult = await engine.transition("review");
    expect(reviewResult.ok).toBe(true);
    expect(engine.getState().currentNodeId).toBe("review");
  });
});
