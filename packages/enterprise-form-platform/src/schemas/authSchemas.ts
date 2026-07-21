import { z } from "zod";
import { SchemaRegistry } from "./registry";

// Domain Schema: Authentication v1
export const loginSchemaV1 = z.object({
  email: z.string().email("Invalid email format syntax"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  rememberMe: z.boolean().optional().default(false)
});

// Domain Schema: Authentication v2 (Enhanced Security Attributes)
export const loginSchemaV2 = z.object({
  email: z.string().email("Invalid email format syntax"),
  password: z.string().min(12, "Enterprise security policy requires 12 characters minimum"),
  mfaCode: z.string().length(6, "MFA code must be exactly 6 digits").regex(/^\d+$/, "MFA code must be numeric").optional(),
  rememberMe: z.boolean().optional().default(false)
});

// Register with System Registry Engine
const registry = SchemaRegistry.getInstance();
registry.register("auth-login", 1, loginSchemaV1);
registry.register("auth-login", 2, loginSchemaV2);

// Migration path from login schema v1 to v2 (auto-inject default MFA mock placeholders)
registry.registerMigration("auth-login", {
  fromVersion: 1,
  toVersion: 2,
  migrate: (data: any) => ({
    ...data,
    mfaCode: "000000" // Default migration fallback state
  })
});
