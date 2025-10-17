import type { UiDirectives } from "@bm/aria";
import { usePresenceHint } from "../../hooks/usePresenceHint.js";
import { Badge } from "../base/Badge.js";
import { Button } from "../base/Button.js";

export interface AriaInlineProps {
  readonly directives: UiDirectives | null;
  readonly presenceBudget?: number;
  readonly onAction?: (actionRef: UiDirectives["actions"] extends Array<infer A> ? A["actionRef"] : never) => void;
}

export function AriaInline({ directives, presenceBudget = 2, onAction }: AriaInlineProps) {
  const { hints, actions } = usePresenceHint({ directives, budget: presenceBudget });

  if (!directives || (hints.length === 0 && actions.length === 0)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="note" aria-live="polite">
      {hints.map((hint) => (
        <Badge key={hint.id} variant="subtle">
          {hint.text}
        </Badge>
      ))}
      {actions.map((action) => (
        <Button
          key={action.actionRef.name}
          variant={action.kind === "danger" ? "danger" : action.kind === "secondary" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onAction?.(action.actionRef)}
        >
          {action.sanitizedLabel}
        </Button>
      ))}
    </div>
  );
}
