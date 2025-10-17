import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import { cn } from "../../utils/cn.js";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-overlay max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-sm text-background shadow-lg focus:outline-none",
      className
    )}
    {...props}
  />
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;
