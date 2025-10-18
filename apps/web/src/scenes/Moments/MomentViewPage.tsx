import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { authorizeViewMoment } from "@services/policies";
import { useViewerContext } from "@app/gating/useViewerContext";
import { PolicyReasons } from "@bm/ui/components/patterns/PolicyReasons";
import { fadeIn } from "@motion/presets";

function MomentViewPage() {
  const params = useParams<{ id: string }>();
  const viewerContext = useViewerContext();
  const momentId = params.id ?? "";

  const decisionQuery = useQuery({
    queryKey: ["moment", momentId, "decision"],
    queryFn: () => authorizeViewMoment(viewerContext, momentId),
    enabled: momentId.length > 0
  });

  if (decisionQuery.isLoading) {
    return <p className="text-sm text-foreground/70">Autorizando contenido…</p>;
  }

  if (!decisionQuery.data) {
    return <p className="text-sm text-foreground/70">No se encontró el momento solicitado.</p>;
  }

  const { decision, reasons, obligations, dto } = decisionQuery.data;

  return (
    <motion.div {...fadeIn()} className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/40">Momento</p>
        <h1 className="text-3xl font-semibold text-foreground">{typeof dto === "object" ? (dto as any).title ?? "Momento" : "Momento"}</h1>
      </header>
      {decision === "PERMIT" ? (
        <article className="prose prose-invert max-w-none text-foreground/80">
          <p>{typeof dto === "object" ? (dto as any).details ?? (dto as any).teaser : ""}</p>
        </article>
      ) : null}
      {decision === "REDACT" ? (
        <div className="rounded-lg border border-foreground/20 bg-background/80 p-4 text-sm text-foreground/70">
          {dto && typeof dto === "object" && (dto as any).teaser ? <p>{(dto as any).teaser}</p> : null}
          <p className="mt-2 text-xs uppercase text-foreground/50">Algunos detalles fueron protegidos.</p>
        </div>
      ) : null}
      {decision === "DENY" ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          El acceso a este momento requiere una invitación activa.
        </div>
      ) : null}
      <PolicyReasons
        reasons={reasons?.map((reason) => ({ code: reason.code, detail: reason.message ?? "" })) ?? []}
        obligations={obligations?.map((code) => ({ code }))}
      />
    </motion.div>
  );
}

export default MomentViewPage;
