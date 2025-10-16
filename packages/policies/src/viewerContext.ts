import type { Tier } from "./types.js";

export type EmotionalState = "calm" | "stressed" | "unknown";
export type ConsentState = "valid" | "stale" | "missing";
export type RelationState = "none" | "invited" | "approved" | "previously_connected";
export type AriaMatch = "match" | "neutral" | "unknown" | "mismatch";

export interface ViewerContext {
  userId?: string;
  role: "owner" | "participant" | "viewer" | "moderator";
  tier: Tier;
  relation?: RelationState;
  reciprocityScore?: "low" | "mid" | "high";
  careScore?: "low" | "mid" | "high";
  emotionalState?: EmotionalState;
  consentState?: ConsentState;
  verificationLevel?: 0 | 1 | 2;
  featureFlags?: Record<string, boolean>;
  hasSharedHistory?: boolean;
  ariaMatch?: AriaMatch;
  lastConsentCheckAt?: Date | null;
}

export interface PolicyInput<Resource> {
  viewerContext: ViewerContext;
  resource: Resource;
  now: Date;
  policySnapshotId?: string;
}
