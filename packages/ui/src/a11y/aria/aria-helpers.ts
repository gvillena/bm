/**
 * Helpers A11y (agnósticos de framework)
 * - Gestión de atributos ARIA
 * - Regiones en vivo (aria-live) para anuncios "polite"/"assertive"
 * - Roving tabindex (navegación con flechas en listas/menús)
 * - Focus trap básico (encierra el foco dentro de un contenedor)
 */

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

/* ============================================================
 * ARIA ATTRS
 * ============================================================ */
export type AriaAttrs = Partial<{
  role: string;
  label: string; // aria-label
  labelledby: string; // aria-labelledby
  describedby: string; // aria-describedby
  controls: string; // aria-controls
  expanded: boolean; // aria-expanded
  selected: boolean; // aria-selected
  pressed: boolean; // aria-pressed
  modal: boolean; // aria-modal
  hidden: boolean; // aria-hidden
  disabled: boolean; // aria-disabled
  current: string | boolean; // aria-current
  live: "off" | "polite" | "assertive"; // aria-live
  atomic: boolean; // aria-atomic
  busy: boolean; // aria-busy
}>;

export function setAria(el: Element | null, attrs: AriaAttrs): void {
  if (!el) return;
  const map: Record<string, string> = {
    label: "aria-label",
    labelledby: "aria-labelledby",
    describedby: "aria-describedby",
    controls: "aria-controls",
    expanded: "aria-expanded",
    selected: "aria-selected",
    pressed: "aria-pressed",
    modal: "aria-modal",
    hidden: "aria-hidden",
    disabled: "aria-disabled",
    current: "aria-current",
    live: "aria-live",
    atomic: "aria-atomic",
    busy: "aria-busy",
  };
  if (attrs.role != null) el.setAttribute("role", attrs.role);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "role") continue;
    const attr = map[k] ?? k;
    if (v === false || v == null) {
      if (typeof v === "boolean") el.setAttribute(attr, "false");
      else el.removeAttribute(attr);
    } else {
      el.setAttribute(attr, String(v));
    }
  }
}

/* ============================================================
 * LIVE REGIONS
 * ============================================================ */

export type LivePoliteness = "polite" | "assertive";
export interface LiveRegion {
  el: HTMLElement;
  announce: (
    message: string,
    opts?: { clear?: boolean; delayMs?: number }
  ) => void;
  destroy: () => void;
}

/**
 * Crea (o reutiliza) una región aria-live en <body>.
 * - politeness: "polite" (por defecto) o "assertive"
 * - id: útil para evitar duplicados entre montajes.
 */
export function createLiveRegion(
  politeness: LivePoliteness = "polite",
  id?: string
): LiveRegion {
  if (!isBrowser) {
    return {
      el: {} as HTMLElement,
      announce: () => {},
      destroy: () => {},
    };
  }
  const doc = document;

  const existing = id ? (doc.getElementById(id) as HTMLElement | null) : null;
  const el = existing ?? doc.createElement("div");

  if (!existing) {
    if (id) el.id = id;
    el.setAttribute("aria-live", politeness);
    el.setAttribute("aria-atomic", "true");
    el.setAttribute("role", "status");

    // Visualmente oculto pero accesible (sin depender de Tailwind sr-only)
    el.style.position = "fixed";
    el.style.width = "1px";
    el.style.height = "1px";
    el.style.margin = "-1px";
    el.style.padding = "0";
    el.style.overflow = "hidden";
    el.style.clip = "rect(0 0 0 0)";
    el.style.whiteSpace = "nowrap";
    el.style.border = "0";

    doc.body.appendChild(el);
  } else {
    el.setAttribute("aria-live", politeness);
  }

  const announce = (
    message: string,
    opts?: { clear?: boolean; delayMs?: number }
  ) => {
    const { clear = true, delayMs = 0 } = opts ?? {};
    if (clear) el.textContent = ""; // fuerza cambio para lectores
    const write = () => {
      // Truco para asegurar anuncio en screen readers
      el.textContent = message;
    };
    delayMs > 0 ? setTimeout(write, delayMs) : write();
  };

  const destroy = () => {
    if (el.parentNode) el.parentNode.removeChild(el);
  };

  return { el, announce, destroy };
}

// Instancias de conveniencia (singletons perezosos)
let politeRegion: LiveRegion | null = null;
let assertiveRegion: LiveRegion | null = null;

export function announcePolite(
  message: string,
  opts?: { clear?: boolean; delayMs?: number }
) {
  politeRegion = politeRegion ?? createLiveRegion("polite", "bm-live-polite");
  politeRegion.announce(message, opts);
}

