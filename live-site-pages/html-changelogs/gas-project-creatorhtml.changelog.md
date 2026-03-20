# Changelog — GAS Project Creator Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-project-creatorhtml.changelog-archive.md](gas-project-creatorhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 14/50`

## [Unreleased]

## [v01.14w] — 2026-03-19 08:28:19 PM EST — v05.16r

### Added
- Content Security Policy — page now enforces strict resource loading rules for better protection
- Changelog content sanitization — changelog popups now strip potentially dangerous content before display

### Changed
- Audio initialization deferred until first interaction — eliminates browser autoplay warning on page load

## [v01.13w] — 2026-03-18 11:06:43 AM EST — v04.73r

### Fixed
- Removed global GAS URL exposure — srcdoc trampoline replaced with direct iframe navigation
- Minor internal improvements

## [v01.12w] — 2026-03-14 08:59:29 PM EST — v03.54r

### Changed
- Minor internal improvements

## [v01.11w] — 2026-03-14 08:53:11 PM EST — v03.53r

### Added
- Added placeholder favicon — no more missing icon in browser tab

## [v01.10w] — 2026-03-13 08:14:29 PM EST — v02.92r

### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

## [v01.09w] — 2026-03-12 09:18:49 PM EST — v02.61r

### Added
- Master ACL Spreadsheet configuration fields in Authentication Settings — set a centralized spreadsheet ID, sheet name, and page identifier for access control

## [v01.08w] — 2026-03-12 11:21:23 AM EST — v02.31r

### Fixed
- Domain settings now correctly apply to all authentication presets
- Spreadsheet ID field no longer included in configuration when authentication is disabled

## [v01.07w] — 2026-03-12 10:25:57 AM EST — v02.30r

### Changed
- Added authentication configuration section with OAuth Client ID, preset selector, and domain restriction fields
- Auth-specific setup steps (consent screen, client ID creation) now appear when Google Authentication checkbox is enabled
- Copy Code.gs now injects auth preset and domain restriction settings into auth template code
- Copy Config for Claude now includes auth settings in the JSON output

## [v01.06w] — 2026-03-11 09:03:31 PM EST — v02.22r

### Changed
- Template loading now uses all 4 GAS template variants based on both test and auth checkbox selections
- Config output includes test and auth settings for automated project setup

## [v01.05w] — 2026-03-11 08:06:00 PM EST — v02.21r

### Added
- New checkbox option for Google Authentication (placeholder for future integration)

## [v01.04w] — 2026-03-11 07:46:13 PM EST — v02.20r

### Changed
- Template selection checkbox label updated to clarify test/diagnostic purpose

## [v01.03w] — 2026-03-11 07:38:27 PM EST — v02.19r

### Added
- Template selection checkbox — choose between minimal (version + auto-update only) or full-featured (sound, quotas, sheet embed, buttons) GAS template when copying Code.gs

## [v01.02w] — 2026-03-09 03:12:42 PM EST — v01.55r

### Changed
- "Website Ready" splash screen changed to green, "Code Ready" splash changed to blue

## [v01.01w] — 2026-03-08 05:07:22 PM EST — v01.20r

### Changed
- Minor internal improvements
