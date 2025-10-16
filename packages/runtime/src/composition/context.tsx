import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { SceneFlowGraph } from "../graph/types.js";
import type { RuntimeContext, RuntimeState } from "../state/runtimeState.js";
import { ExperienceEngine, type TransitionResult, type RuntimeError } from "../graph/engine.js";
import type { PoliciesAdapter } from "../integration/policies.adapter.js";
import type { AriaAdapter } from "../integration/aria/adapter.js";
import type { Telemetry } from "../telemetry/index.js";
import type { EffectsAdapter } from "../actions/effects.js";
import type { UiDirectives } from "../integration/aria/directives.js";

export interface ExperienceRuntimeAdapters {
  readonly policies: PoliciesAdapter;
  readonly aria?: AriaAdapter;
  readonly telemetry?: Telemetry;
  readonly effects?: EffectsAdapter;
}

export interface ExperienceRuntimeValue {
  readonly engine: ExperienceEngine;
  readonly state: RuntimeState;
  readonly transition: (to: string, opts?: { signal?: AbortSignal }) => Promise<TransitionResult>;
  readonly next: (opts?: { signal?: AbortSignal }) => Promise<TransitionResult>;
  readonly lastError?: RuntimeError;
  readonly ui?: UiDirectives;
  readonly obligations?: string[];
}

const ExperienceRuntimeContext = createContext<ExperienceRuntimeValue | undefined>(undefined);

export interface ExperienceRuntimeProviderProps {
  readonly graph: SceneFlowGraph;
  readonly context: RuntimeContext;
  readonly state?: RuntimeState;
  readonly adapters: ExperienceRuntimeAdapters;
  readonly children: any;
}

export const ExperienceRuntimeProvider = ({
  graph,
  context,
  state,
  adapters,
  children,
}: ExperienceRuntimeProviderProps) => {
  const engineRef = useRef<ExperienceEngine>();
  if (!engineRef.current) {
    engineRef.current = new ExperienceEngine({
      graph,
      context,
      state,
      policies: adapters.policies,
      aria: adapters.aria,
      telemetry: adapters.telemetry,
      effects: adapters.effects,
    });
  }

  const engine = engineRef.current;
  const [runtimeState, setRuntimeState] = useState<RuntimeState>(engine.getState());
  const [lastError, setLastError] = useState<RuntimeError | undefined>(undefined);
  const [ui, setUi] = useState<UiDirectives | undefined>(undefined);
  const [obligations, setObligations] = useState<string[] | undefined>(undefined);

  const syncFromResult = useCallback((result: TransitionResult) => {
    if (result.ok) {
      setRuntimeState(result.state);
      setUi(result.ui);
      setObligations(result.obligations);
      setLastError(undefined);
    } else {
      setLastError(result.error);
    }
  }, []);

  const transition = useCallback<ExperienceRuntimeValue["transition"]>(
    async (to, opts) => {
      const result = await engine.transition(to, opts);
      syncFromResult(result);
      return result;
    },
    [engine, syncFromResult]
  );

  const next = useCallback<ExperienceRuntimeValue["next"]>(
    async (opts) => {
      const result = await engine.next(opts);
      syncFromResult(result);
      return result;
    },
    [engine, syncFromResult]
  );

  const value = useMemo<ExperienceRuntimeValue>(
    () => ({ engine, state: runtimeState, transition, next, lastError, ui, obligations }),
    [engine, runtimeState, transition, next, lastError, ui, obligations]
  );

  return <ExperienceRuntimeContext.Provider value={value}>{children}</ExperienceRuntimeContext.Provider>;
};

export const useExperienceRuntimeContext = (): ExperienceRuntimeValue => {
  const value = useContext(ExperienceRuntimeContext) as ExperienceRuntimeValue | undefined;
  if (!value) {
    throw new Error("useExperienceRuntimeContext must be used within ExperienceRuntimeProvider");
  }
  return value;
};
