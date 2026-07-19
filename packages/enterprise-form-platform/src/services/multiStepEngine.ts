export interface WizardStep {
  id: string;
  label: string;
  fields: string[];
}

export class MultiStepEngine {
  private currentStepIndex = 0;

  constructor(private steps: WizardStep[]) {
    if (steps.length === 0) {
      throw new Error("MultiStepEngine initialized with zero steps.");
    }
  }

  public getSteps(): WizardStep[] {
    return this.steps;
  }

  public getCurrentStep(): WizardStep {
    return this.steps[this.currentStepIndex];
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public next(triggerValidation: () => Promise<boolean>): Promise<boolean> {
    return triggerValidation().then((isValid) => {
      if (isValid && this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex++;
        return true;
      }
      return false;
    });
  }

  public previous(): boolean {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      return true;
    }
    return false;
  }

  public isFirstStep(): boolean {
    return this.currentStepIndex === 0;
  }

  public isLastStep(): boolean {
    return this.currentStepIndex === this.steps.length - 1;
  }

  public getProgressPercentage(): number {
    return Math.round(((this.currentStepIndex + 1) / this.steps.length) * 100);
  }
}
