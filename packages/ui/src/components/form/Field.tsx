import { cloneElement, isValidElement, useId } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "../../utils/cn.js";
import { Label } from "../base/Label.js";

function getNestedError(errors: Record<string, unknown>, name: string): string | undefined {
  const segments = name.split(".");
  let current: unknown = errors;
  for (const segment of segments) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    const record = current as Record<string, unknown>;
    current = record[segment];
  }
  if (typeof current === "object" && current && "message" in current) {
    const { message } = current as { message?: unknown };
    return typeof message === "string" ? message : undefined;
  }
  return undefined;
}

export interface FieldProps {
  readonly name: string;
  readonly label: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly hint?: React.ReactNode;
  readonly required?: boolean;
  readonly children: React.ReactElement;
}

export function Field({ name, label, description, hint, required, children }: FieldProps) {
  const { formState } = useFormContext();
  const fieldId = useId();
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = `${fieldId}-error`;
  const errorMessage = getNestedError(formState.errors as Record<string, unknown>, name);

  const describedBy = [descriptionId, hintId, errorMessage ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: fieldId,
        name,
        "aria-invalid": Boolean(errorMessage),
        "aria-describedby": describedBy || undefined
      })
    : children;

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={fieldId} className="flex items-center gap-1">
        {label}
        {required ? <span aria-hidden="true" className="text-danger">*</span> : null}
      </Label>
      {description ? (
        <p id={descriptionId} className="text-sm text-foreground/70">
          {description}
        </p>
      ) : null}
      {control}
      {hint ? (
        <p id={hintId} className="text-xs text-foreground/60">
          {hint}
        </p>
      ) : null}
      {errorMessage ? (
        <p id={errorId} role="alert" className={cn("text-sm text-danger")}>{errorMessage}</p>
      ) : null}
    </div>
  );
}
