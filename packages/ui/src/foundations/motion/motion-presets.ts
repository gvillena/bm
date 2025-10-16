/**
 * Presets de motion alineados con tokens BM (definidos en tailwind.config.css)
 * - Easing y duraciones exportadas para usar en JS (p.ej., Framer o transiciones CSS-in-JS).
 * - Utilidades para componer estilos inline o atributos de animación.
 */

export const EASING = {
  standard: "cubic-bezier(.2, .0, .2, 1)",
  emphasis: "cubic-bezier(.2, .0, 0, 1)",
} as const;

export const DURATION = {
  xS: 120,
  s: 180,
  m: 240,
} as const;

export type EasingKey = keyof typeof EASING;
export type DurationKey = keyof typeof DURATION;

export function ms(n: number): string {
  return `${n}ms`;
}

/**
 * Construye una transición CSS estándar para propiedades comunes.
 * Ej.: transition("opacity, transform", "standard", "s")
 */
export function transition(
  properties: string | string[],
  easing: EasingKey = "standard",
  duration: DurationKey = "s"
): string {
  const props = Array.isArray(properties) ? properties.join(", ") : properties;
  return `${props} ${ms(DURATION[duration])} ${EASING[easing]}`;
}

/**
 * Pequeños helpers para estilos inline (ej. style={{ transition: transitionIn() }})
 */
export function transitionIn(): string {
  return transition(["opacity", "transform"], "standard", "s");
}

export function transitionOut(): string {
  return transition(["opacity", "transform"], "standard", "xS");
}
