import { z } from "zod";

export interface VersionMigrationRule<TSource = any, TTarget = any> {
  fromVersion: number;
  toVersion: number;
  migrate: (data: TSource) => TTarget;
}

export class SchemaRegistry {
  private static instance: SchemaRegistry;
  private schemas: Map<string, Map<number, z.ZodSchema<any>>> = new Map();
  private migrations: Map<string, VersionMigrationRule[]> = new Map();

  private constructor() {}

  public static getInstance(): SchemaRegistry {
    if (!SchemaRegistry.instance) {
      SchemaRegistry.instance = new SchemaRegistry();
    }
    return SchemaRegistry.instance;
  }

  public register(domain: string, version: number, schema: z.ZodSchema<any>): void {
    if (!this.schemas.has(domain)) {
      this.schemas.set(domain, new Map());
    }
    this.schemas.get(domain)!.set(version, schema);
  }

  public registerMigration(domain: string, rule: VersionMigrationRule): void {
    if (!this.migrations.has(domain)) {
      this.migrations.set(domain, []);
    }
    this.migrations.get(domain)!.push(rule);
  }

  public getSchema(domain: string, version: number): z.ZodSchema<any> {
    const domainMap = this.schemas.get(domain);
    if (!domainMap || !domainMap.has(version)) {
      throw new Error(`Schema for domain: ${domain} with version ${version} not registered.`);
    }
    return domainMap.get(version)!;
  }

  public migrateData<T = any>(domain: string, data: any, fromVersion: number, toVersion: number): T {
    if (fromVersion === toVersion) return data;
    const rules = this.migrations.get(domain) || [];
    let currentData = { ...data };
    let currentVer = fromVersion;

    while (currentVer < toVersion) {
      const rule = rules.find((r) => r.fromVersion === currentVer && r.toVersion === currentVer + 1);
      if (!rule) {
        throw new Error(`Migration map missing for ${domain} from v${currentVer} to v${currentVer + 1}`);
      }
      currentData = rule.migrate(currentData);
      currentVer++;
    }

    // Post-migration target structural validation
    const targetSchema = this.getSchema(domain, toVersion);
    const parsed = targetSchema.safeParse(currentData);
    if (!parsed.success) {
      throw new Error(`Post-migration validation failed for ${domain}: ${parsed.error.message}`);
    }
    return parsed.data as T;
  }
}
