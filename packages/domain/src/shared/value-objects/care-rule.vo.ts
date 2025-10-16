import { DomainError } from '../domain.error.js';

export type CareRuleKind = 'text' | 'checkinInterval' | 'noMaterialCommitmentFirst';

export interface CareRulePayload {
  text?: string;
  minutes?: number;
  [key: string]: unknown;
}

export class CareRule {
  private constructor(private readonly props: { kind: CareRuleKind; payload: CareRulePayload }) {}

  public static create(kind: CareRuleKind, payload: CareRulePayload = {}): CareRule {
    if (!['text', 'checkinInterval', 'noMaterialCommitmentFirst'].includes(kind)) {
      throw new DomainError('Invalid care rule kind', 'INVALID_CARE_RULE_KIND', { kind });
    }

    if (kind === 'text') {
      const text = payload.text?.toString().trim();
      if (!text) {
        throw new DomainError('Text care rule requires non-empty text', 'INVALID_CARE_RULE_TEXT');
      }
      return new CareRule({ kind, payload: { text } });
    }

    if (kind === 'checkinInterval') {
      const minutes = Number(payload.minutes);
      if (!Number.isInteger(minutes) || minutes <= 0) {
        throw new DomainError('Check-in interval must be a positive integer', 'INVALID_CARE_RULE_INTERVAL', {
          minutes,
        });
      }
      return new CareRule({ kind, payload: { minutes } });
    }

    return new CareRule({ kind, payload: Object.freeze({ ...payload }) });
  }

  public equals(other: CareRule): boolean {
    return this.props.kind === other.props.kind && JSON.stringify(this.props.payload) === JSON.stringify(other.props.payload);
  }

  public get kind(): CareRuleKind {
    return this.props.kind;
  }

  public get payload(): CareRulePayload {
    return { ...this.props.payload };
  }
}
