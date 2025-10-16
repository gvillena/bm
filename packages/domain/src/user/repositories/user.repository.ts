import type { Identifier } from '../../shared/value-objects/identifier.vo.js';
import type { User } from '../entities/user.entity.js';

export interface UserRepository {
  findById(id: Identifier): Promise<User | null> | User | null;
  findByAuthId(authId: string): Promise<User | null> | User | null;
  save(user: User): Promise<void> | void;
}
