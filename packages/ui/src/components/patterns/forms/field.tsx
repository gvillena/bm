import * as React from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

type FieldContext = {
  id: string;
  size: Size;
  invalid?: boolean;
  required?: boolean;
  describedBy?: string[];
};

const FieldCtx = React.createContext<FieldContext | null>(null);

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  size?: Size;
  invalid?: boolean;
  required?: boolean;
}

export const Field: React.FC<FieldProps> = ({
  id,
  size = "md",
  invalid,
  required,
  className,
  children,
  ...rest
}) => {
  const uid = React.useId();
  const baseId = id ?? `fld-${uid}`;
  const ctx = React.useMemo<FieldContext>(
    () => ({
      id: baseId,
      size,
      invalid,
      required,
      describedBy: [],
    }),
    [baseId, size, invalid, required]
  );

  return (
    <FieldCtx.Provider value={ctx}>
      <div className={cn("flex flex-col gap-1.5", className)} {...rest}>
        {children}
      </div>
    </FieldCtx.Provider>
  );
};

export interface FieldLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredMark?: boolean;
}
export const FieldLabel: React.FC<FieldLabelProps> = ({
  requiredMark = true,
  className,
  children,
  ...rest
}) => {
  const ctx = React.useContext(FieldCtx);
  if (!ctx) throw new Error("FieldLabel must be used within <Field>");
  return (
    <label
      htmlFor={ctx.id}
      className={cn("text-sm text-text-2", className)}
      {...rest}
    >
      {children}
      {requiredMark && ctx.required && (
        <span aria-hidden className="text-danger-500 ml-0.5">
          *
        </span>
      )}
    </label>
  );
};

export interface FieldControlProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean; // si quieres pasar tu propio control con ref
  children: React.ReactElement;
}
export const FieldControl: React.FC<FieldControlProps> = ({
  children,
  asChild,
  ...rest
}) => {
  const ctx = React.useContext(FieldCtx);
  if (!ctx) throw new Error("FieldControl must be used within <Field>");

  const describedBy = ctx.describedBy?.length
    ? ctx.describedBy.join(" ")
    : undefined;
  const controlProps = {
    id: ctx.id,
    "aria-invalid": ctx.invalid || undefined,
    "aria-required": ctx.required || undefined,
    "aria-describedby": describedBy,
  };

  if (asChild) {
    return React.cloneElement(children, { ...controlProps, ...rest });
  }

  // Por defecto, renderiza un wrapper no intrusivo
  return <div {...rest}>{React.cloneElement(children, controlProps)}</div>;
};

export interface FieldDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
export const FieldDescription: React.FC<FieldDescriptionProps> = ({
  className,
  id,
  children,
  ...rest
}) => {
  const ctx = React.useContext(FieldCtx);
  if (!ctx) throw new Error("FieldDescription must be used within <Field>");
  const descId = id ?? `${ctx.id}-desc`;
  ctx.describedBy!.push(descId);
  return (
    <p id={descId} className={cn("text-sm text-text-2", className)} {...rest}>
      {children}
    </p>
  );
};

export interface FieldErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
export const FieldError: React.FC<FieldErrorProps> = ({
  className,
  id,
  children,
  ...rest
}) => {
  const ctx = React.useContext(FieldCtx);
  if (!ctx) throw new Error("FieldError must be used within <Field>");
  const errId = id ?? `${ctx.id}-error`;
  ctx.describedBy!.push(errId);
  return (
    <p
      id={errId}
      role="alert"
      className={cn("text-sm text-danger-500", className)}
      {...rest}
    >
      {children}
    </p>
  );
};
