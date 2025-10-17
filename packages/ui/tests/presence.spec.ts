import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AriaInline } from "../src/components/presence/AriaInline.js";

const directives = {
  hints: ["Use a secure channel"],
  actions: [
    {
      label: "Confirm",
      actionRef: { name: "confirm" }
    }
  ]
};

describe("AriaInline", () => {
  test("renders hints and actions", () => {
    render(<AriaInline directives={directives} />);
    expect(screen.getByText("Use a secure channel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });
});
