import { Link as RouterLink, type LinkProps } from "react-router-dom";
import type { ComponentType } from "react";

export function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-foreground/50">404</p>
      <h1 className="text-3xl font-semibold text-foreground">No encontramos esa escena</h1>
      <p className="max-w-lg text-sm text-foreground/70">
        Podés volver al inicio o seguir explorando desde tu panel. Ningún compromiso se ejecutó sin tu consentimiento.
      </p>
      <RouterLinkCompat
        to="/"
        className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Volver al inicio
      </RouterLinkCompat>
    </section>
  );
}

const RouterLinkCompat = RouterLink as ComponentType<LinkProps>;
