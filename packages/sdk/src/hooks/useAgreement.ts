import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requireClients } from "../clients/registry.js";
import type { AgreementDTO } from "../types/index.js";
import { QK } from "./queryKeys.js";

export function useAgreement(id: string) {
  const clients = requireClients();
  return useQuery({
    queryKey: QK.agreement(id),
    queryFn: () => clients.agreements.get(id),
    staleTime: 45_000,
    gcTime: 300_000,
  });
}

export function useAgreementDiff(agreementId: string, versionA: string, versionB: string) {
  const clients = requireClients();
  return useQuery({
    queryKey: ["agreements", agreementId, "diff", versionA, versionB],
    queryFn: () => clients.agreements.diff(agreementId, versionA, versionB),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: 0,
  });
}

export function useAgreementDraftUpdate(agreementId: string) {
  const clients = requireClients();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<AgreementDTO>) => clients.agreements.updateDraft(agreementId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.agreement(agreementId) });
    },
  });
}

export function useAgreementSubmit() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (agreementId: string) => clients.agreements.submitForReview(agreementId),
  });
}

export function useAgreementApprove() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (agreementId: string) => clients.agreements.approve(agreementId),
  });
}

export function useAgreementSign() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (agreementId: string) => clients.agreements.sign(agreementId),
  });
}
