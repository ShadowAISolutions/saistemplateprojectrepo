# Changelog — Inventory Management

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementhtml.changelog-archive.md](inventorymanagementhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 11/50`

## [Unreleased]

## [v01.11w] — 2026-04-10 12:08:01 PM EST — v10.65r

### Changed
- Inventory table now shows 5 columns in this order: Item Name, Quantity, Barcode, Last User, Last Updated
- Removed the Timestamp column from the inventory table and the scan entry form

## [v01.10w] — 2026-04-10 11:28:11 AM EST — v10.63r

### Changed
- Redesigned the scanner for phone screens — the camera now shows as a compact strip at the top, leaving room for the inventory list below
- Tap the scanner strip to expand it to fullscreen for tougher scans; tap the × button to collapse it back
- When a scan is detected, the scanner automatically collapses so the inventory list is visible behind the confirmation dialog
- Desktop view is unchanged

## [v01.09w] — 2026-04-09 10:27:54 PM EST — v10.62r

### Removed
- Removed the inline input fields and Add Row button from the toolbar — use the Entry button to add items

## [v01.08w] — 2026-04-09 09:10:55 PM EST — v10.61r

### Changed
- Add Row and Entry buttons no longer trigger the on-screen keyboard

## [v01.07w] — 2026-04-09 09:05:22 PM EST — v10.60r

### Changed
- Tapping the quantity +/− buttons no longer opens the on-screen keyboard

## [v01.06w] — 2026-04-09 09:01:19 PM EST — v10.59r

### Fixed
- Fixed quantity adjustment buttons targeting the wrong field

## [v01.05w] — 2026-04-09 08:54:31 PM EST — v10.58r

### Added
- Added quantity adjustment buttons (− and +) for quick increment/decrement when scanning existing items

## [v01.04w] — 2026-04-09 07:59:20 PM EST — v10.57r

### Fixed
- Fixed scan confirmation not appearing after scanning a barcode

## [v01.03w] — 2026-04-09 07:46:26 PM EST — v10.56r

### Changed
- Scanning a barcode that already exists now shows current quantity and item name instead of creating a duplicate entry

## [v01.02w] — 2026-04-09 07:08:19 PM EST — v10.55r

### Fixed
- HTML toggle now correctly includes all inventory interface elements

## [v01.01w] — 2026-04-09 06:46:36 PM EST — v10.53r

### Added
- Live data table with sortable columns and inline cell editing
- Dashboard view with inventory summary cards
- QR/barcode camera scanner for quick item entry
- Add row and manual entry buttons
- Connection status indicator with data poll countdown
- Delete row confirmation modal
- Dark theme interface

Developed by: ShadowAISolutions
