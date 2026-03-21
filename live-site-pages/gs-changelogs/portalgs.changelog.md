# Changelog — Portal Title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [portalgs.changelog-archive.md](portalgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 10/50`

## [Unreleased]

## [v01.10g] — 2026-03-20 09:05:01 PM EST — v05.49r

### Added
- Applications are now organized into two clear sections: authentication-enabled and public
- New toggle to filter the portal to show only apps you have access to
- Apps you don't have access to appear dimmed with a "No access" indicator when viewing all apps

## [v01.09g] — 2026-03-20 08:42:27 PM EST — v05.48r

### Added
- Global ACL now appears in the application portal as the first entry for centralized access control management

## [v01.08g] — 2026-03-20 08:34:24 PM EST — v05.47r

### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

## [v01.07g] — 2026-03-20 08:10:13 PM EST — v05.46r

### Added
- New projects now automatically get their own access control column when they register for the first time

## [v01.06g] — 2026-03-20 07:50:37 PM EST — v05.45r

### Changed
- Portal now connects to the centralized access control system for unified user management

## [v01.05g] — 2026-03-20 06:56:29 PM EST — v05.43r

### Added
- Project now auto-registers itself for the Global Sessions feature on first page load

## [v01.04g] — 2026-03-20 06:13:55 PM EST — v05.41r

### Added
- Cross-project session endpoints enabling the Global ACL admin to view and manage sessions on this project remotely

## [v01.03g] — 2026-03-16 10:52:13 AM EST — v04.12r

### Changed
- Attack report rate limiting now tells you when an attacker was cut off

## [v01.02g] — 2026-03-16 10:29:43 AM EST — v04.11r

### Added
- Server now receives and logs blocked attack reports from the page

## [v01.01g] — 2026-03-14 05:16:28 PM EST — v03.31r

### Added
- Full portal dashboard UI: gradient background, application cards, user info display
- Open-in-tab/new-window toggle with preference saved across sessions
- Application registry with four apps: Test Auth 1, Test Environment, Homepage, GAS Project Creator

Developed by: ShadowAISolutions
