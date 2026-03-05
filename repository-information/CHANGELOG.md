# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 32/100`

## [Unreleased]

## [v03.25r] — 2026-03-05 05:37:15 PM EST

### Removed
- Giant orange version number display from Testation3 GAS app (version already shown in the GAS pill)

#### `testation3.gs` — 01.14g

##### Removed
- Large orange version display at the top of the app

## [v03.24r] — 2026-03-05 05:31:24 PM EST

### Fixed
- Actually applied testation3.gs VERSION bump to 01.13g (missed in v03.23r — files were staged but never edited)
- Updated testation3gs.version.txt to 01.13g
- Updated STATUS.md GAS version for Testation3

#### `testation3.gs` — 01.13g

##### Fixed
- Version bump now actually applied (was missed in previous push)

## [v03.23r] — 2026-03-05 05:18:50 PM EST

### Changed
- Bumped Testation3 GAS version to 01.13g

#### `testation3.gs` — 01.13g

##### Changed
- Version bumped to 01.13g

## [v03.22r] — 2026-03-05 05:16:05 PM EST

### Removed
- "Pull Latest from GitHub" manual button from Testation3 GAS app (auto-update handles this now)
- Red tree emoji art from Testation3 GAS app

#### `testation3.gs` — 01.12g

##### Removed
- Manual "Pull Latest from GitHub" button (no longer needed — auto-update on page load handles updates)
- Decorative red tree art

## [v03.21r] — 2026-03-05 05:12:23 PM EST

### Changed
- Bumped Testation3 GAS version to 01.11g

#### `testation3.gs` — 01.11g

##### Changed
- Version bumped to 01.11g

## [v03.20r] — 2026-03-05 05:09:46 PM EST

### Changed
- Bumped Testation3 page version to v01.04w

#### `testation3.html` — v01.04w

##### Changed
- Version bumped to v01.04w

## [v03.19r] — 2026-03-05 05:03:00 PM EST

### Added
- GitHub Actions workflow step to auto-deploy Testation3 GAS after merge to main
- Page-load auto-check in Testation3 GAS — silently calls pullAndDeployFromGitHub on every page load as a fallback when the webhook misses

#### `testation3.gs` — 01.10g

##### Added
- Automatic update check on page load — app now self-updates when visited, even if the deploy webhook was missed

## [v03.18r] — 2026-03-05 04:49:19 PM EST

### Changed
- Bumped Testation3 GAS version to 01.09g

#### `testation3.gs` — 01.09g

##### Changed
- Version bumped to 01.09g

## [v03.17r] — 2026-03-05 04:08:59 PM EST

### Added
- Re-added "Pull Latest from GitHub" button to the Testation3 GAS web app for manual update triggering

#### `testation3.gs` — 01.08g

##### Added
- "Pull Latest from GitHub" button for manually triggering code updates from GitHub

## [v03.16r] — 2026-03-05 04:01:02 PM EST

### Changed
- GAS version indicator moved from the HTML embedding layer to the GAS iframe layer — the pill now renders inside the GAS iframe where it naturally belongs
- GAS changelog popup now uses server-side `google.script.run` to fetch changelog data instead of cross-origin browser fetch

### Removed
- GAS indicator CSS and JavaScript from the HTML embedding page (now handled entirely within the GAS layer)

#### `testation3.html` — v01.03w

##### Removed
- GAS version indicator CSS and JavaScript — moved to the GAS layer where it belongs

#### `testation3.gs` — 01.07g

##### Added
- GAS version pill with countdown timer rendered directly in the GAS iframe
- GAS changelog popup accessible by clicking the version pill
- Server-side changelog fetching via `getGasChangelog()` using GitHub raw content API

## [v03.15r] — 2026-03-05 03:47:47 PM EST

### Fixed
- GAS version indicator now appears immediately on page load instead of staying hidden
- GAS version polling now uses self-reporting from the iframe instead of unreliable cross-origin parent-to-iframe messaging

#### `testation3.html` — v01.02w

##### Fixed
- GAS version indicator now visible immediately (shows "GAS ..." while waiting for first report)
- Removed unreliable parent-to-iframe version polling

#### `testation3.gs` — 01.06g

##### Changed
- Version is now reported to the embedding page every 15 seconds automatically

## [v03.14r] — 2026-03-05 03:34:35 PM EST

### Added
- GAS version indicator pill (bottom-left) on Testation3 embedding page with countdown timer and GAS changelog popup
- GAS iframe now reports its version to the embedding page via `postMessage` on load and on request
- GAS changelog deployment copy (`testation3gs.changelog.txt`) for live site access

