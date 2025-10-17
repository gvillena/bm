import { z } from "zod";
import { Tier, ReciprocityScore } from "./primitives";

export const AccessRequirementDTO = z.object({
  invitationRequired: z.boolean().default(false),
  manualApproval: z.boolean().default(false),
  minVerificationLevel: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  minTier: Tier.optional(),
  requireReciprocity: ReciprocityScore.extract(["mid", "high"]).optional()
});

export type AccessRequirementDTO = z.infer<typeof AccessRequirementDTO>;
