# Enterprise Form Platform - Operations Runbook

## 1. Key Performance Indicators (KPIs)
| Metric | SLA Target | Measurement Method |
|--------|------------|--------------------|
| **Test Coverage** | > 95% (Lines, Branches, Functions) | Jest Coverage Report |
| **Bundle Footprint**| < 15KB (Gzipped) | Webpack/Vite Bundle Analyzer |
| **Render Latency** | < 16ms (60fps) | React Profiler / Lighthouse |
| **Validation Latency**| < 5ms per field | Performance.now() tracing |

## 2. Failure Recovery & Draft Corruption
- **Scenario:** User's local draft contains corrupted or deeply incompatible legacy schema data.
- **Recovery Action:** `DraftStore.loadDraft()` catches the structural parsing error, wipes the local cache for that domain, and gracefully falls back to the schema's default values. User experience is not interrupted.

## 3. Deprecation & Version Support Policy
- **Policy:** The Platform supports N-1 major versions. 
- **Sunset:** When schema `v3` is released, `v1` is marked deprecated. Forms relying on `v1` will log console warnings in staging. `v1` will be forcibly dropped 90 days after `v3` release.

## 4. Rollback Procedure
- If a catastrophic bug is detected in a new schema version, utilize the `SchemaRegistry` feature flags to reroute `useEnterpriseForm` requests back to the `N-1` version instantly without requiring a UI component deploy.
