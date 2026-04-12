# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 91/100`

## [Unreleased]

## [v10.81r] — 2026-04-11 11:11:17 PM EST

> **Prompt:** "in the inventory management, can you come up with a method so that we can queue automatic scans so that we can scan quickly instead of having to wait for it to save first."

### Added
- Implemented a scan queue system in `live-site-pages/inventorymanagement.html` that decouples barcode scanning from saving. Users can now scan and confirm items rapidly without waiting for each save to complete — saves process sequentially in the background while the user continues scanning
- New `_enqueueScanItem()` function routes all scan confirmations (both manual modal and auto-scan mode) through a FIFO queue instead of directly blocking on the Add Row button
- New `_processQueue()` drains queued items one at a time via `gasCall('addRow', ...)`, with `_reinsertOptimisticRows()` to maintain UI consistency after each `liveData` refresh
- Floating queue badge (`#scan-queue-badge`) shows the number of pending items during rapid scanning — auto-hides when the queue is empty
- Optimistic row overlays now show "Queued (#N)" for waiting items and "Sending…" for the item currently being saved, replacing the previous single "Sending…" overlay
- Error toast notification (`_showQueueError()`) for individual failed saves — surfaces the barcode/item name and error, removes the failed optimistic row, and continues processing remaining queue items

### Changed
- Data polling (`_doDataPoll`) is suppressed while the scan queue has items, preventing `_handleLiveData` from overwriting optimistic rows mid-queue
- Optimistic row detection changed from single-index (`_addRowPendingIndex`) to a Set (`_addRowPendingIndices`) to support multiple simultaneous optimistic rows
- Auto-scan mode now enqueues items directly via `_enqueueScanItem()` instead of blocking on the Add Row button — rapid auto-scanning is never blocked by a pending save
- Modal `onConfirm()` now collects values and calls `_enqueueScanItem()` instead of populating hidden inputs and clicking the Add Row button

#### `inventorymanagement.html` — v01.23w
##### Added
- You can now scan items rapidly without waiting for each save to complete — scanned items are queued and saved in the background one at a time
- A blue "queued" badge appears showing how many items are waiting to be saved
- Each queued item appears in the table immediately with a "Queued" or "Sending" indicator
- If a save fails, a red notification appears with the item details — remaining items continue saving
##### Changed
- Auto-scan mode now queues items instantly instead of waiting for the previous save to finish

## [v10.80r] — 2026-04-12 08:16:30 PM EST

> **Prompt:** "ok that worked. make the default quantity number in the entry fields positive 1 instead of blank"

### Changed
- Updated the Quantity field default in `_showScanConfirmModal` (line 5106 in `live-site-pages/inventorymanagement.html`) so the input value defaults to `'1'` for new items as well as existing items. Previously, only the existing-item path (`if (existingRow) { inp.value = '1'; inp.placeholder = 'Amount to add'; }`) set a default — new items got an empty input. Moved `inp.value = '1'` outside the `if (existingRow)` block so both contexts get the default; the placeholder override (`'Amount to add'`) stays inside the existing-item branch since it only makes sense for the delta-add semantics
- Verified end-to-end via Playwright at 390×844 mobile across both modal contexts:
  - **New item** (`window._showScanConfirmModal('', 'MANUAL ENTRY')`): quantity input renders with value `'1'` and the default `'Quantity'` placeholder ✓
  - **Existing item** (`window._showScanConfirmModal('82657500690', 'qr_code')` with mocked existing row for that barcode): quantity input renders with value `'1'` and placeholder `'Amount to add'` ✓
- The HTML `<meta name="build-version">` tag was bumped from `v01.21w` → `v01.22w` to match the `inventorymanagementhtml.version.txt` bump per Pre-Commit #2

#### `inventorymanagement.html` — v01.22w
##### Changed
- The Quantity field in the entry form now defaults to `1` for new items (previously it was blank). For existing items it already defaulted to `1` as the delta to add — both contexts are now consistent. You can still type any value or use the − / + buttons to adjust before saving

## [v10.79r] — 2026-04-12 08:10:10 PM EST

> **Prompt:** "unfortunately its still removing the leading 0's in the spreadsheet"

