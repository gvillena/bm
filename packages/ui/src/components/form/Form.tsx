import { FormProvider, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { cn } from "../../utils/cn.js";

export interface FormProps<TFieldValues> {
  readonly form: UseFormReturn<TFieldValues>;
  readonly onSubmit: SubmitHandler<TFieldValues>;
  readonly className?: string;
  readonly children: React.ReactNode;
}

export function Form<TFieldValues>({ form, onSubmit, children, className }: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form role="form" className={cn("space-y-6", className)} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}
