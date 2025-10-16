import { DomainError } from '../../shared/domain.error.js';

export type MomentStatusType = 'draft' | 'published' | 'archived';

export class MomentStatus {
  private constructor(private readonly value: MomentStatusType) {}

  public static readonly allowed: readonly MomentStatusType[] = ['draft', 'published', 'archived'];

  public static create(value: MomentStatusType): MomentStatus {
    if (!MomentStatus.allowed.includes(value)) {
      throw new DomainError('Invalid moment status', 'INVALID_MOMENT_STATUS', { value });
    }
    return new MomentStatus(value);
  }

  public equals(other: MomentStatus): boolean {
    return this.value === other.value;
  }

  public toString(): MomentStatusType {
    return this.value;
  }
}
