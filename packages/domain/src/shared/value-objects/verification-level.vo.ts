import { DomainError } from '../domain.error.js';

export type VerificationLevelType = 0 | 1 | 2 | 3;

export class VerificationLevel {
  private constructor(private readonly value: VerificationLevelType) {}

  public static create(value: VerificationLevelType): VerificationLevel {
    if (![0, 1, 2, 3].includes(value)) {
      throw new DomainError('Invalid verification level', 'INVALID_VERIFICATION_LEVEL', { value });
    }
    return new VerificationLevel(value);
  }

  public equals(other: VerificationLevel): boolean {
    return this.value === other.value;
  }

  public toNumber(): VerificationLevelType {
    return this.value;
  }
}
