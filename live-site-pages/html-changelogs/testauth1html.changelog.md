# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 22/50`

## [Unreleased]

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
