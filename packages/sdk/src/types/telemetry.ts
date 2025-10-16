export interface SdkTelemetry {
  onRequest?(meta: { method: string; url: string; traceId: string }): void;
  onResponse?(meta: { status: number; durationMs: number; requestId?: string }): void;
  onRetry?(meta: { attempt: number; reason: string }): void;
  onBreaker?(meta: { state: "open" | "half-open" | "closed"; host: string }): void;
}
