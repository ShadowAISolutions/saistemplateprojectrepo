# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 97/100`

## [v07.76r] — 2026-03-29 12:59:16 PM EST

> **Prompt:** "rename everything in repo from applicationportal to programportal, includes Application Portal to Program Portal"

### Changed
- Renamed "Application Portal" to "Program Portal" across the entire repo — all file names, directory names, content references, changelogs, diagrams, workflow steps, and documentation updated

#### `programportal.html` — v01.70w

##### Changed
- Page renamed from applicationportal to programportal

#### `programportal.gs` — v01.11g

##### Changed
- Script renamed from applicationportal to programportal — all internal references updated

## [v07.75r] — 2026-03-29 02:39:56 AM EST

> **Prompt:** "i like group, use that for those"

### Changed
- Parent stage timer suffix changed from "total" to "group" (e.g. "6.5s group" instead of "6.5s total") to distinguish from the grand total on the final "Sign-in complete" / "Sign-out complete" row which keeps "total"

#### `testauth1.html` — v03.77w

##### Changed
- Parent stage timers now show "group" suffix instead of "total"

#### `programportal.html` — v01.69w

##### Changed
- Parent stage timers now show "group" suffix instead of "total"

#### `globalacl.html` — v01.63w

##### Changed
- Parent stage timers now show "group" suffix instead of "total"

## [v07.74r] — 2026-03-29 02:29:20 AM EST

> **Prompt:** "i dont see it, it should be showing up on the sign in complete row from the beginning, in timer format same like the other rows but counting the total elapsed for all"

### Changed
- Total elapsed timer now live-ticks from the start on the "Sign-in complete" / "Sign-out complete" rows — starts counting immediately when the checklist begins (same 100ms interval as other stage tickers), freezes on completion with final value. Previously the total only appeared on completion (too late — page transitions away instantly)

#### `testauth1.html` — v03.76w

##### Changed
- Total elapsed timer now live-ticks on the final checklist row from the beginning

#### `programportal.html` — v01.68w

##### Changed
- Total elapsed timer now live-ticks on the final checklist row from the beginning

#### `globalacl.html` — v01.62w

##### Changed
- Total elapsed timer now live-ticks on the final checklist row from the beginning

## [v07.73r] — 2026-03-29 02:23:50 AM EST

> **Prompt:** "im never going to see that total because it instantly moves to the application/auth page when done. so instead of that, have the total counter be on the final row which is sign out/sign in complete so that the timer is visible."

### Changed
- Moved total elapsed timer from a separate `<p>` below the checklist to the "Sign-in complete" / "Sign-out complete" row itself — displays as "X.Xs total" in italic, matching the parent-stage timer style. Removed the separate `.checklist-total-time` CSS and HTML elements since they were never visible (page transitions away instantly on completion)

#### `testauth1.html` — v03.75w

##### Changed
- Total elapsed time now shows on the "Sign-in complete" and "Sign-out complete" rows instead of below the checklist

#### `programportal.html` — v01.67w

##### Changed
- Total elapsed time now shows on the "Sign-in complete" and "Sign-out complete" rows instead of below the checklist

#### `globalacl.html` — v01.61w

##### Changed
- Total elapsed time now shows on the "Sign-in complete" and "Sign-out complete" rows instead of below the checklist

## [v07.72r] — 2026-03-29 02:18:23 AM EST

> **Prompt:** "for the sign in and sign out, add an additional total timer for all sections combined"

### Added
- Added overall total elapsed time display at the bottom of sign-in and sign-out checklists across all 3 auth pages. Shows "Total: X.Xs" after all stages complete, giving the user a single number for the entire sign-in/sign-out duration

#### `testauth1.html` — v03.74w

##### Added
- Total elapsed time shown at bottom of sign-in and sign-out checklists on completion

#### `programportal.html` — v01.66w

##### Added
- Total elapsed time shown at bottom of sign-in and sign-out checklists on completion

#### `globalacl.html` — v01.60w

##### Added
- Total elapsed time shown at bottom of sign-in and sign-out checklists on completion

## [v07.71r] — 2026-03-29 02:09:05 AM EST

> **Prompt:** "yes go ahead and do that"

