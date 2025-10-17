const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3000";
const TELEMETRY_ENABLED_RAW = import.meta.env.VITE_TELEMETRY_ENABLED as string | undefined;
const USE_MOCKS_RAW = import.meta.env.VITE_USE_MOCKS as string | undefined;
const OTEL_EXPORTER_URL = import.meta.env.VITE_OTEL_EXPORTER_URL as string | undefined;
const APP_ENV = (import.meta.env.VITE_APP_ENV as string | undefined) ?? "development";

function toBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
}

export const env = {
  apiBaseUrl: API_BASE_URL,
  telemetryEnabled: toBoolean(TELEMETRY_ENABLED_RAW, true),
  useMocks: toBoolean(USE_MOCKS_RAW, true),
  otelExporterUrl: OTEL_EXPORTER_URL,
  appEnv: APP_ENV
} as const;

export type Environment = typeof env;
