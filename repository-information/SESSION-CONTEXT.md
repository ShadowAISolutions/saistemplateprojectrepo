# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-27 08:43:12 PM EST
**Repo version:** v07.18r

### What was done
- **v07.12r** — Fixed testauth1 spreadsheet writes (add-row + write-cell) — `gasApp.contentWindow.postMessage()` was sending to the outer GAS shell frame, not the inner sandbox. Added `_gasSandboxSource` captured from `event.source` on `gas-auth-ok` to target the correct frame
- **v07.13r** — Added GSI font domains (`fonts.gstatic.com`, `www.slant.co`) to CSP `font-src` on all auth pages + auth template — these are fonts loaded by the Google Sign-In library for its button rendering
- **v07.14r** — Replaced iframe-based data poll with `fetch()` via `doPost(action=getData)` — eliminated "A listener indicated an asynchronous response" console errors caused by iframe navigation destroying GAS sandbox every 15s
- **v07.15r–v07.16r** — Added `script.google.com` and `script.googleusercontent.com` to CSP `connect-src` — required by the new fetch-based data poll (GAS redirects between the two domains)
- **v07.17r** — Converted heartbeat from iframe navigation to `fetch()` via `doPost(action=heartbeat)` — same pattern as data poll, eliminated the last source of recurring iframe churn errors
- **v07.18r** — Added `_fetchPausedForGIS` guard to pause data poll + heartbeat fetch while GIS sign-in popup is open — prevents COOP conflict during re-authentication with active session
- **Research** — Deep investigation + online research into COOP errors during fresh GIS sign-in. Confirmed across 15+ sources (Next.js, Firebase, React-OAuth, Auth0, Google docs, MDN) that these are a known Google infrastructure issue — `cross-origin-opener-policy-report-only: same-origin` on `accounts.google.com` + GIS library polling `window.closed` on its popup. Not fixable from our code
- **Knowledge documented** — Added Constraints G, H, I to `KNOWN-CONSTRAINTS-AND-FIXES.md` covering: GIS COOP errors (not fixable), GAS double-iframe architecture (use `_gasSandboxSource`), and data poll/heartbeat must use `fetch()` (not iframe navigation)

### Where we left off
- All changes committed and pushed (v07.18r) — workflow will auto-merge to main
- Spreadsheet writes confirmed working by developer
- Console errors significantly reduced — only Google's own COOP report-only warnings remain during sign-in (non-blocking, cosmetic)
- All three new constraints (G, H, I) documented in KNOWN-CONSTRAINTS-AND-FIXES.md

### Key decisions made
- **GIS font domains ARE allowed in CSP** — reversed the "no external dependencies" decision for fonts specifically because these are required by the Google Sign-In library (a required dependency), not optional fonts we chose
- **Data poll + heartbeat use `fetch()` via `doPost`** — architectural shift from iframe navigation to direct HTTP calls. GAS `ContentService` responses include CORS headers on ANYONE_ANONYMOUS deployments
- **`_gasSandboxSource` pattern** — the correct way to send postMessages to the GAS app's inner sandbox frame. Captured from `event.source` on `gas-auth-ok`, reset on `clearSession()` and iframe reload
- **GIS COOP errors are not fixable** — confirmed via thorough online research. `initTokenClient` only supports popup mode (no redirect). COOP cannot be set via meta tags. FedCM doesn't apply to `initTokenClient`. Every framework community says ignore them
- **`_fetchPausedForGIS` guard** — pauses fetch-based polling while GIS popup is open. Set before all 5 `requestAccessToken()` calls, cleared in all callbacks

### Active context
- Branch: `claude/fix-testauth1-spreadsheet-48V82`
- Repo version: v07.18r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-27 07:03:38 PM EST
**Repo version:** v07.11r

### What was done
- **v07.04r–v07.11r** — Adjusted testauth1 live data table layout, added addRow feature, fixed JSON serialization for google.script.run, added/removed font-src CSP entries

### Where we left off
- All changes committed and pushed (v07.11r)

Developed by: ShadowAISolutions
