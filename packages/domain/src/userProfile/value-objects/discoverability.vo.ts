import { DomainError } from '../../shared/domain.error.js';

export interface DiscoverabilityProps {
  searchable: boolean;
  score?: number;
}

export class Discoverability {
  private constructor(private readonly props: DiscoverabilityProps) {}

  public static create(props: DiscoverabilityProps): Discoverability {
    if (typeof props.searchable !== 'boolean') {
      throw new DomainError('Discoverability searchable flag must be boolean', 'INVALID_DISCOVERABILITY');
    }
    if (props.score !== undefined) {
      if (!Number.isFinite(props.score) || props.score < 0 || props.score > 100) {
        throw new DomainError('Discoverability score must be between 0 and 100', 'INVALID_DISCOVERABILITY_SCORE', {
          score: props.score,
        });
      }
    }
    return new Discoverability({ searchable: props.searchable, score: props.score });
  }

  public equals(other: Discoverability): boolean {
    return this.props.searchable === other.props.searchable && this.props.score === other.props.score;
  }

  public get searchable(): boolean {
    return this.props.searchable;
  }

  public get score(): number | undefined {
    return this.props.score;
  }
}
