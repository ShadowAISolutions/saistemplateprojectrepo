# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 83/100`

## [Unreleased]

## [v06.74r] — 2026-03-25 11:30:27 PM EST

> **Prompt:** "nope unfortunately the data poll is not pulling the fresh data from the spreadsheet still. think deeply"

### Fixed
- Fixed data poll session validation always failing — `processDataPoll()` used `CacheService.getScriptCache()` directly instead of `getEpochCache()`, causing cache key mismatch (sessions stored with epoch prefix `e0_session_...` but lookup searched for `session_...` without prefix)
- Fixed `live-data` HTML handler not clearing `_dataPollInFlight` on error responses — flag now clears on any `live-data` message (success or failure), preventing 15s timeout delays between retries

#### `testauth1.gs` — v02.06g
##### Fixed
- Data refresh now correctly validates your session before delivering updates

#### `testauth1.html` — v03.02w
##### Fixed
- Data refresh recovers faster when the server reports an error

## [v06.73r] — 2026-03-25 11:21:12 PM EST

> **Prompt:** "i see, i just tested to see if the data poll is even updating and its not working anymore. i think the last time i tried it was before i separated it from the heartbeat"

### Fixed
- Data poll now uses inline token-in-URL pattern instead of postMessage handshake — parent→child postMessage doesn't work through Google's nested GAS iframe wrapper, causing `processDataPoll` to never receive the token
- GAS `?action=getData` handler now reads token from URL parameter and calls `processDataPoll()` server-side, returning result as inline JavaScript (same pattern as the original working unauthenticated version, but with session validation)
- Removed `gas-data-poll-ready` message type, `_dataPollIframeReady`, and `_dataPollIframeOrigin` — no longer needed without the postMessage handshake
- Reverted data poll iframe to simple reload-per-poll (persistent iframe approach was also incompatible with GAS sandbox)

#### `testauth1.gs` — v02.05g
##### Fixed
- Data refresh now works correctly with session authentication

#### `testauth1.html` — v03.01w
##### Fixed
- Data refresh now updates reliably on every poll cycle

## [v06.72r] — 2026-03-25 11:11:53 PM EST

> **Prompt:** "make the heartbeat every minute for now while we test"

### Changed
- Increased heartbeat test interval from 30s to 60s for testing

#### `testauth1.html` — v03.00w
##### Changed
- Minor internal improvements

## [v06.71r] — 2026-03-25 11:04:58 PM EST

> **Prompt:** "the data poll lolling seems to be resetting its timer, but its only happening after the heartbeat is going off"

### Fixed
- Data poll iframe now persists across polls instead of being reloaded every 15s — reloading the iframe aborted pending `google.script.run` calls, causing responses to never arrive unless a heartbeat warmed up the GAS context first
- Added `_dataPollIframeReady` flag and `_dataPollIframeOrigin` to track iframe state — subsequent polls send token via `postMessage` to the existing iframe instead of reloading it
- `_stopDataPoll()` now resets `_dataPollIframeReady` and `_dataPollIframeOrigin` for clean teardown

#### `testauth1.html` — v02.99w
##### Fixed
- Data refresh now works reliably — no longer requires a heartbeat to trigger

## [v06.70r] — 2026-03-25 10:57:30 PM EST

> **Prompt:** "the data poll is out of wack, it says polling but then the timer goes to 0 the whole time. for some reason it also says disconnected, not sure what that means"

### Fixed
- Data poll safety timeout now resets `_lastDataPollTick` when clearing the in-flight flag — prevents the countdown timer from showing 0:00 after a failed/slow response
- "Disconnected" indicator was a symptom of data poll responses not arriving — the safety timeout fix ensures the timer recovers gracefully between retries

#### `testauth1.html` — v02.98w
##### Fixed
- Data refresh countdown timer no longer gets stuck at 0:00 after a slow server response

## [v06.69r] — 2026-03-25 10:41:59 PM EST

> **Prompt:** "put these useage charts and explanations into a document for my reference"

### Added
- Added `DATA-POLL-ARCHITECTURE.md` reference document — architecture overview, per-call cost comparison, quota usage by activity state, scaling tables, HIPAA compliance summary, and configuration tuning guidance

## [v06.68r] — 2026-03-25 10:23:52 PM EST

> **Prompt:** "yes implement this fix"

### Security
- Data poll endpoint now requires session authentication — `processDataPoll(token)` validates session in CacheService before returning data (HIPAA §164.312(a)(1) Access Control, §164.312(d) Person/Entity Authentication)
- Data poll uses Phase 7 postMessage pattern — token never appears in URL parameters
- Data poll client-side now checks `loadSession().token` before sending requests

### Changed
- `?action=getData` GAS handler now returns a postMessage listener page (same pattern as heartbeat/signout) instead of directly calling `getCachedData()`
- Added `processDataPoll(token)` server-side function — lightweight session validation (CacheService lookup only, no HMAC regen, no session extension)
- Added `gas-data-poll-ready` message type to allowed messages and HMAC exemption list
- Added `gas-data-poll-ready` handler in `_processVerifiedMessage` to send token via postMessage

#### `testauth1.gs` — v02.04g
##### Security
- Data poll endpoint now validates session token before returning spreadsheet data

#### `testauth1.html` — v02.97w
##### Security
- Data requests now include session authentication — unauthenticated data access is no longer possible

## [v06.67r] — 2026-03-25 10:05:15 PM EST

> **Prompt:** "im noticing that when the heartbeat is idle, its not showing a countdown timer anymore until we make it ready"

### Fixed
- Heartbeat timer now shows countdown even when idle — previously displayed static "◇ idle" text with no countdown until activity resumed

#### `testauth1.html` — v02.96w
##### Fixed
- Heartbeat timer countdown now remains visible during idle state — shows time until next tick with "◇ idle" indicator

## [v06.66r] — 2026-03-25 09:47:45 PM EST

> **Prompt:** "in the testauth1, it seems like the data poll is happening both in the heartbeat or in the data poll, i think it should always be done with the data poll rather than flipping back and forth between the pipelines. what do you think?"

### Changed
- Decoupled data polling from heartbeat pipeline in testauth1 — data poll now runs continuously and independently, heartbeat only handles session extension
- Removed `liveData` piggybacking from `processHeartbeat()` in testauth1.gs — heartbeat response no longer carries spreadsheet data
- Removed `data.liveData` extraction from heartbeat OK handler in testauth1.html
- Data poll starts at session establishment and runs on its own interval regardless of user activity state
- Renamed all `_idle*` variables/functions to `_data*` (e.g. `_idleDataPollInterval` → `_dataPollInterval`, `IDLE_DATA_POLL_INTERVAL` → `DATA_POLL_INTERVAL`) since the poll is no longer idle-only
- Data poll timer display no longer depends on `_heartbeatIdle` — shows countdown whenever poll is active

#### `testauth1.gs` — v02.03g
##### Changed
- Heartbeat response no longer carries spreadsheet data — removed `liveData` piggybacking from `processHeartbeat()`

#### `testauth1.html` — v02.95w
##### Changed
- Data polling now runs continuously via dedicated pipeline, independent of heartbeat activity state
- Data poll timer always shows countdown when active, not just when idle

## [v06.65r] — 2026-03-25 09:17:26 PM EST

> **Prompt:** "i want each row always visible dont hide any"

### Changed
- All timer rows (Absolute, Session, Heartbeat, Data Poll) are now always visible in the auth-timers panel — Data Poll shows `--` when idle polling is not active instead of being hidden

#### `testauth1.html` — v02.94w
##### Changed
- All timer rows are now always visible — the Data Poll row shows `--` when inactive instead of disappearing

## [v06.64r] — 2026-03-25 09:11:17 PM EST

> **Prompt:** "i meant as a separate row, right now i still only see the heartbeat."

### Changed
- Data poll countdown now shows as its own dedicated row (`Data Poll:`) in the auth-timers panel, separate from the heartbeat row — appears only when idle polling is active and disappears when regular heartbeat resumes

#### `testauth1.html` — v02.93w
##### Changed
- When idle, the timer now counts down to the next background data poll so you can see exactly when fresh data will arrive

## [v06.63r] — 2026-03-25 09:05:04 PM EST

> **Prompt:** "just like how the heartbeat has a visible countdown, make the idle one also have its own visible countdown so its easy to distinguish whats happening at any one time"

### Changed
- Idle data poll now shows its own countdown timer (`◇ Xs idle`) based on `IDLE_DATA_POLL_INTERVAL` (15s), distinct from the heartbeat countdown (30s) — makes it easy to see which pipe is active and when the next poll fires

#### `testauth1.html` — v02.92w
##### Changed
- When idle, the heartbeat timer shows a countdown to the next data poll (`◇ 12s idle`) instead of the heartbeat interval, so you can see exactly when the next background data fetch will fire

## [v06.62r] — 2026-03-25 09:00:26 PM EST

> **Prompt:** "yes decouple it to its own config variable and make the idle poll every 15 seconds"

### Changed
- Decoupled idle data poll interval from heartbeat interval — new `IDLE_DATA_POLL_INTERVAL` config variable set to 15s (heartbeat remains at 30s), giving 2x data freshness while idle at negligible additional cost

#### `testauth1.html` — v02.91w
##### Changed
- Idle data poll now runs every 15 seconds (was 30s tied to heartbeat) — data stays fresher when you step away, with its own independent config variable

## [v06.61r] — 2026-03-25 08:47:57 PM EST

> **Prompt:** "i just tried it, but when its polling data on idle, its not updating the table data. only when doing the traditional heartbeat is it updating the table data properly. in case it helps the console information when idle polling is what is in the screenshot"

### Fixed
- Fixed idle data poll not updating the table — `gasApp.contentWindow.postMessage()` was being dropped by Google's GAS sandbox origin validation; replaced with a dedicated `?action=getData` iframe (same proven pattern as the heartbeat iframe) that calls `getCachedData()` server-side and postMessages the result back to the parent
- Removed unused `get-live-data` postMessage handler from GAS main iframe — the getData action iframe handles data fetching entirely server-side

