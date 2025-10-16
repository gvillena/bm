import { Agreement } from '../entities/agreement.entity.js';
import type { AgreementProps } from '../entities/agreement.entity.js';
import { ensureClauseKeysUnique } from '../policies/agreement-policy.js';

export function buildAgreement(props: AgreementProps): Agreement {
  ensureClauseKeysUnique(props.clauses);
  return Agreement.create(props);
}
