# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 99/100`

## [Unreleased]

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

## [v09.90r] — 2026-04-07 10:31:24 PM EST

> **Prompt:** "the program portal itself can be excluded since we are already in it, so how do you suggest we do that" / "yes"

### Changed
- `getPortalApps()` now skips the portal's own page (derived from `EMBED_PAGE_URL`) so it doesn't show a card linking to itself

#### `programportal.gs` — v01.65g

##### Changed
- Portal no longer shows a card for itself — the current app is excluded from the app list

## [v09.89r] — 2026-04-07 10:24:49 PM EST

> **Prompt:** "any reason why the programportal is not showing the globalacl?" / "yes"

### Fixed
- Removed `SELF` exclusion from `getPortalApps()` in programportal.gs — the globalacl column was skipped because its `#URL` row contained `SELF`, but since the portal card URL is built from the column header (`pageId + '.html'`) not from `#URL`, the exclusion was unnecessary and prevented Global ACL from appearing in the portal

#### `programportal.gs` — v01.64g

##### Fixed
- Global ACL now appears in the portal alongside other authentication-enabled applications

## [v09.88r] — 2026-04-07 10:16:45 PM EST

> **Prompt:** "ok great that fixed it. i noticed that it wasnt hiding the admin dropdown all the way since i first created this project meaning that there is something not properly set up on the templates or setup-gas-project.sh or gas-project-creator . can you review them to see if we can fix it so that future projects properly have it set up"

### Fixed
- Root cause: the auth HTML template's `showApp()` never called `_showGasToggle()`, and the GAS auth template had an active duplicate toggle button inside the iframe with an incomplete `_gasLayerEls` list. Fixed all three issues in both templates so future projects are set up correctly
- Propagated the fixes to all existing auth pages (globalacl.html, programportal.html) and their GAS scripts (globalacl.gs, programportal.gs)

#### `globalacl.html` — v01.89w

##### Fixed
- Added `_showGasToggle()` call to `showApp()` so parent page's GAS toggle button is visible after auth

#### `globalacl.gs` — v01.56g

##### Fixed
- Commented out duplicate GAS toggle button inside iframe — parent page's button handles the toggle

#### `programportal.html` — v01.96w

##### Fixed
- Added `_showGasToggle()` call to `showApp()` so parent page's GAS toggle button is visible after auth

#### `programportal.gs` — v01.63g

##### Fixed
- Commented out duplicate GAS toggle button inside iframe — parent page's button handles the toggle

## [v09.87r] — 2026-04-07 10:08:31 PM EST

> **Prompt:** "last session we were trying to see why the gas toggle in the inventorymanagement was not hiding the admin dropdown and the scan history. it is properly hiding the gas version number and signed in username. take your time to analyze why those are properly hidden but the admin dropdown and the scan history are not hidden"

### Fixed
- Root cause found: the parent page's GAS toggle button was never shown (`_showGasToggle()` was missing from `showApp()`), so the user was clicking the GAS iframe's internal toggle button which only hid 3 elements (`version`, `user-email`, `main-content`) — missing admin badge, admin dropdown, and scan panel. Fix: added `_showGasToggle()` call to `showApp()` (matching testauthgas1), reverted parent toggle to inline `style.display` approach, expanded GAS-side element list, and commented out the iframe's duplicate toggle button

#### `inventorymanagement.html` — v01.15w

##### Fixed
- GAS toggle now properly hides all GAS content by showing the parent page's toggle button after auth — clicking it hides the entire GAS iframe

#### `inventorymanagement.gs` — v01.14g

##### Fixed
- GAS-side toggle element list expanded to include admin badge, admin dropdown, admin panel overlay, scan panel, and scan delete modal
- Iframe's duplicate GAS toggle button commented out — parent page's button handles the toggle

## [v09.86r] — 2026-04-07 09:40:18 PM EST

> **Prompt:** "it is still not hiding, do a much deeper analysis so that its properly hidden just like the other elements are without any mechanism we werent already using"

### Fixed
- Root cause found: the GAS toggle used `style.display = 'none'` to hide the iframe, but the auth flow's reconnect/reshow code (line 2042) resets `style.visibility = ''` after auth events — undoing the toggle. Fix: switched to using `.classList.add('html-layer-hidden')` which applies `display: none !important` via CSS class — the same mechanism the HTML toggle uses. The `!important` defeats any inline style override from the auth flow

#### `inventorymanagement.html` — v01.14w

##### Fixed
- GAS toggle now reliably hides all GAS content using the same CSS class mechanism as the HTML toggle

## [v09.85r] — 2026-04-07 09:34:43 PM EST

> **Prompt:** "idk what you are doing but as per the screenshot, when toggling both toggles, i still see the admin dropdown and scan history, they shouldnt be visible"

### Fixed
- Added `visibility: hidden` alongside `display: none` on the GAS iframe toggle — belt-and-suspenders approach to ensure the GAS layer content (admin dropdown, scan history) is fully hidden when the GAS toggle is off

#### `inventorymanagement.html` — v01.13w

##### Fixed
- GAS layer toggle now also sets visibility:hidden for more reliable hiding

