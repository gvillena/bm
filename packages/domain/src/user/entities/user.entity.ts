import { BaseEntity } from '../../shared/base.entity.js';
import { DomainError } from '../../shared/domain.error.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';
import { UserRole } from '../value-objects/user-role.vo.js';

export interface UserProps {
  id: Identifier;
  authId: string;
  billingId?: string;
  role: UserRole;
  createdAt: Timestamp;
}

export class User extends BaseEntity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  public static create(props: UserProps): User {
    ensure(() => props.authId.trim().length > 0, 'Auth id must be a non-empty string', 'INVALID_AUTH_ID');
    ensure(() => !props.createdAt.isFuture(), 'CreatedAt cannot be in the future', 'INVALID_CREATED_AT');

    const billingId = props.billingId;
    if (billingId !== undefined) {
      const trimmed = billingId.trim();
      ensure(() => trimmed.length > 0, 'Billing id must be non-empty when provided', 'INVALID_BILLING_ID');
      return new User({ ...props, authId: props.authId.trim(), billingId: trimmed });
    }

    return new User({ ...props, authId: props.authId.trim(), billingId: undefined });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get authId(): string {
    return this.props.authId;
  }

  public get billingId(): string | undefined {
    return this.props.billingId;
  }

  public get role(): UserRole {
    return this.props.role;
  }

  public get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  public changeRole(role: UserRole): User {
    if (this.role.equals(role)) {
      return this;
    }
    return User.create({ ...this.cloneProps(), role });
  }

  public updateBillingId(billingId: string | undefined): User {
    if (billingId === undefined) {
      return User.create({ ...this.cloneProps(), billingId: undefined });
    }
    const trimmed = billingId.trim();
    if (!trimmed) {
      throw new DomainError('Billing id must be non-empty', 'INVALID_BILLING_ID');
    }
    return User.create({ ...this.cloneProps(), billingId: trimmed });
  }
}
