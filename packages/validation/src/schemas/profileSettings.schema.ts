import { z } from "zod";
import { SafeText, Tier } from "./primitives";

export const NotificationPreferences = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  push: z.boolean().default(true)
});

export const ProfileSettingsDTO = z.object({
  bio: SafeText.optional(),
  preferredLanguage: z.enum(["es", "en", "pt"] as const).default("es"),
  defaultTier: Tier.default("FREE"),
  notifications: NotificationPreferences
});

export type ProfileSettingsDTO = z.infer<typeof ProfileSettingsDTO>;
