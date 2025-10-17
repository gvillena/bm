# @bm/validation

`@bm/validation` centraliza los contratos de validación runtime de Beneficio Mutuo.
Ofrece esquemas [Zod](https://github.com/colinhacks/zod) compartidos entre servidor y
cliente, mapeadores idempotentes entre entidades de dominio y DTOs redactados por
whitelist, además de generadores de documentación OpenAPI/JSON Schema.

## Problema que resuelve

El ecosistema BM opera sobre acuerdos y momentos sensibles. La coherencia entre
servicios, SDK y presencia requiere una única fuente de verdad para:

- Validar inputs/outputs críticos con invariantes explícitas.
- Garantizar redacción por whitelist antes de exponer datos a clientes.
- Exportar contratos formales (OpenAPI/JSON Schema) para integraciones.

## Uso

### En el servidor (API Gateway / BFF)

```ts
import { CreateMomentRequest, MomentPrivateDTO, schemaVersion } from "@bm/validation";

const parseResult = CreateMomentRequest.safeParse(incomingPayload);
if (!parseResult.success) {
  throw new BadRequestError(parseResult.error);
}

const draftMoment = fromCreateInput(parseResult.data.body);
const dto = toPrivateDTO(momentDomainEntity);
```

- Las decisiones de autorización permanecen en `@bm/policies` y en los servicios
  de backend. Este paquete **no** concede permisos; sólo valida y transforma.
- `schemaVersion` permite versionar respuestas externas y detectar breaking changes.

### En el cliente (SDK / runtime / aria)

Los DTOs publicados son seguros para renderizado en navegador o presencia, gracias
al esquema de redacción.

```ts
import { MomentPublicDTO } from "@bm/validation";

type MomentTeaser = z.infer<typeof MomentPublicDTO>;
```

Los contratos de requests/response conservan la semántica de auditoría (por ejemplo,
`auditId`) para flujos sensibles.

## Generación de documentación

```bash
pnpm --filter @bm/validation build
pnpm --filter @bm/validation gen:openapi
pnpm --filter @bm/validation gen:jsonschema
```

- `openapi.json` expone 5+ endpoints clave con ejemplos narrativos.
- `schemas.json` entrega un bundle de JSON Schemas útil para validación offline.

## Política de versionado

- SemVer controlado desde `package.json`.
- `schemaVersion` (en `src/version.ts`) se incrementa cuando los DTOs públicos cambian.
- Breaking changes requieren sincronizar SDK/runtime/policies y comunicar en
  changelog centralizado.

## Garantías e invariantes

- Validación runtime obligatoria antes de serializar respuestas externas.
- Redacción por whitelist para toda vista pública/teaser.
- Duraciones, formatos y texto seguro (`SafeText`) con límites explícitos.
- Intimidad siempre representada como **posibilidad**, nunca promesa contractual.

## Tests

- Unit tests para esquemas críticos (moment, agreement, decisions) y contratos.
- Property-based testing asegurando que la redacción nunca filtra campos fuera del allow.
- Cobertura mínima 90% (configurada en Vitest).

## Breaking change policy

Mantener compatibilidad con SSR/Node/Browser. Cualquier adición de campo obligatorio
requiere una nueva versión mayor de `@bm/validation` y actualización de consumidores.
