import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../base/Tooltip.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

const INTIMACY_OPTIONS = [
  { value: "casual", label: "Casual", description: "Light presence, opt-in." },
  { value: "attentive", label: "Attentive", description: "More frequent check-ins." },
  { value: "immersive", label: "Immersive", description: "Deep collaboration when invited." }
] as const;

export interface IntimacyFrameEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly tooltipCopy?: string;
}

export function IntimacyFrameEditor({
  value,
  onChange,
  tooltipCopy = "Frames define the possibility of intimacy, never a promise."
}: IntimacyFrameEditorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{sanitizeRichText("Intimacy frame")}</span>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="size-5 rounded-full border border-foreground/20 text-xs"
              aria-label="Intimacy frame info"
            >
              i
            </button>
          </TooltipTrigger>
          <TooltipContent>{sanitizeRichText(tooltipCopy)}</TooltipContent>
        </Tooltip>
      </div>
      <div role="radiogroup" aria-label="Select intimacy frame" className="flex flex-col gap-2">
        {INTIMACY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={option.value === value}
            className={`rounded-md border px-4 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              option.value === value ? "border-accent bg-accent/10" : "border-foreground/10 hover:bg-foreground/5"
            }`}
            onClick={() => onChange(option.value)}
          >
            <span className="font-medium">{sanitizeRichText(option.label)}</span>
            <p className="text-xs text-foreground/60">{sanitizeRichText(option.description)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
