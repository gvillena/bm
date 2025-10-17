import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { schemaVersion } from "../version";
import {
  CreateMomentRequest,
  CreateMomentResponse,
  GetMomentResponse,
  PublishMomentResponse,
  SimulateERDResponse
} from "../contracts/moments.contract";
import {
  AuthorizeViewMomentRequest,
  AuthorizeViewMomentResponse,
  PolicySnapshotResponse
} from "../contracts/policies.contract";
import { ConfirmConsentRequest, ConfirmConsentResponse } from "../contracts/consent.contract";
import { SubscribeRequest, SubscribeResponse } from "../contracts/payments.contract";
import { SendNotificationRequest, SendNotificationResponse } from "../contracts/notifications.contract";

const registry = new OpenAPIRegistry();
const schemaMap = new Map<string, z.ZodTypeAny>();

const register = <T extends z.ZodTypeAny>(name: string, schema: T) => {
  schemaMap.set(name, schema);
  registry.register(name, schema);
};

const registerSchemas = () => {
  register("CreateMomentRequest", CreateMomentRequest);
  register("CreateMomentResponse", CreateMomentResponse);
  register("GetMomentResponse", GetMomentResponse);
  register("PublishMomentResponse", PublishMomentResponse);
  register("SimulateERDResponse", SimulateERDResponse);
  register("AuthorizeViewMomentRequest", AuthorizeViewMomentRequest);
  register("AuthorizeViewMomentResponse", AuthorizeViewMomentResponse);
  register("PolicySnapshotResponse", PolicySnapshotResponse);
  register("ConfirmConsentRequest", ConfirmConsentRequest);
  register("ConfirmConsentResponse", ConfirmConsentResponse);
  register("SubscribeRequest", SubscribeRequest);
  register("SubscribeResponse", SubscribeResponse);
  register("SendNotificationRequest", SendNotificationRequest);
  register("SendNotificationResponse", SendNotificationResponse);
};

const registerPaths = () => {
  registry.registerPath({
    method: "post",
    path: "/moments",
    description: "Crea un Moment donde la intimidad es posibilidad, no promesa.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateMomentRequest.shape.body,
            example: {
              intention: "Caminar para conversar con calma",
              format: "walk",
              duration: 60
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: "Moment creado con éxito",
        content: {
          "application/json": {
            schema: CreateMomentResponse,
            example: { id: "00000000-0000-0000-0000-000000000000", auditId: "aud-1234567890" }
          }
        }
      }
    }
  });

  registry.registerPath({
    method: "get",
    path: "/moments/{id}",
    description: "Obtiene un Moment con detalles completos según políticas activas.",
    request: {
      params: z.object({ id: z.string().uuid() })
    },
    responses: {
      200: {
        description: "Moment completo",
        content: { "application/json": { schema: GetMomentResponse } }
      }
    }
  });

  registry.registerPath({
    method: "post",
    path: "/moments/{id}/publish",
    description: "Publica un Moment y genera auditoría.",
    request: {
      params: z.object({ id: z.string().uuid() })
    },
    responses: {
      202: {
        description: "Publicación en curso",
        content: { "application/json": { schema: PublishMomentResponse } }
      }
    }
  });

  registry.registerPath({
    method: "post",
    path: "/moments/{id}/simulate-erd",
    description: "Simula la ERD para un viewer hipotético.",
    request: {
      params: z.object({ id: z.string().uuid() })
    },
    responses: {
      200: {
        description: "Resultado de simulación",
        content: { "application/json": { schema: SimulateERDResponse } }
      }
    }
  });

  registry.registerPath({
    method: "post",
    path: "/policies/moments/{id}/authorize-view",
    description: "Evalúa si un viewer puede acceder a un Moment.",
    request: {
      body: {
        content: { "application/json": { schema: AuthorizeViewMomentRequest } }
      }
    },
    responses: {
      200: {
        description: "Decisión de política",
        content: { "application/json": { schema: AuthorizeViewMomentResponse } }
      }
    }
  });

  registry.registerPath({
    method: "post",
    path: "/consent/confirm",
    description: "Confirma o revoca el consentimiento, registrando la razón.",
    request: { body: { content: { "application/json": { schema: ConfirmConsentRequest } } } },
    responses: {
      200: {
        description: "Consentimiento registrado",
        content: { "application/json": { schema: ConfirmConsentResponse } }
      }
    }
  });

  registry.registerPath({
    method: "post",
    path: "/payments/subscribe",
    description: "Suscribe a un plan de cuidado.",
    request: { body: { content: { "application/json": { schema: SubscribeRequest } } } },
    responses: {
      202: {
        description: "Suscripción aceptada",
        content: { "application/json": { schema: SubscribeResponse } }
      }
    }
  });

};

registerSchemas();
registerPaths();

const generator = new OpenApiGeneratorV3(registry.definitions);

export const buildOpenApiDocument = () =>
  generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Beneficio Mutuo Validation",
      version: schemaVersion,
      description: "Contratos validados para Moments, Agreements y políticas."
    },
    paths: {},
    servers: [{ url: "https://api.beneficiomutuo.example" }]
  });

export const buildJsonSchemas = () => {
  const schemas: Record<string, unknown> = {};
  for (const [name, schema] of schemaMap.entries()) {
    schemas[name] = zodToJsonSchema(schema, name, {
      basePath: ["#/components/schemas"],
      effectStrategy: "preprocess"
    });
  }
  return schemas;
};

const runCli = () => {
  const command = process.argv[2];
  if (command === "jsonschema") {
    const schemas = buildJsonSchemas();
    process.stdout.write(JSON.stringify(schemas, null, 2));
  }
};

runCli();
