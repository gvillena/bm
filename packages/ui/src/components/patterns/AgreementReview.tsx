import type { AgreementDiff } from "@bm/sdk";
import { sanitizeRichText } from "../../utils/sanitize.js";
import { Button } from "../base/Button.js";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../base/Card.js";

export interface AgreementComment {
  readonly id: string;
  readonly author: string;
  readonly text: string;
}

export interface AgreementReviewProps {
  readonly title: string;
  readonly diff: AgreementDiff;
  readonly comments?: AgreementComment[];
  readonly onSubmit?: () => void;
  readonly onApprove?: () => void;
  readonly onSign?: () => void;
  readonly actionLabels?: {
    submit?: string;
    approve?: string;
    sign?: string;
  };
}

export function AgreementReview({
  title,
  diff,
  comments = [],
  onSubmit,
  onApprove,
  onSign,
  actionLabels
}: AgreementReviewProps) {
  return (
    <Card className="grid gap-6 lg:grid-cols-[2fr,1fr]" aria-label={title}>
      <div className="lg:border-r lg:border-foreground/10">
        <CardHeader>
          <CardTitle>{sanitizeRichText(title)}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {diff.fields.map((field) => (
            <div key={field.field} className="space-y-2">
              <p className="text-xs uppercase text-foreground/60">{field.field}</p>
              <div className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm" aria-label="Previous value">
                {sanitizeRichText(String(field.from ?? "—"))}
              </div>
              <div className="rounded-md border border-accent/30 bg-accent/5 p-3 text-sm" aria-label="Proposed value">
                {sanitizeRichText(String(field.to ?? "—"))}
              </div>
            </div>
          ))}
        </CardContent>
      </div>
      <div className="flex flex-col justify-between gap-4">
        <CardContent className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground/80">Comments</h3>
          <ul className="space-y-3" aria-label="Review comments">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-md border border-foreground/10 p-3 text-sm">
                <p className="font-medium">{sanitizeRichText(comment.author)}</p>
                <p className="text-foreground/70">{sanitizeRichText(comment.text)}</p>
              </li>
            ))}
            {comments.length === 0 ? (
              <li className="text-sm text-foreground/50">No comments yet.</li>
            ) : null}
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {onSubmit ? (
            <Button variant="secondary" onClick={onSubmit}>
              {actionLabels?.submit ?? "Submit for review"}
            </Button>
          ) : null}
          {onApprove ? (
            <Button variant="primary" onClick={onApprove}>
              {actionLabels?.approve ?? "Approve"}
            </Button>
          ) : null}
          {onSign ? (
            <Button variant="danger" onClick={onSign}>
              {actionLabels?.sign ?? "Sign"}
            </Button>
          ) : null}
        </CardFooter>
      </div>
    </Card>
  );
}