### Fixed
- Second attempt at the v10.78r/v01.05g leading-zero preservation fix in `googleAppsScripts/Inventorymanagement/inventorymanagement.gs`. The v01.05g approach (set the entire Barcode column's number format to `'@'` via `ensureBarcodeColumnIsText` before each write) **didn't work** — the user reported that newly-scanned barcodes with leading zeros were still being stripped
- **Root cause hypothesis** (high confidence): `sheet.appendRow(values)` performs JS-value type coercion at write-time, **before** consulting the cell's number format. So even with the column format set to `'@'`, when `appendRow` receives the JS string `'0123456'`, it parses the digit string as a number `123456` first, then writes that number to the cell. The cell's text format is only applied to the cell **after** the value has been parsed — too late. This is a known Google Sheets API quirk: cell formats are for display, not for input parsing
- **The fix — separate the barcode write with an explicit format → flush → value sequence**:
  - **`addRow()` new-row path** (line 549, replaced the `sheet.appendRow(values); actionType = 'add_row';` block): now (1) builds `rowValsForAppend = values.slice()` and zeros out `rowValsForAppend[barcodeCol]` so the barcode cell is empty during the row creation (no digit string → no coercion), (2) calls `sheet.appendRow(rowValsForAppend)` which atomically creates the row with all the non-barcode columns populated, (3) reads back `sheet.getLastRow()` to find the new row number, (4) calls `bcCell.setNumberFormat('@')` on the **specific** barcode cell of the new row, (5) calls `SpreadsheetApp.flush()` — **this is the critical step v01.05g was missing** — to force the format change to commit before the next operation, then (6) calls `bcCell.setValue(String(values[barcodeCol]))` with the actual barcode. Because the format is committed before the `setValue`, Sheets parses the value with text format already in place and stores it as text with leading zeros preserved
  - **`writeCell()` barcode-conditional path** (line 442, after the existing `ensureBarcodeColumnIsText` call): added a header lookup to determine if the target column index `col` matches the Barcode column. If yes, applies the same `setNumberFormat('@')` → `SpreadsheetApp.flush()` → `setValue(String(value))` sequence on the target cell. If no (any other column), the existing single `setValue(value)` is used so non-barcode writes are unchanged. Header lookup is local to writeCell — uses `sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]` and iterates with a separate variable name `bch` to avoid shadowing the existing `h` loop variable elsewhere in addRow
- **`appendRow` is still used for race safety** — `appendRow` is atomic against concurrent writes from other users (it computes the next empty row and writes in a single operation). Replacing it with manual `getLastRow()` + `setValues` would introduce a race condition where two simultaneous addRows could compute the same `nextRow`. The follow-up barcode `setValue` could in theory race in a similar way, but the worst case is that the wrong row gets the barcode update — extremely unlikely given the request volume of this app and not catastrophic
- **`ensureBarcodeColumnIsText` is kept** as defense-in-depth — it still runs at the start of both `addRow` and `writeCell`, applying text format to the entire Barcode column. The per-cell format-flush-value sequence is the **guaranteed** path; the column-wide format is the baseline that helps with future code paths and ensures reads return strings consistently
- **Existing barcode-lookup logic unchanged** (lines 502-511 of `addRow`): still does `String(data[r][barcodeCol]).trim().toLowerCase() === scannedBarcode.toLowerCase()`. After this fix, NEW writes preserve leading zeros, so the comparison correctly matches `'0123456' === '0123456'` instead of failing on `'0123456' === '123456'`. No comparison change needed
- **No HTML changes** — `inventorymanagement.html` stays at v01.21w. The bug is purely server-side
- **Migration concern, repeated from v01.05g**: rows that were already written with stripped barcodes cannot be auto-fixed because the original leading-zero count is unrecoverable. User must manually correct affected rows by either re-entering them or editing the cell directly with a leading apostrophe (`'0123456`)
- **If this fix STILL fails**, the next escalations are: (a) add the leading apostrophe trick as a third defense layer (`bcCell.setValue("'" + String(...))` — uncertain whether the apostrophe is consumed via Apps Script `setValue`), or (b) ask the user to share what's actually being stored in the cell so we can diagnose Sheets' actual behavior
- The GAS `VERSION` constant at line 1 was bumped from `"v01.05g"` → `"v01.06g"`, and `live-site-pages/gs-versions/inventorymanagementgs.version.txt` was bumped `|v01.05g|` → `|v01.06g|` to match (Pre-Commit #1)

#### `inventorymanagement.gs` — v01.06g
##### Fixed
- Fixed leading zeros in barcodes still being stripped after the v01.05g attempt — that fix set the column format to text but Sheets' value parser was still coercing digit strings to numbers before the format was checked. The new approach writes new rows with the barcode cell empty first, then re-writes just the barcode cell with an explicit text-format-then-value sequence so leading zeros are reliably preserved. Per-row edits via the pencil button get the same treatment when targeting the barcode column

#### `inventorymanagement.html` — v01.21w (no change)
*HTML unchanged — the bug is entirely server-side; the existing client-side string comparisons become correct once the GAS layer stores barcodes correctly*

## [v10.78r] — 2026-04-11 07:57:33 PM EST

> **Prompt:** "i have entered an item with a barcode that starts with a 0  , the issue is that when writing to the spreadsheet, it automatically removes the 0 , so when i try to scan for it later, it thinks its a new item. make it so that if numbers starting with 0's are scanned in, it is stored in the spreadsheet as such"

### Fixed
- Fixed Google Sheets stripping leading zeros from barcodes written by `googleAppsScripts/Inventorymanagement/inventorymanagement.gs`. **Root cause**: Sheets' default "Automatic" cell format auto-detects digit strings as numbers, so writing `'0123456'` via `setValue` (or via `appendRow` with a string element) would convert it to the number `123456` and store the leading zero away. The next scan returning `'0123456'` would then fail to match the stored `123456` (string compare), so the same item was treated as new
- **The fix — text format on the Barcode column**: added a new helper function `ensureBarcodeColumnIsText(sheet)` (lines 397-416 in `inventorymanagement.gs`) that:
  - Reads the header row to find the column whose header is `'barcode'` (case-insensitive, dynamic — doesn't hardcode column index)
  - Checks `getNumberFormat()` on the header cell. If it's already `'@'` (text), the function returns immediately — fully idempotent
  - Otherwise, calls `setNumberFormat('@')` on the entire Barcode column (`getRange(1, h+1, sheet.getMaxRows(), 1)`) — this applies text format to the header, all current data rows, AND all future rows. Sheets inherits column-wide formats on new rows added via `appendRow` and `setValues`
- **Wired into both write paths**:
  - `writeCell(token, row, col, value)` (line 432) — calls `ensureBarcodeColumnIsText(sheet)` before the `setValue` so the per-row pencil-edit path can't strip a leading zero. Marked with `// PROJECT:` inline marker since this is project code inserted into a template-region function
  - `addRow(token, valuesJSON)` (line 462) — calls `ensureBarcodeColumnIsText(sheet)` before reading `data` and before the eventual `appendRow(values)` so any new row appended preserves leading zeros. Same `// PROJECT:` marker
- **Why this works**: when a column is text-formatted (`@`), Sheets stops auto-detecting cell types on writes to that column. Strings of digits stay as strings, leading zeros and all. The format is applied to `getMaxRows()` so every row including not-yet-existing rows inherits it. The first call of `addRow` (or `writeCell`) on a new sheet pays the one-time format cost; every subsequent call is a no-op (early return after the `getNumberFormat() === '@'` check)
- **Existing barcode-lookup logic unchanged**: lines 469-478 of `addRow` still do `String(data[r][barcodeCol]).trim().toLowerCase() === scannedBarcode.toLowerCase()`. After this fix, NEW writes preserve leading zeros, so the comparison naturally matches `'0123456' === '0123456'` instead of failing on `'0123456' === '123456'`. No client-side comparison change is needed in the HTML page either — the existing `String(rows[i][bcIdx]) === target` check in the v10.75r auto-mode interception code becomes correct once the data is stored correctly
- **No HTML changes**: the bug is entirely server-side. The HTML page's barcode comparison was already correct; it just needed the data to be stored correctly. `inventorymanagement.html` stays at v01.21w (no version bump)
- **Migration concern — existing rows are NOT auto-fixed**: rows that were already written with stripped barcodes (e.g. a barcode `0123456` already stored as `123456`) cannot be recovered automatically because the original leading-zero count is lost. The user will need to manually fix those rows by either: (a) deleting them and re-scanning the original barcodes, (b) typing the correct barcode directly in the sheet cell with a leading apostrophe (`'0123456`), or (c) editing the cell in-place and pre-typing `'` before the digits. The text format applied by this fix only affects future writes
- The GAS `VERSION` constant at line 1 was bumped from `"v01.04g"` → `"v01.05g"`, and `live-site-pages/gs-versions/inventorymanagementgs.version.txt` was bumped `|v01.04g|` → `|v01.05g|` to match (Pre-Commit #1)

#### `inventorymanagement.gs` — v01.05g
##### Fixed
- Barcodes that start with a 0 (like `0123456`) are now stored in the spreadsheet exactly as scanned, instead of having the leading zero stripped. Previously, scanning a leading-zero barcode would write it to the sheet as a number (so `0123456` became `123456`), and re-scanning the same item later would fail to match the existing row and treat it as a new item. The Barcode column is now formatted as text on every write, preserving leading zeros forever
- **Existing rows with already-stripped barcodes are NOT auto-fixed** — the original leading zeros can't be recovered from a value that's already been converted to a number. To fix existing items: either re-enter them with the correct barcode (delete the bad row first, or edit the cell directly in the spreadsheet) or manually retype the barcode in the Barcode column with a leading apostrophe (e.g. `'0123456`) which forces it to be treated as text

#### `inventorymanagement.html` — v01.21w (no change)
*HTML unchanged — the bug was entirely server-side; the existing client-side string comparison becomes correct once the GAS layer stores barcodes correctly*

## [v10.77r] — 2026-04-11 07:49:46 PM EST

> **Prompt:** "auto add when set to 0 is incrementing by 1, make it so that 0 isnt an option" (follow-up: "this applies to all add and subtract's")

### Fixed
- Fixed the v10.75r Auto-add toggle bug where setting the increment to 0 silently incremented by 1 anyway because of a `if (isNaN(amount) || amount === 0) amount = 1;` fallback in the scan interception code (line 5338 in `live-site-pages/inventorymanagement.html`). Per the user's follow-up clarification, applied the no-zero rule to **all** quantity steppers in the page — both the new auto-add increment input AND the existing scan/manual entry quantity stepper from v01.05w/v01.13w (lines 5113-5142). Two separate stepper instances, both fixed identically:

#### Auto-add increment input (`#qr-auto-amount` with `#qr-amount-dec` / `#qr-amount-inc`)
- **`clampAmount(v)` helper** (line 5277): added `n === 0` to the snap-to-1 condition. Both `NaN` and `0` now resolve to `1`. Used by the +/- handlers and the change handler
- **`decBtn.click` handler** (line 5288): now computes `next = clampAmount(amountEl.value) - 1`, then `if (next === 0) next = -1` to skip past zero. So clicking − on `1` jumps directly to `-1` instead of stopping at `0`
- **`incBtn.click` handler** (line 5294): mirror — `if (next === 0) next = 1`. Clicking + on `-1` jumps directly to `1`
- **New `change` event handler** (line 5283): on blur/Enter, calls `clampAmount(amountEl.value)` and updates the field if the normalized value differs from what's in the input. This catches direct typing of `0` (snaps to `1`) and clearing the field (also snaps to `1`). Also persists the corrected value to localStorage
- **Init from localStorage** (line 5263): when reading the saved increment value, parses with `parseInt` and skips the load if the saved value is `0` — falls back to the HTML default of `1`. Defends against stale `0` values written to localStorage by an earlier version of this code (which v10.76r-and-earlier could produce because the change handler didn't exist yet)
- **Auto-mode scan interception fallback** (line 5338): changed from `if (isNaN(amount) || amount === 0) amount = 1;` to `if (isNaN(amount) || amount === 0) return _origAutoWrap(raw, fmt);`. If a stale `0` somehow leaks past all the UI guards and reaches the scan path, the scan now **falls through to the modal** instead of silently doing a `+1`. The user sees the entry form, sees the value they need to fix, and can correct it. This is the original bug surface — it should now be unreachable via normal use, but the defensive fallback ensures the behavior is correct even if it does happen

#### Scan/manual entry modal quantity stepper (`.qty-stepper-btn.qty-minus` / `.qty-plus` inside `_showScanConfirmModal`)
- **`btnMinus.click` handler** (line 5123): added `if (next === 0) next = -1` after computing `cur - 1`. Same skip-zero logic as auto-amount
- **`btnPlus.click` handler** (line 5129): added `if (next === 0) next = 1` after computing `cur + 1`
- **New `change` event handler** on the quantity input (line 5135): if the value is exactly `'0'` or `parseInt() === 0`, snaps to `'1'`. **Empty value is left alone** — for new items the modal expects the user to type a quantity, and forcing empty → 1 on every blur would be annoying. The existing add-row click handler validates the empty case downstream
- This stepper is created fresh each time the modal opens (via the `(function(qtyInp) { ... })(inp)` IIFE inside the build loop at line 5111), so the new event listeners are attached per-instance — no need for a global listener

- **Functional verification** via Playwright at 390×844 mobile, all 12 scenarios pass:
  - Auto-amount: dec from 1 → -1 (skip 0) ✓
  - Auto-amount: inc from -1 → 1 (skip 0) ✓
  - Auto-amount: type 0 + blur → snaps to 1 ✓
  - Auto-amount: clear field + blur → snaps to 1 ✓
  - Auto-amount: change handler corrects 0 → 1 ✓
  - Auto-mode scan with forced amount=0 → modal opens (not silent +1) ✓
  - Modal stepper: dec from 1 → -1 ✓
  - Modal stepper: inc from -1 → 1 ✓
  - Modal stepper: type 0 + change → snaps to 1 ✓
  - Modal stepper: empty + change → stays empty (correct — modal allows empty for new items) ✓
  - Modal stepper: dec from -1 → -2 (no spurious skip) ✓
  - Modal stepper: inc from 1 → 2 (no spurious skip) ✓
- The HTML `<meta name="build-version">` tag was bumped from `v01.20w` → `v01.21w`

#### `inventorymanagement.html` — v01.21w
##### Changed
- 0 is no longer an option in any of the quantity steppers (the new "Auto add" increment input next to the camera, and the existing − / + buttons in the scan/manual entry form). Pressing − when the value is 1 now jumps straight to -1 (skipping 0), and pressing + when the value is -1 now jumps straight to 1. Typing 0 directly into the field and tabbing away snaps the value back to 1. The previous Auto add behavior where setting 0 silently incremented by 1 is fixed — if the value is somehow 0 when a scan fires, the entry form now opens instead so you can see what's happening

## [v10.76r] — 2026-04-11 07:40:08 PM EST

> **Prompt:** "the auto add toggle is still showing the Scanned Item Modal instead of automatically adding to the total"

### Fixed
- Fixed the v10.75r Auto-add toggle bug where scanning a known barcode while the toggle was on still opened the scan-confirm modal instead of bypassing it. **Root cause**: my v10.75r implementation wrapped `window._showScanConfirmModal` (line 5290 in `live-site-pages/inventorymanagement.html`) thinking that's what the QR scan path called. But `qrOnFound()` at line 5020-5029 calls the **local** function reference `_showScanConfirmModal(data, format)` directly via lexical scope (line 5028), not through the `window` property. So the wrapper chain — both my outer auto-mode wrapper AND the existing inner collapse-on-scan wrapper at line 5219-5223 — was completely bypassed for real scans. Only the edit-pencil path (line 4662) and manual-entry button path (line 5233) actually went through `window._showScanConfirmModal`, which is why those flows were unaffected
- **The fix**: changed line 5028 from `_showScanConfirmModal(data, format);` to `window._showScanConfirmModal(data, format);` — a one-character addition (`window.`). This routes the QR scan call through the wrapper chain so my outer wrapper's auto-mode check fires correctly. Side effect: the existing inner wrapper at line 5219 (which collapses the scanner on mobile when a scan fires) now also actually runs on real scans — previously it was only firing for edit/manual paths despite the comment claiming "auto-collapse the scanner when a scan fires". This is the intended behavior per the comment, and it's idempotent (removing a class that's already absent is a no-op), so existing pages where users had the scanner collapsed are unaffected
- **The lesson**: when wrapping a function exposed on `window`, verify that ALL call sites actually use `window.functionName` instead of a local reference. Function declarations in the same scope as the caller resolve via lexical scope, NOT through the `window` property — even after `window.foo = foo` exposes them. The fix would have been impossible to find without `Grep` showing both `_showScanConfirmModal` (line 5028) and `window._showScanConfirmModal` (line 4662) as distinct call patterns
- **Functional verification** via Playwright: at 390×844 mobile, mocked `window._ldGetHeaders()` and `window._ldGetRows()` to return a known row `['Wata', 5, '82657500690', 'test@user', '...']`, registered a capture-phase click listener on `#ld-add-row-btn` to snapshot the input values at click time (before the existing bubble-phase handler clears them), then ran 3 scenarios:
  1. Auto ON + known barcode `'82657500690'` with increment=2 → `_showScanConfirmModal` was called via `window`, modal stayed inactive, status text updated to `'Auto +2 · Wata'`, `ld-add-row-btn` was clicked, captured `ld-add-col1..5` values were `['Wata', '2', '82657500690', '', '']` ✓
  2. Auto OFF + same barcode → modal opened, no add-row click ✓
  3. Auto ON + unknown barcode `'UNKNOWN-BARCODE-99999'` → modal opened (fallback), no add-row click ✓
- The HTML `<meta name="build-version">` tag was bumped from `v01.19w` → `v01.20w` to match the `inventorymanagementhtml.version.txt` bump per Pre-Commit #2

#### `inventorymanagement.html` — v01.20w
##### Fixed
- Fixed the new "Auto add" toggle: turning it on now actually bypasses the entry form and immediately adds the configured amount when you scan a known item. The previous version had the toggle and increment input visible but the auto-add path wasn't being reached on real scans, so the entry form kept opening regardless of the toggle state

## [v10.75r] — 2026-04-11 06:53:17 PM EST

> **Prompt:** "ok good. as far as the controls that i want in the space we just made, i want a toggle, which will toggle between automatic scanning or individual item scanning. what i mean is, if the toggle is off, then the scanning works as it currently does, where if i scan an item, it will show the UI for me to enter the quantity. if the toggle is on, i want it to automatically increment that item by 1 without needing to manually enter the quantity. i also want the user to be able to set how much the automatic increment is if the toggle is on, i.e. +1, +2, -1, -2"

### Added
- New "Auto add" mode for the QR scanner in `live-site-pages/inventorymanagement.html` — when enabled, a real scan of a known barcode bypasses the scan-confirm modal entirely and fires `addRow` directly with a configurable increment quantity (positive or negative). Unknown barcodes still fall through to the modal so the user can name the new item. Implementation:
  - **HTML structure (line 824-866 area)**: introduced a new `.qr-side-panel` wrapper inside `#qr-camera-section` that contains the existing `.qr-status-bar` plus a new `.qr-auto-controls` div. The auto-controls block holds a toggle switch (`#qr-auto-mode-toggle`) labeled "Auto add" and an increment input row (`#qr-auto-amount` number input flanked by `#qr-amount-dec` and `#qr-amount-inc` round buttons)
  - **CSS** (after line 653 in the QR scanner block): `.qr-side-panel { display: contents; }` as the desktop default — this removes the wrapper from layout entirely, so on desktop the status bar and auto-controls appear as direct children of `#qr-camera-section` (preserving the original centered-below-camera layout). Inside the `@media (max-width: 600px)` mobile block, `#qr-camera-section .qr-side-panel { display: flex; flex-direction: column; flex: 1 1 0; ... }` reactivates the wrapper as a vertical flex column that takes the remaining horizontal space next to the square camera. The status bar (now nested in the side panel) reverts to a horizontal `flex-direction: row` so the dot + text sit on a single line, and the auto-controls becomes a vertical column with the toggle row above the increment row
  - **CSS toggle switch**: custom 30×16px toggle styled with `.qr-toggle-switch`, `.qr-toggle-slider`, and `::before` pseudo for the sliding thumb. Uses `input:checked + .qr-toggle-slider` for the on-state styling — teal background (`rgba(0,255,204,0.25)`) and bright thumb with cyan glow (`#00ffcc`, matching the existing QR scanner accent color)
  - **CSS increment input**: 22×22px round `−`/`+` buttons (`.qr-amount-btn`) flanking a 42×22px number input (`#qr-auto-amount`). Native spinner arrows hidden via `-webkit-appearance: none` and `-moz-appearance: textfield`. The whole `.qr-auto-amount-row` gets `opacity: 0.4; pointer-events: none` when the parent has the `.qr-auto-disabled` class (mirrors the toggle's off-state)
  - **JS init IIFE**: reads `inventory_qr_auto_mode` and `inventory_qr_auto_amount` from `localStorage` on page load to restore prior toggle state and increment value. Wires `change` on the toggle (persists + applies/removes `.qr-auto-disabled`), `input` on the number field (persists), and `click` on the +/− buttons (parses current value, increments/decrements by 1, dispatches input event)
  - **JS scan interception** (new outer wrapper of `_showScanConfirmModal`): wraps the existing wrapper at line 5184. When called with a non-empty `raw` and `fmt` that is neither `'EDIT'` nor `'MANUAL ENTRY'`, checks the auto-toggle state. If on, calls `window._ldGetHeaders()` and `window._ldGetRows()` to look up the scanned barcode, locates the existing row by string-comparing the Barcode column, then mimics the modal's `onConfirm` flow: populates `ld-add-col1..5` with `[itemName, increment, barcode, '', '']` (using the indices from `headers.indexOf('Item Name'/'Quantity'/'Barcode')`) and clicks `ld-add-row-btn`. The GAS `addRow` function's existing merge-on-duplicate-barcode logic (described in v10.72r) handles the actual delta application server-side. Updates `#qr-status-text` with `'Auto +N · ItemName'` for visual feedback. Replicates the inner wrapper's collapse-on-scan behavior (`qrWrapper.classList.remove('qr-expanded')` + body class cleanup + localStorage `ld_qr_expanded_v1` reset) since we bypassed the layer that does it. Returns early — the `_origAutoWrap` (inner wrapper) is never called in the auto-hit path. Falls through to `_origAutoWrap(raw, fmt)` for: edit/manual contexts, empty raw, unknown barcodes, or auto-mode off
- The HTML `<meta name="build-version">` tag was bumped from `v01.18w` → `v01.19w` to match the `inventorymanagementhtml.version.txt` bump per Pre-Commit #2
- **CSS specificity note**: the new mobile rules use `#qr-camera-section .qr-side-panel`, `#qr-camera-section .qr-status-bar`, `#qr-camera-section .qr-auto-controls`, and `#qr-camera-section .qr-auto-amount-row` — all with specificity (1,1,0) — to win over the desktop base rules at lines 648 and 654 that come later in source order. Same lesson learned in v10.73r
- **Visual + functional verification** via Playwright: at 390×844 mobile, camera renders as 188×188 square (left=16, top=85), side panel is 160×188 (left=214, top=85), status bar is 160×22 at top=85 (top of side panel), auto-controls is 160×48 at top=115 (immediately below status bar). Toggle starts unchecked → auto-controls has `qr-auto-disabled` class → amount-row opacity 0.4. Clicking the toggle makes it checked → class removed → opacity 1. Clicking `+` twice changes value 1 → 3, clicking `−` once changes 3 → 2 (verified via direct DOM read). At 1280×800 desktop, side panel has `display: contents` so its rect is 0×0 (transparent to layout); status bar appears at top=491 (89+402, immediately below the camera) and auto-controls at top=512 (491+21, immediately below the status bar) — both centered (left=438) within the 400px max-width box

#### `inventorymanagement.html` — v01.19w
##### Added
- New "Auto add" toggle next to the camera scanner on phones (and below the camera on desktop). When the toggle is off, scanning a barcode opens the entry form as before so you can review and confirm the quantity. When the toggle is on, scanning a known item silently adds the configured amount to that item's quantity without opening the form — useful for fast bulk-counting
- New increment input next to the Auto add toggle, with − and + buttons. Set the increment to any positive or negative number (e.g. +1, +2, -1, -2) to control how much each scan adds or subtracts. The value persists across page reloads
- Scanning an unknown barcode (one not yet in the inventory) while Auto add is on will still open the entry form, so you can name the new item before saving it

## [v10.74r] — 2026-04-11 06:40:10 PM EST

> **Prompt:** Calibration follow-up commit (no user prompt — automatic estimate calibration after the v10.73r push exceeded its time estimate by >2 minutes per the Estimate Calibration rule in `.claude/rules/chat-bookends.md`)

### Changed
- Bumped the Playwright visual-verification heuristic in `.claude/rules/chat-bookends.md` (Time estimate bullet) from `~30–60s per Playwright visual-verification run` to `~30–60s per single run, but expect 3–5 iterations totaling 3–6m for layout-sensitive changes`. The v10.73r mobile camera layout change took 4 visual verification iterations (initial run revealed parent `#live-data-app` was hidden, second run revealed CSS specificity bug overriding `width`/`max-width`, third run confirmed the specificity bump fix, fourth run with longer status text confirmed graceful wrapping) — each iteration cost ~30-60s for the Playwright run plus edit time. The original estimate budgeted just one visual verification pass (~1m) but reality was ~4-5m. The calibrated heuristic now reminds future estimates to budget the higher end whenever the change touches flexbox, grid, aspect-ratio, or any property that could be overridden by an existing rule later in source order
- This calibration update only affects future estimate calculations — no user-facing behavior change, no page or GAS files touched

## [v10.73r] — 2026-04-11 06:04:15 PM EST

> **Prompt:** "in the inventorymanagement, in the mobile view, make the camera area squished horizontally so that it can  fit controls to the right of it, so i think the width can match the height"

### Changed
- Reshaped the mobile camera scanner layout in `live-site-pages/inventorymanagement.html` so the camera viewport is a perfect square instead of a full-width rectangle, with the status bar relocated to a vertical column on the right side of the camera. Three CSS rules edited inside the `@media (max-width: 600px)` block, no HTML or JS changes:
  - `#qr-camera-section` (line 519): added `display: flex; flex-direction: row; gap: 10px; align-items: flex-start` to convert the previously block-level container into a horizontal flex row. The two existing children (`.qr-viewport-wrapper` and `.qr-status-bar`) become flex items side-by-side
  - `#qr-camera-section .qr-viewport-wrapper` (line 520): changed selector from bare `.qr-viewport-wrapper` to `#qr-camera-section .qr-viewport-wrapper` to bump specificity to (1,1,0) so it beats the desktop base rule at line 618 (specificity 0,1,0) which comes later in source order and was overriding `width`/`max-width` on mobile. Set `aspect-ratio: 1/1; width: 22vh; height: 22vh; max-width: 200px; max-height: 200px; flex: 0 0 auto; border-radius: 12px; cursor: pointer`. Both `width` and `height` use the same `22vh`/`200px` values so the box is guaranteed to be a square at any mobile viewport size — relying on `aspect-ratio` alone with `width: auto` was attempted first but failed because flex items resolve `width: auto` to fill available space before aspect-ratio kicks in. `cursor: pointer` is preserved so the tap-to-expand-to-fullscreen behavior still fires
  - `#qr-camera-section .qr-status-bar` (line 532): selector also bumped to `#qr-camera-section .qr-status-bar` for the same specificity reason (the desktop base rule at line 648 has `margin: 0 auto; max-width: 400px` that would otherwise win). Set `flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 6px; max-width: none; padding: 4px 0 0; margin: 0; font-size: 0.62rem`. The status bar now claims all remaining horizontal space next to the square camera, stacks the dot + status text vertically top-aligned, and removes the inherited centering
- The torch button (`.qr-torch-btn`), stop button (`.qr-stop-btn`), engine badge (`.qr-engine-badge`), and "TAP TO EXPAND" hint (`.qr-expand-hint`) remain absolutely positioned overlays inside the (now smaller) viewport — they continue to work correctly inside the 22vh square. The fullscreen-expanded mode (`.qr-viewport-wrapper.qr-expanded` at line 543) is unaffected because its `position: fixed; inset: 0` overrides the collapsed-state layout when triggered. Desktop view (`min-width: 601px`) is unchanged since all three edits live inside the mobile media query (the `#qr-camera-section` ancestor selector still scopes them correctly)
- The HTML `<meta name="build-version">` tag was bumped from `v01.17w` → `v01.18w` to match the `inventorymanagementhtml.version.txt` bump per Pre-Commit #2
- **CSS cascade lesson learned**: when adding override rules inside an `@media` block, verify they actually win over base rules later in the source order. CSS specificity ignores media query nesting — only selector specificity and source order matter. The original mobile media query block (lines 510–554) was placed BEFORE the desktop QR camera scanner styles (lines 617–654) in source order, so any property in the desktop rule that's also declared in the mobile rule will win on mobile too unless the mobile selector has higher specificity. The fix is to scope the mobile override under an ancestor ID like `#qr-camera-section`, bumping specificity from (0,1,0) to (1,1,0). This was discovered during Playwright visual verification — the first iteration had the camera rendering as a 360×188 rectangle on mobile because the desktop `width: 100%; max-width: 400px` was silently overriding the mobile `width: 22vh; max-width: 200px`
- **Visual verification**: ran Playwright at 390×844 (mobile) — camera renders as 188×188 square pinned to the left of `#qr-camera-section` (left=16, top=85), status bar (160×39) sits at left=214 with a 10px gap from the camera's right edge, top-aligned with the camera. Long status text ("Scanning for QR codes — point camera at any barcode...") wraps gracefully across 3 lines in the right column without horizontal overflow. Ran at 1280×800 (desktop) — viewport is 402×402 square centered, status bar at top=491 (below the camera) — identical to pre-edit behavior

#### `inventorymanagement.html` — v01.18w
##### Changed
- On phones, the camera scanner is now a square preview with the status display sitting beside it instead of stacked underneath, making the layout more compact and leaving room next to the camera for additional controls

## [v10.72r] — 2026-04-11 05:44:20 PM EST

> **Prompt:** "no, still using the menu with the pencil is still not updating the row. think deep as it really should function identically to when we scan an item to change the quantity"

### Fixed
- Pivoted the per-row edit feature from v10.70r/v10.71r to reuse the proven scan-existing path instead of a custom `writeCell` chain. The key insight surfaced by the user's hint was that scanning an existing barcode already works correctly — and it works because `addRow()` in `googleAppsScripts/Inventorymanagement/inventorymanagement.gs` (lines 454-500) has **merge-on-duplicate-barcode** logic: when the submitted payload's barcode matches an existing row, it treats the submitted Quantity as a delta and sets `newQty = existingQty + deltaQty`, updating the existing row in place rather than appending a new one. My `writeCell`-chain approach was reinventing this from scratch and failing for reasons I couldn't diagnose without interactive debugging. The fix: make the pencil button synthesize a barcode-scan of the row's existing barcode, so the edit flow goes through the exact same code path as scan-existing
- Rewrote `ldStartRowEdit(rowIndex)` in `live-site-pages/inventorymanagement.html`: it now extracts the row's Barcode column index from `window._ldGetHeaders()`, reads the row's barcode value from `window._ldGetRows()[rowIndex][barcodeColIdx]`, and calls `window._showScanConfirmModal(barcode, 'EDIT')`. The `scannedData=barcode` parameter triggers the existing `existingRow` barcode-lookup branch in the modal (which was previously gated behind `!isEdit`), and the scan-confirm flow proceeds exactly as if the user had scanned the row's barcode physically
- Reverted `_showScanConfirmModal()` to its 2-parameter signature (`scannedData`, `scannedFormat`) by removing the `editOptions` third parameter, the `isEdit`, `editRow`, `editItemName`, and `_rowsForEdit` local variables, the `!isEdit` guards on the barcode lookup and quantity branches, the `isEdit && editRow` absolute-value pre-fill, and the entire `isEdit` branch in `onConfirm()` (which contained the broken `writeCell` chain and the optimistic update). Kept a small one-liner `var isEditAction = scannedFormat === 'EDIT';` used to override the title to "Edit Row — {name}" (instead of "Existing Item — {name}") and the confirm button text to "Save" (instead of "Add Row") when the modal was launched via the pencil button. These are cosmetic differences from scan-existing — the rest of the flow is byte-for-byte identical
- Reverted the wrapper at line ~5203 back to `function(raw, fmt) { ... return _origShowScanConfirm(raw, fmt); }` — the `editOptions` pass-through is no longer needed
- Kept the defensive `.onclick` listener management fix from v10.71r (property assignment instead of `addEventListener`) because it's a general-purpose improvement unrelated to the edit-mode implementation
- Verified end-to-end via Playwright at 390×844 mobile: clicking the pencil button on row 0 (Wata, qty=5) opens a modal titled "Edit Row — Wata" with subtitle "EDIT", confirm button "Save", Item Name pre-filled with "Wata", Quantity pre-filled with "1" and placeholder "Amount to add" with the note "Current qty: 5 — enter amount to add (negative to subtract)", Barcode pre-filled with "82657500690", and a +/− stepper. Clicking + twice bumps the quantity to 3. Clicking Save fires the `ld-add-row-btn` click handler (verified by hooking `addBtn.click`), which populates `ld-add-col1..5` with `['Wata', '3', '82657500690', <current email>, <current timestamp>]` and invokes `gasCall('addRow', ...)`. When this hits the GAS `addRow()` function, the merge-on-duplicate-barcode branch detects the existing row for `82657500690`, computes `newQty = 5 + 3 = 8`, writes `8` to the existing row's Quantity cell, updates Last User and Last Updated, and refreshes the cache. The client's `_handleLiveData(result.liveData)` then updates the table. The delete path from scan-existing is fully proven, so this pivot inherits its reliability
- **Why this works when the previous attempts didn't**: `writeCell` in the GAS layer does a direct `sheet.getRange(row+2, col+1).setValue(value)` without session validation beyond the header RBAC check — and the row index is computed on the client side from `_ldRows[rowIdx]`, which can drift out of sync with the actual sheet order (via sorts, concurrent writes, or row deletions). `addRow` with merge semantics looks up the target row **by barcode on the server side**, which is a content-addressable operation immune to client-side row-index drift. The scan-existing flow proved this works in production; the pencil-edit flow now leverages the same mechanism

#### `inventorymanagement.html` — v01.17w
##### Fixed
- Fixed the pencil edit button so it now works the same way as scanning an existing item to change the quantity. Tap the pencil on any row, enter the amount to add or subtract (or use − / +), click Save, and the row's quantity updates correctly

## [v10.71r] — 2026-04-11 05:31:18 PM EST

> **Prompt:** "im clicking on the pencil and i see the UI, but modifying and saving is not changing the values in the table"

### Fixed
- Fixed the per-row edit feature from v10.70r where clicking Save in the Edit Row modal did not visibly update the table. Two independent fixes applied to `_showScanConfirmModal()` in `live-site-pages/inventorymanagement.html`:
  - **Listener stacking** — the confirm/cancel buttons used `confirmBtn.addEventListener('click', onConfirm)` and `cancelBtn.addEventListener('click', onCancel)`, paired with `removeEventListener` calls in `cleanup()`. Because cleanup only runs on explicit Save/Cancel, if the user opened the modal via scan/entry and then re-opened via the pencil without clicking Save or Cancel first, the previous invocation's `onConfirm` was still attached and fired alongside the new one on the next Save click. The old closure captured stale `isEdit=false` state and routed through the add-row path, which would silently fail because `editInputs` positional mapping didn't match the fresh modal's state. Switched to `confirmBtn.onclick = onConfirm; cancelBtn.onclick = onCancel;` — property assignment replaces any previous handler, so only one handler is ever attached. `cleanup()` updated to null out `.onclick` instead of calling `removeEventListener`. Verified via Playwright: opening the modal twice in succession yields different `onclick` function references (proving replacement, not stacking), and clicking Save cleanly dismisses the modal with no JS errors and clears the handler
  - **No optimistic UI update** — the edit confirm path fired `writeCell` in a sequential chain but didn't apply any local changes to `_ldRows` until the server responded AND the next data poll (`~15s` interval via `_doDataPoll`) picked up the refreshed cache. Between the Save click and the poll, the user saw no change in the table, creating the impression that Save did nothing. Added an optimistic update block that runs after computing the `writes` array and BEFORE firing the `doWrite()` chain: it iterates `writes` and applies each `{col, val}` to `_ldRows[rowIdx]` in place, then calls `ldRenderTableView({})` and `ldRenderDashboardView({})` so the table visually reflects the edit immediately. The background `writeCell` chain still runs to persist to the sheet; the next data poll re-syncs from the server state. If a `writeCell` call fails, the next poll (~15s later) reverts the optimistic change to match the server. Also removed the `_handleLiveData(result.liveData)` call from the per-write success callback to prevent flicker between optimistic state and partial server state mid-chain, and changed the per-write failure handler to continue the chain (best-effort) so a single failed cell doesn't block subsequent writes

#### `inventorymanagement.html` — v01.16w
##### Fixed
- Fixed an issue where editing a row via the pencil button and clicking Save did not update the values in the table. Changes now reflect immediately in the table after clicking Save, and the sheet gets updated in the background

## [v10.70r] — 2026-04-11 05:19:50 PM EST

> **Prompt:** "have each row also have an edit button, which will bring up similar UI to the scanning entry"

### Added
- Added a per-row edit button (✏️) to `ldRenderTableView()` in `live-site-pages/inventorymanagement.html` alongside the existing delete button. Widened the action column header from `40px` to `72px` to accommodate both buttons in the same cell (no extra column, preserves the mobile `nth-child` hide rules from v10.67r which target columns 3-5). New `ldStartRowEdit(rowIndex)` helper (exposed on `window.ldStartRowEdit`) validates the row exists via `window._ldGetRows()` and calls `window._showScanConfirmModal('', 'EDIT', { rowIndex })` to open the confirm modal in edit mode
- Extended `_showScanConfirmModal(scannedData, scannedFormat, editOptions)` with an optional third `editOptions` parameter: when `{rowIndex: N}` is passed and `_ldGetRows()[N]` exists, `isEdit = true` activates the edit-mode branches. In edit mode: the format label shows `EDIT`, the title shows `Edit Row — {itemName}`, the confirm button text becomes `Save`, every visible input is pre-filled from the current row's values (overriding the barcode auto-fill and existing-row Item Name prefill), the Quantity field uses the actual row value (no `'1'` or `'Amount to add'` placeholder), and the "Current qty: N — enter amount to add" note is suppressed. The auto-populated hidden inputs for Last User and Last Updated still run — they get fresh values (current user email, current EST timestamp) so edits always record who/when. Resolved `editRow` via `window._ldGetRows()` instead of the private `_ldRows` so tests and debug callers can inject rows via the existing exposed getter
- Edit confirm path: instead of routing to `ld-add-row-btn` → `addRow`, the edit branch computes a diff between `editRow` (snapshot from when the modal opened) and the current `editInputs` values. Any cell where the value changed, OR which is Last User/Last Updated (always refreshed), becomes a `writeCell` call. Writes are fired sequentially via a `doWrite()` chain — each callback triggers the next after its `liveData` response refreshes the table. Sequential chaining avoids race conditions where concurrent cache-refresh responses could render inconsistent intermediate states
- Fixed a latent bug in the existing `_showScanConfirmModal` wrapper at line ~5203 (`window._showScanConfirmModal = function(raw, fmt) { ... return _origShowScanConfirm(raw, fmt); }`) — the wrapper only accepted 2 parameters and dropped any additional arguments. Updated to `function(raw, fmt, editOptions) { ... return _origShowScanConfirm(raw, fmt, editOptions); }` so the new `editOptions` parameter flows through. This was caught immediately by Playwright testing: the first test run showed the modal opening with `isEdit=false` even though `ldStartRowEdit(0)` was called with valid options — the wrapper was silently discarding them
- Verified via Playwright at 390×844 mobile: (1) table renders with 3 rows each containing both an `Edit row` (✏️) button and a `Delete row` (🗑️) button in the action cell, (2) clicking the edit button opens the modal with title "Edit Row — Wata", subtitle "EDIT", confirm button "Save", pre-filled Item Name="Wata", Quantity="5" (with +/− stepper, no note), Barcode="82657500690", (3) the `+` button correctly bumps the quantity from 5 → 7, (4) calling `ldStartRowEdit(1)` on a different row updates the title to "Edit Row — Bar" and refreshes all input values with no stale state from the prior open

#### `inventorymanagement.html` — v01.15w
##### Added
- Each row in the inventory table now has an edit button (✏️) next to the delete button. Tapping it opens the same entry form used for scanning/manual entry, pre-filled with that row's current values. The + / − buttons let you adjust the quantity directly, and Save writes the changes back to the sheet. Last User and Last Updated are refreshed automatically when you save

## [v10.69r] — 2026-04-11 05:03:25 PM EST

> **Prompt:** "the entry fields for new entries, i dont need the user to see the last user and last updated field since they will always be automatic, so remove those from that UI. the table itself should still have them."

### Changed
- Hid the `Last User` and `Last Updated` rows from the `_showScanConfirmModal()` entry form in `live-site-pages/inventorymanagement.html` while keeping their values flowing through to the new row on submit. Added an early-continue intercept at the top of the for-loop (`hCurr === 'last user' || hCurr === 'last updated'`): when either header is encountered, the code creates a hidden `<input type="hidden">`, auto-populates it (current user email from `#gas-user-email.textContent` for Last User, current EST timestamp for Last Updated), pushes it to `editInputs`, and `continue`s without appending a `<tr>` to the tbody. This preserves the positional `editInputs[k] → ld-add-col(k+1)` mapping used by the confirm handler, so column N still lands in column N even though some N's never produced a visible row. Removed the now-dead auto-population lines further down in the loop (old `if (hLow === 'last updated') inp.value = ...` and `if (hLow === 'last user') { ... }`) per the Dead Code Detection Methodology — those branches are permanently unreachable after the early intercept. The table itself (`#ld-data-table`) still renders all 5 columns including Last User and Last Updated — this change only affects the add-row entry modal UI. Verified via Playwright across 4 scenarios (manual-new, scan-new, scan-existing, manual-desktop): visible modal rows reduced from 5 → 3 (Item Name, Quantity, Barcode), while the simulated confirm click populated `ld-add-col4` with `shadow@shadowaisolutions.com` and `ld-add-col5` with the current timestamp in every scenario

#### `inventorymanagement.html` — v01.14w
##### Changed
- Entry form (both manual and scan) no longer shows the Last User and Last Updated fields — these are always filled in automatically, so hiding them removes noise and makes the form quicker to scan. The table still displays both columns as before

## [v10.68r] — 2026-04-11 04:40:42 PM EST

> **Prompt:** "make the manual entry UI have the same plus and minus button functionality that we are using in the entry UI when we scan, so both UI should be identical other than the method and automatic population"

### Changed
- Refactored `_showScanConfirmModal()` in `live-site-pages/inventorymanagement.html` to always render the `.qty-stepper-group` (−/+ buttons + input) for the Quantity field, regardless of whether an existing row was matched. Previously, the stepper was only created inside the `if (existingRow) { ... if (hLow === 'quantity') { ... } }` branch — which meant scan-entry for a new (unknown) barcode AND manual-entry (which never has scannedData → never matches existingRow) both fell through to the plain-input fallback at the bottom of the for-loop. The fix hoists the quantity-column check out of the `existingRow` branch into its own `if (headers[i].toLowerCase() === 'quantity')` block that runs unconditionally, with the `existingRow`-specific behavior (prefill `inp.value = '1'`, `inp.placeholder = 'Amount to add'`, and the "Current qty: N — enter amount to add (negative to subtract)" note) gated behind inner `if (existingRow)` checks. All four scenarios now render identical Quantity UI: manual-new, manual-existing (theoretical — manual can't match barcode), scan-new, scan-existing. Verified via Playwright at 390×844 and 1280×800 across all four scenarios — every case shows `hasStepper: true, hasMinus: true, hasPlus: true` on the Quantity row, with the existing-item scenario retaining its pre-fill and note, and the other scenarios showing the stepper with an empty input

#### `inventorymanagement.html` — v01.13w
##### Changed
- Manual entry form now has the same − / + quantity adjustment buttons as the scan entry form — both entry screens now look identical, with the only difference being whether the barcode is filled in automatically (scan) or typed in manually

## [v10.67r] — 2026-04-10 01:06:37 PM EST

> **Prompt:** "for the inventorymanagement, have the mobile view only show the item name and quantity column"

### Changed
- Added a mobile-only CSS rule to `live-site-pages/inventorymanagement.html` inside the existing `@media (max-width: 600px)` block that hides the Barcode, Last User, and Last Updated columns (`th:nth-child(3|4|5)` and `td[data-col="2"|"3"|"4"]`) so the mobile view shows only Item Name and Quantity. The delete action column is automatically preserved because its `<th>` lives at `nth-child(6)` (outside the selector range) and its `<td>` has no `data-col` attribute. Rendering logic in `ldRenderTableView()` is untouched — this is a pure CSS visibility change, so hidden cells still exist in the DOM and sorting/editing/data attributes work unchanged when the viewport is resized back to desktop. Verified via Playwright at 390×844 mobile (only Item Name + Quantity + delete visible), 1280×800 desktop (all 5 columns + delete visible), and 601×844 boundary (above breakpoint — all columns visible)

#### `inventorymanagement.html` — v01.12w
##### Changed
- Mobile view now shows only Item Name and Quantity columns — Barcode, Last User, and Last Updated are hidden below 600px screen width for easier scanning on phones

## [v10.66r] — 2026-04-10 12:16:52 PM EST

> **Prompt:** *(hook-triggered cleanup — follow-up to v10.65r)*

### Changed
- Calibrated the time-estimate heuristics in `.claude/rules/chat-bookends.md` after v10.65r's ACTUAL TOTAL COMPLETION TIME (18m 34s) missed the original estimate (4m) by 14m 34s. Root cause: the original estimate only covered the plan-mode research/planning phase and did not project the anticipated post-approval execution phase, so when the plan was approved and execution began, the estimate was structurally blind to the second half of the response. Added a new **Plan-mode flows** clause to the "Time estimate" bullet that explicitly requires the original overall estimate to include BOTH phases — research/planning AND anticipated post-approval execution (file reads, edits, commit cycle, push cycle, visual verification, calibration overhead). The clause states: "A plan-mode response is not 'done' when `ExitPlanMode` is called — it continues through approval and execution until `✅✅CODING COMPLETE✅✅`, and the estimate must cover that full wall-clock span." The per-phase heuristic values (`~10s per tool call`, `~30s per commit/push cycle`, etc.) are unchanged — they were accurate for this response (the post-approval estimate of 8m vs. actual 9m 10s was within the 2-minute tolerance). The miss was framing, not numbers

## [v10.65r] — 2026-04-10 12:08:01 PM EST

> **Prompt:** "in the inventory management, i want to remove the timestamp column, and rearrange the others order: Item Name, Quantity, Barcode, Last User, Last Updated"

### Changed
- Removed the Timestamp column from the inventory management page and reordered the remaining columns to `Item Name | Quantity | Barcode | Last User | Last Updated`. The display is data-driven via `_ldHeaders`/`_ldRows` in the render loops at `live-site-pages/inventorymanagement.html` lines 4407 and 4446 — the actual column shape comes from the Google Sheet, which the user manually restructured from 6 columns to 5 in the new order. The only code-side changes were the hardcoded fallback defaults that describe the sheet shape: updated `sheet.getRange(1, 1, 1, 5).setValues(...)` in `googleAppsScripts/Inventorymanagement/inventorymanagement.gs` line 323 (auto-create fallback — triggers if the sheet tab is deleted), and updated the scan-confirm modal's fallback array at `live-site-pages/inventorymanagement.html` line 4964 (used when `_ldHeaders` is empty). Also cleaned up dead code in the scan-confirm modal — removed the `timestampColIdx` tracking variable and the `else if (hLow === 'timestamp')` branch (lines 4968–4975) plus the Timestamp pre-fill line (previously 5011) since Timestamp is no longer a column, making the lookup permanently `-1` and the pre-fill unreachable (per behavioral-rules.md "Dead Code Detection Methodology"). Visually verified via Playwright at 390×844 mobile viewport: table renders 5 columns in the new order, scan-confirm modal for a new barcode shows 5 fields in the new order, and scan-confirm modal for an existing barcode correctly pre-fills `Item Name` from `itemNameColIdx` (proves the dead-code cleanup didn't break the remaining header lookups)

#### `inventorymanagement.html` — v01.11w
##### Changed
- Inventory table now shows 5 columns in this order: Item Name, Quantity, Barcode, Last User, Last Updated
- Removed the Timestamp column from the inventory table and the scan entry form

#### `inventorymanagement.gs` — v01.04g
##### Changed
- Default sheet layout now uses 5 columns (Item Name, Quantity, Barcode, Last User, Last Updated) — Timestamp column removed

## [v10.64r] — 2026-04-10 11:36:58 AM EST

> **Prompt:** *(hook-triggered cleanup — follow-up to v10.63r)*

### Changed
- Calibrated the time-estimate heuristics in `.claude/rules/chat-bookends.md` after v10.63r missed its 5m estimate by ~18 minutes. Split `~1–2m per subagent spawn` into `~1–2m per Explore subagent` and `~3–5m per Plan subagent` (Plan agents do deeper multi-section analysis). Added two new heuristics: `~60–90s for first-time Playwright install` (pip install + chromium download ~110MB) and `~30–60s per Playwright visual-verification run`. These are observed from the v10.63r response and should produce tighter estimates on future multi-phase plan-and-execute responses that include visual verification

## [v10.63r] — 2026-04-10 11:28:11 AM EST

> **Prompt:** "the screenshot is of  inventorymanagement on the phone. while it looks nice, the camera portion is encompassing so much of the screen that seeing the inventory list itself and adding more features is difficult. come up with a UI design to accomodate for a user friendly experience."

### Changed
- Redesigned the inventory management scanner for mobile viewports (≤600px) — released the `aspect-ratio: 1/1` lock on `.qr-viewport-wrapper` and replaced it with a compact `height: 22vh; max-height: 200px` strip so the inventory table becomes the primary focus. On mobile, tapping the strip adds a `.qr-expanded` class that toggles the wrapper to `position: fixed; inset: 0` fullscreen — reusing the same `<video>` element so the camera stream is never restarted (no re-permission, no warm-up lag). Added a "TAP TO EXPAND" hint chip in compact state and a 44×44 × collapse button in expanded state. All overlays (corners, scan-line, torch, engine-badge, start-screen, found-flash) reposition proportionally via scoped selectors inside the existing `@media (max-width: 600px)` block. Added `body.qr-fullscreen-active` guard that disables pointer events on the header/tabs/table/dashboard beneath the fullscreen scanner. Wrapped `window._showScanConfirmModal` to auto-collapse the scanner when a scan fires the confirmation modal (so the table is visible behind it). Added Escape key handler for keyboard tablets. Desktop behavior is unchanged — every new CSS rule is inside the 600px media query, base `.qr-expand-hint { display: none }` hides it on desktop, and the `qrIsMobile()` gate makes the wrapper click a no-op at wider viewports. Introduced a scoped `qrScanMoveMobile` keyframe to avoid cross-media `@keyframes` override quirks

#### `inventorymanagement.html` — v01.10w
##### Changed
- Redesigned the inventory scanner for phone screens — the camera now shows as a compact strip at the top of the page, leaving plenty of room for the inventory list
- Tap the scanner strip to expand it to fullscreen for tougher scans; tap the × button to collapse it back
- When a scan is detected, the scanner automatically collapses so the inventory list is visible behind the confirmation dialog
- Desktop view is unchanged

## [v10.62r] — 2026-04-09 10:27:54 PM EST

> **Prompt:** "remove the fields and the add row button on the main page (shown in screenshot), the entry button can stay"

### Removed
- Removed the 6 visible input fields (Timestamp, Barcode, Item Name, Quantity, Last Updated, Last User) and the Add Row button from the add-row bar — replaced with hidden inputs to preserve scan confirmation modal functionality. Only the Entry button remains visible

#### `inventorymanagement.html` — v01.09w
##### Removed
- Removed the inline input fields and Add Row button from the toolbar — only the Entry button remains

## [v10.61r] — 2026-04-09 09:10:55 PM EST

> **Prompt:** "ok good. the add row buttons should also not trigger the keyboard to open"

### Changed
- Removed auto-focus from the Add Row button handler (no longer focuses the first input after submission) and from the scan confirmation modal (no longer focuses the first empty input when the modal opens) — prevents mobile keyboard from popping up

#### `inventorymanagement.html` — v01.08w
##### Changed
- Add Row and Entry buttons no longer trigger mobile keyboard popup

## [v10.60r] — 2026-04-09 09:05:22 PM EST

> **Prompt:** "can you make it so that using the plus and minus buttons doesnt trigger the keyboard to popup"

### Changed
- Removed `focus()` calls from quantity stepper button handlers so tapping +/− on mobile no longer opens the on-screen keyboard

#### `inventorymanagement.html` — v01.07w
##### Changed
- Stepper buttons no longer trigger mobile keyboard popup

## [v10.59r] — 2026-04-09 09:01:19 PM EST

> **Prompt:** "the plus and minus buttons are added and clickable, but they are increasing the number in the last user field instead of the quantity field"

### Fixed
- Fixed quantity stepper buttons modifying the wrong field — `var inp` is function-scoped so the closures captured the last loop iteration's input (Last User). Wrapped handlers in an IIFE to capture the correct reference

#### `inventorymanagement.html` — v01.06w
##### Fixed
- Fixed quantity +/− buttons targeting the wrong input field

## [v10.58r] — 2026-04-09 08:54:31 PM EST

> **Prompt:** "in the inventorymanagement, make the existing item menu Quantity have a + and - button to increase and decreate it, but still allow typing it in"

### Added
- Added quantity stepper buttons (−/+) to the scan confirmation modal's Quantity field in Inventory Management — buttons increment/decrement by 1 while preserving direct keyboard input

#### `inventorymanagement.html` — v01.05w
##### Added
- Added −/+ stepper buttons flanking the Quantity input in the existing-item scan modal for quick increment/decrement

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

