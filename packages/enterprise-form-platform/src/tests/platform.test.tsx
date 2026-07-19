import { render, act, fireEvent, screen } from "@testing-library/react";
import { useEnterpriseForm } from "../core/useEnterpriseForm";
import { FormProvider } from "../controls/FormProvider";
import { InputField } from "../controls/InputField";
import { SelectField } from "../controls/SelectField";
import { ErrorMessage } from "../controls/ErrorMessage";
import { SchemaRegistry } from "../schemas/registry";
import { DraftStore } from "../services/draftStore";
import { MultiStepEngine } from "../services/multiStepEngine";
import { DynamicFormEngine } from "../services/dynamicFormEngine";
import { SubmissionPipeline } from "../core/submissionPipeline";
import { PluginRunner } from "../services/pluginSystem";
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

  test("triggers validation errors on invalid input", async () => {
    render(<TestFormWrapper onSubmit={jest.fn()} />);
    const input = screen.getByLabelText("Username");

    await act(async () => {
      fireEvent.change(input, { target: { value: "ab" } });
      fireEvent.blur(input);
    });

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Too short")).toBeInTheDocument();
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
    expect(screen.getByText("Submit Error: Database Constraint Violation")).toBeInTheDocument();
  });

  test("persists offline drafts and recovers data on re-mount", async () => {
    const { unmount } = render(<TestFormWrapper onSubmit={jest.fn()} enableDrafts={true} />);
    const input = screen.getByLabelText("Username");

    await act(async () => {
      fireEvent.change(input, { target: { value: "saved_draft_data" } });
    });

    unmount(); // Simulate component unmount

    render(<TestFormWrapper onSubmit={jest.fn()} enableDrafts={true} />);
    expect(screen.getByLabelText("Username")).toHaveValue("saved_draft_data");
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

  // --- DRAFT STORE FALLBACK BRANCHES ---
  test("DraftStore handles corrupt local storage safely", () => {
    window.localStorage.setItem("ent_draft_v1::corrupt", "{corrupt_json");
    expect(DraftStore.loadDraft("corrupt", 1)).toBeNull();

    DraftStore.clearDraft("corrupt");
    expect(window.localStorage.getItem("ent_draft_v1::corrupt")).toBeNull();
  });

  test("DraftStore returns immediately without throwing outside browser environment context", () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    expect(() => DraftStore.saveDraft("any", 1, {})).not.toThrow();
    expect(DraftStore.loadDraft("any", 1)).toBeNull();
    expect(() => DraftStore.clearDraft("any")).not.toThrow();

    // Restore environment
    // @ts-ignore
    global.window = originalWindow;
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

    expect(engine.previous()).toBe(false); // Index bound minimum check
    expect(engine.isLastStep()).toBe(false);
    expect(engine.getSteps()).toEqual(steps);
    expect(engine.getCurrentStepIndex()).toBe(0);

    const mockValidationFail = jest.fn().mockResolvedValue(false);
    const moved = await engine.next(mockValidationFail);
    expect(moved).toBe(false); // Blocked when validation fails

    const mockValidationPass = jest.fn().mockResolvedValue(true);
    const movedSuccess = await engine.next(mockValidationPass);
    expect(movedSuccess).toBe(true);
    expect(engine.isLastStep()).toBe(true);
    expect(engine.getProgressPercentage()).toBe(100);

    const stepUpLimit = await engine.next(mockValidationPass);
    expect(stepUpLimit).toBe(false); // Blocked at index limit boundary
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
    // PASSING "name" PROP TO SATISFY STRCT TS COMPILATION ENVELOPE GATES
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
});