### Changed
- Embedded ACL data at build time in globalacl.gs `doGet()` — table data is now pre-loaded during HTML generation (same pattern as testauth1's `getCachedData()`), eliminating the post-load `google.script.run.loadACLData()` async fetch. ACL table now renders instantly when the app loads instead of showing a loading state

#### `globalacl.gs` — v01.27g

##### Changed
- ACL data table now loads instantly instead of requiring a separate server request after sign-in

## [v07.70r] — 2026-03-29 01:54:51 AM EST

> **Prompt:** "sure"

### Added
- Added "Sign-out complete" finish line to sign-out checklist across all 3 auth pages — matches the "Sign-in complete" pattern for visual closure before the auth wall appears

#### `testauth1.html` — v03.73w

##### Added
- "Sign-out complete" final step in sign-out checklist

#### `programportal.html` — v01.65w

##### Added
- "Sign-out complete" final step in sign-out checklist

#### `globalacl.html` — v01.59w

##### Added
- "Sign-out complete" final step in sign-out checklist

## [v07.69r] — 2026-03-29 01:49:03 AM EST

> **Prompt:** "go for it"

### Changed
- Renamed sign-out checklist final stage from "Waiting for server confirmation" → "Waiting for sign-out confirmation" across all 3 auth pages — more specific about what is being confirmed

#### `testauth1.html` — v03.72w

##### Changed
- Sign-out checklist final step now reads "Waiting for sign-out confirmation"

#### `programportal.html` — v01.64w

##### Changed
- Sign-out checklist final step now reads "Waiting for sign-out confirmation"

#### `globalacl.html` — v01.58w

##### Changed
- Sign-out checklist final step now reads "Waiting for sign-out confirmation"

## [v07.68r] — 2026-03-29 01:43:18 AM EST

> **Prompt:** "then make it not misleading"

### Changed
- Renamed sign-in checklist final stage from "Confirming session with server" → "Sign-in complete" and internal key from "Almost ready…" → "Sign-in complete" — the stage was not actually confirming anything, it just signals completion
- Renamed reconnect checklist final stage from "Confirming session with server" → "Session restored"

#### `testauth1.html` — v03.71w

##### Changed
- Final sign-in checklist step now reads "Sign-in complete" instead of "Confirming session with server"
- Final reconnect checklist step now reads "Session restored"

#### `programportal.html` — v01.63w

##### Changed
- Final sign-in checklist step now reads "Sign-in complete" instead of "Confirming session with server"
- Final reconnect checklist step now reads "Session restored"

#### `globalacl.html` — v01.57w

##### Changed
- Final sign-in checklist step now reads "Sign-in complete" instead of "Confirming session with server"
- Final reconnect checklist step now reads "Session restored"

## [v07.67r] — 2026-03-29 01:36:33 AM EST

> **Prompt:** "i like preparing interface and initializing, use those. also explain what is happening with confirming session with server as it seems instantaneous"

### Changed
- Renamed sign-in checklist sub-steps: "Downloading app" → "Preparing interface", "Starting up" → "Initializing" across all 3 auth pages for more accurate descriptions

#### `testauth1.html` — v03.70w

##### Changed
- Renamed loading sub-steps to "Preparing interface" and "Initializing"

#### `programportal.html` — v01.62w

##### Changed
- Renamed loading sub-steps to "Preparing interface" and "Initializing"

#### `globalacl.html` — v01.56w

##### Changed
- Renamed loading sub-steps to "Preparing interface" and "Initializing"

## [v07.66r] — 2026-03-29 01:19:57 AM EST

> **Prompt:** "why is it that the globalacl spends a few secpmds with "starting up" while the application portal and testauth1 instantly complete that part?"

### Fixed
- Fixed globalacl "Starting up" sub-step taking 2-5 seconds during sign-in — added immediate unsigned `gas-auth-ok` postMessage before the async `google.script.run.signAppMessage()` call, matching the pattern already used by testauth1 and programportal

#### `globalacl.gs` — v01.26g

##### Fixed
- Sign-in "Starting up" phase now completes instantly instead of waiting for server round-trip

## [v07.65r] — 2026-03-29 01:09:43 AM EST

> **Prompt:** "the checklists for signing in/sign out/ ect, right now you are not showing the sub lists until you reach them, make it always show the full lists for all of them"

### Changed
- Sign-in, sign-out, and reconnecting checklists now show all sub-steps upfront (always visible) instead of progressively revealing them as each parent stage is reached. Sub-steps start in pending state and transition to active/done as before — the only change is visibility

#### `testauth1.html` — v03.69w

##### Changed
- All checklist sub-steps are now visible from the start during sign-in and sign-out

#### `programportal.html` — v01.61w

##### Changed
- All checklist sub-steps are now visible from the start during sign-in and sign-out

#### `globalacl.html` — v01.55w

##### Changed
- All checklist sub-steps are now visible from the start during sign-in and sign-out

## [v07.64r] — 2026-03-29 12:57:08 AM EST

> **Prompt:** "with everything we have discussed, pros, cons, desires, observations etc, make a separate document with all relevant information in case we want to implement this in the future"

### Added
- Created `repository-information/pending-close-design-doc.md` — comprehensive design document for server-side session invalidation on browser tab close. Documents the `sendBeacon` + `pendingClose` pattern (60-second TTL shortening), pros/cons, `pagehide` trigger scenarios, multi-tab concerns, and testing plan. Deferred for now — existing single-session enforcement + TTL expiry provides adequate coverage

## [v07.63r] — 2026-03-28 09:11:25 PM EST

> **Prompt:** "we are now getting stuck on waiting for server confirmation signing out, using the testauth1 to try it out"

### Fixed
- Fixed `_finalizeSignOut()` guard being too strict — previous guard (`_authState !== 'signing-out'`) blocked even normal sign-out completion because the general `gas-signed-out` handler sets `_authState = 'signed-out'` before `_finalizeSignOut()` runs. Changed to only block when user has actively started a new auth flow (`signing-in`, `reconnecting`, or `authenticated`)

#### `testauth1.html` — v03.68w

##### Fixed
- Sign-out no longer gets stuck on "Waiting for server confirmation"

#### `programportal.html` — v01.60w

##### Fixed
- Sign-out no longer gets stuck on "Waiting for server confirmation"

#### `globalacl.html` — v01.54w

##### Fixed
- Sign-out no longer gets stuck on "Waiting for server confirmation"

## [v07.62r] — 2026-03-28 08:50:32 PM EST

> **Prompt:** "i tried it in testauth1 (sign out and quickly sign back in), and its saying you have been signed out. but of course the fix should apply to all of them"

### Fixed
- Guarded `_finalizeSignOut()` with `_authState !== 'signing-out'` check — the previous fix guarded the general `gas-signed-out` handler but missed the closure-scoped `_soConfirmHandler` and 10-second fallback timeout, both of which call `_finalizeSignOut()`. These late callbacks were the actual culprit: they fire after sign-out completes (calling `showAuthWall('You have been signed out.')`) even if the user has already started a new sign-in

#### `testauth1.html` — v03.67w

##### Fixed
- Signing in immediately after signing out no longer gets interrupted by delayed sign-out completion

#### `programportal.html` — v01.59w

##### Fixed
- Signing in immediately after signing out no longer gets interrupted by delayed sign-out completion

#### `globalacl.html` — v01.53w

##### Fixed
- Signing in immediately after signing out no longer gets interrupted by delayed sign-out completion

## [v07.61r] — 2026-03-28 08:23:32 PM EST

> **Prompt:** "when i try to sign in fairly quickly after ive been signed out, it triy to sign in and it gets a few seconds into exchanging credentials but then says you have been signed out and goes back to the sign in page. anything you can come up with to address that?"

### Fixed
- Added auth state machine (`_authState`) to prevent stale sign-out signals from interrupting fresh sign-in attempts. Five states: `signed-out`, `signing-in`, `authenticated`, `signing-out`, `reconnecting`. The `gas-signed-out` handler now only processes during `signing-out` state — HIPAA-safe because that message only originates from a GAS iframe loaded with `?action=signout` (inside `performSignOut()`)
- Fixed BroadcastChannel sign-out self-reception — added `tabId` to the sign-out broadcast message and a `tabId !== _tabId` guard on the receiver, preventing a tab from processing its own sign-out broadcast

#### `testauth1.html` — v03.66w

##### Fixed
- Signing in immediately after signing out no longer gets interrupted by stale sign-out messages

#### `programportal.html` — v01.58w

##### Fixed
- Signing in immediately after signing out no longer gets interrupted by stale sign-out messages

#### `globalacl.html` — v01.52w

##### Fixed
- Signing in immediately after signing out no longer gets interrupted by stale sign-out messages

## [v07.60r] — 2026-03-28 07:48:08 PM EST

> **Prompt:** "you made them a separate row instead of how i asked for it. we could do it that way but as is it looks like its an additional step not a total, so make it more obvious. also the reconnecting isnt showing timers properly as per the screenshot"

### Fixed
- Parent stage timers on stages with sub-steps now show "X.Xs total" suffix in italic styling (`stage-time-total` class) to distinguish them from sub-step timers — makes it clear the value is a total, not another step
- Added live-ticking timer to reconnecting checklist stages — `_updateReconnectStage()` now activates `_startStageTick()`, and `_completeAllReconnectStages()`/`_resetReconnectChecklist()` properly clean up the timer

#### `testauth1.html` — v03.65w

##### Fixed
- Stage timers on steps with sub-steps now show "total" suffix in italic
- Reconnecting checklist stages now show live timers while active

#### `programportal.html` — v01.57w

##### Fixed
- Stage timers on steps with sub-steps now show "total" suffix in italic
- Reconnecting checklist stages now show live timers while active

#### `globalacl.html` — v01.51w

##### Fixed
- Stage timers on steps with sub-steps now show "total" suffix in italic
- Reconnecting checklist stages now show live timers while active

## [v07.59r] — 2026-03-28 07:40:23 PM EST

> **Prompt:** "then can you make the main stage timers be to the right of the cooresponding main stages instead of to the right of the substeps, so it should be left to right, main stage, main stage timer, sub stages , sub stages timers"

### Fixed
- Fixed checklist layout so stage timer appears on the same line as the stage text, with sub-steps wrapping to a new row below. Previously, sub-steps (as flex items) pushed the parent stage timer to the far right after the sub-step block, breaking the visual hierarchy. Used CSS `flex-wrap`, `order`, and `flex-basis: 100%` to enforce: line 1 = icon + stage text + timer, line 2 = indented sub-steps

#### `testauth1.html` — v03.64w

##### Fixed
- Stage timer now appears next to its stage text, not displaced by sub-steps

#### `programportal.html` — v01.56w

##### Fixed
- Stage timer now appears next to its stage text, not displaced by sub-steps

#### `globalacl.html` — v01.50w

##### Fixed
- Stage timer now appears next to its stage text, not displaced by sub-steps

## [v07.58r] — 2026-03-28 07:32:09 PM EST

> **Prompt:** "on sign out, waiting for server confirmation is not showing a timer, any reason for this?"

### Fixed
- Added live-ticking timer for active main stages (sign-in and sign-out) — previously only sub-steps had a 100ms ticker (`_startSubStepTick`), while main stages only showed elapsed time on completion. Added `_startStageTick()` function that updates the active stage's timer every 100ms, matching the sub-step behavior. "Waiting for server confirmation" now shows a running timer while active

#### `testauth1.html` — v03.63w

##### Fixed
- "Waiting for server confirmation" now shows a live-ticking timer during sign-out
- All sign-in and sign-out stages now show live timers while active

#### `programportal.html` — v01.55w

##### Fixed
- "Waiting for server confirmation" now shows a live-ticking timer during sign-out
- All sign-in and sign-out stages now show live timers while active

#### `globalacl.html` — v01.49w

##### Fixed
- "Waiting for server confirmation" now shows a live-ticking timer during sign-out
- All sign-in and sign-out stages now show live timers while active

## [v07.57r] — 2026-03-28 06:58:25 PM EST

> **Prompt:** "you removed the totals for signing in, fix it so its shown, i can see that the server authenticating wasnt turned green when it finished."

### Fixed
- Restored parent stage total time display — removed the overly aggressive `:scope > .sub-steps` guard that was blocking all parent stage times. The `:scope > .stage-time` selector already prevents overwriting sub-step times
- Sub-steps now complete (turn green with frozen time) when their parent stage transitions to done — added `_completeSubStepsForStage(el)` call in both `_updateSignInStage` and `_updateSignOutStage` so "Server authenticating" properly turns green when "Setting up your secure session" begins

#### `testauth1.html` — v03.62w

##### Fixed
- "Exchanging credentials with server" now shows its total time again
- "Server authenticating" sub-step now turns green when sign-in moves to the next stage

#### `programportal.html` — v01.54w

##### Fixed
- Parent stage total times restored, sub-steps now complete when parent stage transitions

#### `globalacl.html` — v01.48w

##### Fixed
- Parent stage total times restored, sub-steps now complete when parent stage transitions

## [v07.55r] — 2026-03-28 06:33:14 PM EST

> **Prompt:** "in the sign out its showing the total time for invalidating server session as 2.2s for example mathcing the connecting to server even though we havent even finished the invalidating server session portion, still on sending sign out request"

### Fixed
- Parent stages with sub-steps no longer show a redundant total time — `_setStageTime` now skips any stage element that contains a `.sub-steps` child UL, since the sub-steps already provide the timing breakdown

#### `testauth1.html` — v03.61w

##### Fixed
- "Invalidating server session" and "Exchanging credentials with server" no longer show a confusing total time that duplicates sub-step values

#### `programportal.html` — v01.53w

##### Fixed
- Parent stages with sub-steps no longer show redundant total time

#### `globalacl.html` — v01.47w

##### Fixed
- Parent stages with sub-steps no longer show redundant total time

## [v07.54r] — 2026-03-28 06:19:20 PM EST

> **Prompt:** "it seems to be remembering the totals from the previous sign ins and sign outs"

### Fixed
- Checklist reset now removes ALL `.stage-time` spans via `querySelectorAll` before resetting LI classes — previously `querySelector` per LI only removed the first `.stage-time` match, leaving parent stage total time spans orphaned across sign-in/sign-out cycles

#### `testauth1.html` — v03.60w

##### Fixed
- Checklist timer values no longer carry over between sign-in and sign-out cycles

#### `programportal.html` — v01.52w

##### Fixed
- Checklist timer values no longer carry over between sign-in and sign-out cycles

#### `globalacl.html` — v01.46w

##### Fixed
- Checklist timer values no longer carry over between sign-in and sign-out cycles

## [v07.53r] — 2026-03-28 06:19:20 PM EST

> **Prompt:** "nope, again the number is being added to the connecting to server instead of there being a separate total timer for the exchanging credentials with server"

### Fixed
- Parent stage total time no longer overwrites first sub-step time — `_setStageTime` now uses `:scope > .stage-time` selector to only find direct child time spans, preventing it from matching time spans inside nested sub-step ULs

#### `testauth1.html` — v03.59w

##### Fixed
- Parent stage total time now displays separately from sub-step times

#### `programportal.html` — v01.51w

##### Fixed
- Parent stage total time now displays separately from sub-step times

#### `globalacl.html` — v01.45w

##### Fixed
- Parent stage total time now displays separately from sub-step times

## [v07.52r] — 2026-03-28 05:55:55 PM EST

> **Prompt:** "these two screenshots are actually from the same login attempt, do you see how the connecting to server total time went up to 5.1 when it was 2.8 while server authenticating was happening. i think its adding up the connecting to server number and the server authenticating number, summing them up and putting it into the connecting to server number. we can have a total time for the exchanging credentials with server section but it should be something separate not replace the connecting to server duration"

### Fixed
- Sub-step timers now freeze when completed — added `_subStepFrozenTimes` map that captures elapsed time at the moment a sub-step transitions to done, preventing `_setSubStepTime` from recalculating with `Date.now() - startTime` on already-completed sub-steps

#### `testauth1.html` — v03.58w

##### Fixed
- Sub-step timers now freeze when completed — no longer show inflated times that keep growing

#### `programportal.html` — v01.50w

##### Fixed
- Sub-step timers now freeze when completed — no longer show inflated times that keep growing

#### `globalacl.html` — v01.44w

##### Fixed
- Sub-step timers now freeze when completed — no longer show inflated times that keep growing

## [v07.51r] — 2026-03-28 05:37:53 PM EST

> **Prompt:** "instead of using miliseconds for these, make them use decimals of seconds"

### Changed
- Stage timers now always display as decimal seconds (e.g. "0.0s" instead of "0ms") — removed the millisecond branch from `_formatStageTime` across testauth1, programportal, and globalacl

#### `testauth1.html` — v03.57w

##### Changed
- Checklist timers now display seconds with one decimal place instead of milliseconds

#### `programportal.html` — v01.49w

##### Changed
- Checklist timers now display seconds with one decimal place instead of milliseconds

#### `globalacl.html` — v01.43w

##### Changed
- Checklist timers now display seconds with one decimal place instead of milliseconds

## [v07.50r] — 2026-03-28 05:04:13 PM EST

> **Prompt:** "ok great. make these changes including intermediary steps now apply to signing out and also for the application portal and global acl"

### Fixed
- Added missing sign-out sub-step wiring calls (`_updateSubStep('sub-so-connecting')` and `_updateSubStep('sub-so-sending')`) in globalacl.html sign-out flow — sub-steps were defined in HTML and JS but not triggered during the actual sign-out sequence

#### `globalacl.html` — v01.41w

##### Fixed
- Sign-out sub-step timing now works correctly

## [v07.49r] — 2026-03-28 05:01:25 PM EST

> **Prompt:** "ok great. make these changes including intermediary steps now apply to signing out and also for the application portal and global acl"

### Added
- Sign-out sub-steps with live timing for "Invalidating server session" — tracks Connecting to server and Sending sign-out request as separate timed phases (testauth1, programportal, globalacl)
- Sign-in and sign-out sub-steps propagated to programportal.html and globalacl.html — both pages now have the same sub-step tracking as testauth1

#### `testauth1.html` — v03.56w

##### Added
- Sign-out checklist now shows sub-steps with live timing during "Invalidating server session"

#### `programportal.html` — v01.47w

##### Added
- Sign-in checklist sub-steps with live timing (Connecting, Sending credentials, Server authenticating, Downloading app, Starting up)
- Sign-out checklist sub-steps with live timing (Connecting to server, Sending sign-out request)

#### `globalacl.html` — v01.40w

##### Added
- Sign-in checklist sub-steps with live timing (Connecting, Sending credentials, Server authenticating, Downloading app, Starting up)
- Sign-out checklist sub-steps with live timing (Connecting to server, Sending sign-out request)

## [v07.48r] — 2026-03-28 04:41:33 PM EST

> **Prompt:** "if i sign out and sign back in without refreshing the page the timers seem to be aggregated, showing high numbers. its not actually taking that long"

### Fixed
- Sign-in sub-step timers now reset on each new sign-in — `_subStepStartTimes`, `_activeSubStepId`, and `_subStepTickTimer` are cleared in `showSigningIn()` alongside the existing `_stageStartTimes` reset. Sub-step containers (`.sub-steps.visible`) are also hidden so they re-appear fresh

#### `testauth1.html` — v03.55w

##### Fixed
- Sign-in checklist timers no longer accumulate across sign-out/sign-in cycles — timers reset cleanly on each new sign-in

## [v07.47r] — 2026-03-28 04:33:31 PM EST

> **Prompt:** "on the checklists when signing in, i see that exchanging credentials with server can take between 5 and 15 seconds. are there intermediary steps that can be tracked for their timing? same with loading application"

### Added
- Sign-in checklist sub-steps with live timing for "Exchanging credentials with server" — tracks Connecting, Sending credentials (postMessage path), and Server authenticating as separate timed phases
- Sign-in checklist sub-steps for "Loading the application" — tracks Downloading app and Starting up using iframe load event detection
- Live ticking timer (100ms interval) on active sub-steps so users see real-time progress during the 5–15s server wait
- CSS for nested sub-step list items within the sign-in checklist
- URL path auto-hides "Sending credentials" sub-step (only relevant to postMessage/HIPAA path)

#### `testauth1.html` — v03.54w

##### Added
- Sign-in checklist now shows detailed sub-steps with live timing during "Exchanging credentials with server" and "Loading the application"
- Sub-steps include: Connecting to server, Sending credentials, Server authenticating, Downloading app, and Starting up
- Active sub-steps display a real-time elapsed timer that updates every 100ms

## [v07.46r] — 2026-03-28 03:49:09 PM EST

> **Prompt:** "in testauth1, when deleting a row, ask for confirmation, it should be a gas confirmation not a browser confirmation. also when i try to double click on a cell on mobile/android its zooming in rather than clicking the cell. make it mobile friendly"

### Added
- Custom styled delete confirmation modal in GAS iframe — shows row data preview with Cancel/Delete buttons, replacing direct deletion without confirmation
- Touch-based double-tap detection for cell editing on mobile — `touchend` event with 400ms threshold triggers cell editor since `dblclick` does not fire reliably on touch devices
- Viewport meta tag (`maximum-scale=1.0, user-scalable=no`) in GAS srcdoc to prevent mobile zoom
- `touch-action: manipulation` CSS on interactive elements to disable double-tap-to-zoom browser behavior

### Changed
- Mobile responsive improvements: add-row bar stacks vertically on narrow screens, table cells get tighter padding

#### `testauth1.gs` — v02.26g

##### Added
- Custom HTML/CSS delete confirmation modal with row data preview
- Mobile touch double-tap handler for cell editing
- Viewport meta tag for proper mobile rendering
- `touch-action: manipulation` on table cells and buttons

##### Changed
- Mobile layout: add-row bar wraps vertically, table cells use compact padding on small screens

## [v07.45r] — 2026-03-28 02:51:47 PM EST

> **Prompt:** "i dont want it to close the ones that were open i just want the menu to be over those. also the delete row buttons are not showing up until after the first poll happens, fix that"

### Fixed
- Admin dropdown now renders above open panels by raising `#user-pill` z-index from 9999 to 10012 — no longer closes panels when opening the dropdown
- Delete row buttons now appear on initial data load — `_showLiveDataApp` re-renders the table after setting `_ldCanEdit`, so buttons show immediately instead of waiting for the first poll

#### `testauth1.html` — v03.53w

##### Fixed
- Admin dropdown menu now appears above open panels instead of closing them

#### `testauth1.gs` — v02.25g

##### Fixed
- Delete buttons now appear immediately when data loads instead of after the first refresh

## [v07.44r] — 2026-03-28 02:43:50 PM EST

> **Prompt:** "when i click on one from the menu, it shows up but if i click on the admin menu again, its hiding behind the previous one"

### Fixed
- Admin dropdown now closes all open panels before opening — prevents the dropdown from appearing behind a previously opened panel (e.g. Active Sessions)

#### `testauth1.html` — v03.52w

##### Fixed
- Admin dropdown no longer hides behind open panels

## [v07.43r] — 2026-03-28 02:39:19 PM EST

> **Prompt:** "instead of sessions, disclosures, my data, correction, ammendments, and disagree all being shown priminently, have them be in a submenu under the admin label, of course this should only happen for admin users"

### Changed
- Moved Sessions, Disclosures, My Data, Correction, Amendments, and Disagree buttons into a dropdown submenu under the ADMIN badge — only visible to admin users. Sign Out buttons remain directly in the user pill

#### `testauth1.html` — v03.51w

##### Changed
- Admin navigation buttons now appear in a dropdown menu instead of inline in the top bar

## [v07.42r] — 2026-03-28 02:24:26 PM EST

> **Prompt:** "yes clean that up, but explain why this in the screenshot is using a google font"

### Changed
- Removed unused `https://www.slant.co` from CSP `font-src` directive — no fonts were loaded from this domain. Kept `https://fonts.gstatic.com` which is required by the Google Sign-In (GIS) library for Material Icons

#### `testauth1.html` — v03.50w

##### Changed
- Cleaned up Content Security Policy to remove unused external font source

## [v07.41r] — 2026-03-28 02:16:42 PM EST

> **Prompt:** "the live Xs ago, remove the ago, and instead of it being blank when at 0 , make it say 0s"

### Changed
- Connection status display changed from "Live Xs ago" to "Live Xs" and now shows "0s" instead of blank at zero seconds

#### `testauth1.gs` — v02.24g

##### Changed
- Data freshness indicator now shows "0s" at zero seconds instead of blank, and removed "ago" suffix

## [v07.40r] — 2026-03-28 02:07:55 PM EST

> **Prompt:** "i think we had added that because it was completely wack with the timing before, if you can make sure it will properly poll at the timing it says then yes go ahead"

### Fixed
- Data poll countdown now counts down cleanly to 0s before showing "polling..." — removed 2000ms guard that was eating the last 2-3 seconds, switched from `Math.floor` to `Math.ceil` for natural countdown feel
- Poll timing now uses chained `setTimeout` instead of `setInterval` — each poll fires exactly `DATA_POLL_INTERVAL` ms after the previous poll completes, so the countdown always matches the actual timing

#### `testauth1.gs` — v02.23g

##### Fixed
- Data poll countdown now reaches 0 before polling instead of jumping from 2-3 seconds directly to "polling..."

## [v07.39r] — 2026-03-28 01:59:03 PM EST

> **Prompt:** "move the toggles further apart so that they dont overlap when both opened"

### Fixed
- Increased spacing between HTML and GAS toggle buttons at bottom-left — GAS toggle moved from `left: 110px` to `left: 135px` so the expanded states ("HTML ○" and "GAS ○") no longer overlap

#### `testauth1.gs` — v02.22g

##### Fixed
- Toggle buttons no longer overlap when both are in their toggled-off state

## [v07.38r] — 2026-03-28 01:55:28 PM EST

> **Prompt:** "3 things. 1 - on first load its not showing a countdown for the data poll, after the first one it is showing it. 2- the version bottom left, should be left to the html and gas toggles. 3 - the username on gas layer top right corner is overlapped by the html pill, so move the gas username down below it"

### Fixed
- Data poll countdown now shows immediately on first load instead of displaying "--" until the first poll completes — `_lastDataPollTick` is initialized when the poll starts
- Repositioned GAS `#version` to `left: 8px` (leftmost), HTML toggle to `left: 70px`, GAS toggle to `left: 110px` — version now appears to the left of both toggle buttons
- Moved GAS `#user-email` from inside the Live Data header to a fixed position at `top: 35px, right: 8px` — sits below the HTML user-pill instead of behind it

#### `testauth1.html` — v03.49w

##### Changed
- HTML toggle button repositioned to `left: 70px` to make room for GAS version indicator at bottom-left

#### `testauth1.gs` — v02.21g

##### Fixed
- Data poll countdown now starts immediately instead of showing "--" until the first poll
- Version indicator moved to leftmost position at bottom-left
- Username moved below the navigation bar to avoid overlap

## [v07.37r] — 2026-03-28 01:47:24 PM EST

> **Prompt:** "alright, now address the overlapping of elements, these overlaps mainly occur because the html and gas layers are not aware of eachother, so move them around based on what you see in the screenshot"

### Fixed
- Repositioned GAS `#version` element from `left: 8px` to `left: 100px` to avoid overlapping with HTML layer toggle buttons at bottom-left corner
- Hidden GAS `#user-email` element (redundant — email already shown in HTML user-pill and GAS Live Data header)

#### `testauth1.gs` — v02.20g

##### Fixed
- Version indicator no longer overlaps with page controls at the bottom-left corner
- Removed redundant email display that overlapped with the main header

## [v07.36r] — 2026-03-28 01:39:47 PM EST

> **Prompt:** "yes"

### Fixed
- GAS layer toggle now uses CSS class (`gas-layer-hidden` with `!important`) instead of save/restore pattern — same fix as the HTML layer toggle in v07.35r, preventing stale display values from causing elements to disappear or overlap

#### `testauth1.gs` — v02.19g

##### Fixed
- Toggle button no longer causes elements to overlap or disappear when used repeatedly

## [v07.35r] — 2026-03-28 01:34:55 PM EST

> **Prompt:** "in testauth1, there are lots of elements overlapping and i dont see the sign out and other buttons at the top. i refreshed the page and they came back but see why that could have happened."

### Fixed
- HTML layer toggle now uses CSS class (`html-layer-hidden` with `!important`) instead of save/restore pattern for element display values — prevents race condition where other code paths (`showApp`, `showAuthWall`, `startCountdownTimers`) modifying inline display styles would cause stale values to be restored, making elements disappear or overlap

#### `testauth1.html` — v03.48w

##### Fixed
- Toggle button no longer causes elements to overlap or disappear when used repeatedly

## [v07.34r] — 2026-03-28 12:53:44 AM EST

> **Prompt:** "ok go for it"

### Fixed
- Layer visibility toggles now use `display: none` instead of `visibility: hidden` — all elements hide/show simultaneously instead of staggering due to different CSS transition speeds per element

#### `testauth1.html` — v03.47w

##### Fixed
- HTML toggle now hides/shows all elements at the same time

#### `testauth1.gs` — v02.18g

##### Fixed
- GAS toggle now hides/shows all elements at the same time

## [v07.33r] — 2026-03-28 12:43:27 AM EST

> **Prompt:** "going back to the data poll countdown that was in the session menu, it should be removed from there and there should be one on the gas layer replacing how it worked before the transition. make sure its somewhere thats not overlapped by an html element"

### Changed
- Moved data poll countdown from HTML-layer session timers panel to GAS-layer Live Data header — now displays inline next to the connection status ("Live 4s ago | ▷ 12s")
- Removed `gas-datapoll-state` postMessage bridge — the GAS layer now renders the countdown directly with a 1-second update interval
- Removed the "Data Poll:" row from the HTML auth-timers panel

#### `testauth1.html` — v03.46w

##### Removed
- Data Poll row from session timer panel — moved to the secure application layer

#### `testauth1.gs` — v02.17g

##### Changed
- Data refresh countdown now displays directly in the Live Data header next to connection status

## [v07.32r] — 2026-03-28 12:35:52 AM EST

> **Prompt:** "add a toggle on the html layer to hide/show the visual html elements other than that toggle itself. also make the same type of toggle on the gas layer for gas layer elements"

### Added
- HTML layer visibility toggle — small "HTML" button (fixed bottom-left) hides/shows all HTML-layer visual elements (nav bar, version indicator, GAS pill, timers, test buttons, etc.)
- GAS layer visibility toggle — small "GAS" button (fixed bottom-left inside GAS iframe) hides/shows all GAS-layer visual elements (Live Data app, version, email)

#### `testauth1.html` — v03.45w

##### Added
- "HTML" toggle button to hide/show the page controls overlay

#### `testauth1.gs` — v02.16g

##### Added
- "GAS" toggle button to hide/show the data interface overlay

## [v07.31r] — 2026-03-28 12:28:26 AM EST

> **Prompt:** "it seems to be working. move the data poll countdown from where it was in the html layer into the gas layer, making it work how it worked before the migration"

### Changed
- Data poll countdown timer now works across the layer boundary: GAS layer tracks poll state and sends `gas-datapoll-state` postMessage to the HTML layer, which renders the countdown/polling display in the timer panel — restoring the pre-migration behavior

#### `testauth1.html` — v03.44w

##### Changed
- Data poll timer display restored — receives state from GAS layer and renders countdown

#### `testauth1.gs` — v02.15g

##### Changed
- Data poll now tracks in-flight state and sends countdown state to the parent page for timer display

## [v07.30r] — 2026-03-28 12:12:58 AM EST

> **Prompt:** "this is a blueprint for production, so everything regarding UI and interacting with google should be on the gas layer, other than things relating to authentication. only things that have to be on the html layer should be there"

### Changed
- **Major architecture migration**: moved entire Live Data UI (table, add-row, delete-row, cell editing, dashboard, sorting, overlays, connection status) from HTML layer to GAS layer. The GAS `doGet()` HTML output now contains all data UI CSS, HTML, and JavaScript
- Data operations (write-cell, add-row, delete-row) now use `google.script.run` directly from the GAS UI instead of postMessage relay through the HTML layer
- Data poll migrated from HTML-side `fetch()` to GAS-internal `google.script.run.getAuthenticatedData()` — eliminates token-in-URL exposure on the data poll path
- HTML layer now sends `ld-init` postMessage with auth context to activate the GAS UI after authentication
- HTML layer retains only: authentication, session management, GAS iframe lifecycle, version polling, splash screens, auth wall

### Added
- `getAuthenticatedData(token)` server-side function — validates session before returning cached data (used by the GAS-internal data poll)

#### `testauth1.html` — v03.43w

##### Removed
- Live Data UI (CSS, HTML, JavaScript) — migrated to GAS layer
- HTML-side data poll (`_startDataPoll`, `_stopDataPoll`, `_sendDataPoll`) — replaced by GAS-internal poll

##### Changed
- `_showLiveDataApp` call converted to `ld-init` postMessage to GAS sandbox

#### `testauth1.gs` — v02.14g

##### Added
- Full Live Data UI (table, add-row, delete-row, cell editing, dashboard, sorting, connection status, optimistic rendering overlays) in `doGet()` HTML output
- `getAuthenticatedData(token)` function for session-validated data polling
- `ld-init` message listener for auth context delivery from HTML layer
- GAS-internal 15-second data poll via `google.script.run`
- Direct `google.script.run` calls for all data operations (no postMessage relay)

## [v07.29r] — 2026-03-27 11:48:48 PM EST

> **Prompt:** "the sending... splash is going away after the data poll 15 seconds, but it should be going away as soon as it has written it to the spreadsheet, i know it was already doing its own refresh upon sending the data"

### Fixed
- "Sending..." overlay on optimistic add-row now clears immediately when GAS confirms the write, instead of waiting for the next 15-second data poll. Root cause: `_handleLiveData` skipped re-render when the server data matched the optimistic data (no JSON diff), leaving the overlay stuck

#### `testauth1.html` — v03.42w

##### Fixed
- "Sending..." overlay clears instantly when the new row is confirmed by the server

## [v07.28r] — 2026-03-27 11:44:05 PM EST

> **Prompt:** "in the optimistic rendered pattern, can you make it have a splash similar to how it is when we are deleting, but for adding the row. also for the optimistic row, make it not have the delete button until the legit row is there"

### Changed
- Optimistic add-row now shows a "Sending..." overlay on the new row (dimmed to 35% opacity with blue text, mirroring the "Deleting..." red overlay pattern)
- Optimistic add-row no longer shows the delete button — it only appears after the server confirms the row

#### `testauth1.html` — v03.41w

##### Changed
- New rows appear dimmed with a "Sending..." overlay until the server confirms them
- Delete button hidden on unconfirmed rows

## [v07.27r] — 2026-03-27 11:32:41 PM EST

> **Prompt:** "not sure how to reproduce it, but the version before this one, the data poll somehow got stuck. see if you can figure out why"

### Fixed
- Data poll now has a 15-second safety timeout that auto-clears the in-flight flag if a fetch hangs — prevents permanent poll stall (same pattern as the heartbeat safety timer)
- Wrapped `_handleLiveData` in try-catch within the data poll's Promise `.then()` — if the table render throws, the error is logged but the poll keeps running instead of silently dying

#### `testauth1.html` — v03.40w

##### Fixed
- Data updates no longer get stuck if a network request hangs or table rendering encounters an error

## [v07.26r] — 2026-03-27 11:21:05 PM EST

> **Prompt:** "as you can see in the screenshot, in the instance where i send information, it says sending.. but while its sending if i put information into the fields, its not recognizing that there is already data in the fields"

### Fixed
- Add Row button now correctly detects text in input fields while "Sending..." is active — typing new values during a send makes the button immediately ready when the send completes, instead of staying disabled

#### `testauth1.html` — v03.39w

##### Fixed
- Add Row button recognizes new input typed while a previous row is still sending

## [v07.25r] — 2026-03-27 11:13:56 PM EST

> **Prompt:** "delete is working. make it have a splash that says deleting, similar but different from the sending.. after adding row"

### Changed
- Delete row now shows a "Deleting..." overlay on the row being deleted — row dims to 35% opacity with red "Deleting..." text centered over it, interactions disabled. Row is removed when the server confirms, or restored to normal on error

#### `testauth1.html` — v03.38w

##### Changed
- Delete row shows "Deleting..." overlay on the row while waiting for server confirmation

## [v07.24r] — 2026-03-27 09:52:43 PM EST

> **Prompt:** "great. make it so i can delete rows"

### Added
- Delete row functionality — GAS `deleteRow()` function removes a row by index from the spreadsheet, with session validation and write permission check
- Delete button (🗑️) column in the live data table for users with write permission
- Optimistic rendering for row deletion — row disappears instantly, restored on error

#### `testauth1.html` — v03.37w

##### Added
- Delete button column in table with optimistic row removal

#### `testauth1.gs` — v02.13g

##### Added
- `deleteRow()` function for removing rows by index
- `delete-row` message handler in GAS sandbox iframe

## [v07.23r] — 2026-03-27 09:46:47 PM EST

> **Prompt:** "make it so that if there is no text in field, add row button is disabled. also, is it possible to have it show the expected result in the table while waiting just for the current user so it gives the illusion that it was instantaneous"

### Changed
- Add-row button is now disabled when all input fields are empty — enables as soon as any field has text
- Add-row now uses optimistic rendering — the new row appears in the table instantly on click, before the GAS server response arrives. If the server returns an error, the optimistic row is removed

#### `testauth1.html` — v03.36w

##### Changed
- Add Row button disabled when inputs are empty
- New rows appear in the table instantly via optimistic rendering

## [v07.22r] — 2026-03-27 09:40:42 PM EST

> **Prompt:** "in testauth1, when using the add row button, i see that theres a delay from when i click the add row button to when it shows up as visible on the table. this has nothing to do with the 15 second data poll, i think its auto updating after i add the row. first of all is this true, and if so can you have a "sending" splash message while the user waits for the result"

### Changed
- Add-row button now shows "Sending..." state (disabled + dimmed) while waiting for GAS server response, restoring to "Add Row" on success or error

#### `testauth1.html` — v03.35w

##### Changed
- Add-row button shows "Sending..." feedback during server round-trip

## [v07.21r] — 2026-03-27 09:14:05 PM EST

> **Prompt:** "no now its even worse, and stuck on exchanging credentials. revert the changes you just did, then suggest what we can do"

### Removed
- Reverted v07.19r and v07.20r changes — fetch-based token exchange broke sign-in (GAS `doPost` redirect handling differs from `doGet`), and iframe replacement broke DOM clearing (sandbox attributes not preserved). Restored original iframe-based token exchange, sign-out, security event reporter, and `about:blank` DOM clearing

#### `testauth1.html` — v03.34w

##### Fixed
- Restored working sign-in flow

#### `testauth1.gs` — v02.12g

##### Removed
- Removed `doPost` handlers for `exchangeToken`, `signout`, and `securityEvent` (reverted to iframe-based approach)

## [v07.20r] — 2026-03-27 09:09:21 PM EST

> **Prompt:** "not sure if this is specifically when this happens, but on a fresh sign in, then sign out, then sign in again, its showing these errors"

### Fixed
- Replaced `gasFrame.src = 'about:blank'` DOM clearing with iframe replacement — removes the old iframe entirely and inserts a fresh blank one instead of navigating, which avoids triggering Chrome's "message channel closed" errors from Google's internal GAS listeners when the iframe content is destroyed during sign-out
- Applied same fix to Phase A iframe clearing in `showAuthWall()`

#### `testauth1.html` — v03.33w

##### Fixed
- Eliminated remaining console errors during sign-out and re-sign-in by replacing iframe navigation with iframe replacement for DOM clearing

## [v07.19r] — 2026-03-27 08:57:54 PM EST

> **Prompt:** "after signing into testauth1, getting this again in the console."

### Fixed
- Converted token exchange from iframe navigation to `fetch()` via `doPost(action=exchangeToken)` — eliminates "A listener indicated an asynchronous response" errors during sign-in by avoiding iframe destruction of Google's internal message channels
- Converted security event reporter from hidden iframe to `fetch()` via `doPost(action=securityEvent)` — eliminates console errors from iframe creation/destruction cycle
- Converted sign-out from iframe navigation to `fetch()` via `doPost(action=signout)` — eliminates console errors during sign-out flow
- Made `_finalizeSignOut()` idempotent (safe to call from both fetch callback and fallback timeout)

#### `testauth1.html` — v03.32w

##### Fixed
- Eliminated "message channel closed" console errors during sign-in and sign-out

#### `testauth1.gs` — v02.11g

##### Added
- Added `doPost` handlers for `exchangeToken`, `signout`, and `securityEvent` actions — enables fetch-based communication that avoids iframe churn

## [v07.18r] — 2026-03-27 08:32:28 PM EST

> **Prompt:** "the plan i approved, ask me to approve it again"

### Added
- Added `_fetchPausedForGIS` guard to pause data poll and heartbeat fetch while GIS sign-in popup is open — prevents COOP conflict during re-authentication with active session

#### `testauth1.html` — v03.31w

##### Added
- Data polling and session checks now pause while the sign-in popup is open

## [v07.17r] — 2026-03-27 07:51:34 PM EST

> **Prompt:** "i waited a while, and then these showed up" (screenshot of heartbeat iframe causing "A listener indicated an asynchronous response" errors)

### Fixed
- Converted heartbeat from iframe navigation to `fetch()` via `doPost(action=heartbeat)` — same pattern as data poll fix, eliminates the last source of iframe churn console errors

#### `testauth1.html` — v03.30w

##### Fixed
- Eliminated remaining console errors from heartbeat iframe navigation

#### `testauth1.gs` — v02.10g

##### Changed
- Minor internal improvements

## [v07.16r] — 2026-03-27 07:42:13 PM EST

> **Prompt:** "ok at least now we have 1 less error at a time, but still getting it." (screenshot of CSP blocking script.googleusercontent.com)

### Fixed
- Added `https://script.googleusercontent.com` to CSP `connect-src` on testauth1 — GAS redirects fetch from `script.google.com` to `script.googleusercontent.com` for the response payload

#### `testauth1.html` — v03.29w

##### Fixed
- Fixed data polling blocked after redirect to response server

## [v07.15r] — 2026-03-27 07:39:38 PM EST

> **Prompt:** "now after signing in, getting this" (screenshot of CSP connect-src blocking fetch to script.google.com)

### Fixed
- Added `https://script.google.com` to CSP `connect-src` on testauth1 — required by the new fetch-based data poll which calls the GAS doPost endpoint directly

#### `testauth1.html` — v03.28w

##### Fixed
- Fixed data polling blocked by content security policy after sign-in

## [v07.14r] — 2026-03-27 07:35:03 PM EST

> **Prompt:** "great. now address this" (screenshot of "A listener indicated an asynchronous response" console errors from data poll iframe navigations)

### Fixed
- Replaced iframe-based data poll with `fetch()` via `doPost` — eliminates the repeated iframe navigation that caused "A listener indicated an asynchronous response by returning true" errors in the console every 15 seconds

#### `testauth1.html` — v03.27w

##### Fixed
- Eliminated console errors caused by data poll iframe navigation destroying extension content scripts

#### `testauth1.gs` — v02.09g

##### Changed
- Minor internal improvements

## [v07.13r] — 2026-03-27 07:18:05 PM EST

> **Prompt:** "ok its finally writing. now lets fix the loading font error, its happening when opening the html fresh"

### Fixed
- Added Google Sign-In font domains (`fonts.gstatic.com`, `www.slant.co`) to CSP `font-src` on all auth pages — the GSI client library loads Mulish and Plus Jakarta Display fonts which were blocked by the `'self' data:` only policy

#### `testauth1.html` — v03.26w

##### Fixed
- Eliminated font loading errors that appeared on every page load

#### `globalacl.html` — v01.39w

##### Fixed
- Eliminated font loading errors that appeared on every page load

#### `programportal.html` — v01.46w

##### Fixed
- Eliminated font loading errors that appeared on every page load

## [v07.12r] — 2026-03-27 07:12:09 PM EST

> **Prompt:** "in the testauth1, we are still getting these errors when using the input fields and nothing is being written into the spreadsheet"

### Fixed
- Fixed write-cell and add-row messages not reaching the GAS sandbox frame — `gasApp.contentWindow.postMessage()` sends to the outer script.google.com shell, not the inner googleusercontent.com sandbox where the listener runs. Now captures `event.source` from `gas-auth-ok` (which comes from the sandbox) and uses that stored `_gasSandboxSource` reference for all data write operations
- Added `_gasSandboxSource` reset on `clearSession()` and iframe reload to prevent stale references

#### `testauth1.html` — v03.25w

##### Fixed
- Fixed spreadsheet writes not working — input field submissions and cell edits now correctly reach the server

## [v07.11r] — 2026-03-27 07:00:26 PM EST

> **Prompt:** "wait i dont want any external dependencies at all."

### Changed
- Removed external font domains from CSP `font-src` on all auth pages — now `'self' data:` only, no external font CDN dependencies

#### `testauth1.html` — v03.24w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.38w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.45w

##### Changed
- Minor internal improvements

## [v07.10r] — 2026-03-27 06:53:06 PM EST

> **Prompt:** "when the page reloaded, instantly showed 47 errors even before logging in."

### Fixed
- Added `font-src 'self' data: https://fonts.gstatic.com https://www.slant.co` to CSP on all auth pages and the auth template — Google Identity Services loads fonts from these origins, which were blocked by `default-src 'none'` with no `font-src` directive

#### `testauth1.html` — v03.23w

##### Fixed
- Eliminated 47 font loading errors that appeared on every page load

#### `globalacl.html` — v01.37w

##### Fixed
- Eliminated font loading errors on page load

#### `programportal.html` — v01.44w

##### Fixed
- Eliminated font loading errors on page load

## [v07.09r] — 2026-03-27 06:37:42 PM EST

> **Prompt:** "its already updated. assume that its always updated when i test it"

### Fixed
- Fixed testauth1 add-row failing silently — `google.script.run` was mangling the array parameter. Changed GAS `addRow()` to accept a JSON string instead, with the GAS iframe serializing the values before the server call

#### `testauth1.gs` — v02.08g

##### Fixed
- Adding rows to the live data table now works correctly

## [v07.08r] — 2026-03-27 06:14:47 PM EST

> **Prompt:** "add input fields into the gas so i can test multiple users writing to the live data"

### Added
- Added input fields and "Add Row" button to testauth1 live data viewer for testing multi-user writes to the spreadsheet
- Added `addRow()` function to testauth1 GAS script that appends new rows via authenticated postMessage
- Input placeholders dynamically update to match actual spreadsheet column headers

#### `testauth1.html` — v03.22w

##### Added
- New input bar below the tabs for adding rows to the live data table
- Inputs auto-label to match your spreadsheet columns

#### `testauth1.gs` — v02.07g

##### Added
- Support for adding new rows to the live data spreadsheet from the page

## [v07.07r] — 2026-03-27 05:23:48 PM EST

> **Prompt:** "ok but it shouldnt overlap the version on the gas layer bottom left"

### Changed
- Raised testauth1 testing buttons from bottom:8px to bottom:34px so they don't overlap the GAS version indicator at bottom-left

#### `testauth1.html` — v03.21w

##### Changed
- Repositioned testing buttons higher to avoid overlapping the GAS version indicator

## [v07.06r] — 2026-03-27 05:16:57 PM EST

> **Prompt:** "the foce heartbeat and security tests shouldnt be in the live data table, should be below near the version number on the left"

### Changed
- Moved Force Heartbeat and Security Tests buttons out of the live-data-app container to fixed-position bottom-left, near the version indicators — the live data table is no longer affected by the button layout

#### `testauth1.html` — v03.20w

##### Changed
- Repositioned testing buttons from inside the data table to a fixed bottom-left bar alongside the version indicators

## [v07.05r] — 2026-03-27 04:31:41 PM EST

> **Prompt:** "I meant that I want the live data table to be underneath the top row where the sign out is and also not be so tall so that the version on the right side are underneath coordinate wise don't actually move them, so the live table is not full page height but is somewhere in the center"

### Changed
- Changed testauth1 live-data-app from full-screen fixed overlay to a contained panel that starts below the user-pill top bar (top: 36px) and stops above the version indicators (bottom: 120px), so the table sits in the center of the page with the sign-out row above and version pills visible below

#### `testauth1.html` — v03.19w

##### Changed
- Reduced live data viewer from full-page overlay to a contained panel between the top bar and version indicators

## [v07.04r] — 2026-03-27 04:25:25 PM EST

> **Prompt:** "In testauth1 make it so that the live table part is squished between the top row and the testing buttons"

### Changed
- Moved testing buttons (Force Heartbeat, Security Tests) from fixed-position overlays into the live-data-app flex layout as a bottom bar, so the live table is constrained between the header row and the button bar instead of extending full-height behind floating buttons

#### `testauth1.html` — v03.18w

##### Changed
- Restructured live data layout to place testing buttons in a bottom bar within the app container, keeping the table view squished between the top header and the buttons

## [v07.03r] — 2026-03-26 03:14:18 PM EST

> **Prompt:** "i think the emoji legend should be before the repository root"

### Changed
- Moved emoji legend to appear before the Repository Root line in the README project structure, so readers see the key before scanning the tree

## [v07.02r] — 2026-03-26 03:11:20 PM EST

> **Prompt:** "have the page status's on the same row as the 🌐  Webpage"

### Changed
- Merged page status indicators (🟢 Active · 🟡 Maintenance · 🔴 Inactive) into the 🌐 Webpage row in the README emoji legend, removing the separate Page Status section

## [v07.01r] — 2026-03-26 03:08:32 PM EST

> **Prompt:** "the following is an example. for each row have both the active and inactive ones, so instead of 📊  Google Spreadsheet    — links to the page's data spreadsheet , have it be something like 📊  Google Spreadsheet         — 🔸  No spreadsheet . dont need to include the end of links to the page's data spreadsheet . do the same for all of them"

### Changed
- Restructured README emoji legend to pair each active icon with its inactive/placeholder counterpart on the same row (e.g. `📊 Google Spreadsheet — 🔸 No spreadsheet`), removing verbose link descriptions
- Consolidated Page Status into a single row (`🟢 Active — 🟡 Maintenance — 🔴 Inactive`)

## [v07.00r] — 2026-03-26 03:03:45 PM EST

> **Prompt:** "in the readme project structure, make a legend to identify what each emoji means. i.e. 🌐 is webpage, 📊google sheet, etc.. both the included and not included icons like 🔸◽🔻"

### Added
- Added emoji legend to README project structure — documents all page action icons (🌐 📊 ⛽ 🧜‍♀️ 📁), placeholder icons (🔸 ◽ 🔻), and page status indicators (🟢 🟡 🔴) so readers can interpret the tree at a glance

## [v06.99r] — 2026-03-26 02:29:03 PM EST

> **Prompt:** "i see that there are some project specific things such as the SSO indicator, but i want things like that to also be applied to the templates as they will be used with the gas-project-creator. do the same for anything else you can find like that"

### Changed
- Ported the SSO indicator system (CSS, HTML, JS) from `programportal.html` into the auth template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) so all new auth pages inherit it automatically via the gas-project-creator
- Propagated SSO indicator to `testauth1.html` and `globalacl.html` — both pages now have the full SSO indicator system (gated behind `SSO_PROVIDER: false`, so completely inert)
- Merged `_onGisPopupClosed()` into `_onGisPopupDismissed()` across all auth pages — single handler now manages both SSO indicator state and auth wall display
- Added `_updateSsoIndicator()` function with auth-wall guard to template — prevents SSO badge from appearing on the sign-in screen
- Added `_ssoRefreshDismissed` variable, SSO indicator calls to `handleTokenResponse`, `startCountdownTimers`, `stopCountdownTimers`, `attemptReauth`, SSO reconnect callback, and click handler to template
- Relocated SSO indicator CSS/HTML/JS in `programportal.html` from AP-specific AUTH sections to TEMPLATE sections for consistency with the template source

