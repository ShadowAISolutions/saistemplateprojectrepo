# Changelog — Global ACL (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [globalaclgs.changelog-archive.md](globalaclgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 34/50`

## [Unreleased]

## [v01.36g] — 2026-04-03 02:21:25 PM EST — v08.61r

### Added
- Global sessions panel now available from admin tools dropdown — view and manage sessions across all projects

## [v01.35g] — 2026-04-03 01:30:35 PM EST — v08.59r

### Fixed
- Admin tools panel now properly hides when toggling the application layer visibility

## [v01.34g] — 2026-04-03 12:45:15 PM EST — v08.57r

### Fixed
- Fixed a deployment error caused by incomplete internal function — script can now deploy successfully

## [v01.33g] — 2026-04-03 12:24:34 PM EST — v08.56r

### Added
- Admin tools panel now available for administrator users within the application dashboard

## [v01.32g] — 2026-04-02 01:20:10 PM EST — v08.52r

### Changed
- Minor internal improvements

## [v01.29g] — 2026-04-02 10:39:56 AM EST — v08.45r

### Added
- Version number now displayed in the bottom-left corner of the application

## [v01.28g] — 2026-04-02 10:28:07 AM EST — v08.43r

### Added
- Quick toggle to hide or show the application interface

## [v01.27g] — 2026-03-29 02:09:05 AM EST — v07.71r

### Changed
- ACL data table now loads instantly instead of requiring a separate server request after sign-in

## [v01.26g] — 2026-03-29 01:19:57 AM EST — v07.66r

### Fixed
- Sign-in now completes instantly instead of pausing for a few seconds on "Starting up"

## [v01.25g] — 2026-03-25 09:24:15 AM EST — v06.45r

### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces
- Admin secret distribution endpoint — allows the Global ACL hub to push shared secrets to this project

### Fixed
- Nonce expiry window extended from 30 seconds to 60 seconds, preventing timeouts during slower connections

## [v01.24g] — 2026-03-23 07:45:16 AM EST — v06.14r

### Fixed
- Fixed session listing not matching renamed projects in the Global Sessions panel

## [v01.23g] — 2026-03-22 03:12:04 PM EST — v06.11r

### Changed
- Switched from standard to HIPAA preset

## [v01.22g] — 2026-03-22 02:58:37 PM EST — v06.09r

### Fixed
- Global Sessions panel no longer shows "Invalid JSON response" for other projects

## [v01.21g] — 2026-03-21 01:01:38 PM EST — v05.64r

### Fixed
- Minor internal improvements

## [v01.20g] — 2026-03-21 12:45:23 PM EST — v05.63r

### Fixed
- Session handshake now completes properly — nonce delivery uses the correct channel

## [v01.19g] — 2026-03-21 12:31:09 PM EST — v05.62r

### Added
- Secure page nonce handshake — session credentials are verified via a private channel instead of being visible in the page address

## [v01.18g] — 2026-03-20 11:02:26 PM EST — v05.56r

### Added
- Security keys now auto-generate on first deploy — no manual setup needed

### Changed
- Updated setup error message to reflect auto-generation

## [v01.17g] — 2026-03-20 10:38:42 PM EST — v05.55r

### Changed
- Cross-project admin secret now stored in secure per-project storage instead of a shared spreadsheet cell
- Secret is automatically distributed to all registered projects on first setup

### Added
- Admin can now rotate the cross-project secret — generates a new one and pushes it to all projects automatically

## [v01.16g] — 2026-03-20 08:34:24 PM EST — v05.47r

### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

## [v01.15g] — 2026-03-20 08:10:13 PM EST — v05.46r

### Added
- New projects now automatically get their own access control column when they register for the first time

## [v01.14g] — 2026-03-20 06:56:29 PM EST — v05.43r

### Added
- Projects now auto-register themselves for the Global Sessions feature — no manual spreadsheet setup required
- Cross-project shared secret is auto-generated on first use

### Changed
- Replaced temporary session fallback with proper auto-registration infrastructure

## [v01.13g] — 2026-03-20 06:34:44 PM EST — v05.42r

### Fixed
- Sessions from the local project now appear even when the Projects sheet is missing or has no SELF row configured

## [v01.12g] — 2026-03-20 06:13:55 PM EST — v05.41r

### Added
- Cross-project session aggregation allowing admins to view all active sessions across projects from a single interface
- Remote session termination — admins can kick users from specific projects or all projects at once
- Server-to-server authentication using shared secret for secure cross-project communication

## [v01.11g] — 2026-03-20 04:20:50 PM EST — v05.36r

### Fixed
- Permission highlights now reset when you change a setting back to its original value — no more persistent yellow highlighting on unchanged fields

## [v01.10g] — 2026-03-20 02:44:10 PM EST — v05.35r

### Added
- Page column headers are now clickable — rename or remove columns directly from the table
- New "Manage Roles" panel for adding, renaming, deleting roles and toggling permissions
- Rename prompt for both page columns and roles

### Changed
- Role list in user dropdowns updates dynamically when roles are added, renamed, or removed

## [v01.09g] — 2026-03-20 02:35:04 PM EST — v05.34r

### Changed
- Replaced per-row Save buttons with a single "Save Changes" button in the toolbar
- Modified checkboxes and dropdowns now get an amber background highlight to show pending changes
- User email turns orange for rows with unsaved changes

## [v01.08g] — 2026-03-20 02:29:38 PM EST — v05.33r

### Changed
- Inline editing now shows a Save button per row when changes are made, instead of auto-saving on every toggle

## [v01.07g] — 2026-03-20 02:25:08 PM EST — v05.32r

### Changed
- Role and page access are now editable directly in the user table — no need to open a separate edit dialog
- Changes save automatically when you toggle a checkbox or change a role

### Removed
- Edit button removed from user rows (replaced by inline editing)

## [v01.06g] — 2026-03-20 02:09:38 PM EST — v05.30r

### Changed
- Delete confirmation now uses a styled in-app dialog instead of the browser's default confirm popup

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
