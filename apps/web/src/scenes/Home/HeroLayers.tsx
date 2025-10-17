import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { shouldReduceMotion } from "@motion/guards";
import noiseTexture from "@assets/noise.svg?url";

interface HeroLayersProps {
  readonly intensity?: number;
}

export function HeroLayers({ intensity = 0.6 }: HeroLayersProps) {
  const reduceMotion = shouldReduceMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const backgroundX = useTransform(x, (value) => value * 0.08 * intensity);
  const backgroundY = useTransform(y, (value) => value * 0.08 * intensity);
  const glowX = useTransform(x, (value) => value * 0.12 * intensity);
  const glowY = useTransform(y, (value) => value * 0.12 * intensity);

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") {
      return;
    }
    const handlePointer = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (event.clientX / innerWidth - 0.5) * 2;
      const offsetY = (event.clientY / innerHeight - 0.5) * 2;
      x.set(offsetX);
      y.set(offsetY);
    };
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, [reduceMotion, x, y]);

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-foreground/5 to-foreground/20">
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${noiseTexture})`,
          mixBlendMode: "soft-light",
          x: backgroundX,
          y: backgroundY
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
        style={{ x: glowX, y: glowY }}
        animate={reduceMotion ? undefined : { opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-foreground/20 blur-3xl"
        style={{ x: glowX, y: glowY }}
        animate={reduceMotion ? undefined : { opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 flex h-full flex-col justify-center gap-6 p-12 text-left">
        <p className="text-sm uppercase tracking-[0.4em] text-foreground/60">Beneficio Mutuo</p>
        <h1 className="max-w-2xl text-4xl font-semibold text-foreground sm:text-5xl">
          Experiencias cinematográficas con resguardo ético
        </h1>
        <p className="max-w-xl text-base text-foreground/70">
          Coreografiamos cada escena con consentimiento vivo, trazas auditables y presencia asistiva que podés modular.
        </p>
      </div>
    </div>
  );
}
