# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 46/50`

## [Unreleased]

## [v01.90w] — 2026-03-15 07:40:16 PM EST — v03.86r

### Changed
- Interacting with the app no longer forces an immediate heartbeat — activity is tracked and the regular heartbeat cycle handles session extension naturally

## [v01.89w] — 2026-03-15 07:29:52 PM EST — v03.85r

### Fixed
- Interacting with the app no longer causes constant "sending..." in the heartbeat display — heartbeats are now rate-limited during active use
- Heartbeat can no longer get permanently stuck on "sending..." if a server response is lost

## [v01.88w] — 2026-03-15 06:58:02 PM EST — v03.84r

### Fixed
- Clicking "Use Here" on a tab whose session was ended (by signing in on another tab) now properly shows the sign-in screen instead of a blank page

## [v01.87w] — 2026-03-15 06:46:09 PM EST — v03.83r

### Added
- If a data operation (like Save Note) detects your session is no longer valid, the sign-in screen now appears automatically with a specific reason message

## [v01.86w] — 2026-03-15 06:35:54 PM EST — v03.82r

### Changed
- Sign-in errors now show specific setup instructions instead of generic "Access denied" — tells you exactly what's missing (e.g. HMAC secret, domain configuration)

## [v01.85w] — 2026-03-15 03:36:50 PM EST — v03.75r

### Added
- Interacting with the app (typing, clicking) now triggers an immediate session check — if your session was ended by another device, you see the overlay within seconds instead of waiting for the next automatic check

## [v01.84w] — 2026-03-15 01:22:15 PM EST — v03.74r

### Added
- "Force Heartbeat" button for testing session validity on demand without waiting for the automatic heartbeat interval

## [v01.83w] — 2026-03-15 12:44:45 PM EST — v03.73r

### Added
- 4 new security tests for cross-device session enforcement: configuration toggle, state tracking, heartbeat reason processing, and overlay text management (42 tests total)

## [v01.82w] — 2026-03-15 12:39:33 PM EST — v03.72r

### Added
- Cross-device session detection: if you sign in on another device or browser, this page now shows a "Session Active Elsewhere" overlay with a "Sign In Here" button instead of a generic expiration message
- Same-browser tab conflicts continue to show the original "session active in another tab" message with the "Use Here" reclaim button

## [v01.81w] — 2026-03-14 11:31:37 PM EST — v03.64r

### Changed
- Single-tab enforcement is now enabled — only one browser tab can be active at a time

## [v01.80w] — 2026-03-14 11:28:52 PM EST — v03.63r

### Added
- Single-tab enforcement — when enabled, only one browser tab can be active at a time (toggle in settings, off by default)

## [v01.79w] — 2026-03-14 11:05:05 PM EST — v03.62r

### Changed
- Session expiry warning now appears with 30 seconds left instead of 60, so interacting with the page immediately extends the session

## [v01.78w] — 2026-03-14 10:50:11 PM EST — v03.61r

### Changed
- Session and absolute expiry warning banners now display a live countdown showing time remaining

## [v01.77w] — 2026-03-14 10:39:09 PM EST — v03.60r

### Fixed
- Re-authentication now properly reloads the app after clicking Sign In on the expiry banner

## [v01.76w] — 2026-03-14 10:25:03 PM EST — v03.59r

### Fixed
- Clicking "Sign In" on the session expiry banner now properly reloads the app and resets all timers after re-authentication
- Countdown timers and heartbeat are stopped before starting the sign-in flow so they cannot trigger sign-out mid-authentication

## [v01.75w] — 2026-03-14 10:06:00 PM EST — v03.57r

### Changed
- Session expiry warning now says "interact with the page to stay signed in" instead of prompting to sign in again
- Absolute session expiry now shows its own warning banner with a sign-in button when time is nearly up
- Warning banners appear below the user info pill instead of across the top of the page
- Both banners stack neatly when both are visible at the same time

## [v01.74w] — 2026-03-14 09:30:14 PM EST — v03.56r

### Fixed
- Sound system no longer triggers a console warning on page load

## [v01.73w] — 2026-03-14 08:59:29 PM EST — v03.54r

### Changed
- Minor internal improvements

## [v01.72w] — 2026-03-14 08:53:11 PM EST — v03.53r

### Added
- Added placeholder favicon — no more missing icon in browser tab

## [v01.71w] — 2026-03-14 08:45:29 PM EST — v03.52r

### Fixed
- Fixed console warning appearing during normal sign-in flow

## [v01.70w] — 2026-03-14 08:31:03 PM EST — v03.50r

### Changed
- Removed 27 fake and trivial security tests that were testing variable assignments or DOM existence instead of actual behavior (38 real tests remain)

## [v01.69w] — 2026-03-14 08:19:27 PM EST — v03.49r

### Changed
- Merged "No document.write" and "No eval() Usage" tests into a single "Code Safety Scan" test (65 tests total)

