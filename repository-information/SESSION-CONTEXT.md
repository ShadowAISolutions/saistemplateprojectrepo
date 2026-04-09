# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-09 11:56:06 AM EST
**Repo version:** v10.31r

### What was done
- **Configured testauthhtml1 with its own GAS deployment (v10.31r)** — Updated DEPLOYMENT_ID (`AKfycbzPUkD3W7y3oGRRMKVt8Vl3ohGg_57SouUHKbbtYhtK7Ran-0SS4vVvft6_GR2YIRqDSg`) and SPREADSHEET_ID (`1x_1aG2H1x8JfDbq6-uY8Hdz6PvzIeZLFFEw4vNe4oes`) across config.json, .gs, .html (encoded `var _e`), and workflow deploy step webhook URL
- **Investigated nested HTML/iframe security** — Researched and confirmed the iframe embedding architecture is secure for HIPAA: browser same-origin policy isolates GAS iframe, `PARENT_ORIGIN` blocks postMessage to wrong pages, frame handshake guard blocks direct URL access, Google OAuth CLIENT_ID is origin-locked. A copied HTML page on another domain is a dead shell
- **Diagnosed stale data from old spreadsheet** — GAS CacheService was serving cached data from the old testauthgas1 spreadsheet (6-hour TTL on `'livedata_' + SHEET_NAME`). Writes went to the correct new spreadsheet (direct `SpreadsheetApp.openById()`), but reads returned stale cache. Resolved after an edit triggered `refreshDataCache()` on the new spreadsheet
- **Identified bootstrap problem with copied GAS projects** — When a GAS project is copied from another, the running code's `FILE_PATH` points to the source project's `.gs` file. The auto-deploy webhook pulls that file instead of the new one, perpetuating old config. Fix: manual paste of correct code into Apps Script editor (one-time bootstrap)

### Where we left off
- testauthhtml1 is fully configured with its own deployment and spreadsheet, working correctly
- Developer confirmed edits go to the correct spreadsheet; stale reads resolved after cache refresh

### Key decisions made
- **Separate GAS deployments per page** — each page needs its own DEPLOYMENT_ID for proper ACL enforcement, audit trails, and session isolation (shared deployment means shared CacheService, shared ACL column, shared audit logs)
- **CacheService stale data is a known bootstrap issue** — when switching SPREADSHEET_ID, the 6-hour cache TTL can serve old data. Any edit to the new spreadsheet triggers `refreshDataCache()` and self-heals

### Active context
- Branch: claude/debug-nested-html-loading-4tT5O
- Repo version: v10.31r
- testauthgas1.html: v04.00w, testauthgas1.gs: v02.61g
- testauthhtml1.html: v01.01w, testauthhtml1.gs: v01.01g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-09 11:03:05 AM EST
**Repo version:** v10.30r

### What was done
- Renamed testauth1 → testauthgas1 (v10.29r) — full environment rename across 17 files/directories, 67 content updates
- Created testauthhtml1 environment (v10.30r) — identical copy of testauthgas1 with all references renamed

### Where we left off
- Both environment operations merged to main. testauthhtml1 needed separate GAS deployment (resolved in next session)

Developed by: ShadowAISolutions
