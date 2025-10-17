import { z } from "zod";
import {
  ConsentState,
  EmotionalState,
  FeatureFlags,
  IdSchema,
  Tier,
  CareScore
} from "./primitives";

export const ViewerContext = z.object({
  userId: IdSchema("User").optional(),
  role: z.enum(["owner", "participant", "viewer", "moderator"] as const),
  tier: Tier.default("FREE"),
  relation: z.enum(["none", "invited", "approved", "previously_connected"] as const).default("none"),
  reciprocityScore: z.enum(["low", "mid", "high"] as const).default("low"),
  careScore: CareScore.default(50),
  emotionalState: EmotionalState.default("unknown"),
  consentState: ConsentState.default("missing"),
  verificationLevel: z.union([z.literal(0), z.literal(1), z.literal(2)]).default(0),
  featureFlags: FeatureFlags.optional()
});

export type ViewerContext = z.infer<typeof ViewerContext>;
