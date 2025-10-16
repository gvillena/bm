// ─────────────────────────────────────────────────────────────────────────────
// @bm/ui – Entry point (exports públicos)
// Mantener este archivo como contrato estable (SEMVER).
// ─────────────────────────────────────────────────────────────────────────────

// Opcional: NO auto-importamos estilos para evitar side-effects.
// Importa en la app:
//   import "@bm/ui/src/styles/style.css";

// Components (shadcn/ui)
export * from "./components/ui/button";
export * from "./components/ui/input";
export * from "./components/ui/textarea";
export * from "./components/ui/select";
export * from "./components/ui/checkbox";
export * from "./components/ui/radio-group";
export * from "./components/ui/switch";
export * from "./components/ui/slider";
export * from "./components/ui/badge";
export * from "./components/ui/avatar";
export * from "./components/ui/tooltip";
export * from "./components/ui/separator";
export * from "./components/ui/dialog";
export * from "./components/ui/drawer";
export * from "./components/ui/popover";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/hover-card";
export * from "./components/ui/sonner"; // o "./components/ui/toaster" si usas sonner wrapper
export * from "./components/ui/table";
export * from "./components/ui/card";
export * from "./components/ui/tabs";
export * from "./components/ui/breadcrumb";
export * from "./components/ui/pagination";
export * from "./components/ui/progress";
export * from "./components/ui/skeleton";

// Patterns (opcionales, genéricos – sin dominio)
export * from "./components/patterns/command-palette/command";
export * from "./components/patterns/forms/field";
export * from "./components/patterns/forms/fieldset";
export * from "./components/patterns/forms/helpers";
export * from "./components/patterns/lists/master-detail";
export * from "./components/patterns/lists/item-actions";

// Presence (indicadores neutros)
export { PresenceIndicator } from "./presence/PresenceIndicator";
export { MessageHint } from "./presence/MessageHint";

// Providers
export { ThemeProvider, useTheme } from "./providers/ThemeProvider";
export {
  PortalProvider,
  Portal,
  usePortalContainer,
} from "./providers/PortalProvider";
export { ToastProvider, toast } from "./providers/ToastProvider";

// A11y (helpers agnósticos)
export * from "./a11y";

// Foundations (tema/contraste, motion, tipografía, colores)
export * from "./foundations";

// Hooks utilitarios
export { usePortal } from "./hooks/usePortal";
export { useReducedMotion } from "./hooks/useReducedMotion";
export { useBreakpoint } from "./hooks/useBreakpoint";
export { useOutsideClick } from "./hooks/useOutsideClick";

// Lib (utils esperados por shadcn/ui: cn, etc.)
export * from "./lib";

// Utils adicionales del package
export * from "./utils/ids";
export * from "./utils/merge-refs";
export * from "./utils/keybinds";
