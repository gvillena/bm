import type { Redaction } from "../types.js";
import { applyWhitelist } from "../utils/redact.js";

/**
 * Aplica una redacción whitelist sobre un recurso.
 */
export function applyRedaction<T extends Record<string, unknown>>(resource: T, redaction: Redaction): Partial<T> {
  return applyWhitelist(resource, redaction.allow);
}
