/**
 * Escala tipográfica recomendada (clamp) para un sistema oscuro y legible.
 * No impone clases Tailwind — se usa en lógica JS o como referencia para inline styles.
 * (Las clases Tailwind seguirán siendo la vía principal en componentes.)
 */

export type TypeToken =
  | "display"
  | "headline"
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "overline";

export type TypeScale = Record<
  TypeToken,
  { fontSize: string; lineHeight: number }
>;

export const TYPE_SCALE: TypeScale = {
  display: {
    fontSize: "clamp(2.25rem, 1.6rem + 2.2vw, 3.25rem)",
    lineHeight: 1.1,
  },
  headline: {
    fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.5rem)",
    lineHeight: 1.15,
  },
  title: {
    fontSize: "clamp(1.375rem, 1.05rem + 0.8vw, 1.75rem)",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "clamp(1.125rem, 1.0rem + 0.3vw, 1.25rem)",
    lineHeight: 1.3,
  },
  body: {
    fontSize: "clamp(1rem, 0.95rem + 0.15vw, 1.0625rem)",
    lineHeight: 1.5,
  },
  caption: { fontSize: "0.875rem", lineHeight: 1.35 },
  overline: { fontSize: "0.75rem", lineHeight: 1.25 },
};

export function getTypeStyle(token: TypeToken): {
  fontSize: string;
  lineHeight: number;
} {
  return TYPE_SCALE[token];
}

/**
 * Helper para aplicar con inline style en componentes especiales (ej. hero):
 *   const h = getTypeCSS("headline");
 *   <h1 style={h}>...</h1>
 */
export function getTypeCSS(token: TypeToken): React.CSSProperties {
  const s = getTypeStyle(token);
  return { fontSize: s.fontSize, lineHeight: s.lineHeight };
}
