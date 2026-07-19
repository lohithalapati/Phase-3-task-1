import React from "react";
import { useEnterpriseForm } from "../core/useEnterpriseForm";
import { FormProvider } from "../controls/FormProvider";
import { InputField } from "../controls/InputField";

// Zero custom validation logic. Pure platform consumption.
export const LoginFlow = () => {
    const { form, handleSubmit, isSubmitting } = useEnterpriseForm({
        domain: "auth-login",
        version: 2,
        enableDrafts: true
    });

    const onSubmit = async (data: any) => { console.log("Login Payload:", data); };

    return (
        <FormProvider form={form} onSubmit={handleSubmit(onSubmit)}>
            <InputField name="email" label="Email Address" type="email" />
            <InputField name="password" label="Password" type="password" />
            <button type="submit" disabled={isSubmitting}>Login</button>
        </FormProvider>
    );
};
