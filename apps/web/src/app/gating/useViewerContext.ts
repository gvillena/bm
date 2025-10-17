import { useMemo } from "react";
import type { ViewerContext } from "@bm/policies";

export const DEFAULT_VIEWER_CONTEXT: ViewerContext = {
  role: "viewer",
  tier: "FREE",
  relation: "none",
  featureFlags: { immersiveAgreements: true }
};

export function useViewerContext(): ViewerContext {
  return useMemo(() => DEFAULT_VIEWER_CONTEXT, []);
}
