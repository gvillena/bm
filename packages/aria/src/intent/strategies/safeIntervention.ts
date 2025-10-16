import { COPY } from "../../prompts/system-copy.js";
import type { IntentStrategy } from "../types.js";

export const safeIntervention: IntentStrategy = {
  intent: "safeIntervention",
  handle(context) {
    return {
      hints: [COPY.safe.offerPause, COPY.safe.escalate],
      actions: [
        {
          label: COPY.actions.pause,
          actionRef: { name: "pauseExperience", params: { nodeId: context.node.id } },
          kind: "primary"
        },
        {
          label: COPY.actions.viewResources,
          actionRef: { name: "openSupportResources", params: { nodeId: context.node.id } },
          kind: "secondary"
        }
      ],
      tone: "protective",
      explain: COPY.safe.offerPause,
      ephemeral: context.level === "immersive"
    };
  }
};
