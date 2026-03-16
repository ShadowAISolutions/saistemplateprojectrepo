# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 43/100`

## [Unreleased]

## [v04.07r] — 2026-03-16 09:31:35 AM EST

### Changed
- Added full diagnostic output to all attack types in test 02 (session forgery) — Attack 1 (storage injection) now shows auth wall state, display, app visibility, stored session/email; Attack 2 (forged gas-session-created) now shows full auth wall diagnostics, iframe src, and notes GAS-side validation as real defense; Attack 3 (messageKey overwrite) now shows auth wall state and key ownership evidence
- Added full diagnostic output to all attack types in test 03 (message type injection) — Attack 1 (prototype pollution) now shows proto properties, auth wall state; Attack 2 (DoS sign-out) now shows auth wall state, session/email, messageKey status; Attack 3 (state machine confusion) now shows full auth wall and session diagnostics for both sub-tests; Attack 4 (type coercion) now shows auth wall and session state instead of assuming silent drop
- Added full diagnostic output to all attack types in test 04 (CSRF/token replay) — Attack 1 (fake OAuth) now shows full auth wall diagnostics; Attack 2 (nonce bypass) now shows auth wall and session state; Attack 3 (GAS probing) now shows response body preview and detection flags; Attack 4 (URL leakage) now shows location, session state, and cookies

## [v04.06r] — 2026-03-16 09:23:01 AM EST

### Changed
- Added full diagnostic output to all 4 attack types in offensive security test 01 — Attack 3 (raw XSS strings) now checks for XSS execution, session storage, and navigation hijack; Attack 4 (signature bypass) now shows auth wall state, session storage, and email diagnostics. All attacks now prove their BLOCKED results with visible evidence instead of assuming success

## [v04.05r] — 2026-03-16 09:15:52 AM EST

### Changed
- Added full diagnostic output to test 01 Attack 2 instead of silencing failures — each bypassed attack now prints `location.href`, auth wall state, stored session/email, and all check results so the actual behavior is visible and can be evaluated honestly

## [v04.04r] — 2026-03-16 09:11:26 AM EST

### Fixed
- Fixed second false positive in test 01 Attack 2 — redirect hijack detection was using `page.url` (Playwright) which reflects iframe navigations, not just top-level. Replaced with `window.location.href` (JavaScript) to check only the main page origin. The `gas-session-created` handler legitimately reloads the GAS iframe (`gasApp.src = ...`), which is normal behavior, not an attack

## [v04.03r] — 2026-03-16 09:05:59 AM EST

### Fixed
- Fixed false positives in offensive security test 01 (Attack 2: XSS in known message fields) — test was detecting the page's own pre-existing inline scripts as "injected" because it searched all `<script>` elements for "alert". Replaced with precise detection: baseline script count comparison, alert/prompt/confirm override traps, innerHTML inspection of rendered elements, and navigation hijack check. Tests now correctly report BLOCKED when values land in safe sinks (`.textContent`, `setItem()`)

## [v04.02r] — 2026-03-16 08:47:20 AM EST

### Added
- Offensive security test suite (`tests/offensive-security/`) with 4 standalone Playwright-based attack scripts targeting testauth1 auth system
  - Test 01: XSS via postMessage injection (unknown types, poisoned fields, raw payloads, signature bypass)
  - Test 02: Session token forgery & fixation (storage injection, forged gas-session-created, messageKey overwrite race)
  - Test 03: Message type spoofing & protocol confusion (prototype pollution, DoS via forced sign-out, state machine confusion, type coercion)
  - Test 04: OAuth token replay & CSRF (fabricated tokens, nonce bypass, direct GAS endpoint probing, token leakage check)

## [v04.01r] — 2026-03-15 10:29:39 PM EST

### Security
- SessionAuditLog sheet now gets the same tamper-resistant protection as DataAuditLog when auto-created

#### `testauth1.gs` — v01.42g

