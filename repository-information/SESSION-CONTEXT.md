# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-22 01:12:28 PM EST
**Repo version:** v06.03r

### What was done
Session Active Elsewhere improvements, SSO reconnect fix, portal cleanup, and emoji fix across 7 pushes (v05.97r–v06.03r):

- **v05.97r** — "Session Active Elsewhere" overlay now shows the application name in the heading (e.g. "Application Portal — Active Elsewhere") and message ("Your Application Portal session is active in another tab...") using `document.title`. Applied to template + all 3 auth pages. Also shows "Active on Another Device" variant for cross-device eviction
- **v05.98r** — Fixed SSO auto-auth failing after page refresh. After a portal reconnect, `_ssoAccessToken` was lost (in-memory only). Added silent GIS `requestAccessToken()` in the `gas-auth-ok` handler to re-acquire the Google token so the portal can respond to SSO requests from child apps
- **v05.99r** — Gated silent GIS re-auth behind new `HTML_CONFIG.SSO_PROVIDER` flag. Only applicationportal (`SSO_PROVIDER: true`) re-acquires the token; other pages (`SSO_PROVIDER: false`) skip it to avoid unnecessary Google auth on refresh
- **v06.00r** — Updated portal reconnecting subtitle to "Verifying your session and preparing sign-in for linked apps"
- **v06.01r** — Fixed emoji rendering in applicationportal.gs — replaced double-escaped Unicode surrogate pairs (`\\uD83D\\uDD10`) with actual emoji characters (🔐, 🌐, 🛡, 🧪, 🔒, 🏠, ⚙️)
- **v06.02r** — Moved SSO token re-acquisition from `gas-auth-ok` handler (fires after app visible) to the reconnect path (fires during "Reconnecting..." overlay) so it runs in parallel with GAS session verification
- **v06.03r** — Fixed GIS async loading timing — GIS wasn't available when the reconnect IIFE ran. Added polling (200ms × 25 = 5s max) to wait for `google.accounts.oauth2` before calling `requestAccessToken()`

### Key decisions made
- **SSO re-auth uses GIS popup** — `requestAccessToken()` always opens a Google popup (even with `prompt: ''`). The developer accepts this tradeoff for continued SSO auto-auth after portal refresh. There is no truly popup-free path with GIS Token Client
- **SSO_PROVIDER flag** — only the application portal proactively re-acquires the Google token on reconnect. Child apps (testauth1, globalacl) don't need it — they receive tokens from the portal via BroadcastChannel
- **Each app has independent GAS sessions** — a portal session token can't be shared with child apps. SSO requires the Google OAuth token (the "universal credential") so each app can create its own session with its own GAS backend
- **Reconnecting subtitle reverted** — "Verifying your session and preparing sign-in for linked apps" was set but should be reverted now that the re-auth happens during reconnect (popup appears alongside the overlay, not after)

### Where we left off
- SSO auto-auth after portal refresh works: portal reconnects → GIS popup re-acquires token → child apps can auto-authenticate
- The developer is okay with the GIS popup appearing during reconnect
- The "Verifying your session and preparing sign-in for linked apps" subtitle is still deployed — consider reverting to just "Verifying your session" if the popup makes it redundant
- All auth pages have `SSO_PROVIDER` config flag (true only on applicationportal)

### Active context
- Branch: `claude/remove-portal-environment-tJSw6`
- Repo version: v06.03r
- applicationportal.html: v01.15w, applicationportal.gs: v01.06g
- testauth1.html: v02.70w, testauth1.gs: v01.18g
- globalacl.html: v01.16w
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-22 01:51:49 AM EST
**Repo version:** v05.95r

### What was done
Continued HIPAA SSO refinement and portal UI across 4 pushes (v05.92r–v05.95r):

- **v05.92r** — Added dark gradient theme to applicationportal.html, matching the portal dashboard aesthetic. Added SSO category section headers with emoji indicators for auth-enabled vs public apps
- **v05.93r** — Fixed applicationportal category headers — replaced escaped unicode `\uD83D\uDD10` with actual emoji characters (🔐 and 🌐). Fixed section header styling (dark background, proper spacing)
- **v05.94r** — Added SSO source page name display during sign-in. When SSO token arrives via BroadcastChannel, the "Setting up your session" subtitle now shows "Signing in via [source page name]" (e.g. "Signing in via Application Portal"). Added `sourceDisplayName` and `sourcePage` fields to SSO token messages in both applicationportal.html and testauth1.html
- **v05.95r** — Fixed SSO subtitle ordering bug. The subtitle was being set BEFORE `exchangeToken()`, but `exchangeToken()` calls `showSigningIn()` which resets it to "Setting up your session". Moved subtitle update to AFTER `exchangeToken()` so "Signing in via Application Portal" is visible during SSO authentication

### Where we left off
- SSO sign-in subtitle now correctly shows "Signing in via [source]" during SSO authentication
- All auth-enabled pages (applicationportal, testauth1) support SSO token exchange with source attribution

Developed by: ShadowAISolutions
