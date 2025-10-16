import type { HttpClient } from "../api/client.js";

export interface NotificationPreviewInput {
  channel: "email" | "sms" | "push";
  template: string;
  variables?: Record<string, string>;
}

export interface NotificationsClient {
  preview(input: NotificationPreviewInput): Promise<{ html?: string; text?: string }>;
  send(input: NotificationPreviewInput & { recipient: string }): Promise<{ auditId: string }>;
}

export function createNotificationsClient(http: HttpClient): NotificationsClient {
  return {
    preview(input) {
      return http.post<{ html?: string; text?: string }>("notifications/preview", input, {
        idempotent: true,
      });
    },
    send(input) {
      return http.post<{ auditId: string }>("notifications/send", input, {
        retry: true,
      });
    },
  };
}
