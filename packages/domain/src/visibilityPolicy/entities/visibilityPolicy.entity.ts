import { BaseEntity } from '../../shared/base.entity.js';
import { DomainError } from '../../shared/domain.error.js';
import { ensure } from '../../shared/utils/domain.guard.js';
import { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { VisibilityLevelType } from '../../shared/value-objects/visibility-level.vo.js';

export type VisibilityLayerKey = 'intention' | 'format' | 'duration' | 'careRules' | 'intimacyPossible';

export type VisibilityLayers = Record<VisibilityLevelType, { show: VisibilityLayerKey[] }>;

const orderedLevels: VisibilityLevelType[] = ['public', 'invited', 'approved', 'private'];

function ensureMonotonicLayers(layers: VisibilityLayers): void {
  for (let i = 1; i < orderedLevels.length; i++) {
    const previous = new Set(layers[orderedLevels[i - 1]].show);
    const current = new Set(layers[orderedLevels[i]].show);
    for (const item of previous) {
      ensure(() => current.has(item), 'Visibility layers must be monotonic', 'NON_MONOTONIC_VISIBILITY');
    }
  }
}

function ensurePublicLayerSafe(layer: { show: VisibilityLayerKey[] }): void {
  const restricted: VisibilityLayerKey[] = ['careRules', 'intimacyPossible'];
  for (const item of layer.show) {
    if (restricted.includes(item)) {
      throw new DomainError('Public layer cannot expose sensitive fields', 'PUBLIC_LAYER_RESTRICTION', { field: item });
    }
  }
}

export interface VisibilityPolicyProps {
  id: Identifier;
  ownerId: Identifier;
  layers: VisibilityLayers;
}

export class VisibilityPolicy extends BaseEntity<VisibilityPolicyProps> {
  private constructor(props: VisibilityPolicyProps) {
    super(props);
  }

  public static create(props: VisibilityPolicyProps): VisibilityPolicy {
    ensurePublicLayerSafe(props.layers.public);
    ensureMonotonicLayers(props.layers);
    return new VisibilityPolicy({ ...props, layers: { ...props.layers } });
  }

  public get id(): Identifier {
    return this.props.id;
  }

  public get ownerId(): Identifier {
    return this.props.ownerId;
  }

  public get layers(): VisibilityLayers {
    return { ...this.props.layers };
  }
}
