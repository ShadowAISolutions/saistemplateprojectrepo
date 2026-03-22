# Changelog — Global ACL

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [globalaclhtml.changelog-archive.md](globalaclhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 14/50`

## [Unreleased]

## [v01.14w] — 2026-03-22 12:23:54 PM EST — v05.99r

### Fixed
- No longer triggers unnecessary Google re-authentication on page refresh

## [v01.13w] — 2026-03-22 12:08:17 PM EST — v05.98r

### Fixed
- SSO auto-authentication now works after page refresh

## [v01.12w] — 2026-03-22 11:38:56 AM EST — v05.97r

### Changed
- "Session Active Elsewhere" overlay now shows the application name

## [v01.11w] — 2026-03-21 06:15:12 PM EST — v05.77r

### Fixed
- GAS changelog popup title no longer shows pipe characters

## [v01.10w] — 2026-03-21 06:07:27 PM EST — v05.76r

### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

## [v01.09w] — 2026-03-21 01:01:38 PM EST — v05.64r

### Fixed
- Sign-in flow restored to working state

## [v01.08w] — 2026-03-21 12:45:23 PM EST — v05.63r

### Fixed
- Session setup now completes properly after sign-in

## [v01.07w] — 2026-03-21 12:31:09 PM EST — v05.62r

### Changed
- Session authentication now uses a secure handshake instead of passing credentials in the page address

## [v01.06w] — 2026-03-21 11:55:49 AM EST — v05.61r

### Fixed
- Sign-out now properly invalidates server-side sessions before clearing the page

### Added
- "Signing out..." overlay with spinner shown during session cleanup

## [v01.05w] — 2026-03-20 11:02:26 PM EST — v05.56r

### Changed
- Updated setup error message to reflect auto-generation of security keys on first deploy

## [v01.04w] — 2026-03-20 10:05:19 PM EST — v05.54r

### Fixed
- All popups, overlays, and background timers now properly deactivated on sign-out

## [v01.03w] — 2026-03-20 09:56:00 PM EST — v05.53r

### Fixed
- Global sessions panel now properly closes when signing out

## [v01.02w] — 2026-03-20 07:27:24 PM EST — v05.44r

### Fixed
- Sessions no longer conflict with other projects open in the same browser

## [v01.01w] — 2026-03-20 06:13:55 PM EST — v05.41r

### Added
- "Global Sessions" button for admin users to view sessions across all projects
- Dedicated green-themed panel showing sessions grouped by project with status indicators
- Ability to sign out users from individual projects or all projects at once

Developed by: ShadowAISolutions
