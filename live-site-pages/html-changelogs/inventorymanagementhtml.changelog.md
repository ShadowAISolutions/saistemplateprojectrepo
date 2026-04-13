# Changelog — Inventory Management

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementhtml.changelog-archive.md](inventorymanagementhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 50/50`

## [Unreleased]

## [v01.50w] — 2026-04-13 08:15:01 AM EST — v11.13r

### Added
- "Clear All" button to reset search text, location filter, category filter, and column sorting at once
- Colored stock health indicator next to each item's quantity — green (healthy), yellow (low stock), red (out of stock), grey (no threshold set)

## [v01.49w] — 2026-04-13 08:00:01 AM EST — v11.12r

### Fixed
- Category filter now correctly shows "All Categories"
- Mobile view only shows thumbnail, item name, and quantity — no extra columns peeking through

## [v01.48w] — 2026-04-13 07:53:31 AM EST — v11.11r

### Added
- Filter by Location and Category using dropdown menus next to the search bar
- Filters stack with text search — combine all three to narrow results quickly

## [v01.47w] — 2026-04-13 07:35:37 AM EST — v11.09r

### Added
- Location and Category columns with dropdown selection — choose from predefined options when adding or editing items
- Dropdown options are managed in a separate spreadsheet tab and can be customized by the admin

## [v01.46w] — 2026-04-13 07:14:34 AM EST — v11.08r

### Added
- Search bar to filter inventory items by name — type to instantly filter the table
- Result count showing how many items match your search
- Clear button and Escape key to reset search
- Search works alongside column sorting and auto-refreshing data

## [v01.45w] — 2026-04-12 09:43:43 PM EST — v11.07r

### Changed
- Minor internal improvements

## [v01.44w] — 2026-04-12 09:33:23 PM EST — v11.06r

### Changed
- Image removal now uses a single server call instead of three separate calls

## [v01.43w] — 2026-04-12 09:22:44 PM EST — v11.05r

### Changed
- Image upload during scan-to-add is now handled in a single server call instead of two separate calls

## [v01.42w] — 2026-04-12 08:34:51 PM EST — v11.04r

### Changed
- Image upload and row assignment now happen in a single server call instead of two separate calls

## [v01.41w] — 2026-04-12 08:19:09 PM EST — v11.02r

### Fixed
- Fixed photos not uploading when adding items

## [v01.40w] — 2026-04-12 08:10:29 PM EST — v11.01r

### Fixed
- Fixed items not appearing when adding with a photo

## [v01.39w] — 2026-04-12 08:04:20 PM EST — v11.00r

### Fixed
- Fixed items not appearing in the list when adding with a photo attached
- Photos now upload reliably after the item is saved

## [v01.38w] — 2026-04-12 07:50:42 PM EST — v10.99r

### Changed
- Image upload and item save now happen in a single server call instead of three separate calls
- More reliable image handling when adding items with photos

## [v01.37w] — 2026-04-12 06:06:52 PM EST — v10.96r

### Changed
- Minor internal improvements

## [v01.36w] — 2026-04-12 06:01:51 PM EST — v10.95r

### Fixed
- Items now save immediately when clicking Save or Add Row, even with an image attached
- Image uploads happen in the background and are linked to the item automatically

## [v01.35w] — 2026-04-12 05:54:02 PM EST — v10.94r

### Fixed
- Image preview now appears after selecting a photo for upload
- Item thumbnails now load correctly in the inventory table

## [v01.34w] — 2026-04-12 05:25:45 PM EST — v10.92r

### Added
- Item images — upload a photo or take a picture when adding or editing inventory items
- Image thumbnails now appear in the table for quick visual identification
- Tap a thumbnail to view the full-size image in an overlay
- Image preview shown when deleting an item so you can confirm the right item
- Camera capture button for taking photos directly from your device

## [v01.33w] — 2026-04-12 04:45:19 PM EST — v10.91r

### Changed
- Scanner area centered horizontally on desktop

## [v01.32w] — 2026-04-12 04:39:49 PM EST — v10.90r

### Fixed
- Scanner controls area no longer stretches across the full screen on desktop — contained to a reasonable width

## [v01.31w] — 2026-04-12 04:19:15 PM EST — v10.89r

### Changed
- Scanner controls now appear to the right of the camera on desktop, matching the mobile layout

## [v01.30w] — 2026-04-12 03:58:45 PM EST — v10.88r

### Changed
- The confirm button now says "Update" when adjusting an existing item, and "Add Row" only when adding a new item

## [v01.29w] — 2026-04-12 03:51:02 PM EST — v10.87r

### Added
- "New Total" preview below the quantity adjuster shows the projected total in real time when editing an existing item

## [v01.28w] — 2026-04-12 03:07:57 PM EST — v10.86r

### Changed
- Adjust Quantity now defaults to 0 when editing an existing item via the pencil button

## [v01.27w] — 2026-04-12 02:55:11 PM EST — v10.85r

### Changed
- Current quantity now appears as a styled info box above the form fields instead of small text below the adjuster
- The quantity field is labeled "Adjust Quantity" when modifying an existing item

## [v01.26w] — 2026-04-12 12:56:32 PM EST — v10.84r

### Changed
- Barcode now appears as non-editable text under the modal title instead of as an editable field
- When adding a new item, quantity can be set to 0 but not below zero
- When editing an existing item, the minus button and typed values stop when the total quantity would go below 0

## [v01.25w] — 2026-04-11 11:43:01 PM EST — v10.83r

### Fixed
- Tapping the camera to expand it to full screen now works correctly — previously the camera stayed small when tapped

## [v01.24w] — 2026-04-11 11:32:19 PM EST — v10.82r

### Changed
- The flashlight, stop camera, and manual entry buttons now appear next to the camera instead of overlaying it — easier to reach and always visible

## [v01.23w] — 2026-04-11 11:11:17 PM EST — v10.81r

### Added
- You can now scan items rapidly without waiting for each save to complete — scanned items are queued and saved in the background one at a time
- A blue "queued" badge appears showing how many items are waiting to be saved
- Each queued item appears in the table immediately with a "Queued" or "Sending" indicator
- If a save fails, a red notification appears with the item details — remaining items continue saving

### Changed
- Auto-scan mode now queues items instantly instead of waiting for the previous save to finish

## [v01.22w] — 2026-04-12 08:16:30 PM EST — v10.80r

### Changed
- The Quantity field in the entry form now defaults to `1` for new items (previously it was blank). For existing items it already defaulted to `1` as the delta to add — both contexts are now consistent. You can still type any value or use the − / + buttons to adjust before saving

## [v01.21w] — 2026-04-11 07:49:46 PM EST — v10.77r

### Changed
- 0 is no longer an option in any of the quantity steppers (the new "Auto add" increment input next to the camera, and the existing − / + buttons in the scan/manual entry form). Pressing − when the value is 1 now jumps straight to -1 (skipping 0), and pressing + when the value is -1 now jumps straight to 1. Typing 0 directly into the field and tabbing away snaps the value back to 1. The previous Auto add behavior where setting 0 silently incremented by 1 is fixed — if the value is somehow 0 when a scan fires, the entry form now opens instead so you can see what's happening

## [v01.20w] — 2026-04-11 07:40:08 PM EST — v10.76r

### Fixed
- Fixed the new "Auto add" toggle: turning it on now actually bypasses the entry form and immediately adds the configured amount when you scan a known item. The previous version had the toggle and increment input visible but the auto-add path wasn't being reached on real scans, so the entry form kept opening regardless of the toggle state

## [v01.19w] — 2026-04-11 06:53:17 PM EST — v10.75r

### Added
- New "Auto add" toggle next to the camera scanner on phones (and below the camera on desktop). When the toggle is off, scanning a barcode opens the entry form as before so you can review and confirm the quantity. When the toggle is on, scanning a known item silently adds the configured amount to that item's quantity without opening the form — useful for fast bulk-counting
- New increment input next to the Auto add toggle, with − and + buttons. Set the increment to any positive or negative number (e.g. +1, +2, -1, -2) to control how much each scan adds or subtracts. The value persists across page reloads
- Scanning an unknown barcode (one not yet in the inventory) while Auto add is on will still open the entry form, so you can name the new item before saving it

## [v01.18w] — 2026-04-11 06:04:15 PM EST — v10.73r

### Changed
- On phones, the camera scanner is now a square preview with the status display sitting beside it instead of stacked underneath, making the layout more compact and leaving room next to the camera for additional controls

## [v01.17w] — 2026-04-11 05:44:20 PM EST — v10.72r

### Fixed
- Fixed the pencil edit button so it now works the same way as scanning an existing item to change the quantity. Tap the pencil on any row, enter the amount to add or subtract (or use − / +), click Save, and the row's quantity updates correctly

## [v01.16w] — 2026-04-11 05:31:18 PM EST — v10.71r

### Fixed
- Fixed an issue where editing a row via the pencil button and clicking Save did not update the values in the table. Changes now reflect immediately in the table after clicking Save, and the sheet gets updated in the background

## [v01.15w] — 2026-04-11 05:19:50 PM EST — v10.70r

### Added
- Each row in the inventory table now has an edit button (✏️) next to the delete button. Tapping it opens the same entry form used for scanning/manual entry, pre-filled with that row's current values. The + / − buttons let you adjust the quantity directly, and Save writes the changes back to the sheet. Last User and Last Updated are refreshed automatically when you save

## [v01.14w] — 2026-04-11 05:03:25 PM EST — v10.69r

### Changed
- Entry form (both manual and scan) no longer shows the Last User and Last Updated fields — these are always filled in automatically, so hiding them removes noise and makes the form quicker to scan. The table still displays both columns as before

## [v01.13w] — 2026-04-11 04:40:42 PM EST — v10.68r

### Changed
- Manual entry form now has the same − / + quantity adjustment buttons as the scan entry form — both entry screens now look identical, with the only difference being whether the barcode is filled in automatically (scan) or typed in manually

## [v01.12w] — 2026-04-10 01:06:37 PM EST — v10.67r

### Changed
- Mobile view now shows only Item Name and Quantity columns — Barcode, Last User, and Last Updated are hidden below 600px screen width for easier scanning on phones

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
