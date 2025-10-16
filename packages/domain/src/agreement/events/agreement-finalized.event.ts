import { BaseDomainEvent } from '../../shared/base.event.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface AgreementFinalizedPayload {
  agreementId: string;
  finalizedAt: string;
}

export class AgreementFinalizedEvent extends BaseDomainEvent<AgreementFinalizedPayload> {
  private constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: AgreementFinalizedPayload }) {
    super(params);
  }

  public static create(params: {
    id: Identifier;
    occurredAt?: Timestamp;
    payload: AgreementFinalizedPayload;
  }): AgreementFinalizedEvent {
    return new AgreementFinalizedEvent(params);
  }

  public get name(): string {
    return 'agreement.finalized';
  }
}
