import { useState } from "react";
import { ERDSimulator, type SimulatorField } from "@bm/ui";
import type { ViewerContext } from "@bm/policies";
import { motion } from "framer-motion";
import { fadeIn } from "@motion/presets";

const INITIAL_FIELDS: SimulatorField[] = [
  { id: "teaser", label: "Avance", outcome: "PERMIT" },
  { id: "details", label: "Detalles íntimos", outcome: "REDACT" },
  { id: "owner", label: "Información del círculo", outcome: "NONE" }
];

const VIEWER_CONTEXT: ViewerContext = {
  role: "viewer",
  tier: "FREE",
  relation: "invited",
  reciprocityScore: "mid",
  careScore: "high",
  featureFlags: { immersiveAgreements: true }
};

function ERDSimulatorPage() {
  const [fields, setFields] = useState<SimulatorField[]>(INITIAL_FIELDS);

  return (
    <motion.section {...fadeIn()} className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Simulador ERD</h1>
        <p className="text-sm text-foreground/70">
          Visualizá qué vería cada persona según las políticas activas antes de compartir un momento sensible.
        </p>
      </header>
      <ERDSimulator
        fields={fields}
        viewerContext={VIEWER_CONTEXT}
        onOutcomeChange={(fieldId, outcome) =>
          setFields((current) => current.map((field) => (field.id === fieldId ? { ...field, outcome } : field)))
        }
      />
    </motion.section>
  );
}

export default ERDSimulatorPage;