## [v09.84r] — 2026-04-07 09:22:12 PM EST

> **Prompt:** "the admin dropdown and scan history are not properly set up to interact with their cooresponding toggles, fix that"

### Fixed
- Repositioned GAS iframe's admin badge, admin dropdown, admin panel, and user email to appear below the HTML-layer camera widget — they were hidden behind the camera (position: fixed with small top values). Now use `calc(min(100vw, 480px) * 0.75 + Npx)` to stay below the camera area

#### `inventorymanagement.gs` — v01.13g

##### Fixed
- Admin controls and scan history now visible below the camera area instead of hidden behind it

## [v09.83r] — 2026-04-07 09:00:16 PM EST

> **Prompt:** "revert the last change, the part about the thing scanned fading out after the poll updates the information can stay though"

### Removed
- Reverted HTML-layer instant history list (`#qr-live-history`) — scan history updates only via the GAS 15s poll. The optimistic "saving..." → "✔ saved" notification on the HTML layer remains

#### `inventorymanagement.html` — v01.12w

##### Removed
- Instant scan history list on the HTML layer (reverted per user request)

## [v09.82r] — 2026-04-07 08:55:52 PM EST

> **Prompt:** "is there a way to update the live data upon scanning the new information rather than waiting for the poll countdown to refresh it"

### Added
- Instant scan history update on the HTML layer — when `processBarcodeScan()` returns the updated history via the scanListener bridge, the parent renders it immediately below the camera (no need to wait for the 15s GAS poll). The GAS poll still runs for authoritative sync

#### `inventorymanagement.html` — v01.11w

##### Added
- Scan history appears instantly after each scan — no more waiting for the polling countdown

## [v09.81r] — 2026-04-07 08:29:42 PM EST

> **Prompt:** "the left and right side still dont have padding"

### Fixed
- Increased side padding on both HTML scanner-container (12px → 16px + `box-sizing: border-box`) and GAS scan-panel (14px → 16px + `box-sizing: border-box` + matched `max-width: 480px` to scanner) so content doesn't touch screen edges on mobile

#### `inventorymanagement.html` — v01.10w

##### Fixed
- Camera area and scan result notification now have visible side margins on mobile

#### `inventorymanagement.gs` — v01.12g

##### Fixed
- Scan history rows now have visible side margins on mobile

## [v09.80r] — 2026-04-07 08:25:37 PM EST

> **Prompt:** "this is what it looks like now, i want it to not go off the edges on the left and right either, just a little padding. also the delete buttons should have a confirmation in the same way the testauthgas1 handles it. the optimistic needs more room as its overlapping as shown in screenshot"

### Changed
- Added horizontal padding (14px) to scan-panel so rows don't touch screen edges on mobile
- Delete button now shows a confirmation modal (testauthgas1 pattern) with a preview of the scan value before deleting — prevents accidental deletion
- Optimistic "last scan" element gets bottom margin so it doesn't overlap with the GAS "Scan History" title below. GAS scan-panel padding-top increased by 40px for more breathing room

#### `inventorymanagement.html` — v01.09w

##### Changed
- Scan result notification now has spacing so it doesn't overlap scan history below

#### `inventorymanagement.gs` — v01.11g

##### Added
- Delete confirmation dialog — tap the ✕ button to see a preview before confirming deletion

##### Changed
- Scan entries have proper side margins on mobile screens

## [v09.79r] — 2026-04-07 08:14:16 PM EST

> **Prompt:** "this is what it looks like on my phone, make the camera area much more compact so we have more space"

### Changed
- Made camera viewport more compact on mobile — changed aspect ratio from 1:1 (square) to 4:3 (landscape), reduced padding from 18px to 8px, tighter gap between elements. Gives ~25% more vertical space for scan history below
- Updated GAS scan-panel padding-top to match the new smaller camera height (`min(100vw,480px) * 0.75 + 50px`)

#### `inventorymanagement.html` — v01.08w

##### Changed
- Camera viewport is now more compact with a 4:3 aspect ratio

#### `inventorymanagement.gs` — v01.10g

##### Changed
- Scan history position adjusted for the smaller camera area

## [v09.78r] — 2026-04-07 08:08:27 PM EST

> **Prompt:** "adad a button that functions similarly as the testauthgas1 that lets the user delete an entry"

### Added
- Delete button (✕) on each scan row in the GAS-layer scan history — dims the row optimistically, deletes from the Scans sheet server-side, refreshes cache and UI on success
- `deleteScanRow(token, sheetRowIndex)` server function with session validation

#### `inventorymanagement.gs` — v01.09g

##### Added
- Delete button on each scan entry to remove it from the spreadsheet

## [v09.77r] — 2026-04-07 08:03:52 PM EST

> **Prompt:** "the optimistic doesnt seem to be working probably because the html and gas are on different layers, is there a way for there to be optimistic rows visible instantly between the layers before the data polling takes over"

### Added
- Optimistic "last scan" notification on the HTML layer — shows scanned value instantly below the camera viewport with a slide-up animation, changes from "saving..." to "✔ saved" when the GAS bridge confirms, auto-fades after 20 seconds

