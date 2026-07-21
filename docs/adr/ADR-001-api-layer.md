# Architecture Decision Record (ADR-001): Enterprise API Abstraction Layer

## Context and Problem Statement
Feature components within React applications frequently call `fetch()` or construct localized `axios` requests. This leads to duplicate endpoints, missing telemetry metrics, variable retry policies, and complex session-token refresh management.

We require a centralized, type-safe network abstraction engine that isolates outbound requests, handles authentication lifecycles silently, logs execution telemetry, and recovers gracefully from transient server faults.

## Decision Drivers
* **Single Source of Truth:** Decouple networking protocols from the view layer.
* **Resiliency Margins:** Exponential backoff schedules for transient `5xx` gateway responses.
* **Session Integrity:** Simultaneous request queue locks and silent replays for `401 Unauthorized` responses.
* **Deterministic Tracking:** Automatic trace injection (`x-trace-id`, `x-correlation-id`) for request correlation.

## Considered Options
1. **Raw Axios with Custom Instances:** Standard instance construction inside components. High duplication, zero token replay safety.
2. **React Query / RTK Query directly:** Powerful, but couples domain error translation, network cancellation, and retry engines with external dependencies.
3. **Decoupled Layer 1–14 Wrapper Pattern (Chosen):** Centralizes HttpClient abstractions, Axios singletons, and React hooks while maintaining loose coupling.

## Consequences
* **Positive:** Components consume standardized `useQuery`, `useMutation`, and `usePagination` hooks. AbortController bindings prevent race conditions on navigation or double-submit events.
* **Negative:** Slightly increased upfront development configuration footprint.