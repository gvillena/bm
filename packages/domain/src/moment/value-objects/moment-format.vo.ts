import { DomainError } from '../../shared/domain.error.js';

export type MomentFormatType = 'walk_coffee' | 'meal' | 'video_call' | 'custom';

export class MomentFormat {
  private constructor(private readonly value: MomentFormatType) {}

  public static readonly allowed: readonly MomentFormatType[] = ['walk_coffee', 'meal', 'video_call', 'custom'];

  public static create(value: MomentFormatType): MomentFormat {
    if (!MomentFormat.allowed.includes(value)) {
      throw new DomainError('Invalid moment format', 'INVALID_MOMENT_FORMAT', { value });
    }
    return new MomentFormat(value);
  }

  public equals(other: MomentFormat): boolean {
    return this.value === other.value;
  }

  public toString(): MomentFormatType {
    return this.value;
  }
}
