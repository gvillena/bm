import { useMutation, useQuery } from "@tanstack/react-query";
import { requireClients } from "../clients/registry.js";
import type { Tier } from "@bm/policies";
import { QK } from "./queryKeys.js";

export function usePaymentTiers() {
  const clients = requireClients();
  return useQuery({
    queryKey: QK.tiers(),
    queryFn: () => clients.payments.getTiers(),
    staleTime: 300_000,
    gcTime: 600_000,
  });
}

export function useSubscribeTier() {
  const clients = requireClients();
  return useMutation({
    mutationFn: ({ tier, paymentMethodId }: { tier: Tier; paymentMethodId: string }) =>
      clients.payments.subscribe(tier, paymentMethodId),
  });
}

export function useVerifyPaymentIntent() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (intentId: string) => clients.payments.verifyPaymentIntent(intentId),
  });
}
