import * as React from "react";
import { cn } from "@/lib/utils";

export interface ItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  leading?: React.ReactNode;
  label: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
}

export const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(
  (
    {
      leading,
      label,
      subtitle,
      meta,
      actions,
      selected,
      disabled,
      className,
      ...rest
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "group/item grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2",
        "focus-within:ring-3 focus-within:ring-primary-500",
        selected ? "bg-primary-500/15" : "hover:bg-surface-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...rest}
    >
      <div className="text-text-2">{leading}</div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-text-1">{label}</div>
          {meta && <div className="shrink-0 text-xs text-text-2">{meta}</div>}
        </div>
        {subtitle && (
          <div className="truncate text-sm text-text-2">{subtitle}</div>
        )}
      </div>

      <div className="opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition">
        {actions}
      </div>
    </div>
  )
);
ItemActions.displayName = "ItemActions";
