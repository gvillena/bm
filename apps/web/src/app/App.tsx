import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/app/providers/theme/ThemeProvider";
import { AriaPresenceProvider } from "@/app/providers/ria/AriaPresenceProvider";
import { appRouter } from "@/app/router/routes";
import "@/styles/index.css";

/**
 * App (antes AppShell)
 * Capa raíz del frontend de Beneficio Mutuo.
 * Orquesta providers globales: ARIA, tema, query cache, y enrutador.
 */
export default function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AriaPresenceProvider>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                Cargando...
              </div>
            }
          >
            <RouterProvider router={appRouter} />
          </Suspense>
        </AriaPresenceProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
