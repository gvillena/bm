import { DomainError } from '../../shared/domain.error.js';
import { Invitation } from '../entities/invitation.entity.js';
import { ensureInvitationTransition } from '../policies/invitation-policy.js';

export function transitionInvitation(invitation: Invitation, next: 'accepted' | 'declined' | 'expired'): Invitation {
  ensureInvitationTransition(invitation.status.toString(), next);
  switch (next) {
    case 'accepted':
      return invitation.accept();
    case 'declined':
      return invitation.decline();
    case 'expired':
      return invitation.expire();
    default:
      throw new DomainError('Unsupported invitation transition', 'UNSUPPORTED_INVITATION_TRANSITION', { next });
  }
}
