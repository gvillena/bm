import { DomainError } from '../../shared/domain.error.js';
import type { ConsentTimelineEntry } from '../entities/consent.entity.js';

const allowedTransitions: Record<string, string[]> = {
  granted: ['paused', 'revoked'],
  paused: ['granted', 'revoked'],
  withheld: ['granted', 'revoked'],
  revoked: [],
};

export function ensureConsentTransition(previous: ConsentTimelineEntry, next: ConsentTimelineEntry): void {
  const allowed = allowedTransitions[previous.state.toString()] ?? [];
  if (!allowed.includes(next.state.toString())) {
    throw new DomainError('Invalid consent transition', 'INVALID_CONSENT_TRANSITION', {
      from: previous.state.toString(),
      to: next.state.toString(),
    });
  }
}
