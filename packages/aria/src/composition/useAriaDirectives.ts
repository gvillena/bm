import { useContext, useMemo } from "react";
import { AriaPresenceContext } from "./context.js";

export function useAriaDirectives() {
  const ctx = useContext(AriaPresenceContext);
  if (!ctx) {
    throw new Error("useAriaDirectives must be used within an AriaPresenceProvider");
  }
  const { directives, setDirectives, controller } = ctx;
  return useMemo(
    () => ({ directives, setDirectives, controller }),
    [directives, setDirectives, controller]
  );
}
