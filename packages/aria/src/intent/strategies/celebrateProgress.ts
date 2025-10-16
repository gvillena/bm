import { COPY } from "../../prompts/system-copy.js";
import type { IntentStrategy } from "../types.js";

export const celebrateProgress: IntentStrategy = {
  intent: "celebrateProgress",
  handle(context) {
    const hints: string[] = [COPY.celebrate.gentle];
    if (context.viewerContext.relation === "approved") {
      hints.push(COPY.celebrate.shareOption);
    }
    return {
      hints,
      actions:
        context.viewerContext.relation === "approved"
          ? [
              {
                label: COPY.celebrate.shareOption,
                actionRef: { name: "openShareMoment", params: { nodeId: context.node.id } },
                kind: "secondary"
              }
            ]
          : undefined,
      tone: context.aura === "calm" ? "warm" : "neutral",
      explain: COPY.celebrate.gentle,
      ephemeral: true
    };
  }
};
