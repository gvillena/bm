import { z } from "zod";
import { AuditId, IdSchema } from "../schemas/primitives";
import { InvitationDTO, InvitationId } from "../schemas/invitation.schema";

export const CreateInvitationRequest = z.object({
  body: z.object({
    momentId: IdSchema("Moment"),
    toUserId: IdSchema("User")
  })
});

export const CreateInvitationResponse = z.object({
  dto: InvitationDTO,
  auditId: AuditId
});

export const AcceptInvitationRequest = z.object({
  params: z.object({ id: InvitationId }),
  body: z.object({
    viewerContext: z.record(z.unknown()).optional()
  }).optional()
});

export const AcceptInvitationResponse = z.object({
  dto: InvitationDTO,
  auditId: AuditId
});

export const RejectInvitationRequest = z.object({
  params: z.object({ id: InvitationId }),
  body: z.object({ reason: z.string().max(280).optional() }).optional()
});

export const RejectInvitationResponse = z.object({
  dto: InvitationDTO,
  auditId: AuditId
});
