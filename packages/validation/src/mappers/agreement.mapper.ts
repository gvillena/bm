import { AgreementDTO } from "../schemas/agreement.schema";

export interface AgreementDomain {
  id: string;
  momentId: string;
  version: string;
  content: string;
  status: "draft" | "in_review" | "approved" | "signed";
}

/**
 * Mapea un agregado Agreement a su DTO sin exponer PII adicional.
 */
export const toAgreementDTO = (domain: AgreementDomain) =>
  AgreementDTO.parse({
    id: domain.id,
    momentId: domain.momentId,
    version: domain.version,
    content: domain.content,
    status: domain.status
  });

/**
 * Normaliza un borrador de acuerdo a partir de texto ya validado como SafeText.
 */
export const fromDraftContent = (momentId: string, content: string): Pick<AgreementDomain, "momentId" | "content"> => ({
  momentId,
  content
});
