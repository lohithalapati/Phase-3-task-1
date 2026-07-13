
Network Security Framework
The API layer enforces strict zero-trust principles:

Token Sanitization: Client interceptors strip passwords, authorization headers, and CVVs before exporting logs to developers or tracking services.
Version Pinning: The client includes the X-Client-Version header in every request to prevent API mismatches.
Session Isolation: Expired refresh tokens trigger immediate storage purges and signal key subsystems to terminate the current user session safely.
