import * as DrawerPrimitive from "vaul";
import { cn } from "../../utils/cn.js";

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export const DrawerOverlay = ({
  className,
  ...props
}: DrawerPrimitive.OverlayProps) => (
  <DrawerPrimitive.Overlay
    className={cn("fixed inset-0 z-overlay bg-foreground/40", className)}
    {...props}
  />
);

export const DrawerContent = ({
  className,
  ...props
}: DrawerPrimitive.ContentProps) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        "fixed inset-x-0 bottom-0 z-modal mt-24 flex min-h-[40vh] flex-col rounded-t-2xl border border-foreground/10 bg-background p-6 shadow-lg focus-visible:outline-none",
        className
      )}
      {...props}
    />
  </DrawerPortal>
);

export const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mx-auto mb-4 h-1.5 w-16 rounded-full bg-foreground/20",
      className
    )}
    {...props}
    aria-hidden="true"
  />
);
