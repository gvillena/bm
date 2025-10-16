import { BaseEntity } from '../../shared/base.entity.js';
import { DomainError } from '../../shared/domain.error.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { CareRule } from '../../shared/value-objects/care-rule.vo.js';
import { DurationMinutes } from '../../shared/value-objects/duration-minutes.vo.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';
import type { AccessRequirement } from '../../accessRequirement/entities/accessRequirement.entity.js';
import { ensureMomentCareRulesLimit, ensureMomentRequirementsConsistent } from '../policies/moment-creation.policy.js';
import { MomentFormat } from '../value-objects/moment-format.vo.js';
import { MomentStatus } from '../value-objects/moment-status.vo.js';

export interface MomentProps {
  id: Identifier;
  ownerId: Identifier;
  intention: string;
  format: MomentFormat;
  duration: DurationMinutes;
  careRules: readonly CareRule[];
  intimacyFrameId?: Identifier;
  visibilityPolicyId: Identifier;
  accessRequirements: readonly AccessRequirement[];
  status: MomentStatus;
  publishedAt?: Timestamp;
}

function ensureCareRulesConsistency(rules: readonly CareRule[]): void {
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
      `Conflicting moment care rule for kind ${key}`,
      'CONFLICTING_MOMENT_CARE_RULE'
    );
  }
}

export class Moment extends BaseEntity<MomentProps> {
  private constructor(props: MomentProps) {
    super(props);
  }

  public static create(props: MomentProps): Moment {
    const intention = props.intention.trim();
    ensure(() => intention.length > 0 && intention.length <= 400, 'Intention must be between 1 and 400 characters', 'INVALID_INTENTION');
    ensure(() => props.duration.toNumber() > 0, 'Duration must be positive', 'INVALID_DURATION');
    ensureMomentCareRulesLimit(props.careRules);
    ensureCareRulesConsistency(props.careRules);
    ensureMomentRequirementsConsistent(props.accessRequirements);

    if (props.status.toString() === 'published') {
      ensure(() => !!props.publishedAt, 'Published moment requires publishedAt timestamp', 'MISSING_PUBLISHED_AT');
      ensure(() => !!props.visibilityPolicyId, 'Published moment requires visibility policy', 'MISSING_VISIBILITY_POLICY');
      if (props.publishedAt && props.publishedAt.isFuture()) {
        throw new DomainError('PublishedAt cannot be in the future', 'INVALID_PUBLISHED_AT');
      }
    }

    return new Moment({ ...props, intention, careRules: [...props.careRules], accessRequirements: [...props.accessRequirements] });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get ownerId(): Identifier {
    return this.props.ownerId;
  }

  public get intention(): string {
    return this.props.intention;
  }

  public get format(): MomentFormat {
    return this.props.format;
  }

  public get duration(): DurationMinutes {
    return this.props.duration;
  }

  public get careRules(): readonly CareRule[] {
    return [...this.props.careRules];
  }

  public get intimacyFrameId(): Identifier | undefined {
    return this.props.intimacyFrameId;
  }

  public get visibilityPolicyId(): Identifier {
    return this.props.visibilityPolicyId;
  }

  public get accessRequirements(): readonly AccessRequirement[] {
    return [...this.props.accessRequirements];
  }

  public get status(): MomentStatus {
    return this.props.status;
  }

  public get publishedAt(): Timestamp | undefined {
    return this.props.publishedAt;
  }

  public publish(at: Timestamp): Moment {
    return Moment.create({ ...this.cloneProps(), status: MomentStatus.create('published'), publishedAt: at });
  }

  public archive(at: Timestamp): Moment {
    return Moment.create({ ...this.cloneProps(), status: MomentStatus.create('archived'), publishedAt: at });
  }
}
