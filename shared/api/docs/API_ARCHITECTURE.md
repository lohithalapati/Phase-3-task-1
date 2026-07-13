# Enterprise API Layer Architecture

The centralized API layer in `shared/api/` is the single communication layer for the frontend application. No direct usage of `axios` or `fetch` is permitted in feature modules.

## Architecture Highlights
- **Single Source of Truth**: All requests pass through a configured Axios singleton (`shared/api/client/apiClient`).
- **Resilience Engine**: Built-in retry mechanisms with exponential backoff and randomized jitter prevent cascading server errors.
- **Strict Decoupling**: Pure Data Transfer Object (DTO) transformers keep UI modules independent of raw server payload schemas.
- **Traceability**: Every request is tagged with a unique Correlation ID for distributed tracing.
   [Feature Service]
           ¦ (Type-Safe Interface)
           ?
    [apiClient Core]
     /            \
[Req Interceptor] [Res Interceptor]
+-- Trace IDs +-- Jittered Retry
+-- Auth Injection +-- Refresh Queue
