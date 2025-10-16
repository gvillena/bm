declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function expect(value: unknown): {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toContain(expected: unknown): void;
    toBeNull(): void;
    toBeTruthy(): void;
    toBeDefined(): void;
    toBeGreaterThan(expected: number): void;
  };
  const vi: {
    fn<T extends (...args: any[]) => any>(impl?: T): T & {
      mock: { calls: unknown[][] };
      mockImplementation(nextImpl: T): void;
    };
  };
}

export {};
