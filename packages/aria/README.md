# @bm/aria

Beneficio Mutuo ARIA (Assistive Relational Intelligence & Agency) ofrece un sistema de presencia ético y configurable que acompaña a las experiencias del runtime sin reemplazar decisiones humanas. El paquete incluye núcleo headless, guardrails, estrategias de intent y hooks de React para integrar paneles asistivos, acciones embebidas o experiencias inmersivas.

## Características principales

- **Presence Controller** con presupuesto configurable y guardrails contra lenguaje antropomórfico o promesas de intimidad.
- **Intents relacionales** determinísticos (`coCreateMoment`, `reviewLimits`, `explainStep`, `safeIntervention`, `celebrateProgress`).
- **Prompts estáticos** (`COPY`) y formatter orientado a i18n sin dependencias de LLM.
- **Adapters** para runtime, políticas y capas opcionales como voz o SDK.
- **Hooks de React** (`useAriaPresence`, `useAriaDirectives`, `useAriaIntent`) para integrar UI sin acoplar la implementación visual.
- **Telemetría opt-in** (`AriaTelemetry`) para auditar uso y guardrails.

## Instalación

```sh
pnpm add @bm/aria
```

> El paquete asume `@bm/runtime` y `@bm/policies` disponibles dentro del monorepo.

## Uso básico

```ts
import {
  PresenceController,
  PresenceBudget,
  defaultGuardrails,
  consoleTelemetry
} from "@bm/aria";

const controller = new PresenceController({
  budget: new PresenceBudget({ perMinute: 3, perNode: 2, backoffMs: 15_000 }),
  guardrails: defaultGuardrails,
  telemetry: consoleTelemetry
});

runtime.on("nodeEnter", (evt) => {
  const ui = controller.onRuntimeEvent(
    { type: "didEnter", payload: { nodeId: evt.node.id }, timestamp: Date.now() },
    { viewerContext, policySnapshotId: evt.policySnapshotId, nodeId: evt.node.id, policyDecision: evt.policyDecision }
  );
  if (ui) {
    renderUiDirectives(ui);
  }
});

// Ejecutar un intent desde la UI (panel asistivo)
const ui = controller.handleIntent("coCreateMoment", {
  viewerContext,
  node: { id: currentNode.id, kind: currentNode.kind },
  policyDecision
});
applyUiDirectives(ui);
```

### Integración con React

```tsx
import { AriaPresenceProvider, useAriaDirectives, useAriaIntent } from "@bm/aria";

function AriaPanel() {
  const { directives } = useAriaDirectives();
  if (!directives) return null;
  return (
    <aside>
      {directives.hints?.map((hint) => (
        <p key={hint}>{hint}</p>
      ))}
    </aside>
  );
}

function ComposeMomentButton(props: { viewerContext: ViewerContext; node: SceneNodeSummary }) {
  const { trigger } = useAriaIntent({ viewerContext: props.viewerContext, node: props.node });
  return (
    <button onClick={() => trigger("coCreateMoment")}>Recibir guía</button>
  );
}

<AriaPresenceProvider controller={controller}>
  <AriaPanel />
  <ComposeMomentButton viewerContext={viewerContext} node={{ id: "moment-1" }} />
</AriaPresenceProvider>
```

## Telemetría

Implementa la interfaz `AriaTelemetry` para captar eventos:

- `onPresenceShown(event)` con `graphId`, `nodeId`, `policySnapshotId`, `level` y `aura`.
- `onDismissed(event)` cuando el usuario cierra o pausa la intervención.
- `onIntentHandled(intentName)` cada vez que se procesa un intent.
- `onGuardrail(code)` cuando se aplica un guardrail (útil para auditorías).

## Desarrollo y pruebas

```sh
pnpm -F @bm/aria build
pnpm -F @bm/aria test
```

Las pruebas unitarias se ejecutan con Vitest con cobertura mínima del 90% en líneas, ramas, funciones y sentencias.
