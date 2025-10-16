import { Moment } from '../entities/moment.entity.js';
import type { MomentProps } from '../entities/moment.entity.js';
import { validateMomentProps } from '../services/moment-validation.service.js';

export class MomentFactory {
  public static create(props: MomentProps): Moment {
    validateMomentProps(props);
    return Moment.create(props);
  }

  public static rehydrate(props: MomentProps): Moment {
    return Moment.create(props);
  }
}
