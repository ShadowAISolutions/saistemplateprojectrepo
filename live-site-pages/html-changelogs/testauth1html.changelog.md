# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 45/50`

## [Unreleased]

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

## [v01.44w] — 2026-03-13 11:38:31 PM EST — v03.09r

### Changed
- Status pins now stack vertically in the bottom-right corner — session timer on top, GAS version in the middle, HTML version on the bottom

## [v01.43w] — 2026-03-13 11:23:52 PM EST — v03.08r

### Added
- Session countdown pill now shows ▶ when your activity is being tracked

## [v01.42w] — 2026-03-13 11:17:21 PM EST — v03.07r

### Changed
- Session now lasts 1 hour instead of 2 hours
- Heartbeat checks happen every 5 minutes instead of every 10 minutes

## [v01.41w] — 2026-03-13 11:12:06 PM EST — v03.06r

### Changed
- Session now lasts 2 hours instead of 3 minutes
- Heartbeat checks happen every 10 minutes instead of every 30 seconds

## [v01.40w] — 2026-03-13 11:00:25 PM EST — v03.05r

### Removed
- Removed grace period delay before session expiry — sessions now expire immediately when the timer runs out

## [v01.39w] — 2026-03-13 10:46:46 PM EST — v03.04r

### Removed
- Removed false activity detection that kept the session active even when you weren't interacting

## [v01.38w] — 2026-03-13 10:39:53 PM EST — v03.03r

### Fixed
- Session no longer falsely shows activity when you switch to another tab or window

## [v01.37w] — 2026-03-13 10:34:59 PM EST — v03.02r

### Fixed
- Typing in text boxes inside the app now keeps your session active

## [v01.36w] — 2026-03-13 10:24:41 PM EST — v03.01r

### Fixed
- Heartbeat indicator now resets to idle after session extension instead of briefly flashing "ready"

## [v01.35w] — 2026-03-13 10:08:56 PM EST — v03.00r

### Fixed
- Heartbeat "ready" indicator now appears immediately when you interact with the page

## [v01.34w] — 2026-03-13 10:03:03 PM EST — v02.99r

### Changed
- Heartbeat countdown now shows a "ready" indicator when your session will be extended on the next heartbeat

## [v01.33w] — 2026-03-13 09:43:38 PM EST — v02.98r

### Added
- Session now extends immediately when you're active in the last 30 seconds before expiry, preventing unexpected sign-outs

## [v01.32w] — 2026-03-13 09:25:41 PM EST — v02.97r

### Changed
- Reverted heartbeat display to original approach for simplicity

## [v01.31w] — 2026-03-13 09:15:09 PM EST — v02.96r

### Fixed
- Fixed cursor flickering when heartbeat status updates in the session timer

## [v01.30w] — 2026-03-13 09:08:32 PM EST — v02.95r

### Fixed
- Fixed cursor flickering from text caret to pointer during heartbeat checks

## [v01.29w] — 2026-03-13 08:37:51 PM EST — v02.93r

### Fixed
- Session no longer times out while a heartbeat response is in transit — shows "extending..." instead of immediately signing out

## [v01.28w] — 2026-03-13 08:14:29 PM EST — v02.92r

### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

## [v01.27w] — 2026-03-13 07:15:58 PM EST — v02.90r

### Added
- Enhanced security for messages received from the app backend

### Changed
- Improved session handling and authentication flow reliability

### Removed
- Verbose debug logging from sign-in and session management

## [v01.26w] — 2026-03-13 11:32:09 AM EST — v02.70r

### Fixed
- Refreshing the sign-in page no longer auto-triggers the Google sign-in popup — you must click "Sign In with Google" to choose your account

## [v01.25w] — 2026-03-13 11:23:50 AM EST — v02.69r

### Fixed
- Signing out and refreshing the page no longer auto-signs you back in — you'll see the account picker to choose which account to use

Developed by: ShadowAISolutions
