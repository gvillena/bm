import type { HttpClient } from "../api/client.js";
import type { AgreementDTO, AgreementDiff } from "../types/index.js";

export interface AgreementsClient {
  get(agreementId: string): Promise<AgreementDTO>;
  createDraft(momentId: string): Promise<{ agreementId: string; auditId: string }>;
  updateDraft(agreementId: string, patch: Partial<AgreementDTO>): Promise<{ auditId: string }>;
  diff(agreementId: string, versionA: string, versionB: string): Promise<AgreementDiff>;
  submitForReview(agreementId: string): Promise<{ auditId: string }>;
  approve(agreementId: string): Promise<{ auditId: string }>;
  sign(agreementId: string): Promise<{ auditId: string }>;
}

export function createAgreementsClient(http: HttpClient): AgreementsClient {
  return {
    get(agreementId) {
      return http.get<AgreementDTO>(`agreements/${agreementId}`, { retry: true });
    },
    createDraft(momentId) {
      return http.post<{ agreementId: string; auditId: string }>("agreements", { momentId }, {
        idempotent: true,
      });
    },
    updateDraft(agreementId, patch) {
      return http.patch<{ auditId: string }>(`agreements/${agreementId}`, patch, { idempotent: true });
    },
    diff(agreementId, versionA, versionB) {
      return http.get<AgreementDiff>(`agreements/${agreementId}/diff`, {
        query: { versionA, versionB },
        retry: true,
      });
    },
    submitForReview(agreementId) {
      return http.post<{ auditId: string }>(`agreements/${agreementId}/submit`, undefined, {
        idempotent: true,
      });
    },
    approve(agreementId) {
      return http.post<{ auditId: string }>(`agreements/${agreementId}/approve`, undefined, {
        idempotent: true,
      });
    },
    sign(agreementId) {
      return http.post<{ auditId: string }>(`agreements/${agreementId}/sign`, undefined, {
        idempotent: true,
        retry: true,
      });
    },
  };
}
