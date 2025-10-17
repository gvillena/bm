import { createContext, useContext, useMemo } from "react";
import type { RuntimeContext } from "@bm/runtime";
import type { SdkClients, HttpClient } from "@bm/sdk";
import type { FrontendTelemetry } from "@services/telemetry";
import { useTelemetry } from "@services/telemetry";
import { initializeSdk } from "@services/sdk";
import { useViewerContext } from "@app/gating/useViewerContext";
import { useFeatureFlags } from "@app/gating/useFeatureFlags";
import { usePolicySnapshot } from "@app/gating/usePolicySnapshot";

export interface RuntimeEnvironment {
  readonly runtimeContext: RuntimeContext;
  readonly telemetry: FrontendTelemetry;
  readonly http: HttpClient;
  readonly clients: SdkClients;
  readonly policySnapshotId?: string;
  readonly policyLoading: boolean;
}

const RuntimeEnvironmentContext = createContext<RuntimeEnvironment | null>(null);

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  const telemetry = useTelemetry();
  const viewerContext = useViewerContext();
  const featureFlags = useFeatureFlags();
  const snapshot = usePolicySnapshot();
  const sdk = useMemo(() => initializeSdk(telemetry), [telemetry]);

  const runtimeContext = useMemo<RuntimeContext>(
    () => ({
      viewerContext: { ...viewerContext, featureFlags },
      policySnapshotId: snapshot.data?.policySnapshotId,
      featureFlags,
      now: () => Date.now()
    }),
    [featureFlags, snapshot.data?.policySnapshotId, viewerContext]
  );

  const value = useMemo<RuntimeEnvironment>(
    () => ({
      runtimeContext,
      telemetry,
      http: sdk.http,
      clients: sdk.clients,
      policySnapshotId: snapshot.data?.policySnapshotId,
      policyLoading: snapshot.isFetching
    }),
    [runtimeContext, telemetry, sdk, snapshot.data?.policySnapshotId, snapshot.isFetching]
  );

  return <RuntimeEnvironmentContext.Provider value={value}>{children}</RuntimeEnvironmentContext.Provider>;
}

export function useRuntimeEnvironment(): RuntimeEnvironment {
  const context = useContext(RuntimeEnvironmentContext);
  if (!context) {
    throw new Error("RuntimeProvider missing in component tree");
  }
  return context;
}
