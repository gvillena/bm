import { z } from "zod";
import { type Brand, type Branded } from "../utils/brand";
import {
  boundedString,
  safeText as safeTextValidator,
} from "../validators/strings";
import { nonNegativeInt, percentage } from "../validators/numbers";
import { isoDateString } from "../validators/dates";

const cuid2Regex = /^[a-z][a-z0-9]{23}$/i;
const idMessage = (resource: string) => `Identificador de ${resource} inválido`;

/**
 * IdBrand ahora es un literal de tipo `id:<resource>` compatible con string.
 * Esto elimina el error TS2344 sin perder la semántica del tipo.
 */
export type IdBrand<T extends string> = `id:${T}`;

/**
 * Identificador tipado (opaque type compatible con Zod)
 * Ejemplo: Id<'moment'> → string & { __brand: 'id:moment' }
 */
export type Id<T extends string> = Branded<string, IdBrand<T>>;

/**
 * Schema para validar IDs (UUID v4 o CUID2)
 */
export const IdSchema = <T extends string>(resource: T) =>
  z
    .string()
    .refine((value) => value.length === 36 || value.length === 24, {
      message: idMessage(resource),
    })
    .superRefine((value, ctx) => {
      if (value.length === 36 && !z.string().uuid().safeParse(value).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: idMessage(resource),
        });
      }
      if (value.length === 24 && !cuid2Regex.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: idMessage(resource),
        });
      }
    })
    .brand<IdBrand<T>>();

/**
 * Validadores y tipos base
 */
export const Email = z.string().email({ message: "Email inválido" });
export type Email = z.infer<typeof Email>;

export const IsoDate = isoDateString;
export type IsoDate = z.infer<typeof IsoDate>;

export const SafeText = safeTextValidator();
export type SafeText = z.infer<typeof SafeText>;

export const ShortText = boundedString(1, 140, "texto corto");
export type ShortText = z.infer<typeof ShortText>;

export const Money = z.object({
  currency: z
    .string()
    .length(3, { message: "Moneda debe seguir ISO 4217" })
    .transform((value) => value.toUpperCase()),
  amount: nonNegativeInt("monto"),
});
export type Money = z.infer<typeof Money>;

export const DurationMinutes = z
  .number({ invalid_type_error: "Duración debe ser numérica" })
  .int({ message: "Duración debe ser entera" })
  .min(5, { message: "Duración mínima 5 minutos" })
  .max(24 * 60, { message: "Duración máxima 24 horas" });
export type DurationMinutes = z.infer<typeof DurationMinutes>;

export const Tier = z.enum([
  "FREE",
  "CIRCLE",
  "ALQUIMIA",
  "SUPER_ALQUIMIA",
] as const);
export type Tier = z.infer<typeof Tier>;

export const Plan = Tier;
export type Plan = Tier;

export const EmotionalState = z.enum(["calm", "stressed", "unknown"] as const);
export type EmotionalState = z.infer<typeof EmotionalState>;

export const ConsentState = z.enum(["valid", "stale", "missing"] as const);
export type ConsentState = z.infer<typeof ConsentState>;

export const VerificationLevel = z
  .enum(["0", "1", "2"], { required_error: "Nivel de verificación requerido" })
  .transform((value) => Number(value) as 0 | 1 | 2);
export type VerificationLevel = 0 | 1 | 2;

export const ReciprocityScore = z.enum(["low", "mid", "high"] as const);
export type ReciprocityScore = z.infer<typeof ReciprocityScore>;

export const CareScore = percentage("careScore");
export type CareScore = z.infer<typeof CareScore>;

export const FeatureFlags = z.record(z.boolean());
export type FeatureFlags = z.infer<typeof FeatureFlags>;

export const AuditId = z.string().min(10).max(64);
export type AuditId = z.infer<typeof AuditId>;
