# Changelog — Test Title 3 (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testation3gs.changelog-archive.md](testation3gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 35/50`

## [Unreleased]

## [01.35g] — 2026-03-06 08:23:52 AM EST — v03.54r

### Removed

- Decorative tree graphic removed from the bottom of the web app

## [01.34g] — 2026-03-06 01:02:00 AM EST — v03.50r

### Changed

- Live Quotas and Estimates labels now appear immediately — only the numeric values load dynamically

## [01.33g] — 2026-03-06 12:55:49 AM EST — v03.49r

### Fixed
- Version display no longer shows "versions" suffix

## [01.32g] — 2026-03-06 12:52:21 AM EST — v03.48r

### Changed
- Reload button now displays on a single line
- Version count reformatted to "Versions: X/200"

## [01.31g] — 2026-03-06 12:47:04 AM EST — v03.47r

### Changed
- Sheet name and B1 content now shown in the header area next to the title
- B1 value now has a "B1 Content:" label for clarity
- Reload button displays on a single line

## [01.30g] — 2026-03-06 12:41:24 AM EST — v03.46r

### Fixed
- Spreadsheet restored to full width below the title and controls area

## [01.29g] — 2026-03-06 12:36:18 AM EST — v03.45r

### Changed
- Live quotas and estimates moved from corner to inline next to the page title and controls

## [01.28g] — 2026-03-06 12:24:44 AM EST — v03.44r

### Changed
- Live quotas and estimates moved to fixed top-right corner position

## [01.27g] — 2026-03-06 12:19:57 AM EST — v03.43r

### Changed
- Reload button re-centered with live quotas and estimates displayed to its right
- Version count and spreadsheet remain centered below the reload button

## [01.26g] — 2026-03-06 12:14:16 AM EST — v03.42r

### Changed
- Sound test buttons moved below the spreadsheet
- Live quotas and estimates now appear next to the reload button instead of beside the spreadsheet

## [01.25g] — 2026-03-06 12:03:36 AM EST — v03.40r

### Changed
- Version moved to bottom-left corner as a small blue label instead of large centered orange text

## [01.24g] — 2026-03-05 11:57:12 PM EST — v03.39r

### Changed
- Version and title display immediately on load — no more "..." placeholder while waiting for server response

## [01.23g] — 2026-03-05 11:37:56 PM EST — v03.36r

### Removed
- Blue splash screen overlay that appeared on every page load

## [01.22g] — 2026-03-05 11:22:48 PM EST — v03.34r

### Changed
- Version bumped to 01.22g

## [01.21g] — 2026-03-05 11:17:54 PM EST — v03.33r

### Added
- Large orange version number display restored at the top of the app

### Removed
- GAS version pill with countdown dot and changelog popup (moved to embedding page)
- Server-side changelog fetching (now handled directly by the embedding page)

## [01.20g] — 2026-03-05 11:06:42 PM EST — v03.32r

### Changed
- Update detection now handled by the embedding page polling a version file instead of internal cache polling

### Removed
- CacheService-based version caching and polling
- PostMessage reload signaling to embedding page

## [01.18g] — 2026-03-05 10:47:58 PM EST — v03.30r

### Fixed
- Auto-refresh now reloads the page immediately when a new version is detected instead of re-deploying (which found "Already up to date" and skipped the reload)

## [01.17g] — 2026-03-05 09:30:02 PM EST — v03.29r

### Added
- Tree decoration displayed below the spreadsheet section

## [01.16g] — 2026-03-05 09:17:29 PM EST — v03.27r

### Fixed
- App now pulls and deploys updates before triggering page reload, ensuring the new version is live when the page refreshes

## [01.15g] — 2026-03-05 08:24:20 PM EST — v03.26r

### Added
- Test Sound (Drive) button to play notification sound from Google Drive
- Test Beep (Old) button to play synthesized beep tone
- Test Vibrate button to trigger device vibration

## [01.14g] — 2026-03-05 05:37:15 PM EST — v03.25r

### Removed
- Large orange version display at the top of the app

## [01.13g] — 2026-03-05 05:31:24 PM EST — v03.24r

### Fixed
- Version bump now actually applied (was missed in previous push)

## [01.13g] — 2026-03-05 05:18:50 PM EST — v03.23r

### Changed
- Version bumped to 01.13g

## [01.12g] — 2026-03-05 05:16:05 PM EST — v03.22r

### Removed
- Manual "Pull Latest from GitHub" button (no longer needed — auto-update on page load handles updates)
- Decorative red tree art

## [01.11g] — 2026-03-05 05:12:23 PM EST — v03.21r

### Changed
- Version bumped to 01.11g

## [01.10g] — 2026-03-05 05:03:00 PM EST — v03.19r

### Added
- Automatic update check on page load — app now self-updates when visited, even if the deploy webhook was missed

## [01.09g] — 2026-03-05 04:49:19 PM EST — v03.18r

### Changed
- Version bumped to 01.09g

## [01.08g] — 2026-03-05 04:08:59 PM EST — v03.17r

### Added
- "Pull Latest from GitHub" button for manually triggering code updates

## [01.07g] — 2026-03-05 04:01:02 PM EST — v03.16r

### Added
- GAS version pill with countdown timer showing when the next version check occurs
- GAS changelog popup — click the version pill to view the script's update history
- Server-side changelog fetching from GitHub for the changelog popup

## [01.06g] — 2026-03-05 03:47:47 PM EST — v03.15r

### Changed
- Version is now reported to the embedding page every 15 seconds automatically

## [01.05g] — 2026-03-05 03:34:35 PM EST — v03.14r

### Added
- Version is now reported to the embedding page for the GAS version indicator

## [01.04g] — 2026-03-05 03:26:01 PM EST — v03.13r

### Removed
- Manual "Pull Latest from GitHub" button — updates happen automatically

## [01.03g] — 2026-03-05 03:21:18 PM EST — v03.12r

### Fixed
- All open tabs now reliably auto-refresh when updates are deployed

## [01.02g] — 2026-03-05 03:14:41 PM EST — v03.11r

### Fixed
- Page now auto-refreshes when updates are deployed by the workflow

## [01.01g] — 2026-03-05 02:56:41 PM EST — v03.10r

### Added
- Red tree decoration displayed at the bottom of the app

Developed by: ShadowAISolutions
