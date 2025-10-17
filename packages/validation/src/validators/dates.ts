import { z } from "zod";

export const isoDateString = z
  .string({ message: "fecha debe ser string" })
  .datetime({ offset: true, message: "fecha debe estar en ISO 8601" });

export const isIsoDate = (value: unknown): value is string =>
  typeof value === "string" && isoDateString.safeParse(value).success;

export const clampRange = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const now = () => new Date();

export const isPast = (value: string) =>
  new Date(value).getTime() < now().getTime();
export const isFuture = (value: string) =>
  new Date(value).getTime() > now().getTime();
export const isPresent = (value: string) => {
  const target = new Date(value).getTime();
  const current = now().getTime();
  const toleranceMs = 1000 * 60;
  return Math.abs(target - current) <= toleranceMs;
};
