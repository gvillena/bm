import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface ConsentRevokedPayload {
  subjectType: string;
  subjectId: string;
}

export class ConsentRevokedEvent extends BaseDomainEvent<ConsentRevokedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: ConsentRevokedPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: ConsentRevokedPayload }): ConsentRevokedEvent {
    return new ConsentRevokedEvent(params);
  }

  public get name(): string {
    return 'consent.revoked';
  }
}
