import { BaseEntity } from '../../shared/base.entity.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface AuditLogProps {
  id: Identifier;
  actorId: Identifier;
  action: string;
  subjectType: string;
  subjectId: Identifier;
  policySnapshotId?: string;
  createdAt: Timestamp;
}

export class AuditLog extends BaseEntity<AuditLogProps> {
  private constructor(props: AuditLogProps) {
    super(props);
  }

  public static create(props: AuditLogProps): AuditLog {
    ensure(() => props.action.trim().length > 0, 'Action must be provided', 'INVALID_AUDIT_ACTION');
    ensure(() => !props.createdAt.isFuture(), 'Audit log cannot be set in future', 'INVALID_AUDIT_TIMESTAMP');
    return new AuditLog({ ...props, action: props.action.trim(), subjectType: props.subjectType.trim() });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get actorId(): Identifier {
    return this.props.actorId;
  }

  public get action(): string {
    return this.props.action;
  }

  public get subjectType(): string {
    return this.props.subjectType;
  }

  public get subjectId(): Identifier {
    return this.props.subjectId;
  }

  public get policySnapshotId(): string | undefined {
    return this.props.policySnapshotId;
  }

  public get createdAt(): Timestamp {
    return this.props.createdAt;
  }
}
