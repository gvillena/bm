import { BaseEntity } from '../../shared/base.entity.js';
import { DomainError } from '../../shared/domain.error.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { ConsentState } from '../../shared/value-objects/consent-state.vo.js';
import { AgreementClause } from '../value-objects/agreement-clause.vo.js';
import { AgreementVersion } from '../value-objects/agreement-version.vo.js';

export type AgreementStatus = 'draft' | 'inReview' | 'locked' | 'finalized';

export interface AgreementProps {
  id: Identifier;
  momentId: Identifier;
  ownerId: Identifier;
  status: AgreementStatus;
  currentVersion: AgreementVersion;
  versions: readonly AgreementVersion[];
  clauses: readonly AgreementClause[];
  consentState?: ConsentState;
}

function ensureVersionsConsistency(currentVersion: AgreementVersion, versions: readonly AgreementVersion[]): void {
  ensure(() => versions.some((version) => version.version === currentVersion.version), 'Current version must exist in versions', 'MISSING_CURRENT_VERSION');
}

export class Agreement extends BaseEntity<AgreementProps> {
  private constructor(props: AgreementProps) {
    super(props);
  }

  public static create(props: AgreementProps): Agreement {
    ensureVersionsConsistency(props.currentVersion, props.versions);
    if (props.status === 'finalized') {
      ensure(() => props.consentState?.toString() === 'granted', 'Finalized agreement requires granted consent', 'CONSENT_REQUIRED');
    }
    return new Agreement({ ...props, versions: [...props.versions], clauses: [...props.clauses] });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get momentId(): Identifier {
    return this.props.momentId;
  }

  public get ownerId(): Identifier {
    return this.props.ownerId;
  }

  public get status(): AgreementStatus {
    return this.props.status;
  }

  public get currentVersion(): AgreementVersion {
    return this.props.currentVersion;
  }

  public get versions(): readonly AgreementVersion[] {
    return [...this.props.versions];
  }

  public get clauses(): readonly AgreementClause[] {
    return [...this.props.clauses];
  }

  public get consentState(): ConsentState | undefined {
    return this.props.consentState;
  }

  public addVersion(version: AgreementVersion): Agreement {
    if (this.status === 'locked' || this.status === 'finalized') {
      throw new DomainError('Cannot add version when agreement is locked or finalized', 'AGREEMENT_LOCKED');
    }
    const versions = [...this.props.versions, version];
    return Agreement.create({ ...this.cloneProps(), versions, currentVersion: version });
  }

  public setStatus(status: AgreementStatus, consentState?: ConsentState): Agreement {
    if (status === 'finalized') {
      ensure(() => consentState?.toString() === 'granted', 'Finalization requires granted consent', 'CONSENT_REQUIRED');
    }
    return Agreement.create({ ...this.cloneProps(), status, consentState: consentState ?? this.consentState });
  }
}
