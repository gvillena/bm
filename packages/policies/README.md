# @bm/policies

Motor de evaluación de políticas determinista para experiencias de Beneficio Mutuo.

## Instalación

```bash
pnpm add @bm/policies
```

## Uso rápido

```ts
import { authorizeViewMoment, evaluateERD } from '@bm/policies';

const decision = authorizeViewMoment(
  {
    viewerContext: {
      role: 'viewer',
      tier: 'FREE',
      relation: 'invited',
      reciprocityScore: 'mid',
      careScore: 'mid',
      emotionalState: 'calm',
      consentState: 'valid'
    },
    resource: {
      id: 'moment-1',
      teaser: 'Conversación consciente',
      details: 'Espacio para compartir desde el cuidado',
      visibility: 'INVITE_ONLY'
    },
    now: new Date()
  }
);

if (decision.effect === 'PERMIT') {
  // Render experiencia optimista mientras el servidor confirma la acción.
}
```

> **Nota:** el servidor siempre es la autoridad final. Este paquete sólo entrega decisiones optimistas y obligaciones para sincronizar con el consent-ledger.

## Scripts

- `pnpm build` compila los artefactos ESM en `dist/`.
- `pnpm test` compila el paquete y ejecuta la suite de reglas, resolvers y pruebas de propiedades con el runner nativo de Node.

## Telemetría

Puedes inyectar un `PolicyTelemetry` para recolectar métricas no sensibles.

```ts
const decision = authorizeViewMoment(input, telemetry);
```

Donde `telemetry.onEvaluate(policyName, effect, meta)` recibirá información agregada de cada evaluación.

## Desarrollo

El código está escrito en TypeScript estricto y no realiza I/O. Las funciones son puras, deterministas y libres de efectos secundarios.
