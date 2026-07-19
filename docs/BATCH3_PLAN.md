# Phase 3 — Batch 3 Master Plan (Tasks 10–11)

## Lock rules
Same as Batch 2: never modify Phase 0–2 UI, Batch 1 auth/routing/stores, Design System.

## Task 10 — API & Data
1. apiClient with request/response interceptors
2. Map HTTP errors → ErrorPipeline.handle
3. Success/audit → EventBus NOTIFICATION_DISPATCH / AUDIT_ACTION
4. QueryClient defaults (retries aligned with RecoveryManager)

## Task 11 — RBAC
1. Permission catalog + role→permission matrix
2. can(permission) hook
3. RequirePermission component
4. Route guard wrapper (compose with existing router — do not replace)

## Gates
tsc, eslint, jest, build, boundaries, evidence report