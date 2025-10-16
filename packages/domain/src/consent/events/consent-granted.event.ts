import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface ConsentGrantedPayload {
  subjectType: string;
  subjectId: string;
}

export class ConsentGrantedEvent extends BaseDomainEvent<ConsentGrantedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: ConsentGrantedPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: ConsentGrantedPayload }): ConsentGrantedEvent {
    return new ConsentGrantedEvent(params);
  }

  public get name(): string {
    return 'consent.granted';
  }
}
