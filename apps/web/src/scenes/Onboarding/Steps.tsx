import { motion } from "framer-motion";
import { riseIn } from "@motion/presets";

const STEPS = [
  { id: "intent", label: "Tu intención" },
  { id: "consent", label: "Consentimiento" },
  { id: "profile", label: "Preferencias" }
];

export function OnboardingSteps() {
  return (
    <motion.ol {...riseIn(0.15)} className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
      {STEPS.map((step, index) => (
        <li key={step.id} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 text-foreground/80">
            {index + 1}
          </span>
          <span>{step.label}</span>
        </li>
      ))}
    </motion.ol>
  );
}
