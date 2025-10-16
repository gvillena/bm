import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requireClients } from "../clients/registry.js";
import type { ProfileDTO, ProfileSettingsDTO } from "../clients/profilesClient.js";
import { QK } from "./queryKeys.js";

export function useProfile(userId: string) {
  const clients = requireClients();
  return useQuery({
    queryKey: QK.profile(userId),
    queryFn: () => clients.profiles.getProfile(userId),
    staleTime: 120_000,
    gcTime: 300_000,
  });
}

export function useProfileSettings() {
  const clients = requireClients();
  return useQuery({
    queryKey: QK.profileSettings(),
    queryFn: () => clients.profiles.getSettings(),
    staleTime: 120_000,
    gcTime: 300_000,
  });
}

export function useUpdateProfile(userId: string) {
  const clients = requireClients();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<ProfileDTO>) => clients.profiles.updateProfile(userId, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.profile(userId) });
    },
  });
}

export function useUpdateProfileSettings() {
  const clients = requireClients();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<ProfileSettingsDTO>) => clients.profiles.updateSettings(patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.profileSettings() });
    },
  });
}
