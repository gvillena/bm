import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { enterScene, exitScene } from "@motion/gsap-orchestrator";

export interface CinematicLayoutProps {
  readonly children: React.ReactNode;
  readonly prefersReducedMotion: boolean;
}

export function CinematicLayout({ children, prefersReducedMotion }: CinematicLayoutProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const dispose = prefersReducedMotion ? undefined : enterScene(element, { intensity: 0.6 });
    return () => {
      if (dispose) {
        dispose();
      }
      if (!prefersReducedMotion && element) {
        exitScene(element);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground transition-colors duration-300"
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
          animate={prefersReducedMotion ? undefined : { opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-20">
        {children}
      </main>
    </div>
  );
}
