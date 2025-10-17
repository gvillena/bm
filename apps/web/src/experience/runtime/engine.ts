import { useMemo } from "react";
import type { ExperienceRuntimeAdapters } from "@bm/runtime/composition/context";
import { createPermitDecision } from "@bm/runtime";
import type { ViewerContext } from "@bm/policies";
import { createRuntimeAdapter as createAriaRuntimeAdapter } from "@bm/aria";
import type { SceneFlowGraph } from "@bm/runtime";
import { onboardingGraph, momentGraph, agreementOfferGraph, safeGraph, type ExperienceGraphId } from "@experience/graphs";
import { useRuntimeEnvironment } from "@app/providers/RuntimeProvider";
import { useAriaPresenceValue } from "@app/providers/AriaPresenceProvider";
import { authorizeAgreementReview, authorizeViewMoment } from "@services/policies";
import type { PoliciesAdapter } from "@bm/runtime";
import { getRuntimeEffects } from "@services/sdk";

const GRAPHS: Record<ExperienceGraphId, SceneFlowGraph> = {
  onboarding: onboardingGraph,
  moment: momentGraph,
  agreementOffer: agreementOfferGraph,
  safe: safeGraph
};

function resolveResourceId(params?: Record<string, unknown>): string | undefined {
  if (!params) return undefined;
  if (typeof params.resourceId === "string") return params.resourceId;
  if (typeof params.id === "string") return params.id;
  if (typeof params.momentId === "string") return params.momentId;
  if (typeof params.agreementId === "string") return params.agreementId;
  return undefined;
}

function createPoliciesAdapter(): PoliciesAdapter {
  const authorizeMoment = async (viewer: ViewerContext, resource: unknown) => {
    const id = typeof resource === "string" ? resource : resolveResourceId(resource as Record<string, unknown>);
    if (!id) {
      return createPermitDecision();
    }
    return authorizeViewMoment(viewer, id);
  };

  const authorizeAgreement = async (viewer: ViewerContext, resource: unknown) => {
    const id = typeof resource === "string" ? resource : resolveResourceId(resource as Record<string, unknown>);
    if (!id) {
      return createPermitDecision();
    }
    return authorizeAgreementReview(viewer, id);
  };

  return {
    authorizeViewMoment: authorizeMoment,
    authorizeEditAgreement: authorizeAgreement,
    evaluateGuard: async (name, input) => {
      switch (name) {
        case "server-authorize-view-moment":
          return authorizeMoment(input.viewerContext as ViewerContext, input.params);
        case "server-authorize-agreement":
          return authorizeAgreement(input.viewerContext as ViewerContext, input.params);
        default:
          return createPermitDecision();
      }
    }
  } satisfies PoliciesAdapter;
}

export function useExperienceRuntimeAdapters(graphId: ExperienceGraphId): {
  graph: SceneFlowGraph;
  adapters: ExperienceRuntimeAdapters;
} {
  const runtime = useRuntimeEnvironment();
  const aria = useAriaPresenceValue();

  const graph = GRAPHS[graphId];
  const policiesAdapter = useMemo(() => createPoliciesAdapter(), []);

  const adapters = useMemo<ExperienceRuntimeAdapters>(
    () => ({
      policies: policiesAdapter,
      aria: createAriaRuntimeAdapter(aria.controller),
      telemetry: runtime.telemetry.runtime,
      effects: getRuntimeEffects()
    }),
    [aria.controller, policiesAdapter, runtime.telemetry.runtime]
  );

  return { graph, adapters };
}
