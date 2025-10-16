import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type Theme = "light" | "dark" | "system";
type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

function applyTheme(t: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  const isDark = t === "dark" || (t === "system" && prefersDark);
  root.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("bm_theme") as Theme) || "system";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("bm_theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
