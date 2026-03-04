# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 59/100`

## [Unreleased]

## [v02.68r] — 2026-03-04 06:32:59 PM EST

### Added
- Created new GAS template ecosystem: `GasTemplate.html` (GAS-enabled HTML template), `gas-template.gs` (GAS template script with placeholders), `gas-template.config.json` (template config)
- Created supporting files: version files, changelogs, and changelog archives for the new GAS template

### Changed
- Updated gas-project-creator "Copy Claude Config" prompt to reference new GAS template files instead of its own files as the copy source
- Updated `gas-project-creator-code.js.txt` to serve template GAS code (placeholder values) instead of gas-project-creator's own code

#### `gas-project-creator.html` — v01.26w

##### Changed
- Copy Claude Config prompt now directs Claude to copy from the GAS template ecosystem when creating new projects

## [v02.67r] — 2026-03-04 06:19:05 PM EST

### Changed
- Renamed gas-template environment to gas-project-creator — all files, references, localStorage keys, documentation, and architecture diagrams updated

#### `gas-project-creator.html` — v01.25w

##### Changed
- Page renamed from gas-template to gas-project-creator with all internal references updated

#### `gas-project-creator.gs` — 01.08g

##### Changed
- Script renamed from gas-template to gas-project-creator with all file paths and references updated

## [v02.66r] — 2026-03-04 05:47:54 PM EST

### Added
- GAS iframe now reports config status to the embedding page dashboard via `gas-status` postMessage — resolves "GAS Connection: No response" indicator

#### `gas-template.gs` — 01.07g

##### Added
- Dashboard now shows live connection status, GAS version, GitHub token status, spreadsheet connection, and sound configuration

## [v02.65r] — 2026-03-04 05:37:43 PM EST

### Changed
- Improved Copy Claude Config prompt to specify source files (gas-template.html, gas-template.gs, gas-template.config.json), and instruct Claude to register new projects in the GAS Projects table and update ARCHITECTURE.md, README.md, and STATUS.md

#### `gas-template.html` — v01.24w

##### Changed
- Copy Claude Config prompt now specifies exactly which files to copy from and which docs to update when creating a new project

## [v02.64r] — 2026-03-04 05:31:19 PM EST

### Changed
- Copy Claude Config prompt now instructs Claude to create the full page ecosystem if the file path doesn't exist yet in the repo

#### `gas-template.html` — v01.23w

##### Changed
- Copy Claude Config prompt includes ecosystem creation instructions for new projects

## [v02.63r] — 2026-03-04 05:27:21 PM EST

### Changed
- Moved Apply button (renamed "Test GAS Connection") directly under the Deployment ID field for immediate testing after entering the ID
- Renamed "Copy Config" button to "Copy Claude Config" for clarity

#### `gas-template.html` — v01.22w

##### Changed
- "Test GAS Connection" button now appears directly under the Deployment ID field — test your connection immediately after entering the ID
- "Copy Config" renamed to "Copy Claude Config" to clarify it copies a Claude-ready prompt

## [v02.62r] — 2026-03-04 05:17:05 PM EST

### Changed
- Synced gas-template.html with all structural improvements from gas-test.html — deployment ID moved above config fields with required label, deploy-separator styling, disabled-state gating on buttons/tabs until deployment ID entered, Copy Config copies directly to clipboard with Claude-ready prompt, Copy Code.gs styled as full-width button with disabled state

#### `gas-template.html` — v01.21w

##### Changed
- Configuration form now requires Deployment ID before enabling Apply, Copy Config, Copy Code.gs, and GAS Preview
- Deployment ID field moved to top of form with "required" label for better visibility
- Copy Config now copies a Claude-ready prompt with JSON directly to clipboard instead of showing an inline output panel
- Copy Code.gs button restyled as full-width action button with disabled state
- Form default values updated to reflect actual template repo paths

## [v02.61r] — 2026-03-04 04:32:56 PM EST