#### `testation3.html` — v01.01w

##### Added
- GAS version indicator at bottom-left with countdown to next version check
- GAS changelog popup (click the GAS version pill to view)

#### `testation3.gs` — 01.05g

##### Added
- Reports version to embedding page on load for the GAS version indicator
- Responds to version-request messages from embedding page

## [v03.13r] — 2026-03-05 03:26:01 PM EST

### Removed
- "Pull Latest from GitHub" button — updates are now fully automatic via the workflow deploy pipeline

#### `testation3.gs` — 01.04g

##### Removed
- Manual "Pull Latest from GitHub" button — updates happen automatically

## [v03.12r] — 2026-03-05 03:21:18 PM EST

### Fixed
- Multi-tab auto-refresh race condition — `pollPushedVersionFromCache` now sends `postMessage` reload directly instead of calling `checkForUpdates()`, preventing the second tab from updating its DOM text without actually reloading

#### `testation3.gs` — 01.03g

##### Fixed
- All open tabs now reliably auto-refresh when updates are deployed

## [v03.11r] — 2026-03-05 03:14:41 PM EST

### Fixed
- Auto-refresh not triggering when workflow deploys GAS update before client polls — `checkForUpdates()` now calls `getAppData()` on "Already up to date" and triggers reload if displayed version is stale

#### `testation3.gs` — 01.02g

##### Fixed
- Page now auto-refreshes when updates are deployed by the workflow

## [v03.10r] — 2026-03-05 02:56:41 PM EST

### Added
- Red tree decoration at the bottom of Testation3 GAS web app UI

#### `testation3.gs` — 01.01g

##### Added
- Red tree emoji art displayed at the bottom of the app interface

## [v03.09r] — 2026-03-05 02:48:36 PM EST

### Added
- New GAS project "Testation3" — 10 files created via setup script (HTML page, GAS script, config, version files, changelogs)
- Registered Testation3 in GAS Projects table, STATUS.md, ARCHITECTURE.md, and README.md structure tree

## [v03.08r] — 2026-03-05 02:05:59 PM EST

### Changed
- `setup-gas-project.sh` now fully automates all post-setup steps: updates ARCHITECTURE.md (Mermaid diagram), README.md (structure tree), STATUS.md (both tables), and fixes .gs comment references — no manual edits needed after running the script
- Added "Setup GAS Project Command" section to CLAUDE.md for deterministic execution (like Initialize Command)
- Simplified Copy Config for Claude button output to a minimal prompt — script handles everything

#### `gas-project-creator.html` — v01.54w

##### Changed
- Copy Config button now generates a shorter prompt since the setup script handles all documentation updates automatically

## [v03.07r] — 2026-03-05 01:57:34 PM EST

### Added
- New GAS project "Testation2" with full embedding page, GAS script, config, version files, and changelogs (10 files created via setup script)
- Testation2 registered in GAS Projects table, STATUS.md, ARCHITECTURE.md diagram, and README.md structure tree

#### `testation2.html` — v01.00w

##### Added
- New page for Testation2 GAS web app

#### `testation2.gs` — 01.01g

##### Added
- New self-updating GAS script for Testation2

## [v03.06r] — 2026-03-05 01:37:09 PM EST

### Changed
- "Copy Config for Claude" output now lists the three template source files so Claude knows exactly which templates the setup script copies from

#### `gas-project-creator.html` — v01.53w

##### Changed
- Copy Config button output now lists the template files used for new project creation

## [v03.05r] — 2026-03-05 01:32:42 PM EST

### Changed
- "Copy Config for Claude" button now includes a natural-language preamble and post-script steps, so Claude Code knows the full intent and follow-up actions without guessing

#### `gas-project-creator.html` — v01.52w

##### Changed
- Copy Config button output now includes setup instructions and post-script checklist for Claude Code

## [v03.04r] — 2026-03-05 11:25:27 AM EST

### Added
- Shell script `scripts/setup-gas-project.sh` automates GAS project file creation — replaces the 13-step manual Claude prompt with a single command that creates 10+ files (HTML page, .gs script, config, versions, changelogs)
- Script supports both create mode (new projects) and update mode (sync config into existing projects)

### Changed
- "Copy Config for Claude" button now copies a setup script command instead of a natural language prompt — paste into Claude Code or run directly in terminal

#### `gas-project-creator.html` — v01.51w

##### Changed
- Copy Config button now outputs a shell script command instead of a Claude prompt — faster, deterministic project creation

## [v03.03r] — 2026-03-05 10:34:03 AM EST

