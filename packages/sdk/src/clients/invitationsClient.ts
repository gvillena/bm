import type { HttpClient } from "../api/client.js";

export interface InvitationDTO {
  id: string;
  momentId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
}

export interface InvitationsClient {
  list(momentId: string): Promise<InvitationDTO[]>;
  create(momentId: string, toUserId: string): Promise<{ invitationId: string; auditId: string }>;
  send(invitationId: string): Promise<{ auditId: string }>;
  accept(invitationId: string): Promise<{ auditId: string }>;
  reject(invitationId: string): Promise<{ auditId: string }>;
}

export function createInvitationsClient(http: HttpClient): InvitationsClient {
  return {
    list(momentId) {
      return http.get<InvitationDTO[]>("invitations", {
        query: { momentId },
        retry: true,
      });
    },
    create(momentId, toUserId) {
      return http.post<{ invitationId: string; auditId: string }>("invitations", { momentId, toUserId }, {
        idempotent: true,
      });
    },
    send(invitationId) {
      return http.post<{ auditId: string }>(`invitations/${invitationId}/send`, undefined, {
        retry: true,
      });
    },
    accept(invitationId) {
      return http.post<{ auditId: string }>(`invitations/${invitationId}/accept`, undefined, {
        idempotent: true,
      });
    },
    reject(invitationId) {
      return http.post<{ auditId: string }>(`invitations/${invitationId}/reject`, undefined, {
        idempotent: true,
      });
    },
  };
}
