import { DomainError } from '../domain.error.js';

export class Timestamp {
  private constructor(private readonly value: Date) {}

  public static create(value: Date | string | number): Timestamp {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new DomainError('Invalid timestamp', 'INVALID_TIMESTAMP', { value });
    }
    return new Timestamp(date);
  }

  public static now(): Timestamp {
    return new Timestamp(new Date());
  }

  public equals(other: Timestamp): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  public isFuture(reference: Timestamp = Timestamp.now()): boolean {
    return this.value.getTime() > reference.value.getTime();
  }

  public toDate(): Date {
    return new Date(this.value.getTime());
  }

  public toISOString(): string {
    return this.value.toISOString();
  }
}
