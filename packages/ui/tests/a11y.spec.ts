import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "vitest-axe";
import { describe, expect, test } from "vitest";
import { Button } from "../src/components/base/Button.js";

expect.extend(toHaveNoViolations);

describe("a11y", () => {
  test("button has no violations", async () => {
    const { container } = render(<Button>Label</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
