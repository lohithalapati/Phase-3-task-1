# Token Lifecycle & Session Recovery State Machine

## Dynamic Session Recovery Execution Path
[Authenticated Request] -> [Gateway returns 401] -> [Refresh Queue Suspended]
|
+----------+----------+
| Execute silent post |
| to /refresh-token |
+----------+----------+
|
+-----------------------------+-----------------------------+
| (Success) | (Failure / Expired)
v v
[Refresh local storage keys] [Purge credentials]
[Process outstanding queue] [Fire unauthorized Event]
[Resume application pipeline] [Route user to Login portal]

## Replay Queue Specifications

When multiple concurrent requests fail with a `401 Unauthorized` status, subsequent requests are placed into a pending array. When the refresh token flow finishes:
- **On Success:** Replay array calls execute in sequence with the new Bearer credentials.
- **On Fail:** The credential storage is purged, aborting queued tasks to protect user authentication.