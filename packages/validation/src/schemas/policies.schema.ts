import { z } from "zod";
import { SafeText } from "./primitives";

export const DecisionEffect = z.enum(["PERMIT", "DENY", "REDACT"] as const);

export const PolicyReason = z.object({
  code: z.string().min(2).max(64),
  detail: SafeText.optional()
});

export const PolicyObligation = z.object({
  code: z.string().min(2).max(64),
  params: z.record(z.any()).optional()
});

export const PolicyRedaction = z.object({
  allow: z.array(z.string()).max(50)
});

export const DecisionMetrics = z.object({
  evalMs: z.number().int().min(0).optional()
});

export const PolicyDecision = z.object({
  effect: DecisionEffect,
  reasons: z.array(PolicyReason).min(1),
  obligations: z.array(PolicyObligation).optional(),
  redact: PolicyRedaction.optional(),
  metrics: DecisionMetrics.optional()
});

export type DecisionEffect = z.infer<typeof DecisionEffect>;
export type PolicyReason = z.infer<typeof PolicyReason>;
export type PolicyObligation = z.infer<typeof PolicyObligation>;
export type PolicyRedaction = z.infer<typeof PolicyRedaction>;
export type PolicyDecision = z.infer<typeof PolicyDecision>;
