import { useMemo } from "react";
import { useExperienceRuntimeContext } from "./context.js";

export const useScene = () => {
  const { engine, state, ui } = useExperienceRuntimeContext();
  const node = useMemo(() => engine.currentNode(), [engine, state.currentNodeId]);
  return { node, ui };
};
