import { DurationMinutes } from "@bm/validation";
import { useController } from "react-hook-form";
import { Input } from "../../base/Input.js";

export interface DurationControlProps {
  readonly name: string;
  readonly minMinutes?: number;
  readonly maxMinutes?: number;
  readonly step?: number;
}

export function DurationControl({ name, minMinutes = 5, maxMinutes = 24 * 60, step = 5 }: DurationControlProps) {
  const { field } = useController({ name });

  const currentValue = typeof field.value === "number" ? field.value : Number(field.value ?? "");

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        inputMode="numeric"
        min={minMinutes}
        max={maxMinutes}
        step={step}
        value={Number.isFinite(currentValue) ? currentValue : ""}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (Number.isNaN(nextValue)) {
            field.onChange(event);
            return;
          }
          const parsed = DurationMinutes.min(minMinutes).max(maxMinutes).safeParse(nextValue);
          field.onChange(parsed.success ? parsed.data : nextValue);
        }}
        onBlur={field.onBlur}
      />
      <span className="text-sm text-foreground/70">min</span>
    </div>
  );
}
