import { User } from '../entities/user.entity.js';
import type { UserProps } from '../entities/user.entity.js';

export class UserFactory {
  public static rehydrate(props: UserProps): User {
    return User.create(props);
  }
}