##### Security
- Added `sheet.protect()` with warning-only mode to `_writeAuditLogEntry()` for parity with DataAuditLog sheet protection

## [v04.00r] — 2026-03-15 10:24:53 PM EST

### Changed
- Renamed session audit log spreadsheet tab from `AuditLog` to `SessionAuditLog` for clarity alongside the existing `DataAuditLog` tab

#### `testauth1.gs` — v01.41g

##### Changed
- `AUDIT_LOG_SHEET_NAME` renamed from `AuditLog` to `SessionAuditLog` in both standard and hipaa presets

## [v03.99r] — 2026-03-15 10:21:09 PM EST

### Added
- Each saved patient note now receives a unique resource ID (UUID) in the Data Audit Log, enabling individual record tracing

#### `testauth1.gs` — v01.40g

##### Added
- `saveNote()` generates a UUID via `Utilities.getUuid()` and passes it as `resourceId` to the data audit log

## [v03.98r] — 2026-03-15 10:15:14 PM EST

### Security
- Session token in Data Audit Log Details JSON column is now truncated to 8 characters (was previously full token) to prevent token theft from audit spreadsheets

#### `testauth1.gs` — v01.39g

##### Security
- Session ID truncated in Details JSON to match SessionId column truncation, with undo comment for easy reversal

## [v03.97r] — 2026-03-15 10:07:11 PM EST

### Fixed
- Fixed client IP still blank — added direct XHR fetch (`XMLHttpRequest` to `api.ipify.org`) inside GAS iframe as primary method, with host-page postMessage as fallback. Previous approach relied solely on cross-frame postMessage which may not reach nested Google wrapper iframes

#### `testauth1.gs` — v01.38g

##### Fixed
- Client IP now fetched directly via `XMLHttpRequest` in GAS iframe (dual-path: XHR primary, host postMessage fallback)

## [v03.96r] — 2026-03-15 09:59:28 PM EST

### Fixed
- Fixed client IP always blank in audit logs — moved IP fetch from GAS iframe (blocked by sandbox CSP) to host page, then forwarded to GAS iframe via `host-client-ip` postMessage
- Added `api.ipify.org` to host page CSP `connect-src` directive
- `saveNote()` now receives `clientIp` directly as a parameter from the GAS iframe, with fallback to session-stored IP from heartbeat

#### `testauth1.gs` — v01.37g

##### Fixed
- Client IP now reliably reaches audit logs — `saveNote()` accepts `clientIp` as direct parameter instead of relying on heartbeat round-trip
- Removed `api.ipify.org` fetch from GAS iframe (sandbox blocks it), replaced with `host-client-ip` postMessage listener

#### `testauth1.html` — v01.99w

##### Fixed
- Client IP fetch moved to host page level where CSP allows it
- IP forwarded to GAS iframe via `host-client-ip` postMessage on `gas-auth-ok`

## [v03.95r] — 2026-03-15 09:38:50 PM EST

### Added
- EMR Security Hardening Phase 7: IP logging — client IP fetched via `api.ipify.org` in GAS iframe, passed through heartbeat URL, stored in session data, and included in audit log entries for post-incident investigation (HIPAA § 164.312(d))
- EMR Security Hardening Phase 8: Data-level audit logging — `dataAuditLog()` function writes per-operation HIPAA audit records (who, what, when, which record) to a dedicated `DataAuditLog` sheet with auto-creation and sheet protection (HIPAA § 164.312(b))
- `ENABLE_IP_LOGGING` toggle in both GAS presets — `false` (standard) skips IP fetch, `true` (HIPAA) enables client IP collection and audit trail
- `ENABLE_DATA_AUDIT_LOG` and `DATA_AUDIT_LOG_SHEET_NAME` toggles in both GAS presets — `false` (standard) skips per-operation logging, `true` (HIPAA) logs every data read/write to a separate audit sheet
- `ENABLE_IP_LOGGING` toggle in HTML_CONFIG — controls whether client IP is captured and forwarded in heartbeat requests

#### `testauth1.gs` — v01.36g

