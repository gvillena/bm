import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { PolicyReasons } from "../src/components/patterns/PolicyReasons.js";
describe("PolicyReasons", () => {
    test("invokes callback on obligation confirm", () => {
        const onConfirm = vi.fn();
        render(reasons, { [{ code: "SAFETY", detail: "Requires manual review" }]:  }, obligations = { [{ code: "CONFIRM" }]:  }, onConfirmObligation = { onConfirm }
            /  >
        );
        fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
        expect(onConfirm).toHaveBeenCalledWith({ code: "CONFIRM" });
    });
});