### Removed
- Deleted entire gas-test ecosystem — `gas-test.html`, `GasTest/` GAS project directory (gas-test.gs, gas-test.config.json, gas-testgs.version.txt), all associated version/changelog files (gas-testhtml.version.txt, gas-testhtml.changelog.txt, 4 changelog markdown files)
- Removed gas-test references from STATUS.md, ARCHITECTURE.md, README.md structure tree, and GAS Projects table in gas-scripts.md

## [v02.60r] — 2026-03-04 02:39:50 PM EST

### Added
- Mid-response bookend omission prevention rule in `chat-bookends.md` — documents the failure pattern of silently dropping phase markers during complex responses and provides a mandatory self-check procedure to prevent it

## [v02.59r] — 2026-03-04 02:33:28 PM EST

### Fixed
- CSS specificity bug in setup section numbering fix — `.setup-steps > ol > li` (specificity 0,3,0) was overriding `.step-group-label`'s `counter-increment: none` (specificity 0,1,0). Moved counter-increment to `:not(.step-group-label)` selector so group labels truly don't increment the step counter

#### `gas-template.html` — v01.20w

##### Fixed
- Setup steps now numbered correctly — group labels no longer consume step numbers

#### `gas-test.html` — v01.25w

##### Fixed
- Setup steps now numbered correctly — group labels no longer consume step numbers

## [v02.58r] — 2026-03-04 02:20:46 PM EST

### Fixed
- Setup section numbering on GAS Template and GAS Test pages — group label `<li>` elements were consuming numbers in the `<ol>` (step 1 appeared as step 2, etc.) because native `<ol>` counters ignore CSS `counter-increment: none`. Switched to an explicit CSS counter so group labels no longer eat step numbers

#### `gas-template.html` — v01.19w

##### Fixed
- Setup steps now numbered correctly starting from 1 — group labels no longer consume a step number

#### `gas-test.html` — v01.24w

##### Fixed
- Setup steps now numbered correctly starting from 1 — group labels no longer consume a step number

## [v02.57r] — 2026-03-04 02:11:49 PM EST

### Added
- Subtle subsection group labels in GAS setup steps on both pages: Google Account Setup, New Apps Script Project, GAS Project Settings, GAS Editor, GAS Triggers

#### `gas-test.html` — v01.23w

##### Added
- Setup steps now grouped with subtle section labels for easier navigation

#### `gas-template.html` — v01.18w

##### Added
- Setup steps now grouped with subtle section labels for easier navigation

## [v02.56r] — 2026-03-04 01:59:45 PM EST

### Changed
- Split manifest step on both GAS pages: step 5 now just enables the manifest file toggle, step 8 (after GITHUB_TOKEN) sets the JSON contents
- Updated step references throughout (Deploy ID from step 9, code pasted in step 10)

#### `gas-test.html` — v01.22w

##### Changed
- Manifest setup split into two steps: enable toggle (step 5) and set contents (step 8)

#### `gas-template.html` — v01.17w

##### Changed
- Manifest setup split into two steps: enable toggle (step 5) and set contents (step 8)

## [v02.55r] — 2026-03-04 01:50:56 PM EST

### Changed
- Reordered first 7 GAS setup steps on both pages: enable API at usersettings first, then GCP setup, then create Apps Script project, manifest, link GCP, then GITHUB_TOKEN

#### `gas-test.html` — v01.21w

##### Changed
- Setup steps reordered: API enablement and GCP setup now come before creating the Apps Script project

#### `gas-template.html` — v01.16w

##### Changed
- Setup steps reordered: API enablement and GCP setup now come before creating the Apps Script project

## [v02.54r] — 2026-03-04 01:39:56 PM EST

### Changed
- Reordered GAS setup steps on both GAS Test and GAS Template pages for logical flow: GITHUB_TOKEN before Deploy #1, Code.gs copy before OAuth, OAuth before Deploy #2, optional trigger last

