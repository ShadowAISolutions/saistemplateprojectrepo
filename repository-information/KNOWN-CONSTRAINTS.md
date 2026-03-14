# Known Constraints

Architectural constraints that **must not be changed**. These have been verified through repeated testing and failed attempts. Every constraint below has broken production functionality when violated.

> **For Claude Code sessions:** Before proposing security fixes, refactoring, or "improvements" to any code covered by these constraints, **read this file first**. If your proposed change conflicts with a constraint listed here, the change is wrong — not the constraint.

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

## Adding New Constraints

When a debugging session reveals that a "fix" or "improvement" breaks functionality due to an architectural limitation:

1. Add a new constraint section here with: Rule, Why, Times violated (if known), Affected code
2. Reference this file in code comments near the constrained code
3. The constraint number (A, B, C, ...) is permanent — do not renumber

Developed by: ShadowAISolutions
