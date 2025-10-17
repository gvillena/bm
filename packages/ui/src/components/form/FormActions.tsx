import { cn } from "../../utils/cn.js";

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly primaryAction?: React.ReactNode;
  readonly secondaryAction?: React.ReactNode;
  readonly tertiaryAction?: React.ReactNode;
}

export function FormActions({
  className,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  ...props
}: FormActionsProps) {
  return (
    <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props}>
      {tertiaryAction}
      {secondaryAction}
      {primaryAction}
    </div>
  );
}
