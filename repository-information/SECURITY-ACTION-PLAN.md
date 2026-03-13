# Security Action Plan — testauth1 Auth System

> **Created:** 2026-03-13 04:05 PM EST
> **Source:** Comprehensive security review of `testauth1.html` and `testauth1.gs`
> **Status:** Implemented (v02.79r) — all phases applied
> **Files in scope:**
> - `live-site-pages/testauth1.html` (1593 lines)
> - `googleAppsScripts/Testauth1/testauth1.gs` (873 lines)

---

## How to Use This File

This file contains the complete findings from a security review plus a prioritized action plan. A new Claude Code session can read this file and implement the fixes without needing the original review context. Each finding includes:
- The exact file and line numbers where the issue exists
- Code snippets showing the vulnerable pattern
- The recommended fix with implementation guidance
- Priority ordering for systematic remediation

---

## Priority 1 — CRITICAL Findings (Fix Immediately)

### C1. postMessage uses wildcard `"*"` origin on all messages

**Problem:** Every `postMessage` call from the GAS-generated HTML uses `"*"` as the target origin. Any parent window from any origin receives sensitive data including session tokens, email addresses, and auth status.

**Affected locations in `testauth1.gs`:**
- Line 661: `window.top.postMessage({type:"gas-heartbeat-expired"}, "*")`
- Line 725: `window.top.postMessage({type:"gas-heartbeat-ok",expiresIn:...}, "*")`
- Line 764: `window.top.postMessage({type:"gas-session-created", success:true, sessionToken:result.sessionToken, ...}, "*")`
- Line 789: `window.top.postMessage({type:"gas-needs-auth",...}, "*")`
- Line 800: `window.top.postMessage({type:"gas-signed-out",success:true}, "*")`
- Line 812: `window.top.postMessage({type:"gas-needs-auth",authStatus:"..." ...}, "*")`
- Line 735: additional heartbeat messages

**Affected locations in `testauth1.html`:**
- Lines 1009-1012: `gasApp.contentWindow.postMessage({type: 'exchange-token', accessToken: _pendingToken}, '*')`

**Fix:** Replace every `"*"` target origin with the specific GitHub Pages URL for this deployment. In the GAS file, use the configured page URL. In the HTML file, use the `script.google.com` domain.

**Implementation:**
1. In `testauth1.gs` — replace all `}, "*")` in postMessage calls with `}, "https://shadowaisolutions.github.io")`
2. In `testauth1.html` — replace `}, '*')` in the exchange-token postMessage with `}, 'https://script.google.com')` (or the specific script URL origin)
3. Consider making the target origin configurable via a constant at the top of each file

---

### C2. XFrameOptionsMode.ALLOWALL on all GAS responses

**Problem:** Every GAS HTML response uses `HtmlService.XFrameOptionsMode.ALLOWALL`, allowing any website to embed the GAS app in an iframe. Combined with C1, an attacker can embed the GAS URL in a hidden iframe and receive session tokens via postMessage.

**Affected locations in `testauth1.gs`:**
- Lines 663-665, 727-729, 766-768, 802-804, 814-816, 859-861 (and many more)
- Pattern: `.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)`

**Fix:** The main app iframe embed from the GitHub Pages host is unavoidable (needs ALLOWALL), but responses that should NOT be embeddable (heartbeat, sign-out, token exchange error pages) could potentially use `SAMEORIGIN`. However, since GAS is always served from `script.google.com` and the parent is `github.io`, `SAMEORIGIN` would block all embedding. The real fix is C1 (restrict postMessage origins) — C2 is mitigated when C1 is fixed because even if embedded, no data leaks via postMessage.

**Implementation:**
1. Fix C1 first — this neutralizes the main attack vector of C2
2. Evaluate if any responses truly don't need to be in an iframe (error pages, etc.) and could use a redirect instead of iframe embedding
3. Document in code comments why ALLOWALL is required for the iframe architecture

---

### C3. Session token transmitted in URL query parameters

**Problem:** In the `standard` preset (`TOKEN_EXCHANGE_METHOD: 'url'`), tokens are passed as URL parameters. URL parameters are logged in server access logs, visible in browser history, leaked via Referer headers, and cached by browsers.

**Affected locations in `testauth1.html`:**
- Line 971: `gasApp.src = baseUrl + '?exchangeToken=' + encodeURIComponent(googleAccessToken)`
- Line 1036: `gasApp.src = baseUrl + '?session=' + encodeURIComponent(data.sessionToken)`
- Line 1129: `gasApp.src = baseUrl + '?session=' + encodeURIComponent(session.token)`
- Line 1426: `gasApp.src = baseUrl + '?session=' + encodeURIComponent(session.token)`
- Line 1455: `hbFrame.src = baseUrl + '?heartbeat=' + encodeURIComponent(session.token)`
- Line 1540: `gasApp.src = baseUrl + '?signOut=' + encodeURIComponent(session.token)`

