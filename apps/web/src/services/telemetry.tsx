import { context, trace, SpanStatusCode, type Span } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { Resource } from "@opentelemetry/resources";
import { WebTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Telemetry as RuntimeTelemetry } from "@bm/runtime";
import type { AriaTelemetry } from "@bm/aria";
import type { SdkTelemetry } from "@bm/sdk";
import { env } from "@utils/env";
import { createId } from "@utils/ids";

declare const __APP_VERSION__: string;

interface SpanInput<T> {
  readonly name: string;
  readonly attributes?: Record<string, unknown>;
  readonly run: (span: Span) => T | Promise<T>;
}

export interface FrontendTelemetry {
  readonly sdk: SdkTelemetry;
  readonly runtime: RuntimeTelemetry;
  readonly aria: AriaTelemetry;
  readonly withSpan: <T>(input: SpanInput<T>) => Promise<T>;
  readonly createRequestContext: () => { traceId: string; auditId: string };
}

const TelemetryContext = createContext<FrontendTelemetry | null>(null);

let tracerProvider: WebTracerProvider | null = null;

function ensureProvider(): WebTracerProvider {
  if (tracerProvider) {
    return tracerProvider;
  }

  if (typeof window === "undefined") {
    tracerProvider = new WebTracerProvider();
    return tracerProvider;
  }

  tracerProvider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "bm-web",
      [SemanticResourceAttributes.SERVICE_VERSION]: __APP_VERSION__ ?? "0.0.0",
      environment: env.appEnv
    })
  });

  tracerProvider.register({ contextManager: new ZoneContextManager() });

  if (env.telemetryEnabled && env.otelExporterUrl) {
    const exporter = new OTLPTraceExporter({ url: env.otelExporterUrl });
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  }

  if (env.telemetryEnabled) {
    registerInstrumentations({
      instrumentations: [
        new FetchInstrumentation({
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [/.*/],
          applyCustomAttributesOnSpan(span, request) {
            const originalRequest = (request as { request?: Request }).request;
            if (originalRequest instanceof Request) {
              span.setAttribute("http.request.method", originalRequest.method);
            }
          }
        })
      ]
    });
  }

  return tracerProvider;
}

function createRuntimeTelemetry(withSpan: FrontendTelemetry["withSpan"]): RuntimeTelemetry {
  return {
    onTransition: ({ record }) => {
      void withSpan({
        name: "runtime.transition",
        attributes: {
          "runtime.to": record.to,
          "runtime.from": record.from
        },
        run: (span) => {
          span.setStatus({ code: SpanStatusCode.OK });
        }
      });
    },
    onGuard: ({ guard, outcome }) => {
      void withSpan({
        name: "runtime.guard",
        attributes: {
          "runtime.guard": guard.name,
          "runtime.outcome": outcome
        },
        run: (span) => {
          span.setStatus({ code: SpanStatusCode.OK });
        }
      });
    },
    onAction: ({ action, durationMs }) => {
      void withSpan({
        name: "runtime.action",
        attributes: { "runtime.action": action, "runtime.duration_ms": durationMs },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    },
    onError: ({ error }) => {
      void withSpan({
        name: "runtime.error",
        attributes: { "error.message": error.message },
        run: (span) => {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        }
      });
    }
  } satisfies RuntimeTelemetry;
}

function createAriaTelemetry(withSpan: FrontendTelemetry["withSpan"]): AriaTelemetry {
  return {
    onPresenceShown: (event) => {
      void withSpan({
        name: "aria.presence",
        attributes: {
          "aria.level": event.level,
          "aria.aura": event.aura,
          "aria.graph_id": event.graphId,
          "aria.node_id": event.nodeId
        },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    },
    onDismissed: (event) => {
      void withSpan({
        name: "aria.dismissed",
        attributes: {
          "aria.reason": event.reason,
          "aria.graph_id": event.graphId
        },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    },
    onIntentHandled: (event) => {
      void withSpan({
        name: "aria.intent",
        attributes: {
          "aria.intent": event.intent,
          "aria.graph_id": event.graphId
        },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    },
    onGuardrail: (event) => {
      void withSpan({
        name: "aria.guardrail",
        attributes: {
          "aria.code": event.code,
          "aria.node_id": event.nodeId
        },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    }
  } satisfies AriaTelemetry;
}

function createSdkTelemetry(withSpan: FrontendTelemetry["withSpan"]): SdkTelemetry {
  return {
    onRequest: (meta) => {
      void withSpan({
        name: "sdk.request",
        attributes: { "http.method": meta.method, "http.url": meta.url, "sdk.trace_id": meta.traceId },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    },
    onResponse: (meta) => {
      void withSpan({
        name: "sdk.response",
        attributes: { "http.status_code": meta.status, "http.duration_ms": meta.durationMs },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    },
    onRetry: (meta) => {
      void withSpan({
        name: "sdk.retry",
        attributes: { "sdk.attempt": meta.attempt, "sdk.reason": meta.reason },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    },
    onBreaker: (meta) => {
      void withSpan({
        name: "sdk.breaker",
        attributes: { "sdk.state": meta.state, "sdk.host": meta.host },
        run: (span) => span.setStatus({ code: SpanStatusCode.OK })
      });
    }
  } satisfies SdkTelemetry;
}

function initializeTelemetry(): FrontendTelemetry {
  const provider = ensureProvider();
  const tracer = provider.getTracer("bm-web");

  const withSpan: FrontendTelemetry["withSpan"] = async ({ name, attributes = {}, run }) => {
    const span = tracer.startSpan(name);
    Object.entries(attributes).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        span.setAttribute(key, value);
      }
    });
    try {
      const result = await context.with(trace.setSpan(context.active(), span), () => run(span));
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  };

  return {
    sdk: createSdkTelemetry(withSpan),
    runtime: createRuntimeTelemetry(withSpan),
    aria: createAriaTelemetry(withSpan),
    withSpan,
    createRequestContext() {
      return { traceId: createId("trace"), auditId: createId("audit") };
    }
  } satisfies FrontendTelemetry;
}

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const telemetry = useMemo(initializeTelemetry, []);
  return <TelemetryContext.Provider value={telemetry}>{children}</TelemetryContext.Provider>;
}

export function useTelemetry(): FrontendTelemetry {
  const telemetry = useContext(TelemetryContext);
  if (!telemetry) {
    throw new Error("TelemetryProvider missing in component tree");
  }
  return telemetry;
}
