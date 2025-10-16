import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { Moment } from '../entities/moment.entity.js';

export interface MomentRepository {
  findById(id: Identifier): Promise<Moment | null> | Moment | null;
  findByOwner(ownerId: Identifier): Promise<Moment[]> | Moment[];
  save(moment: Moment): Promise<void> | void;
}
