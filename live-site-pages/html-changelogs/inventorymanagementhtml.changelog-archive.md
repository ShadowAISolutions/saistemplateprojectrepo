# Changelog Archive — Inventory Management

Older version sections rotated from [inventorymanagementhtml.changelog.md](inventorymanagementhtml.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

## [v01.09w] — 2026-04-09 10:27:54 PM EST — v10.62r — [e3cacef6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e3cacef6)

### Removed
- Removed the inline input fields and Add Row button from the toolbar — use the Entry button to add items

## [v01.08w] — 2026-04-09 09:10:55 PM EST — v10.61r — [32ef533a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/32ef533a)

### Changed
- Add Row and Entry buttons no longer trigger the on-screen keyboard

## [v01.07w] — 2026-04-09 09:05:22 PM EST — v10.60r — [119f32b0](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/119f32b0)

### Changed
- Tapping the quantity +/− buttons no longer opens the on-screen keyboard

## [v01.06w] — 2026-04-09 09:01:19 PM EST — v10.59r — [24ff1813](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/24ff1813)

### Fixed
- Fixed quantity adjustment buttons targeting the wrong field

## [v01.05w] — 2026-04-09 08:54:31 PM EST — v10.58r — [17a8e3a7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/17a8e3a7)

### Added
- Added quantity adjustment buttons (− and +) for quick increment/decrement when scanning existing items

## [v01.04w] — 2026-04-09 07:59:20 PM EST — v10.57r — [09e56627](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/09e56627)

### Fixed
- Fixed scan confirmation not appearing after scanning a barcode

## [v01.03w] — 2026-04-09 07:46:26 PM EST — v10.56r — [cd47e555](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cd47e555)

### Changed
- Scanning a barcode that already exists now shows current quantity and item name instead of creating a duplicate entry

## [v01.02w] — 2026-04-09 07:08:19 PM EST — v10.55r — [59e9777f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/59e9777f)

### Fixed
- HTML toggle now correctly includes all inventory interface elements

## [v01.01w] — 2026-04-09 06:46:36 PM EST — v10.53r — [ff59871e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ff59871e)

### Added
- Live data table with sortable columns and inline cell editing
- Dashboard view with inventory summary cards
- QR/barcode camera scanner for quick item entry
- Add row and manual entry buttons
- Connection status indicator with data poll countdown
- Delete row confirmation modal
- Dark theme interface

Developed by: ShadowAISolutions
