import type { UiAction, UiDirectives } from "@bm/aria";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { usePresenceHint } from "../../hooks/usePresenceHint.js";
import { useMotionPreset, panelEnter } from "../../theme/motion.js";
import { Button } from "../base/Button.js";
import { sanitizeRichText } from "../../utils/sanitize.js";

const toneStyles: Record<string, string> = {
  neutral: "border-foreground/10 bg-background",
  warm: "border-accent/30 bg-accent/5",
  direct: "border-foreground/20 bg-foreground/5",
  caring: "border-accent/20 bg-accent/10",
  protective: "border-danger/20 bg-danger/5",
};

export interface AriaPanelProps {
  readonly directives: UiDirectives | null;
  readonly presenceBudget?: number;
  readonly title: string;
  readonly labels?: {
    expand?: string;
    collapse?: string;
  };

  /**
   * Callback al hacer clic sobre una acción.
   * Recibe la referencia completa de la acción.
   */
  readonly onAction?: (actionRef: UiAction["actionRef"]) => void;
}

/**
 * 🧭 AriaPanel
 * Panel lateral con hints, explicaciones y acciones contextuales.
 * Corrige tipado (TS2536, TS2345) y garantiza compatibilidad con build DTS.
 */
export function AriaPanel({
  directives,
  presenceBudget = 3,
  title,
  labels,
  onAction,
}: AriaPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { hints, actions, explain } = usePresenceHint({
    directives,
    budget: presenceBudget,
  });
  const variants = useMotionPreset(panelEnter);

  return (
    <AnimatePresence>
      {directives ? (
        <motion.aside
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`flex h-full w-80 flex-col gap-4 border-l px-4 py-6 ${
            toneStyles[directives.tone ?? "neutral"] ?? toneStyles.neutral
          }`}
          role="complementary"
          aria-label={title}
        >
          {/* 🔹 Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              {sanitizeRichText(title)}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              {collapsed
                ? sanitizeRichText(labels?.expand ?? "Expand")
                : sanitizeRichText(labels?.collapse ?? "Collapse")}
            </Button>
          </div>

          {/* 🔹 Content */}
          {!collapsed ? (
            <div className="space-y-4">
              {explain ? (
                <p className="text-sm text-foreground/80">{explain}</p>
              ) : null}

              {/* Hints */}
              {hints.length > 0 && (
                <ul className="space-y-2" aria-label="Hints">
                  {hints.map((hint) => (
                    <li
                      key={hint.id}
                      className="rounded-md bg-foreground/5 px-3 py-2 text-sm"
                    >
                      {hint.text}
                    </li>
                  ))}
                </ul>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex flex-col gap-2">
                  {actions.map((action) => {
                    const label = String(
                      action.sanitizedLabel ?? action.label ?? action.actionRef.name ?? "Action"
                    );

                    const actionName = action.actionRef.name ?? "unknown";

                    return (
                      <Button
                        key={`${actionName}-${label}`}
                        variant={
                          action.kind === "danger"
                            ? "danger"
                            : action.kind === "secondary"
                              ? "secondary"
                              : "primary"
                        }
                        onClick={() => onAction?.(action.actionRef)}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
