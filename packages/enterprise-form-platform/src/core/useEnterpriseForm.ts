import { useEffect, useState, useMemo, useRef } from "react";
import { useForm, UseFormReturn, UseFormProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaRegistry } from "../schemas/registry";
import { DraftStore } from "../services/draftStore";
import { EnterpriseFormPlugin, PluginRunner } from "../services/pluginSystem";
import { SubmissionPipeline } from "./submissionPipeline";

export interface UseEnterpriseFormOptions<TFieldValues extends FieldValues> extends UseFormProps<TFieldValues> {
  domain: string;
  version: number;
  plugins?: EnterpriseFormPlugin<TFieldValues>[];
  enableDrafts?: boolean;
}

export interface UseEnterpriseFormReturn<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  globalError: string | null;
  setGlobalError: (msg: string | null) => void;
  isSubmitting: boolean;
  handleSubmit: (onSubmit: (data: TFieldValues) => Promise<any> | any) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useEnterpriseForm<TFieldValues extends FieldValues>({
  domain,
  version,
  plugins = [],
  enableDrafts = false,
  ...formProps
}: UseEnterpriseFormOptions<TFieldValues>): UseEnterpriseFormReturn<TFieldValues> {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const isSubmitCompletedRef = useRef(false);

  const schema = useMemo(() => SchemaRegistry.getInstance().getSchema(domain, version), [domain, version]);

  const defaultValues = useMemo(() => {
    if (enableDrafts) {
      const draft = DraftStore.loadDraft<TFieldValues>(domain, version);
      if (draft) return draft;
    }
    return formProps.defaultValues as any;
  }, [domain, version, enableDrafts, formProps.defaultValues]);

  const form = useForm<TFieldValues>({
    ...formProps,
    resolver: zodResolver(schema),
    defaultValues
  });

  const { watch, getValues, setValue, setError, formState } = form;
  const currentValues = watch();

  const pluginRunner = useMemo(() => {
    return new PluginRunner<TFieldValues>(plugins, () => ({
      domain,
      formState,
      getValues: () => getValues(),
      setValue: (name: string, val: any) => setValue(name as any, val)
    }));
  }, [domain, plugins, formState, getValues, setValue]);

  const prevIsValid = useRef(formState.isValid);
  useEffect(() => {
    pluginRunner.executeBeforeValidate();
    pluginRunner.executeAfterValidate(formState.isValid);
    prevIsValid.current = formState.isValid;
  }, [currentValues, formState.isValid, pluginRunner]);

  // Prevent draft saving when submission has already completed or is in progress
  useEffect(() => {
    if (enableDrafts && Object.keys(currentValues).length > 0 && !formState.isSubmitting && !isSubmitCompletedRef.current) {
      DraftStore.saveDraft(domain, version, currentValues);
    }
  }, [currentValues, domain, version, enableDrafts, formState.isSubmitting]);

  const handleSubmit = (onSubmit: (data: TFieldValues) => Promise<any> | any) => {
    return form.handleSubmit(async (data: TFieldValues) => {
      setGlobalError(null);
      setIsSubmittingInternal(true);
      try {
        await pluginRunner.executeBeforeSubmit();
        const response = await onSubmit(data);
        await pluginRunner.executeAfterSubmit(response);
        if (enableDrafts) {
          isSubmitCompletedRef.current = true;
          DraftStore.clearDraft(domain);
        }
      } catch (err: any) {
        SubmissionPipeline.handleServerError(err, setError, setGlobalError);
      } finally {
        setIsSubmittingInternal(false);
      }
    });
  };

  return {
    form,
    globalError,
    setGlobalError,
    isSubmitting: isSubmittingInternal || formState.isSubmitting,
    handleSubmit
  };
}
