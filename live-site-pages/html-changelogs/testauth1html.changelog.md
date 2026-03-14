# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 50/50`

## [Unreleased]

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

## [v01.24w] — 2026-03-12 10:36:32 PM EST — v02.65r

### Added
- Signing in on one tab now automatically signs in all other open tabs of the same page
- Signing out on one tab now instantly signs out all other open tabs (previously took up to 30 seconds)

## [v01.23w] — 2026-03-12 09:36:14 PM EST — v02.63r

### Fixed
- After auto-refresh when your session has timed out, you now see the sign-in screen where you can choose which account to use, instead of being automatically signed back in

## [v01.22w] — 2026-03-12 08:48:00 PM EST — v02.60r

### Fixed
- Session timer no longer covers the version number in the bottom-left corner

## [v01.21w] — 2026-03-12 08:36:16 PM EST — v02.59r

### Changed
- Session timers are now a compact pill showing the session countdown — click to expand for full timer details

## [v01.20w] — 2026-03-12 08:30:29 PM EST — v02.58r

### Removed
- Removed debug test button from session timers

## [v01.19w] — 2026-03-12 07:48:34 PM EST — v02.57r

### Changed
- Sign-in screen now displays the company logo and environment title
- Version indicators are now visible on the sign-in screen

## [v01.18w] — 2026-03-12 07:41:03 PM EST — v02.56r

### Changed
- Sign-in now always asks which Google account to use instead of automatically picking one
- Re-authentication shows account chooser for easier account switching

## [v01.17w] — 2026-03-12 07:29:04 PM EST — v02.55r

### Fixed
- GAS app content no longer disappears every 30 seconds — session heartbeats now work in the background without affecting the visible app

## [v01.16w] — 2026-03-12 07:22:08 PM EST — v02.54r

### Changed
- Session timers now start minimized — click the "Session Timers" header to expand and see timer details

## [v01.15w] — 2026-03-12 07:14:59 PM EST — v02.53r

### Changed
- Absolute session timer now shows hours format (e.g. "16:00:00") instead of minutes-only format

## [v01.14w] — 2026-03-12 07:12:02 PM EST — v02.52r

### Changed
- Session timers reordered: Absolute timeout shown first, then Session, then Heartbeat
- When your session reaches the maximum duration, the sign-out message now tells you how long it was (e.g. "Your 16-hour session has ended")

### Removed
- Inactivity timer — session expiry is now handled entirely by the heartbeat system (stops extending when you're idle, session expires naturally on the server)

## [v01.13w] — 2026-03-12 07:03:32 PM EST — v02.51r

### Changed
- Maximum session duration increased from 6 minutes to 16 hours

### Added
- Automatic sign-out when your session expires — you'll see a clear message explaining why and can sign in again immediately

## [v01.12w] — 2026-03-12 06:16:10 PM EST — v02.49r

### Added
- New "Absolute" countdown timer showing the hard session ceiling that cannot be extended by activity

## [v01.11w] — 2026-03-12 05:53:24 PM EST — v02.48r

### Changed
- Heartbeat display now counts down to the next heartbeat check, showing whether it will extend the session or skip

## [v01.10w] — 2026-03-12 05:41:17 PM EST — v02.47r

### Added
- Session heartbeat that monitors your activity and automatically extends your session while you're using the page
- Heartbeat status indicator in the timer panel showing when your session is being extended

### Removed
- Removed refresh window display — replaced by the heartbeat system

## [v01.09w] — 2026-03-12 05:18:55 PM EST — v02.46r

### Changed
- Shortened session timer to 3 minutes and refresh window to 1.5 minutes for testing
- Added a "Test GAS Call" button to manually check if your session is still valid

## [v01.08w] — 2026-03-12 04:38:41 PM EST — v02.45r

### Added
- Added live countdown timers showing session time remaining, refresh window status, and inactivity timeout

## [v01.07w] — 2026-03-12 02:42:21 PM EST — v02.42r

### Fixed
- Fixed session being lost when refreshing the page — the app now correctly resumes your authenticated session after a page reload

## [v01.06w] — 2026-03-12 02:33:17 PM EST — v02.41r

### Fixed
- Fixed "Session expired" error still appearing on first visit — strengthened the iframe cancellation to fully prevent premature navigation

## [v01.05w] — 2026-03-12 02:21:14 PM EST — v02.40r

### Fixed
- Fixed false "Session expired" error appearing on first visit before sign-in completes

## [v01.04w] — 2026-03-12 01:53:19 PM EST — v02.39r

### Fixed
- Fixed app not loading after successful sign-in — the page now properly loads the app content after authentication

## [v01.03w] — 2026-03-12 01:30:39 PM EST — v02.37r

### Fixed
- Fixed sign-in flow failing after Google popup closes — deployment URL now persists for token exchange

## [v01.02w] — 2026-03-12 01:22:58 PM EST — v02.36r

### Changed
- Minor internal improvements

## [v01.01w] — 2026-03-12 01:03:01 PM EST — v02.34r

### Fixed
- Fixed Google sign-in not working — updated authentication configuration to allow sign-in from the live site

Developed by: ShadowAISolutions
