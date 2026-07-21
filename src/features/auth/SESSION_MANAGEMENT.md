# Platform Session Lifecycle Spec

The workstation session interface implements dynamic inactivity auditing, tab synchronization, and forced logouts.

## Session Lifecycles
- **Maximum Lease Runtime**: 15 minutes of user inactivity (`SESSION_CONFIG.IDLE_TIMEOUT_MS`).
- **Activity Monitor Events**: `mousedown`, `keydown`, `scroll`, `touchstart`.
- **Multi-Tab Synchronization**: Managed through real-time `BroadcastChannel` signals (`auth_session_sync_channel`) mapping `LOGOUT` and `SESSION_EXPIRED` signals.
[ Active Workstation Tab A ] ───(Broadcast Signal)───> [ Workstation Tab B ]
│ │
Forced Inactivity Instantly Aligned
│ │
State Reset & Cleaned State Reset & Cleaned
