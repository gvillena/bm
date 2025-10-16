import { intentRegistry } from "../src/intent/registry.js";
import type { IntentContext } from "../src/intent/types.js";

const baseContext: IntentContext = {
  viewerContext: {
    role: "owner",
    tier: "FREE",
    emotionalState: "calm"
  },
  node: {
    id: "moment-1",
    kind: "moment"
  },
  aura: "calm",
  level: "standard"
};

describe("Intent strategies", () => {
  it("coCreateMoment returns hints and invite action", () => {
    const directives = intentRegistry.coCreateMoment.handle(baseContext);
    expect(directives.hints?.length).toBeGreaterThan(0);
    expect(directives.actions?.some((action) => action.actionRef.name === "openInviteDialog")).toBe(true);
  });

  it("safeIntervention provides pause and resources actions", () => {
    const directives = intentRegistry.safeIntervention.handle({
      ...baseContext,
      level: "immersive"
    });
    const actionNames = directives.actions?.map((action) => action.actionRef.name) ?? [];
    expect(actionNames).toContain("pauseExperience");
    expect(actionNames).toContain("openSupportResources");
    expect(directives.ephemeral).toBe(true);
  });
});
