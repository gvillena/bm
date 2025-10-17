import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionGuard, setReducedMotionPreference } from "@motion/guards";
import { fadeIn } from "@motion/presets";
import { useAriaPresenceValue } from "@app/providers/AriaPresenceProvider";

const PRESENCE_LEVELS = [
  { value: "minimal", label: "Mínima" },
  { value: "balanced", label: "Equilibrada" },
  { value: "protective", label: "Protectora" }
] as const;

type PresenceLevelValue = (typeof PRESENCE_LEVELS)[number]["value"];

function SettingsPage() {
  const prefersReducedMotion = useReducedMotionGuard();
  const { controller } = useAriaPresenceValue();
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
  const [presenceLevel, setPresenceLevel] = useState<PresenceLevelValue>("balanced");

  useEffect(() => {
    controller.setLevel(presenceLevel);
  }, [controller, presenceLevel]);

  return (
    <motion.section {...fadeIn()} className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Preferencias</h1>
        <p className="text-sm text-foreground/70">
          Ajustá cómo se presenta la experiencia cinematográfica según tus necesidades de accesibilidad y privacidad.
        </p>
      </header>
      <div className="space-y-6">
        <fieldset className="rounded-xl border border-foreground/10 bg-background/70 p-5">
          <legend className="text-sm font-semibold text-foreground">Animaciones</legend>
          <label className="mt-3 flex items-center gap-3 text-sm text-foreground/80">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(event) => {
                const value = event.target.checked;
                setReduceMotion(value);
                setReducedMotionPreference(value);
              }}
            />
            Reducir animaciones y micro-interacciones
          </label>
          <p className="mt-2 text-xs text-foreground/60">
            Esta preferencia complementa la configuración de tu sistema operativo y se respeta en todos los dispositivos.
          </p>
        </fieldset>
        <fieldset className="rounded-xl border border-foreground/10 bg-background/70 p-5">
          <legend className="text-sm font-semibold text-foreground">Presencia asistiva</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {PRESENCE_LEVELS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPresenceLevel(option.value)}
                className={`rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  presenceLevel === option.value
                    ? "bg-accent text-white shadow-glow"
                    : "border border-foreground/20 text-foreground/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-foreground/60">
            ARIA ajustará su tono y frecuencia para que la asistencia se sienta segura y consensuada.
          </p>
        </fieldset>
      </div>
    </motion.section>
  );
}

export default SettingsPage;
