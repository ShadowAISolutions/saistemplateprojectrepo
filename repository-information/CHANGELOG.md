# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 20/100`

## [Unreleased]

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