#### `inventorymanagement.html` — v01.07w

##### Added
- Instant scan result feedback below the camera — appears immediately when a barcode is detected, before the GAS poll picks it up

## [v09.76r] — 2026-04-07 07:45:47 PM EST

> **Prompt:** "ok, good. make it also have the same polling timer (including the visible countdown) that is used in the testauthgas1 live data, as well as showing the optimistic data (like in the testauth), so look at how the testauthgas1 works for its table and incorporate the same methodology"

### Added
- Visible poll countdown timer (`▷ 12s`) matching testauthgas1 pattern — updates every 1s, shows "polling..." when in-flight, time until next poll otherwise
- Optimistic data support — scans can be shown immediately at reduced opacity before server confirms, cleared when poll returns fresh data
- 15-second poll interval matching testauthgas1's `DATA_POLL_INTERVAL`

#### `inventorymanagement.gs` — v01.08g

##### Added
- Visible countdown showing time until next data refresh
- Optimistic scan entries that appear instantly while saving

## [v09.75r] — 2026-04-07 07:37:51 PM EST

> **Prompt:** "the scan history is hiding behind the camera view, have that appear below the coordinates, i know they are on different layers so you have to analyze their relative coordinates"

### Fixed
- GAS scan history panel now positioned below the camera widget using `padding-top: calc(min(100vw, 480px) + 80px)` — dynamically matches the camera viewport height (aspect-ratio 1:1 at max 480px) plus padding/status bar

#### `inventorymanagement.gs` — v01.07g

##### Fixed
- Scan history now appears below the camera area instead of behind it

## [v09.74r] — 2026-04-07 07:21:09 PM EST

> **Prompt:** "clicking on the flashlight button is turning on but its not turning off when i click it again. on the gas layer below the relative scanning scanning html area, make something to test our scanning app so that things are saved in the spreadsheet and we can see it. use the testauthgas1 with the live data as the method, polling and all"

### Fixed
- Fixed torch toggle not turning off — simplified constraint application to avoid race condition in async promise chain

### Added
- Scan results saved to "Scans" sheet in the project spreadsheet (auto-creates sheet with headers on first scan)
- GAS-side scan history UI with 10-second polling (testauthgas1 live data pattern) — shows timestamp, value, and format for each scan
- `getScanHistory(token)` server function for authenticated polling
- Server-side scan cache with self-healing (`_refreshScanCache` / `_getCachedScans`) — avoids repeated spreadsheet reads

#### `inventorymanagement.html` — v01.06w

##### Fixed
- Flashlight toggle now properly turns off when tapped again

#### `inventorymanagement.gs` — v01.06g

##### Added
- Scan history visible below the camera — shows saved scans with live updates

## [v09.73r] — 2026-04-07 06:51:03 PM EST

> **Prompt:** "the html is covering up the gas layer completely, only keep the camera components there, we dont need the full screen background so that i can still see the gas layer"

### Changed
- Stripped scanner HTML layer down to camera-only components: viewport, video, canvas, scan line, start button, status bar, torch, engine badge. Removed full-screen background, header, result card, history, upload, toast — GAS layer is now visible behind the camera widget
- Camera widget uses `pointer-events: none` on the container so clicks pass through to the GAS iframe, with `pointer-events: auto` only on the scanner-container itself

#### `inventorymanagement.html` — v01.05w

##### Changed
- Camera widget no longer covers the full screen — GAS layer is visible behind it

## [v09.72r] — 2026-04-07 06:41:25 PM EST

> **Prompt:** "you literally removed the gas layer. and the html toggle is not hiding all of the html, the gas toggle should still be there"

### Fixed
- Added `qr-scanner-page` to the HTML layer toggle element list — scanner now hides when HTML toggle is clicked, revealing the GAS iframe underneath

#### `inventorymanagement.html` — v01.04w

##### Fixed
- Scanner now responds to the HTML layer toggle — click HTML to hide scanner and see the app layer

## [v09.71r] — 2026-04-07 06:34:20 PM EST

> **Prompt:** "it seems like we have 3 different html layers going on here with the toggles. the layer with our pills, the one that is unaffected by scans the one saying no scans yet (might be on gas layer not sure,fix it so that its interacting with the gas toggle), and the scan layer which shows the start camera button which should not be a toggle, it should be the main page, the gas layer can be functional but then the camera shouldnt occupy the whole screen. it should essentially function how the qr-scanner6 works, but we are dividing the labor between two layers"

### Changed
- Rebuilt scanner as the main page content (always visible, not a toggle overlay) — matches qr-scanner6 layout: header, camera viewport, status bar, result card, image upload, scan history all flowing vertically
- Moved all scanner UI from GAS layer to HTML layer — GAS iframe runs in background for future Sheets integration via listener iframe bridge
- Removed SCAN toggle button — scanner is now the primary page experience
- Cleared GAS PROJECT sections (CSS, HTML, JS) — GAS doGet only renders the admin panel and auth, scanner UI is on the HTML layer

#### `inventorymanagement.html` — v01.03w

