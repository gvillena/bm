import type { ViewerContext } from "@bm/policies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../base/Select.js";
import { Card, CardContent, CardHeader, CardTitle } from "../base/Card.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export type GuardOutcome = "PERMIT" | "REDACT" | "NONE";

export interface SimulatorField {
  readonly id: string;
  readonly label: string;
  readonly outcome: GuardOutcome;
}

export interface ERDSimulatorProps {
  readonly fields: SimulatorField[];
  readonly viewerContext: ViewerContext;
  readonly onOutcomeChange?: (fieldId: string, outcome: GuardOutcome) => void;
}

const OPTIONS: GuardOutcome[] = ["PERMIT", "REDACT", "NONE"];

export function ERDSimulator({ fields, viewerContext, onOutcomeChange }: ERDSimulatorProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <p className="text-sm font-medium text-foreground">{sanitizeRichText(field.label)}</p>
              <Select
                value={sanitizeRichText(field.outcome)}
                onValueChange={(value) => onOutcomeChange?.(field.id, value as GuardOutcome)}
              >
                <SelectTrigger aria-label={`Outcome for ${sanitizeRichText(field.label)}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Viewer context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground/70">
          <p>
            <strong>Role:</strong> {sanitizeRichText(viewerContext.role)}
          </p>
          <p>
            <strong>Tier:</strong> {sanitizeRichText(viewerContext.tier)}
          </p>
          {viewerContext.relation ? (
            <p>
              <strong>Relation:</strong> {sanitizeRichText(viewerContext.relation)}
            </p>
          ) : null}
          {fields.map((field) => (
            <div key={field.id} className="rounded-md border border-foreground/10 p-3">
              <p className="text-sm font-medium">{sanitizeRichText(field.label)}</p>
              <p className="text-xs uppercase text-foreground/60">{sanitizeRichText(field.outcome)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
