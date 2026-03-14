# Known Constraints & Fixes

Two categories of hard-won knowledge:
- **Constraints** — architectural rules that **must not be changed**. Every constraint has broken production when violated.
- **Fixes** — bugs that were found, diagnosed, and resolved. Documents what went wrong, why, and what fixed it — so future sessions don't re-introduce the same problems.

> **For Claude Code sessions:** Before proposing security fixes, refactoring, or "improvements" to any code covered here, **read this file first**. If your proposed change conflicts with a constraint, the change is wrong — not the constraint. If your proposed change touches code that was fixed below, understand the fix before modifying it.

---

## Constraint A — postMessage `'*'` targetOrigin (HTML → GAS)

**Rule:** When the HTML page sends a `postMessage` to the GAS iframe (e.g. `exchange-token`), the `targetOrigin` parameter **must be `'*'`**. Do NOT replace it with `GAS_ORIGIN`, `'https://script.google.com'`, or any specific origin.

**Why:** Google Apps Script uses a double-iframe sandbox architecture:
1. The `<iframe>` element's `src` points to `script.google.com/macros/s/.../exec`
2. That URL serves a shell page that creates an **inner** iframe at a `*.googleusercontent.com` subdomain
3. The actual GAS-served HTML (your listener code) runs inside the inner sandbox frame

The sandbox origin (`*.googleusercontent.com`) is dynamically generated and unpredictable. Setting `targetOrigin` to `'https://script.google.com'` causes the browser to silently drop the message because the recipient's actual origin is `googleusercontent.com`, not `script.google.com`.

**Exposure is limited:** The `_pendingToken` is nulled immediately after sending (single-use), and `<meta name="referrer" content="no-referrer">` prevents token leakage via HTTP headers.

**Times this was accidentally changed:** 3+ (each time it broke sign-in silently with no error messages)

**Affected code:**
- `testauth1.html` — `exchange-token` postMessage in the `gas-ready-for-token` handler

---

## Constraint B — `event.source` for HTML → GAS sandbox replies

**Rule:** When replying to a message from the GAS sandbox (e.g. replying to `gas-ready-for-token` with `exchange-token`), use `event.source.postMessage(...)` — **not** `gasApp.contentWindow.postMessage(...)`.

**Why:** Due to the double-iframe architecture (Constraint A), `gasApp.contentWindow` references the **outer** `script.google.com` shell frame — not the **inner** sandbox frame where the listener runs. Messages sent to `gasApp.contentWindow` are dispatched on the shell's window and never reach the sandbox's `window.addEventListener('message', ...)`.

`event.source` is the `WindowProxy` of the frame that sent the original message. When the sandbox sends `gas-ready-for-token`, `event.source` points directly to the sandbox frame. Replying via `event.source` delivers the message to the correct listener.

**Affected code:**
- `testauth1.html` — `gas-ready-for-token` handler must use `event.source` to send `exchange-token`

---

## Constraint C — GAS deploy webhook must stay unauthenticated

**Rule:** The `doPost(e)` handler's `action === 'deploy'` path must **not** require session authentication. It is called by the GitHub Actions workflow (via `curl`) to trigger GAS self-update after a push to `main`.

**Why:** The workflow runs in CI — it has a `GITHUB_TOKEN` but no GAS session token. Adding session requirements to the deploy path breaks the auto-deploy pipeline.

**Affected code:**
- `testauth1.gs` — `doPost(e)` deploy handler

---

## Constraint D — Google Sign-In flow cannot be short-circuited

**Rule:** The complete sign-in chain must execute in order: Google OAuth popup → token callback → token exchange (URL or postMessage) → GAS session creation → `gas-session-created` message → HTML saves session + loads app. No step can be skipped or reordered.

**Why:** Each step depends on the output of the previous step. The Google access token is single-use for session creation. The GAS session token is generated server-side and must be delivered back to the HTML page before the app iframe can load authenticated content.

**Affected code:**
- `testauth1.html` — `initGoogleSignIn()` → `handleTokenResponse()` → `exchangeToken()` → message listener
- `testauth1.gs` — `doGet(e)` token exchange paths → `exchangeTokenForSession()`

---

## Constraint E — GAS → HTML messages use `PARENT_ORIGIN` (not `'*'`)

**Rule:** When GAS sends messages to the HTML page (via `window.top.postMessage`), it **must** use `PARENT_ORIGIN` (the GitHub Pages origin) as the `targetOrigin`. This direction is secure because `window.top` is always the known HTML page.

**Why:** Unlike Constraint A (HTML → GAS), the GAS → HTML direction has a known, stable target origin. Using `'*'` here would unnecessarily expose messages to any parent frame. `PARENT_ORIGIN` is derived from `EMBED_PAGE_URL` and is a fixed, predictable value.

**Note:** This is the **opposite** of Constraint A. The asymmetry exists because GAS knows where the HTML page lives (GitHub Pages — stable origin), but the HTML page cannot know where the GAS sandbox lives (googleusercontent.com — dynamic origin).

**Affected code:**
- `testauth1.gs` — all `window.top.postMessage(...)` calls in generated HTML

