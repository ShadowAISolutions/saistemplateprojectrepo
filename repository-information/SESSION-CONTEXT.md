# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-25 09:23:26 PM EST
**Repo version:** v06.65r

### What was done
- **v06.54r–v06.57r** — Implemented CacheService-based private data serving for rndlivedata (replaced public Visualization API). Added `refreshDataCache()`, `getCachedData()`, `onEditInstallable()` to rndlivedata.gs. Data is cached server-side with 6h TTL, served to viewers piggybacked on existing heartbeat calls (zero additional GAS quota per viewer). Fixed CSP and iframe sandbox issues
- **v06.58r–v06.60r** — Brought live data table into testauth1 (auth-gated page). Added `refreshDataCache()`, `getCachedData()`, `onEditInstallable()`, `writeCell()` to testauth1.gs. Piggybacked `liveData` on existing heartbeat response (HMAC-signed). Added full table/dashboard UI with sortable columns, cell change detection (green flash), double-click cell editing, connection status indicator, view toggle
- **v06.61r** — Added idle data polling (Option C) — when user is idle, lightweight `getCachedData()` polls replace the heavier heartbeat, keeping data fresh at ~10x lower server cost. Activity-gated heartbeat only fires when user activity detected
- **v06.62r** — Decoupled idle poll interval to its own config variable `IDLE_DATA_POLL_INTERVAL` (15s), separate from `HEARTBEAT_INTERVAL` (30s)
- **v06.63r** — Added idle poll countdown timer showing when next data poll fires
- **v06.64r** — Separated Data Poll countdown into its own row in auth-timers panel (user requested separate row, not merged with heartbeat)
- **v06.65r** — Made all timer rows always visible (Absolute, Session, Heartbeat, Data Poll) — Data Poll shows `--` when idle polling is not active instead of being hidden

### Where we left off
- All changes committed and merged to main
- testauth1 live data table is **fully working** with:
  - Heartbeat-piggybacked data updates (every 30s when active)
  - Idle data polling via dedicated hidden iframe (every 15s when idle)
  - Cell editing via double-click (writes back to spreadsheet)
  - Auth-timers panel shows 4 rows: Absolute, Session, Heartbeat, Data Poll
  - `onEditInstallable` trigger needs to be set up in Apps Script editor (run `installEditTrigger()` once)

### Key decisions made
- **CacheService pattern** for private spreadsheet data — spreadsheet stays private, data cached server-side, viewers get updates piggybacked on existing GAS calls
- **Dedicated hidden iframe** for idle data polls — same pattern as heartbeat iframe, bypasses GAS sandbox origin mismatch (parent→child postMessage doesn't work through Google's nested sandbox)
- **Activity-gated heartbeat** — heartbeat only fires if user activity detected; when idle, lightweight data-only poll takes over (~10x cheaper per call)
- **Always-visible timer rows** — user prefers all 4 rows visible at all times, showing `--` when inactive rather than hiding/showing dynamically

### Active context
- Branch: `claude/rndlivedata-private-access-5kPt2`
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-25 02:30:56 PM EST
**Repo version:** v06.53r

### What was done
- **v06.50r** — Converted RND Live Data from REST API chat/messaging app to live real-time spreadsheet data viewer using Google Visualization API. Replaced entire GAS PROJECT SECTION with presence-only functions (writePresence, getActiveUsers). Replaced HTML PROJECT SECTION with dark-themed dual-view data viewer (Table View with sortable columns + Dashboard View with metric cards). Added connection status indicator, user presence tracking, config hint overlay, cell-level change detection with green flash animation. Architecture: zero GAS execution for data reads (client-side Visualization API), GAS only for presence writes via iframe heartbeat
- **v06.51r** — Fixed CSP `script-src` — added `https://www.google.com` (Google Charts dynamically loads visualization library from this domain)
- **v06.52r** — Fixed CSP `style-src` — added `https://www.gstatic.com` (Google Charts loads CSS during initialization; blocking it caused `google.charts.load()` to fail silently). Also added `font-src`, and `https://www.shadowaisolutions.com` to `img-src`
- **v06.53r** — Fixed CSP `connect-src` — added `https://accounts.google.com` and `https://www.google.com` (Visualization Query XHR redirects through Google's auth endpoint)

### Where we left off
- All changes committed and merged to main
- RND Live Data page is **working** — confirmed by user after publishing the spreadsheet to web
- User asked if it can work without "Anyone with the link" sharing — answered no, the client-side Visualization API requires public access. Alternatives discussed: GAS proxy (costs GAS executions), Sheets API v4 with API key (requires GCP setup), hybrid cache approach
- The page requires the Google Spreadsheet to be: (1) Published to web, AND (2) Shared as "Anyone with the link can view"

Developed by: ShadowAISolutions
