# Network Security Guardrails

## Transport Policies

1. **Authorization Token Safety:** JWT tokens are read from `localStorage` dynamically per request and never stored in plain-text module scopes.
2. **Automatic Payload Sanitization:** Interceptors parse body fields to prevent standard cross-site injection vectors from execution.
3. **Origin Constraints:** Restricts request execution to registered dynamic routes.