# Changelog — GAS Template Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-templatehtml.changelog-archive.md](gas-templatehtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 4/50`

## [Unreleased]

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
