import { z } from "zod";
import { AuditId, SafeText } from "../schemas/primitives";

const NotificationChannel = z.enum(["email", "sms", "push"] as const);

export const PreviewNotificationRequest = z.object({
  body: z.object({
    channel: NotificationChannel,
    subject: SafeText,
    message: SafeText
  })
});

export const PreviewNotificationResponse = z.object({
  preview: z.string()
});

export const SendNotificationRequest = z.object({
  body: z.object({
    channel: NotificationChannel,
    subject: SafeText,
    message: SafeText,
    recipientIds: z.array(z.string()).min(1).max(50)
  })
});

export const SendNotificationResponse = z.object({
  auditId: AuditId,
  accepted: z.number().int().min(0),
  rejected: z.number().int().min(0)
});
