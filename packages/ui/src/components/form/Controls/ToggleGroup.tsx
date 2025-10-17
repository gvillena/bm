import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { useController } from "react-hook-form";
import { cn } from "../../../utils/cn.js";
import { sanitizeRichText } from "../../../utils/sanitize.js";

export interface ToggleGroupOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
}

export interface ToggleGroupControlProps {
  readonly name: string;
  readonly options: ToggleGroupOption[];
}

export function ToggleGroupControl({ name, options }: ToggleGroupControlProps) {
  const { field } = useController({ name });
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={field.value}
      onValueChange={(value) => value && field.onChange(value)}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => (
        <ToggleGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className={cn(
            "flex min-w-[5rem] flex-1 flex-col gap-1 rounded-md border border-foreground/10 px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent data-[state=on]:border-accent data-[state=on]:bg-accent/10"
          )}
          aria-label={sanitizeRichText(option.label)}
        >
          <span className="font-medium">{sanitizeRichText(option.label)}</span>
          {option.description ? (
            <span className="text-xs text-foreground/70">{sanitizeRichText(option.description)}</span>
          ) : null}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
}
