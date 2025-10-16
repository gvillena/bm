import type { HttpClient } from "../api/client.js";
import type { Decision, MomentDTO, ViewerContext } from "../types/index.js";

export interface PoliciesClient {
  authorizeViewMoment(vc: ViewerContext, resourceId: string): Promise<Decision & { dto?: MomentDTO }>;
  authorizeEditAgreement(vc: ViewerContext, agreementId: string): Promise<Decision>;
  getPolicySnapshot(): Promise<{ policySnapshotId: string }>;
}

export function createPoliciesClient(http: HttpClient): PoliciesClient {
  return {
    authorizeViewMoment(vc, resourceId) {
      return http.post<Decision & { dto?: MomentDTO }>("policies/authorize/view-moment", { viewerContext: vc, resourceId }, {
        idempotent: true,
        retry: false,
      });
    },
    authorizeEditAgreement(vc, agreementId) {
      return http.post<Decision>("policies/authorize/edit-agreement", { viewerContext: vc, agreementId }, {
        idempotent: true,
        retry: false,
      });
    },
    getPolicySnapshot() {
      return http.get<{ policySnapshotId: string }>("policies/snapshot", { retry: true });
    },
  };
}