#### `testauth1.html` — v03.17w
##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.36w
##### Changed
- Minor internal improvements

#### `programportal.html` — v01.43w
##### Changed
- Minor internal improvements

## [Unreleased]

## [v06.98r] — 2026-03-26 01:58:55 PM EST

> **Prompt:** "for some reason its allowing the SSO to show in the application portal even if signed out"

### Fixed
- Fixed SSO indicator badge remaining visible on the auth wall in Program Portal — the `#sso-indicator` element (z-index 10003) was appearing above the auth wall (z-index ~10002) because async GIS token callbacks called `_updateSsoIndicator('ready'/'pending')` after `showAuthWall()` had already hidden it
- Added auth-wall visibility guard to `_updateSsoIndicator()` — when the auth wall is visible and the requested state is not 'off', the function now returns early without showing the badge, preventing all race conditions at the single control point

#### `programportal.html` — v01.42w
##### Fixed
- SSO status badge no longer appears when signed out or on the sign-in screen

## [v06.97r] — 2026-03-26 01:17:37 PM EST

> **Prompt:** "nope its still poping up"

### Fixed
- Fixed `attemptReauth()` `login_hint` always being empty — `clearSession()` was wiping the email from localStorage before `attemptReauth()` called `loadSession()` to read it, so the hint was always `''` and Google showed the full account picker every time
- Changed `attemptReauth()` to accept an `emailHint` parameter instead of reading the email internally via `loadSession()`
- Changed `reauth-btn` click handler to capture the session email before calling `clearSession()`, then pass it to `attemptReauth(emailHint)` — the login hint now contains the actual email, so Google auto-selects the correct account

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template, no version)
##### Fixed
- `attemptReauth()` now accepts `emailHint` parameter; `reauth-btn` handler captures email before `clearSession()`

