import { DomainError } from '../domain.error.js';

export class DurationMinutes {
  private constructor(private readonly value: number) {}

  public static create(value: number): DurationMinutes {
    if (!Number.isInteger(value) || value <= 0 || value > 24 * 60) {
      throw new DomainError('Duration must be a positive integer less than a day', 'INVALID_DURATION', { value });
    }
    return new DurationMinutes(value);
  }

  public equals(other: DurationMinutes): boolean {
    return this.value === other.value;
  }

  public toNumber(): number {
    return this.value;
  }
}
