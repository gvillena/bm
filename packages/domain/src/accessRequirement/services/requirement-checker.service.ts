import type { ViewerContext } from '../../shared/utils/domain.types.js';
import { PlanTier } from '../../shared/value-objects/plan-tier.vo.js';
import { VerificationLevel } from '../../shared/value-objects/verification-level.vo.js';
import type { Moment } from '../../moment/entities/moment.entity.js';
import type { AccessRequirement } from '../entities/accessRequirement.entity.js';

function meetsPlanRequirement(context: ViewerContext, requirement: AccessRequirement): boolean {
  if (requirement.type !== 'plan') return true;
  if (!context.planTier) return false;
  const tiers = PlanTier.allowed as readonly string[];
  return tiers.indexOf(context.planTier) >= tiers.indexOf(requirement.value.toString());
}

function meetsVerificationRequirement(context: ViewerContext, requirement: AccessRequirement): boolean {
  if (requirement.type !== 'verification') return true;
  return (context.verificationLevel ?? 0) >= requirement.value.toNumber();
}

function meetsReciprocityRequirement(context: ViewerContext, requirement: AccessRequirement): boolean {
  if (requirement.type !== 'reciprocity') return true;
  return (context.reciprocityScore ?? 0) >= requirement.value.toNumber();
}

function meetsHistoryRequirement(context: ViewerContext, requirement: AccessRequirement): boolean {
  if (requirement.type !== 'history') return true;
  return (context.sharedMoments ?? 0) >= requirement.value.minSharedMoments;
}

function meetsManualApproval(context: ViewerContext, requirement: AccessRequirement, moment: Moment): boolean {
  if (requirement.type !== 'manualApproval') return true;
  return context.roles.includes('approved:' + moment.id.toString());
}

export function requirementChecker(context: ViewerContext, moment: Moment): boolean {
  return moment.accessRequirements.every((requirement) =>
    meetsPlanRequirement(context, requirement) &&
    meetsVerificationRequirement(context, requirement) &&
    meetsReciprocityRequirement(context, requirement) &&
    meetsHistoryRequirement(context, requirement) &&
    meetsManualApproval(context, requirement, moment)
  );
}
