import type { Decision, Obligation, ViewerContext } from "@bm/policies";
import type { AuraPreset, PresenceLevel, UiDirectives } from "../presence/types.js";

export type RelationalIntent =
  | "coCreateMoment"
  | "reviewLimits"
  | "explainStep"
  | "safeIntervention"
  | "celebrateProgress";

export interface SceneNodeSummary {
  id: string;
  kind?: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface IntentContext {
  viewerContext: ViewerContext;
  node: SceneNodeSummary;
  policyDecision?: Decision | null;
  obligations?: Obligation[];
  aura: AuraPreset;
  level: PresenceLevel;
  policySnapshotId?: string;
  graphId?: string;
}

export interface IntentStrategy {
  intent: RelationalIntent;
  handle(context: IntentContext): UiDirectives;
}

export type IntentRegistry = Record<RelationalIntent, IntentStrategy>;
