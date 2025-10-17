import { useMemo } from "react";
import { QueryClient } from "@tanstack/react-query";
import { UIProviders } from "@bm/ui/providers/UIProviders";
import { I18nextProvider } from "react-i18next";
import { ensureI18n } from "@services/i18n";
import { TelemetryProvider } from "@services/telemetry";
import { RuntimeProvider } from "@app/providers/RuntimeProvider";
import { AriaPresenceProvider } from "@app/providers/AriaPresenceProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 60_000 },
          mutations: { retry: 1 }
        }
      }),
    []
  );

  const i18n = ensureI18n();

  return (
    <UIProviders initialTheme="dark" queryClient={queryClient}>
      <I18nextProvider i18n={i18n}>
        <TelemetryProvider>
          <RuntimeProvider>
            <AriaPresenceProvider>{children}</AriaPresenceProvider>
          </RuntimeProvider>
        </TelemetryProvider>
      </I18nextProvider>
    </UIProviders>
  );
}
