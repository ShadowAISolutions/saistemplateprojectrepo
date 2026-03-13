# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 86/100`

## [Unreleased]

## [v02.80r] — 2026-03-13 05:03:28 PM EST

### Fixed
- Fixed sign-in flow stuck on "Sign In Required" screen after security hardening — origin case mismatch caused GAS postMessage listener to silently drop `exchange-token` messages (`PARENT_ORIGIN` was mixed-case but browsers report lowercase origins)
- Broadened CSP meta tag to include all Google Sign-In required domains (`*.googleapis.com`, `*.gstatic.com`, `accounts.google.com` frame-src)

#### `testauth1.html` — v01.31w

##### Fixed
- Fixed sign-in not completing — CSP now allows all Google authentication domains
- Updated build version meta tag

#### `testauth1.gs` — v01.15g (no change)

##### Fixed
- Normalized `PARENT_ORIGIN` to lowercase — prevents case mismatch with browser-reported origins that silently dropped postMessages

## [v02.79r] — 2026-03-13 04:51:10 PM EST

### Security
- **C1:** Replaced wildcard `"*"` target origin on all postMessage calls with specific GitHub Pages origin in both `testauth1.gs` and `testauth1.html`
- **C2:** Added code comments documenting why `ALLOWALL` is required for cross-origin GAS iframe architecture
- **C3:** Switched standard preset token exchange from URL parameters to postMessage — Google OAuth access tokens no longer exposed in URLs
- **H1:** Added origin validation to HTML-side postMessage listener — only accepts messages from Google domains
- **H2:** Added origin validation to GAS-side postMessage listeners — only accepts messages from the parent GitHub Pages origin
- **H3:** Added `escapeHtml()` and `escapeJs()` XSS prevention functions; applied to all user-controlled values (email, status) in GAS HTML output
- **M1:** Reduced `ABSOLUTE_SESSION_TIMEOUT` from 16 hours to 6 hours to match CacheService max TTL
- **M2:** Switched HTML storage from `localStorage` to `sessionStorage` — tokens auto-clear on tab close
- **M3:** Reduced ACL cache TTL from 600s to 120s — revoked users lose access within 2 minutes
- **M4:** Enabled HMAC session integrity by default in standard preset
- **M5:** Expanded HMAC payload to include all session fields (absoluteCreatedAt, displayName, tokenObtainedAt)
- **M7:** Added authentication to `doPost` deploy endpoint — requires `DEPLOY_SECRET` from Script Properties
- **M8:** Replaced detailed server error messages with generic ones; details logged server-side only
- **M9:** Removed debug `console.log` statements from production GAS exchange response
- **I5:** Added Content Security Policy meta tag restricting resource loading to trusted origins
- **L3:** Added Google OAuth token revocation on sign-out
- **L4:** Added immediate cleanup fallback for `window._r` GAS deployment URL

### Changed
- Added security documentation comments for L1 (rate limiting), L2 (PRNG quality), L5 (maintenance bypass), L6 (obfuscation), H4 (ID token migration), M6 (client ID management)
- Updated security action plan status to implemented

#### `testauth1.html` — v01.30w

##### Security
- Added origin validation on incoming postMessages (H1) — only accepts messages from Google domains
- Switched token exchange to postMessage for all presets (C3) — OAuth tokens no longer in URLs
- Switched session storage to sessionStorage (M2) — auto-clears on tab close
- Restricted exchange-token postMessage to captured GAS iframe origin (C1)
- Added Content Security Policy meta tag (I5)
- Added Google OAuth token revocation on sign-out (L3)
- Added `window._r` immediate cleanup fallback (L4)

##### Changed
- Added security documentation comments for M6, L5, L6

#### `testauth1.gs` — v01.15g

##### Security
- Added `escapeHtml()` and `escapeJs()` XSS prevention functions (H3)
- Replaced wildcard postMessage target origin with specific GitHub Pages origin on all responses (C1)
- Added origin validation to HIPAA postMessage listener (H2)
- Added origin validation to authenticated app message listener (H2)
- Applied XSS escaping to all user-controlled values in generated HTML (H3)
- Switched standard preset to postMessage token exchange (C3)
- Enabled HMAC by default in standard preset (M4)
- Expanded HMAC payload to cover all session fields (M5)
- Reduced ACL cache TTL from 600s to 120s (M3)
- Reduced absolute session timeout from 16h to 6h (M1)
- Added deploy endpoint authentication (M7)
- Replaced detailed error messages with generic ones (M8)
- Removed debug console.log from exchange response (M9)

##### Changed
- Added security documentation comments for L1, L2, H4

## [v02.78r] — 2026-03-13 04:08:45 PM EST

### Added
- Created `repository-information/SECURITY-ACTION-PLAN.md` — comprehensive security action plan for testauth1 auth system with 27 findings (3 critical, 4 high, 9 medium, 6 low, 5 info) and 5-phase implementation roadmap

## [v02.77r] — 2026-03-13 02:29:25 PM EST

### Fixed
- Fixed postMessage validation breaking auth flow — `event.source` check fails because GAS nests output in a sandbox iframe (source is the inner sandbox window, not the outer GAS iframe). Replaced with message-type allowlist that only processes known GAS message types

#### `testauth1.html` — v01.29w

##### Fixed
- Restored sign-in flow — replaced window source check with message-type allowlist so GAS sandbox iframe messages are processed correctly

### Changed
- Propagated postMessage allowlist fix to auth HTML template

## [v02.76r] — 2026-03-13 02:23:50 PM EST

### Fixed
- Fixed postMessage origin validation breaking auth flow — GAS iframes use srcdoc which produces a `null` origin, so switched to `event.source` window identity check instead
- Removed unused `GAS_ORIGIN` variable

#### `testauth1.html` — v01.28w

##### Fixed
- Restored sign-in flow — the page now correctly receives authentication messages from the embedded app

### Changed
- Propagated postMessage validation fix to auth HTML template

## [v02.75r] — 2026-03-13 01:45:42 PM EST

