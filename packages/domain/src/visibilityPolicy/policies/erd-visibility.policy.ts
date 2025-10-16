import { DomainError } from '../../shared/domain.error.js';
import type { VisibilityLayerKey, VisibilityLayers } from '../entities/visibilityPolicy.entity.js';

const allowedKeys: VisibilityLayerKey[] = ['intention', 'format', 'duration', 'careRules', 'intimacyPossible'];

export function ensureVisibilityKeysValid(layers: VisibilityLayers): void {
  for (const layer of Object.values(layers)) {
    for (const key of layer.show) {
      if (!allowedKeys.includes(key)) {
        throw new DomainError('Visibility policy includes unsupported field', 'INVALID_VISIBILITY_FIELD', { key });
      }
    }
  }
}
