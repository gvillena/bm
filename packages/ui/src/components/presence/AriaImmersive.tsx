import type { UiDirectives } from "@bm/aria";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../base/Dialog.js";
import { sanitizeRichText } from "../../utils/sanitize.js";
import { usePresenceHint } from "../../hooks/usePresenceHint.js";
import { Button } from "../base/Button.js";

export interface AriaImmersiveProps {
  readonly open: boolean;
  readonly title: string;
  readonly directives: UiDirectives | null;
  readonly onOpenChange: (next: boolean) => void;

  /**
   * Callback invocado al hacer clic en una acción contextual.
   * Recibe el nombre (string) del actionRef, si existe.
   */
  readonly onAction?: (actionRefName: string) => void;
}

/**
 * 🌌 AriaImmersive
 * Modo inmersivo de presencia: muestra hints explicativos y acciones contextualizadas.
 * Corrige errores de tipado genérico (TS2536 / TS2345) y garantiza compatibilidad con DTS build.
 */
export function AriaImmersive({
  open,
  title,
  directives,
  onOpenChange,
  onAction,
}: AriaImmersiveProps) {
  const { hints, actions, explain } = usePresenceHint({
    directives,
    budget: 5,
  });

  if (!directives) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-w-4xl overflow-y-auto bg-background px-8 py-8">
        <DialogTitle>{sanitizeRichText(title)}</DialogTitle>
        {explain ? <DialogDescription>{explain}</DialogDescription> : null}

        <section className="mt-6 space-y-4" aria-live="polite">
          {/* 🧩 Hints (contextual guidance) */}
          {hints.length > 0 && (
            <ul className="space-y-3" aria-label="Guidance">
              {hints.map((hint) => (
                <li
                  key={hint.id}
                  className="rounded-md border border-foreground/10 px-4 py-3 text-base"
                >
                  {hint.text}
                </li>
              ))}
            </ul>
          )}

          {/* 🚀 Actions */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action) => {
                const label = String(
                  action.sanitizedLabel ??
                    action.label ??
                    (typeof action.actionRef === "object"
                      ? (action.actionRef as { name?: string }).name
                      : action.actionRef) ??
                    "Action"
                );

                const actionName =
                  typeof action.actionRef === "object"
                    ? (action.actionRef as { name?: string }).name ?? "unknown"
                    : String(action.actionRef ?? "unknown");

                return (
                  <Button
                    key={`${actionName}-${label}`}
                    variant={
                      action.kind === "danger"
                        ? "danger"
                        : action.kind === "secondary"
                        ? "secondary"
                        : "primary"
                    }
                    size="lg"
                    onClick={() => onAction?.(actionName)}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