##### Changed
- Scanner is now the main page layout with full qr-scanner6 feature set

#### `inventorymanagement.gs` — v01.05g

##### Changed
- Cleared scanner result UI from GAS iframe — scanner display now handled by the embedding page

## [v09.70r] — 2026-04-07 06:14:22 PM EST

> **Prompt:** "this is what i see" (screenshot showing SCAN button not visible)

### Fixed
- Fixed SCAN toggle button not appearing — removed `display:none` that relied on a `_showGasToggle` hook that was never called; button now shows by default like the HTML/GAS buttons

#### `inventorymanagement.html` — v01.02w

##### Fixed
- Scanner toggle button now visible alongside HTML and GAS buttons

## [v09.69r] — 2026-04-07 05:58:59 PM EST

> **Prompt:** "properly put the qr-scanner6 into the inventory gas" → "getting camera error" → plan mode: minimal HTML layer via listener iframe bridge

### Added
- QR/barcode scanner architecture using listener iframe bridge pattern — camera runs on HTML layer (bare minimum: video, canvas, detection loop), scan results sent to GAS via `action=scanListener` postMessage bridge, result UI and history rendered on GAS layer
- `processBarcodeScan()` server-side function in inventory management GAS (placeholder — returns scanned data, future: Sheets lookup)
- `action=scanListener` handler in GAS `doGet()` — lightweight listener page following the established heartbeat/signout pattern
- SCAN toggle button on HTML layer for opening/closing camera overlay
- CSP updates for `media-src` (camera streams) and `script-src` (jsQR CDN)

### Changed
- Moved scanner from GAS iframe (where camera was blocked by sandbox) to split architecture: camera bridge on HTML layer, result display on GAS layer

#### `inventorymanagement.html` — v01.01w

##### Added
- Camera scanner overlay with QR/barcode detection

#### `inventorymanagement.gs` — v01.04g

##### Added
- Scan result display panel with history
- Barcode scan processing endpoint

##### Changed
- Removed non-functional camera code from GAS iframe (sandbox blocks getUserMedia)

## [v09.68r] — 2026-04-07 05:24:49 PM EST

> **Prompt:** "properly put the qr-scanner6 into the inventory gas"

### Added
- Integrated QR & Barcode scanner into the Inventory Management GAS app — camera-based scanning with native BarcodeDetector and jsQR fallback, image upload scanning, torch toggle, scan history, and type classification (URL, email, phone, SMS, WiFi, text, product, barcode)

#### `inventorymanagement.gs` — v01.03g

##### Added
- Built-in QR code and barcode scanner with camera support
- Image upload scanning from gallery
- Flashlight toggle for low-light scanning
- Scan history with up to 10 recent scans
- Auto-detection of scan type (URL, email, phone, WiFi, product code)

## [v09.67r] — 2026-04-07 05:02:49 PM EST

> **Prompt:** "plan it but please take into account the pros and cons so i can decide whether we move forward with it"

### Added
- Dynamic Program Portal — portal app list now reads from the Master ACL spreadsheet metadata rows instead of a hardcoded array. New auth projects automatically appear after their first page load
- Added `#ICON` (row 5) and `#DESC` (row 6) metadata rows to the Master ACL spreadsheet schema — user data rows shifted from row 5+ to row 7+
- Added `PORTAL_ICON` and `PORTAL_DESCRIPTION` config variables to all auth GAS scripts and config.json files
- Added Portal Icon and Portal Description input fields to the GAS Project Creator form

### Changed
- Updated `ensureMetadataRows()` and `registerSelfProject()` in auth GAS template and all 4 auth .gs files to support 5 metadata rows
- Updated `getRegisteredProjects()` and `addPageColumn()` in globalacl.gs to read/write the new metadata rows
- Updated `getUserAppAccess()` in programportal.gs to read user data from row 7+ instead of row 5+
- Updated `setup-gas-project.sh` to accept and substitute `PORTAL_ICON` and `PORTAL_DESCRIPTION`

#### `gas-project-creator.html` — v01.69w

##### Added
- Portal Icon and Portal Description fields in the project creator form

#### `programportal.gs` — v01.62g

##### Changed
- Application list now loads dynamically — new projects appear automatically

#### `globalacl.gs` — v01.55g

##### Changed
- Minor internal improvements

#### `testauthgas1.gs` — v02.60g

##### Changed
- Minor internal improvements

#### `inventorymanagement.gs` — v01.02g

##### Changed
- Minor internal improvements

## [v09.66r] — 2026-04-07 03:20:19 PM EST

> **Prompt:** "im signing into the global acl manager but its not auto propagating figure out why and make it happen moving forward"

### Fixed
- Fixed cross-project admin secret not distributing to newly registered projects — `ensureCrossProjectSecret()` in GlobalACL now detects when the registered auth-project count changes (via cache comparison) and re-distributes the existing secret to all projects, so new projects automatically receive it on the next GlobalACL page load

#### `globalacl.gs` — v01.54g

##### Fixed
- Admin session management now works for newly added projects without manual secret setup

## [v09.65r] — 2026-04-07 03:07:14 PM EST

