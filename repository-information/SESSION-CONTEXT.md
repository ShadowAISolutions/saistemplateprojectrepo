# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-28 01:10:20 AM EST
**Repo version:** v07.34r

### What was done
- **v07.22r–v07.29r** — Added add-row "Sending..." button feedback, optimistic rendering for add/delete rows, empty-field gate for Add Row button, "Deleting..." row overlay, data poll safety timeout, fixed "Sending..." overlay not clearing on GAS write confirmation, fixed Add Row button not detecting input during Sending state
- **v07.30r** — **Major architecture migration**: moved entire Live Data UI (table, add-row, delete-row, cell editing, dashboard, sorting, overlays, connection status) from HTML layer to GAS layer for HIPAA compliance. Data operations now use `google.script.run` directly instead of postMessage relay. Added `getAuthenticatedData()` server function. HTML layer sends `ld-init` postMessage with auth context to activate GAS UI
- **v07.31r** — Restored data poll countdown timer across GAS/HTML boundary via `gas-datapoll-state` postMessage
- **v07.32r** — Added HTML and GAS layer visibility toggles (small buttons that hide/show all elements on their respective layers)
- **v07.33r** — Moved data poll countdown from HTML session timers to GAS layer header (inline next to connection status), removed the cross-layer postMessage bridge
- **v07.34r** — Fixed layer toggles staggering issue — switched from `visibility:hidden` to `display:none` with stored original display values

### Where we left off
- All changes committed and pushed (v07.34r)
- The **Live Data UI now lives entirely on the GAS layer** — the HTML layer only handles auth, session management, GAS iframe lifecycle, version polling, and splash screens
- Data poll countdown is in the GAS Live Data header next to connection status
- HTML and GAS layer toggles work with simultaneous hide/show
- The GAS script needs to be deployed (webhook) for changes to take effect — the auto-merge workflow handles this

### Key decisions made
- **All data UI belongs on the GAS layer** — this is a blueprint for production clinic/healthcare pages. For HIPAA compliance, everything that renders or interacts with data runs inside the GAS sandbox iframe. The HTML layer is auth-only
- **`google.script.run` instead of postMessage** — data operations (write-cell, add-row, delete-row, data poll) call GAS server functions directly from the GAS UI. No more postMessage relay through the HTML layer
- **`display:none` for toggles, not `visibility:hidden`** — avoids staggered hide/show caused by different CSS transition speeds on different elements
- **Data poll countdown renders on GAS layer** — no need for cross-layer state messaging; the GAS UI tracks its own poll state and renders the countdown directly

### Active context
- Branch: `claude/fix-add-row-delay-FbSo6`
- Repo version: v07.34r
- testauth1.html: v03.47w, testauth1.gs: v02.18g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-27 09:35:11 PM EST
**Repo version:** v07.21r

### What was done
- **v07.19r–v07.21r** — Attempted fetch-based token exchange (broke sign-in), attempted iframe replacement DOM clearing (broke sandbox), reverted both. Confirmed console errors are Google infrastructure noise

### Where we left off
- All changes committed and pushed (v07.21r) — reverted to working state

Developed by: ShadowAISolutions
