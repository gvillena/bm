import { z } from "zod";
import { DurationMinutes, IdSchema, SafeText, ShortText } from "./primitives";

export const MomentId = IdSchema("Moment");

const IntimacyDetails = z.object({
  possible: z.boolean(),
  conditions: z.array(ShortText).max(5).optional()
});

export const MomentVisibility = z.enum(["PUBLIC", "INVITE_ONLY"] as const);

export const MomentPublicDTO = z.object({
  id: MomentId,
  teaser: SafeText,
  visibility: MomentVisibility
});

export const MomentPrivateDTO = MomentPublicDTO.extend({
  details: SafeText.optional(),
  intimacy: IntimacyDetails.optional(),
  rules: z.array(ShortText).max(10).optional()
}).superRefine((value, ctx) => {
  if (value.intimacy?.possible === false && value.intimacy?.conditions?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Si la intimidad no es posible no puede haber condiciones"
    });
  }
});

export const MomentFormat = z.enum(["walk", "coffee", "call", "other"] as const);

export const CreateMomentInput = z.object({
  intention: SafeText,
  format: MomentFormat,
  duration: DurationMinutes
});

export type MomentPublicDTO = z.infer<typeof MomentPublicDTO>;
export type MomentPrivateDTO = z.infer<typeof MomentPrivateDTO>;
export type CreateMomentInput = z.infer<typeof CreateMomentInput>;
