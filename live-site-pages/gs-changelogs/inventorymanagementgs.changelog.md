# Changelog — Inventory Management (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementgs.changelog-archive.md](inventorymanagementgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 4/50`

## [Unreleased]

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
