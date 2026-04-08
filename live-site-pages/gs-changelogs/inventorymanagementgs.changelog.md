# Changelog — Inventory Management (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementgs.changelog-archive.md](inventorymanagementgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 13/50`

## [v01.13g] — 2026-04-07 09:22:12 PM EST — v09.84r

### Fixed
- Admin controls and scan history now visible below the camera area

## [v01.12g] — 2026-04-07 08:29:42 PM EST — v09.81r

### Fixed
- Scan history rows now have visible side margins on mobile

## [v01.11g] — 2026-04-07 08:25:37 PM EST — v09.80r

### Added
- Delete confirmation dialog before removing a scan entry

### Changed
- Scan entries have proper side margins on mobile screens

## [v01.10g] — 2026-04-07 08:14:16 PM EST — v09.79r

### Changed
- Scan history position adjusted for the smaller camera area

## [v01.09g] — 2026-04-07 08:08:27 PM EST — v09.78r

### Added
- Delete button on each scan entry to remove it from the spreadsheet

## [v01.08g] — 2026-04-07 07:45:47 PM EST — v09.76r

### Added
- Visible countdown showing time until next data refresh
- Optimistic scan entries that appear instantly while saving

## [v01.07g] — 2026-04-07 07:37:51 PM EST — v09.75r

### Fixed
- Scan history now appears below the camera area instead of behind it

## [v01.06g] — 2026-04-07 07:21:09 PM EST — v09.74r

### Added
- Scan history visible below the camera — shows saved scans with live updates every 10 seconds

## [v01.05g] — 2026-04-07 06:34:20 PM EST — v09.71r

### Changed
- Scanner result display moved to embedding page — GAS iframe now handles auth and admin only

## [v01.04g] — 2026-04-07 05:58:59 PM EST — v09.69r

### Added
- Scan result display panel showing last scanned barcode and scan history
- Server-side barcode scan processing endpoint for future inventory operations

### Changed
- Moved camera scanner to embedding page — scan results now arrive via secure postMessage bridge

## [v01.03g] — 2026-04-07 05:24:49 PM EST — v09.68r

### Added
- Built-in QR code and barcode scanner with camera support
- Image upload scanning from gallery
- Flashlight toggle for low-light scanning
- Scan history with up to 10 recent scans
- Auto-detection of scan type (URL, email, phone, WiFi, product code)

## [v01.02g] — 2026-04-07 05:02:49 PM EST — v09.67r

### Changed
- Minor internal improvements

## [v01.01g] — 2026-04-07 03:07:14 PM EST — v09.65r

### Fixed
- Sign-in now works on first deployment — setup properties auto-generate on first visit

Developed by: ShadowAISolutions
