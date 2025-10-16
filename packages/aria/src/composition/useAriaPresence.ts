import { useContext } from "react";
import { AriaPresenceContext } from "./context.js";

export function useAriaPresence() {
  const ctx = useContext(AriaPresenceContext);
  if (!ctx) {
    throw new Error("useAriaPresence must be used within an AriaPresenceProvider");
  }
  const { level, aura, setLevel, setAura, controller } = ctx;
  return { level, aura, setLevel, setAura, controller };
}
