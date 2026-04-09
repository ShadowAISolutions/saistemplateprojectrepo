# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-09 02:40:24 PM EST
**Repo version:** v10.40r

### What was done
- **Added live-data-app to HTML layer toggle (v10.36r)** — The HTML toggle button wasn't hiding/showing the Live Data App. Added `'live-data-app'` to `_htmlLayerEls` in the PROJECT OVERRIDE section
- **Re-added GAS version pill and changelog popup (v10.37r)** — GAS pill, gcl-overlay, GAS version polling IIFE, GAS changelog popup, and "Code Ready" splash were removed during the prior session's GAS→HTML migration. Restored all CSS (~53 lines), HTML elements, and JS (~160 lines) from the auth template since the GAS layer is still needed as a backend
- **Fixed immediate data load on startup (v10.38r)** — `_startGasDataPoll()` was scheduling the first `_doDataPoll()` after a 15-second `setTimeout(DATA_POLL_INTERVAL)`. Changed to call `_doDataPoll()` immediately so data appears on login instead of after waiting
- **Updated add-row bar to 6 columns (v10.39r)** — Changed from 4 generic "Column N" inputs to 6 inputs with placeholders: Timestamp, Barcode, Item Name, Quantity, Last Updated, Last User. Updated JS `inputs` array to reference all 6
- **Auto-create Live_Sheet with correct headers (v10.40r)** — `refreshDataCache()` had `if (!sheet) return` which silently exited without clearing the stale 6-hour CacheService entry when the sheet tab was deleted. Added auto-creation with the 6-column headers and cache clearing
- **Researched quota comparison** — testauthhtml1 vs testauthgas1 server-side quota is identical (same GAS functions). Transport differs: testauthhtml1 uses `google.script.run` via postMessage RPC (faster), testauthgas1 uses `fetch()` HTTP to deployment URL (slower)

### Where we left off
- **STALE CACHE PROBLEM STILL ACTIVE** — the auto-create fix in `refreshDataCache()` only runs on cache **miss**, but the old 6-hour cache entry from before the sheet deletion is still valid. `getCachedData()` keeps returning stale data without ever calling `refreshDataCache()`. The developer sees old columns (Timestamp, Column B, Column C, Serial) with old data despite deleting the Live_Sheet tab
- **Proposed fix not yet implemented**: make `processDataPoll()` always call `refreshDataCache()` instead of `getCachedData()`, so every 15-second poll reads fresh from the spreadsheet. This eliminates the stale cache problem at the cost of one spreadsheet read per poll (acceptable for a test app). The developer was comparing quota usage before deciding
- **Same bug exists in testauthgas1** — identical `refreshDataCache()` / `getCachedData()` code, same 6-hour stale cache vulnerability. Not triggered yet because that sheet tab hasn't been deleted
- **Admin panel JS still not wired up** — HTML elements present but no JS logic

### Key decisions made
- GAS pill restored — the GAS layer is still needed as a backend RPC worker even though the visual UI was migrated to HTML
- 6-column schema chosen: Timestamp, Barcode, Item Name, Quantity, Last Updated, Last User
- Data poll fires immediately on auth (not after 15s delay)

### Active context
- Branch: claude/identify-table-layer-R16kV
- Repo version: v10.40r
- testauthhtml1.html: v01.09w, testauthhtml1.gs: v01.03g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`
- **Key files**: `live-site-pages/testauthhtml1.html` (HTML layer with migrated UI), `googleAppsScripts/Testauthhtml1/testauthhtml1.gs` (GAS with worker route + data functions)
- **Open issue**: stale CacheService data — need to decide whether to force `refreshDataCache()` on every poll or implement a smarter cache-invalidation approach

## Previous Sessions

**Date:** 2026-04-09 01:17:45 PM EST
**Repo version:** v10.35r

### What was done
- Migrated testauthhtml1 GAS layer to HTML layer (v10.32r–v10.35r) — visual UI moved to HTML, hidden 0×0 worker iframe as RPC bridge
- Fixed script crash from null SSO indicator, fixed RPC bridge target (`_gasSandboxSource`)

### Where we left off
- Data was not loading — RPC bridge fix was the last change pushed

Developed by: ShadowAISolutions
