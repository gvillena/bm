import type { Reason } from "../types.js";

/**
 * Normaliza un arreglo de razones removiendo duplicados por código y detalle.
 */
export function composeReasons(...inputs: Array<Reason | null | undefined | Reason[]>): Reason[] {
  const acc: Reason[] = [];
  const seen = new Set<string>();

  for (const input of inputs) {
    if (!input) continue;
    const items = Array.isArray(input) ? input : [input];
    for (const reason of items) {
      if (!reason) continue;
      const key = `${reason.code}:${reason.detail ?? ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        acc.push(reason);
      }
    }
  }

  return acc;
}
