import { describe, it, expect } from "vitest";
import { ExperienceEngine } from "../src/graph/engine.js";
import type { SceneFlowGraph } from "../src/graph/types.js";
import { createPermitDecision, type PoliciesAdapter } from "../src/integration/policies.adapter.js";

const policies: PoliciesAdapter = {
  authorizeViewMoment: async () => createPermitDecision(),
  authorizeEditAgreement: async () => createPermitDecision(),
  evaluateGuard: async () => createPermitDecision(),
};

describe("runtime properties", () => {
  const graph: SceneFlowGraph = {
    id: "property",
    version: "1",
    start: "start",
    nodes: {
      start: { id: "start", kind: "view", transitions: [{ to: "end" }] },
      end: { id: "end", kind: "view", transitions: [] },
    },
  };

  const randomStrings = (seed: number, count: number): string[] => {
    let value = seed;
    const results: string[] = [];
    for (let i = 0; i < count; i += 1) {
      value = (value * 9301 + 49297) % 233280;
      results.push(`node-${value}`);
    }
    return results;
  };

  it("never transitions to unknown nodes", async () => {
    const engine = new ExperienceEngine({
      graph,
      context: { viewerContext: { id: "viewer" }, now: () => Date.now() },
      policies,
    });

    for (const target of randomStrings(42, 20)) {
      if (target === "start" || target === "end") continue;
      const result = await engine.transition(target);
      if (result.ok) {
        throw new Error("Unexpected success for invalid node");
      }
      expect(result.recoverable).toBe(false);
      expect(engine.getState().currentNodeId).toBe("start");
    }
  });

  it("is idempotent when transitions are aborted", async () => {
    const engine = new ExperienceEngine({
      graph,
      context: { viewerContext: { id: "viewer" }, now: () => Date.now() },
      policies,
    });

    const scenarios = [true, false, true, true, false];
    for (const shouldAbort of scenarios) {
      const abortController = new AbortController();
      if (shouldAbort) {
        abortController.abort();
      }
      const before = engine.getState();
      const result = await engine.transition("end", { signal: abortController.signal });
      if (shouldAbort) {
        if (result.ok) {
          throw new Error("Transition should not succeed when aborted");
        }
        expect(result.recoverable).toBe(true);
        expect(engine.getState()).toEqual(before);
      } else {
        expect(result.ok).toBe(true);
        engine.reset(true);
      }
    }
  });
});