#### `gas-test.html` — v01.20w

##### Changed
- Setup steps reordered so each step's prerequisites are completed before it runs

#### `gas-template.html` — v01.15w

##### Changed
- Setup steps reordered so each step's prerequisites are completed before it runs

## [v02.53r] — 2026-03-04 01:26:42 PM EST

### Added
- "Bootstrap & Circular Dependency Reasoning" rule in behavioral-rules.md to catch chicken-and-egg logic in future explanations
- Two-step deployment instructions (Deploy #1 and Deploy #2) on GAS Test and GAS Template pages explaining the bootstrap flow

#### `gas-test.html` — v01.19w

##### Added
- Deploy #1 and Deploy #2 steps in setup instructions explaining the two-deploy bootstrap and why it's needed

#### `gas-template.html` — v01.14w

##### Added
- Deploy #1 and Deploy #2 steps in setup instructions explaining the two-deploy bootstrap and why it's needed

## [v02.52r] — 2026-03-04 01:15:40 PM EST

### Changed
- Copy Config button now copies prompt + JSON directly to clipboard instead of opening an output panel
- "Clear" button renamed to "Clear Local Storage" for clarity
- "Copy code.gs" button is now blue when active for better visibility
- Removed config output display panel (no longer needed)

#### `gas-test.html` — v01.18w

##### Changed
- Copy Config copies directly to clipboard with Claude-ready prompt instead of showing an output panel
- "Copy code.gs" button styled blue when enabled
- "Clear" button now reads "Clear Local Storage"

## [v02.51r] — 2026-03-04 01:06:51 PM EST

### Changed
- Copy Config button now includes a Claude-friendly instruction prompt so the full output can be pasted directly to Claude for config sync

#### `gas-test.html` — v01.17w

##### Changed
- Copy Config output now includes a prompt instructing Claude to sync the values into config.json, .gs file, and embedding HTML

## [v02.50r] — 2026-03-04 01:01:33 PM EST

### Changed
- Bumped gas-test.gs VERSION to 01.07g and updated the default version field in the GAS Test config form to match

#### `gas-test.html` — v01.16w

##### Changed
- Default version field now shows 01.07g

#### `gas-test.gs` — 01.07g (no change)

## [v02.49r] — 2026-03-04 12:55:33 PM EST

### Changed
- Moved Deployment ID to the first field in the GAS Test config form with a visual separator from other fields
- Made Deployment ID required — Copy Code.gs, Apply, Copy Config, and GAS Preview buttons are disabled until a Deployment ID is entered
- Restyled Copy Code.gs as a full-width action button matching the Apply/Copy Config button style

#### `gas-test.html` — v01.15w

##### Changed
- Deployment ID is now the first config field with a "required" label and visual separator
- Copy Code.gs, Apply, Copy Config, and GAS Preview are disabled until Deployment ID is filled in
- Copy Code.gs button restyled to match other action buttons

## [v02.48r] — 2026-03-04 12:43:18 PM EST

### Changed
- Replaced stale placeholder defaults in GAS Test config form with accurate values matching the actual project — title, version, repo name, file path, and embedding URL now reflect the real configuration

#### `gas-test.html` — v01.14w

##### Changed
- Config form now shows correct project values by default instead of outdated placeholders

## [v02.47r] — 2026-03-04 12:31:14 PM EST

### Added
- Added input fields for all 12 project configuration variables in GAS Template and GAS Test setup wizards — Version, GitHub Owner, GitHub Repo, GitHub Branch, File Path, Embedding URL, and Splash Logo URL now have editable fields alongside the existing Title, Deployment ID, Spreadsheet ID, Sheet Name, and Sound File ID
- All new fields are prefilled with current defaults from `gas-template-code.js.txt` and persist via localStorage
- Copy Code.gs, Copy Config, Apply, and Clear all handle the full set of 12 variables

#### `gas-template.html` — v01.13w

##### Added
- Input fields for Version, GitHub Owner, GitHub Repo, GitHub Branch, File Path, Embedding URL, and Splash Logo URL in the setup wizard
- All fields prefilled with current template defaults and saved/restored via localStorage

#### `gas-test.html` — v01.13w

##### Added
- Input fields for Version, GitHub Owner, GitHub Repo, GitHub Branch, File Path, Embedding URL, and Splash Logo URL in the setup wizard
- All fields prefilled with current template defaults and saved/restored via localStorage

## [v02.46r] — 2026-03-04 12:22:18 PM EST

### Changed
- Reordered setup steps in GAS Template and GAS Test pages so entering project-specific variables and clicking "Copy Code.gs" is the final step — users complete all infrastructure setup first, then fill in config values last when they have all the information

#### `gas-template.html` — v01.12w

##### Changed
- Setup steps reordered so entering project variables (Title, Deployment ID, Spreadsheet ID, Sheet Name, Sound File ID) and copying the code is the last step instead of the first

#### `gas-test.html` — v01.12w

##### Changed
- Setup steps reordered so entering project variables and copying the code is the last step instead of the first

## [v02.45r] — 2026-03-04 12:13:44 PM EST

### Removed
- Removed ~860 lines of detailed architecture/documentation comments from `gas-template-code.js.txt` — kept the title header and project configuration block for a cleaner, more manageable file

## [v02.44r] — 2026-03-04 12:02:24 PM EST

### Changed
- Moved all unique project variables (GitHub repo, deployment ID, spreadsheet ID, sheet name, sound file ID, embedding URL, splash logo URL) to a single configuration block at the top of `gas-template-code.js.txt` for easier management — all inline references now use the top-level variables

## [v02.43r] — 2026-03-04 11:53:21 AM EST

### Changed
- Synced `gas-template-code.js.txt` with `RND_GAS_AND_WEBSITE/Code.gs` — the shared Copy Code.gs source now matches the RND reference implementation

## [v02.42r] — 2026-03-04 11:46:16 AM EST

### Changed
- Consolidated Copy Code.gs to use a single shared template source (`gas-template-code.js.txt`) instead of per-page copies — all pages now copy the canonical template with placeholder values

### Removed
- Removed redundant `gas-test-code.js.txt` — gas-test.html now fetches from the shared `gas-template-code.js.txt`

#### `gas-test.html` — v01.11w

##### Changed
- Copy Code.gs button now fetches from the shared template source instead of a page-specific copy

## [v02.41r] — 2026-03-04 11:28:22 AM EST

### Fixed
- Fixed blank Google Sheets iframe in GAS web app — Google Sheets `/edit?rm=minimal` loads blank when nested inside a GAS sandbox iframe embedded on GitHub Pages due to cross-origin X-Frame-Options/CSP restrictions

### Changed
- Replaced non-functional embedded Sheets iframe with a styled "Open in Google Sheets" button that opens the spreadsheet in a new tab for editing
- Live spreadsheet data (B1, A1, C1 values) continues to display inline via `google.script.run` polling — unaffected by the iframe removal

#### `gas-test.gs` — 01.06g

##### Fixed
- Replaced broken embedded Google Sheets iframe with "Open in Google Sheets" button

#### `gas-template.gs` — 01.06g

##### Fixed
- Same fix applied — replaced broken embedded Google Sheets iframe with "Open in Google Sheets" button

## [v02.40r] — 2026-03-04 11:09:05 AM EST

### Changed
- Reinforced `TEMPLATE_DEPLOY` check in chat-bookends.md URL display rules — added explicit "check TEMPLATE_DEPLOY first" warning to prevent incorrectly showing "no live site deployed" when `TEMPLATE_DEPLOY` = `On`

### Removed
- Removed incorrect "Reference Implementation Fidelity" rule from gas-scripts.md (was not the requested reinforcement)

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


Developed by: ShadowAISolutions