> **Prompt:** "i did option 1, but it didnt work. check the setup-gas-project.sh , i noticed that you ran into some errors, so fix it there and in our script"

### Fixed
- Fixed HMAC_SECRET chicken-and-egg bug: `ensureScriptProperties_()` was only called from `pullAndDeployFromGitHub()` (deploy-time), but HMAC is required on first page load for session creation — added call to `doGet()` in the auth GAS template so HMAC_SECRET auto-generates on first visit
- Fixed `setup-gas-project.sh` Phase 9 workflow deploy step insertion: replaced fragile `sed -i` with multiline `\n` escapes with a temp file + `sed r` approach that reliably inserts the deploy block

### Changed
- Propagated `ensureScriptProperties_()` doGet fix to all 4 auth GAS scripts (inventorymanagement, testauthgas1, globalacl, programportal) via template propagation

#### `inventorymanagement.gs` — v01.01g

##### Fixed
- Sign-in now works on first deployment — setup properties auto-generate on first visit

#### `testauthgas1.gs` — v02.59g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.53g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.61g

##### Changed
- Minor internal improvements

## [v09.64r] — 2026-04-07 02:51:01 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.

bash scripts/setup-gas-project.sh <<'CONFIG'
{
  "PROJECT_ENVIRONMENT_NAME": "inventorymanagement",
  "TITLE": "Inventory Management",
  "DEPLOYMENT_ID": "AKfycby0Eh2XhbibpLptNk94g8GAoIwgfzQ7ozRz6YBKfyXyXBYyANZJjCuYdFzi4_WIKYbKBw",
  "SPREADSHEET_ID": "1_dtm8U7uIug4aUcD4KD9ylwzZvm05xWBtXMrikWi8Pg",
  "SHEET_NAME": "Live_Sheet",
  "DEVELOPER_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "YOUR_ORG_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "SPLASH_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "INCLUDE_AUTH": true,
  "CLIENT_ID": "216764502068-7j0j6svmparsrfgdf784dneltlirpac2.apps.googleusercontent.com",
  "AUTH_PRESET": "hipaa",
  "MASTER_ACL_SPREADSHEET_ID": "1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI",
  "ACL_SHEET_NAME": "Access",
  "ACL_PAGE_NAME": "inventorymanagement"
}
CONFIG"

### Added
- Set up new GAS project: Inventory Management (inventorymanagement) with auth, HIPAA preset, and full ACL configuration
- Created inventorymanagement.html embedding page, inventorymanagement.gs GAS script, and inventorymanagement.config.json
- Created version files (html.version.txt, gs.version.txt), changelogs, and per-environment diagram
- Added Deploy Inventorymanagement step to auto-merge workflow for GAS webhook auto-deploy
- Registered Inventorymanagement in GAS Projects table, REPO-ARCHITECTURE.md, and README.md tree

## [v09.63r] — 2026-04-07 11:22:39 AM EST

> **Prompt:** "good. now, if we are not including google authentication (toggle at the top is off), then the fields related to authentication should not be there, i.e. the master acl spreadsheet id, etc. verify that we wouldnt need those fields in this scenario"

### Changed
- Auth-only fields (Master ACL section, ACL Sheet Name, ACL Column Name) now hidden when "Include Google Authentication" toggle is off — verified against the noauth GAS template which has none of these variables

#### `gas-project-creator.html` — v01.68w

##### Changed
- Master ACL, ACL Sheet Name, and ACL Column Name hidden when auth is disabled

## [v09.62r] — 2026-04-07 11:16:28 AM EST

> **Prompt:** "no, the master acl spreadsheet id when enabled is still not letting me type into it"

### Fixed
- Master ACL Spreadsheet ID field now accepts user input — `toggleMasterAcl()` now tracks state changes and only overwrites the value on actual toggle transitions (checked↔unchecked), not on repeated calls with the same state
- Root cause: `updateFieldStates()` called `toggleMasterAcl()` on every input event, and the unchecked branch was overwriting `aclIdField.value` with `_aclValueBeforeToggle` (empty) on every keystroke

#### `gas-project-creator.html` — v01.67w

##### Fixed
- Master ACL Spreadsheet ID field now properly editable — typing no longer gets overwritten

## [v09.61r] — 2026-04-07 11:13:35 AM EST

> **Prompt:** "ok the toggle is properly showing the acl sheet name and acl column name fields as enabled, but when the toggle is off, its not letting me type into the master acl spreadsheet id field"

### Fixed
- Master ACL Spreadsheet ID field now editable when toggle is unchecked — added `setFieldDisabled('cfg-master-acl-id', false)` before `toggleMasterAcl()` to properly restore the field from its disabled state (clears the `disabled` attribute and restores saved value)

#### `gas-project-creator.html` — v01.66w

##### Fixed
- Master ACL Spreadsheet ID field now accepts input when toggle is unchecked

## [v09.60r] — 2026-04-07 11:08:00 AM EST

> **Prompt:** "the acl sheet name and acl column name fields are not properly being enabled after the master acl spreadsheet id is set"

