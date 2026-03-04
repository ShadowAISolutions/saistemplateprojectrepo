# Changelog — GAS Test Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-testhtml.changelog-archive.md](gas-testhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 21/50`

## [Unreleased]

## [v01.21w] — 2026-03-04 01:50:56 PM EST — v02.55r

### Changed
- Setup steps reordered: API enablement and GCP setup now come before creating the Apps Script project

## [v01.20w] — 2026-03-04 01:39:56 PM EST — v02.54r

### Changed
- Setup steps reordered for logical flow: set GITHUB_TOKEN first, then Deploy #1, paste Code.gs, authorize OAuth, then Deploy #2 to finalize

## [v01.19w] — 2026-03-04 01:26:42 PM EST — v02.53r

### Added
- Setup instructions now explain the two-deploy bootstrap: Deploy #1 creates the deployment URL, Deploy #2 activates auto-updates

## [v01.18w] — 2026-03-04 01:15:40 PM EST — v02.52r

### Changed
- Copy Config now copies directly to clipboard — no output panel opens
- "Copy code.gs" button is now blue when active
- "Clear" button renamed to "Clear Local Storage"

## [v01.17w] — 2026-03-04 01:06:51 PM EST — v02.51r

### Changed
- Copy Config now copies both a prompt and the JSON — paste it directly to Claude and it knows what to do

## [v01.16w] — 2026-03-04 01:01:33 PM EST — v02.50r

### Changed
- Default version field updated to match the latest GAS script version

## [v01.15w] — 2026-03-04 12:55:33 PM EST — v02.49r

### Changed
- Deployment ID is now the first field you see, with a visual separator from the rest of the configuration
- Copy Code.gs, Apply, Copy Config, and GAS Preview buttons stay disabled until you enter a Deployment ID
- Copy Code.gs button restyled to match the other action buttons

## [v01.14w] — 2026-03-04 12:43:18 PM EST — v02.48r

### Changed
- Config form now shows correct project values by default — title, version, repo name, file path, and embedding URL match the actual project instead of outdated placeholders

## [v01.13w] — 2026-03-04 12:31:14 PM EST — v02.47r

### Added
- Input fields for all project configuration variables — you can now edit Version, GitHub Owner, GitHub Repo, GitHub Branch, File Path, Embedding URL, and Splash Logo URL before copying Code.gs
- All fields prefilled with current defaults and remembered between visits

## [v01.12w] — 2026-03-04 12:22:18 PM EST — v02.46r

### Changed
- Setup steps reordered so entering project variables and copying the code is the last step — complete all infrastructure setup first, then fill in config values when you have all the information

## [v01.11w] — 2026-03-04 11:46:16 AM EST — v02.42r

### Changed
- Setup wizard now copies from the shared GAS template source instead of a page-specific copy

## [v01.10w] — 2026-03-04 10:09:15 AM EST — v02.33r

### Changed
- "Copy Code.gs" now produces a fully configured script — Spreadsheet ID, Sheet Name, Sound File ID, Title, and Deployment ID from the form fields are injected into the code before copying
- Spreadsheet ID, Sheet Name, and Sound File ID fields moved to Step 1 (before the Copy button) so configuration is ready before you copy

## [v01.09w] — 2026-03-04 09:47:03 AM EST — v02.32r

### Added
- Collapsible troubleshooting guide under "Link the GCP project" setup step — explains the "Apps Script-managed folder" error and how to fix it (grant Project Mover role, migrate project, or create a new one)

## [v01.08w] — 2026-03-04 08:52:09 AM EST — v02.28r

### Added
- New "Spreadsheet Data" dashboard section showing live cell values from the connected Google Sheet
- Live B1 value display with automatic 15-second polling updates
- "Open Spreadsheet" link for quick access to the connected sheet

## [v01.07w] — 2026-03-04 08:29:56 AM EST — v02.26r

### Fixed
- GAS toggle tab moved to bottom-left to avoid overlapping the version/changelog button

## [v01.06w] — 2026-03-04 08:25:01 AM EST — v02.25r

### Fixed
- Spreadsheet and Sound File status now shows "Local only — update GAS script" when values are saved locally but not yet configured in the GAS script, instead of "Not set"

## [v01.05w] — 2026-03-04 08:15:33 AM EST — v02.24r

### Added
- "Local Config" dashboard section showing saved Deployment ID, Spreadsheet ID, Sheet Name, and Sound File ID with status indicators
- Per-field clear buttons (×) next to every configuration input for individually removing saved values
- Collapsible bottom panel for GAS iframe with toggle tab and drag-to-resize handle

### Changed
- GAS iframe opens in a resizable bottom drawer instead of covering the entire page — dashboard stays interactive during testing

## [v01.04w] — 2026-03-04 07:50:45 AM EST — v02.23r

### Added
- "Copy Code.gs" button at step 1 — one-click copy of the full GAS source code to paste into the Apps Script editor

## [v01.03w] — 2026-03-03 10:42:39 PM EST — v02.22r

### Changed
- Copy button on the JSON manifest block for one-click clipboard copy
- GCP Console link added for users who need to set up a new project
- Detailed GITHUB_TOKEN creation walkthrough and note that the same token works across all your GAS projects

## [v01.02w] — 2026-03-03 10:27:04 PM EST — v02.21r

### Changed
- Setup instructions now appear as the main section with configuration inputs embedded inline at the relevant steps instead of a separate collapsible panel
- Section renamed from "Configuration" to "Setup & Configuration"

## [v01.01w] — 2026-03-03 10:19:44 PM EST — v02.20r

### Added
- Collapsible "GAS Setup Instructions" section — 12-step guide covering Apps Script project creation, manifest configuration, GCP linking, deployment, token setup, and optional spreadsheet integration

Developed by: ShadowAISolutions
