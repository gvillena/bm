import { DomainError } from '../../shared/domain.error.js';

export function ensureConsentState(needsLiveConsent: boolean, consentGranted: boolean): void {
  if (needsLiveConsent && !consentGranted) {
    throw new DomainError('Live consent required for negotiable intimacy items', 'LIVE_CONSENT_REQUIRED');
  }
}
