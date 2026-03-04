# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 82/100`

## [Unreleased]

## [v02.39r] — 2026-03-04 11:04:37 AM EST

### Added
- Test Sound (Drive), Test Beep (Old), and Test Vibrate buttons to GAS web app for audio and haptic feedback testing
- "Did it redirect?" and "Is this awesome?" radio button groups to GAS web app
- Decorative SVG tree graphic to GAS web app
- `playReadySound()` function with detailed error handling for Drive-hosted notification sounds
- `testVibrate()` function with browser support detection

### Changed
- Sound preload now captures and displays server errors via `_soundError` variable instead of silently swallowing failures
- Added "Reference Implementation Fidelity" rule to prevent future feature omissions when matching reference files

#### `gas-template.gs` — 01.05g
##### Added
- Test Sound, Test Beep, and Test Vibrate buttons for audio and haptic feedback testing
- "Did it redirect?" and "Is this awesome?" radio button groups
- Decorative SVG tree graphic
- Sound playback function with detailed error handling and status feedback
- Vibration test function with browser support detection
##### Changed
- Sound preload now shows server errors instead of failing silently

#### `gas-test.gs` — 01.05g
##### Added
- Test Sound, Test Beep, and Test Vibrate buttons for audio and haptic feedback testing
- "Did it redirect?" and "Is this awesome?" radio button groups
- Decorative SVG tree graphic
- Sound playback function with detailed error handling and status feedback
- Vibration test function with browser support detection
##### Changed
- Sound preload now shows server errors instead of failing silently

## [v02.38r] — 2026-03-04 10:48:27 AM EST

### Changed
- GAS web app now matches the RND Code.gs reference — includes live B1 value display, embedded spreadsheet with sheet name heading, and live quota/token info sidebar
- Added GitHub API rate limit, Mail quota, UrlFetch, Sheets, and execution time monitoring to the GAS web app sidebar (polls every 60 seconds)
- Spreadsheet section now conditionally shown based on config — uses dynamic sheet name heading instead of hardcoded label

#### `gas-template.gs` — 01.04g
##### Added
- Live quotas sidebar showing GitHub rate limit, email quota, and service estimates
- Live B1 cell value display above the spreadsheet embed, updating every 15 seconds
##### Changed
- Spreadsheet section now shows sheet name dynamically and includes live B1 value alongside the embed

#### `gas-test.gs` — 01.04g
##### Added
- Live quotas sidebar showing GitHub rate limit, email quota, and service estimates
- Live B1 cell value display above the spreadsheet embed, updating every 15 seconds
##### Changed
- Spreadsheet section now shows sheet name dynamically and includes live B1 value alongside the embed

## [v02.37r] — 2026-03-04 10:34:53 AM EST

### Changed
- Replaced read-only spreadsheet cell values with an interactive embedded Google Sheets iframe in the GAS web app — you can now view and edit the spreadsheet directly from the web app
- Added "Open in Google Sheets" link below the embedded spreadsheet

#### `gas-template.gs` — 01.03g
##### Changed
- Spreadsheet section now shows a live, editable Google Sheets embed instead of read-only cell values

#### `gas-test.gs` — 01.03g
##### Changed
- Spreadsheet section now shows a live, editable Google Sheets embed instead of read-only cell values

## [v02.36r] — 2026-03-04 10:30:27 AM EST

### Added
- Mandatory sync rule for Copy Code.gs deployment files — `.gs` changes now automatically require updating the corresponding `-code.js.txt` in `live-site-pages/`

## [v02.35r] — 2026-03-04 10:26:42 AM EST

### Fixed
- Synced Copy Code.gs deployment files (`gas-template-code.js.txt`, `gas-test-code.js.txt`) with the current `.gs` source — previously stuck at v01.00g with no spreadsheet display section

## [v02.34r] — 2026-03-04 10:20:48 AM EST

### Added
- Spreadsheet data section in the GAS web app — when opening the web app directly (not embedded), spreadsheet cell values (A1, B1, C1) and sheet name are now visible
- Live B1 polling updates the standalone web app display in addition to the embedding page

#### `gas-template.gs` — 01.02g
##### Added
- Spreadsheet Data section showing sheet name, A1 (version), B1 (live value), and C1 (pushed version) when spreadsheet is configured
- Live B1 value updates directly in the web app display via 15-second polling

#### `gas-test.gs` — 01.02g
##### Added
- Spreadsheet Data section showing sheet name, A1 (version), B1 (live value), and C1 (pushed version) when spreadsheet is configured
- Live B1 value updates directly in the web app display via 15-second polling

## [v02.33r] — 2026-03-04 10:09:15 AM EST

