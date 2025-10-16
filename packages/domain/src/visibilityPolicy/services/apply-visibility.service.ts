import type { VisibilityLevelType } from '../../shared/value-objects/visibility-level.vo.js';
import type { Moment } from '../../moment/entities/moment.entity.js';
import type { VisibilityPolicy } from '../entities/visibilityPolicy.entity.js';

export function projectMomentByVisibility(
  policy: VisibilityPolicy,
  level: VisibilityLevelType,
  moment: Moment
): Partial<Record<'intention' | 'format' | 'duration' | 'careRules' | 'intimacyFrameId', unknown>> {
  const layer = policy.layers[level];
  const projection: Record<string, unknown> = {};
  for (const key of layer.show) {
    switch (key) {
      case 'intention':
        projection.intention = moment.intention;
        break;
      case 'format':
        projection.format = moment.format;
        break;
      case 'duration':
        projection.duration = moment.duration;
        break;
      case 'careRules':
        projection.careRules = moment.careRules;
        break;
      case 'intimacyPossible':
        projection.intimacyFrameId = moment.intimacyFrameId;
        break;
      default:
        break;
    }
  }
  return projection;
}
