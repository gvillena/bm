import type { z } from "zod";

export type InferSchema<T extends z.ZodTypeAny> = z.infer<T>;
export type OutputSchema<T extends z.ZodTypeAny> = z.output<T>;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
