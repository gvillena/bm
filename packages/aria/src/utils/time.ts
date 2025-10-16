/** Duration helpers expressed in milliseconds. */
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

/** Normalizes an epoch timestamp ensuring it is a finite number. */
export function normalizeTimestamp(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Timestamp must be finite, received: ${value}`);
  }
  return Math.trunc(value);
}

/** Returns true when the given timestamp is within the duration window before now. */
export function isWithinWindow(now: number, timestamp: number, duration: number): boolean {
  return timestamp >= now - duration;
}