### Changed
- "Copy Code.gs" button now produces a fully configured .gs file — injects Spreadsheet ID, Sheet Name, Sound File ID, Title, and Deployment ID from the dashboard form fields into the code before copying
- Moved Spreadsheet ID, Sheet Name, and Sound File ID inputs to Step 1 (before the Copy button) so values are filled in before copying the code

#### `gas-template.html` — v01.11w
##### Changed
- Copy Code.gs now injects all filled config values into the copied code for a ready-to-paste .gs file
- Spreadsheet ID, Sheet Name, and Sound File ID fields moved to Step 1 before the Copy button

#### `gas-test.html` — v01.10w
##### Changed
- Copy Code.gs now injects all filled config values into the copied code for a ready-to-paste .gs file
- Spreadsheet ID, Sheet Name, and Sound File ID fields moved to Step 1 before the Copy button

## [v02.32r] — 2026-03-04 09:47:03 AM EST

### Added
- Collapsible GCP troubleshooting guide in GAS dashboard setup steps — covers the "managed folder" error, IAM Project Mover role fix, and "create new project" alternative

#### `gas-template.html` — v01.10w
##### Added
- Collapsible troubleshooting section under "Link the GCP project" step with step-by-step fix for the "Apps Script-managed folder" error

#### `gas-test.html` — v01.09w
##### Added
- Collapsible troubleshooting section under "Link the GCP project" step with step-by-step fix for the "Apps Script-managed folder" error

## [v02.31r] — 2026-03-04 09:41:57 AM EST

### Added
- User-facing GCP Project Setup & Troubleshooting section in README.md — covers initial setup, "cannot switch to managed folder" fix (with IAM Project Mover steps), and "Apps Script API not enabled" fix

## [v02.30r] — 2026-03-04 09:34:13 AM EST

### Changed
- GCP project setup guide — added IAM permission steps to "move the project" fix (Option A): grant yourself the **Project Mover** role at the organization level before migrating, since even org owners/admins lack this by default

## [v02.29r] — 2026-03-04 09:14:19 AM EST

### Added
- GCP project setup and troubleshooting guide in CODING-GUIDELINES.md — covers initial setup, "cannot switch to Apps Script-managed folder" fix, and "Apps Script API not enabled" fix

## [v02.28r] — 2026-03-04 08:52:09 AM EST

### Added
- Spreadsheet data viewing in GAS dashboards — displays live B1 value, current version (A1), and pushed version (C1) from the connected Google Sheet
- "Open Spreadsheet" link in GAS dashboards for quick access to the connected sheet
- Cache-backed B1 polling (every 15s) — reads from CacheService first, falls back to SpreadsheetApp on cache miss
- `onEditWriteB1ToCache()` installable trigger function for real-time B1 cache updates on spreadsheet edits

#### `gas-test.html` — v01.08w
##### Added
- New "Spreadsheet Data" dashboard section showing live cell values and a link to open the connected spreadsheet
- Live B1 value display with automatic 15-second polling updates

#### `gas-template.html` — v01.09w
##### Added
- New "Spreadsheet Data" dashboard section showing live cell values and a link to open the connected spreadsheet
- Live B1 value display with automatic 15-second polling updates

#### `gas-test.gs` — 01.01g
##### Added
- `readB1FromCacheOrSheet()` function for cache-backed B1 reading
- `onEditWriteB1ToCache()` installable trigger for real-time cache updates
- Spreadsheet data (A1, B1, C1 cell values) included in `getAppData()` response
- B1 polling in GAS iframe client code that reports values to embedding page via postMessage

#### `gas-template.gs` — 01.01g
##### Added
- `readB1FromCacheOrSheet()` function for cache-backed B1 reading
- `onEditWriteB1ToCache()` installable trigger for real-time cache updates
- Spreadsheet data (A1, B1, C1 cell values) included in `getAppData()` response
- B1 polling in GAS iframe client code that reports values to embedding page via postMessage

## [v02.27r] — 2026-03-04 08:37:17 AM EST

### Changed
- Moved "GAS UI Layout Awareness" rule from `html-pages.md` to `gas-scripts.md` — GAS elements are guests in the host page, so the accommodating system (GAS) owns the rule
- Added direction-of-responsibility guidance to Rule Placement Autonomy in `behavioral-rules.md` — rules about system A deferring to system B belong with system A

## [v02.26r] — 2026-03-04 08:29:56 AM EST

### Fixed
- GAS panel toggle tab moved from bottom-right to bottom-left to avoid overlapping the version/changelog indicator

#### `gas-template.html` — v01.08w
##### Fixed
- GAS toggle tab moved to bottom-left to avoid overlapping the version indicator

#### `gas-test.html` — v01.07w
##### Fixed
- GAS toggle tab moved to bottom-left to avoid overlapping the version indicator

## [v02.25r] — 2026-03-04 08:25:01 AM EST