### Added
- Spreadsheet display section with embedded Google Sheets iframe, live B1 polling, and live quotas sidebar added to GAS template and Copy Code.gs template — new GAS projects created via GAS Project Creator now include these features out of the box

#### `gas-template.gs` — 01.02g

##### Added
- Embedded Google Sheets iframe showing the configured spreadsheet when SPREADSHEET_ID is set
- Live B1 value display with 15-second cache-backed polling
- Live quotas sidebar showing GitHub rate limit, email quota, and service estimates (updates every 60 seconds)
- Server-side functions: `readB1FromCacheOrSheet()`, `onEditWriteB1ToCache()`, `fetchGitHubQuotaAndLimits()`

## [v03.02r] — 2026-03-05 10:25:03 AM EST

### Changed
- Replaced "Open in Google Sheets" link button with embedded Google Sheets iframe in test_link_gas_1_app GAS web app

#### `test_link_gas_1_app.gs` — 01.03g

##### Changed
- Spreadsheet section now shows embedded Google Sheets iframe instead of external link button

## [v03.01r] — 2026-03-05 10:09:45 AM EST

### Added
- Spreadsheet data section in test_link_gas_1_app GAS web app — shows sheet name, live B1 value with "Open in Google Sheets" button, and live quotas sidebar

#### `test_link_gas_1_app.gs` — 01.02g

##### Added
- Spreadsheet data section showing sheet name, live B1 value, and "Open in Google Sheets" button when spreadsheet is configured
- Live B1 value updates automatically every 15 seconds via cache-backed polling
- Live quotas sidebar showing GitHub rate limit, email quota, and service estimates

## [v03.00r] — 2026-03-05 09:55:36 AM EST

### Changed
- Updated test_link_gas_1_app GAS project config: TITLE changed from "optional title" to "Test Title"

#### `test_link_gas_1_app.html` — v01.01w

##### Changed
- Page title updated to "Test Title"

#### `test_link_gas_1_app.gs` — 01.01g

##### Changed
- App title updated to "Test Title"

## [v02.99r] — 2026-03-05 09:42:31 AM EST

### Fixed
- Re-trigger GitHub Pages deployment after transient GitHub API 500 error during prior deploy

## [v02.98r] — 2026-03-05 09:33:31 AM EST

### Fixed
- Copy Code.gs now injects `GITHUB_OWNER`, `GITHUB_REPO`, and `FILE_PATH` from the page URL and environment name — previously these were left as template placeholders, causing 404 errors when the GAS app tried to pull from GitHub

#### `gas-project-creator.html` — v01.50w

##### Fixed
- Copy Code.gs now automatically sets the GitHub owner, repo, and file path so the pasted code can pull updates without manual edits

## [v02.97r] — 2026-03-05 09:22:51 AM EST

### Added
- Created full `test_link_gas_1_app` GAS project ecosystem: HTML embedding page, `.gs` file, config.json, version files, changelogs, and deployment changelog copy
- Registered TestLinkGas1App in GAS Projects table

#### `test_link_gas_1_app.html` — v01.00w

##### Added
- New embedding page for Test Link Gas 1 App GAS project with full template features (auto-refresh, version polling, maintenance mode, changelog popup)

## [v02.96r] — 2026-03-05 09:07:01 AM EST

### Changed
- Copy Code.gs now injects `EMBED_PAGE_URL` using the Project Environment Name, so the `.gs` code knows its containing HTML page for redirects

#### `gas-project-creator.html` — v01.49w

##### Changed
- Copy Code.gs now sets the embedding page URL automatically from the environment name
- Copy Code.gs button now requires both Deployment ID and Project Environment Name (was Deployment ID only)

## [v02.95r] — 2026-03-05 08:52:11 AM EST

### Changed
- "Copy Config for Claude" prompt now uses an explicit **Project Environment Name** field instead of inferring file paths from the project title

#### `gas-project-creator.html` — v01.48w

##### Added
- Project Environment Name input field (required) — specifies the base name for all project files (e.g. `test` creates `test.html`, `test.gs`, etc.)

##### Changed
- "Copy Config for Claude" button now requires both Deployment ID and Project Environment Name to be filled
- Copied prompt now references the Page Setup Checklist and uses the environment name for all file paths

## [v02.94r] — 2026-03-05 08:41:02 AM EST

### Changed
- Restructured Page Rename/Move Checklist to use a **Project Environment Name** field — specify just the base name (e.g. `gas-template` → `gas-project-creator`) and all 10 file paths are derived automatically via a lookup table


Developed by: ShadowAISolutions

