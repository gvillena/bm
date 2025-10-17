import { useConfirmConsent } from "@bm/sdk";
import { Button } from "../base/Button.js";
import { Card } from "../base/Card.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface ConsentBannerProps {
  readonly message: string;
  readonly consentEvent: {
    readonly event: string;
    readonly subjectId: string;
    readonly momentId?: string;
    readonly agreementId?: string;
  };
  readonly confirmLabel?: string;
  readonly dismissLabel?: string;
  readonly onDismiss?: () => void;
}

export function ConsentBanner({
  message,
  consentEvent,
  confirmLabel = "Confirm consent",
  dismissLabel = "Not now",
  onDismiss
}: ConsentBannerProps) {
  const mutation = useConfirmConsent();

  return (
    <Card className="flex flex-col gap-3 border border-accent/30 bg-accent/5 p-4 text-sm text-foreground">
      <p>{sanitizeRichText(message)}</p>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => mutation.mutate(consentEvent)}
          disabled={mutation.isPending}
        >
          {sanitizeRichText(confirmLabel)}
        </Button>
        <Button variant="ghost" onClick={onDismiss}>
          {sanitizeRichText(dismissLabel)}
        </Button>
      </div>
    </Card>
  );
}
