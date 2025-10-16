import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface InvitationSentPayload {
  fromUserId: string;
  toUserId: string;
}

export class InvitationSentEvent extends BaseDomainEvent<InvitationSentPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: InvitationSentPayload }) {
    super(params);
  }

  public static create(params: { id: Identifier; occurredAt?: Timestamp; payload: InvitationSentPayload }): InvitationSentEvent {
    return new InvitationSentEvent(params);
  }

  public get name(): string {
    return 'invitation.sent';
  }
}
