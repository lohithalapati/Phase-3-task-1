# Normalized Error Management

Raw HTTP network faults and library-specific errors are mapped to our standardized `ApiError` class.

## Standardized Categories
- `NETWORK_ERROR`: Physical network offline or blocked ports.
- `TIMEOUT_ERROR`: Server took too long to respond.
- `UNAUTHORIZED`: Invalid or expired authentication credentials.
- `FORBIDDEN`: Insufficient permissions.
- `NOT_FOUND`: Resource does not exist.
- `VALIDATION_ERROR`: Field validation failed on the server.
- `SERVER_ERROR`: Unhandled 5xx exceptions on backend systems.

## Accessing Logs
Always inspect the `correlationId` field in the thrown `ApiError` instance to match client exceptions with corresponding server logs.
