import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";

export interface QueryProviderProps extends PropsWithChildren {
  readonly client?: QueryClient;
}

export function QueryProvider({ children, client }: QueryProviderProps) {
  const queryClient = useMemo(
    () => client ?? new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }),
    [client]
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