## [v01.68w] — 2026-03-14 08:15:12 PM EST — v03.48r

### Fixed
- Fixed "No eval() Usage" security test failing with "allScripts is not defined" error

## [v01.67w] — 2026-03-14 08:05:17 PM EST — v03.47r

### Changed
- "Run Security Tests" button now shows all 66 tests as pending first, then a "Run All" button runs them one-by-one with live pass/fail transitions

## [v01.66w] — 2026-03-14 07:47:04 PM EST — v03.46r

### Fixed
- Fixed security tests causing sign-out and "Access denied" when clicking "Run Security Tests" — destructive function calls replaced with safe code inspection

## [v01.65w] — 2026-03-14 07:24:28 PM EST — v03.45r

### Changed
- Upgraded security tests from existence-only checks to behavioral verification — tests now actively call functions, verify side effects, and confirm state transitions instead of just checking if code exists

## [v01.64w] — 2026-03-14 07:12:06 PM EST — v03.44r

### Fixed
- Fixed three security test false positives: "document.write" and "eval()" tests no longer flag themselves, and clickjacking test correctly reports that frame-ancestors is an HTTP-header-only directive

## [v01.63w] — 2026-03-14 06:52:15 PM EST — v03.43r

### Added
- Expanded security tests from 23 to 65 — added CSP directive audits, OAuth configuration checks, sanitizer deep tests, session lifecycle verification, UI state checks, code safety scans, and storage security audits

## [v01.62w] — 2026-03-14 06:43:09 PM EST — v03.42r

### Fixed
- "Session expiring soon" warning now appears automatically when less than 60 seconds remain, instead of only showing on page refresh

## [v01.61w] — 2026-03-14 06:35:29 PM EST — v03.41r

### Fixed
- Fixed a console error (404) that appeared when running security tests

## [v01.60w] — 2026-03-14 06:29:20 PM EST — v03.40r

### Added
- Added 11 more security tests covering signature verification, iframe presence, token exchange method, CSP auditing, XSS vector testing, and session cleanup

## [v01.59w] — 2026-03-14 06:25:11 PM EST — v03.39r

### Fixed
- Fixed the "Changelog Sanitization" security test showing as failed

## [v01.58w] — 2026-03-14 06:21:23 PM EST — v03.38r

### Added
- Added a "Run Security Tests" button that verifies all implemented security features are working correctly

## [v01.57w] — 2026-03-14 06:10:46 PM EST — v03.37r

### Security
- Added protection against unauthorized sign-in attempts from other websites (CSRF defense)

## [v01.56w] — 2026-03-14 06:03:06 PM EST — v03.36r

### Security
- Added protection against replayed authentication messages
- Message signing key is now locked after first delivery to prevent tampering

## [v01.55w] — 2026-03-14 05:54:36 PM EST — v03.34r

### Security
- Authentication error messages now show a generic "Access denied" notice instead of detailed error information

## [v01.54w] — 2026-03-14 05:46:37 PM EST — v03.33r

### Security
- Added protection against unauthorized scripts and plugin injection
- Changelog content is now sanitized before display to prevent potential code injection

## [v01.53w] — 2026-03-14 02:11:03 PM EST — v03.23r

### Added
- Signing out now signs you out of all open tabs (previously only worked with the standard security mode)

## [v01.52w] — 2026-03-14 01:52:33 PM EST — v03.21r

### Changed
- Minor internal improvements

## [v01.51w] — 2026-03-14 01:25:57 PM EST — v03.20r

### Fixed
- Signing out and signing back in no longer gets stuck on the sign-in page

## [v01.50w] — 2026-03-14 01:09:05 PM EST — v03.18r

### Fixed
- Fixed sign-in getting stuck when using the hipaa security preset

## [v01.49w] — 2026-03-14 12:59:12 PM EST — v03.17r

### Fixed
- Fixed sign-in getting stuck after selecting a Google account

## [v01.48w] — 2026-03-14 12:53:45 PM EST — v03.16r

### Changed
- Sessions are now cleared when you close the browser tab (previously persisted across tabs)
- Sign-in tokens are now exchanged more securely (no longer visible in the browser address bar)

## [v01.47w] — 2026-03-14 12:46:13 PM EST — v03.15r

### Changed
- Minor internal improvements

## [v01.46w] — 2026-03-14 12:43:08 PM EST — v03.14r

### Changed
- Session now expires after 3 minutes (for testing — production: 1 hour)
- Absolute session limit reduced to 5 minutes (for testing — production: 16 hours)
- Activity checks now happen every 30 seconds (for testing — production: 5 minutes)

## [v01.45w] — 2026-03-14 12:32:39 PM EST — v03.12r

### Security
- Your sign-in credentials are now better protected from being accidentally shared with other websites
- Strengthened how sign-in tokens are transmitted between your browser and the app

Developed by: ShadowAISolutions
