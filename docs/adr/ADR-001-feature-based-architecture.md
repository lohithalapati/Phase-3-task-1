# ADR-001: Feature-Based Architecture

**Status:** Accepted

## Context
We need a scalable and maintainable folder structure that supports a growing team and feature set.

## Decision
We will adopt a feature-based architecture. All code related to a specific business domain (e.g., 'auth', 'dashboard') will be co-located within its own folder under /src/features. Truly global, non-domain-specific code will live in /src/shared.

## Consequences
- **Pros:** High team autonomy, reduced cognitive load, clear ownership, easier code navigation.
- **Cons:** Requires discipline to prevent logic from leaking between features or misplacing shared code.