#### `testauth1.gs` — v02.02g
##### Fixed
- Added `?action=getData` handler to `doGet()` — returns lightweight HTML page that calls `getCachedData()` and sends data back via `top.postMessage()`
- Removed `get-live-data` message handler from main iframe HTML — no longer needed since idle data poll uses its own iframe

#### `testauth1.html` — v02.90w
##### Fixed
- Idle data poll now uses a dedicated hidden iframe (`#gas-data-poll`) instead of `gasApp.contentWindow.postMessage()` — bypasses GAS sandbox origin mismatch that was silently dropping messages

## [v06.60r] — 2026-03-25 07:14:40 PM EST

> **Prompt:** "go ahead and implement it. make some sort of visual indication on the heartbeat so we can tell the difference between the two pipes firing (also to make sure that both arent happening at the same time)"

### Changed
- Decoupled live data polling from auth heartbeat (Option C) — when idle, a lightweight `getCachedData()` call replaces the full heartbeat, reducing server cost ~10x per idle viewer while keeping data live
- Added visual heartbeat indicator to distinguish active heartbeat (`▶ sending...`) from idle data poll (`◇ polling data...`) and idle countdown (`◇ idle`)

#### `testauth1.html` — v02.89w
##### Changed
- Data stays live even when idle — lightweight background poll replaces the activity-gated heartbeat for data updates
- Heartbeat timer now shows `▶` for active heartbeats and `◇` for idle data polling, so you can tell which pipe is firing

## [v06.59r] — 2026-03-25 05:56:05 PM EST

> **Prompt:** "2 things, 1 , the heartbeat is taking 15 seconds to send instead of 2 or 3 before this change. 2 , its not updating the changes on edit. i already have the trigger installed and the auth scope is there"

### Fixed
- Fixed heartbeat taking ~15s instead of ~2-3s — removed unnecessary CacheService TTL re-up write on every read and moved liveData outside the HMAC-signed payload to reduce serialization overhead
- Fixed live data not updating after spreadsheet edits — liveData nested objects caused JSON.stringify mismatches between GAS V8 and browser engines, breaking HMAC signature verification and silently dropping heartbeat messages

#### `testauth1.html` — v02.88w
##### Fixed
- Data now updates correctly when the spreadsheet is edited — fixed a signature verification issue that was silently blocking data updates

#### `testauth1.gs` — v02.01g
##### Fixed
- Heartbeat response time restored to normal — live data is no longer included in the security signature computation, reducing processing time

## [v06.58r] — 2026-03-25 05:41:07 PM EST

> **Prompt:** "alright, write up this idea of live data editing with the intention of applying it for the testauth1 environment in a prompt format to use with you in a new session, including all context to begin coding. you can show the same type of data table we made in the rnd live data in the testauth1 instead of the giant 1 in the center."

### Added
- Live data table with cell editing in testauth1 — private spreadsheet data served via CacheService, piggybacked on the existing auth heartbeat at zero additional GAS quota
- Cell editing with RBAC enforcement — double-click to edit, writes gated by 'write' permission via `checkPermission()`
- Dashboard card view with change detection (green flash animation on updated cells/cards)
- Sortable table columns (click header to toggle ascending/descending)
- Connection status indicator with staleness detection (live/updating/disconnected states)

#### `testauth1.html` — v02.87w
##### Added
- Live data table replacing the placeholder content area — sortable columns, cell change detection with green flash animation
- Dashboard card view with automatic change highlighting
- Connection status indicator showing data freshness
- Double-click cell editing for users with write permission
- View toggle between Table and Dashboard layouts

#### `testauth1.gs` — v02.00g
##### Added
- CacheService-based live data serving — `refreshDataCache()`, `getCachedData()` with self-healing cache pattern
- Installable onEdit trigger support — `onEditInstallable()` and `installEditTrigger()` for instant cache refresh on spreadsheet edits
- `writeCell()` function with session validation, RBAC permission check, and audit logging
- Live data piggybacked on heartbeat response — `processHeartbeat()` now includes `liveData: getCachedData()` in its signed payload

## [v06.57r] — 2026-03-25 05:01:08 PM EST

> **Prompt:** "update the __gas-project-creator to include this change for all scripts moving forward__"

### Changed
- Added `script.scriptapp` OAuth scope to the GAS project creator's `appsscript.json` manifest template so all new projects include the permission needed for installable triggers

#### `gas-project-creator.html` — v01.28w
##### Changed
- Manifest template now includes the `script.scriptapp` scope for installable trigger support

## [v06.56r] — 2026-03-25 04:52:58 PM EST

> **Prompt:** "yes implement it"

### Fixed
- Fixed onEdit trigger not firing — simple triggers don't work on standalone GAS scripts; switched to installable trigger with one-time `installEditTrigger()` setup function

#### `rndlivedata.gs` — v01.06g
##### Fixed
- Data now refreshes instantly on spreadsheet edits (installable trigger replaces non-functional simple trigger)
##### Added
- One-time setup function to connect the edit trigger to the spreadsheet

#### `rndlivedata.html` — v01.07w
##### Changed
- Setup instructions updated with trigger installation step

## [v06.55r] — 2026-03-25 04:36:47 PM EST

> **Prompt:** "yes implement this"

### Changed
- Replaced time-driven trigger with edit-triggered + self-healing cache for rndlivedata
- Cache TTL extended to 6 hours with heartbeat-based TTL re-up (testauth1 pattern)
- Zero GAS quota when nobody is viewing or editing — no time-driven trigger needed

#### `rndlivedata.gs` — v01.05g
##### Added
- `onEdit(e)` simple trigger — refreshes cache instantly when the data sheet is edited
##### Changed
- `getCachedData()` now re-ups cache TTL on every read (self-healing heartbeat pattern)
- `getCachedData()` self-repairs on cache miss by calling `refreshDataCache()` as fallback
- Cache TTL increased from 90 seconds to 6 hours (21,600s)

#### `rndlivedata.html` — v01.06w (no change)
##### Changed
- Setup instructions updated — time-driven trigger no longer needed

## [v06.54r] — 2026-03-25 02:58:00 PM EST

> **Prompt:** "for rndlivedata , see if you can come up with a way for it to work without sharing the spreadsheet publicly, that defeats the whole purpose. the users might as well be looking at the spreadsheet"

### Changed
- Redesigned rndlivedata to serve data from a private spreadsheet via GAS CacheService instead of requiring public Google Sheets access
- Data piggybacks on existing presence heartbeats (zero additional GAS quota per viewer)
- Time-driven trigger refreshes CacheService every minute (~1,440 calls/day regardless of viewer count)
- Removed Google Visualization API / Charts dependency from the page

#### `rndlivedata.html` — v01.06w
##### Changed
- Data now arrives via the GAS script instead of requiring a publicly shared spreadsheet
- Removed dependency on Google Charts library for faster page loading
- Connection status shows "Last updated Xs ago" instead of polling countdown
- Setup instructions updated — no longer asks to share spreadsheet publicly

#### `rndlivedata.gs` — v01.04g
##### Changed
- Added CacheService-based data serving — spreadsheet data cached server-side
- Presence heartbeats now also deliver live data to viewers (zero extra calls)
- Active user queries include live data alongside the user list

## [v06.53r] — 2026-03-25 02:18:30 PM EST

> **Prompt:** (screenshot showing CSP `connect-src` blocking `accounts.google.com` during Google Visualization API query, causing `XhrHttpError: Request Failed, status=0`)

### Fixed
- Fixed CSP `connect-src` blocking Google Visualization API auth redirects to `accounts.google.com` — the gviz query redirects through Google's auth service even for published sheets

#### `rndlivedata.html` — v01.05w
##### Fixed
- Added `https://accounts.google.com` and `https://www.google.com` to CSP `connect-src` — the Visualization Query's XHR redirects through Google's auth endpoint

## [v06.52r] — 2026-03-25 02:13:00 PM EST

> **Prompt:** "still says connecting, showing console in case it helps"

### Fixed
- Fixed live data page still stuck on "Connecting..." — CSP `style-src` was blocking Google Charts CSS from `www.gstatic.com`, causing `google.charts.load()` initialization to fail entirely
- Fixed CSP `img-src` blocking developer logo from `www.shadowaisolutions.com`

#### `rndlivedata.html` — v01.04w
##### Fixed
- Added `https://www.gstatic.com` to CSP `style-src` — Google Charts loads CSS (tooltip.css, etc.) from this domain during initialization
- Added `https://fonts.googleapis.com` to CSP `style-src` and `https://fonts.gstatic.com` to CSP `font-src` — preemptive for Google Charts font loading
- Added `https://www.shadowaisolutions.com` to CSP `img-src` — developer logo was blocked

## [v06.51r] — 2026-03-25 02:07:29 PM EST

> **Prompt:** "so how do i use this? it says connecting... and doesnt move from there"

### Fixed
- Fixed live data page stuck on "Connecting..." — CSP was blocking Google Charts from loading visualization library from `www.google.com`

#### `rndlivedata.html` — v01.03w
##### Fixed
- Added `https://www.google.com` to Content Security Policy `script-src` directive — Google Charts dynamically loads the visualization library from this domain after the initial loader.js

## [v06.50r] — 2026-03-25 01:57:21 PM EST

