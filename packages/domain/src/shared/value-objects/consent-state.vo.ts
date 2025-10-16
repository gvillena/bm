import { DomainError } from '../domain.error.js';

export type ConsentStateType = 'granted' | 'withheld' | 'paused' | 'revoked';

export class ConsentState {
  private constructor(private readonly value: ConsentStateType) {}

  public static readonly allowed: readonly ConsentStateType[] = ['granted', 'withheld', 'paused', 'revoked'];

  public static create(value: ConsentStateType): ConsentState {
    if (!ConsentState.allowed.includes(value)) {
      throw new DomainError('Invalid consent state', 'INVALID_CONSENT_STATE', { value });
    }
    return new ConsentState(value);
  }

  public equals(other: ConsentState): boolean {
    return this.value === other.value;
  }

  public toString(): ConsentStateType {
    return this.value;
  }
}
