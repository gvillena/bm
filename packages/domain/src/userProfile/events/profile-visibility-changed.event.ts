import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface ProfileVisibilityChangedPayload {
  userId: string;
  searchable: boolean;
}

export class ProfileVisibilityChangedEvent extends BaseDomainEvent<ProfileVisibilityChangedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: ProfileVisibilityChangedPayload }) {
    super(params);
  }

  public static create(params: {
    id: Identifier;
    occurredAt?: Timestamp;
    payload: ProfileVisibilityChangedPayload;
  }): ProfileVisibilityChangedEvent {
    return new ProfileVisibilityChangedEvent(params);
  }

  public get name(): string {
    return 'profile.visibilityChanged';
  }
}
