import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import { ThemeProvider, type ThemeProviderProps } from "../theme/index.js";
import { MotionProvider } from "../theme/motion.js";
import { TooltipProvider } from "../components/base/Tooltip.js";
import { Toaster } from "sonner";

type UIProvidersContextValue = {
  readonly queryClient: QueryClient;
};

const UIProvidersContext = createContext<UIProvidersContextValue | null>(null);

export interface UIProvidersProps extends ThemeProviderProps {
  readonly children: React.ReactNode;
  readonly queryClient?: QueryClient;
}

export function UIProviders({
  children,
  initialTheme,
  queryClient: providedQueryClient
}: UIProvidersProps) {
  const queryClient = useMemo(
    () => providedQueryClient ?? new QueryClient({ defaultOptions: { queries: { retry: 1 } } }),
    [providedQueryClient]
  );

  const contextValue = useMemo(() => ({ queryClient }), [queryClient]);

  return (
    <UIProvidersContext.Provider value={contextValue}>
      <ThemeProvider initialTheme={initialTheme}>
        <MotionProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={250}>
              {children}
              <Toaster richColors position="top-right" closeButton />
            </TooltipProvider>
          </QueryClientProvider>
        </MotionProvider>
      </ThemeProvider>
    </UIProvidersContext.Provider>
  );
}

export function useUIProviders() {
  const ctx = useContext(UIProvidersContext);
  if (!ctx) {
    throw new Error("useUIProviders must be used within UIProviders");
  }
  return ctx;
}
