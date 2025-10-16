import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface MomentArchivedPayload {
  ownerId: string;
  archivedAt: string;
}

export class MomentArchivedEvent extends BaseDomainEvent<MomentArchivedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: MomentArchivedPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: MomentArchivedPayload }): MomentArchivedEvent {
    return new MomentArchivedEvent(params);
  }

  public get name(): string {
    return 'moment.archived';
  }
}
