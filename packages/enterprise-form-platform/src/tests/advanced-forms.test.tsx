import "../tests/setup";
import { PluginRunner, EnterpriseFormPlugin } from "../services/pluginSystem";
import { SubmissionPipeline } from "../core/submissionPipeline";

describe("Enterprise Form Platform - Advanced & Edge Cases", () => {
    test("[Plugins] - Lifecycle hooks trigger sequentially before and after validation", async () => {
        const mockBefore = jest.fn();
        const mockAfter = jest.fn();
        
        const testPlugin: EnterpriseFormPlugin = {
            name: "AuditPlugin",
            beforeSubmit: mockBefore,
            afterSubmit: mockAfter
        };

        const runner = new PluginRunner([testPlugin], () => ({
            domain: "test", formState: {}, getValues: () => ({}), setValue: jest.fn()
        }));

        await runner.executeBeforeSubmit();
        await runner.executeAfterSubmit({ success: true });

        expect(mockBefore).toHaveBeenCalledTimes(1);
        expect(mockAfter).toHaveBeenCalledTimes(1);
    });

    test("[Error Normalization] - Pipeline maps complex server errors directly to fields", () => {
        const mockSetError = jest.fn();
        const mockSetGlobal = jest.fn();
        
        const serverError = {
            errors: { email: ["Email is already registered"] }
        };

        SubmissionPipeline.handleServerError(serverError, mockSetError, mockSetGlobal);
        
        expect(mockSetError).toHaveBeenCalledWith("email", { type: "server", message: "Email is already registered" });
        expect(mockSetGlobal).toHaveBeenCalledWith("Validation error occurred on the server.");
    });
});
