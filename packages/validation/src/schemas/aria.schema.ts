import { z } from "zod";
import { SafeText } from "./primitives";

export const Tone = z.enum(["neutral", "warm", "direct", "caring", "protective"] as const);
export const PresenceLevel = z.enum(["minimal", "standard", "immersive"] as const);
export const AuraPreset = z.enum(["calm", "clear", "protective"] as const);

export const UiAction = z.object({
  label: SafeText,
  actionRef: z.object({
    name: SafeText,
    params: z.record(z.unknown()).optional()
  }),
  kind: z.enum(["primary", "secondary", "danger", "ghost"] as const).optional()
});

export const UiDirectives = z.object({
  hints: z.array(SafeText).max(5).optional(),
  actions: z.array(UiAction).max(4).optional(),
  tone: Tone.optional(),
  explain: SafeText.optional(),
  ephemeral: z.boolean().optional(),
  aura: AuraPreset.optional(),
  presenceLevel: PresenceLevel.optional()
});

export type UiDirectives = z.infer<typeof UiDirectives>;
