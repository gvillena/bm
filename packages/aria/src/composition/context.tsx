import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { PresenceController } from "../presence/controller.js";
import type { AuraPreset, PresenceLevel, UiDirectives } from "../presence/types.js";

export interface AriaPresenceContextValue {
  controller: PresenceController;
  directives: UiDirectives | null;
  level: PresenceLevel;
  aura: AuraPreset;
  setDirectives(directives: UiDirectives | null): void;
  setLevel(level: PresenceLevel): void;
  setAura(aura: AuraPreset): void;
}

export const AriaPresenceContext = createContext<AriaPresenceContextValue | undefined>(undefined);

export interface AriaPresenceProviderProps {
  controller: PresenceController;
  children: ReactNode;
}

export function AriaPresenceProvider({ controller, children }: AriaPresenceProviderProps) {
  const [directives, setDirectives] = useState<UiDirectives | null>(null);
  const [level, setLevelState] = useState<PresenceLevel>(controller.getLevel());
  const [aura, setAuraState] = useState<AuraPreset>(controller.getAura());

  const setLevel = useCallback(
    (next: PresenceLevel) => {
      controller.setLevel(next);
      setLevelState(next);
    },
    [controller]
  );

  const setAura = useCallback(
    (next: AuraPreset) => {
      controller.setAura(next);
      setAuraState(next);
    },
    [controller]
  );

  const value = useMemo<AriaPresenceContextValue>(
    () => ({ controller, directives, setDirectives, level, aura, setLevel, setAura }),
    [controller, directives, level, aura, setLevel, setAura]
  );

  return <AriaPresenceContext.Provider value={value}>{children}</AriaPresenceContext.Provider>;
}