> **Prompt:** "for the rndlivedata, what do you think of the following plan, research online and think deeply about it. Set up the GAS project called "rndlivedata" and implement a live real-time spreadsheet data viewer using the Google Visualization API — zero GAS execution for data reads. ## What to build Add a PROJECT OVERRIDE comment explaining live data is served via Google Visualization API. Add these PROJECT section functions: 1. **writePresence(userName)** — writes a heartbeat to a hidden `_Presence` sheet. Creates the sheet with "User"/"Last Seen" headers if it doesn't exist. Updates existing user rows or appends new ones. Called from the HTML page via GAS iframe every 30 seconds. 2. **getActiveUsers()** — returns array of users active within the last 60 seconds by reading the `_Presence` sheet. In the doGet() HTML: - Replace the B1 display with "Live data via Google Visualization API" text - Replace pollB1FromCache and pollQuotaAndLimits with presence heartbeat logic: - Generate a random viewer name (Viewer_XXXX), store in sessionStorage - Call google.script.run.writePresence(name) every 30 seconds - Add message listener for 'get-active-users' that calls getActiveUsers() and posts results back ### rndlivedata.html — Live Data Page with Google Visualization API Dark theme (#0f1117 background) with these features: **Data Engine:** - Load Google Charts API from `https://www.gstatic.com/charts/loader.js` - Query `https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?sheet=SHEET_NAME&tqx=out:json` every 2.5 seconds - Parse the JSONP-style response (strip `google.visualization.Query.setResponse(` wrapper) - Only re-render when data actually changes (hash comparison) - Cell-level change detection comparing previous vs current data **Dual View Modes (tabbed UI):** 1. **Table View** — full spreadsheet data as styled HTML table - Sortable columns (click header to sort, toggle asc/desc) - Cell-level change animation: green flash on changed cells (`@keyframes cell-flash`) - Responsive layout with overflow-x scroll 2. **Dashboard View** — first row displayed as large cards/tiles - Each card shows: column header as label, cell value as large text, "N more rows" as meta - Stats card showing rows × cols and poll interval - Value change animation on cards **Connection Status Indicator:** - Top-right pill showing: Live (green dot) / Updating... (orange dot) / Disconnected (red dot) - Countdown timer showing seconds until next refresh **User Presence Tracking:** - Read the `_Presence` sheet via Viz API (zero GAS calls for reading) - Display colored avatar bubbles with initials in the header - Show viewer count - Active = seen within last 120 seconds **Config Hint:** - When SHEET_ID is empty, show a centered config hint with instructions to set the ID and publish the spreadsheet to the web **Keep all TEMPLATE sections intact** — splash screens, version polling, GAS pill, changelog popups, wake lock, audio system. Only customize within PROJECT START/END markers. ## Architecture: Zero-GAS Reads"

### Changed
- Converted RND Live Data from REST API chat/messaging app to live real-time spreadsheet data viewer using Google Visualization API
- GAS PROJECT SECTION: replaced REST API handlers with presence-only functions (writePresence, getActiveUsers)
- GAS doGet: replaced REST API routing with presence heartbeat logic and active-users message listener
- Removed doPost PROJECT OVERRIDE (no more REST API routing needed)
- CSP extended to allow Google Charts loader and gviz JSONP queries

### Added
- Live spreadsheet data polling via `google.visualization.Query` every 2.5 seconds (zero GAS execution for reads)
- Dual view modes: Table View (sortable columns, cell-level change flash animation) and Dashboard View (first-row cards/tiles with stats)
- Connection status indicator (Live/Updating/Disconnected) with countdown timer
- User presence tracking: writes via GAS iframe heartbeat, reads via Visualization API
- Config hint overlay when SPREADSHEET_ID is empty
- Cell-level change detection with green flash animation on changed values

### Removed
- REST API chat/messaging functionality (handleGetAction_, handlePostAction_, CacheService, LockService, entry submission)
- Name entry modal and message feed UI

#### `rndlivedata.html` — v01.02w
##### Changed
- Redesigned as live spreadsheet data viewer with dark theme
- Data now loads directly from Google Sheets via Visualization API
##### Added
- Real-time data table with sortable columns and change highlighting
- Dashboard view with metric cards for first-row values
- Connection status pill with live/updating/disconnected states
- User presence avatars showing active viewers
- Configuration hint when spreadsheet not connected

#### `rndlivedata.gs` — v01.03g
##### Changed
- Replaced data entry backend with lightweight presence tracking
- GAS iframe now handles heartbeat writes and active user queries only
##### Removed
- REST API endpoints for data fetch and submission

## [v06.49r] — 2026-03-25 12:04:52 PM EST

> **Prompt:** "the copy Code.gs for GAS using the gas-project-creator did not include the spreadsheet ID, fix that and make sure everything in the gas-project-creator is accounted for in the code copying and copy config."

### Fixed
- Copy Code.gs button now includes SPREADSHEET_ID for noauth projects (was gated on auth-only)
- Copy Config button now always includes SPREADSHEET_ID in output (was gated on auth-only)
- Setup script (`setup-gas-project.sh`) now replaces SPREADSHEET_ID in .gs files for all project types (was auth-only)
- Added SPREADSHEET_ID, SHEET_NAME, and SOUND_FILE_ID variables to minimal noauth GAS template so Copy Code.gs replacements have targets to match

#### `gas-project-creator.html` — v01.27w
##### Fixed
- Copy Code.gs now includes spreadsheet ID for all project types, not just authenticated ones
- Copy Config now always includes spreadsheet ID in the generated setup command

## [v06.48r] — 2026-03-25 11:55:30 AM EST

> **Prompt:** "the spreadsheet id wasnt swapped for the placeholder, go ahead and swap it now : 1b50Le6G6ocKtx2nMUnCKPjhujSQlabcqUBBAGwlIsaU"

### Changed
- Connected RND Live Data backend to its Google Sheet by replacing the placeholder Spreadsheet ID with the actual ID

#### `rndlivedata.gs` — v01.02g
##### Changed
- Connected to actual Google Sheet for data storage

## [v06.47r] — 2026-03-25 11:43:03 AM EST

