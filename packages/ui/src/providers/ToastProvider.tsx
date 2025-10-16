import * as React from "react";
import { Toaster, toast } from "sonner";
import { useTheme } from "./ThemeProvider.js";

/**
 * Requiere dependencia:
 *   pnpm add sonner
 * Exporta <ToastProvider /> y puedes usar `import { toast } from "sonner"`
 */
export interface ToastProviderProps {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  richColors?: boolean;
  duration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  position = "top-right",
  richColors = true,
  duration = 3000,
}) => {
  const { theme } = useTheme();
  const sonnerTheme = theme === "dark" ? "dark" : "light";

  // Exponer toast globalmente si se desea (opcional)
  // (aquí basta con montar Toaster una vez en la app)
  return (
    <Toaster
      position={position}
      richColors={richColors}
      duration={duration}
      theme={sonnerTheme}
    />
  );
};

export { toast }; // re-export de conveniencia
