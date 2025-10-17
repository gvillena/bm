import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroLayers } from "@scenes/Home/HeroLayers";
import { fadeIn, riseIn } from "@motion/presets";

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="flex flex-1 flex-col gap-12">
      <HeroLayers />
      <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
        <motion.div {...fadeIn(0.1)} className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">{t("hero.title")}</h2>
          <p className="text-base text-foreground/70">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Primary actions">
            <button
              type="button"
              onClick={() => navigate("/onboarding")}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white shadow-glow transition-colors duration-200 hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("hero.cta")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/moments/new")}
              className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:border-foreground/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Crear un momento
            </button>
          </div>
        </motion.div>
        <motion.aside {...riseIn(0.2)} className="space-y-4 rounded-2xl border border-foreground/10 bg-background/60 p-6">
          <h3 className="text-lg font-semibold text-foreground">Latidos en escena</h3>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li>
              <strong className="font-medium text-foreground">Consentimiento vivo:</strong> cada paso pide confirmación explícita.
            </li>
            <li>
              <strong className="font-medium text-foreground">Telemetría cuidadosa:</strong> auditamos sin exponer datos sensibles.
            </li>
            <li>
              <strong className="font-medium text-foreground">Presencia asistiva:</strong> regulá ARIA entre mínima y protectora.
            </li>
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}

export default HomePage;
