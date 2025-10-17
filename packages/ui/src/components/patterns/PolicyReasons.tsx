import type { Obligation, Reason } from "@bm/policies";
import { sanitizeRichText } from "../../utils/sanitize.js";
import { Button } from "../base/Button.js";
import { Card, CardContent, CardHeader, CardTitle } from "../base/Card.js";

export interface PolicyReasonsProps {
  readonly reasons: Reason[];
  readonly obligations?: Obligation[];
  readonly onConfirmObligation?: (obligation: Obligation) => void;
  readonly confirmLabel?: string;
}

export function PolicyReasons({
  reasons,
  obligations = [],
  onConfirmObligation,
  confirmLabel = "Confirm on server"
}: PolicyReasonsProps) {
  return (
    <Card className="space-y-4 border border-danger/30 bg-danger/5 p-4">
      <CardHeader>
        <CardTitle className="text-danger">Policy reasons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-foreground/80">
        <ul className="space-y-2" aria-label="Policy reasons">
          {reasons.map((reason) => (
            <li key={reason.code} className="rounded-md border border-danger/20 bg-danger/10 p-3">
              <p className="font-medium">{reason.code}</p>
              {reason.detail ? <p>{sanitizeRichText(reason.detail)}</p> : null}
            </li>
          ))}
        </ul>
        {obligations.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Obligations</p>
            <ul className="space-y-2" aria-label="Policy obligations">
              {obligations.map((obligation) => (
                <li key={obligation.code} className="rounded-md border border-foreground/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{obligation.code}</p>
                      {obligation.params ? (
                        <pre className="mt-1 whitespace-pre-wrap text-xs text-foreground/60">
                          {JSON.stringify(obligation.params, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                    {onConfirmObligation ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onConfirmObligation(obligation)}
                      >
                        {sanitizeRichText(confirmLabel)}
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
