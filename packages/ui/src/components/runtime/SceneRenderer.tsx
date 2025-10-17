import { useEffect, useMemo, useState } from "react";
import type { UiAction, UiDirectives } from "@bm/aria";
import type { DecisionEffect, Obligation, Reason } from "@bm/policies";
import type { ExperienceEngine, TransitionResult } from "@bm/runtime";
import type { SceneNode } from "@bm/runtime/graph/types";
import { useShortcut } from "../../hooks/useShortcut.js";
import { AriaInline } from "../presence/AriaInline.js";
import { AriaImmersive } from "../presence/AriaImmersive.js";
import { AriaPanel } from "../presence/AriaPanel.js";
import { NodeActions } from "./NodeActions.js";
import { NodeHeader } from "./NodeHeader.js";
import { GuardOutcome } from "./GuardOutcome.js";

export interface SceneRendererProps {
  readonly engine: ExperienceEngine;
  readonly ariaUi?: UiDirectives | null;
  readonly onTransition?: (result: TransitionResult) => void;
  readonly onAction?: (actionRef: UiAction["actionRef"]) => void;
}

type GuardState = {
  effect: DecisionEffect;
  reasons?: Reason[];
  obligations?: Obligation[];
};

export function SceneRenderer({ engine, ariaUi = null, onTransition, onAction }: SceneRendererProps) {
  const [stateVersion, setStateVersion] = useState(0);
  const [directives, setDirectives] = useState<UiDirectives | null>(ariaUi);
  const [guardState, setGuardState] = useState<GuardState | null>(null);
  const [immersiveOpen, setImmersiveOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const node = useMemo(() => engine.currentNode(), [engine, stateVersion]);

  useEffect(() => {
    setDirectives(ariaUi);
  }, [ariaUi]);
  useEffect(() => {
    if (ariaUi) {
      return;
    }
    const last = (engine.getState() as any).lastUi as UiDirectives | undefined;
    if (last) {
      setDirectives(last);
    }
  }, [engine, ariaUi, stateVersion]);
  const handleTransition = async (edge: SceneNode["transitions"][number]) => {
    setBusy(true);
    const result = await engine.transition(edge.to);
    setBusy(false);
    onTransition?.(result);
    if (result.ok) {
      setStateVersion((version) => version + 1);
      setGuardState({ effect: "PERMIT" });
      if (result.ui) {
        setDirectives(result.ui);
      }
      return;
    }

    const reasons: Reason[] | undefined = result.error.meta?.reasons?.map((reason) => ({
      code: reason.code,
      detail: reason.message
    }));
    const obligations: Obligation[] | undefined = result.error.meta?.obligations?.map((code) => ({ code }));
    if (result.error.code === "guard-denied") {
      setGuardState({ effect: "DENY", reasons, obligations });
    } else {
      setGuardState({ effect: "REDACT", reasons, obligations });
    }
  };

  const handleNext = async () => {
    setBusy(true);
    const result = await engine.next();
    setBusy(false);
    onTransition?.(result);
    if (result.ok) {
      setStateVersion((version) => version + 1);
      setGuardState({ effect: "PERMIT" });
      if (result.ui) {
        setDirectives(result.ui);
      }
    } else if (result.error.code === "guard-denied") {
      const reasons: Reason[] | undefined = result.error.meta?.reasons?.map((reason) => ({
        code: reason.code,
        detail: reason.message
      }));
      const obligations: Obligation[] | undefined = result.error.meta?.obligations?.map((code) => ({ code }));
      setGuardState({ effect: "DENY", reasons, obligations });
    }
  };

  useShortcut({ key: "Enter" }, (event) => {
    const target = event.target as HTMLElement | null;
    if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
      return;
    }
    void handleNext();
  });
  useShortcut({ key: "Escape" }, () => setImmersiveOpen(true));

  const content = renderNode(node);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        <NodeHeader node={node} />
        {directives ? <AriaInline directives={directives} onAction={onAction} /> : null}
        <div className="rounded-lg border border-foreground/10 bg-background p-6" aria-live="polite">
          {content}
        </div>
        <NodeActions
          transitions={node.transitions}
          busy={busy}
          onTransition={(edge) => void handleTransition(edge)}
        />
        {guardState ? (
          <GuardOutcome
            effect={guardState.effect}
            reasons={guardState.reasons}
            obligations={guardState.obligations}
            onConfirmObligation={(obligation) => onAction?.({ name: "confirm-obligation", params: obligation })}
          />
        ) : null}
      </div>
      <div>
        {directives ? (
          <AriaPanel
            directives={directives}
            title="Assistant guidance"
            onAction={(actionRef) => onAction?.(actionRef)}
          />
        ) : null}
      </div>
      {directives ? (
        <AriaImmersive
          open={immersiveOpen}
          onOpenChange={setImmersiveOpen}
          title="Immersive guidance"
          directives={directives}
          onAction={(actionRef) => onAction?.(actionRef)}
        />
      ) : null}
    </div>
  );
}

function renderNode(node: SceneNode) {
  switch (node.kind) {
    case "form":
      return <p className="text-sm text-foreground/70">Render form fields: {JSON.stringify(node.meta?.fields ?? [])}</p>;
    case "view":
      return <p className="text-sm text-foreground/70">{JSON.stringify(node.meta ?? {})}</p>;
    case "decision":
      return <p className="text-sm font-medium text-foreground">Decision node awaiting guard evaluation.</p>;
    case "aria":
      return <p className="text-sm text-foreground/70">ARIA node delegates to directives.</p>;
    default:
      return <p className="text-sm text-foreground/70">Service node executing background actions.</p>;
  }
}
