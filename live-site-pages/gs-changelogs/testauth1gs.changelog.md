# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 8/50`

## [Unreleased]

## [v01.08g] — 2026-03-12 05:41:17 PM EST — v02.47r

### Added
- Server-side heartbeat handler that extends your session when you're actively using the page
- New `ENABLE_HEARTBEAT` and `HEARTBEAT_INTERVAL` configuration options

### Removed
- Removed `SESSION_REFRESH_WINDOW` configuration — no longer needed with the heartbeat system

## [v01.07g] — 2026-03-12 05:18:55 PM EST — v02.46r

### Changed
- Reduced session expiration to 3 minutes and refresh window to 1.5 minutes for testing

## [v01.06g] — 2026-03-12 02:58:04 PM EST — v02.44r

### Changed
- Updated to new version to test automatic code deployment

## [v01.05g] — 2026-03-12 02:50:25 PM EST — v02.43r

### Fixed
- Fixed automatic code updates not working — the script can now self-update when new versions are pushed to GitHub

## [v01.04g] — 2026-03-12 01:53:19 PM EST — v02.39r

### Fixed
- Added diagnostic logging to trace authentication response delivery

## [v01.03g] — 2026-03-12 01:43:25 PM EST — v02.38r

### Fixed
- Fixed sign-in confirmation not reaching the page after successful authentication

## [v01.02g] — 2026-03-12 01:22:58 PM EST — v02.36r

### Fixed
- Improved sign-in reliability — server errors during authentication are now reported instead of failing silently

## [v01.01g] — 2026-03-12 01:11:52 PM EST — v02.35r

### Added
- Added visible debug indicator to verify the app loads correctly after sign-in

Developed by: ShadowAISolutions
