# NeuralHandoff V5 — Engineering & Architecture Guidelines

This document outlines the structural rules and conventions established in Task 1. Adherence is mandatory for all subsequent tasks to maintain scalability and prevent code duplication.

## 1. Directory Structure

- **`src/features`**: Contains self-contained business domains (e.g., `auth`, `dashboard`). Each feature has its own `api`, `components`, `hooks`, and `types`.
- **`src/shared`**: Contains strictly reusable, business-agnostic logic.
  - `components`: Reusable UI elements (Forms, Feedback Modals).
  - `hooks`: Global custom hooks (e.g., `useLocalStorage`).
  - `layouts`: Global page layouts (e.g., `DashboardLayout`).
  - `types`: Global TypeScript interfaces (`ApiResponse`, `UserSession`).
  - `utils`: Global utility functions (`formatCurrency`, `cn`).
- **`src/providers`**: Global React Context providers (`AppProvider`, `ErrorBoundary`).
- **`src/config`**: Application configuration (`env.ts`, `features.ts`).
- **`src/assets`**: Static assets (images, fonts).
- **`docs`**: Project documentation, including this file.

## 2. Path Aliases

Use path aliases to avoid deep relative imports (`../../..`).

- `@/features/*`: Access feature modules.
- `@/shared/*`: Access shared modules.
- `@/providers/*`: Access providers.
- `@/config/*`: Access configuration.

## 3. Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities/Types**: camelCase/PascalCase (`format.ts`, `index.ts`)

## 4. No Duplication Rule

Before creating a new utility or component, check the `/shared` directory first. Do not write duplicate logic.
