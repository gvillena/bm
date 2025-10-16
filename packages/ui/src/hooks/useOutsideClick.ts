import * as React from "react";

type MaybeRef<T> = React.RefObject<T> | T | null | undefined;

function toElement<T extends Element>(ref: MaybeRef<T>): T | null {
  if (!ref) return null;
  if (ref instanceof Element) return ref;
  if ("current" in (ref as any)) return (ref as React.RefObject<T>).current;
  return null;
}

export interface UseOutsideClickOptions<T extends Element = HTMLElement> {
  ref: React.RefObject<T> | T | null;
  handler: (event: MouseEvent | TouchEvent) => void;
  ignored?: MaybeRef<Element>[]; // elementos/refs a ignorar
  enabled?: boolean;
  capture?: boolean; // por defecto true para early interception
}

export function useOutsideClick<T extends Element = HTMLElement>({
  ref,
  handler,
  ignored = [],
  enabled = true,
  capture = true,
}: UseOutsideClickOptions<T>) {
  React.useEffect(() => {
    if (!enabled) return;
    const el = toElement(ref);
    if (!el) return;

    const isIgnored = (target: EventTarget | null) =>
      ignored.some((r) => {
        const ig = toElement(r);
        return ig
          ? ig === target ||
              (target instanceof Node && ig.contains(target as Node))
          : false;
      });

    const listener = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (isIgnored(t)) return;
      if (el === t || el.contains(t)) return;
      handler(e);
    };

    document.addEventListener("pointerdown", listener as any, { capture });
    return () =>
      document.removeEventListener("pointerdown", listener as any, { capture });
  }, [ref, handler, ignored, enabled, capture]);
}
