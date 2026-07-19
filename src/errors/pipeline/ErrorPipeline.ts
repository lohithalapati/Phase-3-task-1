import { EventBus, EventTypes } from "../../core/events/EventBus";
import { Logger } from "../../core/logging/Logger";
import { Observability } from "../../core/observability/Observability";
import { RecoveryManager } from "../../core/recovery/RecoveryManager";
import { ErrorMapper } from "../mapper/ErrorMapper";
import { AppError } from "../types/AppError";

class CoreErrorPipeline {
  private static instance: CoreErrorPipeline;

  private constructor() {}

  public static getInstance(): CoreErrorPipeline {
    if (!CoreErrorPipeline.instance) {
      CoreErrorPipeline.instance = new CoreErrorPipeline();
    }
    return CoreErrorPipeline.instance;
  }

  public async handle(rawError: unknown, source: string): Promise<AppError> {
    const appError = ErrorMapper.map(rawError);

    // 1. Unified Logging
    Logger.error(`[ErrorPipeline] Unhandled failure trapped: ${appError.message}`, {
      code: appError.code,
      kind: appError.kind,
      source,
      context: appError.context,
    });

    // 2. Telemetry & Observability
    Observability.trackException(appError);

    // 3. Dynamic Recovery execution
    const recovered = await RecoveryManager.handleRecovery(appError);

    // 4. Publish to Core System EventBus
    EventBus.publish(
      EventTypes.SYSTEM_ERROR,
      {
        error: appError,
        recovered,
        source,
      },
      source
    );

    return appError;
  }
}

export const ErrorPipeline = CoreErrorPipeline.getInstance();