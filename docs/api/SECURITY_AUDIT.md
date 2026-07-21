# NeuralHandoff V5 — Network Security and Cryptographic Storage Audit

## Threat Vectors & Mitigations

### 1. Cryptographic Token Storage
* **Vector:** Cross-Site Scripting (XSS) extraction of JWT vectors from memory.
* **Mitigation:** Access tokens are read dynamically from `LocalStorage` on request dispatch and never cached in plain-text module scopes. Production deployments are optimized to utilize split-cookie HttpOnly layouts, completely shielding tokens from document DOM extractions.

### 2. Cross-Site Request Forgery (CSRF)
* **Vector:** Browser session context replays against stateful write-operations.
* **Mitigation:** Customized non-standard metadata headers (`x-trace-id`, `x-correlation-id`) are registered on every outgoing transaction. Browser cross-origin verification (CORS) enforces strict pre-flight pre-authentications, blocking unauthorized request forwards.

### 3. Transport Security & Gateway Hardening
* **Policies:**
  * **Strict Origin Policies:** Block connections outside the centralized policy bases.
  * **HTTPS Enforcement:** Strict-Transport-Security (HSTS) flags must be enabled across production backends.
  * **Trace Tracking:** Correlation IDs ensure all client errors are mapped directly to backend server audit logs.