### Fixed
- ACL Sheet Name and ACL Column Name now properly enable when Master ACL Spreadsheet ID is filled — added `oninput="updateFieldStates()"` to the Master ACL ID field and added ACL field re-evaluation in `toggleMasterAcl()`
- Root cause: the Master ACL ID input had no `oninput` handler to trigger field state updates, and the toggle didn't re-evaluate ACL field states after auto-filling the ID

#### `gas-project-creator.html` — v01.65w

##### Fixed
- ACL fields now enable when Master ACL Spreadsheet ID is set (manually or via toggle)

## [v09.59r] — 2026-04-07 11:03:22 AM EST

> **Prompt:** "actually something else is also going on also, the buttons think that the environment name isnt there, so fix these bugs"

### Fixed
- Copy buttons (Code.gs, HTML, Config) now correctly detect Environment Name — `updateDeployGate()` is called at the end of `updateFieldStates()` so it reads field values after all save/restore operations complete
- Root cause: `updateDeployGate()` was called from `oninput` before `updateFieldStates()` had restored the saved env name value

#### `gas-project-creator.html` — v01.64w

##### Fixed
- Copy buttons no longer incorrectly show "needs: Environment Name" when Environment Name is filled

## [v09.58r] — 2026-04-07 11:01:26 AM EST

> **Prompt:** "the acl sheet name and the acl column name are showing to enter deployment ID first but it shouldnt be tied to that, it should be if the master acl spreadsheet ID is set up"

### Fixed
- ACL Sheet Name and ACL Column Name now gated solely behind Master ACL Spreadsheet ID — no longer inherit the project field cascade reason ("Enter Deployment ID first"), always show "Enter Master ACL Spreadsheet ID first" when that field is empty

#### `gas-project-creator.html` — v01.63w

##### Fixed
- ACL fields no longer show misleading "Enter Deployment ID first" message

## [v09.57r] — 2026-04-07 10:56:55 AM EST

> **Prompt:** "the acl column name should not mention defaults to if disabled, should also say enter spreadsheet id first instead. also if the master ACL spreadsheet ID is not filled either manually or through the toggle, the ACL sheet name and ACL column name should be disabled"

### Fixed
- ACL Sheet Name and ACL Column Name now gated behind Master ACL Spreadsheet ID being filled (either manually or via toggle) — show "Enter Master ACL Spreadsheet ID first" when empty
- ACL Column Name no longer shows "Defaults to:" placeholder when disabled — only shows the default hint when the field is active and editable

#### `gas-project-creator.html` — v01.62w

##### Fixed
- ACL fields now require Master ACL Spreadsheet ID before they can be edited
- Disabled ACL Column Name no longer misleadingly shows default value hint

## [v09.56r] — 2026-04-07 10:51:44 AM EST

> **Prompt:** "the allowed domains should also default to all if blank. the acl sheet name and acl column name fields should be disabled if there is no spreadsheet id, same for the master acl spreadsheet id, it shouldnt refer to the entering environment name first"

### Fixed
- ACL Sheet Name, ACL Column Name, and Master ACL Spreadsheet ID now show "Enter Spreadsheet ID first" when Spreadsheet ID is empty (was incorrectly showing "Enter Environment Name first")
- Moved ACL fields out of the generic project fields group into a Spreadsheet ID-dependent group
- Blank Allowed Domains already treated as "All" (no domain restriction) — both blank and "All" skip domain restriction in copyGsCode and copyConfig

#### `gas-project-creator.html` — v01.61w

##### Fixed
- ACL and Master ACL fields now correctly reference Spreadsheet ID as their dependency

## [v09.55r] — 2026-04-07 10:45:04 AM EST

> **Prompt:** "in this scenario, the clear X button should not be there since the field pulling from somewhere else, this should apply everywhere in the gas-project-creator for similar situations"

### Fixed
- Clear (X) button now hidden on readOnly fields (auto-filled from another field) — applied globally via `updateEmptyClasses()` so any current or future readOnly auto-fill field automatically gets this behavior

#### `gas-project-creator.html` — v01.60w

##### Fixed
- Clear button no longer appears on fields that are auto-filled from another source

## [v09.54r] — 2026-04-07 10:40:56 AM EST

> **Prompt:** "that disabled field should mention what would enable the field like the other disabled fields. but the field should not be disabled if this spreadsheet is not the master acl, i should be able to put what the master acl spreadsheet id is"

### Fixed
- Master ACL Spreadsheet ID field now shows "Uncheck master ACL toggle to edit" hint when toggle is checked (consistent with other disabled fields)
- Field is now properly editable when toggle is unchecked — fixed bug where `disabled` attribute from `setFieldDisabled` wasn't cleared by `toggleMasterAcl()`

#### `gas-project-creator.html` — v01.59w

##### Fixed
- Master ACL Spreadsheet ID field now editable when toggle is unchecked
- Disabled state shows hint about how to enable it

## [v09.53r] — 2026-04-07 10:35:23 AM EST

> **Prompt:** "actually instead of hiding the master acl spreadsheet id field, have it disabled if the checkmark is pressed."

