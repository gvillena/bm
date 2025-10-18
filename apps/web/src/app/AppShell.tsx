import { Suspense, useMemo, type ComponentType, type ReactElement } from "react";
import { RouterProvider, type RouterProviderProps } from "react-router-dom";
import { useReducedMotionGuard } from "@motion/guards";
import { CinematicLayout } from "@app/CinematicLayout";
import { createAppRouter } from "@app/router/routes";
import { useUIProviders } from "@bm/ui";

export function AppShell(): ReactElement {
  const reducedMotion = useReducedMotionGuard();
  const { queryClient } = useUIProviders();
  const router = useMemo(() => createAppRouter({ queryClient }), [queryClient]);

  return (
    <CinematicLayout prefersReducedMotion={reducedMotion}>
      <Suspense fallback={<div className="p-6 text-sm text-foreground/70">Loading experience…</div>}>
        <RouterProviderCompat router={router} />
      </Suspense>
    </CinematicLayout>
  );
}

const RouterProviderCompat = RouterProvider as ComponentType<RouterProviderProps>;
