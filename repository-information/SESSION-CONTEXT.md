# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-21 02:26:02 PM EST
**Repo version:** v05.64r

### What was done
GAS auth security improvements across 6 pushes (v05.59r–v05.64r), focused on preventing direct access to `exec?session=TOKEN` URLs:

- **v05.59r** — Added iframe guard to GAS to prevent direct `/exec?session=` URL access from rendering the authenticated app
- **v05.60r** — Fixed iframe guard: `window.self === window.top` never fires in GAS sandbox (GAS always runs inside Google's own iframe); changed to `window.parent === window.top` which correctly detects direct navigation vs legitimate embedding
- **v05.61r** — Fixed sign-out race condition: `showAuthWall()` was destroying the GAS iframe before `processSignOut()` could complete server-side session invalidation; restructured to defer DOM clearing until `gas-signed-out` confirmation; added "Signing out..." visual overlay
- **v05.62r** — Attempted postMessage handshake for GAS iframe auth — goal was to keep session tokens out of URLs entirely. Added `generatePageNonce()` and `validatePageNonce()` server functions
- **v05.63r** — Fix handshake nonce redirect — discovered GAS sandbox can't navigate itself to `/exec` (different origin); changed to postMessage-to-parent approach
- **v05.64r** — **Reverted entire handshake flow** — GAS sandbox cross-origin constraints prevent reliable multi-step nonce exchange; restored `?session=` URL parameter for iframe loading; kept iframe guard (`window.parent === window.top`) as the primary defense against direct `/exec` access

### Key learnings about GAS sandbox
- GAS sandbox runs on `googleusercontent.com` — always nested inside Google's own iframe, so `window.self === window.top` is **ALWAYS false** (dead code)
- Correct guard for detecting direct navigation: `window.parent === window.top` — when directly navigated, Google's wrapper IS the top; when embedded in our page, Google's wrapper is NOT the top
- GAS sandbox **cannot navigate itself** to `/exec` (different origin from `googleusercontent.com` to `script.google.com`) — any approach that requires the GAS HTML to redirect itself to the exec URL will fail
- The postMessage handshake approach was fundamentally blocked by GAS cross-origin sandbox restrictions — three attempts failed before reverting

### Where we left off
- **OUTSTANDING BUG — PICK UP NEXT SESSION**: The GAS script URL still thinks there is authorization until logout clears it. After the handshake revert, the `?session=` URL parameter flow is restored and sign-in works, but the script appears authenticated when it shouldn't be. Logging out clears it, suggesting stale session state in CacheService or the `?session=` URL parameter persisting across navigations. This was the original issue that prompted this session's security work and remains unresolved
- The iframe guard (`window.parent === window.top`) is in place and working — direct navigation to bare `/exec` is blocked
- The `generatePageNonce()` and `validatePageNonce()` functions were kept in the GAS code (not removed during revert) — they may be useful for a future approach
- CHANGELOG at 98/100 sections — approaching archive rotation threshold

### Key decisions made
- **Reverted handshake, kept iframe guard** — the handshake was too ambitious given GAS sandbox constraints; the iframe guard provides meaningful protection against casual direct URL access
- **`window.parent === window.top`** — the correct cross-origin check for GAS sandbox nesting
- **Sign-out race condition fix** — server must confirm session invalidation before DOM is cleared; "Signing out..." overlay provides visual feedback during the round-trip

### Active context
- Branch: `claude/fix-gas-auth-issue-lsTca`
- Repo version: v05.64r
- CHANGELOG at 98/100 sections (2 away from archive rotation)
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-20 11:31:06 PM EST
**Repo version:** v05.58r

### What was done
Major security, UX, and infrastructure improvements across 10 pushes (v05.49r–v05.58r):

- **v05.49r–v05.50r** — Portal access control and app sorting improvements
- **v05.51r** — Sort portal auth apps by access — accessible apps first, inaccessible second
- **v05.52r** — Swap portal toggle labels — My Apps left, Show All right
- **v05.53r** — Fix global sessions panel staying open after sign-out
- **v05.54r** — **Comprehensive auth wall UI deactivation** — when auth is enabled but user isn't signed in, all interactive elements (buttons, inputs, panels, toggles) are now disabled/hidden behind the auth wall across all projects and templates
- **v05.55r** — **Migrate cross-project admin secret from spreadsheet to Script Properties** — `CROSS_PROJECT_ADMIN_SECRET` moved from the ACL spreadsheet's `#SECRET` metadata row to GAS Script Properties. GlobalACL auto-distributes it to registered projects via `distributeAdminSecret()`. All projects read from Script Properties instead of spreadsheet
- **v05.56r** — **Auto-initialize HMAC_SECRET and CACHE_EPOCH in Script Properties** — `ensureScriptProperties_()` runs at end of `pullAndDeployFromGitHub()`, auto-generating both values on first deploy. Eliminates manual Script Properties setup entirely
- **v05.57r** — Simplified gas-project-creator Script Properties section — only GITHUB_TOKEN needs manual entry now. HMAC_SECRET generation UI removed. Auto-generation note added for CACHE_EPOCH/HMAC_SECRET
- **v05.58r** — Added CROSS_PROJECT_ADMIN_SECRET to the auto-generation note in gas-project-creator

### Where we left off
- All changes committed and pushed through v05.58r
- GAS project setup is now nearly zero-config: only `GITHUB_TOKEN` needs manual entry; `CACHE_EPOCH`, `HMAC_SECRET`, and `CROSS_PROJECT_ADMIN_SECRET` are all auto-managed

Developed by: ShadowAISolutions