##### Added
- Client IP fetch via `api.ipify.org` in GAS iframe authenticated HTML (toggle-gated by `ENABLE_IP_LOGGING`)
- Client IP included in `gas-user-activity` postMessage to host page
- Client IP stored in session data during heartbeat for data operation correlation
- Client IP included in heartbeat audit log entries (session expiry events)
- `dataAuditLog()` function with auto-creating `DataAuditLog` sheet, sheet protection, and HIPAA-required columns (Timestamp, User, Action, ResourceType, ResourceId, Details, SessionId, IsEmergencyAccess)
- `saveNote()` now calls `dataAuditLog()` for per-operation audit trail
- `validateSessionForData()` now returns `clientIp` and `isEmergencyAccess` for downstream audit logging

#### `testauth1.html` — v01.98w

##### Added
- `ENABLE_IP_LOGGING` toggle in HTML_CONFIG
- `_clientIp` variable captures client IP from GAS iframe `gas-user-activity` messages
- Client IP forwarded in heartbeat URL as `clientIp` parameter

## [v03.94r] — 2026-03-15 09:27:39 PM EST

### Added
- Plan 11: EMR GAS Application Layer Plan — HIPAA data access and business logic covering RBAC, minimum necessary access, input validation, PHI segmentation, data retention, consent tracking, and disclosure logging

## [v03.93r] — 2026-03-15 08:44:53 PM EST

### Added
- EMR Security Hardening Phase 4: DOM clearing on session expiry — GAS iframe destroyed (`about:blank`) when session expires to prevent PHI exposure via DevTools (HIPAA § 164.312(a)(2)(iii), § 164.312(c)(1))
- EMR Security Hardening Phase 6: Escalating account lockout — three-tier system (5min → 30min → 6hr) replacing flat 5-failure rate limit (HIPAA § 164.312(d), NIST SP 800-63B § 5.2.2)
- `ENABLE_DOM_CLEARING_ON_EXPIRY` toggle in both GAS presets and HTML_CONFIG — `false` (standard) preserves overlay-only behavior, `true` (HIPAA) destroys iframe content
- `ENABLE_ESCALATING_LOCKOUT` toggle in both GAS presets — `false` (standard) preserves flat 5/5min rate limit, `true` (HIPAA) enables tiered lockout
- Client-side error messages for `account_locked` and `rate_limited` login failures

#### `testauth1.html` — v01.97w

##### Added
- DOM clearing on session expiry — GAS iframe replaced with `about:blank` to destroy any patient data in the DOM
- GAS iframe auto-reload on re-authentication after DOM clearing
- User-facing error messages for account lockout and rate limiting

#### `testauth1.gs` — v01.35g

##### Added
- `ENABLE_DOM_CLEARING_ON_EXPIRY` toggle in standard (`false`) and HIPAA (`true`) presets
- `ENABLE_ESCALATING_LOCKOUT` toggle in standard (`false`) and HIPAA (`true`) presets
- Escalating lockout: Tier 1 (5 failures/5min), Tier 2 (10 failures/30min), Tier 3 (20 failures/6hr)
- Dynamic lockout TTL computation for rate limit counter persistence

## [v03.92r] — 2026-03-15 08:28:17 PM EST

### Fixed
- Fixed false "Session expiring soon" warning after "Use Here" tab reclaim — the `gas-auth-ok` handler's `needsReauth` check now correctly skips when `_directSessionLoad` was active (server-side session may be near expiry, but the client just reset its rolling timer and the next heartbeat will extend it)

#### `testauth1.html` — v01.96w

##### Fixed
- "Session expiring soon" warning no longer appears incorrectly after reclaiming a session with "Use Here"

## [v03.91r] — 2026-03-15 08:12:32 PM EST

### Fixed
- Fixed absolute session timer resetting on "Use Here" — `stopCountdownTimers()` in the `tab-claim` handler was clearing `ABSOLUTE_START_KEY` from sessionStorage; the key is now preserved across the stop/start cycle so the absolute timer continues from the original sign-in

