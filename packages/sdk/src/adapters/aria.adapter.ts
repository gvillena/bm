import type { HttpClient } from "../api/client.js";

export interface AriaFeedback {
  thumbs: "up" | "down";
  comment?: string;
  context: { graphId: string; nodeId: string; policySnapshotId?: string };
}

export interface AriaBridge {
  sendFeedback(fb: AriaFeedback): Promise<void>;
  confirmObligation(ob: { code: string; params?: Record<string, string | number | boolean> }): Promise<{ auditId?: string }>;
}

export function createAriaAdapter(deps: { client: HttpClient }): AriaBridge {
  return {
    async sendFeedback(fb) {
      await deps.client.post<void>("aria/feedback", fb, { idempotent: true });
    },
    confirmObligation(ob) {
      return deps.client.post<{ auditId?: string }>("aria/obligations/confirm", ob, {
        idempotent: true,
      });
    },
  };
}
