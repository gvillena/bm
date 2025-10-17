import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeState = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeState | undefined>(undefined);

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.theme = theme;
}

export interface ThemeProviderProps {
  readonly children: React.ReactNode;
  readonly initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme = "system" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setThemeState("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const value = useMemo<ThemeState>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

export { resolveTheme };
export type { Theme };
