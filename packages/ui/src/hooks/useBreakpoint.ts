import * as React from "react";

/**
 * Lee los breakpoints desde CSS variables definidas en @theme:
 * --breakpoint-sm, --breakpoint-md, --breakpoint-lg, --breakpoint-xl, --breakpoint-2xl
 * Devuelve booleans de ">= breakpoint" y el nombre del breakpoint actual.
 */

const BP_VARS = [
  "--breakpoint-sm",
  "--breakpoint-md",
  "--breakpoint-lg",
  "--breakpoint-xl",
  "--breakpoint-2xl",
] as const;
type BPName = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

function readVar(name: string): string | null {
  if (typeof document === "undefined") return null;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return v?.trim() || null;
}

function toQuery(value: string) {
  // value viene como "64rem" o "1024px" — usamos width >= value
  return `(width >= ${value})`;
}

export function useBreakpoint() {
  const [matches, setMatches] = React.useState(() => {
    const out: Record<BPName, boolean> = {
      base: true,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      "2xl": false,
    };
    if (typeof window === "undefined" || !window.matchMedia) return out;
    const vals = BP_VARS.map((v) => readVar(v));
    const mqs = vals.map((v) => (v ? window.matchMedia(toQuery(v)) : null));
    out.sm = !!mqs[0]?.matches;
    out.md = !!mqs[1]?.matches;
    out.lg = !!mqs[2]?.matches;
    out.xl = !!mqs[3]?.matches;
    out["2xl"] = !!mqs[4]?.matches;
    return out;
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const vals = BP_VARS.map((v) => readVar(v));
    const mqs = vals.map((v) => (v ? window.matchMedia(toQuery(v)) : null));

    const handler = () => {
      setMatches({
        base: true,
        sm: !!mqs[0]?.matches,
        md: !!mqs[1]?.matches,
        lg: !!mqs[2]?.matches,
        xl: !!mqs[3]?.matches,
        "2xl": !!mqs[4]?.matches,
      });
    };

    mqs.forEach((mq) => mq?.addEventListener?.("change", handler));
    handler();
    return () =>
      mqs.forEach((mq) => mq?.removeEventListener?.("change", handler));
  }, []);

  const current: BPName = matches["2xl"]
    ? "2xl"
    : matches.xl
      ? "xl"
      : matches.lg
        ? "lg"
        : matches.md
          ? "md"
          : matches.sm
            ? "sm"
            : "base";

  return { ...matches, current };
}
