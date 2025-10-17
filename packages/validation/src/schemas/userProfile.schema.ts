import { z } from "zod";
import { UserId, UserPublicDTO } from "./user.schema";
import { SafeText, IsoDate } from "./primitives";

export const UserProfileDTO = z.object({
  id: UserId,
  owner: UserPublicDTO,
  headline: SafeText.optional(),
  story: SafeText.optional(),
  updatedAt: IsoDate
});

export type UserProfileDTO = z.infer<typeof UserProfileDTO>;
