import type { Decision } from "@bm/policies";
import type { RuntimeCtx } from "../src/presence/types.js";
import { PresenceController } from "../src/presence/controller.js";
import { PresenceBudget } from "../src/presence/budget.js";
import { defaultGuardrails } from "../src/policies/guardrails.js";
import { COPY } from "../src/prompts/system-copy.js";

const viewerContext = {
  role: "owner" as const,
  tier: "FREE" as const,
  emotionalState: "calm" as const
};

const baseDecision: Decision = {
  effect: "REDACT",
  reasons: [],
  obligations: []
};

describe("PresenceController", () => {
  it("emits directives on redact decisions when entering a node", () => {
    const budget = new PresenceBudget({ perMinute: 3, perNode: 1, backoffMs: 5_000 });
    const controller = new PresenceController({ budget, guardrails: defaultGuardrails });
    const ctx: RuntimeCtx = {
      viewerContext,
      nodeId: "node-1",
      policyDecision: baseDecision
    };

    const directives = controller.onRuntimeEvent(
      { type: "didEnter", payload: { nodeId: "node-1" }, timestamp: Date.now() },
      ctx
    );

    expect(directives === null).toBe(false);
    expect(directives?.actions?.some((action) => action.label === COPY.actions.requestAccess)).toBe(true);
    expect(directives?.actions?.some((action) => action.label === COPY.actions.invite)).toBe(true);
  });

  it("enforces presence budget for repeated interventions", () => {
    const budget = new PresenceBudget({ perMinute: 3, perNode: 1, backoffMs: 5_000 });
    const controller = new PresenceController({ budget, guardrails: defaultGuardrails });
    const ctx: RuntimeCtx = {
      viewerContext,
      nodeId: "node-2",
      policyDecision: baseDecision
    };
    const event = { type: "didEnter" as const, payload: { nodeId: "node-2" }, timestamp: 10 };

    const first = controller.onRuntimeEvent(event, ctx);
    const second = controller.onRuntimeEvent({ ...event, timestamp: 12 }, ctx);

    expect(first === null).toBe(false);
    expect(second).toBe(null);
  });
});
