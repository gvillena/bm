import { z } from "zod";
import { AccessRequirementDTO } from "./accessRequirement.schema";

export const VisibilityLayer = z.object({
  audience: z.enum(["owner", "participant", "viewer", "teaser"] as const),
  fields: z.array(z.string()).min(1).max(20)
});

export const VisibilityPolicyDTO = z.object({
  type: z.enum(["PUBLIC", "INVITE_ONLY"] as const),
  layers: z.array(VisibilityLayer).min(1),
  access: AccessRequirementDTO
});

export type VisibilityPolicyDTO = z.infer<typeof VisibilityPolicyDTO>;
