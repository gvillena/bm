import { createBrowserRouter, type RouteObject } from "react-router";
import { guardRoute } from "./guards";
import NotFound from "../errors/NotFound";

// Páginas mínimas para arrancar (puedes reemplazarlas por tus flows reales)
const Landing = () => (
  <div className="p-6">
    <h1 className="text-xl font-semibold">Beneficio Mutuo</h1>
    <p className="text-sm opacity-80 mt-2">
      Claridad, consentimiento y cuidado.
    </p>
  </div>
);

const Dashboard = () => (
  <div className="p-6">
    <h2 className="text-lg font-semibold">Panel</h2>
    <p className="text-sm opacity-80 mt-2">Tu punto de partida.</p>
  </div>
);

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      { index: true, element: <Landing /> },
      {
        path: "app",
        loader: guardRoute({ requiresAuth: true }),
        element: <Dashboard />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const appRouter = createBrowserRouter(routes);
