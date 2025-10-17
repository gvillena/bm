import { gsap } from "gsap";
import { shouldReduceMotion } from "./guards";

type Cleanup = () => void;

export function enterScene(element: HTMLElement, options: { intensity?: number } = {}): Cleanup {
  if (shouldReduceMotion()) {
    element.style.opacity = "1";
    element.style.filter = "none";
    return () => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("filter");
    };
  }

  const intensity = Math.min(Math.max(options.intensity ?? 0.5, 0), 1);
  const blurAmount = 12 * intensity;
  const ctx = gsap.context(() => {
    gsap.fromTo(
      element,
      { opacity: 0, filter: `blur(${blurAmount}px)` },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out",
      }
    );
  }, element);

  return () => ctx.revert();
}

export function exitScene(element: HTMLElement): void {
  if (shouldReduceMotion()) {
    return;
  }
  gsap.to(element, { opacity: 0, y: 24, duration: 0.2, ease: "power2.in" });
}

export function openImmersive(element: HTMLElement): Cleanup {
  if (shouldReduceMotion()) {
    element.style.opacity = "1";
    return () => element.style.removeProperty("opacity");
  }
  const tl = gsap.timeline();
  tl.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration: 0.18, ease: "power1.out" }
  );
  tl.fromTo(
    element.querySelector("[data-immersive-panel]") as HTMLElement | null,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.32, ease: "back.out(1.4)" },
    "<"
  );
  return () => tl.kill();
}

export function closeImmersive(element: HTMLElement): void {
  if (shouldReduceMotion()) {
    return;
  }
  gsap.to(element, { opacity: 0, duration: 0.18, ease: "power1.in" });
}
