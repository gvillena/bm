import { MomentStatus, type MomentStatusType } from "@bm/domain/moment";
import { sanitizeRichText } from "../../utils/sanitize.js";
import { Badge } from "../base/Badge.js";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../base/Card.js";
import { Button } from "../base/Button.js";

export interface MomentCardProps {
  readonly id: string;
  readonly title: string;
  readonly status: MomentStatusType;
  readonly intention: string;
  readonly durationMinutes: number;
  readonly onView?: (id: string) => void;
}

export function MomentCard({ id, title, status, intention, durationMinutes, onView }: MomentCardProps) {
  const statusVo = MomentStatus.create(status);
  const statusLabel = statusVo.toString();
  return (
    <Card aria-labelledby={`moment-${id}`}> 
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle id={`moment-${id}`}>{sanitizeRichText(title)}</CardTitle>
          <Badge variant={statusLabel === "published" ? "default" : statusLabel === "archived" ? "danger" : "subtle"}>
            {statusLabel}
          </Badge>
        </div>
        <CardDescription>{sanitizeRichText(intention)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/70">Duration: {durationMinutes} minutes</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" onClick={() => onView?.(id)}>
          View moment
        </Button>
      </CardFooter>
    </Card>
  );
}