### Fixed
- GAS Layer "Spreadsheet" and "Sound File" status rows now show "Local only — update GAS script" when values are saved in localStorage but the GAS script still has placeholders, instead of misleading "Not set"

#### `gas-template.html` — v01.07w
##### Fixed
- Spreadsheet and Sound File status now correctly reflects localStorage values when GAS script reports placeholders

#### `gas-test.html` — v01.06w
##### Fixed
- Spreadsheet and Sound File status now correctly reflects localStorage values when GAS script reports placeholders

## [v02.24r] — 2026-03-04 08:15:33 AM EST

### Added
- "Local Config (localStorage)" dashboard section on GAS Template and GAS Test pages — shows saved Deployment ID, Spreadsheet ID, Sheet Name, and Sound File ID with green/gray status indicators
- Per-field clear buttons (× icons) next to every configuration input for individually removing localStorage values
- Collapsible bottom drawer panel for GAS iframe — replaces full-screen overlay, with toggle tab and drag-to-resize handle (mouse + touch)

### Changed
- GAS iframe no longer covers the entire page — opens in a resizable bottom panel so the dashboard remains interactive during testing
- "Clear" button now also hides the GAS panel and resets local config status indicators

#### `gas-template.html` — v01.06w
##### Added
- "Local Config" dashboard section showing localStorage values at a glance
- Per-field clear buttons on every configuration input
- Collapsible bottom panel for GAS iframe with toggle and drag-to-resize

##### Changed
- GAS iframe opens in a resizable bottom drawer instead of a full-screen overlay

#### `gas-test.html` — v01.05w
##### Added
- "Local Config" dashboard section showing localStorage values at a glance
- Per-field clear buttons on every configuration input
- Collapsible bottom panel for GAS iframe with toggle and drag-to-resize

##### Changed
- GAS iframe opens in a resizable bottom drawer instead of a full-screen overlay

## [v02.23r] — 2026-03-04 07:50:45 AM EST

### Added
- "Copy Code.gs" button at step 1 on both GAS Template and GAS Test pages — fetches the associated `.gs` source from a co-deployed text file and copies to clipboard
- Deployable `.gs` source files (`gas-template-code.js.txt`, `gas-test-code.js.txt`) in `live-site-pages/` so the Copy button works from GitHub Pages without hitting authenticated GitHub API endpoints

#### `gas-template.html` — v01.05w
##### Added
- "Copy Code.gs" button at step 1 — one-click copy of the full `gas-template.gs` source code for pasting into the Apps Script editor

#### `gas-test.html` — v01.04w
##### Added
- "Copy Code.gs" button at step 1 — one-click copy of the full `gas-test.gs` source code for pasting into the Apps Script editor

## [v02.22r] — 2026-03-03 10:42:39 PM EST

### Changed
- Step 2 (manifest JSON): added a "Copy" button to copy the `appsscript.json` contents to clipboard
- Step 3 (GCP project): added link to Google Cloud Console for users who need to create a new project
- Step 9 (GITHUB_TOKEN): expanded with full instructions on creating a fine-grained PAT and note that the same token works across multiple projects

#### `gas-template.html` — v01.04w
##### Changed
- Copy button on JSON manifest block for one-click clipboard copy
- GCP Console link added to step 3 for new users
- Detailed GITHUB_TOKEN creation walkthrough and reuse guidance in step 9

#### `gas-test.html` — v01.03w
##### Changed
- Copy button on JSON manifest block for one-click clipboard copy
- GCP Console link added to step 3 for new users
- Detailed GITHUB_TOKEN creation walkthrough and reuse guidance in step 9

## [v02.21r] — 2026-03-03 10:27:04 PM EST

### Changed
- Restructured GAS Template and GAS Test pages — setup instructions are now the primary section with configuration inputs embedded inline at the relevant steps (e.g. Deployment ID input appears at step 8, Spreadsheet fields at step 11)
- Replaced separate collapsible instructions + standalone config form with a unified "Setup & Configuration" flow

#### `gas-template.html` — v01.03w
##### Changed
- Setup instructions moved before config inputs — inputs now appear inline within the step where they apply
- Section header renamed from "Configuration" to "Setup & Configuration"

#### `gas-test.html` — v01.02w
##### Changed
- Setup instructions moved before config inputs — inputs now appear inline within the step where they apply
- Section header renamed from "Configuration" to "Setup & Configuration"

## [v02.20r] — 2026-03-03 10:19:44 PM EST

### Added
- Collapsible GAS Setup Instructions section on both GAS Template and GAS Test pages — step-by-step guide covering Apps Script project creation, GCP linking, deployment, and token configuration

#### `gas-template.html` — v01.02w
##### Added
- Collapsible setup instructions panel — 12-step guide for creating and configuring the Apps Script project, including manifest settings, GCP linking, deployment, and optional spreadsheet integration

