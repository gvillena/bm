import type { Redaction } from "../types.js";

/**
 * Aplica una política de whitelisting sobre un recurso. Los campos no listados se omiten.
 */
export function applyWhitelist<T extends Record<string, unknown>>(resource: T, allow: readonly string[]): Partial<T> {
  const result: Partial<T> = {};
  for (const key of allow) {
    if (Object.prototype.hasOwnProperty.call(resource, key)) {
      (result as Record<string, unknown>)[key] = resource[key];
    }
  }
  return result;
}

/**
 * Verifica que la redacción sólo permita campos existentes en el recurso original.
 */
export function isWhitelistSafe<T extends Record<string, unknown>>(resource: T, redaction: Redaction): boolean {
  return redaction.allow.every((key: string) => Object.prototype.hasOwnProperty.call(resource, key));
}
