import { SchemaRegistry } from "../schemas/registry";

export interface DraftEnvelope<T> {
  domain: string;
  version: number;
  updatedAt: number;
  data: T;
}

export class DraftStore {
  private static PREFIX = "ent_draft_v1::";

  public static saveDraft<T>(domain: string, version: number, data: T): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    const envelope: DraftEnvelope<T> = {
      domain,
      version,
      updatedAt: Date.now(),
      data
    };
    window.localStorage.setItem(`${this.PREFIX}${domain}`, JSON.stringify(envelope));
  }

  public static loadDraft<T>(domain: string, targetVersion: number): T | null {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = window.localStorage.getItem(`${this.PREFIX}${domain}`);
    if (!raw) return null;

    try {
      const envelope: DraftEnvelope<any> = JSON.parse(raw);
      if (envelope.version === targetVersion) {
        return envelope.data as T;
      }

      // Upgrade schema data structurally on the fly using migrations
      const registry = SchemaRegistry.getInstance();
      return registry.migrateData<T>(domain, envelope.data, envelope.version, targetVersion);
    } catch (e) {
      console.warn(`[DraftStore] Failed to parse or migrate local draft for ${domain}:`, e);
      return null;
    }
  }

  public static clearDraft(domain: string): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(`${this.PREFIX}${domain}`);
  }
}
