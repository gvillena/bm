import { ensureTraceHeaders, mergeHeaders } from "../utils/headers.js";
import type { RequestContext, RequestInterceptor, ResponseInterceptor } from "./types.js";
import { getAccessToken } from "../auth/session.js";
import { toSdkError } from "./error-handler.js";

/**
 * Adds authentication and tracing headers before the request is executed.
 */
export const standardRequestInterceptor: RequestInterceptor = async (ctx) => {
  const headers = mergeHeaders(ctx.init.headers, ctx.options.headers);
  const token = await getAccessToken();
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }
  ensureTraceHeaders(headers, {
    traceId: ctx.traceId,
    auditId: ctx.options.auditId,
    policySnapshotId: ctx.options.policySnapshotId,
    consentId: ctx.options.consentId,
    viewerId: ctx.options.viewerId,
    plan: ctx.options.plan,
  });
  ctx.init.headers = headers;
  return ctx;
};

export const standardResponseInterceptor: ResponseInterceptor = async (ctx) => {
  if (!ctx.response.ok) {
    const error = await toSdkError(ctx.response, ctx.request);
    throw error;
  }
  return ctx;
};

export const interceptors = {
  request: [standardRequestInterceptor] satisfies RequestInterceptor[],
  response: [standardResponseInterceptor] satisfies ResponseInterceptor[],
};
