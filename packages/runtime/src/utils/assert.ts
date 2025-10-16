export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

export const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) {
    throw new AssertionError(message);
  }
};