#### `testauth1.html` — v01.95w

##### Fixed
- Reclaiming a session with "Use Here" now correctly preserves the absolute session timer countdown

## [v03.90r] — 2026-03-15 08:07:39 PM EST

### Fixed
- Fixed GAS iframe not reappearing after "Use Here" — the visibility restore was in the `gas-session-created` handler but GAS sends `gas-auth-ok` for valid session reloads; moved the `_directSessionLoad` visibility restore and deferred `showApp()`/timer start to the `gas-auth-ok` handler

#### `testauth1.html` — v01.94w

##### Fixed
- GAS app now properly reappears after clicking "Use Here" — the app UI and timers are activated once the GAS server confirms the session is valid

## [v03.89r] — 2026-03-15 08:03:31 PM EST

### Fixed
- "Use Here" tab reclaim no longer resets the absolute session timer — the absolute timer now continues from the original sign-in time instead of restarting, preventing indefinite session extension via tab switching

#### `testauth1.html` — v01.93w

##### Fixed
- Reclaiming a session with "Use Here" no longer resets the absolute session timer — the timer continues from when you originally signed in

## [v03.88r] — 2026-03-15 07:59:08 PM EST

### Fixed
- Eliminated GAS iframe flicker when clicking "Use Here" — the iframe is now hidden during reload and revealed only after `gas-session-created` confirms the GAS app is ready, and the unnecessary double-reload (from the OAuth token-exchange path) is skipped when the iframe was loaded directly with a session token

#### `testauth1.html` — v01.92w

##### Fixed
- Clicking "Use Here" no longer causes a brief GAS iframe flicker — the app appears smoothly after the session is confirmed

## [v03.87r] — 2026-03-15 07:51:52 PM EST

### Fixed
- Same-browser "Use Here" button now transfers the valid session token from the claiming tab to the surrendering tab via BroadcastChannel — previously the surrendering tab's sessionStorage had a stale token, causing a brief app flash followed by "Session expired" when reclaiming

#### `testauth1.html` — v01.91w

##### Fixed
- Clicking "Use Here" on a tab that was displaced by another tab's sign-in now seamlessly reclaims the session instead of briefly showing the app then signing you out

## [v03.86r] — 2026-03-15 07:40:16 PM EST

### Changed
- GAS iframe user activity now updates the heartbeat activity timestamp instead of forcing an immediate heartbeat — the regular interval tick and urgent <30s heartbeat handle session extension, eliminating unnecessary server requests during normal interaction

#### `testauth1.html` — v01.90w

##### Changed
- Interacting with the app (typing, clicking) no longer forces an immediate heartbeat — activity is tracked and the regular heartbeat cycle handles session extension naturally

## [v03.85r] — 2026-03-15 07:29:52 PM EST

### Fixed
- Activity-triggered heartbeats now respect a cooldown (half the heartbeat interval) to prevent flooding the server with requests on every user interaction — previously every GAS iframe action triggered an immediate heartbeat every 5 seconds
- Heartbeat requests now auto-clear after 15 seconds if the server response never arrives, preventing the heartbeat from getting permanently stuck on "sending..."

#### `testauth1.html` — v01.89w

##### Fixed
- Interacting with the app no longer causes constant "sending..." in the heartbeat display — heartbeats are now rate-limited to once per 15 seconds during active use
- Heartbeat can no longer get permanently stuck on "sending..." if a server response is lost

## [v03.84r] — 2026-03-15 06:58:02 PM EST

### Fixed
- Fixed blank GAS iframe when clicking "Use Here" on a non-original tab — the `_expectingSession` guard was incorrectly suppressing the `gas-needs-auth` response from an invalidated session token, leaving the app visible with no GAS content and eventually re-triggering the "Session Active Elsewhere" overlay

#### `testauth1.html` — v01.88w

