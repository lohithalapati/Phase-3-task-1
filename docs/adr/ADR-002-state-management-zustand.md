# ADR-002: State Management with Zustand

**Status:** Accepted

## Context
We require a centralized state management solution that is simple, scalable, and has minimal boilerplate.

## Decision
We will use Zustand for global state management. It provides a simple hook-based API on top of a centralized store, aligning with modern React practices.

## Consequences
- **Pros:** Lightweight, easy to learn, less boilerplate than Redux, excellent performance.
- **Cons:** Less structured than Redux Toolkit, which may require more team discipline for large-scale state.
