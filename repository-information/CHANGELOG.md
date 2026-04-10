# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 67/100`

## [Unreleased]

## [v10.57r] — 2026-04-09 07:59:20 PM EST

> **Prompt:** "after the last change, scanning is not showing the gui to add entries"

### Fixed
- Fixed scan confirmation modal not appearing — `_ldRows` was referenced directly from the QR scanner scope but is a local variable inside the Live Data App IIFE. Added `window._ldGetRows` accessor (matching existing `_ldGetHeaders` pattern) and updated the barcode lookup to use it

#### `inventorymanagement.html` — v01.04w
##### Fixed
- Fixed scan confirmation modal crash caused by cross-scope variable access

## [v10.56r] — 2026-04-09 07:46:26 PM EST

> **Prompt:** "in the inventorymanagement, when making a new entry when scanning, have it check to see if the barcode being scanned is already in our data. if so, then the quantity should increase/decrease the quantity of the row, instead of making new row. if the barcode is new, then it can be a new row"

### Changed
- Inventory management barcode scanning now checks for existing barcodes before creating new rows — duplicate barcodes update the existing row's quantity instead of appending a new row
- Scan confirmation modal shows "Existing Item" title with current quantity info when a duplicate barcode is detected, pre-fills Item Name and Timestamp from existing row, and defaults quantity to 1 for quick increment
- GAS backend `addRow()` performs authoritative duplicate barcode check against the spreadsheet to handle concurrent users correctly

#### `inventorymanagement.html` — v01.03w
##### Changed
- Scan modal now detects existing barcodes and shows current quantity with item name pre-filled

#### `inventorymanagement.gs` — v01.03g
##### Changed
- Add row now checks for duplicate barcodes and updates existing row quantity instead of creating duplicates

## [v10.55r] — 2026-04-09 07:08:19 PM EST

> **Prompt:** "update the html toggle for all the updated html UI"

### Fixed
- Added inventory UI elements (`live-data-app`, `admin-badge`, `admin-dropdown-gas`, `admin-panel-overlay`, `gas-version-display`, `gas-user-email`) to the HTML layer toggle list so they correctly hide/show with the HTML toggle button

#### `inventorymanagement.html` — v01.02w
##### Fixed
- HTML toggle now correctly includes all inventory interface elements

## [v10.54r] — 2026-04-09 07:00:50 PM EST

> **Prompt:** "verify that you properly copied everything, it says waiting for data and stuck on updating"

