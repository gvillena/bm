import { DomainError } from '../../shared/domain.error.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import { Timestamp } from '../../shared/value-objects/timestamp.vo.js';

export interface AgreementVersionProps {
  version: number;
  text: string;
  createdAt: Timestamp;
  createdBy: Identifier;
}

export class AgreementVersion {
  private constructor(private readonly props: AgreementVersionProps) {}

  public static create(props: AgreementVersionProps): AgreementVersion {
    if (!Number.isInteger(props.version) || props.version <= 0) {
      throw new DomainError('Agreement version must be positive integer', 'INVALID_AGREEMENT_VERSION');
    }
    if (props.text.trim().length === 0) {
      throw new DomainError('Agreement version text cannot be empty', 'EMPTY_AGREEMENT_VERSION');
    }
    return new AgreementVersion({ ...props, text: props.text.trim() });
  }

  public get version(): number {
    return this.props.version;
  }

  public get text(): string {
    return this.props.text;
  }

  public get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  public get createdBy(): Identifier {
    return this.props.createdBy;
  }
}