##### Fixed
- Clicking "Use Here" on a tab whose server session was invalidated (by signing in on another tab) now properly shows the sign-in screen instead of a blank GAS iframe

## [v03.83r] — 2026-03-15 06:46:09 PM EST

### Added
- EMR Security Hardening Phase 3: Server-side data operation validation — every `google.script.run` data function now validates the session before executing
- New `ENABLE_DATA_OP_VALIDATION` toggle in both presets (off for standard, on for HIPAA)
- New `validateSessionForData()` gate function with HMAC verification, absolute/rolling timeout checks, and eviction detection
- New server-side `saveNote()` function using the session gate (replaces client-side simulation)
- New `gas-session-invalid` postMessage type for data operation session failures
- Session token now embedded in authenticated app HTML for `google.script.run` calls

#### `testauth1.gs` — v01.34g

##### Added
- `ENABLE_DATA_OP_VALIDATION` config toggle — gates server-side session re-validation on data operations
- `validateSessionForData()` — session gate function that validates token, HMAC, and timeouts before any data access
- `saveNote()` — server-side data operation with session validation and audit logging

##### Changed
- Save Note button now calls server-side `saveNote()` via `google.script.run` instead of client-side simulation

#### `testauth1.html` — v01.87w

##### Added
- `gas-session-invalid` message type in whitelist and handler — triggers auth wall with specific reason when a data operation detects an invalid session

## [v03.82r] — 2026-03-15 06:35:54 PM EST

### Changed
- Sign-in error messages now surface specific misconfiguration details instead of generic "Access denied" — HMAC secret missing, domain restriction misconfigured, and domain not allowed each show distinct setup instructions

#### `testauth1.gs` — v01.33g

##### Changed
- URL and postMessage token exchange error handlers now detect HMAC-specific errors and pass `hmac_secret_missing` error code instead of generic `server_error`

#### `testauth1.html` — v01.86w

##### Changed
- Auth wall now shows specific setup instructions for `hmac_secret_missing`, `domain_not_configured`, and `domain_not_allowed` errors instead of generic "Access denied"

## [v03.81r] — 2026-03-15 06:26:01 PM EST

### Changed
- Implemented EMR Security Hardening Phase 1: HMAC secret enforcement — `generateSessionHmac()` now throws when HMAC is enabled but secret is missing (fail-closed), `verifySessionHmac()` returns false instead of passing through
- Implemented EMR Security Hardening Phase 2: Domain restriction validation — empty allowlist with `ENABLE_DOMAIN_RESTRICTION: true` now returns `domain_not_configured` error with security alert audit log instead of silently rejecting all domains

#### `testauth1.gs` — v01.32g

##### Changed
- HMAC generation now fails closed when secret is missing — throws error with setup instructions instead of silently returning empty string
- HMAC verification now fails closed when secret is missing — rejects sessions instead of passing through
- Domain restriction check now explicitly validates non-empty allowlist before iterating — distinguishes misconfiguration from domain rejection

## [v03.80r] — 2026-03-15 06:17:29 PM EST

### Changed
- Added "Implementation Risk Areas (Toggle Architecture)" section to EMR security hardening plan — documents three specific integration risks (Phase 3 stub return value, Phase 4 server/client config boundary, Phase 6 branching flow control) with concrete mitigations for each

## [v03.79r] — 2026-03-15 06:04:51 PM EST

### Changed
- Updated EMR security hardening plan (`10-EMR-SECURITY-HARDENING-PLAN.md`) to be fully preset-aware — all 8 phases now explicitly document behavior under both `standard` and `hipaa` presets
- Added Preset Behavior Matrix showing each phase's toggle, preset values, and standard-mode behavior
- Added preset transition rules (standard→hipaa, hipaa→standard, PROJECT_OVERRIDES interaction)
- Added 5 new config toggles with explicit values for both presets: `ENABLE_DATA_OP_VALIDATION`, `ENABLE_DOM_CLEARING_ON_EXPIRY`, `ENABLE_ESCALATING_LOCKOUT`, `ENABLE_IP_LOGGING`, `ENABLE_DATA_AUDIT_LOG`
- Updated "What Changed Since Plan 9.2" table with Standard Preset column
- Added toggle guards to code examples: `validateSessionForData()`, `showAuthWall()` DOM clearing, escalating lockout, IP fetch, data audit log

