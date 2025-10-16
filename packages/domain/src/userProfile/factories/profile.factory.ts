import { UserProfile } from '../entities/userProfile.entity.js';
import type { UserProfileProps } from '../entities/userProfile.entity.js';

export class UserProfileFactory {
  public static rehydrate(props: UserProfileProps): UserProfile {
    return UserProfile.create(props);
  }
}
