import {
  HttpClient,
  configureClients,
  createMomentsClient,
  createAgreementsClient,
  createPoliciesClient,
  createConsentClient,
  createProfilesClient,
  createInvitationsClient,
  createPaymentsClient,
  createNotificationsClient,
  createAriaAdapter,
  viewerHeaders
} from "@bm/sdk";
import type {
  AgreementDTO,
  ConsentRecord,
  Decision,
  MomentDTO,
  Page,
  SdkClients,
  TierInfo,
  ViewerContext
} from "@bm/sdk";
import type { FrontendTelemetry } from "@services/telemetry";
import { env } from "@utils/env";
import { createId } from "@utils/ids";

type AriaBridge = ReturnType<typeof createAriaAdapter>;

type DecisionEffect = Decision["effect"];

type MockDecision = Decision & { dto?: MomentDTO };

type MockInvitation = {
  id: string;
  momentId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
};

const MOCK_POLICY_SNAPSHOT_ID = "mock-policy-snapshot";

function deepClone<T>(value: T): T {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function nextAuditId(): string {
  return createId("audit");
}

function nextMomentId(): string {
  return createId("moment");
}

function nextAgreementId(): string {
  return createId("agreement");
}

function nextConsentId(): string {
  return createId("consent");
}

function nextInvitationId(): string {
  return createId("invitation");
}

function nextSubscriptionId(): string {
  return createId("subscription");
}

function resolvePolicyEffect(viewerContext: ViewerContext, moment: MomentDTO): DecisionEffect {
  const override =
    typeof viewerContext.featureFlags?.mockPolicyEffect === "string"
      ? viewerContext.featureFlags.mockPolicyEffect
      : undefined;
  if (override === "PERMIT" || override === "REDACT" || override === "DENY") {
    return override;
  }

  if (viewerContext.role === "owner" || viewerContext.role === "moderator") {
    return "PERMIT";
  }

  if (viewerContext.role === "participant" || viewerContext.relation === "approved") {
    return "PERMIT";
  }

  if (viewerContext.relation === "invited" || viewerContext.consentState === "stale") {
    return "REDACT";
  }

  if (moment.visibility === "PUBLIC") {
    return "PERMIT";
  }

  return "DENY";
}

function sanitizeHeaders(headers: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).filter(([, value]) => typeof value === "string")
  ) as Record<string, string>;
}

function buildDecision(effect: DecisionEffect, moment: MomentDTO): MockDecision {
  switch (effect) {
    case "PERMIT":
      return {
        effect,
        reasons: [{ code: "ACCESS_GRANTED", detail: "Contenido completo disponible" }],
        dto: deepClone(moment)
      } satisfies MockDecision;
    case "REDACT":
      return {
        effect,
        reasons: [{ code: "TEASER_ONLY", detail: "Se requiere consentimiento vigente" }],
        obligations: [{ code: "COMPLETE_CONSENT" }],
        dto: {
          id: moment.id,
          teaser: moment.teaser,
          visibility: moment.visibility,
          details: typeof moment.details === "string" ? moment.details.slice(0, 160) : undefined
        }
      } satisfies MockDecision;
    default:
      return {
        effect: "DENY",
        reasons: [{ code: "INVITE_ONLY", detail: "Necesitas una invitación activa" }]
      } satisfies MockDecision;
  }
}

