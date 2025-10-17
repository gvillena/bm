import { MomentPrivateDTO, MomentPublicDTO, type CreateMomentInput } from "../schemas/moment.schema";
import { applyWhitelist } from "./redact";

export interface MomentDomain {
  [key: string]: unknown;
  id: string;
  teaser: string;
  visibility: "PUBLIC" | "INVITE_ONLY";
  details?: string;
  intimacy?: { possible: boolean; conditions?: string[] };
  rules?: string[];
  format: "walk" | "coffee" | "call" | "other";
  durationMinutes: number;
  intention: string;
}

export const toPublicDTO = (domain: MomentDomain) =>
  MomentPublicDTO.parse(
    applyWhitelist(domain, ["id", "teaser", "visibility"]) as Partial<MomentDomain>
  );

export const toPrivateDTO = (domain: MomentDomain) =>
  MomentPrivateDTO.parse({
    id: domain.id,
    teaser: domain.teaser,
    visibility: domain.visibility,
    details: domain.details,
    intimacy: domain.intimacy,
    rules: domain.rules
  });

export const fromCreateInput = (input: CreateMomentInput): Pick<MomentDomain, "intention" | "format" | "durationMinutes" | "visibility" | "teaser"> => {
  const trimmed = input.intention.trim();
  const normalizedDuration = Math.min(Math.max(Math.round(input.duration), 5), 24 * 60);
  return {
    intention: trimmed,
    teaser: trimmed,
    format: input.format,
    durationMinutes: normalizedDuration,
    visibility: "INVITE_ONLY"
  };
};