### Security
- Added `event.origin` validation to postMessage listener — messages from non-GAS origins are now rejected
- Replaced wildcard (`*`) postMessage target with explicit GAS origin for token exchange
- Removed OAuth access token from server-side session cache — no longer stored after validation
- Added constant-time HMAC comparison to prevent timing side-channel attacks
- Removed debug `console.log` statements that leaked auth flow details to browser console
- Removed broken Google OAuth token revoke call that was passing the wrong token type
- Added error logging and audit trail when ACL spreadsheet check fails

#### `testauth1.html` — v01.27w

##### Security
- Validated postMessage origin against `GAS_ORIGIN` — rejects messages from untrusted sources
- Sent token exchange postMessage to `GAS_ORIGIN` instead of wildcard `*`
- Removed all `[AUTH DEBUG]` console.log statements from production code
- Removed broken `google.accounts.oauth2.revoke()` call that passed session token instead of access token

#### `testauth1.gs` — v01.14g

##### Security
- Stopped storing Google OAuth access token in CacheService session data
- Added constant-time string comparison for HMAC verification
- Added Logger and audit log entry when ACL spreadsheet check throws an error

### Changed
- Propagated all security fixes to auth HTML template and both GAS auth templates

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

## [v02.68r] — 2026-03-12 11:49:35 PM EST

### Changed
- Propagated base auth upgrades from `gas-minimal-auth-template-code.js.txt` to `gas-test-auth-template-code.js.txt`: Master ACL spreadsheet support, heartbeat-based session management, absolute session timeout, improved error handling in token exchange, and debug logging

## [v02.67r] — 2026-03-12 11:38:39 PM EST

### Removed
- Removed `dchrcalendar.gs`, `dchrcalendar.html`, `testaed.gs`, and `testaed.html` — unused standalone files that were only kept as auth pattern reference implementations
- Updated `1-CUSTOM-AUTH-PATTERN.md` and `2-GOOGLE-OAUTH-AUTH-PATTERN.md` to note source files have been removed (pattern documentation preserved)

## [v02.66r] — 2026-03-12 11:19:23 PM EST

### Changed
- Propagated heartbeat-based session management system from testauth1 to auth templates, replacing the old inactivity-timeout pattern
- Auth templates now include: heartbeat functions, countdown timer UI, absolute session timeout, z-index stacking fixes, auth wall branding, cross-tab session sync, and `select_account` sign-in UX

## [v02.65r] — 2026-03-12 10:36:32 PM EST

