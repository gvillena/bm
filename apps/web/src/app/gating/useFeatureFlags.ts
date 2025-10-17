import { useMemo } from "react";

export type FeatureFlags = Record<string, boolean>;

export function useFeatureFlags(): FeatureFlags {
  return useMemo(
    () => ({
      onboardingExperimental: true,
      immersiveAgreements: true,
      ariaPresence: true
    }),
    []
  );
}
