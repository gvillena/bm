import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PresenceIndicator
 * -----------------------------------------------------------------------------
 * Un pequeño indicador visual del estado de presencia (online, away, busy, etc.).
 * Usa tokens de color definidos en el tema Tailwind (OKLCH) y admite animación sutil.
 */

export type PresenceStatus = "online" | "away" | "busy" | "offline";

export interface PresenceIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status?: PresenceStatus;
  pulse?: boolean;
  size?: "xs" | "sm" | "md";
}

const statusColor: Record<PresenceStatus, string> = {
  online: "bg-success-500",
  away: "bg-warning-500",
  busy: "bg-danger-500",
  offline: "bg-surface-3",
};

const sizeMap = {
  xs: "h-2 w-2",
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
};

/**
 * Indicador de presencia neutro (puede acompañar avatares o labels).
 */
export const PresenceIndicator = React.forwardRef<
  HTMLDivElement,
  PresenceIndicatorProps
>(
  (
    { status = "offline", pulse = false, size = "sm", className, ...rest },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-status={status}
        className={cn(
          "inline-block rounded-full",
          sizeMap[size],
          statusColor[status],
          pulse && "animate-pulse",
          className
        )}
        {...rest}
      />
    );
  }
);
PresenceIndicator.displayName = "PresenceIndicator";
