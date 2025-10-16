import { DomainError } from '../domain.error.js';

export type AuraType = 'calm' | 'clear' | 'protective';

export class Aura {
  private constructor(private readonly value: AuraType) {}

  public static readonly allowed: readonly AuraType[] = ['calm', 'clear', 'protective'];

  public static create(value: AuraType): Aura {
    if (!Aura.allowed.includes(value)) {
      throw new DomainError('Invalid aura value', 'INVALID_AURA', { value });
    }
    return new Aura(value);
  }

  public equals(other: Aura): boolean {
    return this.value === other.value;
  }

  public toString(): AuraType {
    return this.value;
  }
}
