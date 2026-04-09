# Changelog — Inventory Management

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementhtml.changelog-archive.md](inventorymanagementhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 22/50`

## [Unreleased]

## [v01.22w] — 2026-04-09 08:20:11 AM EST — v10.25r

### Added
- New "Add Item Manually" option to enter inventory items without scanning — fill in barcode/ID, item name, and quantity directly

## [v01.21w] — 2026-04-08 10:41:24 PM EST — v10.24r

### Changed
- "Add to Inventory" now saves barcode and quantity to the inventory spreadsheet with the new column layout

## [v01.20w] — 2026-04-08 10:02:33 PM EST — v10.23r

### Fixed
- Inventory tab now shows the correct columns: Barcode, Item Name, Quantity, Last Updated, Last User

## [v01.19w] — 2026-04-08 09:56:50 PM EST — v10.22r

### Changed
- Activity tab now shows your scan history (previously shown as a separate section above)
- Inventory tab now shows the live data from your spreadsheet
- Scan history is local to your session and does not save to the spreadsheet

## [v01.18w] — 2026-04-08 09:46:02 PM EST — v10.21r

### Changed
- Column headers are now always visible in all tabs even when no data is loaded

## [v01.17w] — 2026-04-08 09:41:36 PM EST — v10.20r

### Changed
- Inventory tab is now the default view when opening the page
- Inventory tab shows columns: Barcode, Item Name, Quantity, Last Updated, Last User
- History tab shows columns: Timestamp, User, Action, Barcode, Item Name, Quantity Change, New Quantity

## [v01.16w] — 2026-04-08 09:35:30 PM EST — v10.19r

### Changed
- Tab order changed to Inventory, History, Activity

## [v01.15w] — 2026-04-08 09:27:26 PM EST — v10.18r

### Added
- Three tabs in the live data section: Activity, Inventory, and History — easily switch between views
- Inventory and History tabs are placeholders for upcoming features

## [v01.14w] — 2026-04-08 05:54:04 PM EST — v10.16r

### Added
- Camera toggle button next to the flashlight — tap to turn camera off (turns red), tap again to restart

## [v01.13w] — 2026-04-08 05:48:21 PM EST — v10.15r

### Added
- Camera now starts automatically when you open the scanner if you've already granted camera permission — no need to tap START CAMERA each time

## [v01.12w] — 2026-04-08 05:42:46 PM EST — v10.14r

### Added
- Camera now automatically resumes when you switch back to the scanner from another tab or app — no more frozen frames or page refreshes needed

## [v01.11w] — 2026-04-08 05:32:36 PM EST — v10.13r

### Fixed
- Data table no longer gets cut off on smaller screens — you can now swipe to see all columns

## [v01.10w] — 2026-04-08 05:26:14 PM EST — v10.12r

### Changed
- Scanner camera preview is now more compact on mobile, showing more of the page below it
- Scanner header is no longer hidden behind the sign-out bar
- Improved spacing and layout for both mobile and desktop screens

## [v01.09w] — 2026-04-08 05:16:10 PM EST — v10.11r

### Fixed
- "Add to Inventory" button no longer appears stuck in "adding..." state after scanning a new item

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
