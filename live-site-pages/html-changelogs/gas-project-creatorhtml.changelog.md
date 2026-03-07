# Changelog — GAS Project Creator Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-project-creatorhtml.changelog-archive.md](gas-project-creatorhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 10/50`

## [v01.61w] — 2026-03-07 12:31:43 AM EST — v04.06r

### Changed
- GAS version pill repositioned slightly to the right for better spacing

## [v01.60w] — 2026-03-07 12:21:26 AM EST — v04.05r

### Changed
- Update splash now shows a blue "Website Ready" screen for page updates and a green "Code Ready" screen for GAS code updates
- Added GAS version indicator pill (bottom-right, left of the page version pill) showing the current GAS script version with live countdown
- Clicking the GAS version pill now opens a GAS changelog popup
- GAS script updates are now detected automatically via version polling

## [v01.58w] — 2026-03-06 08:15:21 PM EST — v03.88r

### Changed
- Changelog popup now fetches `.md` files instead of `.txt`

## [v01.54w] — 2026-03-05 02:05:59 PM EST — v03.08r

### Changed
- Copy Config button now generates a shorter prompt since the setup script handles all documentation updates automatically

## [v01.53w] — 2026-03-05 01:37:09 PM EST — v03.06r

### Changed
- Copy Config button output now lists the template files used for new project creation

## [v01.52w] — 2026-03-05 01:32:42 PM EST — v03.05r

### Changed
- Copy Config button output now includes setup instructions and post-script checklist for Claude Code

## [v01.51w] — 2026-03-05 11:25:27 AM EST — v03.04r

### Changed
- Copy Config button now outputs a shell script command instead of a Claude prompt — faster, deterministic project creation

## [v01.50w] — 2026-03-05 09:33:31 AM EST — v02.98r

### Fixed
- Copy Code.gs now automatically sets the GitHub owner, repo, and file path so the pasted code can pull updates without manual edits

## [v01.49w] — 2026-03-05 09:07:01 AM EST — v02.96r

### Changed
- Copy Code.gs now sets the embedding page URL automatically from the environment name
- Copy Code.gs button now requires both Deployment ID and Project Environment Name

## [v01.48w] — 2026-03-05 08:52:11 AM EST — v02.95r

### Added
- Project Environment Name input field — specifies the base name for all project files (e.g. `test` creates `test.html`, `test.gs`, etc.)

### Changed
- "Copy Config for Claude" button now requires both Deployment ID and Project Environment Name
- Copied prompt uses the environment name for all file paths instead of guessing from the title
Developed by: ShadowAISolutions
