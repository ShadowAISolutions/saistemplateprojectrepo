# Changelog — Global ACL (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [globalaclgs.changelog-archive.md](globalaclgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 5/50`

## [Unreleased]

## [v01.05g] — 2026-03-20 02:05:14 PM EST — v05.29r

### Added
- Page access columns now display as checkboxes in the spreadsheet when adding users, updating users, or adding new page columns

## [v01.04g] — 2026-03-20 02:00:06 PM EST — v05.28r

### Fixed
- Fixed session being destroyed after each ACL edit — cache clearing now removes only permission keys instead of wiping all sessions

## [v01.03g] — 2026-03-20 01:46:22 PM EST — v05.27r

### Fixed
- Fixed PERMISSION_DENIED error when using ACL management — admin role is now correctly read from the session even when standard preset skips full validation

## [v01.02g] — 2026-03-20 01:42:16 PM EST — v05.26r

### Fixed
- Fixed brief "PERMISSION_DENIED" error on initial sign-in by deferring data load until session is confirmed

## [v01.01g] — 2026-03-20 01:33:40 PM EST — v05.25r

### Added
- ACL management interface with user table showing emails, roles, and per-page access
- Add, edit, and delete users directly from the interface
- Add new page columns to the access control list
- Role assignment dropdown with all available roles
- Per-page access toggles for each user

Developed by: ShadowAISolutions
