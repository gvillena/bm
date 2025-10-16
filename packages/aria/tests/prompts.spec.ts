import { formatPrompt } from "../src/prompts/formatter.js";
import { defaultGuardrails } from "../src/policies/guardrails.js";

const template = {
  id: "example",
  text: "Hola {name}, puedo apoyar con este paso."
};

describe("Prompts and guardrails", () => {
  it("formats templates replacing slots", () => {
    const formatted = formatPrompt(template, { name: "Ana" });
    expect(formatted.text).toBe("Hola Ana, puedo apoyar con este paso.");
  });

  it("guardrails rewrite anthropomorphic language", () => {
    const result = defaultGuardrails.apply(
      {
        hints: ["Siento que esto es lo mejor."],
        explain: "Entiendo que prefieras esta opción."
      },
      {}
    );
    expect(result.directives.hints?.[0]).toContain("puedo sugerir");
    expect(result.directives.explain).toContain("puedo sugerir");
  });
});
