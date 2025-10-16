import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MessageHint
 * -----------------------------------------------------------------------------
 * Pequeño texto o burbuja contextual usada para acompañar una interacción con ARIA o ARIA-like presence.
 * Sirve como microfeedback (por ejemplo: “ARIA está pensando…”, “Nuevo mensaje”, “Cuidado mutuo activo”).
 */

export interface MessageHintProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "neutral" | "positive" | "warning" | "critical";
  icon?: React.ReactNode;
  pulse?: boolean;
  subtle?: boolean; // fondo translúcido
}

const toneMap: Record<NonNullable<MessageHintProps["tone"]>, string> = {
  neutral: "text-text-2 bg-surface-2/60",
  positive: "text-success-600 bg-success-500/15",
  warning: "text-warning-700 bg-warning-500/15",
  critical: "text-danger-600 bg-danger-500/15",
};

export const MessageHint = React.forwardRef<HTMLDivElement, MessageHintProps>(
  (
    { tone = "neutral", icon, pulse, subtle, className, children, ...rest },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition",
          toneMap[tone],
          subtle && "backdrop-blur-sm border border-(--color-surface-3)",
          pulse && "animate-pulse",
          className
        )}
        {...rest}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
    );
  }
);
MessageHint.displayName = "MessageHint";
