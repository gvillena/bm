import type { ViewerContext, Decision, Obligation } from "@bm/policies";

export type PresenceLevel = "minimal" | "standard" | "immersive";
export type AuraPreset = "calm" | "clear" | "protective";

export type Tone = "neutral" | "warm" | "direct" | "caring" | "protective";

export interface UiAction {
  label: string;
  actionRef: { name: string; params?: Record<string, unknown> };
  kind?: "primary" | "secondary" | "danger" | "ghost";
  requiresConsent?: boolean;
}

export interface UiDirectives {
  hints?: string[];
  actions?: UiAction[];
  tone?: Tone;
  explain?: string;
  ephemeral?: boolean;
}

export interface RuntimeCtx {
  viewerContext: ViewerContext;
  policySnapshotId?: string;
  policyDecision?: Decision | null;
  obligations?: Obligation[];
  graphId?: string;
  nodeId?: string;
}

export type RuntimeSignal =
  | {
      type: "willEnter" | "didEnter" | "willExit" | "didExit";
      payload: { nodeId: string };
      timestamp: number;
    }
  | {
      type: "guard";
      payload: { nodeId: string; guardId: string; outcome: "permit" | "deny" | "redact" };
      timestamp: number;
    }
  | {
      type: "action";
      payload: { nodeId: string; actionName: string; result?: "completed" | "rejected" };
      timestamp: number;
    }
  | {
      type: "error";
      payload: { nodeId?: string; error: Error };
      timestamp: number;
    };

export interface PresenceSnapshot {
  level: PresenceLevel;
  aura: AuraPreset;
}
