// Ambient type declaration for "vaul"
// This provides minimal but safe typings for BM/UI build and editor autocomplete.

declare module "vaul" {
  import type {
    ComponentType,
    HTMLAttributes,
    ReactNode,
    CSSProperties,
  } from "react";

  /** Common drawer base props */
  export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
  }

  /** Overlay props */
  export interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
  }

  /** Content props */
  export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
  }

  // Exports
  export const Root: ComponentType<DrawerProps>;
  export const Trigger: ComponentType<DrawerProps>;
  export const Close: ComponentType<DrawerProps>;
  export const Portal: ComponentType<DrawerProps>;
  export const Overlay: ComponentType<OverlayProps>;
  export const Content: ComponentType<ContentProps>;
}
