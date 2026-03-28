# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-27 09:35:11 PM EST
**Repo version:** v07.21r

### What was done
- **v07.19r** — Attempted to convert token exchange, sign-out, and security event reporter from iframe-based to `fetch()` via `doPost` — intended to eliminate "A listener indicated an asynchronous response" console errors
- **v07.20r** — Attempted to fix DOM clearing by replacing `gasFrame.src = 'about:blank'` with iframe `replaceChild` — intended to avoid navigation-triggered errors
- **v07.21r** — **Reverted both v07.19r and v07.20r** — the fetch-based token exchange broke sign-in (GAS `doPost` redirect handling differs for operations calling external APIs), and the iframe replacement broke DOM clearing (sandbox attributes not preserved, caused "Blocked script execution" errors)
- **Research** — Investigated the "message channel closed" errors thoroughly. Confirmed they are from Google's internal GAS infrastructure code (MessageChannel between outer shell and inner sandbox). The `return true` that triggers the error is in Google's code, not ours — it happens when we navigate the GAS iframe and Google's internal async message handlers are destroyed mid-flight

### Where we left off
- All changes committed and pushed (v07.21r) — reverted to working state matching v07.18r code
- **Console errors are cosmetic and unfixable from our side** — they come from Google's GAS double-iframe architecture. The recurring errors (every 15s from data poll/heartbeat) were already fixed in v07.14r/v07.17r. What remains are one-time bursts during sign-in/sign-out iframe navigations
- Developer confirmed understanding that these are Google infrastructure noise, not functional issues
- The "dropping postMessage.. was from unexpected window" messages are from a Google first-party extension (Apps Script Editor / MAE) — they disappear in incognito mode

### Key decisions made
- **Don't convert token exchange to fetch()** — GAS `doPost` handles redirects differently for operations that call external APIs (like Google OAuth token validation). The heartbeat/getData `doPost` actions work because they only do CacheService lookups
- **Don't replace iframes with `replaceChild`** — sandbox/allow attributes from the HTML source aren't properly carried over to dynamically created iframes, breaking script execution
- **Accept the console errors** — they are cosmetic, from Google's code, and don't affect functionality. Attempting to fix them risks breaking working features (as demonstrated by the failed v07.19r/v07.20r attempts)

### Active context
- Branch: `claude/fix-testauth1-console-error-DjYzs`
- Repo version: v07.21r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-27 08:43:12 PM EST
**Repo version:** v07.18r

### What was done
- **v07.12r–v07.18r** — Fixed testauth1 spreadsheet writes, added GSI font CSP, replaced iframe-based data poll and heartbeat with `fetch()`, added `_fetchPausedForGIS` guard

### Where we left off
- All changes committed and pushed (v07.18r)

Developed by: ShadowAISolutions
