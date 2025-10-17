import { z } from "zod";
import { IdSchema, IsoDate } from "./primitives";
import { UserId } from "./user.schema";

export const InvitationId = IdSchema("Invitation");
export const InvitationStatus = z.enum(["pending", "accepted", "rejected"] as const);

export const InvitationDTO = z.object({
  id: InvitationId,
  momentId: IdSchema("Moment"),
  toUserId: UserId,
  status: InvitationStatus,
  sentAt: IsoDate,
  respondedAt: IsoDate.optional()
});

export type InvitationDTO = z.infer<typeof InvitationDTO>;
