# Error Flow Diagram — NeuralHandoff V5

## Overview
Every error in the application flows through a single pipeline.
No component handles errors in isolation.

## Error Flow
\\\
Error Source (API / Runtime / Render / Async)
        |
        v
  ErrorMapper.map(rawError)
        |
        v
  AppError { id, code, kind, message, timestamp }
        |
        v
  ErrorPipeline.handle(appError)
        |
        +---> Logger.error(message, context)
        |
        +---> RecoveryManager.execute(errorKind)
        |           |
        |           +---> AUTH error    → Redirect to /login
        |           +---> NETWORK error → Retry logic
        |           +---> RUNTIME error → Reload suggestion
        |           +---> UNKNOWN error → Safe fallback
        |
        +---> Observability.trackMetric()
        |
        +---> EventBus.publish(SYSTEM_ERROR, appError)
                    |
                    v
              NotificationPipeline (Task 9)
\\\

## Error Kinds
| Kind        | Code Prefix  | Recovery Strategy       |
|------------|-------------|-------------------------|
| AUTH       | ERR_HTTP_401 | Redirect to login       |
| FORBIDDEN  | ERR_HTTP_403 | Show forbidden page     |
| NOT_FOUND  | ERR_HTTP_404 | Show not found page     |
| SERVER     | ERR_HTTP_500 | Retry / reload          |
| NETWORK    | ERR_NETWORK  | Retry with backoff      |
| VALIDATION | ERR_VALID_*  | Return to form          |
| RUNTIME    | ERR_RUNTIME  | ErrorBoundary fallback  |
| UNKNOWN    | ERR_UNKNOWN  | Safe fallback page      |

## Rules
- Never expose raw backend errors to UI
- All errors must be mapped through ErrorMapper
- ErrorBoundary wraps the entire application
- No component catches errors independently
