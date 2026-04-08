# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-08 11:52:00 AM EST
**Repo version:** v09.97r

### What was done
- **Responsive UI modes (v09.92r)** — Added desktop (side-by-side) and mobile (stacked) layouts for scanner + inventory
- **Major architecture migration (v09.93r)** — Moved entire inventory UI (CSS, HTML, JS) from GAS iframe to HTML layer. GAS iframe now operates as a hidden backend bridge only — receives postMessage, calls `google.script.run`, returns results via postMessage
- **PostMessage bridge** — Created `_gasCall()` Promise-based RPC helper on HTML side. GAS bridge routes 9 operation types: `inventory-get-data`, `inventory-poll`, `inventory-add-new`, `inventory-add-stock`, `inventory-sub-stock`, `inventory-edit`, `inventory-delete`, `scan-get-history`, `scan-delete-row`
- **Layout fixes (v09.94r-v09.95r)** — Fixed mobile overlap (scanner changed from `position: fixed` to `position: relative`), wired HTML toggle to hide/show inventory panel, removed `display: none` gate so panel is always visible
- **Handler routing fixes (v09.96r-v09.97r)** — Fixed postMessage response→handler mapping. Rewrote from key-based lookup to matcher-based callback system. CRUD ops use `op` field from `inventory-op-result` to match; data/poll/scan use static response→request type mapping

### Where we left off
- **CRITICAL BUG — CRUD operations still not resolving.** The "Add New Item" modal stays open after clicking "Add Item". The GAS server receives the call and adds to the spreadsheet, but the HTML `.then()` handler never fires (Promise never resolves). The matcher-based callback rewrite (v09.97r) was the latest attempt but user reports it still doesn't work
- **Root cause is unknown** — the code traces correctly on paper: `_gasCall` stores matcher → `_sendToGas` sends to `gas-app` iframe → GAS bridge calls `addNewItem()` → success handler sends `{type: 'inventory-op-result', op: 'add-new', result: r}` back to parent → HTML listener should find matching callback. But the Promise never resolves in practice
- **Debugging needed** — next session should add `console.log` statements to: (1) the GAS bridge's `_respond` function to confirm messages are being sent, (2) the HTML message listener to confirm messages arrive and what their content is, (3) the matcher loop to see if callbacks are found. Alternatively, use the webapp-testing skill with Playwright to capture browser console output
- **Possible causes to investigate**: (a) the GAS bridge's `window.top.postMessage(msg, _PARENT_ORIGIN)` might be blocked by the GAS sandbox — unlike the template's existing bridge iframes which use string-concatenated HTML, the inventory bridge is in the main `doGet()` session page which may have different sandbox restrictions; (b) the `_PARENT_ORIGIN` variable might resolve incorrectly in the template literal context; (c) `google.script.run` success handler might swallow errors silently; (d) the message might arrive but `_activeCallbacks` array might be empty by the time it does (race condition)

### Key decisions made
- **UI on HTML layer, backend on GAS** — scanner and inventory share the same JS scope. No more postMessage for scan handling (`onFound()` calls `_handleInventoryScan()` directly)
- **Matcher-based callback system** — replaced key-based `_callHandlers` map with `_activeCallbacks` array of `{match, resolve, reject}` objects. Each call registers a matcher function that checks response type + op field
- **GAS bridge in doGet() session page** — the bridge code is inside the `doGet()` HTML template literal, running in the `gas-app` iframe. Uses `_respond()` helper that builds `{type, ...payload}` and sends via `window.top.postMessage(msg, _PARENT_ORIGIN)`

### Active context
- Branch: claude/responsive-ui-modes-bNxqC
- Repo version: v09.97r
- inventorymanagement.html: v01.22w, inventorymanagement.gs: v01.17g
- Plan file: `/root/.claude/plans/moonlit-gathering-walrus.md` (bridge routing fix plan)
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-08 10:09:00 AM EST
**Repo version:** v09.91r

### What was done
- **Designed and implemented inventory management system (v09.91r)** — full AHK feature parity Phases 1+2
- **Phase 1 — Backend**: Inventory CRUD functions in `inventorymanagement.gs`
- **Phase 2 — Frontend UI**: Inventory UI inside GAS session page (later migrated to HTML layer this session)

### Where we left off
- Inventory system implemented, responsive UI migration started next session

Developed by: ShadowAISolutions
