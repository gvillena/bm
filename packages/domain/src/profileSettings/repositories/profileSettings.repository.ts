import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { ProfileSettings } from '../entities/profileSettings.entity.js';

export interface ProfileSettingsRepository {
  findByUserId(userId: Identifier): Promise<ProfileSettings | null> | ProfileSettings | null;
  save(settings: ProfileSettings): Promise<void> | void;
}
