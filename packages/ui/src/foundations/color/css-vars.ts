/**
 * Acceso seguro a variables CSS del theme (tokens definidos en tailwind.config.css)
 * Útil cuando necesites leer colores desde JS (ej., gráficos canvas, mapas, etc.)
 */

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

function getRoot(): HTMLElement | null {
  return isBrowser ? (document.documentElement as HTMLElement) : null;
}

export function getCssVar(name: string): string | null {
  const root = getRoot();
  if (!root) return null;
  const styles = getComputedStyle(root);
  // normaliza: si pasan "--color-primary-500" o "color-primary-500"
  const varName = name.startsWith("--") ? name : `--${name}`;
  const v = styles.getPropertyValue(varName);
  return v ? v.trim() : null;
}

/**
 * Sugerencia de tipos para colores principales BM.
 * Amplía según tus necesidades o usa getCssVar con nombre libre.
 */
export type BMColorKey =
  | "color-primary-500"
  | "color-accent-500"
  | "color-text-1"
  | "color-text-2"
  | "color-surface-0"
  | "color-surface-1"
  | "color-surface-2";

export function getBMColor(token: BMColorKey): string | null {
  return getCssVar(token);
}

/**
 * Devuelve un mapa de colores clave listo para consumir (ej. charts).
 */
export function getBMCorePalette(): Record<BMColorKey, string> {
  const keys: BMColorKey[] = [
    "color-primary-500",
    "color-accent-500",
    "color-text-1",
    "color-text-2",
    "color-surface-0",
    "color-surface-1",
    "color-surface-2",
  ];
  const out = {} as Record<BMColorKey, string>;
  keys.forEach((k) => {
    out[k] = getBMColor(k) ?? "";
  });
  return out;
}
