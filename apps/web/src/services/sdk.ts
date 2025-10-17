import {
  HttpClient,
  configureClients,
  requireClients,
  createMomentsClient,
  createAgreementsClient,
  createPoliciesClient,
  createConsentClient,
  createProfilesClient,
  createInvitationsClient,
  createPaymentsClient,
  createNotificationsClient,
  createRuntimeAdapter,
  createAriaAdapter,
  viewerHeaders
} from "@bm/sdk";
import type { SdkClients } from "@bm/sdk";
import type { FrontendTelemetry } from "@services/telemetry";
import { env } from "@utils/env";

let cached: { http: HttpClient; clients: SdkClients } | null = null;

export function initializeSdk(telemetry: FrontendTelemetry): { http: HttpClient; clients: SdkClients } {
  if (cached) {
    return cached;
  }

  const http = new HttpClient({
    baseURL: env.apiBaseUrl,
    telemetry: telemetry.sdk,
    defaultHeaders: viewerHeaders()
  });

  http.useRequestInterceptor(async (ctx) => {
    const headers = new Headers(ctx.init.headers);
    const { traceId, auditId } = telemetry.createRequestContext();
    headers.set("x-trace-id", traceId);
    headers.set("x-audit-id", auditId);
    headers.set("x-requested-with", "bm-web");
    ctx.init.headers = headers;
    ctx.options.auditId = auditId;
    return ctx;
  });

  const clients: SdkClients = {
    moments: createMomentsClient(http),
    agreements: createAgreementsClient(http),
    policies: createPoliciesClient(http),
    consent: createConsentClient(http),
    profiles: createProfilesClient(http),
    invitations: createInvitationsClient(http),
    payments: createPaymentsClient(http),
    notifications: createNotificationsClient(http)
  };

  configureClients(clients);
  cached = { http, clients };
  return cached;
}

export function getRuntimeEffects() {
  const { clients } = requireClients();
  return createRuntimeAdapter({
    moments: clients.moments,
    policies: clients.policies,
    consent: clients.consent
  });
}

export function getAriaBridge(http: HttpClient) {
  return createAriaAdapter({ client: http });
}
