# Centralized API Endpoint Registry Schema

The `ENDPOINT_REGISTRY` holds all system routes, preventing hardcoded URL strings from leaking into application logic.

## Resource Endpoints

- **`auth`:** `/auth/login`, `/auth/logout`, `/auth/refresh-token`, `/auth/me`
- **`users`:** `/users`, `/users/:userId`, `/users/profile`
- **`projects`:** `/projects`, `/projects/:projectId`, `/projects/:projectId/handoffs`
- **`ai`:** `/ai/transcribe`, `/ai/summarize`, `/ai/generate-handoff`