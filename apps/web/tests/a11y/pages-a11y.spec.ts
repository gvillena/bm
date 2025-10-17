import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@scenes/Home/HomePage";
import SettingsPage from "@scenes/Settings/SettingsPage";

expect.extend(toHaveNoViolations);

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children
}));

vi.mock("@motion/guards", () => ({
  useReducedMotionGuard: () => false,
  setReducedMotionPreference: vi.fn()
}));

vi.mock("@app/providers/AriaPresenceProvider", () => ({
  useAriaPresenceValue: () => ({
    controller: { setLevel: vi.fn() },
    bridge: { sendFeedback: vi.fn(), confirmObligation: vi.fn() }
  })
}));

describe("Accessibility", () => {
  it("home page has no axe violations", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("settings page has no axe violations", async () => {
    const { container } = render(<SettingsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
