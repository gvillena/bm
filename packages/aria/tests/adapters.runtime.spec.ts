import type { Decision } from "@bm/policies";
import { PresenceBudget } from "../src/presence/budget.js";
import { PresenceController } from "../src/presence/controller.js";
import { defaultGuardrails } from "../src/policies/guardrails.js";
import { createRuntimeAdapter } from "../src/adapters/runtime.adapter.js";
import { COPY } from "../src/prompts/system-copy.js";

const viewerContext = {
  role: "owner" as const,
  tier: "FREE" as const,
  emotionalState: "calm" as const
};

describe("Runtime adapter", () => {
  it("translates guard deny events into consent actions", () => {
    const decision: Decision = {
      effect: "DENY",
      reasons: [],
      obligations: [{ code: "CONFIRM_CONSENT_SERVER" }]
    };
    const controller = new PresenceController({
      budget: new PresenceBudget({ perMinute: 5, perNode: 3, backoffMs: 10_000 }),
      guardrails: defaultGuardrails
    });

    const adapter = createRuntimeAdapter(controller);
    const directives = adapter(
      {
        type: "guard",
        payload: { nodeId: "node-x", guardId: "consent-check", outcome: "deny" },
        timestamp: Date.now()
      },
      {
        viewerContext,
        nodeId: "node-x",
        policyDecision: decision
      }
    );

    expect(directives === null).toBe(false);
    expect((directives?.hints?.some((hint) => hint.includes(COPY.consent.needConfirm))) ?? false).toBe(true);
    expect(directives?.actions?.some((action) => action.label === COPY.consent.confirmAction)).toBe(true);
  });
});
