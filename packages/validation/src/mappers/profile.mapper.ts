import { UserProfileDTO } from "../schemas/userProfile.schema";
import { UserPublicDTO } from "../schemas/user.schema";

export interface UserProfileDomain {
  id: string;
  owner: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    tier: "FREE" | "CIRCLE" | "ALQUIMIA" | "SUPER_ALQUIMIA";
  };
  headline?: string;
  story?: string;
  updatedAt: string;
}

/**
 * Sanitiza un perfil de usuario para exposición pública.
 */
export const toUserProfileDTO = (domain: UserProfileDomain) =>
  UserProfileDTO.parse({
    id: domain.id,
    owner: UserPublicDTO.parse(domain.owner),
    headline: domain.headline,
    story: domain.story,
    updatedAt: domain.updatedAt
  });
