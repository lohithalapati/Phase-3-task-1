# Domain-Level Error Hierarchy Matrix

## Structural Inheritances
                  +----------------------+
                  |      BaseError       |
                  +----------+-----------+
                             |
                             v
                  +----------------------+
                  |       ApiError       |
                  +----+-------------+---+
                       |             |
     +-----------------+             +-----------------+
     |                                                 |
     v                                                 v
+------------------+ +------------------+
| Authentication | | ValidationError|
+------------------+ +------------------+
| Authorization | | ConflictError |
+------------------+ +------------------+
| NetworkError | | ServerError |
+------------------+ +------------------+

## Error Categories Reference

- **`AuthenticationError` (401):** Triggered when auth credentials are missing, malformed, or expired.
- **`AuthorizationError` (403):** Triggered when permissions are insufficient for the requested action.
- **`ValidationError` (400):** Triggered by bad payloads, including specific validation failure maps.
- **`ConflictError` (409):** Triggered by resource version mismatches or duplicate entities.
- **`TimeoutError` / `NetworkError`:** Local network timeout or interface drop events.