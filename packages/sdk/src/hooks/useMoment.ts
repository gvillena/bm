import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requireClients } from "../clients/registry.js";
import type { CreateMomentInput, MomentDTO } from "../types/index.js";
import { QK } from "./queryKeys.js";

export function useMoment(id: string) {
  const clients = requireClients();
  return useQuery({
    queryKey: QK.moment(id),
    queryFn: () => clients.moments.get(id),
    staleTime: 60_000,
    gcTime: 300_000,
  });
}

export function useMomentList(params?: { page?: number; pageSize?: number; q?: string }) {
  const clients = requireClients();
  const queryKey = QK.moments(JSON.stringify(params ?? {}));
  return useQuery({
    queryKey,
    queryFn: () => clients.moments.list(params),
    staleTime: 30_000,
    gcTime: 300_000,
  });
}

export function useCreateMoment() {
  const clients = requireClients();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMomentInput) => clients.moments.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moments"] });
    },
  });
}

export function useUpdateMoment(id: string) {
  const clients = requireClients();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<MomentDTO>) => clients.moments.update(id, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.moment(id) });
    },
  });
}

export function usePublishMoment() {
  const clients = requireClients();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clients.moments.publish(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QK.moment(id) });
      qc.invalidateQueries({ queryKey: ["moments"] });
    },
  });
}
