# @bm/ui

Design system for BM experiences aligned with Copilot interaction patterns. The package exposes accessible and composable React components, hooks, and utilities that integrate with the BM domain, runtime, and SDK packages.

## Features

- **Accessible by default** – built on Radix primitives with semantic roles, keyboard support, and `aria-*` wiring.
- **Motion aware** – Framer Motion presets with `prefers-reduced-motion` fallbacks.
- **Dark/Light theming** – CSS variables defined in [`tokens.css`](./src/theme/tokens.css) and a runtime `ThemeProvider`.
- **Runtime integrations** – components talk to `@bm/runtime`, `@bm/aria`, `@bm/policies`, and `@bm/sdk` hooks.
- **Forms with validation** – React Hook Form + `@bm/validation` Zod schemas via `useZodForm`.
- **Testing ready** – Vitest unit tests + axe accessibility coverage.
- **Storybook** – Controls and a11y checks for core and pattern components.

## Usage

```tsx
import {
  ThemeProvider,
  Button,
  Form,
  SceneRenderer,
  AriaPanel,
} from "@bm/ui";
```

Wrap the application with [`UIProviders`](./src/providers/UIProviders.tsx) to enable theming, motion, tooltips, toasts, and command shortcuts.

### Do

- Use hooks from `@bm/sdk` inside data-aware components and wire mutations through callbacks.
- Pass translated strings from your i18n layer; components expect `t()` wrappers or injected text props.
- Respect the `PresenceBudget` props on presence components and avoid showing more than the allowed hints/actions.
- Surface runtime decisions by delegating to `PolicyReasons` when guards deny or redact data.

### Don’t

- Embed un-sanitised rich text. Run UiDirective payloads through the exported `sanitizeText` helper.
- Break focus trapping in dialogs or immersive presence layers; always forward `onClose` and keyboard handlers.
- Trigger network side-effects automatically; expose callbacks like `onConfirmConsent` and call SDK adapters there.

## Examples

Example stories live under `src/demo` and Storybook showcases the following scenarios:

- **AriaPanel + SceneRenderer** – renders a mock runtime with UiDirectives and a consent confirmation CTA.
- **AgreementReview** – immersive comparison of Agreement revisions with safe comments and actions.
- **ERDSimulator** – split-view editor vs. viewer context to visualise PERMIT / REDACT outcomes.
- **VisibilityEditor** – toggle audience layers and preview public vs. invited states.

## Development

```bash
pnpm install
pnpm --filter @bm/ui dev
pnpm --filter @bm/ui test
```

Ensure TS strict mode passes and run the a11y suite before shipping changes.
