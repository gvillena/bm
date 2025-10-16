export type Ok<T> = { ok: true; value: T };
export type Err<E extends RuntimeErrorLike> = { ok: false; error: E };

export type Result<T, E extends RuntimeErrorLike> = Ok<T> | Err<E>;

export interface RuntimeErrorLike {
  readonly code: string;
  readonly message: string;
  readonly meta?: Record<string, unknown>;
}

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E extends RuntimeErrorLike>(error: E): Err<E> => ({ ok: false, error });

export const isOk = <T, E extends RuntimeErrorLike>(result: Result<T, E>): result is Ok<T> =>
  result.ok;

export const isErr = <T, E extends RuntimeErrorLike>(result: Result<T, E>): result is Err<E> =>
  !result.ok;
