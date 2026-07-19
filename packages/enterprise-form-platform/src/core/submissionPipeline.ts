import { FieldValues, UseFormSetError } from "react-hook-form";

export interface EnterpriseErrorPayload {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export class SubmissionPipeline {
  public static handleServerError<T extends FieldValues>(
    error: any,
    setError: UseFormSetError<T>,
    setGlobalError: (msg: string | null) => void
  ): void {
    console.error("[Submission Error Captured]", error);
    
    const payload = error as EnterpriseErrorPayload;
    if (payload && payload.errors) {
      Object.keys(payload.errors).forEach((field) => {
        const messages = payload.errors![field];
        if (messages && messages.length > 0) {
          setError(field as any, {
            type: "server",
            message: messages[0]
          });
        }
      });
      setGlobalError("Validation error occurred on the server.");
    } else if (payload && payload.message) {
      setGlobalError(payload.message);
    } else {
      setGlobalError("A critical server connection error occurred. Please retry.");
    }
  }
}
