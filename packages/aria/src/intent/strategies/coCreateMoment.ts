import { formatCopy, mergePrompts } from "../../prompts/formatter.js";
import { COPY } from "../../prompts/system-copy.js";
import type { IntentStrategy } from "../types.js";

export const coCreateMoment: IntentStrategy = {
  intent: "coCreateMoment",
  handle(context) {
    const starter = formatCopy(["coCreate", "starter"]);
    const structure = formatCopy(["coCreate", "structure"]);
    const explain = mergePrompts([starter, structure]);
    return {
      hints: [starter.text, structure.text],
      actions: [
        {
          label: COPY.actions.invite,
          actionRef: { name: "openInviteDialog", params: { nodeId: context.node.id } },
          kind: "primary"
        }
      ],
      tone: context.aura === "calm" ? "warm" : "neutral",
      explain: explain.text
    };
  }
};
