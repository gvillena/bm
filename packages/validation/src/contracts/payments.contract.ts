import { z } from "zod";
import { AuditId, Money, Plan, Tier } from "../schemas/primitives";

export const PaymentTier = z.object({
  tier: Tier,
  name: z.string().min(3).max(50),
  description: z.string().max(280).optional(),
  price: Money
});

export const GetTiersResponse = z.object({
  tiers: z.array(PaymentTier)
});

export const SubscribeRequest = z.object({
  body: z.object({
    plan: Plan,
    paymentMethodId: z.string().min(5).max(64),
    promoCode: z.string().max(32).optional()
  })
});

export const SubscribeResponse = z.object({
  auditId: AuditId,
  activeTier: Tier
});

export const VerifyPaymentIntentRequest = z.object({
  params: z.object({ intentId: z.string().min(5).max(64) })
});

export const VerifyPaymentIntentResponse = z.object({
  auditId: AuditId,
  status: z.enum(["requires_action", "processing", "succeeded", "failed"] as const),
  nextAction: z.string().optional()
});
