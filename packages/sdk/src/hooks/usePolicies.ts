import { useQuery } from "@tanstack/react-query";
import { requireClients } from "../clients/registry.js";
import type { ViewerContext } from "@bm/policies";
import { QK } from "./queryKeys.js";
import { safeJson } from "../utils/safeJson.js";

function hashViewerContext(vc: ViewerContext): string {
  const payload = safeJson.stringify(vc);
  if (
    typeof globalThis !== "undefined" &&
    typeof globalThis.btoa === "function"
  ) {
    return globalThis.btoa(payload);
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(payload).toString("base64");
  }
  return payload;
}

export function useAuthorizeViewMoment(vc: ViewerContext, id: string) {
  const clients = requireClients();
  const hash = hashViewerContext(vc);
  return useQuery({
    queryKey: QK.policyAuth("viewMoment", id, hash),
    queryFn: () => clients.policies.authorizeViewMoment(vc, id),
    staleTime: 15_000,
    gcTime: 300_000,
    retry: 0,
  });
}

export function useAuthorizeEditAgreement(
  vc: ViewerContext,
  agreementId: string
) {
  const clients = requireClients();
  const hash = hashViewerContext(vc);
  return useQuery({
    queryKey: QK.policyAuth("editAgreement", agreementId, hash),
    queryFn: () => clients.policies.authorizeEditAgreement(vc, agreementId),
    staleTime: 15_000,
    gcTime: 300_000,
    retry: 0,
  });
}

export function usePolicySnapshot() {
  const clients = requireClients();
  return useQuery({
    queryKey: ["policies", "snapshot"],
    queryFn: () => clients.policies.getPolicySnapshot(),
    staleTime: 300_000,
    gcTime: 600_000,
  });
}
