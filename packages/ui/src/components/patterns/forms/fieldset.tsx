import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldsetProps
  extends React.HTMLAttributes<HTMLFieldSetElement> {
  legend?: React.ReactNode;
  description?: React.ReactNode;
  tone?: "neutral" | "primary";
  inset?: boolean; // aplica padding/borde sutil
}

export const Fieldset: React.FC<FieldsetProps> = ({
  legend,
  description,
  tone = "neutral",
  inset,
  className,
  children,
  ...rest
}) => {
  return (
    <fieldset
      className={cn(
        "rounded-lg",
        inset && "p-4 border border-(--color-surface-2) bg-surface-1",
        tone === "primary" && "border-primary-500/30",
        className
      )}
      {...rest}
    >
      {legend && (
        <legend className="px-1 text-sm font-medium text-text-2">
          {legend}
        </legend>
      )}
      {description && (
        <p className="mt-1 px-1 text-sm text-text-2">{description}</p>
      )}
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </fieldset>
  );
};