> **Prompt:** "The following plan is for the rndlivedata project. PROJECT BRIEF: Multi-User Data Entry Web App For handoff to Claude Code (GitHub Pages + Google Apps Script) WHAT WE'RE BUILDING A multi-user data entry web app — think a custom Google Sheet frontend as a web app. Multiple users (20+) open the same URL, enter data, and eventually see each other's entries. The frontend is hosted on GitHub Pages (already set up). The backend is Google Apps Script deployed as a web app, with Google Sheets as the database. Everything must stay within the Google ecosystem for the backend — no Firebase, no external databases, no third-party services. This will be used across ~50 projects on the same Google account, meaning potentially hundreds of browser tabs could be open simultaneously across all projects. THE CORE CONSTRAINT WE SOLVED The original question was: can we use webhooks or real-time push to sync data between users via Google Apps Script? The answer is no. After deep research, here's what we confirmed: What doesn't work and why: WebSockets / Server-Sent Events (SSE) — Apps Script web apps are simple request/response HTTP. They buffer the entire response before sending. You cannot hold a connection open or stream data. Not possible. Google Drive API changes.watch() webhooks — This IS a real push system where Google POSTs to a URL when a file changes. BUT the receiving endpoint must read HTTP headers (X-Goog-Channel-ID, X-Goog-Resource-State, etc.) to process the notification. Google officially confirmed in 2023 they will NOT support HTTP headers in doPost() due to security concerns (see: https://issuetracker.google.com/issues/67764685). So an Apps Script web app cannot be the webhook receiver. onEdit triggers — These fire server-side when someone manually edits a Sheet in the browser, but script executions and API requests (like appendRow() from your web app) do NOT trigger onEdit. And even if they did, there's no mechanism to push from a server-side trigger to connected browser clients. Long polling (server holds connection open) — We considered having google.script.run call a function that loops with Utilities.sleep() checking CacheService for changes. The problem: Google Apps Script has a hard limit of 30 simultaneous executions per user account. With hundreds of tabs, each holding a connection = instant exhaustion. Plus 6-minute execution time limit per call. Unworkable at this scale. Client-side polling — We built this initially. Every tab calls the server every 3-5 seconds to check for changes. Works functionally but at 50 projects × multiple tabs = thousands of server calls per minute. Even with smart optimizations (visibility API to pause hidden tabs, version-based short-circuiting, exponential backoff), it's wasteful for what is fundamentally a data entry tool where real-time isn't required. What we landed on — EVENT-DRIVEN SYNC (zero polling): Since this is a data entry app (not a chat app), the interaction pattern is fundamentally different. Users are entering data, not watching a live feed. They don't need instant updates — they need current data when they interact. The architecture: sync only on user actions. No timers. No intervals. No background calls. EventWhat happensServer callsPage loadsfetchData() once1User submits datasubmitEntry() returns full fresh dataset1Quick tab switch back (< 2 min)Auto-syncs silently1Long tab switch back (> 2 min)Shows "stale data" banner, user taps to sync0 until tappedQuick tab switch back (< 10 sec)Nothing — data is fresh enough0User clicks Sync buttonfetchData() once1Tab sitting idle in backgroundNothing0 forever Result: 200 open tabs across 50 projects = ZERO background server calls. The only calls come from tabs the user is actively interacting with. ARCHITECTURE: GITHUB PAGES + APPS SCRIPT Frontend (GitHub Pages) Static HTML/CSS/JS hosted on GitHub Pages Calls the Apps Script web app URL via fetch() as a REST API Handles all UI, state management, optimistic updates Uses Page Visibility API to detect tab focus/blur for sync logic Backend (Google Apps Script) Deployed as a web app (doGet for reads, doPost for writes) Returns JSON via ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON) Google Sheets as the database (permanent record) CacheService as a fast read layer (avoids hitting Sheet on every request) LockService to prevent race conditions on concurrent writes Version string in CacheService to track data freshness CORS handling (critical) Apps Script web apps can only handle GET and POST — they CANNOT respond to OPTIONS preflight requests. This means: For POST requests: The Content-Type MUST be text/plain;charset=utf-8 (NOT application/json). This avoids triggering the browser's CORS preflight. The body should be a stringified JSON string sent as plain text. For GET requests: Use query parameters on the /exec URL. These work cross-origin without issues. Apps Script URLs redirect (302) before executing. Use redirect: 'follow' in fetch options. doGet and doPost must return ContentService.createTextOutput() — not HtmlService — when used as an API. Example fetch from GitHub Pages: javascript// READ (GET) const response = await fetch(GAS_URL + '?action=fetch', { redirect: 'follow' }); const data = await response.json(); // WRITE (POST) — must use text/plain to avoid CORS preflight const response = await fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'submit', user: 'Alice', message: 'some data' }), redirect: 'follow' }); const result = await response.json(); GOOGLE APPS SCRIPT BACKEND DESIGN Configuration javascriptconst SHEET_ID = '1b50Le6G6ocKtx2nMUnCKPjhujSQlabcqUBBAGwlIsaU'; const SHEET_NAME = 'LiveFeed'; const CACHE_KEY = 'liveFeedData'; const VERSION_KEY = 'liveFeedVersion'; const CACHE_TTL = 600; // 10 minutes const MAX_ENTRIES = 200; API Design (doGet / doPost) Since this is now a REST API (not serving HTML), the Apps Script needs to route based on an action parameter: doGet(e) — handles read operations ?action=fetch → returns all entries from CacheService (falls back to Sheet on cache miss) Returns: { success: true, data: [...entries], version: "timestamp" } doPost(e) — handles write operations Body (parsed from e.postData.contents): { action: "submit", user: "name", message: "data" } Writes to Sheet, updates CacheService, returns full fresh dataset Uses LockService to prevent concurrent write collisions Returns: { success: true, data: [...entries], version: "timestamp" } CacheService strategy Every write updates both the Sheet (permanent) AND CacheService (fast reads) Reads hit CacheService first (~5ms). Only fall back to Sheet on cache miss. A version string (timestamp) in CacheService lets clients know if data has changed CacheService is shared across all script executions and all users — one user's write is immediately visible to another user's read from cache Cache entries expire after 10 minutes (CACHE_TTL = 600). On expiry, next read rebuilds from Sheet. Max 100KB per cache value, 1000 items total. Keep entry count capped at ~200 to stay well under. LockService for concurrent writes LockService.getScriptLock() prevents any user from concurrently running the write section lock.waitLock(15000) — wait up to 15 seconds for the lock (handles 20+ concurrent writers) Always release in a finally block Always call SpreadsheetApp.flush() before releasing the lock Sheet structure TimestampUserMessageEntryIDDate objectString (max 50 chars)String (max 1000 chars)UUID from Utilities.getUuid() Key quotas to be aware of 30 simultaneous executions per user account (across ALL scripts) 6-minute max execution time per single invocation 6 hours total execution time per day (Workspace) / 90 min for triggers 100KB max per CacheService value 1000 items max in CacheService (FIFO eviction at capacity) 20,000 URL fetch calls/day (consumer) / 100,000 (Workspace) — not relevant here since clients call us, we don't fetch FRONTEND DESIGN (GITHUB PAGES) Sync logic — the key innovation (NO POLLING) javascript// These are the ONLY moments the frontend contacts the server: // 1. Page load — fetch once initialLoad(); // 2. User submits data — write returns fresh data submitData(); // calls POST, gets back full dataset // 3. Tab becomes visible again (user switches back) document.addEventListener('visibilitychange', function() { if (!document.hidden && tabWasHidden) { var awayFor = Date.now() - lastSyncTime; if (awayFor > 10000 && awayFor < 120000) { // Quick switch (10s-2min away) — auto sync silently sync(); } else if (awayFor >= 120000) { // Long absence — show "stale" banner, let user decide showStaleBanner(); } // < 10 seconds — do nothing, data is fresh enough } }); // 4. User clicks Sync button — manual refresh manualSync(); // That's it. No setInterval. No setTimeout for polling. No background calls. Optimistic UI When a user submits data, immediately add it to the local list and render. Then send to server. On success, replace local data with server's authoritative response. On failure, roll back the optimistic entry and restore the input. User identification Users pick a display name on entry (stored in sessionStorage) Display name persists across page refreshes within the same tab session Colored avatars are deterministic based on name hash UI features Entry feed with avatars, timestamps, messages Sync button with spinner animation Status indicator: Ready (green) / Syncing (yellow) / Error (red) / Stale (gray) "Stale data" banner when returning to a tab that's been backgrounded > 2 minutes "Last synced" timestamp in the header Responsive design, dark theme WHAT TO BUILD GitHub Pages side (index.html or similar): The full frontend UI (HTML/CSS/JS) Fetch-based API client that talks to the Apps Script /exec URL Event-driven sync logic (visibility API, submit-triggered refresh, manual sync button) Optimistic UI updates on submit No polling, no timers, no intervals Google Apps Script side (Code.gs): doGet(e) — routes GET requests, returns JSON for fetch/read operations doPost(e) — routes POST requests, handles data submission setupSheet() — run once to initialize the Sheet with headers CacheService read/write layer with version tracking LockService for safe concurrent writes Auto-creates Sheet tab if missing (defensive coding) The GAS URL will need to be configured in the frontend as a constant: javascriptconst GAS_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'; IMPORTANT NOTES The GAS web app must be deployed with "Execute as: Me" and "Who has access: Anyone" After ANY change to the GAS code, you must create a NEW deployment (or update the existing one). The old URL runs the old code. doPost receives the body in e.postData.contents as a string. Parse it with JSON.parse(). doGet receives query params in e.parameter (e.g., e.parameter.action). Always return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON) from both doGet and doPost — never HtmlService when used as an API. The Content-Type for POST from the browser MUST be text/plain;charset=utf-8 to avoid CORS preflight failures. CacheService getScriptCache() is shared across all users and executions — this is what makes the cache-first read pattern work for multi-user scenarios. Wrap all server functions in try/catch. Return error objects rather than throwing, so the frontend always gets a parseable response."

### Added
- Multi-user data entry web app frontend for RND Live Data — dark theme UI with name entry, message feed, optimistic submit, and event-driven sync (zero polling)
- GAS REST API backend with doGet/doPost routing, CacheService read layer, LockService for concurrent writes, and Google Sheets as persistent storage
- Event-driven sync via Page Visibility API — auto-syncs on quick tab switch, shows stale banner on long absence, zero background server calls
- CSP updated to allow fetch() connections to `script.google.com`

#### `rndlivedata.html` — v01.01w
##### Added
- Full data entry interface with dark theme — name entry modal, message feed with colored avatars, and input area
- Event-driven sync: auto-syncs on tab focus, stale data banner after 2+ minutes away, manual sync button
- Optimistic UI updates on message submit with automatic rollback on failure
- Status indicators: Ready (green), Syncing (yellow), Error (red), Stale (gray)

#### `rndlivedata.gs` — v01.01g
##### Added
- REST API routing via PROJECT OVERRIDE on doGet/doPost — returns JSON for `?action=fetch` and `action=submit`
- Data read layer with CacheService (10-min TTL) falling back to Google Sheets
- Concurrent write protection with LockService (15s wait lock)
- Auto-creates Sheet tab with headers if missing

## [v06.46r] — 2026-03-25 11:32:41 AM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
bash scripts/setup-gas-project.sh <<'CONFIG'
{
  "PROJECT_ENVIRONMENT_NAME": "rndlivedata",
  "TITLE": "RND Live Data",
  "DEPLOYMENT_ID": "AKfycbxnhplqv-s116CtveTF-8Efdpd_MWA9RZwdJ0th4-4QK_1cRpngS0CBJemY4Znb6ND7",
  "SHEET_NAME": "Live_Sheet",
  "SOUND_FILE_ID": "1bzVp6wpTHdJ4BRX8gbtDN73soWpmq1kN",
  "SPLASH_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "INCLUDE_TEST": false,
  "INCLUDE_AUTH": false
}
CONFIG"

### Added
- New GAS project: RND Live Data (`rndlivedata`) — noauth page with GAS backend, deployed via auto-merge workflow webhook
- 10 new files: HTML page, GAS script, config, version files, changelogs, archives, per-environment diagram
- Workflow deploy step for Rndlivedata GAS self-update webhook

## [v06.45r] — 2026-03-25 09:24:15 AM EST

> **Prompt:** "every feature that is in the templates should be available in the live projects, and vice versa, make sure that both the projects and the templates match exactly other than the project specific features"

### Added
- Secure nonce endpoint (`getNonce` action + `generatePageNonce()`) to globalacl.gs and applicationportal.gs — completes the secure page-load flow that replaces insecure `?session=TOKEN` URL pattern
- `setAdminSecret` handler to globalacl.gs — enables the Global ACL hub to distribute shared admin secrets to its own GAS backend (was already present in other projects)

### Fixed
- Page nonce TTL in globalacl.gs increased from 30s to 60s, matching template and other projects — prevents timeout during the two-step nonce handshake on slower connections

#### `globalacl.gs` — v01.25g
##### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces
- Admin secret distribution endpoint — allows the Global ACL hub to push shared secrets to this project
##### Fixed
- Nonce expiry window extended from 30 seconds to 60 seconds, preventing timeouts during slower connections

#### `applicationportal.gs` — v01.10g
##### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces

## [v06.44r] — 2026-03-25 09:07:53 AM EST

> **Prompt:** "check to see if the templates are matching the testauth1 improvements, if not go ahead and update them"

### Fixed
- Panel overlay persistence during sign-out — overlays (admin sessions, changelog, GAS changelog) now close before the signing-out wall appears, preventing UI glitches
- GAS `adminSignOut` error handling — auth failures now return `{error: "unauthorized"}` instead of `{success: false, error: reason}`, matching testauth1's cleaner pattern
- GAS cache variable naming — renamed `_cpSecretCache` → `_crossProjectSecret` for clarity and consistency across all projects

### Added
- Panel registry infrastructure (`_registerPanel`, `_closeAllPanelsExcept`) to auth template and all auth pages for mutual exclusion and cleanup
- `generatePageNonce()` / `validatePageNonce()` and `action='getNonce'` endpoint to GAS minimal-auth template — secure one-time-use nonce replacing insecure `?session=TOKEN` URL pattern

#### `globalacl.html` — v01.26w
##### Fixed
- Panels and overlays now close properly during sign-out

#### `applicationportal.html` — v01.30w
##### Fixed
- Panels and overlays now close properly during sign-out

#### `applicationportal.gs` — v01.09g
##### Fixed
- Renamed cache variable for clarity
- Improved cross-project sign-out error handling

## [v06.43r] — 2026-03-23 08:34:55 PM EST

> **Prompt:** "i mean in regards to implementing it in testauth1, not changing the guide"

### Added
- Disagreement submission form UI — the last missing Phase A HIPAA element, completing all 9/9 UI components
- GAS listener routing for `submitDisagreement()` via Phase A iframe messaging

