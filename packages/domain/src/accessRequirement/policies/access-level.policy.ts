import { DomainError } from '../../shared/domain.error.js';
import type { AccessRequirement } from '../entities/accessRequirement.entity.js';

export function ensureAccessRequirementsValid(requirements: readonly AccessRequirement[]): void {
  for (const requirement of requirements) {
    if (requirement.type === 'history' && requirement.value.minSharedMoments < 0) {
      throw new DomainError('History requirement must be non-negative', 'INVALID_HISTORY_REQUIREMENT');
    }
  }
}