#### `testauth1.html` — v03.16w
##### Fixed
- `attemptReauth()` now accepts `emailHint` parameter; `reauth-btn` handler captures email before `clearSession()`

#### `globalacl.html` — v01.35w
##### Fixed
- `attemptReauth()` now accepts `emailHint` parameter; `reauth-btn` handler captures email before `clearSession()`

#### `programportal.html` — v01.41w
##### Fixed
- `attemptReauth()` now accepts `emailHint` parameter; `reauth-btn` handler captures email before `clearSession()`

## [v06.96r] — 2026-03-26 12:58:10 PM EST

> **Prompt:** "idk what you did since its still not working as i want it to, but what i meant was that with the application portal we made it so that it automatically detects which google account to sign into if using the sign in button when absolute is about to time out, so that the user cant try to sign in under another account, so apply the same here, auto sign in the same way we have it when refreshing the page in the application portal"

### Changed
- Added `login_hint` with stored email to `attemptReauth()` and `initGoogleSignIn()` across all auth pages — when re-authenticating (via the absolute warning banner or on page load), Google now auto-selects the same account instead of showing the full account picker, preventing the user from trying to sign in under a different account while their session is expiring
- Changed `attemptReauth()` interactive fallback from `prompt: 'select_account'` to `prompt: 'consent'` with `login_hint` — forces re-auth for the same account without showing the account picker

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template, no version)
##### Changed
- Added `login_hint` to `initGoogleSignIn()` and both `initTokenClient` calls in `attemptReauth()`

