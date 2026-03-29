# Changelog Archive

Older version sections rotated from [CHANGELOG.md](CHANGELOG.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 100 version sections.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with per-entry EST timestamps and project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository).

## Rotation Logic

When Claude runs Pre-Commit #7 on the push commit, after creating the new version section in CHANGELOG.md, this rotation procedure runs:

### Quick rule (memorize this)

> **100 triggers, date groups move.** When sections exceed 100, rotate the oldest date group. A date group is ALL sections sharing the same date — could be 1 section or 500. Never move part of a date group. Today's sections (EST) are always exempt. Repeat until ≤100 non-exempt sections remain.

### Step-by-step

1. **Count** — count all `## [vXX.XX*]` version sections in CHANGELOG.md (exclude `## [Unreleased]`)
2. **Threshold check** — if the count is **100 or fewer**, stop — no rotation needed
3. **Current-day exemption** — get today's date (EST via `TZ=America/New_York date '+%Y-%m-%d'`). Any version section whose date (`YYYY-MM-DD` in the header) matches today is **exempt from rotation**, even if the total exceeds 100. This means the main changelog can temporarily exceed the 100-section limit on busy days — it self-corrects on the next push after midnight
4. **Mandatory first rotation** — if the threshold check triggered (step 2), you MUST rotate at least one date group before checking the non-exempt count. Do NOT skip straight to the re-check in step 7 — the trigger means "rotate now", not "check if rotation is needed". Proceed to steps 5–6 with the oldest non-exempt date group
5. **Identify the oldest date group** — among the non-exempt sections (dates before today), find the **oldest date** that appears in any section header. **ALL sections sharing that date form a single date group** — this could be 1 section or 100+ sections. The entire group moves together, no matter how many sections it contains
6. **Rotate the group** — move the entire date group from CHANGELOG.md to CHANGELOG-archive.md:
   - **SHA enrichment** — as each version section is moved, look up its push commit SHA and append ` — [SHORT_SHA](https://github.com/ORG/REPO/commit/FULL_SHA)` to the header. Resolve ORG/REPO from `git remote -v`. If the header already contains a SHA link, skip it. If the lookup fails (commit not found — common when git history is shallow), move the section as-is without a SHA link. **Lookup by changelog type:**
     - **Repo CHANGELOG** — headers contain the repo version directly. For `## [v01.05r] — 2026-02-28 ...`, run `git log --oneline --all --grep="^v01.05r " | head -1`
     - **Page/GAS changelogs** — headers contain the page/GAS version AND a repo version cross-reference at the end (e.g. `## [v01.44w] — 2026-03-13 ... — v03.09r`). **Use the repo version cross-reference** for the lookup — it's the same version that appears in commit messages. Run `git log --oneline --all --grep="^v03.09r " | head -1`. This is more efficient than trying to match page versions to commits, since commit messages use repo version prefixes, not page version prefixes
     - **Batch optimization** — when rotating multiple sections, build a lookup table first: run `git log --oneline --all` once, then match each section's repo version against the output in-memory (or via grep). This avoids N separate `git log` calls for N sections
   - Remove them from CHANGELOG.md
   - Insert them into CHANGELOG-archive.md **above** any previously archived sections but below the archive header, in their original order (reverse-chronological, same as in CHANGELOG.md)
   - On the first rotation, remove the `*(No archived sections yet)*` placeholder
7. **Re-check** — after moving one date group, re-count the non-exempt sections remaining. If still above 100, repeat steps 5–6 with the next oldest date group. Continue until ≤100 non-exempt sections remain (or only today's sections are left)

### Key rules

- **Group by date, not individually** — never split a date group across the two files. All sections from the same day move together. A date group can contain any number of sections — the count of sections in the group is irrelevant; the group always moves as a unit
- **Never rotate today** — today's sections (EST) always stay in CHANGELOG.md regardless of count. The limit is enforced against older dates only
- **Common scenario: all non-exempt sections share one date** — this happens after a busy day followed by a new day. Example: 103 sections total, 3 from today, 100 from yesterday. All 100 from yesterday form one date group → rotate all 100 at once, leaving only today's 3. Do NOT move just enough to reach 100 — the date group is indivisible
- **Preserve content verbatim** — sections are moved exactly as-is (categories, entries, timestamps). No reformatting. The only modification during rotation is SHA enrichment (step 5) — adding a commit SHA link to headers that don't already have one
- **Order in archive** — newest archived sections appear at the top of the archive (just like CHANGELOG.md uses reverse-chronological order). When appending a newly rotated date group, insert it **above** any previously archived sections but below the archive header
- **Threshold is configurable** — the limit of 100 sections is defined in Pre-Commit #7 in CLAUDE.md. To change it, update the number there
- **SHA enrichment is MANDATORY — never skip it** — this is the most commonly skipped step during rotation. The "distraction tunnel" pattern causes it: moving large blocks of text is complex, and the per-section SHA lookup gets lost in the complexity. **Before writing any rotated section to the archive, verify it has a SHA link appended.** If you catch yourself about to insert sections without SHA links, STOP and go back to step 5. The SHA enrichment step applies to BOTH the repo CHANGELOG archive AND all page/GAS changelog archives — every `## [v...]` header in every archive file must have a commit SHA link. For page/GAS changelogs, look up the SHA using the repo version cross-reference at the end of the header (e.g. `— v02.90r` → search for `v02.90r` in git log)

### Post-rotation verification (MANDATORY)

After completing all rotation steps, run this verification before proceeding:

```
grep '^## \[v' CHANGELOG-archive.md | grep -v '— \[' | head -5
```

If ANY lines appear (sections without SHA links), the rotation is incomplete — go back and enrich those sections. **Do not commit until this check passes.** Run the same check on any page/GAS changelog archives that were rotated.

### Examples

**Scenario A: 103 sections, 3 from today, 100 from yesterday (single previous date)**
- 3 sections from today (exempt), 100 from yesterday (non-exempt)
- 100 ≤ 100 → no rotation needed (the threshold counts non-exempt only)

**Scenario B: 104 sections, 3 from today, 101 from yesterday (single previous date)**
- 3 exempt, 101 non-exempt — all 101 share one date
- Rotate ALL 101 at once → 3 sections remain → done
- Result: CHANGELOG has only today's 3 sections

**Scenario C: 102 sections, all from different dates**
- Sections span dates 2026-01-01 through 2026-02-21, today is 2026-02-21
- Today's section (2026-02-21) is exempt → 101 non-exempt sections
- Oldest date group: 2026-01-01 (1 section) → rotate it → 100 non-exempt remain → done

**Scenario D: 102 sections, 5 from today**
- 5 sections from today (exempt), 97 from older dates
- 97 ≤ 100 → no rotation needed despite 102 total

**Scenario E: 105 sections, 3 from today, oldest date has 4 sections**
- 102 non-exempt sections, oldest date has 4 → rotate those 4 → 98 non-exempt remain → done

**Scenario F: 105 sections, 3 from today, oldest two dates have 2 each**
- 102 non-exempt → rotate oldest date (2 sections) → 100 non-exempt → done

---

## [v06.78r] — 2026-03-25 11:54:00 PM EST — [b2bb294](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b2bb294)

> **Prompt:** "nope. in the data poll, its doing the yellow pulling... once, but then moving forward always going from 0 to 14 . the data is still properly being pulled, its just the data poll countdown and polling indication that we are having issues with."

### Fixed
- Data poll timer now shows "polling..." for at least 2 seconds after each poll fires — the GAS inline-JS response arrives faster than the 1s timer tick, so `_dataPollInFlight` was clearing before the timer could display the polling state. Added a 2-second minimum display window based on `_lastDataPollTick` timestamp

#### `testauth1.html` — v03.06w
##### Fixed
- Data poll countdown now shows "polling..." indicator on every poll cycle, not just the first

## [v06.77r] — 2026-03-25 11:47:57 PM EST — [8ba51d7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8ba51d7)

> **Prompt:** "nope. to recap the state we are in, it seems like things are being polled at differennt intervals. the most accurate indicator i have to the real timing is the live indicator top left which seems to be resetting between 15-17 seconds, the dapa poll however is refreshing at random times like 4 seconds remaining going straight to 15, without saying polling or anything"

### Fixed
- Fixed data poll countdown jumping randomly mid-countdown — removed duplicate `_lastDataPollTick = Date.now()` from the `live-data` response handler that was overwriting the request-time timestamp, causing the countdown to reset to 15 at a random point during the cycle

#### `testauth1.html` — v03.05w
##### Fixed
- Data poll countdown now counts down smoothly from 15 to 0 without random jumps

## [v06.76r] — 2026-03-25 11:42:42 PM EST — [767d71c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/767d71c)

> **Prompt:** "no its still not working, and it seems like the iframe is being loaded way too many times in the console i see it quickly reloading over and over"

### Fixed
- Restored `_lastDataPollTick = Date.now()` in `_sendDataPoll()` — removing it in the previous fix left the timer without a baseline, causing display issues. The timestamp is now set in both places: when the request fires (for timer baseline) and when the response arrives (for accurate countdown start)

#### `testauth1.html` — v03.04w
##### Fixed
- Minor internal improvements

## [v06.75r] — 2026-03-25 11:36:58 PM EST — [c955b40](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c955b40)

> **Prompt:** "nice its pulling fresh data now. though the data poll countdown istelf after the first pull is no longer properly showing when its pulling, its going straight from 0 to 15 on a loop, but its not affecting the fresh data pulling so dont break that"

### Fixed
- Data poll timer now shows "polling..." during the request round-trip — moved `_lastDataPollTick` assignment from `_sendDataPoll()` (request sent) to the `live-data` handler (response received), so the timer stays in "polling..." state until the response arrives instead of immediately starting the countdown

#### `testauth1.html` — v03.03w
##### Fixed
- Data refresh countdown now briefly shows "polling..." before resetting, instead of jumping from 0 to 15

## [v06.74r] — 2026-03-25 11:30:27 PM EST — [cdfbe9c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cdfbe9c)

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

## [v06.73r] — 2026-03-25 11:21:12 PM EST — [a6d770d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a6d770d)

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

## [v06.72r] — 2026-03-25 11:11:53 PM EST — [c220871](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c220871)

> **Prompt:** "make the heartbeat every minute for now while we test"

### Changed
- Increased heartbeat test interval from 30s to 60s for testing

#### `testauth1.html` — v03.00w
##### Changed
- Minor internal improvements

## [v06.71r] — 2026-03-25 11:04:58 PM EST — [94e616d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/94e616d)

> **Prompt:** "the data poll lolling seems to be resetting its timer, but its only happening after the heartbeat is going off"

### Fixed
- Data poll iframe now persists across polls instead of being reloaded every 15s — reloading the iframe aborted pending `google.script.run` calls, causing responses to never arrive unless a heartbeat warmed up the GAS context first
- Added `_dataPollIframeReady` flag and `_dataPollIframeOrigin` to track iframe state — subsequent polls send token via `postMessage` to the existing iframe instead of reloading it
- `_stopDataPoll()` now resets `_dataPollIframeReady` and `_dataPollIframeOrigin` for clean teardown

#### `testauth1.html` — v02.99w
##### Fixed
- Data refresh now works reliably — no longer requires a heartbeat to trigger

## [v06.70r] — 2026-03-25 10:57:30 PM EST — [18ad439](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/18ad439)

> **Prompt:** "the data poll is out of wack, it says polling but then the timer goes to 0 the whole time. for some reason it also says disconnected, not sure what that means"

### Fixed
- Data poll safety timeout now resets `_lastDataPollTick` when clearing the in-flight flag — prevents the countdown timer from showing 0:00 after a failed/slow response
- "Disconnected" indicator was a symptom of data poll responses not arriving — the safety timeout fix ensures the timer recovers gracefully between retries

#### `testauth1.html` — v02.98w
##### Fixed
- Data refresh countdown timer no longer gets stuck at 0:00 after a slow server response

## [v06.69r] — 2026-03-25 10:41:59 PM EST — [07ddad4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/07ddad4)

> **Prompt:** "put these useage charts and explanations into a document for my reference"

### Added
- Added `DATA-POLL-ARCHITECTURE.md` reference document — architecture overview, per-call cost comparison, quota usage by activity state, scaling tables, HIPAA compliance summary, and configuration tuning guidance

## [v06.68r] — 2026-03-25 10:23:52 PM EST — [e3f0ac2](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e3f0ac2)

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

## [v06.67r] — 2026-03-25 10:05:15 PM EST — [9a464f3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9a464f3)

> **Prompt:** "im noticing that when the heartbeat is idle, its not showing a countdown timer anymore until we make it ready"

### Fixed
- Heartbeat timer now shows countdown even when idle — previously displayed static "◇ idle" text with no countdown until activity resumed

#### `testauth1.html` — v02.96w
##### Fixed
- Heartbeat timer countdown now remains visible during idle state — shows time until next tick with "◇ idle" indicator

## [v06.66r] — 2026-03-25 09:47:45 PM EST — [c8a789b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c8a789b)

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

## [v06.65r] — 2026-03-25 09:17:26 PM EST — [78752f3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/78752f3)

> **Prompt:** "i want each row always visible dont hide any"

### Changed
- All timer rows (Absolute, Session, Heartbeat, Data Poll) are now always visible in the auth-timers panel — Data Poll shows `--` when idle polling is not active instead of being hidden

#### `testauth1.html` — v02.94w
##### Changed
- All timer rows are now always visible — the Data Poll row shows `--` when inactive instead of disappearing

## [v06.64r] — 2026-03-25 09:11:17 PM EST — [merged]

> **Prompt:** "i meant as a separate row, right now i still only see the heartbeat."

### Changed
- Data poll countdown now shows as its own dedicated row (`Data Poll:`) in the auth-timers panel, separate from the heartbeat row — appears only when idle polling is active and disappears when regular heartbeat resumes

#### `testauth1.html` — v02.93w
##### Changed
- When idle, the timer now counts down to the next background data poll so you can see exactly when fresh data will arrive

## [v06.63r] — 2026-03-25 09:05:04 PM EST — [merged]

> **Prompt:** "just like how the heartbeat has a visible countdown, make the idle one also have its own visible countdown so its easy to distinguish whats happening at any one time"

### Changed
- Idle data poll now shows its own countdown timer (`◇ Xs idle`) based on `IDLE_DATA_POLL_INTERVAL` (15s), distinct from the heartbeat countdown (30s) — makes it easy to see which pipe is active and when the next poll fires

#### `testauth1.html` — v02.92w
##### Changed
- When idle, the heartbeat timer shows a countdown to the next data poll (`◇ 12s idle`) instead of the heartbeat interval, so you can see exactly when the next background data fetch will fire

## [v06.62r] — 2026-03-25 09:00:26 PM EST — [merged]

> **Prompt:** "yes decouple it to its own config variable and make the idle poll every 15 seconds"

### Changed
- Decoupled idle data poll interval from heartbeat interval — new `IDLE_DATA_POLL_INTERVAL` config variable set to 15s (heartbeat remains at 30s), giving 2x data freshness while idle at negligible additional cost

#### `testauth1.html` — v02.91w
##### Changed
- Idle data poll now runs every 15 seconds (was 30s tied to heartbeat) — data stays fresher when you step away, with its own independent config variable

## [v06.61r] — 2026-03-25 08:47:57 PM EST — [merged]

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

## [v06.60r] — 2026-03-25 07:14:40 PM EST — [merged]

> **Prompt:** "go ahead and implement it. make some sort of visual indication on the heartbeat so we can tell the difference between the two pipes firing (also to make sure that both arent happening at the same time)"

### Changed
- Decoupled live data polling from auth heartbeat (Option C) — when idle, a lightweight `getCachedData()` call replaces the full heartbeat, reducing server cost ~10x per idle viewer while keeping data live
- Added visual heartbeat indicator to distinguish active heartbeat (`▶ sending...`) from idle data poll (`◇ polling data...`) and idle countdown (`◇ idle`)

#### `testauth1.html` — v02.89w
##### Changed
- Data stays live even when idle — lightweight background poll replaces the activity-gated heartbeat for data updates
- Heartbeat timer now shows `▶` for active heartbeats and `◇` for idle data polling, so you can tell which pipe is firing

## [v06.59r] — 2026-03-25 05:56:05 PM EST — [merged]

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

## [v06.58r] — 2026-03-25 05:41:07 PM EST — [merged]

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

## [v06.57r] — 2026-03-25 05:01:08 PM EST — [merged]

> **Prompt:** "update the __gas-project-creator to include this change for all scripts moving forward__"

### Changed
- Added `script.scriptapp` OAuth scope to the GAS project creator's `appsscript.json` manifest template so all new projects include the permission needed for installable triggers

#### `gas-project-creator.html` — v01.28w
##### Changed
- Manifest template now includes the `script.scriptapp` scope for installable trigger support

## [v06.56r] — 2026-03-25 04:52:58 PM EST — [merged]

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

## [v06.55r] — 2026-03-25 04:36:47 PM EST — [merged]

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

## [v06.54r] — 2026-03-25 02:58:00 PM EST — [merged]

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

## [v06.53r] — 2026-03-25 02:18:30 PM EST — [merged]

> **Prompt:** (screenshot showing CSP `connect-src` blocking `accounts.google.com` during Google Visualization API query, causing `XhrHttpError: Request Failed, status=0`)

### Fixed
- Fixed CSP `connect-src` blocking Google Visualization API auth redirects to `accounts.google.com` — the gviz query redirects through Google's auth service even for published sheets

#### `rndlivedata.html` — v01.05w
##### Fixed
- Added `https://accounts.google.com` and `https://www.google.com` to CSP `connect-src` — the Visualization Query's XHR redirects through Google's auth endpoint

## [v06.52r] — 2026-03-25 02:13:00 PM EST — [merged]

> **Prompt:** "still says connecting, showing console in case it helps"

### Fixed
- Fixed live data page still stuck on "Connecting..." — CSP `style-src` was blocking Google Charts CSS from `www.gstatic.com`, causing `google.charts.load()` initialization to fail entirely
- Fixed CSP `img-src` blocking developer logo from `www.shadowaisolutions.com`

#### `rndlivedata.html` — v01.04w
##### Fixed
- Added `https://www.gstatic.com` to CSP `style-src` — Google Charts loads CSS (tooltip.css, etc.) from this domain during initialization
- Added `https://fonts.googleapis.com` to CSP `style-src` and `https://fonts.gstatic.com` to CSP `font-src` — preemptive for Google Charts font loading
- Added `https://www.shadowaisolutions.com` to CSP `img-src` — developer logo was blocked

## [v06.51r] — 2026-03-25 02:07:29 PM EST — [merged]

> **Prompt:** "so how do i use this? it says connecting... and doesnt move from there"

### Fixed
- Fixed live data page stuck on "Connecting..." — CSP was blocking Google Charts from loading visualization library from `www.google.com`

#### `rndlivedata.html` — v01.03w
##### Fixed
- Added `https://www.google.com` to Content Security Policy `script-src` directive — Google Charts dynamically loads the visualization library from this domain after the initial loader.js

## [v06.50r] — 2026-03-25 01:57:21 PM EST — [merged]

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

## [v06.49r] — 2026-03-25 12:04:52 PM EST — [merged]

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

## [v06.48r] — 2026-03-25 11:55:30 AM EST — [merged]

> **Prompt:** "the spreadsheet id wasnt swapped for the placeholder, go ahead and swap it now : 1b50Le6G6ocKtx2nMUnCKPjhujSQlabcqUBBAGwlIsaU"

### Changed
- Connected RND Live Data backend to its Google Sheet by replacing the placeholder Spreadsheet ID with the actual ID

#### `rndlivedata.gs` — v01.02g
##### Changed
- Connected to actual Google Sheet for data storage

## [v06.47r] — 2026-03-25 11:43:03 AM EST — [merged]

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

## [v06.46r] — 2026-03-25 11:32:41 AM EST — [merged]

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

## [v06.45r] — 2026-03-25 09:24:15 AM EST — [merged]

> **Prompt:** "every feature that is in the templates should be available in the live projects, and vice versa, make sure that both the projects and the templates match exactly other than the project specific features"

### Added
- Secure nonce endpoint (`getNonce` action + `generatePageNonce()`) to globalacl.gs and programportal.gs — completes the secure page-load flow that replaces insecure `?session=TOKEN` URL pattern
- `setAdminSecret` handler to globalacl.gs — enables the Global ACL hub to distribute shared admin secrets to its own GAS backend (was already present in other projects)

### Fixed
- Page nonce TTL in globalacl.gs increased from 30s to 60s, matching template and other projects — prevents timeout during the two-step nonce handshake on slower connections

#### `globalacl.gs` — v01.25g
##### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces
- Admin secret distribution endpoint — allows the Global ACL hub to push shared secrets to this project
##### Fixed
- Nonce expiry window extended from 30 seconds to 60 seconds, preventing timeouts during slower connections

#### `programportal.gs` — v01.10g
##### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces

## [v06.44r] — 2026-03-25 09:07:53 AM EST — [merged]

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

#### `programportal.html` — v01.30w
##### Fixed
- Panels and overlays now close properly during sign-out

#### `programportal.gs` — v01.09g
##### Fixed
- Renamed cache variable for clarity
- Improved cross-project sign-out error handling



<!-- Rotated 2026-03-26: 21 sections from 2026-03-22 (SHAs unavailable — commits not in shallow history) -->

## [v06.43r] — 2026-03-23 08:34:55 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

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

## [v06.42r] — 2026-03-23 08:05:48 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "after one is clicked, clicking it again should not close it, that should be left to the x button or clicking on a different one. also lower the timeout to 1 second"

### Changed
- Panel buttons no longer toggle-close their own panel — use the X button or open a different panel to close
- Panel cooldown reduced from 5 seconds to 1 second
- All buttons are now disabled during cooldown (including the active panel's button, since it no longer toggles)

#### `testauth1.html` — v02.85w
##### Changed
- Panel buttons now only open — closing is done via the X button or by switching panels
- Cooldown reduced to 1 second

## [v06.41r] — 2026-03-23 07:55:08 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "the timeout should disable the buttons so that they dont seem clickable"

### Changed
- Panel cooldown now visually disables other nav buttons (dimmed, not-allowed cursor, disabled attribute) during the 5-second window — the active panel's button stays enabled so it can be closed

#### `testauth1.html` — v02.84w
##### Changed
- Other panel buttons now appear visually disabled during the cooldown period

## [v06.40r] — 2026-03-23 07:44:01 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "right now if i click on all of the buttons the menus can overlap eachother, make it so that it closes any already open ones if one is clicked, but have there be a 5 second cooldown before it allows to click another one."

### Changed
- Panel buttons (Sessions, Disclosures, My Data, Correction, Amendments) now enforce mutual exclusion — opening one panel automatically closes any other open panel
- Added 5-second cooldown after opening a panel before another can be opened (closing the current panel is always allowed during cooldown)

#### `testauth1.html` — v02.83w
##### Changed
- Navigation panels no longer overlap — only one panel can be open at a time
- Added a brief cooldown between switching panels to prevent rapid toggling

## [v06.39r] — 2026-03-23 07:32:02 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "disclosure accounting is stuck on loading"

### Fixed
- Fixed Disclosure Accounting panel stuck on "Loading..." — `google.script.run` silently drops Date objects returned from spreadsheet cells; converted all date fields to ISO strings before returning from GAS functions
- Fixed same Date serialization issue in Pending Amendments, Amendment History, and Individual Data Export functions

#### `testauth1.gs` — v01.98g
##### Fixed
- Fixed disclosure accounting and amendment panels not loading — date values from spreadsheet are now properly converted to strings

## [v06.38r] — 2026-03-23 07:13:41 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "ok i did that and it worked. now is the method that we did this a vulnerability or will you close it now?"

### Security
- Removed the `seedSampleData` doGet action endpoint from the GAS script — served its purpose, no reason to leave a data-writing endpoint exposed

#### `testauth1.gs` — v01.97g
##### Removed
- Removed the temporary data seeding endpoint — test data has been populated and the endpoint is no longer needed

## [v06.37r] — 2026-03-23 06:56:11 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

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

## [v06.36r] — 2026-03-23 06:29:26 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

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

## [v06.35r] — 2026-03-23 06:08:12 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "now that disclosures works, lets do my data. right now when i try to download, get Error; An internal error occurred. Please try again."

### Fixed
- Fixed "Download My Data" (Right of Access) crashing with "An internal error occurred" — root cause was missing `var SHEET_NAME` declaration in the GAS script, causing a `ReferenceError` when `getIndividualData()` tried to query the main data sheet
- Added missing session error types (`SESSION_EVICTED`, `SESSION_CORRUPT`, `SESSION_INTEGRITY_VIOLATION`) to the Phase A error handler so they return user-friendly messages instead of the generic internal error

#### `testauth1.gs` — v01.94g
##### Fixed
- Data download now works — you can export your data as JSON or CSV from the "My Data" panel
- Improved error messages when sessions are interrupted — you'll see a clear "please sign in again" message instead of a generic error

## [v06.34r] — 2026-03-23 05:53:51 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "ok its no longer overlapping when signed out, but its still overlapping while signing out, same thing for all the others, fix it for all and any moving forward"

### Fixed
- Phase A panels, admin sessions panel, and GCL overlay now close immediately at the start of `performSignOut()` — before the "Signing out..." wall is shown — so no high-z-index overlays float above the signing-out animation
- Root cause: panels had z-index 10010 while signing-out-wall had z-index 10002, so panels stayed visible and interactive during the sign-out process

#### `testauth1.html` — v02.80w
##### Fixed
- Panels and overlays now close immediately when you sign out — no more lingering popups during the sign-out process

## [v06.33r] — 2026-03-23 03:17:49 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "nice its working. though if i sign out while the thing is open, it stays overlayed, make sure that this doesnt happen for this or any others, emphasis on making sure there is no access even if overlapped by the html layer or hiding"

### Fixed
- Phase A panels now close on signout/session expiry — added to `showAuthWall()` cleanup block alongside existing admin panel cleanup
- Phase A panel data content (disclosure lists, amendment text, form inputs) cleared on signout to prevent PHI exposure via DevTools
- Phase A iframe destroyed (`about:blank`) on signout — same HIPAA pattern as main GAS iframe destruction

#### `testauth1.html` — v02.79w
##### Fixed
- HIPAA panels close and clear data when you sign out or your session expires

## [v06.32r] — 2026-03-23 03:11:50 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "ok well at least finally we have something, its saying your session has expired please sign in again in the disclosures button, even though we are already signed in"

### Fixed
- Phase A `_getToken()` read from wrong storage key (`__auth_session` JSON) — now uses existing `loadSession()` which reads from the correct dynamic key (`_pageName + '_gas_session_token'`)

#### `testauth1.html` — v02.78w
##### Fixed
- Session token now correctly retrieved for Phase A operations

## [v06.31r] — 2026-03-23 03:06:26 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "nope all the same. lets tackle one at a time. when i click on disclosures, and its loading, what is supposed to come up"

### Fixed
- Phase A messages rejected by `_KNOWN_GAS_MESSAGES` allowlist — added all 8 Phase A message types to the allowlist so they pass Layer 1 validation

#### `testauth1.html` — v02.77w
##### Fixed
- Added Phase A message types to `_KNOWN_GAS_MESSAGES` allowlist — root cause of panels stuck on loading

## [v06.30r] — 2026-03-23 02:41:17 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

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

## [v06.29r] — 2026-03-23 02:20:16 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

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

## [v06.28r] — 2026-03-23 02:02:30 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

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

## [v06.27r] — 2026-03-23 01:10:04 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

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

## [v06.26r] — 2026-03-23 12:33:53 PM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "see where we left off as far as implementing Hippa compliance for testauth1 ,we were using repository-information/HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md but we have made additions,  look over the repository-information/HIPAA-CODING-REQUIREMENTS.md, think deep. then make a file with the latest implementations as a followup based on the goal of repository-information/HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md"

### Added
- Created `HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md` — follow-up compliance report documenting all security improvements between v01.56g/v02.35w and v01.91g/v02.74w (35 GAS + 39 HTML versions)
- Updated compliance scorecard: 14→16 implemented items, 5→3 partial items
- Documented status upgrades: #5 Access Authorization (⚠️→✅), #22 Minimum Necessary (⚠️→✅)
- Documented 6 new security features beyond the 40-item checklist (SSO, admin panel, secure token exchange, cross-project admin, auto-generated keys, IP logging BAA decision)
- Revised gap analysis with phased remediation roadmap (Phase A-D)

## [v06.25r] — 2026-03-23 10:12:15 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "great. can you make it so that when the sso is dismissed that clicking on that pill will bring it back to try again"

### Added
- SSO indicator pill is now clickable when in "dismissed" state — clicking it retries the GIS token acquisition, showing "pending" then "ready" or "dismissed" based on the result
- Dismissed state label changed from "dismissed" to "retry" to indicate the action available

#### `programportal.html` — v01.29w

##### Added
- Click-to-retry on the SSO indicator when dismissed — re-attempts Google sign-in for SSO token

## [v06.24r] — 2026-03-23 10:04:38 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "no it sstill not working, make sure you actually understand what im asking for. in the instance where the google sign in is closed out, i want the sso pending to go from pending to dismissed. its already properly detecting when ready, just not when its been dismissed. make sure we can even accomplish that think deep and research online"

### Added
- Added `error_callback: _onGisPopupClosed` to all 5 `initTokenClient` calls — GIS fires this callback with `error.type === 'popup_closed'` when the user closes the Google sign-in popup without completing auth
- New "dismissed" state for SSO indicator (red dot, red "dismissed" text) — shown when the GIS popup is closed without signing in

### Fixed
- SSO indicator now correctly detects popup dismissal using GIS's official `error_callback` mechanism instead of relying on OAuth error callbacks (which don't fire when the popup window itself is closed)

#### `programportal.html` — v01.28w

##### Added
- SSO indicator "dismissed" state — red dot and "dismissed" label when the Google sign-in popup is closed without completing auth

## [v06.23r] — 2026-03-23 09:52:01 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "heres the current state of affairs with this. when first signing in, there is no popup because its doing the SSO for me, so it says ready so that is perfect. when i refresh the page, the GIS popup shows up as expected, and the main page says SSO pending until i sign in to the GIS, that is perfect. however, if i close the GIS popup, the SSO stays on pending forever."

### Fixed
- Added `_ssoRefreshDismissed` flag to prevent `startCountdownTimers` from overwriting the SSO indicator back to `pending` after the user dismisses the GIS popup — the race condition was: error callback sets `off`, then `gas-auth-ok` fires `startCountdownTimers` which resets to `pending`

#### `programportal.html` — v01.27w

##### Fixed
- SSO indicator correctly stays on "off" after dismissing the Google sign-in popup, even when the session resumes via the GAS iframe

## [v06.22r] — 2026-03-23 09:42:59 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "idk what you are talking about. im talking about the scenario where like in the screenshot, it says pending, but the user closed the google accounts sign in popup like the other screenshot"

### Fixed
- SSO indicator now resets to `off` when the user closes the Google sign-in popup without completing auth, or when any GIS auth attempt fails

#### `programportal.html` — v01.26w

##### Fixed
- SSO indicator no longer stays stuck on "pending" after the Google sign-in popup is dismissed

## [v06.21r] — 2026-03-23 09:34:07 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "the sso pending indicator is not very accurate. its only saying ready if the GIS was completed before the page load rather than when it actually happens. i think it was much more accurate when it was merged with the heartbeat, dont actually merge it but make it work in the same way"

### Fixed
- Rewired SSO indicator to follow the auth-timers lifecycle — shown/hidden at `startCountdownTimers`/`stopCountdownTimers` instead of at scattered `requestAccessToken` call sites
- Indicator now shows `pending` when session starts (timers appear) and transitions to `ready` when SSO token is actually acquired, matching the accuracy of the heartbeat timer

#### `programportal.html` — v01.25w

##### Fixed
- SSO readiness indicator now accurately tracks SSO token acquisition by hooking into the same auth lifecycle as the session timers

## [v06.20r] — 2026-03-23 09:24:08 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "you have to make sure its not overlapped by our other elements"

### Fixed
- Fixed SSO readiness indicator position from `bottom: 8px` to `bottom: 86px` to avoid overlapping the version indicator, GAS pill, and auth timers stack

#### `programportal.html` — v01.24w

##### Fixed
- SSO indicator no longer overlaps other bottom-right UI elements

## [v06.19r] — 2026-03-23 09:19:18 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "i didnt mean for it to be put on all pages, just for the SSO on the application portal so that we know when its ready to be used to authenticate for the other applications. dont merge it with the heartbeat, it should be its own thing"

### Changed
- Redesigned GIS indicator as a standalone SSO readiness indicator on the application portal only — shows whether the portal is ready to serve SSO tokens to other auth pages (off/pending/ready states)
- Moved indicator out of `#auth-timers` into its own fixed-position pill (`#sso-indicator`) at bottom-right
- Reverted GIS indicator from auth template, testauth1, and globalacl — SSO provider functionality is programportal-specific

#### `programportal.html` — v01.23w

##### Changed
- Replaced GIS popup state indicator with standalone SSO readiness indicator — shows off (gray), pending (orange pulsing), or ready (green) based on whether the portal can serve SSO tokens

## [v06.18r] — 2026-03-23 09:06:12 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "the GIS re-auth popup in the application portal, is there a way to indicate when it has been activated vs not activated."

### Added
- Added GIS popup state indicator to the auth timers panel on all auth pages — a small dot and label in the `#auth-timers` pill shows whether a GIS `requestAccessToken()` call is idle (gray), running silently (orange pulsing), or has an interactive popup open (blue pulsing)

#### `programportal.html` — v01.22w

##### Added
- GIS popup state indicator in auth timers panel (idle/silent/interactive states)

#### `testauth1.html` — v02.74w (no change)

##### Added
- GIS popup state indicator in auth timers panel (idle/silent/interactive states)

#### `globalacl.html` — v01.25w (no change)

##### Added
- GIS popup state indicator in auth timers panel (idle/silent/interactive states)

## [v06.17r] — 2026-03-23 08:38:15 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "make all the projects have both a sign out of all programs button and a sign out of just this program button, you can come up with the wording"

### Added
- Added dual sign-out buttons to all auth pages: "Sign Out" (signs out of the current page only) and "Sign Out All" (signs out of all connected pages via SSO broadcast)
- `performSignOut` now accepts an `opts` parameter with `broadcastSSO` flag to control whether the SSO cross-page sign-out is broadcast

#### `programportal.html` — v01.21w

##### Added
- New "Sign Out" button for signing out of this page only, and "Sign Out All" button for signing out of all connected pages

#### `testauth1.html` — v02.74w

##### Added
- New "Sign Out" button for signing out of this page only, and "Sign Out All" button for signing out of all connected pages

#### `globalacl.html` — v01.25w

##### Added
- New "Sign Out" button for signing out of this page only, and "Sign Out All" button for signing out of all connected pages

## [v06.16r] — 2026-03-23 08:20:05 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "i have to think about it but i thought it was only if accessed via the programportal"

### Fixed
- Restricted SSO token sharing to SSO provider pages only — previously any signed-in auth page responded to SSO token requests (allowing testauth1 to SSO into Program Portal); now only pages with `SSO_PROVIDER: true` (Program Portal) respond to token requests, enforcing the intended hub-spoke SSO direction

#### `programportal.html` — v01.20w

##### Fixed
- SSO token response now gated by SSO_PROVIDER check — only responds to cross-page auth requests when configured as the SSO hub

#### `testauth1.html` — v02.73w

##### Fixed
- SSO token response now gated by SSO_PROVIDER check — no longer provides tokens to other pages

#### `globalacl.html` — v01.24w

##### Fixed
- SSO token response now gated by SSO_PROVIDER check — no longer provides tokens to other pages

## [v06.15r] — 2026-03-23 07:56:51 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "forget about the portal title, i manually removed it. the others however for the global sessions its not recognizing the global ACL or the application portal even though they are all logged in, the testauth is still working"

### Fixed
- Fixed Program Portal `listActiveSessionsInternal` using wrong session storage key (`session_index`) instead of the standard `sessions_EMAIL` pattern — sessions were being stored with one key but read with another, causing Global Sessions to always show 0 sessions for Program Portal

#### `programportal.gs` — v01.08g

##### Fixed
- Fixed session listing to use the correct storage key pattern, matching Global ACL and Testauth1

## [v06.14r] — 2026-03-23 07:45:16 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "the global sessions is working for testauth1, but its not working for the application portal. remember that we removed the "portal" and not have "application portal" instead"

### Fixed
- Fixed Global Sessions panel not showing Program Portal sessions — remote session `project` names from GAS scripts now get overridden with the master spreadsheet display name, preventing name mismatches when a project is renamed

#### `globalacl.gs` — v01.24g

##### Fixed
- Fixed session listing not matching renamed projects in the Global Sessions panel

## [v06.13r] — 2026-03-23 07:30:39 AM EST — [a34eb0c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a34eb0c1d7a819974abbadde66b627cac2a24f71)

> **Prompt:** "yes"

### Fixed
- Removed debug logging from Program Portal auth flow that exposed sensitive data (session tokens, message keys, internal state flags) in the browser console

#### `programportal.html` — v01.19w

##### Fixed
- Removed verbose debug logging that exposed session tokens and auth state in the console
- Converted error-condition logs from debug to warnings for continued troubleshooting visibility


## [v06.12r] — 2026-03-22 03:19:28 PM EST — [sha-unavailable]

> **Prompt:** "that seemed like you did that way too fast, can you make sure everything is set up correctly"

### Fixed
- Aligned HTML-side `SERVER_SESSION_DURATION` with HIPAA GAS preset — was 3600s (1hr, standard) but GAS uses 900s (15min, HIPAA). Client countdown now matches server-side session lifetime

#### `globalacl.html` — v01.23w

##### Fixed
- Session countdown timer now matches server-side 15-minute HIPAA timeout

#### `programportal.html` — v01.18w

##### Fixed
- Session countdown timer now matches server-side 15-minute HIPAA timeout

## [v06.11r] — 2026-03-22 03:12:04 PM EST — [sha-unavailable]

> **Prompt:** "oh i see, its the standard preset vs hipaa preset. i need it to be changed to hipaa preset, i need all our projects with security that we currently have to change all their defaults to the hipaa preset"

### Changed
- Switched Global ACL and all auth templates from standard preset to HIPAA preset — sessionStorage (cleared on tab close), postMessage token exchange (token never in URL), DOM clearing on expiry

#### `globalacl.html` — v01.22w

##### Changed
- Switched to HIPAA security defaults — sessions no longer persist across browser restarts

#### `globalacl.gs` — v01.23g

##### Changed
- Switched from standard to HIPAA preset

## [v06.10r] — 2026-03-22 03:06:49 PM EST — [sha-unavailable]

> **Prompt:** "when opening https://shadowaisolutions.github.io/saistemplateprojectrepo/globalacl.html url directly, without even connecting to anything beforehand, its automatically showing reconnecting, even without any other page being open"

### Fixed
- Pages using localStorage no longer show "Reconnecting" on fresh visits with expired sessions — stale tokens are detected client-side (via absolute/rolling timeout check) and cleared immediately, going straight to the auth wall instead of making a server round-trip

#### `globalacl.html` — v01.21w

##### Fixed
- No longer shows "Reconnecting... Verifying your session" when opening the page fresh after a session has expired

## [v06.09r] — 2026-03-22 02:58:37 PM EST — [sha-unavailable]

> **Prompt:** "im seeing this in the globalacl, fix it so it will work for all projects moving forward"

### Fixed
- Global Sessions panel now correctly parses cross-project responses — handles both plain array (legacy) and `{success, sessions}` (template) formats
- Fixed `validateCrossProjectAdmin` TypeError in template/programportal — was calling `.indexOf()` on a roles object instead of using `checkSpreadsheetAccess()` for role verification

#### `globalacl.gs` — v01.22g

##### Fixed
- Global Sessions panel no longer shows "Invalid JSON response" for other projects

#### `testauth1.gs` — v01.91g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.07g

##### Fixed
- Cross-project admin validation now works correctly

## [v06.08r] — 2026-03-22 02:46:35 PM EST — [sha-unavailable]

> **Prompt:** "ok so understand why you didnt have this working when we initially did the SSO with the global acl, and make sure that this will apply to the templates, go ahead and fix up the template files if you havent already so that they all will be properly set up like the testauth1 is when used for new projects"

### Added
- Complete SSO cross-page token sharing infrastructure to auth template — new projects now inherit SSO support automatically (variable declarations, BroadcastChannel setup, token request/response handlers, sign-out propagation, `attemptSSOAuth()` function, and page-load SSO attempt)

## [v06.07r] — 2026-03-22 02:30:05 PM EST — [sha-unavailable]

> **Prompt:** "there is something wrong with the global ACL. lets exlude the application portal for now and assume im signing in directly. when i duplicate the tab, its expiring the session instead of moving the session to the new tab. it is working properly with the testauth1"

### Fixed
- Fixed tab duplication causing session expiry on localStorage-based pages (Global ACL) — the surrendering tab's `stopCountdownTimers()` removed `SESSION_START_KEY` from shared localStorage, causing the claiming tab's next timer tick to read a missing value, compute `remaining <= 0`, and trigger `performSignOut('session-expired')` which destroyed the session for both tabs

#### `globalacl.html` — v01.20w

##### Fixed
- Tab duplication no longer expires the session — the new tab correctly inherits the active session

#### `testauth1.html` — v02.72w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.17w

##### Changed
- Minor internal improvements

## [v06.06r] — 2026-03-22 02:12:54 PM EST — [sha-unavailable]

> **Prompt:** "the global acl is not showing the Signing in via Program Portal like the testauth1 is, make sure the improvements we have made to testauth1 are also done on the global acl"

### Fixed
- Global ACL now shows "Signing in via Program Portal" during SSO authentication — the `signing-in-subtitle` element ID was missing from the HTML and the subtitle reset logic was missing from `showSigningIn()`

#### `globalacl.html` — v01.19w

##### Fixed
- "Signing in via Program Portal" message now appears during SSO sign-in instead of generic "Setting up your session"

## [v06.05r] — 2026-03-22 02:05:02 PM EST — [sha-unavailable]

> **Prompt:** "ok can you fix it"

### Fixed
- False "Session expiring soon" warning caused by duplicate `gas-auth-ok` messages — the GAS backend sends both an immediate unsigned and an async signed version; the second message incorrectly triggered the `needsReauth` warning after the first had already consumed `_pendingSessionShow`

#### `programportal.html` — v01.16w

##### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

#### `testauth1.html` — v02.71w

##### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

#### `globalacl.html` — v01.18w

##### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

## [v06.04r] — 2026-03-22 01:34:18 PM EST — [sha-unavailable]

> **Prompt:** "go ahead and implement the SSO from the programportal to all remaining applications (testauth1 already has it, i think we are only missing Global ACL)"

### Added
- SSO consumer support for Global ACL page — BroadcastChannel token sharing, automatic sign-in via programportal, and cross-page sign-out propagation

#### `globalacl.html` — v01.17w

##### Added
- SSO variable declarations for ephemeral token sharing (`_ssoAccessToken`, `_ssoUserEmail`, `_ssoChannel`)
- BroadcastChannel SSO listener on `sais-sso-auth` channel — responds to token requests and propagates sign-out events
- `attemptSSOAuth()` function — on page load with no session, requests token from SSO provider via BroadcastChannel with 2-second timeout fallback to auth wall
- SSO-aware page-load initialization — tries SSO before showing auth wall
- Token holding in `handleTokenResponse()` and email holding in `showApp()` for SSO sharing
- SSO sign-out broadcast on manual sign-out (session expiry remains page-local)
- SSO token cleanup in `clearSession()`

## [v06.03r] — 2026-03-22 12:51:12 PM EST — [sha-unavailable]

> **Prompt:** "wait now its not doing the silent GIS re-auth at all"

### Fixed
- SSO token re-acquisition now polls for GIS library readiness (up to 5s) instead of checking once — GIS loads async and wasn't available when the reconnect IIFE ran at page load

#### `programportal.html` — v01.15w

##### Fixed
- SSO token re-acquisition waits for GIS library to load during reconnect

#### `testauth1.html` — v02.70w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.16w

##### Changed
- Minor internal improvements

## [v06.02r] — 2026-03-22 12:45:46 PM EST — [sha-unavailable]

> **Prompt:** "in the application portal, the silent GIS re-auth is showing after the application portal is already visible, can it happen while we are reconnecting instead?"

### Changed
- Moved silent GIS token re-acquisition from the `gas-auth-ok` handler (after app is visible) to the reconnect path (while "Reconnecting..." overlay is shown), so it runs in parallel with session verification and completes before the app appears

#### `programportal.html` — v01.14w

##### Changed
- SSO token re-acquisition now happens during reconnect overlay instead of after app is shown

#### `testauth1.html` — v02.69w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.15w

##### Changed
- Minor internal improvements

## [v06.01r] — 2026-03-22 12:33:58 PM EST — [sha-unavailable]

> **Prompt:** "the application portal is back to saying \uD83D\uDD10 and \uD83C\uDF10 , fix it so it doesnt"

### Fixed
- Program Portal GAS script emoji rendering — replaced double-escaped Unicode surrogate pairs (`\\uD83D\\uDD10`) with actual emoji characters so they display correctly instead of showing raw escape codes

#### `programportal.gs` — v01.06g

##### Fixed
- All emoji now render correctly instead of showing as `\uD83D\uDD10` escape codes

## [v06.00r] — 2026-03-22 12:29:36 PM EST — [sha-unavailable]

> **Prompt:** "when the application portal is reconnecting, have it mentions something like GIS re-auth is going to happen, but in more user understandable words"

### Changed
- Program Portal reconnecting subtitle now says "Verifying your session and preparing sign-in for linked apps" to inform users that SSO will be refreshed

#### `programportal.html` — v01.13w

##### Changed
- Reconnecting subtitle updated to mention linked app sign-in preparation

## [v05.99r] — 2026-03-22 12:23:54 PM EST — [sha-unavailable]

> **Prompt:** "ok but now its making it so when i refresh the testauth1 page, its doing the silent GIS re-auth, even if i signed into the application directly"

### Fixed
- Silent GIS token re-acquisition now gated behind `HTML_CONFIG.SSO_PROVIDER` flag — only fires on the application portal (the designated SSO hub), not on child apps like testauth1 or globalacl

#### `programportal.html` — v01.12w

##### Changed
- Added `SSO_PROVIDER: true` config flag — portal re-acquires Google token on reconnect for SSO sharing

#### `testauth1.html` — v02.68w

##### Changed
- Added `SSO_PROVIDER: false` config flag — no silent GIS re-auth on reconnect

#### `globalacl.html` — v01.14w

##### Changed
- Added `SSO_PROVIDER: false` config flag — no silent GIS re-auth on reconnect

## [v05.98r] — 2026-03-22 12:08:17 PM EST — [sha-unavailable]

> **Prompt:** "ive noticed that the application portal works great on a fresh sign in to it, when i click on testauth1 it automatically authenticates it via the application portal. however, if i refresh the page of the application portal, and it goes through "reconnecting" the testauth1 link no longer automatically authenticates, it just asks for a sign in required"

### Fixed
- SSO auto-authentication now works after page refresh/reconnect — the Google access token (`_ssoAccessToken`) is silently re-acquired via GIS after a successful reconnect, so the portal can respond to SSO requests from child apps

#### `programportal.html` — v01.11w

##### Fixed
- SSO token re-acquired after reconnect so child apps can auto-authenticate

#### `testauth1.html` — v02.67w

##### Fixed
- SSO token re-acquired after reconnect so child apps can auto-authenticate

#### `globalacl.html` — v01.13w

##### Fixed
- SSO token re-acquired after reconnect so child apps can auto-authenticate

## [v05.97r] — 2026-03-22 11:38:56 AM EST — [sha-unavailable]

> **Prompt:** "the session active elsewhere should mention what application its referring to"

### Changed
- "Session Active Elsewhere" overlay now shows the application name in the heading and message text, using `document.title` to identify which app's session is active elsewhere

#### `testauth1.html` — v02.66w

##### Changed
- "Session Active Elsewhere" heading and message now include the application name

#### `globalacl.html` — v01.12w

##### Changed
- "Session Active Elsewhere" heading and message now include the application name

#### `programportal.html` — v01.10w

##### Changed
- "Session Active Elsewhere" heading and message now include the application name

## [v05.96r] — 2026-03-22 11:28:22 AM EST — [sha-unavailable]

> **Prompt:** "remove the "portal" environment, be careful and do not mistake if for the "programportal" environment which is its replacement"

### Removed
- Removed the old "portal" environment entirely — all files deleted: `portal.html`, `portal.gs`, `portal.config.json`, version files, changelogs, changelog archives, diagram, and backup
- Removed Portal GAS deployment step from the CI/CD workflow
- Removed Portal from the GAS Projects table in gas-scripts rules
- Removed portal.html link from `open-all.html`
- Removed all Portal references from REPO-ARCHITECTURE.md diagram nodes and edges

#### `open-all.html` — v01.01w

##### Removed
- Removed portal.html link from the project list and Open All button

## [v05.95r] — 2026-03-22 01:26:48 AM EST — [sha-unavailable]

> **Prompt:** "its still saying signing in on the setting up your session page, it should be mentioned there if its signing in via the portal or not there"

### Fixed
- Fixed SSO sign-in subtitle not showing — the subtitle was being set before `exchangeToken()` which calls `showSigningIn()` and resets it. Now the subtitle is set after `exchangeToken()` so "Signing in via Program Portal" is visible during SSO authentication

#### `programportal.html` — v01.09w

##### Fixed
- "Signing in via [source]" subtitle now correctly displays during SSO authentication

#### `testauth1.html` — v02.65w

##### Fixed
- "Signing in via [source]" subtitle now correctly displays during SSO authentication

## [v05.94r] — 2026-03-22 01:19:31 AM EST — [sha-unavailable]

> **Prompt:** "can you have the distinguish when signing in via the application portal and when signing in independently"

### Changed
- SSO sign-in now shows source page name — "Signing in via Program Portal" instead of generic "Setting up your session" when authenticating through SSO from another page

#### `programportal.html` — v01.08w

##### Changed
- Sign-in screen now shows which page provided your credentials when signing in via SSO

#### `testauth1.html` — v02.64w

##### Changed
- Sign-in screen now shows which page provided your credentials when signing in via SSO

## [v05.93r] — 2026-03-22 01:03:31 AM EST — [sha-unavailable]

> **Prompt:** "what do you think we should do and why?"

### Fixed
- Fixed SSO sign-out propagation — session expiry on one page no longer signs out other pages with valid sessions. Only deliberate sign-outs (user clicks "Sign Out") propagate across SSO-connected pages

#### `programportal.html` — v01.07w

##### Fixed
- Session timeout on other pages no longer disrupts your session — only deliberate sign-outs affect all pages

#### `testauth1.html` — v02.63w

##### Fixed
- Session timeout on other pages no longer disrupts your session — only deliberate sign-outs affect all pages

## [v05.92r] — 2026-03-22 12:27:41 AM EST — [sha-unavailable]

> **Prompt:** "for the repository-information/12-HIPAA-SSO-IMPLEMENTATION-PLAN.md i believe we are ready for phase 2, go ahead and start implementing it if we are ready to proceed. remember that the goal of this is so that we can use the programportal as the starting point to authenticate into the other projects, you should have what we are trying to accomplish documented somewhere"

### Added
- Implemented Phase 2 BroadcastChannel SSO — programportal.html and testauth1.html now share Google OAuth tokens via ephemeral in-memory BroadcastChannel ('sais-sso-auth'), enabling single sign-on across auth pages
- Added `attemptSSOAuth()` function to both pages — on page load (no existing session), broadcasts a token request and auto-authenticates if another auth page responds within 2 seconds
- Added bidirectional SSO token provision — both pages can act as SSO provider (whichever the user signs into first shares tokens with the other)
- Added cross-page sign-out propagation via `sso-sign-out` broadcast — signing out from one page signs out all SSO-connected pages

### Changed
- Changed testauth1.html CLIENT_ID to match programportal's shared CLIENT_ID (`216764502068-7j0j6svmparsrfgdf784dneltlirpac2`) — required for cross-page Google token sharing

#### `programportal.html` — v01.06w

##### Added
- Single sign-on support — sign in once, other auth pages auto-authenticate without a sign-in prompt
- Cross-page sign-out — signing out from any connected page signs out all pages

#### `testauth1.html` — v02.62w

##### Added
- Single sign-on support — auto-authenticates when another auth page (like Program Portal) is already signed in
- Cross-page sign-out — signing out from any connected page signs out all pages

##### Changed
- Shared Google OAuth client for unified sign-in experience across all auth pages

Developed by: ShadowAISolutions





<!-- Rotated 2026-03-25: 33 sections from 2026-03-21 (SHAs unavailable — commits not in shallow history) -->

## [v05.91r] — 2026-03-21 11:48:05 PM EST — [sha-unavailable]

> **Prompt:** "we are in!, but now add all of the gas features that we had in the "portal" to the "programportal""

### Added
- Added full portal dashboard UI to programportal.gs — replaces the debug "1" placeholder with the complete application portal: app cards grid, access filter toggle, open mode toggle, per-user ACL access display
- Added `getUserAppAccess()` function to programportal.gs — reads per-page access from the master ACL spreadsheet

#### `programportal.gs` — v01.05g

##### Added
- Full portal dashboard with app cards, access toggles, and styled UI — replaces debug placeholder
- Per-user app access display from ACL spreadsheet

## [v05.90r] — 2026-03-21 11:40:26 PM EST — [sha-unavailable]

> **Prompt:** "Mar 21, 2026, 11:38:07 PM  Error  ReferenceError: pageNonce is not defined at doGet(Code:2146:33)"

### Fixed
- Added missing `pageNonce` variable extraction and `validatePageNonce()` function to programportal.gs — `doGet()` was crashing with ReferenceError because `pageNonce` was used in the template literal but never defined

#### `programportal.gs` — v01.04g

##### Fixed
- Sign-in no longer crashes — added missing page nonce validation that was present in testauth1 but missing from programportal

## [v05.89r] — 2026-03-21 11:34:54 PM EST — [sha-unavailable]

> **Prompt:** "we are getting login success again, but still stuck on the signing in setting up your session page"

### Added
- Debug logging in programportal.html postMessage handler to trace auth flow — logs every GAS message type, pending token state, and session state to browser console

#### `programportal.html` — v01.05w

##### Added
- Console debug logging for auth flow troubleshooting — shows all postMessage traffic and auth state

## [v05.88r] — 2026-03-21 11:25:17 PM EST — [sha-unavailable]

> **Prompt:** "we are still stuck on the signing in page but we are not getting login success.  i want you to use the same exact deployment variables that were used in the "portal" in the "programportal", but there might be extra that didnt exist for it so you might have to add those. assume that the "portal" doesnt exist anymore, just the "programportal" i have alreadyreplaced the gas with the programportal gas"

### Fixed
- Set programportal's deployment ID and encoded URL (`_e`) to portal's working deployment ID — user has already replaced the GAS code in that deployment with programportal.gs

#### `programportal.html` — v01.04w

##### Fixed
- Connected to working GAS deployment — sign-in flow should now complete

#### `programportal.gs` — v01.03g

##### Changed
- Set deployment ID to match the live GAS project

## [v05.87r] — 2026-03-21 11:14:52 PM EST — [sha-unavailable]

> **Prompt:** "no it is not working. keep in mind that i dont want to use the "portal" anymore, the code should be for the "programportal" only"

### Changed
- Decoupled programportal from portal's GAS deployment — programportal is now a standalone project that needs its own GAS deployment
- Restored `TOKEN_EXCHANGE_METHOD: 'postMessage'` to match the hipaa preset in programportal.gs
- Reset deployment ID to placeholder pending own GAS project deployment

#### `programportal.html` — v01.03w

##### Changed
- Restored postMessage token exchange (HIPAA) — requires own GAS deployment with hipaa preset
- Cleared deployment URL pending own GAS project setup

#### `programportal.gs` — v01.02g

##### Changed
- Reset deployment ID to placeholder pending own GAS project deployment

## [v05.86r] — 2026-03-21 11:01:21 PM EST — [sha-unavailable]

> **Prompt:** "the application portal, im stuck in signing in page even though we are getting login success in the session log"

### Fixed
- Fixed programportal sign-in getting stuck on "Signing in..." — changed TOKEN_EXCHANGE_METHOD from 'postMessage' to 'url' to match the deployed GAS backend's standard preset configuration

#### `programportal.html` — v01.02w

##### Fixed
- Sign-in no longer gets stuck on "Signing in..." screen

## [v05.85r] — 2026-03-21 10:45:49 PM EST — [sha-unavailable]

> **Prompt:** "oh yes i forgot to tell you to continue, go ahead and make it use the variables that we have in the "portal""

### Changed
- Configured programportal with portal's production values — OAuth Client ID, HIPAA config preset (sessionStorage, postMessage, DOM clearing, 30s test heartbeat), deployment URL encoding, and deployment ID

#### `programportal.html` — v01.01w

##### Changed
- Configured with portal's OAuth Client ID and HIPAA security settings
- Sessions now clear on tab close and tokens are exchanged securely

#### `programportal.gs` — v01.01g

##### Changed
- Set production deployment ID

## [v05.84r] — 2026-03-21 10:34:56 PM EST — [sha-unavailable]

> **Prompt:** "then use the template to make an environment with the same variables as the "portal", but call it "programportal", then when you are done, ask me to tell you to continue, and you will then add the code used for the pre-recreated portal"

### Added
- New GAS project "programportal" — Program Portal page created from auth template with HIPAA preset, using portal's same spreadsheet, ACL, and sound file config values

## [v05.83r] — 2026-03-21 10:18:19 PM EST — [sha-unavailable]

> **Prompt:** "Do all groups at once"

### Changed
- Portal HIPAA conversion: Phase 1 partial — added CSP meta tag, upgraded HTML_CONFIG to HIPAA preset (sessionStorage, postMessage, single-tab, cross-device, DOM clearing), restructured auth-wall with sub-panels (signin/reconnecting/signing-in), added signing-out overlay, tab-takeover wall, session/absolute warning banners, countdown timers widget, admin session panel, role badge in user pill

#### `portal.html` — v01.19w

##### Changed
- Upgraded security settings for HIPAA compliance — sessions now clear on tab close and tokens are exchanged securely
- Added session status indicators and warning banners
- Added "Session Active Elsewhere" overlay for single-tab enforcement
- Added admin session management panel

## [v05.82r] — 2026-03-21 08:54:13 PM EST — [sha-unavailable]

> **Prompt:** "write up the plan with all context in a new file you need in case of interruptions, think deep, research online, write large files in chunks, etc"

### Added
- Created `12-HIPAA-SSO-IMPLEMENTATION-PLAN.md` — comprehensive two-phase plan for HIPAA-compliant SSO between portal and testauth1 (725 lines, includes gap analysis, research findings, implementation steps, testing checklist, and revert procedure)

## [v05.81r] — 2026-03-21 08:08:47 PM EST — [sha-unavailable]

> **Prompt:** "proceed with the detailed implementation plan, add a note somewhere so we can easily revert to how it currently is should our update not work"

### Added
- Created pre-SSO backups of `portal.html` and `testauth1.html` in `repository-information/backups/`
- Added `SSO-REVERT-INSTRUCTIONS.md` with step-by-step revert procedure

## [v05.80r] — 2026-03-21 07:08:43 PM EST — [sha-unavailable]

> **Prompt:** "add this feature to the application portal"

### Added
- Integrated multi-tab project opener into the portal page — floating "Projects" button with expandable panel listing all project pages and "Open All in New Tabs" functionality

#### `portal.html` — v01.18w
##### Added
- Floating "Projects" pill button (bottom-left, auth-gated) with expandable panel
- Panel lists all project pages with individual links and descriptions
- "Open All in New Tabs" button to bulk-open every project page
- Popup blocker detection and warning message
- Click-outside and Escape key dismiss for the panel

## [v05.79r] — 2026-03-21 06:53:58 PM EST — [sha-unavailable]

> **Prompt:** "is there such thing as a link that opens multiple tabs with different pages, if possible i want a single link in the project structure in the readme that will open all of our html projects in different tabs"

### Added
- Created `open-all.html` utility page — opens all project pages in separate browser tabs with a single button click
- Added version file, changelog, and changelog archive for the new page
- Added `open-all.html` entry to README project tree and REPO-ARCHITECTURE.md diagram

#### `open-all.html` — v01.00w
##### Added
- New utility page with "Open All in New Tabs" button that opens all 6 project pages in separate tabs
- Individual links to each project page as fallback
- Dark theme matching existing site design

## [v05.78r] — 2026-03-21 06:28:47 PM EST — [sha-unavailable]

> **Prompt:** "remove the testauth2 environment"

### Removed
- Removed testauth2 environment: deleted `testauth2.html`, its HTML version file, changelog, and changelog archive
- Removed testauth2 entry from README.md structure tree

## [v05.77r] — 2026-03-21 06:15:12 PM EST — [sha-unavailable]

> **Prompt:** "there were places that were not prepared for this change, such as in the example here where its showing the |, look everywhere to see everything that was impacted by this change"

### Fixed
- Fixed pipe characters leaking into GAS changelog popup title — `GAS Changelog — |v01.90g|` now displays as `GAS Changelog — v01.90g`

#### `index.html` — v01.09w
##### Fixed
- GAS changelog popup title no longer shows pipe characters

#### `testenvironment.html` — v01.09w
##### Fixed
- GAS changelog popup title no longer shows pipe characters

#### `gas-project-creator.html` — v01.26w
##### Fixed
- GAS changelog popup title no longer shows pipe characters

#### `testauth1.html` — v02.61w
##### Fixed
- GAS changelog popup title no longer shows pipe characters

#### `testauth2.html` — v01.09w
##### Fixed
- GAS changelog popup title no longer shows pipe characters

#### `portal.html` — v01.17w
##### Fixed
- GAS changelog popup title no longer shows pipe characters

#### `globalacl.html` — v01.11w
##### Fixed
- GAS changelog popup title no longer shows pipe characters

## [v05.76r] — 2026-03-21 06:07:27 PM EST — [sha-unavailable]

> **Prompt:** "noticing that the text files for html and gas have different formatting for version number i.e. v01.90g and |v02.59w| . make the format in every project and template like the html format, i.e. |v01.90g|"

### Changed
- Standardized GAS version file format from plain `v01.90g` to pipe-delimited `|v01.90g|`, matching the HTML version file format (`|v02.59w|`)
- Updated GAS version polling code in all HTML pages and templates to parse pipe-delimited format, displaying clean version strings without pipes in the UI pill
- Updated setup-gas-project.sh to create new GAS version files with pipe-delimited format
- Updated CLAUDE.md Pre-Commit #1, gas-scripts.md, html-pages.md, and init-scripts.md rules to document the new pipe-delimited GAS version format

#### `index.html` — v01.08w
##### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

#### `testenvironment.html` — v01.08w
##### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

#### `gas-project-creator.html` — v01.25w
##### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

#### `testauth1.html` — v02.60w
##### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

#### `testauth2.html` — v01.08w
##### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

#### `portal.html` — v01.16w
##### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

#### `globalacl.html` — v01.10w
##### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

## [v05.75r] — 2026-03-21 05:47:28 PM EST — [sha-unavailable]

> **Prompt:** "the fixes that we have made to the testauth1, make sure those are applied to the templates"

### Changed
- Propagated testauth1 auth fixes (v05.65r–v05.74r) to both auth templates — nonce-based authentication flow, signature exemptions, CacheService eventual consistency workarounds, updated Use Here and page-load resume handlers

## [v05.74r] — 2026-03-21 05:21:32 PM EST — [sha-unavailable]

> **Prompt:** "refreshing a logged in page is still getting stuck on the reconnecting page" + "uppon successful login in the audit log it is logging in, showing login success, but theres also a security event as per screenshot"

### Fixed
- Fixed page refresh and "Use Here" stuck on "Reconnecting..." — replaced unreliable `loadIframeViaNonce()` (CacheService eventual consistency) with direct `?session=` iframe load on both paths. The postMessage handshake guard protects against direct URL access
- Fixed `invalid_signature` security event on login — the immediate unsigned `gas-auth-ok` was being rejected by HMAC verification when the key had already been imported from `gas-session-created`. Added `gas-auth-ok` to the HMAC signature-exempt list

#### `testauth1.html` — v02.59w
##### Fixed
- Page refresh and "Use Here" reconnect immediately instead of getting stuck
- Sign-in no longer triggers a false `invalid_signature` security event

## [v05.73r] — 2026-03-21 05:14:49 PM EST — [sha-unavailable]

> **Prompt:** "nope, your last change does not fix the refresh not reconnecting"

### Fixed
- Restored immediate unsigned `gas-auth-ok` postMessage before the async `google.script.run.signAppMessage()` call — v05.69r removed this and left only the async path, but `google.script.run` is too slow on the nonce/refresh path, causing the parent page to stay stuck on "Reconnecting..." indefinitely
- The immediate `gas-auth-ok` fires synchronously on page load; the signed version follows asynchronously as belt-and-suspenders

#### `testauth1.gs` — v01.90g
##### Fixed
- Page refresh and "Use Here" now complete immediately instead of waiting for async server round-trip

## [v05.72r] — 2026-03-21 05:08:29 PM EST — [sha-unavailable]

> **Prompt:** "alright so this is working now, but now when i refresh the page, it is perpetually stuck on "reconnecting verifying your session" page. same deal when using the "Use Here" button"

### Fixed
- Skip postMessage handshake guard on `?page_nonce=` path — nonces are one-time-use so a copied nonce URL is already useless (no handshake needed for replay protection). The handshake was blocking the page refresh and "Use Here" flows because it ran unconditionally

#### `testauth1.gs` — v01.89g
##### Fixed
- Handshake guard now only runs on `?session=` path (initial sign-in); nonce-loaded pages skip it

## [v05.71r] — 2026-03-21 04:58:52 PM EST — [sha-unavailable]

> **Prompt:** "applause, you got it working! write up in its own document everything you have learned throughout this implementation troubleshooting, what worked, what was happening, and what ended up working"

### Added
- Created `AUTH-DIRECT-ACCESS-FIX.md` — comprehensive write-up of the multi-session troubleshooting effort to fix direct URL access to authenticated GAS apps, covering all 12 attempts (v05.59r through v05.70r), root causes discovered (GAS multi-iframe nesting, CacheService eventual consistency, impossibility of server-side origin detection), and the final postMessage handshake guard solution

## [v05.70r] — 2026-03-21 04:51:56 PM EST — [sha-unavailable]

> **Prompt:** "yes"

### Security
- Replaced broken iframe guard (`window.parent === window.top`) with postMessage handshake — the old guard never fired because GAS wraps content in multiple nested iframes, making `window.parent` always point to Google's wrapper rather than `window.top`
- Added postMessage handshake guard to portal.gs (previously had no iframe guard at all)
- Direct URL access to authenticated GAS apps now shows "Access denied" after 2-second timeout instead of the full authenticated UI

#### `testauth1.html` — v02.58w
##### Security
- Added frame handshake responder to verify GAS iframe is embedded in the correct parent page

#### `testauth1.gs` — v01.88g
##### Security
- Replaced broken iframe guard with postMessage handshake that verifies embedding via challenge-response with the parent page

#### `portal.html` — v01.15w
##### Security
- Added frame handshake responder to verify GAS iframe is embedded in the correct parent page

#### `portal.gs` — v01.16g
##### Security
- Added postMessage handshake guard — portal previously had no protection against direct URL access

## [v05.69r] — 2026-03-21 03:31:22 PM EST — [sha-unavailable]

> **Prompt:** "same deal, deeply think about this and look online for a solution"

### Fixed
- Root cause identified: GAS CacheService is eventually consistent — `cache.put()` followed by `cache.get()` can return `null`. The page nonce written in `exchangeTokenForSession()` was not readable by `validatePageNonce()` moments later, causing the auth wall to be served silently
- Reverted initial sign-in to use `?session=TOKEN` directly (safe: token is brand new, URL only in iframe network request, OAuth already verified)
- Removed hard-block on `?session=` parameter — still needed for sign-in flow
- Removed immediate unsigned `gas-auth-ok` and sig-exempt workarounds (no longer needed with `?session=` path)
- Nonce flow (`loadIframeViaNonce`) remains for page refresh, tab reclaim, and cross-tab sync (replay protection for existing tokens)

#### `testauth1.html` — v02.57w
##### Fixed
- Sign-in uses `?session=TOKEN` directly, avoiding CacheService race condition
##### Changed
- Removed `gas-auth-ok` from signature-exempt list (HMAC verification restored)

#### `testauth1.gs` — v01.87g
##### Changed
- Removed hard-block on `?session=` parameter — both `?session=` and `?page_nonce=` are valid
- Removed `pageNonce` generation from `exchangeTokenForSession()` (not needed for `?session=` sign-in)
- Removed immediate unsigned `gas-auth-ok` postMessage (reverted to signed-only via `google.script.run`)

## [v05.68r] — 2026-03-21 03:22:38 PM EST — [sha-unavailable]

> **Prompt:** "session log is fine, but we are still stuck on the "Setting up your session" page"

### Fixed
- Send `gas-auth-ok` immediately via `window.top.postMessage()` from the GAS app HTML — `google.script.run.signAppMessage()` async call was not firing or completing, leaving the page stuck on "Signing in..."
- Added `gas-auth-ok` to HMAC signature-exempt list — allows unsigned immediate `gas-auth-ok` to be processed while signed version arrives later

#### `testauth1.html` — v02.56w
##### Fixed
- Sign-in now completes immediately without waiting for async server call

#### `testauth1.gs` — v01.86g
##### Fixed
- App sends unsigned `gas-auth-ok` immediately on load, with signed version following asynchronously

## [v05.67r] — 2026-03-21 03:12:33 PM EST — [sha-unavailable]

> **Prompt:** "still not working stuck on log in page. in the session logs we are getting the 3 lines that you see in the screenshot"

### Fixed
- Added `gas-ready-for-token` to HMAC signature-exempt list — this message comes from the token exchange listener page which has no signing key; when a user re-signs in with an existing HMAC key from a prior session, the message was being rejected as `invalid_signature`

#### `testauth1.html` — v02.55w
##### Fixed
- Sign-in flow no longer blocked by HMAC verification of unsigned token exchange messages

## [v05.66r] — 2026-03-21 03:06:45 PM EST — [sha-unavailable]

> **Prompt:** "nope, your change causes all of this and we are stuck in signing in page"

### Fixed
- Fixed sign-in flow stuck on "Signing in..." — the two-step nonce round-trip during OAuth token exchange introduced timing/state issues between `gas-session-created` and `gas-auth-ok`
- Generate page nonce server-side inside `exchangeTokenForSession()` and include it in the `gas-session-created` response — eliminates the intermediate `?action=getNonce` iframe navigation during sign-in

#### `testauth1.html` — v02.54w
##### Fixed
- Sign-in no longer gets stuck on "Signing in..." screen — uses server-provided nonce directly

#### `testauth1.gs` — v01.85g
##### Changed
- Token exchange now returns a pre-generated page nonce alongside the session token

## [v05.65r] — 2026-03-21 02:51:28 PM EST — [sha-unavailable]

> **Prompt:** "continuing where we left off last time, we were trying to make it so that the script link would not be auto authenticated when opened by itself. think deep and research online about this issue"

### Changed
- Replaced all `?session=TOKEN` iframe loads with one-time-use `?page_nonce=NONCE` flow — session tokens no longer appear in any URL
- Hard-blocked `?session=` parameter in GAS `doGet()` — direct URL access with session tokens is now rejected

### Added
- `action=getNonce` listener route in GAS `doGet()` — generates one-time-use page nonces via `google.script.run.generatePageNonce()`
- `loadIframeViaNonce()` helper function in testauth1.html — centralizes the two-step nonce flow for all authenticated iframe loads
- `gas-nonce-ready` and `gas-nonce-result` postMessage handlers for the nonce generation flow
- Increased page nonce TTL from 30 seconds to 60 seconds for the two-step flow

#### `testauth1.html` — v02.53w
##### Changed
- Sign-in, session restore, tab reclaim, and cross-tab sync all now use nonce-based iframe loading instead of direct session token URLs
- Session tokens are never exposed in browser history, network logs, or shareable URLs

#### `testauth1.gs` — v01.84g
##### Added
- Nonce generation listener page (`action=getNonce`) for secure iframe loading
##### Changed
- Direct `?session=` parameter access is now hard-blocked — serves auth wall instead of authenticated content
- Page nonce TTL increased from 30s to 60s

## [v05.64r] — 2026-03-21 01:01:38 PM EST — [sha-unavailable]

> **Prompt:** "same still suck on setting up your session page"

### Fixed
- Reverted postMessage handshake flow — GAS sandbox cross-origin constraints prevent reliable multi-step nonce exchange; restored `?session=` URL parameter for iframe loading
- The iframe guard (`window.parent === window.top`) remains as the primary defense against direct `/exec` access

#### `testauth1.html` — v02.52w
##### Fixed
- Sign-in flow restored to working state

#### `testauth2.html` — v01.07w
##### Fixed
- Sign-in flow restored to working state

#### `globalacl.html` — v01.09w
##### Fixed
- Sign-in flow restored to working state

#### `testauth1.gs` — v01.83g
##### Fixed
- Restored simple auth response for unauthorized requests

#### `globalacl.gs` — v01.21g
##### Fixed
- Restored simple auth response for unauthorized requests

## [v05.63r] — 2026-03-21 12:45:23 PM EST — [sha-unavailable]

> **Prompt:** "unfortunately now we are stuck in the setting up your session screen"

### Fixed
- Fixed handshake page nonce redirect — the GAS sandbox can't navigate itself to `/exec` (different origin), so the handshake now posts `gas-handshake-complete` with the nonce to the parent page, which sets `gasApp.src` to the nonce URL
- Added `gas-handshake-complete` message type to allowed message whitelist and signature exempt list

#### `testauth1.html` — v02.51w
##### Fixed
- Session setup now completes properly after sign-in

#### `testauth2.html` — v01.06w
##### Fixed
- Session setup now completes properly after sign-in

#### `globalacl.html` — v01.08w
##### Fixed
- Session setup now completes properly after sign-in

#### `testauth1.gs` — v01.82g
##### Fixed
- Handshake page now sends nonce to parent for iframe reload instead of navigating within the sandbox

#### `globalacl.gs` — v01.20g
##### Fixed
- Handshake page now sends nonce to parent for iframe reload instead of navigating within the sandbox

## [v05.62r] — 2026-03-21 12:31:09 PM EST — [sha-unavailable]

> **Prompt:** "go ahead and do your recommendation, but CSP i will save for much later when im done with coding everything"

### Added
- postMessage handshake flow for GAS iframe authentication — session tokens never appear in the iframe URL
- `generatePageNonce()` and `validatePageNonce()` server functions — bind a validated session to a single page load via one-time-use nonce with 30-second TTL
- Handshake page served by `doGet()` when no valid session/nonce present — challenges parent via postMessage, generates nonce, redirects to `?page_nonce=`
- 5-second timeout on handshake page — direct `/exec` access shows "Access denied" instead of serving any content
- `gas-handshake-challenge` message type to allowed message whitelist and signature exempt list

### Changed
- All 5 `?session=TOKEN` iframe URL assignments replaced with bare `baseUrl` — session token exchange happens exclusively via postMessage
- GAS `doGet()` now accepts `?page_nonce=` parameter as the primary authentication path (legacy `?session=` still accepted for backward compatibility)

### Security
- Session tokens no longer exposed in iframe URLs — prevents token extraction via DevTools, network inspector, or URL copy
- Direct browser access to GAS `/exec` URL now shows nothing useful — handshake requires a parent frame to respond

#### `testauth1.html` — v02.50w
##### Changed
- Session token exchange with GAS iframe now uses postMessage handshake instead of URL parameter

#### `testauth2.html` — v01.05w
##### Changed
- Session token exchange with GAS iframe now uses postMessage handshake instead of URL parameter

#### `globalacl.html` — v01.07w
##### Changed
- Session token exchange with GAS iframe now uses postMessage handshake instead of URL parameter

#### `testauth1.gs` — v01.81g
##### Added
- Page nonce handshake flow — `generatePageNonce()` and `validatePageNonce()` functions
- Handshake page in `doGet()` that challenges the parent frame for session token

#### `globalacl.gs` — v01.19g
##### Added
- Page nonce handshake flow — `generatePageNonce()` and `validatePageNonce()` functions
- Handshake page in `doGet()` that challenges the parent frame for session token

## [v05.61r] — 2026-03-21 11:55:49 AM EST — [sha-unavailable]

> **Prompt:** "go with your recommendation, including the extra safety signing out indicator"

### Fixed
- Fixed sign-out race condition — `showAuthWall()` with DOM clearing was destroying the GAS sign-out iframe before `processSignOut()` could complete server-side session invalidation, leaving sessions alive in CacheService after sign-out
- Restructured `performSignOut()` to wait for server-side `gas-signed-out` confirmation before calling `showAuthWall()` with DOM clearing

### Added
- Added "Signing out..." visual blocker overlay — shows immediately on sign-out to block UI interaction while the server-side session invalidation round-trip completes (1-2 seconds)
- 10-second fallback timeout ensures the auth wall always appears even if the GAS server doesn't respond

#### `testauth1.html` — v02.49w
##### Fixed
- Sign-out now properly invalidates server-side sessions before clearing the GAS iframe
##### Added
- "Signing out..." overlay with spinner shown during session cleanup

#### `testauth2.html` — v01.04w
##### Fixed
- Sign-out now properly invalidates server-side sessions before clearing the GAS iframe
##### Added
- "Signing out..." overlay with spinner shown during session cleanup

#### `globalacl.html` — v01.06w
##### Fixed
- Sign-out now properly invalidates server-side sessions before clearing the GAS iframe
##### Added
- "Signing out..." overlay with spinner shown during session cleanup

## [v05.60r] — 2026-03-21 11:31:04 AM EST — [sha-unavailable]

> **Prompt:** "no ive already done that. in the network checker, the exec seems to be guarded (i.e.https://script.google.com/a/macros/shadowaisolutions.com/s/AKfycbzcKmQ37XpdCS5ziKpInaGoHa8tZ0w6MeIP6cMWMV6-wXG2hS1K2pmBq4e4-J7xpNL-_w/exec). but the second exec with a question mark opens up the page with it thinking its authenticated (i.e.https://script.google.com/a/macros/shadowaisolutions.com/s/AKfycbzcKmQ37XpdCS5ziKpInaGoHa8tZ0w6MeIP6cMWMV6-wXG2hS1K2pmBq4e4-J7xpNL-_w/exec?session=92d25e2381aa4ad7a3b3590c76f60bc91ec612308a674b37)"

### Fixed
- Fixed GAS iframe guard — `window.self === window.top` never fires because GAS always runs inside Google's sandbox iframe; changed to `window.parent === window.top` which correctly detects direct navigation vs legitimate embedding
- Applied the same fix to both auth GAS templates (minimal and test)

#### `testauth1.gs` — v01.80g
##### Fixed
- Iframe guard now correctly blocks direct navigation to session URLs (was previously dead code due to GAS sandbox nesting)

## [v05.59r] — 2026-03-21 11:09:01 AM EST — [sha-unavailable]

> **Prompt:** "trouble in paradise. as per the screenshot which was done in the testauth1, you can see an exec?session= link and that link opens up the gas script, which is opening up the gas. unfortunately it is opening as if the user was logged in"

### Fixed
- Added iframe guard to GAS auth app HTML — prevents direct navigation to `exec?session=TOKEN` URLs from rendering the authenticated app outside the embedding iframe
- Applied the same fix to both auth GAS templates (minimal and test) for consistency

#### `testauth1.gs` — v01.79g
##### Fixed
- Direct navigation to session URLs no longer renders the app — shows "Access denied" message instead

<!-- Rotated 2026-03-23: 42 sections from 2026-03-20 (SHAs unavailable — commits not in shallow history) -->

## [v05.58r] — 2026-03-20 11:21:18 PM EST — [sha-unavailable]

> **Prompt:** "yes go ahead"

### Changed
- Added CROSS_PROJECT_ADMIN_SECRET to the auto-generated properties note in gas-project-creator — all three auto-managed properties (CACHE_EPOCH, HMAC_SECRET, CROSS_PROJECT_ADMIN_SECRET) are now listed when auth is enabled

#### `gas-project-creator.html` — v01.24w
##### Changed
- Auto-generation note now mentions all three auto-managed properties

## [v05.57r] — 2026-03-20 11:17:21 PM EST — [sha-unavailable]

> **Prompt:** "your first option"

### Changed
- Simplified Script Properties section in gas-project-creator — removed CACHE_EPOCH and HMAC_SECRET from the visible property list since they auto-generate on first deploy; only GITHUB_TOKEN remains as a manual step
- Added auto-generation note below the property list that dynamically shows HMAC_SECRET when auth is enabled

#### `gas-project-creator.html` — v01.23w
##### Changed
- Simplified setup steps — only the GitHub token needs manual entry now

## [v05.56r] — 2026-03-20 11:02:26 PM EST — [sha-unavailable]

> **Prompt:** "yes do that, and if we dont need it from the gas-project-creator anymore then you can remove those from that also. to clarify, when you say auto generate on first run, what action constitutes as a first run?"

### Added
- Auto-initialization of HMAC_SECRET and CACHE_EPOCH in Script Properties via `ensureScriptProperties_()` — called at the end of `pullAndDeployFromGitHub()` on first deploy, eliminating manual Script Properties setup
- CACHE_EPOCH-only auto-initialization for no-auth templates (no HMAC needed)

### Changed
- Updated HMAC_SECRET error messages in GAS scripts to note auto-generation on deploy and suggest checking deployment status
- Updated HMAC_SECRET error messages in HTML pages to reflect auto-generation
- Removed manual HMAC secret generation UI from gas-project-creator (Generate button, input field, Copy button) — no longer needed since HMAC_SECRET auto-generates on first deploy
- Updated CACHE_EPOCH and HMAC_SECRET descriptions in gas-project-creator to "auto-generated on first deploy"

#### `testauth1.html` — v02.48w
##### Changed
- Updated HMAC setup error message to reflect auto-generation on deploy

#### `testauth2.html` — v01.03w
##### Changed
- Updated HMAC setup error message to reflect auto-generation on deploy

#### `globalacl.html` — v01.05w
##### Changed
- Updated HMAC setup error message to reflect auto-generation on deploy

#### `gas-project-creator.html` — v01.22w
##### Changed
- Removed manual HMAC secret generation UI (Generate button, input field, Copy button)
- Updated CACHE_EPOCH and HMAC_SECRET property descriptions to "auto-generated on first deploy"

#### `testauth1.gs` — v01.78g
##### Added
- `ensureScriptProperties_()` function for auto-initializing HMAC_SECRET and CACHE_EPOCH
##### Changed
- Updated HMAC_SECRET error message to note auto-generation on deploy

#### `portal.gs` — v01.15g
##### Added
- `ensureScriptProperties_()` function for auto-initializing HMAC_SECRET and CACHE_EPOCH

#### `globalacl.gs` — v01.18g
##### Added
- `ensureScriptProperties_()` function for auto-initializing HMAC_SECRET and CACHE_EPOCH
##### Changed
- Updated HMAC_SECRET error message to note auto-generation on deploy

## [v05.55r] — 2026-03-20 10:38:42 PM EST — [sha-unavailable]

> **Prompt:** "alright implement option 2"

### Changed
- Cross-project admin secret migrated from spreadsheet Config tab to GAS Script Properties — uses built-in encrypted per-project storage instead of a shared spreadsheet cell
- GlobalACL now pushes the secret to all registered projects via a new `?action=setAdminSecret` endpoint on first setup

### Added
- Secret rotation capability via `rotateAdminSecret()` — admin can rotate the cross-project secret, which automatically distributes the new secret to all registered projects
- `setAdminSecret` endpoint on all auth projects (testauth1, portal, templates) — accepts secret updates from GlobalACL with old-secret authentication

#### `globalacl.gs` — v01.17g

##### Changed
- `ensureCrossProjectSecret()` now stores secret in Script Properties instead of spreadsheet Config tab
- `getCrossProjectSecret()` now reads from Script Properties instead of spreadsheet

##### Added
- `distributeSecret_()` — pushes the admin secret to all registered projects via UrlFetchApp.fetchAll
- `rotateAdminSecret()` — generates a new secret, distributes to all projects, updates local storage

#### `testauth1.gs` — v01.77g

##### Changed
- `getCrossProjectSecret()` now reads from Script Properties instead of spreadsheet Config tab

##### Added
- `setAdminSecret` action handler in doGet() — accepts secret distribution from GlobalACL

#### `portal.gs` — v01.14g

##### Changed
- `getCrossProjectSecret()` now reads from Script Properties instead of spreadsheet Config tab

##### Added
- `setAdminSecret` action handler in doGet() — accepts secret distribution from GlobalACL

## [v05.54r] — 2026-03-20 10:05:19 PM EST — [sha-unavailable]

> **Prompt:** "can you add something so that this never happens again on any project, make sure that this has high priority since we wont know what is happening to things behind the auth wall, whatever is behind there should be deactivated from functioning in the background. applies to all projects"

### Fixed
- All auth pages now comprehensively deactivate authenticated UI on sign-out: gcl-overlay, tab-takeover-wall, auth-timers, and admin panels are all cleaned up in `showAuthWall()`
- Template updated with full auth wall deactivation block for future pages

### Added
- Auth Wall Completeness rule in `.claude/rules/html-pages.md` — ensures new floating UI elements are always cleaned up on sign-out

#### `globalacl.html` — v01.04w

##### Fixed
- All popups, overlays, and background timers now properly deactivated on sign-out

#### `testauth1.html` — v02.47w

##### Fixed
- Popups and overlays no longer persist on screen after signing out

#### `testauth2.html` — v01.02w

##### Fixed
- Popups and overlays no longer persist on screen after signing out

#### `portal.html` — v01.14w

##### Fixed
- Popups and overlays no longer persist on screen after signing out

## [v05.53r] — 2026-03-20 09:56:00 PM EST — [sha-unavailable]

> **Prompt:** "in the globalacl, im noticing that if i have the global sessions open and i sign out, it still keeps the global sessions active"

### Fixed
- Global sessions panel now closes when signing out of Global ACL

#### `globalacl.html` — v01.03w

##### Fixed
- Global sessions panel is properly hidden when sign-out occurs

## [v05.52r] — 2026-03-20 09:33:47 PM EST — [sha-unavailable]

> **Prompt:** "the show all apps toggle is working, but the my apps should be on the left and show all should be on the right"

### Changed
- Swapped portal access toggle labels: "My apps" now on left, "Show all" on right

#### `portal.gs` — v01.13g

##### Changed
- Toggle label order swapped — "My apps" on left, "Show all" on right (with inverted logic mapping)

## [v05.51r] — 2026-03-20 09:20:40 PM EST — [sha-unavailable]

> **Prompt:** "can you sort it so that when showing all apps, the apps that the user doesnt have access to should come after the ones that they do"

### Changed
- Portal app cards now sort accessible apps first, inaccessible apps last within the auth section

#### `portal.gs` — v01.12g

##### Changed
- Apps you have access to now appear before apps you don't when viewing all applications

## [v05.50r] — 2026-03-20 09:13:56 PM EST — [sha-unavailable]

> **Prompt:** "the toggle is there but its not showing all the apps when i toggle it, its only showing the ones that i have access to.the open in new tab and window toggle is also not working, either way its only allowing new tab. also its showing \uD83D\uDD10 Authentication-Enabled Applications and \uD83C\uDF10 Public Applications , what does the uD83D\uDD10 and \uD83C\uDF10 mean"

### Fixed
- Section headers now display proper emoji icons instead of raw unicode escape sequences
- "Show all / My apps" toggle now correctly shows all apps when toggled to "Show all"
- "Open in new tab / New window" toggle now correctly opens apps in a new window when selected
- All three fixes caused by using `window.top.localStorage` which fails cross-origin in the GAS iframe — switched to `localStorage` directly

#### `portal.gs` — v01.11g

##### Fixed
- Section headers now show proper emoji icons instead of garbled text
- Toggling between "Show all" and "My apps" now works correctly
- "Open in new window" option now works as expected

## [v05.49r] — 2026-03-20 09:05:01 PM EST — [sha-unavailable]

> **Prompt:** "in the application portal, add a toggle to show/hide all applications that the user has access/authorization to. separate the authentication enabled and the public projects into separate sections."

### Added
- Application portal now separates apps into "Authentication-Enabled" and "Public" sections
- Access filter toggle ("Show all / My apps") that shows or hides apps based on user's ACL authorization
- Server-side per-app access lookup via Master ACL spreadsheet for the logged-in user
- Visual dimming and "No access" indicator for apps the user is not authorized to use
- Empty state message when no authorized authentication-enabled apps are available
- Toggle defaults to "My apps only" and persists preference via localStorage

#### `portal.gs` — v01.10g

##### Added
- Applications are now organized into two clear sections: authentication-enabled and public
- New toggle to filter the portal to show only apps you have access to
- Apps you don't have access to appear dimmed with a "No access" indicator when viewing all apps

## [v05.48r] — 2026-03-20 08:42:27 PM EST — [sha-unavailable]

> **Prompt:** "the application portal, make it also include the globalacl"

### Added
- Global ACL added to the portal's application registry — appears as the first app card with shield icon and auth-enabled status

#### `portal.gs` — v01.09g

##### Added
- Global ACL now appears in the application portal as the first entry for centralized access control management

## [v05.47r] — 2026-03-20 08:34:24 PM EST — [sha-unavailable]

> **Prompt:** "we currently have 2 tabs both of which use the names of the projects, can we consolidate them into a single tab, come up with a visual representation of how you would like to make it and i will approve or provide an alternative to what you come up with"

### Changed
- Consolidated the Projects tab into the Access tab — project metadata (name, URL, auth enabled) is now stored as `#`-prefixed metadata rows (#NAME, #URL, #AUTH) in rows 2-4, eliminating the need for a separate Projects tab
- All user-data iteration loops now skip metadata rows to prevent them from being treated as user entries
- `addACLPage()` now initializes metadata cells and fills checkboxes from row 5 onward (after metadata rows)

#### `globalacl.gs` — v01.16g

##### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

#### `portal.gs` — v01.08g

##### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

#### `testauth1.gs` — v01.76g

##### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

## [v05.46r] — 2026-03-20 08:10:13 PM EST — [sha-unavailable]

> **Prompt:** "yes please add that"

### Added
- Auto-creation of Access tab page column when a new project registers via `registerSelfProject()` — eliminates manual spreadsheet setup

#### `globalacl.gs` — v01.15g

##### Added
- New projects now automatically get a page column in the Access tab with FALSE checkboxes for all existing users

#### `portal.gs` — v01.07g

##### Added
- New projects now automatically get a page column in the Access tab with FALSE checkboxes for all existing users

#### `testauth1.gs` — v01.75g

##### Added
- New projects now automatically get a page column in the Access tab with FALSE checkboxes for all existing users

## [v05.45r] — 2026-03-20 07:50:37 PM EST — [sha-unavailable]

> **Prompt:** "add the portal to the projects in global acl"

### Changed
- Connected the portal to the global ACL system by configuring the Master ACL spreadsheet ID and correcting the ACL sheet name

#### `portal.gs` — v01.06g

##### Changed
- Set `MASTER_ACL_SPREADSHEET_ID` to the global ACL spreadsheet (was placeholder)
- Changed `ACL_SHEET_NAME` from `"ACL"` to `"Access"` to match the Master ACL spreadsheet

## [v05.44r] — 2026-03-20 07:27:24 PM EST — [sha-unavailable]

> **Prompt:** "when signing in to more than a single project with the same account in the same browser, it thinks that i have a session active elsewhere, which is great when dealing with signing into the same project where i only want one instance, but i want it to allow sign in on different projects at the same time"

### Fixed
- Cross-project session conflicts in the same browser — signing into one project no longer overwrites or interferes with another project's session
- All localStorage keys and BroadcastChannel names are now scoped per-project using the page name derived from the URL path

#### `testauth1.html` — v02.46w

##### Fixed
- Sessions no longer conflict with other projects open in the same browser

#### `testauth2.html` — v01.01w

##### Fixed
- Sessions no longer conflict with other projects open in the same browser

#### `portal.html` — v01.13w

##### Fixed
- Sessions no longer conflict with other projects open in the same browser

#### `globalacl.html` — v01.02w

##### Fixed
- Sessions no longer conflict with other projects open in the same browser

## [v05.43r] — 2026-03-20 06:56:29 PM EST — [sha-unavailable]

> **Prompt:** "you made it show myself, but it should be showing sessions from all projects, which i am signed into the testauth1 project with another user as seen in the screenshot. is there a better way to accomplish this? recreating how we have configured everything is fine, recommend the best long term approach"

### Added
- Zero-configuration auto-registration for all auth-enabled GAS projects — each project registers itself in the Master ACL "Projects" sheet on first page load, eliminating the need for manual spreadsheet setup
- Auto-generated cross-project shared secret — GlobalACL creates a "Config" sheet with a 64-character random secret on first run, used for server-to-server authentication between projects
- Project identification by stable internal ID (`ACL_PAGE_NAME`) stored in a hidden "Project ID" column, decoupled from the user-editable display title

### Changed
- Replaced the self-project fallback (v05.42r) with proper auto-registration — the SELF entry is now created automatically, making the fallback unnecessary
- `getRegisteredProjects()` now reads the Project ID column (col D) and returns a `projectId` field for each registered project

#### `globalacl.gs` — v01.14g

##### Added
- Auto-registration on page load — registers itself as SELF in the Projects sheet
- Auto-generated cross-project secret in Config sheet on first run

##### Changed
- Replaced self-project fallback with proper auto-registration infrastructure

#### `testauth1.gs` — v01.74g

##### Added
- Auto-registration on page load — registers itself with its deployment URL in the Projects sheet

#### `portal.gs` — v01.05g

##### Added
- Auto-registration on page load — registers itself with its deployment URL in the Projects sheet (skipped when Master ACL ID is a placeholder)

## [v05.42r] — 2026-03-20 06:34:44 PM EST — [sha-unavailable]

> **Prompt:** "the global sessions all projects is thinking that there are no active sessions found in any project"

### Fixed
- Global Sessions interface now shows local sessions even when the Projects sheet has no SELF entry — added self-project fallback to both `listGlobalSessions` and `adminGlobalSignOutUser` so the GlobalACL's own sessions are always visible and manageable

#### `globalacl.gs` — v01.13g

##### Fixed
- Sessions from the local project now appear even when the Projects sheet is missing or has no SELF row configured

## [v05.41r] — 2026-03-20 06:13:55 PM EST — [sha-unavailable]

> **Prompt:** "i want an interface which is like the sessions button in the testauth1 project, but i want it to apply to all projects. should it be part of the globalacl manager or is that something that should be its own specific environment"

### Added
- Global Sessions interface on the GlobalACL page — aggregates active sessions from all auth-enabled GAS projects into a single admin view
- Cross-project session management via UrlFetchApp with shared-secret authentication (server-to-server only, never exposed to browser)
- "Global Sessions" button alongside existing "Sessions" button on GlobalACL, with a dedicated green-themed panel showing sessions grouped by project
- Admin ability to kick users from specific projects or all projects at once from the Global Sessions panel
- Project registry reader that discovers auth-enabled projects from a "Projects" tab in the Master ACL Spreadsheet
- Cross-project `listSessions` and `adminSignOut` doGet endpoints on all three auth projects (globalacl, testauth1, portal)
- Cross-project session functions propagated to both auth GAS templates for future projects

#### `globalacl.html` — v01.01w

##### Added
- "Global Sessions" button for admin users to view sessions across all projects
- Dedicated green-themed panel showing sessions grouped by project with status indicators
- Ability to sign out users from individual projects or all projects at once

#### `globalacl.gs` — v01.12g

##### Added
- Cross-project session aggregation via `listGlobalSessions()` using `UrlFetchApp.fetchAll()` for parallel queries
- Project registry reader from Master ACL Spreadsheet "Projects" tab
- Shared-secret authentication for server-to-server cross-project calls
- `adminGlobalSignOutUser()` for remote session termination across projects
- `listSessions` and `adminSignOut` doGet action routes for cross-project queries
- `adminGlobalSessions` doGet action route for the Global Sessions iframe listener

#### `testauth1.gs` — v01.73g

##### Added
- Cross-project session listing and admin sign-out endpoints (`listSessions`, `adminSignOut` doGet routes)
- Shared-secret validation for cross-project admin requests

#### `portal.gs` — v01.04g

##### Added
- Cross-project session listing and admin sign-out endpoints with placeholder guards for unconfigured Master ACL

## [v05.40r] — 2026-03-20 05:16:32 PM EST — [sha-unavailable]

> **Prompt:** "undo everything you did in the last prompt, but keep a note of it in a document. its currently not loading sessions, just stuck"

### Removed
- Reverted Session Manager panel from Global ACL page — the multi-iframe implementation broke the existing Sessions dropdown by cross-contaminating admin session message routing (GAS postMessages lack project identifiers, making disambiguation impossible)

### Added
- `SESSION-MANAGER-PLAN.md` in `repository-information/` — preserves the full Session Manager implementation notes, architecture decisions, what broke, and three fix options for a future attempt

#### `globalacl.html` — v01.00w (reverted from v01.01w)

##### Removed
- Session Manager panel, CSS, and JavaScript (~360 lines) — reverted to pre-Session Manager state
- Modifications to existing admin session message handlers that caused routing conflicts

## [v05.39r] — 2026-03-20 04:59:04 PM EST — [sha-unavailable]

> **Prompt:** "in the global ACL manager, i want to be able to manage all user logins on all projects from here. so similar to the function of the sessions button but controllable from the UI."

### Added
- Session Manager panel in the Global ACL page — admin-only UI for viewing and managing active sessions across all auth-enabled projects from a single interface
- Cross-project session management via per-project hidden iframes with sequential loading to avoid message routing race conditions
- Per-project session cards showing email, role, sign-in time, last activity, and remaining session time (absolute + rolling)
- Sign Out button per user per project to terminate sessions remotely
- Auto-refresh toggle (30s interval) and manual Refresh All / per-project refresh buttons
- Connection timeout handling (15s) with error display for unresponsive projects
- Total active sessions counter across all projects

#### `globalacl.html` — v01.01w

##### Added
- Session Manager panel showing active user sessions across all projects
- Ability to sign out users from any project directly from the UI
- Auto-refresh and manual refresh controls for session monitoring

## [v05.38r] — 2026-03-20 04:30:27 PM EST — [sha-unavailable]

> **Prompt:** "ok then why are you still not using the bookends"

### Changed
- Rewrote "Response Opener" section in chat-bookends.md from descriptive advice to a hard 3-step procedural gate (Step 1: `date` call → Step 2: opening text → Step 3: everything else) — previous descriptive version was violated in the same response it was created, proving that "don't do this" rules don't work; only procedural gates with no exceptions create compliance

## [v05.37r] — 2026-03-20 04:26:46 PM EST — [sha-unavailable]

> **Prompt:** "why did you not do your bookends. make sure you handle it so it never happens again"

### Added
- "Response Opener — Zero Tool Calls Before First Text" prevention section in chat-bookends.md — catches the failure pattern where the entire protocol (Session Start Checklist, CODING PLAN, timestamps, bookends, end-of-response block) is skipped because the model jumps straight to tool calls without outputting text first

## [v05.36r] — 2026-03-20 04:20:50 PM EST — [sha-unavailable]

> **Prompt:** "in the globalacl environment, right now whenever i make a change to someones permissions, it highlights that field, but if i put it back to how it was originally it should unhighlight itself"

### Fixed
- Permission highlight now resets when a field is reverted to its original value — checkboxes and role dropdowns unhighlight automatically, and the row/Save button state updates accordingly

#### `globalacl.gs` — v01.11g

##### Fixed
- Changed fields that are reverted to their original state now correctly remove the dirty-cell highlight, dirty-row marker, and Save button visibility

## [v05.35r] — 2026-03-20 02:44:10 PM EST — [sha-unavailable]

> **Prompt:** "instead of just a button to add page column, have the columns be removeable and be able to be renamed. same for roles, should be able to modify the roles tab from there which is where the list of roles should come from"

### Added
- Page column headers are now interactive — click to rename or remove a column via context menu
- New "Manage Roles" modal for adding, renaming, deleting roles and toggling permissions directly from the ACL UI
- Backend functions: renameACLPage, removeACLPage, loadRolesData, addACLRole, updateACLRole, renameACLRole, removeACLRole

### Changed
- Role list in user dropdowns now reflects the Roles sheet dynamically — roles added/renamed/removed in the Manage Roles modal take effect immediately

#### `globalacl.gs` — v01.10g

##### Added
- Context menu on page column headers with Rename and Remove options
- Manage Roles modal with inline permission editing, rename, and delete per role
- Rename prompt modal reusable for both page columns and roles
- 7 new backend server functions for page and role management

##### Changed
- Page column headers now show a dropdown arrow on hover indicating interactivity

## [v05.34r] — 2026-03-20 02:35:04 PM EST — [sha-unavailable]

> **Prompt:** "i meant a single save button for all changes, not per user, but you can denote by highlighting the checkboxes somehow the ones that are going to be affected"

### Changed
- ACL inline editing now uses a single "Save Changes" toolbar button instead of per-row Save buttons — modified cells get an amber highlight and the user's email turns orange to indicate pending changes

#### `globalacl.gs` — v01.09g

##### Changed
- Replaced per-row Save buttons with a single "Save Changes" button in the toolbar
- Modified checkboxes and dropdowns now get an amber background highlight to show pending changes
- User email turns orange for rows with unsaved changes
- All dirty rows are saved in parallel when clicking Save Changes

## [v05.33r] — 2026-03-20 02:29:38 PM EST — [sha-unavailable]

> **Prompt:** "i still want there to be a save button, not to save it after every change"

### Changed
- ACL inline editing now requires clicking a Save button per row instead of auto-saving on every change — Save button appears when a role or page access value is modified

#### `globalacl.gs` — v01.08g

##### Changed
- Inline editing now shows a Save button per row when changes are made, instead of auto-saving on every toggle

## [v05.32r] — 2026-03-20 02:25:08 PM EST — [sha-unavailable]

> **Prompt:** "ok so back to the globalacl , make it so that i dont need to click on edit for each user to be able to modify their page access role, should be doable on the main ui"

### Changed
- ACL user table now supports inline editing — role dropdowns and page access checkboxes are directly editable in the main table without opening the Edit modal
- Changes auto-save with a 300ms debounce when toggling checkboxes or changing roles

### Removed
- Removed the Edit button from the ACL user table actions column (inline editing replaces it)

#### `globalacl.gs` — v01.07g

##### Changed
- Role and page access are now editable directly in the user table — no need to open a separate edit dialog
- Changes save automatically when you toggle a checkbox or change a role

##### Removed
- Edit button removed from user rows (replaced by inline editing)

## [v05.31r] — 2026-03-20 02:21:26 PM EST — [sha-unavailable]

> **Prompt:** "yes add it. but also make sure that we dont miss this for new projects moving forward"

### Fixed
- Added missing Globalacl deploy webhook step to the auto-merge workflow — GAS auto-update from GitHub was not working because the workflow had no deploy step for Globalacl

### Changed
- Improved `setup-gas-project.sh` to show prominent warnings when the workflow deploy step is skipped due to a placeholder DEPLOYMENT_ID, including a banner at end of script output with re-run instructions

## [v05.30r] — 2026-03-20 02:09:38 PM EST — [sha-unavailable]

> **Prompt:** "when running functions such as delete, its showing a browser ui to confirm, have it be our own ui"

### Changed
- Replaced browser `confirm()` dialog in ACL delete with a custom styled modal that matches the existing UI

#### `globalacl.gs` — v01.06g

##### Changed
- Delete confirmation now uses a styled in-app dialog instead of the browser's default confirm popup

## [v05.29r] — 2026-03-20 02:05:14 PM EST — [sha-unavailable]

> **Prompt:** "wherever it creates true/false on the spreadsheet, can you have it auto format as a checkbox?"

### Added
- ACL spreadsheet page columns now auto-format as checkboxes when adding users, updating users, or adding new page columns

#### `globalacl.gs` — v01.05g

##### Added
- Page access columns now display as checkboxes in the spreadsheet when adding users, updating users, or adding new page columns

## [v05.28r] — 2026-03-20 02:00:06 PM EST — [sha-unavailable]

> **Prompt:** "it lets me do a single edit, then it makes everything i do permission denied"

### Fixed
- Fixed ACL management destroying all sessions after every edit — `clearAccessCacheForUser` was bumping the cache epoch (nuclear clear), orphaning all session data. Now uses targeted key removal (`access_EMAIL`, `role_EMAIL`, `rbac_roles_matrix`) so sessions remain valid while permissions are refreshed
- Renamed the epoch-bumping function to `nuclearCacheClear` for emergencies only

#### `globalacl.gs` — v01.04g

##### Fixed
- Fixed session being destroyed after each ACL edit — cache clearing now removes only permission keys instead of wiping all sessions

## [v05.27r] — 2026-03-20 01:46:22 PM EST — [sha-unavailable]

> **Prompt:** "ok well, after loading its showing the same error message, when i press refresh still get that error of no access"

### Fixed
- Fixed persistent PERMISSION_DENIED error in ACL management — `validateSessionForData` now extracts role/permissions from the session cache even when standard preset skips full validation, so `checkPermission('admin')` succeeds for admin users

#### `globalacl.gs` — v01.03g

##### Fixed
- Fixed PERMISSION_DENIED error when using ACL management — admin role is now correctly read from the session even when standard preset skips full validation

## [v05.26r] — 2026-03-20 01:42:16 PM EST — [sha-unavailable]

> **Prompt:** "when initially signing in i see this error message for a few seconds"

### Fixed
- Fixed race condition in Global ACL management UI where `loadData()` fired before session was confirmed, causing a brief "PERMISSION_DENIED" error on initial sign-in

#### `globalacl.gs` — v01.02g

##### Fixed
- Fixed brief "PERMISSION_DENIED" error on initial sign-in by deferring data load until session is confirmed

## [v05.25r] — 2026-03-20 01:33:40 PM EST — [sha-unavailable]

> **Prompt:** "ok, now go ahead and set up an interface in the globalacl.html so i can adjust/add users and permissions"

### Added
- ACL management interface in Global ACL GAS script — admin users can view, add, edit, and delete users and their per-page permissions
- Server-side CRUD functions: `loadACLData`, `addACLUser`, `updateACLUser`, `deleteACLUser`, `addACLPage` — all session-gated with admin permission checks and audit logging
- Management UI renders inside the GAS iframe with a responsive table, modal dialogs for add/edit, and status notifications

#### `globalacl.gs` — v01.01g

##### Added
- ACL management interface with user table showing emails, roles, and per-page access
- Add, edit, and delete users directly from the interface
- Add new page columns to the access control list
- Role assignment dropdown with all available roles
- Per-page access toggles for each user

## [v05.24r] — 2026-03-20 01:17:27 PM EST — [sha-unavailable]

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
bash scripts/setup-gas-project.sh <<'CONFIG'
{
  "PROJECT_ENVIRONMENT_NAME": "globalacl",
  "TITLE": "Global ACL",
  "DEPLOYMENT_ID": "AKfycbwARlOI-DKErWfPFIlp4bhrf7Iqm8NmGhIeuISviwylSTAd9JL4Th5AoCWKG5oAdc6bcQ",
  "SPREADSHEET_ID": "1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI",
  "SHEET_NAME": "Live_Sheet",
  "SOUND_FILE_ID": "1bzVp6wpTHdJ4BRX8gbtDN73soWpmq1kN",
  "SPLASH_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "INCLUDE_TEST": false,
  "INCLUDE_AUTH": true,
  "CLIENT_ID": "216764502068-k9hjjpnlcolqjpp5gccimimqh662dilt.apps.googleusercontent.com",
  "AUTH_PRESET": "standard",
  "IS_MASTER_ACL": true,
  "MASTER_ACL_SPREADSHEET_ID": "1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI",
  "ACL_SHEET_NAME": "Access"
}
CONFIG"

### Added
- New GAS project: **Global ACL** (`globalacl`) — authenticated GAS environment with master ACL integration, connected to spreadsheet `1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI` (sheet: Live_Sheet, ACL sheet: Access)
- Created `globalacl.html` embedding page, `globalacl.gs` GAS script, and `globalacl.config.json` configuration
- Created version tracking files (`globalaclhtml.version.txt`, `globalaclgs.version.txt`)
- Created changelog files for both HTML and GAS components
- Created per-environment diagram (`globalacl-diagram.md`)
- Registered Globalacl in GAS Projects table, REPO-ARCHITECTURE.md, and README.md structure tree

## [v05.23r] — 2026-03-20 10:34:16 AM EST — [sha-unavailable]

> **Prompt:** "move the include test/diagnostic features to below the authentication settings section, right before the copy code.gs for GAS button"

### Changed
- Moved "Include test/diagnostic features" checkbox to just before the Copy Code.gs button, after all configuration and authentication settings

#### `gas-project-creator.html` — v01.21w

##### Changed
- "Include test/diagnostic features" checkbox moved to just above the Copy Code.gs button, after all configuration fields and auth settings

## [v05.22r] — 2026-03-20 10:28:46 AM EST — [sha-unavailable]

> **Prompt:** "move the google authentication checkbox to the top of the setup and configuration instead since it affects the layout of the steps below it"

### Changed
- Moved "Include Google Authentication" checkbox to the top of the Setup & Configuration section, before all numbered steps, since toggling it changes which steps are visible

#### `gas-project-creator.html` — v01.20w

##### Changed
- "Include Google Authentication" checkbox moved to the very top of the Setup & Configuration section, above all steps, since it affects which steps are visible

## [v05.21r] — 2026-03-20 10:22:10 AM EST — [sha-unavailable]

> **Prompt:** "move the checkbox for include google authentication to the top of step 7 in the gas project settings"

### Changed
- Moved "Include Google Authentication" checkbox from the project configuration area to the top of the GAS Project Settings section for better discoverability

#### `gas-project-creator.html` — v01.19w

##### Changed
- "Include Google Authentication" checkbox moved to the top of the GAS Project Settings section for earlier visibility

## [v05.20r] — 2026-03-20 10:10:59 AM EST — [sha-unavailable]

> **Prompt:** "move up the hmac secret generator to where the set script properties is"

### Changed
- HMAC Secret generator field relocated from Authentication Settings to the Script Properties setup step for a more logical workflow

#### `gas-project-creator.html` — v01.18w

##### Changed
- HMAC Secret generator moved up to the Script Properties setup step for easier access when setting properties
- HMAC_SECRET property hint updated to reference the generator directly below instead of Auth Settings

## [v05.19r] — 2026-03-20 10:03:45 AM EST — [sha-unavailable]

> **Prompt:** "each script property needs its own copy button, and also the hmac secret also should have a copy button"

### Changed
- Script Properties list in gas-project-creator now has individual copy buttons per property name (CACHE_EPOCH, GITHUB_TOKEN, HMAC_SECRET) instead of a single "Copy Names" button
- HMAC Secret field now has a dedicated Copy button alongside the existing Generate and Clear buttons

#### `gas-project-creator.html` — v01.17w

##### Changed
- Each script property name now has its own individual copy button for one-click copying
- HMAC Secret field now includes a Copy button to easily copy the generated secret value

## [v05.18r] — 2026-03-20 09:55:14 AM EST — [sha-unavailable]

> **Prompt:** "i want you to add a button which will generate a random one for the user in the gas-project-creator, also add a button to copy the text CACHE_EPOCH,GITHUB_TOKEN,HMAC_SECRET for the script properties in the step 9 section"

### Added
- HMAC Secret field with Generate button in gas-project-creator auth settings — creates a cryptographically random 64-char hex string for session integrity
- "Copy Names" button in the Script Properties setup step — copies CACHE_EPOCH, GITHUB_TOKEN, and HMAC_SECRET property names to clipboard for easy pasting into GAS Script Properties
- HMAC_SECRET property row in Script Properties list — conditionally shown when Google Authentication is enabled

#### `gas-project-creator.html` — v01.16w

##### Added
- HMAC Secret field with one-click Generate button for creating random session integrity secrets
- Copy Property Names button in the Script Properties setup step for quick clipboard access to all required property names
- HMAC_SECRET shown in the Script Properties list when authentication is enabled

## [v05.17r] — 2026-03-20 09:08:46 AM EST — [sha-unavailable]

> **Prompt:** "to the gas-project-creator add a feature which allows the user to select whether the current setup being configured will be used as the master ACL"

### Added
- Master ACL selection checkbox in gas-project-creator — allows marking the current project's spreadsheet as the centralized master ACL for all GAS-powered pages, auto-filling the Master ACL Spreadsheet ID from the Spreadsheet ID field
- `IS_MASTER_ACL` flag support in setup-gas-project.sh — when true, automatically sets `MASTER_ACL_SPREADSHEET_ID` to the project's own `SPREADSHEET_ID`

#### `gas-project-creator.html` — v01.15w

##### Added
- "This project's spreadsheet is the master ACL" checkbox in the Authentication Settings section
- Auto-sync of Master ACL Spreadsheet ID field from Spreadsheet ID when master ACL checkbox is checked
- `IS_MASTER_ACL` boolean included in the "Copy Config for Claude" JSON output
- Master ACL field becomes read-only with explanatory hint when checkbox is active


<!-- Rotated 2026-03-22: 23 sections from 2026-03-19 (SHAs unavailable — commits squashed by auto-merge) -->

## [v05.16r] — 2026-03-19 08:28:19 PM EST — [merged]

> **Prompt:** "start with the TEMPLATE-UPDATE-PLAN.md"

### Added
- Auth HTML template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) — full rebuild synced with testauth1's evolved feature set including RBAC, HMAC-SHA256 message signing, admin panel, cache epoch, cross-device session enforcement, tab takeover, CSP, deferred AudioContext, changelog sanitization, and 10+ new config toggles
- Auth GAS minimal template (`gas-minimal-auth-template-code.js.txt`) — rebuilt with RBAC roles (admin/editor/viewer), HMAC-SHA256 signed messages, epoch-based cache, ACL spreadsheet support, cross-device enforcement, and `PARENT_ORIGIN` for secure postMessage
- Auth GAS test template (`gas-test-auth-template-code.js.txt`) — extended minimal template with diagnostic UI, version count status, sound test, sheet operations, and live quota panels
- Content Security Policy meta tag added to noauth HTML template
- `sanitizeChangelogHtml()` function added to noauth HTML template — strips dangerous elements and event handlers before rendering changelog content
- CSP, deferred AudioContext, and changelog sanitization propagated to all 3 noauth live pages (index.html, testenvironment.html, gas-project-creator.html)

### Changed
- Noauth HTML template AudioContext initialization deferred to first user gesture via `_ensureAudioCtx()` — eliminates Chrome autoplay policy console warning
- Auth templates genericized: `clinician` → `editor`, `billing` role removed, testauth1-specific references replaced with template placeholders

### Fixed
- Template placeholder consistency — `YOUR_SPREADSHEET_ID` → `TEMPLATE_SPREADSHEET_ID` in auth GAS templates' internal comparison checks

#### `index.html` — v01.07w

##### Added
- Content Security Policy enforcing strict resource loading
- Changelog content sanitization before display

##### Changed
- Audio initialization deferred until first user interaction

#### `testenvironment.html` — v01.07w

##### Added
- Content Security Policy enforcing strict resource loading
- Changelog content sanitization before display

##### Changed
- Audio initialization deferred until first user interaction

#### `gas-project-creator.html` — v01.14w

##### Added
- Content Security Policy enforcing strict resource loading
- Changelog content sanitization before display

##### Changed
- Audio initialization deferred until first user interaction

## [v05.15r] — 2026-03-19 07:17:21 PM EST — [merged]

> **Prompt:** "update the gas and html templates to match what we have in the testauth1 environment. make sure you therefore fix the scripts to work on the new template code"

### Added
- `TEMPLATE-UPDATE-PLAN.md` — phased implementation plan for syncing auth templates with testauth1's evolved feature set (RBAC, HMAC-SHA256, admin panel, cache epoch, cross-device enforcement, tab takeover, CSP, and 10+ new config toggles)

## [v05.14r] — 2026-03-19 05:46:46 PM EST — [merged]

> **Prompt:** "in the testauth1, for an admin user, i am no longer able to click on the button to see who is logged in to log them out anymore, think deep"

### Fixed
- Admin Sessions button unclickable for admin users — `applyUIGating()` set `el.style.display = ''` to show gated elements, but the `#admin-sessions-btn` CSS has `display: none` as default, so clearing the inline style just exposed the stylesheet rule and the button stayed hidden. Changed to `display: 'inline-block'` for visible state

#### `testauth1.html` — v02.45w

##### Fixed
- Admin Sessions button now properly visible and clickable for admin users

## [v05.13r] — 2026-03-19 02:57:40 PM EST — [merged]

> **Prompt:** "ok then is there a function that can do get and do it for each key name"

### Added
- `inspectCache()` diagnostic function — probes all known cache key patterns for each user and logs what's found, including current and previous epoch entries

#### `testauth1.gs` — v01.72g

##### Added
- New diagnostic tool to view cache contents from the GAS editor

## [v05.12r] — 2026-03-19 02:53:47 PM EST — [merged]

> **Prompt:** "still not working, are you able to clear entire cache instead of just specific cache"

### Changed
- Implemented cache epoch system — `clearAllAccessCache()` now increments a counter in ScriptProperties, instantly orphaning ALL CacheService entries without needing to know individual keys
- All CacheService access now goes through `getEpochCache()` wrapper that auto-prefixes keys with the epoch number
- Running `clearAllAccessCache()` from the GAS editor is now a true nuclear clear — guaranteed to invalidate everything

#### `testauth1.gs` — v01.71g

##### Changed
- Cache clearing now invalidates everything at once — no more stale entries from any source

## [v05.11r] — 2026-03-19 02:46:22 PM EST — [merged]

> **Prompt:** "i think its something to do with the cache because after moving the ACL to its own spreadsheet, the clearallaccesscache is not working, its still holding on to old values"

### Fixed
- `clearAllAccessCache()` now collects emails from BOTH the ACL spreadsheet AND the SPREADSHEET_ID sharing list — previously only read the ACL tab, so users cached from the old sharing-list method (before ACL migration) were never cleared

#### `testauth1.gs` — v01.70g

##### Fixed
- Cache clearing now covers all users regardless of which access method originally cached them

## [v05.10r] — 2026-03-19 02:36:10 PM EST — [merged]

> **Prompt:** "this is what i currently see, it wont let me click on the top to see who is logged in like it used to"

### Fixed
- Sessions button hidden for admin users — `applyUIGating()` was checking permissions array for "admin" but the spreadsheet Roles tab may not have "admin" as a permission column. Added `data-requires-role` attribute support alongside `data-requires-permission`, and switched the Sessions button to use role-based gating

#### `testauth1.html` — v02.44w

##### Fixed
- Admin session management button now appears correctly for admin users

#### `testauth1.gs` — v01.69g

##### Changed
- Minor internal improvements

## [v05.09r] — 2026-03-19 02:30:31 PM EST — [merged]

> **Prompt:** "if i run the clearaccesscacheforuser function, how exactly am i supposed to specify which user"

### Changed
- `clearAccessCacheForUser()` now accepts an email parameter and falls back to Script Properties key `CLEAR_CACHE_EMAIL` — no longer requires editing the source code

#### `testauth1.gs` — v01.68g

##### Changed
- Cache clearing for individual users now reads the target email from a Script Properties setting instead of requiring a code edit

## [v05.08r] — 2026-03-19 02:25:25 PM EST — [merged]

> **Prompt:** "the clearallaccesscache is not reseting the permissions, i changed a user to editor and when logging in still says viewer"

### Fixed
- `clearAllAccessCache()` now invalidates all active sessions, forcing users to re-authenticate with fresh roles — previously only cleared the access lookup cache while existing sessions kept the old role
- `clearAccessCacheForUser()` also invalidates the target user's sessions for the same reason

#### `testauth1.gs` — v01.67g

##### Fixed
- Clearing the access cache now forces all users to sign in again so role changes take effect immediately

## [v05.07r] — 2026-03-19 02:15:50 PM EST — [merged]

> **Prompt:** "yes go ahead"

### Changed
- Replaced UIElements spreadsheet tab with client-side `data-requires-permission` HTML attributes — no spreadsheet row management needed, just add the attribute to any element
- Removed `getUIElementsForPage()` and `getUIGatingForRole()` server functions — UI gating is now purely client-side using the permissions array already in session storage
- Removed `uiElements` from all auth response payloads (`exchangeTokenForSession`, `signAppMessage`, `doGet` paths)
- Admin sessions button now uses `data-requires-permission="admin"` instead of hardcoded role check in JavaScript

#### `testauth1.gs` — v01.66g

##### Changed
- Removed UIElements spreadsheet functions and all uiElements response fields — UI gating is now handled client-side
- Simplified clearAllAccessCache() — no longer clears UI elements cache

#### `testauth1.html` — v02.43w

##### Changed
- `applyUIGating()` now scans for `data-requires-permission` attributes and compares against session permissions instead of reading a server-provided mapping
- Removed `UI_ELEMENTS_KEY` session storage — no longer needed
- Admin sessions button uses `data-requires-permission="admin"` attribute instead of hardcoded JavaScript role check

## [v05.06r] — 2026-03-19 02:07:08 PM EST — [merged]

> **Prompt:** "ok ive made them, proceed with implementing these into testauth1"

### Changed
- Centralized RBAC: roles and permissions now read from the "Roles" tab of the ACL spreadsheet instead of being hardcoded in the GAS script — admins can change permissions by editing spreadsheet cells without redeploying code
- Added client-side UI element gating driven by the "UIElements" tab of the ACL spreadsheet — the server returns a visibility map per role, and the HTML page hides/shows elements accordingly
- Renamed ACL tab from "ACL" to "Access" to match the new centralized spreadsheet structure
- Added 10-minute CacheService caching and in-memory execution caching for spreadsheet-driven role lookups to minimize API calls

#### `testauth1.gs` — v01.65g

##### Changed
- Replaced hardcoded `RBAC_ROLES` object with `getRolesFromSpreadsheet()` that reads from the "Roles" tab of the centralized ACL spreadsheet (falls back to hardcoded values if tab is missing)
- Added `getUIElementsForPage()` to read UI element gating rules from the "UIElements" tab
- Added `getUIGatingForRole()` that combines role permissions with UI element requirements to produce a visibility map
- Updated `hasPermission()` and `checkPermission()` to use spreadsheet-driven roles
- `exchangeTokenForSession()` and `signAppMessage('gas-auth-ok')` now include `uiElements` in their responses
- Updated `clearAllAccessCache()` to also clear the roles matrix and UI elements caches
- Updated `ACL_SHEET_NAME` from "ACL" to "Access"

#### `testauth1.html` — v02.42w

##### Changed
- Added `UI_ELEMENTS_KEY` to session storage for persisting UI gating rules across page interactions
- `saveSession()` and `loadSession()` now handle `uiElements` data
- Added `applyUIGating()` function that reads the stored UI element map and hides/shows host-page elements based on role permissions
- `showApp()` now calls `applyUIGating()` on every app display (login, resume, reclaim)
- `gas-auth-ok` handler now stores `uiElements` from server response

## [v05.05r] — 2026-03-19 01:24:26 PM EST — [merged]

> **Prompt:** "lets start first by using a new dedicated spreadsheet, its spreadsheet ID is 1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI"

### Changed
- Switched testauth1 ACL to use a new dedicated centralized spreadsheet for access control, separating ACL management from project data

#### `testauth1.gs` — v01.64g

##### Changed
- Updated MASTER_ACL_SPREADSHEET_ID to point to new dedicated ACL spreadsheet

## [v05.04r] — 2026-03-19 12:45:41 PM EST — [merged]

> **Prompt:** "for the admin signed out  user, if i refresh the page it tries to reconnect and then says session expired, but without manually refreshing, its getting stuck on Heartbeat: sending... . also when it expires this way can you have it mention signed out by admin"

### Fixed
- Fixed heartbeat stuck on "sending..." after admin sign-out — `gas-heartbeat-expired` was being rejected by HMAC signature verification because the server can't sign the response when the session (and its signing key) no longer exists. Added `gas-heartbeat-expired` and `gas-heartbeat-error` to the signature-exempt list
- Fixed eviction tombstone being consumed by the first reader (heartbeat), leaving nothing for page refresh to read — tombstones now expire naturally (5 min TTL) instead of being deleted on first read, so both heartbeat and page refresh can independently detect the admin sign-out reason

#### `testauth1.html` — v02.41w

##### Fixed
- Admin sign-out now immediately shows "An administrator ended your session" without requiring a page refresh
- Heartbeat no longer gets stuck on "sending..." when session is admin-invalidated

#### `testauth1.gs` — v01.63g

##### Fixed
- Eviction tombstones are no longer consumed on first read, allowing multiple consumers (heartbeat, page refresh) to detect the sign-out reason

## [v05.03r] — 2026-03-19 12:37:20 PM EST — [merged]

> **Prompt:** "ok it is properly detecting sessions, but when i sign out another user it seems to invalidate their session, but its not actually signing them out so on their end it looks like they are still in, and refreshing their page has them stuck on the reconnecting page. what do you think we should do to handle this?"

### Fixed
- Fixed admin-signed-out users getting stuck on "Reconnecting..." on page refresh — `_expectingSession` flag was incorrectly set on page-load resume, causing the real `gas-needs-auth` to be silently dropped
- Added distinct `admin_signout` tombstone reason so admin sign-outs produce a clear "An administrator ended your session" message instead of the cross-device "signed in elsewhere" message
- `invalidateAllSessions()` now accepts a `reason` parameter — admin sign-outs use `admin_signout`, natural sign-ins continue using `new_sign_in`
- `validateSession()` now checks eviction tombstones and forwards the reason to `gas-needs-auth`, enabling the client to show context-appropriate messages on page refresh

#### `testauth1.html` — v02.40w

##### Fixed
- Users signed out by an admin now see a clear sign-in page instead of being stuck on "Reconnecting..."
- Admin sign-out now shows "An administrator ended your session" instead of a generic expiration message

#### `testauth1.gs` — v01.62g

##### Fixed
- Admin sign-out now properly notifies the signed-out user's browser via distinct eviction reason

## [v05.02r] — 2026-03-19 12:24:13 PM EST — [merged]

> **Prompt:** "right now its just saying loading sessions. where is it pulling the list of active sessions?"

### Fixed
- Fixed admin session panel stuck on "Loading sessions..." — the postMessage was being sent to the GAS outer shell iframe (`contentWindow`) instead of the inner sandbox frame where the listener runs. Now uses `event.source` from the `gas-admin-sessions-ready` signal to target the correct sandbox frame (same pattern as `gas-ready-for-token`)

#### `testauth1.html` — v02.39w

##### Fixed
- Session management panel now loads and displays active sessions correctly

## [v05.01r] — 2026-03-19 12:16:19 PM EST — [merged]

> **Prompt:** "yes build that"

### Added
- Admin session management panel — admins can view all active sessions (email, role, last activity, time remaining) and sign out any user directly from the testauth1 UI
- Server-side `listActiveSessions()` and `adminSignOutUser()` GAS functions, both admin-permission-gated with audit logging
- New `action=adminSessions` doGet route in testauth1.gs for postMessage-based admin panel communication (same pattern as heartbeat/signout)
- "Sessions" button in user pill (visible only to admin role) toggles the admin panel overlay

#### `testauth1.gs` — v01.61g

##### Added
- `listActiveSessions(sessionToken)` — walks ACL spreadsheet to enumerate all active sessions from cache, returns email, role, timestamps, and remaining time
- `adminSignOutUser(sessionToken, targetEmail)` — invalidates all sessions for a target user, admin-permission-gated
- `action=adminSessions` doGet route — lightweight postMessage listener page for admin session commands

#### `testauth1.html` — v02.38w

##### Added
- Admin session management panel with dark-themed UI — shows active sessions with email, role badge, sign-in time, last activity, and countdown timers
- "Sessions" button in user pill visible only to admin role users
- Per-user "Sign Out User" button to remotely terminate another user's session
- Auto-refresh and manual refresh for session list
- Panel auto-closes on sign-out or auth wall display

## [v05.00r] — 2026-03-19 11:43:05 AM EST — [merged]

> **Prompt:** "you can add these things to the gas for me"

### Added
- Added admin utility functions to testauth1.gs for clearing the server-side access cache — `clearAccessCacheForUser()` clears a single user, `clearAllAccessCache()` clears all ACL-listed users

#### `testauth1.gs` — v01.60g

##### Added
- Admin utility to clear access cache for a specific user or all users, so ACL changes take effect immediately without waiting 10 minutes

## [v04.99r] — 2026-03-19 11:34:59 AM EST — [merged]

> **Prompt:** "im testing on another user and they are showing up as admin, even if they are not on the ACL list"

### Fixed
- Fixed bug where users not in the ACL tab could still sign in via the spreadsheet's editor/viewer sharing list (Method 2 fallback). When the ACL tab is configured, it is now the sole authority — the sharing-list check is skipped entirely

#### `testauth1.gs` — v01.59g

##### Fixed
- Users not listed in the ACL tab are now properly denied access instead of being admitted through the spreadsheet sharing list

## [v04.98r] — 2026-03-19 11:23:01 AM EST — [merged]

> **Prompt:** "ok i did it, can you have it show the role i am when i log in to confirm"

### Changed
- Added role badge display to the user pill after sign-in, showing the user's assigned RBAC role (e.g. admin, clinician, viewer) from the ACL spreadsheet

#### `testauth1.html` — v02.37w

##### Changed
- Show user's role badge in the top-right corner after sign-in

## [v04.97r] — 2026-03-19 10:55:31 AM EST — [merged]

> **Prompt:** "for now use the testauth1 spreadsheet as the ACL while we are testing, set up the tab for it"

### Changed
- Configured `MASTER_ACL_SPREADSHEET_ID` to use the existing testauth1 data spreadsheet (`1EKParBF6pP5Iz605yMiEqm1I7cKjgN-98jevkKfBYAA`) as the ACL source for testing — activates RBAC role lookups from the ACL tab

#### `testauth1.gs` — v01.58g

##### Changed
- ACL spreadsheet ID set to testauth1 data spreadsheet — RBAC now reads roles from the ACL tab in the same spreadsheet

## [v04.96r] — 2026-03-19 10:46:42 AM EST — [merged]

> **Prompt:** "ok how do you suggest we get started with RBAC"

### Added
- Implemented Role-Based Access Control (RBAC) in the testauth1 environment — four roles (admin, clinician, billing, viewer) with distinct permission sets, addressing HIPAA §164.308(a)(4)(ii) compliance gap #5 from the HIPAA compliance report
- Permission gate function `checkPermission()` validates user role against required permissions before data operations, throwing PERMISSION_DENIED on denial with full audit logging
- Role and permissions now stored in server-side session cache and delivered to client via postMessage (gas-session-created and gas-auth-ok)
- Client-side role/permissions storage in sessionStorage for future UI gating

### Changed
- `checkSpreadsheetAccess()` now returns an RBAC-aware object `{ hasAccess, role, isEmergencyAccess }` instead of a boolean — reads Role column (col B) from the Master ACL spreadsheet
- `exchangeTokenForSession()` stores role and permissions in sessionData, includes role in login audit log entries
- `validateSession()` and `validateSessionForData()` now return role and permissions in their result objects
- `saveNote()` gated behind 'write' permission — viewers and billing users cannot write patient notes
- Audit log entries enhanced with role and permission check results for HIPAA-compliant access tracking
- Emergency access users receive 'admin' role with full permissions, logged as isEmergencyAccess
- Session resume via gas-auth-ok now updates stored role/permissions (covers role changes between sessions)

#### `testauth1.gs` — v01.57g

##### Added
- RBAC role definitions: admin (full access), clinician (read/write/export/amend), billing (read/export), viewer (read-only)
- `hasPermission()` and `checkPermission()` functions for role-based authorization
- Role column reading from ACL spreadsheet with role caching

##### Changed
- `checkSpreadsheetAccess()` returns object instead of boolean
- Session data includes role, permissions, and isEmergencyAccess flag
- All postMessage responses include role and permissions
- Audit logging includes role and permission check details

#### `testauth1.html` — v02.36w

##### Added
- ROLE_KEY and PERMISSIONS_KEY storage keys for client-side role persistence
- Role/permissions saved on sign-in and updated on session resume

##### Changed
- `saveSession()` accepts role and permissions parameters
- `loadSession()` returns role and permissions from storage
- `clearSession()` clears role and permissions storage

## [v04.95r] — 2026-03-19 09:15:01 AM EST — [merged]

> **Prompt:** "review the repository-information/HIPAA-CODING-REQUIREMENTS.md , and analyze which parts are missing/completed in our testauth1 environment. think deeply and create a report document with your findings"

### Added
- Created `HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md` — comprehensive compliance assessment evaluating all 40 HIPAA coding checklist items against the testauth1 environment. Reports 14 fully implemented, 5 partial, 4 not implemented, 3 N/A, 5 policy/process, and 9 NPRM items. Identifies 7 priority gaps (disclosure accounting, right of access, right to amendment, RBAC, retention enforcement, breach alerting, breach logging) and 5 strengths exceeding requirements (dual timeouts, HMAC integrity, dual audit logs, escalating lockout, fail-closed design). Includes test-value warnings for production deployment

## [v04.94r] — 2026-03-19 08:48:12 AM EST — [merged]

> **Prompt:** "make a complete document which lists every single unabridged HIPAA requirement for coding to be used as our source of truth for HIPAA compliance moving forward. This is very important to get right, think deeply, research online. When writing a large document or file, write it in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Created `HIPAA-CODING-REQUIREMENTS.md` — comprehensive 950-line regulatory reference document containing every HIPAA requirement relevant to software development, derived from the unabridged text of 45 CFR Part 164 (Security Rule, Privacy Rule, Breach Notification Rule), supplemented by NIST SP 800-66r2 guidance and the 2025 NPRM proposed changes. Includes 13 sections covering applicability, definitions, all 5 Security Rule safeguard categories, Privacy Rule coding requirements, breach notification, de-identification standards, summary counts, and a 40-item coding implementation checklist. Supersedes `HIPAA-COMPLIANCE-REFERENCE.md` as the project's HIPAA source of truth

<!-- Rotated 2026-03-21: 27 sections from 2026-03-18 (SHAs unavailable — commits not in shallow history) -->

## [v04.93r] — 2026-03-18 11:55:09 PM EST

> **Prompt:** "are you able to make a testauth2 html so that we can test a much earlier version, for now just make it identical to the testauth1 html. use the same gas"

### Added
- Created `testauth2.html` — identical copy of `testauth1.html` sharing the same GAS backend (`testauth1.gs`), for testing earlier auth versions independently without affecting the primary test page

## [v04.92r] — 2026-03-18 11:42:52 PM EST

> **Prompt:** "its still doing the blink. can you write up your current findings in a document, and then revert the testauth1 environment completely to its pre-10.4.1 state"

### Added
- Created `10.4.1-IMPLEMENTATION-FINDINGS.md` — documents the implementation attempt, three issues encountered (stuck on signing in, double signAppMessage, persistent visual blink), technical learnings, quota analysis, and five recommendations for future re-attempt

### Reverted
- Reverted `testauth1.gs` to v01.56g (pre-10.4.1 state) — removed `exchangeTokenAndBuildApp()`, `buildAppHtmlString()`, and modified listener page
- Reverted `testauth1.html` to v02.35w (pre-10.4.1 state) — removed `appLoaded` guard in `gas-session-created` handler
- Reverted GAS/HTML version files and changelog entries to pre-10.4.1 values

## [v04.91r] — 2026-03-18 11:36:01 PM EST

> **Prompt:** "can you think deeply and research to make sure that the 10.4.1 update is in fact using less quota per login compared to before the update despite the console showing 6 state change idle/busy. why is the gas blinking and then reloading after the 4th net state change"

### Fixed
- Fixed double `signAppMessage` execution in HIPAA single-load path — `buildAppHtmlString()` included a `<script>` tag that could execute in the GAS sandbox (non-standard innerHTML behavior), causing `signAppMessage` to fire twice (once from the listener's direct call, once from the injected script). Split `buildAppHtmlString()` return into `{ markup, script }` — innerHTML path receives markup only (no scripts), `?session=` path receives both (scripts auto-execute normally in HtmlService output). Eliminates the extra `google.script.run` round-trip and the visual "blink" from double gas-auth-ok processing

#### `testauth1.gs` — v01.59g
##### Fixed
- Eliminated extra server call during sign-in that was causing a brief visual flash

## [v04.90r] — 2026-03-18 11:16:43 PM EST

> **Prompt:** "the backend is showing login success, but we are stuck on the signing in screen"

### Fixed
- Fixed HIPAA single-load auth: app was stuck on "Signing in..." because innerHTML-injected `<script>` tags don't auto-execute in the GAS sandbox. Replaced script execution approach — the listener page's success handler now directly calls `google.script.run.signAppMessage()` and sets up event listeners instead of relying on `createElement('script')` + `appendChild`. Also fixed `getElementsByTagName` live collection infinite loop bug

#### `testauth1.gs` — v01.58g
##### Fixed
- Sign-in now completes properly — the app interface loads and becomes interactive after authentication

## [v04.89r] — 2026-03-18 11:09:45 PM EST

> **Prompt:** "implement 10.4.1-HIPAA-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md"

### Changed
- Implemented HIPAA single-load auth optimization — reduced HIPAA postMessage login from 2 `doGet()` calls to 1 by using `innerHTML` SPA technique. The listener page now calls `exchangeTokenAndBuildApp()` which returns session data + app HTML in a single `google.script.run` response, then injects the app UI via `innerHTML` and manually executes scripts. Eliminates one full iframe reload per sign-in (25% reduction in GAS executions per login) while maintaining all security guarantees (HMAC, nonce, origin validation, audit logging). Session token no longer appears in URL during HIPAA login flow

#### `testauth1.gs` — v01.57g
##### Added
- `exchangeTokenAndBuildApp()` — combined exchange + app HTML builder for single-load optimization
- `buildAppHtmlString()` — extracted app HTML body builder, shared between single-load and `?session=` paths
##### Changed
- HIPAA listener page success handler now injects app HTML via `innerHTML` + manual script execution instead of triggering a second `doGet()` reload
- `?session=` path refactored to use `buildAppHtmlString()` (identical output, shared code)

#### `testauth1.html` — v02.36w
##### Changed
- `gas-session-created` handler now checks `appLoaded` flag — skips iframe reload when app HTML was already injected by the single-load optimization

## [v04.88r] — 2026-03-18 10:51:38 PM EST

> **Prompt:** "do the same hipaa verdict/rejection for the full 10.4.1 document, you can research it to double check it, and think deeply about if something in the plan will make it not hipaa compliant then reject that idea"

### Changed
- Added comprehensive element-by-element HIPAA evaluation to `10.4.1-HIPAA-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md` section 8 — evaluated all 9 techniques individually against HIPAA requirements (innerHTML injection, createElement script execution, token-in-URL removal, combined server function, etc.). All 9 passed with 2 caveats documented (escape guards must be maintained, Phase 8 CSP must accommodate dynamic scripts). Added 7 new sources (OWASP, Feroot, HHS OCR 2026 guidance) to references

## [v04.87r] — 2026-03-18 10:44:40 PM EST

> **Prompt:** "yes, add that to the 10.4.1 plan, but do thorough research and think deeply before doing so, make sure we are still being hipaa compliant with the whole plan, being hipaa compliant is mandatory, if something will make it not hipaa compliant then reject the idea"

### Changed
- Added section 10 to `10.4.1-HIPAA-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md` — "Audit Log Consolidation: Evaluated and Rejected". Researched HIPAA §164.312(b) audit trail requirements and determined that the two separate audit entries (`all_sessions_invalidated` + `session_created`) must remain separate: they are distinct security events (forced logout vs. new login), originate from different functions called in different contexts, and fire conditionally. Consolidating would reduce audit trail clarity and violate HIPAA granularity expectations. Added 6 HIPAA audit log sources to references section

## [v04.86r] — 2026-03-18 10:29:07 PM EST

> **Prompt:** "write it up in a clean, ready to implement fully researched document 10.4.1- , remember our goal is to Reduce the GAS login flow 2 quota consumptions to 1 per sign-in while maintaining full HIPAA compliance and all existing security guarantees. When writing a large document or file, write it in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Created `10.4.1-HIPAA-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md` — HIPAA-specific single-load optimization plan using innerHTML SPA technique to reduce HIPAA postMessage login from 2 `doGet()` to 1, with deep research into `google.script.run` DOM survival, HIPAA compliance analysis, 4-step implementation guide, 23-point verification checklist, and proof-of-concept requirement

## [v04.85r] — 2026-03-18 10:09:24 PM EST

> **Prompt:** "can you clean up the plan so that you write it out as a ready to implement format, but redo the deep thinking, and online research, make sure to break large document writes into chunks"

### Changed
- Rewrote `10.4-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md` as clean ready-to-implement document — removed abandoned HIPAA path optimization (Step 5), eliminated contradictory summary tables, removed back-and-forth reasoning, updated sources with fresh 2026 web research. Reduced from 752 lines to 528 lines while preserving all actionable content

## [v04.84r] — 2026-03-18 03:45:28 PM EST

> **Prompt:** "write up an implementation plan with all the context, deeply thought, online research, and ready to implement. make sure that this would not break hipaa compliance. make the implementation plan a single document. When writing a large document or file, write it in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Created `10.4-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md` — comprehensive implementation plan to reduce GAS login from 2 `doGet()` executions to 1, with HIPAA compliance analysis, quota impact assessment, 6-step implementation guide, security invariants checklist, verification tests, and rollback plan. Includes web-researched GAS quota data and HIPAA security rule cross-reference

## [v04.83r] — 2026-03-18 03:22:20 PM EST

> **Prompt:** "everything seems to be passing, except for the " new BroadcastChannel('signout-channel').onmessage = e => console.log('BC:', JSON.stringify(e.data)); " this one doesnt seem to be outputting anything no matter where i sign in"

### Fixed
- Fixed incorrect BroadcastChannel name in Phase 10 verification guide — `'signout-channel'` → `'auth-sign-out'` (3 occurrences across Phase 4 checklist, console commands, and Phase 10 integration test)

## [v04.82r] — 2026-03-18 03:08:21 PM EST

> **Prompt:** "yes"

### Changed
- Updated Phase 10 verification ordering in implementation guide — Phase 10 now runs before Phase 8 (CSP Hardening) to catch bugs that would invalidate the CSP hash
- Added note to Phase 10 section header clarifying it should run after Phases 1-7/9 but before Phase 8
- Added recommended verification order paragraph to the critical ordering rule section

## [v04.81r] — 2026-03-18 02:50:29 PM EST

> **Prompt:** "implement the repository-information/10.3-DJB2-TO-HMAC-MIGRATION-PLAN.md"

### Changed
- Migrated four client-side GAS session HTML messages from DJB2 signing to server-side HMAC-SHA256 signing via `signAppMessage()` — `gas-auth-ok`, `gas-version`, `gas-user-activity`, `gas-session-invalid` now use `google.script.run` for cryptographic integrity

### Removed
- Removed `_s()` inline DJB2 signing function and `_mk` variable from GAS session HTML inline script
- Removed `_verifyDjb2Legacy()` function and DJB2 fallback path from `_verifyMessageSignature()` in host page
- Removed `_messageKey` raw string variable from host page — only `_hmacKey` (CryptoKey) remains
- Removed DJB2-specific tests from self-test panel (Test 13 updated to HMAC-only)

#### `testauth1.gs` — v01.56g

##### Added
- `signAppMessage()` server-side function for HMAC-SHA256 signing of GAS session HTML messages (same pattern as `processHeartbeat`/`processSignOut`)

##### Changed
- `gas-auth-ok`, `gas-version`, `gas-user-activity`, `gas-session-invalid` messages now signed server-side via `google.script.run.signAppMessage()` instead of client-side `_s()` (DJB2)

##### Removed
- `_s()` inline DJB2 signing function and `_mk` variable from session HTML inline script

#### `testauth1.html` — v02.35w

##### Changed
- `_verifyMessageSignature()` simplified to HMAC-SHA256 only path (DJB2 fallback removed)
- Signature verification gate checks `_hmacKey` only (no `_messageKey` fallback)
- Duplicate `gas-session-created` detection uses `_hmacKeySet` guard instead of `_messageKey` comparison

##### Removed
- `_verifyDjb2Legacy()` function
- `_messageKey` raw string variable — all references removed from `clearSession()`, "Use Here" handler, `gas-session-created` handler, `gas-auth-ok` handler
- DJB2-specific assertions from self-test panel Test 13 and Test 43

## [v04.80r] — 2026-03-18 02:02:28 PM EST

> **Prompt:** "yes proceed that way, make the implementation plan a single document. When writing a large document or file, write it in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Changed
- Removed legacy URL-parameter heartbeat (`?heartbeat=TOKEN`) and sign-out (`?signOut=TOKEN`) routes from `doGet()` in `testauth1.gs` — these were superseded by Phase 7's postMessage-based `processHeartbeat()` and `processSignOut()` functions (~120 lines of dead code removed)
- Checked off Phase 9 verification in the implementation guide (`10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md`)

### Added
- Created DJB2 → HMAC-SHA256 migration plan (`10.3-DJB2-TO-HMAC-MIGRATION-PLAN.md`) — 7-step implementation plan to migrate the four remaining DJB2-signed messages in GAS session HTML (`gas-auth-ok`, `gas-version`, `gas-user-activity`, `gas-session-invalid`) to server-side HMAC-SHA256 signing via `google.script.run`

#### `testauth1.gs` — v01.55g

##### Changed
- Removed legacy URL-parameter heartbeat and sign-out routes from `doGet()` — dead code after Phase 7 migration
- Removed `signOutToken`, `heartbeatToken`, and `msgKey` URL parameter variables from `doGet()`

## [v04.79r] — 2026-03-18 01:19:03 PM EST

> **Prompt:** "ok you fixed it, add it to the documentation what happened, why it happened, and what you did to fix it"

### Changed
- Added "Key Delivery Architecture — Implementation Note" section to Phase 5 documentation in `10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md` — documents the two code paths (sign-in vs direct session load), the HMAC key null bug after "Use Here", the failed `gas-session-created` injection approach (infinite reload loop), and the working `gas-auth-ok` delivery fix
- Updated Phase 5 verification checklist item #3 to reflect actual behavior (key is re-imported via `gas-auth-ok`, not preserved from the original session)
- Updated Phase 5 console test #4 to use `setTimeout` for async key import after "Use Here"
- Corrected Phase 5 Step 5.2 "Use Here" handler documentation — keys ARE cleared (not preserved) because the iframe reload generates a new GAS-side context

## [v04.78r] — 2026-03-18 01:12:40 PM EST

> **Prompt:** "hmm, the thing is now with your last update is that when i duplicate the tab, its now fighting to stay open in the original tab by spamming refreshes, and is not gracefully transfering to the other tab"

### Fixed
- Fixed iframe reload loop caused by injecting `gas-session-created` into the `?session` GAS path — every `?session` load (tab duplicate, refresh, normal sign-in) was triggering the handler which reloads the iframe, creating an infinite loop
- Reverted the GAS-side `gas-session-created` injection; instead, `gas-auth-ok` now includes `messageKey` and the HTML-side `gas-auth-ok` handler imports the key when `_hmacKey` is null — this is safe because `gas-auth-ok` is a terminal message (no iframe reload), so no loop can occur

#### `testauth1.html` — v02.34w

##### Fixed
- HMAC key is now imported from `gas-auth-ok` when the key is missing (after "Use Here" reclaim, tab duplicate, or page refresh)

#### `testauth1.gs` — v01.54g

##### Changed
- `gas-auth-ok` message now includes `messageKey` from the session, replacing the reverted `gas-session-created` injection approach

## [v04.77r] — 2026-03-18 01:02:43 PM EST

> **Prompt:** "[screenshot showing Tab A with active session but _hmacKeySet false and _hmacKey null after Use Here reclaim]"

### Fixed
- Fixed HMAC key not being re-established after "Use Here" tab reclaim — the `?session=TOKEN` GAS path now sends `gas-session-created` with `messageKey` before `gas-auth-ok`, so `_hmacKey` is imported during reclaim (previously stayed null because `gas-session-created` was never sent on the `?session` path)
- Added `_directSessionLoad` guard to `gas-session-created` handler to prevent iframe reload loop — when the message comes from the `?session` path (already loaded), the handler skips reloading the iframe
- Reset `_iframeLoadTime` in "Use Here" handler so the 30-second bootstrap replay check doesn't reject the reclaim's `gas-session-created`

#### `testauth1.html` — v02.33w

##### Fixed
- HMAC key is now properly restored after reclaiming a session with "Use Here"

#### `testauth1.gs` — v01.53g

##### Fixed
- Session reclaim via `?session=TOKEN` now delivers the HMAC signing key to the host page

## [v04.76r] — 2026-03-18 11:49:04 AM EST

> **Prompt:** "added screenshots of results. running {postMessage({type:'gas-heartbeat-ok', expiresIn:9999}, '*');} in a session active elsewhere is triggering net state change from idle to busy, but the gas should not be loaded on that page"

### Fixed
- Added `_tabSurrendered` guard to `_reportSecurityEvent()` — surrendered tabs no longer fire GAS iframe requests for security audit logging, eliminating unexpected IDLE→BUSY network state changes and warden warnings on the takeover wall
- Clarified item 17 (forge message test) — the IDLE→BUSY network activity is the security event audit logger (expected behavior when signed in), NOT the forged message being processed; the forged message is correctly rejected at Layer 0 (origin check)
- Clarified item 15 (key survives takeover) — Tab A must be signed in BEFORE Tab B claims the session; if Tab A never signed in, `_hmacKey` will correctly be null
- Clarified item 18 (CSP XSS test) — expected to fail until Phase 8 hash-based CSP is activated; current CSP has `unsafe-inline` in script-src

#### `testauth1.html` — v02.32w

##### Fixed
- Security event reports no longer fire from tabs that have been taken over by another tab

## [v04.75r] — 2026-03-18 11:31:50 AM EST

> **Prompt:** "yes, but make sure its properly testing not cosmetically going to make it pass"

### Fixed
- Fixed HMAC key overwrite test race condition in console test commands — `postMessage` is async but the old `console.log` ran synchronously before the handler processed the attack, producing a cosmetic pass. Now uses `setTimeout` + reference equality (`_hmacKey === _keyBefore`) to verify key immutability AFTER the message handler runs
- Fixed wrong sessionStorage key name in sign-out test — was `'sessionToken'`, corrected to `getStorage().getItem(SESSION_KEY)` to use the actual storage abstraction and key constant
- Added `_hmacKeySet` check and clearer tab-context instructions to the "Key survives takeover" test (item 15) — clarified that this must run from Tab A while the takeover wall is showing

## [v04.74r] — 2026-03-18 11:15:40 AM EST

> **Prompt:** "then mark it off in checklist in the guide document"

### Changed
- Marked Phase 9 (GAS URL Exposure / M-3) as complete in `10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md` — updated status table, progress counter (8/10), and final checklist

## [v04.73r] — 2026-03-18 11:06:43 AM EST

> **Prompt:** "go ahead and implement phase 9, make sure to clean up any dead code with it"

### Fixed
- Eliminated `window._r` global variable exposure (Phase 9 / M-3 MEDIUM) — GAS deployment URL is no longer accessible as a global JavaScript variable; now scoped to `dataset.baseUrl` DOM property only
- Removed srcdoc trampoline pattern from iframe creation — replaced with direct `f.src` assignment on non-auth pages and inert iframe (no src) on auth pages
- Cleaned up all `window._r ||` fallback chains across auth flow, heartbeat, sign-out, security event reporter, and session sync handlers
- Removed dead `delete window._r` and `gasApp.removeAttribute('srcdoc')` cleanup code from page-load IIFEs
- Updated stale comments referencing srcdoc race conditions

#### `testauth1.html` — v02.31w

##### Fixed
- Removed global GAS URL exposure — deployment URL no longer accessible via `window._r`
- Minor internal improvements

#### `portal.html` — v01.12w

##### Fixed
- Removed global GAS URL exposure — deployment URL no longer accessible via `window._r`
- Minor internal improvements

#### `index.html` — v01.06w

##### Fixed
- Removed global GAS URL exposure — srcdoc trampoline replaced with direct iframe navigation
- Minor internal improvements

#### `testenvironment.html` — v01.06w

##### Fixed
- Removed global GAS URL exposure — srcdoc trampoline replaced with direct iframe navigation
- Minor internal improvements

#### `gas-project-creator.html` — v01.13w

##### Fixed
- Removed global GAS URL exposure — srcdoc trampoline replaced with direct iframe navigation
- Minor internal improvements

## [v04.72r] — 2026-03-18 10:47:49 AM EST

> **Prompt:** "write up something at the top of the document which are instructions for you do use the prepped section for actual hash etc."

### Added
- Added Phase 8 activation instructions section at the top of `10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md` — step-by-step guide for Claude to activate hash-based CSP when all other phases are complete

## [v04.71r] — 2026-03-18 10:41:45 AM EST

> **Prompt:** "actually do both options"

### Added
- Created `scripts/compute-csp-hash.sh` — CSP SHA-256 hash computation script with `--verify` mode for checking hash mismatches
- Added commented-out hardened CSP meta tag (hash-based with `strict-dynamic`) to testauth1.html — ready to activate after all other security phases are complete

#### `testauth1.html` — v02.30w

##### Added
- Prepared hash-based Content Security Policy — ready to activate when all security phases are complete

## [v04.70r] — 2026-03-18 09:51:48 AM EST

> **Prompt:** "i want this dead code detection to apply to all code (i.e. gas) not just html"

### Changed
- Moved "Dead Code Detection Methodology" from `.claude/rules/html-pages.md` (HTML-scoped) to `.claude/rules/behavioral-rules.md` (always-loaded) — now applies to all code including GAS scripts, workflows, and server-side code
- Generalized methodology language to cover GAS-specific patterns (`UrlFetchApp.fetch()`, `SpreadsheetApp` writes, trigger scheduling) and added new indicators (unreachable parameters, vestigial error handlers)

## [v04.69r] — 2026-03-18 09:45:42 AM EST

> **Prompt:** "before you remove it, add something as a rule/reference so that you can use the logic you just used so we can clean up dead code anywhere we designate later"

### Removed
- Removed dead srcdoc code from GAS iframe IIFE in testauth1.html — srcdoc navigation was cancelled by every code path, making it dead code with active cleanup burden in two init branches

### Added
- Added "Dead Code Detection Methodology" reference to `.claude/rules/html-pages.md` — documents the systematic analysis for identifying dead code and pre-auth resource abuse vectors

#### `testauth1.html` — v02.29w

##### Removed
- Removed unnecessary iframe startup code that was already being cancelled on every page load — cleaner initialization flow

## [v04.68r] — 2026-03-18 09:24:34 AM EST

> **Prompt:** "yes implement it, and see if theres anything else that might have a similar vulnerability for me to review to make their own implementation"

### Fixed
- Added pre-auth guard to `_reportSecurityEvent()` — prevents unauthenticated quota abuse via postMessage spam on the login page (GAS requests no longer fire when no session exists)

#### `testauth1.html` — v02.28w

##### Fixed
- Security event reporting now requires an active session — unauthenticated visitors can no longer trigger GAS quota consumption via postMessage spam

## [v04.67r] — 2026-03-18 08:38:59 AM EST

> **Prompt:** "continue to implement the next step in repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md"

### Changed
- Implemented Phase 7: Token-in-URL Elimination (H-5, H-6, M-4) — session tokens and security event details no longer appear in URL parameters

#### `testauth1.gs` — v01.52g

##### Added
- `processHeartbeat(token)` server-side function — heartbeat logic extracted from doGet() for postMessage-based calling
- `processSignOut(token)` server-side function — sign-out logic extracted from doGet()
- `processSecurityEvent(eventType, details)` server-side function — security event logging extracted from doGet()
- Three `?action=` routes in doGet() (`heartbeat`, `signout`, `securityEvent`) — return listener pages that receive sensitive data via postMessage

#### `testauth1.html` — v02.27w

##### Changed
- `sendHeartbeat()` now loads `?action=heartbeat` instead of `?heartbeat=TOKEN` — token sent via postMessage after ready signal
- `performSignOut()` now loads `?action=signout` instead of `?signOut=TOKEN` — token sent via postMessage after ready signal
- `_reportSecurityEvent()` now loads `?action=securityEvent` instead of `?securityEvent=TYPE&details=DATA` — event data sent via postMessage after ready signal

##### Added
- `gas-heartbeat-ready`, `gas-signout-ready`, `gas-security-event-ready` message types to `_KNOWN_GAS_MESSAGES` allowlist
- Signature exemption for Phase 7 ready signals (listener pages don't have signing keys)
- `gas-heartbeat-ready` handler in `_processVerifiedMessage` — sends token via postMessage to heartbeat iframe

## [v04.66r] — 2026-03-17 11:05:06 PM EST

> **Prompt:** "nice all working as expected, update those tests in the guide document"

### Changed
- Updated Phase 6 console test commands in security implementation guide — numbered steps, closure internals test, session resume note, corrected expected behavior descriptions

## [v04.65r] — 2026-03-17 10:56:34 PM EST

> **Prompt:** "screenshots attached for several of these tests which dont match whats expected"

### Fixed
- Phase 6 (H-4) session resume path — `_lockSessionTimers()` now also called inside `startCountdownTimers()` as a catch-all. On session resume (returning with stored token), `gas-session-created` never fires, so the timers were never locked. The catch-all ensures immutability regardless of which sign-in path was used

#### `testauth1.html` — v02.26w

##### Fixed
- Session timer protection now works on all sign-in paths including session resume from stored tokens

## [v04.64r] — 2026-03-17 10:43:37 PM EST

> **Prompt:** "screenshots attached for several of these tests which dont match whats expected. also, number 4 after running it auto expires the session"

### Fixed
- Phase 6 (H-4) immutable session timers — Object.defineProperty now targets actual `var`-declared names (`SERVER_SESSION_DURATION`, `ABSOLUTE_SESSION_DURATION`) instead of underscore-prefixed names that nothing read from
- Guard check changed from `configurable` to `writable` since `var` declarations are already non-configurable
- `ABSOLUTE_SESSION_DURATION` assignment moved before `_lockSessionTimers()` call so it executes while the var is still writable
- Signature Verification test now saves/restores `_hmacKeySet` flag so Phase 5's first-write-wins guard doesn't block test key import
- Immutable Session Timers security test now verifies Object.defineProperty targets correct property names and checks `writable:false` state

#### `testauth1.html` — v02.25w

##### Fixed
- Session timer protection now properly prevents modification via browser console
- Security test panel signature verification now works correctly when signed in

## [v04.63r] — 2026-03-17 10:23:01 PM EST

> **Prompt:** "sure add that"

### Added
- "Document-Prescribed Workflows" behavioral rule — enforces pause-and-confirm workflow when implementation guides prescribe developer testing between steps

## [v04.62r] — 2026-03-17 10:14:46 PM EST

> **Prompt:** "continue to implement the repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md"

### Changed
- Implemented Phase 6 (H-4) immutable session timers — closure-scoped enforcer + Object.defineProperty prevents client-side timer tampering on shared workstations
- Updated security implementation guide progress to 6/10 phases complete

#### `testauth1.html` — v02.24w

##### Changed
- Session timeout values are now tamper-proof — cannot be modified via browser DevTools to prevent automatic logoff

## [v04.61r] — 2026-03-17 09:58:32 PM EST

> **Prompt:** "these console tests you have had me do and will have me do, add those into the 10.2 guide near the progress checklist"

### Changed
- Added "Console Test Commands" sections to all 10 phases in the security implementation guide — each phase now includes copy-paste DevTools commands for verifying the implementation

## [v04.60r] — 2026-03-17 09:38:24 PM EST

> **Prompt:** "proceed to implement the next step"

### Changed
- Implemented Phase 5 (H-3) messageKey lifecycle hardening — added `_hmacKeySet` defense-in-depth guard, centralized key clearing to `clearSession()` and iframe-reload path only

#### `testauth1.html` — v02.23w

##### Changed
- Improved authentication key management — keys can no longer be overwritten by forged messages mid-session

## [v04.59r] — 2026-03-17 09:21:24 PM EST

> **Prompt:** "continue to implement the next step of repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md"

### Changed
- Implemented Phase 4 (H-1) BroadcastChannel credential leak fix — stripped session token, email, and HMAC key from tab-claim broadcasts

#### `testauth1.html` — v02.22w

##### Changed
- Improved session security by removing sensitive data from cross-tab communication

## [v04.58r] — 2026-03-17 09:12:37 PM EST

> **Prompt:** "in the implementation workflow also have it mention something to the effect of "if writing a large document/file, Write the document in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section.""

### Added
- Added large file writing guidance to implementation workflow in security guide

## [v04.57r] — 2026-03-17 09:01:20 PM EST

> **Prompt:** "also document it in the guide so that it would be easy for you to know what to do to re-add it. also start making a checklist in the guide to know which ones we have already implemented"

### Added
- Added implementation progress checklist to security guide showing 3/10 phases complete
- Added detailed IP collection re-enablement procedure (6 steps for HTML, 7 steps for GAS) with prerequisites and verification steps

## [v04.56r] — 2026-03-17 08:55:55 PM EST

> **Prompt:** "can you have all the code for getting the IP that you just removed commented out as you had it in case i want to re-add it later please"

### Changed
- Restored all removed IP collection code as commented-out blocks in testauth1.html and testauth1.gs for easy re-enablement
- Added step-by-step re-enablement instructions in comments

#### `testauth1.html` — v02.21w

##### Changed
- Added commented-out IP collection, validation, forwarding, and heartbeat code with re-enablement instructions

#### `testauth1.gs` — v01.51g

##### Changed
- Added commented-out IP extraction, storage, iframe IP collection, and message handler code with re-enablement instructions

## [v04.55r] — 2026-03-17 08:48:57 PM EST

> **Prompt:** "proceed with implementing the next step of 10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md"

### Removed
- Removed ipify.org dependency from testauth1 (Phase 3: C-3, M-2) — third-party IP lookup service lacks BAA coverage, constituting unauthorized PHI disclosure under HIPAA
- Removed all client IP collection, validation, forwarding, and logging code from both HTML host page and GAS backend
- Removed `api.ipify.org` from Content Security Policy `connect-src` directive

### Changed
- All audit log entries now use `'not-collected'` for the client IP field instead of actual IP addresses
- `saveNote()` function signature simplified — clientIp parameter removed since IP is no longer collected

#### `testauth1.html` — v02.20w

##### Removed
- Removed ipify.org fetch block, `_validateIp` function, `_clientIp` variable, `_ipForwardedToGas` flag, and all IP forwarding logic
- Removed `api.ipify.org` from CSP `connect-src`
- Removed client IP from security event reports and heartbeat requests

##### Changed
- `ENABLE_IP_LOGGING` set to `false` with HIPAA compliance comment

#### `testauth1.gs` — v01.50g

##### Removed
- Removed GAS iframe's XHR to ipify.org and `host-client-ip` message handler
- Removed client IP extraction from URL parameters in `doGet()`
- Removed IP storage in heartbeat session data
- Removed `clientIp` parameter from `saveNote()` function

##### Changed
- `ENABLE_IP_LOGGING` set to `false` in HIPAA config profile
- All audit log IP fields default to `'not-collected'`

## [v04.54r] — 2026-03-17 07:33:33 PM EST

> **Prompt:** "in console showing this [Violation] Avoid using document.write(). https://developers.google.com/web/updates/2016/08/removing-document-wr..." ... "really but why havent i seen them before" ... "what about this one then, i dont remember this being in the console a while ago" (dropping postMessage from host) ... "for hipaa and security its ok that its shown in the console?" ... "yes please"

### Fixed
- Deferred `host-client-ip` postMessage until GAS iframe confirms it's loaded — eliminates Google warden console log that exposed internal GAS sandbox URL
- Changed `host-client-ip` targetOrigin from `'*'` to `event.origin` (the verified GAS origin) for tighter security
- Added `_ipForwardedToGas` flag to ensure IP is forwarded exactly once

#### `testauth1.html` — v02.19w

##### Fixed
- Eliminated console warning from Google's warden about unexpected postMessage origin — IP forwarding now waits until GAS iframe is ready
- Tightened outgoing postMessage security — IP messages now use the verified GAS origin instead of wildcard

## [v04.53r] — 2026-03-17 07:18:47 PM EST

> **Prompt:** "before signing in, the console is saying this. Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('https://script.google.com') does not match the recipient window's origin ('https://shadowaisolutions.github.io')."

### Fixed
- Reverted `host-client-ip` outgoing postMessage targetOrigin from `'https://script.google.com'` back to `'*'` — `gasFrame.contentWindow` origin depends on GAS load timing and may still be at the parent origin when the IP fetch completes, causing the restricted targetOrigin to fail

#### `testauth1.html` — v02.18w

##### Fixed
- Console error on page load resolved — IP forwarding messages no longer fail due to origin mismatch

## [v04.52r] — 2026-03-17 07:14:06 PM EST

> **Prompt:** "proceed with implementing the next step of 10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md"

### Added
- Phase 2 Step 2.2: Cryptographic nonce for token exchange — HTML generates a 16-byte random nonce before sending the OAuth token, GAS echoes it back in the `gas-session-created` response, HTML verifies the match before accepting the session (prevents replay/injection attacks)
- Phase 2 Step 2.3: Non-token outgoing postMessages now use `'https://script.google.com'` targetOrigin instead of `'*'` — restricts `host-client-ip` messages to the known GAS outer shell origin

### Changed
- GAS postMessage listener page updated to capture and echo nonce from `exchange-token` messages in both success and failure response paths

#### `testauth1.html` — v02.17w

##### Added
- Token exchange nonce verification — forged session creation messages without a matching nonce are rejected
- Non-token messages now scoped to specific Google origin instead of wildcard

#### `testauth1.gs` — v01.49g

##### Changed
- Token exchange listener echoes nonce back in session creation response for verification

## [v04.51r] — 2026-03-17 07:07:53 PM EST

> **Prompt:** "ok that is fixed, but i need you to track all the things that we were unable to do so that we dont keep trying the same thing over and over when we review the code upon fully updating. you can add a note to the implementation guide itself"

### Added
- "Implementation Notes & Deviations" section in `10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md` — tracks what was changed from the guide's recommendations during live implementation (regex fixes, workarounds, deviations) so future sessions don't repeat known issues

## [v04.50r] — 2026-03-17 07:03:24 PM EST

> **Prompt:** "first hiccup. we are stuck in the signing in page, figure out whats going on and fix it"

### Fixed
- Origin validation regex was too restrictive — Google's GAS sandbox subdomains contain hyphens (e.g. `n-abc123-0lu-script.googleusercontent.com`) but the regex only allowed `[a-z0-9]+` before `-script`, silently dropping all legitimate GAS messages and preventing sign-in from completing
- Broadened regex to accept any `*.googleusercontent.com` subdomain (all Google-controlled) — handles all current and future sandbox subdomain format variations

#### `testauth1.html` — v02.16w

##### Fixed
- Sign-in now completes successfully — origin validation no longer blocks legitimate server messages with hyphenated subdomain origins

## [v04.49r] — 2026-03-17 06:56:06 PM EST

> **Prompt:** "continue with implementing the next step in the repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md"

### Added
- Phase 2 Step 2.1: postMessage origin validation — `_isValidGasOrigin()` function validates incoming postMessage origins against Google's known patterns (script.google.com, *.googleusercontent.com, accounts.google.com)
- Layer 0 origin check in postMessage listener — messages from non-Google origins are silently dropped before reaching the allowlist or HMAC verification layers
- Security test (Test 19b) for origin validation — verifies 4 legitimate origins are accepted and 6 attack patterns are rejected

#### `testauth1.html` — v02.15w

##### Added
- Origin validation gate on all incoming postMessages — blocks cross-origin message injection (Category 3 finding H-2)
- New security test validates the origin allowlist against legitimate GAS origins and common spoofing patterns

## [v04.48r] — 2026-03-17 06:20:58 PM EST

> **Prompt:** "sig passthrough is stuck on pending waiting to run"

### Fixed
- Fixed security test runner hanging on async tests (Tests 13, 37) — runner now detects when `addResult` is called asynchronously and waits for completion (up to 5s timeout) before advancing to the next test

#### `testauth1.html` — v02.14w

##### Fixed
- Security tests no longer get stuck on "Waiting to run" for tests that verify cryptographic signatures

## [v04.47r] — 2026-03-17 06:15:17 PM EST

> **Prompt:** "add to the top of repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md, something to the effect of the following directive: "after each step is implemented, tell the user what specifically to test for in functionality relating to what you modified, then wait for the user to tell you to proceed and you will continue step by step""

### Changed
- Added implementation workflow directive to Category 3 implementation guide — Claude must describe what to test after each step and wait for developer confirmation before proceeding

## [v04.46r] — 2026-03-17 06:09:12 PM EST

> **Prompt:** "continue with implementing the next step 1.3 of the repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md"

### Added
- Added HMAC-SHA256 signature verification to `testauth1.html` using Web Crypto API (Phase 1, Step 1.3)
  - `_importHmacKey()` — imports raw key as non-extractable CryptoKey (verify-only)
  - `_verifyHmacSha256()` — async verification using `crypto.subtle.verify()`
  - `_verifyDjb2Legacy()` — extracted legacy DJB2 verification for dual-accept migration
  - `_verifyMessageSignature()` — async dual-accept dispatcher (HMAC-SHA256 first, DJB2 fallback)
  - `_processVerifiedMessage()` — extracted message handler for async verification flow
- HMAC key import on `gas-session-created` — key is imported as non-extractable via Web Crypto API
- HMAC key re-import on BroadcastChannel tab-claim (cross-tab key sync)

### Changed
- postMessage listener now uses async verification path for HMAC-SHA256 + DJB2 dual-accept
- All session reset points (`clearSession`, reauth, "Use Here", cross-device eviction) now null both `_messageKey` and `_hmacKey`
- Security tests updated for async HMAC-SHA256 verification (Test 13, 37, 43)

#### `testauth1.html` — v02.13w

##### Added
- Messages from the server are now verified using HMAC-SHA256 cryptographic signatures (Web Crypto API)
- Dual-accept migration: both new HMAC-SHA256 and legacy signatures are accepted during transition

##### Changed
- Security tests updated to validate the new cryptographic verification

## [v04.45r] — 2026-03-17 05:52:48 PM EST

> **Prompt:** "make it so that the full unabridged prompt that was used is put in the changelog every time, do not shorten it with ..."

### Changed
- Enforced full unabridged prompt quotes in CHANGELOG version sections — prompt text must never be truncated, shortened, or abbreviated with "..."
- Updated CODING PLAN first bullet prompt quote rule to require full verbatim prompt (no truncation)
- Updated PROMPT end-of-response section to require full verbatim prompt (no truncation)

## [v04.44r] — 2026-03-17 05:34:24 PM EST

> **Prompt:** "proceed with next step"

### Changed
- Replaced all 7 inline DJB2 hash signing blocks in `testauth1.gs` `doGet()` with server-side `signMessage()` HMAC-SHA256 pre-signing (Phase 1, Step 1.2)
  - Heartbeat responses (expired, error, HMAC violation, absolute timeout, session timeout, OK) now use server-computed HMAC-SHA256 signatures
  - Sign-out response now uses server-computed HMAC-SHA256 signature
  - The messageKey is no longer embedded in client-side HTML responses — it stays server-side only

#### `testauth1.gs` — v01.48g

##### Changed
- Messages are now signed on the server before being sent, replacing the previous client-side signing approach

## [v04.43r] — 2026-03-17 05:27:44 PM EST

> **Prompt:** "start implementing step 1.1 of repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md, afterwards tell me what specifically to test for in functionality relating to what you modified, then wait for me to tell you to proceed and you will continue step by step"

### Added
- Added `signMessage()` HMAC-SHA256 function to `testauth1.gs` — server-side message signing using `Utilities.computeHmacSha256Signature()` (Phase 1, Step 1.1 of Category 3 security implementation)
  - Deterministic payload construction with sorted keys
  - Signed byte array → hex string conversion with proper unsigned masking
  - Placed alongside existing HMAC session integrity functions

#### `testauth1.gs` — v01.47g

##### Added
- Server-side HMAC-SHA256 message signing function for postMessage integrity

## [v04.42r] — 2026-03-17 02:37:43 PM EST

> **Prompt:** "Research online deeply and think carefully about the findings in repository-information/10.1-SECURITY-REMEDIATION-GUIDE.md. Make a specialized document for the findings in 10.1-SECURITY-REMEDIATION-GUIDE.md with the same goal but focusing on the 'Category 3: Must Implement in Code — Cannot Justify Under Risk Assessment'..."

### Added
- Created `10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md` — comprehensive, phased implementation guide for the 12 Category 3 security findings that must be fixed in code before production deployment
  - 10 implementation phases (one per finding or logical group), each with working code, verification tests, and rollback plans
  - Standards quick reference (HIPAA NPRM 2025, NIST 800-63B-4, OWASP 2025/2026, GAS constraints)
  - Dependency map showing required implementation order
  - Before/after architecture diagrams with defense layer visualization
  - 32-check cross-phase integration test suite
  - Master security implementation checklist
  - Troubleshooting section with debug scripts for each phase
  - Research sources with direct links to standards and references
- Added README tree entry for the new document

## [v04.41r] — 2026-03-17 11:39:21 AM EST

> **Prompt:** "the tests/offensive-security/SECURITY-REMEDIATION-GUIDE.md , move that where the 10.1 was, and also give it the prefix 10.1-"

### Changed
- Moved SECURITY-REMEDIATION-GUIDE.md from `tests/offensive-security/` to `repository-information/10.1-SECURITY-REMEDIATION-GUIDE.md`
- Updated cross-reference link in GAS-HIPAA-COMPLIANCE-ANALYSIS.md to point to new location
- Updated README tree — removed old entry from tests/offensive-security, added new entry in repository-information

## [v04.40r] — 2026-03-17 11:08:18 AM EST

> **Prompt:** "remove the 10.1-AUTH-IMPLEMENTATION-DOCUMENT-TESTAUTH1.md file"

### Removed
- 10.1-AUTH-IMPLEMENTATION-DOCUMENT-TESTAUTH1.md — comprehensive auth implementation document for testauth1 environment (removed from repo and README tree)

## [v04.39r] — 2026-03-17 10:31:40 AM EST

> **Prompt:** "can you add a clarification at the top of SECURITY-REMEDIATION-GUIDE.md for the parts that we can handle on the organization level as well as things that we can justify as part of the 'risk assessment' so we dont have to give up functionality. those that we must include and cannot justify under risk assessment must be included in production. do not modify existing text in that file, just add a section at the top"

### Added
- Implementation Classification section at top of SECURITY-REMEDIATION-GUIDE.md — classifies all 24 audit findings into three categories: org policy (3 findings — handled by Workspace admin), risk-assessment justifiable (9 findings — document & accept with compensating controls), and must-implement in code (12 findings — required before production). Includes justification language for each risk-assessed finding and explanation of why must-implement findings cannot be deferred

## [v04.38r] — 2026-03-17 09:44:48 AM EST

> **Prompt:** "can you put this information in its own file in our repo"

### Added
- GAS-HIPAA-COMPLIANCE-ANALYSIS.md — analysis of Google Apps Script HIPAA compliance under Workspace BAA, covering BAA coverage status, platform vs application responsibility breakdown, GAS web app deployment concerns, Google's own GAS-specific guidance, impact on testauth1 architecture (all 24 audit findings mapped), and 10+ authoritative sources

## [v04.37r] — 2026-03-17 09:07:45 AM EST

> **Prompt:** "Research online deeply and think carefully about the findings in tests/offensive-security/HTML-AUTH-SECURITY-AUDIT.md. Use current OWASP guidance, HIPAA 2025/2026 NPRM requirements, NIST 800-63B, and Google Cloud security best practices — don't rely on internal docs or assumptions. Be brutally honest about what works and what doesn't. Using HTML-AUTH-SECURITY-AUDIT.md as your guide, create a comprehensive implementation-ready reference document that addresses its findings."

### Added
- SECURITY-REMEDIATION-GUIDE.md — comprehensive 1900-line implementation-ready reference document addressing all findings from the HTML auth layer security audit. Covers 5 critical, 7 high, 8 medium, and 4 low-severity findings with working code blocks, architecture diagrams, comparison tables, migration strategies, and a phased implementation checklist. Built from extensive online research across OWASP 2025/2026, HIPAA NPRM 2025, NIST SP 800-63B, Google Cloud security best practices, Web Crypto API, WebAuthn/FIDO2, and 40+ authoritative sources

## [v04.36r] — 2026-03-17 08:08:41 AM EST

> **Prompt:** "when you output the coding plan bookend, have the first item on the list be a quoted copy of my prompt to you. have this same quote be shown after the COMMIT LOG, before the SUMMARY in the END OF RESPONSE BLOCK. i also want you to include the quote of the prompt in the repo change log from now on"

### Added
- Prompt quote rule — the first bullet in every CODING PLAN is now a blockquoted copy of the user's original prompt, preserving the request verbatim in chat history
- `💬💬PROMPT💬💬` section in the end-of-response block — appears after COMMIT LOG and before SUMMARY, showing the user's original prompt for easy reference alongside the change summary
- Prompt quote in CHANGELOG version sections — each versioned release now includes a blockquoted copy of the user's prompt that triggered the changes, preserving intent alongside the change entries


## [v04.35r] — 2026-03-16 08:04:14 PM EST

### Added
- 10.1-AUTH-IMPLEMENTATION-DOCUMENT-TESTAUTH1.md — comprehensive 1200-line authentication implementation document covering complete auth flow walkthrough, session management, HMAC integrity, CSP analysis, postMessage security model, cross-device enforcement, preset system, security audit remediation status, HIPAA 2026 readiness assessment, implementation roadmap with dependency graph, attack surface analysis, defense-in-depth matrix, and testing procedures. Synthesized from 11 existing plans, independent security audit, known constraints, and extensive web research (OWASP, NIST, IETF, Google, Microsoft 2025–2026 guidance)

## [v04.34r] — 2026-03-16 06:32:53 PM EST

### Added
- Architectural clarification section in HTML-AUTH-SECURITY-AUDIT.md — explains HTML-auth-only vs GAS-PHI-layer separation, tables showing which findings are reduced vs remain critical under this architecture

## [v04.33r] — 2026-03-16 06:22:11 PM EST

### Added
- HTML-AUTH-SECURITY-AUDIT.md — independent security audit of HTML auth layer with HIPAA 2026 readiness assessment, 22 findings across critical/high/medium/low, red team attack scenarios, blue team credit, and prioritized remediation roadmap
- README tree entry for HTML-AUTH-SECURITY-AUDIT.md

## [v04.32r] — 2026-03-16 03:24:43 PM EST

### Added
- XSS-EXPLAINER.md — comprehensive explanation of XSS in context of our security tests, Playwright god mode vs real attackers, whether XSS is catastrophic, and why tests mention it as a prerequisite
- README tree updated with all missing test files (tests 05–09, SECURITY-FINDINGS.md, XSS-EXPLAINER.md)

## [v04.31r] — 2026-03-16 03:19:06 PM EST

### Added
- IP format validation on client-reported IP addresses — validates IPv4/IPv6 format and truncates to 45 characters at three layers: host page, GAS inner iframe, and GAS server-side. Prevents log injection via arbitrary strings in the IP field

#### `testauth1.html` — v02.12w

##### Added
- IP address validation before logging — malformed values are now rejected instead of stored as-is

#### `testauth1.gs` — v01.46g

##### Added
- Server-side IP format validation on URL parameter — rejects non-IP strings before audit logging
- Inner iframe IP validation on both XHR response and host postMessage fallback

## [v04.30r] — 2026-03-16 03:14:55 PM EST

### Changed
- Updated SECURITY-FINDINGS.md with comprehensive test 09 results — detailed per-attack breakdown (8/11 blocked, 3 partial), mitigation analysis for monkey-patching, OAuth intercept, and IP spoofing, updated summary table and defense-in-depth weakest links

## [v04.29r] — 2026-03-16 03:07:49 PM EST

### Fixed
- Fixed crash in offensive test 09 (Attack 5) — arrow function used `arguments[0]` which is not available in arrow functions; replaced with named parameter `(gasUrl)`

## [v04.28r] — 2026-03-16 02:54:36 PM EST

### Changed
- "Signing in…" and "Reconnecting…" screens now have distinct animations — spinning ring for sign-in, pulsing dots for reconnection

#### `testauth1.html` — v02.11w

##### Changed
- "Signing in…" uses a spinning ring animation (new session)
- "Reconnecting…" uses pulsing dots animation (session verification)

## [v04.27r] — 2026-03-16 02:50:53 PM EST

### Added
- Spinner animation on "Signing in…" and "Reconnecting…" screens — provides visual feedback while waiting for session setup or verification

#### `testauth1.html` — v02.10w

##### Added
- Spinning loading indicator on the "Signing in…" and "Reconnecting…" screens

## [v04.26r] — 2026-03-16 02:40:38 PM EST

### Changed
- Refactored tab counting from continuous heartbeat (every 3s) to on-demand roll call — zero background overhead, count is only collected when the tab-takeover overlay appears

#### `testauth1.html` — v02.09w

##### Changed
- Tab count now uses on-demand roll call instead of continuous heartbeat — other tabs respond instantly when asked, and the count updates in real time as responses arrive

## [v04.25r] — 2026-03-16 02:33:18 PM EST

### Added
- Tab-takeover overlay now shows how many other tabs have the page open (e.g. "2 other tabs have this page open") — uses zero-cost browser-local BroadcastChannel heartbeat with no server calls

#### `testauth1.html` — v02.08w

##### Added
- Tab count displayed in the "Session Active in Another Tab" overlay when multiple tabs are detected

## [v04.24r] — 2026-03-16 02:22:46 PM EST

### Fixed
- Fixed sign-in page centering after adding reconnecting UI state

### Added
- "Signing in…" screen now appears between selecting your Google account and the app loading — previously the sign-in form stayed visible during this transition

#### `testauth1.html` — v02.07w

##### Fixed
- Restored centering on the sign-in page

##### Added
- Added "Signing in…" intermediate screen during Google authentication

## [v04.23r] — 2026-03-16 02:16:05 PM EST

### Changed
- Sign-in page now shows "Reconnecting… Verifying your session" instead of "Sign In Required" when resuming a valid session on page reload or tab reclaim — reduces confusion about what's happening during session verification

#### `testauth1.html` — v02.06w

##### Changed
- Added "Reconnecting…" visual state during session verification on page reload and tab reclaim

## [v04.22r] — 2026-03-16 02:08:13 PM EST

### Fixed
- Fixed logo not displaying on login page — `img-src` was restricted to `*.googleusercontent.com` only but logos load from `www.shadowaisolutions.com` and `logoipsum.com`
- Added `media-src 'self'` to CSP — `default-src 'none'` was blocking same-origin audio files (splash screen sounds)

#### `testauth1.html` — v02.05w

##### Fixed
- Added logo and placeholder logo domains to `img-src` CSP whitelist
- Added `media-src 'self'` for splash screen sound playback

## [v04.21r] — 2026-03-16 02:02:55 PM EST

### Security
- Hardened CSP with 5 new directives: `default-src 'none'` (deny-all fallback), `worker-src 'none'` (blocks web workers), `manifest-src 'none'` (blocks manifest injection), `upgrade-insecure-requests` (auto-upgrades mixed content), and restricted `img-src` from blanket `https:` to `https://*.googleusercontent.com` (closes image-based exfiltration vector)
- Fixed test 08 eval() misleading message — `unsafe-inline` does NOT implicitly allow eval (they are independent CSP keywords per W3C spec)
- Improved test 08 form-action test to verify actual submission blocking via CSP violation events instead of just checking attribute values
- Removed `navigate-to` from test 08's recommended directives list — dropped from CSP Level 3 spec with zero browser implementation

### Changed
- Updated SECURITY-FINDINGS.md with comprehensive deep-analysis of all 14 test 08 findings (9 CSP audit + 9 attack results), categorized as FIXED, ACCEPTED, or UNFIXABLE

#### `testauth1.html` — v02.04w

##### Security
- Added `default-src 'none'` — deny-all fallback that also blocks eval()
- Added `worker-src 'none'` — prevents web worker abuse
- Added `manifest-src 'none'` — prevents manifest injection
- Added `upgrade-insecure-requests` — auto-upgrades mixed content
- Restricted `img-src` from blanket `https:` to `https://*.googleusercontent.com` only

## [v04.20r] — 2026-03-16 01:47:48 PM EST

### Security
- Added `form-action 'self'` to CSP meta tag on testauth1 — prevents form submissions to attacker-controlled URLs

### Changed
- Updated SECURITY-FINDINGS.md with actual-run results for test 07 (6/6 blocked, including timing oracle confirmation) and test 08 (9/9 blocked, full CSP audit table)
- Upgraded test 08 status from "MOSTLY BLOCKED / Medium" to "BLOCKED / Low" after adding `form-action` directive

#### `testauth1.html` — v02.03w

##### Security
- Added `form-action 'self'` to Content Security Policy — closes the last missing directive identified during offensive security testing

## [v04.19r] — 2026-03-16 01:32:02 PM EST

### Added
- Created `SECURITY-FINDINGS.md` — comprehensive security findings document covering all 9 offensive security tests, known GAS platform limitations, defense-in-depth summary, and DDoS incident response procedure with deployment ID rotation as the primary kill switch
- Added reference to SECURITY-FINDINGS.md in the offensive security test README

## [v04.18r] — 2026-03-16 01:15:13 PM EST

### Fixed
- Fixed test_06 Attack 4 (security event flood): test now correctly recognizes that the global rate limit works by design — GAS returns HTTP 200 even when rate-limited (doesn't leak rate limit status to attackers), and the audit log is capped at 50 events + 1 flood meta-event
- Fixed test_06 Attack 5 (/dev endpoint): now distinguishes between the HTML shell loading (not a vulnerability) and the GAS backend actually responding (would be a vulnerability). The /dev page serves HTML to anyone but the GAS iframe requires editor-level Google auth to execute

## [v04.17r] — 2026-03-16 12:57:47 PM EST

### Security
- Hardened security event endpoint: replaced per-IP rate limit (bypassable via IP rotation) with global rate limit (50 events/5min, IP-independent)
- Added `security_event_flood` meta-event logged when global rate limit is reached

### Fixed
- Fixed false positive `hmac_secret_leak` detection in test_06 — sensitive pattern matching now looks for actual secret value prefixes instead of generic words like "secret"
- Updated test_06 Attack 4 to demonstrate IP rotation bypass and verify global rate limit effectiveness

#### `testauth1.gs` — v01.45g

##### Security
- Replaced per-IP security event rate limit with global rate limit (50/5min) — prevents bypass via clientIp parameter rotation
- Added `security_event_flood` audit log entry when global limit is reached

#### `test_06_deploy_endpoint_abuse.py` — (no version)

##### Fixed
- Removed false positive sensitive pattern detection (no longer flags "secret"/"hmac_secret" as leaked data)
- Rewrote security event flood test: Phase A tests single-IP flooding, Phase B tests IP rotation bypass

## [v04.16r] — 2026-03-16 12:37:32 PM EST

### Added
- 5 new offensive security tests for testauth1 (tests 05–09):
  - `test_05_clickjacking_iframe_embedding.py` — clickjacking, CSP frame-ancestors, framebusting, double-framing, sandbox abuse
  - `test_06_deploy_endpoint_abuse.py` — deploy endpoint probing, POST injection, error disclosure, security event flood, version pinning
  - `test_07_session_race_timing.py` — postMessage flood, BroadcastChannel hijack/DoS, HMAC timing oracle, storage injection, session resurrection
  - `test_08_csp_bypass_resource_injection.py` — full CSP audit, inline/external script injection, data exfiltration, base URI hijack, eval availability
  - `test_09_auth_state_manipulation.py` — DOM auth bypass, fake gas-auth-ok, timer manipulation, function monkey-patching, OAuth interception, version spoofing
- Updated offensive security README with all 9 tests documented

## [v04.15r] — 2026-03-16 12:03:55 PM EST

### Added
- Created `FUTURE-CONSIDERATIONS.md` for deferred architectural ideas (security & quota management at scale) — separate from TODO.md which holds the developer's personal actionable items

### Fixed
- Moved 5 future-scale items out of TODO.md back to their own file — TODO.md is the developer's personal to-do list, not a backlog for architectural considerations

## [v04.14r] — 2026-03-16 11:54:15 AM EST

### Added
- Added 5 future-scale items to TODO.md: IP blocklist, quota usage tracking, email alerting for security events, heartbeat interval tuning, client-side session expiry estimation

## [v04.13r] — 2026-03-16 11:22:57 AM EST

### Changed
- Added mandatory web search verification rule for platform quota/limit/pricing claims to "Validate Before Asserting" in behavioral rules — prevents presenting unverified quota structures as fact (triggered by incorrect assertion that GAS quotas are per-script when they are per-account)

## [v04.12r] — 2026-03-16 10:52:13 AM EST

### Changed
- Security event rate limiter now logs a `security_event_throttled` entry when an IP hits the 20-event limit, giving the defender visibility that further events were suppressed

#### `testauth1.gs` — v01.44g

##### Changed
- Attack report rate limiting now tells you when an attacker was cut off

#### `portal.gs` — v01.03g

##### Changed
- Attack report rate limiting now tells you when an attacker was cut off

## [v04.11r] — 2026-03-16 10:29:43 AM EST

### Added
- Added Security Event Reporter system — client-side defense layers now report blocked attacks (unknown message types, replay attempts, invalid signatures, duplicate session hijacking) to the GAS backend for audit logging
- Server-side security event handler in both testauth1.gs and portal.gs — receives attack telemetry via hidden iframe beacons, rate-limited to 20 events per 5-minute window per IP/event type, logged to SessionAuditLog sheet

### Security
- Added first-write-wins guard on `_messageKey` in portal.html — prevents message key overwriting attacks (was already present in testauth1.html)

#### `testauth1.html` — v02.02w

##### Added
- Blocked attacks are now reported to the server for security monitoring

#### `portal.html` — v01.11w

##### Added
- Blocked attacks are now reported to the server for security monitoring
- Additional protection against session key overwriting attacks

#### `testauth1.gs` — v01.43g

##### Added
- Server now receives and logs blocked attack reports from the page

#### `portal.gs` — v01.02g

##### Added
- Server now receives and logs blocked attack reports from the page

## [v04.10r] — 2026-03-16 10:07:13 AM EST

### Fixed
- Fixed false positive in offensive test_04 Attack 3 (GAS endpoint probing) — test was matching the word `sessionToken` in GAS app's JavaScript source code, not actual token issuance. Now checks for JSON-structured real token responses instead

## [v04.09r] — 2026-03-16 09:57:31 AM EST

### Security
- Fixed session fixation attack via storage injection — page-load resume now defers `showApp()` until `gas-auth-ok` confirms the stored token is valid server-side, preventing an attacker who injects a forged token into storage from bypassing the auth wall on reload
- Fixed duplicate `gas-session-created` message overwriting legitimate session data — second `gas-session-created` with a different `messageKey` is now rejected entirely (first-write-wins on both key and session data)
- Fixed cross-tab storage sync calling `showApp()` directly — login sync via `storage` event now defers to `gas-auth-ok` like all other auth paths

#### `testauth1.html` — v02.01w

##### Security
- Sign-in screen now stays visible during page reload until the server re-confirms your session is valid
- A second sign-in attempt from an untrusted source is now rejected entirely instead of overwriting your session

#### `portal.html` — v01.10w

##### Security
- Sign-in screen now stays visible during page reload until the server re-confirms your session is valid
- A second sign-in attempt from an untrusted source is now rejected entirely instead of overwriting your session

## [v04.08r] — 2026-03-16 09:43:13 AM EST

### Security
- Fixed client-side auth wall bypass via forged `gas-session-created` postMessage — auth wall now stays visible until `gas-auth-ok` confirms the session is valid server-side. Previously, a forged `gas-session-created` message could hide the auth wall before the GAS backend validated the token

### Fixed
- Fixed all offensive security tests using wrong storage key names (`testauth1_session`/`testauth1_email` instead of `gas_session_token`/`gas_user_email`) — diagnostics were showing `None` for storage values that were actually present

#### `testauth1.html` — v02.00w

##### Security
- Deferred `showApp()` from `gas-session-created` handler to `gas-auth-ok` handler — auth wall only hides after GAS backend confirms session validity, preventing forged postMessage bypass

#### `portal.html` — v01.09w

##### Security
- Same `showApp()` deferral fix as testauth1 — auth wall stays up until `gas-auth-ok` confirms

## [v04.07r] — 2026-03-16 09:31:35 AM EST

### Changed
- Added full diagnostic output to all attack types in test 02 (session forgery) — Attack 1 (storage injection) now shows auth wall state, display, app visibility, stored session/email; Attack 2 (forged gas-session-created) now shows full auth wall diagnostics, iframe src, and notes GAS-side validation as real defense; Attack 3 (messageKey overwrite) now shows auth wall state and key ownership evidence
- Added full diagnostic output to all attack types in test 03 (message type injection) — Attack 1 (prototype pollution) now shows proto properties, auth wall state; Attack 2 (DoS sign-out) now shows auth wall state, session/email, messageKey status; Attack 3 (state machine confusion) now shows full auth wall and session diagnostics for both sub-tests; Attack 4 (type coercion) now shows auth wall and session state instead of assuming silent drop
- Added full diagnostic output to all attack types in test 04 (CSRF/token replay) — Attack 1 (fake OAuth) now shows full auth wall diagnostics; Attack 2 (nonce bypass) now shows auth wall and session state; Attack 3 (GAS probing) now shows response body preview and detection flags; Attack 4 (URL leakage) now shows location, session state, and cookies

## [v04.06r] — 2026-03-16 09:23:01 AM EST

### Changed
- Added full diagnostic output to all 4 attack types in offensive security test 01 — Attack 3 (raw XSS strings) now checks for XSS execution, session storage, and navigation hijack; Attack 4 (signature bypass) now shows auth wall state, session storage, and email diagnostics. All attacks now prove their BLOCKED results with visible evidence instead of assuming success

## [v04.05r] — 2026-03-16 09:15:52 AM EST

### Changed
- Added full diagnostic output to test 01 Attack 2 instead of silencing failures — each bypassed attack now prints `location.href`, auth wall state, stored session/email, and all check results so the actual behavior is visible and can be evaluated honestly

## [v04.04r] — 2026-03-16 09:11:26 AM EST

### Fixed
- Fixed second false positive in test 01 Attack 2 — redirect hijack detection was using `page.url` (Playwright) which reflects iframe navigations, not just top-level. Replaced with `window.location.href` (JavaScript) to check only the main page origin. The `gas-session-created` handler legitimately reloads the GAS iframe (`gasApp.src = ...`), which is normal behavior, not an attack

## [v04.03r] — 2026-03-16 09:05:59 AM EST

### Fixed
- Fixed false positives in offensive security test 01 (Attack 2: XSS in known message fields) — test was detecting the page's own pre-existing inline scripts as "injected" because it searched all `<script>` elements for "alert". Replaced with precise detection: baseline script count comparison, alert/prompt/confirm override traps, innerHTML inspection of rendered elements, and navigation hijack check. Tests now correctly report BLOCKED when values land in safe sinks (`.textContent`, `setItem()`)

## [v04.02r] — 2026-03-16 08:47:20 AM EST

### Added
- Offensive security test suite (`tests/offensive-security/`) with 4 standalone Playwright-based attack scripts targeting testauth1 auth system
  - Test 01: XSS via postMessage injection (unknown types, poisoned fields, raw payloads, signature bypass)
  - Test 02: Session token forgery & fixation (storage injection, forged gas-session-created, messageKey overwrite race)
  - Test 03: Message type spoofing & protocol confusion (prototype pollution, DoS via forced sign-out, state machine confusion, type coercion)
  - Test 04: OAuth token replay & CSRF (fabricated tokens, nonce bypass, direct GAS endpoint probing, token leakage check)

## [v04.01r] — 2026-03-15 10:29:39 PM EST — [SHA unavailable]

### Security
- SessionAuditLog sheet now gets the same tamper-resistant protection as DataAuditLog when auto-created

#### `testauth1.gs` — v01.42g

##### Security
- Added `sheet.protect()` with warning-only mode to `_writeAuditLogEntry()` for parity with DataAuditLog sheet protection

## [v04.00r] — 2026-03-15 10:24:53 PM EST — [SHA unavailable]

### Changed
- Renamed session audit log spreadsheet tab from `AuditLog` to `SessionAuditLog` for clarity alongside the existing `DataAuditLog` tab

#### `testauth1.gs` — v01.41g

##### Changed
- `AUDIT_LOG_SHEET_NAME` renamed from `AuditLog` to `SessionAuditLog` in both standard and hipaa presets

## [v03.99r] — 2026-03-15 10:21:09 PM EST — [SHA unavailable]

### Added
- Each saved patient note now receives a unique resource ID (UUID) in the Data Audit Log, enabling individual record tracing

#### `testauth1.gs` — v01.40g

##### Added
- `saveNote()` generates a UUID via `Utilities.getUuid()` and passes it as `resourceId` to the data audit log

## [v03.98r] — 2026-03-15 10:15:14 PM EST — [SHA unavailable]

### Security
- Session token in Data Audit Log Details JSON column is now truncated to 8 characters (was previously full token) to prevent token theft from audit spreadsheets

#### `testauth1.gs` — v01.39g

##### Security
- Session ID truncated in Details JSON to match SessionId column truncation, with undo comment for easy reversal

## [v03.97r] — 2026-03-15 10:07:11 PM EST — [SHA unavailable]

### Fixed
- Fixed client IP still blank — added direct XHR fetch (`XMLHttpRequest` to `api.ipify.org`) inside GAS iframe as primary method, with host-page postMessage as fallback. Previous approach relied solely on cross-frame postMessage which may not reach nested Google wrapper iframes

#### `testauth1.gs` — v01.38g

##### Fixed
- Client IP now fetched directly via `XMLHttpRequest` in GAS iframe (dual-path: XHR primary, host postMessage fallback)

## [v03.96r] — 2026-03-15 09:59:28 PM EST — [SHA unavailable]

### Fixed
- Fixed client IP always blank in audit logs — moved IP fetch from GAS iframe (blocked by sandbox CSP) to host page, then forwarded to GAS iframe via `host-client-ip` postMessage
- Added `api.ipify.org` to host page CSP `connect-src` directive
- `saveNote()` now receives `clientIp` directly as a parameter from the GAS iframe, with fallback to session-stored IP from heartbeat

#### `testauth1.gs` — v01.37g

##### Fixed
- Client IP now reliably reaches audit logs — `saveNote()` accepts `clientIp` as direct parameter instead of relying on heartbeat round-trip
- Removed `api.ipify.org` fetch from GAS iframe (sandbox blocks it), replaced with `host-client-ip` postMessage listener

#### `testauth1.html` — v01.99w

##### Fixed
- Client IP fetch moved to host page level where CSP allows it
- IP forwarded to GAS iframe via `host-client-ip` postMessage on `gas-auth-ok`

## [v03.95r] — 2026-03-15 09:38:50 PM EST — [SHA unavailable]

### Added
- EMR Security Hardening Phase 7: IP logging — client IP fetched via `api.ipify.org` in GAS iframe, passed through heartbeat URL, stored in session data, and included in audit log entries for post-incident investigation (HIPAA § 164.312(d))
- EMR Security Hardening Phase 8: Data-level audit logging — `dataAuditLog()` function writes per-operation HIPAA audit records (who, what, when, which record) to a dedicated `DataAuditLog` sheet with auto-creation and sheet protection (HIPAA § 164.312(b))
- `ENABLE_IP_LOGGING` toggle in both GAS presets — `false` (standard) skips IP fetch, `true` (HIPAA) enables client IP collection and audit trail
- `ENABLE_DATA_AUDIT_LOG` and `DATA_AUDIT_LOG_SHEET_NAME` toggles in both GAS presets — `false` (standard) skips per-operation logging, `true` (HIPAA) logs every data read/write to a separate audit sheet
- `ENABLE_IP_LOGGING` toggle in HTML_CONFIG — controls whether client IP is captured and forwarded in heartbeat requests

#### `testauth1.gs` — v01.36g

##### Added
- Client IP fetch via `api.ipify.org` in GAS iframe authenticated HTML (toggle-gated by `ENABLE_IP_LOGGING`)
- Client IP included in `gas-user-activity` postMessage to host page
- Client IP stored in session data during heartbeat for data operation correlation
- Client IP included in heartbeat audit log entries (session expiry events)
- `dataAuditLog()` function with auto-creating `DataAuditLog` sheet, sheet protection, and HIPAA-required columns (Timestamp, User, Action, ResourceType, ResourceId, Details, SessionId, IsEmergencyAccess)
- `saveNote()` now calls `dataAuditLog()` for per-operation audit trail
- `validateSessionForData()` now returns `clientIp` and `isEmergencyAccess` for downstream audit logging

#### `testauth1.html` — v01.98w

##### Added
- `ENABLE_IP_LOGGING` toggle in HTML_CONFIG
- `_clientIp` variable captures client IP from GAS iframe `gas-user-activity` messages
- Client IP forwarded in heartbeat URL as `clientIp` parameter

## [v03.94r] — 2026-03-15 09:27:39 PM EST — [SHA unavailable]

### Added
- Plan 11: EMR GAS Application Layer Plan — HIPAA data access and business logic covering RBAC, minimum necessary access, input validation, PHI segmentation, data retention, consent tracking, and disclosure logging

## [v03.93r] — 2026-03-15 08:44:53 PM EST — [SHA unavailable]

### Added
- EMR Security Hardening Phase 4: DOM clearing on session expiry — GAS iframe destroyed (`about:blank`) when session expires to prevent PHI exposure via DevTools (HIPAA § 164.312(a)(2)(iii), § 164.312(c)(1))
- EMR Security Hardening Phase 6: Escalating account lockout — three-tier system (5min → 30min → 6hr) replacing flat 5-failure rate limit (HIPAA § 164.312(d), NIST SP 800-63B § 5.2.2)
- `ENABLE_DOM_CLEARING_ON_EXPIRY` toggle in both GAS presets and HTML_CONFIG — `false` (standard) preserves overlay-only behavior, `true` (HIPAA) destroys iframe content
- `ENABLE_ESCALATING_LOCKOUT` toggle in both GAS presets — `false` (standard) preserves flat 5/5min rate limit, `true` (HIPAA) enables tiered lockout
- Client-side error messages for `account_locked` and `rate_limited` login failures

#### `testauth1.html` — v01.97w

##### Added
- DOM clearing on session expiry — GAS iframe replaced with `about:blank` to destroy any patient data in the DOM
- GAS iframe auto-reload on re-authentication after DOM clearing
- User-facing error messages for account lockout and rate limiting

#### `testauth1.gs` — v01.35g

##### Added
- `ENABLE_DOM_CLEARING_ON_EXPIRY` toggle in standard (`false`) and HIPAA (`true`) presets
- `ENABLE_ESCALATING_LOCKOUT` toggle in standard (`false`) and HIPAA (`true`) presets
- Escalating lockout: Tier 1 (5 failures/5min), Tier 2 (10 failures/30min), Tier 3 (20 failures/6hr)
- Dynamic lockout TTL computation for rate limit counter persistence

## [v03.92r] — 2026-03-15 08:28:17 PM EST — [SHA unavailable]

### Fixed
- Fixed false "Session expiring soon" warning after "Use Here" tab reclaim — the `gas-auth-ok` handler's `needsReauth` check now correctly skips when `_directSessionLoad` was active (server-side session may be near expiry, but the client just reset its rolling timer and the next heartbeat will extend it)

#### `testauth1.html` — v01.96w

##### Fixed
- "Session expiring soon" warning no longer appears incorrectly after reclaiming a session with "Use Here"

## [v03.91r] — 2026-03-15 08:12:32 PM EST — [SHA unavailable]

### Fixed
- Fixed absolute session timer resetting on "Use Here" — `stopCountdownTimers()` in the `tab-claim` handler was clearing `ABSOLUTE_START_KEY` from sessionStorage; the key is now preserved across the stop/start cycle so the absolute timer continues from the original sign-in

#### `testauth1.html` — v01.95w

##### Fixed
- Reclaiming a session with "Use Here" now correctly preserves the absolute session timer countdown

## [v03.90r] — 2026-03-15 08:07:39 PM EST — [SHA unavailable]

### Fixed
- Fixed GAS iframe not reappearing after "Use Here" — the visibility restore was in the `gas-session-created` handler but GAS sends `gas-auth-ok` for valid session reloads; moved the `_directSessionLoad` visibility restore and deferred `showApp()`/timer start to the `gas-auth-ok` handler

#### `testauth1.html` — v01.94w

##### Fixed
- GAS app now properly reappears after clicking "Use Here" — the app UI and timers are activated once the GAS server confirms the session is valid

## [v03.89r] — 2026-03-15 08:03:31 PM EST — [SHA unavailable]

### Fixed
- "Use Here" tab reclaim no longer resets the absolute session timer — the absolute timer now continues from the original sign-in time instead of restarting, preventing indefinite session extension via tab switching

#### `testauth1.html` — v01.93w

##### Fixed
- Reclaiming a session with "Use Here" no longer resets the absolute session timer — the timer continues from when you originally signed in

## [v03.88r] — 2026-03-15 07:59:08 PM EST — [SHA unavailable]

### Fixed
- Eliminated GAS iframe flicker when clicking "Use Here" — the iframe is now hidden during reload and revealed only after `gas-session-created` confirms the GAS app is ready, and the unnecessary double-reload (from the OAuth token-exchange path) is skipped when the iframe was loaded directly with a session token

#### `testauth1.html` — v01.92w

##### Fixed
- Clicking "Use Here" no longer causes a brief GAS iframe flicker — the app appears smoothly after the session is confirmed

## [v03.87r] — 2026-03-15 07:51:52 PM EST — [SHA unavailable]

### Fixed
- Same-browser "Use Here" button now transfers the valid session token from the claiming tab to the surrendering tab via BroadcastChannel — previously the surrendering tab's sessionStorage had a stale token, causing a brief app flash followed by "Session expired" when reclaiming

#### `testauth1.html` — v01.91w

##### Fixed
- Clicking "Use Here" on a tab that was displaced by another tab's sign-in now seamlessly reclaims the session instead of briefly showing the app then signing you out

## [v03.86r] — 2026-03-15 07:40:16 PM EST — [SHA unavailable]

### Changed
- GAS iframe user activity now updates the heartbeat activity timestamp instead of forcing an immediate heartbeat — the regular interval tick and urgent <30s heartbeat handle session extension, eliminating unnecessary server requests during normal interaction

#### `testauth1.html` — v01.90w

##### Changed
- Interacting with the app (typing, clicking) no longer forces an immediate heartbeat — activity is tracked and the regular heartbeat cycle handles session extension naturally

## [v03.85r] — 2026-03-15 07:29:52 PM EST — [SHA unavailable]

### Fixed
- Activity-triggered heartbeats now respect a cooldown (half the heartbeat interval) to prevent flooding the server with requests on every user interaction — previously every GAS iframe action triggered an immediate heartbeat every 5 seconds
- Heartbeat requests now auto-clear after 15 seconds if the server response never arrives, preventing the heartbeat from getting permanently stuck on "sending..."

#### `testauth1.html` — v01.89w

##### Fixed
- Interacting with the app no longer causes constant "sending..." in the heartbeat display — heartbeats are now rate-limited to once per 15 seconds during active use
- Heartbeat can no longer get permanently stuck on "sending..." if a server response is lost

## [v03.84r] — 2026-03-15 06:58:02 PM EST — [SHA unavailable]

### Fixed
- Fixed blank GAS iframe when clicking "Use Here" on a non-original tab — the `_expectingSession` guard was incorrectly suppressing the `gas-needs-auth` response from an invalidated session token, leaving the app visible with no GAS content and eventually re-triggering the "Session Active Elsewhere" overlay

#### `testauth1.html` — v01.88w

##### Fixed
- Clicking "Use Here" on a tab whose server session was invalidated (by signing in on another tab) now properly shows the sign-in screen instead of a blank GAS iframe

## [v03.83r] — 2026-03-15 06:46:09 PM EST — [SHA unavailable]

### Added
- EMR Security Hardening Phase 3: Server-side data operation validation — every `google.script.run` data function now validates the session before executing
- New `ENABLE_DATA_OP_VALIDATION` toggle in both presets (off for standard, on for HIPAA)
- New `validateSessionForData()` gate function with HMAC verification, absolute/rolling timeout checks, and eviction detection
- New server-side `saveNote()` function using the session gate (replaces client-side simulation)
- New `gas-session-invalid` postMessage type for data operation session failures
- Session token now embedded in authenticated app HTML for `google.script.run` calls

#### `testauth1.gs` — v01.34g

##### Added
- `ENABLE_DATA_OP_VALIDATION` config toggle — gates server-side session re-validation on data operations
- `validateSessionForData()` — session gate function that validates token, HMAC, and timeouts before any data access
- `saveNote()` — server-side data operation with session validation and audit logging

##### Changed
- Save Note button now calls server-side `saveNote()` via `google.script.run` instead of client-side simulation

#### `testauth1.html` — v01.87w

##### Added
- `gas-session-invalid` message type in whitelist and handler — triggers auth wall with specific reason when a data operation detects an invalid session

## [v03.82r] — 2026-03-15 06:35:54 PM EST — [SHA unavailable]

### Changed
- Sign-in error messages now surface specific misconfiguration details instead of generic "Access denied" — HMAC secret missing, domain restriction misconfigured, and domain not allowed each show distinct setup instructions

#### `testauth1.gs` — v01.33g

##### Changed
- URL and postMessage token exchange error handlers now detect HMAC-specific errors and pass `hmac_secret_missing` error code instead of generic `server_error`

#### `testauth1.html` — v01.86w

##### Changed
- Auth wall now shows specific setup instructions for `hmac_secret_missing`, `domain_not_configured`, and `domain_not_allowed` errors instead of generic "Access denied"

## [v03.81r] — 2026-03-15 06:26:01 PM EST — [SHA unavailable]

### Changed
- Implemented EMR Security Hardening Phase 1: HMAC secret enforcement — `generateSessionHmac()` now throws when HMAC is enabled but secret is missing (fail-closed), `verifySessionHmac()` returns false instead of passing through
- Implemented EMR Security Hardening Phase 2: Domain restriction validation — empty allowlist with `ENABLE_DOMAIN_RESTRICTION: true` now returns `domain_not_configured` error with security alert audit log instead of silently rejecting all domains

#### `testauth1.gs` — v01.32g

##### Changed
- HMAC generation now fails closed when secret is missing — throws error with setup instructions instead of silently returning empty string
- HMAC verification now fails closed when secret is missing — rejects sessions instead of passing through
- Domain restriction check now explicitly validates non-empty allowlist before iterating — distinguishes misconfiguration from domain rejection

## [v03.80r] — 2026-03-15 06:17:29 PM EST — [SHA unavailable]

### Changed
- Added "Implementation Risk Areas (Toggle Architecture)" section to EMR security hardening plan — documents three specific integration risks (Phase 3 stub return value, Phase 4 server/client config boundary, Phase 6 branching flow control) with concrete mitigations for each

## [v03.79r] — 2026-03-15 06:04:51 PM EST — [SHA unavailable]

### Changed
- Updated EMR security hardening plan (`10-EMR-SECURITY-HARDENING-PLAN.md`) to be fully preset-aware — all 8 phases now explicitly document behavior under both `standard` and `hipaa` presets
- Added Preset Behavior Matrix showing each phase's toggle, preset values, and standard-mode behavior
- Added preset transition rules (standard→hipaa, hipaa→standard, PROJECT_OVERRIDES interaction)
- Added 5 new config toggles with explicit values for both presets: `ENABLE_DATA_OP_VALIDATION`, `ENABLE_DOM_CLEARING_ON_EXPIRY`, `ENABLE_ESCALATING_LOCKOUT`, `ENABLE_IP_LOGGING`, `ENABLE_DATA_AUDIT_LOG`
- Updated "What Changed Since Plan 9.2" table with Standard Preset column
- Added toggle guards to code examples: `validateSessionForData()`, `showAuthWall()` DOM clearing, escalating lockout, IP fetch, data audit log

## [v03.78r] — 2026-03-15 05:47:26 PM EST — [SHA unavailable]

### Changed
- Rotated 86 CHANGELOG sections (v03.64r–v02.69r, dates 2026-03-14 and 2026-03-13) to CHANGELOG-archive.md — keeping only today's 13 sections in the main file
- SHA-enriched 18 section headers with commit links (v03.47r–v03.64r); 68 older sections moved as-is due to shallow git history

## [v03.77r] — 2026-03-15 05:40:03 PM EST — [SHA unavailable]

### Changed
- Renamed all plan files from single-digit prefixes (1- through 9.2-) to zero-padded prefixes (01- through 09.2-) for correct alphabetical sorting on GitHub — 10-EMR plan now appears last as intended
- Updated all cross-references across 20+ files (plan files, README tree, CHANGELOG, CHANGELOG-archive, SESSION-CONTEXT, MICROSOFT-AUTH-PLAN)

## [v03.76r] — 2026-03-15 05:33:32 PM EST — [SHA unavailable]

### Added
- Comprehensive EMR security hardening plan (`10-EMR-SECURITY-HARDENING-PLAN.md`) covering 8 implementation phases across P0–P3 priorities for HIPAA Technical Safeguards compliance
- Plan includes: HMAC fail-closed enforcement, domain restriction validation, server-side data operation session gates, DOM clearing on session expiry, emergency/break-glass access, escalating account lockout, IP audit logging, and data-level audit logging
- Architecture principle documented: patient data (PHI) exclusively on GAS/Google Sheets side (BAA-covered), never in browser storage or CacheService
- CacheService usage guide, quota impact analysis, edge cases, and EMR deployment configuration checklist

## [v03.75r] — 2026-03-15 03:36:50 PM EST — [SHA unavailable]

### Added
- GAS iframe activity detection: user interactions (typing, clicking) now trigger an immediate heartbeat on the host page, catching expired sessions before data loss
- "Save Note" test button in GAS UI for simulating EMR data entry with session validation

#### `testauth1.html` — v01.85w

##### Added
- `gas-user-activity` message handler that triggers immediate heartbeat when user interacts with GAS iframe content

#### `testauth1.gs` — v01.31g

##### Added
- Activity detection listeners (keydown, click, input) that post `gas-user-activity` to the host page with 5-second debounce
- "Save Note" test button simulating EMR data entry — triggers session check before confirming save

## [v03.74r] — 2026-03-15 01:22:15 PM EST — [SHA unavailable]

### Added
- Added "Force Heartbeat" button for on-demand session validity testing without waiting for the automatic heartbeat interval

#### `testauth1.html` — v01.84w

##### Added
- "Force Heartbeat" button for testing session validity on demand without waiting for the automatic heartbeat interval

## [v03.73r] — 2026-03-15 12:44:45 PM EST — [SHA unavailable]

### Added
- Implemented Phase 9 of cross-device session enforcement (Plan 9.2): 4 security tests validating cross-device config toggle, eviction state variable, heartbeat reason code processing, and overlay text reset behavior

#### `testauth1.html` — v01.83w

##### Added
- 4 security tests for cross-device enforcement: config toggle validation, state variable check, heartbeat reason code processing, and overlay text reset verification (tests 39–42, total now 42)

## [v03.72r] — 2026-03-15 12:39:33 PM EST — [SHA unavailable]

### Added
- Implemented Phases 4–7 of cross-device session enforcement (Plan 9.2): client-side handling of eviction reason codes in `testauth1.html` — cross-device eviction shows "Session Active Elsewhere" overlay with "Sign In Here" button, same-browser tab claims show original overlay text, and "Use Here" button correctly routes to auth wall for cross-device eviction vs session reclaim for same-browser

#### `testauth1.html` — v01.82w

##### Added
- Cross-device session detection: when another device signs in, a "Session Active Elsewhere" overlay appears with a "Sign In Here" button
- `CROSS_DEVICE_ENFORCEMENT` toggle in page configuration
- Overlay text automatically resets when switching between cross-device and same-browser session conflicts

## [v03.71r] — 2026-03-15 12:35:33 PM EST — [SHA unavailable]

### Added
- Implemented Phase 3 of cross-device session enforcement (Plan 9.2): `ENABLE_CROSS_DEVICE_ENFORCEMENT` toggle added to both `standard` and `hipaa` AUTH_CONFIG presets, gating tombstone writes in `invalidateAllSessions()`

#### `testauth1.gs` — v01.30g

##### Added
- `ENABLE_CROSS_DEVICE_ENFORCEMENT` configuration toggle in both auth presets — controls whether eviction tombstones are written during session invalidation

## [v03.70r] — 2026-03-15 12:31:39 PM EST — [SHA unavailable]

### Added
- Implemented Phase 2 of cross-device session enforcement (Plan 9.2): heartbeat handler now checks for eviction tombstone when session is missing and includes a `reason` field in `gas-heartbeat-expired` responses (`new_sign_in`, `timeout`, `corrupt_session`, `integrity_violation`, `absolute_timeout`)

### Security
- All `gas-heartbeat-expired` postMessage responses are now HMAC-signed (Phase 8) — previously only `gas-heartbeat-ok` was signed, allowing potential injection of fake expiration messages

#### `testauth1.gs` — v01.29g

##### Added
- Heartbeat expired responses now include a reason code indicating why the session ended
- Eviction tombstone lookup: heartbeat checks for `evicted_TOKEN` cache entry when session is missing

##### Security
- All session expiration notifications are now cryptographically signed to prevent message injection

## [v03.69r] — 2026-03-15 12:23:04 PM EST — [SHA unavailable]

### Added
- Implemented Phase 1 of cross-device session enforcement (Plan 9.2): eviction tombstone in `invalidateAllSessions()` — when a new device signs in, a short-lived `evicted_TOKEN` cache entry is written for each invalidated session so the heartbeat handler can distinguish cross-device eviction from natural timeout

#### `testauth1.gs` — v01.28g

##### Added
- Eviction tombstone mechanism: `cache.put("evicted_" + token, "new_sign_in", 300)` writes a 5-minute tombstone for each invalidated session during sign-in, enabling future heartbeat reason code differentiation

## [v03.68r] — 2026-03-15 01:50:59 AM EST — [SHA unavailable]

### Added
- Added heartbeat piggyback plan (`09.2-CROSS-DEVICE-SESSION-ENFORCEMENT-HEARTBEAT-PLAN.md`) — cross-device session enforcement by enhancing the existing heartbeat with eviction tombstones and reason codes, requiring zero new polling loops, zero new server functions, and ~60 lines of code vs ~200-300 in previous plans

## [v03.67r] — 2026-03-15 01:12:08 AM EST — [SHA unavailable]

### Added
- Added Drive file approach plan (`09.1.1-CROSS-DEVICE-SESSION-ENFORCEMENT-DRIVE-PLAN.md`) — alternative cross-device enforcement using public Google Drive beacon file polled via `<script>` tag injection, achieving zero server polling cost with documented tradeoffs (CDN caching unpredictability, XSS attack surface)

## [v03.66r] — 2026-03-15 12:41:10 AM EST — [SHA unavailable]

### Added
- Added revised cross-device session enforcement plan (`09.1-CROSS-DEVICE-SESSION-ENFORCEMENT-REVISED-PLAN.md`) — replaces `doGet(?check=)` polling with `google.script.run` internal RPC channel, eliminating 30x `doGet` overhead while maintaining the same detection speed and improving eviction message security (signed vs unsigned)

## [v03.65r] — 2026-03-15 12:06:26 AM EST — [SHA unavailable]

### Added
- Added cross-device single-session enforcement plan (`09-CROSS-DEVICE-SESSION-ENFORCEMENT-PLAN.md`) — 6-phase implementation covering GAS session check endpoint, client-side short polling, lifecycle wiring, and security considerations
## [v03.64r] — 2026-03-14 11:31:37 PM EST — [272faf6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/272faf69c1b430946561e376538ed6f16250e2c8)

### Changed
- Enabled single-tab enforcement on testauth1 (`SINGLE_TAB_ENFORCEMENT` toggled from `false` to `true`)

#### `testauth1.html` — v01.81w

##### Changed
- Enabled single-tab enforcement — only one browser tab can be active at a time

## [v03.63r] — 2026-03-14 11:28:52 PM EST — [945e1df](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/945e1df49343ff090345ed1c2f41de1e81d08228)

### Added
- Added single-tab enforcement feature (toggleable via `SINGLE_TAB_ENFORCEMENT` in HTML_CONFIG, default off) — when enabled, only one browser tab can be active at a time per session

#### `testauth1.html` — v01.80w

##### Added
- Single-tab enforcement with "Session Active Elsewhere" overlay and "Use Here" button to reclaim the session from another tab (off by default, toggle `SINGLE_TAB_ENFORCEMENT` to enable)

## [v03.62r] — 2026-03-14 11:05:05 PM EST — [79ab09f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/79ab09f98ef1d3303d39a077d71b0716285f8a17)

### Changed
- Session warning banner now appears at 30 seconds remaining instead of 60, matching the urgent heartbeat threshold so user interaction actually extends the session

#### `testauth1.html` — v01.79w

##### Changed
- Session expiry banner triggers at 30 seconds remaining to match when the urgent heartbeat is active

## [v03.61r] — 2026-03-14 10:50:11 PM EST — [af6b706](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/af6b70606188ee058c03449f1ea8c1d16714c8d3)

### Changed
- Warning banners now show live countdown timers that update every second

#### `testauth1.html` — v01.78w

##### Changed
- Session and absolute expiry warning banners now display a live countdown showing time remaining

## [v03.60r] — 2026-03-14 10:39:09 PM EST — [ffeca36](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ffeca3606c2c5a0771e781ccaac6146cd7428184)

### Fixed
- Fixed GAS iframe not reloading after re-authentication — HMAC message key from the previous session was blocking the new session's signed messages, causing the app to appear unloaded after clicking Sign In

#### `testauth1.html` — v01.77w

##### Fixed
- Re-authentication now properly resets the message verification key so the new session's messages are accepted and the app reloads correctly

## [v03.59r] — 2026-03-14 10:25:03 PM EST — [97402e6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/97402e6b4a60017954645b2e67907c6210fe1c96)

### Fixed
- Fixed re-auth race condition where clicking the Sign In button on the absolute warning banner triggered OAuth but did not reload the GAS iframe or reset countdown timers afterward

#### `testauth1.html` — v01.76w

##### Fixed
- Clicking "Sign In" on the session expiry banner now properly reloads the app and resets all timers after re-authentication
- Countdown timers and heartbeat are stopped before starting the OAuth flow so they cannot trigger sign-out mid-authentication

## [v03.58r] — 2026-03-14 10:16:16 PM EST — [5f789ec](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5f789ecf2c9055ea159bdbde79a13133a85ff211)

### Changed
- Documented efficient SHA lookup approach for page/GAS changelog archive rotation — use the repo version cross-reference in section headers instead of trying to match page versions to commits
- Added batch optimization tip: run `git log` once and match in-memory instead of N separate calls

## [v03.57r] — 2026-03-14 10:06:00 PM EST — [24d6371](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/24d6371d9d2c9546b4c6444bdc24c077c19729c9)

### Changed
- Split single reauth banner into separate session and absolute expiry warning banners with distinct messaging and behavior
- Session warning banner now prompts user to interact with the page (no sign-in button) instead of asking to re-authenticate
- Absolute expiry warning banner shows sign-in button only when the hard session ceiling is about to expire
- Warning banners now appear below the sign-out pill instead of overlapping it at the top of the page
- Both banners stack dynamically when both are active so they never overlap each other

#### `testauth1.html` — v01.75w

##### Changed
- Session expiry warning now says "interact with the page to stay signed in" instead of prompting to sign in again
- Absolute session expiry now shows its own warning banner with a sign-in button when time is nearly up
- Warning banners appear below the user info pill instead of across the top of the page
- Both banners stack neatly when both are visible at the same time

## [v03.56r] — 2026-03-14 09:30:14 PM EST — [e4a746f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e4a746f5064c235d1f24a4b1162e7be71d70ca5b)

### Fixed
- Fixed AudioContext console warning — sound context is now created on first user gesture instead of at page load, eliminating Chrome's autoplay policy warning

#### `testauth1.html` — v01.74w

##### Fixed
- Sound system no longer triggers a console warning on page load

## [v03.55r] — 2026-03-14 09:18:31 PM EST — [d5137fe](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d5137feb9cc4426282c849aeb78ff4ee441d305a)

### Fixed
- Fixed accessibility issue in testauth1 GAS script — `<label>` element now properly associated with heartbeat test input via `for` attribute

#### `testauth1.gs` — v01.27g

##### Fixed
- Associated label with heartbeat test input field — resolves browser accessibility warning

## [v03.54r] — 2026-03-14 08:59:29 PM EST — [aaa6be3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/aaa6be3e29bd078812e52781ba28ca69e59bac16)

### Changed
- Replaced inline SVG data URI favicon with a file-based `favicon.ico` placeholder in `live-site-pages/` — swap the file to use your own icon

#### `index.html` — v01.05w

##### Changed
- Favicon now loads from file instead of inline data

#### `portal.html` — v01.08w

##### Changed
- Favicon now loads from file instead of inline data

#### `testauth1.html` — v01.73w

##### Changed
- Favicon now loads from file instead of inline data

#### `gas-project-creator.html` — v01.12w

##### Changed
- Favicon now loads from file instead of inline data

#### `testenvironment.html` — v01.05w

##### Changed
- Favicon now loads from file instead of inline data

## [v03.53r] — 2026-03-14 08:53:11 PM EST — [f65899b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/f65899bffbdda9141b05a51e5a641e29dd6770ad)

### Added
- Added inline SVG placeholder favicon to all pages and templates — stops browser 404 error for `/favicon.ico`

#### `index.html` — v01.04w

##### Added
- Added placeholder favicon — no more missing icon in browser tab

#### `portal.html` — v01.07w

##### Added
- Added placeholder favicon — no more missing icon in browser tab

#### `testauth1.html` — v01.72w

##### Added
- Added placeholder favicon — no more missing icon in browser tab

#### `gas-project-creator.html` — v01.11w

##### Added
- Added placeholder favicon — no more missing icon in browser tab

#### `testenvironment.html` — v01.04w

##### Added
- Added placeholder favicon — no more missing icon in browser tab

## [v03.52r] — 2026-03-14 08:45:29 PM EST — [2c20019](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/2c20019894d20124cd431f8fffbec97c1e925378)

### Fixed
- Fixed noisy console warning "Unexpected token response — no pending sign-in" caused by GIS automatic token renewal callbacks — downgraded to debug-level log

#### `testauth1.html` — v01.71w

##### Fixed
- Fixed console warning appearing during normal sign-in flow when Google's identity services fires automatic token callbacks

## [v03.51r] — 2026-03-14 08:33:42 PM EST — [14beadf](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/14beadf8cb3f737bbc9d023861c4be5325020208)

### Added
- Added "Test Quality — No Fake or Trivial Tests" rule to html-pages rules — codifies that all tests must verify real behavior, bans variable-assignment and existence-only checks

## [v03.50r] — 2026-03-14 08:31:03 PM EST — [4f1aec7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/4f1aec790134165ffcda465422a139ac185d9f95)

### Changed
- Removed 27 fake/trivial security tests that tested variable assignments or DOM existence instead of real behavior — 38 behavioral tests remain

#### `testauth1.html` — v01.70w

##### Changed
- Removed 27 fake and trivial security tests that were testing variable assignments or DOM existence instead of actual behavior (38 real tests remain)

## [v03.49r] — 2026-03-14 08:19:27 PM EST — [cdfce09](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cdfce0934935898087661c2aef6dada9a085e61f)

### Changed
- Merged duplicate document.write and eval() security tests into a single "Code Safety Scan" test — eliminates redundant script enumeration (65 tests total)

#### `testauth1.html` — v01.69w

##### Changed
- Merged "No document.write" and "No eval() Usage" tests into a single "Code Safety Scan" test (65 tests total)

## [v03.48r] — 2026-03-14 08:15:12 PM EST — [02b693a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/02b693a94e4c40400c452d9a6c590189340dc255)

### Fixed
- Fixed "No eval() Usage" security test failing — `allScripts` variable was not declared in the test's isolated scope after the test runner restructure

#### `testauth1.html` — v01.68w

##### Fixed
- Fixed "No eval() Usage" security test failing with "allScripts is not defined" error

## [v03.47r] — 2026-03-14 08:05:17 PM EST — [3cc94e6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/3cc94e6f9d6131e22720b07cf8c69e5f7e968e45)

### Changed
- Restructured security test runner to two-phase UI — "Security Tests" button shows all 66 tests as pending, then "Run All" executes them one-by-one with live pass/fail transitions (previously all tests ran immediately on button click)

#### `testauth1.html` — v01.67w

##### Changed
- "Run Security Tests" button now shows all 66 tests as pending first, then a "Run All" button runs them one-by-one with live pass/fail transitions

## [v03.46r] — 2026-03-14 07:47:04 PM EST

### Fixed
- Fixed security tests destroying active sessions when run — tests for performSignOut, showAuthWall, exchangeToken, and handleTokenResponse now use safe code inspection instead of calling the functions directly (which stopped timers, reloaded the iframe, and showed the sign-in wall)

#### `testauth1.html` — v01.66w

##### Fixed
- Fixed security tests causing sign-out and "Access denied" when clicking "Run Security Tests" — destructive function calls replaced with safe code inspection

## [v03.45r] — 2026-03-14 07:24:28 PM EST

### Changed
- Upgraded ~25 security tests from existence-only checks to behavioral verification — tests now call functions, verify side effects, and confirm state transitions (e.g. CSRF nonce consumption, session cleanup, storage round-trips, heartbeat state machine)

#### `testauth1.html` — v01.65w

##### Changed
- Upgraded security tests from existence-only checks to behavioral verification — tests now actively call functions, verify side effects, and confirm state transitions instead of just checking if code exists

## [v03.44r] — 2026-03-14 07:12:06 PM EST

### Fixed
- Fixed three false-positive security test warnings: tests 52/53 (document.write/eval) now skip the test runner script itself to avoid self-detection, and test 65 (clickjacking) correctly reports frame-ancestors as an HTTP-header-only directive that doesn't belong in meta CSP tags

#### `testauth1.html` — v01.64w

##### Fixed
- Fixed three security test false positives: "document.write" and "eval()" tests no longer flag themselves, and clickjacking test correctly reports that frame-ancestors is an HTTP-header-only directive

## [v03.43r] — 2026-03-14 06:52:15 PM EST

### Added
- Expanded testauth1 security test panel from 23 to 65 tests — added CSP connect/style/img-src audits, OAuth client ID validation, session duration configuration checks, all sanitizer deep tests (event handlers, nested XSS, form injection, CSS injection), auth function existence checks, UI state exclusivity verification, code safety scans (no eval, no document.write), storage key naming audit, open redirect check, clickjacking protection, and more

#### `testauth1.html` — v01.63w

##### Added
- Expanded security tests from 23 to 65 — added CSP directive audits, OAuth configuration checks, sanitizer deep tests, session lifecycle verification, UI state checks, code safety scans, and storage security audits

## [v03.42r] — 2026-03-14 06:43:09 PM EST

### Fixed
- Session expiry warning banner now triggers automatically when ≤60 seconds remain, instead of only appearing on page refresh — banner also auto-hides when a heartbeat extends the session

#### `testauth1.html` — v01.62w

##### Fixed
- "Session expiring soon" warning now appears automatically when less than 60 seconds remain, instead of only showing on page refresh

## [v03.41r] — 2026-03-14 06:35:29 PM EST

### Fixed
- Fixed console 404 error in security test panel caused by XSS test payload triggering a network request — replaced with data URI

#### `testauth1.html` — v01.61w

##### Fixed
- Fixed a console error (404) that appeared when running security tests

## [v03.40r] — 2026-03-14 06:29:20 PM EST

### Added
- Expanded security test panel from 12 to 23 tests in testauth1 — added signature verification logic test, GAS iframe presence, postMessage exchange check, CSP script/frame source audit, plugin injection prevention, GAS origin constant, SVG/MathML XSS vector test, session flag isolation, activity event tracking, and session cleanup verification

#### `testauth1.html` — v01.60w

##### Added
- Added 11 new security tests: signature hash verification with known values, GAS iframe check, postMessage exchange mode, CSP script-src/frame-src domain audit, object-src plugin blocking, GAS_ORIGIN validation, SVG/Math XSS sanitization, sessionStorage flag isolation, activity event completeness, and clearSession key reset verification

## [v03.39r] — 2026-03-14 06:25:11 PM EST

### Fixed
- Fixed security test panel's changelog sanitization test failing because `sanitizeChangelogHtml` was scoped inside a closure — moved to top-level scope so both changelog rendering and the security test can access it

#### `testauth1.html` — v01.59w

##### Fixed
- Moved `sanitizeChangelogHtml` from IIFE-scoped to top-level scope to fix the security test "Changelog Sanitization" check

## [v03.38r] — 2026-03-14 06:21:23 PM EST

### Added
- Added security test panel to testauth1 — a "Run Security Tests" button that validates all implemented security features (CSP, sanitization, CSRF nonce, message allowlist, bootstrap replay protection, key protection, HMAC verification, cross-tab signout, session config, error sanitization, heartbeat, referrer policy)

#### `testauth1.html` — v01.58w

##### Added
- Added "Run Security Tests" button in the bottom-left corner that runs 12 client-side security checks and displays pass/fail/warning results in a dark overlay panel

## [v03.37r] — 2026-03-14 06:10:46 PM EST

### Security
- Added client-side CSRF nonce protection for the OAuth sign-in flow in testauth1 — ensures token callbacks only process tokens from sign-in flows initiated by the current page (VULN-14)
- Documented Google MFA limitation: Google's OAuth ID tokens do not include `amr` claim, so MFA enforcement must happen at Workspace admin level (VULN-16)

#### `testauth1.html` — v01.57w

##### Security
- Added `_authNonce` CSRF protection: a nonce is generated before each `requestAccessToken()` call and verified in `handleTokenResponse()` — rejects unsolicited token callbacks
- Nonce is consumed (nulled) after use to prevent replay

## [v03.36r] — 2026-03-14 06:03:06 PM EST

### Security
- Enabled HMAC-SHA256 session integrity verification for standard preset in testauth1 — both presets now verify session data has not been tampered with (VULN-9)
- Added bootstrap timestamp validation to reject replayed gas-session-created messages older than 30 seconds (VULN-10)
- Added first-write-wins protection for message signing key — prevents attacker from overwriting the key after initial delivery (VULN-10)
- BroadcastChannel cross-tab session revocation confirmed already implemented (VULN-18)

#### `testauth1.html` — v01.56w

##### Security
- Added iframe load timestamp tracking for bootstrap validation
- Added 30-second freshness check on gas-session-created messages — rejects stale/replayed bootstrap messages
- Added first-write-wins guard: once the message signing key is set, subsequent gas-session-created messages cannot overwrite it

#### `testauth1.gs` — v01.26g

##### Security
- Enabled ENABLE_HMAC_INTEGRITY for standard preset (was already enabled for hipaa preset)

## [v03.35r] — 2026-03-14 05:58:39 PM EST

### Security
- Added deploy audit logging to testauth1 — every deploy trigger is now recorded in a rolling 20-entry cache log with timestamps and version info for security monitoring (VULN-3 detection)
- Master ACL placeholder validation confirmed already implemented — prevents API calls with unconfigured spreadsheet ID (VULN-19)
- Deployment ID and spreadsheet ID exposure in source code documented as accepted risk — these are identifiers, not secrets (VULN-12)

#### `testauth1.gs` — v01.25g

##### Security
- Added rolling deploy audit log (20 entries, 6hr TTL) at the start of pullAndDeployFromGitHub() — records timestamp, trigger source, and current version for each deploy event

## [v03.34r] — 2026-03-14 05:54:36 PM EST

### Security
- Removed email addresses from authentication error responses to prevent email enumeration (VULN-7)
- Added per-token rate limiting (5 attempts/5min) on login and per-session rate limiting (20 requests/5min) on heartbeat to prevent brute force attacks (VULN-8)
- Reduced absolute session timeout from 16 hours to 8 hours to shrink stolen session exposure window (VULN-17)
- Updated authentication error display to show generic "Access denied" message instead of exposing error codes or email addresses

#### `testauth1.html` — v01.55w

##### Security
- Changed authentication failure message from detailed error code + email to generic "Access denied. Contact your administrator."

#### `testauth1.gs` — v01.24g

##### Security
- Removed email field from domain_not_allowed and not_authorized error responses
- Added rate limiting: max 5 failed login attempts per token fingerprint per 5-minute window with automatic counter reset on success
- Added heartbeat rate limiting: max 20 requests per session per 5-minute window
- Reduced ABSOLUTE_SESSION_TIMEOUT production value from 57600s (16hr) to 28800s (8hr) in both standard and hipaa presets

## [v03.33r] — 2026-03-14 05:46:37 PM EST

### Security
- Added Content Security Policy (CSP) meta tag to testauth1 — blocks unauthorized script sources, object/embed injection, and base-URI hijacking while whitelisting Google Identity Services and GAS iframe origins
- Added HTML sanitization for changelog popups — strips dangerous elements (script, iframe, object, embed, form, svg) and event handler attributes from externally-fetched changelog content before innerHTML rendering

#### `testauth1.html` — v01.54w

##### Security
- Added Content-Security-Policy meta tag with directives for script-src, connect-src, frame-src, style-src, img-src, object-src, and base-uri
- Added sanitizeChangelogHtml() function that strips dangerous HTML elements and event handler attributes
- Applied changelog sanitization to both GAS changelog and HTML changelog innerHTML assignments

## [v03.32r] — 2026-03-14 05:29:45 PM EST

### Fixed
- Fixed "Session expired" false alarm on fresh portal page load — the GAS iframe was navigating to the bare deployment URL before auth could initialize, triggering a premature `gas-needs-auth` postMessage

#### `portal.html` — v01.06w

##### Fixed
- Fixed iframe race condition: cancel GAS iframe navigation on page load when no session exists, preventing false "Session expired" message
- Fixed iframe srcdoc cleanup on session resume to prevent bare-URL race with session-URL navigation

## [v03.31r] — 2026-03-14 05:16:28 PM EST

### Changed
- Portal page architecture: moved dashboard UI (app cards, toggle, gradient theme) from HTML layer to GAS layer — portal.html is now a standard template page with GAS iframe integration
- Portal authentication switched from client-side master token to server-side GAS session management (token exchange via iframe)

### Added
- GAS version polling and GAS version pill on the portal page
- GAS iframe injection with encoded deployment URL on the portal page
- GAS changelog popup accessible from the GAS version pill

#### `portal.html` — v01.05w

##### Changed
- Replaced custom client-side auth with standard template GAS-based auth (token exchange, session management)
- Removed portal dashboard HTML/CSS/JS from the HTML layer (now served by GAS iframe)
- Added GAS iframe injection, GAS version polling, and GAS changelog popup from template

#### `portal.gs` — v01.01g

##### Changed
- Portal dashboard UI now rendered by GAS: gradient background, app cards grid, open-in-tab/window toggle, user info display

## [v03.30r] — 2026-03-14 04:56:37 PM EST

### Added
- Set up Portal GAS project with auth support — `portal.gs`, `portal.config.json`, version files, changelogs, per-environment diagram, workflow deploy step, and GAS Projects table registration

#### `portal.html` — v01.04w (no change)

##### Changed
- Updated title to "Portal Title" and CLIENT_ID to new GAS project credentials

## [v03.29r] — 2026-03-14 03:19:37 PM EST

### Added
- Toggle switch on portal dashboard to choose between opening apps in a new tab or new window

#### `portal.html` — v01.04w

##### Added
- "Open in new tab / New window" toggle with preference saved across sessions

## [v03.28r] — 2026-03-14 03:15:42 PM EST

### Changed
- Portal app cards now open in a new browser window instead of a new tab

#### `portal.html` — v01.03w

##### Changed
- App cards open in a new popup window (80% screen size, centered) instead of a new tab

## [v03.27r] — 2026-03-14 03:12:36 PM EST

### Changed
- Application portal now opens projects in new windows instead of redirecting the current page

#### `portal.html` — v01.02w

##### Changed
- App cards now open in a new browser tab/window

## [v03.26r] — 2026-03-14 03:06:27 PM EST

### Changed
- Added all site pages to the portal dashboard — GAS Project Creator was missing from the navigation cards

#### `portal.html` — v01.01w

##### Changed
- Portal now lists all site pages: Test Auth 1, Test Environment, Homepage, and GAS Project Creator

## [v03.25r] — 2026-03-14 02:55:57 PM EST

### Added
- Created `portal.html` — central authentication gateway for cross-page SSO (Architecture 1). Standalone mode with Google Sign-In, master token storage (localStorage for standard, sessionStorage for HIPAA), cross-tab session sync, app navigation cards, and token expiry management. No GAS backend yet — `auth.gs` will be configured separately

#### `portal.html` — v01.00w (new)

##### Added
- Central sign-in page with Google authentication
- Application portal dashboard with navigation cards to app pages
- Cross-tab session synchronization (storage event + BroadcastChannel)

## [v03.24r] — 2026-03-14 02:42:56 PM EST

### Added
- Documented future portal/SSO architecture (Architecture 1) in `KNOWN-CONSTRAINTS-AND-FIXES.md` — central `auth.gs` service for cross-page authentication, token relay patterns for both standard and hipaa presets

## [v03.23r] — 2026-03-14 02:11:03 PM EST

### Added
- Added `BroadcastChannel` cross-tab sign-out for hipaa preset (`sessionStorage`) — duplicated tabs now sign out when any tab signs out
- Documented cross-tab sign-out architecture as Constraint F in `KNOWN-CONSTRAINTS-AND-FIXES.md`

#### `testauth1.html` — v01.53w

##### Added
- Cross-tab sign-out now works with the hipaa security preset

## [v03.22r] — 2026-03-14 01:52:33 PM EST

### Changed
- Renamed `KNOWN-CONSTRAINTS.md` → `KNOWN-CONSTRAINTS-AND-FIXES.md` to reflect both architectural constraints and resolved bug documentation
- Added Resolved Fixes section documenting the 3 hipaa sign-in bugs and their fixes (postMessage targeting, HMAC verification, stale message key)
- Updated all references to the renamed file across the repo

#### `testauth1.html` — v01.52w

##### Changed
- Minor internal improvements

## [v03.21r] — 2026-03-14 01:52:33 PM EST

### Added
- Added reminder noting hipaa preset sign-in flow is confirmed working (all 3 bugs fixed) and ready to proceed with security update phases 2-7

## [v03.20r] — 2026-03-14 01:25:57 PM EST

### Fixed
- Fixed re-sign-in after sign-out getting stuck on "Sign In Required" — the HMAC message signing key (`_messageKey`) from the previous session persisted after sign-out, causing unsigned bootstrap messages (`gas-ready-for-token`) from the new sign-in attempt to be silently dropped by HMAC verification

#### `testauth1.html` — v01.51w

##### Fixed
- Signing out and signing back in no longer gets stuck on the sign-in page

## [v03.19r] — 2026-03-14 01:18:46 PM EST

### Fixed
- Fixed HMAC verification failing when `HMAC_SECRET` script property is not configured — `verifySessionHmac()` now checks for the secret and passes through (returns true) when it's missing, matching the behavior of `generateSessionHmac()` which also returns empty when the secret is absent

#### `testauth1.gs` — v01.23g

##### Fixed
- Fixed blank page after sign-in when using hipaa security preset — HMAC verification was rejecting valid sessions because the HMAC secret was not configured

## [v03.18r] — 2026-03-14 01:09:05 PM EST

### Fixed
- Fixed hipaa postMessage token exchange — sign-in was stuck because `gasApp.contentWindow` targets the outer script.google.com shell frame, not the inner sandbox frame where the listener runs; switched to `event.source` to reply directly to the sandbox

### Added
- Created `KNOWN-CONSTRAINTS-AND-FIXES.md` documenting architectural constraints that must not be changed (GAS double-iframe `'*'` targetOrigin, `event.source` for HTML→GAS replies, unauthenticated deploy webhook, sign-in flow chain, PARENT_ORIGIN for GAS→HTML)

#### `testauth1.html` — v01.50w

##### Fixed
- Fixed sign-in getting stuck when using the hipaa security preset

## [v03.17r] — 2026-03-14 12:59:12 PM EST

### Fixed
- Reverted postMessage targetOrigin from `GAS_ORIGIN` back to `'*'` for the HTML→GAS exchange-token message — GAS double-iframe architecture serves the listener from a sandboxed `googleusercontent.com` subdomain, causing the browser to silently drop messages targeted at `script.google.com` (VULN-2 remains open on this direction; exposure limited to single-use token)

#### `testauth1.html` — v01.49w

##### Fixed
- Fixed sign-in getting stuck on "Sign In Required" when using postMessage token exchange — the access token message was being silently dropped by the browser

## [v03.16r] — 2026-03-14 12:53:45 PM EST

### Changed
- Switched testauth1 from `standard` to `hipaa` auth preset — enables HMAC message integrity, audit logging, emergency access, and postMessage token exchange by default
- Fixed hipaa preset validation to only require `ALLOWED_DOMAINS` when `ENABLE_DOMAIN_RESTRICTION` is true (previously threw unconditionally)

#### `testauth1.gs` — v01.22g

##### Changed
- Switched `ACTIVE_PRESET` from `'standard'` to `'hipaa'`
- Added `PROJECT_OVERRIDES` with `ENABLE_DOMAIN_RESTRICTION: false` to allow any Google account
- Fixed `resolveConfig()` validation — `ALLOWED_DOMAINS` check now gated on `ENABLE_DOMAIN_RESTRICTION`

#### `testauth1.html` — v01.48w

##### Changed
- Switched `STORAGE_TYPE` from `'localStorage'` to `'sessionStorage'` (session cleared on tab close)
- Switched `TOKEN_EXCHANGE_METHOD` from `'url'` to `'postMessage'` (token never in URL)
- Updated commented-out production `SERVER_SESSION_DURATION` from 3600 to 900 to match hipaa preset

## [v03.15r] — 2026-03-14 12:46:13 PM EST

### Changed
- Added commented-out production values above each test value in GAS and HTML config — to revert, uncomment the original lines and delete the ⚡ TEST VALUE lines

#### `testauth1.gs` — v01.21g

##### Changed
- Added commented-out production values above each ⚡ TEST VALUE line in both standard and hipaa presets for easy revert

#### `testauth1.html` — v01.47w

##### Changed
- Added commented-out production values above each ⚡ TEST VALUE line for easy revert

## [v03.14r] — 2026-03-14 12:43:08 PM EST

### Changed
- Set all timed auth config values to fast-test values for rapid testing (sessions, heartbeats, OAuth lifetime)
- Added inline comments documenting every timed config value with its production default

#### `testauth1.gs` — v01.20g

##### Changed
- Session expiration: 1 hour → 3 minutes (for testing)
- Absolute session timeout: 16 hours → 5 minutes (for testing)
- Heartbeat interval: 5 minutes → 30 seconds (for testing)
- OAuth token lifetime: 1 hour → 3 minutes (for testing)
- OAuth refresh buffer: 5 minutes → 1 minute (for testing)
- Added inline comments to all timed values showing production defaults

#### `testauth1.html` — v01.46w

##### Changed
- Heartbeat interval: 5 minutes → 30 seconds (for testing)
- Session countdown duration: 1 hour → 3 minutes (for testing)
- Absolute session countdown: 16 hours → 5 minutes (for testing)
- Added inline comments to all timed values showing production defaults

## [v03.13r] — 2026-03-14 12:39:17 PM EST

### Changed

#### `testauth1.gs` — v01.19g

##### Changed
- Reduced OAuth token refresh buffer from 15 minutes to 5 minutes — the "session is expiring soon" reauth banner now only appears in the last 5 minutes of OAuth token lifetime instead of the last 15

## [v03.12r] — 2026-03-14 12:32:39 PM EST

### Security

#### `testauth1.html` — v01.45w

##### Security
- Added `Referrer-Policy: no-referrer` meta tag to prevent OAuth and session tokens from leaking via HTTP referrer headers (VULN-1, VULN-6)
- Replaced wildcard `'*'` postMessage target origin with `GAS_ORIGIN` (`https://script.google.com`) when sending access tokens to the GAS iframe, preventing token broadcast to unintended recipients (VULN-2)

## [v03.11r] — 2026-03-14 12:13:26 PM EST

### Added
- Comprehensive security update plan II for testauth1 (`repository-information/08-SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — adversarial audit covering 19 vulnerabilities across 7 implementation phases: referrer policy + postMessage origin fix, token exposure reduction (postMessage exchange, sessionStorage, key namespacing), Content Security Policy + innerHTML sanitization, error sanitization + rate limiting + session timeout reduction, deploy audit logging + information exposure documentation, HMAC enablement + bootstrap hardening + cross-tab session revocation via BroadcastChannel, and OAuth flow hardening. Includes complete attack chain analysis, hard constraints inherited from the first plan, CSP directives validated against Google Identity Services documentation, and full regression testing protocol

## [v03.10r] — 2026-03-14 11:26:51 AM EST

### Changed
- Renamed `SECURITY-UPDATE-PLAN-TESTAUTH1.md` → `07-SECURITY-UPDATE-PLAN-TESTAUTH1.md` and updated status to "Implemented" — the 6-phase security hardening was fully implemented in v02.90r–v02.91r
- Updated all cross-references (README tree, CHANGELOG entries, SESSION-CONTEXT.md)

## [v03.09r] — 2026-03-13 11:38:31 PM EST

### Changed
- Stacked the session timer, GAS version, and HTML version pins vertically in the bottom-right corner instead of spreading them horizontally
- Propagated vertical pin stacking to the auth HTML template

#### `testauth1.html` — v01.44w

##### Changed
- Status pins now stack vertically in the bottom-right corner — session timer on top, GAS version in the middle, HTML version on the bottom

## [v03.08r] — 2026-03-13 11:23:52 PM EST

### Added
- Session pin now shows ▶ indicator in minimized state when heartbeat is active
- Propagated ▶ minimized pill indicator to the auth HTML template

#### `testauth1.html` — v01.43w

##### Added
- Session countdown pill now shows ▶ when your activity is being tracked

## [v03.07r] — 2026-03-13 11:17:21 PM EST

### Changed
- Changed testauth1 session countdown to 1 hour and heartbeat interval to 5 minutes
- Updated auth templates (GAS and HTML) to match: session 1 hour, heartbeat 5 minutes

#### `testauth1.html` — v01.42w

##### Changed
- Session now lasts 1 hour instead of 2 hours
- Heartbeat checks happen every 5 minutes instead of every 10 minutes

#### `testauth1.gs` — v01.18g

##### Changed
- Session expiration changed to 1 hour
- Heartbeat interval changed to 5 minutes

## [v03.06r] — 2026-03-13 11:12:06 PM EST

### Changed
- Increased testauth1 session countdown from 3 minutes to 2 hours and heartbeat interval from 30 seconds to 10 minutes

#### `testauth1.html` — v01.41w

##### Changed
- Session now lasts 2 hours instead of 3 minutes
- Heartbeat checks happen every 10 minutes instead of every 30 seconds

#### `testauth1.gs` — v01.17g

##### Changed
- Session expiration extended from 3 minutes to 2 hours
- Heartbeat interval increased from 30 seconds to 10 minutes

## [v03.05r] — 2026-03-13 11:00:25 PM EST

### Removed
- Removed 15-second grace period for in-flight heartbeats — the urgent heartbeat (instant send in the last 30s) makes this unnecessary

### Changed
- Propagated testauth1 improvements to the auth template: urgent heartbeat for last-30s activity, `▶ ready` indicator replacing `(active)` label

#### `testauth1.html` — v01.40w

##### Removed
- Removed grace period delay before session expiry — sessions now expire immediately when the timer runs out

## [v03.04r] — 2026-03-13 10:46:46 PM EST

### Removed
- Removed iframe focus polling for heartbeat activity — it falsely reported activity whenever focus was inside the iframe, even when the user was idle. Keyboard-only interaction inside the GAS iframe is a narrow edge case; mouse movement on the host page already covers most real usage

#### `testauth1.html` — v01.39w

##### Removed
- Removed false activity detection that kept the session active even when you weren't interacting

## [v03.03r] — 2026-03-13 10:39:53 PM EST

### Fixed
- Iframe focus detection now requires `document.hasFocus()` — prevents false activity when the browser tab is not focused

#### `testauth1.html` — v01.38w

##### Fixed
- Session no longer falsely shows activity when you switch to another tab or window

## [v03.02r] — 2026-03-13 10:34:59 PM EST

### Fixed
- Typing inside the GAS iframe now counts as activity for heartbeat — added iframe focus detection since cross-origin iframes swallow keyboard events

#### `testauth1.html` — v01.37w

##### Fixed
- Typing in text boxes inside the app now keeps your session active

## [v03.01r] — 2026-03-13 10:24:41 PM EST

### Fixed
- Heartbeat display no longer shows "▶ ready" immediately after extending — resets to idle so the next tick decides the state, removing the confusing "extended ✓" → "active" flash

#### `testauth1.html` — v01.36w

##### Fixed
- Heartbeat indicator resets to idle after session extension instead of immediately showing "ready"

## [v03.00r] — 2026-03-13 10:08:56 PM EST

### Fixed
- Fixed heartbeat ready indicator not appearing on activity — `_heartbeatIdle` was not cleared when user became active, so display stayed stuck on `(idle)` until the next 30s tick

#### `testauth1.html` — v01.35w

##### Fixed
- Heartbeat "ready" indicator now appears immediately when you interact with the page, instead of staying on "idle" until the next heartbeat cycle

## [v02.99r] — 2026-03-13 10:03:03 PM EST

### Changed
- Heartbeat countdown now shows `▶ ready` indicator when it will fire on the next tick, replacing the generic `(active)` label

#### `testauth1.html` — v01.34w

##### Changed
- Heartbeat countdown shows a clear "ready" indicator when your session will be extended on the next heartbeat

## [v02.98r] — 2026-03-13 09:43:38 PM EST

### Added
- Added urgent heartbeat — when session has <30s remaining and user is active, sends heartbeat immediately instead of waiting for the next 30s interval tick

#### `testauth1.html` — v01.33w

##### Added
- Session now extends immediately when you're active in the last 30 seconds before expiry

## [v02.97r] — 2026-03-13 09:25:41 PM EST

### Changed
- Reverted cursor flicker fix attempts (v02.95r, v02.96r) — restored heartbeat to v01.29w behavior (persistent iframe, direct DOM writes)

#### `testauth1.html` — v01.32w

##### Changed
- Reverted heartbeat to original approach — minor cursor flicker during heartbeat is acceptable

## [v02.96r] — 2026-03-13 09:15:09 PM EST

### Fixed
- Fixed heartbeat cursor flicker by batching DOM updates with requestAnimationFrame and adding CSS containment to the timer pill

#### `testauth1.html` — v01.31w

##### Fixed
- Fixed cursor flickering from caret to pointer when heartbeat status updates

## [v02.95r] — 2026-03-13 09:08:32 PM EST

### Fixed
- Fixed heartbeat iframe cursor flicker — heartbeat now uses a disposable iframe with src pre-set before DOM insertion instead of navigating an existing iframe

#### `testauth1.html` — v01.30w

##### Fixed
- Fixed cursor flickering from caret to pointer during heartbeat requests

## [v02.94r] — 2026-03-13 08:58:37 PM EST

### Added
- Added text input field to testauth1 GAS app for testing whether heartbeat iframe reloads disrupt user typing

#### `testauth1.gs` — v01.16g

##### Added
- Added text input field for heartbeat interruption testing

## [v02.93r] — 2026-03-13 08:37:51 PM EST

### Fixed
- Fixed session timeout race condition — when a heartbeat was in-flight and the countdown hit 0, the client would sign the user out before the server response could extend the session. Added a 15-second grace period that shows "extending..." while waiting for the heartbeat response

#### `testauth1.html` — v01.29w

##### Fixed
- Session no longer times out while a heartbeat response is in transit — shows "extending..." instead of immediately signing out

## [v02.92r] — 2026-03-13 08:14:29 PM EST

### Fixed
- Fixed GAS changelog popup not showing version headers with timestamps — the `parseGasChangelog` regex was missing the `v` prefix in the version capture group (`[\d.]+g` → `v[\d.]+g`), causing all `## [vXX.XXg]` headers to be silently skipped while entries were shown without grouping

#### `testauth1.html` — v01.28w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

#### `index.html` — v01.03w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

#### `testenvironment.html` — v01.03w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

#### `gas-project-creator.html` — v01.10w

##### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

## [v02.91r] — 2026-03-13 08:03:00 PM EST

### Changed
- Propagated all security hardening from testauth1 to auth templates — both `gas-minimal-auth-template-code.js.txt` and `HtmlAndGasTemplateAutoUpdate-auth.html.txt` now include the full 6-phase security implementation so new GAS projects created via setup-gas-project.sh inherit all defenses by default

### Security
- **Auth GAS template** — added PARENT_ORIGIN derivation, `escapeHtml()`/`escapeJs()` XSS prevention, expanded HMAC payload, per-session message signing key, `messageKey` in session responses, error sanitization, all `"*"` → `PARENT_ORIGIN` on postMessages, removed `accessToken` from session storage
- **Auth HTML template** — added message-type allowlist (8 known types), cryptographic message signature verification, `msgKey` parameter on heartbeat iframe URLs, removed debug console.logs, removed broken OAuth revocation, fixed checkmark encoding

## [v02.90r] — 2026-03-13 07:15:58 PM EST

### Added
- Defense-in-depth security hardening for testauth1 environment (6-phase implementation from 07-SECURITY-UPDATE-PLAN-TESTAUTH1.md)

### Security
- **Message-type allowlist** (HTML) — postMessage listener now only processes 8 known GAS message types, rejecting all others
- **Cryptographic message authentication** (GAS→HTML) — per-session HMAC key signs all GAS outgoing postMessages; HTML parent verifies signatures before processing security-sensitive messages
- **XSS prevention** (GAS) — added `escapeHtml()`/`escapeJs()` helpers and applied to all user-controlled interpolation points in GAS-generated HTML
- **Session hardening** (GAS) — removed stored OAuth access token from session cache (least privilege), expanded HMAC payload to cover all security-relevant fields
- **postMessage target origin** (GAS) — replaced `"*"` with `PARENT_ORIGIN` (derived from `EMBED_PAGE_URL` with mandatory `.toLowerCase()`) on all 15 GAS→parent postMessage calls
- **Error message sanitization** (GAS) — token exchange errors now log details server-side only, returning generic "server_error" to client
- **Debug log cleanup** (both) — removed all `[AUTH DEBUG]` and `[GAS DEBUG]` console.log statements from production code
- **OAuth revocation fix** (HTML) — removed broken `google.accounts.oauth2.revoke(session.token)` call that was passing the server session token instead of the OAuth access token

#### `testauth1.html` — v01.27w

##### Added
- Message-type allowlist for postMessage security
- Cryptographic message signature verification for GAS messages

##### Changed
- Heartbeat iframe now passes message signing key for signature verification

##### Fixed
- Removed broken OAuth token revocation that was passing wrong token type

##### Removed
- Debug console.log statements from authentication flow

#### `testauth1.gs` — v01.15g

##### Added
- `escapeHtml()` and `escapeJs()` XSS prevention helpers
- `PARENT_ORIGIN` constant for restricted postMessage targeting
- Per-session message signing key generation and message signing
- Server-side error logging for token exchange failures

##### Changed
- All postMessage calls now target `PARENT_ORIGIN` instead of `"*"`
- HMAC payload expanded to include all security-relevant session fields
- OAuth access token no longer stored in session cache

##### Removed
- Debug console.log statement from token exchange response

## [v02.89r] — 2026-03-13 07:00:04 PM EST

### Changed
- Corrected security update plan failure analysis (`repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — identified that GAS was stuck at v01.15g from v02.79r onward because DEPLOY_SECRET broke auto-deploy, meaning all subsequent GAS-side fixes (v02.80r–v02.82r) never deployed to the live environment. Corrected false lessons: PARENT_ORIGIN case mismatch (not `.toLowerCase()`) was the actual root cause of persistent sign-in failure; TOKEN_EXCHANGE_METHOD='postMessage' was never properly tested (revert never deployed). Added `.toLowerCase()` to Phase 6 PARENT_ORIGIN derivation to prevent repeating the v02.79r bug

## [v02.88r] — 2026-03-13 06:46:07 PM EST

### Added
- Comprehensive security update plan for testauth1 (`repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — implementation-ready plan covering 6 phases: message-type allowlist, cryptographic message authentication, XSS prevention, session hardening, debug cleanup, error sanitization, and postMessage target origin restriction. Includes complete failure analysis of v02.75r–v02.84r (the two previous reverted attempts) with root causes documented for each, and explicit "never touch" constraints for the deploy handler and sign-in flow

## [v02.87r] — 2026-03-13 06:13:23 PM EST

### Changed
- Rotated 92 CHANGELOG sections (v02.68r–v01.77r) to archive — all non-today sections moved to CHANGELOG-archive.md with SHA enrichment for 6 versions (v02.63r–v02.68r); 86 older versions moved as-is (commits pre-date local git history)

## [v02.86r] — 2026-03-13 06:03:16 PM EST

### Added
- Protective `⚠️ CRITICAL` comment block in all GAS deploy handlers (`doPost(action=deploy)`) warning against adding authentication or guards — prevents silent breakage of the auto-update pipeline
- Deploy Handler Protection rule in `.claude/rules/gas-scripts.md` documenting why the deploy endpoint must remain unauthenticated, what happened when auth was added (v02.79r), and the pattern to watch for

#### `testauth1.gs` — v01.14g

##### Added
- Minor internal improvements

## [v02.85r] — 2026-03-13 05:44:18 PM EST

### Changed
- Full repo revert to v02.74r state — undoes all changes from v02.75r through v02.84r (security hardening, postMessage fixes, security action plan, template propagation)
- Removed `repository-information/SECURITY-ACTION-PLAN.md` (created in v02.78r)

#### `testauth1.html` — v01.26w (reverted from v01.35w)

##### Changed
- Reverted to v01.26w state — undoes security hardening changes (CSP meta tag, origin validation, postMessage security, CSRF token handling) that were applied in v02.75r–v02.84r

#### `testauth1.gs` — v01.13g (reverted from v01.17g)

##### Changed
- Reverted to v01.13g state — undoes server-side security hardening (state parameter validation, origin checks, action allowlists) from v02.79r–v02.84r

## [v02.74r] — 2026-03-13 12:58:17 PM EST

### Changed
- Removed "Back to Table of Contents" link from Project Structure section since it's directly adjacent to the TOC

## [v02.73r] — 2026-03-13 12:55:44 PM EST

### Added
- "Back to Table of Contents" shortcut links under each section heading in README.md for quick navigation back to the TOC

## [v02.72r] — 2026-03-13 12:52:19 PM EST

### Added
- Table of contents section in README.md with anchor links to all major sections, placed between the QR code and Project Structure

## [v02.71r] — 2026-03-13 12:32:54 PM EST

### Added
- Comprehensive Microsoft authentication implementation plan (`MICROSOFT-AUTH-PLAN.md`) — covers MSAL.js integration, Azure AD setup, provider toggle architecture, GAS-side token validation via Microsoft Graph, and HTML-side dual sign-in UI

## [v02.70r] — 2026-03-13 11:32:09 AM EST

### Fixed
- Removed automatic silent OAuth sign-in on page load — the Google account picker popup no longer fires when refreshing the auth wall page; sign-in only triggers when the user clicks "Sign In with Google"
- Reverted incorrect SIGNED_OUT_FLAG approach from v02.69r

#### `testauth1.html` — v01.26w

##### Fixed
- Page refresh on "Sign In Required" screen no longer auto-triggers Google sign-in popup

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — v01.26w (no change)

##### Fixed
- Same fix applied to auth HTML template for future pages

## [v02.69r] — 2026-03-13 11:23:50 AM EST

### Fixed
- Fixed auto sign-in after manual sign-out on auth pages — signing out and refreshing no longer silently re-authenticates; the account picker is now shown

#### `testauth1.html` — v01.25w

##### Fixed
- Fixed sign-out followed by page refresh auto-signing back in without account picker

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — v01.25w (no change)

##### Fixed
- Same sign-out fix applied to auth HTML template for future pages

## [v02.68r] — 2026-03-12 11:49:35 PM EST — [95027c8](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/95027c8dc62116c40e0d6412a66f9df706c01b5a)

### Changed
- Propagated base auth upgrades from `gas-minimal-auth-template-code.js.txt` to `gas-test-auth-template-code.js.txt`: Master ACL spreadsheet support, heartbeat-based session management, absolute session timeout, improved error handling in token exchange, and debug logging

## [v02.67r] — 2026-03-12 11:38:39 PM EST — [58ee5a3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/58ee5a38fef9606ab9a9ede326e997dbf2bc9158)

### Removed
- Removed `dchrcalendar.gs`, `dchrcalendar.html`, `testaed.gs`, and `testaed.html` — unused standalone files that were only kept as auth pattern reference implementations
- Updated `01-CUSTOM-AUTH-PATTERN.md` and `02-GOOGLE-OAUTH-AUTH-PATTERN.md` to note source files have been removed (pattern documentation preserved)

## [v02.66r] — 2026-03-12 11:19:23 PM EST — [6e4c737](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6e4c7378b199adf9d6b582fbcbbaedf433cf802f)

### Changed
- Propagated heartbeat-based session management system from testauth1 to auth templates, replacing the old inactivity-timeout pattern
- Auth templates now include: heartbeat functions, countdown timer UI, absolute session timeout, z-index stacking fixes, auth wall branding, cross-tab session sync, and `select_account` sign-in UX

## [v02.65r] — 2026-03-12 10:36:32 PM EST — [d495d5e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d495d5e3f72c712cb915782e2d81f2512bb6dccc)

### Added
- Cross-tab login sync — signing in on one tab now automatically signs in all other open tabs of the same page (uses the browser's native `storage` event for instant, secure same-origin sync)

#### `testauth1.html` — v01.24w

##### Added
- Cross-tab session sync: signing in on one tab instantly signs in all other open tabs; signing out in one tab instantly signs out all others

## [v02.64r] — 2026-03-12 09:47:46 PM EST — [817a386](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/817a3866e4e36c654540b6994c1cd508c5f3423c)

### Changed
- GAS script version bump to test auto-refresh and session expiry account chooser fix

#### `testauth1.gs` — v01.13g

##### Changed
- Minor internal improvements

## [v02.63r] — 2026-03-12 09:36:14 PM EST — [d7f0c1b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d7f0c1bbfe93134753f82b1768a9ea934a21a4a8)

### Fixed
- After auto-refresh when a session has timed out, users now see the sign-in screen with account chooser instead of being silently re-authenticated

#### `testauth1.html` — v01.23w

##### Fixed
- Auto-refresh after session timeout no longer skips the account chooser — users can select which Google account to sign in with

## [v02.62r] — 2026-03-12 09:29:51 PM EST

### Changed
- Auth access check now uses dual OR logic — either master ACL spreadsheet TRUE or editor/viewer sharing-list grants access (both methods work simultaneously)
- Auth template updated to match the OR-based dual access method

#### `testauth1.gs` — v01.12g

##### Changed
- Access check uses dual OR logic — master ACL TRUE or editor/viewer sharing-list grants access (previously fallback-only)
- ACL lookup wrapped in try/catch so errors fall through to method 2 instead of blocking access

## [v02.61r] — 2026-03-12 09:18:49 PM EST

### Added
- Centralized master ACL spreadsheet for auth — row-based email lookup replaces sharing-list check, keeping the data spreadsheet hidden from users' Google Drive
- Master ACL config variables: `MASTER_ACL_SPREADSHEET_ID`, `ACL_SHEET_NAME`, `ACL_PAGE_NAME`
- GAS Project Creator form fields for master ACL configuration

### Changed
- Auth access check now uses master ACL spreadsheet when configured, with fallback to legacy editor/viewer check

#### `testauth1.gs` — v01.11g

##### Added
- Master ACL spreadsheet support — checks email against row-based ACL instead of spreadsheet sharing list
- Fallback to legacy editor/viewer check when master ACL is not configured

#### `gas-project-creator.html` — v01.09w

##### Added
- Master ACL Spreadsheet ID, ACL Sheet Name, and ACL Page Name form fields in auth settings

## [v02.60r] — 2026-03-12 08:48:00 PM EST

### Fixed
- Session timer pill no longer overlaps the GAS version display in the bottom-left corner

#### `testauth1.html` — v01.22w

##### Fixed
- Moved session timer pill to the right to avoid overlapping the GAS layer version text

## [v02.59r] — 2026-03-12 08:36:16 PM EST

### Changed
- Session timers redesigned as a compact pill matching the version and GAS pills — shows session countdown while minimized, expands on click to show all timers

#### `testauth1.html` — v01.21w

##### Changed
- Session timers restyled as a bottom-left pill with session countdown visible while collapsed
- Click to expand shows absolute, session, and heartbeat timers

## [v02.58r] — 2026-03-12 08:30:29 PM EST

### Removed
- Removed "Test GAS Call" debug button from session timers panel

#### `testauth1.html` — v01.20w

##### Removed
- Removed debug button and result display from session timers

## [v02.57r] — 2026-03-12 07:48:34 PM EST

### Changed
- Sign-in screen now shows company logo and environment title above the "Sign In Required" heading
- Version indicator pills (HTML and GAS) are now visible on the sign-in screen — previously hidden behind the auth wall's solid background

#### `testauth1.html` — v01.19w

##### Changed
- Added company logo and environment title to auth wall
- Raised version indicator z-index so pills are visible on the login screen
- Bumped changelog/reauth overlay z-indexes to maintain correct stacking

## [v02.56r] — 2026-03-12 07:41:03 PM EST

### Changed
- Google Sign-In now shows account chooser when clicking "Sign In with Google" instead of auto-selecting the last used account

#### `testauth1.html` — v01.18w

##### Changed
- Sign-in button always presents Google account chooser for explicit account selection
- Re-auth fallback uses account chooser instead of consent-only prompt

## [v02.55r] — 2026-03-12 07:29:04 PM EST

### Fixed
- Heartbeat no longer destroys the GAS app iframe — uses a hidden iframe for server heartbeat requests instead of navigating the main `gas-app` iframe

#### `testauth1.html` — v01.17w

##### Fixed
- GAS app content no longer disappears after the first heartbeat extension — heartbeat requests now use a separate hidden iframe instead of navigating the main GAS iframe

## [v02.54r] — 2026-03-12 07:22:08 PM EST

### Changed
- Session timers panel now starts minimized — click "Session Timers" header to expand/collapse

#### `testauth1.html` — v01.16w

##### Changed
- Session timers default to collapsed state with a clickable header to expand

## [v02.53r] — 2026-03-12 07:14:59 PM EST

### Changed
- Countdown timer now shows hours format (H:MM:SS) when remaining time is 1 hour or more — applies to absolute session timer

#### `testauth1.html` — v01.15w

##### Changed
- Timer display uses H:MM:SS format for durations over 1 hour (e.g. "16:00:00" instead of "960:00")

## [v02.52r] — 2026-03-12 07:12:02 PM EST

### Changed
- Removed client-side inactivity timeout — heartbeat already handles idle session expiry naturally (no activity → no heartbeat → server session expires)
- Reordered session timers: Absolute first, Session second, Heartbeat third
- Absolute session expiry message now shows the duration (e.g. "Your 16-hour session has ended")

### Removed
- Inactivity timer row from session timers UI
- `ENABLE_INACTIVITY_TIMEOUT`, `CLIENT_INACTIVITY_TIMEOUT`, `ENABLE_AUTO_SIGNOUT` config options
- `startInactivityTimer()`, `resetInactivityTimer()`, `stopInactivityTimer()`, `handleInactivityTimeout()` functions

#### `testauth1.html` — v01.14w

##### Changed
- Reordered session timer display: Absolute → Session → Heartbeat
- Absolute session expiry sign-out message now indicates the duration ("Your 16-hour session has ended. Please sign in again.")

##### Removed
- Inactivity timer row and all inactivity timeout logic
- `ENABLE_INACTIVITY_TIMEOUT`, `CLIENT_INACTIVITY_TIMEOUT`, `ENABLE_AUTO_SIGNOUT` config options

## [v02.51r] — 2026-03-12 07:03:32 PM EST

### Changed
- Set absolute session timeout to 16 hours (57600s) for both standard and HIPAA presets
- Recommend heartbeat over inactivity timeout — heartbeat handles idle session expiry naturally via server-side expiration
- Updated HIPAA compliance reference to reflect heartbeat-based logoff approach and 16-hour absolute ceiling

### Added
- Auto sign-out when session or absolute timer expires — users are automatically signed out with a descriptive message instead of just showing "expired" in the timer

#### `testauth1.html` — v01.13w

##### Changed
- Absolute session duration increased from 6 minutes to 16 hours

##### Added
- Auto sign-out on session expiry with message "Your session has expired"
- Auto sign-out on absolute timeout with message "Your session has reached the maximum duration"

#### `testauth1.gs` — v01.10g

##### Changed
- Standard preset `ABSOLUTE_SESSION_TIMEOUT`: 360s → 57600s (16 hours)
- HIPAA preset `ABSOLUTE_SESSION_TIMEOUT`: 3600s → 57600s (16 hours)

## [v02.50r] — 2026-03-12 06:40:07 PM EST

### Added
- Created `HIPAA-COMPLIANCE-REFERENCE.md` — comprehensive reference document covering all 42 HIPAA Security Rule implementation specifications across all five sections (Administrative, Physical, Technical, Organizational, Documentation), with Required/Addressable status, our project's implementation mapping, and the 2025 proposed rule changes

## [v02.49r] — 2026-03-12 06:16:10 PM EST

### Added
- Implemented absolute session timeout — a hard ceiling that can never be extended by heartbeats, preventing infinite sessions for active users (OWASP recommendation)
- Added `ABSOLUTE_SESSION_TIMEOUT` to GAS presets (standard: 360s/6min for testing, HIPAA: 3600s/1hr)
- Added absolute timeout checks in both `validateSession()` and heartbeat handler — refuses to extend past the absolute limit
- Added absolute countdown timer row in client-side timer panel

#### `testauth1.html` — v01.12w

##### Added
- New "Absolute" countdown timer showing the hard session ceiling that cannot be extended

#### `testauth1.gs` — v01.09g

##### Added
- Absolute session timeout enforcement — sessions now have a hard ceiling that heartbeats cannot extend past
- New `ABSOLUTE_SESSION_TIMEOUT` configuration option in presets

## [v02.48r] — 2026-03-12 05:53:24 PM EST

### Changed
- Heartbeat timer row now shows a live countdown to the next heartbeat tick with (active) or (idle) status indicator

#### `testauth1.html` — v01.11w

##### Changed
- Heartbeat display now counts down to the next heartbeat check, showing whether it will extend the session (active) or skip (idle)

## [v02.47r] — 2026-03-12 05:41:17 PM EST

### Added
- Implemented session heartbeat system — client monitors DOM activity and sends periodic heartbeat to GAS server, which resets `createdAt` to extend active sessions
- Added `?heartbeat=TOKEN` handler in GAS `doGet` with full validation (HMAC, expiry check) before extending
- Added `gas-heartbeat-ok` and `gas-heartbeat-expired` postMessage handlers on client for session extension feedback
- Added heartbeat status display in countdown timer panel (shows idle/sending/extended/expired states)

### Removed
- Removed `SESSION_REFRESH_WINDOW` from both standard and HIPAA presets — replaced by the heartbeat system

#### `testauth1.html` — v01.10w

##### Added
- Session heartbeat that monitors your activity and automatically extends your session while you're using the page
- Heartbeat status indicator in the timer panel showing when your session is being extended

##### Removed
- Removed refresh window display — replaced by the heartbeat system

#### `testauth1.gs` — v01.08g

##### Added
- Server-side heartbeat handler that extends your session when you're actively using the page
- `ENABLE_HEARTBEAT` and `HEARTBEAT_INTERVAL` configuration options

##### Removed
- Removed `SESSION_REFRESH_WINDOW` configuration — no longer needed with the heartbeat system

## [v02.46r] — 2026-03-12 05:18:55 PM EST

### Changed
- Reduced testauth1 session expiration from 30 minutes to 3 minutes and refresh window from 5 minutes to 1.5 minutes for testing
- Added "Test GAS Call" debug button to testauth1 timer panel to manually trigger server-side session validation

#### `testauth1.html` — v01.09w

##### Changed
- Shortened session timer to 3 minutes and refresh window to 1.5 minutes for testing
- Added "Test GAS Call" button to the session timers panel — triggers a server round-trip to test session expiry behavior

#### `testauth1.gs` — v01.07g

##### Changed
- Reduced session expiration from 1800s to 180s (3 min) and refresh window from 300s to 90s (1.5 min) for testing

## [v02.45r] — 2026-03-12 04:38:41 PM EST

### Added
- Added countdown timer panel to testauth1 showing session expiration, refresh window status, and inactivity timeout in real-time

#### `testauth1.html` — v01.08w

##### Added
- Added live countdown timers showing session time remaining, refresh window status, and inactivity timeout

## [v02.44r] — 2026-03-12 02:58:04 PM EST

### Changed
- Bumped testauth1 GAS script version to test the self-update webhook deployment

#### `testauth1.gs` — v01.06g

##### Changed
- Version bump to verify automatic code deployment via webhook

## [v02.43r] — 2026-03-12 02:50:25 PM EST

### Fixed
- Fixed GAS self-update (auto-deploy webhook) not working for testauth1 — the `GITHUB_OWNER`, `GITHUB_REPO`, `TITLE`, and `FILE_PATH` variables were still set to template placeholders, causing `pullAndDeployFromGitHub()` to fetch from a nonexistent path and fail silently

#### `testauth1.gs` — v01.05g

##### Fixed
- Replaced placeholder variables (`YOUR_ORG_NAME`, `YOUR_REPO_NAME`, `YOUR_PROJECT_FOLDER/YOUR_PAGE_NAME.gs`, `YOUR_PROJECT_TITLE`) with actual values so the self-update webhook can pull code from the correct GitHub path

## [v02.42r] — 2026-03-12 02:42:21 PM EST

### Fixed
- Fixed session not persisting across page refreshes — the iframe's `srcdoc` race condition also affected the session-resume path, causing `gas-needs-auth` to fire and wipe the valid session from localStorage before the session-URL navigation could complete
- Added `_expectingSession` guard flag to ignore stale `gas-needs-auth` messages when a session navigation is in flight

#### `testauth1.html` — v01.07w

##### Fixed
- Fixed page refresh dropping authenticated session — `srcdoc` is now removed in the session-resume branch (same fix as the no-session branch), and stale `gas-needs-auth` messages are ignored during session navigation

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template)

##### Fixed
- Same session persistence fix propagated to the auth template

## [v02.41r] — 2026-03-12 02:33:17 PM EST

### Fixed
- Strengthened auth race condition fix — removed `srcdoc` attribute and deleted `window._r` before setting iframe to `about:blank`, preventing the queued srcdoc script from navigating to the bare GAS URL (the prior `src`-only fix was ineffective because HTML spec gives `srcdoc` priority over `src`)

#### `testauth1.html` — v01.06w

##### Fixed
- Prevented iframe `srcdoc` script from overriding the `about:blank` navigation — `srcdoc` is now removed and `window._r` deleted before cancelling the iframe load

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template)

##### Fixed
- Same strengthened auth race condition fix propagated to the auth template

## [v02.40r] — 2026-03-12 02:21:14 PM EST

### Fixed
- Fixed auth race condition causing false "Session expired" error on initial page load — the GAS iframe was navigating to the bare deployment URL before Google Sign-In could obtain a token, triggering a premature `gas-needs-auth` message. The iframe is now held on `about:blank` until a token is available for exchange

#### `testauth1.html` — v01.05w

##### Fixed
- Prevented premature iframe navigation when no local session exists — avoids the misleading "Session expired" error on first visit

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template)

##### Fixed
- Same auth initialization race condition fix propagated to the auth template

## [v02.39r] — 2026-03-12 01:53:19 PM EST

### Fixed
- Fixed auth flow not loading the app after sign-in — the iframe was not reloaded with the session token after URL-path token exchange, leaving the exchange response HTML visible instead of the app UI
- Added debug logging to GAS exchange response to trace postMessage delivery

#### `testauth1.html` — v01.04w

##### Fixed
- After successful token exchange, the iframe now reloads with the session token (previously only happened for postMessage exchange path)

#### `testauth1.gs` — v01.04g

##### Fixed
- Added browser-side debug logging to the token exchange response to diagnose postMessage delivery issues

## [v02.38r] — 2026-03-12 01:43:25 PM EST

### Fixed
- Fixed GAS postMessage not reaching parent page — Apps Script's sandbox iframe wrapper intercepts `window.parent.postMessage`; switched all GAS scripts and templates to use `window.top.postMessage` which bypasses the sandbox and reaches the embedding page directly

#### `testauth1.gs` — v01.03g

##### Fixed
- Fixed postMessage communication being intercepted by Google's iframe sandbox — messages now reach the embedding page correctly

## [v02.37r] — 2026-03-12 01:30:39 PM EST

### Fixed
- Fixed Google sign-in completing but auth wall persisting — the decoded GAS deployment URL was being deleted before the auth token exchange could use it
- Preserved GAS deployment URL in iframe `data-base-url` attribute so auth token exchange can reload the iframe after sign-in

#### `testauth1.html` — v01.03w

##### Fixed
- Fixed sign-in flow failing after Google popup closes — deployment URL now persists for token exchange

#### `index.html` — v01.02w

##### Changed
- Minor internal improvements

#### `testenvironment.html` — v01.02w

##### Changed
- Minor internal improvements

## [v02.36r] — 2026-03-12 01:22:58 PM EST

### Added
- Added console.log auth flow debugging to testauth1 HTML page to trace sign-in postMessage flow
- Added try-catch around GAS `exchangeTokenForSession()` so server errors are sent back as `gas-session-created` with error details instead of crashing silently

#### `testauth1.html` — v01.02w

##### Added
- Added console.log debugging at key auth flow points (token response, exchange URL, postMessage listener)

#### `testauth1.gs` — v01.02g

##### Fixed
- Wrapped token exchange in try-catch to prevent silent server errors from breaking the sign-in flow

## [v02.35r] — 2026-03-12 01:11:52 PM EST

### Added
- Added visible debug marker ("1") to GAS iframe output to diagnose whether iframe loads after auth

#### `testauth1.gs` — v01.01g

##### Added
- Added centered debug marker to verify iframe loading after authentication

## [v02.34r] — 2026-03-12 01:03:01 PM EST

### Fixed
- Updated testauth1 OAuth Client ID to a user-created credential with authorized JavaScript origins for GitHub Pages (Apps Script auto-generated client IDs cannot be modified)

#### `testauth1.html` — v01.01w

##### Fixed
- Fixed Google OAuth sign-in — replaced locked Apps Script-managed Client ID with user-created OAuth credential that authorizes the GitHub Pages origin

## [v02.33r] — 2026-03-12 12:11:25 PM EST

### Fixed
- Fixed `setup-gas-project.sh` Python boolean serialization — `parse_json()` now normalizes `True`/`False` to lowercase `true`/`false` for bash comparison
- Fixed Phase 7 (REPO-ARCHITECTURE.md update) — replaced references to nonexistent Mermaid node IDs with actual current patterns derived from the live diagram
- Fixed Phase 8 (README.md tree update) — replaced plain-text tree entries with full HTML `<a>` link format matching the current README structure
- Fixed HTML `<title>` replacement — changed from fragile string match to tag-based `<title>.*</title>` replacement

### Added
- Added Phase 5b — automatic per-environment diagram creation (`repository-information/diagrams/`) with auth-aware content (Google OAuth sequence section when `INCLUDE_AUTH=true`)
- Added diagram file to Phase 11 verification array and summary output
- Added `YOUR_CLIENT_ID` and `YOUR_DEPLOYMENT_ID` to template placeholder check

## [v02.32r] — 2026-03-12 11:55:11 AM EST

### Added
- Set up new GAS project `testauth1` with Google OAuth authentication (standard preset)
- Created `testauth1.html` embedding page from auth template with encoded deployment URL
- Created `testauth1.gs` GAS script from minimal-auth template with OAuth config
- Created `testauth1.config.json` project config
- Created version files (`testauth1html.version.txt`, `testauth1gs.version.txt`), changelogs, and changelog archives
- Added `testauth1-diagram.md` per-environment architecture diagram (auth sequence)
- Added Deploy Testauth1 webhook step to auto-merge workflow
- Registered Testauth1 in GAS Projects table

### Fixed
- Fixed setup script creating noauth files when auth was requested (Python `False` vs bash `true` string comparison) — recreated files from correct auth templates
- Fixed SPREADSHEET_ID placeholder comparison checks in generated GAS file — sed was replacing both the variable value and the guard-clause string literals, causing guard clauses to always evaluate true

#### `testauth1.html` — v01.00w

##### Added
- New auth-enabled page for testauth1title with Google OAuth sign-in

#### `testauth1.gs` — v01.00g

##### Added
- New auth-enabled GAS web app with OAuth token exchange and audit logging

## [v02.31r] — 2026-03-12 11:21:23 AM EST

### Fixed
- Fixed `ALLOWED_DOMAINS` replacement in `copyGsCode` to use global regex — previously only injected domains into the `standard` preset, leaving `hipaa` preset with empty `[]` (causing a runtime error when hipaa was selected with domains)
- Fixed `ENABLE_DOMAIN_RESTRICTION` replacement in `copyGsCode` to use global regex — same issue, only flipped the first preset
- Guarded `SPREADSHEET_ID` replacement in `copyGsCode` and `setup-gas-project.sh` to only run when auth is enabled — noauth templates don't have this variable
- Guarded `SPREADSHEET_ID` in `copyConfig` JSON output to only include when auth is enabled

#### `gas-project-creator.html` — v01.08w

##### Fixed
- Domain settings now correctly apply to all authentication presets
- Spreadsheet ID field no longer included in configuration when authentication is disabled

## [v02.30r] — 2026-03-12 10:25:57 AM EST

### Changed
- Updated GAS Project Creator page to support new Unified Toggleable Auth Pattern (pattern 6) templates
- Added OAuth Client ID, Auth Preset (standard/hipaa), and Allowed Domains form fields for auth configuration
- Auth setup instructions (OAuth consent screen, client ID creation) now shown conditionally when auth is enabled
- Updated `copyGsCode` to inject auth-specific config (preset, allowed domains, domain restriction) into auth templates
- Updated `copyConfig` to include `CLIENT_ID`, `AUTH_PRESET`, and `ALLOWED_DOMAINS` in the JSON output for `setup-gas-project.sh`
- Updated `setup-gas-project.sh` to parse and apply auth config fields (CLIENT_ID in HTML, ACTIVE_PRESET and ALLOWED_DOMAINS in GAS)

#### `gas-project-creator.html` — v01.07w

##### Changed
- Added authentication configuration section with OAuth Client ID, preset selector, and domain restriction fields
- Auth-specific setup steps now appear when Google Authentication checkbox is enabled
- Copy Code.gs now injects auth preset and domain restriction settings into auth template code
- Copy Config for Claude now includes auth settings in the JSON output

## [v02.29r] — 2026-03-12 10:10:19 AM EST

### Changed
- Rewrote all three auth template files from scratch using the Unified Toggleable Auth Pattern (pattern 6): `HtmlAndGasTemplateAutoUpdate-auth.html.txt`, `gas-minimal-auth-template-code.js.txt`, `gas-test-auth-template-code.js.txt`
- Auth templates now use noauth counterparts as exact baseline with clearly separated `AUTH START/END` and `AUTH CONFIG` section markers
- Replaced flat auth variables with unified `PRESETS` + `resolveConfig()` + `AUTH_CONFIG` config-driven system (`standard` and `hipaa` presets)
- Added toggle-gated features: domain restriction, audit logging, HMAC session integrity, emergency access, postMessage token exchange, sessionStorage, inactivity timeout, auto-signout
- Added dual token exchange paths: URL parameter (standard) and postMessage three-phase handshake (HIPAA)
- Added storage abstraction layer controlled by `HTML_CONFIG.STORAGE_TYPE` toggle
- Added dedicated `gas-signed-out` message type (replaces old `gas-needs-auth` for sign-out)
- Moved `doGet()` from TEMPLATE section to AUTH section in GAS templates (requires auth routing logic)

## [v02.28r] — 2026-03-12 09:28:34 AM EST

### Added
- Created `06-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md` — unified config-driven authentication pattern combining patterns 3–5 into a single toggleable codebase (19 sections, ~2100 lines). Features: `AUTH_CONFIG` + `HTML_CONFIG` config objects with `standard` and `hipaa` presets, toggle-gated features (domain restriction, audit logging, HMAC integrity, emergency access, postMessage exchange, sessionStorage, inactivity timeout, auto-signout), config resolution with shallow merge and HIPAA validation, complete GAS backend and HTML shell implementations, postMessage three-phase handshake protocol, CacheService behavioral caveats, security checklist, migration guide from patterns 3/4/5, feature toggle matrix with HIPAA regulation mapping, six-pattern comparison table, and troubleshooting guide

## [v02.27r] — 2026-03-12 08:38:09 AM EST

### Changed
- Renamed 5 auth pattern files with numeric prefixes for ordered reading: `CUSTOM-AUTH-PATTERN.md` → `01-CUSTOM-AUTH-PATTERN.md`, `GOOGLE-OAUTH-AUTH-PATTERN.md` → `02-GOOGLE-OAUTH-AUTH-PATTERN.md`, `IMPROVED-GOOGLE-OAUTH-PATTERN.md` → `03-IMPROVED-GOOGLE-OAUTH-PATTERN.md`, `RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` → `04-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md`, `HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` → `05-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md`
- Updated all internal cross-references between pattern files to use new prefixed filenames
- Added missing `05-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` entry to README.md tree

## [v02.26r] — 2026-03-12 01:19:24 AM EST

### Added
- Created `HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` — HIPAA-compliant OAuth pattern building on the Researched Improved pattern, addressing all identified regulatory gaps: audit logging to Google Sheet (45 CFR 164.312(b)), Workspace-only domain restriction (BAA coverage), 15-minute session timeout (164.312(a)(2)(iii)), postMessage-based token exchange (RFC 6750 §2.3 compliance), sessionStorage instead of localStorage, HMAC-SHA256 session data integrity (164.312(c)(1)), emergency access procedure via Script Properties (164.312(a)(2)(ii)), mandatory client-side inactivity timeout, MFA enforcement strategy via Workspace Admin Console, and full HIPAA compliance mapping table covering all 45 CFR 164.312 sections

## [v02.25r] — 2026-03-11 11:04:20 PM EST

### Added
- Created `RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md` — research-validated OAuth pattern fixing origin validation vulnerability (`includes()` → strict `endsWith()` hostname suffix match), adding interactive re-auth fallback for `prompt: ''` failures, documenting CacheService behavioral caveats (best-effort TTL, max 21600s, no getTimeToLive), and including a full delta from the Improved pattern

## [v02.24r] — 2026-03-11 09:55:17 PM EST

### Changed
- Rewrote all 3 auth template files to implement the IMPROVED-GOOGLE-OAUTH-PATTERN, starting from noauth baselines rather than modifying existing basic auth code
- Auth HTML template now uses GIS OAuth2 token flow (not credential/JWT), origin-validated postMessage, opaque UUID session tokens in localStorage, auth wall overlay, inactivity timeout, and silent re-auth
- Auth GAS templates (minimal and test) now use server-side session management via CacheService with opaque UUID tokens, server-side Google token validation via googleapis.com/oauth2/v3/userinfo, configurable session TTL, single-session enforcement, and spreadsheet-based authorization

## [v02.23r] — 2026-03-11 09:13:02 PM EST

### Changed
- Updated "Imported Skills — Do Not Modify" rule to permit reference name updates (e.g. renamed template filenames) in addition to location pointers — applied without flagging as they are mechanical, not behavioral
- Updated imported frontend-design skill with new HTML template filenames

## [v02.22r] — 2026-03-11 09:03:31 PM EST

### Added
- Template variation matrix: 4 GAS templates (minimal/test × auth/noauth) and 2 HTML templates (auth/noauth) covering all gas-project-creator checkbox combinations
- Google Authentication support in GAS templates: `ALLOWED_DOMAIN` variable, domain restriction in `doGet()`, user email display, access denied page
- Google Identity Services (GIS) sign-in gate in auth HTML template: JWT decoding, sessionStorage persistence, domain restriction, auth overlay
- `INCLUDE_TEST` and `INCLUDE_AUTH` fields in gas-project-creator JSON config output for template selection

### Changed
- Gas-project-creator now loads 4 GAS template variants (was 2) and selects based on both test and auth checkboxes
- `setup-gas-project.sh` selects template based on `INCLUDE_TEST` and `INCLUDE_AUTH` config fields
- Updated all template references across CLAUDE.md, rules files, skills, CONTRIBUTING.md, README tree, REPO-ARCHITECTURE.md diagram, and IMPROVEMENTS.md

### Removed
- Deleted `HtmlAndGasTemplateAutoUpdatehtml.version.txt` (unused template version file)
- Deleted old template files replaced by auth/noauth variants: `HtmlAndGasTemplateAutoUpdate.html.txt`, `gas-minimal-template-code.js.txt`, `gas-test-template-code.js.txt`

#### `gas-project-creator.html` — v01.06w

##### Changed
- Template loading now fetches all 4 GAS template variants based on both test and auth checkbox selections
- Config JSON output includes `INCLUDE_TEST` and `INCLUDE_AUTH` fields for automated template selection

## [v02.21r] — 2026-03-11 08:06:00 PM EST

### Added
- Google Authentication checkbox placeholder on GAS project creator page (checked by default, not yet wired up — will control auth gate in both GAS & HTML templates)

#### `gas-project-creator.html` — v01.05w

##### Added
- New checkbox option for Google Authentication (placeholder for future template integration)

## [v02.20r] — 2026-03-11 07:46:13 PM EST

### Changed
- Clarified GAS template checkbox wording on project creator page — "full-featured UI" → "test/diagnostic features" to indicate the checked option is for verifying Google connections, not production use

#### `gas-project-creator.html` — v01.04w

##### Changed
- Template selection checkbox label updated to clarify test/diagnostic purpose

## [v02.19r] — 2026-03-11 07:38:27 PM EST

### Added
- Template selection checkbox on GAS project creator page — defaults to minimal template (version display + auto-update only), checkbox enables full-featured template (sound, quotas, sheet embed, buttons)

### Changed
- Renamed `gas-project-creator-code.js.txt` → `gas-test-template-code.js.txt` and made `gas-minimal-template-code.js.txt` the default GAS template across the repo (setup script, CLAUDE.md Pre-Commit #19, rules files, skills, README tree, REPO-ARCHITECTURE.md diagram)

#### `gas-project-creator.html` — v01.03w

##### Added
- Template selection checkbox — choose between minimal (version + auto-update only) or full-featured (sound, quotas, sheet embed, buttons) GAS template when copying Code.gs

## [v02.18r] — 2026-03-11 07:23:14 PM EST

### Added
- Created `live-site-pages/templates/gas-minimal-template-code.js.txt` — minimal GAS template that strips all visible features (sound, vibrate, quotas, sheet iframe, B1 polling, buttons) while preserving the version display in the bottom-left corner and the full auto-update mechanism (pullAndDeployFromGitHub, postMessage version-check listener, doPost deploy action)

### Changed
- Updated README.md tree and REPO-ARCHITECTURE.md diagram to include the new minimal GAS template

## [v02.17r] — 2026-03-11 07:05:44 PM EST

### Changed
- Restructured `IMPROVED-GOOGLE-OAUTH-PATTERN.md` with GAS-heavy design philosophy — added "GAS vs HTML Responsibility Split" section (Section 3) showing ~80% of auth logic in GAS backend vs ~20% irreducible browser minimum in HTML, renamed HTML section to "Minimal HTML Shell" with explicit callouts on why each piece must be browser-side, added auth-logic split percentages to Three-Pattern Comparison table, and added security checklist items verifying no auth logic leaks into the wrapper

## [v02.16r] — 2026-03-11 06:55:13 PM EST

### Added
- Created `repository-information/IMPROVED-GOOGLE-OAUTH-PATTERN.md` — improved Google OAuth authentication pattern combining GIS OAuth2 sign-in with server-side session management (CacheService), eliminating client-side token exposure, adding configurable session TTL, automatic token refresh, origin-validated postMessage, and optional single-session enforcement and inactivity timeout

## [v02.15r] — 2026-03-11 06:42:02 PM EST

### Added
- Created `repository-information/GOOGLE-OAUTH-AUTH-PATTERN.md` — comprehensive reference documenting the Google Identity Services (GIS) OAuth2 authentication pattern derived from `testaed.gs` + `testaed.html`, including OAuth2 token flow, server-side validation via Google's userinfo API, spreadsheet-based authorization, postMessage protocol, and comparison with the Custom Auth pattern

## [v02.14r] — 2026-03-11 04:15:02 PM EST

### Changed
- Renamed `GOOGLE-AUTH-PATTERN.md` to `CUSTOM-AUTH-PATTERN.md` — clarifies that this is a custom username/password auth system, not Google OAuth/SSO
- Updated file title, description, and README tree entry to reflect the rename

## [v02.13r] — 2026-03-11 03:52:24 PM EST

### Added
- Created `repository-information/GOOGLE-AUTH-PATTERN.md` — comprehensive reference documenting the Google Apps Script authentication pattern (session tokens, custom domain iframe wrapper, login flow, security features) derived from `dchrcalendar.gs` + `dchrcalendar.html` for future implementation reuse

### Changed
- Rotated 23 sections from 2026-03-08 date group to CHANGELOG-archive.md (archive rotation triggered at 112 sections)

## [v02.12r] — 2026-03-11 02:35:52 PM EST

### Changed
- Moved Commands section in README.md from above Project Structure to below it
- Added Origin column (Custom / Imported / Bundled) to all three command tables indicating the source of each command

## [v02.11r] — 2026-03-11 02:32:16 PM EST

### Fixed
- Rotated v01.01r (2026-03-07) date group from CHANGELOG.md to CHANGELOG-archive.md — was missed in previous push due to incorrect rotation logic short-circuit

### Changed
- Added "Mandatory first rotation" step (step 4) to CHANGELOG-archive.md rotation logic — prevents skipping directly to the non-exempt re-check without rotating at least one date group when the trigger fires
- Updated CLAUDE.md Pre-Commit #6 archive rotation quick rule to explicitly state that at least one date group must be rotated when the trigger fires
- Updated SHA enrichment step reference in CLAUDE.md from step 5 to step 6 (renumbered after new step insertion)

## [v02.10r] — 2026-03-11 02:25:09 PM EST

### Added
- Added "Commands" section to README.md above Project Structure — lists all 16 slash commands and conversational commands organized into Repo Workflow, Code Quality, and Design & Tooling categories with descriptions and links to skill files

## [v02.09r] — 2026-03-11 01:59:47 PM EST

### Removed
- Removed `STATUS.md` entirely — was redundant with the README tree which already shows versions, links, and origin labels
- Removed Pre-Commit #5 (STATUS.md version sync) and renumbered all subsequent items (#6→#5, #7→#6, ..., #20→#19)
- Removed STATUS.md handling from `init-repo.sh` (file list, Phase 3 placeholder, Origin column update)
- Removed Phase 7 (STATUS.md updates) from `setup-gas-project.sh` and renumbered subsequent phases
- Removed STATUS.md from `gas-project-creator-diagram.md` CL4 node and regenerated mermaid.live URL
- Removed STATUS.md references from CLAUDE.md cross-references (Template Variables, Template Repo Guard, MULTI_SESSION_MODE, Reconcile, Repo Audit, Setup GAS Project, Initialize)
- Removed STATUS.md references from repo-docs.md, html-pages.md, init-scripts.md, SUPPORT.md, TOKEN-BUDGETS.md, initialize SKILL.md, reconcile SKILL.md
- Removed STATUS.md entry from README.md structure tree
- Removed STATUS.md relationship from REPO-ARCHITECTURE.md ER diagram and regenerated mermaid.live URL

## [v02.08r] — 2026-03-11 10:43:20 AM EST

### Added
- Added mermaid.live link to testenvironment per-environment diagram (was missing)
- Added explicit mermaid.live link reminder to the "Adding new pages" checklist in `repo-docs.md`

## [v02.07r] — 2026-03-11 10:32:21 AM EST

### Changed
- Expanded Pre-Commit #6 to trigger on behavioral/functional code changes that affect diagrams — not just structural (file add/move/delete) changes. Diagrams now must be checked and updated whenever code they depict is modified (e.g. polling logic, CI/CD steps, GAS behavior)
- Updated `repo-docs.md` diagram scope description to match the expanded trigger

## [v02.06r] — 2026-03-11 10:22:38 AM EST

### Changed
- Replaced template-identity labels in REPO-ARCHITECTURE.md diagrams with generic labels — mindmap root `Template Repo` → `System Architecture`, git graph initial commit `Template repo` → `Initial commit` — so diagrams are accurate on both template and forks without requiring init-time changes

## [v02.05r] — 2026-03-11 10:05:48 AM EST

### Added
- Added "Diagram accuracy requirements" rule to `repo-docs.md` — 7 criteria for ensuring all diagrams faithfully represent actual source code: cross-reference against source, no invented interactions, server-side vs client-side distinction, real code path mapping, accurate timing/sequencing, maintenance mode structural accuracy, and mermaid.live URL verification

## [v02.04r] — 2026-03-11 10:02:26 AM EST

### Changed
- Fixed inaccurate GAS Self-Update Loop in REPO-ARCHITECTURE.md sequence diagram (section 2) — removed false `postMessage({type: gas-reload})` and `Reload GAS iframe` steps; replaced with accurate two-phase flow: server-side GAS self-update (triggered by workflow POST) and client-side GAS version polling (gs.version.txt polling triggers full page reload, not iframe-only reload)

## [v02.03r] — 2026-03-11 09:53:21 AM EST

### Changed
- Rewrote template-level state diagram in REPO-ARCHITECTURE.md section 3 for accuracy — replaced simplified abstraction with faithful state machines showing HTML version polling (with maintenance mode as conditional branch), GAS version polling (with anti-sync mechanism and 15s initial delay), post-reload splash/sound lifecycle, and audio unlock lifecycle

## [v02.02r] — 2026-03-11 09:37:46 AM EST

### Changed
- Replaced combined flowchart in REPO-ARCHITECTURE.md section 3 with a `stateDiagram-v2` showing Auto-Refresh Loop, GAS Iframe interaction, and Maintenance Mode as template-level state machines
- Updated environment scope rule in `repo-docs.md` to include maintenance mode in the template-level exception

## [v02.01r] — 2026-03-11 09:32:02 AM EST

### Changed
- Combined auto-refresh loop and GAS self-update loop into a single unified template behaviors diagram in REPO-ARCHITECTURE.md section 3, showing the connection between the two loops (GAS postMessage triggers browser reload)
- Added mermaid.live interactive editor link for the combined template behaviors diagram

## [v02.00r] — 2026-03-11 09:20:23 AM EST

### Changed
- Re-added auto-refresh loop and GAS self-update loop diagrams to REPO-ARCHITECTURE.md section 3 as template-level behaviors — these are inherited by all pages via the HTML/GAS templates and only change when templates change
- Added auto-refresh polling and GAS self-update sequences back to the sequence diagram (section 2) as template behaviors
- Updated environment scope rule in `repo-docs.md` to clarify that template-level behaviors (auto-refresh, GAS self-update) belong in REPO-ARCHITECTURE.md while environment-specific internals remain in per-environment diagrams

## [v01.99r] — 2026-03-11 09:10:29 AM EST

### Changed
- Simplified REPO-ARCHITECTURE.md to show environments as nodes without internal processes — auto-refresh loops, GAS self-update loops, and page lifecycle states moved to per-environment diagrams in `repository-information/diagrams/`
- Replaced detailed file-listing subgraphs with collapsed environment nodes and shared resource groups
- Simplified sequence diagram to deploy flow and runtime data flow only (removed internal loop details)
- Replaced state diagram section with per-environment diagram reference table
- Added `ENV_DIAGRAM` entity to ER diagram and `EnvironmentDiagram` class to class diagram showing the per-environment documentation relationship
- Added environment scope rule to `repo-docs.md` — REPO-ARCHITECTURE.md must not include environment-internal processes going forward

## [v01.98r] — 2026-03-11 08:55:52 AM EST

### Changed
- Renamed `ARCHITECTURE.md` to `REPO-ARCHITECTURE.md` — updated all references across 14 files (CLAUDE.md, README.md, SUPPORT.md, TOKEN-BUDGETS.md, SESSION-CONTEXT.md, CHANGELOG.md, repo-docs.md, html-pages.md, init-repo.sh, setup-gas-project.sh, new-page skill, diff-review skill, skill-creator skill, gas-project-creator-diagram.md)
- Renamed README sub-dividers from "Internal Use" → "Internal Sites" and "External Use" → "External Sites"

## [v01.97r] — 2026-03-11 08:39:01 AM EST

### Changed
- Swapped emoji order from `🟢🌐` to `🌐🟢` (and `🟡🌐` to `🌐🟡`) in end-of-response URL labels across chat-bookends rules
- Added "Public Website", "Internal Use", and "External Use (Placeholder)" sub-dividers to README project structure under live-site-pages

## [v01.96r] — 2026-03-11 08:17:52 AM EST

### Fixed
- Updated GitHub Actions to Node.js 24-compatible versions: `actions/checkout@v4` → `@v5`, `actions/upload-pages-artifact@v3` → `@v4`

## [v01.95r] — 2026-03-11 08:08:09 AM EST

### Changed
- Renamed "test" environment to "testenvironment" — all files, directories, and references updated across the repo (HTML page, GAS script, config, changelogs, version files, diagram, workflow, README tree, STATUS.md, REPO-ARCHITECTURE.md, gas-scripts.md)

## [v01.94r] — 2026-03-10 01:53:27 PM EST

### Changed
- Standardized "missing resource" emoji in README project structure tree: 🔸 = no spreadsheet, ◽ = no folder, 🔻 = no GAS

## [v01.93r] — 2026-03-10 01:48:24 PM EST

### Changed
- Replaced 🪫 (low battery) with ◽ (white square) for pages with no GAS project in README project structure tree

## [v01.92r] — 2026-03-10 01:42:19 PM EST

### Changed
- Added spacer rows between page entries in README project structure tree for visual separation

## [v01.91r] — 2026-03-10 01:36:10 PM EST

### Changed
- Reordered stoplight emoji in README project structure tree — 🌐 now comes first, status indicator (🟢/🟡/🔴) follows immediately with no space

## [v01.90r] — 2026-03-10 01:13:03 PM EST

### Added
- Added 🟢/🟡/🔴 status emoji indicators to page entries in README.md project structure tree — derived from html.version.txt status field

## [v01.89r] — 2026-03-10 10:24:18 AM EST

### Added
- Added page status emoji indicators to URL sections in chat output — 🟢 Active, 🟡 Maintenance, 🔴 Inactive — derived from html.version.txt first field
- Added inactive mode support for html.version.txt (complements existing maintenance mode)

### Changed
- Updated all page label formats in chat-bookends.md and chat-bookends-reference.md to include status emoji before the 🌐 prefix

## [v01.88r] — 2026-03-10 10:05:24 AM EST

### Added
- Added "Diff Rules Command" to CLAUDE.md — compares fork rules against template to identify added, modified, and removed rules
- Added backporting workflow instructions (fork → template and template → fork) with user prompts

## [v01.87r] — 2026-03-10 09:37:49 AM EST

### Added
- Added 🧜‍♀️ architecture diagram link to the root `saistemplateprojectrepo/` line in README tree

## [v01.86r] — 2026-03-10 09:27:17 AM EST

### Changed
- Replaced 🔹 with 🪫 as the "no GAS file" placeholder in README tree

## [v01.85r] — 2026-03-10 09:23:16 AM EST

### Added
- Added ⛽ GAS script link icon to README tree page entries (linked to corresponding .gs file, 🔹 placeholder for pages without GAS)

## [v01.84r] — 2026-03-10 09:04:10 AM EST

### Added
- Repo version changelog link on the repository root line in README tree

## [v01.83r] — 2026-03-10 08:50:41 AM EST

### Changed
- Reordered README tree icon cluster: webpage → spreadsheet → drive folder → diagram (🌐 · 📊 · 🔸 · 🧜‍♀️)

## [v01.82r] — 2026-03-10 08:39:43 AM EST

### Changed
- Updated README tree icon cluster: 📊→🧜‍♀️ for diagrams, 📋→📊 for spreadsheets, ✕→🔻 for no spreadsheet, ◇→🔸 for no drive folder

## [v01.81r] — 2026-03-10 12:30:32 AM EST

### Changed
- Replaced `╌` with `✕` (thin x) for missing spreadsheet placeholder in README tree
- Replaced non-linked `📁` with `◇` (white diamond) for missing folder placeholder in README tree
- Updated icon cluster rules in `repo-docs.md` with `✕` and `◇` placeholder conventions

## [v01.80r] — 2026-03-10 12:20:43 AM EST

### Changed
- Restored `→` arrow before icon cluster in README tree page entries
- Replaced 🚫 with subtle `╌` placeholder for missing spreadsheet links
- Added 📁 Google Drive folder icon (placeholder) to all page entries in README tree
- Updated icon cluster rule in `repo-docs.md` with 📁 and `╌` conventions

## [v01.79r] — 2026-03-10 12:13:41 AM EST

### Changed
- Reorganized README tree page entries: grouped action icons (🌐 · 📊 · 📋) together with `·` separators between `—` delimiters
- Replaced `📋✖` two-character placeholder with single 🚫 emoji for pages without a spreadsheet
- Consolidated icon cluster rules in `repo-docs.md` into a single unified section

## [v01.78r] — 2026-03-10 12:10:30 AM EST

### Added
- 📋✖ placeholder for pages without an associated spreadsheet in README tree (gas-project-creator)
- Documented the 📋✖ no-spreadsheet placeholder convention in `repo-docs.md`

## [v01.77r] — 2026-03-10 12:06:53 AM EST

### Added
- Spreadsheet 📋 emoji links in README tree for pages with associated GAS spreadsheets (index, test)
- README tree spreadsheet links rule in `repo-docs.md` documenting the 📋 convention

## [v01.76r] — 2026-03-09 11:58:02 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Replaced live site URL text labels (`index`, `test`, `gas-project-creator`) with 🌐 globe emoji in README tree
- Changed diagram link separator from `· 📊 |` to `| 📊 |` in README tree page entries
- Added 🌐 globe emoji prefix to all page URL labels in end-of-response block rules and examples (`chat-bookends.md` and `chat-bookends-reference.md`)
- Added README tree rules for 🌐 live site links and updated 📊 diagram link separator format in `repo-docs.md`

## [v01.75r] — 2026-03-09 11:47:30 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Replaced `diagram` text labels with 📊 emoji in README tree page entries for diagram links
- Updated mermaid diagram rule in `.claude/rules/repo-docs.md` to specify 📊 emoji format

## [v01.74r] — 2026-03-09 11:39:47 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- mermaid.live interactive editor links for all 3 page diagrams (`index-diagram.md`, `test-diagram.md`, `gas-project-creator-diagram.md`)
- Diagram links in README tree next to each page's version numbers (clickable `diagram` link)
- "Mermaid Diagrams — mermaid.live Links" rule in `.claude/rules/repo-docs.md` — requires mermaid.live links on all diagrams going forward

### Changed
- Moved `diagrams/` directory in README tree to sit directly after `REPO-ARCHITECTURE.md` for logical grouping

## [v01.73r] — 2026-03-09 11:32:09 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- `repository-information/diagrams/` directory for per-page architecture diagrams (kept private, not deployed to GitHub Pages)
- `index-diagram.md` — component interaction diagram showing auto-refresh, splash screens, audio system, maintenance mode, and changelog popups
- `test-diagram.md` — sequence diagram showing dual HTML+GAS polling, iframe injection flow, and anti-sync protection
- `gas-project-creator-diagram.md` — user flow diagram showing the full GAS project setup workflow from account setup through Claude Code integration

## [v01.72r] — 2026-03-09 11:11:20 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- End-of-response URL sections were missing `test.html` and `gas-project-creator.html` — pages were listed from memory instead of discovered from filesystem

### Added
- "Page Enumeration — Mandatory Discovery" rule in `.claude/rules/chat-bookends.md` — requires running `ls live-site-pages/*.html` and reading actual version files before writing URL sections, preventing omission of pages

## [v01.71r] — 2026-03-09 11:07:23 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Mermaid.live URL generation documentation in `.claude/rules/repo-docs.md` — covers pako encoding process, npm dependencies, generation commands, safe URL replacement via Python regex, mandatory verification, and 6 common failure modes with solutions

## [v01.70r] — 2026-03-09 11:04:18 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Mermaid Diagram Compatibility Reference in `.claude/rules/repo-docs.md` — documents rendering support, dark-mode text fixes, and theme requirements for all 9 REPO-ARCHITECTURE.md diagram types

## [v01.69r] — 2026-03-09 10:59:19 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Switched Mindmap to `base` theme with `cScaleInv` overrides to force black text on all node levels including leaf nodes

## [v01.68r] — 2026-03-09 10:56:33 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Made Mindmap root node text black for readability — added `primaryColor` and `primaryTextColor` overrides to lighten the root circle and darken its label

## [v01.67r] — 2026-03-09 10:51:06 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Replaced neutral theme with custom pastel color scale for Mindmap — restores colorful appearance while keeping all text readable on dark backgrounds

## [v01.66r] — 2026-03-09 10:48:33 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed Mindmap dark-mode readability by adding neutral theme directive — forces light backgrounds on all node levels

## [v01.65r] — 2026-03-09 10:45:21 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed corrupted Sequence diagram mermaid.live link (regenerated from source)
- Fixed Mindmap dark-mode readability on GitHub by using cloud-shaped nodes for second-level categories

## [v01.64r] — 2026-03-09 10:37:06 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added 7 new diagram sections to REPO-ARCHITECTURE.md: State (page lifecycle), Git Graph (branching strategy), Architecture (system topology, mermaid.live only), C4 Context (system boundaries, mermaid.live only), Mindmap (concept hierarchy), ER (file dependencies), Class (component model)
- All GitHub-supported diagrams include both inline mermaid blocks and mermaid.live links
- Reorganized REPO-ARCHITECTURE.md with numbered sections (1-9) ranked by usefulness

## [v01.63r] — 2026-03-09 10:27:12 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added inline Sequence diagram to REPO-ARCHITECTURE.md (GitHub-rendered mermaid block with mermaid.live link)

## [v01.62r] — 2026-03-09 10:20:06 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Restructured Architecture diagram layout from horizontal to vertical flow for better readability

## [v01.61r] — 2026-03-09 10:16:20 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed Architecture diagram link in REPO-ARCHITECTURE.md (simplified to flat groups, removed special characters from labels)

## [v01.60r] — 2026-03-09 10:11:51 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed Architecture diagram link in REPO-ARCHITECTURE.md (replaced `-->` arrow syntax with `--` plain edges for mermaid.live compatibility)

## [v01.59r] — 2026-03-09 10:05:10 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed C4 Context and Architecture diagram links in REPO-ARCHITECTURE.md (simplified syntax for mermaid.live compatibility)

### Removed
- Removed copy-code-for-mermaid.live details block from REPO-ARCHITECTURE.md (redundant with working link)

## [v01.58r] — 2026-03-09 09:54:51 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- C4 Context, Sequence, and Architecture diagram links in REPO-ARCHITECTURE.md — alternative mermaid.live views of the repo's system interactions

## [v01.57r] — 2026-03-09 08:31:56 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Reorganized README `.claude/` section: moved `settings.json` to top of folder listing, added Skills sub-divider before `skills/` directory, updated tree connectors

## [v01.56r] — 2026-03-09 03:22:47 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Simplified commit message format (Pre-Commit #9) — push commits now show only the repo version prefix (`v01.XXr`), no longer append `g`/`w` version prefixes

## [v01.55r] — 2026-03-09 03:12:42 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Swapped splash screen colors: "Website Ready" is now green (#1b5e20), "Code Ready" is now blue (#0d47a1) — applied across all pages and template
- Updated color references in README, REPO-ARCHITECTURE.md comments, html-pages.md rules, and new-page skill

#### `index.html` — v01.01w

##### Changed
- "Website Ready" splash screen changed to green, "Code Ready" splash changed to blue

#### `test.html` — v01.01w

##### Changed
- "Website Ready" splash screen changed to green, "Code Ready" splash changed to blue

#### `gas-project-creator.html` — v01.02w

##### Changed
- "Website Ready" splash screen changed to green, "Code Ready" splash changed to blue

## [v01.54r] — 2026-03-09 02:46:48 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Documented mermaid.live URL regeneration safeguards in CLAUDE.md Pre-Commit #6 — added mandatory verification step (Python decompression check), corruption prevention guidance (use temp file instead of manual copy-paste), and Edit tool corruption warning

## [v01.53r] — 2026-03-09 02:40:34 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed single-character corruption in mermaid.live URL in REPO-ARCHITECTURE.md (position 1102: 'F' → 'H') — URL now decompresses correctly and loads the diagram in the interactive editor

## [v01.52r] — 2026-03-09 02:16:06 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed mermaid.live URL encoding — switched from Python zlib to Node.js pako + js-base64 libraries (the exact same libraries mermaid.live uses) to ensure URL compatibility

### Changed
- Updated CLAUDE.md Pre-Commit #6 mermaid.live regeneration script to use Node.js with actual pako + js-base64 npm packages instead of Python zlib

## [v01.51r] — 2026-03-09 01:59:20 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed mermaid.live URL encoding — switched to zlib compression with header + URL-safe base64 (matching the actual pako format mermaid.live expects)

### Changed
- Updated CLAUDE.md Pre-Commit #6 mermaid.live regeneration script to use correct `zlib.compress` + `urlsafe_b64encode` encoding

## [v01.50r] — 2026-03-09 01:47:30 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed mermaid.live URL encoding — switched from URL-safe base64 to standard base64 (mermaid.live uses standard base64 in URL fragments)

### Added
- Collapsible "Copy code for mermaid.live" section below the diagram in REPO-ARCHITECTURE.md with raw Mermaid code in a copyable code block

## [v01.49r] — 2026-03-09 01:36:40 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- "Open in mermaid.live" link in REPO-ARCHITECTURE.md — pako-compressed URL pre-loads the diagram in the interactive editor
- CLAUDE.md Pre-Commit #6 rule for regenerating the mermaid.live link when the diagram changes

## [v01.48r] — 2026-03-09 01:24:49 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed `GAS_TPL_PAGE` → `GASTPL_PAGE` style reference bug in REPO-ARCHITECTURE.md Mermaid diagram (undefined node ID caused mermaid.live syntax error)

## [v01.47r] — 2026-03-09 01:11:33 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Replaced `·······` no-GAS placeholder with `vNoGASg` in README project structure tree and CLAUDE.md rule

## [v01.46r] — 2026-03-09 01:05:37 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Moved version display links before descriptions in README project structure tree, separated by `|`
- Pages without GAS now show `·······` placeholder for visual alignment
- Moved README.md to the end of the Community group (below SECURITY.md)
- Updated CLAUDE.md #8 rule to reflect new version display format

## [v01.45r] — 2026-03-09 12:59:44 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Version display links on live site page entries in README project structure tree — each page now shows its current HTML version (linked to its HTML changelog) and GAS version (linked to its GAS changelog)
- Pre-Commit rule in CLAUDE.md #8 to keep README tree version displays in sync when pages are modified

## [v01.44r] — 2026-03-09 12:51:13 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Added missing `README.md` entry to the project structure tree in README.md

## [v01.43r] — 2026-03-09 12:43:18 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Added `v` prefix to all GAS version values throughout the repo — VERSION variables in `.gs` files now store `"v01.XXg"` instead of `"01.XXg"`, matching how HTML versions are handled
- Removed all `"v" + VERSION` concatenations in `.gs` files and GAS template to prevent double-v after prefix change
- Updated GAS version format references across CLAUDE.md, rules files, skills, setup script, workflow comments, CONTRIBUTING.md, and SESSION-CONTEXT.md

#### `index.gs` — v01.01g

##### Changed
- Version format now includes `v` prefix for consistency with HTML versions

#### `test.gs` — v01.01g

##### Changed
- Version format now includes `v` prefix for consistency with HTML versions

## [v01.42r] — 2026-03-09 10:32:50 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Moved Repository Information section after Scripts section in project structure tree

## [v01.41r] — 2026-03-09 10:28:38 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Moved GitHub Configuration and Configuration sections below the Claude Code section in project structure tree

## [v01.40r] — 2026-03-09 09:53:49 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Changed root label in project structure tree from `─── Repository Root ───` to `Repository Root ───` (removed leading dashes)
- Reordered sections below Project Structure: Copy This Repository → Initialize This Template → How It Works → GCP Project Setup & Troubleshooting (setup instructions now come first, informational sections follow)

## [v01.39r] — 2026-03-09 09:49:11 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Moved `CLAUDE.md` above `.claude/` folder in the Claude Code section of the project structure tree
- Restored separate "Repository Root" bold group label above the left-aligned `saistemplateprojectrepo/` link in the project structure tree

## [v01.38r] — 2026-03-09 09:43:08 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Moved `CLAUDE.md` from Documentation section into the Claude Code section (as a sibling of `.claude/`) in the project structure tree
- Moved `CITATION.cff` into the Community section (citation metadata fits alongside LICENSE, CONTRIBUTING, etc.)
- Removed the now-empty Documentation section from the project structure tree

## [v01.37r] — 2026-03-09 09:39:53 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Consolidated root label in project structure tree — removed separate "Repository Root" line and put the `saistemplateprojectrepo/` link directly on the bold label line

## [v01.36r] — 2026-03-09 09:36:44 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Changed root `saistemplateprojectrepo/` in project structure tree back to plain link with a "Repository Root" bold group label above it (matching the style of other section labels)
- Moved Claude Code section below Configuration section in the project structure tree

## [v01.35r] — 2026-03-09 09:32:27 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Added bold group label to the root `saistemplateprojectrepo/` entry in the project structure tree
- Moved all informational sections (How It Works, GCP Project Setup & Troubleshooting) below Project Structure to match the original intended order: Project Structure → How It Works → GCP Project Setup → Copy This Repository → Initialize This Template

## [v01.34r] — 2026-03-09 09:27:29 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Moved "Copy This Repository" and "Initialize This Template" sections below the "Project Structure" section in README.md for improved reading flow — setup instructions now follow the structure overview

## [v01.33r] — 2026-03-09 09:22:53 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Reordered page listings across all files to: Landing Page (index), Test, GAS Project Creator — applied to README.md project structure tree, README.md supporting file listings (html-versions, html-changelogs), STATUS.md table, and REPO-ARCHITECTURE.md Mermaid diagram

## [v01.32r] — 2026-03-09 09:16:20 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Rearranged live page entries in project structure tree: live site link now appears before the description (with `→` separator), and link text uses the page name without `.html` extension (e.g. `index`, `gas-project-creator`, `test`) instead of generic "live"

## [v01.31r] — 2026-03-09 09:12:09 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Moved `.nojekyll` from the live pages group to the Supporting Files group in the project structure tree (it's a config file, not a live page)
- Added live site URL links (→ live) next to each HTML page entry in the project structure tree (`index.html`, `gas-project-creator.html`, `test.html`)

## [v01.30r] — 2026-03-09 09:09:01 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added "Supporting Files" subheading within the `live-site-pages/` section of the project structure tree, separating live HTML pages from supporting folders (templates, versions, changelogs, sounds)

## [v01.29r] — 2026-03-09 09:03:31 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added bold group labels for each root-level folder in the project structure tree (Live Site, Google Apps Scripts, Claude Code, GitHub Configuration, Repository Information, Scripts) — all folder sections are now visually categorized like the root-level file groups

## [v01.28r] — 2026-03-09 08:57:08 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added bold group labels (Configuration, Documentation, Community) as visual subheadings within the project structure tree, using `<b>` tags inside the `<pre>` block

### Removed
- Removed `## Documentation` and `## Community` sections from README — now consolidated as labeled groups within the project structure tree, eliminating redundant file listings

## [v01.27r] — 2026-03-09 08:51:34 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed README project structure tree rendering as a continuous paragraph — switched from plain markdown (no line break preservation) to HTML `<pre>` block with `<a href>` tags, restoring monospace formatting and proper tree structure while keeping all filenames clickable

### Changed
- Updated CLAUDE.md Pre-Commit #8 to document `<pre>` + `<a href>` format for tree entries

## [v01.26r] — 2026-03-09 08:46:00 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added mandatory gate block at the top of CLAUDE.md — a high-visibility warning ensuring Session Start Checklist and Chat Bookends are never skipped, even for casual or simple questions

## [v01.25r] — 2026-03-09 08:40:55 AM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Converted README.md project structure tree from fenced code block to plain markdown with clickable GitHub links — every filename and directory name is now a navigable link to its blob/tree view
- Changed tree description separator from `#` to `—` for markdown compatibility outside code blocks
- Added link tip blockquote to Project Structure section
- Updated CLAUDE.md Pre-Commit #8 to document the linked tree entry format


## [v01.24r] — 2026-03-08 05:34:53 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Set up new GAS project "Test" with full page, script, config, version files, changelogs, and workflow deploy step
- Added Test project row to STATUS.md Hosted Pages table
- Added Test project nodes and relationships to REPO-ARCHITECTURE.md diagram
- Added Test project files to README.md project structure tree
- Added GAS deploy step for Test in auto-merge workflow

## [v01.23r] — 2026-03-08 05:23:48 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Added explicit `permissions` block (`pages: write`, `id-token: write`) to the deploy job in auto-merge workflow — fixes "Ensure GITHUB_TOKEN has permission id-token: write" error on GitHub Pages deployment

## [v01.22r] — 2026-03-08 05:16:55 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Added "immediate fix proposal" rule to Continuous Improvement section — acknowledging a mistake without proposing a concrete structural fix in the same response is now explicitly prohibited

## [v01.21r] — 2026-03-08 05:14:03 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Added compaction recovery closure rule to CLAUDE.md — after context compaction, if no work remains, the recovery response must still end with the full end-of-response block and closing marker instead of informal text

## [v01.20r] — 2026-03-08 05:07:22 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Consolidated all template files into `live-site-pages/templates/` — moved `HtmlAndGasTemplateAutoUpdate.html` (renamed to `.html.txt`) and `gas-project-creator-code.js.txt` from separate directories into a single templates folder
- Removed `live-site-templates/` and `live-site-pages/gas-code-templates/` directories
- Updated all references across 15 files (CLAUDE.md, rules, skills, scripts, REPO-ARCHITECTURE.md, README.md, STATUS.md, CONTRIBUTING.md, IMPROVEMENTS.md)

#### `gas-project-creator.html` — v01.01w

##### Changed
- Updated template file fetch path to new location

## [v01.19r] — 2026-03-08 04:54:56 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Merged "Hosted Pages" and "GAS Projects" into a single "Hosted Pages & GAS Projects" table in STATUS.md — each page row now shows its associated GAS file and version inline

## [v01.18r] — 2026-03-08 04:49:52 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Clarified template names in STATUS.md — renamed "Universal Template" to "HTML Page Template (with GAS embedding)" and "GAS Code Template" to "GAS Script Template" for unambiguous identification

## [v01.17r] — 2026-03-08 04:46:19 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Added GAS Code Template entry to STATUS.md Templates table — `gas-project-creator-code.js.txt` is now tracked alongside the Universal Template as the GAS-specific code template

## [v01.16r] — 2026-03-08 04:25:29 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Corrected QR code to point to GitHub repo URL instead of GitHub Pages URL
- Updated Pre-Commit #14 rule and init script to generate QR codes with the repo URL
- Fixed stale `HtmlTemplateAutoUpdate` file references in `html-pages.md` and `imported--frontend-design` skill after repo rename

## [v01.15r] — 2026-03-08 04:19:59 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Regenerated QR code in README to point to the correct live site URL after repo rename

## [v01.14r] — 2026-03-08 04:08:05 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Renamed project from "Auto Update HTML Template" to "Auto Update HTML & GAS Template" in README title, init script, and phantom update commit message references

## [v01.13r] — 2026-03-08 03:48:05 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Renamed all instances of `htmltemplateautoupdate` to `saistemplateprojectrepo` across the entire repo (13 files, 41 occurrences) in preparation for repo copy/rename

## [v01.12r] — 2026-03-08 03:38:44 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Removed
- Deleted `repository-information/backups/CLAUDE.md.bak` and the `backups/` directory (stale backup no longer needed)

## [v01.11r] — 2026-03-08 03:34:16 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Extended STATUS.md Origin column to four-tier system: `template`, `initialized`, `modified`, `initialized · modified`, or empty (fork-added) — matching the README tree and REPO-ARCHITECTURE.md label tiers
- Updated Pre-Commit #5 with transition rules: `initialized` → `initialized · modified` and `template` → `modified` on post-init file edits

## [v01.10r] — 2026-03-08 03:31:41 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Upgraded template origin labels from three-tier to four-tier system: added `[template · initialized · modified]` state to distinguish post-init customizations of init-modified files from post-init customizations of untouched template files
- Made init script Phase 5b surgical — only upgrades `[template]` → `[template · initialized]` for files that init actually modifies (based on REPLACE_FILES array), leaving untouched template files as `[template]`
- Updated Pre-Commit #6 (REPO-ARCHITECTURE.md) and #8 (README tree) rules: `[template · initialized]` → `[template · initialized · modified]` on post-init edit; `[template]` → `[template · modified]` on post-init edit

## [v01.09r] — 2026-03-08 03:23:13 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added three-tier template origin label system: `[template]` (template repo), `[template · initialized]` (fork after init), `[template · modified]` (fork after customization) — distinguishes initialization changes from genuine post-init customizations
- Added Phase 5b to init script (`scripts/init-repo.sh`) — upgrades all `[template]` labels to `[template · initialized]` in README.md tree, REPO-ARCHITECTURE.md diagram, and STATUS.md Origin column during fork initialization

### Changed
- Updated Pre-Commit #5, #6, #8 template origin label rules to document the three-tier system and the `[template · initialized]` intermediate state

## [v01.08r] — 2026-03-08 03:12:53 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added `[template]` origin labels to REPO-ARCHITECTURE.md Mermaid diagram — file nodes and file-centric subgraphs are prefixed with `[template]` to distinguish template-origin components from fork-added ones
- Added `Origin` column to all STATUS.md tables — template-origin entries show `template`, making it immediately visible which rows came from the template
- Added template origin label rules to Pre-Commit #5 (STATUS.md Origin column) and #6 (REPO-ARCHITECTURE.md node/subgraph labels), including `[template · modified]` tracking on non-template repos

## [v01.07r] — 2026-03-08 03:04:33 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added `[template · modified]` label rule to Pre-Commit #8 — on non-template repos, template-origin files update their label to `[template · modified]` when edited, showing the file was customized from the original template

## [v01.06r] — 2026-03-08 03:01:03 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Added
- Added `[template]` origin labels to every entry in README project structure tree — distinguishes template-origin files from files added in forks

## [v01.05r] — 2026-03-08 02:53:07 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Added missing sound files (`Website_Ready_Voice_1.mp3`, `Code_Ready_Voice_1.mp3`) to README project structure tree — `sounds/` directory was listed but its contents were not expanded
- Added completeness audit rule to Pre-Commit #8 (README.md structure tree) — directories must have their contents fully expanded, not just listed as leaf nodes

## [v01.04r] — 2026-03-08 02:48:28 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Added missing `.editorconfig` and `.gitignore` to README project structure tree

## [v01.03r] — 2026-03-08 02:31:16 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Removed
- Removed testation7 and testation8 environments — deleted HTML pages, GAS scripts, config files, version files, changelogs, and changelog archives (18 files total)
- Removed testation7 and testation8 GAS deploy steps from auto-merge workflow
- Removed testation7 and testation8 entries from STATUS.md hosted pages and GAS projects tables

## [v01.02r] — 2026-03-08 02:05:10 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Fixed
- Fixed non-index page URLs in chat bookends ending with `/` instead of `.html` — added explicit rule for non-index pages (e.g. `testation7.html`) to use `.html` suffix in live site URLs
- Fixed init script not resetting `TEMPLATE_DEPLOY` to `Off` on forks — forks no longer inherit the template's `On` state, preventing false template-repo detection in URL display logic

## [v01.01r] — 2026-03-07 03:15:58 PM EST — [323ba00](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/323ba00a319c326ddca44ed20d2a460b951aa543)

### Changed
- Re-enabled `TEMPLATE_DEPLOY` toggle (`Off` → `On`) to restore GitHub Pages deployment on the template repo
