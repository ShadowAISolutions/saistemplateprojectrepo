# Changelog Archive — GAS Project Creator Page

Older version sections rotated from [gas-project-creatorhtml.changelog.md](gas-project-creatorhtml.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## [v01.28w] — 2026-03-25 05:01:08 PM EST — v06.57r — [bc91241](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/bc91241c)

### Changed
- Setup instructions now include the permission needed for installable edit triggers

## [v01.27w] — 2026-03-25 12:04:52 PM EST — v06.49r — [109a380](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/109a380c)

### Fixed
- Copy Code.gs now includes spreadsheet ID for all project types, not just authenticated ones
- Copy Config now always includes spreadsheet ID in the generated setup command

## [v01.26w] — 2026-03-21 06:15:12 PM EST — v05.77r — [eefc841](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/eefc8413)

### Fixed
- GAS changelog popup title no longer shows pipe characters

## [v01.25w] — 2026-03-21 06:07:27 PM EST — v05.76r — [fea9002](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fea90027)

### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

## [v01.24w] — 2026-03-20 11:21:18 PM EST — v05.58r — [1a5cc35](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/1a5cc35a)

### Changed
- Auto-generation note now lists all three auto-managed properties when authentication is enabled

## [v01.23w] — 2026-03-20 11:17:21 PM EST — v05.57r — [24bd516](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/24bd5167)

### Changed
- Simplified setup steps — only the GitHub token needs manual entry now; other properties auto-generate on first deploy

## [v01.22w] — 2026-03-20 11:02:26 PM EST — v05.56r — [e56d019](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e56d0197)

### Changed
- Removed manual secret generation tool — security keys now auto-generate on first deploy
- Updated property descriptions to indicate auto-generation

## [v01.21w] — 2026-03-20 10:34:16 AM EST — v05.23r — [da3dcbb](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/da3dcbb6)

### Changed
- "Include test/diagnostic features" checkbox moved to just above the Copy Code.gs button, after all configuration fields and auth settings

## [v01.20w] — 2026-03-20 10:28:46 AM EST — v05.22r — [02206a4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/02206a49)

### Changed
- "Include Google Authentication" checkbox moved to the very top of the Setup & Configuration section, above all steps, since it affects which steps are visible

## [v01.19w] — 2026-03-20 10:22:10 AM EST — v05.21r — [028aae8](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/028aae8e)

### Changed
- "Include Google Authentication" checkbox moved to the top of the GAS Project Settings section for earlier visibility

## [v01.18w] — 2026-03-20 10:10:59 AM EST — v05.20r — [3289e08](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/3289e08f)

### Changed
- HMAC Secret generator moved up to the Script Properties setup step for easier access when setting properties
- HMAC_SECRET property hint updated to reference the generator directly below instead of Auth Settings

## [v01.17w] — 2026-03-20 10:03:45 AM EST — v05.19r — [df08918](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/df089185)

### Changed
- Each script property name now has its own individual copy button for one-click copying
- HMAC Secret field now includes a Copy button to easily copy the generated value

## [v01.16w] — 2026-03-20 09:55:14 AM EST — v05.18r — [b58f204](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b58f2048)

### Added
- HMAC Secret field with one-click Generate button for creating random session integrity secrets
- Copy Property Names button in the Script Properties setup step for quick access to all required property names
- HMAC_SECRET listed in the Script Properties reference when authentication is enabled

## [v01.15w] — 2026-03-20 09:08:46 AM EST — v05.17r — [694bf05](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/694bf056)

### Added
- Master ACL selection option — new checkbox to designate this project's spreadsheet as the centralized access control sheet for all projects
- Master ACL Spreadsheet ID auto-fills from Spreadsheet ID when the option is checked
- Config output now includes the master ACL selection for automated project setup

## [v01.14w] — 2026-03-19 08:28:19 PM EST — v05.16r — [16d5313](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/16d53136)

### Added
- Content Security Policy — page now enforces strict resource loading rules for better protection
- Changelog content sanitization — changelog popups now strip potentially dangerous content before display

### Changed
- Audio initialization deferred until first interaction — eliminates browser autoplay warning on page load

## [v01.13w] — 2026-03-18 11:06:43 AM EST — v04.73r — [727b019](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/727b0193)

### Fixed
- Removed global GAS URL exposure — srcdoc trampoline replaced with direct iframe navigation
- Minor internal improvements

## [v01.12w] — 2026-03-14 08:59:29 PM EST — v03.54r — [aaa6be3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/aaa6be3e)

### Changed
- Minor internal improvements

## [v01.11w] — 2026-03-14 08:53:11 PM EST — v03.53r — [f65899b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/f65899bf)

### Added
- Added placeholder favicon — no more missing icon in browser tab

## [v01.10w] — 2026-03-13 08:14:29 PM EST — v02.92r — [6b7849a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6b7849ab)

### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

## [v01.09w] — 2026-03-12 09:18:49 PM EST — v02.61r — [6b22248](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6b222480)

### Added
- Master ACL Spreadsheet configuration fields in Authentication Settings — set a centralized spreadsheet ID, sheet name, and page identifier for access control

## [v01.08w] — 2026-03-12 11:21:23 AM EST — v02.31r — [adb47d6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/adb47d68)

### Fixed
- Domain settings now correctly apply to all authentication presets
- Spreadsheet ID field no longer included in configuration when authentication is disabled

## [v01.07w] — 2026-03-12 10:25:57 AM EST — v02.30r — [6bd50e3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6bd50e38)

### Changed
- Added authentication configuration section with OAuth Client ID, preset selector, and domain restriction fields
- Auth-specific setup steps (consent screen, client ID creation) now appear when Google Authentication checkbox is enabled
- Copy Code.gs now injects auth preset and domain restriction settings into auth template code
- Copy Config for Claude now includes auth settings in the JSON output

## [v01.06w] — 2026-03-11 09:03:31 PM EST — v02.22r — [8a1139d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8a1139d8)

### Changed
- Template loading now uses all 4 GAS template variants based on both test and auth checkbox selections
- Config output includes test and auth settings for automated project setup

## [v01.05w] — 2026-03-11 08:06:00 PM EST — v02.21r — [e2c9e93](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e2c9e933)

### Added
- New checkbox option for Google Authentication (placeholder for future integration)

## [v01.04w] — 2026-03-11 07:46:13 PM EST — v02.20r — [4b6d149](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/4b6d149f)

### Changed
- Template selection checkbox label updated to clarify test/diagnostic purpose

## [v01.03w] — 2026-03-11 07:38:27 PM EST — v02.19r — [6cb5e25](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6cb5e258)

### Added
- Template selection checkbox — choose between minimal (version + auto-update only) or full-featured (sound, quotas, sheet embed, buttons) GAS template when copying Code.gs

## [v01.02w] — 2026-03-09 03:12:42 PM EST — v01.55r — [f4f86a9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/f4f86a9b)

### Changed
- "Website Ready" splash screen changed to green, "Code Ready" splash changed to blue

## [v01.01w] — 2026-03-08 05:07:22 PM EST — v01.20r — [0dc4491](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/0dc44913)

### Changed
- Minor internal improvements

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

Developed by: ShadowAISolutions