### Fixed
- Fixed inventory management data polling stuck on "Updating..." by replacing the standard GAS session page with the worker RPC bridge (PROJECT OVERRIDE in doGet's session route). Without this, the nonce-based iframe load returned the old GAS UI template instead of the RPC bridge, so `gasCall()` postMessages never reached `google.script.run` and data polling never got responses

#### `inventorymanagement.gs` — v01.02g
##### Fixed
- Fixed data loading — app now connects to the spreadsheet correctly

## [v10.53r] — 2026-04-09 06:46:36 PM EST

> **Prompt:** "the inventorymanagement, setup the user interface and the way it interacts with the spreadsheet like the testauthhtml1 . ask clarifying questions as needed"

### Added
- Full inventory management UI with live data table (sortable columns, inline cell editing, add/delete rows, 15s data polling, connection status indicator)
- Dashboard view with summary stat cards
- QR/barcode camera scanner (native BarcodeDetector API) with scan confirmation modal and manual entry button
- GAS backend CRUD functions (getAuthenticatedData, writeCell, addRow, deleteRow) with CacheService data caching, RBAC permission checks, and audit logging
- Worker RPC bridge (postMessage-based google.script.run proxy for HTML-layer UI calls)
- Data poll action handler (lightweight session validation + cached data return)
- Admin badge and panel for admin-role users

#### `inventorymanagement.html` — v01.01w
##### Added
- Live data table with inline editing and barcode scanner
- Dashboard view with inventory summary cards
- Dark theme UI matching the testauthhtml1 design

#### `inventorymanagement.gs` — v01.01g
##### Added
- Spreadsheet CRUD operations with session validation and audit logging
- CacheService-based data caching with installable edit trigger
- Worker RPC bridge for HTML-layer communication

## [v10.52r] — 2026-04-09 06:13:37 PM EST

> **Prompt:** "reset the inventorymanagement environment to how it was when it was first created, keeping the ID's instead of the placeholders"

### Changed
- Reset inventorymanagement environment to initial template state — HTML page (v01.25w → v01.00w), GAS script (v01.06g → v01.00g), version files, and changelogs all restored to clean "just created" state from auth templates while preserving real deployment IDs, spreadsheet IDs, and CLIENT_ID

#### `inventorymanagement.html` — v01.00w

##### Changed
- Page reset to initial template state

#### `inventorymanagement.gs` — v01.00g

##### Changed
- Script reset to initial template state

## [v10.51r] — 2026-04-09 05:49:13 PM EST

> **Prompt:** "if the camera already has user permission, then have it auto turn on instead of requiring press start camera, but also add a button next to the flashlight toggle to turn off the camera"

### Added
- Camera auto-start: if camera permission is already granted, the QR scanner starts automatically without requiring the user to tap "START CAMERA"
- Stop camera button (✖) positioned bottom-left of the viewport — stops the camera stream and returns to the start screen

#### `testauthhtml1.html` — v01.18w

##### Added
- Camera auto-starts when permission is already granted — no need to tap "START CAMERA"
- Stop camera button (✖) next to the flashlight toggle to turn off the camera

## [v10.50r] — 2026-04-09 05:41:32 PM EST

> **Prompt:** "add a button that opens up the same UI for entering data when we scan something, so that we can use it without requiring scanning something."

### Added
- "➕ Entry" manual entry button in the add-row bar that opens the scan confirmation modal without requiring a barcode scan — all fields are available for manual input with Last Updated and Last User auto-filled
- Modal title dynamically switches between "Scanned Item" (scan flow) and "New Entry" (manual flow) based on how it was opened
- Exposed `_showScanConfirmModal` on `window` for cross-IIFE access from the manual entry button

#### `testauthhtml1.html` — v01.17w

##### Added
- Manual entry button for adding rows without scanning a barcode — opens the same confirmation dialog with all fields editable

## [v10.49r] — 2026-04-09 05:24:29 PM EST

> **Prompt:** "for the testauthhtml1 , make the scanned item (QR code) UI where we add the information and then add row include the last updated time and the last user"

### Changed
- Scan confirmation modal now auto-fills "Last Updated" with the current timestamp and "Last User" with the signed-in user's email when a barcode is scanned
- Add-row bar auto-fills "Last Updated" and "Last User" fields when activated, when headers arrive from GAS data, and after each successful row addition

#### `testauthhtml1.html` — v01.16w

##### Changed
- Scan confirmation dialog and add-row bar now auto-populate "Last Updated" (current time) and "Last User" (signed-in email)

## [v10.48r] — 2026-04-09 05:08:09 PM EST

> **Prompt:** "it should also apply to gas files also because we are mainly writing our html inside of the gas files"

### Changed
- Visual verification rule now covers GAS scripts (`.gs` files) — `doGet()` serves HTML and most user-facing UI is written inside `.gs` files, so they are a primary trigger for visual testing
- Added "Visual Verification After GAS UI Changes" section to `.claude/rules/gas-scripts.md` with cross-reference to the full rule in `html-pages.md`
- Updated Visual Test Command in CLAUDE.md to mention GAS files as primary targets
- Updated trigger list in `html-pages.md` to include `.gs` file scenarios (doGet HTML output, getAppData UI content, admin panels, data tables)

## [v10.47r] — 2026-04-09 05:04:47 PM EST

> **Prompt:** "make it into a Repo Workflow Command , and also add it to the claude.md or whichever .md file you deem ideal for this as a rule, i.e. "From now on, after making any visual/UI change to an HTML page, use Playwright to take a screenshot and verify it looks correct before committing.""

### Added
- Visual Test Command in CLAUDE.md — on-demand Playwright-based visual verification of HTML pages (`visual test`, `screenshot it`, `test it`)
- Automatic visual verification rule in `.claude/rules/html-pages.md` — Playwright screenshot and visual inspection runs automatically after UI changes before committing
- Reference Files entry for the new visual verification rule

## [v10.46r] — 2026-04-09 04:54:57 PM EST

> **Prompt:** "i dont see any popup/UI/GUI/window when scanning"

### Fixed
- Scan confirmation modal was not appearing because `_ldHeaders` was scoped to the Live Data App IIFE and inaccessible from the QR Scanner IIFE — exposed via `window._ldGetHeaders()` cross-IIFE accessor

#### `testauthhtml1.html` — v01.15w

##### Fixed
- Scan confirmation dialog now appears correctly after scanning a barcode

## [v10.45r] — 2026-04-09 04:44:43 PM EST

> **Prompt:** "in the testauthhtml1, after an item is scanned, instead of immediately adding it to the table, show a gui to show the data that is going to be entered, and let the user confirm or cancel the entry"

### Changed
- QR scanner now shows a confirmation modal after scanning instead of immediately adding to the table — user can review/edit all fields and confirm or cancel

#### `testauthhtml1.html` — v01.14w

##### Changed
- Scan confirmation dialog with editable fields shown after each scan

## [v10.44r] — 2026-04-09 04:34:01 PM EST

> **Prompt:** "undo the last change you made"

### Removed
- Reverted smart scan dialog (v10.43r) — removed barcode lookup, new-item dialog, quantity-update dialog from QR scanner; restored simple scan-to-add-row behavior

#### `testauthhtml1.html` — v01.13w

##### Removed
- Reverted scan dialog — scanning directly adds to the barcode input and clicks Add Row

## [v10.43r] — 2026-04-09 04:26:39 PM EST

> **Prompt:** "make it so that when the user scans an item it first checks to see if the barcode is already on the table. if it is not, then it asks the user what the item name is and the quantity; the timestamp, last updated, and last user should automatically be added to the table. if it is already in the table, then it asks how many to add or remove from that entry in the table."

### Changed
- QR scanner now checks if scanned barcode already exists in the table before adding
- New items: prompts for Item Name and Quantity via custom dialog, auto-fills Timestamp, Last Updated, and Last User
- Existing items: prompts how many to add or remove from current quantity, updates the row via `writeCell` RPC
- Also auto-updates Last Updated and Last User columns when adjusting quantity on existing items

#### `testauthhtml1.html` — v01.12w

##### Changed
- Scanning a new barcode now prompts for item name and quantity before adding
- Scanning an existing barcode shows current quantity and lets you add or remove stock
- Timestamp, last updated, and last user are auto-filled on all scan actions

## [v10.42r] — 2026-04-09 03:03:37 PM EST

> **Prompt:** "its not letting me click on the button, im using chrome"

### Fixed
- Improved QR camera scanner unsupported-browser messaging — now clearly states "QR scanning requires Chrome on Android" instead of misleading "Use Chrome/Edge" button, and shows "Open this page on your phone to scan" in status bar

#### `testauthhtml1.html` — v01.11w

##### Fixed
- Clearer messaging when QR scanning is not available on the current device

## [v10.41r] — 2026-04-09 02:55:42 PM EST

> **Prompt:** "to the top portion of the testauthhtml1 , add ONLY the camera portion of the qr-scanner6.html , so that when the user scans something, it functions the same as if the user had used the add row button."

### Added
- QR/barcode camera scanner to the top of testauthhtml1 Live Data app — uses native BarcodeDetector API only (no external dependencies), scans populate the Barcode input and auto-trigger Add Row
- Camera includes viewport with corner decorations, scan line animation, flash effect, torch/flashlight toggle, engine badge, start screen overlay, and status bar
- Permission gating — camera section only visible when user has write permissions

#### `testauthhtml1.html` — v01.10w

##### Added
- QR/barcode camera scanner at the top of the data view — scanned codes auto-add rows
- Visual feedback on scan: flash effect, haptic vibration, animated scan line
- Torch/flashlight toggle for low-light scanning
- Graceful degradation for browsers without native BarcodeDetector

## [v10.40r] — 2026-04-09 02:25:59 PM EST

> **Prompt:** "i deleted the Live_Sheet tab but its not automatically creating it, its still showing the old data for some reason with the old columns"

### Fixed
- `refreshDataCache()` silently returned when `Live_Sheet` tab was missing (`if (!sheet) return`) without clearing the stale 6-hour CacheService entry — old data persisted indefinitely after the sheet was deleted
- Added auto-creation: when the sheet tab doesn't exist, `refreshDataCache()` now creates it with the correct 6-column headers (Timestamp, Barcode, Item Name, Quantity, Last Updated, Last User) and clears the stale cache before proceeding to re-read

#### `testauthhtml1.gs` — v01.03g
##### Fixed
- Data sheet now auto-creates with correct headers if deleted, and stale cached data is cleared

## [v10.39r] — 2026-04-09 02:19:59 PM EST

> **Prompt:** "change the columns to be Timestamp, Barcode, Item Name, Quantity, Last Updated, Last User"

### Changed
- Updated add-row input bar from 4 generic column inputs to 6 inputs with placeholders matching the spreadsheet columns: Timestamp, Barcode, Item Name, Quantity, Last Updated, Last User
- Updated JS `inputs` array to reference all 6 input elements

#### `testauthhtml1.html` — v01.09w
##### Changed
- Add row bar now shows 6 input fields matching the data columns

## [v10.38r] — 2026-04-09 01:58:03 PM EST

> **Prompt:** "make the data come up on startup because i only see the data after the first 15 second poll"

### Fixed
- Live Data App data poll delay — `_startGasDataPoll()` scheduled the first `_doDataPoll()` call after a 15-second `setTimeout` instead of calling it immediately, causing the "Waiting for data..." state to persist until the first poll fired

#### `testauthhtml1.html` — v01.08w
##### Fixed
- Data now loads immediately after signing in instead of waiting 15 seconds

## [v10.37r] — 2026-04-09 01:38:06 PM EST

> **Prompt:** "since we still need the gas layer, the gas version pill should be re-added"

### Added
- Re-added GAS version pill (`#gas-pill`) with countdown dot, version polling via `gs.version.txt`, and "Code Ready" splash on GAS update
- Re-added GAS changelog popup (`#gcl-overlay`) with click-to-view on the GAS pill
- Re-added all associated CSS for `#gas-pill`, `#gcl-overlay`, `#gcl-popup`, `#gcl-header`, `#gcl-body`

#### `testauthhtml1.html` — v01.07w
##### Added
- GAS version indicator pill restored — shows current GAS version with auto-refresh polling
- GAS changelog popup restored — click the GAS pill to view changelog

## [v10.36r] — 2026-04-09 01:29:29 PM EST

> **Prompt:** "the html toggle should toggle the newly added live data visual UI"

### Fixed
- HTML layer toggle did not hide/show the Live Data App UI — `#live-data-app` was missing from the `_htmlLayerEls` toggle list

#### `testauthhtml1.html` — v01.06w
##### Fixed
- HTML layer toggle now includes the Live Data App container in the toggle list

## [v10.35r] — 2026-04-09 01:13:55 PM EST

> **Prompt:** "i can see the column fields but still waiting for data"

### Fixed
- RPC bridge was sending postMessage to `gasApp.contentWindow` (the outer Google shell iframe) instead of `_gasSandboxSource` (the inner sandbox where the worker script runs). GAS double-iframe architecture: `contentWindow` is the outer shell, `event.source` from `gas-auth-ok` is the inner sandbox. Messages to the outer shell never reach the worker script

#### `testauthhtml1.html` — v01.05w
##### Fixed
- Data now loads from the server — live table and dashboard populate correctly

## [v10.34r] — 2026-04-09 01:09:33 PM EST

> **Prompt:** "data is not loading"

### Fixed
- Script crash caused by null SSO indicator element reference — the SSO indicator HTML was removed during GAS→HTML migration but the `addEventListener` call at line 3848 wasn't null-checked, causing a `TypeError: Cannot read properties of null` that halted all subsequent JS (including Live Data App IIFE, HTML layer toggle, and RPC response handler)
- Added `gas-rpc-result`, `gas-rpc-error`, `gas-worker-ready` to the postMessage allowlist and signature-exempt list to prevent false security event logging

#### `testauthhtml1.html` — v01.04w
##### Fixed
- Data now loads correctly after signing in

## [v10.33r] — 2026-04-09 01:04:10 PM EST

> **Prompt:** "the screenshot is what i see now, i dont see that live data table"

### Fixed
- Live Data App not showing after authentication — added direct DOM activation fallback in `showApp()` and changed empty state to `display: flex` by default so "Waiting for data..." is visible immediately

#### `testauthhtml1.html` — v01.03w
##### Fixed
- Application content now appears immediately after signing in

## [v10.32r] — 2026-04-09 12:50:45 PM EST

> **Prompt:** "for our testauthhtml1 , i want you to move all of the html that we have in the gas layer to the hmtl layer, and then completely remove the gas layer.  there should not be any gas iframes or layers in the testauthhtml1"

### Changed
- Migrated all GAS-layer visual HTML/CSS/JS content to the HTML layer for `testauthhtml1` — the Live Data App (table/dashboard views, data polling, cell editing, row add/delete) now renders entirely in the HTML page
- Replaced visible full-screen GAS iframe with a hidden RPC worker iframe (0×0 pixels) that acts as a `google.script.run` proxy via postMessage
- Added `gasCall()` RPC bridge function to the HTML layer for server-side function calls
- Changed auth flow to load `?action=worker&session=TOKEN` instead of `?session=TOKEN` (loads worker instead of full GAS UI)
- Activated Live Data App directly from `showApp()` instead of via `ld-init` postMessage

### Removed
- Visible GAS iframe overlay (full-screen `z-index:1` iframe replaced with hidden worker)
- GAS pill (version indicator with countdown dot)
- GAS changelog overlay popup
- GAS layer toggle button
- SSO indicator
- GAS version polling IIFE (~160 lines of JS)
- GAS doGet() HTML template (~1,450 lines of inline HTML/CSS/JS removed from `.gs` file)

#### `testauthhtml1.html` — v01.02w
##### Changed
- All application content now renders directly in the HTML page instead of in a GAS iframe
- Data table and dashboard views load faster with direct HTML rendering
##### Removed
- Visible GAS layer overlay removed — application runs natively in the page

#### `testauthhtml1.gs` — v01.02g
##### Changed
- Session route now returns lightweight RPC worker page instead of full application UI
- Added `?action=worker` route for postMessage-based function call proxying

## [v10.31r] — 2026-04-09 11:30:10 AM EST

> **Prompt:** "for the testauthhtml1 , the new deployment id is AKfycbzPUkD3W7y3oGRRMKVt8Vl3ohGg_57SouUHKbbtYhtK7Ran-0SS4vVvft6_GR2YIRqDSg , the spreadsheet id is 1x_1aG2H1x8JfDbq6-uY8Hdz6PvzIeZLFFEw4vNe4oes . since this is a new page, do any necessary changes to the ACL and other interconnected settings, if you need more info from me let me know"

### Changed
- Updated `testauthhtml1` environment with its own GAS deployment — new `DEPLOYMENT_ID` and `SPREADSHEET_ID` replacing the shared values copied from `testauthgas1`
- Synced config to `testauthhtml1.gs` (`DEPLOYMENT_ID`, `SPREADSHEET_ID`), `testauthhtml1.html` (encoded `var _e`), and workflow deploy step webhook URL

#### `testauthhtml1.html` — v01.01w
##### Changed
- Updated GAS iframe to connect to the new dedicated deployment

#### `testauthhtml1.gs` — v01.01g
##### Changed
- Updated deployment ID and spreadsheet ID to own GAS project values

## [v10.30r] — 2026-04-09 10:57:44 AM EST

> **Prompt:** "make an identical copy of the testauthgas1 environment, but name it testauthhtml1"

### Added
- Created `testauthhtml1` environment as an identical copy of `testauthgas1` — HTML page, GAS script, config, version files, changelogs, changelog archives, diagram, workflow deploy step, GAS Projects table registration, README tree entries, and REPO-ARCHITECTURE.md nodes

## [v10.29r] — 2026-04-09 10:48:40 AM EST

> **Prompt:** "rename the testauth1 environment to testauthgas1"

### Changed
- Renamed `testauth1` environment to `testauthgas1` across entire repo — HTML page, GAS script, config, version files, changelogs, diagrams, workflow deploy steps, rules files, README tree, REPO-ARCHITECTURE.md, archive docs, test files, and backup files

#### `testauthgas1.html` — v04.00w

##### Changed
- Environment renamed from testauth1 to testauthgas1

#### `testauthgas1.gs` — v02.61g

##### Changed
- Environment renamed from testauth1 to testauthgas1

## [v10.28r] — 2026-04-09 09:59:32 AM EST

> **Prompt:** "fix it but it should be a single gas call, no parallel"

### Fixed
- Data poll now makes a single GAS call (`getInventoryData`) returning both inventory + history, instead of 2 parallel calls that could cause one to fail and block the other
- GAS upsert now uses a single `setValues()` batch call instead of 4 individual `setValue()` calls, reducing Sheets API overhead ~4x on restock operations

### Changed
- Merged GAS `processGetQrEntries` + `processGetQrHistory` into single `processGetInventoryData` endpoint
- Removed separate `getQrHistory` doPost handler (consolidated into `getInventoryData`)

#### `inventorymanagement.html` — v01.25w

##### Fixed
- Inventory data now loads reliably on first attempt — single GAS call eliminates the race condition where parallel calls could fail together

#### `inventorymanagement.gs` — v01.06g

##### Fixed
- Restock operations are faster — batch cell update instead of 4 individual writes
- Single data endpoint returns both inventory and history, halving the number of server calls per poll cycle

## [v10.27r] — 2026-04-09 09:47:10 AM EST

> **Prompt:** "make it so that one a barcode is added to the inventory, scanning it/adding the same one interacts with the quantity, not make a new entry. but each change should be logged in the history (different tab), for timestamp, user, action, barcode, item name, quantity change, and new quantity."

### Changed
- GAS `processAddQrEntry` now performs upsert: if barcode already exists, adds to existing quantity instead of creating a duplicate row
- GAS `processAddQrEntry` returns `action` ('Add' or 'Restock') and `newQuantity` so the frontend can show appropriate feedback
- Optimistic add on HTML now checks `_inventoryEntries` for existing barcode and updates quantity in-place (upsert) instead of always appending

### Added
- History logging: every add, restock, and delete writes a row to a `History` sheet (Timestamp, User, Action, Barcode, Item Name, Qty Change, New Qty)
- GAS `processGetQrHistory` endpoint to fetch recent history entries
- GAS `doPost` handler for `action=getQrHistory`
- GAS `processDeleteQrEntry` now logs deletion to the History sheet before removing the row
- HTML data poll now fetches both inventory and history in parallel, rendering the History tab with real server data
- GAS `_logHistory` helper function for consistent history logging across add/restock/delete

#### `inventorymanagement.html` — v01.24w

##### Changed
- Adding a scanned barcode that already exists now increases the existing item's quantity instead of creating a duplicate
- Toast message changes to "Restocked!" when updating an existing item
- History tab now shows real data from the server (was previously empty/placeholder)

#### `inventorymanagement.gs` — v01.05g

##### Changed
- Adding items with the same barcode now increases quantity on the existing entry instead of creating duplicates
- Item name is preserved from the first entry; updated only if the existing name was blank

##### Added
- Change history tracking — every add, restock, and delete is logged with timestamp, user, action, and quantity details
- History data retrieval endpoint for the History tab

## [v10.26r] — 2026-04-09 09:33:59 AM EST

> **Prompt:** "refer to the testauthgas1 for the method of optimistic data, and apply the same method to the inventorymanagement, ask clarifying questions if its not quite clear"

### Added
- Optimistic data rendering for inventory management — new entries appear instantly in the table (dimmed with "Sending…" overlay) before server confirmation, matching testauthgas1's pattern
- Delete functionality for inventory entries — each row gets a × button with confirmation modal and optimistic "Deleting…" overlay
- Cell change flash animation — cells that change between polls flash green (1.5s), helping multi-user awareness
- GAS backend `processDeleteQrEntry` endpoint for deleting inventory rows by sheet index
- `_rowIndex` field in GAS `processGetQrEntries` response for accurate delete targeting

### Changed
- Inventory table now renders from a persistent local data array (`_inventoryEntries`) instead of directly from server response, enabling optimistic inserts and change detection
- Data reconciliation replaces the entire local array on each poll, automatically clearing optimistic entries

#### `inventorymanagement.html` — v01.23w

##### Added
- Optimistic add rendering — new items appear immediately at 35% opacity with "Sending…" overlay
- Delete button (×) per inventory row with dark-themed confirmation modal
- Optimistic delete rendering — row dims with "Deleting…" overlay, restores on failure
- Cell-level change detection with green flash animation between polls
- Local data array and reconciliation logic matching testauthgas1's pattern

#### `inventorymanagement.gs` — v01.04g

##### Added
- `processDeleteQrEntry` function for deleting inventory entries by row index
- `deleteQrEntry` action handler in `doPost`
- `_rowIndex` field in `processGetQrEntries` response entries for delete targeting

## [v10.25r] — 2026-04-09 08:20:11 AM EST

> **Prompt:** "in the inventorymanagement, make it so that the user can add items manually to the inventory"

### Added
- Manual item entry form on inventory management page — users can now add items without scanning by entering barcode/ID, item name, and quantity via a collapsible form

#### `inventorymanagement.html` — v01.22w

##### Added
- "Add Item Manually" toggle button below the image upload row
- Collapsible manual entry form with barcode/ID, item name, and quantity fields
- `addManualEntryToSheet()` function that sends manual entries to the same GAS backend endpoint
- Form validation requiring at least a barcode or item name, and quantity ≥ 1
- Form auto-clears after successful submission with immediate data poll refresh

## [v10.24r] — 2026-04-08 10:41:24 PM EST

> **Prompt:** "the add to inventory button should be taking into account our inventory columns, since they are different to what we had before. they are Barcode, Item Name, Quantity, Last Updated, Last User, the other information we are not adding here, we will use them later"

### Changed
- Updated "Add to Inventory" to send barcode, itemName (empty for now), and quantity (default 1) instead of old data/format/type fields
- GAS backend spreadsheet columns changed from `[Timestamp, Data, Format, Type, User, Source]` to `[Barcode, Item Name, Quantity, Last Updated, Last User]`
- GAS `processGetQrEntries` now returns `barcode`, `itemName`, `quantity`, `lastUpdated`, `lastUser` fields
- HTML render function updated to map new field names from GAS response

#### `inventorymanagement.html` — v01.21w

##### Changed
- "Add to Inventory" now sends barcode and quantity (default 1) to the spreadsheet
- Inventory tab data display aligned with new column structure

#### `inventorymanagement.gs` — v01.03g

##### Changed
- Spreadsheet columns updated to Barcode, Item Name, Quantity, Last Updated, Last User
- Data retrieval returns the new column fields

## [v10.23r] — 2026-04-08 10:02:33 PM EST

> **Prompt:** "you overwrote the columns i told you to use for the inventory tab, what you had as columns in the activity tab was fine, and the column headers should be showing there. the inventory tab should have columns Barcode, Item Name, Quantity, Last Updated, Last User. i will wire up the missing columns later"

### Fixed
- Restored correct Inventory tab columns (Barcode, Item Name, Quantity, Last Updated, Last User) — were incorrectly overwritten with Activity tab columns in the previous change

#### `inventorymanagement.html` — v01.20w

##### Fixed
- Inventory tab now shows the correct columns: Barcode, Item Name, Quantity, Last Updated, Last User

## [v10.22r] — 2026-04-08 09:56:50 PM EST

> **Prompt:** "instead of our current scan history, have the scan history functionality move to the activity tab instead. the concept we had for the activity tab will be used in the inventory tab instead. but with the information for those columns, dont worry about the columns we dont use yet we will eventually wire them up, but the inventory tab is the one that will save into the spreadsheet, the activity tab wont, it; be like the scan history currently is."

### Changed
- Activity tab now shows scan history (card-based, local only — no spreadsheet saves), replacing the old standalone scan history section
- Inventory tab now hosts the spreadsheet-polled entries table (previously in Activity tab) — this is the tab that saves to the spreadsheet
- Removed the old standalone scan history section (functionality moved into Activity tab)

#### `inventorymanagement.html` — v01.19w

##### Changed
- Activity tab repurposed as local scan history with card-based UI
- Inventory tab now shows the live spreadsheet data entries
- Standalone scan history section removed (merged into Activity tab)

## [v10.21r] — 2026-04-08 09:46:02 PM EST

> **Prompt:** "even if there is no data yet in the tabs it should still show the headings for the columns"

### Changed
- All three Live Data tabs (Inventory, History, Activity) now show column headers even when there is no data — empty message appears below the headers

#### `inventorymanagement.html` — v01.18w

##### Changed
- Column headers are always visible in all tabs, with empty-state message shown below when no data is available

## [v10.20r] — 2026-04-08 09:41:36 PM EST

> **Prompt:** "the default tab that opens will be the inventory. make the columns in the inventory be Barcode, Item Name, Quantity, Last Updated, Last User. in history tab make the columns be Timestamp, User, Action, Barcode, Item Name, Quantity Change, New Quantity"

### Changed
- Default active tab changed from Activity to Inventory on the inventory management page
- Inventory tab now has table structure with columns: Barcode, Item Name, Quantity, Last Updated, Last User
- History tab now has table structure with columns: Timestamp, User, Action, Barcode, Item Name, Quantity Change, New Quantity

#### `inventorymanagement.html` — v01.17w

##### Changed
- Default tab is now Inventory instead of Activity
- Inventory tab shows a table with Barcode, Item Name, Quantity, Last Updated, Last User columns
- History tab shows a table with Timestamp, User, Action, Barcode, Item Name, Quantity Change, New Quantity columns

## [v10.19r] — 2026-04-08 09:35:30 PM EST

> **Prompt:** "make the order of the tabs be Inventory, History, Activity"

### Changed
- Reordered Live Data tabs on inventory management page to: Inventory, History, Activity

#### `inventorymanagement.html` — v01.16w

##### Changed
- Tab order changed from Activity → Inventory → History to Inventory → History → Activity

## [v10.18r] — 2026-04-08 09:27:26 PM EST

> **Prompt:** "for the inventorymanagement, make the live data have different tabs for now have 3 tabs. the one we already have which is Activity, Inventory, and History. for now the inventory and history tabs wont have functionality, just set them up"

### Added
- Tabbed interface for the Live Data section on the inventory management page — three tabs: Activity (existing entries table), Inventory (placeholder), and History (placeholder)

#### `inventorymanagement.html` — v01.15w

##### Added
- Three tabs in the live data section: Activity, Inventory, and History
- Activity tab shows the existing live data entries table
- Inventory and History tabs display "coming soon" placeholders

## [v10.17r] — 2026-04-08 09:16:47 PM EST

> **Prompt:** "analyze the autoHotkey/Combined Inventory and Intercept.ahk and write out all of the features it has. we will eventually be implementing features that has into our inventorymanagement, but for now i just want a comprehensive documents with all of the features the autoHotkey/Combined Inventory and Intercept.ahk has."

### Added
- Comprehensive AHK feature reference document (`repository-information/inventorymanagement-ahk-features.md`) — catalogs all 10 feature areas from the AutoHotkey inventory management script for future web implementation

## [v10.16r] — 2026-04-08 05:54:04 PM EST

> **Prompt:** "similar to the flashlight toggle button, have a toggle to turn off the camera"

### Added
- Camera on/off toggle button in the scanner viewport (circular button next to the flashlight toggle) — turns camera off without leaving the scanner panel, tap again to restart

#### `inventorymanagement.html` — v01.14w

##### Added
- Camera toggle button next to the flashlight — tap to turn camera off (turns red), tap again to restart

## [v10.15r] — 2026-04-08 05:48:21 PM EST

> **Prompt:** "can you make it so that the user if they already gave permissions on page load auto starts the camera without needing them to start the camera, if not given permissions yet then yes then the user can use the start camera"

### Added
- Camera auto-starts on panel open if permission was previously granted — uses Permissions API to check, falls back to showing START CAMERA button on unsupported browsers

#### `inventorymanagement.html` — v01.13w

##### Added
- Camera now starts automatically when you open the scanner if you've already granted camera permission — no need to tap START CAMERA each time

## [v10.14r] — 2026-04-08 05:42:46 PM EST

> **Prompt:** "the following is happening mostly on mobile. when i switch tabs/applications on mobile and i come back to the scanner, the camera shows a still frame of the last thing seen on the camera before i switched tabs/applications, with no method to get the camera to activate again other than refreshing the page. how do you suggest we address that"

### Added
- Camera auto-resume on mobile tab/app switch via `visibilitychange` listener — camera stops cleanly when page is hidden and auto-restarts when returning, with graceful fallback if camera permission was revoked

#### `inventorymanagement.html` — v01.12w

##### Added
- Camera now automatically resumes when you switch back to the scanner from another tab or app — no more frozen frames or page refreshes needed

## [v10.13r] — 2026-04-08 05:32:36 PM EST

> **Prompt:** "the parts you changed are good. the data table at the bottom is also being cut off the sides as per the screenshot"

### Fixed
- Fixed Live Data entries table being cut off on the right side on mobile — table now scrolls horizontally within its container

#### `inventorymanagement.html` — v01.11w

##### Fixed
- Data table no longer gets cut off on smaller screens — you can now swipe to see all columns

## [v10.12r] — 2026-04-08 05:26:14 PM EST

> **Prompt:** "the screenshot shows my view on my phone. make it so that the camera has padding to left and right, and not take up so much space overall. note that some parts of the screen are being cut off, so adjust everything to make it visually clear and user friendly on both mobile and pc"

### Changed
- Improved mobile layout: reduced camera viewport from 1:1 to 4:3 aspect ratio with 260px max-height (mobile), added 40px top padding to scanner header so it clears the user-pill/sign-out bar
- Added `viewport-fit=cover` to viewport meta tag for safe-area support on notched phones
- Tightened spacing (gaps, padding) throughout scanner panel for better mobile density
- Added desktop media query (≥600px) restoring larger camera viewport (360px) and wider padding

#### `inventorymanagement.html` — v01.10w

##### Changed
- Scanner camera preview is now more compact on mobile, showing more of the page below it
- Scanner header is no longer hidden behind the sign-out bar
- Improved spacing and layout for both mobile and desktop screens

## [v10.11r] — 2026-04-08 05:16:10 PM EST

> **Prompt:** "after scanning, then using add to inventory, the button says adding... then goes away, but then when i scan again the button appears and says ..adding immediately"

### Fixed
- Fixed "Add to Inventory" button showing stale "...adding" text and disabled state after a new scan — button text and enabled state now reset on every new scan and history click

#### `inventorymanagement.html` — v01.09w

##### Fixed
- "Add to Inventory" button no longer appears stuck in "adding..." state after scanning a new item

## [v10.10r] — 2026-04-08 05:09:34 PM EST

> **Prompt:** "in inventorymanagement, change TEMPLATE_TITLE to Inventory Management .  also make it so that the user can still add the same item to the database with the add to inventory button, but only once per scan"

### Changed
- Set page `<title>` to "Inventory Management" (was `TEMPLATE_TITLE` placeholder)
- Changed duplicate-scan add logic: "Add to Inventory" button now allows adding the same barcode/QR data multiple times, but only once per scan — re-scanning or clicking a history item resets the add opportunity

#### `inventorymanagement.html` — v01.08w

##### Changed
- Page title now shows "Inventory Management" in browser tabs
- You can now add the same item to inventory multiple times — each scan gives one add opportunity instead of permanently hiding the button after the first add

## [v10.09r] — 2026-04-08 02:38:26 PM EST

> **Prompt:** "i was referring to the countdown in the testauthgas1 polling which im showing in the screenshot"

### Changed
- Replaced simple countdown timer with testauthgas1-style connection status badge: `Live Data ● Live 2s | ▸ 14s`
- Badge shows: green dot + "Live" + data age + divider + poll countdown (matching testauthgas1's `ld-conn-status` pattern)
- Amber pulsing dot + "Updating..." during fetch, gray "Offline" when stopped

#### `inventorymanagement.html` — v01.07w

##### Changed
- Entries header now shows testauthgas1-style live connection status badge
- Displays data freshness age and poll countdown in a rounded pill

## [v10.08r] — 2026-04-08 02:33:08 PM EST

> **Prompt:** "make the poll countdown timer visible on the inventorymanagement similar to how it shows it in the testauthgas1"

### Added
- Visible poll countdown timer in the inventory entries header — shows seconds until next refresh (`⚡ 12s`), turns cyan in last 5 seconds, shows `polling...` in amber during fetch

#### `inventorymanagement.html` — v01.06w

##### Added
- Poll countdown display between entries title and refresh button
- Countdown timer with `_startPollCountdown()` / `_stopPollCountdown()` / `_updatePollCountdown()` functions
- Visual states: `--` (idle), `⚡ Xs` (counting), `polling...` (fetching)

## [v10.07r] — 2026-04-08 02:26:55 PM EST

> **Prompt:** "ok good. now how the live data is handled, look at the testauthgas1 environment to see how that is handled, so that we can see updates by polling intervals and apply that to the inventorymanagement"

### Added
- Live data polling for inventory entries — auto-refreshes every 15 seconds using existing `DATA_POLL_INTERVAL` config
- Polling loop with in-flight guard to prevent concurrent fetches
- Server entries cross-referenced with local scan tracking to auto-hide add button for already-added items

### Changed
- Entries table now auto-populates on panel open and updates continuously
- Refresh button triggers immediate poll instead of standalone fetch
- `addQrEntryToSheet` success handler triggers immediate poll for instant feedback

#### `inventorymanagement.html` — v01.05w

##### Added
- Automatic data polling every 15 seconds for live inventory updates
- Entries from the spreadsheet now sync the "Add to Inventory" button state

## [v10.06r] — 2026-04-08 02:08:12 PM EST

> **Prompt:** "auto make the tab for the data, including the header row. also the add to inventory button should go away if the user has already added it to the inventory"

### Changed
- GAS auto-creates the spreadsheet sheet and header row (Timestamp, Data, Format, Type, User, Source) if missing
- "Add to Inventory" button hides after a scan has been successfully added
- Clicking a history item that was already added no longer shows the add button

### Fixed
- `processGetQrEntries` now skips the header row when reading spreadsheet data

#### `inventorymanagement.html` — v01.04w

##### Changed
- "Add to Inventory" button disappears after successfully adding a scan
- Previously added scans show no add button when revisited from history

#### `inventorymanagement.gs` — v01.02g

##### Added
- Auto-creates spreadsheet tab and header row on first scan entry
- Skips header row when reading entries

## [v10.05r] — 2026-04-08 02:00:07 PM EST

> **Prompt:** "since the scanner is the interface that i want the user to use, make it take up the full screen in stead of requiring the button to make it show"

### Changed
- Made QR scanner the full-screen main interface of the inventory management page
- Scanner auto-shows after authentication (no toggle button needed)
- Removed side-panel slide-in behavior — scanner now fills the entire viewport
- Content centered with 480px max-width for readability on large screens

#### `inventorymanagement.html` — v01.03w

##### Changed
- Scanner now takes up the full screen as the main interface
- No longer requires a button tap to open — appears automatically after sign-in

##### Removed
- Toggle button and close button (scanner is always visible when authenticated)

## [v10.04r] — 2026-04-08 01:41:18 PM EST

> **Prompt:** "the new additions to the html layer should be hidden by the html toggle"

### Fixed
- QR scanner panel, toggle button, and toast now hide/show with the HTML layer toggle
- Camera stops automatically when HTML layer is hidden

#### `inventorymanagement.html` — v01.02w

##### Fixed
- Added QR scanner elements (`qr-toggle-btn`, `qr-panel`, `qr-toast`) to `_htmlLayerEls` array so they respond to the HTML layer toggle
- Added `stopQrCamera()` call when HTML layer is hidden to release camera resources

## [v10.03r] — 2026-04-08 01:35:13 PM EST

> **Prompt:** "incorporate the qr-scanner6.html into the html layer of the inventorymanagement (we seem to have to do this because we cant open the camera on the gas layer) , but prepare it so that scanning adds entries to the spreadsheet and the results can be visible on the html layer"

### Added
- Integrated QR code and barcode scanner into the inventory management HTML layer using jsQR (fallback) and native BarcodeDetector API
- Added `processAddQrEntry()` and `processGetQrEntries()` GAS backend handlers for spreadsheet reads/writes
- Added `doPost(action=addQrEntry)` and `doPost(action=getQrEntries)` routing in GAS
- QR scanner panel with camera viewport, scan line animation, torch control, and engine detection badge
- Scan result card with type classification (URL, EMAIL, PHONE, PRODUCT, TEXT, etc.) and format detection
- "Add to Inventory" button that writes scanned data to the spreadsheet via authenticated fetch to GAS
- Scan history (last 10 scans) with clickable items to restore to result card
- Recent inventory entries table fetched from spreadsheet with refresh capability
- Image upload fallback for scanning QR codes from gallery
- Auth-wall cleanup: QR panel hidden and camera stopped on sign-out/session expiry

#### `inventorymanagement.html` — v01.01w

##### Added
- QR scanner side panel in PROJECT CSS/HTML/JS sections
- jsQR CDN script dependency
- Camera access via getUserMedia with rear-facing preference
- Native BarcodeDetector support with 13 barcode formats
- Floating toggle button (bottom-left) visible only when authenticated
- GAS communication via fetch POST to doPost endpoints
- Auth-wall cleanup with `// PROJECT:` marker in showAuthWall()

#### `inventorymanagement.gs` — v01.01g

##### Added
- `processAddQrEntry()` — validates session and appends QR scan row to spreadsheet
- `processGetQrEntries()` — validates session and retrieves recent QR_SCAN entries
- doPost routing for `addQrEntry` and `getQrEntries` actions with `// PROJECT:` markers

## [v10.02r] — 2026-04-08 01:09:15 PM EST

> **Prompt:** "reset the inventorymanagement to the state it was originally when it was first created, so that we can start making the project again from scratch"

### Changed
- Reset inventorymanagement project to original template state for rebuilding from scratch

#### `inventorymanagement.html` — v01.00w

##### Changed
- Reset to template defaults — all custom inventory UI removed

#### `inventorymanagement.gs` — v01.00g

##### Changed
- Reset to template defaults — all custom inventory backend code removed

### Removed
- Deleted `inventorymanagement-diagram.md` per-environment diagram (will be recreated during rebuild)

## [v10.01r] — 2026-04-08 12:49:24 PM EST

> **Prompt:** "remember session but still not working"

### Fixed
- Added opaque `background: #0d1117` to `#inv-panel` desktop CSS — the fixed-position panel had no background, causing desktop Chrome's compositor to pass clicks through to the GAS iframe below despite correct z-index stacking
- Added all 11 inventory/scan bridge message types to `_KNOWN_GAS_MESSAGES` security allowlist — every bridge message was triggering `_reportSecurityEvent('unknown_message_type')` which created hidden iframes per message, flooding the page and disrupting bridge communication on desktop

#### `inventorymanagement.html` — v01.26w

##### Fixed
- All buttons now respond to clicks on desktop (not just hover)
- Inventory data and history now load on desktop

## [v10.00r] — 2026-04-08 12:35:49 PM EST

> **Prompt:** "fix it, but keep in mind that the PC is not showing the results of the inventory, and its still not letting me interact even if i toggle the gas layer"

### Fixed
- Added `pointer-events: none` to the `gas-app` iframe — the full-viewport GAS iframe was intercepting all mouse clicks on desktop, preventing interaction with the inventory panel buttons. The iframe has no visible UI and is used only for `postMessage`/`google.script.run` communication
- Made bridge `_sendToGas()` robust with fallback: uses `_gasBridgeSource` (evt.source from GAS sandbox) as primary, falls back to `gasApp.contentWindow` for mobile browsers where the GAS sandbox IS the contentWindow
- Added opportunistic `evt.source` capture from ANY inventory/scan bridge response message — if `inventory-bridge-ready` was missed (timing, race condition), the bridge self-heals on the first response received

#### `inventorymanagement.html` — v01.25w

##### Fixed
- All buttons (Add Manually, New Item, Add Stock, Subtract, Edit, Delete) are now clickable on desktop
- Inventory data and history now load on desktop (bridge connection was failing silently)

## [v09.99r] — 2026-04-08 12:21:51 PM EST

> **Prompt:** "fix it"

### Fixed
- Inventory bridge `_sendToGas()` used `gasApp.contentWindow.postMessage()` which targets Google's outer shell frame, not the inner GAS sandbox where the inventory bridge listener runs — messages never reached `google.script.run`, so CRUD Promises never resolved and modals never closed
- Replaced with `_gasBridgeSource.postMessage()` using `event.source` captured from `inventory-bridge-ready`, matching the constraint documented at line 2061 and the pattern used by all other working GAS communication in the codebase

#### `inventorymanagement.html` — v01.24w

##### Fixed
- Add item, edit, delete, and stock changes now complete and close their windows correctly

## [v09.98r] — 2026-04-08 12:12:41 PM EST

> **Prompt:** "i think we need to remake the inventorymanagement. the camera works, and its even writing to the spreadsheet when i scan, but its not properly working with adding new item. come up with a plan to get everything working. you can take inspiration with how the data is updated in the table with the testauthgas1 project and also inspiration from the original qr-scanner6"

### Fixed
- Made barcode field editable in Add New Item modal — removed `readonly` attribute, added placeholder text
- Added client-side barcode validation to `_invSaveNew()` — catches empty barcode before GAS call
- Auto-offer "Add New Item" when scanning unknown barcode in ADD or SUB mode — instead of error message, opens modal with scanned barcode pre-filled

### Added
- "Add Manually" button in inventory action row — opens Add New Item modal with empty editable barcode field for manual entry without camera
- `_invManualAdd()` function for opening new item modal independently of scan mode

#### `inventorymanagement.html` — v01.23w

##### Fixed
- You can now type a barcode manually when adding new items instead of requiring a camera scan
- Scanning an unknown barcode while adding or removing stock now opens the new item form automatically

##### Added
- New "Add Manually" button for adding items without scanning

## [v09.97r] — 2026-04-08 11:49:43 AM EST

> **Prompt:** "still getting stuck on the add new item window, i click add item but it doesnt close the window when i do"

### Fixed
- Rewrote bridge callback system to use matcher functions instead of key-based lookup — each call registers a matcher that checks both response type and op field, eliminating key mismatch entirely
- CRUD ops match on `inventory-op-result` + `op` field (e.g. `op === 'add-new'`); data/poll/scan ops match via static response→request type mapping

#### `inventorymanagement.html` — v01.22w

##### Fixed
- Add item, edit, delete, and stock operations now work reliably and close their modals when complete

## [v09.96r] — 2026-04-08 11:40:06 AM EST

> **Prompt:** "on the add new item window, i enter the item name and click add item, but it stays on that window, and even then it seems to be trying to add it to the spreadsheet, but its not showing anything in the inventory, history, or raw scans"

### Fixed
- PostMessage bridge handler routing: handlers were stored under request type (`inventory-add-new`) but looked up under response base type (`inventory-op`) — Promises never resolved
- CRUD operations (add-new, add-stock, sub-stock, edit, delete) now use `op` field from `inventory-op-result` to reconstruct correct handler key
- Data/poll/scan responses now use static mapping table to match response base types to request handler keys

#### `inventorymanagement.html` — v01.21w

##### Fixed
- Inventory operations (add, edit, delete, stock changes) now complete correctly and update the display
- Data loading and automatic polling now populate the inventory and history tables

## [v09.95r] — 2026-04-08 11:27:51 AM EST

> **Prompt:** "its looking pretty good on my phone, but in the desktop browser, i dont see the new UI for some reason (shown in screenshot)"

### Fixed
- Inventory panel no longer hidden behind `display: none` gate — shows immediately on page load instead of waiting for bridge-ready message that could arrive before listener was registered
- Removed `_showInvPanel()` activation function and `.active` class dependency — panel is always visible, data populates when bridge connects

#### `inventorymanagement.html` — v01.20w

##### Fixed
- Inventory panel now appears immediately on desktop instead of waiting for background connection

## [v09.94r] — 2026-04-08 11:19:58 AM EST

> **Prompt:** "im seeing a jumbled mess, and the html toggle is not hiding the code you moved over, the camera is properly being hidden by the toggle"

### Fixed
- Scanner page changed from `position: fixed` to `position: relative` on mobile so it flows naturally above the inventory panel
- Desktop: scanner is fixed-left (380px), inventory panel fills remaining right side
- Mobile: scanner and inventory stack vertically with proper z-index layering (no overlap)
- Added `'inv-panel'` to `_htmlLayerEls` array so the HTML layer toggle hides/shows the inventory panel

#### `inventorymanagement.html` — v01.19w

##### Fixed
- Scanner and inventory controls no longer overlap on mobile — they stack vertically with scanner on top
- Desktop layout properly separates scanner (left) and inventory (right) without overlap
- HTML layer toggle now also hides/shows the inventory panel

## [v09.93r] — 2026-04-08 11:07:48 AM EST

> **Prompt:** "unfortunately the modes arent properly being tracked between the html and gas layer it seems like its having a hard time moving data between the layers, what do you think we should do?"

### Changed
- Moved entire inventory management UI from GAS iframe to HTML layer — eliminates cross-layer state sync issues
- GAS iframe now operates as a hidden backend bridge only (receives postMessage, calls google.script.run, returns results)
- Scanner's `onFound()` now calls `_handleInventoryScan()` directly — no postMessage needed for scan handling
- All inventory operations (CRUD, polling) use `_gasCall()` Promise-based bridge through hidden GAS iframe
- Responsive layout now uses parent viewport media queries correctly (no more iframe breakpoint mismatch)

#### `inventorymanagement.html` — v01.18w

##### Added
- Full inventory UI: mode buttons, tables, modals, status bar, view toggles, polling
- `_gasCall()` Promise-based bridge for all server-side operations through hidden GAS iframe
- Responsive desktop (side-by-side) and mobile (stacked) layouts using real viewport media queries
- Direct scan-to-inventory handler — scanner calls `_handleInventoryScan()` in same JS scope

##### Removed
- `inventory-scan` postMessage to GAS iframe (replaced by direct function call)
- `#gas-app` CSS repositioning (GAS iframe stays hidden/background)

#### `inventorymanagement.gs` — v01.17g

##### Changed
- Stripped all inventory UI HTML, CSS, and JS from GAS session page
- Added inventory bridge message router (routes 9 operation types: get-data, poll, add-new, add-stock, sub-stock, edit, delete, scan-get-history, scan-delete-row)

##### Removed
- Inventory container HTML, modals, tables, mode buttons, scan panel
- All inventory CSS (mode styles, table styles, modal styles, responsive media queries)
- All inventory JS functions (mode switching, rendering, polling, modal handlers)

## [v09.92r] — 2026-04-08 10:23:28 AM EST

> **Prompt:** "for the inventorymanagement, adjust the UI so that there is a proper user friendly Mobile and Desktop mode. the screenshot shows what it currently looks like."

### Added
- Responsive CSS media queries for desktop (≥768px) side-by-side layout: scanner on left, inventory panel on right
- Responsive CSS media queries for mobile (<768px) stacked layout with touch-friendly controls
- Desktop GAS iframe positioning to shift right of scanner area
- Horizontal table scrolling on mobile for wide tables (History view)

### Changed
- Desktop: scanner reduced to 360px square, inventory panel fills remaining width with larger fonts and spacing
- Mobile: mode buttons with min-height 44px for touch targets, modal inputs with 16px font to prevent iOS zoom
- Admin/user position elements adapted for desktop layout (removed fragile calc-based positioning on desktop)

#### `inventorymanagement.html` — v01.17w

##### Added
- Desktop media query: scanner aligned left with 360px max-width and square aspect ratio
- Mobile media query: full-width scanner with 4:3 aspect ratio
- GAS iframe responsive positioning via CSS `!important` override

##### Changed
- Scanner container responsive behavior split between mobile and desktop breakpoints

#### `inventorymanagement.gs` — v01.16g

##### Added
- Desktop media query: expanded inventory panel with larger fonts, spacing, and table dimensions
- Mobile media query: touch-friendly buttons, horizontal table scroll, optimized modal inputs

##### Changed
- Inventory container gets top padding on mobile to clear scanner viewport
- Table wrapper gains horizontal scroll for better mobile usability

## [v09.91r] — 2026-04-08 09:54:43 AM EST

> **Prompt:** "for the inventorymanagement, design a system that incorporates all of the elements that are used in the autoHotkey/Combined Inventory and Intercept.ahk , ask clarifying questions if necessary"

### Added
- Full inventory management system with item CRUD, stock tracking, and semantic history/audit trail
- Three scan modes (New Item, Add Stock, Subtract Stock) with color-coded mode banner
- Three togglable list views (Inventory, History, Raw Scans) with sortable columns
- Custom HTML modals for Add New Item, Edit Item, and Delete Item operations
- Advanced quantity toggle for custom +N/-N stock adjustments (default +1/-1 per scan)
- 15-second inventory data polling for multi-user sync with optimistic UI updates
- Status bar with auto-fade feedback messages for all operations
- Parent-to-GAS scan bridge for forwarding camera barcode scans to inventory mode handler

#### `inventorymanagement.gs` — v01.15g

##### Added
- Inventory backend: auto-creating Inventory and InventoryHistory sheets
- CRUD functions: addNewItem, addStock, subtractStock, editItem with validation and history logging
- Cached data retrieval: getInventoryData, pollInventoryData with CacheService optimization
- Full inventory management UI in GAS session page (modes, list views, modals, status bar)

#### `inventorymanagement.html` — v01.16w

##### Added
- Scan forwarding to GAS session iframe for inventory processing via postMessage

