import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { Consent } from '../entities/consent.entity.js';

export interface ConsentRepository {
  findBySubject(subjectType: Consent['subjectType'], subjectId: Identifier): Promise<Consent | null> | Consent | null;
  save(consent: Consent): Promise<void> | void;
}