## [v03.78r] — 2026-03-15 05:47:26 PM EST

### Changed
- Rotated 86 CHANGELOG sections (v03.64r–v02.69r, dates 2026-03-14 and 2026-03-13) to CHANGELOG-archive.md — keeping only today's 13 sections in the main file
- SHA-enriched 18 section headers with commit links (v03.47r–v03.64r); 68 older sections moved as-is due to shallow git history

## [v03.77r] — 2026-03-15 05:40:03 PM EST

### Changed
- Renamed all plan files from single-digit prefixes (1- through 9.2-) to zero-padded prefixes (01- through 09.2-) for correct alphabetical sorting on GitHub — 10-EMR plan now appears last as intended
- Updated all cross-references across 20+ files (plan files, README tree, CHANGELOG, CHANGELOG-archive, SESSION-CONTEXT, MICROSOFT-AUTH-PLAN)

## [v03.76r] — 2026-03-15 05:33:32 PM EST

### Added
- Comprehensive EMR security hardening plan (`10-EMR-SECURITY-HARDENING-PLAN.md`) covering 8 implementation phases across P0–P3 priorities for HIPAA Technical Safeguards compliance
- Plan includes: HMAC fail-closed enforcement, domain restriction validation, server-side data operation session gates, DOM clearing on session expiry, emergency/break-glass access, escalating account lockout, IP audit logging, and data-level audit logging
- Architecture principle documented: patient data (PHI) exclusively on GAS/Google Sheets side (BAA-covered), never in browser storage or CacheService
- CacheService usage guide, quota impact analysis, edge cases, and EMR deployment configuration checklist

## [v03.75r] — 2026-03-15 03:36:50 PM EST

### Added
- GAS iframe activity detection: user interactions (typing, clicking) now trigger an immediate heartbeat on the host page, catching expired sessions before data loss
- "Save Note" test button in GAS UI for simulating EMR data entry with session validation

#### `testauth1.html` — v01.85w

##### Added
- `gas-user-activity` message handler that triggers immediate heartbeat when user interacts with GAS iframe content

#### `testauth1.gs` — v01.31g

##### Added
- Activity detection listeners (keydown, click, input) that post `gas-user-activity` to the host page with 5-second debounce
- "Save Note" test button simulating EMR data entry — triggers session check before confirming save

## [v03.74r] — 2026-03-15 01:22:15 PM EST

### Added
- Added "Force Heartbeat" button for on-demand session validity testing without waiting for the automatic heartbeat interval

#### `testauth1.html` — v01.84w

##### Added
- "Force Heartbeat" button for testing session validity on demand without waiting for the automatic heartbeat interval

## [v03.73r] — 2026-03-15 12:44:45 PM EST

### Added
- Implemented Phase 9 of cross-device session enforcement (Plan 9.2): 4 security tests validating cross-device config toggle, eviction state variable, heartbeat reason code processing, and overlay text reset behavior

#### `testauth1.html` — v01.83w

##### Added
- 4 security tests for cross-device enforcement: config toggle validation, state variable check, heartbeat reason code processing, and overlay text reset verification (tests 39–42, total now 42)

## [v03.72r] — 2026-03-15 12:39:33 PM EST

### Added
- Implemented Phases 4–7 of cross-device session enforcement (Plan 9.2): client-side handling of eviction reason codes in `testauth1.html` — cross-device eviction shows "Session Active Elsewhere" overlay with "Sign In Here" button, same-browser tab claims show original overlay text, and "Use Here" button correctly routes to auth wall for cross-device eviction vs session reclaim for same-browser

#### `testauth1.html` — v01.82w

