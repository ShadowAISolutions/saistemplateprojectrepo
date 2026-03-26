# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-26 12:20:49 AM EST
**Repo version:** v06.81r

### What was done
- **v06.66r** — Decoupled data polling from heartbeat pipeline in testauth1. Removed `liveData = getCachedData()` piggybacking from `processHeartbeat()`. Data poll now runs continuously and independently via `_startDataPoll()` at session establishment. Renamed all `_idle*` variables to `_data*` (e.g. `IDLE_DATA_POLL_INTERVAL` → `DATA_POLL_INTERVAL`). Heartbeat only does session extension now
- **v06.67r** — Fixed heartbeat timer not showing countdown when idle — removed separate `_heartbeatIdle` branch that showed static "◇ idle" text
- **v06.68r** — Added session authentication to data poll (HIPAA compliance). Created `processDataPoll(token)` function — lightweight session existence check via `getEpochCache()` before returning data. Added `gas-data-poll-ready` postMessage handshake pattern
- **v06.69r** — Created `DATA-POLL-ARCHITECTURE.md` reference document with architecture overview, cost comparison tables, HIPAA compliance summary
- **v06.70r–v06.71r** — Fixed data poll timer stuck at 0:00; attempted persistent iframe approach (failed — GAS sandbox drops parent→child postMessage)
- **v06.72r** — Changed heartbeat test interval from 30s to 60s
- **v06.73r** — Switched data poll from postMessage handshake to inline token-in-URL. GAS `doGet(action=getData)` reads token from URL parameter, calls `processDataPoll()` synchronously, embeds result as inline JS
- **v06.74r** — Fixed critical bug: `processDataPoll()` used `CacheService.getScriptCache()` instead of `getEpochCache()` — session lookup always failed due to missing epoch prefix
- **v06.75r–v06.78r** — Fixed data poll timer display: added 2s minimum "polling..." display window (GAS inline response arrives <1s, faster than 1s timer tick)
- **v06.79r** — Updated `DATA-POLL-ARCHITECTURE.md` to reflect final token-in-URL implementation, added token security assessment and timer display logic sections
- **v06.80r** — Added GAS quota limits section with free vs Workspace ceilings and quota headroom analysis table
- **v06.81r** — Added simultaneous execution limit analysis (30 per deploying account, shared across all GAS apps)

### Where we left off
- All changes committed and merged to main
- testauth1 data poll is **fully working** with:
  - Continuous data polling every 15s (independent of heartbeat)
  - Session-authenticated via `processDataPoll(token)` using `getEpochCache()`
  - Token passed as URL parameter (not postMessage — GAS sandbox blocks parent→child)
  - Timer shows "▷ polling..." for 2s, then countdown from ~13s
  - "Live Xs ago" connection indicator working correctly
  - Heartbeat fires every 60s (test) for session extension only — no data delivery
  - HIPAA compliant across all 4 relevant §164.312 sections

### Key decisions made
- **Separated pipelines permanently** — heartbeat = session extension, data poll = data freshness. Different cadences, independent tuning, fault isolation
- **URL parameter for data poll token** — postMessage handshake failed because Google's GAS iframe sandbox drops parent→child messages. Token in URL is HTTPS-encrypted, acceptable tradeoff vs HIPAA violation
- **`getEpochCache()` mandatory** — all session operations MUST use `getEpochCache()`, not `CacheService.getScriptCache()` directly. The epoch prefix is required for session key lookup
- **2s minimum polling display** — timer checks `sinceDataPoll < 2` in addition to `_dataPollInFlight` to guarantee visibility of the polling state
- **Production recommendations** — heartbeat: 5min (300s), session: 15min (900s), absolute: 8hr (28800s), data poll: 15s. Free tier supports ~50 viewers, Workspace handles 100+

### Active context
- Branch: `claude/fix-testauth1-polling-CiD9R`
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`
- Reference doc: `repository-information/DATA-POLL-ARCHITECTURE.md` — comprehensive architecture, quota, HIPAA, and scaling reference

## Previous Sessions

**Date:** 2026-03-25 09:23:26 PM EST
**Repo version:** v06.65r

### What was done
- **v06.54r–v06.57r** — Implemented CacheService-based private data serving for rndlivedata (replaced public Visualization API). Added `refreshDataCache()`, `getCachedData()`, `onEditInstallable()` to rndlivedata.gs. Data is cached server-side with 6h TTL, served to viewers piggybacked on existing heartbeat calls (zero additional GAS quota per viewer). Fixed CSP and iframe sandbox issues
- **v06.58r–v06.60r** — Brought live data table into testauth1 (auth-gated page). Added `refreshDataCache()`, `getCachedData()`, `onEditInstallable()`, `writeCell()` to testauth1.gs. Piggybacked `liveData` on existing heartbeat response (HMAC-signed). Added full table/dashboard UI with sortable columns, cell change detection (green flash), double-click cell editing, connection status indicator, view toggle
- **v06.61r** — Added idle data polling (Option C) — when user is idle, lightweight `getCachedData()` polls replace the heavier heartbeat, keeping data fresh at ~10x lower server cost. Activity-gated heartbeat only fires when user activity detected
- **v06.62r–v06.65r** — Decoupled idle poll interval, added countdown timer, separated Data Poll into its own row, made all timer rows always visible

### Where we left off
- All changes committed and merged to main
- testauth1 live data table fully working with heartbeat-piggybacked data + idle data polling

Developed by: ShadowAISolutions
