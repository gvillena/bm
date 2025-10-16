import * as React from "react";

export function useReducedMotion(): boolean {
  const get = () =>
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [reduced, setReduced] = React.useState(get);

  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return reduced;
}
