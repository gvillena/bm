import { BaseEntity } from '../../shared/base.entity.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';
import { InvitationStatus } from '../value-objects/invitation-status.vo.js';

export interface InvitationProps {
  id: Identifier;
  fromUserId: Identifier;
  toUserId: Identifier;
  momentId?: Identifier;
  status: InvitationStatus;
  expiresAt?: Timestamp;
}

export class Invitation extends BaseEntity<InvitationProps> {
  private constructor(props: InvitationProps) {
    super(props);
  }

  public static create(props: InvitationProps): Invitation {
    ensure(() => !props.fromUserId.equals(props.toUserId), 'Cannot invite oneself', 'SELF_INVITE');
    if (props.expiresAt && props.expiresAt.isFuture() === false) {
      ensure(() => props.status.toString() === 'expired', 'Expired invitations must be marked expired', 'EXPIRED_STATUS_MISMATCH');
    }
    return new Invitation({ ...props });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get fromUserId(): Identifier {
    return this.props.fromUserId;
  }

  public get toUserId(): Identifier {
    return this.props.toUserId;
  }

  public get momentId(): Identifier | undefined {
    return this.props.momentId;
  }

  public get status(): InvitationStatus {
    return this.props.status;
  }

  public get expiresAt(): Timestamp | undefined {
    return this.props.expiresAt;
  }

  public accept(): Invitation {
    return Invitation.create({ ...this.cloneProps(), status: InvitationStatus.create('accepted') });
  }

  public decline(): Invitation {
    return Invitation.create({ ...this.cloneProps(), status: InvitationStatus.create('declined') });
  }

  public expire(): Invitation {
    return Invitation.create({ ...this.cloneProps(), status: InvitationStatus.create('expired') });
  }
}
