## [1.0.0-Task5] - 2026-07-13
### Added
- Centralized enterprise-grade HTTP communication layer in `shared/api/`.
- Resilient retry system featuring exponential backoff and randomized jitter to eliminate storming.
- Single-flight refresh token queue to resolve authentication race-conditions elegantly.
- Custom structured `ApiError` class with universal mapping from all downstream exceptions.
- Integrated non-blocking metrics tracker & PII payload logger.
- Explicit `AbortController` structural support across all typed services.
- Detailed architectural manuals and API developer Guides.

### Fixed
- Fixed vitest ESM dynamic require path resolution using ES native static imports.

## [Unreleased]


## [v1.0] - 2026-07-11 - (bcc2dbe) - Batch 1 (Task 1) - Enterprise Project Architecture
### Added
- Enterprise feature-based folder structure (features, shared, providers, config).
- Environment management (src/config/env.ts).
- Centralized Feature Flags (src/config/features.ts).
- Global AppProvider infrastructure.
- Absolute path aliasing (@/*, @shared/*, etc.) configured safely.
- Standard barrel exports across core directories.


