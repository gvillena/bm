import type { HttpClient } from "../api/client.js";

export interface ProfileDTO {
  id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ProfileSettingsDTO {
  emailNotifications: boolean;
  smsNotifications: boolean;
  visibilityPreset: string;
}

export interface ProfilesClient {
  getProfile(userId: string): Promise<ProfileDTO>;
  updateProfile(userId: string, patch: Partial<ProfileDTO>): Promise<{ auditId: string }>;
  getSettings(): Promise<ProfileSettingsDTO>;
  updateSettings(patch: Partial<ProfileSettingsDTO>): Promise<{ auditId: string }>;
  listVisibilityPresets(): Promise<string[]>;
}

export function createProfilesClient(http: HttpClient): ProfilesClient {
  return {
    getProfile(userId) {
      return http.get<ProfileDTO>(`profiles/${userId}`, { retry: true });
    },
    updateProfile(userId, patch) {
      return http.patch<{ auditId: string }>(`profiles/${userId}`, patch, { idempotent: true });
    },
    getSettings() {
      return http.get<ProfileSettingsDTO>("profiles/settings", { retry: true });
    },
    updateSettings(patch) {
      return http.patch<{ auditId: string }>("profiles/settings", patch, { idempotent: true });
    },
    listVisibilityPresets() {
      return http.get<string[]>("profiles/visibility-presets", { retry: true });
    },
  };
}
