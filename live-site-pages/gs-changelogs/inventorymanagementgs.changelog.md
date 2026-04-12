# Changelog — Inventory Management (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementgs.changelog-archive.md](inventorymanagementgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 6/50`

## [Unreleased]

## [v01.06g] — 2026-04-12 08:10:10 PM EST — v10.79r

### Fixed
- Fixed leading zeros in barcodes still being stripped after the v01.05g attempt — that fix set the column format to text but Sheets' value parser was still coercing digit strings to numbers before the format was checked. The new approach writes new rows with the barcode cell empty first, then re-writes just the barcode cell with an explicit text-format-then-value sequence so leading zeros are reliably preserved. Per-row edits via the pencil button get the same treatment when targeting the barcode column

## [v01.05g] — 2026-04-11 07:57:33 PM EST — v10.78r

### Fixed
- Barcodes that start with a 0 (like `0123456`) are now stored in the spreadsheet exactly as scanned, instead of having the leading zero stripped. Previously, scanning a leading-zero barcode would write it to the sheet as a number (so `0123456` became `123456`), and re-scanning the same item later would fail to match the existing row and treat it as a new item. The Barcode column is now formatted as text on every write, preserving leading zeros forever
- **Existing rows with already-stripped barcodes are NOT auto-fixed** — the original leading zeros can't be recovered from a value that's already been converted to a number. To fix existing items: either re-enter them with the correct barcode (delete the bad row first, or edit the cell directly in the spreadsheet) or manually retype the barcode in the Barcode column with a leading apostrophe (e.g. `'0123456`) which forces it to be treated as text

## [v01.04g] — 2026-04-10 12:08:01 PM EST — v10.65r

### Changed
- Default sheet layout now uses 5 columns (Item Name, Quantity, Barcode, Last User, Last Updated) — Timestamp column removed

## [v01.03g] — 2026-04-09 07:46:26 PM EST — v10.56r

### Changed
- Scanning a barcode that already exists now updates the quantity instead of creating a duplicate row

## [v01.02g] — 2026-04-09 07:00:50 PM EST — v10.54r

### Fixed
- Fixed data loading — app now connects to the spreadsheet correctly

## [v01.01g] — 2026-04-09 06:46:36 PM EST — v10.53r

### Added
- Live inventory data with automatic refresh
- Add, edit, and delete inventory items
- Data caching for faster page loads

Developed by: ShadowAISolutions
