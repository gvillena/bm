import { useMemo } from "react";
import { MotionConfig, type MotionProps, useReducedMotion } from "framer-motion";

type VariantDefinition = MotionProps["variants"];

export const fadeIn: VariantDefinition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const slideUp: VariantDefinition = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

export const panelEnter: VariantDefinition = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0 }
};

export const overlayShow: VariantDefinition = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export function useMotionPreset(preset: VariantDefinition) {
  const prefersReducedMotion = useReducedMotion();
  return useMemo(() => {
    if (!prefersReducedMotion) {
      return preset;
    }
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    } satisfies VariantDefinition;
  }, [prefersReducedMotion, preset]);
}

export interface MotionProviderProps {
  readonly children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  const transition = useMemo(
    () => ({
      duration: prefersReducedMotion ? 0 : 0.25,
      ease: prefersReducedMotion ? "linear" : [0.2, 0.8, 0.4, 1]
    }),
    [prefersReducedMotion]
  );

  return <MotionConfig transition={transition}>{children}</MotionConfig>;
}
