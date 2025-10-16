# @bm/sdk

SDK tipado, resiliente y observable para conectar aplicaciones cliente con la plataforma Beneficio Mutuo.

## Instalación

```bash
pnpm add @bm/sdk @tanstack/react-query
```

Asegúrate de que `react` y `react-dom` estén disponibles como peer dependencies.

## Uso básico

```ts
import { HttpClient } from "@bm/sdk";
import { createMomentsClient } from "@bm/sdk";
import { createRuntimeAdapter } from "@bm/sdk/adapters/runtime.adapter";
import { createAriaAdapter } from "@bm/sdk/adapters/aria.adapter";
import { useMoment, useAuthorizeViewMoment } from "@bm/sdk/hooks";

const http = new HttpClient({ baseURL: import.meta.env.VITE_API_URL });
const moments = createMomentsClient(http);
const policies = createPoliciesClient(http);
const consent = createConsentClient(http);

export const runtimeEffects = createRuntimeAdapter({ moments, policies, consent });

function MomentView({ id, vc }: { id: string; vc: ViewerContext }) {
  const { data: moment } = useMoment(id);
  const { data: auth } = useAuthorizeViewMoment(vc, id);

  if (auth?.effect === "DENY") return <DeniedView reasons={auth.reasons} />;
  if (auth?.effect === "REDACT") return <TeaserView data={auth.dto} />;

  return <FullView data={auth?.dto ?? moment} />;
}
```

## Observabilidad

El cliente HTTP genera `traceId` por petición, expone `requestId` cuando el backend lo envía y emite eventos al subsistema de telemetría configurado.

## Manejo de errores

Los errores se normalizan en una jerarquía tipada (`NetworkError`, `APIError`, `ConsentError`, `PolicyError`). Usa `instanceof` y la propiedad `code` para diferenciar causas comunes (timeouts, rate limits, denegaciones de política).

## Troubleshooting

- **429 Too Many Requests**: el cliente aplica backoff exponencial. Ajusta `maxAttempts` si tu UI necesita reaccionar antes.
- **Policy DENY/REDACT**: revisa `decision.reasons` y `decision.obligations` en el resultado de `authorize*`.
- **Consent Required**: al recibir `ConsentError`, guía al usuario para completar la obligación y reintenta la acción.

## Testing

El paquete incluye pruebas de integración utilizando `msw` y utilidades de React Query. Ejecuta `pnpm test --filter @bm/sdk` para validar el comportamiento.
