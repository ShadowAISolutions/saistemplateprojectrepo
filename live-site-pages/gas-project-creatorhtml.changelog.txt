# Changelog — GAS Project Creator Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-project-creatorhtml.changelog-archive.md](gas-project-creatorhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 50/50`

## [Unreleased]

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

## [v01.47w] — 2026-03-04 10:19:18 PM EST — v02.90r

### Changed
- Blank optional fields now show placeholder variable names in copied config instead of hardcoded defaults

## [v01.46w] — 2026-03-04 10:10:42 PM EST — v02.89r

### Changed
- Test GAS Connection button now labeled as optional

### Removed
- Notification toast no longer appears when clearing config fields

## [v01.45w] — 2026-03-04 09:59:20 PM EST — v02.88r

### Fixed
- Setup steps now align flush left under section headers instead of being indented

## [v01.44w] — 2026-03-04 09:52:43 PM EST — v02.87r

### Changed
- Step 4 now recommends creating scripts via Google Sheets as the preferred method
- Standalone script creation shown as an alternative option

## [v01.43w] — 2026-03-04 09:39:40 PM EST — v02.86r

### Changed
- Developer splash logo updated
- Default splash logo URL in setup config updated

## [v01.42w] — 2026-03-04 09:31:18 PM EST — v02.85r

### Changed
- Step 4 now explains standalone vs. linked script creation
- Troubleshooting label updated to "Potential Troubleshooting"

## [v01.41w] — 2026-03-04 09:17:35 PM EST — v02.84r

### Changed
- Input fields now start empty with placeholder hints instead of pre-filled values
- Copy Config button styled with Claude-branded coral/orange color

## [v01.40w] — 2026-03-04 09:11:25 PM EST — v02.83r

### Changed
- Copy Config for Claude button now purple for better visibility
- Clear buttons fully empty fields instead of resetting to defaults
- Removed placeholder text from most input fields for cleaner look
- doGet deployment hint also shown below Test GAS Connection button
- Token reuse note now warns that GitHub only shows tokens once

## [v01.39w] — 2026-03-04 09:01:23 PM EST — v02.82r

### Changed
- GAS preview panel tab is now always accessible
- "Script function not found: doGet" hint with lightbulb emoji now appears at the top of the GAS preview panel
- GitHub token link narrowed to only "Fine-grained tokens" text

## [v01.38w] — 2026-03-04 08:54:07 PM EST — v02.81r

### Added
- Hint explaining that "Script function not found: doGet" confirms a valid deployment ID — proceed with other fields and copy Code.gs

## [v01.37w] — 2026-03-04 08:47:21 PM EST — v02.80r

### Fixed
- Test GAS Connection button now correctly appears grayed out when deployment ID is empty

## [v01.36w] — 2026-03-04 08:42:52 PM EST — v02.79r

### Removed
- HTML Layer status dashboard — redundant status indicators no longer shown

### Changed
- Setup instruction URLs are now clickable links that open in a new tab

## [v01.35w] — 2026-03-04 08:36:59 PM EST — v02.78r

### Changed
- Deployment ID hint now references "Test GAS Connection" instead of old name
- "Copy Code.gs" button renamed to "Copy Code.gs for GAS"
- "Copy Claude Config" button renamed to "Copy Config for Claude"

## [v01.34w] — 2026-03-04 08:27:39 PM EST — v02.77r

### Changed
- Audio context status now correctly shows as active when sound has been unlocked in the current session

### Removed
- Configuration values no longer persist between page refreshes — form resets to defaults on reload
- Clear Local Storage button

## [v01.33w] — 2026-03-04 08:18:28 PM EST — v02.76r

### Changed
- Title field is now marked as optional in the setup form
- Test GAS Connection only validates the deployment ID — no longer changes the page title or saves configuration

### Removed
- Tip banner about doGet errors from the GAS preview panel

## [v01.32w] — 2026-03-04 08:08:19 PM EST — v02.75r

