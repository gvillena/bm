import { Button } from "../base/Button.js";
import { Card } from "../base/Card.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 border border-foreground/10 bg-background/80 p-8 text-center">
      <p className="text-lg font-semibold text-foreground">{sanitizeRichText(title)}</p>
      <p className="text-sm text-foreground/60">{sanitizeRichText(description)}</p>
      {actionLabel ? (
        <Button variant="primary" onClick={onAction}>
          {sanitizeRichText(actionLabel)}
        </Button>
      ) : null}
    </Card>
  );
}
