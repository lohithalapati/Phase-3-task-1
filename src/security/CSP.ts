export class CSPManager {
  static initTrustedTypes(): void {
    const ctx = typeof window !== 'undefined' ? (window as any) : null;
    if (!ctx || !ctx.trustedTypes) return;

    try {
      ctx.trustedTypes.createPolicy('default', {
        createHTML: (val: string) => val,
        createScript: (val: string) => val,
        createScriptURL: (val: string) => val,
      });
    } catch {
      // Prevent crash if executed repetitively
    }
  }
}
