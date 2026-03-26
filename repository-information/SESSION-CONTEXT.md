# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-26 09:16:21 AM EST
**Repo version:** v06.88r

### What was done
- **v06.82r–v06.86r** (prior session) — Added dynamic sign-in stage indicators under the session spinner in applicationportal.html's auth sign-in flow. Evolved from simple subtitle updates → checklist format → descriptive labels → elapsed timing per stage. Then added equivalent checklists for sign-out and reconnecting flows. All three checklists (sign-in, sign-out, reconnecting) completed for applicationportal.html
- **v06.87r** — Propagated all three checklists (sign-in, sign-out, reconnecting) to testauth1.html (v03.08w) and globalacl.html (v01.28w). Both pages use `SSO_PROVIDER: false` so their reconnecting checklists have 2 stages instead of 3 (no "Preparing sign-in for linked apps")
- **v06.88r** — Added all three checklists to the auth HTML template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) so new pages inherit them automatically. Made the reconnecting checklist dynamic based on `SSO_PROVIDER` config — 3 stages when true, 2 when false. The SSO reconnect stage is in the HTML but hidden by default; `showReconnecting()` shows/hides it dynamically

### Where we left off
- All changes committed and merged to main
- Auth template now includes full checklist infrastructure:
  - CSS for all three checklist types (pending ○ gray, active ● blue, done ✓ green, elapsed time)
  - HTML checklists in sign-in wall (5 stages), sign-out wall (5 stages), reconnecting wall (2-3 stages dynamic)
  - Full JS functions: `_stageMap`, `_formatStageTime()`, `_setStageTime()`, `_updateSignInStage()`, `_completeAllStages()`, sign-out functions, reconnect functions
  - Sign-out hooks in `performSignOut()` at each phase
  - Stage completions in `gas-auth-ok` handler (both `_directSessionLoad` and `_pendingSessionShow` paths)
  - SSO override in `attemptSSOAuth()` — hides checklist, shows "Signing in via [Source]" subtitle
- Existing auth pages (applicationportal, testauth1, globalacl) have checklists as PROJECT code — they were not affected by the template update

### Key decisions made
- **Checklists are template code, not project code** — added to the TEMPLATE region of the auth template so all future auth pages get them automatically. Existing pages keep their PROJECT-marked versions
- **Dynamic SSO stage** — the `rc-stage-sso` HTML element is always present but hidden with `style="display:none;"`. `showReconnecting()` shows/hides it based on `HTML_CONFIG.SSO_PROVIDER`. The `_rcStageOrder` array is also built dynamically at init time
- **`_setStageTime()` checks all three time maps** — `_stageStartTimes || _soStageStartTimes || _rcStageStartTimes` — works because `var` declarations are hoisted in JS
- **Sign-in `_stageMap` maps text strings to element IDs** — display text comes from HTML `<li>` content, not the map. Multiple text strings can map to the same stage (e.g. both "Verifying your identity…" and "Sending credentials…" map to `stage-verifying`)

### Active context
- Branch: `claude/document-signin-steps-lNXg1`
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

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

Developed by: ShadowAISolutions
