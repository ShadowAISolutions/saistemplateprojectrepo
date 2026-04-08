# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-07 10:52:00 PM EST
**Repo version:** v09.90r

### What was done
- **Fixed GAS toggle not hiding admin dropdown and scan history (v09.87r)** — root cause: the parent page's GAS toggle button was never shown (`_showGasToggle()` was missing from `showApp()`), so the user was clicking the GAS iframe's internal toggle button which only hid 3 elements (`version`, `user-email`, `main-content`). Fix: added `_showGasToggle()` call, reverted to inline `style.display` approach (matching testauth1), expanded GAS-side `_gasLayerEls` array, commented out iframe's duplicate toggle button
- **Fixed templates for future projects (v09.88r)** — the same bugs existed in the auth HTML template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) and GAS auth template (`gas-minimal-auth-template-code.js.txt`). Fixed both templates and propagated to globalacl and programportal (both HTML and GAS)
- **Show Global ACL in Program Portal (v09.89r)** — `getPortalApps()` was skipping the globalacl column because its `#URL` was `SELF`. Removed the `SELF` exclusion since the card URL is built from `pageId + '.html'`, not from `#URL`
- **Exclude Program Portal from its own app list (v09.90r)** — added self-exclusion using `selfPageId` derived from `EMBED_PAGE_URL`

### Where we left off
- All changes pushed and auto-merging. GAS deployment still needs to happen (push .gs files via webhook) for the GAS-side changes to take effect on globalacl.gs, programportal.gs, and inventorymanagement.gs
- The scan-to-sheet pipeline (inventorymanagement) still needs GAS deployment for the `action=scanListener` handler and `processBarcodeScan()` to work

### Key decisions made
- The GAS toggle on the parent page should hide the entire `#gas-app` iframe (using `style.display = 'none'`), not individual elements inside it — this is the testauth1 pattern that works reliably
- The GAS iframe should NOT have its own toggle button (commented out) — the parent page's button handles it
- The GAS-side `_gasLayerEls` array should include admin elements as a fallback, but the primary mechanism is hiding the entire iframe from the parent
- `getPortalApps()` skips only `!authEnabled` columns and the portal's own page — `SELF` URL is no longer an exclusion criterion
- testauth1 is the reference implementation for how GAS toggle should work

### Active context
- Branch: claude/fix-gas-toggle-hiding-xqbUA (pushed, auto-merging)
- Repo version: v09.90r
- inventorymanagement.html: v01.15w, inventorymanagement.gs: v01.14g
- globalacl.html: v01.89w, globalacl.gs: v01.56g
- programportal.html: v01.96w, programportal.gs: v01.65g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-07 09:43:00 PM EST
**Repo version:** v09.86r

### What was done
- **QR Scanner + Inventory Management integration (v09.68r–v09.86r)** — added QR/barcode scanning to the inventory management page, split across HTML and GAS layers
- Deep research confirmed camera (`getUserMedia`) is blocked in GAS iframes (Google's sandbox, no workaround as of 2026). Discovered the **listener iframe bridge pattern** already in the codebase (heartbeat, signout, admin sessions) for parent→GAS communication
- **Architecture**: Camera (HTML layer, bare minimum) → detects barcode → sends via scanListener iframe bridge → `processBarcodeScan()` saves to "Scans" sheet → GAS layer polls every 15s with visible countdown for scan history display

### Where we left off
- GAS toggle still not hiding properly — fixed in the next session (v09.87r–v09.88r)

Developed by: ShadowAISolutions