**Affected locations in `testauth1.gs`:**
- Line 651: `var sessionToken = (e && e.parameter && e.parameter.session) || ""`
- Line 745: `var exchangeToken = (e && e.parameter && e.parameter.exchangeToken) || ""`

**Fix:** Move all token transmission to use postMessage instead of URL parameters. The `hipaa` preset already does this for the initial token exchange — extend this pattern to session validation, heartbeat, and sign-out.

**Implementation:**
1. Modify the heartbeat, session validation, and sign-out flows to use postMessage for token transmission instead of URL query parameters
2. The GAS iframe would load without tokens in the URL, then receive them via postMessage after load
3. This requires adding postMessage listeners in the GAS-generated HTML for these flows (similar to the existing HIPAA exchange-token listener)
4. Update `doGet` to handle tokenless loads and wait for postMessage
5. Consider making postMessage the default for ALL presets, not just HIPAA

---

## Priority 2 — HIGH Findings (Fix Soon)

### H1. No origin validation on incoming postMessages (HTML side)

**Problem:** The message handler in `testauth1.html` checks message type allowlist but never validates `event.origin`. Any page can send forged `gas-session-created` messages for session fixation.

**Affected location in `testauth1.html`:**
- Lines 999-1003: The `window.addEventListener('message', ...)` handler checks `_gasMessageTypes[data.type]` but not `event.origin`

**Attack scenario:**
1. Attacker obtains a valid session token for their own account
2. Injects a `gas-session-created` postMessage to the victim's page
3. Victim's browser stores attacker's session token (line 1020: `saveSession(data.sessionToken, data.email)`)
4. Subsequent actions by victim use attacker's session

**Fix:** Add `event.origin` validation at the top of the message handler.

**Implementation:**
```javascript
window.addEventListener('message', function(event) {
  // Validate origin - only accept messages from the GAS domain
  if (event.origin.indexOf('script.google.com') === -1) return;
  var data = event.data;
  if (!data || typeof data !== 'object') return;
  if (!_gasMessageTypes[data.type]) return;
  // ... rest of handler
});
```

---

### H2. No origin validation on incoming postMessages (GAS iframe side)

**Problem:** The postMessage listener in HIPAA mode GAS iframe does not validate `event.origin`. Any window can send an `exchange-token` message.

**Affected location in `testauth1.gs`:**
- Lines 775-776: `window.addEventListener("message", function(e) { if (!e.data || e.data.type !== "exchange-token") return;`

**Fix:** Add origin validation checking for the expected GitHub Pages domain.

**Implementation:**
```javascript
window.addEventListener("message", function(e) {
  if (e.origin !== "https://shadowaisolutions.github.io") return;
  if (!e.data || e.data.type !== "exchange-token") return;
  // ... rest of handler
});
```

---

### H3. XSS via template literal interpolation in GAS HTML output

**Problem:** `session.email` is interpolated directly into HTML and JavaScript string contexts without escaping. A crafted email with `"`, `'`, `<`, `>`, or `</script>` could inject arbitrary JavaScript.

**Affected locations in `testauth1.gs`:**
- Line 812: `'...authStatus:"' + session.status + '",email:"' + (session.email || '') + '"...'` — email concatenated into JS string in inline `<script>`
- Lines 836-837: `<div id="user-email">${session.email}</div>` — email in HTML template literal
- Line 841: `'...version: "${VERSION}", needsReauth: ${session.needsReauth || false}...'`

**Fix:** Create an `escapeHtml()` and `escapeJs()` helper function and use them on all user-controlled values before interpolation.

**Implementation:**
```javascript
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/'/g,"\\'").replace(/</g,'\\x3c').replace(/>/g,'\\x3e').replace(/\n/g,'\\n').replace(/\r/g,'\\r');
}
```
Then use `escapeJs(session.email)` in JS contexts and `escapeHtml(session.email)` in HTML contexts.

---

### H4. Google OAuth access token exposed to GAS server

