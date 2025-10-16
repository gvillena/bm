import { BaseEntity } from '../../shared/base.entity.js';
import { DomainError } from '../../shared/domain.error.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { ConsentState } from '../../shared/value-objects/consent-state.vo.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export type ConsentSubjectType = 'moment' | 'agreement';

export interface ConsentTimelineEntry {
  state: ConsentState;
  timestamp: Timestamp;
  byUserId: Identifier;
}

export interface ConsentProps {
  id: Identifier;
  subjectType: ConsentSubjectType;
  subjectId: Identifier;
  state: ConsentState;
  timeline: readonly ConsentTimelineEntry[];
}

function ensureTimelineConsistency(entries: readonly ConsentTimelineEntry[], state: ConsentState): void {
  const last = entries[entries.length - 1];
  ensure(() => !!last, 'Timeline cannot be empty', 'EMPTY_CONSENT_TIMELINE');
  ensure(() => last.state.equals(state), 'Consent state must match last timeline entry', 'CONSENT_STATE_MISMATCH');
}

export class Consent extends BaseEntity<ConsentProps> {
  private constructor(props: ConsentProps) {
    super(props);
  }

  public static create(props: ConsentProps): Consent {
    ensureTimelineConsistency(props.timeline, props.state);
    return new Consent({ ...props, timeline: [...props.timeline] });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get subjectType(): ConsentSubjectType {
    return this.props.subjectType;
  }

  public get subjectId(): Identifier {
    return this.props.subjectId;
  }

  public get state(): ConsentState {
    return this.props.state;
  }

  public get timeline(): readonly ConsentTimelineEntry[] {
    return [...this.props.timeline];
  }

  public appendState(entry: ConsentTimelineEntry): Consent {
    if (this.state.toString() === 'revoked' && entry.state.toString() === 'granted') {
      throw new DomainError('Cannot return to granted after revocation without reset', 'INVALID_CONSENT_TRANSITION');
    }
    const timeline = [...this.props.timeline, entry];
    return Consent.create({ ...this.cloneProps(), state: entry.state, timeline });
  }
}
