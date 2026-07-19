import { render, act, fireEvent, screen } from "@testing-library/react";
import { useEnterpriseForm } from "../core/useEnterpriseForm";
import { FormProvider } from "../controls/FormProvider";
import { InputField } from "../controls/InputField";
import { SelectField } from "../controls/SelectField";
import { ErrorMessage } from "../controls/ErrorMessage";
import { SchemaRegistry } from "../schemas/registry";
import { loginSchemaV1, loginSchemaV2 } from "../schemas/authSchemas";
import { DraftStore } from "../services/draftStore";
import { MultiStepEngine } from "../services/multiStepEngine";
import { DynamicFormEngine } from "../services/dynamicFormEngine";
import { SubmissionPipeline } from "../core/submissionPipeline";
import { PluginRunner, EnterpriseFormPlugin } from "../services/pluginSystem";
import { z } from "zod";

// Initialize UI Form schemas
const reactFormSchema = z.object({
  username: z.string().min(3, "Too short"),
  role: z.string().min(1, "Role is required")
});
SchemaRegistry.getInstance().register("react-form-domain", 1, reactFormSchema);

const TestFormWrapper = ({ 
  onSubmit, 
  plugins = [], 
  enableDrafts = false 
}: { 
  onSubmit: any; 
  plugins?: any[]; 
  enableDrafts?: boolean;
}) => {
  const { form, globalError, handleSubmit } = useEnterpriseForm<any>({
    domain: "react-form-domain",
    version: 1,
    defaultValues: { username: "", role: "" },
    plugins,
    enableDrafts
  });

  return (
    <FormProvider form={form} onSubmit={handleSubmit(onSubmit)}>
      <ErrorMessage message={globalError} />
      <InputField name="username" label="Username" description="Primary user handle" />
      <SelectField name="role" label="Role" options={[{ value: "admin", label: "Admin" }]} description="Authorization role" />
      <button type="submit">Submit</button>
    </FormProvider>
  );
};

// Form without descriptions to achieve 100% branch coverage on field markup paths
const TestFormMinimal = ({ onSubmit }: { onSubmit: any }) => {
  const { form, handleSubmit } = useEnterpriseForm<any>({
    domain: "react-form-domain",
    version: 1,
    defaultValues: { username: "", role: "" }
  });
  return (
    <FormProvider form={form} onSubmit={handleSubmit(onSubmit)}>
      <InputField name="username" label="Username" />
      <SelectField name="role" label="Role" options={[]} />
      <button type="submit">Submit</button>
    </FormProvider>
  );
};