### Added
- Cross-tab login sync — signing in on one tab now automatically signs in all other open tabs of the same page (uses the browser's native `storage` event for instant, secure same-origin sync)

#### `testauth1.html` — v01.24w

##### Added
- Cross-tab session sync: signing in on one tab instantly signs in all other open tabs; signing out in one tab instantly signs out all others

## [v02.64r] — 2026-03-12 09:47:46 PM EST

### Changed
- GAS script version bump to test auto-refresh and session expiry account chooser fix

#### `testauth1.gs` — v01.13g

##### Changed
- Minor internal improvements

## [v02.63r] — 2026-03-12 09:36:14 PM EST

### Fixed
- After auto-refresh when a session has timed out, users now see the sign-in screen with account chooser instead of being silently re-authenticated

#### `testauth1.html` — v01.23w

##### Fixed
- Auto-refresh after session timeout no longer skips the account chooser — users can select which Google account to sign in with

## [v02.62r] — 2026-03-12 09:29:51 PM EST

### Changed
- Auth access check now uses dual OR logic — either master ACL spreadsheet TRUE or editor/viewer sharing-list grants access (both methods work simultaneously)
- Auth template updated to match the OR-based dual access method

#### `testauth1.gs` — v01.12g

##### Changed
- Access check uses dual OR logic — master ACL TRUE or editor/viewer sharing-list grants access (previously fallback-only)
- ACL lookup wrapped in try/catch so errors fall through to method 2 instead of blocking access

## [v02.61r] — 2026-03-12 09:18:49 PM EST

### Added
- Centralized master ACL spreadsheet for auth — row-based email lookup replaces sharing-list check, keeping the data spreadsheet hidden from users' Google Drive
- Master ACL config variables: `MASTER_ACL_SPREADSHEET_ID`, `ACL_SHEET_NAME`, `ACL_PAGE_NAME`
- GAS Project Creator form fields for master ACL configuration

### Changed
- Auth access check now uses master ACL spreadsheet when configured, with fallback to legacy editor/viewer check

#### `testauth1.gs` — v01.11g

##### Added
- Master ACL spreadsheet support — checks email against row-based ACL instead of spreadsheet sharing list
- Fallback to legacy editor/viewer check when master ACL is not configured

#### `gas-project-creator.html` — v01.09w

##### Added
- Master ACL Spreadsheet ID, ACL Sheet Name, and ACL Page Name form fields in auth settings

## [v02.60r] — 2026-03-12 08:48:00 PM EST

### Fixed
- Session timer pill no longer overlaps the GAS version display in the bottom-left corner

#### `testauth1.html` — v01.22w

##### Fixed
- Moved session timer pill to the right to avoid overlapping the GAS layer version text

## [v02.59r] — 2026-03-12 08:36:16 PM EST

### Changed
- Session timers redesigned as a compact pill matching the version and GAS pills — shows session countdown while minimized, expands on click to show all timers

#### `testauth1.html` — v01.21w

##### Changed
- Session timers restyled as a bottom-left pill with session countdown visible while collapsed
- Click to expand shows absolute, session, and heartbeat timers

## [v02.58r] — 2026-03-12 08:30:29 PM EST

### Removed
- Removed "Test GAS Call" debug button from session timers panel

#### `testauth1.html` — v01.20w

##### Removed
- Removed debug button and result display from session timers

## [v02.57r] — 2026-03-12 07:48:34 PM EST

### Changed
- Sign-in screen now shows company logo and environment title above the "Sign In Required" heading
- Version indicator pills (HTML and GAS) are now visible on the sign-in screen — previously hidden behind the auth wall's solid background

#### `testauth1.html` — v01.19w

##### Changed
- Added company logo and environment title to auth wall
- Raised version indicator z-index so pills are visible on the login screen
- Bumped changelog/reauth overlay z-indexes to maintain correct stacking

## [v02.56r] — 2026-03-12 07:41:03 PM EST

### Changed
- Google Sign-In now shows account chooser when clicking "Sign In with Google" instead of auto-selecting the last used account

#### `testauth1.html` — v01.18w

##### Changed
- Sign-in button always presents Google account chooser for explicit account selection
- Re-auth fallback uses account chooser instead of consent-only prompt

## [v02.55r] — 2026-03-12 07:29:04 PM EST

### Fixed
- Heartbeat no longer destroys the GAS app iframe — uses a hidden iframe for server heartbeat requests instead of navigating the main `gas-app` iframe

#### `testauth1.html` — v01.17w

##### Fixed
- GAS app content no longer disappears after the first heartbeat extension — heartbeat requests now use a separate hidden iframe instead of navigating the main GAS iframe

## [v02.54r] — 2026-03-12 07:22:08 PM EST

### Changed
- Session timers panel now starts minimized — click "Session Timers" header to expand/collapse

#### `testauth1.html` — v01.16w

##### Changed
- Session timers default to collapsed state with a clickable header to expand

## [v02.53r] — 2026-03-12 07:14:59 PM EST

### Changed
- Countdown timer now shows hours format (H:MM:SS) when remaining time is 1 hour or more — applies to absolute session timer

#### `testauth1.html` — v01.15w

##### Changed
- Timer display uses H:MM:SS format for durations over 1 hour (e.g. "16:00:00" instead of "960:00")

## [v02.52r] — 2026-03-12 07:12:02 PM EST

### Changed
- Removed client-side inactivity timeout — heartbeat already handles idle session expiry naturally (no activity → no heartbeat → server session expires)
- Reordered session timers: Absolute first, Session second, Heartbeat third
- Absolute session expiry message now shows the duration (e.g. "Your 16-hour session has ended")

### Removed
- Inactivity timer row from session timers UI
- `ENABLE_INACTIVITY_TIMEOUT`, `CLIENT_INACTIVITY_TIMEOUT`, `ENABLE_AUTO_SIGNOUT` config options
- `startInactivityTimer()`, `resetInactivityTimer()`, `stopInactivityTimer()`, `handleInactivityTimeout()` functions

#### `testauth1.html` — v01.14w

##### Changed
- Reordered session timer display: Absolute → Session → Heartbeat
- Absolute session expiry sign-out message now indicates the duration ("Your 16-hour session has ended. Please sign in again.")

##### Removed
- Inactivity timer row and all inactivity timeout logic
- `ENABLE_INACTIVITY_TIMEOUT`, `CLIENT_INACTIVITY_TIMEOUT`, `ENABLE_AUTO_SIGNOUT` config options

## [v02.51r] — 2026-03-12 07:03:32 PM EST

### Changed
- Set absolute session timeout to 16 hours (57600s) for both standard and HIPAA presets
- Recommend heartbeat over inactivity timeout — heartbeat handles idle session expiry naturally via server-side expiration
- Updated HIPAA compliance reference to reflect heartbeat-based logoff approach and 16-hour absolute ceiling

### Added
- Auto sign-out when session or absolute timer expires — users are automatically signed out with a descriptive message instead of just showing "expired" in the timer

#### `testauth1.html` — v01.13w

##### Changed
- Absolute session duration increased from 6 minutes to 16 hours

##### Added
- Auto sign-out on session expiry with message "Your session has expired"
- Auto sign-out on absolute timeout with message "Your session has reached the maximum duration"

#### `testauth1.gs` — v01.10g

##### Changed
- Standard preset `ABSOLUTE_SESSION_TIMEOUT`: 360s → 57600s (16 hours)
- HIPAA preset `ABSOLUTE_SESSION_TIMEOUT`: 3600s → 57600s (16 hours)

## [v02.50r] — 2026-03-12 06:40:07 PM EST

### Added
- Created `HIPAA-COMPLIANCE-REFERENCE.md` — comprehensive reference document covering all 42 HIPAA Security Rule implementation specifications across all five sections (Administrative, Physical, Technical, Organizational, Documentation), with Required/Addressable status, our project's implementation mapping, and the 2025 proposed rule changes

## [v02.49r] — 2026-03-12 06:16:10 PM EST

### Added
- Implemented absolute session timeout — a hard ceiling that can never be extended by heartbeats, preventing infinite sessions for active users (OWASP recommendation)
- Added `ABSOLUTE_SESSION_TIMEOUT` to GAS presets (standard: 360s/6min for testing, HIPAA: 3600s/1hr)
- Added absolute timeout checks in both `validateSession()` and heartbeat handler — refuses to extend past the absolute limit
- Added absolute countdown timer row in client-side timer panel

#### `testauth1.html` — v01.12w

##### Added
- New "Absolute" countdown timer showing the hard session ceiling that cannot be extended

#### `testauth1.gs` — v01.09g

##### Added
- Absolute session timeout enforcement — sessions now have a hard ceiling that heartbeats cannot extend past
- New `ABSOLUTE_SESSION_TIMEOUT` configuration option in presets

## [v02.48r] — 2026-03-12 05:53:24 PM EST

### Changed
- Heartbeat timer row now shows a live countdown to the next heartbeat tick with (active) or (idle) status indicator

#### `testauth1.html` — v01.11w

##### Changed
- Heartbeat display now counts down to the next heartbeat check, showing whether it will extend the session (active) or skip (idle)

## [v02.47r] — 2026-03-12 05:41:17 PM EST

### Added
- Implemented session heartbeat system — client monitors DOM activity and sends periodic heartbeat to GAS server, which resets `createdAt` to extend active sessions
- Added `?heartbeat=TOKEN` handler in GAS `doGet` with full validation (HMAC, expiry check) before extending
- Added `gas-heartbeat-ok` and `gas-heartbeat-expired` postMessage handlers on client for session extension feedback
- Added heartbeat status display in countdown timer panel (shows idle/sending/extended/expired states)

### Removed
- Removed `SESSION_REFRESH_WINDOW` from both standard and HIPAA presets — replaced by the heartbeat system

#### `testauth1.html` — v01.10w

##### Added
- Session heartbeat that monitors your activity and automatically extends your session while you're using the page
- Heartbeat status indicator in the timer panel showing when your session is being extended

##### Removed
- Removed refresh window display — replaced by the heartbeat system

#### `testauth1.gs` — v01.08g

##### Added
- Server-side heartbeat handler that extends your session when you're actively using the page
- `ENABLE_HEARTBEAT` and `HEARTBEAT_INTERVAL` configuration options

##### Removed
- Removed `SESSION_REFRESH_WINDOW` configuration — no longer needed with the heartbeat system

## [v02.46r] — 2026-03-12 05:18:55 PM EST

### Changed
- Reduced testauth1 session expiration from 30 minutes to 3 minutes and refresh window from 5 minutes to 1.5 minutes for testing
- Added "Test GAS Call" debug button to testauth1 timer panel to manually trigger server-side session validation

#### `testauth1.html` — v01.09w

##### Changed
- Shortened session timer to 3 minutes and refresh window to 1.5 minutes for testing
- Added "Test GAS Call" button to the session timers panel — triggers a server round-trip to test session expiry behavior

#### `testauth1.gs` — v01.07g

##### Changed
- Reduced session expiration from 1800s to 180s (3 min) and refresh window from 300s to 90s (1.5 min) for testing

## [v02.45r] — 2026-03-12 04:38:41 PM EST

### Added
- Added countdown timer panel to testauth1 showing session expiration, refresh window status, and inactivity timeout in real-time

#### `testauth1.html` — v01.08w

##### Added
- Added live countdown timers showing session time remaining, refresh window status, and inactivity timeout

## [v02.44r] — 2026-03-12 02:58:04 PM EST

### Changed
- Bumped testauth1 GAS script version to test the self-update webhook deployment

#### `testauth1.gs` — v01.06g

##### Changed
- Version bump to verify automatic code deployment via webhook

## [v02.43r] — 2026-03-12 02:50:25 PM EST

### Fixed
- Fixed GAS self-update (auto-deploy webhook) not working for testauth1 — the `GITHUB_OWNER`, `GITHUB_REPO`, `TITLE`, and `FILE_PATH` variables were still set to template placeholders, causing `pullAndDeployFromGitHub()` to fetch from a nonexistent path and fail silently

#### `testauth1.gs` — v01.05g

##### Fixed
- Replaced placeholder variables (`YOUR_ORG_NAME`, `YOUR_REPO_NAME`, `YOUR_PROJECT_FOLDER/YOUR_PAGE_NAME.gs`, `YOUR_PROJECT_TITLE`) with actual values so the self-update webhook can pull code from the correct GitHub path

## [v02.42r] — 2026-03-12 02:42:21 PM EST

### Fixed
- Fixed session not persisting across page refreshes — the iframe's `srcdoc` race condition also affected the session-resume path, causing `gas-needs-auth` to fire and wipe the valid session from localStorage before the session-URL navigation could complete
- Added `_expectingSession` guard flag to ignore stale `gas-needs-auth` messages when a session navigation is in flight

#### `testauth1.html` — v01.07w

##### Fixed
- Fixed page refresh dropping authenticated session — `srcdoc` is now removed in the session-resume branch (same fix as the no-session branch), and stale `gas-needs-auth` messages are ignored during session navigation

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template)

