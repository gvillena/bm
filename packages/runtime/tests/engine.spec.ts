import { describe, it, expect } from "vitest";
import { ExperienceEngine, GuardDenyError } from "../src/graph/engine.js";
import type { SceneFlowGraph } from "../src/graph/types.js";
import type { PoliciesAdapter, PolicyDecisionResult } from "../src/integration/policies.adapter.js";
import { createPermitDecision } from "../src/integration/policies.adapter.js";

const createPolicies = (overrides?: Partial<PoliciesAdapter>): PoliciesAdapter => ({
  authorizeViewMoment: async () => createPermitDecision(),
  authorizeEditAgreement: async () => createPermitDecision(),
  evaluateGuard: async (name, input) =>
    overrides?.evaluateGuard?.(name, input) ?? createPermitDecision(),
  ...overrides,
});

describe("ExperienceEngine", () => {
  const graph: SceneFlowGraph = {
    id: "demo",
    version: "1.0.0",
    start: "start",
    nodes: {
      start: {
        id: "start",
        kind: "view",
        transitions: [{ to: "middle" }],
      },
      middle: {
        id: "middle",
        kind: "form",
        transitions: [{ to: "end", condition: { name: "allow" } }],
      },
      end: {
        id: "end",
        kind: "aria",
        transitions: [],
      },
    },
  };

  it("transitions through nodes when guards permit", async () => {
    const engine = new ExperienceEngine({
      graph,
      context: { viewerContext: { id: "viewer" }, now: () => Date.now() },
      policies: createPolicies({
        evaluateGuard: async () => createPermitDecision(),
      }),
    });

    const first = await engine.transition("middle");
    expect(first.ok).toBe(true);
    expect(engine.getState().currentNodeId).toBe("middle");

    const second = await engine.transition("end");
    expect(second.ok).toBe(true);
    expect(engine.getState().currentNodeId).toBe("end");
  });

  it("returns recoverable error when guard denies", async () => {
    const engine = new ExperienceEngine({
      graph,
      context: { viewerContext: { id: "viewer" }, now: () => Date.now() },
      policies: createPolicies({
        evaluateGuard: async (name) => {
          if (name === "allow") {
            return { decision: "DENY", reasons: [{ code: "blocked", message: "Policy denied" }] } satisfies PolicyDecisionResult;
          }
          return createPermitDecision();
        },
      }),
    });

    await engine.transition("middle");
    const result = await engine.transition("end");
    if (result.ok) {
      throw new Error("Expected guard denial");
    }
    expect(result.recoverable).toBe(true);
    expect(result.error).toBeInstanceOf(GuardDenyError);
    expect(result.error.meta?.reasons?.[0]?.code).toBe("blocked");
  });
});
