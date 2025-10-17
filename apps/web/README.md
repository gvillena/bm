# Beneficio Mutuo – Web Experience

Front-end cinematográfico de Beneficio Mutuo construido con React 18, Vite y TypeScript estricto.

## Requisitos previos

- Node.js >= 20
- pnpm (el monorepo utiliza workspace)

## Variables de entorno

Copiá `.env.example` en `.env.local` y ajustá según tu entorno:

```bash
cp .env.example .env.local
```

- `VITE_API_BASE_URL`: endpoint base para el SDK HTTP
- `VITE_OTEL_EXPORTER_URL`: colector OTLP para traces
- `VITE_APP_ENV`: environment lógico (`development`, `staging`, etc.)

## Scripts

```bash
pnpm install        # instala dependencias del monorepo
pnpm --filter @bm/web dev      # modo desarrollo
pnpm --filter @bm/web build    # build de producción
pnpm --filter @bm/web preview  # previsualizar build
pnpm --filter @bm/web test     # unit + coverage
pnpm --filter @bm/web test:a11y  # auditoría axe
pnpm --filter @bm/web test:e2e   # pruebas Playwright (requiere servidor)
```

## Arquitectura

- `src/app`: shell, layout cinematográfico, router, providers
- `src/experience`: definición de grafos y adaptadores del runtime
- `src/scenes`: escenas cinemáticas por ruta
- `src/services`: SDK HTTP, telemetry, policies helpers
- `src/motion`: presets Framer Motion + orquestador GSAP
- `src/utils`: helpers de entorno, accesibilidad y IDs
- `tests`: unitarios (Vitest), accesibilidad (vitest-axe) y E2E (Playwright)

## Observabilidad y seguridad

- OpenTelemetry (traces OTLP) con propagación `x-trace-id` y `x-audit-id`
- Telemetría del runtime/ARIA sin PII
- Respeto de `prefers-reduced-motion` + toggle accesible en Settings

## Desarrollo de escenas

- Usa `ExperienceBoundary` para montar grafos declarativos (`onboarding`, `moment`, `agreementOffer`, `safe`)
- Integrá `SceneRenderer` y componentes de `@bm/ui` (`AriaPanel`, `AgreementReview`, `ERDSimulator`)
- Animaciones micro con presets en `motion/presets.ts` y secuencias GSAP vía `gsap-orchestrator`

## Testing

- `vitest` con cobertura ≥85%
- `vitest-axe` para accesibilidad en Home y Settings
- Playwright (specs en `tests/e2e`) para flows principales

## Deploy

La build genera assets en `dist/`. Asegurate de publicar junto a los tokens de diseño de `@bm/ui` y configurar el colector OTLP accesible.
