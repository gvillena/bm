export function applyWhitelist<T extends Record<string, unknown>>(
  obj: T,
  allow: readonly (keyof T & string)[]
): Partial<T> {
  const objKeys = new Set(Object.keys(obj));
  for (const field of allow) {
    if (!objKeys.has(field)) {
      throw new Error(`Campo no disponible para redacción: ${String(field)}`);
    }
  }

  return allow.reduce<Partial<T>>((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}