### Changed
- Master ACL Spreadsheet ID field now stays visible but becomes disabled/readOnly when toggle is checked (auto-fills with Spreadsheet ID), instead of hiding
- Restores the user's previous value when unchecked
- `syncMasterAclId()` keeps the ACL ID field synced with Spreadsheet ID while toggle is checked

#### `gas-project-creator.html` — v01.58w

##### Changed
- Master ACL Spreadsheet ID field disables with auto-fill instead of hiding when toggle is checked

## [v09.52r] — 2026-04-07 10:28:36 AM EST

> **Prompt:** "lets review the master ACL toggle. if unchecked should have a field to put the master ACL spreadsheet ID, if unchecked that field should be removed. the acl sheet name and acl column name should always be visible. the toggle should be moved to underneath the spreadsheet id field"

### Changed
- Redesigned master ACL section: toggle moved under Spreadsheet ID, external ACL ID field shows when unchecked (for referencing another spreadsheet as ACL), hides when checked (uses own Spreadsheet ID)
- ACL Sheet Name and ACL Column Name are now always visible — no longer hidden based on toggle state
- `copyGsCode()` and `copyConfig()` now support both modes: checked = own Spreadsheet ID as ACL, unchecked = external ACL spreadsheet ID

#### `gas-project-creator.html` — v01.57w

##### Changed
- Master ACL toggle moved under Spreadsheet ID with external ACL ID field for non-self ACL projects
- ACL Sheet Name and Column Name always visible

## [v09.51r] — 2026-04-07 10:12:59 AM EST

> **Prompt:** "the master ACL toggle should be right above the spreadsheet ID, having it untoggled should not be hiding the fields, dont we need to use them anyway? or if unchecked do we not need the ACL sheet name and column name?"

### Changed
- Moved master ACL toggle above Spreadsheet ID field for better visual flow
- ACL detail fields (Sheet Name, Column Name) still show/hide based on toggle — when unchecked, no ACL is configured and those fields are not needed (the GAS code checks `hasAcl` and skips ACL logic when the ID is a placeholder)

#### `gas-project-creator.html` — v01.56w

##### Changed
- Master ACL toggle moved above Spreadsheet ID

## [v09.50r] — 2026-04-07 10:01:45 AM EST

> **Prompt:** "the Allowed Domains should be prefilled to say "All" , and that should be equivalent to any google account can sign in."

### Changed
- Allowed Domains field in gas-project-creator now prefills with "All" — treated as no domain restriction (any Google account can sign in)
- `copyGsCode()` and `copyConfig()` skip domain restriction when value is "All"

#### `gas-project-creator.html` — v01.55w

##### Changed
- Allowed Domains now prefills with "All" meaning any Google account can sign in

## [v09.49r] — 2026-04-07 09:55:58 AM EST

> **Prompt:** "the master acl spreadsheet id field is still there, i want it removed, i just want it consolidated with the spreadsheet ID, so the toggle should be moved next to the spreadsheet ID"

### Changed
- Removed the separate Master ACL Spreadsheet ID field — when the "master ACL" toggle is checked, the project's Spreadsheet ID is used directly as the master ACL
- Moved the master ACL toggle to sit directly under Spreadsheet ID field
- ACL detail fields (Sheet Name, Column Name) now show/hide based on toggle state instead of depending on a separate ID field
- Simplified `toggleMasterAcl()`, `toggleAclDetails()`, `copyGsCode()`, and `copyConfig()` to use Spreadsheet ID directly

#### `gas-project-creator.html` — v01.54w

##### Changed
- Master ACL toggle moved next to Spreadsheet ID — no separate ACL spreadsheet ID field
- ACL details appear inline when toggle is checked

## [v09.48r] — 2026-04-07 09:47:23 AM EST

> **Prompt:** "the authentication settings should be under the oauth client ID that we just moved up"

### Changed
- Merged Auth Preset and Allowed Domains into the Authentication Settings box under OAuth Client ID — removed the separate auth-fields box that was further down the form
- All auth-related fields (Client ID, Auth Preset, Allowed Domains) are now consolidated in one section at the top

#### `gas-project-creator.html` — v01.53w

##### Changed
- Auth Preset and Allowed Domains moved under OAuth Client ID in the Authentication Settings section

## [v09.47r] — 2026-04-07 09:43:11 AM EST

> **Prompt:** "instead of having a separate master ACL spreadsheet ID field, the toggle should be moved to next to the spreadsheet ID to modify it if toggled. the ACL sheet name and column name can be moved under that also. the oauth client id can be moved to before the deployment id, and i think it should be required before enabling the deployment id field, the authentication settings fields should be labeled as such"

### Changed
- Restructured gas-project-creator form layout: OAuth Client ID moved before Deployment ID in its own "Authentication Settings" box, gates Deployment ID when auth is enabled
- Master ACL section (toggle, ID, sheet name, column name) moved from auth settings box to under Spreadsheet ID — now depends on Spreadsheet ID being filled, not Client ID
- Auth settings box now only contains Auth Preset and Allowed Domains
- New dependency cascade: Client ID → Deployment ID → Env Name → project fields → Spreadsheet ID → Master ACL

