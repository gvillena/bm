import { ExperienceBoundary, useExperience } from "@experience/runtime/hooks";
import { motion } from "framer-motion";
import { fadeIn } from "@motion/presets";

function SafeContent() {
  const runtime = useExperience();
  return (
    <motion.section {...fadeIn()} className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Modo contención</h1>
        <p className="text-sm text-foreground/70">
          Estamos sosteniendo un espacio sin nuevas sugerencias. Respirar también es avanzar.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-foreground/10 bg-background/80 p-5 text-sm text-foreground/70">
          <h2 className="text-lg font-medium text-foreground">Recursos de emergencia</h2>
          <ul className="mt-3 space-y-2">
            <li>Guía de contención emocional (PDF)</li>
            <li>Red de profesionales aliades</li>
            <li>Checklist para pausa saludable</li>
          </ul>
        </article>
        <article className="rounded-xl border border-foreground/10 bg-background/80 p-5 text-sm text-foreground/70">
          <h2 className="text-lg font-medium text-foreground">Notas personales</h2>
          <p className="mt-3">Podés sumar notas privadas sin que nadie más las lea.</p>
          <button className="mt-4 rounded-full border border-foreground/20 px-4 py-2 text-sm text-foreground/70">
            Registrar nota
          </button>
        </article>
      </div>
      <p className="text-xs text-foreground/50">Última transición: {new Date(runtime.state.updatedAt).toLocaleString()}</p>
    </motion.section>
  );
}

function SafePage() {
  return (
    <ExperienceBoundary graphId="safe">
      <SafeContent />
    </ExperienceBoundary>
  );
}

export default SafePage;
