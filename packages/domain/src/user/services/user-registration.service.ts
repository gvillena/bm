import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';
import { User } from '../entities/user.entity.js';
import { UserCreatedEvent } from '../events/user-created.event.js';
import { UserRole } from '../value-objects/user-role.vo.js';

export interface RegisterUserInput {
  id: Identifier;
  authId: string;
  role?: UserRole;
  createdAt?: Timestamp;
  billingId?: string;
}

export interface RegisterUserResult {
  user: User;
  events: [UserCreatedEvent];
}

export function registerUser(input: RegisterUserInput): RegisterUserResult {
  const createdAt = input.createdAt ?? Timestamp.now();
  const role = input.role ?? UserRole.create('user');

  const user = User.create({
    id: input.id,
    authId: input.authId,
    billingId: input.billingId,
    role,
    createdAt,
  });

  const event = UserCreatedEvent.create({
    id: input.id,
    payload: {
      authId: user.authId,
      role: role.toString(),
      createdAt: createdAt.toISOString(),
    },
  });

  return { user, events: [event] };
}
