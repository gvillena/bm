import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bm-bg)",
        foreground: "var(--bm-fg)",
        accent: "var(--bm-accent)",
        danger: "var(--bm-danger)"
      },
      boxShadow: {
        glow: "var(--shadow-md)",
        cinematic: "var(--shadow-lg)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
