import { z } from "zod";
import { SafeText, ShortText } from "./primitives";

export const IntimacyLevel = z.enum(["light", "deep", "sacred"] as const);

export const IntimacyFrameDTO = z.object({
  frameId: z.string().min(3).max(50),
  level: IntimacyLevel,
  invitation: SafeText,
  boundaries: z.array(ShortText).max(10).default([])
});

export type IntimacyFrameDTO = z.infer<typeof IntimacyFrameDTO>;
