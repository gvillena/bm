import { describe, expect, it } from "vitest";
import { MomentPrivateDTO, MomentPublicDTO, CreateMomentInput } from "../src/schemas/moment.schema";

describe("Moment schemas", () => {
  it("valida un moment privado completo", () => {
    const result = MomentPrivateDTO.parse({
      id: "00000000-0000-0000-0000-000000000000",
      teaser: "Caminata consciente",
      visibility: "INVITE_ONLY",
      details: "Ruta en bosque urbano",
      intimacy: { possible: true, conditions: ["Respirar profundo"] },
      rules: ["Llegar puntual"]
    });

    expect(result.rules).toHaveLength(1);
  });

  it("rechaza condiciones cuando la intimidad no es posible", () => {
    expect(() =>
      MomentPrivateDTO.parse({
        id: "00000000-0000-0000-0000-000000000000",
        teaser: "Meditación",
        visibility: "INVITE_ONLY",
        intimacy: { possible: false, conditions: ["Compartir diario"] }
      })
    ).toThrowError(/intimidad/);
  });

  it("normaliza CreateMomentInput", () => {
    const parsed = CreateMomentInput.parse({
      intention: "  Llamada para escuchar   ",
      format: "call",
      duration: 45
    });

    expect(parsed.duration).toBe(45);
  });

  it("valida moment público mínimo", () => {
    const dto = MomentPublicDTO.parse({
      id: "00000000-0000-0000-0000-000000000000",
      teaser: "Teaser cuidado",
      visibility: "PUBLIC"
    });

    expect(dto.visibility).toBe("PUBLIC");
  });
});
