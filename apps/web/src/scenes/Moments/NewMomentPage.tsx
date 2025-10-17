import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useZodForm } from "@bm/ui/hooks";
import { fadeIn } from "@motion/presets";
import { motion } from "framer-motion";

const schema = z.object({
  title: z.string().min(3, "Necesita al menos 3 caracteres"),
  teaser: z.string().min(10, "Contá un poco más"),
  visibility: z.enum(["PUBLIC", "CIRCLE"])
});

function NewMomentPage() {
  const form = useZodForm({ schema, defaultValues: { visibility: "PUBLIC" } });
  const [busy, setBusy] = useState(false);

  const onSubmit = form.handleSubmit(async (values) => {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Borrador guardado sin enviar datos sensibles");
    console.info("moment.draft", { ...values, teaser: values.teaser.length });
    setBusy(false);
  });

  return (
    <motion.form {...fadeIn()} onSubmit={onSubmit} className="space-y-6" aria-label="Nuevo momento">
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="title">
          Título del momento
        </label>
        <input
          id="title"
          type="text"
          {...form.register("title")}
          aria-invalid={form.formState.errors.title ? "true" : undefined}
          className="mt-2 w-full rounded-lg border border-foreground/20 bg-background/80 px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {form.formState.errors.title ? (
          <p className="mt-1 text-xs text-danger" role="alert">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="teaser">
          Descripción breve
        </label>
        <textarea
          id="teaser"
          rows={4}
          {...form.register("teaser")}
          aria-invalid={form.formState.errors.teaser ? "true" : undefined}
          className="mt-2 w-full rounded-lg border border-foreground/20 bg-background/80 px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        {form.formState.errors.teaser ? (
          <p className="mt-1 text-xs text-danger" role="alert">
            {form.formState.errors.teaser.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground" htmlFor="visibility">
          Visibilidad
        </label>
        <select
          id="visibility"
          {...form.register("visibility")}
          className="mt-2 w-full rounded-lg border border-foreground/20 bg-background/80 px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <option value="PUBLIC">Público</option>
          <option value="CIRCLE">Círculo cercano</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-glow transition-opacity duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Guardar borrador
        </button>
        <button
          type="button"
          className="rounded-full border border-foreground/20 px-5 py-2 text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground"
        >
          Vista previa ERD
        </button>
      </div>
    </motion.form>
  );
}

export default NewMomentPage;
