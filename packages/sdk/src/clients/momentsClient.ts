import type { HttpClient } from "../api/client.js";
import type {
  CreateMomentInput,
  MomentDTO,
  Page,
  ViewerContext,
} from "../types/index.js";

export interface MomentsClient {
  list(params?: { page?: number; pageSize?: number; q?: string }): Promise<Page<MomentDTO>>;
  get(id: string): Promise<MomentDTO>;
  create(input: CreateMomentInput): Promise<{ id: string; auditId: string }>;
  update(id: string, patch: Partial<MomentDTO>): Promise<{ auditId: string }>;
  publish(id: string): Promise<{ auditId: string }>;
  unpublish(id: string): Promise<{ auditId: string }>;
  simulateERD(id: string, viewer: ViewerContext): Promise<{ dto?: MomentDTO; effect: string }>;
}

/**
 * Factory for the moment domain client.
 */
export function createMomentsClient(http: HttpClient): MomentsClient {
  return {
    list(params) {
      return http.get<Page<MomentDTO>>("moments", {
        query: params,
        retry: true,
      });
    },
    get(id: string) {
      return http.get<MomentDTO>(`moments/${id}`, { retry: true });
    },
    async create(input) {
      const result = await http.post<{ id: string; auditId: string }>("moments", input, {
        idempotent: true,
      });
      return result;
    },
    update(id, patch) {
      return http.patch<{ auditId: string }>(`moments/${id}`, patch, { idempotent: true });
    },
    publish(id) {
      return http.post<{ auditId: string }>(`moments/${id}/publish`, undefined, {
        idempotent: true,
        retry: true,
      });
    },
    unpublish(id) {
      return http.post<{ auditId: string }>(`moments/${id}/unpublish`, undefined, {
        idempotent: true,
        retry: true,
      });
    },
    simulateERD(id, viewer) {
      return http.post<{ dto?: MomentDTO; effect: string }>(`moments/${id}/simulate-erd`, viewer, {
        idempotent: true,
      });
    },
  };
}
