import { toast as sonnerToast, type ExternalToast } from "sonner";
import { Button } from "../base/Button.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

/**
 * Safe wrapper for Sonner's toast.
 * This hides Sonner's internal types (like PromiseIExtendedResult)
 * that aren't publicly exported, avoiding DTS build errors.
 */
export const toast = ((...args: unknown[]) => {
  // @ts-ignore internal type from sonner
  return (sonnerToast as any)(...args);
}) as unknown as (...args: unknown[]) => void;

export type { ExternalToast as ToastOptions };

export interface ToastActionProps {
  readonly label: string;
  readonly onAction: () => void;
  readonly tone?: "primary" | "secondary" | "danger";
}

export function ToastActionButton({
  label,
  onAction,
  tone = "secondary",
}: ToastActionProps) {
  return (
    <Button
      variant={tone === "danger" ? "danger" : tone}
      size="sm"
      onClick={onAction}
    >
      {sanitizeRichText(label)}
    </Button>
  );
}
