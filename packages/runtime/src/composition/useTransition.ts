import { useCallback, useState } from "react";
import { useExperienceRuntimeContext } from "./context.js";
import type { TransitionResult } from "../graph/engine.js";

export const useTransition = (to: string) => {
  const { transition } = useExperienceRuntimeContext();
  const [isPending, setIsPending] = useState(false);
  const [lastResult, setLastResult] = useState<TransitionResult | undefined>(undefined);

  const run = useCallback(
    async (opts?: { signal?: AbortSignal }) => {
      setIsPending(true);
      try {
        const result = await transition(to, opts);
        setLastResult(result);
        return result;
      } finally {
        setIsPending(false);
      }
    },
    [to, transition]
  );

  return { run, isPending, lastResult };
};
