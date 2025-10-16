import { Consent } from '../entities/consent.entity.js';
import type { ConsentTimelineEntry } from '../entities/consent.entity.js';
import { ensureConsentTransition } from '../policies/consent-ledger.policy.js';

export function appendConsentEntry(consent: Consent, entry: ConsentTimelineEntry): Consent {
  const lastEntry = consent.timeline[consent.timeline.length - 1];
  ensureConsentTransition(lastEntry, entry);
  return consent.appendState(entry);
}
