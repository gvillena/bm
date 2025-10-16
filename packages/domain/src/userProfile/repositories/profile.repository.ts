import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { UserProfile } from '../entities/userProfile.entity.js';

export interface UserProfileRepository {
  findById(id: Identifier): Promise<UserProfile | null> | UserProfile | null;
  findByUserId(userId: Identifier): Promise<UserProfile | null> | UserProfile | null;
  save(profile: UserProfile): Promise<void> | void;
}
