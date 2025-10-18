import { createContext, useContext, useMemo, type ReactNode } from "react";
import { PresenceBudget, PresenceController, defaultGuardrails } from "@bm/aria";
import type { AriaBridge } from "@bm/sdk";
import { getAriaBridge } from "@services/sdk";
import { useRuntimeEnvironment } from "@app/providers/RuntimeProvider";

interface AriaPresenceValue {
  readonly controller: PresenceController;
  readonly bridge: AriaBridge;
}

const AriaPresenceContext = createContext<AriaPresenceValue | null>(null);

export function AriaPresenceProvider({ children }: { children: ReactNode }) {
  const runtime = useRuntimeEnvironment();
  const controller = useMemo(
    () =>
      new PresenceController({
        budget: new PresenceBudget({ perMinute: 4, perNode: 2, backoffMs: 20_000 }),
        guardrails: defaultGuardrails,
        telemetry: runtime.telemetry.aria
      }),
    [runtime.telemetry.aria]
  );

  const bridge = useMemo(() => getAriaBridge(runtime.http), [runtime.http]);

  const value = useMemo<AriaPresenceValue>(() => ({ controller, bridge }), [controller, bridge]);

  return <AriaPresenceContext.Provider value={value}>{children}</AriaPresenceContext.Provider>;
}

export function useAriaPresenceValue(): AriaPresenceValue {
  const context = useContext(AriaPresenceContext);
  if (!context) {
    throw new Error("AriaPresenceProvider missing in component tree");
  }
  return context;
}
