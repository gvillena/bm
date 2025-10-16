import { DomainError } from '../domain.error.js';

export type ToneType = 'calm' | 'clear' | 'protective';

export class Tone {
  private constructor(private readonly value: ToneType) {}

  public static readonly allowed: readonly ToneType[] = ['calm', 'clear', 'protective'];

  public static create(value: ToneType): Tone {
    if (!Tone.allowed.includes(value)) {
      throw new DomainError('Invalid tone value', 'INVALID_TONE', { value });
    }
    return new Tone(value);
  }

  public equals(other: Tone): boolean {
    return this.value === other.value;
  }

  public toString(): ToneType {
    return this.value;
  }
}
