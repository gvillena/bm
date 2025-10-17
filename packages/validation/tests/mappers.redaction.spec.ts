import { describe, expect, it } from "vitest";
import { applyWhitelist } from "../src/mappers/redact";

const moment = {
  id: "00000000-0000-0000-0000-000000000000",
  teaser: "Escucha activa",
  details: "Sin PII",
  visibility: "PUBLIC"
};

describe("applyWhitelist", () => {
  it("solo incluye campos permitidos", () => {
    const result = applyWhitelist(moment, ["id", "teaser"]);
    expect(result).toEqual({ id: moment.id, teaser: moment.teaser });
  });

  it("lanza error si el campo no existe", () => {
    expect(() => applyWhitelist(moment, ["unknown" as keyof typeof moment])).toThrowError();
  });
});
