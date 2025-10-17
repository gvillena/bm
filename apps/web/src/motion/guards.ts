import { useEffect, useState } from "react";

const STORAGE_KEY = "bm:preferences:reduce-motion";

export function readReducedMotionPreference(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return stored === "true";
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setReducedMotionPreference(value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
}

export function useReducedMotionGuard(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(readReducedMotionPreference);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        setPrefersReducedMotion(mediaQuery.matches);
      }
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue !== null) {
        setPrefersReducedMotion(event.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return prefersReducedMotion;
}

export function shouldReduceMotion(): boolean {
  return readReducedMotionPreference();
}
