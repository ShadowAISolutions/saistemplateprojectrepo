# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-19 03:07:49 PM EST
**Repo version:** v05.13r

### What was done
This session worked on **centralizing ACL setup and cache management infrastructure**:

- **v05.08r** through **v05.13r** — Major cache infrastructure overhaul and ACL centralization:
  - **Centralized ACL setup** — created `setupAcl()` function to eliminate duplicated ACL initialization across `doGet()`, `processHeartbeat()`, `listActiveSessions()`, and `adminSignOutUser()`. Single source of truth for ACL spreadsheet opening, sheet selection, and data reading
  - **Cache epoch system** — implemented `CACHE_EPOCH` (stored in ScriptProperties) with `invalidateAllCaches()` / `nuclearCacheInvalidation()` for bulk cache invalidation. All cache keys are prefixed with `eN_` (epoch number). Incrementing the epoch makes all old keys invisible without waiting for TTL expiry
  - **Rate limiting** — added `checkRateLimit()` using cache-based sliding window (epoch-aware keys). Configurable per-user request limits to prevent abuse
  - **RBAC roles matrix caching** — the full roles→permissions mapping is cached under `eN_rbac_roles_matrix` so `hasPermission()` doesn't re-read the config on every call
  - **`inspectCache()` diagnostic** — new function to probe all known cache key patterns (access, role, session, roles matrix) for each user across current and previous epochs. Run from the GAS editor to view cache contents

### Where we left off
- Cache infrastructure is solid — epoch-based invalidation, rate limiting, and RBAC caching all working
- `inspectCache()` is available for debugging cache state
- **RBAC features still not built** (from prior sessions):
  1. Client-side UI gating — hide/show elements based on role
  2. `delete` permission — defined but no endpoint
  3. `export` permission — defined but no endpoint (HIPAA #23)
  4. `amend` permission — defined but no workflow (HIPAA #24)
  5. Field-level data filtering
  6. Role management UI
- **Other unimplemented work:**
  - HIPAA P1 gaps: #19 Disclosure Accounting, #23 Right of Access, #24 Right to Amendment
  - HIPAA P2 gaps: #18 6-Year Retention, #28 Breach alerting, #31 Breach Logging
  - Single-load optimization (10.4 standard, 10.4.1 HIPAA)
  - Phase 8 CSP Hardening, Phase 10 Cross-Phase Verification
  - Test timeout values still at `⚡ TEST VALUE`

### Key decisions made
- Cache keys use epoch prefix (`eN_`) — incrementing epoch effectively invalidates all cached data without explicit deletion
- `inspectCache()` checks both current and previous epoch to detect stale entries
- Rate limiting is cache-based (not persistent) — resets on epoch change or cache expiry

### Active context
- Branch: `claude/centralize-acl-setup-2m7V1`
- Repo version: v05.13r
- Key files: `googleAppsScripts/Testauth1/testauth1.gs` (v01.72g), `live-site-pages/testauth1.html` (v02.44w)
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-19 01:13:05 PM EST
**Repo version:** v05.04r

### What was done
This session worked on **admin session management — sign-out notification and heartbeat fixes**:

- **v05.03r** — Fixed admin sign-out not reaching the signed-out user's browser. Three fixes: (1) `doGet()` now includes `evictionReason` in `gas-needs-auth` when a tombstone exists, so page refresh shows "An administrator ended your session" instead of generic "Session expired"; (2) fixed `_expectingSession` guard blocking legitimate `gas-needs-auth` on page-load resume — guard is now only set during mid-session iframe navigations (gas-session-created, Use Here), not on initial page load; (3) added `gas-session-invalid` message type for mid-session heartbeat detection of invalidated sessions
- **v05.04r** — Fixed heartbeat stuck on "Heartbeat: sending..." after admin sign-out. Two root causes: (1) `gas-heartbeat-expired` was not in the `_SIG_EXEMPT` list — the server can't sign the response when the session (and its signing key) no longer exists, so the unsigned response was silently rejected by HMAC verification on the client; (2) eviction tombstones were consumed (deleted) by `processHeartbeat` on first read, leaving nothing for page refresh to read — tombstones now expire naturally (5 min TTL) so both heartbeat and page refresh can independently detect the `admin_signout` reason

### Where we left off
- Admin sign-out flow is fully working
- RBAC features still need implementation (client-side UI gating, delete/export/amend permissions, field-level filtering, role management UI)
- HIPAA gaps and other unimplemented work carried forward

Developed by: ShadowAISolutions
