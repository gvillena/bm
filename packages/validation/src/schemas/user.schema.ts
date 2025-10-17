import { z } from "zod";
import { IdSchema, SafeText, Email, Tier } from "./primitives";
import { ProfileSettingsDTO } from "./profileSettings.schema";

export const UserId = IdSchema("User");

export const UserPublicDTO = z.object({
  id: UserId,
  displayName: SafeText,
  avatarUrl: z.string().url().optional(),
  tier: Tier
});

export const UserPrivateDTO = UserPublicDTO.extend({
  email: Email,
  createdAt: z.string().datetime({ offset: true })
});

export const UserWithSettingsDTO = UserPrivateDTO.extend({
  settings: ProfileSettingsDTO
});

export type UserPublicDTO = z.infer<typeof UserPublicDTO>;
export type UserPrivateDTO = z.infer<typeof UserPrivateDTO>;
export type UserWithSettingsDTO = z.infer<typeof UserWithSettingsDTO>;
