declare module "cmdk" {
  import * as React from "react";

  export interface CommandDialogProps
    extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    label?: string;
  }

  export interface CommandOverlayProps
    extends React.HTMLAttributes<HTMLDivElement> {}

  export interface CommandContentProps
    extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean; // ✅ agregado
  }

  export interface CommandInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onValueChange?: (value: string) => void; // ✅ agregado
  }

  export const Command: React.FC<React.PropsWithChildren<unknown>> & {
    Dialog: React.FC<CommandDialogProps>;
    Overlay: React.FC<CommandOverlayProps>;
    Content: React.FC<CommandContentProps>;
    Input: React.FC<CommandInputProps>;
    List: React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Empty: React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Group: React.FC<
      { heading?: string } & React.HTMLAttributes<HTMLDivElement>
    >;
    Item: React.FC<
      {
        value?: string;
        onSelect?: () => void;
      } & React.HTMLAttributes<HTMLDivElement>
    >;
  };
}
