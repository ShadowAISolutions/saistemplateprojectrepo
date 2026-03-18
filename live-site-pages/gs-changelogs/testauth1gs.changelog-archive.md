# Changelog Archive — testauth1title (Google Apps Script)

Older version sections rotated from [testauth1gs.changelog.md](testauth1gs.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

## [v01.13g] — 2026-03-12 09:47:46 PM EST — v02.64r — [squashed]

### Changed
- Minor internal improvements

## [v01.12g] — 2026-03-12 09:29:51 PM EST — v02.62r — [squashed]

### Changed
- Both access methods now work simultaneously — authorized via master ACL spreadsheet or via direct sharing-list access (either method grants entry)
- Errors in master ACL lookup no longer block access — falls through to the sharing-list check instead

## [v01.11g] — 2026-03-12 09:18:49 PM EST — v02.61r — [squashed]

### Added
- Centralized access control via master ACL spreadsheet — authorized emails are checked from a dedicated sheet instead of the spreadsheet sharing list, keeping the data spreadsheet private

### Changed
- Falls back to the previous sharing-list check if master ACL is not configured

## [v01.10g] — 2026-03-12 07:03:32 PM EST — v02.51r — [squashed]

### Changed
- Maximum session duration increased from 6 minutes (standard) / 1 hour (HIPAA) to 16 hours for both presets

## [v01.09g] — 2026-03-12 06:16:10 PM EST — v02.49r — [squashed]

### Added
- Absolute session timeout enforcement — sessions now have a hard ceiling that heartbeats cannot extend past
- New `ABSOLUTE_SESSION_TIMEOUT` configuration option in presets

## [v01.08g] — 2026-03-12 05:41:17 PM EST — v02.47r — [squashed]

### Added
- Server-side heartbeat handler that extends your session when you're actively using the page
- New `ENABLE_HEARTBEAT` and `HEARTBEAT_INTERVAL` configuration options

### Removed
- Removed `SESSION_REFRESH_WINDOW` configuration — no longer needed with the heartbeat system

## [v01.07g] — 2026-03-12 05:18:55 PM EST — v02.46r — [squashed]

### Changed
- Reduced session expiration to 3 minutes and refresh window to 1.5 minutes for testing

## [v01.06g] — 2026-03-12 02:58:04 PM EST — v02.44r — [squashed]

### Changed
- Updated to new version to test automatic code deployment

## [v01.05g] — 2026-03-12 02:50:25 PM EST — v02.43r — [squashed]

### Fixed
- Fixed automatic code updates not working — the script can now self-update when new versions are pushed to GitHub

## [v01.04g] — 2026-03-12 01:53:19 PM EST — v02.39r — [squashed]

### Fixed
- Added diagnostic logging to trace authentication response delivery

## [v01.03g] — 2026-03-12 01:43:25 PM EST — v02.38r — [squashed]

### Fixed
- Fixed sign-in confirmation not reaching the page after successful authentication

## [v01.02g] — 2026-03-12 01:22:58 PM EST — v02.36r — [squashed]

### Fixed
- Improved sign-in reliability — server errors during authentication are now reported instead of failing silently

## [v01.01g] — 2026-03-12 01:11:52 PM EST — v02.35r — [squashed]

### Added
- Added visible debug indicator to verify the app loads correctly after sign-in

Developed by: ShadowAISolutions
