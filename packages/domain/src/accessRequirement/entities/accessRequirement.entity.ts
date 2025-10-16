import { DomainError } from '../../shared/domain.error.js';
import { PlanTier } from '../../shared/value-objects/plan-tier.vo.js';
import { ReciprocityScore } from '../../shared/value-objects/reciprocity-score.vo.js';
import { VerificationLevel } from '../../shared/value-objects/verification-level.vo.js';

export type AccessRequirement =
  | { type: 'plan'; value: PlanTier }
  | { type: 'verification'; value: VerificationLevel }
  | { type: 'reciprocity'; value: ReciprocityScore }
  | { type: 'history'; value: { minSharedMoments: number } }
  | { type: 'manualApproval'; value: true };

export function createHistoryRequirement(minSharedMoments: number): AccessRequirement {
  if (!Number.isInteger(minSharedMoments) || minSharedMoments < 0) {
    throw new DomainError('History requirement must be a non-negative integer', 'INVALID_HISTORY_REQUIREMENT', {
      minSharedMoments,
    });
  }
  return { type: 'history', value: { minSharedMoments } };
}

export function createManualApprovalRequirement(): AccessRequirement {
  return { type: 'manualApproval', value: true };
}