##### Fixed
- Same session persistence fix propagated to the auth template

## [v02.41r] — 2026-03-12 02:33:17 PM EST

### Fixed
- Strengthened auth race condition fix — removed `srcdoc` attribute and deleted `window._r` before setting iframe to `about:blank`, preventing the queued srcdoc script from navigating to the bare GAS URL (the prior `src`-only fix was ineffective because HTML spec gives `srcdoc` priority over `src`)

#### `testauth1.html` — v01.06w

##### Fixed
- Prevented iframe `srcdoc` script from overriding the `about:blank` navigation — `srcdoc` is now removed and `window._r` deleted before cancelling the iframe load

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template)

##### Fixed
- Same strengthened auth race condition fix propagated to the auth template

## [v02.40r] — 2026-03-12 02:21:14 PM EST

### Fixed
- Fixed auth race condition causing false "Session expired" error on initial page load — the GAS iframe was navigating to the bare deployment URL before Google Sign-In could obtain a token, triggering a premature `gas-needs-auth` message. The iframe is now held on `about:blank` until a token is available for exchange

#### `testauth1.html` — v01.05w

##### Fixed
- Prevented premature iframe navigation when no local session exists — avoids the misleading "Session expired" error on first visit

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template)

##### Fixed
- Same auth initialization race condition fix propagated to the auth template

## [v02.39r] — 2026-03-12 01:53:19 PM EST

### Fixed
- Fixed auth flow not loading the app after sign-in — the iframe was not reloaded with the session token after URL-path token exchange, leaving the exchange response HTML visible instead of the app UI
- Added debug logging to GAS exchange response to trace postMessage delivery

#### `testauth1.html` — v01.04w

##### Fixed
- After successful token exchange, the iframe now reloads with the session token (previously only happened for postMessage exchange path)

#### `testauth1.gs` — v01.04g

##### Fixed
- Added browser-side debug logging to the token exchange response to diagnose postMessage delivery issues

## [v02.38r] — 2026-03-12 01:43:25 PM EST

### Fixed
- Fixed GAS postMessage not reaching parent page — Apps Script's sandbox iframe wrapper intercepts `window.parent.postMessage`; switched all GAS scripts and templates to use `window.top.postMessage` which bypasses the sandbox and reaches the embedding page directly

#### `testauth1.gs` — v01.03g

##### Fixed
- Fixed postMessage communication being intercepted by Google's iframe sandbox — messages now reach the embedding page correctly

## [v02.37r] — 2026-03-12 01:30:39 PM EST

### Fixed
- Fixed Google sign-in completing but auth wall persisting — the decoded GAS deployment URL was being deleted before the auth token exchange could use it
- Preserved GAS deployment URL in iframe `data-base-url` attribute so auth token exchange can reload the iframe after sign-in

#### `testauth1.html` — v01.03w

##### Fixed
- Fixed sign-in flow failing after Google popup closes — deployment URL now persists for token exchange

#### `index.html` — v01.02w

##### Changed
- Minor internal improvements

#### `testenvironment.html` — v01.02w

##### Changed
- Minor internal improvements

## [v02.36r] — 2026-03-12 01:22:58 PM EST

### Added
- Added console.log auth flow debugging to testauth1 HTML page to trace sign-in postMessage flow
- Added try-catch around GAS `exchangeTokenForSession()` so server errors are sent back as `gas-session-created` with error details instead of crashing silently

