# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-21 06:36:52 PM EST
**Repo version:** v05.78r

### What was done
Template infrastructure fixes across 4 pushes (v05.75r–v05.78r):

- **v05.75r** — Standardized GAS version file format to pipe-delimited (`|v01.90g|`) matching HTML version file format. Updated all `gs.version.txt` files and the GAS version pill parsing logic to handle the new format
- **v05.76r** — Extended pipe-delimited format standardization: updated GAS version polling comparison logic to use raw pipe-delimited strings for comparison (not stripped), and updated the GAS version pill initial load to parse pipes correctly
- **v05.77r** — Fixed pipe characters leaking into GAS changelog popup title — `GAS Changelog — |v01.90g|` was displaying with visible pipes. Added `.replace(/\|/g, '')` to strip pipes before display in all 7 pages and 2 templates
- **v05.78r** — Removed testauth2 environment entirely: deleted `testauth2.html`, its HTML version file, changelog, and changelog archive. Removed entry from README tree

### Key learnings (new this session)
- **GAS version format now uses pipes** — `gs.version.txt` files use `|v01.90g|` format (matching `html.version.txt`). The polling comparison uses the raw pipe-delimited string; display contexts must strip pipes with `.replace(/\|/g, '')`
- **Two display contexts for GAS version**: (1) the version pill label — already parsed pipes via `gParts.split('|')`, (2) the changelog popup title — was using `currentGasVersion` raw, now strips pipes
- **testauth2 had no GAS project of its own** — it shared testauth1's GAS backend. Only 4 files needed deletion (HTML page, version file, changelog, changelog archive)

### Where we left off
- All GAS version display is clean — no pipe leakage in pills or changelog titles
- testauth2 environment fully removed
- 6 pages remain: index, testenvironment, testauth1, portal, globalacl, gas-project-creator
- CHANGELOG at 85/100 sections (approaching rotation threshold)

### Key decisions made
- **Pipe-delimited format for GAS versions** — matches HTML version file format for consistency. The polling logic uses raw strings for comparison; display logic strips pipes
- **testauth2 removed** — was a duplicate of testauth1 sharing the same GAS backend

### Active context
- Branch: `claude/apply-testauth1-fixes-hRemp`
- Repo version: v05.78r
- CHANGELOG at 85/100 sections
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-21 05:24:53 PM EST
**Repo version:** v05.74r

### What was done
Continued GAS auth security work across 6 pushes (v05.69r–v05.74r), resolving the direct URL access vulnerability and multiple cascading issues:

- **v05.69r** — **Root cause of sign-in stuck**: CacheService is eventually consistent — `cache.put()` then `cache.get()` can return `null`. Reverted sign-in to use `?session=TOKEN` directly (nonces unreliable for this path). Kept nonces for refresh/reclaim
- **v05.70r** — **Fixed direct URL access vulnerability**: Replaced broken iframe guard (`window.parent === window.top` — never fires due to GAS multi-iframe nesting) with postMessage handshake guard. GAS sends challenge to `window.top` with `PARENT_ORIGIN`; only the correct embedding page responds. Direct access shows "Access denied" after 2s timeout
- **v05.71r** — Created `AUTH-DIRECT-ACCESS-FIX.md` — comprehensive troubleshooting write-up covering all 12+ attempts across sessions
- **v05.72r** — Made handshake guard conditional — only runs on `?session=` path, skipped on `?page_nonce=` path (nonces are one-time-use, already replay-protected)
- **v05.73r** — Restored immediate unsigned `gas-auth-ok` before async `google.script.run.signAppMessage()` — the async-only path was too slow for refresh/reconnect
- **v05.74r** — **Two fixes**: (1) Replaced `loadIframeViaNonce()` with direct `?session=` for page refresh and "Use Here" — nonce flow unreliable due to CacheService. (2) Added `gas-auth-ok` to `_SIG_EXEMPT` list — unsigned immediate send was being rejected by HMAC verification after key import from `gas-session-created`

### Where we left off
- All auth flows working: sign-in, page refresh, "Use Here", sign-out
- Direct URL access properly blocked by postMessage handshake guard

Developed by: ShadowAISolutions
