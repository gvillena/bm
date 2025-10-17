import { useMemo } from "react";
import type { UiAction } from "@bm/aria";
import type { UiDirectives } from "@bm/runtime";
import { sanitizeRichText } from "../utils/sanitize.js";

export interface PresenceHint {
  id: string;
  text: string;
  describedBy: string;
}

export interface PresenceAction extends UiAction {
  sanitizedLabel: string;
}

export interface UsePresenceHintOptions {
  readonly directives: UiDirectives | null;
  readonly budget?: number;
}

export function usePresenceHint({
  directives,
  budget = 2,
}: UsePresenceHintOptions) {
  return useMemo(() => {
    if (!directives) {
      return {
        tone: undefined,
        hints: [] as PresenceHint[],
        actions: [] as PresenceAction[],
        explain: undefined as string | undefined,
      };
    }

    const hints = (directives.hints ?? [])
      .slice(0, budget)
      .map((hint, index) => {
        const sanitized = sanitizeRichText(hint);
        const id = `aria-hint-${index}`;
        return {
          id,
          text: sanitized,
          describedBy: `${id}-desc`,
        } satisfies PresenceHint;
      });

    const actions: PresenceAction[] = (directives.actions ?? [])
      .slice(0, 2)
      .map((action) => ({
        ...action,
        sanitizedLabel: sanitizeRichText(action.label),
      }));

    const explain = directives.explain
      ? sanitizeRichText(directives.explain)
      : undefined;

    return {
      tone: directives.tone,
      hints,
      actions,
      explain,
    };
  }, [budget, directives]);
}
