import { z } from "zod";
import { IdSchema } from "../schemas/primitives";
import { ViewerContext } from "../schemas/viewerContext.schema";
import { PolicyDecision } from "../schemas/policies.schema";
import { MomentPrivateDTO, MomentPublicDTO } from "../schemas/moment.schema";
import { AuditId } from "../schemas/primitives";

export const AuthorizeViewMomentRequest = z.object({
  viewerContext: ViewerContext,
  resourceId: IdSchema("Moment")
});

export const AuthorizeViewMomentResponse = PolicyDecision.extend({
  dto: MomentPublicDTO.or(MomentPrivateDTO).optional()
});

export const AuthorizePublishMomentRequest = z.object({
  viewerContext: ViewerContext,
  resourceId: IdSchema("Moment")
});

export const AuthorizePublishMomentResponse = PolicyDecision;

export const PolicySnapshotResponse = z.object({
  policySnapshotId: z.string(),
  auditId: AuditId.optional()
});
