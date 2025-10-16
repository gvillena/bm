/**
 * Runtime assertion helper to keep invariants explicit and avoid silent failures.
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Creates an exhaustive check utility to ensure discriminated unions stay aligned with runtime logic.
 */
export function exhaustiveCheck(_value: never, message: string): never {
  throw new Error(message);
}
