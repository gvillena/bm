import { useMutation, useQuery } from "@tanstack/react-query";
import { requireClients } from "../clients/registry.js";
import type { ConsentEventInput } from "../types/index.js";
import { QK } from "./queryKeys.js";

export function useConsentLedger(page = 1) {
  const clients = requireClients();
  return useQuery({
    queryKey: QK.consentLedger(page),
    queryFn: () => clients.consent.listLedger({ page }),
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useConfirmConsent() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (input: ConsentEventInput) => clients.consent.confirmConsent(input),
  });
}
