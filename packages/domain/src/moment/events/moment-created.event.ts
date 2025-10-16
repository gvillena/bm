import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface MomentCreatedPayload {
  ownerId: string;
  intention: string;
}

export class MomentCreatedEvent extends BaseDomainEvent<MomentCreatedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: MomentCreatedPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: MomentCreatedPayload }): MomentCreatedEvent {
    return new MomentCreatedEvent(params);
  }

  public get name(): string {
    return 'moment.created';
  }
}
