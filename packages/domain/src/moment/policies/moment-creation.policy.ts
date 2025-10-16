import { DomainError } from '../../shared/domain.error.js';
import type { CareRule } from '../../shared/value-objects/care-rule.vo.js';
import type { AccessRequirement } from '../../accessRequirement/entities/accessRequirement.entity.js';

export function ensureMomentRequirementsConsistent(requirements: readonly AccessRequirement[]): void {
  const seen = new Set<string>();
  for (const requirement of requirements) {
    const key = requirement.type;
    if (seen.has(key) && requirement.type !== 'history') {
      throw new DomainError('Duplicate requirement type', 'DUPLICATE_REQUIREMENT', { type: key });
    }
    seen.add(key);
  }
}

export function ensureMomentCareRulesLimit(rules: readonly CareRule[]): void {
  if (rules.length > 50) {
    throw new DomainError('Too many care rules on moment', 'EXCESSIVE_CARE_RULES');
  }
}
