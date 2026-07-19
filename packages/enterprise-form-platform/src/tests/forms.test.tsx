import "./setup";
import { SchemaRegistry } from "../schemas/registry";
import { loginSchemaV1, loginSchemaV2 } from "../schemas/authSchemas";
import { DraftStore } from "../services/draftStore";
import { MultiStepEngine } from "../services/multiStepEngine";
import { DynamicFormEngine, DynamicFieldDefinition } from "../services/dynamicFormEngine";

describe("Enterprise Form Platform - Full Specification Suite", () => {
  
  beforeEach(() => {
    window.localStorage.clear();
  });

  // Test Case 1: Schema Registration
  test("[Contract] - Schema Registry successfully saves and returns target schema structures", () => {
    const registry = SchemaRegistry.getInstance();
    const v1 = registry.getSchema("auth-login", 1);
    const v2 = registry.getSchema("auth-login", 2);

    expect(v1).toBe(loginSchemaV1);
    expect(v2).toBe(loginSchemaV2);
  });

  // Test Case 2: Schema Migration Utility
  test("[Lifecycle] - Migration automatically bridges Login Schema v1 structures seamlessly to security level v2 specs", () => {
    const registry = SchemaRegistry.getInstance();
    const legacyData = {
      email: "engineer@enterprise.io",
      password: "highly_secure_password",
      rememberMe: true
    };

    const migrated = registry.migrateData<any>("auth-login", legacyData, 1, 2);

    expect(migrated.email).toBe("engineer@enterprise.io");
    expect(migrated.mfaCode).toBe("000000"); // Structural migration fallback
  });

  // Test Case 3: Offline Draft Persistence and Migration
  test("[Services] - Offline DraftStore saves locally and updates schema definitions across live sessions", () => {
    const legacyDraft = {
      email: "user@legacy-enterprise.com",
      password: "password_example",
      rememberMe: true
    };

    // Save as legacy schema structure
    DraftStore.saveDraft("auth-login", 1, legacyDraft);

    // Retrieve and execute on-the-fly upgrades matching Target version requirements
    const upgradedDraft = DraftStore.loadDraft<any>("auth-login", 2);

    expect(upgradedDraft).toBeDefined();
    expect(upgradedDraft?.email).toBe("user@legacy-enterprise.com");
    expect(upgradedDraft?.mfaCode).toBe("000000"); // Verified migrated schema consistency
  });

  // Test Case 4: Multi-Step Progress Tracker Engine
  test("[Wizard] - MultiStepEngine controls navigational boundaries and steps seamlessly", async () => {
    const steps = [
      { id: "account", label: "Account Info", fields: ["email"] },
      { id: "security", label: "Security Code", fields: ["mfaCode"] }
    ];

    const engine = new MultiStepEngine(steps);
    expect(engine.getCurrentStep().id).toBe("account");
    expect(engine.isFirstStep()).toBe(true);

    const validationMock = jest.fn().mockResolvedValue(true);
    const moved = await engine.next(validationMock);

    expect(moved).toBe(true);
    expect(engine.getCurrentStep().id).toBe("security");
    expect(engine.isLastStep()).toBe(true);
    expect(engine.getProgressPercentage()).toBe(100);
  });

  // Test Case 5: Dynamic Metadata-Driven Schemas
  test("[Dynamic] - DynamicFormEngine produces valid runtime Zod structures from JSON layouts", () => {
    const definitions: DynamicFieldDefinition[] = [
      { name: "customString", label: "Custom String", type: "text", required: true },
      { name: "customNumber", label: "Custom Number", type: "number", required: true }
    ];

    const generatedSchema = DynamicFormEngine.buildZodSchema(definitions);
    const defaults = DynamicFormEngine.generateDefaultValues(definitions);

    expect(defaults.customString).toBe("");
    
    const validData = { customString: "Enterprise System", customNumber: 42 };
    const invalidData = { customString: "", customNumber: "not_a_number" };

    expect(generatedSchema.safeParse(validData).success).toBe(true);
    expect(generatedSchema.safeParse(invalidData).success).toBe(false);
  });
});
