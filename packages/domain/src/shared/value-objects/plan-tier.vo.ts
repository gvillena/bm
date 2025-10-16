import { DomainError } from '../domain.error.js';

export type PlanTierType = 'free' | 'premium' | 'platinum' | 'ultra';

export class PlanTier {
  private constructor(private readonly value: PlanTierType) {}

  public static readonly allowed: readonly PlanTierType[] = ['free', 'premium', 'platinum', 'ultra'];

  public static create(value: PlanTierType): PlanTier {
    if (!PlanTier.allowed.includes(value)) {
      throw new DomainError('Invalid plan tier', 'INVALID_PLAN_TIER', { value });
    }
    return new PlanTier(value);
  }

  public equals(other: PlanTier): boolean {
    return this.value === other.value;
  }

  public toString(): PlanTierType {
    return this.value;
  }
}
