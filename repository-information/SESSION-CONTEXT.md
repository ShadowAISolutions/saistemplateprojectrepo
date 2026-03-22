# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-22 01:51:49 AM EST
**Repo version:** v05.95r

### What was done
Continued HIPAA SSO refinement and portal UI across 4 pushes (v05.92r–v05.95r):

- **v05.92r** — Added dark gradient theme to applicationportal.html, matching the portal dashboard aesthetic. Added SSO category section headers with emoji indicators for auth-enabled vs public apps
- **v05.93r** — Fixed applicationportal category headers — replaced escaped unicode `\uD83D\uDD10` with actual emoji characters (🔐 and 🌐). Fixed section header styling (dark background, proper spacing)
- **v05.94r** — Added SSO source page name display during sign-in. When SSO token arrives via BroadcastChannel, the "Setting up your session" subtitle now shows "Signing in via [source page name]" (e.g. "Signing in via Application Portal"). Added `sourceDisplayName` and `sourcePage` fields to SSO token messages in both applicationportal.html and testauth1.html
- **v05.95r** — Fixed SSO subtitle ordering bug. The subtitle was being set BEFORE `exchangeToken()`, but `exchangeToken()` calls `showSigningIn()` which resets it to "Setting up your session". Moved subtitle update to AFTER `exchangeToken()` so "Signing in via Application Portal" is visible during SSO authentication

### Key decisions made
- **applicationportal replaces portal** — the user wants to use applicationportal exclusively, not portal. Portal's deployment ID is reused by applicationportal
- **applicationportal.gs uses hipaa preset** (`ACTIVE_PRESET = 'hipaa'`) with `TOKEN_EXCHANGE_METHOD: 'postMessage'`
- **User manually deploys GAS code** — applicationportal.gs is maintained in the repo, user copies it to the Apps Script editor and deploys
- **SSO subtitle shows source page** — when signing in via another tab's SSO token, the user sees which page provided the token

### Where we left off
- SSO sign-in subtitle now correctly shows "Signing in via [source]" during SSO authentication
- All auth-enabled pages (applicationportal, testauth1) support SSO token exchange with source attribution
- The `[AUTH DEBUG]` console logs are still in applicationportal.html — remove them once auth is confirmed stable
- ACL spreadsheet needs an "applicationportal" column (if not already present) for per-page access control

### Active context
- Branch: `claude/hipaa-sso-phase-2-5IBMk`
- Repo version: v05.95r
- applicationportal.html: v01.09w, applicationportal.gs: v01.05g
- testauth1.html: v02.65w, testauth1.gs: v01.18g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-21 11:50:35 PM EST
**Repo version:** v05.91r

### What was done
HIPAA SSO implementation and applicationportal standalone setup across 5 pushes (v05.87r–v05.91r):

- **v05.87r** — Decoupled applicationportal from portal's GAS deployment
- **v05.88r** — Set applicationportal to use portal's deployment ID
- **v05.89r** — Added `[AUTH DEBUG]` console logging to applicationportal.html
- **v05.90r** — Fixed `ReferenceError: pageNonce is not defined` in applicationportal.gs
- **v05.91r** — Added full portal dashboard UI to applicationportal.gs

### Where we left off
- Applicationportal fully functional with portal dashboard UI
- User needs to deploy updated applicationportal.gs to Apps Script

Developed by: ShadowAISolutions
