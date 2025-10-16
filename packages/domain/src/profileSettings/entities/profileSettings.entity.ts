import { BaseEntity } from '../../shared/base.entity.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { DurationMinutes } from '../../shared/value-objects/duration-minutes.vo.js';
import { MomentFormat } from '../../moment/value-objects/moment-format.vo.js';

export interface ProfileSettingsProps {
  id: Identifier;
  userId: Identifier;
  defaultFormat: MomentFormat;
  defaultDuration: DurationMinutes;
  defaultVisibilityPolicyId?: Identifier;
  defaultIntimacyFrameId?: Identifier;
}

export class ProfileSettings extends BaseEntity<ProfileSettingsProps> {
  private constructor(props: ProfileSettingsProps) {
    super(props);
  }

  public static create(props: ProfileSettingsProps): ProfileSettings {
    ensure(() => props.defaultDuration.toNumber() > 0, 'Default duration must be positive', 'INVALID_DURATION');
    return new ProfileSettings({ ...props });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get userId(): Identifier {
    return this.props.userId;
  }

  public get defaultFormat(): MomentFormat {
    return this.props.defaultFormat;
  }

  public get defaultDuration(): DurationMinutes {
    return this.props.defaultDuration;
  }

  public get defaultVisibilityPolicyId(): Identifier | undefined {
    return this.props.defaultVisibilityPolicyId;
  }

  public get defaultIntimacyFrameId(): Identifier | undefined {
    return this.props.defaultIntimacyFrameId;
  }

  public applyOverrides(overrides: Partial<Omit<ProfileSettingsProps, 'id' | 'userId'>>): ProfileSettings {
    return ProfileSettings.create({ ...this.cloneProps(), ...overrides });
  }
}
