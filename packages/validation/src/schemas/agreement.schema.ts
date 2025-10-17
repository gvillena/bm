import { z } from "zod";
import { IdSchema, SafeText } from "./primitives";

export const AgreementId = IdSchema("Agreement");

export const AgreementDTO = z.object({
  id: AgreementId,
  momentId: IdSchema("Moment"),
  version: z.string().min(1).max(20),
  content: SafeText,
  status: z.enum(["draft", "in_review", "approved", "signed"] as const)
});

export const AgreementDiff = z.object({
  a: z.string(),
  b: z.string(),
  changes: z.array(
    z.object({
      path: z.string(),
      from: z.string().optional(),
      to: z.string().optional()
    })
  )
});

export type AgreementDTO = z.infer<typeof AgreementDTO>;
export type AgreementDiff = z.infer<typeof AgreementDiff>;