**Problem:** The full Google OAuth access token (which grants access to the user's Google profile and email scope) is sent to the GAS server and used to call the Google userinfo endpoint. If the server or its logs are compromised, all OAuth tokens are exposed.

**Affected location in `testauth1.gs`:**
- Line 306: `function exchangeTokenForSession(accessToken)`

**Fix:** Consider using Google ID tokens (JWT) instead of access tokens for server-side verification. ID tokens can be verified locally without calling the userinfo endpoint, and they contain only identity claims (not full API access).

**Implementation:**
1. On the HTML side, request an ID token from Google Sign-In (the `id_token` flow) instead of or in addition to the access token
2. On the GAS side, verify the JWT signature and extract claims locally
3. This eliminates the need to send a bearer token to the server

**Note:** This is a larger architectural change. Consider implementing after C1-C3 and H1-H3 are resolved.

---

## Priority 3 — MEDIUM Findings (Plan and Fix)

### M1. CacheService.getScriptCache() — shared namespace and 6-hour max TTL

**Problem:** `getScriptCache()` is shared across all users/executions. The max TTL is 6 hours, but `ABSOLUTE_SESSION_TIMEOUT` is set to 16 hours. The cache entry will be evicted after 6 hours regardless of the configured timeout.

**Location:** `testauth1.gs` line 368
**Fix:** Document the 6-hour limitation. Consider using PropertiesService for longer sessions (but note it's slower). Alternatively, reduce `ABSOLUTE_SESSION_TIMEOUT` to 6 hours to match the cache limit.

### M2. Session token in localStorage accessible to XSS

**Problem:** In standard mode, session tokens are stored in `localStorage`, accessible to any JavaScript on the same origin. Any XSS on `shadowaisolutions.github.io` exposes all session tokens.

**Location:** `testauth1.html` lines 898-901
**Fix:** Consider using `sessionStorage` instead (auto-clears on tab close). For stronger protection, consider a service worker-based token store or session cookies (not available on GitHub Pages).

### M3. Access control cache allows stale permissions for 10 minutes

**Problem:** ACL results cached for 600 seconds. Revoked users retain access for up to 10 minutes.

**Locations:** `testauth1.gs` lines 604, 626, 631, 641
**Fix:** Reduce cache TTL to 60-120 seconds, or add a cache-bust mechanism for explicit revocations.

### M4. HMAC disabled by default (standard preset)

**Problem:** Standard preset has `ENABLE_HMAC_INTEGRITY: false`.

**Location:** `testauth1.gs` line 52
**Fix:** Consider enabling HMAC by default, or at minimum document the security tradeoff prominently.

### M5. HMAC payload does not include all session fields

**Problem:** HMAC only covers `email`, `createdAt`, `lastActivity`. Does not cover `displayName`, `absoluteCreatedAt`, or `tokenObtainedAt`. Modifying `absoluteCreatedAt` bypasses absolute session timeout.

**Location:** `testauth1.gs` line 283
**Fix:** Include all session fields in the HMAC payload.

**Implementation:**
```javascript
var payload = sessionData.email + '|' + sessionData.createdAt + '|' + sessionData.lastActivity + '|' + sessionData.absoluteCreatedAt + '|' + sessionData.displayName + '|' + sessionData.tokenObtainedAt;
```

### M6. Hardcoded OAuth Client ID

**Problem:** Client ID hardcoded at `testauth1.html` line 297. Cannot be rotated without code deployment. Could be used in phishing.

**Fix:** Consider moving to a config fetch or environment-based approach. Lower priority since client IDs are public identifiers.

### M7. `doPost` deploy action has no authentication

**Problem:** `doPost` with `action=deploy` triggers `pullAndDeployFromGitHub()` with zero authentication. Anyone can trigger re-deployments.

**Location:** `testauth1.gs` lines 130-138
**Fix:** Add a webhook secret/token validation. Compare `e.parameter.secret` or a header value against a stored secret in Script Properties.

**Implementation:**
```javascript
function doPost(e) {
  var action = (e && e.parameter && e.parameter.action) || "";
  if (action === "deploy") {
    var secret = (e && e.parameter && e.parameter.secret) || "";
    var expectedSecret = PropertiesService.getScriptProperties().getProperty('DEPLOY_SECRET');
    if (!expectedSecret || secret !== expectedSecret) {
      return ContentService.createTextOutput("Unauthorized");
    }
    var result = pullAndDeployFromGitHub();
    return ContentService.createTextOutput(result);
  }
  return ContentService.createTextOutput("Unknown action");
}
```

### M8. Error message leaks server internals

**Problem:** Server-side exception messages sent to client. May contain stack traces or internal function names.

**Location:** `testauth1.gs` line 751
**Fix:** Return generic error messages to the client, log details server-side.

**Implementation:**
```javascript
// Instead of:
result = { success: false, error: "server_error: " + (err.message || String(err)) };
// Use:
Logger.log("Token exchange error: " + (err.message || String(err)));
result = { success: false, error: "server_error" };
```

### M9. Debug logging in production

**Problem:** `console.log` statements log partial session data in the browser console.

**Location:** `testauth1.gs` line 763
**Fix:** Remove or gate behind a debug flag.

---

## Priority 4 — LOW Findings (Address When Convenient)

### L1. No rate limiting on authentication attempts
No rate limiting on token exchange, session validation, heartbeat, or sign-out requests. Large token keyspace (48 hex chars) mitigates brute-force risk, but DoS is possible.

### L2. Session token format — undocumented PRNG quality
`Utilities.getUuid()` provides ~192 bits of entropy after processing, but PRNG quality is undocumented by Google.

### L3. Sign-out does not revoke Google OAuth token
OAuth access token remains valid (~1 hour) after sign-out. Consider calling Google's revoke endpoint.

### L4. `window._r` stores GAS deployment URL globally
Decoded deployment URL stored as `window._r` with a timing window for access. Delete it immediately after use.

### L5. Maintenance bypass is client-side only
Maintenance mode is cosmetic — no server-side enforcement. Document this as a known limitation.

### L6. `_e` obfuscation is trivially reversible
Base64 + reverse is not security. Document that this is obfuscation for casual inspection only.

---

## Priority 5 — INFO Findings (No Action Required)

### I1. Constant-time HMAC comparison — correctly implemented
Good practice. Length check before constant-time comparison is not exploitable for fixed-length HMAC-SHA256.

### I2. CacheService 6-hour max TTL vs 16-hour absolute timeout
Architectural mismatch — see M1 for action item.

### I3. GAS HtmlService sandboxing
GAS sandbox provides baseline protections. ALLOWALL weakens framing protection (see C2).

### I4. SPREADSHEET_ID and DEPLOYMENT_ID are hardcoded
Operational identifiers, not secrets. Ensure spreadsheet sharing settings are restricted.

### I5. No CSP headers
GitHub Pages has limited header control. GAS does not support custom headers on `HtmlService`. Consider meta-tag CSP for the HTML page.

---

## Implementation Order (Recommended)

### Phase 1 — Critical postMessage & framing fixes (C1, C2, H1, H2)
These are the most impactful and can be done together since they all relate to postMessage security.

1. Add `escapeHtml()` and `escapeJs()` helper functions to `testauth1.gs` (H3 prerequisite)
2. Replace all `"*"` target origins in `testauth1.gs` postMessage calls with the GitHub Pages origin (C1)
3. Replace `"*"` target origin in `testauth1.html` postMessage call with `script.google.com` origin (C1)
4. Add `event.origin` validation to the HTML-side message handler (H1)
5. Add `event.origin` validation to the GAS-side HIPAA postMessage listener (H2)
6. Apply escaping to all user-controlled values in GAS HTML output (H3)
7. Add code comments explaining why ALLOWALL is required (C2)

### Phase 2 — Token transmission hardening (C3, M8, M9)
Move tokens out of URLs and clean up information leaks.

1. Refactor heartbeat, session validation, and sign-out to use postMessage instead of URL parameters (C3)
2. Replace detailed error messages with generic ones, log details server-side (M8)
3. Remove or gate debug console.log statements (M9)

### Phase 3 — Session security improvements (M1, M2, M3, M4, M5)
Harden the session management layer.

1. Reduce `ABSOLUTE_SESSION_TIMEOUT` to ≤6 hours to match CacheService limits, or document limitation (M1)
2. Evaluate switching from `localStorage` to `sessionStorage` for token storage (M2)
3. Reduce ACL cache TTL from 600s to 60-120s (M3)
4. Enable HMAC by default or document the tradeoff (M4)
5. Include all session fields in HMAC payload (M5)

### Phase 4 — Deployment & infrastructure (M6, M7, H4)
Harden the deployment and authentication infrastructure.

1. Add authentication to `doPost` deploy endpoint (M7)
2. Evaluate ID token (JWT) flow instead of access token exchange (H4)
3. Consider config-based Client ID management (M6)

### Phase 5 — Low-priority cleanup (L1-L6, I5)
Address remaining items when convenient.

1. Add rate limiting consideration/documentation (L1)
2. Implement Google OAuth token revocation on sign-out (L3)
3. Delete `window._r` immediately after use (L4)
4. Add meta-tag CSP to `testauth1.html` (I5)
5. Document known limitations: maintenance bypass (L5), obfuscation (L6), PRNG quality (L2)

---

## Testing Checklist

After each phase, verify:
- [ ] Auth flow works end-to-end (sign in, session validation, heartbeat, sign out)
- [ ] Heartbeat continues to extend sessions correctly
- [ ] Session expiration triggers re-auth correctly
- [ ] HIPAA preset still functions (postMessage exchange)
- [ ] Standard preset still functions
- [ ] Maintenance mode overlay works
- [ ] ACL checks work (authorized and unauthorized users)
- [ ] Error handling doesn't leak details to client
- [ ] Browser console is clean of debug output in production

---

## Reference: Severity Summary

| Severity | Count | IDs |
|----------|-------|-----|
| CRITICAL | 3 | C1, C2, C3 |
| HIGH | 4 | H1, H2, H3, H4 |
| MEDIUM | 9 | M1–M9 |
| LOW | 6 | L1–L6 |
| INFO | 5 | I1–I5 |

Developed by: ShadowAISolutions
