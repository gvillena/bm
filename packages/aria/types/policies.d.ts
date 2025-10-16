declare module "@bm/policies" {
  export type DecisionEffect = "PERMIT" | "DENY" | "REDACT";
  export interface Reason {
    code: string;
    detail?: string;
  }
  export interface Obligation {
    code: string;
    params?: Record<string, unknown>;
  }
  export interface Decision {
    effect: DecisionEffect;
    reasons: Reason[];
    obligations?: Obligation[];
  }
  export type EmotionalState = "calm" | "stressed" | "unknown";
  export type ConsentState = "valid" | "stale" | "missing";
  export type RelationState = "none" | "invited" | "approved" | "previously_connected";
  export type Tier = "FREE" | "CIRCLE" | "ALQUIMIA" | "SUPER_ALQUIMIA";
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
    ariaMatch?: "match" | "neutral" | "unknown" | "mismatch";
    lastConsentCheckAt?: Date | null;
  }
}
