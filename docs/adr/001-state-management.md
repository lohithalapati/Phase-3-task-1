# Architecture Decision Record: Global State Management Architecture

## Status
Approved

## Context
Our enterprise application requires a global state engine that acts as a single source of truth, manages complex local-only user contexts, is highly resilient to Server-Side Rendering (SSR) hydration mismatches, and facilitates decoupled inter-store communication without cyclic imports.

## Decision
We have selected **Zustand** as our core client-side state library. To ensure high-quality engineering compliance across team layers, the state framework has been wrapped inside a robust, structured architectural layout consisting of:

1. **Centralized Store Factory (`storeFactory.ts`)**: Encapsulates boilerplates including `devtools`, `persist`, standard telemetry, and multi-tab synchronization.
2. **Store Version Registry (`storeVersions.ts`)**: Prevents version drift by keeping database/local storage schemas versioned in a centralized module.
3. **Decoupled Store Event Bus (`storeEventBus.ts`)**: Implements an asynchronous event emitter layout so stores can subscribe to and react to system changes (e.g., Logouts) without importing from one another.
4. **Immutable Freeze Middleware (`immutableFreeze.ts`)**: Recursively freezes current state updates in non-production environments to completely prevent direct state mutations.
5. **Runtime Diagnostics Engine (`diagnostics.ts`)**: Tracks hydration timing, update frequencies, and size estimates to alert developers of execution bottlenecks.

## Consequences
- **Zero Circular Dependencies**: Stores never call actions of other stores directly. Instead, they trigger events on the event bus, or components consume selectors from different states.
- **SSR Hydration Safety**: A custom hydration registry tracks when stores are fully rehydrated from localStorage or sessionStorage, avoiding hydration UI discrepancies.
- **Simplified Maintainability**: Boilerplate duplication is reduced by over 80% via the centralized factory pattern.