describe("Enterprise Form Platform - Full Quality Alignment Suite", () => {
  
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  // --- REACT UI CONTROLS & HOOKS (100% COVERAGE) ---
  test("renders form inputs, labels, and helper descriptions successfully", () => {
    render(<TestFormWrapper onSubmit={jest.fn()} />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByText("Primary user handle")).toBeInTheDocument();
    expect(screen.getByLabelText("Role")).toBeInTheDocument();
    expect(screen.getByText("Authorization role")).toBeInTheDocument();
  });

  test("renders minimal UI components without descriptive tags", () => {
    render(<TestFormMinimal onSubmit={jest.fn()} />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.queryByText("Primary user handle")).toBeNull();
  });

  test("triggers validation errors on invalid input", async () => {
    render(<TestFormWrapper onSubmit={jest.fn()} />);
    const usernameInput = screen.getByLabelText("Username");
    const roleSelect = screen.getByLabelText("Role");

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "ab" } });
      fireEvent.change(roleSelect, { target: { value: "" } });
    });

    // Submitting form triggers Zod parsing and registers RHF states
    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(await screen.findByText("Too short")).toBeInTheDocument();
    expect(await screen.findByText("Role is required")).toBeInTheDocument();
  });

  test("submits form data successfully with valid payload", async () => {
    const submitMock = jest.fn().mockResolvedValue({ success: true });
    render(<TestFormWrapper onSubmit={submitMock} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "valid_username" } });
      fireEvent.change(screen.getByLabelText("Role"), { target: { value: "admin" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(submitMock).toHaveBeenCalledWith({
      username: "valid_username",
      role: "admin"
    });
  });

  test("renders submission and server error payloads gracefully", async () => {
    const errorMock = jest.fn().mockRejectedValue({
      message: "Database Constraint Violation",
      errors: { username: ["Username already taken"] }
    });

    render(<TestFormWrapper onSubmit={errorMock} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "valid_username" } });
      fireEvent.change(screen.getByLabelText("Role"), { target: { value: "admin" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(await screen.findByText("Username already taken")).toBeInTheDocument();
    expect(screen.getByText(/Validation error occurred on the server/)).toBeInTheDocument();
  });

  test("persists offline drafts and recovers data on re-mount", async () => {
    // Pre-populate draft inside LocalStorage to trigger useMemo recovery coverage
    DraftStore.saveDraft("react-form-domain", 1, { username: "saved_draft_data", role: "admin" });

    const { unmount } = render(<TestFormWrapper onSubmit={jest.fn()} enableDrafts={true} />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveValue("saved_draft_data");

    await act(async () => {
      fireEvent.change(input, { target: { value: "updated_draft_data" } });
    });

    unmount(); // Simulate component unmount

    render(<TestFormWrapper onSubmit={jest.fn()} enableDrafts={true} />);
    expect(screen.getByLabelText("Username")).toHaveValue("updated_draft_data");
  });

  // --- PLUGINS EXECUTION LOOP ON CHANGE ---
  test("executes plugins hooks during change and validation cycle", async () => {
    const beforeValidateMock = jest.fn();
    const afterValidateMock = jest.fn();

    const mockPlugin: EnterpriseFormPlugin = {
      name: "validation-logger",
      beforeValidate: beforeValidateMock,
      afterValidate: afterValidateMock
    };

    render(<TestFormWrapper onSubmit={jest.fn()} plugins={[mockPlugin]} />);
    const input = screen.getByLabelText("Username");

    await act(async () => {
      fireEvent.change(input, { target: { value: "changing_data" } });
    });

    expect(beforeValidateMock).toHaveBeenCalled();
    expect(afterValidateMock).toHaveBeenCalled();
  });

  test("runs custom plugin that mutates values using getValues and setValue", async () => {
    const testPlugin: EnterpriseFormPlugin = {
      name: "mutator-plugin",
      beforeValidate: (ctx) => {
        const currentVals = ctx.getValues();
        if (currentVals.username === "mutate_me") {
          ctx.setValue("username", "mutated_value");
        }
      }
    };

    render(<TestFormWrapper onSubmit={jest.fn()} plugins={[testPlugin]} />);
    const input = screen.getByLabelText("Username");

    await act(async () => {
      fireEvent.change(input, { target: { value: "mutate_me" } });
    });

    expect(input).toHaveValue("mutated_value");
  });

  test("calls plugin beforeSubmit and afterSubmit hooks during submission", async () => {
    const beforeSubmitMock = jest.fn();
    const afterSubmitMock = jest.fn();

    const testPlugin: EnterpriseFormPlugin = {
      name: "submit-logger",
      beforeSubmit: beforeSubmitMock,
      afterSubmit: afterSubmitMock
    };

    const submitMock = jest.fn().mockResolvedValue({ status: "success" });
    render(<TestFormWrapper onSubmit={submitMock} plugins={[testPlugin]} enableDrafts={true} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "valid_username" } });
      fireEvent.change(screen.getByLabelText("Role"), { target: { value: "admin" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(beforeSubmitMock).toHaveBeenCalled();
    expect(submitMock).toHaveBeenCalled();
    expect(afterSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({ domain: "react-form-domain" }),
      { status: "success" }
    );

    // Verify draft cleared after successful submit
    expect(DraftStore.loadDraft("react-form-domain", 1)).toBeNull();
  });

  // --- REGISTRY & MIGRATION EDGE CASES ---
  test("Registry throws on unregistered domains and unmapped migrations", () => {
    const registry = SchemaRegistry.getInstance();
    expect(() => registry.getSchema("undefined-domain", 99)).toThrow(/not registered/);
    expect(() => registry.migrateData("undefined-domain", {}, 1, 2)).toThrow(/Migration map missing/);
  });

  test("Registry returns correct data when migrating same versions", () => {
    const registry = SchemaRegistry.getInstance();
    const sourceData = { email: "test@domain.com" };
    const migrated = registry.migrateData("auth-login", sourceData, 1, 1);
    expect(migrated).toBe(sourceData);
  });

  test("Registry throws when migrating data fails zod target schema parser rules", () => {
    const registry = SchemaRegistry.getInstance();
    const corruptMigrationRule = {
      fromVersion: 1,
      toVersion: 2,
      migrate: () => ({ email: "invalid_email_syntax", password: "short" })
    };
    registry.registerMigration("auth-login-bad", corruptMigrationRule);
    registry.register("auth-login-bad", 1, z.object({ email: z.string() }));
    registry.register("auth-login-bad", 2, z.object({ email: z.string().email(), password: z.string().min(10) }));

    expect(() => registry.migrateData("auth-login-bad", { email: "test" }, 1, 2)).toThrow(/Post-migration validation failed/);
  });

  // --- DOMAIN SCHEMAS EXERCISE (100% COVERAGE FOR AUTH SCHEMAS) ---
  test("AuthSchemas compile and parse successfully", () => {
    const legacyValid = loginSchemaV1.safeParse({ email: "v1@enterprise.io", password: "password123" });
    const legacyInvalid = loginSchemaV1.safeParse({ email: "bad-email", password: "1" });
    const modernValid = loginSchemaV2.safeParse({ email: "v2@enterprise.io", password: "password123456", mfaCode: "123456" });

    expect(legacyValid.success).toBe(true);
    expect(legacyInvalid.success).toBe(false);
    expect(modernValid.success).toBe(true);

    // Explicitly execute data migration function logic (line 28)
    const registry = SchemaRegistry.getInstance();
    const migratedV1ToV2 = registry.migrateData<any>("auth-login", { email: "usr@corp.com", password: "password123456" }, 1, 2);
    expect(migratedV1ToV2.mfaCode).toBe("000000");
  });

  // --- DRAFT STORE FALLBACK BRANCHES ---
  test("DraftStore handles corrupt local storage safely", () => {
    window.localStorage.setItem("ent_draft_v1::corrupt", "{corrupt_json");
    expect(DraftStore.loadDraft("corrupt", 1)).toBeNull();

    DraftStore.clearDraft("corrupt");
    expect(window.localStorage.getItem("ent_draft_v1::corrupt")).toBeNull();
  });

  test("DraftStore returns immediately without throwing outside browser environment context", () => {
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      value: undefined,
      writable: true,
      configurable: true
    });

    expect(() => DraftStore.saveDraft("any", 1, {})).not.toThrow();
    expect(DraftStore.loadDraft("any", 1)).toBeNull();
    expect(() => DraftStore.clearDraft("any")).not.toThrow();

    // Restore environment
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
      configurable: true
    });
  });

  test("DraftStore loads and returns identical schema drafts without calling migrations", () => {
    const draftPayload = { email: "direct@domain.com" };
    DraftStore.saveDraft("auth-login", 1, draftPayload);
    const loaded = DraftStore.loadDraft("auth-login", 1);
    expect(loaded).toEqual(draftPayload);
  });

  // --- MULTISTEP WIZARD ENGINE ---
  test("MultiStepEngine enforces configuration boundaries and validation results", async () => {
    expect(() => new MultiStepEngine([])).toThrow(/zero steps/);

    const steps = [
      { id: "step1", label: "Step 1", fields: [] },
      { id: "step2", label: "Step 2", fields: [] }
    ];
    const engine = new MultiStepEngine(steps);

    expect(engine.isFirstStep()).toBe(true);
    expect(engine.previous()).toBe(false); // Index bound minimum check
    expect(engine.isLastStep()).toBe(false);
    expect(engine.getSteps()).toEqual(steps);
    expect(engine.getCurrentStepIndex()).toBe(0);
    expect(engine.getCurrentStep()).toEqual(steps[0]);

    const mockValidationFail = jest.fn().mockResolvedValue(false);
    const moved = await engine.next(mockValidationFail);
    expect(moved).toBe(false); // Blocked when validation fails

    const mockValidationPass = jest.fn().mockResolvedValue(true);
    const movedSuccess = await engine.next(mockValidationPass);
    expect(movedSuccess).toBe(true);
    expect(engine.isFirstStep()).toBe(false);
    expect(engine.isLastStep()).toBe(true);
    expect(engine.getProgressPercentage()).toBe(100);

    const stepUpLimit = await engine.next(mockValidationPass);
    expect(stepUpLimit).toBe(false); // Blocked at index limit boundary

    expect(engine.previous()).toBe(true); // Move backward successfully
    expect(engine.isFirstStep()).toBe(true);
  });

  // --- DYNAMIC FORM ENGINE SWITCH/CASE BRANCHES ---
  test("DynamicFormEngine builds dynamic schemas and maps non-required structures", () => {
    const fieldDefinitions: any[] = [
      { name: "desc", label: "Description", type: "text", required: false },
      { name: "count", label: "Count", type: "number", required: true },
      { name: "opt", label: "Option", type: "select", required: false },
      { name: "chk", label: "Checkbox", type: "checkbox", required: false }
    ];

    const generatedSchema = DynamicFormEngine.buildZodSchema(fieldDefinitions);
    const generatedDefaults = DynamicFormEngine.generateDefaultValues(fieldDefinitions);

    expect(generatedDefaults.desc).toBe("");
    expect(generatedDefaults.chk).toBe(false);

    const invalidParse = generatedSchema.safeParse({ count: "not_a_number" });
    expect(invalidParse.success).toBe(false);
  });

  // --- PLUGIN SYSTEM COMPLIANCE ---
  test("PluginRunner processes hooks when hooks are undefined in configuration array", async () => {
    const runnerWithEmptyPlugin = new PluginRunner<any>([{ name: "empty-test-plugin" }], () => ({
      domain: "test",
      formState: {},
      getValues: () => ({}),
      setValue: jest.fn()
    }));

    expect(() => runnerWithEmptyPlugin.executeBeforeValidate()).not.toThrow();
    expect(() => runnerWithEmptyPlugin.executeAfterValidate(true)).not.toThrow();
    await expect(runnerWithEmptyPlugin.executeBeforeSubmit()).resolves.not.toThrow();
    await expect(runnerWithEmptyPlugin.executeAfterSubmit({})).resolves.not.toThrow();
  });

  test("PluginRunner invokes submit hooks when configured", async () => {
    const beforeSubmit = jest.fn();
    const afterSubmit = jest.fn();
    const plugin: EnterpriseFormPlugin = {
      name: "test",
      beforeSubmit,
      afterSubmit
    };
    const runner = new PluginRunner([plugin], () => ({
      domain: "test",
      formState: {},
      getValues: () => ({}),
      setValue: jest.fn()
    }));
    await runner.executeBeforeSubmit();
    await runner.executeAfterSubmit({});
    expect(beforeSubmit).toHaveBeenCalled();
    expect(afterSubmit).toHaveBeenCalled();
  });

  // --- ERROR PIPELINE CORNER CASES ---
  test("SubmissionPipeline falls back to raw response message mappings when payload is missing error lists", () => {
    const mockGlobalErr = jest.fn();
    SubmissionPipeline.handleServerError({ message: "Network connection lost" }, jest.fn(), mockGlobalErr);
    expect(mockGlobalErr).toHaveBeenCalledWith("Network connection lost");

    SubmissionPipeline.handleServerError({}, jest.fn(), mockGlobalErr);
    expect(mockGlobalErr).toHaveBeenCalledWith("A critical server connection error occurred. Please retry.");
  });

  // --- RENDERING EDGE CASE ---
  test("ErrorMessage returns null when input message is null", () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container.firstChild).toBeNull();
  });

  test("ErrorMessage renders message text cleanly", () => {
    render(<ErrorMessage message="Direct Server Failure" />);
    expect(screen.getByText("Direct Server Failure")).toBeInTheDocument();
  });
});

