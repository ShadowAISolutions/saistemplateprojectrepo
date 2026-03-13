# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 15/50`

## [Unreleased]

## [v01.15g] — 2026-03-13 04:51:10 PM EST — v02.79r

### Security
- All messages to the host page are now restricted to the specific deployment domain — no longer broadcast to all windows
- Incoming messages are verified to come from the correct host page before processing
- User information is now sanitized before being displayed to prevent injection attacks
- Session integrity checks (HMAC) are now enabled by default
- Session integrity now covers all data fields, preventing manipulation of timeout values
- Access permission checks refresh every 2 minutes instead of 10 — revoked access takes effect faster
- Maximum session duration reduced from 16 hours to 6 hours to match server cache limits
- Deployment updates now require authentication — unauthorized requests are rejected
- Error messages no longer expose server internals to the browser
- Debug logging removed from production responses

## [v01.14g] — 2026-03-13 01:45:42 PM EST — v02.75r

### Security
- Improved session integrity verification with stronger comparison method
- Reduced unnecessary data stored during login sessions
- Added error tracking when access control checks encounter issues

## [v01.13g] — 2026-03-12 09:47:46 PM EST — v02.64r

### Changed
- Minor internal improvements

## [v01.12g] — 2026-03-12 09:29:51 PM EST — v02.62r

### Changed
- Both access methods now work simultaneously — authorized via master ACL spreadsheet or via direct sharing-list access (either method grants entry)
- Errors in master ACL lookup no longer block access — falls through to the sharing-list check instead

## [v01.11g] — 2026-03-12 09:18:49 PM EST — v02.61r

### Added
- Centralized access control via master ACL spreadsheet — authorized emails are checked from a dedicated sheet instead of the spreadsheet sharing list, keeping the data spreadsheet private

### Changed
- Falls back to the previous sharing-list check if master ACL is not configured

## [v01.10g] — 2026-03-12 07:03:32 PM EST — v02.51r

### Changed
- Maximum session duration increased from 6 minutes (standard) / 1 hour (HIPAA) to 16 hours for both presets

## [v01.09g] — 2026-03-12 06:16:10 PM EST — v02.49r

### Added
- Absolute session timeout enforcement — sessions now have a hard ceiling that heartbeats cannot extend past
- New `ABSOLUTE_SESSION_TIMEOUT` configuration option in presets

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
