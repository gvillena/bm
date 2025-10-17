import type { ReactNode } from "react";
import { ExperienceRuntimeProvider, useExperienceRuntime, useScene as useRuntimeScene } from "@bm/runtime";
import type { ExperienceGraphId } from "@experience/graphs";
import { useRuntimeEnvironment } from "@app/providers/RuntimeProvider";
import { useExperienceRuntimeAdapters } from "./engine";

export function ExperienceBoundary({
  graphId,
  children
}: {
  graphId: ExperienceGraphId;
  children: ReactNode;
}) {
  const { graph, adapters } = useExperienceRuntimeAdapters(graphId);
  const { runtimeContext } = useRuntimeEnvironment();

  return (
    <ExperienceRuntimeProvider graph={graph} context={runtimeContext} adapters={adapters}>
      {children}
    </ExperienceRuntimeProvider>
  );
}

export const useExperience = useExperienceRuntime;
export const useScene = useRuntimeScene;
