# ADR-002: Enterprise Form Platform Architecture

## Status
Approved

## Context
Forms are a foundational layer across our product landscape, starting with authentication flows and extending to downstream feature modules. Previously, form state, error rendering, schema mappings, and validation policies were coupled locally within components, yielding maintenance regressions, inconsistent UX/accessibility behaviors, and architectural duplication.

## Decision
We establish a unified, centralized, headless and accessible Form Platform system utilizing:
1. **React Hook Form (RHF)** as the single source of truth for runtime form states.
2. **Zod** as the schema validation engine.
3. **SchemaRegistry** to centralize v1/v2 schema definitions, ensuring structural forward/backward compatibility.
4. **DraftStore** utilizing local persistence storage coupled with strict automatic schema version-upgrades.
5. **A Unified Plugin Interface** wrapping execution scopes to automate tracking, compliance logging, analytics hooks, or input sanitization.

## Consequences
- **Positive:** Centralized accessibility checks, strict typings from schema validation, zero-effort upgrade paths.
- **Negative:** Minor bundle footprint overhead due to centralized orchestration libraries.
- **Rules:** No network fetch wrappers directly nested within form layouts; submissions must resolve inside clean platform pipeline wrappers mapped directly to API layer components.
