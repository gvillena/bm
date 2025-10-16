import { DomainError } from '../../shared/domain.error.js';

export function ensureAuthIdAvailable(isTaken: boolean, authId: string): void {
  if (isTaken) {
    throw new DomainError('Auth identifier is already in use', 'AUTH_ID_TAKEN', { authId });
  }
}
