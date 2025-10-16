import { useCallback, useContext } from "react";
import type { Decision, Obligation, ViewerContext } from "@bm/policies";
import type { IntentContext, RelationalIntent, SceneNodeSummary } from "../intent/types.js";
import { AriaPresenceContext } from "./context.js";

export interface UseAriaIntentOptions {
  viewerContext: ViewerContext;
  node: SceneNodeSummary;
  policyDecision?: Decision | null;
  obligations?: Obligation[];
  policySnapshotId?: string;
  graphId?: string;
}

export type TriggerIntentOverrides = Partial<Omit<UseAriaIntentOptions, "viewerContext" | "node">> & {
  viewerContext?: ViewerContext;
  node?: SceneNodeSummary;
};

export function useAriaIntent(base: UseAriaIntentOptions) {
  const ctx = useContext(AriaPresenceContext);
  if (!ctx) {
    throw new Error("useAriaIntent must be used within an AriaPresenceProvider");
  }
  const { controller, setDirectives } = ctx;

  const trigger = useCallback(
    (intent: RelationalIntent, overrides?: TriggerIntentOverrides) => {
      const context: Omit<IntentContext, "aura" | "level"> = {
        viewerContext: overrides?.viewerContext ?? base.viewerContext,
        node: overrides?.node ?? base.node,
        policyDecision: overrides?.policyDecision ?? base.policyDecision,
        obligations: overrides?.obligations ?? base.obligations,
        policySnapshotId: overrides?.policySnapshotId ?? base.policySnapshotId,
        graphId: overrides?.graphId ?? base.graphId
      };
      const directives = controller.handleIntent(intent, context);
      if (directives) {
        setDirectives(directives);
      }
      return directives;
    },
    [base, controller, setDirectives]
  );

  return { trigger };
}
