import type { HttpClient } from "../api/client.js";
import type { ConsentEventInput, ConsentRecord, Page } from "../types/index.js";

export interface ConsentClient {
  confirmConsent(event: ConsentEventInput): Promise<{ consentId: string; auditId: string }>;
  listLedger(params?: { from?: string; to?: string; page?: number }): Promise<Page<ConsentRecord>>;
}

export function createConsentClient(http: HttpClient): ConsentClient {
  return {
    confirmConsent(event) {
      return http.post<{ consentId: string; auditId: string }>("consent/confirm", event, {
        idempotent: true,
        retry: true,
      });
    },
    listLedger(params) {
      return http.get<Page<ConsentRecord>>("consent/ledger", {
        query: params,
        retry: true,
      });
    },
  };
}
