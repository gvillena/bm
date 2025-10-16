import * as React from "react";
import {
  getTheme,
  setTheme,
  toggleTheme,
  onThemeChange,
  getContrast,
  setContrast,
  onContrastChange,
  prefersReducedMotion,
  type ThemeName,
  type ContrastMode,
  initFoundations,
} from "../foundations/theme/theme-switching";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
  contrast: ContrastMode;
  setContrast: (c: ContrastMode) => void;
  reducedMotion: boolean;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Si se pasa, forzamos el tema. Si no, respetamos preferencia persistida o del sistema.
   */
  forceTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, forceTheme }) => {
  const [themeState, setThemeState] = React.useState<ThemeName>(() => initFoundations().theme);
  const [contrast, setContrastState] = React.useState<ContrastMode>(() => getContrast());
  const [reducedMotion, setReducedMotion] = React.useState(prefersReducedMotion());

  // Forzar si se pasa prop
  React.useEffect(() => {
    if (forceTheme) {
      setTheme(forceTheme);
      setThemeState(forceTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceTheme]);

  // Suscripción a cambios (entre pestañas / llamadas directas)
  React.useEffect(() => {
    const offTheme = onThemeChange((t) => setThemeState(t));
    const offContrast = onContrastChange((c) => setContrastState(c));
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onRM = () => setReducedMotion(prefersReducedMotion());
    mq?.addEventListener?.("change", onRM);
    return () => {
      offTheme();
      offContrast();
      mq?.removeEventListener?.("change", onRM);
    };
  }, []);

  const value = React.useMemo<ThemeContextValue>(() => ({
    theme: themeState,
    setTheme: (t) => setTheme(t),
    toggleTheme: () => toggleTheme(),
    contrast,
    setContrast: (c) => setContrast(c),
    reducedMotion,
  }), [themeState, contrast, reducedMotion]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
