import { DomainError } from '../../shared/domain.error.js';

export type UserRoleType = 'user' | 'admin' | 'moderator';

export class UserRole {
  private constructor(private readonly value: UserRoleType) {}

  public static readonly allowed: readonly UserRoleType[] = ['user', 'admin', 'moderator'];

  public static create(value: UserRoleType): UserRole {
    if (!UserRole.allowed.includes(value)) {
      throw new DomainError('Invalid user role', 'INVALID_USER_ROLE', { value });
    }
    return new UserRole(value);
  }

  public equals(other: UserRole): boolean {
    return this.value === other.value;
  }

  public toString(): UserRoleType {
    return this.value;
  }
}
