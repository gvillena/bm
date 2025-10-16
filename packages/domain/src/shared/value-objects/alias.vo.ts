import { DomainError } from '../domain.error.js';

export class Alias {
  private constructor(private readonly value: string) {}

  public static create(value: string): Alias {
    if (typeof value !== 'string' || value.trim().length === 0 || value.length > 64) {
      throw new DomainError('Alias must be a non-empty string up to 64 characters', 'INVALID_ALIAS', { value });
    }
    return new Alias(value.trim());
  }

  public equals(other: Alias): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
