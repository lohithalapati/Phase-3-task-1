# Workspace Access Policy Matrix

Roles map to strict permissions checking systems across all workstation console modules.

## Security Privilege Matrix
┌─────────────────┬─────────────┬─────────────┬─────────────┐
│ Privilege Scope │ Admin │ Manager │ User │
├─────────────────┼─────────────┼─────────────┼─────────────┤
│ read:profile │ ✅ Grant │ ✅ Grant │ ✅ Grant │
│ write:profile │ ✅ Grant │ ✅ Grant │ ❌ Deny │
│ manage:users │ ✅ Grant │ ❌ Deny │ ❌ Deny │
│ view:audit_logs │ ✅ Grant │ ✅ Grant │ ❌ Deny │
└─────────────────┴─────────────┴─────────────┴─────────────┘

- **Administrative Privilege**: Administrators bypass permission-specific guards dynamically.
- **Local Hook Verification**: Validated via programmatic checks in `usePermission()`.
