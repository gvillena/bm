import { Badge } from "../base/Badge.js";
import { Button } from "../base/Button.js";
import { Card } from "../base/Card.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface SafeModeBannerProps {
  readonly title: string;
  readonly message: string;
  readonly onDisable?: () => void;
  readonly disableLabel?: string;
}

export function SafeModeBanner({ title, message, onDisable, disableLabel = "Disable safe mode" }: SafeModeBannerProps) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 border border-danger/30 bg-danger/5 p-4">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="danger">Safe mode</Badge>
          <p className="text-sm font-semibold text-foreground">{sanitizeRichText(title)}</p>
        </div>
        <p className="text-sm text-foreground/70">{sanitizeRichText(message)}</p>
      </div>
      {onDisable ? (
        <Button variant="ghost" onClick={onDisable}>
          {sanitizeRichText(disableLabel)}
        </Button>
      ) : null}
    </Card>
  );
}
