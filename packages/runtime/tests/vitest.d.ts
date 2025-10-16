declare module "vitest" {
  export const describe: (name: string, fn: () => void | Promise<void>) => void;
  export const it: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: (value: unknown) => {
    toBe: (expected: unknown) => void;
    toEqual: (expected: unknown) => void;
    toContain: (expected: unknown) => void;
    toBeInstanceOf: (ctor: new (...args: any[]) => unknown) => void;
    toHaveBeenCalledTimes: (expected: number) => void;
    toBeTruthy: () => void;
    toBeDefined: () => void;
  };
  export const vi: {
    fn: <T extends (...args: any[]) => any>(impl?: T) => T & { mock: { calls: unknown[][] }; mockImplementation: (impl: T) => void };
  };
}
