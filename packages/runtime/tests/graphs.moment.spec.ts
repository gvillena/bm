import { describe, it, expect, vi } from "vitest";
import { ExperienceEngine } from "../src/graph/engine.js";
import type { SceneFlowGraph } from "../src/graph/types.js";
import type { PoliciesAdapter, PolicyDecisionResult } from "../src/integration/policies.adapter.js";
import type { EffectsAdapter } from "../src/actions/effects.js";

const permit = { decision: "PERMIT" } satisfies PolicyDecisionResult;

describe("Moment graph", () => {
  const graph: SceneFlowGraph = {
    id: "moment",
    version: "1",
    start: "draft",
    nodes: {
      draft: { id: "draft", kind: "form", transitions: [{ to: "edit" }] },
      edit: {
        id: "edit",
        kind: "form",
        transitions: [
          {
            to: "persist",
            condition: { name: "guardActionPolicy", params: { action: "saveMomentDraft" } },
            action: { name: "saveMomentDraft" },
          },
        ],
      },
      persist: { id: "persist", kind: "service", transitions: [] },
    },
  };

  const createPolicies = (): PoliciesAdapter => ({
    authorizeViewMoment: vi.fn(async () => permit),
    authorizeEditAgreement: vi.fn(async () => permit),
    evaluateGuard: vi.fn(async () => permit),
  });

  it("requires policy approval before executing effect", async () => {
    const policies = createPolicies();
    const effects: EffectsAdapter = {
      execute: vi.fn(async () => ({ ui: { hints: ["saved"] } })),
    };

    const engine = new ExperienceEngine({
      graph,
      context: { viewerContext: { id: "viewer" }, now: () => Date.now() },
      policies,
      effects,
    });

    await engine.transition("edit");
    const result = await engine.transition("persist");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.ui?.hints).toContain("saved");
    }
    expect(policies.authorizeEditAgreement).toHaveBeenCalledTimes(1);
    expect(effects.execute).toHaveBeenCalledTimes(1);
  });
});
