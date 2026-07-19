import { AppError, ErrorCode, ErrorKind } from "../types/AppError";
import { ErrorMapper } from "../mapper/ErrorMapper";
import { EventBus, EventTypes } from "../../core/events/EventBus";
import { ErrorPipeline } from "../pipeline/ErrorPipeline";

describe("Task 8: Enterprise Global Error Management", () => {
  beforeEach(() => {
    EventBus.clear();
  });

  test("ErrorMapper should map raw strings & generic JS Errors into high-fidelity AppErrors", () => {
    const rawMsg = "Database failure trace";
    const mappedStr = ErrorMapper.map(rawMsg);
    expect(mappedStr).toBeInstanceOf(AppError);
    expect(mappedStr.code).toBe(ErrorCode.UNKNOWN);
    expect(mappedStr.message).toBe(rawMsg);

    const runtimeErr = new TypeError("Cannot read properties of undefined");
    const mappedErr = ErrorMapper.map(runtimeErr);
    expect(mappedErr.code).toBe(ErrorCode.UNKNOWN);
    expect(mappedErr.kind).toBe(ErrorKind.FATAL);
  });

  test("ErrorMapper maps synthetic Axios Error properties into specialized network structures", () => {
    const syntheticAxios = {
      message: "Request failed with status code 401",
      isAxiosError: true,
      config: { url: "/v5/neural-handoff" },
      response: {
        status: 401,
        data: { message: "Signature verification sequence failed" },
      },
    };

    const mapped = ErrorMapper.map(syntheticAxios);
    expect(mapped.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(mapped.kind).toBe(ErrorKind.FATAL);
    expect(mapped.context.url).toBe("/v5/neural-handoff");
  });

  test("ErrorPipeline logs, captures telemetry, and triggers system-wide event", async () => {
    let triggeredEvent: any = null;
    EventBus.subscribe(EventTypes.SYSTEM_ERROR, (event) => {
      triggeredEvent = event;
    });

    const mockError = new Error("Platform telemetry execution crash");
    const appError = await ErrorPipeline.handle(mockError, "TelemetryEngineUnitTesting");

    expect(appError.message).toBe("Platform telemetry execution crash");
    expect(triggeredEvent).not.toBeNull();
    expect(triggeredEvent.payload.error).toBe(appError);
    expect(triggeredEvent.payload.source).toBe("TelemetryEngineUnitTesting");
  });
});