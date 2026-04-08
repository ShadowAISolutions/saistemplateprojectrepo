# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-08 10:09:00 AM EST
**Repo version:** v09.91r

### What was done
- **Designed and implemented inventory management system (v09.91r)** — full AHK feature parity Phases 1+2, incorporating all elements from `autoHotkey/Combined Inventory and Intercept.ahk`
- **Phase 1 — Backend**: Added inventory CRUD functions to `inventorymanagement.gs` PROJECT block (line ~1786): `addNewItem`, `addStock`, `subtractStock`, `editItem`, `getInventoryData`, `pollInventoryData`. Auto-creates `Inventory` and `InventoryHistory` sheets. Full caching via `getEpochCache()` with `inventory_data`, `inventory_history`, `inventory_last_modified` keys. Every operation logs to InventoryHistory (action types: NEW, ADD, SUB, EDIT)
- **Phase 2 — Frontend UI**: Added inventory management UI inside the GAS session page HTML (in doGet): mode banner (color-coded: green=new, blue=add, orange=subtract), 3 mode buttons, 3 togglable list views (Inventory table with sortable columns, History table, Raw Scans), custom modals (Add New Item, Edit Item, Delete Item), status bar with auto-fade, advanced qty toggle for custom +N/-N adjustments, 15s inventory data polling, parent-to-GAS scan bridge via postMessage
- **Parent HTML change**: Added `inventory-scan` postMessage forwarding in `onFound()` function of `inventorymanagement.html` (line ~3999) to send camera barcode scans to the GAS session iframe

### Where we left off
- Phases 1+2 pushed and auto-merging. The GAS webhook will deploy the new backend functions
- **Still needed (Phase 3)**: Google Drive image support for item/user photos — requires adding `drive.file` OAuth scope, `uploadInventoryImage()` GAS function, CSP update for `drive.google.com` and `lh3.googleusercontent.com`
- **Still needed (Phase 4)**: Column sorting/filtering polish, audio feedback (scan confirmation tone), RBAC gating for inventory operations, responsive mobile layout, error handling for concurrent edits

### Key decisions made
- **Google OAuth only** — no badge-based user identification (InventoryUsers sheet omitted). Google email is the sole user identity for all inventory operations
- **Google Drive links for images** (deferred to Phase 3) — full-size photos stored via `DriveApp.createFile(blob)`, shareable URLs in Sheets
- **Phases 1+2 first** — backend + frontend UI delivered this session; images and polish in follow-up sessions
- **Both qty modes** — default +1/-1 quick scan with "Advanced" toggle that reveals a quantity input field for custom adjustments
- **Delete = set qty to 0** — preserves the barcode entry for future re-stocking rather than removing the sheet row
- **Inventory UI inside GAS session page** — not on parent HTML. All ops require auth tokens, `google.script.run` only available inside GAS iframe
- **Scan flow**: Parent HTML (camera) → postMessage `{type:'inventory-scan'}` → GAS session page → `google.script.run` (server-side CRUD)

### Active context
- Branch: claude/design-inventory-system-E7wUy (pushed, auto-merging)
- Repo version: v09.91r
- inventorymanagement.html: v01.16w, inventorymanagement.gs: v01.15g
- Plan file: `/root/.claude/plans/temporal-sparking-wind.md` (full design plan with all 4 phases)
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-07 10:52:00 PM EST
**Repo version:** v09.90r

### What was done
- **Fixed GAS toggle not hiding admin dropdown and scan history (v09.87r)** — root cause: parent page's GAS toggle button was never shown. Fix: added `_showGasToggle()` call, expanded GAS-side `_gasLayerEls` array
- **Fixed templates for future projects (v09.88r)** — propagated to globalacl and programportal
- **Show Global ACL in Program Portal (v09.89r)** — removed `SELF` exclusion from `getPortalApps()`
- **Exclude Program Portal from its own app list (v09.90r)** — added self-exclusion using `selfPageId`

### Where we left off
- All changes pushed. GAS deployment needed for the changes to take effect

Developed by: ShadowAISolutions
