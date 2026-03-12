# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 15/50`

## [Unreleased]

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
