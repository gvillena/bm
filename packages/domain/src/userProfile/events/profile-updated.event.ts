import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface ProfileUpdatedPayload {
  userId: string;
  updatedFields: string[];
}

export class ProfileUpdatedEvent extends BaseDomainEvent<ProfileUpdatedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: ProfileUpdatedPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: ProfileUpdatedPayload }): ProfileUpdatedEvent {
    return new ProfileUpdatedEvent(params);
  }

  public get name(): string {
    return 'profile.updated';
  }
}
