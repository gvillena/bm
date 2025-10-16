import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { AuditLog } from '../entities/auditLog.entity.js';

export interface AuditRepository {
  findById(id: Identifier): Promise<AuditLog | null> | AuditLog | null;
  findBySubject(subjectType: string, subjectId: Identifier): Promise<AuditLog[]> | AuditLog[];
  save(entry: AuditLog): Promise<void> | void;
}
