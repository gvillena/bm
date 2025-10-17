import { toast as sonnerToast, type ExternalToast } from "sonner";
import { Button } from "../base/Button.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

export const toast = sonnerToast;
export type { ExternalToast as ToastOptions };

export interface ToastActionProps {
  readonly label: string;
  readonly onAction: () => void;
  readonly tone?: "primary" | "secondary" | "danger";
}

export function ToastActionButton({ label, onAction, tone = "secondary" }: ToastActionProps) {
  return (
    <Button variant={tone === "danger" ? "danger" : tone} size="sm" onClick={onAction}>
      {sanitizeRichText(label)}
    </Button>
  );
}
