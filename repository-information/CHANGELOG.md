# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 40/100`

## [Unreleased]

## [v03.18r] — 2026-03-14 01:09:05 PM EST

### Fixed
- Fixed hipaa postMessage token exchange — sign-in was stuck because `gasApp.contentWindow` targets the outer script.google.com shell frame, not the inner sandbox frame where the listener runs; switched to `event.source` to reply directly to the sandbox

### Added
- Created `KNOWN-CONSTRAINTS.md` documenting architectural constraints that must not be changed (GAS double-iframe `'*'` targetOrigin, `event.source` for HTML→GAS replies, unauthenticated deploy webhook, sign-in flow chain, PARENT_ORIGIN for GAS→HTML)

#### `testauth1.html` — v01.50w

##### Fixed
- Fixed sign-in getting stuck when using the hipaa security preset

## [v03.17r] — 2026-03-14 12:59:12 PM EST

### Fixed
- Reverted postMessage targetOrigin from `GAS_ORIGIN` back to `'*'` for the HTML→GAS exchange-token message — GAS double-iframe architecture serves the listener from a sandboxed `googleusercontent.com` subdomain, causing the browser to silently drop messages targeted at `script.google.com` (VULN-2 remains open on this direction; exposure limited to single-use token)

#### `testauth1.html` — v01.49w

##### Fixed
- Fixed sign-in getting stuck on "Sign In Required" when using postMessage token exchange — the access token message was being silently dropped by the browser

## [v03.16r] — 2026-03-14 12:53:45 PM EST

### Changed
- Switched testauth1 from `standard` to `hipaa` auth preset — enables HMAC message integrity, audit logging, emergency access, and postMessage token exchange by default
- Fixed hipaa preset validation to only require `ALLOWED_DOMAINS` when `ENABLE_DOMAIN_RESTRICTION` is true (previously threw unconditionally)

#### `testauth1.gs` — v01.22g

##### Changed
- Switched `ACTIVE_PRESET` from `'standard'` to `'hipaa'`
- Added `PROJECT_OVERRIDES` with `ENABLE_DOMAIN_RESTRICTION: false` to allow any Google account
- Fixed `resolveConfig()` validation — `ALLOWED_DOMAINS` check now gated on `ENABLE_DOMAIN_RESTRICTION`

#### `testauth1.html` — v01.48w

##### Changed
- Switched `STORAGE_TYPE` from `'localStorage'` to `'sessionStorage'` (session cleared on tab close)
- Switched `TOKEN_EXCHANGE_METHOD` from `'url'` to `'postMessage'` (token never in URL)
- Updated commented-out production `SERVER_SESSION_DURATION` from 3600 to 900 to match hipaa preset

## [v03.15r] — 2026-03-14 12:46:13 PM EST

### Changed
- Added commented-out production values above each test value in GAS and HTML config — to revert, uncomment the original lines and delete the ⚡ TEST VALUE lines

#### `testauth1.gs` — v01.21g

##### Changed
- Added commented-out production values above each ⚡ TEST VALUE line in both standard and hipaa presets for easy revert

#### `testauth1.html` — v01.47w

##### Changed
- Added commented-out production values above each ⚡ TEST VALUE line for easy revert

## [v03.14r] — 2026-03-14 12:43:08 PM EST

### Changed
- Set all timed auth config values to fast-test values for rapid testing (sessions, heartbeats, OAuth lifetime)
- Added inline comments documenting every timed config value with its production default

#### `testauth1.gs` — v01.20g

##### Changed
- Session expiration: 1 hour → 3 minutes (for testing)
- Absolute session timeout: 16 hours → 5 minutes (for testing)
- Heartbeat interval: 5 minutes → 30 seconds (for testing)
- OAuth token lifetime: 1 hour → 3 minutes (for testing)
- OAuth refresh buffer: 5 minutes → 1 minute (for testing)
- Added inline comments to all timed values showing production defaults

#### `testauth1.html` — v01.46w

##### Changed
- Heartbeat interval: 5 minutes → 30 seconds (for testing)
- Session countdown duration: 1 hour → 3 minutes (for testing)
- Absolute session countdown: 16 hours → 5 minutes (for testing)
- Added inline comments to all timed values showing production defaults

## [v03.13r] — 2026-03-14 12:39:17 PM EST

### Changed

#### `testauth1.gs` — v01.19g

