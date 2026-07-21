import { z } from "zod";

export type DynamicFieldType = "text" | "number" | "select" | "checkbox";

export interface DynamicFieldDefinition {
  name: string;
  label: string;
  type: DynamicFieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: any;
}

export class DynamicFormEngine {
  public static buildZodSchema(definitions: DynamicFieldDefinition[]): z.ZodObject<any> {
    const shape: Record<string, z.ZodTypeAny> = {};

    definitions.forEach((def) => {
      let fieldSchema: z.ZodTypeAny;

      switch (def.type) {
        case "number":
          fieldSchema = z.number({ invalid_type_error: `${def.label} must be a number` });
          break;
        case "checkbox":
          fieldSchema = z.boolean();
          break;
        case "select":
        case "text":
        default:
          fieldSchema = z.string();
          break;
      }

      if (def.required) {
        if (def.type === "text") {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${def.label} is required`);
        }
      } else {
        fieldSchema = fieldSchema.optional();
      }

      shape[def.name] = fieldSchema;
    });

    return z.object(shape);
  }

  public static generateDefaultValues(definitions: DynamicFieldDefinition[]): Record<string, any> {
    const defaults: Record<string, any> = {};
    definitions.forEach((def) => {
      defaults[def.name] = def.defaultValue !== undefined ? def.defaultValue : def.type === "checkbox" ? false : "";
    });
    return defaults;
  }
}
