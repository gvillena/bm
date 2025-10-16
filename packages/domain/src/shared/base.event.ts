import { Timestamp } from './value-objects/timestamp.vo.js';
import type { Identifier } from './value-objects/identifier.vo.js';

export abstract class BaseDomainEvent<TPayload extends object> {
  public readonly id: Identifier;
  public readonly occurredAt: Timestamp;
  public readonly payload: Readonly<TPayload>;

  protected constructor(params: { id: Identifier; occurredAt?: Timestamp; payload: TPayload }) {
    this.id = params.id;
    this.occurredAt = params.occurredAt ?? Timestamp.now();
    this.payload = Object.freeze({ ...params.payload });
  }

  public abstract get name(): string;
}
