/**
 * Utilities for dealing with resilient timers.
 */
export function now(): number {
  return Date.now();
}

/**
 * Sleeps for the given amount of milliseconds.
 */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

export interface BackoffOptions {
  baseDelayMs: number;
  maxDelayMs: number;
  attempt: number;
  jitter?: boolean;
}

/**
 * Calculates an exponential backoff delay with optional jitter.
 */
export function exponentialBackoffDelay({
  baseDelayMs,
  maxDelayMs,
  attempt,
  jitter = true,
}: BackoffOptions): number {
  const expo = baseDelayMs * Math.pow(2, attempt - 1);
  const capped = Math.min(expo, maxDelayMs);
  if (!jitter) {
    return capped;
  }
  const randomness = Math.random() * 0.4 + 0.8; // full jitter within +/-20%
  return Math.min(maxDelayMs, Math.round(capped * randomness));
}
