import React from "react";
import { useEnterpriseForm } from "../core/useEnterpriseForm";
import { FormProvider } from "../controls/FormProvider";
import { InputField } from "../controls/InputField";

// Zero custom validation logic. Reusing the exact same platform capabilities.
export const RegistrationFlow = () => {
    const { form, handleSubmit } = useEnterpriseForm({
        domain: "auth-registration", // Different domain
        version: 1
    });

    return (
        <FormProvider form={form} onSubmit={handleSubmit(async (data) => console.log(data))}>
            <InputField name="email" label="Work Email" type="email" />
            <InputField name="company" label="Company Name" type="text" />
            <button type="submit">Register</button>
        </FormProvider>
    );
};
