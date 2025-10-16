import * as React from "react";

/**
 * Crea (o reutiliza) un contenedor en <body> con id dado.
 * Devuelve el elemento y limpia si es "temporal".
 */
export function usePortal(
  id: string = "bm-portal-root",
  { removeWhenUnmount = false } = {}
) {
  const [el, setEl] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    let container = document.getElementById(id) as HTMLElement | null;
    let created = false;
    if (!container) {
      container = document.createElement("div");
      container.id = id;
      document.body.appendChild(container);
      created = true;
    }
    setEl(container);
    return () => {
      if (removeWhenUnmount && created && container?.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [id, removeWhenUnmount]);

  return el;
}
