export interface FormPluginContext<TFieldValues = any> {
  domain: string;
  formState: any;
  getValues: () => TFieldValues;
  setValue: (name: string, value: any) => void;
}

export interface EnterpriseFormPlugin<TFieldValues = any> {
  name: string;
  beforeValidate?: (ctx: FormPluginContext<TFieldValues>) => void;
  afterValidate?: (ctx: FormPluginContext<TFieldValues>, isValid: boolean) => void;
  beforeSubmit?: (ctx: FormPluginContext<TFieldValues>) => Promise<void> | void;
  afterSubmit?: (ctx: FormPluginContext<TFieldValues>, result: any) => Promise<void> | void;
}

export class PluginRunner<TFieldValues = any> {
  constructor(
    private plugins: EnterpriseFormPlugin<TFieldValues>[],
    private getContext: () => FormPluginContext<TFieldValues>
  ) {}

  public executeBeforeValidate(): void {
    const ctx = this.getContext();
    this.plugins.forEach((p) => p.beforeValidate?.(ctx));
  }

  public executeAfterValidate(isValid: boolean): void {
    const ctx = this.getContext();
    this.plugins.forEach((p) => p.afterValidate?.(ctx, isValid));
  }

  public async executeBeforeSubmit(): Promise<void> {
    const ctx = this.getContext();
    for (const p of this.plugins) {
      if (p.beforeSubmit) {
        await p.beforeSubmit(ctx);
      }
    }
  }

  public async executeAfterSubmit(result: any): Promise<void> {
    const ctx = this.getContext();
    for (const p of this.plugins) {
      if (p.afterSubmit) {
        await p.afterSubmit(ctx, result);
      }
    }
  }
}
