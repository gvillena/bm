import { DomainError } from '../domain.error.js';

export class ReciprocityScore {
  private constructor(private readonly value: number) {}

  public static create(value: number): ReciprocityScore {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new DomainError('Reciprocity score must be between 0 and 100', 'INVALID_RECIPROCITY_SCORE', {
        value,
      });
    }
    return new ReciprocityScore(Math.round(value));
  }

  public equals(other: ReciprocityScore): boolean {
    return this.value === other.value;
  }

  public toNumber(): number {
    return this.value;
  }
}
