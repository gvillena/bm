import { BaseEntity } from '../../shared/base.entity.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';

export interface IntimacyFrameProps {
  id: Identifier;
  ownerId: Identifier;
  allowed: string;
  prohibited: string;
  negotiable: string;
  requiresLiveConsent: boolean;
}

export class IntimacyFrame extends BaseEntity<IntimacyFrameProps> {
  private constructor(props: IntimacyFrameProps) {
    super(props);
  }

  public static create(props: IntimacyFrameProps): IntimacyFrame {
    if (props.negotiable.trim().length > 0) {
      ensure(() => props.requiresLiveConsent, 'Negotiable items require live consent', 'MISSING_LIVE_CONSENT');
    }
    return new IntimacyFrame({ ...props, allowed: props.allowed.trim(), prohibited: props.prohibited.trim(), negotiable: props.negotiable.trim() });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get ownerId(): Identifier {
    return this.props.ownerId;
  }

  public get allowed(): string {
    return this.props.allowed;
  }

  public get prohibited(): string {
    return this.props.prohibited;
  }

  public get negotiable(): string {
    return this.props.negotiable;
  }

  public get requiresLiveConsent(): boolean {
    return this.props.requiresLiveConsent;
  }
}
