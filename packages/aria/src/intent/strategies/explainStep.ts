import { formatCopy } from "../../prompts/formatter.js";
import { COPY } from "../../prompts/system-copy.js";
import type { IntentStrategy } from "../types.js";

export const explainStep: IntentStrategy = {
  intent: "explainStep",
  handle(context) {
    const base = formatCopy(["explainStep", "default"]);
    const consent = context.viewerContext.consentState === "stale" ? COPY.explainStep.consentReminder : undefined;
    const hints = [base.text];
    if (consent) {
      hints.push(consent);
    }
    const tone = context.viewerContext.emotionalState === "stressed" ? "protective" : "neutral";
    return {
      hints,
      actions: consent
        ? [
            {
              label: COPY.consent.confirmAction,
              actionRef: { name: "openConsentReview", params: { nodeId: context.node.id } },
              kind: "primary",
              requiresConsent: true
            }
          ]
        : undefined,
      tone,
      explain: base.text
    };
  }
};
