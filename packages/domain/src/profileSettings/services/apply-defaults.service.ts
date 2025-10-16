import type { Moment } from '../../moment/entities/moment.entity.js';
import type { ProfileSettings } from '../entities/profileSettings.entity.js';

export function applyDefaultSettings(settings: ProfileSettings, partial: Partial<Moment>): Partial<Moment> {
  return {
    ...partial,
    format: partial.format ?? settings.defaultFormat,
    duration: partial.duration ?? settings.defaultDuration,
    visibilityPolicyId: partial.visibilityPolicyId ?? settings.defaultVisibilityPolicyId,
    intimacyFrameId: partial.intimacyFrameId ?? settings.defaultIntimacyFrameId,
  } as Partial<Moment>;
}
