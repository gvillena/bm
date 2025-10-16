import { nanoid } from "nanoid";
import { CircuitBreaker } from "./circuit-breaker.js";
import { interceptors } from "./interceptors.js";
import { toNetworkError } from "./error-handler.js";
import type {
  HttpClientOptions,
  RequestOptions,
  RequestContext,
  RequestInterceptor,
  ResponseInterceptor,
} from "./types.js";
import { mergeHeaders } from "../utils/headers.js";
import { safeJson } from "../utils/safeJson.js";
import { withRetryForResponse, retryableShouldRetry } from "./retry.js";

const DEFAULT_TIMEOUT = 12_000;
const JSON_CONTENT = "application/json";

export class HttpClient {
  private readonly baseURL: string;
  private readonly timeoutMs: number;
  private readonly defaultHeaders?: Record<string, string>;
  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly breaker: CircuitBreaker;
  private readonly telemetry?: HttpClientOptions["telemetry"];

  constructor(options: HttpClientOptions) {
    this.baseURL = options.baseURL.replace(/\/$/, "");
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT;
    this.defaultHeaders = options.defaultHeaders;
    this.telemetry = options.telemetry;
    this.breaker = new CircuitBreaker({ telemetry: options.telemetry });
    this.requestInterceptors.push(...interceptors.request);
    this.responseInterceptors.push(...interceptors.response);
  }

  useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  async get<T>(url: string, opts: RequestOptions = {}): Promise<T> {
    return this.request<T>("GET", url, undefined, opts);
  }

  async post<T>(url: string, body?: unknown, opts: RequestOptions = {}): Promise<T> {
    return this.request<T>("POST", url, body, opts);
  }

  async put<T>(url: string, body?: unknown, opts: RequestOptions = {}): Promise<T> {
    return this.request<T>("PUT", url, body, opts);
  }

  async patch<T>(url: string, body?: unknown, opts: RequestOptions = {}): Promise<T> {
    return this.request<T>("PATCH", url, body, opts);
  }

  async delete<T>(url: string, opts: RequestOptions = {}): Promise<T> {
    return this.request<T>("DELETE", url, undefined, opts);
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const urlObject = new URL(url, this.baseURL + "/");
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        urlObject.searchParams.set(key, String(value));
      }
    }

    const headers = mergeHeaders(this.defaultHeaders, options.headers);
    const init: RequestInit = {
      method,
      headers,
      cache: options.cache,
      credentials: options.credentials,
      mode: options.mode,
    };

    if (body !== undefined && method !== "GET" && method !== "HEAD") {
      headers.set("content-type", JSON_CONTENT);
      init.body = safeJson.stringify(body);
    }

    const traceId = nanoid();
    let requestContext: RequestContext = {
      url: urlObject,
      init,
      options,
      traceId,
    };

    for (const interceptor of this.requestInterceptors) {
      requestContext = await interceptor(requestContext);
    }

    const telemetry = options.telemetry ?? this.telemetry;
    telemetry?.onRequest?.({ method, url: requestContext.url.toString(), traceId });

    const shouldRetry = this.shouldRetry(method, options);
    const startedAt = Date.now();

    const host = requestContext.url.host;
    if (!this.breaker.allowRequest(host)) {
      throw toNetworkError(new Error(`Circuit breaker open for host ${host}`));
    }

    const response = await withRetryForResponse(
      async () => {
        const controller = new AbortController();
        const timeoutMs = options.timeoutMs ?? this.timeoutMs;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (timeoutMs > 0) {
          timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        }
        let abortListener: (() => void) | undefined;
        if (options.signal) {
          if (options.signal.aborted) {
            controller.abort();
          } else {
            abortListener = () => controller.abort();
            options.signal.addEventListener("abort", abortListener, { once: true });
          }
        }
        const attemptInit: RequestInit = { ...requestContext.init, signal: controller.signal };
        try {
          const res = await fetch(requestContext.url.toString(), attemptInit);
          if (!res.ok && (res.status >= 500 || res.status === 429)) {
            this.breaker.recordFailure(host);
          } else if (res.ok) {
            this.breaker.recordSuccess(host);
          }
          return res;
        } catch (error) {
          this.breaker.recordFailure(host);
          throw toNetworkError(error);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
          if (abortListener && options.signal) {
            options.signal.removeEventListener("abort", abortListener);
          }
        }
      },
      shouldRetry ? retryableShouldRetry : () => false,
      undefined,
      options.signal,
      (ctx) => {
        telemetry?.onRetry?.({
          attempt: ctx.attempt,
          reason: ctx.response
            ? `HTTP_${ctx.response.status}`
            : ctx.error instanceof Error
              ? ctx.error.message
              : "unknown",
        });
      },
    );

    let responseContext = { response, request: requestContext };
    for (const interceptor of this.responseInterceptors) {
      responseContext = await interceptor(responseContext);
    }

    const duration = Date.now() - startedAt;
    const requestId = response.headers.get("x-request-id") ?? undefined;
    telemetry?.onResponse?.({ status: response.status, durationMs: duration, requestId });

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return undefined as T;
    }
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }
    return safeJson.parse<T>(text);
  }

  private shouldRetry(method: string, options: RequestOptions): boolean {
    const upper = method.toUpperCase();
    if (options.retry) return true;
    return upper === "GET" || upper === "HEAD" || upper === "OPTIONS" || options.idempotent === true;
  }
}
