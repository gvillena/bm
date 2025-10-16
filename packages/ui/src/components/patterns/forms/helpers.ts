/**
 * Helpers ligeros para formularios accesibles.
 */

export function composeDescribedBy(
  ...ids: Array<string | undefined | null>
): string | undefined {
  const list = ids.filter(Boolean) as string[];
  return list.length ? list.join(" ") : undefined;
}

/** Marca requerido de manera semántica (útil cuando no controlas el label) */
export function requiredMark(label: string, mark = " *"): string {
  return `${label}${mark}`;
}

/** Normaliza error en string desde distintas fuentes */
export function errorToString(err: unknown): string {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
