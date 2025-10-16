import { nanoid } from "nanoid";

export interface TraceHeadersOptions {
  traceId?: string;
  auditId?: string;
  policySnapshotId?: string;
  consentId?: string;
  viewerId?: string;
  plan?: string;
}

const TRACE_HEADER = "x-trace-id";

/**
 * Ensures headers contain trace metadata without leaking PII.
 */
export function ensureTraceHeaders(
  headers: Headers,
  options: TraceHeadersOptions = {},
): { traceId: string } {
  const traceId = options.traceId ?? headers.get(TRACE_HEADER) ?? nanoid();
  headers.set(TRACE_HEADER, traceId);
  if (options.auditId) headers.set("x-audit-id", options.auditId);
  if (options.policySnapshotId)
    headers.set("x-policy-snapshot-id", options.policySnapshotId);
  if (options.consentId) headers.set("x-consent-id", options.consentId);
  if (options.viewerId) headers.set("x-viewer-id", options.viewerId);
  if (options.plan) headers.set("x-plan", options.plan);
  return { traceId };
}

export function mergeHeaders(
  base: HeadersInit | undefined,
  extra?: Record<string, string | undefined>,
): Headers {
  const headers = new Headers(base);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value === undefined || value === null) continue;
      headers.set(key, String(value));
    }
  }
  return headers;
}
