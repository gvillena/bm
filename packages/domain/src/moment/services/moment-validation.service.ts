import { ensureMomentCareRulesLimit, ensureMomentRequirementsConsistent } from '../policies/moment-creation.policy.js';
import type { MomentProps } from '../entities/moment.entity.js';

export function validateMomentProps(props: MomentProps): void {
  ensureMomentCareRulesLimit(props.careRules);
  ensureMomentRequirementsConsistent(props.accessRequirements);
}
