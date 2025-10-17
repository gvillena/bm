import * as LabelPrimitive from "@radix-ui/react-label";
import { forwardRef } from "react";
import { cn } from "../../utils/cn.js";

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium text-foreground", className)} {...props} />
));

Label.displayName = LabelPrimitive.Root.displayName;
