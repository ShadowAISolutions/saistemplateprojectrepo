# Changelog — testauthhtml1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauthhtml1html.changelog-archive.md](testauthhtml1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 11/50`

## [Unreleased]

## [v01.11w] — 2026-04-09 03:03:37 PM EST — v10.42r

### Fixed
- Clearer messaging when QR scanning is not available on the current device

## [v01.10w] — 2026-04-09 02:55:42 PM EST — v10.41r

### Added
- QR code and barcode camera scanner at the top of the data view — scanned codes automatically add rows
- Visual feedback on scan: flash effect and haptic vibration
- Torch/flashlight toggle for low-light scanning
- Graceful fallback message for unsupported browsers

## [v01.09w] — 2026-04-09 02:19:59 PM EST — v10.39r

### Changed
- Add row bar now shows 6 input fields matching the data columns

## [v01.08w] — 2026-04-09 01:58:03 PM EST — v10.38r

### Fixed
- Data now loads immediately after signing in instead of waiting 15 seconds

## [v01.07w] — 2026-04-09 01:38:06 PM EST — v10.37r

### Added
- GAS version indicator restored — shows current backend version with auto-refresh
- GAS changelog popup restored — tap the GAS version pill to view changes

## [v01.06w] — 2026-04-09 01:29:29 PM EST — v10.36r

### Fixed
- HTML layer toggle now hides and shows the live data table and dashboard

## [v01.05w] — 2026-04-09 01:13:55 PM EST — v10.35r

### Fixed
- Data now loads from the server — live table and dashboard populate correctly

## [v01.04w] — 2026-04-09 01:09:33 PM EST — v10.34r

### Fixed
- Data now loads correctly after signing in

## [v01.03w] — 2026-04-09 01:04:10 PM EST — v10.33r

### Fixed
- Application content now appears immediately after signing in

## [v01.02w] — 2026-04-09 12:50:45 PM EST — v10.32r

### Changed
- All application content now renders directly in the page instead of in a separate frame
- Data table and dashboard views load faster with direct rendering

### Removed
- Separate application frame overlay removed — the app runs natively in the page

## [v01.01w] — 2026-04-09 11:30:10 AM EST — v10.31r

### Changed
- Updated connection to use dedicated backend service

Developed by: ShadowAISolutions
