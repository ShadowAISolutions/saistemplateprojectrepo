# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

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

### Key learnings (new this session)
- **GAS `doGet(e)` cannot access HTTP headers** — no Referer, Origin, or User-Agent. Google explicitly closed the feature request (Issue #67764685). Server-side origin detection is impossible
- **`window.parent === window.top` is permanently broken** — GAS's multi-iframe nesting means this is ALWAYS false, regardless of embedded vs direct access
- **postMessage handshake DOES work** — `window.top.postMessage(msg, PARENT_ORIGIN)` reaches the embedding page; `event.source.postMessage(response, '*')` reaches back. When opened directly, the challenge is silently dropped (origin mismatch)
- **`gas-auth-ok` needs to be sig-exempt** — the immediate unsigned send fires before the signed version from `google.script.run`, and by then `_hmacKey` may already be imported from `gas-session-created`
- **CacheService eventual consistency affects ALL nonce paths** — not just sign-in. Page refresh and "Use Here" also hit this issue. Direct `?session=` with handshake guard is the reliable approach
- **GAS is HIPAA-covered** under Google's BAA as of September 2025 (paid Workspace only)
- **Session tokens in URLs**: not explicitly prohibited by HIPAA but strongly discouraged by OWASP/NIST. Compensating controls: short-lived tokens, rolling + absolute timeouts, audit logging, handshake guard

### Where we left off
- All auth flows working: sign-in, page refresh, "Use Here", sign-out
- Direct URL access properly blocked by postMessage handshake guard
- No `invalid_signature` security events on login
- Portal.gs also has the handshake guard (added in v05.70r) but portal.html still uses `?session=` for all paths (no nonce infrastructure — works correctly since handshake protects it)
- `loadIframeViaNonce()` function still exists in testauth1.html but is no longer used on page refresh or "Use Here" paths — only cross-tab sync still uses it (line 1984, 2197)

### Key decisions made
- **`?session=` + handshake guard > nonces** — CacheService eventual consistency makes nonces unreliable. The handshake guard provides equivalent protection against direct URL access
- **Immediate unsigned `gas-auth-ok` + signed follow-up** — belt-and-suspenders. The immediate one is sig-exempt; the signed one follows asynchronously
- **`_loadedViaNonce` flag** — server-side template evaluation determines whether handshake runs. Nonce-loaded pages skip it (already replay-protected)

### Active context
- Branch: `claude/fix-script-auto-auth-uSwF1`
- Repo version: v05.74r
- CHANGELOG at 81/100 sections
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-21 02:26:02 PM EST
**Repo version:** v05.64r

### What was done
GAS auth security improvements across 6 pushes (v05.59r–v05.64r), focused on preventing direct access to `exec?session=TOKEN` URLs:

- **v05.59r** — Added iframe guard to GAS to prevent direct `/exec?session=` URL access from rendering the authenticated app
- **v05.60r** — Fixed iframe guard: `window.self === window.top` never fires in GAS sandbox; changed to `window.parent === window.top`
- **v05.61r** — Fixed sign-out race condition: `showAuthWall()` was destroying the GAS iframe before server-side session invalidation
- **v05.62r** — Attempted postMessage handshake for GAS iframe auth — keep tokens out of URLs entirely
- **v05.63r** — Fix handshake nonce redirect — GAS sandbox can't navigate itself to `/exec`
- **v05.64r** — **Reverted entire handshake flow** — GAS sandbox cross-origin constraints prevent reliable multi-step nonce exchange

### Where we left off
- Outstanding bug resolved in current session (v05.69r–v05.74r)

Developed by: ShadowAISolutions