#### `testauth1.html` — v02.86w
##### Added
- "Disagree" button in the Phase A nav bar (permission-gated to `amend` role)
- Disagreement statement panel with amendment ID input, statement textarea, and submit button
- Client-side handler for disagreement submission with success/error feedback
- `phase-a-disagreement-result` message type added to postMessage allowlists and response router

#### `testauth1.gs` — v01.99g
##### Added
- `phase-a-submit-disagreement` message handler in the Phase A listener iframe, routing to `submitDisagreement()` GAS function

## [v06.42r] — 2026-03-23 08:05:48 PM EST

> **Prompt:** "after one is clicked, clicking it again should not close it, that should be left to the x button or clicking on a different one. also lower the timeout to 1 second"

### Changed
- Panel buttons no longer toggle-close their own panel — use the X button or open a different panel to close
- Panel cooldown reduced from 5 seconds to 1 second
- All buttons are now disabled during cooldown (including the active panel's button, since it no longer toggles)

#### `testauth1.html` — v02.85w
##### Changed
- Panel buttons now only open — closing is done via the X button or by switching panels
- Cooldown reduced to 1 second

## [v06.41r] — 2026-03-23 07:55:08 PM EST

> **Prompt:** "the timeout should disable the buttons so that they dont seem clickable"

### Changed
- Panel cooldown now visually disables other nav buttons (dimmed, not-allowed cursor, disabled attribute) during the 5-second window — the active panel's button stays enabled so it can be closed

#### `testauth1.html` — v02.84w
##### Changed
- Other panel buttons now appear visually disabled during the cooldown period

## [v06.40r] — 2026-03-23 07:44:01 PM EST

> **Prompt:** "right now if i click on all of the buttons the menus can overlap eachother, make it so that it closes any already open ones if one is clicked, but have there be a 5 second cooldown before it allows to click another one."

### Changed
- Panel buttons (Sessions, Disclosures, My Data, Correction, Amendments) now enforce mutual exclusion — opening one panel automatically closes any other open panel
- Added 5-second cooldown after opening a panel before another can be opened (closing the current panel is always allowed during cooldown)

#### `testauth1.html` — v02.83w
##### Changed
- Navigation panels no longer overlap — only one panel can be open at a time
- Added a brief cooldown between switching panels to prevent rapid toggling

## [v06.39r] — 2026-03-23 07:32:02 PM EST

> **Prompt:** "disclosure accounting is stuck on loading"

### Fixed
- Fixed Disclosure Accounting panel stuck on "Loading..." — `google.script.run` silently drops Date objects returned from spreadsheet cells; converted all date fields to ISO strings before returning from GAS functions
- Fixed same Date serialization issue in Pending Amendments, Amendment History, and Individual Data Export functions

#### `testauth1.gs` — v01.98g
##### Fixed
- Fixed disclosure accounting and amendment panels not loading — date values from spreadsheet are now properly converted to strings

## [v06.38r] — 2026-03-23 07:13:41 PM EST

> **Prompt:** "ok i did that and it worked. now is the method that we did this a vulnerability or will you close it now?"

### Security
- Removed the `seedSampleData` doGet action endpoint from the GAS script — served its purpose, no reason to leave a data-writing endpoint exposed

#### `testauth1.gs` — v01.97g
##### Removed
- Removed the temporary data seeding endpoint — test data has been populated and the endpoint is no longer needed

## [v06.37r] — 2026-03-23 06:56:11 PM EST

> **Prompt:** "whatever you did, did not produce any results, undo it, i literally want it in the spreadsheets"

### Changed
- Replaced broken UI-based seed approach with a direct `doGet` action endpoint (`?action=seedSampleData&email=...&secret=...`) that writes sample data directly to the spreadsheet — no session/iframe required
- Removed the "Seed Sample Data" button and all Phase A iframe wiring for seeding

#### `testauth1.gs` — v01.96g
##### Changed
- Sample data seeding now works via a direct URL call instead of through the app UI — more reliable for populating test data

#### `testauth1.html` — v02.82w
##### Removed
- Removed "Seed Sample Data" button from the My Data panel (seeding is now done via direct URL)

## [v06.36r] — 2026-03-23 06:29:26 PM EST

> **Prompt:** "the amendment requests and disclosure log are currently blank can you put some sample data so i can test all of them"

### Added
- Seed Sample Data function — admin-only button in the My Data panel that populates DisclosureLog, AmendmentRequests, and notes sheet with realistic HIPAA-compliant sample data for the signed-in user
- Phase A iframe handler for `phase-a-seed-sample-data` message type

#### `testauth1.gs` — v01.95g
##### Added
- New "Seed Sample Data" feature — populates your account with sample disclosures, amendment requests, and clinical notes for testing

#### `testauth1.html` — v02.81w
##### Added
- "Seed Sample Data" button in the My Data panel (admin-only) — one click to populate test data across all HIPAA features

## [v06.35r] — 2026-03-23 06:08:12 PM EST

> **Prompt:** "now that disclosures works, lets do my data. right now when i try to download, get Error; An internal error occurred. Please try again."

### Fixed
- Fixed "Download My Data" (Right of Access) crashing with "An internal error occurred" — root cause was missing `var SHEET_NAME` declaration in the GAS script, causing a `ReferenceError` when `getIndividualData()` tried to query the main data sheet
- Added missing session error types (`SESSION_EVICTED`, `SESSION_CORRUPT`, `SESSION_INTEGRITY_VIOLATION`) to the Phase A error handler so they return user-friendly messages instead of the generic internal error

#### `testauth1.gs` — v01.94g
##### Fixed
- Data download now works — you can export your data as JSON or CSV from the "My Data" panel
- Improved error messages when sessions are interrupted — you'll see a clear "please sign in again" message instead of a generic error

## [v06.34r] — 2026-03-23 05:53:51 PM EST

> **Prompt:** "ok its no longer overlapping when signed out, but its still overlapping while signing out, same thing for all the others, fix it for all and any moving forward"

### Fixed
- Phase A panels, admin sessions panel, and GCL overlay now close immediately at the start of `performSignOut()` — before the "Signing out..." wall is shown — so no high-z-index overlays float above the signing-out animation
- Root cause: panels had z-index 10010 while signing-out-wall had z-index 10002, so panels stayed visible and interactive during the sign-out process

#### `testauth1.html` — v02.80w
##### Fixed
- Panels and overlays now close immediately when you sign out — no more lingering popups during the sign-out process

## [v06.33r] — 2026-03-23 03:17:49 PM EST

> **Prompt:** "nice its working. though if i sign out while the thing is open, it stays overlayed, make sure that this doesnt happen for this or any others, emphasis on making sure there is no access even if overlapped by the html layer or hiding"

### Fixed
- Phase A panels now close on signout/session expiry — added to `showAuthWall()` cleanup block alongside existing admin panel cleanup
- Phase A panel data content (disclosure lists, amendment text, form inputs) cleared on signout to prevent PHI exposure via DevTools
- Phase A iframe destroyed (`about:blank`) on signout — same HIPAA pattern as main GAS iframe destruction

#### `testauth1.html` — v02.79w
##### Fixed
- HIPAA panels close and clear data when you sign out or your session expires

## [v06.32r] — 2026-03-23 03:11:50 PM EST

> **Prompt:** "ok well at least finally we have something, its saying your session has expired please sign in again in the disclosures button, even though we are already signed in"

### Fixed
- Phase A `_getToken()` read from wrong storage key (`__auth_session` JSON) — now uses existing `loadSession()` which reads from the correct dynamic key (`_pageName + '_gas_session_token'`)

#### `testauth1.html` — v02.78w
##### Fixed
- Session token now correctly retrieved for Phase A operations

## [v06.31r] — 2026-03-23 03:06:26 PM EST

> **Prompt:** "nope all the same. lets tackle one at a time. when i click on disclosures, and its loading, what is supposed to come up"

### Fixed
- Phase A messages rejected by `_KNOWN_GAS_MESSAGES` allowlist — added all 8 Phase A message types to the allowlist so they pass Layer 1 validation

#### `testauth1.html` — v02.77w
##### Fixed
- Added Phase A message types to `_KNOWN_GAS_MESSAGES` allowlist — root cause of panels stuck on loading

## [v06.30r] — 2026-03-23 02:41:17 PM EST

> **Prompt:** "disclosure accounting is stuck on loading, the download my data when clicking download is stuck on generating export, amendments is stuck on loading"

### Fixed
- Phase A panels stuck on "Loading..." — missing postMessage communication bridge between HTML page and GAS backend
- Added `action=phaseA` listener page in `doGet()` to handle Phase A message routing via `google.script.run`
- Added dedicated Phase A iframe with lazy initialization (loaded on first panel open)
- Replaced broken `_getGasSource()` calls with `_sendPhaseA()` using dedicated iframe source
- Added Phase A response types to `_SIG_EXEMPT` signature exemption list

### Added
- `getPendingAmendments()` GAS function for admin amendment review panel (returns all Pending/UnderReview amendments)

#### `testauth1.gs` — v01.93g
##### Fixed
- Added Phase A postMessage listener page (`action=phaseA`) in `doGet()` for all 6 Phase A operations
##### Added
- `getPendingAmendments()` — admin-only function to list all pending amendment requests

#### `testauth1.html` — v02.76w
##### Fixed
- Phase A panels now communicate through dedicated iframe with proper handshake
- Replaced `_getGasSource()` with `_sendPhaseA()` using Phase A iframe source
- Added Phase A message types to signature exemption list

## [v06.29r] — 2026-03-23 02:20:16 PM EST

> **Prompt:** "yes plan that now"

### Added
- Implemented HIPAA Phase A code in `testauth1.gs` — 14 new GAS functions for Disclosure Accounting (§164.528), Right of Access (§164.524), and Right to Amendment (§164.526)
- Shared utility functions: `generateRequestId()`, `formatHipaaTimestamp()`, `validateIndividualAccess()`, `getOrCreateSheet()`, `wrapPhaseAOperation()`
- Disclosure Accounting: `recordDisclosure()`, `getDisclosureAccounting()`, `exportDisclosureAccounting()`
- Right of Access: `requestDataExport()`, `getIndividualData()`, `extractRecordsForEmail()`, `convertToCSV()`, `updateAccessRequestStatus()`
- Right to Amendment: `requestAmendment()`, `reviewAmendment()`, `submitDisagreement()`, `getAmendmentHistory()`
- 4 new HIPAA UI buttons in testauth1 user-pill: Disclosures, My Data, Correction, Amendments (RBAC-gated)
- 4 new panels in testauth1: disclosure accounting panel, data export panel, amendment request form, admin amendment review panel
- Phase A CSS styles matching existing admin-sessions-panel dark theme
- JavaScript event handlers, postMessage communication, and rendering functions for all Phase A panels

#### `testauth1.gs` — v01.92g
##### Added
- HIPAA Phase A server-side functions (disclosure tracking, data export, amendment workflow)

#### `testauth1.html` — v02.75w
##### Added
- HIPAA Phase A UI components (buttons, panels, JavaScript handlers)

## [v06.28r] — 2026-03-23 02:02:30 PM EST

> **Prompt:** "start implementing repository-information/HIPAA-PHASE-A-IMPLEMENTATION-GUIDE.md , research online, think deep. Write large changes in small chunks — use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Regulatory Landscape & Enforcement Context section — OCR Right of Access Initiative enforcement data (54 actions, $9.4M+ in 2024), penalty tier tables, enforcement case studies
- HITECH Act EHR Accounting Expansion subsection — §13405(c) dormant provisions, future-proofed function signature, BA disclosure tracking recommendations
- Fee Policy subsection — §164.524(c)(4) fee rules, $6.50 flat fee option, testauth1 $0 recommendation
- Personal Representative Access subsection — §164.502(g) requirements, recommended Phase B implementation with `PersonalRepresentatives` sheet schema
- Amendment Notification Workflow subsection — §164.526(c)(2)-(3) post-approval notification requirements, recommended `AmendmentNotifications` sheet and code extension
- Amendment Documentation Requirements — §164.526(f) organizational documentation checklist
- Regulatory Compliance Matrix section — paragraph-level CFR coverage map (35 sub-sections mapped with ✅/⚠️/❌/⏳ status)
- Forward-Looking Regulatory Preparation section — pending Privacy Rule NPRM (15-day timeline), Security Rule NPRM infrastructure impact, 42 CFR Part 2 SUD alignment, regulatory monitoring checklist
- Two new recommended sheet schemas: `AmendmentNotifications` and `PersonalRepresentatives`

### Changed
- Renumbered all sections sequentially (1-15) after inserting 3 new top-level sections
- Updated internal cross-references to match new section numbering
- Document grew from 1799 to 2312 lines (v1.0 → v1.1)

## [v06.27r] — 2026-03-23 01:10:04 PM EST

> **Prompt:** "create a comprehensive implementation-ready reference document that addresses Phase A of the repository-information/HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md Recommended Implementation Roadmap. This document will be used to implement the fixes in testauth1. Include working code blocks, architecture diagrams, comparison tables, a security checklist, and troubleshooting. This should be a single document someone could follow to implement every fix from scratch. Write the document in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Created `HIPAA-PHASE-A-IMPLEMENTATION-GUIDE.md` — comprehensive implementation guide for Privacy Rule compliance (Phase A of the HIPAA remediation roadmap)
- Covers items #19 (Disclosure Accounting, §164.528), #23 (Right of Access, §164.524), and #24 (Right to Amendment, §164.526)
- Includes 14 working GAS code blocks following the established `saveNote()` pattern (validateSessionForData → checkPermission → dataAuditLog → operation)
- Architecture overview with Mermaid system context diagram and data flow pattern
- Complete spreadsheet schemas for 3 new sheets: `DisclosureLog`, `AccessRequests`, `AmendmentRequests`
- Security checklist (pre-implementation, per-function, post-implementation, HIPAA-specific)
- Before/after compliance comparison tables showing scorecard impact (16→19 ✅, 65%→74% current law)
- Role-permission matrix for all Phase A functions across viewer/billing/clinician/admin roles
- 16 test scenarios with expected results across all three items
- Troubleshooting guide covering common issues, GAS-specific gotchas, and HIPAA-specific scenarios
- HTML UI component templates for disclosure panel, data export, amendment request form, and admin review panel

## [v06.26r] — 2026-03-23 12:33:53 PM EST

> **Prompt:** "see where we left off as far as implementing Hippa compliance for testauth1 ,we were using repository-information/HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md but we have made additions,  look over the repository-information/HIPAA-CODING-REQUIREMENTS.md, think deep. then make a file with the latest implementations as a followup based on the goal of repository-information/HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md"

### Added
- Created `HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md` — follow-up compliance report documenting all security improvements between v01.56g/v02.35w and v01.91g/v02.74w (35 GAS + 39 HTML versions)
- Updated compliance scorecard: 14→16 implemented items, 5→3 partial items
- Documented status upgrades: #5 Access Authorization (⚠️→✅), #22 Minimum Necessary (⚠️→✅)
- Documented 6 new security features beyond the 40-item checklist (SSO, admin panel, secure token exchange, cross-project admin, auto-generated keys, IP logging BAA decision)
- Revised gap analysis with phased remediation roadmap (Phase A-D)

## [v06.25r] — 2026-03-23 10:12:15 AM EST

> **Prompt:** "great. can you make it so that when the sso is dismissed that clicking on that pill will bring it back to try again"

### Added
- SSO indicator pill is now clickable when in "dismissed" state — clicking it retries the GIS token acquisition, showing "pending" then "ready" or "dismissed" based on the result
- Dismissed state label changed from "dismissed" to "retry" to indicate the action available

#### `applicationportal.html` — v01.29w

##### Added
- Click-to-retry on the SSO indicator when dismissed — re-attempts Google sign-in for SSO token

## [v06.24r] — 2026-03-23 10:04:38 AM EST

> **Prompt:** "no it sstill not working, make sure you actually understand what im asking for. in the instance where the google sign in is closed out, i want the sso pending to go from pending to dismissed. its already properly detecting when ready, just not when its been dismissed. make sure we can even accomplish that think deep and research online"

### Added
- Added `error_callback: _onGisPopupClosed` to all 5 `initTokenClient` calls — GIS fires this callback with `error.type === 'popup_closed'` when the user closes the Google sign-in popup without completing auth
- New "dismissed" state for SSO indicator (red dot, red "dismissed" text) — shown when the GIS popup is closed without signing in

### Fixed
- SSO indicator now correctly detects popup dismissal using GIS's official `error_callback` mechanism instead of relying on OAuth error callbacks (which don't fire when the popup window itself is closed)

