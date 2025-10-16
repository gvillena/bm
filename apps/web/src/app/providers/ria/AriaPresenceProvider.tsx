import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

/**
 * ARIA Presence (frontend):
 * - Controla nivel de presencia y "aura" (tono visual/emocional).
 * - No guarda secretos ni prompts; eso vive en backend.
 */
export type AriaPresenceLevel = "minimal" | "standard" | "immersive";
export type AriaAuraPreset = "calm" | "clear" | "protective";

export type AriaPresenceState = {
  level: AriaPresenceLevel;
  aura: AriaAuraPreset;
  setLevel: (l: AriaPresenceLevel) => void;
  setAura: (a: AriaAuraPreset) => void;
};

const Ctx = createContext<AriaPresenceState | null>(null);

export function AriaPresenceProvider({ children }: PropsWithChildren) {
  const [level, setLevel] = useState<AriaPresenceLevel>("standard");
  const [aura, setAura] = useState<AriaAuraPreset>("calm");

  const value = useMemo(
    () => ({ level, aura, setLevel, setAura }),
    [level, aura]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAriaPresence() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAriaPresence must be used within AriaPresenceProvider");
  return ctx;
}