#### `testauth1.html` — v01.02w

##### Added
- Added console.log debugging at key auth flow points (token response, exchange URL, postMessage listener)

#### `testauth1.gs` — v01.02g

##### Fixed
- Wrapped token exchange in try-catch to prevent silent server errors from breaking the sign-in flow

## [v02.35r] — 2026-03-12 01:11:52 PM EST

### Added
- Added visible debug marker ("1") to GAS iframe output to diagnose whether iframe loads after auth

#### `testauth1.gs` — v01.01g

##### Added
- Added centered debug marker to verify iframe loading after authentication

## [v02.34r] — 2026-03-12 01:03:01 PM EST

### Fixed
- Updated testauth1 OAuth Client ID to a user-created credential with authorized JavaScript origins for GitHub Pages (Apps Script auto-generated client IDs cannot be modified)

#### `testauth1.html` — v01.01w

##### Fixed
- Fixed Google OAuth sign-in — replaced locked Apps Script-managed Client ID with user-created OAuth credential that authorizes the GitHub Pages origin

## [v02.33r] — 2026-03-12 12:11:25 PM EST

### Fixed
- Fixed `setup-gas-project.sh` Python boolean serialization — `parse_json()` now normalizes `True`/`False` to lowercase `true`/`false` for bash comparison
- Fixed Phase 7 (REPO-ARCHITECTURE.md update) — replaced references to nonexistent Mermaid node IDs with actual current patterns derived from the live diagram
- Fixed Phase 8 (README.md tree update) — replaced plain-text tree entries with full HTML `<a>` link format matching the current README structure
- Fixed HTML `<title>` replacement — changed from fragile string match to tag-based `<title>.*</title>` replacement

### Added
- Added Phase 5b — automatic per-environment diagram creation (`repository-information/diagrams/`) with auth-aware content (Google OAuth sequence section when `INCLUDE_AUTH=true`)
- Added diagram file to Phase 11 verification array and summary output
- Added `YOUR_CLIENT_ID` and `YOUR_DEPLOYMENT_ID` to template placeholder check

## [v02.32r] — 2026-03-12 11:55:11 AM EST

### Added
- Set up new GAS project `testauth1` with Google OAuth authentication (standard preset)
- Created `testauth1.html` embedding page from auth template with encoded deployment URL
- Created `testauth1.gs` GAS script from minimal-auth template with OAuth config
- Created `testauth1.config.json` project config
- Created version files (`testauth1html.version.txt`, `testauth1gs.version.txt`), changelogs, and changelog archives
- Added `testauth1-diagram.md` per-environment architecture diagram (auth sequence)
- Added Deploy Testauth1 webhook step to auto-merge workflow
- Registered Testauth1 in GAS Projects table

### Fixed
- Fixed setup script creating noauth files when auth was requested (Python `False` vs bash `true` string comparison) — recreated files from correct auth templates
- Fixed SPREADSHEET_ID placeholder comparison checks in generated GAS file — sed was replacing both the variable value and the guard-clause string literals, causing guard clauses to always evaluate true

#### `testauth1.html` — v01.00w

##### Added
- New auth-enabled page for testauth1title with Google OAuth sign-in

#### `testauth1.gs` — v01.00g

##### Added
- New auth-enabled GAS web app with OAuth token exchange and audit logging

## [v02.31r] — 2026-03-12 11:21:23 AM EST

### Fixed
- Fixed `ALLOWED_DOMAINS` replacement in `copyGsCode` to use global regex — previously only injected domains into the `standard` preset, leaving `hipaa` preset with empty `[]` (causing a runtime error when hipaa was selected with domains)
- Fixed `ENABLE_DOMAIN_RESTRICTION` replacement in `copyGsCode` to use global regex — same issue, only flipped the first preset
- Guarded `SPREADSHEET_ID` replacement in `copyGsCode` and `setup-gas-project.sh` to only run when auth is enabled — noauth templates don't have this variable
- Guarded `SPREADSHEET_ID` in `copyConfig` JSON output to only include when auth is enabled

#### `gas-project-creator.html` — v01.08w

##### Fixed
- Domain settings now correctly apply to all authentication presets
- Spreadsheet ID field no longer included in configuration when authentication is disabled

## [v02.30r] — 2026-03-12 10:25:57 AM EST

### Changed
- Updated GAS Project Creator page to support new Unified Toggleable Auth Pattern (pattern 6) templates
- Added OAuth Client ID, Auth Preset (standard/hipaa), and Allowed Domains form fields for auth configuration
- Auth setup instructions (OAuth consent screen, client ID creation) now shown conditionally when auth is enabled
- Updated `copyGsCode` to inject auth-specific config (preset, allowed domains, domain restriction) into auth templates
- Updated `copyConfig` to include `CLIENT_ID`, `AUTH_PRESET`, and `ALLOWED_DOMAINS` in the JSON output for `setup-gas-project.sh`
- Updated `setup-gas-project.sh` to parse and apply auth config fields (CLIENT_ID in HTML, ACTIVE_PRESET and ALLOWED_DOMAINS in GAS)

#### `gas-project-creator.html` — v01.07w

##### Changed
- Added authentication configuration section with OAuth Client ID, preset selector, and domain restriction fields
- Auth-specific setup steps now appear when Google Authentication checkbox is enabled
- Copy Code.gs now injects auth preset and domain restriction settings into auth template code
- Copy Config for Claude now includes auth settings in the JSON output

## [v02.29r] — 2026-03-12 10:10:19 AM EST

### Changed
- Rewrote all three auth template files from scratch using the Unified Toggleable Auth Pattern (pattern 6): `HtmlAndGasTemplateAutoUpdate-auth.html.txt`, `gas-minimal-auth-template-code.js.txt`, `gas-test-auth-template-code.js.txt`
- Auth templates now use noauth counterparts as exact baseline with clearly separated `AUTH START/END` and `AUTH CONFIG` section markers
- Replaced flat auth variables with unified `PRESETS` + `resolveConfig()` + `AUTH_CONFIG` config-driven system (`standard` and `hipaa` presets)
- Added toggle-gated features: domain restriction, audit logging, HMAC session integrity, emergency access, postMessage token exchange, sessionStorage, inactivity timeout, auto-signout
- Added dual token exchange paths: URL parameter (standard) and postMessage three-phase handshake (HIPAA)
- Added storage abstraction layer controlled by `HTML_CONFIG.STORAGE_TYPE` toggle
- Added dedicated `gas-signed-out` message type (replaces old `gas-needs-auth` for sign-out)
- Moved `doGet()` from TEMPLATE section to AUTH section in GAS templates (requires auth routing logic)