##### Changed
- Reduced OAuth token refresh buffer from 15 minutes to 5 minutes — the "session is expiring soon" reauth banner now only appears in the last 5 minutes of OAuth token lifetime instead of the last 15

## [v03.12r] — 2026-03-14 12:32:39 PM EST

### Security

#### `testauth1.html` — v01.45w

##### Security
- Added `Referrer-Policy: no-referrer` meta tag to prevent OAuth and session tokens from leaking via HTTP referrer headers (VULN-1, VULN-6)
- Replaced wildcard `'*'` postMessage target origin with `GAS_ORIGIN` (`https://script.google.com`) when sending access tokens to the GAS iframe, preventing token broadcast to unintended recipients (VULN-2)

## [v03.11r] — 2026-03-14 12:13:26 PM EST

### Added
- Comprehensive security update plan II for testauth1 (`repository-information/8-SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — adversarial audit covering 19 vulnerabilities across 7 implementation phases: referrer policy + postMessage origin fix, token exposure reduction (postMessage exchange, sessionStorage, key namespacing), Content Security Policy + innerHTML sanitization, error sanitization + rate limiting + session timeout reduction, deploy audit logging + information exposure documentation, HMAC enablement + bootstrap hardening + cross-tab session revocation via BroadcastChannel, and OAuth flow hardening. Includes complete attack chain analysis, hard constraints inherited from the first plan, CSP directives validated against Google Identity Services documentation, and full regression testing protocol

## [v03.10r] — 2026-03-14 11:26:51 AM EST

### Changed
- Renamed `SECURITY-UPDATE-PLAN-TESTAUTH1.md` → `7-SECURITY-UPDATE-PLAN-TESTAUTH1.md` and updated status to "Implemented" — the 6-phase security hardening was fully implemented in v02.90r–v02.91r
- Updated all cross-references (README tree, CHANGELOG entries, SESSION-CONTEXT.md)

## [v03.09r] — 2026-03-13 11:38:31 PM EST

### Changed
- Stacked the session timer, GAS version, and HTML version pins vertically in the bottom-right corner instead of spreading them horizontally
- Propagated vertical pin stacking to the auth HTML template

#### `testauth1.html` — v01.44w

##### Changed
- Status pins now stack vertically in the bottom-right corner — session timer on top, GAS version in the middle, HTML version on the bottom

## [v03.08r] — 2026-03-13 11:23:52 PM EST

### Added
- Session pin now shows ▶ indicator in minimized state when heartbeat is active
- Propagated ▶ minimized pill indicator to the auth HTML template

#### `testauth1.html` — v01.43w

##### Added
- Session countdown pill now shows ▶ when your activity is being tracked

## [v03.07r] — 2026-03-13 11:17:21 PM EST

### Changed
- Changed testauth1 session countdown to 1 hour and heartbeat interval to 5 minutes
- Updated auth templates (GAS and HTML) to match: session 1 hour, heartbeat 5 minutes

#### `testauth1.html` — v01.42w

##### Changed
- Session now lasts 1 hour instead of 2 hours
- Heartbeat checks happen every 5 minutes instead of every 10 minutes

#### `testauth1.gs` — v01.18g

##### Changed
- Session expiration changed to 1 hour
- Heartbeat interval changed to 5 minutes

## [v03.06r] — 2026-03-13 11:12:06 PM EST

### Changed
- Increased testauth1 session countdown from 3 minutes to 2 hours and heartbeat interval from 30 seconds to 10 minutes

#### `testauth1.html` — v01.41w

##### Changed
- Session now lasts 2 hours instead of 3 minutes
- Heartbeat checks happen every 10 minutes instead of every 30 seconds

#### `testauth1.gs` — v01.17g

##### Changed
- Session expiration extended from 3 minutes to 2 hours
- Heartbeat interval increased from 30 seconds to 10 minutes

## [v03.05r] — 2026-03-13 11:00:25 PM EST

### Removed
- Removed 15-second grace period for in-flight heartbeats — the urgent heartbeat (instant send in the last 30s) makes this unnecessary

### Changed
- Propagated testauth1 improvements to the auth template: urgent heartbeat for last-30s activity, `▶ ready` indicator replacing `(active)` label

#### `testauth1.html` — v01.40w

##### Removed
- Removed grace period delay before session expiry — sessions now expire immediately when the timer runs out

## [v03.04r] — 2026-03-13 10:46:46 PM EST

### Removed
- Removed iframe focus polling for heartbeat activity — it falsely reported activity whenever focus was inside the iframe, even when the user was idle. Keyboard-only interaction inside the GAS iframe is a narrow edge case; mouse movement on the host page already covers most real usage

#### `testauth1.html` — v01.39w

##### Removed
- Removed false activity detection that kept the session active even when you weren't interacting

## [v03.03r] — 2026-03-13 10:39:53 PM EST

### Fixed
- Iframe focus detection now requires `document.hasFocus()` — prevents false activity when the browser tab is not focused

#### `testauth1.html` — v01.38w

##### Fixed
- Session no longer falsely shows activity when you switch to another tab or window

## [v03.02r] — 2026-03-13 10:34:59 PM EST

### Fixed
- Typing inside the GAS iframe now counts as activity for heartbeat — added iframe focus detection since cross-origin iframes swallow keyboard events

#### `testauth1.html` — v01.37w

##### Fixed
- Typing in text boxes inside the app now keeps your session active

## [v03.01r] — 2026-03-13 10:24:41 PM EST

### Fixed
- Heartbeat display no longer shows "▶ ready" immediately after extending — resets to idle so the next tick decides the state, removing the confusing "extended ✓" → "active" flash

#### `testauth1.html` — v01.36w

##### Fixed
- Heartbeat indicator resets to idle after session extension instead of immediately showing "ready"

## [v03.00r] — 2026-03-13 10:08:56 PM EST

### Fixed
- Fixed heartbeat ready indicator not appearing on activity — `_heartbeatIdle` was not cleared when user became active, so display stayed stuck on `(idle)` until the next 30s tick

#### `testauth1.html` — v01.35w

##### Fixed
- Heartbeat "ready" indicator now appears immediately when you interact with the page, instead of staying on "idle" until the next heartbeat cycle

## [v02.99r] — 2026-03-13 10:03:03 PM EST

### Changed
- Heartbeat countdown now shows `▶ ready` indicator when it will fire on the next tick, replacing the generic `(active)` label

#### `testauth1.html` — v01.34w

##### Changed
- Heartbeat countdown shows a clear "ready" indicator when your session will be extended on the next heartbeat

## [v02.98r] — 2026-03-13 09:43:38 PM EST

### Added
- Added urgent heartbeat — when session has <30s remaining and user is active, sends heartbeat immediately instead of waiting for the next 30s interval tick

#### `testauth1.html` — v01.33w

##### Added
- Session now extends immediately when you're active in the last 30 seconds before expiry

## [v02.97r] — 2026-03-13 09:25:41 PM EST

### Changed
- Reverted cursor flicker fix attempts (v02.95r, v02.96r) — restored heartbeat to v01.29w behavior (persistent iframe, direct DOM writes)

#### `testauth1.html` — v01.32w

##### Changed
- Reverted heartbeat to original approach — minor cursor flicker during heartbeat is acceptable

## [v02.96r] — 2026-03-13 09:15:09 PM EST

### Fixed
- Fixed heartbeat cursor flicker by batching DOM updates with requestAnimationFrame and adding CSS containment to the timer pill

#### `testauth1.html` — v01.31w

##### Fixed
- Fixed cursor flickering from caret to pointer when heartbeat status updates

## [v02.95r] — 2026-03-13 09:08:32 PM EST

### Fixed
- Fixed heartbeat iframe cursor flicker — heartbeat now uses a disposable iframe with src pre-set before DOM insertion instead of navigating an existing iframe

#### `testauth1.html` — v01.30w

##### Fixed
- Fixed cursor flickering from caret to pointer during heartbeat requests

## [v02.94r] — 2026-03-13 08:58:37 PM EST

### Added
- Added text input field to testauth1 GAS app for testing whether heartbeat iframe reloads disrupt user typing

#### `testauth1.gs` — v01.16g

##### Added
- Added text input field for heartbeat interruption testing

## [v02.93r] — 2026-03-13 08:37:51 PM EST

### Fixed
- Fixed session timeout race condition — when a heartbeat was in-flight and the countdown hit 0, the client would sign the user out before the server response could extend the session. Added a 15-second grace period that shows "extending..." while waiting for the heartbeat response

#### `testauth1.html` — v01.29w

##### Fixed
- Session no longer times out while a heartbeat response is in transit — shows "extending..." instead of immediately signing out

## [v02.92r] — 2026-03-13 08:14:29 PM EST

### Fixed
- Fixed GAS changelog popup not showing version headers with timestamps — the `parseGasChangelog` regex was missing the `v` prefix in the version capture group (`[\d.]+g` → `v[\d.]+g`), causing all `## [vXX.XXg]` headers to be silently skipped while entries were shown without grouping

#### `testauth1.html` — v01.28w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

#### `index.html` — v01.03w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

#### `testenvironment.html` — v01.03w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

#### `gas-project-creator.html` — v01.10w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

## [v02.91r] — 2026-03-13 08:03:00 PM EST

### Changed
- Propagated all security hardening from testauth1 to auth templates — both `gas-minimal-auth-template-code.js.txt` and `HtmlAndGasTemplateAutoUpdate-auth.html.txt` now include the full 6-phase security implementation so new GAS projects created via setup-gas-project.sh inherit all defenses by default

### Security
- **Auth GAS template** — added PARENT_ORIGIN derivation, `escapeHtml()`/`escapeJs()` XSS prevention, expanded HMAC payload, per-session message signing key, `messageKey` in session responses, error sanitization, all `"*"` → `PARENT_ORIGIN` on postMessages, removed `accessToken` from session storage
- **Auth HTML template** — added message-type allowlist (8 known types), cryptographic message signature verification, `msgKey` parameter on heartbeat iframe URLs, removed debug console.logs, removed broken OAuth revocation, fixed checkmark encoding

## [v02.90r] — 2026-03-13 07:15:58 PM EST

### Added
- Defense-in-depth security hardening for testauth1 environment (6-phase implementation from 7-SECURITY-UPDATE-PLAN-TESTAUTH1.md)

### Security
- **Message-type allowlist** (HTML) — postMessage listener now only processes 8 known GAS message types, rejecting all others
- **Cryptographic message authentication** (GAS→HTML) — per-session HMAC key signs all GAS outgoing postMessages; HTML parent verifies signatures before processing security-sensitive messages
- **XSS prevention** (GAS) — added `escapeHtml()`/`escapeJs()` helpers and applied to all user-controlled interpolation points in GAS-generated HTML
- **Session hardening** (GAS) — removed stored OAuth access token from session cache (least privilege), expanded HMAC payload to cover all security-relevant fields
- **postMessage target origin** (GAS) — replaced `"*"` with `PARENT_ORIGIN` (derived from `EMBED_PAGE_URL` with mandatory `.toLowerCase()`) on all 15 GAS→parent postMessage calls
- **Error message sanitization** (GAS) — token exchange errors now log details server-side only, returning generic "server_error" to client
- **Debug log cleanup** (both) — removed all `[AUTH DEBUG]` and `[GAS DEBUG]` console.log statements from production code
- **OAuth revocation fix** (HTML) — removed broken `google.accounts.oauth2.revoke(session.token)` call that was passing the server session token instead of the OAuth access token

#### `testauth1.html` — v01.27w

##### Added
- Message-type allowlist for postMessage security
- Cryptographic message signature verification for GAS messages

##### Changed
- Heartbeat iframe now passes message signing key for signature verification

##### Fixed
- Removed broken OAuth token revocation that was passing wrong token type

##### Removed
- Debug console.log statements from authentication flow

#### `testauth1.gs` — v01.15g

##### Added
- `escapeHtml()` and `escapeJs()` XSS prevention helpers
- `PARENT_ORIGIN` constant for restricted postMessage targeting
- Per-session message signing key generation and message signing
- Server-side error logging for token exchange failures

##### Changed
- All postMessage calls now target `PARENT_ORIGIN` instead of `"*"`
- HMAC payload expanded to include all security-relevant session fields
- OAuth access token no longer stored in session cache

##### Removed
- Debug console.log statement from token exchange response

## [v02.89r] — 2026-03-13 07:00:04 PM EST

### Changed
- Corrected security update plan failure analysis (`repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — identified that GAS was stuck at v01.15g from v02.79r onward because DEPLOY_SECRET broke auto-deploy, meaning all subsequent GAS-side fixes (v02.80r–v02.82r) never deployed to the live environment. Corrected false lessons: PARENT_ORIGIN case mismatch (not `.toLowerCase()`) was the actual root cause of persistent sign-in failure; TOKEN_EXCHANGE_METHOD='postMessage' was never properly tested (revert never deployed). Added `.toLowerCase()` to Phase 6 PARENT_ORIGIN derivation to prevent repeating the v02.79r bug

## [v02.88r] — 2026-03-13 06:46:07 PM EST

### Added
- Comprehensive security update plan for testauth1 (`repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — implementation-ready plan covering 6 phases: message-type allowlist, cryptographic message authentication, XSS prevention, session hardening, debug cleanup, error sanitization, and postMessage target origin restriction. Includes complete failure analysis of v02.75r–v02.84r (the two previous reverted attempts) with root causes documented for each, and explicit "never touch" constraints for the deploy handler and sign-in flow

## [v02.87r] — 2026-03-13 06:13:23 PM EST

### Changed
- Rotated 92 CHANGELOG sections (v02.68r–v01.77r) to archive — all non-today sections moved to CHANGELOG-archive.md with SHA enrichment for 6 versions (v02.63r–v02.68r); 86 older versions moved as-is (commits pre-date local git history)

## [v02.86r] — 2026-03-13 06:03:16 PM EST

### Added
- Protective `⚠️ CRITICAL` comment block in all GAS deploy handlers (`doPost(action=deploy)`) warning against adding authentication or guards — prevents silent breakage of the auto-update pipeline
- Deploy Handler Protection rule in `.claude/rules/gas-scripts.md` documenting why the deploy endpoint must remain unauthenticated, what happened when auth was added (v02.79r), and the pattern to watch for

#### `testauth1.gs` — v01.14g

##### Added
- Minor internal improvements

## [v02.85r] — 2026-03-13 05:44:18 PM EST

### Changed
- Full repo revert to v02.74r state — undoes all changes from v02.75r through v02.84r (security hardening, postMessage fixes, security action plan, template propagation)
- Removed `repository-information/SECURITY-ACTION-PLAN.md` (created in v02.78r)

#### `testauth1.html` — v01.26w (reverted from v01.35w)

##### Changed
- Reverted to v01.26w state — undoes security hardening changes (CSP meta tag, origin validation, postMessage security, CSRF token handling) that were applied in v02.75r–v02.84r

#### `testauth1.gs` — v01.13g (reverted from v01.17g)

##### Changed
- Reverted to v01.13g state — undoes server-side security hardening (state parameter validation, origin checks, action allowlists) from v02.79r–v02.84r

## [v02.74r] — 2026-03-13 12:58:17 PM EST

### Changed
- Removed "Back to Table of Contents" link from Project Structure section since it's directly adjacent to the TOC

## [v02.73r] — 2026-03-13 12:55:44 PM EST

### Added
- "Back to Table of Contents" shortcut links under each section heading in README.md for quick navigation back to the TOC

## [v02.72r] — 2026-03-13 12:52:19 PM EST

### Added
- Table of contents section in README.md with anchor links to all major sections, placed between the QR code and Project Structure

## [v02.71r] — 2026-03-13 12:32:54 PM EST

### Added
- Comprehensive Microsoft authentication implementation plan (`MICROSOFT-AUTH-PLAN.md`) — covers MSAL.js integration, Azure AD setup, provider toggle architecture, GAS-side token validation via Microsoft Graph, and HTML-side dual sign-in UI

## [v02.70r] — 2026-03-13 11:32:09 AM EST

### Fixed
- Removed automatic silent OAuth sign-in on page load — the Google account picker popup no longer fires when refreshing the auth wall page; sign-in only triggers when the user clicks "Sign In with Google"
- Reverted incorrect SIGNED_OUT_FLAG approach from v02.69r

#### `testauth1.html` — v01.26w

##### Fixed
- Page refresh on "Sign In Required" screen no longer auto-triggers Google sign-in popup

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — v01.26w (no change)

##### Fixed
- Same fix applied to auth HTML template for future pages

## [v02.69r] — 2026-03-13 11:23:50 AM EST

### Fixed
- Fixed auto sign-in after manual sign-out on auth pages — signing out and refreshing no longer silently re-authenticates; the account picker is now shown

#### `testauth1.html` — v01.25w

##### Fixed
- Fixed sign-out followed by page refresh auto-signing back in without account picker

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — v01.25w (no change)

##### Fixed
- Same sign-out fix applied to auth HTML template for future pages

