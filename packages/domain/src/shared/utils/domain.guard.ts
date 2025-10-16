import { DomainError } from '../domain.error.js';
import type { GuardCheck, NonEmptyArray } from './domain.types.js';

export function ensure(condition: GuardCheck, message: string, code?: string): void {
  if (!condition()) {
    throw new DomainError(message, code);
  }
}

export function ensureAll(message: string, checks: NonEmptyArray<GuardCheck>, code?: string): void {
  for (const check of checks) {
    if (!check()) {
      throw new DomainError(message, code);
    }
  }
}

export function ensureRange(
  value: number,
  { min, max, message, code }: { min?: number; max?: number; message: string; code?: string }
): void {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new DomainError(message, code);
  }
  if (min !== undefined && value < min) {
    throw new DomainError(message, code);
  }
  if (max !== undefined && value > max) {
    throw new DomainError(message, code);
  }
}
