import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { Invitation } from '../entities/invitation.entity.js';

export interface InvitationRepository {
  findById(id: Identifier): Promise<Invitation | null> | Invitation | null;
  findPendingByUsers(from: Identifier, to: Identifier): Promise<Invitation | null> | Invitation | null;
  save(invitation: Invitation): Promise<void> | void;
}
