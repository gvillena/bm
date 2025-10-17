import type { SceneEdge } from "@bm/runtime/graph/types";
import { Button } from "../base/Button.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export interface NodeActionsProps {
  readonly transitions: SceneEdge[];
  readonly busy?: boolean;
  readonly onTransition: (to: SceneEdge) => void;
}

export function NodeActions({ transitions, busy, onTransition }: NodeActionsProps) {
  if (transitions.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((transition) => (
        <Button
          key={transition.to}
          variant="primary"
          disabled={busy}
          onClick={() => onTransition(transition)}
        >
          {sanitizeRichText(transition.description ?? transition.to)}
        </Button>
      ))}
    </div>
  );
}
