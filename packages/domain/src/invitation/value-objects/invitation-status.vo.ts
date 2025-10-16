import { DomainError } from '../../shared/domain.error.js';

export type InvitationStatusType = 'pending' | 'accepted' | 'declined' | 'expired';

export class InvitationStatus {
  private constructor(private readonly value: InvitationStatusType) {}

  public static readonly allowed: readonly InvitationStatusType[] = ['pending', 'accepted', 'declined', 'expired'];

  public static create(value: InvitationStatusType): InvitationStatus {
    if (!InvitationStatus.allowed.includes(value)) {
      throw new DomainError('Invalid invitation status', 'INVALID_INVITATION_STATUS', { value });
    }
    return new InvitationStatus(value);
  }

  public equals(other: InvitationStatus): boolean {
    return this.value === other.value;
  }

  public toString(): InvitationStatusType {
    return this.value;
  }
}
