import type { DecisionEffect, Obligation, Reason } from "@bm/policies";
import { Badge } from "../base/Badge.js";
import { PolicyReasons } from "../patterns/PolicyReasons.js";

export interface GuardOutcomeProps {
  readonly effect: DecisionEffect;
  readonly reasons?: Reason[];
  readonly obligations?: Obligation[];
  readonly onConfirmObligation?: (obligation: Obligation) => void;
}

const EFFECT_LABELS: Record<DecisionEffect, string> = {
  PERMIT: "Permit",
  DENY: "Deny",
  REDACT: "Redact"
};

export function GuardOutcome({ effect, reasons, obligations, onConfirmObligation }: GuardOutcomeProps) {
  if (effect === "DENY") {
    return <PolicyReasons reasons={reasons ?? []} obligations={obligations} onConfirmObligation={onConfirmObligation} />;
  }

  return (
    <div className="rounded-md border border-foreground/10 bg-foreground/5 p-4">
      <Badge variant={effect === "REDACT" ? "danger" : "default"}>{EFFECT_LABELS[effect]}</Badge>
      {effect === "REDACT" ? (
        <p className="mt-2 text-sm text-foreground/70">Some data has been redacted for safety.</p>
      ) : null}
    </div>
  );
}
