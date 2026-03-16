# To-Do

Actionable items that are planned to be done.

- Get mayo
- Get lettuce
- Get sliced turkey
- Get mustard
- Get pickles
- IP blocklist for GAS (application-level blocking via Script Properties or CacheService — block persistent attackers spotted in audit log). Consider shared vs per-project blocklist at scale
- Quota usage tracking — count audit log rows per day as a proxy for daily script executions, since Google provides no direct "remaining quota" API. Build when approaching ~10-15 projects
- Email alerting for security events — GAS `MailApp.sendEmail()` on first attack event per hour, so you know attacks are happening without checking the spreadsheet
- Heartbeat interval tuning at scale — switch from 30s test value to 300s production value; consider 600s for low-risk projects. Heartbeats are the biggest quota consumer at 50 projects
- Client-side session expiry estimation — skip unnecessary heartbeat round-trips when the client can calculate that the session isn't close to expiring, reducing GAS executions

Developed by: ShadowAISolutions
