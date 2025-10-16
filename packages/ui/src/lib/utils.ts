/* Utilidades base esperadas por componentes shadcn/ui
   - Sin dependencias externas (no clsx, no tailwind-merge).
   - `cn` acepta strings, arrays y objetos booleanos (estilo clsx).
   - Helpers comunes para componer handlers, attrs data/aria y runtime checks.
*/

export type ClassInput =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>
  | ClassInput[];

/** Aplana entradas de clases (strings/arrays/objetos) en una sola cadena. */
export function cn(...inputs: ClassInput[]): string {
  const tokens: string[] = [];

  const walk = (val: ClassInput): void => {
    if (!val) return;
    if (typeof val === "string" || typeof val === "number") {
      const v = String(val).trim();
      if (v) tokens.push(v);
      return;
    }
    if (Array.isArray(val)) {
      val.forEach(walk);
      return;
    }
    if (typeof val === "object") {
      for (const [k, flag] of Object.entries(val)) {
        if (flag) tokens.push(k);
      }
    }
  };

  inputs.forEach(walk);

  // Nota: no desduplica clases de Tailwind. Si lo necesitas, puedes
  // integrar "tailwind-merge" aquí en el futuro.
  return tokens.join(" ");
}

/** Componer handlers de eventos sin pisarse entre sí. */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  theirs?: (event: E) => void,
  ours?: (event: E) => void,
  { checkDefaultPrevented = true }: { checkDefaultPrevented?: boolean } = {}
) {
  return (event: E) => {
    theirs?.(event);
    if (checkDefaultPrevented && event.defaultPrevented) return;
    ours?.(event);
  };
}

/** data-attr helper: renderiza `data-*` solo cuando es truthy. */
export function dataAttr(v: unknown): string | undefined {
  return v ? "" : undefined;
}

/** aria-attr helper: renderiza `aria-*` solo cuando es truthy. */
export function ariaAttr(v: unknown): boolean | undefined {
  return v ? true : undefined;
}

/** Runtime checks */
export const isClient =
  typeof window !== "undefined" && typeof document !== "undefined";

/** Espera (Promise) */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Invariante con mensaje de error claro. */
export function invariant(
  cond: unknown,
  message = "Invariant violation"
): asserts cond {
  if (!cond) throw new Error(message);
}

/** Convierte px→rem (asumiendo root 16px por defecto) */
export function pxToRem(px: number, base = 16): string {
  return `${px / base}rem`;
}

/** Clamp numérico */
export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** Genera un id simple y estable en cliente. */
let __id = 0;
export function uid(prefix = "bm"): string {
  __id += 1;
  return `${prefix}-${__id.toString(36)}`;
}
