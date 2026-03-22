# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-21 11:50:35 PM EST
**Repo version:** v05.91r

### What was done
HIPAA SSO implementation and applicationportal standalone setup across 5 pushes (v05.87r–v05.91r):

- **v05.87r** — Decoupled applicationportal from portal's GAS deployment. Reset deployment ID to placeholder, restored `TOKEN_EXCHANGE_METHOD: 'postMessage'` to match hipaa GAS preset. Applicationportal is now a standalone project
- **v05.88r** — Set applicationportal to use portal's deployment ID (`AKfycbzKwEfBKj5mOy4aBtg-nWycCRO8R21s405WoJHR3dLBtPxc3SA4qfzNaQ6OGVlQE7Xm`). User replaced the GAS code in portal's Apps Script project with applicationportal.gs (hipaa preset). Updated `_e`, config.json, .gs, and workflow
- **v05.89r** — Added `[AUTH DEBUG]` console logging to applicationportal.html postMessage handler to trace auth flow (exchangeToken, exchangeViaPostMessage, all GAS message types)
- **v05.90r** — Fixed `ReferenceError: pageNonce is not defined` in applicationportal.gs `doGet()`. Added missing `pageNonce` extraction from `e.parameter.page_nonce` and `validatePageNonce()` function — both were present in testauth1.gs but missing from applicationportal.gs. This was the root cause of sign-in getting stuck on "Setting up your session..."
- **v05.91r** — Added full portal dashboard UI to applicationportal.gs. Replaced the debug "1" placeholder with portal's complete app cards grid, access filter toggle, open mode toggle, dark gradient theme, and `getUserAppAccess()` function for ACL-based visibility

### Key decisions made
- **applicationportal replaces portal** — the user wants to use applicationportal exclusively, not portal. Portal's deployment ID is reused by applicationportal
- **applicationportal.gs uses hipaa preset** (`ACTIVE_PRESET = 'hipaa'`) with `TOKEN_EXCHANGE_METHOD: 'postMessage'` — differs from portal.gs which used standard preset
- **User manually deploys GAS code** — applicationportal.gs is maintained in the repo, user copies it to the Apps Script editor and deploys (Deploy → Manage deployments → New version)
- **Debug logging added** — `[AUTH DEBUG]` console logs remain in applicationportal.html for troubleshooting. Can be removed once auth flow is confirmed stable

### Where we left off
- Applicationportal is fully functional with the portal dashboard UI
- User needs to copy updated applicationportal.gs (v01.05g) to their Apps Script project and deploy a new version to see the dashboard
- The `[AUTH DEBUG]` console logs are still in applicationportal.html — remove them once auth is confirmed working
- ACL spreadsheet needs an "applicationportal" column (if not already present) for per-page access control
- The PORTAL_APPS array in applicationportal.gs is hardcoded — to add/remove apps, edit that array

### Active context
- Branch: `claude/hipaa-sso-implementation-s5t0I`
- Repo version: v05.91r
- applicationportal.html: v01.05w, applicationportal.gs: v01.05g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-21 09:05:41 PM EST
**Repo version:** v05.82r

### What was done
Multi-tab project opener and HIPAA SSO planning across 4 pushes (v05.79r–v05.82r):

- **v05.79r** — Created `open-all.html` utility page
- **v05.80r** — Added multi-tab project opener link to portal page
- **v05.81r** — Created pre-SSO backup system
- **v05.82r** — Created comprehensive HIPAA-compliant SSO implementation plan

### Where we left off
- HIPAA SSO implementation plan complete and ready for execution
- Pre-SSO backups in place

Developed by: ShadowAISolutions
