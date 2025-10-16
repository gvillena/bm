/**
 * Helpers de tema (BM por defecto en dark), con fallback SSR-safe.
 * - Usa data-theme="dark" | "light"
 * - Guarda preferencia en localStorage ("bm:theme")
 * - Sincroniza cambios vía 'storage' y 'bm:theme-change'
 */

const THEME_STORAGE_KEY = "bm:theme";
const THEME_ATTR = "data-theme";
const CONTRAST_ATTR = "data-contrast";
const CONTRAST_STORAGE_KEY = "bm:contrast"; // "high" | "normal"

export type ThemeName = "light" | "dark";
export type ContrastMode = "normal" | "high";

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

function safeDoc(): Document | null {
  return isBrowser ? document : null;
}
function safeWin(): Window | null {
  return isBrowser ? window : null;
}

export function getSystemTheme(): ThemeName {
  const w = safeWin();
  if (!w || !w.matchMedia) return "dark"; // BM por defecto
  return w.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getStoredTheme(): ThemeName | null {
  const w = safeWin();
  if (!w) return null;
  try {
    const v = w.localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
    return null;
  } catch {
    return null;
  }
}

export function getTheme(): ThemeName {
  return getStoredTheme() ?? getSystemTheme();
}

export function setTheme(
  theme: ThemeName,
  { persist = true }: { persist?: boolean } = {}
): void {
  const d = safeDoc();
  if (!d) return;
  d.documentElement.setAttribute(THEME_ATTR, theme);
  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }
  dispatchThemeChange(theme);
}

export function toggleTheme(): ThemeName {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

export function ensureThemeInitialized(): ThemeName {
  const theme = getTheme();
  const d = safeDoc();
  if (d) d.documentElement.setAttribute(THEME_ATTR, theme);
  return theme;
}

/* -------- Contraste (A11y) -------- */

export function getContrast(): ContrastMode {
  const w = safeWin();
  if (!w) return "normal";
  try {
    const v = w.localStorage.getItem(CONTRAST_STORAGE_KEY);
    return v === "high" ? "high" : "normal";
  } catch {
    return "normal";
  }
}

export function setContrast(
  mode: ContrastMode,
  { persist = true }: { persist?: boolean } = {}
): void {
  const d = safeDoc();
  if (!d) return;
  d.documentElement.setAttribute(CONTRAST_ATTR, mode);
  if (persist) {
    try {
      window.localStorage.setItem(CONTRAST_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }
  dispatchContrastChange(mode);
}

export function ensureContrastInitialized(): ContrastMode {
  const c = getContrast();
  const d = safeDoc();
  if (d) d.documentElement.setAttribute(CONTRAST_ATTR, c);
  return c;
}

/* -------- Reduced Motion (A11y) -------- */

export function prefersReducedMotion(): boolean {
  const w = safeWin();
  if (!w || !w.matchMedia) return false;
  return w.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* -------- Eventos & sincronización entre pestañas -------- */

type ThemeChangeDetail = { theme: ThemeName };
type ContrastChangeDetail = { contrast: ContrastMode };

const THEME_EVENT = "bm:theme-change";
const CONTRAST_EVENT = "bm:contrast-change";

function dispatchThemeChange(theme: ThemeName) {
  const w = safeWin();
  if (!w) return;
  w.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(THEME_EVENT, { detail: { theme } })
  );
}

function dispatchContrastChange(contrast: ContrastMode) {
  const w = safeWin();
  if (!w) return;
  w.dispatchEvent(
    new CustomEvent<ContrastChangeDetail>(CONTRAST_EVENT, {
      detail: { contrast },
    })
  );
}

export function onThemeChange(cb: (theme: ThemeName) => void): () => void {
  const w = safeWin();
  if (!w) return () => {};
  const handler = (e: Event) => {
    const ev = e as CustomEvent<ThemeChangeDetail>;
    if (ev.detail?.theme) cb(ev.detail.theme);
  };
  w.addEventListener(THEME_EVENT, handler);
  // sync via storage
  const storageHandler = (e: StorageEvent) => {
    if (
      e.key === THEME_STORAGE_KEY &&
      (e.newValue === "light" || e.newValue === "dark")
    ) {
      cb(e.newValue);
    }
  };
  w.addEventListener("storage", storageHandler);
  return () => {
    w.removeEventListener(THEME_EVENT, handler);
    w.removeEventListener("storage", storageHandler);
  };
}

export function onContrastChange(
  cb: (contrast: ContrastMode) => void
): () => void {
  const w = safeWin();
  if (!w) return () => {};
  const handler = (e: Event) => {
    const ev = e as CustomEvent<ContrastChangeDetail>;
    if (ev.detail?.contrast) cb(ev.detail.contrast);
  };
  w.addEventListener(CONTRAST_EVENT, handler);
  const storageHandler = (e: StorageEvent) => {
    if (
      e.key === CONTRAST_STORAGE_KEY &&
      (e.newValue === "high" || e.newValue === "normal")
    ) {
      cb(e.newValue);
    }
  };
  w.addEventListener("storage", storageHandler);
  return () => {
    w.removeEventListener(CONTRAST_EVENT, handler);
    w.removeEventListener("storage", storageHandler);
  };
}

/* -------- Inicialización recomendada -------- */

/**
 * Llamar temprano (por ejemplo, en el entry de la app) para:
 * - aplicar data-theme, data-contrast
 * - respetar el sistema si no hay preferencia guardada
 */
export function initFoundations(): {
  theme: ThemeName;
  contrast: ContrastMode;
} {
  const theme = ensureThemeInitialized();
  const contrast = ensureContrastInitialized();
  return { theme, contrast };
}
