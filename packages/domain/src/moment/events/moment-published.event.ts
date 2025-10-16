import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface MomentPublishedPayload {
  ownerId: string;
  publishedAt: string;
}

export class MomentPublishedEvent extends BaseDomainEvent<MomentPublishedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: MomentPublishedPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: MomentPublishedPayload }): MomentPublishedEvent {
    return new MomentPublishedEvent(params);
  }

  public get name(): string {
    return 'moment.published';
  }
}
