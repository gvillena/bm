/**
 * Tipos base para el motor de políticas de Beneficio Mutuo.
 */
export type Tier = "FREE" | "CIRCLE" | "ALQUIMIA" | "SUPER_ALQUIMIA";

export type DecisionEffect = "PERMIT" | "DENY" | "REDACT";

export interface Reason {
  code: string;
  detail?: string;
}

export interface Obligation {
  code: string;
  params?: Record<string, string | number | boolean>;
}

export interface Redaction {
  allow: string[];
}

export interface Metrics {
  evalMs?: number;
}

export interface Decision {
  effect: DecisionEffect;
  reasons: Reason[];
  obligations?: Obligation[];
  redact?: Redaction;
  metrics?: Metrics;
}

export interface PolicyTelemetry {
  /**
   * Hook opcional para recolectar métricas no sensibles de evaluaciones.
   */
  onEvaluate(policyName: string, effect: DecisionEffect, meta: Record<string, unknown>): void;
}

export interface MomentIntimacyInfo {
  possible: boolean;
  conditions?: string[];
  consentLastVerifiedAt?: Date;
}

export interface MomentDTO {
  [key: string]: unknown;
  id: string;
  teaser: string;
  details?: string;
  intimacy?: MomentIntimacyInfo;
  rules?: string[];
  visibility?: "PUBLIC" | "INVITE_ONLY";
  ownerId?: string;
  ownerTier?: Tier;
  accessRequirements?: AccessRequirement;
  gating?: MomentGating;
}

export interface MomentGating {
  requireSharedHistory?: boolean;
  requireEmotionalMatch?: boolean;
  requireConsentFresh?: boolean;
}

export type AgreementState = "draft" | "active" | "archived";

export interface AgreementDTO {
  [key: string]: unknown;
  id: string;
  ownerId: string;
  state: AgreementState;
  coCreatorIds?: string[];
  consentState?: "valid" | "stale" | "missing";
  requiresFreshConsent?: boolean;
}

export interface InviteContext {
  pendingInvites?: number;
  maxInvites?: number;
  cooldownMs?: number;
  lastInviteAt?: Date | null;
  momentTierRequired?: Tier;
  requireCareScore?: "mid" | "high";
}

export interface AccessRequirement {
  invitationRequired?: boolean;
  manualApproval?: boolean;
  minVerificationLevel?: 0 | 1 | 2;
  minTier?: Tier;
  requireReciprocity?: "mid" | "high";
  requireCare?: "mid" | "high";
  requireSharedHistory?: boolean;
  requireEmotionalMatch?: boolean;
  requireConsentValid?: boolean;
}
