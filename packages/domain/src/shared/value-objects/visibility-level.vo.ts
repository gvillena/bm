import { DomainError } from '../domain.error.js';

export type VisibilityLevelType = 'public' | 'invited' | 'approved' | 'private';

export class VisibilityLevel {
  private constructor(private readonly value: VisibilityLevelType) {}

  public static readonly allowed: readonly VisibilityLevelType[] = ['public', 'invited', 'approved', 'private'];

  public static create(value: VisibilityLevelType): VisibilityLevel {
    if (!VisibilityLevel.allowed.includes(value)) {
      throw new DomainError('Invalid visibility level', 'INVALID_VISIBILITY', { value });
    }
    return new VisibilityLevel(value);
  }

  public equals(other: VisibilityLevel): boolean {
    return this.value === other.value;
  }

  public toString(): VisibilityLevelType {
    return this.value;
  }
}
