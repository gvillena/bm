import { describe, expect, it } from "vitest";
import { applyWhitelist } from "../src/mappers/redact";
import { fromCreateInput } from "../src/mappers/moment.mapper";

const randomKey = () => Math.random().toString(36).slice(2, 8);
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

describe("Property style invariants", () => {
  it("whitelist nunca expone campos no listados", () => {
    for (let i = 0; i < 50; i++) {
      const record: Record<string, unknown> = {};
      const keys = Array.from({ length: randomBetween(1, 6) }, randomKey);
      for (const key of keys) {
        record[key] = Math.random();
      }
      const allow = keys.filter(() => Math.random() > 0.5);
      const result = applyWhitelist(record, allow as (keyof typeof record & string)[]);
      expect(Object.keys(result)).toEqual(allow);
    }
  });

  it("normaliza duración dentro de límites", () => {
    for (let i = 0; i < 100; i++) {
      const duration = randomBetween(-1000, 5000);
      const draft = fromCreateInput({ intention: "Cuidar", format: "walk", duration });
      expect(draft.durationMinutes).toBeGreaterThanOrEqual(5);
      expect(draft.durationMinutes).toBeLessThanOrEqual(24 * 60);
    }
  });
});
