import { COPY } from "../../prompts/system-copy.js";
import { formatCopy } from "../../prompts/formatter.js";
import type { IntentStrategy } from "../types.js";

export const reviewLimits: IntentStrategy = {
  intent: "reviewLimits",
  handle(context) {
    const summary = formatCopy(["reviewLimits", "summary"]);
    const checklist = formatCopy(["reviewLimits", "checklist"]);
    return {
      hints: [summary.text, checklist.text],
      actions: [
        {
          label: COPY.actions.requestAccess,
          actionRef: { name: "openVisibilitySettings", params: { nodeId: context.node.id } },
          kind: "secondary"
        }
      ],
      tone: context.aura === "clear" ? "direct" : "neutral",
      explain: summary.text
    };
  }
};
