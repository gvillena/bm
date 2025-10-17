import { z } from "zod";
import { AuditId } from "../schemas/primitives";
import { ConsentEventInput, ConsentRecord } from "../schemas/consent.schema";

export const ConfirmConsentRequest = z.object({
  body: ConsentEventInput
});

export const ConfirmConsentResponse = z.object({
  record: ConsentRecord,
  auditId: AuditId
});

export const ListConsentLedgerRequest = z.object({
  query: z.object({
    subjectId: z.string().min(3).max(50)
  })
});

export const ListConsentLedgerResponse = z.object({
  records: z.array(ConsentRecord)
});
