# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-08 12:50:00 PM EST
**Repo version:** v10.01r

### What was done
- **Add New Item UX overhaul (v09.98r / v01.23w)** — Removed `readonly` from barcode field, added "Add Manually" button, added barcode validation, auto-offer new item when scanning unknown barcode in ADD/SUB mode
- **Bridge fix: evt.source (v09.99r / v01.24w)** — Discovered `gasApp.contentWindow.postMessage()` targets Google's outer shell frame, not the inner GAS sandbox. Fixed `_sendToGas()` to use `_gasBridgeSource` captured from `evt.source` of `inventory-bridge-ready`
- **Desktop interactivity fix (v10.00r / v01.25w)** — Added `pointer-events: none` to GAS iframe (it has no visible UI). Added robust bridge with `gasApp.contentWindow` fallback + opportunistic `evt.source` capture from any inventory/scan message
- **Desktop click-through + allowlist fix (v10.01r / v01.26w)** — Added opaque `background: #0d1117` to `#inv-panel` desktop CSS (fixed click passthrough on transparent fixed element). Added all 11 inventory/scan bridge message types to `_KNOWN_GAS_MESSAGES` allowlist (stopped `_reportSecurityEvent` from flooding page with hidden iframes per unknown message)

### Where we left off
- **STILL NOT WORKING ON DESKTOP** — user reports buttons are hoverable but clicking does nothing, "Waiting for connection..." persists. The v10.01r fixes (background + allowlist) have just been pushed but user hasn't confirmed if they resolved the issue yet
- **Mobile (Android Chrome) works fine** — all features functional on phone
- **Root causes addressed so far**: (1) `gasApp.contentWindow` vs `evt.source` — fixed, (2) `pointer-events` on GAS iframe — fixed, (3) no background on desktop panel — fixed, (4) missing allowlist entries — fixed
- **If still broken after v10.01r**, the next debugging step should be **Playwright browser testing** (webapp-testing skill) to capture actual browser console output and see: (a) whether `inventory-bridge-ready` message arrives at the HTML listener, (b) whether `_bridgeReady` gets set, (c) whether `_gasBridgeSource` is non-null, (d) whether `_sendToGas` successfully posts messages. The issue may be Chrome-specific compositor behavior with nested fixed-position iframes, or the GAS doGet() HTML's handshake guard (line 2936) destroying the inventory bridge before it sends `inventory-bridge-ready`

### Key decisions made
- **evt.source pattern** — all GAS communication must use `event.source` captured from incoming messages, not `gasApp.contentWindow`. This is documented at line 2061 of inventorymanagement.html
- **GAS iframe is pointer-events:none** — the iframe is a backend communication channel only, no visible UI to click
- **Allowlist must include all project message types** — `_KNOWN_GAS_MESSAGES` at line 1672 needs entries for every postMessage type used by project-specific bridges
- **Desktop panel needs opaque background** — `position: fixed` elements overlapping iframes need explicit backgrounds to create proper hit targets in Chrome's compositor

### Active context
- Branch: claude/fix-inventory-new-items-4U4jn
- Repo version: v10.01r
- inventorymanagement.html: v01.26w, inventorymanagement.gs: v01.17g (GAS not modified this session)
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-08 11:52:00 AM EST
**Repo version:** v09.97r

### What was done
- Responsive UI modes, major architecture migration (UI to HTML layer), PostMessage bridge, layout fixes, handler routing fixes (v09.92r-v09.97r)

### Where we left off
- CRUD operations not resolving — Add New Item modal staying open. Led to this session's fixes

Developed by: ShadowAISolutions
