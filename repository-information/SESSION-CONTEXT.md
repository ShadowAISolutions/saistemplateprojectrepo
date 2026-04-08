# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-07 09:43:00 PM EST
**Repo version:** v09.86r

### What was done
- **QR Scanner + Inventory Management integration (v09.68r–v09.86r)** — added QR/barcode scanning to the inventory management page, split across HTML and GAS layers
- Deep research confirmed camera (`getUserMedia`) is blocked in GAS iframes (Google's sandbox, no workaround as of 2026). Discovered the **listener iframe bridge pattern** already in the codebase (heartbeat, signout, admin sessions) for parent→GAS communication
- **Architecture**: Camera (HTML layer, bare minimum) → detects barcode → sends via scanListener iframe bridge → `processBarcodeScan()` saves to "Scans" sheet → GAS layer polls every 15s with visible countdown for scan history display
- Scans saved to a "Scans" sheet (auto-created on first scan) with Timestamp/Value/Format columns
- GAS-side scan history with polling (testauth1 pattern): 15s `setTimeout` chain, visible `▷ 12s` countdown, optimistic data support
- Delete button on each scan row with testauth1-style confirmation modal
- HTML-layer optimistic "last scan" notification with "saving..." → "✔ saved" feedback
- Camera viewport uses 4:3 aspect ratio for compact mobile layout
- Multiple iterations fixing layer visibility: scanner page respects HTML/GAS toggles, GAS toggle switched from inline `style.display` to `classList.add('html-layer-hidden')` with `!important` to defeat auth flow's inline style resets

### Where we left off
- **GAS toggle still not hiding properly** — user reports admin dropdown and scan history still visible when both toggles are off. The latest fix (v09.86r) switched to `classList.add('html-layer-hidden')` which uses `display:none!important` — this should work but needs verification. If it still fails, the root cause may be deeper (possibly the gas-app iframe being recreated or a different iframe showing the content)
- The `action=scanListener` handler and `processBarcodeScan()` server function are in place but the GAS deployment needs to happen (push the .gs file to GAS via webhook) for the scan-to-sheet pipeline to work
- CHANGELOG archive rotation completed: 33 sections from 2026-04-05 moved to archive (101→68, now at 83)

### Key decisions made
- Scanner needs Sheets access in the future, so the architecture keeps the **bare minimum** on HTML (camera + detection loop only), with result UI, history, classification, and actions on the GAS layer
- Used the listener iframe bridge pattern (`action=scanListener`) for HTML→GAS communication — the same proven pattern as heartbeat/signout/adminSessions
- Optimistic scan result displayed on the HTML layer (below camera) since parent can't postMessage into the GAS iframe directly
- GAS doGet fixed-position elements (admin badge, dropdown, panel, user-email) repositioned with `calc(min(100vw,480px)*0.75 + Npx)` to appear below the camera area

### Active context
- Branch: claude/add-qr-scanner-inventory-sTJES (pushed, auto-merging)
- Repo version: v09.86r
- inventorymanagement.html: v01.14w, inventorymanagement.gs: v01.13g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-07 05:16:00 PM EST
**Repo version:** v09.67r

### What was done
- **v09.65r–v09.67r** — Inventory Management GAS project setup + Dynamic Program Portal
- Set up the Inventory Management GAS project via `setup-gas-project.sh` (v09.65r)
- Fixed cross-project admin secret distribution — globalacl now auto-propagates the shared secret to new projects during registerSelfProject (v09.66r)
- **Dynamic Program Portal (v09.67r)** — replaced the hardcoded `PORTAL_APPS` array in programportal.gs with a dynamic `getPortalApps()` function that reads from the Master ACL spreadsheet

### Where we left off
- No code changes — purely informational session

Developed by: ShadowAISolutions
