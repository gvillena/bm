import { Money as MoneySchema } from "@bm/validation";
import { useController } from "react-hook-form";
import { Input } from "../../base/Input.js";
import { sanitizeRichText } from "../../../utils/sanitize.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../base/Select.js";

const ISO_CODES = ["USD", "EUR", "GBP", "MXN", "JPY"] as const;

type MoneyValue = {
  currency: (typeof ISO_CODES)[number];
  amount: number;
};

export interface MoneyControlProps {
  readonly name: string;
}

export function MoneyControl({ name }: MoneyControlProps) {
  const { field } = useController({ name });
  const value: MoneyValue = field.value ?? { currency: "USD", amount: 0 };

  return (
    <div className="flex items-center gap-3">
      <Select
        value={value.currency}
        onValueChange={(currency) => field.onChange({ ...value, currency })}
      >
        <SelectTrigger aria-label="currency">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {ISO_CODES.map((code) => (
            <SelectItem key={sanitizeRichText(code)} value={sanitizeRichText(code)}>
              {sanitizeRichText(code)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        inputMode="decimal"
        step="0.01"
        min={0}
        value={value.amount ?? ""}
        onChange={(event) => {
          const nextAmount = Number(event.target.value);
          if (Number.isNaN(nextAmount)) {
            field.onChange({ ...value, amount: 0 });
            return;
          }
          const parsed = MoneySchema.safeParse({ currency: value.currency, amount: nextAmount });
          field.onChange(parsed.success ? parsed.data : { ...value, amount: nextAmount });
        }}
      />
    </div>
  );
}