#### `testauth1.html` — v03.15w
##### Changed
- Added `login_hint` to `initGoogleSignIn()` and both `initTokenClient` calls in `attemptReauth()`

#### `globalacl.html` — v01.34w
##### Changed
- Added `login_hint` to `initGoogleSignIn()` and both `initTokenClient` calls in `attemptReauth()`

#### `programportal.html` — v01.40w
##### Changed
- Added `login_hint` to `initGoogleSignIn()` and both `initTokenClient` calls in `attemptReauth()`

## [v06.95r] — 2026-03-26 12:03:38 PM EST

> **Prompt:** "when the absolute timer is low (for example in testauth1), and i click sign in again, it shows the popup to select a google account, but it stops the countdown from happening, and disconnects the data sync, which is fine but to should still be showing an indicator, unless this has timed out everything. however when i close the GIS, its not doing anything, not signing out or anything. i think it should be handled how we handled the SSO GIS reconnecting in the application portal, but do your own analysis. fix this everywhere it applies to"

### Fixed
- Added GIS popup dismissal handling (`_onGisPopupDismissed`) to the auth template, testauth1.html, and globalacl.html — when the user closes the Google sign-in popup without completing authentication and the session has already expired (e.g. absolute timer ran out while the popup was open), the auth wall is now properly shown with a clear message instead of leaving the page in a limbo state
- Added `error_callback: _onGisPopupDismissed` to all 5 `initTokenClient` calls in the auth template, testauth1, and globalacl (initGoogleSignIn, attemptReauth outer/inner, sign-in button handler, SSO refresh) — mirrors the Program Portal's existing `error_callback: _onGisPopupClosed` pattern

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template, no version)
##### Fixed
- Added `_onGisPopupDismissed()` function and `error_callback` to all GIS `initTokenClient` calls

