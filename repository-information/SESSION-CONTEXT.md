# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-22 03:22:27 PM EST
**Repo version:** v06.12r

### What was done
Major SSO and security infrastructure session across 7 pushes (v06.06r–v06.12r):

- **v06.06r** — Added `id="signing-in-subtitle"` to globalacl's `<p>` element and subtitle reset in `showSigningIn()` — was missing, preventing "Signing in via Application Portal" from displaying during SSO. Also applied to template
- **v06.07r** — Fixed tab duplication expiring session on localStorage pages. Root cause: `stopCountdownTimers()` in the tab-claim handler removed `SESSION_START_KEY` from shared localStorage, causing the claiming tab's timer to immediately expire. Fix: save/restore `SESSION_START_KEY` across `stopCountdownTimers()`. Applied to all auth pages + template
- **v06.08r** — Added complete SSO infrastructure to auth template (8 pieces were missing): variable declarations, BroadcastChannel setup, token request/response handlers, sign-out propagation, `attemptSSOAuth()` function, page-load SSO attempt, token capture in `handleTokenResponse`, SSO cleanup in `clearSession()`
- **v06.09r** — Fixed Global Sessions "Invalid JSON response" — two root causes: (1) `validateCrossProjectAdmin` in template/applicationportal called `getRolesFromSpreadsheet().indexOf('admin')` but that returns an object not an array (TypeError → HTML error page), (2) `listGlobalSessions` parser expected plain arrays but template format wraps in `{success, sessions}`. Fixed by standardizing on `checkSpreadsheetAccess()` and making parser handle both formats
- **v06.10r** — Added client-side expired session detection for localStorage pages — checks absolute/rolling timeouts before attempting server validation, skips "Reconnecting" for obviously-expired sessions
- **v06.11r** — Switched globalacl and all templates from standard preset to HIPAA preset (sessionStorage, postMessage, DOM clearing). applicationportal and testauth1 were already HIPAA
- **v06.12r** — Fixed HTML `SERVER_SESSION_DURATION` mismatch — was 3600s (standard/1hr) but GAS HIPAA uses 900s (15min). Client countdown now matches server-side session lifetime. Fixed in globalacl, applicationportal, and template

### Key decisions made
- **All projects now use HIPAA preset** — developer explicitly requested switching from standard to HIPAA for all auth projects. This means: sessionStorage (cleared on tab close), postMessage token exchange (token never in URL), DOM clearing on expiry, 15-minute rolling session, 8-hour absolute timeout
- **Template defaults to HIPAA** — new projects from the template will inherit the stronger security posture automatically
- **Backward-compatible parser** — `listGlobalSessions` handles both plain array (legacy) and `{success, sessions}` (template) response formats so old deployments still work

### Where we left off
- All auth pages (globalacl, applicationportal, testauth1) are on HIPAA preset
- All templates (HTML + both GAS) default to HIPAA
- GAS scripts need redeployment from Apps Script editor for server-side changes to take effect (globalacl.gs ACTIVE_PRESET switch + validateCrossProjectAdmin fix)
- testauth1 uses intentional test values (180s/300s/30s) for development — documented with comments showing production values to restore

### Active context
- Branch: `claude/implement-sso-applications-nX8jJ`
- Repo version: v06.12r
- globalacl.html: v01.23w, globalacl.gs: v01.23g
- applicationportal.html: v01.18w, applicationportal.gs: v01.07g
- testauth1.html: v02.72w, testauth1.gs: v01.91g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-22 01:12:28 PM EST
**Repo version:** v06.03r

### What was done
Session Active Elsewhere improvements, SSO reconnect fix, portal cleanup, and emoji fix across 7 pushes (v05.97r–v06.03r):

- **v05.97r–v06.03r** — "Session Active Elsewhere" overlay improvements, SSO auto-auth after portal refresh, SSO_PROVIDER flag, emoji rendering fixes, GIS async loading fix

### Where we left off
- SSO auto-auth after portal refresh works
- All auth pages have `SSO_PROVIDER` config flag (true only on applicationportal)

Developed by: ShadowAISolutions
