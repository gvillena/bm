import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';
import type { UserRoleType } from '../value-objects/user-role.vo.js';

export interface UserCreatedPayload {
  authId: string;
  role: UserRoleType;
  createdAt: string;
}

export class UserCreatedEvent extends BaseDomainEvent<UserCreatedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: UserCreatedPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: UserCreatedPayload }): UserCreatedEvent {
    return new UserCreatedEvent(params);
  }

  public get name(): string {
    return 'user.created';
  }
}