#### `applicationportal.html` — v01.28w

##### Added
- SSO indicator "dismissed" state — red dot and "dismissed" label when the Google sign-in popup is closed without completing auth

## [v06.23r] — 2026-03-23 09:52:01 AM EST

> **Prompt:** "heres the current state of affairs with this. when first signing in, there is no popup because its doing the SSO for me, so it says ready so that is perfect. when i refresh the page, the GIS popup shows up as expected, and the main page says SSO pending until i sign in to the GIS, that is perfect. however, if i close the GIS popup, the SSO stays on pending forever."

### Fixed
- Added `_ssoRefreshDismissed` flag to prevent `startCountdownTimers` from overwriting the SSO indicator back to `pending` after the user dismisses the GIS popup — the race condition was: error callback sets `off`, then `gas-auth-ok` fires `startCountdownTimers` which resets to `pending`

#### `applicationportal.html` — v01.27w

##### Fixed
- SSO indicator correctly stays on "off" after dismissing the Google sign-in popup, even when the session resumes via the GAS iframe

## [v06.22r] — 2026-03-23 09:42:59 AM EST

> **Prompt:** "idk what you are talking about. im talking about the scenario where like in the screenshot, it says pending, but the user closed the google accounts sign in popup like the other screenshot"

### Fixed
- SSO indicator now resets to `off` when the user closes the Google sign-in popup without completing auth, or when any GIS auth attempt fails

#### `applicationportal.html` — v01.26w

##### Fixed
- SSO indicator no longer stays stuck on "pending" after the Google sign-in popup is dismissed

## [v06.21r] — 2026-03-23 09:34:07 AM EST

> **Prompt:** "the sso pending indicator is not very accurate. its only saying ready if the GIS was completed before the page load rather than when it actually happens. i think it was much more accurate when it was merged with the heartbeat, dont actually merge it but make it work in the same way"

### Fixed
- Rewired SSO indicator to follow the auth-timers lifecycle — shown/hidden at `startCountdownTimers`/`stopCountdownTimers` instead of at scattered `requestAccessToken` call sites
- Indicator now shows `pending` when session starts (timers appear) and transitions to `ready` when SSO token is actually acquired, matching the accuracy of the heartbeat timer

#### `applicationportal.html` — v01.25w

##### Fixed
- SSO readiness indicator now accurately tracks SSO token acquisition by hooking into the same auth lifecycle as the session timers

## [v06.20r] — 2026-03-23 09:24:08 AM EST

> **Prompt:** "you have to make sure its not overlapped by our other elements"

### Fixed
- Fixed SSO readiness indicator position from `bottom: 8px` to `bottom: 86px` to avoid overlapping the version indicator, GAS pill, and auth timers stack

#### `applicationportal.html` — v01.24w

##### Fixed
- SSO indicator no longer overlaps other bottom-right UI elements

## [v06.19r] — 2026-03-23 09:19:18 AM EST

> **Prompt:** "i didnt mean for it to be put on all pages, just for the SSO on the application portal so that we know when its ready to be used to authenticate for the other applications. dont merge it with the heartbeat, it should be its own thing"

### Changed
- Redesigned GIS indicator as a standalone SSO readiness indicator on the application portal only — shows whether the portal is ready to serve SSO tokens to other auth pages (off/pending/ready states)
- Moved indicator out of `#auth-timers` into its own fixed-position pill (`#sso-indicator`) at bottom-right
- Reverted GIS indicator from auth template, testauth1, and globalacl — SSO provider functionality is applicationportal-specific

