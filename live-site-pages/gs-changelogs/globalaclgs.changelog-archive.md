# Changelog Archive — Global ACL (Google Apps Script)

Older version sections rotated from [globalaclgs.changelog.md](globalaclgs.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## [v01.37g] — 2026-04-03 02:47:47 PM EST — v08.62r — [a0b6e82](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a0b6e821)

### Fixed
- Admin tools badge and menu moved to top-left corner to avoid being hidden behind the user interface

## [v01.36g] — 2026-04-03 02:21:25 PM EST — v08.61r — [ef351b5](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ef351b56)

### Added
- Global sessions panel now available from admin tools dropdown — view and manage sessions across all projects

## [v01.35g] — 2026-04-03 01:30:35 PM EST — v08.59r — [28afef6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/28afef6c)

### Fixed
- Admin tools panel now properly hides when toggling the application layer visibility

## [v01.34g] — 2026-04-03 12:45:15 PM EST — v08.57r — [c3fb31f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c3fb31f9)

### Fixed
- Fixed a deployment error caused by incomplete internal function — script can now deploy successfully

## [v01.33g] — 2026-04-03 12:24:34 PM EST — v08.56r — [b3d9a37](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b3d9a37d)

### Added
- Admin tools panel now available for administrator users within the application dashboard

## [v01.32g] — 2026-04-02 01:20:10 PM EST — v08.52r — [ca08f65](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ca08f65b)

### Changed
- Minor internal improvements

## [v01.29g] — 2026-04-02 10:39:56 AM EST — v08.45r — [613d1dd](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/613d1dd3)

### Added
- Version number now displayed in the bottom-left corner of the application

## [v01.28g] — 2026-04-02 10:28:07 AM EST — v08.43r — [5c12e6b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5c12e6b1)

### Added
- Quick toggle to hide or show the application interface

## [v01.27g] — 2026-03-29 02:09:05 AM EST — v07.71r — [79455c3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/79455c30)

### Changed
- ACL data table now loads instantly instead of requiring a separate server request after sign-in

## [v01.26g] — 2026-03-29 01:19:57 AM EST — v07.66r — [6e998d3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6e998d3f)

### Fixed
- Sign-in now completes instantly instead of pausing for a few seconds on "Starting up"

## [v01.25g] — 2026-03-25 09:24:15 AM EST — v06.45r — [8e76a68](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8e76a687)

### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces
- Admin secret distribution endpoint — allows the Global ACL hub to push shared secrets to this project

### Fixed
- Nonce expiry window extended from 30 seconds to 60 seconds, preventing timeouts during slower connections

## [v01.24g] — 2026-03-23 07:45:16 AM EST — v06.14r — [853e849](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/853e8491)

### Fixed
- Fixed session listing not matching renamed projects in the Global Sessions panel

## [v01.23g] — 2026-03-22 03:12:04 PM EST — v06.11r — [09d57c0](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/09d57c0e)

### Changed
- Switched from standard to HIPAA preset

## [v01.22g] — 2026-03-22 02:58:37 PM EST — v06.09r — [76f329f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/76f329fc)

### Fixed
- Global Sessions panel no longer shows "Invalid JSON response" for other projects

## [v01.21g] — 2026-03-21 01:01:38 PM EST — v05.64r — [c4cfe8f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c4cfe8f8)

### Fixed
- Minor internal improvements

## [v01.20g] — 2026-03-21 12:45:23 PM EST — v05.63r — [9140b31](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9140b31d)

### Fixed
- Session handshake now completes properly — nonce delivery uses the correct channel

## [v01.19g] — 2026-03-21 12:31:09 PM EST — v05.62r — [6799cb8](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6799cb81)

### Added
- Secure page nonce handshake — session credentials are verified via a private channel instead of being visible in the page address

## [v01.18g] — 2026-03-20 11:02:26 PM EST — v05.56r — [e56d019](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e56d0197)

### Added
- Security keys now auto-generate on first deploy — no manual setup needed

### Changed
- Updated setup error message to reflect auto-generation

## [v01.17g] — 2026-03-20 10:38:42 PM EST — v05.55r — [8e3d212](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8e3d2121)

### Changed
- Cross-project admin secret now stored in secure per-project storage instead of a shared spreadsheet cell
- Secret is automatically distributed to all registered projects on first setup

### Added
- Admin can now rotate the cross-project secret — generates a new one and pushes it to all projects automatically

## [v01.16g] — 2026-03-20 08:34:24 PM EST — v05.47r — [9602814](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/96028143)

### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

## [v01.15g] — 2026-03-20 08:10:13 PM EST — v05.46r — [8c30066](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8c30066f)

### Added
- New projects now automatically get their own access control column when they register for the first time

## [v01.14g] — 2026-03-20 06:56:29 PM EST — v05.43r — [8ce8df2](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8ce8df2a)

### Added
- Projects now auto-register themselves for the Global Sessions feature — no manual spreadsheet setup required
- Cross-project shared secret is auto-generated on first use

### Changed
- Replaced temporary session fallback with proper auto-registration infrastructure

## [v01.13g] — 2026-03-20 06:34:44 PM EST — v05.42r — [a45c84b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a45c84bf)

### Fixed
- Sessions from the local project now appear even when the Projects sheet is missing or has no SELF row configured

## [v01.12g] — 2026-03-20 06:13:55 PM EST — v05.41r — [cca1815](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cca18151)

### Added
- Cross-project session aggregation allowing admins to view all active sessions across projects from a single interface
- Remote session termination — admins can kick users from specific projects or all projects at once
- Server-to-server authentication using shared secret for secure cross-project communication

## [v01.11g] — 2026-03-20 04:20:50 PM EST — v05.36r — [5de5b10](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5de5b10e)

### Fixed
- Permission highlights now reset when you change a setting back to its original value — no more persistent yellow highlighting on unchanged fields

## [v01.10g] — 2026-03-20 02:44:10 PM EST — v05.35r — [aacd7b7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/aacd7b7c)

### Added
- Page column headers are now clickable — rename or remove columns directly from the table
- New "Manage Roles" panel for adding, renaming, deleting roles and toggling permissions
- Rename prompt for both page columns and roles

### Changed
- Role list in user dropdowns updates dynamically when roles are added, renamed, or removed

## [v01.09g] — 2026-03-20 02:35:04 PM EST — v05.34r — [02aa5ce](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/02aa5ce2)

### Changed
- Replaced per-row Save buttons with a single "Save Changes" button in the toolbar
- Modified checkboxes and dropdowns now get an amber background highlight to show pending changes
- User email turns orange for rows with unsaved changes

## [v01.08g] — 2026-03-20 02:29:38 PM EST — v05.33r — [998a614](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/998a614c)

### Changed
- Inline editing now shows a Save button per row when changes are made, instead of auto-saving on every toggle

## [v01.07g] — 2026-03-20 02:25:08 PM EST — v05.32r — [2331f9d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/2331f9da)

### Changed
- Role and page access are now editable directly in the user table — no need to open a separate edit dialog
- Changes save automatically when you toggle a checkbox or change a role

### Removed
- Edit button removed from user rows (replaced by inline editing)

## [v01.06g] — 2026-03-20 02:09:38 PM EST — v05.30r — [93e7788](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/93e77887)

### Changed
- Delete confirmation now uses a styled in-app dialog instead of the browser's default confirm popup

## [v01.05g] — 2026-03-20 02:05:14 PM EST — v05.29r — [c5119ce](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c5119ce3)

### Added
- Page access columns now display as checkboxes in the spreadsheet when adding users, updating users, or adding new page columns

## [v01.04g] — 2026-03-20 02:00:06 PM EST — v05.28r — [34c2abb](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/34c2abb4)

### Fixed
- Fixed session being destroyed after each ACL edit — cache clearing now removes only permission keys instead of wiping all sessions

## [v01.03g] — 2026-03-20 01:46:22 PM EST — v05.27r — [cf93514](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cf93514b)

### Fixed
- Fixed PERMISSION_DENIED error when using ACL management — admin role is now correctly read from the session even when standard preset skips full validation

## [v01.02g] — 2026-03-20 01:42:16 PM EST — v05.26r — [2fdc836](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/2fdc8362)

### Fixed
- Fixed brief "PERMISSION_DENIED" error on initial sign-in by deferring data load until session is confirmed

## [v01.01g] — 2026-03-20 01:33:40 PM EST — v05.25r — [964506a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/964506ae)

### Added
- ACL management interface with user table showing emails, roles, and per-page access
- Add, edit, and delete users directly from the interface
- Add new page columns to the access control list
- Role assignment dropdown with all available roles
- Per-page access toggles for each user

Developed by: ShadowAISolutions

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

Developed by: ShadowAISolutions