#### `testauth1.html` — v03.14w
##### Fixed
- Added `_onGisPopupDismissed()` function and `error_callback` to all GIS `initTokenClient` calls

#### `globalacl.html` — v01.33w
##### Fixed
- Added `_onGisPopupDismissed()` function and `error_callback` to all GIS `initTokenClient` calls

## [v06.94r] — 2026-03-26 11:14:47 AM EST

> **Prompt:** "make sure everything we have fixed is applied to the templates also"

### Security
- Propagated SSO email validation (`_validateSSOTokenEmail`) from programportal.html to the auth template, testauth1.html, and globalacl.html — ensures SSO token re-acquisition on reconnect validates the Google account matches the active session across all auth pages, not just the Program Portal
- Added `login_hint` parameter to reconnect SSO GIS `initTokenClient` calls in the auth template, testauth1.html, and globalacl.html — pre-selects the correct Google account during silent token refresh

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — (template, no version)
##### Security
- Added `_validateSSOTokenEmail` function for SSO token email validation
- Added `login_hint` and `_validateSSOTokenEmail` wrapper to reconnect SSO GIS token client

#### `testauth1.html` — v03.13w
##### Security
- Added SSO token email validation to reconnect flow — mismatched Google accounts are rejected
- Added `login_hint` to pre-select the correct Google account during SSO token refresh

