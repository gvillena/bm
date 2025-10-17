import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AgreementReview } from "@bm/ui/components/patterns/AgreementReview";
import type { AgreementDiff } from "@bm/sdk";
import { ExperienceBoundary, useExperience } from "@experience/runtime/hooks";
import { useAriaPresenceValue } from "@app/providers/AriaPresenceProvider";
import { overlayShow } from "@motion/presets";
import { openImmersive, closeImmersive } from "@motion/gsap-orchestrator";

const SAMPLE_DIFF: AgreementDiff = {
  fields: [
    { field: "Cuidado mutuo", from: "Check-in semanal", to: "Check-in dos veces por semana" },
    { field: "Recursos", from: "Fondo común", to: "Fondo + asesoramiento externo" }
  ]
};

function ImmersiveOverlay() {
  const runtime = useExperience();
  const { bridge } = useAriaPresenceValue();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const element = overlayRef.current;
    if (!element) return;
    if (open) {
      const dispose = openImmersive(element);
      return () => dispose?.();
    }
    closeImmersive(element);
  }, [open]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-foreground/20 px-4 py-2 text-sm text-foreground/70"
      >
        Reabrir revisión inmersiva
      </button>
    );
  }

  return (
    <motion.div
      ref={overlayRef}
      {...overlayShow()}
      role="dialog"
      aria-modal="true"
      aria-label="Revisión de acuerdo"
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-background/70 backdrop-blur"
      data-immersive
    >
      <div data-immersive-panel className="relative max-w-5xl rounded-3xl border border-foreground/10 bg-background/95 p-6 shadow-cinematic">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-sm text-foreground/60 hover:text-foreground"
        >
          Cerrar
        </button>
        <AgreementReview
          title="Actualización de acuerdo de convivencia"
          diff={SAMPLE_DIFF}
          comments={[{ id: "1", author: "Moderación", text: "Acordar límites claros de disponibilidad." }]}
          onApprove={() => {
            void bridge.sendFeedback({
              thumbs: "up",
              context: { graphId: runtime.state.graphId, nodeId: runtime.state.currentNodeId },
              comment: "Aprobado"
            });
            setOpen(false);
          }}
          actionLabels={{ approve: "Aceptar cambios" }}
        />
      </div>
    </motion.div>
  );
}

function ReviewPage() {
  return (
    <ExperienceBoundary graphId="agreementOffer">
      <ImmersiveOverlay />
    </ExperienceBoundary>
  );
}

export default ReviewPage;
