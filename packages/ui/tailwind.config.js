import animatePlugin from "tailwindcss-animate";
const config = {
    content: ["./src/**/*.{ts,tsx}", "../**/src/**/*.{ts,tsx}"],
    darkMode: ["class", '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                background: "var(--bm-bg)",
                foreground: "var(--bm-fg)",
                accent: "var(--bm-accent)",
                danger: "var(--bm-danger)"
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)"
            },
            spacing: {
                xs: "var(--space-xs)",
                sm: "var(--space-sm)",
                md: "var(--space-md)",
                lg: "var(--space-lg)",
                xl: "var(--space-xl)"
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)"
            },
            zIndex: {
                modal: "var(--z-modal)",
                overlay: "var(--z-overlay)",
                toast: "var(--z-toast)"
            },
            transitionTimingFunction: {
                "bm-snappy": "var(--easing-snappy)",
                "bm-emphasized": "var(--easing-emphasized)"
            }
        }
    },
    plugins: [animatePlugin]
};
export default config;
