import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface InvitationDeclinedPayload {
  fromUserId: string;
  toUserId: string;
}

export class InvitationDeclinedEvent extends BaseDomainEvent<InvitationDeclinedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: InvitationDeclinedPayload }) {
    super(params);
  }

  public static create(params: {
    id: Identifier;
    occurredAt?: Timestamp;
    payload: InvitationDeclinedPayload;
  }): InvitationDeclinedEvent {
    return new InvitationDeclinedEvent(params);
  }

  public get name(): string {
    return 'invitation.declined';
  }
}
