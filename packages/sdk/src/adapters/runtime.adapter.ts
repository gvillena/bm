import type { MomentsClient } from "../clients/momentsClient.js";
import type { PoliciesClient } from "../clients/policiesClient.js";
import type { ConsentClient } from "../clients/consentClient.js";
import type {
  ConsentEventInput,
  CreateMomentInput,
  Decision,
  MomentDTO,
  ViewerContext,
} from "../types/index.js";

export interface RuntimeEffects {
  saveMomentDraft(input: CreateMomentInput): Promise<{ id: string; auditId: string }>;
  publishMoment(id: string): Promise<{ auditId: string }>;
  requestConsent(input: ConsentEventInput): Promise<{ consentId: string; auditId: string }>;
  serverAuthorizeViewMoment(vc: ViewerContext, resourceId: string): Promise<Decision & { dto?: MomentDTO }>;
}

export function createRuntimeAdapter(deps: {
  moments: MomentsClient;
  policies: PoliciesClient;
  consent: ConsentClient;
}): RuntimeEffects {
  return {
    saveMomentDraft: (input) => deps.moments.create(input),
    publishMoment: (id) => deps.moments.publish(id),
    requestConsent: (input) => deps.consent.confirmConsent(input),
    serverAuthorizeViewMoment: (vc, resourceId) => deps.policies.authorizeViewMoment(vc, resourceId),
  };
}
