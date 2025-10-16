import { DomainError } from '../../shared/domain.error.js';
import type { InvitationStatusType } from '../value-objects/invitation-status.vo.js';

const transitions: Record<InvitationStatusType, InvitationStatusType[]> = {
  pending: ['accepted', 'declined', 'expired'],
  accepted: [],
  declined: [],
  expired: [],
};

export function ensureInvitationTransition(current: InvitationStatusType, next: InvitationStatusType): void {
  if (!transitions[current].includes(next)) {
    throw new DomainError('Invalid invitation status transition', 'INVALID_INVITATION_TRANSITION', {
      from: current,
      to: next,
    });
  }
}
