import { render, act, fireEvent } from "@testing-library/react";
import { useEnterpriseForm } from "../core/useEnterpriseForm";
import { FormProvider } from "../controls/FormProvider";
import { InputField } from "../controls/InputField";
import { SelectField } from "../controls/SelectField";
import { ErrorMessage } from "../controls/ErrorMessage";
import { SchemaRegistry } from "../schemas/registry";
import { z } from "zod";

// Register mock schema for UI testing
SchemaRegistry.getInstance().register("ui-test-domain", 1, z.object({
    username: z.string().min(1, "Username is required"),
    role: z.string().min(1, "Role is required")
}));

const TestForm = () => {
    const { form, handleSubmit, globalError } = useEnterpriseForm<any>({ 
        domain: "ui-test-domain", 
        version: 1, 
        enableDrafts: true 
    });

    return (
        <div>
            <ErrorMessage message={globalError || "Fatal Error"} />
            <ErrorMessage message={null} />
            <FormProvider form={form} onSubmit={handleSubmit(async () => {})}>
                <InputField name="username" label="User Name" description="Enter your username" />
                <SelectField name="role" label="Role" options={[{label: "Admin", value: "admin"}]} description="Select role" />
                <button type="submit">Submit</button>
            </FormProvider>
        </div>
    );
};

describe("UI Components & useEnterpriseForm Coverage", () => {
    test("Renders all controls, processes validation, and displays errors", async () => {
        const { getByText, findByText } = render(<TestForm />);
        
        // Assert initial renders are truthy
        expect(getByText("User Name")).toBeTruthy();
        expect(getByText("Role")).toBeTruthy();
        expect(getByText("Submit Error:")).toBeTruthy();

        // Trigger RHF Validation by submitting empty form
        await act(async () => {
            fireEvent.click(getByText("Submit"));
        });

        // Await Zod validation error mappings onto the UI controls
        const userError = await findByText("Username is required");
        const roleError = await findByText("Role is required");
        
        expect(userError).toBeTruthy();
        expect(roleError).toBeTruthy();
    });
});
