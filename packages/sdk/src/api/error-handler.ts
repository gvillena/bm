import {
  SdkApiError,
  SdkConsentError,
  SdkPolicyError,
  SdkTimeoutError,
  SdkNetworkError,
} from "../types/errors.js";
import type { RequestContext } from "./types.js";
import { safeJson } from "../utils/safeJson.js";

interface ApiErrorPayload {
  code?: string;
  message?: string;
  detail?: unknown;
  requestId?: string;
  obligation?: { code: string; params?: Record<string, unknown> };
  obligations?: Array<{ code: string; params?: Record<string, unknown> }>;
}

function parseErrorBody(response: Response): Promise<ApiErrorPayload | undefined> {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return Promise.resolve(undefined);
  }
  return response
    .clone()
    .text()
    .then((text) => {
      if (!text) return undefined;
      try {
        const data = safeJson.parse<ApiErrorPayload | { error: ApiErrorPayload }>(text);
        if ("error" in data && data.error) {
          return data.error;
        }
        return data as ApiErrorPayload;
      } catch (error) {
        console.warn("Failed to parse error payload", error);
        return undefined;
      }
    });
}

export async function toSdkError(response: Response, request: RequestContext): Promise<Error> {
  const payload = await parseErrorBody(response);
  const message = payload?.message ?? `${response.status} ${response.statusText}`;
  const requestId = payload?.requestId ?? response.headers.get("x-request-id") ?? undefined;

  if (response.status === 408) {
    return new SdkTimeoutError(payload?.detail, requestId);
  }

  if (payload?.code === "CONSENT_REQUIRED" || response.status === 409) {
    return new SdkConsentError(message, response.status, payload?.detail, requestId, payload?.obligation);
  }

  if (payload?.code === "POLICY_DENY" || response.status === 403) {
    return new SdkPolicyError(message, response.status, payload?.detail, requestId, payload?.obligations);
  }

  return new SdkApiError(message, response.status, payload?.detail, requestId);
}

export function toNetworkError(error: unknown): Error {
  if (error instanceof DOMException && error.name === "AbortError") {
    return new SdkTimeoutError();
  }
  if (error instanceof Error) {
    return new SdkNetworkError(error.message, undefined, undefined, error);
  }
  return new SdkNetworkError("Network request failed", undefined, undefined, error);
}
