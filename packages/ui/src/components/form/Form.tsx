import type { ReactNode } from "react";
import {
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { cn } from "../../utils/cn.js";

export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  readonly form: UseFormReturn<TFieldValues>;
  readonly onSubmit: SubmitHandler<TFieldValues>;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Unified form wrapper compatible with React Hook Form.
 * Provides context and built-in spacing, ready for BM experience layers.
 */
export function Form<TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        role="form"
        className={cn("space-y-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}
