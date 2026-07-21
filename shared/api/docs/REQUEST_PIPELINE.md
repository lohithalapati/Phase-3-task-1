# Request Lifecycle Pipeline

Every HTTP request dispatched from the UI undergoes a synchronous initialization sequence:

1. **Instantiation**: Method, relative URL, payload, and query variables are defined.
2. **Correlation Tagging**: `requestInterceptor` assigns a unique request Trace ID to `X-Correlation-ID`.
3. **Identity Resolution**: Active session tokens are retrieved from browser storage and injected into the request header securely.
4. **Log Registry**: The request body is stripped of PII (passwords, secure tokens) and output to development debug environments.
5. **Metrics Logging**: Active connection counters are incremented for near real-time telemetry analysis.