### Changed
- Simplified the configuration form — Version, GitHub Owner, GitHub Repo, and GitHub Branch are now handled automatically when copying the Claude config prompt

### Removed
- Version, GitHub Owner, GitHub Repo, and GitHub Branch input fields from the setup form

## [v01.31w] — 2026-03-04 08:02:31 PM EST — v02.74r

### Changed
- Test GAS Connection panel now shows a helpful tip explaining that the "Script function not found: doGet" error means your Deployment ID is valid

### Removed
- GAS Deployment ID status indicator from the dashboard — the Test GAS Connection panel validates the ID directly
- "LOCALSTORAGE" badge from the Setup & Configuration header

## [v01.30w] — 2026-03-04 07:20:53 PM EST — v02.73r

### Changed
- Test GAS Connection now opens in a resizable bottom panel with a tab toggle instead of a popup window — easier to interact with while configuring

## [v01.29w] — 2026-03-04 07:13:41 PM EST — v02.72r

### Added
- Test GAS Connection button now opens an overlay showing the live GAS deployment for quick testing

### Changed
- Project configuration is now simpler — file path and embedding URL are automatically determined when you copy the Claude config

### Removed
- Local Config status section removed for a cleaner interface
- File Path and Embedding URL fields removed — these are now handled automatically

## [v01.28w] — 2026-03-04 07:02:02 PM EST — v02.71r

### Changed
- Default project title changed to "CHANGE THIS PROJECT TITLE GAS TEMPLATE"
- Default version changed to "01.00g"
- Default file path changed to "googleAppsScripts/NewGas/newgas1.gs"
- Default embedding URL changed to newgas1.html
- Spreadsheet ID and Sound File ID now pre-filled with real values

## [v01.27w] — 2026-03-04 06:53:55 PM EST — v02.70r

### Removed
- GAS integration panel (iframe preview) removed — page is now a standalone setup tool
- Spreadsheet data display removed
- GAS deploy notification sound removed

### Changed
- Page title updated to "GAS Project Creator"

## [v01.26w] — 2026-03-04 06:32:59 PM EST — v02.68r

### Changed
- Copy Claude Config prompt now creates new projects from the GAS template instead of copying from this page

## [v01.25w] — 2026-03-04 06:19:05 PM EST — v02.67r

### Changed
- Page renamed from GAS Template to GAS Project Creator

## [v01.24w] — 2026-03-04 05:37:43 PM EST — v02.65r

### Changed
- Copy Claude Config prompt now specifies exactly which files to copy from and which docs to update when creating a new project

## [v01.23w] — 2026-03-04 05:31:19 PM EST — v02.64r

### Changed
- Copy Claude Config prompt now includes instructions to create the full page ecosystem if the project doesn't exist yet

## [v01.22w] — 2026-03-04 05:27:21 PM EST — v02.63r

### Changed
- "Test GAS Connection" button now appears directly under the Deployment ID field — test your connection immediately after entering the ID
- "Copy Config" renamed to "Copy Claude Config" to clarify it copies a Claude-ready prompt

## [v01.21w] — 2026-03-04 05:17:05 PM EST — v02.62r

### Changed
- Configuration form now requires Deployment ID before enabling Apply, Copy Config, Copy Code.gs, and GAS Preview
- Deployment ID field moved to top of form with "required" label for better visibility
- Copy Config now copies a Claude-ready prompt with JSON directly to clipboard instead of showing an inline output panel
- Copy Code.gs button restyled as full-width action button with disabled state
- Form default values updated to reflect actual template repo paths

## [v01.20w] — 2026-03-04 02:33:28 PM EST — v02.59r

### Fixed
- Setup steps now numbered correctly — group labels no longer consume step numbers

## [v01.19w] — 2026-03-04 02:20:46 PM EST — v02.58r

### Fixed
- Setup steps now numbered correctly starting from 1 — group labels no longer consume a step number

## [v01.18w] — 2026-03-04 02:11:49 PM EST — v02.57r