#### `gas-project-creator.html` — v01.52w

##### Changed
- OAuth Client ID now appears before Deployment ID and is required to enable it (when auth is checked)
- Master ACL section moved under Spreadsheet ID for logical grouping
- Auth settings box simplified to just Auth Preset and Allowed Domains

## [v09.46r] — 2026-04-07 08:47:47 AM EST

> **Prompt:** "if i add deployment id, add project environment name, then delete deployment id and re ad deployment ID, the fields are disabled even though we still had a project environment name there before, fix this same bug everywhere in the gas-project-creator"

### Fixed
- Fixed field dependency cascade bug in gas-project-creator: when a parent field was cleared and re-filled, child fields stayed disabled because `updateFieldStates()` read dependent values before `setFieldDisabled()` had a chance to restore them. Now re-reads `hasEnvName`, `hasSpreadsheet`, and `hasClientId` after their fields have been restored, so downstream fields correctly re-enable

#### `gas-project-creator.html` — v01.51w

##### Fixed
- Fields no longer stay disabled when a parent field is cleared and re-filled

## [v09.45r] — 2026-04-07 08:41:28 AM EST

> **Prompt:** "make the splash logo URL prefill to https://www.shadowaisolutions.com/SAIS_Logo.png , the splash logo URL defaulting to developer logo, what happens if the developer logo is blank, i think these should not depend on eachother, they should be independent in case i want some to be blank on purpose."

### Changed
- Made all 3 logo variables fully independent — `SPLASH_LOGO_URL` is now a standalone string value in all templates and pages, no longer a reference to `DEVELOPER_LOGO_URL`
- Splash Logo URL field in gas-project-creator now prefills with the default SAIS logo URL
- Updated field hints to clarify all 3 logos are independent of each other
- Updated `copyHtmlCode()` regex to match the new single-quoted string format for `SPLASH_LOGO_URL`
- Updated `setup-gas-project.sh` to handle `SPLASH_LOGO_URL` with proper default and consistent substitution pattern

#### `gas-project-creator.html` — v01.50w

##### Changed
- Splash Logo URL now prefills with the default logo instead of being blank
- All three logo fields are now described as independent of each other

#### `testauthgas1.html` — v03.99w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.88w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.95w

##### Changed
- Minor internal improvements

#### `text-compare.html` — v01.10w

##### Changed
- Minor internal improvements

## [v09.44r] — 2026-04-07 08:34:10 AM EST

> **Prompt:** "make it so that the deployment ID being filled is a requirement for the Project Environment Name to be active"

### Changed
- Project Environment Name field in gas-project-creator is now disabled until Deployment ID is filled
- All downstream project config fields cascade: Deployment ID → Environment Name → project fields

#### `gas-project-creator.html` — v01.49w

##### Changed
- Environment Name field now requires Deployment ID to be filled before it can be edited
- Deployment ID field changes now trigger field state updates for the full cascade

## [v09.43r] — 2026-04-07 08:26:38 AM EST

> **Prompt:** "i guess we should have a field for each logo, developer, org, and splash"

### Changed
- Renamed `LOGO_URL` → `SPLASH_LOGO_URL` in all HTML templates and 5 live pages — the runtime pointer used by splash screens now has a descriptive name
- Restructured gas-project-creator logo fields: replaced single "Splash Logo URL" field with 3 separate fields (Developer Logo, Org Logo, Splash Logo)
- Updated `copyHtmlCode()` to substitute all 3 logo variables in HTML templates
- Removed dead `SPLASH_LOGO_URL` substitution from `copyGsCode()` (logo variables don't exist in GAS templates)
- Updated `setup-gas-project.sh` to parse and apply `DEVELOPER_LOGO_URL`, `YOUR_ORG_LOGO_URL`, and `SPLASH_LOGO_URL` separately
- Removed stale `SPLASH_LOGO_URL` references from workflow comments (not a GAS variable)
- Updated CLAUDE.md, gas-scripts.md, and IMPROVEMENTS.md documentation references

#### `gas-project-creator.html` — v01.48w

##### Changed
- Logo configuration now has 3 separate fields: Developer Logo, Org Logo, and Splash Logo
- Splash Logo defaults to Developer Logo when left blank

#### `testauthgas1.html` — v03.98w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.87w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.94w

##### Changed
- Minor internal improvements

#### `text-compare.html` — v01.09w

##### Changed
- Minor internal improvements

## [v09.42r] — 2026-04-07 07:57:43 AM EST

> **Prompt:** "in the gas-project-creator , are we actually using the Sound File ID for anything anymore? if not remove it"

### Removed
- Removed `SOUND_FILE_ID` variable from all GAS templates, live GAS scripts, config.json files, gas-project-creator form, setup script, workflow comments, and documentation — the variable was declared but never referenced after the `testSoundFetch` test function was archived

#### `gas-project-creator.html` — v01.47w

##### Removed
- Removed Sound File ID form field (was unused by any live feature)

#### `testauthgas1.gs` — v02.58g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.52g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.60g

##### Changed
- Minor internal improvements
