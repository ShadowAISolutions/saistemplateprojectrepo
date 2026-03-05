# Changelog — GAS Project Creator Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-project-creatorhtml.changelog-archive.md](gas-project-creatorhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 29/50`

## [Unreleased]

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

## [v01.04w] — 2026-03-03 10:42:39 PM EST — v02.22r

### Changed
- Copy button on the JSON manifest block for one-click clipboard copy
- GCP Console link added for users who need to set up a new project
- Detailed GITHUB_TOKEN creation walkthrough and note that the same token works across all your GAS projects

## [v01.03w] — 2026-03-03 10:27:04 PM EST — v02.21r

### Changed
- Setup instructions now appear as the main section with configuration inputs embedded inline at the relevant steps instead of a separate collapsible panel
- Section renamed from "Configuration" to "Setup & Configuration"

## [v01.02w] — 2026-03-03 10:19:44 PM EST — v02.20r

### Added
- Collapsible "GAS Setup Instructions" section — 12-step guide covering Apps Script project creation, manifest configuration, GCP linking, deployment, token setup, and optional spreadsheet integration

## [v01.01w] — 2026-03-03 09:53:51 PM EST — v02.18r

### Added
- Interactive configuration form — input GAS project variables (Title, Deployment ID, Spreadsheet ID, Sheet Name, Sound File ID) directly on the status page
- Apply button saves settings to browser storage for instant GAS iframe testing without editing repo files
- Copy Config button generates exportable config.json content for easy transfer to the repository
- Clear button removes saved settings and resets the dashboard to default state
- Previously saved settings automatically restore on page load

Developed by: ShadowAISolutions
