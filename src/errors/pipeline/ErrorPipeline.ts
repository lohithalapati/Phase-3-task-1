import { Logger } from '../../core/logging/Logger';
import { Observability } from '../../core/observability/Observability';
import { RecoveryManager } from '../../core/recovery/RecoveryManager';
import { EventBus, EventTypes } from '../../core/events/EventBus';
import { ErrorMapper } from '../mapper/ErrorMapper';
import { AppError } from '../types/AppError';

export class ErrorPipeline {
  static handle(raw: any, source?: string): AppError {
    // Step 1: Map raw error to AppError
    const appError: AppError = ErrorMapper.map(raw);

    // Step 2: Log
    Logger.error(
      '[ErrorPipeline] Unhandled failure trapped: ' + appError.code,
      { source, kind: appError.kind, message: appError.message }
    );

    // Step 3: Observe (track exception via abstraction layer)
    if (raw instanceof Error) {
      Observability.trackException(raw, { source, code: appError.code });
    } else {
      Observability.trackMetric('error_occurred', 1, { kind: appError.kind });
    }

    // Step 4: Recover
    RecoveryManager.handleRecovery(appError.kind);

    // Step 5: Emit to EventBus for Notification Pipeline (Task 9)
    EventBus.publish(EventTypes.SYSTEM_ERROR, appError, source || 'ErrorPipeline');

    return appError;
  }
}