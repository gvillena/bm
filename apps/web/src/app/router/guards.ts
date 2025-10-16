import type { LoaderFunctionArgs } from "react-router-dom";

/**
 * Guardias de ruta en cliente (UX). La autoridad real vive en backend (policies).
 */
export function guardRoute(config: { requiresAuth?: boolean }) {
  return async (_args: LoaderFunctionArgs) => {
    const isAuth = !!localStorage.getItem("bm_auth_token");
    if (config.requiresAuth && !isAuth) {
      throw new Response("Unauthorized", { status: 401, statusText: "Necesitas iniciar sesión" });
    }
    return null;
  };
}
