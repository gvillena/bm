import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requireClients } from "../clients/registry.js";
import { QK } from "./queryKeys.js";

export function useInvitations(momentId: string) {
  const clients = requireClients();
  return useQuery({
    queryKey: QK.invitations(momentId),
    queryFn: () => clients.invitations.list(momentId),
    staleTime: 15_000,
    gcTime: 300_000,
    retry: 1,
  });
}

export function useCreateInvitation() {
  const clients = requireClients();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ momentId, toUserId }: { momentId: string; toUserId: string }) =>
      clients.invitations.create(momentId, toUserId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QK.invitations(variables.momentId) });
    },
  });
}

export function useSendInvitation() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (invitationId: string) => clients.invitations.send(invitationId),
  });
}

export function useAcceptInvitation() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (invitationId: string) => clients.invitations.accept(invitationId),
  });
}

export function useRejectInvitation() {
  const clients = requireClients();
  return useMutation({
    mutationFn: (invitationId: string) => clients.invitations.reject(invitationId),
  });
}