#### `applicationportal.html` — v01.23w

##### Changed
- Replaced GIS popup state indicator with standalone SSO readiness indicator — shows off (gray), pending (orange pulsing), or ready (green) based on whether the portal can serve SSO tokens

## [v06.18r] — 2026-03-23 09:06:12 AM EST

> **Prompt:** "the GIS re-auth popup in the application portal, is there a way to indicate when it has been activated vs not activated."

### Added
- Added GIS popup state indicator to the auth timers panel on all auth pages — a small dot and label in the `#auth-timers` pill shows whether a GIS `requestAccessToken()` call is idle (gray), running silently (orange pulsing), or has an interactive popup open (blue pulsing)

#### `applicationportal.html` — v01.22w

##### Added
- GIS popup state indicator in auth timers panel (idle/silent/interactive states)

#### `testauth1.html` — v02.74w (no change)

##### Added
- GIS popup state indicator in auth timers panel (idle/silent/interactive states)

#### `globalacl.html` — v01.25w (no change)

##### Added
- GIS popup state indicator in auth timers panel (idle/silent/interactive states)

## [v06.17r] — 2026-03-23 08:38:15 AM EST

> **Prompt:** "make all the projects have both a sign out of all programs button and a sign out of just this program button, you can come up with the wording"

### Added
- Added dual sign-out buttons to all auth pages: "Sign Out" (signs out of the current page only) and "Sign Out All" (signs out of all connected pages via SSO broadcast)
- `performSignOut` now accepts an `opts` parameter with `broadcastSSO` flag to control whether the SSO cross-page sign-out is broadcast

#### `applicationportal.html` — v01.21w

##### Added
- New "Sign Out" button for signing out of this page only, and "Sign Out All" button for signing out of all connected pages

#### `testauth1.html` — v02.74w

##### Added
- New "Sign Out" button for signing out of this page only, and "Sign Out All" button for signing out of all connected pages

#### `globalacl.html` — v01.25w

##### Added
- New "Sign Out" button for signing out of this page only, and "Sign Out All" button for signing out of all connected pages

## [v06.16r] — 2026-03-23 08:20:05 AM EST

> **Prompt:** "i have to think about it but i thought it was only if accessed via the applicationportal"

### Fixed
- Restricted SSO token sharing to SSO provider pages only — previously any signed-in auth page responded to SSO token requests (allowing testauth1 to SSO into Application Portal); now only pages with `SSO_PROVIDER: true` (Application Portal) respond to token requests, enforcing the intended hub-spoke SSO direction

#### `applicationportal.html` — v01.20w

##### Fixed
- SSO token response now gated by SSO_PROVIDER check — only responds to cross-page auth requests when configured as the SSO hub

#### `testauth1.html` — v02.73w

##### Fixed
- SSO token response now gated by SSO_PROVIDER check — no longer provides tokens to other pages

#### `globalacl.html` — v01.24w

##### Fixed
- SSO token response now gated by SSO_PROVIDER check — no longer provides tokens to other pages

## [v06.15r] — 2026-03-23 07:56:51 AM EST

> **Prompt:** "forget about the portal title, i manually removed it. the others however for the global sessions its not recognizing the global ACL or the application portal even though they are all logged in, the testauth is still working"

### Fixed
- Fixed Application Portal `listActiveSessionsInternal` using wrong session storage key (`session_index`) instead of the standard `sessions_EMAIL` pattern — sessions were being stored with one key but read with another, causing Global Sessions to always show 0 sessions for Application Portal

#### `applicationportal.gs` — v01.08g

##### Fixed
- Fixed session listing to use the correct storage key pattern, matching Global ACL and Testauth1

## [v06.14r] — 2026-03-23 07:45:16 AM EST

> **Prompt:** "the global sessions is working for testauth1, but its not working for the application portal. remember that we removed the "portal" and not have "application portal" instead"

### Fixed
- Fixed Global Sessions panel not showing Application Portal sessions — remote session `project` names from GAS scripts now get overridden with the master spreadsheet display name, preventing name mismatches when a project is renamed

#### `globalacl.gs` — v01.24g

##### Fixed
- Fixed session listing not matching renamed projects in the Global Sessions panel

## [v06.13r] — 2026-03-23 07:30:39 AM EST

> **Prompt:** "yes"

### Fixed
- Removed debug logging from Application Portal auth flow that exposed sensitive data (session tokens, message keys, internal state flags) in the browser console

#### `applicationportal.html` — v01.19w

##### Fixed
- Removed verbose debug logging that exposed session tokens and auth state in the console
- Converted error-condition logs from debug to warnings for continued troubleshooting visibility

## [v06.12r] — 2026-03-22 03:19:28 PM EST

> **Prompt:** "that seemed like you did that way too fast, can you make sure everything is set up correctly"

### Fixed
- Aligned HTML-side `SERVER_SESSION_DURATION` with HIPAA GAS preset — was 3600s (1hr, standard) but GAS uses 900s (15min, HIPAA). Client countdown now matches server-side session lifetime

#### `globalacl.html` — v01.23w

##### Fixed
- Session countdown timer now matches server-side 15-minute HIPAA timeout

#### `applicationportal.html` — v01.18w

##### Fixed
- Session countdown timer now matches server-side 15-minute HIPAA timeout

## [v06.11r] — 2026-03-22 03:12:04 PM EST

> **Prompt:** "oh i see, its the standard preset vs hipaa preset. i need it to be changed to hipaa preset, i need all our projects with security that we currently have to change all their defaults to the hipaa preset"

### Changed
- Switched Global ACL and all auth templates from standard preset to HIPAA preset — sessionStorage (cleared on tab close), postMessage token exchange (token never in URL), DOM clearing on expiry

#### `globalacl.html` — v01.22w

##### Changed
- Switched to HIPAA security defaults — sessions no longer persist across browser restarts

#### `globalacl.gs` — v01.23g

##### Changed
- Switched from standard to HIPAA preset

## [v06.10r] — 2026-03-22 03:06:49 PM EST

> **Prompt:** "when opening https://shadowaisolutions.github.io/saistemplateprojectrepo/globalacl.html url directly, without even connecting to anything beforehand, its automatically showing reconnecting, even without any other page being open"

### Fixed
- Pages using localStorage no longer show "Reconnecting" on fresh visits with expired sessions — stale tokens are detected client-side (via absolute/rolling timeout check) and cleared immediately, going straight to the auth wall instead of making a server round-trip

#### `globalacl.html` — v01.21w

##### Fixed
- No longer shows "Reconnecting... Verifying your session" when opening the page fresh after a session has expired

## [v06.09r] — 2026-03-22 02:58:37 PM EST

> **Prompt:** "im seeing this in the globalacl, fix it so it will work for all projects moving forward"

### Fixed
- Global Sessions panel now correctly parses cross-project responses — handles both plain array (legacy) and `{success, sessions}` (template) formats
- Fixed `validateCrossProjectAdmin` TypeError in template/applicationportal — was calling `.indexOf()` on a roles object instead of using `checkSpreadsheetAccess()` for role verification

#### `globalacl.gs` — v01.22g

##### Fixed
- Global Sessions panel no longer shows "Invalid JSON response" for other projects

#### `testauth1.gs` — v01.91g

##### Changed
- Minor internal improvements

#### `applicationportal.gs` — v01.07g

##### Fixed
- Cross-project admin validation now works correctly

## [v06.08r] — 2026-03-22 02:46:35 PM EST

> **Prompt:** "ok so understand why you didnt have this working when we initially did the SSO with the global acl, and make sure that this will apply to the templates, go ahead and fix up the template files if you havent already so that they all will be properly set up like the testauth1 is when used for new projects"

### Added
- Complete SSO cross-page token sharing infrastructure to auth template — new projects now inherit SSO support automatically (variable declarations, BroadcastChannel setup, token request/response handlers, sign-out propagation, `attemptSSOAuth()` function, and page-load SSO attempt)

## [v06.07r] — 2026-03-22 02:30:05 PM EST

> **Prompt:** "there is something wrong with the global ACL. lets exlude the application portal for now and assume im signing in directly. when i duplicate the tab, its expiring the session instead of moving the session to the new tab. it is working properly with the testauth1"

### Fixed
- Fixed tab duplication causing session expiry on localStorage-based pages (Global ACL) — the surrendering tab's `stopCountdownTimers()` removed `SESSION_START_KEY` from shared localStorage, causing the claiming tab's next timer tick to read a missing value, compute `remaining <= 0`, and trigger `performSignOut('session-expired')` which destroyed the session for both tabs

#### `globalacl.html` — v01.20w

##### Fixed
- Tab duplication no longer expires the session — the new tab correctly inherits the active session

#### `testauth1.html` — v02.72w

##### Changed
- Minor internal improvements

#### `applicationportal.html` — v01.17w

##### Changed
- Minor internal improvements

## [v06.06r] — 2026-03-22 02:12:54 PM EST

> **Prompt:** "the global acl is not showing the Signing in via Application Portal like the testauth1 is, make sure the improvements we have made to testauth1 are also done on the global acl"

### Fixed
- Global ACL now shows "Signing in via Application Portal" during SSO authentication — the `signing-in-subtitle` element ID was missing from the HTML and the subtitle reset logic was missing from `showSigningIn()`

#### `globalacl.html` — v01.19w

##### Fixed
- "Signing in via Application Portal" message now appears during SSO sign-in instead of generic "Setting up your session"

## [v06.05r] — 2026-03-22 02:05:02 PM EST

> **Prompt:** "ok can you fix it"

### Fixed
- False "Session expiring soon" warning caused by duplicate `gas-auth-ok` messages — the GAS backend sends both an immediate unsigned and an async signed version; the second message incorrectly triggered the `needsReauth` warning after the first had already consumed `_pendingSessionShow`

#### `applicationportal.html` — v01.16w

##### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

#### `testauth1.html` — v02.71w

##### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

#### `globalacl.html` — v01.18w

##### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

## [v06.04r] — 2026-03-22 01:34:18 PM EST