#### `globalacl.html` — v01.32w
##### Security
- Added SSO token email validation to reconnect flow — mismatched Google accounts are rejected
- Added `login_hint` to pre-select the correct Google account during SSO token refresh

## [v06.93r] — 2026-03-26 11:06:12 AM EST

> **Prompt:** "go ahead and change the title of testauth1 from "CHANGE THIS PROJECT TITLE TEMPLATE" to "Testauth1 Title""

### Changed
- Updated testauth1 page title from the template placeholder to "Testauth1 Title"

#### `testauth1.html` — v03.12w
##### Changed
- Page title updated from placeholder to "Testauth1 Title"

## [v06.92r] — 2026-03-26 10:49:30 AM EST

> **Prompt:** "using the Use Here button anywhere is resulting in getting permanently stuck on reconnecting verifying your session"

### Fixed
- "Use Here" button (single-tab enforcement reclaim) no longer gets permanently stuck on "Reconnecting… Verifying your session" — the `_gasAuthOkHandled` deduplication flag is now reset before reloading the iframe, so the subsequent `gas-auth-ok` message is processed instead of silently dropped

#### `programportal.html` — v01.39w
##### Fixed
- "Use Here" session reclaim no longer hangs on reconnecting

#### `globalacl.html` — v01.31w
##### Fixed
- "Use Here" session reclaim no longer hangs on reconnecting

#### `testauth1.html` — v03.11w
##### Fixed
- "Use Here" session reclaim no longer hangs on reconnecting

## [v06.91r] — 2026-03-26 09:47:33 AM EST

> **Prompt:** "ive noticed something. when i refresh the application portal, the google sign in pops up to enable SSO, however, its letting me select another account and still counting for SSO active. can you make it make sure that the account selected is the same as the one signed in to the application portal or else block it"

### Security
- SSO token re-acquisition on the Program Portal now validates that the Google account selected in the GIS popup matches the active session's email — mismatched accounts are rejected and the SSO indicator shows "retry" instead of falsely showing "ready"
- Added `login_hint` to SSO re-acquisition GIS clients so the correct account is pre-selected in the popup

#### `programportal.html` — v01.38w
##### Security
- SSO re-acquisition now validates the Google token's email against the active session — selecting a different Google account no longer falsely enables SSO
- Added `login_hint` to pre-select the correct Google account during SSO token refresh

## [v06.90r] — 2026-03-26 09:32:01 AM EST

> **Prompt:** "add the checklists for when we are on the sign in via application portal parge for all applications, including the templates"

