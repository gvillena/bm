import { useId, useState } from "react";
import { Button } from "../base/Button.js";
import { Textarea } from "../base/Textarea.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface InlineFeedbackValue {
  readonly sentiment: "positive" | "negative";
  readonly comment?: string;
}

export interface InlineFeedbackProps {
  readonly label: string;
  readonly onSubmit?: (value: InlineFeedbackValue) => void;
  readonly submittingLabel?: string;
  readonly commentPlaceholder?: string;
  readonly sendLabel?: string;
}

export function InlineFeedback({ label, onSubmit, submittingLabel = "Submitting…", commentPlaceholder = "Add an optional comment", sendLabel = "Send" }: InlineFeedbackProps) {
  const [sentiment, setSentiment] = useState<InlineFeedbackValue["sentiment"] | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formId = useId();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sentiment || !onSubmit) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ sentiment, comment: comment.trim() || undefined });
      setComment("");
      setSentiment(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form aria-labelledby={formId} className="space-y-3" onSubmit={handleSubmit}>
      <div id={formId} className="text-sm font-medium">
        {sanitizeRichText(label)}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={sentiment === "positive" ? "primary" : "ghost"}
          aria-pressed={sentiment === "positive"}
          onClick={() => setSentiment("positive")}
        >
          👍
          <span className="sr-only">Positive</span>
        </Button>
        <Button
          type="button"
          variant={sentiment === "negative" ? "danger" : "ghost"}
          aria-pressed={sentiment === "negative"}
          onClick={() => setSentiment("negative")}
        >
          👎
          <span className="sr-only">Negative</span>
        </Button>
      </div>
      <Textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={sanitizeRichText(commentPlaceholder)}
        aria-label="Feedback comment"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!sentiment || submitting}>
          {submitting ? sanitizeRichText(submittingLabel) : sanitizeRichText(sendLabel)}
        </Button>
      </div>
    </form>
  );
}
