import { Agreement } from '../entities/agreement.entity.js';
import type { AgreementProps } from '../entities/agreement.entity.js';
import { ensureClauseKeysUnique } from '../policies/agreement-policy.js';

export class AgreementFactory {
  public static rehydrate(props: AgreementProps): Agreement {
    ensureClauseKeysUnique(props.clauses);
    return Agreement.create(props);
  }
}
