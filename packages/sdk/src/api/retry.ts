import { exponentialBackoffDelay, sleep } from "../utils/time.js";
import { isRetryableError } from "../types/errors.js";

export interface RetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

export interface RetryContext {
  attempt: number;
  error?: unknown;
  response?: Response;
}

const DEFAULT_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 300,
  maxDelayMs: 5_000,
};

export type ShouldRetry = (ctx: RetryContext) => boolean;

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  shouldRetry: ShouldRetry,
  policy: RetryPolicy = DEFAULT_POLICY,
  signal?: AbortSignal,
  onRetry?: (ctx: RetryContext, delayMs: number) => void,
): Promise<T> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt < policy.maxAttempts) {
    attempt += 1;
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      const context: RetryContext = { attempt, error };
      if (!shouldRetry(context) || attempt >= policy.maxAttempts) {
        throw error;
      }
      const delay = exponentialBackoffDelay({
        baseDelayMs: policy.baseDelayMs,
        maxDelayMs: policy.maxDelayMs,
        attempt,
      });
      onRetry?.(context, delay);
      await sleep(delay, signal);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Retry attempts exhausted");
}

export async function withRetryForResponse(
  operation: (attempt: number) => Promise<Response>,
  shouldRetry: ShouldRetry,
  policy: RetryPolicy = DEFAULT_POLICY,
  signal?: AbortSignal,
  onRetry?: (ctx: RetryContext, delayMs: number) => void,
): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < policy.maxAttempts) {
    attempt += 1;
    try {
      const response = await operation(attempt);
      if (response.ok) {
        return response;
      }
      const context: RetryContext = { attempt, response };
      if (!shouldRetry(context) || attempt >= policy.maxAttempts) {
        return response;
      }
      const retryAfter = response.headers.get("retry-after");
      let delay: number;
      if (retryAfter) {
        const parsed = Number(retryAfter);
        delay = Number.isFinite(parsed) ? parsed * 1000 : policy.baseDelayMs;
      } else {
        delay = exponentialBackoffDelay({
          baseDelayMs: policy.baseDelayMs,
          maxDelayMs: policy.maxDelayMs,
          attempt,
        });
      }
      onRetry?.(context, delay);
      await sleep(delay, signal);
    } catch (error) {
      lastError = error;
      const context: RetryContext = { attempt, error };
      if (!shouldRetry(context) || attempt >= policy.maxAttempts) {
        throw error;
      }
      const delay = exponentialBackoffDelay({
        baseDelayMs: policy.baseDelayMs,
        maxDelayMs: policy.maxDelayMs,
        attempt,
      });
      onRetry?.(context, delay);
      await sleep(delay, signal);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Retry attempts exhausted");
}

export const retryableShouldRetry: ShouldRetry = ({ error, response }) => {
  if (response) {
    const retryableStatus = response.status >= 500 || response.status === 429;
    if (retryableStatus) return true;
  }
  return isRetryableError(error);
};
