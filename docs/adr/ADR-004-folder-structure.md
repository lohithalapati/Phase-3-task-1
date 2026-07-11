# ADR-004: Standardized Folder Structure

**Status:** Accepted

## Context
To complement the feature-based architecture, we must enforce a consistent internal structure for all modules.

## Decision
Folders will be organized as: src/features, src/shared, src/providers, src/config. Shared modules are prohibited from importing from feature modules. Feature modules may import from shared.

## Consequences
Enforces a one-way dependency flow, preventing circular dependencies and improving architectural integrity.