##### Added
- Cross-device session detection: when another device signs in, a "Session Active Elsewhere" overlay appears with a "Sign In Here" button
- `CROSS_DEVICE_ENFORCEMENT` toggle in page configuration
- Overlay text automatically resets when switching between cross-device and same-browser session conflicts

## [v03.71r] — 2026-03-15 12:35:33 PM EST

### Added
- Implemented Phase 3 of cross-device session enforcement (Plan 9.2): `ENABLE_CROSS_DEVICE_ENFORCEMENT` toggle added to both `standard` and `hipaa` AUTH_CONFIG presets, gating tombstone writes in `invalidateAllSessions()`

#### `testauth1.gs` — v01.30g

##### Added
- `ENABLE_CROSS_DEVICE_ENFORCEMENT` configuration toggle in both auth presets — controls whether eviction tombstones are written during session invalidation

## [v03.70r] — 2026-03-15 12:31:39 PM EST

### Added
- Implemented Phase 2 of cross-device session enforcement (Plan 9.2): heartbeat handler now checks for eviction tombstone when session is missing and includes a `reason` field in `gas-heartbeat-expired` responses (`new_sign_in`, `timeout`, `corrupt_session`, `integrity_violation`, `absolute_timeout`)

### Security
- All `gas-heartbeat-expired` postMessage responses are now HMAC-signed (Phase 8) — previously only `gas-heartbeat-ok` was signed, allowing potential injection of fake expiration messages

#### `testauth1.gs` — v01.29g

##### Added
- Heartbeat expired responses now include a reason code indicating why the session ended
- Eviction tombstone lookup: heartbeat checks for `evicted_TOKEN` cache entry when session is missing

##### Security
- All session expiration notifications are now cryptographically signed to prevent message injection

## [v03.69r] — 2026-03-15 12:23:04 PM EST

### Added
- Implemented Phase 1 of cross-device session enforcement (Plan 9.2): eviction tombstone in `invalidateAllSessions()` — when a new device signs in, a short-lived `evicted_TOKEN` cache entry is written for each invalidated session so the heartbeat handler can distinguish cross-device eviction from natural timeout

#### `testauth1.gs` — v01.28g

##### Added
- Eviction tombstone mechanism: `cache.put("evicted_" + token, "new_sign_in", 300)` writes a 5-minute tombstone for each invalidated session during sign-in, enabling future heartbeat reason code differentiation

## [v03.68r] — 2026-03-15 01:50:59 AM EST

### Added
- Added heartbeat piggyback plan (`09.2-CROSS-DEVICE-SESSION-ENFORCEMENT-HEARTBEAT-PLAN.md`) — cross-device session enforcement by enhancing the existing heartbeat with eviction tombstones and reason codes, requiring zero new polling loops, zero new server functions, and ~60 lines of code vs ~200-300 in previous plans

## [v03.67r] — 2026-03-15 01:12:08 AM EST

### Added
- Added Drive file approach plan (`09.1.1-CROSS-DEVICE-SESSION-ENFORCEMENT-DRIVE-PLAN.md`) — alternative cross-device enforcement using public Google Drive beacon file polled via `<script>` tag injection, achieving zero server polling cost with documented tradeoffs (CDN caching unpredictability, XSS attack surface)

## [v03.66r] — 2026-03-15 12:41:10 AM EST

### Added
- Added revised cross-device session enforcement plan (`09.1-CROSS-DEVICE-SESSION-ENFORCEMENT-REVISED-PLAN.md`) — replaces `doGet(?check=)` polling with `google.script.run` internal RPC channel, eliminating 30x `doGet` overhead while maintaining the same detection speed and improving eviction message security (signed vs unsigned)

## [v03.65r] — 2026-03-15 12:06:26 AM EST

### Added
- Added cross-device single-session enforcement plan (`09-CROSS-DEVICE-SESSION-ENFORCEMENT-PLAN.md`) — 6-phase implementation covering GAS session check endpoint, client-side short polling, lifecycle wiring, and security considerations
