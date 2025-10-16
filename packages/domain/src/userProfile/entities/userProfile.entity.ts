import { BaseEntity } from '../../shared/base.entity.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { CareRule } from '../../shared/value-objects/care-rule.vo.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Alias } from '../../shared/value-objects/alias.vo.js';
import { Aura } from '../../shared/value-objects/aura.vo.js';
import { Tone } from '../../shared/value-objects/tone.vo.js';
import { ensureDiscoverabilityConsistency } from '../policies/profile-visibility.policy.js';
import { Discoverability } from '../value-objects/discoverability.vo.js';

export interface UserProfileProps {
  id: Identifier;
  userId: Identifier;
  alias: Alias;
  tone: Tone;
  aura: Aura;
  discoverability: Discoverability;
  globalBoundaries: readonly CareRule[];
}

function ensureNoConflictingCareRules(rules: readonly CareRule[]): void {
  const seen = new Map<string, CareRule>();
  for (const rule of rules) {
    const key = rule.kind;
    if (!seen.has(key)) {
      seen.set(key, rule);
      continue;
    }
    const existing = seen.get(key)!;
    ensure(
      () => existing.equals(rule),
      `Conflicting care rule for kind ${key}`,
      'CONFLICTING_CARE_RULE'
    );
  }
}

export class UserProfile extends BaseEntity<UserProfileProps> {
  private constructor(props: UserProfileProps) {
    super(props);
  }

  public static create(props: UserProfileProps): UserProfile {
    ensure(() => props.globalBoundaries.length <= 50, 'Too many care rules', 'EXCESSIVE_CARE_RULES');
    ensureDiscoverabilityConsistency(props.discoverability);
    ensureNoConflictingCareRules(props.globalBoundaries);

    return new UserProfile({ ...props, globalBoundaries: [...props.globalBoundaries] });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get userId(): Identifier {
    return this.props.userId;
  }

  public get alias(): Alias {
    return this.props.alias;
  }

  public get tone(): Tone {
    return this.props.tone;
  }

  public get aura(): Aura {
    return this.props.aura;
  }

  public get discoverability(): Discoverability {
    return this.props.discoverability;
  }

  public get globalBoundaries(): readonly CareRule[] {
    return [...this.props.globalBoundaries];
  }

  public updateBoundaries(boundaries: readonly CareRule[]): UserProfile {
    ensureNoConflictingCareRules(boundaries);
    return UserProfile.create({ ...this.cloneProps(), globalBoundaries: [...boundaries] });
  }

  public updateDiscoverability(discoverability: Discoverability): UserProfile {
    ensureDiscoverabilityConsistency(discoverability);
    return UserProfile.create({ ...this.cloneProps(), discoverability });
  }
}
