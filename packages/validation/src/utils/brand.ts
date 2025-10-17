/**
 * Nominal typing helpers to ensure IDs remain opaque outside their context.
 */
export type Brand<K extends string> = { readonly __brand: K };
export type Branded<T, K extends string> = T & Brand<K>;

export const asBranded = <T, K extends string>(value: T): Branded<T, K> => value as Branded<T, K>;

export const createBrander = <K extends string>() => <T>(value: T) => asBranded<T, K>(value);
