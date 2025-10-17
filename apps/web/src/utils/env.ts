const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const OTEL_EXPORTER_URL = import.meta.env.VITE_OTEL_EXPORTER_URL as string | undefined;
const APP_ENV = (import.meta.env.VITE_APP_ENV as string | undefined) ?? "development";

function ensure(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is not defined. Check your environment variables.`);
  }
  return value;
}

export const env = {
  apiBaseUrl: ensure(API_BASE_URL, "VITE_API_BASE_URL"),
  otelExporterUrl: ensure(OTEL_EXPORTER_URL, "VITE_OTEL_EXPORTER_URL"),
  appEnv: APP_ENV
} as const;

export type Environment = typeof env;
