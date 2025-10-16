import type { Telemetry } from "./index.js";

export interface OtelSpanExporter {
  readonly startSpan: (name: string, attributes?: Record<string, unknown>) => OtelSpan;
}

export interface OtelSpan {
  readonly end: () => void;
  readonly recordException: (error: Error) => void;
}

export class OtelTelemetry implements Telemetry {
  constructor(private readonly exporter: OtelSpanExporter) {}

  onTransition(input: { record: unknown; state: unknown }): void {
    const span = this.exporter.startSpan("runtime.transition", { auditIds: (input as any).record?.auditIds });
    span.end();
  }

  onAction(input: { action: string; durationMs: number }): void {
    const span = this.exporter.startSpan("runtime.action", input);
    span.end();
  }

  onGuard(): void {
    // intentionally no-op to avoid PII leakage
  }

  onError(input: { error: Error }): void {
    const span = this.exporter.startSpan("runtime.error");
    span.recordException(input.error);
    span.end();
  }
}