## [v02.28r] — 2026-03-12 09:28:34 AM EST

### Added
- Created `6-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md` — unified config-driven authentication pattern combining patterns 3–5 into a single toggleable codebase (19 sections, ~2100 lines). Features: `AUTH_CONFIG` + `HTML_CONFIG` config objects with `standard` and `hipaa` presets, toggle-gated features (domain restriction, audit logging, HMAC integrity, emergency access, postMessage exchange, sessionStorage, inactivity timeout, auto-signout), config resolution with shallow merge and HIPAA validation, complete GAS backend and HTML shell implementations, postMessage three-phase handshake protocol, CacheService behavioral caveats, security checklist, migration guide from patterns 3/4/5, feature toggle matrix with HIPAA regulation mapping, six-pattern comparison table, and troubleshooting guide

## [v02.27r] — 2026-03-12 08:38:09 AM EST

### Changed
- Renamed 5 auth pattern files with numeric prefixes for ordered reading: `CUSTOM-AUTH-PATTERN.md` → `1-CUSTOM-AUTH-PATTERN.md`, `GOOGLE-OAUTH-AUTH-PATTERN.md` → `2-GOOGLE-OAUTH-AUTH-PATTERN.md`, `IMPROVED-GOOGLE-OAUTH-PATTERN.md` → `3-IMPROVED-GOOGLE-OAUTH-PATTERN.md`, `RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` → `4-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md`, `HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` → `5-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md`
- Updated all internal cross-references between pattern files to use new prefixed filenames
- Added missing `5-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` entry to README.md tree

## [v02.26r] — 2026-03-12 01:19:24 AM EST

### Added
- Created `HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` — HIPAA-compliant OAuth pattern building on the Researched Improved pattern, addressing all identified regulatory gaps: audit logging to Google Sheet (45 CFR 164.312(b)), Workspace-only domain restriction (BAA coverage), 15-minute session timeout (164.312(a)(2)(iii)), postMessage-based token exchange (RFC 6750 §2.3 compliance), sessionStorage instead of localStorage, HMAC-SHA256 session data integrity (164.312(c)(1)), emergency access procedure via Script Properties (164.312(a)(2)(ii)), mandatory client-side inactivity timeout, MFA enforcement strategy via Workspace Admin Console, and full HIPAA compliance mapping table covering all 45 CFR 164.312 sections

## [v02.25r] — 2026-03-11 11:04:20 PM EST

### Added
- Created `RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` — research-validated OAuth pattern fixing origin validation vulnerability (`includes()` → strict `endsWith()` hostname suffix match), adding interactive re-auth fallback for `prompt: ''` failures, documenting CacheService behavioral caveats (best-effort TTL, max 21600s, no getTimeToLive), and including a full delta from the Improved pattern

## [v02.24r] — 2026-03-11 09:55:17 PM EST

### Changed
- Rewrote all 3 auth template files to implement the IMPROVED-GOOGLE-OAUTH-PATTERN, starting from noauth baselines rather than modifying existing basic auth code
- Auth HTML template now uses GIS OAuth2 token flow (not credential/JWT), origin-validated postMessage, opaque UUID session tokens in localStorage, auth wall overlay, inactivity timeout, and silent re-auth
- Auth GAS templates (minimal and test) now use server-side session management via CacheService with opaque UUID tokens, server-side Google token validation via googleapis.com/oauth2/v3/userinfo, configurable session TTL, single-session enforcement, and spreadsheet-based authorization

## [v02.23r] — 2026-03-11 09:13:02 PM EST

### Changed
- Updated "Imported Skills — Do Not Modify" rule to permit reference name updates (e.g. renamed template filenames) in addition to location pointers — applied without flagging as they are mechanical, not behavioral
- Updated imported frontend-design skill with new HTML template filenames

## [v02.22r] — 2026-03-11 09:03:31 PM EST

### Added
- Template variation matrix: 4 GAS templates (minimal/test × auth/noauth) and 2 HTML templates (auth/noauth) covering all gas-project-creator checkbox combinations
- Google Authentication support in GAS templates: `ALLOWED_DOMAIN` variable, domain restriction in `doGet()`, user email display, access denied page
- Google Identity Services (GIS) sign-in gate in auth HTML template: JWT decoding, sessionStorage persistence, domain restriction, auth overlay
- `INCLUDE_TEST` and `INCLUDE_AUTH` fields in gas-project-creator JSON config output for template selection

### Changed
- Gas-project-creator now loads 4 GAS template variants (was 2) and selects based on both test and auth checkboxes
- `setup-gas-project.sh` selects template based on `INCLUDE_TEST` and `INCLUDE_AUTH` config fields
- Updated all template references across CLAUDE.md, rules files, skills, CONTRIBUTING.md, README tree, REPO-ARCHITECTURE.md diagram, and IMPROVEMENTS.md

### Removed
- Deleted `HtmlAndGasTemplateAutoUpdatehtml.version.txt` (unused template version file)
- Deleted old template files replaced by auth/noauth variants: `HtmlAndGasTemplateAutoUpdate.html.txt`, `gas-minimal-template-code.js.txt`, `gas-test-template-code.js.txt`

#### `gas-project-creator.html` — v01.06w

##### Changed
- Template loading now fetches all 4 GAS template variants based on both test and auth checkbox selections
- Config JSON output includes `INCLUDE_TEST` and `INCLUDE_AUTH` fields for automated template selection

## [v02.21r] — 2026-03-11 08:06:00 PM EST

### Added
- Google Authentication checkbox placeholder on GAS project creator page (checked by default, not yet wired up — will control auth gate in both GAS & HTML templates)

#### `gas-project-creator.html` — v01.05w

##### Added
- New checkbox option for Google Authentication (placeholder for future template integration)

