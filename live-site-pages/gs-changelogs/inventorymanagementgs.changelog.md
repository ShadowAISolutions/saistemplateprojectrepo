# Changelog — Inventory Management (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementgs.changelog-archive.md](inventorymanagementgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 6/50`

## [Unreleased]

## [v01.06g] — 2026-04-09 09:59:32 AM EST — v10.28r

### Fixed
- Restock operations are faster with batch cell updates
- Single data endpoint reduces server calls per poll cycle

## [v01.05g] — 2026-04-09 09:47:10 AM EST — v10.27r

### Changed
- Adding items with the same barcode now increases quantity on the existing entry instead of creating duplicates

### Added
- Change history tracking — every add, restock, and delete is logged with full details
- History data retrieval for the History tab

## [v01.04g] — 2026-04-09 09:33:59 AM EST — v10.26r

### Added
- Inventory items can now be deleted individually
- Inventory list now includes row tracking for accurate item targeting

## [v01.03g] — 2026-04-08 10:41:24 PM EST — v10.24r

### Changed
- Inventory data now saves with columns: Barcode, Item Name, Quantity, Last Updated, Last User
- Inventory list returns data matching the new column layout

## [v01.02g] — 2026-04-08 02:08:12 PM EST — v10.06r

### Added
- Spreadsheet tab and header row are now auto-created on first scan entry

### Fixed
- Header row is now properly skipped when reading inventory entries

## [v01.01g] — 2026-04-08 01:35:13 PM EST — v10.03r

### Added
- Inventory entry creation from QR code scans
- Recent inventory entries retrieval for display

Developed by: ShadowAISolutions
