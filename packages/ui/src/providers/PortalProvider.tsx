import * as React from "react";
import { createPortal } from "react-dom";

const DEFAULT_ID = "bm-portal-root";

type PortalContextValue = {
  getContainer: () => HTMLElement | null;
};

const PortalContext = React.createContext<PortalContextValue | null>(null);

export function usePortalContainer(): HTMLElement | null {
  const ctx = React.useContext(PortalContext);
  if (!ctx) return null;
  return ctx.getContainer();
}

function ensureContainer(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let el = document.getElementById(id) as HTMLElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.style.position = "relative";
    document.body.appendChild(el);
  }
  return el;
}

export interface PortalProviderProps {
  children: React.ReactNode;
  containerId?: string;
}

export const PortalProvider: React.FC<PortalProviderProps> = ({ children, containerId = DEFAULT_ID }) => {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    setContainer(ensureContainer(containerId));
  }, [containerId]);

  const value = React.useMemo<PortalContextValue>(() => ({
    getContainer: () => container,
  }), [container]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
};

export interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const ctxContainer = usePortalContainer();
  const target = container ?? ctxContainer;
  if (!target) return null;
  return createPortal(children, target);
};
