import { z } from "zod";
import { AuditId, IdSchema } from "../schemas/primitives";
import { CreateMomentInput, MomentId, MomentPrivateDTO, MomentPublicDTO } from "../schemas/moment.schema";

export const CreateMomentRequest = z.object({
  body: CreateMomentInput
});

export const CreateMomentResponse = z.object({
  id: MomentId,
  auditId: AuditId
});

export const GetMomentRequest = z.object({
  params: z.object({ id: MomentId })
});

export const GetMomentResponse = MomentPrivateDTO;

export const UpdateMomentRequest = z.object({
  params: z.object({ id: MomentId }),
  body: z.object({
    teaser: z.string().optional(),
    details: z.string().optional(),
    visibility: z.enum(["PUBLIC", "INVITE_ONLY"] as const).optional()
  })
});

export const UpdateMomentResponse = z.object({
  auditId: AuditId,
  dto: MomentPrivateDTO
});

export const PublishMomentRequest = z.object({
  params: z.object({ id: MomentId }),
  body: z.object({
    publishAt: z.string().datetime({ offset: true }).optional()
  })
});

export const PublishMomentResponse = z.object({
  auditId: AuditId
});

export const SimulateERDRequest = z.object({
  params: z.object({ id: MomentId }),
  query: z.object({ viewerId: IdSchema("User").optional() }).optional()
});

export const SimulateERDResponse = z.object({
  visibility: z.enum(["none", "teaser", "full"] as const),
  dto: MomentPublicDTO.optional()
});
