# Changelog — Inventory Management

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementhtml.changelog-archive.md](inventorymanagementhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 8/50`

## [Unreleased]

## [v01.08w] — 2026-04-08 05:09:34 PM EST — v10.10r

### Changed
- Page title now shows "Inventory Management" in browser tabs
- You can now add the same item to inventory multiple times — each scan gives one add opportunity instead of permanently hiding the button after the first add

## [v01.07w] — 2026-04-08 02:38:26 PM EST — v10.09r

### Changed
- Data refresh indicator now shows a live connection status badge with data freshness and poll countdown

## [v01.06w] — 2026-04-08 02:33:08 PM EST — v10.08r

### Added
- Visible countdown timer showing seconds until next data refresh

## [v01.05w] — 2026-04-08 02:26:55 PM EST — v10.07r

### Added
- Inventory entries now auto-refresh every 15 seconds for live updates
- Items already in the spreadsheet automatically hide the "Add to Inventory" button

## [v01.04w] — 2026-04-08 02:08:12 PM EST — v10.06r

### Changed
- "Add to Inventory" button disappears after a scan has been successfully added
- Previously added scans no longer show the add button when revisited from history

## [v01.03w] — 2026-04-08 02:00:07 PM EST — v10.05r

### Changed
- Scanner now takes up the full screen as the main interface
- No longer requires a button tap to open — appears automatically after sign-in

### Removed
- Toggle button and close button removed — scanner is always visible when authenticated

## [v01.02w] — 2026-04-08 01:41:18 PM EST — v10.04r

### Fixed
- QR scanner panel now correctly hides when using the HTML layer toggle
- Camera automatically stops when the scanner is hidden

## [v01.01w] — 2026-04-08 01:35:13 PM EST — v10.03r

### Added
- QR code and barcode scanner with camera support
- Scan results displayed with type classification and format detection
- One-tap "Add to Inventory" button to save scans to spreadsheet
- Scan history showing last 10 scans
- Recent inventory entries table with refresh capability
- Image upload scanning for QR codes from gallery
- Flashlight toggle for scanning in low light

Developed by: ShadowAISolutions
