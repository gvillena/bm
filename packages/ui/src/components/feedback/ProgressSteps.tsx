import { cn } from "../../utils/cn.js";

export interface ProgressStep {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly status: "complete" | "current" | "upcoming";
}

export interface ProgressStepsProps {
  readonly steps: ProgressStep[];
  readonly ariaLabel: string;
}

export function ProgressSteps({ steps, ariaLabel }: ProgressStepsProps) {
  return (
    <ol className="flex flex-col gap-3" aria-label={ariaLabel} role="list">
      {steps.map((step, index) => (
        <li key={step.id} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 inline-flex size-6 items-center justify-center rounded-full border text-xs font-semibold",
              step.status === "complete"
                ? "border-accent bg-accent text-white"
                : step.status === "current"
                ? "border-accent text-accent"
                : "border-foreground/20 text-foreground/50"
            )}
          >
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{step.label}</p>
            {step.description ? (
              <p className="text-xs text-foreground/70">{step.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
