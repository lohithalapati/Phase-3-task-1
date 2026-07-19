import React from "react";
import { FormProvider as RHFFormProvider, UseFormReturn } from "react-hook-form";

export interface FormProviderProps {
  form: UseFormReturn<any>;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export const FormProvider: React.FC<FormProviderProps> = ({ form, children, onSubmit, className }) => {
  return (
    <RHFFormProvider {...form}>
      <form onSubmit={onSubmit} className={className} noValidate>
        {children}
      </form>
    </RHFFormProvider>
  );
};
