# Changelog — GAS Project Creator (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-project-creatorgs.changelog-archive.md](gas-project-creatorgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 8/50`

## [Unreleased]

## [01.08g] — 2026-03-04 06:19:05 PM EST — v02.67r

### Changed
- Script renamed from gas-template to gas-project-creator

## [01.07g] — 2026-03-04 05:47:54 PM EST — v02.66r

### Added
- Dashboard now shows live GAS connection status, version, GitHub configuration, spreadsheet connection, and sound configuration

## [01.06g] — 2026-03-04 11:28:22 AM EST — v02.41r

### Fixed
- Spreadsheet now opens reliably in a new tab instead of showing a blank embedded outline

## [01.05g] — 2026-03-04 11:04:37 AM EST — v02.39r

### Added
- Test Sound, Test Beep, and Test Vibrate buttons for audio and haptic feedback testing
- "Did it redirect?" and "Is this awesome?" interactive radio button groups
- Decorative SVG tree graphic
- Sound playback with detailed error feedback (loading, server error, play rejected, audio error)
- Vibration test with browser support detection

### Changed
- Sound preload now shows server errors instead of failing silently

## [01.04g] — 2026-03-04 10:48:27 AM EST — v02.38r

### Added
- Live quotas sidebar showing GitHub rate limit, email quota, and service estimates
- Live B1 cell value display above the spreadsheet embed, updating every 15 seconds

### Changed
- Spreadsheet section now shows sheet name dynamically and includes live B1 value alongside the embed

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
