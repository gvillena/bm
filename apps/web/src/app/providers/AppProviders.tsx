import { useMemo, type ComponentType, type ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { UIProviders } from "@bm/ui";
import { I18nextProvider, type I18nextProviderProps } from "react-i18next";
import { ensureI18n } from "@services/i18n";
import { TelemetryProvider } from "@services/telemetry";
import { RuntimeProvider } from "@app/providers/RuntimeProvider";
import { AriaPresenceProvider } from "@app/providers/AriaPresenceProvider";

export function AppProviders({ children }: { children: ReactNode }) {
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
      <I18nextProviderCompat i18n={i18n}>
        <TelemetryProvider>
          <RuntimeProvider>
            <AriaPresenceProvider>{children}</AriaPresenceProvider>
          </RuntimeProvider>
        </TelemetryProvider>
      </I18nextProviderCompat>
    </UIProviders>
  );
}

const I18nextProviderCompat = I18nextProvider as ComponentType<I18nextProviderProps>;
