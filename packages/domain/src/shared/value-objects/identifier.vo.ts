import { DomainError } from '../domain.error.js';

const IDENTIFIER_REGEX = /^[0-9A-Za-z_-]{10,}$/;

export class Identifier {
  private constructor(private readonly value: string) {}

  public static create(value: string): Identifier {
    if (typeof value !== 'string' || !IDENTIFIER_REGEX.test(value)) {
      throw new DomainError('Identifier must be a valid non-empty string', 'INVALID_IDENTIFIER', {
        value,
      });
    }
    return new Identifier(value);
  }

  public static generate(generator: () => string): Identifier {
    return Identifier.create(generator());
  }

  public static equals(a: Identifier, b: Identifier): boolean {
    return a.value === b.value;
  }

  public equals(other: Identifier): boolean {
    return Identifier.equals(this, other);
  }

  public toString(): string {
    return this.value;
  }
}