#### `gas-test.html` — v01.01w
##### Added
- Collapsible setup instructions panel — same 12-step guide as the GAS Template page

## [v02.19r] — 2026-03-03 10:09:44 PM EST

### Added
- New GAS Test page (`gas-test.html`) — test instance of the GAS template for trying out configuration before modifying the template itself
- New GAS project `GasTest` with `.gs` file, config.json, and all tracking files (changelogs, version files)
- GAS Test page uses separate `gas-test-` localStorage keys so it doesn't conflict with the template page

#### `gas-test.html` — v01.00w
##### Added
- Test instance of the GAS integration status dashboard — identical functionality to gas-template with separate localStorage namespace

#### `gas-test.gs` — 01.00g
##### Added
- Test instance of the GAS template script — pulls from and deploys to GasTest directory

## [v02.18r] — 2026-03-03 09:53:51 PM EST

### Added
- Interactive configuration form on GAS Template status page — input GAS project variables directly in the browser and test the GAS iframe connection without editing repo files
- localStorage persistence for configuration values — saved settings restore automatically on page load
- Copy Config button generates exportable config.json content for easy transfer to the repository

#### `gas-template.html` — v01.01w
##### Added
- Interactive configuration form — input GAS project variables (Title, Deployment ID, Spreadsheet ID, Sheet Name, Sound File ID) directly on the status page
- Apply button saves settings to browser storage for instant GAS iframe testing without editing repo files
- Copy Config button generates exportable config.json content for easy transfer to the repository
- Clear button removes saved settings and resets the dashboard to default state
- Previously saved settings automatically restore on page load

## [v02.17r] — 2026-03-03 09:40:29 PM EST

### Added
- New GAS integration status page (`gas-template.html`) — diagnostic dashboard showing HTML and GAS layer configuration status
- New GAS project `GasTemplate` with blank template `.gs` file, config.json, and all tracking files
- GAS status reporting via postMessage — the `.gs` template sends config status to the embedding HTML page for real-time dashboard updates

#### `gas-template.html` — v01.00w
##### Added
- Dark-themed diagnostic dashboard showing GAS integration status at a glance
- HTML layer checks: Deployment ID, Page Title, Auto-Refresh, Version Polling, Audio Context, Wake Lock
- GAS layer checks: Connection status, GAS Version, GitHub Config, Spreadsheet, Sound File
- Real-time status updates — dots change color as configuration is detected

#### `gas-template.gs` — 01.00g
##### Added
- Blank GAS template with all placeholder variables ready for configuration
- Config status reporting via `getAppData()` — reports which variables are configured vs placeholder
- postMessage integration sends `gas-status` to embedding page for dashboard display

## [v02.16r] — 2026-03-03 09:16:20 PM EST

### Changed
- Deactivated maintenance mode on test page — maintenance overlay removed, page now accessible normally

#### `test.html` — v01.18w
##### Changed
- Maintenance mode deactivated — page is now accessible normally

## [v02.15r] — 2026-03-02 06:52:41 PM EST

### Fixed
- Re-applied v02.14r version bump through proper `claude/*` branch workflow (v02.14r was erroneously pushed directly to `main`)

## [v02.14r] — 2026-03-02 06:43:07 PM EST

### Changed
- Bumped repository version from v02.13r to v02.14r

## [v02.13r] — 2026-03-02 12:55:00 PM EST

### Added
- "Imported Skills — Do Not Modify" rule in behavioral-rules.md — imported skills (`.claude/skills/imported--*`) are frozen; only location pointers may be updated, preserving traceability of which skill produces which behavior

## [v02.12r] — 2026-03-02 12:18:12 PM EST

### Added
- `SKILLS-REFERENCE.md` — complete inventory of all Claude Code skills (custom, imported, and bundled/plugin) with visibility status and guidance on when to add local vs. rely on bundled

## [v02.11r] — 2026-03-02 11:58:44 AM EST

### Added
- 6 imported Claude Code Skills in `.claude/skills/` with `imported--` prefix: `/webapp-testing` (Playwright page testing, from Anthropic), `/frontend-design` (distinctive UI creation, from Anthropic), `/skill-creator` (meta-skill for creating new skills, from Anthropic), `/security-review` (OWASP/web security audit, inspired by Trail of Bits), `/git-cleanup` (stale branch/worktree cleanup, inspired by Trail of Bits), `/diff-review` (pre-push differential code review, inspired by Trail of Bits)

## [v02.10r] — 2026-03-02 11:48:51 AM EST

### Added
- Claude Code Skills — 6 invokable workflow skills in `.claude/skills/`: `/phantom-update` (timestamp alignment), `/maintenance-mode` (toggle maintenance overlay), `/new-page` (create new HTML page with boilerplate), `/reconcile` (end multi-session mode), `/remember-session` (save session context), `/initialize` (first deployment setup)