### Changed
- SSO sign-in flow now shows the sign-in progress checklist alongside the "Signing in via [Source]" subtitle instead of hiding the checklist — users can track authentication progress during SSO sign-in just like during direct sign-in

#### `programportal.html` — v01.37w
##### Changed
- SSO sign-in now shows the progress checklist with "Signing in via Program Portal" subtitle above it

#### `globalacl.html` — v01.30w
##### Changed
- SSO sign-in now shows the progress checklist with "Signing in via Program Portal" subtitle above it

#### `testauth1.html` — v03.10w
##### Changed
- SSO sign-in now shows the progress checklist with "Signing in via Program Portal" subtitle above it

## [v06.89r] — 2026-03-26 09:25:30 AM EST

> **Prompt:** "we are sometimes getting stuck on the exchanging credentials with the server part indefinitely, the screenshot shows what it says in the console, address cleanly, no silent fallbacks"

### Fixed
- Fixed credential exchange hanging indefinitely when GAS server responds after >30s — the replay guard now shows an explicit "Sign-in timed out" error via `showAuthWall()` instead of silently dropping the `gas-session-created` message with no user feedback

#### `programportal.html` — v01.36w
##### Fixed
- Fixed sign-in hanging on "Exchanging credentials with server" when the server takes longer than 30 seconds to respond — now shows a clear timeout error with a retry prompt

#### `globalacl.html` — v01.29w
##### Fixed
- Fixed sign-in hanging on "Exchanging credentials with server" when the server takes longer than 30 seconds to respond — now shows a clear timeout error with a retry prompt

#### `testauth1.html` — v03.09w
##### Fixed
- Fixed sign-in hanging on "Exchanging credentials with server" when the server takes longer than 30 seconds to respond — now shows a clear timeout error with a retry prompt

## [v06.88r] — 2026-03-26 09:13:59 AM EST

> **Prompt:** "add these checklists to the templates, so that it can be used dynamically for whatever type of project it is, i.e. the application portal or any other application"

### Added
- Added sign-in, sign-out, and reconnecting stage checklists with elapsed timing to the auth HTML template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) — all three checklist types are now part of the template, so any new auth page inherits them automatically
- Reconnecting checklist dynamically shows/hides the SSO stage based on `SSO_PROVIDER` config — 3 stages when `SSO_PROVIDER: true`, 2 stages when `false`
- SSO sign-in override in template — hides checklist and shows "Signing in via [Source]" subtitle when authentication is handled via SSO
- Checklist CSS for all three checklist types (`.signin-checklist`, `.signout-checklist`, `.reconnect-checklist`) with pending (○ gray), active (● blue), and done (✓ green) states plus right-aligned elapsed time
- Sign-out stage hooks in `performSignOut()` — advances through clearing → tabs → apps → server → confirm stages
- Sign-in and reconnecting stage completions in `gas-auth-ok` handler for both `_directSessionLoad` and `_pendingSessionShow` paths

## [v06.87r] — 2026-03-26 08:58:20 AM EST

> **Prompt:** "alright, now make the equivalent checklists for all the other applications"

### Added
- Added sign-in, sign-out, and reconnecting stage checklists with timing to testauth1.html — replaces old single-line subtitle and static text with interactive checklists matching the Program Portal pattern
- Added sign-in, sign-out, and reconnecting stage checklists with timing to globalacl.html — same pattern as testauth1
- Both pages use 2-stage reconnecting checklist (no SSO stage) since `SSO_PROVIDER: false`
- SSO sign-in override hides checklist and shows "Signing in via [Source]" subtitle on both pages

#### `testauth1.html` — v03.08w

##### Added
- Sign-in now shows a real-time checklist with timing for each authentication step
- Sign-out now shows a real-time checklist with timing for each step
- Reconnecting now shows a real-time checklist with timing for each step

#### `globalacl.html` — v01.28w

##### Added
- Sign-in now shows a real-time checklist with timing for each authentication step
- Sign-out now shows a real-time checklist with timing for each step
- Reconnecting now shows a real-time checklist with timing for each step

## [v06.86r] — 2026-03-26 08:35:21 AM EST

> **Prompt:** "good. again just for the application portal, make the equivalent checklist for whatever is happening with the signing out...clearing your session, and also for reconnecting..."

### Added
- Added sign-out stage checklist to Program Portal — replaces static "Clearing your session" with a 5-stage checklist (clearing local session data, notifying other tabs, signing out connected apps, invalidating server session, waiting for server confirmation) using the same visual pattern as the sign-in checklist with timing for each stage
- Added reconnecting stage checklist to Program Portal — replaces static "Verifying your session" text with a 3-stage checklist (verifying session, preparing sign-in for linked apps, confirming session with server) with timing for each stage
- Added `_updateSignOutStage()`, `_completeAllSignOutStages()`, `_resetSignOutChecklist()` functions for sign-out checklist management
- Added `_updateReconnectStage()`, `_completeAllReconnectStages()`, `_resetReconnectChecklist()` functions for reconnecting checklist management
- Extended `_setStageTime()` to check all three stage time maps (sign-in, sign-out, reconnect)

#### `programportal.html` — v01.35w

##### Added
- Sign-out now shows a real-time checklist with timing for each step
- Reconnecting now shows a real-time checklist with timing for each step

## [v06.85r] — 2026-03-26 08:23:47 AM EST

> **Prompt:** "can you have it show how long it took to do each stage next to it"

### Added
- Added elapsed time display to each sign-in checklist stage on Program Portal — each completed stage shows how long it took (e.g. "0.3s", "1.2s") right-aligned next to the label
- Added `_completeAllStages()` function to mark all stages as done with their times just before the app becomes visible

#### `programportal.html` — v01.34w

##### Added
- Each sign-in stage now shows how long it took to complete, displayed next to the checkmark

## [v06.84r] — 2026-03-26 08:19:16 AM EST

> **Prompt:** "can you make the desriptions more descriptive. the contacting google seems instantaneous and i dont even get a chance to ever see it at almost ready, whatever that means"

### Changed
- Rewrote sign-in checklist stage labels on Program Portal to be more descriptive: "Requesting sign-in from Google", "Exchanging credentials with server", "Setting up your secure session", "Loading the application", "Confirming session with server"

#### `programportal.html` — v01.33w

##### Changed
- Sign-in checklist stages now have more descriptive labels explaining what each step does

## [v06.83r] — 2026-03-26 08:10:52 AM EST

> **Prompt:** "make it show underneath the spinner instead and have it be a checklist format instead of showing one by one. while we are making this, just do it for the application portal, not the others"

### Changed
- Converted sign-in stage indicator from single-line subtitle to a checklist format on the Program Portal — all stages are displayed as a list below the spinner with visual state progression (○ pending → ● active → ✓ done)
- SSO sign-in path hides the checklist and shows a simple "Signing in via [Source]" message instead

#### `programportal.html` — v01.32w

##### Changed
- Sign-in progress now shows as a visual checklist under the spinner instead of one line at a time

## [v06.82r] — 2026-03-26 08:02:27 AM EST

> **Prompt:** "ok what im looking for is a list of items that can be shown underneath the session spinner so that we know what stage of the login process we are at at any point, start with the application portal"

### Added
- Added dynamic sign-in stage indicator messages to the auth sign-in flow — users now see real-time subtitle updates under the "Signing in…" spinner showing what stage of authentication they're at: "Contacting Google…" → "Verifying your identity…" → "Sending credentials…" → "Creating your session…" → "Loading application…" → "Almost ready…"
- Added `_updateSignInStage()` helper function to the auth HTML template for centralized subtitle text updates

#### `programportal.html` — v01.31w

##### Added
- Sign-in stage indicator messages showing authentication progress under the session spinner

#### `testauth1.html` — v03.07w

##### Added
- Sign-in stage indicator messages showing authentication progress under the session spinner

#### `globalacl.html` — v01.27w

##### Added
- Sign-in stage indicator messages showing authentication progress under the session spinner

## [v06.81r] — 2026-03-26 12:18:17 AM EST

> **Prompt:** "add these explanations to the repository-information/DATA-POLL-ARCHITECTURE.md"

### Added
- Added "Simultaneous Execution Limit" section to `DATA-POLL-ARCHITECTURE.md` — explains the 30-concurrent-execution pool shared across all GAS apps under one deploying account, with danger scenarios (cold starts, cache miss self-repair, large spreadsheets), mitigation strategies, and practical ceiling table (safe up to ~200 viewers, moderate at 200-500, high risk at 500+)

## [v06.80r] — 2026-03-26 12:12:54 AM EST

> **Prompt:** "in the scaling comparison and combined cost, can you add what the max for a free/workspace account is so that we know relative total %"

### Changed
- Added GAS Quota Limits section to `DATA-POLL-ARCHITECTURE.md` — documents free vs Workspace account limits (CacheService has no limit, trigger runtime is 90min/6hr)
- Added daily call counts to scaling tables (calls/day per viewer count)
- Added Quota Headroom table showing % of daily trigger runtime consumed per scenario (1/10/50/100 viewers × test/production intervals)
- Free tier hits ceiling at ~50 concurrent viewers; Workspace handles 100+ viewers at ~39% capacity

## [v06.79r] — 2026-03-26 12:07:03 AM EST

> **Prompt:** "yes update it, think deeply"

### Changed
- Updated `DATA-POLL-ARCHITECTURE.md` to reflect final working implementation — token delivery changed from postMessage to URL parameter, added sections for token security assessment, timer display logic, GAS sandbox constraints, and production timer recommendations
