# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 36/50`

## [Unreleased]

## [v02.17w] — 2026-03-17 07:14:06 PM EST — v04.52r

### Added
- Token exchange now uses a one-time cryptographic nonce — prevents forged session creation messages
- Non-token messages are now restricted to the expected server origin

## [v02.16w] — 2026-03-17 07:03:24 PM EST — v04.50r

### Fixed
- Sign-in now completes successfully — origin validation no longer blocks legitimate server messages

## [v02.15w] — 2026-03-17 06:56:06 PM EST — v04.49r

### Added
- Messages from unexpected origins are now blocked before processing — only legitimate Google server origins are accepted
- New security test validates the origin allowlist against spoofing patterns

## [v02.14w] — 2026-03-17 06:20:58 PM EST — v04.48r

### Fixed
- Security tests no longer get stuck on "Waiting to run" for tests that verify cryptographic signatures

## [v02.13w] — 2026-03-17 06:09:12 PM EST — v04.46r

### Added
- Messages from the server are now verified using HMAC-SHA256 cryptographic signatures (Web Crypto API)
- Dual-accept migration: both new HMAC-SHA256 and legacy signatures are accepted during transition

### Changed
- Security tests updated to validate the new cryptographic verification

## [v02.12w] — 2026-03-16 03:19:06 PM EST — v04.31r

### Added
- IP address validation before logging — malformed values are now rejected instead of stored as-is

## [v02.11w] — 2026-03-16 02:54:36 PM EST — v04.28r

### Changed
- "Signing in…" now shows a spinning ring, "Reconnecting…" now shows pulsing dots — visually distinct animations for each state

## [v02.10w] — 2026-03-16 02:50:53 PM EST — v04.27r

### Added
- Spinning loading indicator on the "Signing in…" and "Reconnecting…" screens

## [v02.09w] — 2026-03-16 02:40:38 PM EST — v04.26r

### Changed
- Tab count now updates instantly when the overlay appears instead of relying on a background timer

## [v02.08w] — 2026-03-16 02:33:18 PM EST — v04.25r

### Added
- "Session Active in Another Tab" overlay now shows how many other tabs have this page open

## [v02.07w] — 2026-03-16 02:22:46 PM EST — v04.24r

### Fixed
- Restored centering on the sign-in page

### Added
- "Signing in…" screen now appears after selecting your Google account while your session is being set up

## [v02.06w] — 2026-03-16 02:16:05 PM EST — v04.23r

### Changed
- Sign-in page now shows "Reconnecting… Verifying your session" during page reload instead of briefly showing the sign-in form
- "Use Here" button now shows "Reconnecting…" while verifying your session

## [v02.05w] — 2026-03-16 02:08:13 PM EST — v04.22r

### Fixed
- Restored logo display on the sign-in page
- Restored splash screen sound playback

## [v02.04w] — 2026-03-16 02:02:55 PM EST — v04.21r

### Security
- Stronger protection against unauthorized resource loading (deny-all fallback policy)
- Blocked web worker and manifest injection attacks
- Restricted image loading to trusted Google domains only (previously allowed any HTTPS source)
- Auto-upgrade protection for mixed content

## [v02.03w] — 2026-03-16 01:47:48 PM EST — v04.20r

### Security
- Added protection against form-based data exfiltration attacks

## [v02.02w] — 2026-03-16 10:29:43 AM EST — v04.11r

### Added
- Blocked attacks are now reported to the server for security monitoring

## [v02.01w] — 2026-03-16 09:57:31 AM EST — v04.09r

### Security
- Sign-in screen now stays visible during page reload until the server re-confirms your session is valid
- A second sign-in attempt from an untrusted source is now rejected entirely instead of overwriting your session

## [v02.00w] — 2026-03-16 09:43:13 AM EST — v04.08r

### Security
- Sign-in screen now stays visible until the server confirms your session is valid, preventing a potential UI spoofing issue

## [v01.99w] — 2026-03-15 09:59:28 PM EST — v03.96r

### Fixed
- Your IP address is now reliably captured for security audit records

## [v01.98w] — 2026-03-15 09:38:50 PM EST — v03.95r

### Added
- Your public IP address is now captured and forwarded to the server for security audit records

## [v01.97w] — 2026-03-15 08:44:53 PM EST — v03.93r

### Added
- Session expiry now fully clears any displayed data from the page (HIPAA mode) — prevents data from remaining visible in browser tools after your session ends
- Improved error messages when sign-in is blocked due to too many failed attempts

## [v01.96w] — 2026-03-15 08:28:17 PM EST — v03.92r

### Fixed
- "Session expiring soon" warning no longer appears incorrectly after reclaiming a session with "Use Here"

## [v01.95w] — 2026-03-15 08:12:32 PM EST — v03.91r

### Fixed
- Reclaiming a session with "Use Here" now correctly preserves the absolute session timer countdown

## [v01.94w] — 2026-03-15 08:07:39 PM EST — v03.90r

### Fixed
- GAS app now properly reappears after clicking "Use Here" — the app UI and timers are activated once the GAS server confirms the session is valid

## [v01.93w] — 2026-03-15 08:03:31 PM EST — v03.89r

### Fixed
- Reclaiming a session with "Use Here" no longer resets the absolute session timer — the timer continues from when you originally signed in

## [v01.92w] — 2026-03-15 07:59:08 PM EST — v03.88r

### Fixed
- Clicking "Use Here" no longer causes a brief GAS iframe flicker — the app appears smoothly after the session is confirmed

## [v01.91w] — 2026-03-15 07:51:52 PM EST — v03.87r

### Fixed
- Clicking "Use Here" on a tab that was displaced by another tab's sign-in now seamlessly reclaims the session instead of briefly showing the app then signing you out

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

Developed by: ShadowAISolutions
