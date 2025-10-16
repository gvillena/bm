import { DomainError } from '../../shared/domain.error.js';

export interface AgreementClauseProps {
  key: string;
  title: string;
  body: string;
  required: boolean;
}

export class AgreementClause {
  private constructor(private readonly props: AgreementClauseProps) {}

  public static create(props: AgreementClauseProps): AgreementClause {
    if (!props.key.trim()) {
      throw new DomainError('Clause key cannot be empty', 'INVALID_CLAUSE_KEY');
    }
    if (!props.title.trim()) {
      throw new DomainError('Clause title cannot be empty', 'INVALID_CLAUSE_TITLE');
    }
    if (!props.body.trim()) {
      throw new DomainError('Clause body cannot be empty', 'INVALID_CLAUSE_BODY');
    }
    return new AgreementClause({ ...props, key: props.key.trim(), title: props.title.trim(), body: props.body.trim() });
  }

  public get key(): string {
    return this.props.key;
  }

  public get title(): string {
    return this.props.title;
  }

  public get body(): string {
    return this.props.body;
  }

  public get required(): boolean {
    return this.props.required;
  }
}
