# Changelog — GAS Template (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-templategs.changelog-archive.md](gas-templategs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 3/50`

## [Unreleased]

## [01.03g] — 2026-03-04 10:34:53 AM EST — v02.37r

### Changed
- Spreadsheet section now shows a live, editable Google Sheets embed instead of read-only cell values
- Added "Open in Google Sheets" link for quick full-screen access

## [01.02g] — 2026-03-04 10:20:48 AM EST — v02.34r

### Added
- Spreadsheet Data section now visible when opening the web app directly — shows sheet name, current version (A1), live value (B1), and pushed version (C1)
- Live B1 value updates in the standalone web app display every 15 seconds

## [01.01g] — 2026-03-04 08:52:09 AM EST — v02.28r

### Added
- Connected spreadsheet data now visible from the dashboard — shows version tracking cells and live B1 value
- Live B1 cell polling every 15 seconds with cache-backed reads for minimal quota usage
- Installable trigger support for real-time B1 cache updates on spreadsheet edits

Developed by: ShadowAISolutions
