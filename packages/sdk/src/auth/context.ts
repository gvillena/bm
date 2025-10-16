export interface ViewerIdentity {
  userId?: string;
  tenantId?: string;
  plan?: string;
}

let viewerContext: ViewerIdentity = {};

export function setViewerContext(context: ViewerIdentity): void {
  viewerContext = { ...context };
}

export function getViewerContext(): ViewerIdentity {
  return { ...viewerContext };
}

export function viewerHeaders(overrides?: ViewerIdentity): Record<string, string | undefined> {
  const ctx = { ...viewerContext, ...overrides };
  return {
    "x-viewer-id": ctx.userId,
    "x-tenant-id": ctx.tenantId,
    "x-plan": ctx.plan,
  };
}
