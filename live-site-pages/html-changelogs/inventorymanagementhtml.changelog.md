# Changelog — Inventory Management

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [inventorymanagementhtml.changelog-archive.md](inventorymanagementhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 42/50`

## [Unreleased]

## [v01.66w] — 2026-05-28 01:54:36 PM EST — v11.66r

### Changed
- On desktop the scanner now scales to your browser window — the inventory table is visible right below it without having to zoom out or resize the window. On a 1280×720 desktop the scanner shrinks to roughly 230px square; on bigger monitors it caps at 260px
- Mobile layout is unchanged — the compact strip with tap-to-expand is still there on phones

## [v01.65w] — 2026-05-28 01:39:18 PM EST — v11.65r

### Added
- The scanner now picks a rear-facing camera by default on your first use, if your device has one with "Rear" in its name (for example "Surface Camera Rear"). If your device has no rear-labeled camera, the default the browser would otherwise pick is used
- The same default applies the first time you open the photo-capture overlay to attach an image to an item
- Your manual selection always wins — once you change the camera in the dropdown, that choice is remembered and the auto-default stops applying

## [v01.64w] — 2026-05-28 01:32:48 PM EST — v11.64r

### Changed
- Pick your scanner camera by name from a dropdown — replaces the cycle button. The dropdown remembers your last choice across reloads
- The same name-based camera picker now appears in the photo-capture overlay used to attach an image to an item. The two pickers remember their selections independently so scanning and photo-taking can use different cameras

## [v01.63w] — 2026-05-28 01:21:39 PM EST — v11.63r

### Added
- Camera-switch button on the scanner — when your device has more than one camera, a 📷 button appears next to the torch and stop controls. Tap it to cycle to the next camera; a small label briefly shows the camera's name so you know which one is active
- The scanner now remembers your last-selected camera across page reloads

## [v01.62w] — 2026-05-28 01:00:17 PM EST — v11.62r

### Fixed
- The scanner now starts correctly on Windows and macOS desktop browsers — the previous attempt was being silently blocked by the page's security policy before the fallback could load

## [v01.61w] — 2026-05-28 12:43:06 PM EST — v11.61r

### Changed
- The QR/barcode scanner now works in any modern browser — Chrome and Edge on Windows and macOS, Firefox, Safari, and iOS Safari are all supported (previously the page said scanning required Chrome on Android)
- On laptops and desktops without a rear camera, the scanner now uses the default webcam instead of refusing to start
- A small badge above the scanner shows whether your browser is using its built-in scanner or the fallback decoder loaded for this page

## [v01.60w] — 2026-05-04 10:40:55 AM EST — v11.60r

### Fixed
- The Update button is now visible right away when you scan an existing item — no need to change the quantity first
- The − and + buttons skip 0 when stepping across it: from +1 the next minus goes to −1, and from −1 the next plus goes to +1 (the no-change value is skipped automatically)

## [v01.59w] — 2026-04-13 11:00:42 AM EST — v11.24r

### Fixed
- Internal ID no longer appears in the barcode display when editing items without barcodes

## [v01.58w] — 2026-04-13 10:54:46 AM EST — v11.23r

### Fixed
- Editing items without barcodes now correctly shows existing data in the edit form

## [v01.57w] — 2026-04-13 10:24:47 AM EST — v11.21r

### Added
- Save/Add button in scan confirm modal hidden until user makes changes

## [v01.56w] — 2026-04-13 10:17:23 AM EST — v11.20r

### Added
- Item Name is now required — Add Row button stays disabled until Item Name is filled in
- Scan confirm modal blocks submission and highlights the field in red if Item Name is empty

## [v01.55w] — 2026-04-13 10:10:48 AM EST — v11.19r

### Fixed
- History detail rows now show all field changes from a single save on separate lines within one entry

## [v01.54w] — 2026-04-13 09:53:49 AM EST — v11.17r

### Added
- New History tab between Table and Dashboard for viewing inventory action log
- Filter bar with action type, search, date range, export, and refresh controls
- Color-coded action badges and quantity change indicators
- Expandable detail rows for edit actions showing what changed
- CSV export of filtered history data
- "Load More" pagination for browsing large history sets

## [v01.53w] — 2026-04-13 08:52:46 AM EST — v11.16r

### Fixed
- ID column no longer visible in the table
- Mobile view now correctly shows only thumbnail, item name, and quantity

## [v01.52w] — 2026-04-13 08:43:50 AM EST — v11.15r

### Added
- Items without barcodes can now be edited using the pencil button
- Each item is tracked by an internal ID — editing works reliably for all items

## [v01.51w] — 2026-04-13 08:31:55 AM EST — v11.14r

### Fixed
- Editing an existing item now shows the current low stock threshold value pre-filled in the form

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

## [v01.22w] — 2026-04-12 08:16:30 PM EST — v10.80r

### Changed
- The Quantity field in the entry form now defaults to `1` for new items (previously it was blank). For existing items it already defaulted to `1` as the delta to add — both contexts are now consistent. You can still type any value or use the − / + buttons to adjust before saving

Developed by: ShadowAISolutions