export function announceAssertive(
  message: string,
  opts?: { clear?: boolean; delayMs?: number }
) {
  assertiveRegion =
    assertiveRegion ?? createLiveRegion("assertive", "bm-live-assertive");
  assertiveRegion.announce(message, opts);
}

/* ============================================================
 * ROVING TABINDEX
 * ============================================================ */

export interface RovingOptions {
  items: HTMLElement[]; // elementos foco navegables
  loop?: boolean; // wrap al inicio/fin con flechas
  initialIndex?: number; // por defecto 0
  onChangeIndex?: (index: number, el: HTMLElement) => void;
  horizontal?: boolean; // true=usa izquierdo/derecho; false=arriba/abajo
  homeEnd?: boolean; // Home/End salta a primero/último
}

export function setupRovingTabindex(
  container: HTMLElement,
  opts: RovingOptions
): () => void {
  if (!isBrowser || !container) return () => {};
  const {
    items,
    loop = true,
    initialIndex = 0,
    onChangeIndex,
    horizontal = true,
    homeEnd = true,
  } = opts;

  if (!items.length) return () => {};

  let current = Math.min(Math.max(initialIndex, 0), items.length - 1);

  const apply = () => {
    items.forEach((el, i) => {
      el.setAttribute("tabindex", i === current ? "0" : "-1");
      el.setAttribute("aria-selected", i === current ? "true" : "false");
    });
    onChangeIndex?.(current, items[current]);
  };

  apply();

  const onKey = (e: KeyboardEvent) => {
    const key = e.key;
    let next = current;

    const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";

    if (key === prevKey) {
      e.preventDefault();
      next = current - 1;
      if (next < 0) next = loop ? items.length - 1 : 0;
    } else if (key === nextKey) {
      e.preventDefault();
      next = current + 1;
      if (next >= items.length) next = loop ? 0 : items.length - 1;
    } else if (homeEnd && key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (homeEnd && key === "End") {
      e.preventDefault();
      next = items.length - 1;
    } else {
      return;
    }

    if (next !== current) {
      current = next;
      apply();
      items[current].focus();
    }
  };

  const onClick = (e: MouseEvent) => {
    const idx = items.findIndex(
      (el) =>
        el === e.target ||
        (e.target instanceof Node && el.contains(e.target as Node))
    );
    if (idx >= 0) {
      current = idx;
      apply();
    }
  };

  container.addEventListener("keydown", onKey);
  container.addEventListener("click", onClick);

  return () => {
    container.removeEventListener("keydown", onKey);
    container.removeEventListener("click", onClick);
  };
}

/* ============================================================
 * FOCUS TRAP
 * ============================================================ */

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | (() => HTMLElement | null);
  returnFocus?: boolean; // retorna foco al elemento previo
}

/**
 * Encierra el foco dentro de `root` (p. ej. Dialog).
 * - No usa "inert" para mantener compatibilidad amplia.
 * - Soporta Tab / Shift+Tab y retorno de foco opcional.
 */
export function trapFocus(
  root: HTMLElement,
  options: FocusTrapOptions = {}
): () => void {
  if (!isBrowser || !root) return () => {};

  const prevActive = document.activeElement as HTMLElement | null;

  const getFocusable = (): HTMLElement[] => {
    const focusableSelectors = [
      "a[href]",
      "area[href]",
      "input:not([disabled]):not([type='hidden'])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "button:not([disabled])",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(focusableSelectors)
    );
    // filtra ocultos
    return nodes.filter(
      (el) => el.offsetParent !== null || el.getClientRects().length > 0
    );
  };

  const focusFirst = () => {
    const list = getFocusable();
    if (list.length) list[0].focus();
  };

  const { initialFocus, returnFocus = true } = options;
  // Enfocar inicial
  setTimeout(() => {
    let el: HTMLElement | null | undefined;
    el = typeof initialFocus === "function" ? initialFocus() : initialFocus;
    (el ?? root).focus({ preventScroll: true });
    if (!el) focusFirst();
  }, 0);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const list = getFocusable();
    if (!list.length) {
      e.preventDefault();
      root.focus();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  };

  const onFocus = (e: FocusEvent) => {
    if (!root.contains(e.target as Node)) {
      // Reencamina el foco dentro del root
      const list = getFocusable();
      (list[0] ?? root).focus();
    }
  };

  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("focusin", onFocus, true);

  return () => {
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("focusin", onFocus, true);
    if (returnFocus && prevActive && typeof prevActive.focus === "function") {
      prevActive.focus();
    }
  };
}