---

---

# Resolved Fixes

Bugs that were diagnosed and fixed during development. Each entry documents the symptom, root cause, and fix — preventing future sessions from unknowingly re-introducing the same issue.

---

## Fix 1 — postMessage exchange not reaching GAS sandbox (sign-in stuck)

**Version:** v01.50w (testauth1.html) · v03.18r

**Symptom:** After switching to the `hipaa` auth preset (which uses `TOKEN_EXCHANGE_METHOD: 'postMessage'`), sign-in got stuck on the "Sign In Required" page. Google OAuth completed successfully but the token exchange never happened — no errors in console.

**Root cause:** The `exchange-token` postMessage was being sent via `gasApp.contentWindow.postMessage(...)`. Due to the GAS double-iframe architecture (see Constraint A), `gasApp.contentWindow` is the **outer** `script.google.com` shell frame — the actual listener runs in the **inner** `googleusercontent.com` sandbox frame. The message was dispatched on the wrong window.

**Fix:** Changed to `event.source.postMessage(...)` in the `gas-ready-for-token` handler. `event.source` is the `WindowProxy` of the frame that sent the message, so it targets the sandbox directly. This also became **Constraint B**.

**Affected code:**
- `testauth1.html` — `gas-ready-for-token` handler

---

## Fix 2 — HMAC verification rejecting all sessions (blank page after sign-in)

**Version:** v01.23g (testauth1.gs) · v03.19r

**Symptom:** After Fix 1 resolved the sign-in flow, the page was no longer stuck on the login screen — but the GAS app content was blank. No elements displayed after successful sign-in.

**Root cause:** The `hipaa` preset enables `ENABLE_HMAC_INTEGRITY: true`, which signs sessions with an HMAC. However, the `HMAC_SECRET` GAS script property was never configured (it requires manual setup in GAS project settings). When the secret is missing:
1. `generateSessionHmac()` returns `''` (empty string)
2. The session is stored with `hmac: ''`
3. `verifySessionHmac()` checks `if (!sessionData.hmac) return false` — since `!''` is truthy, **ALL sessions are rejected**

The asymmetry between generation (returns empty = "no HMAC") and verification (rejects empty = "HMAC failed") caused every authenticated session to be treated as invalid.

**Fix:** Added a secret-existence check to `verifySessionHmac()`: if the `HMAC_SECRET` property doesn't exist in script properties, return `true` (pass through). This makes verification match generation — both treat missing secret as "HMAC not available" rather than "HMAC failed."

**Affected code:**
- `testauth1.gs` — `verifySessionHmac()` function

---

## Fix 3 — Re-sign-in after sign-out stuck (stale HMAC message key)

**Version:** v01.51w (testauth1.html) · v03.20r

**Symptom:** Fresh sign-in worked correctly. But after signing out and attempting to sign in again (without refreshing the page), the sign-in got stuck on the "Sign In Required" page — identical to Fix 1's symptom. A full page refresh fixed it.

