import { DomainError } from '../../shared/domain.error.js';
import { Discoverability } from '../value-objects/discoverability.vo.js';

export function ensureDiscoverabilityConsistency(discoverability: Discoverability): void {
  if (!discoverability.searchable && discoverability.score !== undefined) {
    throw new DomainError('Non-searchable profiles cannot have a discoverability score', 'INVALID_DISCOVERABILITY');
  }
}
