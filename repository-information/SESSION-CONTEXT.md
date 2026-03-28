# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-28 03:36:13 PM EST
**Repo version:** v07.45r

### What was done
- **v07.35r** — Fixed HTML layer toggle race condition: replaced fragile save/restore display pattern with CSS class (`html-layer-hidden` with `!important`) — prevents elements from disappearing or overlapping when toggled repeatedly while auth code modifies inline display values
- **v07.36r** — Applied same CSS class fix to GAS layer toggle (`gas-layer-hidden`)
- **v07.37r** — Repositioned GAS `#version` from `left: 8px` to `left: 100px` to avoid overlap with HTML toggle buttons; hidden redundant GAS `#user-email` element
- **v07.38r** — Fixed data poll countdown not showing on first load (set `_lastDataPollTick` at start); reordered bottom-left: version → HTML toggle → GAS toggle; moved GAS `#user-email` to fixed position below HTML pill (`top: 35px, right: 8px`)
- **v07.39r** — Increased spacing between HTML and GAS toggles (GAS toggle to `left: 135px`)
- **v07.40r** — Rewrote poll countdown to count cleanly to 0s: removed 2000ms guard, switched `Math.floor` to `Math.ceil`, changed from `setInterval` to chained `setTimeout` so timing matches display
- **v07.41r** — Changed "Live Xs ago" to "Live Xs" and show "0s" instead of blank
- **v07.42r** — Removed unused `https://www.slant.co` from CSP `font-src` (Material Icons font comes from Google Sign-In library, not our code)
- **v07.43r** — Moved Sessions, Disclosures, My Data, Correction, Amendments, Disagree into admin dropdown submenu under ADMIN badge (only visible to admin users)
- **v07.44r** — Fixed admin dropdown hiding behind open panels (initially tried closing panels, then fixed properly in v07.45r)
- **v07.45r** — Raised `#user-pill` z-index from 9999 to 10012 so dropdown renders above panels without closing them; fixed delete row buttons not appearing until first poll by re-rendering table after `_ldCanEdit` is set

### Where we left off
- All changes committed and pushed (v07.45r)
- testauth1.html: v03.53w, testauth1.gs: v02.25g
- Admin dropdown submenu working — ADMIN badge clickable with ▾ indicator, dropdown appears above panels
- Bottom-left layout: `v02.25g` (GAS version) | `HTML` toggle | `GAS` toggle
- Poll countdown counts cleanly 15s → 14s → ... → 1s → 0s → "polling..."
- GAS changelog archive rotation happened (51/50 → 45/50 after rotating 2026-03-20 date group)
- CHANGELOG archive rotation happened (101/100 → 66/100 after rotating 2026-03-25 date group with 35 sections)

### Key decisions made
- **CSS class toggle instead of save/restore** — `display: none !important` via class avoids all race conditions with auth code modifying inline display values. Applied to both HTML and GAS layer toggles
- **`setTimeout` chain instead of `setInterval` for data poll** — each poll fires exactly `DATA_POLL_INTERVAL` ms after the previous poll *completes*, so the countdown display always matches actual timing
- **Admin dropdown over panels, not closing panels** — raised `#user-pill` z-index to 10012 (above panels at 10010) so dropdown renders on top without disrupting open panels
- **`fonts.gstatic.com` must stay in CSP** — required by Google Sign-In library for Material Icons; `slant.co` was the only unused entry and was removed
- **Re-render table after `_ldCanEdit` is set** — initial data load via `_initialData` runs before `ld-init` delivers permissions, so delete buttons need a re-render after permissions arrive

### Active context
- Branch: `claude/fix-overlapping-elements-y2o0C`
- Repo version: v07.45r
- testauth1.html: v03.53w, testauth1.gs: v02.25g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

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

Developed by: ShadowAISolutions