**Root cause:** When `ENABLE_HMAC_INTEGRITY` is active, the `gas-session-created` message delivers a per-session `_messageKey` used to verify subsequent GAS→HTML messages. The HMAC verification layer checks:
```javascript
if (_messageKey && data.type !== 'gas-session-created' && data.type !== 'gas-needs-auth') {
    if (!_verifyMessageSignature(data, _messageKey)) return; // Silently drop
}
```
On sign-out, `clearSession()` removed the session data from storage but **did not clear `_messageKey`**. When the user signed in again, the GAS iframe reloaded and sent a fresh `gas-ready-for-token` message — but this message is **unsigned** (it's a bootstrap message from a new session). With `_messageKey` still set from the old session, the HMAC layer silently dropped it.

**Fix:** Added `_messageKey = null;` to `clearSession()`. This ensures the HMAC verification layer is reset between sessions, allowing unsigned bootstrap messages from new sign-in attempts to pass through.

**Affected code:**
- `testauth1.html` — `clearSession()` function

---

## Constraint F — Cross-tab sign-out requires two mechanisms

**Rule:** Cross-tab sign-out uses **two** different mechanisms, matched to their storage type. Do NOT consolidate them into one — each is the correct tool for its context.

**Why:** The two auth presets use different browser storage:
- **Standard preset** (`localStorage`): the browser's `storage` event fires automatically in other same-origin tabs when `localStorage` is modified. Sign-out clears the session key, which triggers the event for free — no explicit signaling needed. This is the most elegant approach because cross-tab sync is a natural byproduct of the storage mechanism itself.
- **Hipaa preset** (`sessionStorage`): `sessionStorage` is per-tab by design — changes **never** fire cross-tab `storage` events. However, duplicating a tab (Ctrl+Shift+D) clones its `sessionStorage` (per HTML spec), so a duplicated tab inherits the authenticated session. Without explicit signaling, signing out in one tab leaves duplicated tabs still authenticated. `BroadcastChannel` solves this — sign-out broadcasts a message, and all same-origin tabs receive it and clear their own sessions.

**Why not use `BroadcastChannel` for both?** For `localStorage`, the `storage` event is free and automatic — adding `BroadcastChannel` would be redundant signaling code on top of something that already works. For `sessionStorage`, `BroadcastChannel` is necessary because no free mechanism exists. Each approach is optimal for its storage type.

**Affected code:**
- `testauth1.html` — `storage` event listener (Mechanism 1, standard preset)
- `testauth1.html` — `BroadcastChannel` `auth-sign-out` (Mechanism 2, hipaa preset)
- `testauth1.html` — `performSignOut()` broadcasts via `_signOutChannel` when active

---

---

# Future Architecture

Design decisions and architectural plans that have been discussed and agreed upon but not yet implemented. These serve as reference when the time comes to build the feature.

---

## Architecture 1 — Portal/SSO: Cross-page authentication via central auth GAS

**Status:** Planned (not yet implemented)

**Goal:** A main login page (portal) authenticates the user once. Other pages with their own GAS backends accept the portal's session without requiring the user to sign in again.

**The problem:** Each page (`testauth1.html`, `dashboard.html`, etc.) has its own GAS deployment with its own session store. A Google OAuth token exchanged on the portal's GAS backend creates a session only the portal recognizes — other GAS backends have no way to validate it.

**The solution — central `auth.gs`:**

```
User → portal.html → Google Sign-In → auth.gs (creates master session)
                                           ↓
         portal.html stores master token in localStorage
                                           ↓
User clicks link → app-page.html reads master token from localStorage
                                           ↓
         app-page.html sends master token to app-page.gs
                                           ↓
         app-page.gs calls auth.gs via UrlFetchApp to validate master token
                                           ↓
         app-page.gs creates local session (user is in — no sign-in prompt)
```

**Key components:**

1. **`auth.gs`** — a dedicated GAS deployment that handles only authentication. Exchanges Google OAuth tokens for master sessions, stores them, and exposes a validation endpoint. All other GAS backends delegate auth to this service rather than managing their own.

2. **`portal.html`** — the login page. Authenticates via `auth.gs`, stores the master session token in `localStorage` (accessible to all same-origin pages on GitHub Pages).

3. **App pages** (`testauth1.html`, `dashboard.html`, etc.) — on load, read the master token from `localStorage`. If present, send it to their own GAS backend for validation against `auth.gs`. If valid, skip the sign-in wall entirely.

4. **Cross-GAS validation** — GAS scripts can call other GAS deployments server-to-server via `UrlFetchApp.fetch()`. This means `testauth1.gs` can hit `auth.gs`'s web app URL to validate a token — no browser involvement, no CORS issues.

**How it works with each preset:**

- **Standard (`localStorage`):** The master token sits in `localStorage`, readable by all pages on the same GitHub Pages origin. Each page reads it on load and validates with its GAS backend. Cross-tab sync via the `storage` event means signing in on the portal auto-authenticates other open pages.

- **Hipaa (`sessionStorage`):** `sessionStorage` doesn't share across pages, so the master token is passed via URL parameter when navigating from the portal. Link format: `testauth1.html?masterToken=TOKEN`. The receiving page reads the parameter, validates with its GAS backend, creates its own per-tab session, and strips the token from the URL (via `history.replaceState`). The token exposure in the URL is brief, same-origin, and not logged by the server (GitHub Pages is static).

**What needs to be built:**
1. `auth.gs` — new GAS project with `createMasterSession()`, `validateMasterToken()`, and `revokeMasterSession()` endpoints
2. Portal page — login UI + master token storage logic
3. Token-reading logic on each app page — check `localStorage` (or URL param for hipaa) before showing auth wall
4. Modify each app page's `.gs` to call `auth.gs` for validation instead of managing auth independently
5. Master session sign-out propagation — signing out of the portal revokes the master session and broadcasts sign-out to all tabs (via `BroadcastChannel` and/or `storage` event, depending on preset)

**Design decisions to make when implementing:**
- Master session expiration policy — should it match the individual page session timers, or have its own longer/shorter duration?
- Should app pages create their own local sessions (double session — master + local), or validate the master token on every GAS request (single session — master only)?
- Should the portal page itself host a GAS app, or be a pure authentication gateway?

---

## Adding New Entries

**Constraints:** When a debugging session reveals an architectural limitation:
1. Add a new constraint section with: Rule, Why, Times violated (if known), Affected code
2. Reference this file in code comments near the constrained code
3. The constraint letter (A, B, C, ...) is permanent — do not renumber

**Fixes:** When a bug is diagnosed and resolved:
1. Add a new fix section with: Version, Symptom, Root cause, Fix, Affected code
2. The fix number (1, 2, 3, ...) is permanent — do not renumber

**Future Architecture:** When a design is discussed and agreed upon but not yet built:
1. Add an architecture section with: Status, Goal, Problem, Solution, What needs to be built, Design decisions
2. Update the Status field as work progresses (`Planned` → `In Progress` → `Implemented`)
3. The architecture number (1, 2, 3, ...) is permanent — do not renumber

Developed by: ShadowAISolutions
