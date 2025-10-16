export type {
  Decision,
  DecisionEffect,
  MomentDTO,
  AgreementDTO,
  Tier,
  ViewerContext,
} from "@bm/policies";

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CreateMomentInput {
  title: string;
  teaser: string;
  details?: string;
  intimacyFrame?: string;
  visibility?: "PUBLIC" | "INVITE_ONLY" | "PRIVATE";
  tags?: string[];
}

export interface AgreementDiff {
  fields: Array<{ field: string; from: unknown; to: unknown }>;
}

export interface ConsentEventInput {
  event: string;
  subjectId: string;
  momentId?: string;
  agreementId?: string;
  context?: Record<string, unknown>;
}

export interface ConsentRecord {
  id: string;
  subjectId: string;
  event: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface TierInfo {
  tier: string;
  price: number;
  currency: string;
  benefits: string[];
}

export interface PaymentVerificationResult {
  status: "succeeded" | "requires_action" | "failed";
  auditId?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  amount: number;
  currency: string;
}
