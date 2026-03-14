# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 26/50`

## [Unreleased]

## [v01.26g] — 2026-03-14 06:03:06 PM EST — v03.36r

### Security
- Session data integrity verification is now enabled for all security modes

## [v01.25g] — 2026-03-14 05:58:39 PM EST — v03.35r

### Security
- Deploy events are now logged for security monitoring

## [v01.24g] — 2026-03-14 05:54:36 PM EST — v03.34r

### Security
- Login attempts are now rate-limited to prevent brute force attacks
- Heartbeat requests are now rate-limited to prevent abuse
- Maximum session duration reduced from 16 hours to 8 hours for improved security
- Error messages no longer reveal email addresses or detailed failure reasons

## [v01.23g] — 2026-03-14 01:18:46 PM EST — v03.19r

### Fixed
- Fixed blank page after sign-in when using hipaa security preset

## [v01.22g] — 2026-03-14 12:53:45 PM EST — v03.16r

### Changed
- Switched to high-security (HIPAA) configuration — enables message integrity checks, audit logging, and emergency access by default

## [v01.21g] — 2026-03-14 12:46:13 PM EST — v03.15r

### Changed
- Minor internal improvements

## [v01.20g] — 2026-03-14 12:43:08 PM EST — v03.14r

### Changed
- Session now expires after 3 minutes (for testing — production: 1 hour)
- Absolute session limit reduced to 5 minutes (for testing — production: 16 hours)
- Activity checks now happen every 30 seconds (for testing — production: 5 minutes)
- Sign-in token lifetime reduced to 3 minutes (for testing — production: 1 hour)
- "Expiring soon" warning now shows 1 minute before token expires (for testing — production: 5 minutes)

## [v01.19g] — 2026-03-14 12:39:17 PM EST — v03.13r

### Changed
- "Session expiring soon" notification now only appears in the last 5 minutes instead of the last 15 minutes

## [v01.18g] — 2026-03-13 11:17:21 PM EST — v03.07r

### Changed
- Session expiration changed to 1 hour
- Heartbeat interval changed to 5 minutes

## [v01.17g] — 2026-03-13 11:12:06 PM EST — v03.06r

### Changed
- Session expiration extended from 3 minutes to 2 hours
- Heartbeat interval increased from 30 seconds to 10 minutes

## [v01.16g] — 2026-03-13 08:58:37 PM EST — v02.94r

### Added
- Added a text input field for testing typing during heartbeat activity

## [v01.15g] — 2026-03-13 07:15:58 PM EST — v02.90r

### Added
- Cryptographic message signing for all outgoing messages
- Input sanitization to prevent code injection

### Changed
- Messages now only reach the intended embedding page
- Error details are logged server-side only, not sent to the browser
- Improved session security by removing stored credentials

### Removed
- Debug logging from token exchange

## [v01.14g] — 2026-03-13 06:03:16 PM EST — v02.86r

### Changed
- Minor internal improvements

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
