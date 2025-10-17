import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";
import { Form } from "../src/components/form/Form.js";
import { Field } from "../src/components/form/Field.js";
import { Input } from "../src/components/base/Input.js";
import { useZodForm } from "../src/hooks/useZodForm.js";
const schema = z.object({ name: z.string().min(1) });
function SampleForm({ onSubmit }) {
    const form = useZodForm({ schema, defaultValues: { name: "" } });
    return form = { form };
    onSubmit = { onSubmit } >
        name;
    "name";
    label = "Name" >
        />
        < /Field>
        < button;
    type = "submit" > Submit < /button>
        < /Form>;
    ;
}
describe("Form", () => {
    test("submits values", () => {
        const handleSubmit = vi.fn();
        render(onSubmit, { handleSubmit } /  > );
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
        fireEvent.click(screen.getByText("Submit"));
        expect(handleSubmit).toHaveBeenCalledWith({ name: "Ada" }, expect.anything());
    });
});
