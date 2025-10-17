import { lazy } from "react";
import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  type RouteObject
} from "react-router-dom";
import type { QueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "@app/errors/ErrorBoundary";
import { NotFound } from "@app/errors/NotFound";
import { fetchPolicySnapshot } from "@services/policies";
import { requireAuthenticatedUser } from "@app/router/guards";

const HomePage = lazy(() => import("@scenes/Home/HomePage"));
const OnboardingPage = lazy(() => import("@scenes/Onboarding/OnboardingPage"));
const NewMomentPage = lazy(() => import("@scenes/Moments/NewMomentPage"));
const MomentViewPage = lazy(() => import("@scenes/Moments/MomentViewPage"));
const ERDSimulatorPage = lazy(() => import("@scenes/Moments/ERDSimulatorPage"));
const ReviewPage = lazy(() => import("@scenes/Agreements/ReviewPage"));
const SafePage = lazy(() => import("@scenes/Safe/SafePage"));
const SettingsPage = lazy(() => import("@scenes/Settings/SettingsPage"));

interface RouterFactoryOptions {
  readonly queryClient: QueryClient;
}

async function ensurePolicySnapshot(queryClient: QueryClient) {
  await queryClient.ensureQueryData({ queryKey: ["policySnapshot"], queryFn: fetchPolicySnapshot });
}

function createRoutes(queryClient: QueryClient): RouteObject[] {
  return [
    {
      path: "/",
      element: <HomePage />,
      loader: () => ensurePolicySnapshot(queryClient),
      errorElement: <ErrorBoundary />
    },
    {
      path: "/onboarding",
      element: <OnboardingPage />,
      loader: async ({ request }: LoaderFunctionArgs) => {
        await ensurePolicySnapshot(queryClient);
        await requireAuthenticatedUser(request).catch(() => null);
        return null;
      },
      errorElement: <ErrorBoundary />
    },
    {
      path: "/moments/new",
      element: <NewMomentPage />,
      loader: () => ensurePolicySnapshot(queryClient),
      errorElement: <ErrorBoundary />
    },
    {
      path: "/moments/:id",
      element: <MomentViewPage />,
      loader: async ({ params }: LoaderFunctionArgs) => {
        if (!params.id) {
          throw new Response("Not found", { status: 404 });
        }
        await ensurePolicySnapshot(queryClient);
        return null;
      },
      errorElement: <ErrorBoundary />
    },
    {
      path: "/moments/:id/erd",
      element: <ERDSimulatorPage />,
      loader: () => ensurePolicySnapshot(queryClient),
      errorElement: <ErrorBoundary />
    },
    {
      path: "/agreements/:id/review",
      element: <ReviewPage />,
      loader: async ({ request }: LoaderFunctionArgs) => {
        await ensurePolicySnapshot(queryClient);
        await requireAuthenticatedUser(request).catch(() => null);
        return null;
      },
      errorElement: <ErrorBoundary />
    },
    {
      path: "/safe",
      element: <SafePage />,
      loader: () => ensurePolicySnapshot(queryClient)
    },
    {
      path: "/settings",
      element: <SettingsPage />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ];
}

export function createAppRouter({ queryClient }: RouterFactoryOptions) {
  return createBrowserRouter(createRoutes(queryClient));
}
