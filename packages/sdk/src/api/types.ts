import type { SdkTelemetry } from "../types/telemetry.js";
import type { SDKError } from "../types/errors.js";

export interface RequestOptions {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
  retry?: boolean;
  auditId?: string;
  policySnapshotId?: string;
  consentId?: string;
  viewerId?: string;
  plan?: string;
  telemetry?: SdkTelemetry;
  idempotent?: boolean;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  mode?: RequestMode;
}

export interface HttpClientOptions {
  baseURL: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
  telemetry?: SdkTelemetry;
}

export interface RequestContext {
  url: URL;
  init: RequestInit;
  options: RequestOptions;
  traceId: string;
}

export interface ResponseContext {
  response: Response;
  request: RequestContext;
}

export type RequestInterceptor = (ctx: RequestContext) => Promise<RequestContext> | RequestContext;
export type ResponseInterceptor = (ctx: ResponseContext) => Promise<ResponseContext> | ResponseContext;

export interface HttpResponse<T> {
  data: T;
  response: Response;
}

export interface HttpError extends SDKError {
  response?: Response;
}
