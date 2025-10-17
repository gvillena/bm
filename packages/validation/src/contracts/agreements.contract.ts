import { z } from "zod";
import { AuditId, IdSchema, SafeText } from "../schemas/primitives";
import { AgreementDTO, AgreementDiff, AgreementId } from "../schemas/agreement.schema";

const AgreementContentInput = z.object({
  content: SafeText
});

export const DraftAgreementRequest = z.object({
  body: AgreementContentInput.merge(z.object({ momentId: IdSchema("Moment") }))
});

export const DraftAgreementResponse = z.object({
  dto: AgreementDTO,
  auditId: AuditId
});

export const UpdateAgreementRequest = z.object({
  params: z.object({ id: AgreementId }),
  body: AgreementContentInput
});

export const UpdateAgreementResponse = z.object({
  dto: AgreementDTO,
  auditId: AuditId
});

export const DiffAgreementRequest = z.object({
  body: AgreementDiff.pick({ a: true, b: true })
});

export const DiffAgreementResponse = AgreementDiff;

export const SubmitAgreementRequest = z.object({
  params: z.object({ id: AgreementId })
});

export const SubmitAgreementResponse = z.object({
  auditId: AuditId,
  dto: AgreementDTO
});

export const ApproveAgreementRequest = z.object({
  params: z.object({ id: AgreementId }),
  body: z.object({ reviewerId: IdSchema("User") })
});

export const ApproveAgreementResponse = z.object({
  auditId: AuditId,
  dto: AgreementDTO
});

export const SignAgreementRequest = z.object({
  params: z.object({ id: AgreementId }),
  body: z.object({ signerId: IdSchema("User") })
});

export const SignAgreementResponse = z.object({
  auditId: AuditId,
  dto: AgreementDTO
});
