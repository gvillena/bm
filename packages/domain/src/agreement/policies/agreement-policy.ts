import { DomainError } from '../../shared/domain.error.js';
import type { AgreementClause } from '../value-objects/agreement-clause.vo.js';

export function ensureClauseKeysUnique(clauses: readonly AgreementClause[]): void {
  const keys = new Set<string>();
  for (const clause of clauses) {
    if (keys.has(clause.key)) {
      throw new DomainError('Agreement clause keys must be unique', 'DUPLICATE_CLAUSE_KEY', { key: clause.key });
    }
    keys.add(clause.key);
  }
}