function createMockSdkClients(): SdkClients {
  const momentStore = new Map<string, MomentDTO>([
    [
      "moment_teaser",
      {
        id: "moment_teaser",
        teaser: "Hola 👋 Bienvenida/o a Beneficio Mutuo.",
        details:
          "Este es un adelanto de un momento íntimo. Usa el modo mocks para explorar decisiones de políticas y efectos del runtime.",
        visibility: "INVITE_ONLY",
        ownerId: "user_owner",
        ownerTier: "CIRCLE",
        gating: {
          requireConsentFresh: true,
          requireSharedHistory: false
        },
        accessRequirements: {
          invitationRequired: true,
          minTier: "FREE"
        }
      }
    ],
    [
      "moment_public",
      {
        id: "moment_public",
        teaser: "Respira profundo",
        details: "Una micro-práctica de respiración consciente guiada por Beneficio Mutuo.",
        visibility: "PUBLIC",
        ownerId: "user_guide",
        ownerTier: "FREE"
      }
    ]
  ]);

  const agreementStore = new Map<string, AgreementDTO>([
    [
      "agreement_mock",
      {
        id: "agreement_mock",
        ownerId: "user_owner",
        state: "draft",
        coCreatorIds: ["user_partner"],
        consentState: "valid"
      }
    ]
  ]);

  let profile: { id: string; displayName: string; bio: string; avatarUrl?: string } = {
    id: "user_owner",
    displayName: "Ariadna Inti",
    bio: "Facilitadora de relaciones recíprocas",
    avatarUrl: undefined
  };

  let settings = {
    emailNotifications: true,
    smsNotifications: false,
    visibilityPreset: "inner-circle"
  };

  const invitationStore = new Map<string, MockInvitation>([
    [
      "invitation_mock",
      {
        id: "invitation_mock",
        momentId: "moment_teaser",
        toUserId: "user_guest",
        status: "pending"
      }
    ]
  ]);

  return {
    moments: {
      async list(params) {
        const items = Array.from(momentStore.values());
        const filtered = params?.q
          ? items.filter((moment) =>
              `${moment.teaser} ${typeof moment.details === "string" ? moment.details : ""}`
                .toLowerCase()
                .includes(params.q?.toLowerCase() ?? "")
            )
          : items;
        const pageSize = params?.pageSize ?? (filtered.length || 1);
        const page = params?.page ?? 1;
        const start = (page - 1) * pageSize;
        const pageItems = filtered.slice(start, start + pageSize).map((moment) => deepClone(moment));
        return {
          items: pageItems,
          page,
          pageSize,
          total: filtered.length
        } satisfies Page<MomentDTO>;
      },
      async get(id) {
        const moment = momentStore.get(id);
        if (!moment) {
          throw new Error(`Mock moment ${id} not found`);
        }
        return deepClone(moment);
      },
      async create(input) {
        const id = nextMomentId();
        const visibility: MomentDTO["visibility"] = input.visibility === "PUBLIC" ? "PUBLIC" : "INVITE_ONLY";
        const moment: MomentDTO = {
          id,
          teaser: input.teaser,
          details: input.details ?? input.teaser,
          visibility,
          tags: input.tags,
          ownerId: "user_owner",
          ownerTier: "CIRCLE"
        };
        momentStore.set(id, moment);
        return { id, auditId: nextAuditId() };
      },
      async update(id, patch) {
        const existing = momentStore.get(id);
        if (!existing) {
          throw new Error(`Mock moment ${id} not found`);
        }
        momentStore.set(id, { ...existing, ...patch });
        return { auditId: nextAuditId() };
      },
      async publish(_id) {
        return { auditId: nextAuditId() };
      },
      async unpublish(_id) {
        return { auditId: nextAuditId() };
      },
      async simulateERD(id, viewer) {
        const moment = momentStore.get(id);
        if (!moment) {
          return { effect: "DENY" };
        }
        const effect = resolvePolicyEffect(viewer as ViewerContext, moment);
        const decision = buildDecision(effect, moment);
        return { effect: decision.effect, dto: decision.dto };
      }
    },
    agreements: {
      async get(agreementId) {
        const agreement = agreementStore.get(agreementId);
        if (!agreement) {
          throw new Error(`Mock agreement ${agreementId} not found`);
        }
        return deepClone(agreement);
      },
      async createDraft(momentId) {
        const agreementId = nextAgreementId();
        agreementStore.set(agreementId, {
          id: agreementId,
          ownerId: "user_owner",
          state: "draft",
          momentId
        } as AgreementDTO);
        return { agreementId, auditId: nextAuditId() };
      },
      async updateDraft(agreementId, patch) {
        const existing = agreementStore.get(agreementId);
        if (!existing) {
          throw new Error(`Mock agreement ${agreementId} not found`);
        }
        agreementStore.set(agreementId, { ...existing, ...patch });
        return { auditId: nextAuditId() };
      },
      async diff(_agreementId, _versionA, _versionB) {
        return { fields: [] };
      },
      async submitForReview(_agreementId) {
        return { auditId: nextAuditId() };
      },
      async approve(_agreementId) {
        return { auditId: nextAuditId() };
      },
      async sign(_agreementId) {
        return { auditId: nextAuditId() };
      }
    },
    profiles: {
      async getProfile() {
        return deepClone(profile);
      },
      async updateProfile(_userId, patch) {
        profile = { ...profile, ...patch };
        return { auditId: nextAuditId() };
      },
      async getSettings() {
        return deepClone(settings);
      },
      async updateSettings(patch) {
        settings = { ...settings, ...patch };
        return { auditId: nextAuditId() };
      },
      async listVisibilityPresets() {
        return ["inner-circle", "compartido", "público"];
      }
    },
    invitations: {
      async list(momentId) {
        return Array.from(invitationStore.values())
          .filter((invitation) => invitation.momentId === momentId)
          .map((invitation) => deepClone(invitation));
      },
      async create(momentId, toUserId) {
        const invitationId = nextInvitationId();
        invitationStore.set(invitationId, { id: invitationId, momentId, toUserId, status: "pending" });
        return { invitationId, auditId: nextAuditId() };
      },
      async send(_invitationId) {
        return { auditId: nextAuditId() };
      },
      async accept(invitationId) {
        const invitation = invitationStore.get(invitationId);
        if (invitation) {
          invitation.status = "accepted";
        }
        return { auditId: nextAuditId() };
      },
      async reject(invitationId) {
        const invitation = invitationStore.get(invitationId);
        if (invitation) {
          invitation.status = "rejected";
        }
        return { auditId: nextAuditId() };
      }
    },
    policies: {
      async authorizeViewMoment(viewerContext, resourceId) {
        const moment = momentStore.get(resourceId);
        if (!moment) {
          return { effect: "DENY", reasons: [{ code: "NOT_FOUND" }] } satisfies MockDecision;
        }
        const effect = resolvePolicyEffect(viewerContext as ViewerContext, moment);
        return buildDecision(effect, moment);
      },
      async authorizeEditAgreement(viewerContext, _agreementId) {
        const viewer = viewerContext as ViewerContext;
        if (viewer.role === "owner" || viewer.role === "moderator") {
          return {
            effect: "PERMIT",
            reasons: [{ code: "EDIT_ALLOWED", detail: "Rol con privilegios" }]
          } satisfies MockDecision;
        }
        return {
          effect: "REDACT",
          reasons: [{ code: "REVIEW_REQUIRED", detail: "Se requiere aprobación" }],
          obligations: [{ code: "REQUEST_REVIEW" }]
        } satisfies MockDecision;
      },
      async getPolicySnapshot() {
        return { policySnapshotId: MOCK_POLICY_SNAPSHOT_ID };
      }
    },
    consent: {
      async confirmConsent(_event) {
        return { consentId: nextConsentId(), auditId: nextAuditId() };
      },
      async listLedger(_params) {
        return {
          items: [
            {
              id: nextConsentId(),
              subjectId: "user_guest",
              event: "view_moment",
              createdAt: new Date().toISOString(),
              metadata: { policySnapshotId: MOCK_POLICY_SNAPSHOT_ID }
            }
          ] satisfies ConsentRecord[],
          page: 1,
          pageSize: 50,
          total: 1
        } satisfies Page<ConsentRecord>;
      }
    },
    payments: {
      async getTiers() {
        return [
          { tier: "FREE", price: 0, currency: "USD", benefits: ["Acceso a momentos públicos"] },
          { tier: "CIRCLE", price: 12, currency: "USD", benefits: ["Momentos íntimos", "Invitaciones"] }
        ] satisfies TierInfo[];
      },
      async subscribe(tier, _paymentMethodId) {
        return { subscriptionId: `${nextSubscriptionId()}-${tier}`, auditId: nextAuditId() };
      },
      async verifyPaymentIntent(_intentId) {
        return { status: "succeeded", auditId: nextAuditId() };
      }
    },
    notifications: {
      async preview(input) {
        return {
          html: `<p>Canal ${input.channel}: vista previa para ${input.template}</p>`,
          text: `Vista previa ${input.template}`
        };
      },
      async send(_input) {
        return { auditId: nextAuditId() };
      }
    }
  } satisfies SdkClients;
}

let cached: { http: HttpClient; clients: SdkClients } | null = null;

export function initializeSdk(telemetry: FrontendTelemetry): { http: HttpClient; clients: SdkClients } {
  if (cached) {
    return cached;
  }

  if (env.useMocks) {
    const http = new HttpClient({
      baseURL: env.apiBaseUrl,
      telemetry: telemetry.sdk,
      defaultHeaders: sanitizeHeaders(viewerHeaders())
    });
    const clients = createMockSdkClients();
    configureClients(clients);
    cached = { http, clients };
    return cached;
  }

  const http = new HttpClient({
    baseURL: env.apiBaseUrl,
    telemetry: telemetry.sdk,
    defaultHeaders: sanitizeHeaders(viewerHeaders())
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

export function getAriaBridge(http: HttpClient): AriaBridge {
  if (env.useMocks) {
    return {
      async sendFeedback() {
        return;
      },
      async confirmObligation() {
        return { auditId: nextAuditId() };
      }
    } satisfies AriaBridge;
  }

  return createAriaAdapter({ client: http });
}
