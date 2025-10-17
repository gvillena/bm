import type { UiDirectives } from "@bm/runtime";
import { usePresenceHint } from "../../hooks/usePresenceHint.js";
import { Badge } from "../base/Badge.js";
import { Button } from "../base/Button.js";

export interface AriaInlineProps {
  readonly directives: UiDirectives | null;
  readonly presenceBudget?: number;
  /**
   * Acción disparada al hacer clic sobre un botón de acción.
   * Se recibe la referencia de acción (`actionRef.name`) si está disponible.
   */
  readonly onAction?: (actionRefName: string) => void;
}

/**
 * 🔹 AriaInline
 * Renderiza los hints y acciones ARIA en línea.
 * Usa el presupuesto de presencia para decidir cuántos mostrar.
 */
export function AriaInline({
  directives,
  presenceBudget = 2,
  onAction,
}: AriaInlineProps) {
  const { hints, actions } = usePresenceHint({
    directives,
    budget: presenceBudget,
  });

  if (!directives || (hints.length === 0 && actions.length === 0)) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="note"
      aria-live="polite"
    >
      {/* 🟢 Hints contextuales */}
      {hints.map((hint) => (
        <Badge key={hint.id} variant="subtle">
          {hint.text}
        </Badge>
      ))}

      {/* 🔵 Acciones contextuales */}
      {actions.map((action) => {
        const label = String(action.sanitizedLabel ?? action.label ?? "Action");
        const actionName =
          typeof action.actionRef === "object"
            ? ((action.actionRef as { name?: string }).name ?? "unknown")
            : String(action.actionRef ?? "unknown");

        return (
          <Button
            key={`${actionName}-${label}`}
            variant={
              action.kind === "danger"
                ? "danger"
                : action.kind === "secondary"
                  ? "secondary"
                  : "ghost"
            }
            size="sm"
            onClick={() => onAction?.(actionName)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
