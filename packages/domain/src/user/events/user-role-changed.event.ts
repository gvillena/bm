import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';
import type { UserRoleType } from '../value-objects/user-role.vo.js';

export interface UserRoleChangedPayload {
  previousRole: UserRoleType;
  newRole: UserRoleType;
}

export class UserRoleChangedEvent extends BaseDomainEvent<UserRoleChangedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: UserRoleChangedPayload }) {
    super(params);
  }

  public static create(params: {
    id: Identifier;
    occurredAt?: Timestamp;
    payload: UserRoleChangedPayload;
  }): UserRoleChangedEvent {
    return new UserRoleChangedEvent(params);
  }

  public get name(): string {
    return 'user.roleChanged';
  }
}
