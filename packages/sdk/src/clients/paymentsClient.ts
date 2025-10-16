import type { HttpClient } from "../api/client.js";
import type { PaymentVerificationResult, TierInfo } from "../types/index.js";
import type { Tier } from "@bm/policies";

export interface PaymentsClient {
  getTiers(): Promise<TierInfo[]>;
  subscribe(tier: Tier, paymentMethodId: string): Promise<{ subscriptionId: string; auditId: string }>;
  verifyPaymentIntent(intentId: string): Promise<PaymentVerificationResult>;
}

export function createPaymentsClient(http: HttpClient): PaymentsClient {
  return {
    getTiers() {
      return http.get<TierInfo[]>("payments/tiers", { retry: true });
    },
    subscribe(tier, paymentMethodId) {
      return http.post<{ subscriptionId: string; auditId: string }>("payments/subscribe", { tier, paymentMethodId }, {
        idempotent: true,
      });
    },
    verifyPaymentIntent(intentId) {
      return http.get<PaymentVerificationResult>(`payments/intents/${intentId}`, {
        retry: true,
      });
    },
  };
}
