import { z } from "zod";
import { IdSchema, IsoDate, SafeText } from "./primitives";

export const ConsentEventInput = z.object({
  subjectId: z.string().min(3).max(50),
  action: z.enum(["CONSENT_CONFIRM", "CONSENT_REVOKE"] as const),
  reason: SafeText.optional()
});

export const ConsentRecord = z.object({
  id: IdSchema("Consent"),
  subjectId: z.string().min(3).max(50),
  action: z.string(),
  at: IsoDate,
  policySnapshotId: z.string().optional()
});

export type ConsentEventInput = z.infer<typeof ConsentEventInput>;
export type ConsentRecord = z.infer<typeof ConsentRecord>;
