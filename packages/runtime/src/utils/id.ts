let counter = 0;

export const createAuditId = (prefix = "audit"): string => {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return `${prefix}-${Date.now()}-${counter}`;
};

export const createStateKey = (graphId: string, viewerId: string | number): string =>
  `bm-runtime::${graphId}::${viewerId}`;
