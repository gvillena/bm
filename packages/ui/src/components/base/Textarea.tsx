import { forwardRef } from "react";
import { cn } from "../../utils/cn.js";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-md border border-foreground/10 bg-background px-3 py-2 text-sm placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