## [v02.09r] — 2026-03-01 06:17:49 PM EST

### Added
- New Soccer Ball page — animated scene with two kids kicking a soccer ball back and forth, complete with SVG stick-figure players, rolling ball, sky, clouds, sun, goal posts, and grass

#### `soccer-ball.html` — v01.01w
##### Added
- Animated soccer scene with two kids in jerseys (#7 red, #10 blue) kicking a ball between them
- Rolling soccer ball with spin animation and bouncing arc
- Scenic background with sky gradient, animated clouds, sun, goal posts, and grass tufts

## [v02.08r] — 2026-03-01 05:37:23 PM EST

### Changed
- Test page placed into maintenance mode — displays maintenance overlay with timestamp

#### `test.html` — v01.17w (no change)
##### Changed
- Page placed into maintenance mode — visitors see a maintenance overlay until mode is deactivated

## [v02.07r] — 2026-03-01 04:15:28 PM EST

### Changed
- Bumped all HTML page versions to v01.17w
- Per-file subheadings now show "(no change)" when a file is affected but its version was not bumped
- Updated v02.04r subheadings in CHANGELOG.md to use the new "(no change)" format

#### `index.html` — v01.17w
##### Changed
- Version number updated

#### `test.html` — v01.17w
##### Changed
- Version number updated

## [v02.06r] — 2026-03-01 04:09:11 PM EST

### Changed
- Per-file subheadings in CHANGELOG.md now show the version each page/GAS file became — format: `#### \`filename\` — vXX.XXw`
- Backfilled version numbers on existing per-file subheadings for v02.00r, v01.97r, and v01.96r

## [v02.05r] — 2026-03-01 04:02:15 PM EST

### Changed
- CHANGELOG.md version section headers now show only the repo version — page/GAS versions removed from headers since per-file subheadings carry that detail
- Cleaned up 13 archived CHANGELOG entries and 3 active entries to remove `w`/`g` versions from headers

## [v02.04r] — 2026-03-01 03:57:39 PM EST

### Changed
- Page and GAS changelog version headers now show repo version after the timestamp instead of in parentheses before it — format: `[vXX.XXw] — timestamp — vXX.XXr`

#### `index.html` — v01.16w (no change)
##### Changed
- Changelog version headers now show the repo version after the timestamp for easier reading

#### `test.html` — v01.16w (no change)
##### Changed
- Changelog version headers now show the repo version after the timestamp for easier reading

## [v02.03r] — 2026-03-01 03:52:24 PM EST

### Changed
- CHANGELOG entries for HTML/GAS changes now use per-file subheadings (`#### \`filename\``) instead of inline bold parentheses — each affected file gets its own section with categorized entries
- Backfilled per-file subheadings for v02.00r, v01.97r, and v01.96r CHANGELOG entries

## [v02.02r] — 2026-03-01 03:46:36 PM EST

### Added
- CHANGELOG entries for HTML/GAS changes now include file attribution — affected filenames appended in bold parentheses (e.g. `(**index.html**, **test.html**)`)

## [v02.01r] — 2026-03-01 03:42:24 PM EST

### Changed
- Strengthened duration annotation rules to prevent skipping `⏱️` markers between consecutive bookends

## [v02.00r] — 2026-03-01 03:35:27 PM EST

### Changed
- Changelog popup now requires the X button to close — clicking outside the popup no longer dismisses it

#### `index.html` — v01.16w
##### Changed
- Changelog popup now requires the X button to close — clicking outside no longer dismisses it

#### `test.html` — v01.16w
##### Changed
- Changelog popup now requires the X button to close — clicking outside no longer dismisses it

## [v01.99r] — 2026-03-01 03:29:33 PM EST

### Changed
- Session context now enforces a 2-session cap — only Latest Session + 1 Previous are retained; older entries are dropped
- Trimmed SESSION-CONTEXT.md from 7 sessions to 2

## [v01.98r] — 2026-03-01 03:22:00 PM EST

### Added
- Private repo compatibility enforced as Pre-Commit checklist item #19 — verifies no client-side browser code references authenticated GitHub endpoints

## [v01.97r] — 2026-03-01 03:14:52 PM EST

### Changed
- Changelog popup now fetches from same-origin deployment copy instead of raw.githubusercontent.com — works with private repos
- Added private repo compatibility rule and changelog deployment sync rule

#### `index.html` — v01.15w
##### Changed
- Changelog popup now loads reliably when the repository is private

#### `test.html` — v01.15w
##### Changed
- Changelog popup now loads reliably when the repository is private

## [v01.96r] — 2026-03-01 03:04:05 PM EST

### Added
- Clicking the version number overlay now opens a changelog popup showing the page's recent changes
- Changelog popup can be closed with the X button, clicking outside, or pressing Escape

#### `index.html` — v01.14w
##### Added
- Clicking the version number now opens a changelog popup showing recent page updates

#### `test.html` — v01.14w
##### Added
- Clicking the version number now opens a changelog popup showing recent page updates

## [v01.95r] — 2026-03-01 02:35:56 PM EST

### Changed
- Added "Read the full message first" clause to single-commit-per-interaction rule — prevents premature commits when a user message contains multiple requests

## [v01.94r] — 2026-03-01 02:25:56 PM EST

### Added
- Added `REMINDERS_DISPLAY` toggle variable — controls whether active reminders are surfaced at session start (default `On`)
- Added `SESSION_CONTEXT_DISPLAY` toggle variable — controls whether previous session context is surfaced at session start (default `On`)

## [v01.93r] — 2026-03-01 02:18:05 PM EST

### Changed
- Completed "Consider creating a session recap file" reminder — moved from Active to Completed in REMINDERS.md

## [v01.92r] — 2026-03-01 02:10:10 PM EST

### Changed
- Turned on `CHAT_BOOKENDS` toggle — mid-response bookend markers now emitted
- Updated output formatting pointer in CLAUDE.md to reflect toggle independence — removed hardcoded bookend flow description, replaced with toggle-aware summary
- Fixed remaining toggle-dependent reference in "Duration before user interaction" rule — now uses "response start timestamp" instead of "opening marker (CODING START)"

## [v01.91r] — 2026-03-01 02:05:07 PM EST

### Changed
- Made `CHAT_BOOKENDS` and `END_OF_RESPONSE_BLOCK` toggles fully independent — added silent timestamp/estimate capture so all end-of-response block features (ACTUAL TOTAL COMPLETION TIME, PLAN EXECUTION TIME, ESTIMATE CALIBRATED) work even when mid-response bookends are off, and vice versa

## [v01.90r] — 2026-03-01 01:52:37 PM EST

### Changed
- Turned on `END_OF_RESPONSE_BLOCK` toggle — end-of-response block (UNAFFECTED URLS through CODING COMPLETE) is now emitted after each response

## [v01.89r] — 2026-03-01 01:44:43 PM EST

### Changed
- Renamed `AutoUpdateOnlyHtmlTemplate` to `HtmlTemplateAutoUpdate` across all files, directories, and documentation references (HTML template, GAS template, version files, changelogs, config files)

## [v01.88r] — 2026-03-01 01:28:40 PM EST

### Changed
- Chat bookends and end-of-response block toggles set to Off for streamlined output

## [v01.87r] — 2026-03-01 01:15:52 PM EST

### Changed
- Improved AskUserQuestion Visibility rule — now covers multi-question popups (all questions shown together in chat) and echoes the user's selections back into chat after they respond

## [v01.86r] — 2026-03-01 01:09:09 PM EST

### Added
- Added "AskUserQuestion Visibility" rule — question text and all options are now shown in the chat before the popup appears, so the question context is preserved in conversation history (same pattern as Plan Mode Visibility for ExitPlanMode)

## [v01.85r] — 2026-03-01 12:53:32 PM EST

### Added
- Added multi-session mode (`MULTI_SESSION_MODE` variable) — when enabled, parallel Claude Code sessions can safely push to the same repo without merge conflicts on shared state files (repo version, README timestamp, CHANGELOG version sections, STATUS.md)
- Added "Reconcile Multi-Session" command to catch up on deferred versioning and changelog work when multi-session mode is turned off

## [v01.84r] — 2026-03-01 12:27:00 PM EST

### Changed
- Large file write status messages now include a timestamp and duration estimate so the user knows when the operation started and roughly how long to wait

## [v01.83r] — 2026-03-01 12:22:35 PM EST

### Added
- Added "Plan Mode Visibility" rule — plan content must be output as chat text before calling ExitPlanMode so the user can reference it after the approval window disappears

## [v01.82r] — 2026-03-01 12:16:34 PM EST

### Added
- Added session context staleness detection and auto-reconstruction to Session Start Checklist — when SESSION-CONTEXT.md is outdated (missed "remember session"), the system auto-recovers from CHANGELOG entries, commits, and pushes so context persists across sessions

## [v01.81r] — 2026-03-01 11:58:00 AM EST

### Changed
- Moved SESSION SAVED indicator to appear after CODING COMPLETE instead of inside the end-of-response block — ensures maximum visibility so the user cannot miss the session-save confirmation

## [v01.80r] — 2026-03-01 11:53:27 AM EST

### Added
- Added 4 sandwich ingredients to the to-do list: lettuce, sliced turkey, mustard, pickles

## [v01.79r] — 2026-03-01 11:44:57 AM EST

### Changed
- Session start now shows "📌 Reminders For Developer:" instead of "📌 Reminders from last session:"
- Session start now automatically surfaces previous session context from SESSION-CONTEXT.md (no need to type "read session context")
- Session start now shows a tip reminding the developer about the "remember session" command
- "Remember session" now recommends starting a new session in the end-of-response block to preserve saved context

## [v01.78r] — 2026-03-01 11:39:23 AM EST

### Changed
- Completed "Get bread" to-do item

## [v01.77r] — 2026-03-01 11:25:23 AM EST

### Changed
- Renamed REMINDERS.md heading to "Reminders for Developer" — clarifies these are the developer's own notes, not a system Claude manages autonomously
- Renamed SESSION-CONTEXT.md heading to "Previous Session Context" — clearly distinct from developer reminders
- Broadened "User-Owned Content" rule to cover repurposing/restructuring — never fold a new feature into an existing user-created system or assume one replaces the other without explicit approval
- Updated all references across CLAUDE.md, output-formatting.md, and README.md to use the new names

## [v01.76r] — 2026-03-01 11:20:19 AM EST

### Added
- Added "User-Owned Content — Do Not Override" rule to behavioral-rules.md — never complete, remove, or modify user-created reminders, to-do items, or notes without explicit approval

### Fixed
- Restored incorrectly completed reminder back to Active Reminders — "Consider creating a session recap file" was closed without user approval

## [v01.75r] — 2026-03-01 11:12:55 AM EST

### Added
- Created `repository-information/SESSION-CONTEXT.md` — session context log for cross-session continuity
- Added "Remember Session" command to CLAUDE.md — writes session context to SESSION-CONTEXT.md when the user says "Remember Session", enabling a future session to pick up where the previous one left off

## [v01.74r] — 2026-03-01 11:06:35 AM EST

### Fixed
- Fixed cascading indentation in end-of-response block — added mandatory blank lines between sections and flush-left content to break markdown list context that caused AGENTS USED numbered list to nest all subsequent sections

### Added
- Added "Section separation" formatting rule to end-of-response block in chat-bookends.md — blank line between every section pair, flush-left content

## [v01.73r] — 2026-03-01 10:59:10 AM EST

### Added
- Added NEW FOLDERS section to end-of-response block — shows clickable links to any new directories created during a response, positioned between TODO and AFFECTED URLS (skipped entirely when no folders were created)

## [v01.72r] — 2026-03-01 03:07:05 AM EST

### Changed
- Tightened "Single commit per interaction" rule to absolute — exactly one commit per interaction with only two exceptions (user explicitly requests multiple, or prior push already merged). Removed checkpoint exception

## [v01.71r] — 2026-03-01 03:03:55 AM EST

### Added
- Added "Single commit per interaction" rule to Pre-Commit Checklist — each user interaction should produce one commit, not split into intermediate + push commits

### Changed
- Rewritten "Rebase before push commit" rule — rebase now happens before making edits (using `git stash` if needed) instead of after, eliminating unnecessary intermediate commits

## [v01.70r] — 2026-03-01 02:57:25 AM EST

### Added
- Added "Explicit Opinion When Consulted" behavioral rule — when the user delegates a judgment call via conditional language ("if you think", "if it makes sense"), state the opinion clearly and act on it rather than silently complying
- Added "Rule Placement Autonomy" behavioral rule — autonomously choose the best location (CLAUDE.md, existing rules file, or new rules file) when the user asks to make something a rule, with mandatory contradiction scanning

## [v01.69r] — 2026-03-01 02:50:58 AM EST

### Fixed
- Restored missing estimate calibration details in `.claude/rules/chat-bookends.md` — commit cycle example, "do not over-correct" caveat, calibration output example, follow-up commit fallback, and timing note
- Restored missing placement rule rationale suffixes in `.claude/rules/behavioral-rules.md` — explanatory sentences for all 5 placement zone rules

## [v01.68r] — 2026-03-01 02:24:37 AM EST — [8fea2f9](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/8fea2f922aa17d6b6c4221eba72c084f89fa0770)

### Changed
- Deep compacted CLAUDE.md from 993 → 272 lines (73% reduction) by extracting content to 4 new always-loaded `.claude/rules/` files: `chat-bookends.md`, `chat-bookends-reference.md`, `behavioral-rules.md`, `output-formatting.md`
- Consolidated 13 individual pointer sections into a single Reference Files table
- Moved Commit Message Naming content to `.claude/rules/gas-scripts.md`
- Updated CLAUDE.md pointers and "Maintaining these checklists" section to document always-loaded vs path-scoped rules file types

## [v01.67r] — 2026-03-01 01:46:08 AM EST

### Changed
- Extracted 10 reference sections from CLAUDE.md into 6 path-scoped `.claude/rules/` files, reducing CLAUDE.md from ~1255 to ~993 lines while preserving all functionality via one-line pointers
- Populated `.claude/rules/html-pages.md` with Build Version reference (polling, maintenance mode, new page setup, directory structure)
- Populated `.claude/rules/gas-scripts.md` with Version Bumping, GAS Project Config, and Coding Guidelines Reference
- Populated `.claude/rules/workflows.md` with Merge Conflict Prevention and Commit SHA Tracking
- Populated `.claude/rules/repo-docs.md` with ARCHITECTURE.md updates, Docs Sync, Internal Link Reference, Relative Path Resolution, and Markdown Formatting
- Populated `.claude/rules/changelogs.md` with quick-reference guide for changelog formats and archive rotation
- Populated `.claude/rules/init-scripts.md` with init script details, Phantom Edit, and Line Ending Safety

## [v01.66r] — 2026-03-01 01:22:38 AM EST

### Added
- Added "Backups Before Major Changes" rule to CLAUDE.md — recommends creating `.bak` backups in `repository-information/backups/` before large-scale structural edits to critical files
- Created initial `CLAUDE.md.bak` backup in `repository-information/backups/`

## [v01.65r] — 2026-03-01 01:13:43 AM EST

### Added
- Created `.claude/rules/` directory with 6 path-scoped placeholder rule files for future CLAUDE.md content extraction (html-pages, gas-scripts, workflows, repo-docs, changelogs, init-scripts)

## [v01.64r] — 2026-03-01 01:03:17 AM EST

### Changed
- Eliminated SHA backfill commit from push cycle — CHANGELOG version headers no longer include commit SHA links at push time, reducing each push from 2 commits to 1
- SHA links are now deferred to archive rotation — when entries move from CHANGELOG.md to CHANGELOG-archive.md, the commit SHA is looked up from git log and added to the header automatically
- Removed "CHANGELOG SHA Backfill — Potential Elimination" from IMPROVEMENTS.md (now implemented)

## [v01.63r] — 2026-03-01 12:42:35 AM EST — [97b1022](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/97b102240a16332188623c42eb127771894c17fb)

### Changed
- Disabled maintenance mode on all pages (index.html and test.html) — maintenance overlay removed, pages now accessible normally

## [v01.62r] — 2026-03-01 12:37:10 AM EST — [eef6939](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/eef693974db315b1f88ac1a8db7443d092d51c9a)

### Changed
- Increased CHANGELOG archive rotation limit from 50 to 100 version sections across CLAUDE.md, CHANGELOG.md, and CHANGELOG-archive.md (including rotation logic, quick rule, examples, and capacity counter)

## [v01.61r] — 2026-03-01 12:32:47 AM EST — [766ccd3](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/766ccd368d2b5a3855d8a27e948fe00734b52dd0)

### Fixed
- Completed CHANGELOG archive rotation — moved all 50 remaining 2026-02-28 sections to archive as a single date group (previously only 7 of 57 were moved, incorrectly splitting the date group)

### Changed
- Archive rotation logic clarified: date groups are indivisible — ALL sections sharing a date move together, even if that means moving 50+ sections at once. Added "Quick rule" summary for instant recognition
- Removed incorrect "split by count" fallback from Pre-Commit #7 — date groups are never split

## [v01.60r] — 2026-03-01 12:23:20 AM EST — [78b2b32](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/78b2b320ea24b29d24467f7635165e9bca5c1aab)

### Fixed
- Performed overdue CHANGELOG archive rotation — moved 7 oldest sections (v01.01r–v01.07r) to CHANGELOG-archive.md, reducing from 59 to 52 sections

### Changed
- Archive rotation trigger reinforced in Pre-Commit #7 — capacity counter now explicitly described as a mandatory rotation trigger (when >50, rotation must run), with additional handling for single-date accumulation where all non-exempt sections share one date

## [v01.59r] — 2026-03-01 12:17:26 AM EST — [35c2de6](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/35c2de6c5358b1fbe00f79e73afd31574da44233)

### Changed
- Rebase check now uses direct `git merge-base --is-ancestor` ancestry test instead of tracking session push history — simpler, deterministic, and correct regardless of how many pushes occurred
- Pre-Push #5 simplified to a branch-exists check (rebase responsibility moved to Pre-Commit push commit cycle)
- "Push only once per branch" rule replaced with "Multiple pushes per session are safe" — reflecting actual behavior

## [v01.58r] — 2026-03-01 12:03:06 AM EST — [999344f](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/999344fe93e84189696814a3451fe3d3d2eee647)

### Changed
- Completed "Get tomato" to-do item

Developed by: ShadowAISolutions
