import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { Agreement } from '../entities/agreement.entity.js';

export interface AgreementRepository {
  findById(id: Identifier): Promise<Agreement | null> | Agreement | null;
  findByMomentId(momentId: Identifier): Promise<Agreement | null> | Agreement | null;
  save(agreement: Agreement): Promise<void> | void;
}
