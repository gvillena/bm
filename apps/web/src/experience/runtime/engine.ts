import { useMemo } from "react";
import { createPermitDecision, ExperienceRuntimeProvider } from "@bm/runtime";
import type { ViewerContext } from "@bm/policies";
import {
  createRuntimeAdapter as createAriaRuntimeAdapter,
  type RawRuntimeEvent,
  type RuntimeCtx
} from "@bm/aria";
import type { SceneFlowGraph } from "@bm/runtime";
import { onboardingGraph, momentGraph, agreementOfferGraph, safeGraph, type ExperienceGraphId } from "@experience/graphs";
import { useRuntimeEnvironment } from "@app/providers/RuntimeProvider";
import { useAriaPresenceValue } from "@app/providers/AriaPresenceProvider";
import { authorizeAgreementReview, authorizeViewMoment } from "@services/policies";
import type { PoliciesAdapter } from "@bm/runtime";

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
  const authorizeMoment = async (viewerContext: unknown, resource: unknown) => {
    const viewer = viewerContext as ViewerContext;
    const id = typeof resource === "string" ? resource : resolveResourceId(resource as Record<string, unknown>);
    if (!id) {
      return createPermitDecision();
    }
    return authorizeViewMoment(viewer, id);
  };

  const authorizeAgreement = async (viewerContext: unknown, resource: unknown) => {
    const viewer = viewerContext as ViewerContext;
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
          return authorizeMoment(input.viewerContext, input.params);
        case "server-authorize-agreement":
          return authorizeAgreement(input.viewerContext, input.params);
        default:
          return createPermitDecision();
      }
    }
  } satisfies PoliciesAdapter;
}

type ExperienceRuntimeAdapters = Parameters<
  typeof ExperienceRuntimeProvider
>[0]["adapters"];

export function useExperienceRuntimeAdapters(graphId: ExperienceGraphId): {
  graph: SceneFlowGraph;
  adapters: ExperienceRuntimeAdapters;
} {
  const runtime = useRuntimeEnvironment();
  const aria = useAriaPresenceValue();

  const graph = GRAPHS[graphId];
  const policiesAdapter = useMemo(() => createPoliciesAdapter(), []);

  const adapters = useMemo<ExperienceRuntimeAdapters>(() => {
    const runtimeHandler = createAriaRuntimeAdapter(aria.controller);
    const ariaAdapter = {
      onNodeEnter: (node: SceneFlowGraph["nodes"][string], ctx: { viewerContext: unknown }) => {
        const event: RawRuntimeEvent = {
          type: "didEnter",
          payload: { nodeId: node.id },
          timestamp: runtime.runtimeContext.now?.() ?? Date.now()
        };
        const runtimeCtx: RuntimeCtx = {
          viewerContext: ctx.viewerContext as ViewerContext,
          policySnapshotId: runtime.runtimeContext.policySnapshotId,
          graphId: graph.id,
          nodeId: node.id
        };
        return runtimeHandler(event, runtimeCtx) ?? undefined;
      },
      onGuardDenied: (reasons: string[]) => ({
        tone: "protective",
        hints: reasons
      })
    } as ExperienceRuntimeAdapters["aria"];

    return {
      policies: policiesAdapter,
      aria: ariaAdapter,
      telemetry: runtime.telemetry.runtime,
      effects: undefined
    } satisfies ExperienceRuntimeAdapters;
  }, [
    aria.controller,
    graph.id,
    policiesAdapter,
    runtime.runtimeContext.now,
    runtime.runtimeContext.policySnapshotId,
    runtime.telemetry.runtime
  ]);

  return { graph, adapters };
}
