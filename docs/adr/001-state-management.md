# ADR 001: Global State Management Architecture

## Status
Approved

## Context
Our enterprise product requires a resilient, secure, and highly scalable client state architecture serving as the single source of truth for all local-first feature states. It must scale cleanly to support hundreds of component modules without encountering circular dependencies, stale state synchronization issues, or render performance bottlenecks.

## Store Dependency Graph
Below is the strict directional boundary graph of our state management system:
              ┌───────────────────────┐
              │   useAuthStore        │ <─── [Transient session storage]
              └──────────┬────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
 │useUserStore │  │useOrgStore  │  │useSettings  │ <─── [Cross-tab synced local storage]
 └─────────────┘  └─────────────┘  └──────┬──────┘
        │                │                │
        └────────┬───────┘                │
                 ▼                        ▼
     ┌───────────────────────┐   ┌─────────────────┐
     │  usePermissionStore   │   │  Feature Flags  │ <─── [Dynamic Context evaluations]
     └───────────────────────┘   └─────────────────┘

 ┌────────────────────────────────────────────────────────┐
 │  UI Stores: useThemeStore, useSidebarStore             │ <─── [Layout configs, no auth coupling]
 ├────────────────────────────────────────────────────────┤
 │  Interaction Stores: useNotificationStore, useLoading  │ <─── [Non-persistent runtime memory]
 └────────────────────────────────────────────────────────┘

## Decisions
1. **Zustand Engine**: We standardise on Zustand for client-owned states because it decouples state slices from the React render pipeline, facilitating lightning-fast selector updates.
2. **Centralised Factory (`storeFactory.ts`)**: Prevents duplicate boilerplates by wrapping middleware stacks (`devtools`, `persist`, `subscribeWithSelector`, `logger`, `crossTabSync`, and development-only `immutableFreeze`) in an atomic setup.
3. **Decoupled Event Bus (`storeEventBus.ts`)**: Stores communicate out-of-band via an asynchronous, strictly typed Event Bus rather than directly importing or invoking other store dispatch mechanisms, avoiding cyclic dependency loops.
4. **Boundary Enforcer (`boundaryEnforcer.ts`)**: A custom automated AST/static validation rule engine runs during build cycles and CI phases to block prohibited imports (e.g. UI stores importing core business models) and prevent direct localStorage bypasses.
5. **Quality Gates**: Maintain 100% compliance against static quality rules, execute sub-millisecond memoized selectors, and run rigorous unit contract and performance regression benchmarks.

## Consequences
- **Robust Security**: Access tokens and credential lifetimes are isolated inside temporary `sessionStorage` layers, while non-sensitive settings are persisted in `localStorage`.
- **Zero Hydration Stutter**: Custom hydration listeners inform the parent shell when storage synchronization finishes, preventing flickering during page load.
- **Maintainable Scalability**: Future developer layers are strictly bounded and audited in real-time by automated quality-gate scripts.
