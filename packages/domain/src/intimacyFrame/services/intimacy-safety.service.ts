import { ensureConsentState } from '../policies/intimacy-consent.policy.js';
import type { IntimacyFrame } from '../entities/intimacyFrame.entity.js';

export function assessIntimacySafety(frame: IntimacyFrame, consentGranted: boolean): boolean {
  ensureConsentState(frame.requiresLiveConsent, consentGranted);
  return consentGranted || !frame.requiresLiveConsent;
}