## [v02.20r] — 2026-03-11 07:46:13 PM EST

### Changed
- Clarified GAS template checkbox wording on project creator page — "full-featured UI" → "test/diagnostic features" to indicate the checked option is for verifying Google connections, not production use

#### `gas-project-creator.html` — v01.04w

##### Changed
- Template selection checkbox label updated to clarify test/diagnostic purpose

## [v02.19r] — 2026-03-11 07:38:27 PM EST

### Added
- Template selection checkbox on GAS project creator page — defaults to minimal template (version display + auto-update only), checkbox enables full-featured template (sound, quotas, sheet embed, buttons)

### Changed
- Renamed `gas-project-creator-code.js.txt` → `gas-test-template-code.js.txt` and made `gas-minimal-template-code.js.txt` the default GAS template across the repo (setup script, CLAUDE.md Pre-Commit #19, rules files, skills, README tree, REPO-ARCHITECTURE.md diagram)

#### `gas-project-creator.html` — v01.03w

##### Added
- Template selection checkbox — choose between minimal (version + auto-update only) or full-featured (sound, quotas, sheet embed, buttons) GAS template when copying Code.gs

## [v02.18r] — 2026-03-11 07:23:14 PM EST

### Added
- Created `live-site-pages/templates/gas-minimal-template-code.js.txt` — minimal GAS template that strips all visible features (sound, vibrate, quotas, sheet iframe, B1 polling, buttons) while preserving the version display in the bottom-left corner and the full auto-update mechanism (pullAndDeployFromGitHub, postMessage version-check listener, doPost deploy action)

### Changed
- Updated README.md tree and REPO-ARCHITECTURE.md diagram to include the new minimal GAS template

## [v02.17r] — 2026-03-11 07:05:44 PM EST

### Changed
- Restructured `IMPROVED-GOOGLE-OAUTH-PATTERN.md` with GAS-heavy design philosophy — added "GAS vs HTML Responsibility Split" section (Section 3) showing ~80% of auth logic in GAS backend vs ~20% irreducible browser minimum in HTML, renamed HTML section to "Minimal HTML Shell" with explicit callouts on why each piece must be browser-side, added auth-logic split percentages to Three-Pattern Comparison table, and added security checklist items verifying no auth logic leaks into the wrapper

## [v02.16r] — 2026-03-11 06:55:13 PM EST

### Added
- Created `repository-information/IMPROVED-GOOGLE-OAUTH-PATTERN.md` — improved Google OAuth authentication pattern combining GIS OAuth2 sign-in with server-side session management (CacheService), eliminating client-side token exposure, adding configurable session TTL, automatic token refresh, origin-validated postMessage, and optional single-session enforcement and inactivity timeout

## [v02.15r] — 2026-03-11 06:42:02 PM EST

### Added
- Created `repository-information/GOOGLE-OAUTH-AUTH-PATTERN.md` — comprehensive reference documenting the Google Identity Services (GIS) OAuth2 authentication pattern derived from `testaed.gs` + `testaed.html`, including OAuth2 token flow, server-side validation via Google's userinfo API, spreadsheet-based authorization, postMessage protocol, and comparison with the Custom Auth pattern

## [v02.14r] — 2026-03-11 04:15:02 PM EST

### Changed
- Renamed `GOOGLE-AUTH-PATTERN.md` to `CUSTOM-AUTH-PATTERN.md` — clarifies that this is a custom username/password auth system, not Google OAuth/SSO
- Updated file title, description, and README tree entry to reflect the rename

## [v02.13r] — 2026-03-11 03:52:24 PM EST

### Added
- Created `repository-information/GOOGLE-AUTH-PATTERN.md` — comprehensive reference documenting the Google Apps Script authentication pattern (session tokens, custom domain iframe wrapper, login flow, security features) derived from `dchrcalendar.gs` + `dchrcalendar.html` for future implementation reuse

### Changed
- Rotated 23 sections from 2026-03-08 date group to CHANGELOG-archive.md (archive rotation triggered at 112 sections)

## [v02.12r] — 2026-03-11 02:35:52 PM EST

### Changed
- Moved Commands section in README.md from above Project Structure to below it
- Added Origin column (Custom / Imported / Bundled) to all three command tables indicating the source of each command

## [v02.11r] — 2026-03-11 02:32:16 PM EST

### Fixed
- Rotated v01.01r (2026-03-07) date group from CHANGELOG.md to CHANGELOG-archive.md — was missed in previous push due to incorrect rotation logic short-circuit

### Changed
- Added "Mandatory first rotation" step (step 4) to CHANGELOG-archive.md rotation logic — prevents skipping directly to the non-exempt re-check without rotating at least one date group when the trigger fires
- Updated CLAUDE.md Pre-Commit #6 archive rotation quick rule to explicitly state that at least one date group must be rotated when the trigger fires
- Updated SHA enrichment step reference in CLAUDE.md from step 5 to step 6 (renumbered after new step insertion)

## [v02.10r] — 2026-03-11 02:25:09 PM EST

### Added
- Added "Commands" section to README.md above Project Structure — lists all 16 slash commands and conversational commands organized into Repo Workflow, Code Quality, and Design & Tooling categories with descriptions and links to skill files

## [v02.09r] — 2026-03-11 01:59:47 PM EST

### Removed
- Removed `STATUS.md` entirely — was redundant with the README tree which already shows versions, links, and origin labels
- Removed Pre-Commit #5 (STATUS.md version sync) and renumbered all subsequent items (#6→#5, #7→#6, ..., #20→#19)
- Removed STATUS.md handling from `init-repo.sh` (file list, Phase 3 placeholder, Origin column update)
- Removed Phase 7 (STATUS.md updates) from `setup-gas-project.sh` and renumbered subsequent phases
- Removed STATUS.md from `gas-project-creator-diagram.md` CL4 node and regenerated mermaid.live URL
- Removed STATUS.md references from CLAUDE.md cross-references (Template Variables, Template Repo Guard, MULTI_SESSION_MODE, Reconcile, Repo Audit, Setup GAS Project, Initialize)
- Removed STATUS.md references from repo-docs.md, html-pages.md, init-scripts.md, SUPPORT.md, TOKEN-BUDGETS.md, initialize SKILL.md, reconcile SKILL.md
- Removed STATUS.md entry from README.md structure tree
- Removed STATUS.md relationship from REPO-ARCHITECTURE.md ER diagram and regenerated mermaid.live URL

## [v02.08r] — 2026-03-11 10:43:20 AM EST

### Added
- Added mermaid.live link to testenvironment per-environment diagram (was missing)
- Added explicit mermaid.live link reminder to the "Adding new pages" checklist in `repo-docs.md`

## [v02.07r] — 2026-03-11 10:32:21 AM EST

### Changed
- Expanded Pre-Commit #6 to trigger on behavioral/functional code changes that affect diagrams — not just structural (file add/move/delete) changes. Diagrams now must be checked and updated whenever code they depict is modified (e.g. polling logic, CI/CD steps, GAS behavior)
- Updated `repo-docs.md` diagram scope description to match the expanded trigger

## [v02.06r] — 2026-03-11 10:22:38 AM EST

### Changed
- Replaced template-identity labels in REPO-ARCHITECTURE.md diagrams with generic labels — mindmap root `Template Repo` → `System Architecture`, git graph initial commit `Template repo` → `Initial commit` — so diagrams are accurate on both template and forks without requiring init-time changes

## [v02.05r] — 2026-03-11 10:05:48 AM EST

### Added
- Added "Diagram accuracy requirements" rule to `repo-docs.md` — 7 criteria for ensuring all diagrams faithfully represent actual source code: cross-reference against source, no invented interactions, server-side vs client-side distinction, real code path mapping, accurate timing/sequencing, maintenance mode structural accuracy, and mermaid.live URL verification

## [v02.04r] — 2026-03-11 10:02:26 AM EST

### Changed
- Fixed inaccurate GAS Self-Update Loop in REPO-ARCHITECTURE.md sequence diagram (section 2) — removed false `postMessage({type: gas-reload})` and `Reload GAS iframe` steps; replaced with accurate two-phase flow: server-side GAS self-update (triggered by workflow POST) and client-side GAS version polling (gs.version.txt polling triggers full page reload, not iframe-only reload)

## [v02.03r] — 2026-03-11 09:53:21 AM EST

### Changed
- Rewrote template-level state diagram in REPO-ARCHITECTURE.md section 3 for accuracy — replaced simplified abstraction with faithful state machines showing HTML version polling (with maintenance mode as conditional branch), GAS version polling (with anti-sync mechanism and 15s initial delay), post-reload splash/sound lifecycle, and audio unlock lifecycle

## [v02.02r] — 2026-03-11 09:37:46 AM EST

### Changed
- Replaced combined flowchart in REPO-ARCHITECTURE.md section 3 with a `stateDiagram-v2` showing Auto-Refresh Loop, GAS Iframe interaction, and Maintenance Mode as template-level state machines
- Updated environment scope rule in `repo-docs.md` to include maintenance mode in the template-level exception

## [v02.01r] — 2026-03-11 09:32:02 AM EST

### Changed
- Combined auto-refresh loop and GAS self-update loop into a single unified template behaviors diagram in REPO-ARCHITECTURE.md section 3, showing the connection between the two loops (GAS postMessage triggers browser reload)
- Added mermaid.live interactive editor link for the combined template behaviors diagram

## [v02.00r] — 2026-03-11 09:20:23 AM EST

### Changed
- Re-added auto-refresh loop and GAS self-update loop diagrams to REPO-ARCHITECTURE.md section 3 as template-level behaviors — these are inherited by all pages via the HTML/GAS templates and only change when templates change
- Added auto-refresh polling and GAS self-update sequences back to the sequence diagram (section 2) as template behaviors
- Updated environment scope rule in `repo-docs.md` to clarify that template-level behaviors (auto-refresh, GAS self-update) belong in REPO-ARCHITECTURE.md while environment-specific internals remain in per-environment diagrams

## [v01.99r] — 2026-03-11 09:10:29 AM EST

### Changed
- Simplified REPO-ARCHITECTURE.md to show environments as nodes without internal processes — auto-refresh loops, GAS self-update loops, and page lifecycle states moved to per-environment diagrams in `repository-information/diagrams/`
- Replaced detailed file-listing subgraphs with collapsed environment nodes and shared resource groups
- Simplified sequence diagram to deploy flow and runtime data flow only (removed internal loop details)
- Replaced state diagram section with per-environment diagram reference table
- Added `ENV_DIAGRAM` entity to ER diagram and `EnvironmentDiagram` class to class diagram showing the per-environment documentation relationship
- Added environment scope rule to `repo-docs.md` — REPO-ARCHITECTURE.md must not include environment-internal processes going forward

## [v01.98r] — 2026-03-11 08:55:52 AM EST

### Changed
- Renamed `ARCHITECTURE.md` to `REPO-ARCHITECTURE.md` — updated all references across 14 files (CLAUDE.md, README.md, SUPPORT.md, TOKEN-BUDGETS.md, SESSION-CONTEXT.md, CHANGELOG.md, repo-docs.md, html-pages.md, init-repo.sh, setup-gas-project.sh, new-page skill, diff-review skill, skill-creator skill, gas-project-creator-diagram.md)
- Renamed README sub-dividers from "Internal Use" → "Internal Sites" and "External Use" → "External Sites"

## [v01.97r] — 2026-03-11 08:39:01 AM EST

### Changed
- Swapped emoji order from `🟢🌐` to `🌐🟢` (and `🟡🌐` to `🌐🟡`) in end-of-response URL labels across chat-bookends rules
- Added "Public Website", "Internal Use", and "External Use (Placeholder)" sub-dividers to README project structure under live-site-pages

## [v01.96r] — 2026-03-11 08:17:52 AM EST

### Fixed
- Updated GitHub Actions to Node.js 24-compatible versions: `actions/checkout@v4` → `@v5`, `actions/upload-pages-artifact@v3` → `@v4`

## [v01.95r] — 2026-03-11 08:08:09 AM EST

### Changed
- Renamed "test" environment to "testenvironment" — all files, directories, and references updated across the repo (HTML page, GAS script, config, changelogs, version files, diagram, workflow, README tree, STATUS.md, REPO-ARCHITECTURE.md, gas-scripts.md)


