import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface AgreementUpdatedPayload {
  agreementId: string;
  version: number;
}

export class AgreementUpdatedEvent extends BaseDomainEvent<AgreementUpdatedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: AgreementUpdatedPayload }) {
    super(params);
  }

  public static create(params: {
    id: Identifier;
    occurredAt?: Timestamp;
    payload: AgreementUpdatedPayload;
  }): AgreementUpdatedEvent {
    return new AgreementUpdatedEvent(params);
  }

  public get name(): string {
    return 'agreement.updated';
  }
}