### Added
- Setup steps now grouped with subtle section labels: Google Account Setup, New Apps Script Project, GAS Project Settings, GAS Editor, GAS Triggers

## [v01.17w] — 2026-03-04 01:59:45 PM EST — v02.56r

### Changed
- Manifest setup split into two steps: enable the toggle first, set the JSON contents later after GITHUB_TOKEN

## [v01.16w] — 2026-03-04 01:50:56 PM EST — v02.55r

### Changed
- Setup steps reordered: API enablement and GCP setup now come before creating the Apps Script project

## [v01.15w] — 2026-03-04 01:39:56 PM EST — v02.54r

### Changed
- Setup steps reordered for logical flow: set GITHUB_TOKEN first, then Deploy #1, paste Code.gs, authorize OAuth, then Deploy #2 to finalize

## [v01.14w] — 2026-03-04 01:26:42 PM EST — v02.53r

### Added
- Setup instructions now explain the two-deploy bootstrap: Deploy #1 creates the deployment URL, Deploy #2 activates auto-updates

## [v01.13w] — 2026-03-04 12:31:14 PM EST — v02.47r

### Added
- Input fields for all project configuration variables — you can now edit Version, GitHub Owner, GitHub Repo, GitHub Branch, File Path, Embedding URL, and Splash Logo URL before copying Code.gs
- All fields prefilled with current defaults and remembered between visits

## [v01.12w] — 2026-03-04 12:22:18 PM EST — v02.46r

### Added
- Interactive embedded Google Sheets preview in the GAS web app — view and edit the connected spreadsheet directly without leaving the page

### Changed
- Setup steps reordered so entering project variables (Title, Deployment ID, Spreadsheet ID, Sheet Name, Sound File ID) and copying the code is the last step — complete all infrastructure setup first, then fill in config values when you have all the information

## [v01.11w] — 2026-03-04 10:09:15 AM EST — v02.33r

### Changed
- "Copy Code.gs" now produces a fully configured script — Spreadsheet ID, Sheet Name, Sound File ID, Title, and Deployment ID from the form fields are injected into the code before copying
- Spreadsheet ID, Sheet Name, and Sound File ID fields moved to Step 1 (before the Copy button) so configuration is ready before you copy

## [v01.10w] — 2026-03-04 09:47:03 AM EST — v02.32r

### Added
- Collapsible troubleshooting guide under "Link the GCP project" setup step — explains the "Apps Script-managed folder" error and how to fix it (grant Project Mover role, migrate project, or create a new one)

## [v01.09w] — 2026-03-04 08:52:09 AM EST — v02.28r

### Added
- New "Spreadsheet Data" dashboard section showing live cell values from the connected Google Sheet
- Live B1 value display with automatic 15-second polling updates
- "Open Spreadsheet" link for quick access to the connected sheet

## [v01.08w] — 2026-03-04 08:29:56 AM EST — v02.26r

### Fixed
- GAS toggle tab moved to bottom-left to avoid overlapping the version/changelog button

## [v01.07w] — 2026-03-04 08:25:01 AM EST — v02.25r

### Fixed
- Spreadsheet and Sound File status now shows "Local only — update GAS script" when values are saved locally but not yet configured in the GAS script, instead of "Not set"

## [v01.06w] — 2026-03-04 08:15:33 AM EST — v02.24r

### Added
- "Local Config" dashboard section showing saved Deployment ID, Spreadsheet ID, Sheet Name, and Sound File ID with status indicators
- Per-field clear buttons (×) next to every configuration input for individually removing saved values
- Collapsible bottom panel for GAS iframe with toggle tab and drag-to-resize handle

### Changed
- GAS iframe opens in a resizable bottom drawer instead of covering the entire page — dashboard stays interactive during testing

## [v01.05w] — 2026-03-04 07:50:45 AM EST — v02.23r

### Added
- "Copy Code.gs" button at step 1 — one-click copy of the full GAS source code to paste into the Apps Script editor

Developed by: ShadowAISolutions
