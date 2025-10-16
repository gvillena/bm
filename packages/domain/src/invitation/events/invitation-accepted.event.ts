import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface InvitationAcceptedPayload {
  fromUserId: string;
  toUserId: string;
}

export class InvitationAcceptedEvent extends BaseDomainEvent<InvitationAcceptedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: InvitationAcceptedPayload }) {
    super(params);
  }

  public static create(params: {
    id: Identifier;
    occurredAt?: Timestamp;
    payload: InvitationAcceptedPayload;
  }): InvitationAcceptedEvent {
    return new InvitationAcceptedEvent(params);
  }

  public get name(): string {
    return 'invitation.accepted';
  }
}
