import type { MotionProps } from "framer-motion";
import { shouldReduceMotion } from "./guards";

function maybeDisableTransforms(): Partial<MotionProps> {
  if (shouldReduceMotion()) {
    return {
      transition: { duration: 0.01 },
      animate: { opacity: 1 },
      initial: { opacity: 1 }
    };
  }
  return {};
}

export function fadeIn(delay = 0): MotionProps {
  const reduced = shouldReduceMotion();
  return {
    initial: { opacity: reduced ? 1 : 0 },
    animate: { opacity: 1 },
    exit: { opacity: reduced ? 1 : 0 },
    transition: { duration: reduced ? 0.12 : 0.28, ease: "easeOut", delay }
  };
}

export function riseIn(delay = 0): MotionProps {
  const reduced = shouldReduceMotion();
  return {
    initial: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.16 : 0.32, ease: [0.2, 0.8, 0.4, 1], delay }
  };
}

export function scaleIn(delay = 0): MotionProps {
  const reduced = shouldReduceMotion();
  return {
    initial: { opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: reduced ? 0.16 : 0.36, ease: [0.16, 1, 0.3, 1], delay }
  };
}

export function panelEnter(): MotionProps {
  const reduced = shouldReduceMotion();
  return {
    initial: { opacity: reduced ? 1 : 0, x: reduced ? 0 : 24 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: reduced ? 0.14 : 0.28, ease: [0.18, 0.86, 0.4, 1] }
  };
}

export function overlayShow(): MotionProps {
  const reduced = shouldReduceMotion();
  return {
    initial: { opacity: reduced ? 1 : 0 },
    animate: { opacity: 1 },
    exit: { opacity: reduced ? 1 : 0 },
    transition: { duration: reduced ? 0.12 : 0.24, ease: [0.25, 0.8, 0.4, 1] }
  };
}

export const disableTransforms = maybeDisableTransforms;
