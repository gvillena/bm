import type { AgreementClause } from '../value-objects/agreement-clause.vo.js';

export interface AgreementDiff {
  added: AgreementClause[];
  removed: AgreementClause[];
  changed: AgreementClause[];
}

export function diffClauses(previous: readonly AgreementClause[], next: readonly AgreementClause[]): AgreementDiff {
  const prevMap = new Map(previous.map((clause) => [clause.key, clause] as const));
  const nextMap = new Map(next.map((clause) => [clause.key, clause] as const));

  const added: AgreementClause[] = [];
  const removed: AgreementClause[] = [];
  const changed: AgreementClause[] = [];

  for (const [key, clause] of nextMap) {
    if (!prevMap.has(key)) {
      added.push(clause);
      continue;
    }
    const prevClause = prevMap.get(key)!;
    if (prevClause.body !== clause.body || prevClause.required !== clause.required || prevClause.title !== clause.title) {
      changed.push(clause);
    }
  }

  for (const [key, clause] of prevMap) {
    if (!nextMap.has(key)) {
      removed.push(clause);
    }
  }

  return { added, removed, changed };
}