> **Prompt:** "go ahead and implement the SSO from the applicationportal to all remaining applications (testauth1 already has it, i think we are only missing Global ACL)"

### Added
- SSO consumer support for Global ACL page — BroadcastChannel token sharing, automatic sign-in via applicationportal, and cross-page sign-out propagation

#### `globalacl.html` — v01.17w

##### Added
- SSO variable declarations for ephemeral token sharing (`_ssoAccessToken`, `_ssoUserEmail`, `_ssoChannel`)
- BroadcastChannel SSO listener on `sais-sso-auth` channel — responds to token requests and propagates sign-out events
- `attemptSSOAuth()` function — on page load with no session, requests token from SSO provider via BroadcastChannel with 2-second timeout fallback to auth wall
- SSO-aware page-load initialization — tries SSO before showing auth wall
- Token holding in `handleTokenResponse()` and email holding in `showApp()` for SSO sharing
- SSO sign-out broadcast on manual sign-out (session expiry remains page-local)
- SSO token cleanup in `clearSession()`

## [v06.03r] — 2026-03-22 12:51:12 PM EST

> **Prompt:** "wait now its not doing the silent GIS re-auth at all"

### Fixed
- SSO token re-acquisition now polls for GIS library readiness (up to 5s) instead of checking once — GIS loads async and wasn't available when the reconnect IIFE ran at page load

#### `applicationportal.html` — v01.15w

##### Fixed
- SSO token re-acquisition waits for GIS library to load during reconnect

#### `testauth1.html` — v02.70w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.16w

##### Changed
- Minor internal improvements

## [v06.02r] — 2026-03-22 12:45:46 PM EST

> **Prompt:** "in the application portal, the silent GIS re-auth is showing after the application portal is already visible, can it happen while we are reconnecting instead?"

### Changed
- Moved silent GIS token re-acquisition from the `gas-auth-ok` handler (after app is visible) to the reconnect path (while "Reconnecting..." overlay is shown), so it runs in parallel with session verification and completes before the app appears

#### `applicationportal.html` — v01.14w

##### Changed
- SSO token re-acquisition now happens during reconnect overlay instead of after app is shown

#### `testauth1.html` — v02.69w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.15w

##### Changed
- Minor internal improvements

## [v06.01r] — 2026-03-22 12:33:58 PM EST

> **Prompt:** "the application portal is back to saying \uD83D\uDD10 and \uD83C\uDF10 , fix it so it doesnt"

### Fixed
- Application Portal GAS script emoji rendering — replaced double-escaped Unicode surrogate pairs (`\\uD83D\\uDD10`) with actual emoji characters so they display correctly instead of showing raw escape codes

#### `applicationportal.gs` — v01.06g

##### Fixed
- All emoji now render correctly instead of showing as `\uD83D\uDD10` escape codes

## [v06.00r] — 2026-03-22 12:29:36 PM EST

> **Prompt:** "when the application portal is reconnecting, have it mentions something like GIS re-auth is going to happen, but in more user understandable words"

### Changed
- Application Portal reconnecting subtitle now says "Verifying your session and preparing sign-in for linked apps" to inform users that SSO will be refreshed

#### `applicationportal.html` — v01.13w

##### Changed
- Reconnecting subtitle updated to mention linked app sign-in preparation

## [v05.99r] — 2026-03-22 12:23:54 PM EST

> **Prompt:** "ok but now its making it so when i refresh the testauth1 page, its doing the silent GIS re-auth, even if i signed into the application directly"

### Fixed
- Silent GIS token re-acquisition now gated behind `HTML_CONFIG.SSO_PROVIDER` flag — only fires on the application portal (the designated SSO hub), not on child apps like testauth1 or globalacl

#### `applicationportal.html` — v01.12w

##### Changed
- Added `SSO_PROVIDER: true` config flag — portal re-acquires Google token on reconnect for SSO sharing

#### `testauth1.html` — v02.68w

##### Changed
- Added `SSO_PROVIDER: false` config flag — no silent GIS re-auth on reconnect

#### `globalacl.html` — v01.14w

##### Changed
- Added `SSO_PROVIDER: false` config flag — no silent GIS re-auth on reconnect

## [v05.98r] — 2026-03-22 12:08:17 PM EST

> **Prompt:** "ive noticed that the application portal works great on a fresh sign in to it, when i click on testauth1 it automatically authenticates it via the application portal. however, if i refresh the page of the application portal, and it goes through "reconnecting" the testauth1 link no longer automatically authenticates, it just asks for a sign in required"

### Fixed
- SSO auto-authentication now works after page refresh/reconnect — the Google access token (`_ssoAccessToken`) is silently re-acquired via GIS after a successful reconnect, so the portal can respond to SSO requests from child apps

#### `applicationportal.html` — v01.11w

##### Fixed
- SSO token re-acquired after reconnect so child apps can auto-authenticate

#### `testauth1.html` — v02.67w

##### Fixed
- SSO token re-acquired after reconnect so child apps can auto-authenticate

#### `globalacl.html` — v01.13w

##### Fixed
- SSO token re-acquired after reconnect so child apps can auto-authenticate

## [v05.97r] — 2026-03-22 11:38:56 AM EST

> **Prompt:** "the session active elsewhere should mention what application its referring to"

### Changed
- "Session Active Elsewhere" overlay now shows the application name in the heading and message text, using `document.title` to identify which app's session is active elsewhere

#### `testauth1.html` — v02.66w

##### Changed
- "Session Active Elsewhere" heading and message now include the application name

#### `globalacl.html` — v01.12w

##### Changed
- "Session Active Elsewhere" heading and message now include the application name

#### `applicationportal.html` — v01.10w

##### Changed
- "Session Active Elsewhere" heading and message now include the application name

## [v05.96r] — 2026-03-22 11:28:22 AM EST

> **Prompt:** "remove the "portal" environment, be careful and do not mistake if for the "applicationportal" environment which is its replacement"

### Removed
- Removed the old "portal" environment entirely — all files deleted: `portal.html`, `portal.gs`, `portal.config.json`, version files, changelogs, changelog archives, diagram, and backup
- Removed Portal GAS deployment step from the CI/CD workflow
- Removed Portal from the GAS Projects table in gas-scripts rules
- Removed portal.html link from `open-all.html`
- Removed all Portal references from REPO-ARCHITECTURE.md diagram nodes and edges

#### `open-all.html` — v01.01w

##### Removed
- Removed portal.html link from the project list and Open All button

## [v05.95r] — 2026-03-22 01:26:48 AM EST

> **Prompt:** "its still saying signing in on the setting up your session page, it should be mentioned there if its signing in via the portal or not there"

### Fixed
- Fixed SSO sign-in subtitle not showing — the subtitle was being set before `exchangeToken()` which calls `showSigningIn()` and resets it. Now the subtitle is set after `exchangeToken()` so "Signing in via Application Portal" is visible during SSO authentication

#### `applicationportal.html` — v01.09w

##### Fixed
- "Signing in via [source]" subtitle now correctly displays during SSO authentication

#### `testauth1.html` — v02.65w

##### Fixed
- "Signing in via [source]" subtitle now correctly displays during SSO authentication

## [v05.94r] — 2026-03-22 01:19:31 AM EST

> **Prompt:** "can you have the distinguish when signing in via the application portal and when signing in independently"

### Changed
- SSO sign-in now shows source page name — "Signing in via Application Portal" instead of generic "Setting up your session" when authenticating through SSO from another page

#### `applicationportal.html` — v01.08w

##### Changed
- Sign-in screen now shows which page provided your credentials when signing in via SSO

#### `testauth1.html` — v02.64w

##### Changed
- Sign-in screen now shows which page provided your credentials when signing in via SSO

## [v05.93r] — 2026-03-22 01:03:31 AM EST

> **Prompt:** "what do you think we should do and why?"

### Fixed
- Fixed SSO sign-out propagation — session expiry on one page no longer signs out other pages with valid sessions. Only deliberate sign-outs (user clicks "Sign Out") propagate across SSO-connected pages

#### `applicationportal.html` — v01.07w

##### Fixed
- Session timeout on other pages no longer disrupts your session — only deliberate sign-outs affect all pages

#### `testauth1.html` — v02.63w

##### Fixed
- Session timeout on other pages no longer disrupts your session — only deliberate sign-outs affect all pages

## [v05.92r] — 2026-03-22 12:27:41 AM EST

> **Prompt:** "for the repository-information/12-HIPAA-SSO-IMPLEMENTATION-PLAN.md i believe we are ready for phase 2, go ahead and start implementing it if we are ready to proceed. remember that the goal of this is so that we can use the applicationportal as the starting point to authenticate into the other projects, you should have what we are trying to accomplish documented somewhere"

### Added
- Implemented Phase 2 BroadcastChannel SSO — applicationportal.html and testauth1.html now share Google OAuth tokens via ephemeral in-memory BroadcastChannel ('sais-sso-auth'), enabling single sign-on across auth pages
- Added `attemptSSOAuth()` function to both pages — on page load (no existing session), broadcasts a token request and auto-authenticates if another auth page responds within 2 seconds
- Added bidirectional SSO token provision — both pages can act as SSO provider (whichever the user signs into first shares tokens with the other)
- Added cross-page sign-out propagation via `sso-sign-out` broadcast — signing out from one page signs out all SSO-connected pages

### Changed
- Changed testauth1.html CLIENT_ID to match applicationportal's shared CLIENT_ID (`216764502068-7j0j6svmparsrfgdf784dneltlirpac2`) — required for cross-page Google token sharing

#### `applicationportal.html` — v01.06w

##### Added
- Single sign-on support — sign in once, other auth pages auto-authenticate without a sign-in prompt
- Cross-page sign-out — signing out from any connected page signs out all pages

#### `testauth1.html` — v02.62w

##### Added
- Single sign-on support — auto-authenticates when another auth page (like Application Portal) is already signed in
- Cross-page sign-out — signing out from any connected page signs out all pages

##### Changed
- Shared Google OAuth client for unified sign-in experience across all auth pages

Developed by: ShadowAISolutions
