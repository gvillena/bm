export type ErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "API_ERROR"
  | "POLICY_DENY"
  | "CONSENT_REQUIRED"
  | "RATE_LIMITED";

export interface SDKError extends Error {
  code: ErrorCode;
  requestId?: string;
  detail?: unknown;
}

export interface APIErrorShape extends SDKError {
  status?: number;
}

export interface ConsentObligation {
  code: string;
  params?: Record<string, any>;
}

export interface APIError extends APIErrorShape {}
export interface ConsentError extends APIError {
  obligation?: ConsentObligation;
}

export interface PolicyError extends APIError {
  obligations?: ConsentObligation[];
}

export interface NetworkError extends SDKError {
  cause?: unknown;
}

class BaseSdkError extends Error implements SDKError {
  code: ErrorCode;
  requestId?: string;
  detail?: unknown;

  constructor(message: string, code: ErrorCode, detail?: unknown, requestId?: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.detail = detail;
    this.requestId = requestId;
  }
}

export class SdkNetworkError extends BaseSdkError implements NetworkError {
  cause?: unknown;

  constructor(message: string, detail?: unknown, requestId?: string, cause?: unknown) {
    super(message, "NETWORK_ERROR", detail, requestId);
    this.cause = cause;
  }
}

export class SdkTimeoutError extends BaseSdkError {
  constructor(detail?: unknown, requestId?: string) {
    super("Request timed out", "TIMEOUT", detail, requestId);
  }
}

export class SdkApiError extends BaseSdkError implements APIError {
  status?: number;

  constructor(message: string, status?: number, detail?: unknown, requestId?: string) {
    super(message, status === 429 ? "RATE_LIMITED" : "API_ERROR", detail, requestId);
    this.status = status;
  }
}

export class SdkConsentError extends SdkApiError implements ConsentError {
  obligation?: ConsentObligation;

  constructor(
    message: string,
    status: number | undefined,
    detail?: unknown,
    requestId?: string,
    obligation?: ConsentObligation,
  ) {
    super(message, status, detail, requestId);
    this.code = "CONSENT_REQUIRED";
    this.obligation = obligation;
  }
}

export class SdkPolicyError extends SdkApiError implements PolicyError {
  obligations?: ConsentObligation[];

  constructor(
    message: string,
    status: number | undefined,
    detail?: unknown,
    requestId?: string,
    obligations?: ConsentObligation[],
  ) {
    super(message, status, detail, requestId);
    this.code = "POLICY_DENY";
    this.obligations = obligations;
  }
}

export function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: ErrorCode }).code;
  if (!code) return false;
  return code === "NETWORK_ERROR" || code === "TIMEOUT" || code === "RATE_LIMITED";
}
