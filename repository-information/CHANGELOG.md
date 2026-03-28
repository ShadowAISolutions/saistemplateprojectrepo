# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 81/100`

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

#### `applicationportal.html` — v01.46w

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

#### `applicationportal.html` — v01.45w

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

#### `applicationportal.html` — v01.44w

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
- Ported the SSO indicator system (CSS, HTML, JS) from `applicationportal.html` into the auth template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) so all new auth pages inherit it automatically via the gas-project-creator
- Propagated SSO indicator to `testauth1.html` and `globalacl.html` — both pages now have the full SSO indicator system (gated behind `SSO_PROVIDER: false`, so completely inert)
- Merged `_onGisPopupClosed()` into `_onGisPopupDismissed()` across all auth pages — single handler now manages both SSO indicator state and auth wall display
- Added `_updateSsoIndicator()` function with auth-wall guard to template — prevents SSO badge from appearing on the sign-in screen
- Added `_ssoRefreshDismissed` variable, SSO indicator calls to `handleTokenResponse`, `startCountdownTimers`, `stopCountdownTimers`, `attemptReauth`, SSO reconnect callback, and click handler to template
- Relocated SSO indicator CSS/HTML/JS in `applicationportal.html` from AP-specific AUTH sections to TEMPLATE sections for consistency with the template source

#### `testauth1.html` — v03.17w
##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.36w
##### Changed
- Minor internal improvements

#### `applicationportal.html` — v01.43w
##### Changed
- Minor internal improvements

## [Unreleased]

## [v06.98r] — 2026-03-26 01:58:55 PM EST

> **Prompt:** "for some reason its allowing the SSO to show in the application portal even if signed out"

### Fixed
- Fixed SSO indicator badge remaining visible on the auth wall in Application Portal — the `#sso-indicator` element (z-index 10003) was appearing above the auth wall (z-index ~10002) because async GIS token callbacks called `_updateSsoIndicator('ready'/'pending')` after `showAuthWall()` had already hidden it
- Added auth-wall visibility guard to `_updateSsoIndicator()` — when the auth wall is visible and the requested state is not 'off', the function now returns early without showing the badge, preventing all race conditions at the single control point

#### `applicationportal.html` — v01.42w
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

#### `applicationportal.html` — v01.41w
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

#### `applicationportal.html` — v01.40w
##### Changed
- Added `login_hint` to `initGoogleSignIn()` and both `initTokenClient` calls in `attemptReauth()`

## [v06.95r] — 2026-03-26 12:03:38 PM EST

> **Prompt:** "when the absolute timer is low (for example in testauth1), and i click sign in again, it shows the popup to select a google account, but it stops the countdown from happening, and disconnects the data sync, which is fine but to should still be showing an indicator, unless this has timed out everything. however when i close the GIS, its not doing anything, not signing out or anything. i think it should be handled how we handled the SSO GIS reconnecting in the application portal, but do your own analysis. fix this everywhere it applies to"

### Fixed
- Added GIS popup dismissal handling (`_onGisPopupDismissed`) to the auth template, testauth1.html, and globalacl.html — when the user closes the Google sign-in popup without completing authentication and the session has already expired (e.g. absolute timer ran out while the popup was open), the auth wall is now properly shown with a clear message instead of leaving the page in a limbo state
- Added `error_callback: _onGisPopupDismissed` to all 5 `initTokenClient` calls in the auth template, testauth1, and globalacl (initGoogleSignIn, attemptReauth outer/inner, sign-in button handler, SSO refresh) — mirrors the Application Portal's existing `error_callback: _onGisPopupClosed` pattern

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
- Propagated SSO email validation (`_validateSSOTokenEmail`) from applicationportal.html to the auth template, testauth1.html, and globalacl.html — ensures SSO token re-acquisition on reconnect validates the Google account matches the active session across all auth pages, not just the Application Portal
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

#### `applicationportal.html` — v01.39w
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
- SSO token re-acquisition on the Application Portal now validates that the Google account selected in the GIS popup matches the active session's email — mismatched accounts are rejected and the SSO indicator shows "retry" instead of falsely showing "ready"
- Added `login_hint` to SSO re-acquisition GIS clients so the correct account is pre-selected in the popup

#### `applicationportal.html` — v01.38w
##### Security
- SSO re-acquisition now validates the Google token's email against the active session — selecting a different Google account no longer falsely enables SSO
- Added `login_hint` to pre-select the correct Google account during SSO token refresh

## [v06.90r] — 2026-03-26 09:32:01 AM EST

> **Prompt:** "add the checklists for when we are on the sign in via application portal parge for all applications, including the templates"

### Changed
- SSO sign-in flow now shows the sign-in progress checklist alongside the "Signing in via [Source]" subtitle instead of hiding the checklist — users can track authentication progress during SSO sign-in just like during direct sign-in

#### `applicationportal.html` — v01.37w
##### Changed
- SSO sign-in now shows the progress checklist with "Signing in via Application Portal" subtitle above it

#### `globalacl.html` — v01.30w
##### Changed
- SSO sign-in now shows the progress checklist with "Signing in via Application Portal" subtitle above it

#### `testauth1.html` — v03.10w
##### Changed
- SSO sign-in now shows the progress checklist with "Signing in via Application Portal" subtitle above it

## [v06.89r] — 2026-03-26 09:25:30 AM EST

> **Prompt:** "we are sometimes getting stuck on the exchanging credentials with the server part indefinitely, the screenshot shows what it says in the console, address cleanly, no silent fallbacks"

### Fixed
- Fixed credential exchange hanging indefinitely when GAS server responds after >30s — the replay guard now shows an explicit "Sign-in timed out" error via `showAuthWall()` instead of silently dropping the `gas-session-created` message with no user feedback

#### `applicationportal.html` — v01.36w
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
- Added sign-in, sign-out, and reconnecting stage checklists with timing to testauth1.html — replaces old single-line subtitle and static text with interactive checklists matching the Application Portal pattern
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
- Added sign-out stage checklist to Application Portal — replaces static "Clearing your session" with a 5-stage checklist (clearing local session data, notifying other tabs, signing out connected apps, invalidating server session, waiting for server confirmation) using the same visual pattern as the sign-in checklist with timing for each stage
- Added reconnecting stage checklist to Application Portal — replaces static "Verifying your session" text with a 3-stage checklist (verifying session, preparing sign-in for linked apps, confirming session with server) with timing for each stage
- Added `_updateSignOutStage()`, `_completeAllSignOutStages()`, `_resetSignOutChecklist()` functions for sign-out checklist management
- Added `_updateReconnectStage()`, `_completeAllReconnectStages()`, `_resetReconnectChecklist()` functions for reconnecting checklist management
- Extended `_setStageTime()` to check all three stage time maps (sign-in, sign-out, reconnect)

#### `applicationportal.html` — v01.35w

##### Added
- Sign-out now shows a real-time checklist with timing for each step
- Reconnecting now shows a real-time checklist with timing for each step

## [v06.85r] — 2026-03-26 08:23:47 AM EST

> **Prompt:** "can you have it show how long it took to do each stage next to it"

### Added
- Added elapsed time display to each sign-in checklist stage on Application Portal — each completed stage shows how long it took (e.g. "0.3s", "1.2s") right-aligned next to the label
- Added `_completeAllStages()` function to mark all stages as done with their times just before the app becomes visible

#### `applicationportal.html` — v01.34w

##### Added
- Each sign-in stage now shows how long it took to complete, displayed next to the checkmark

## [v06.84r] — 2026-03-26 08:19:16 AM EST

> **Prompt:** "can you make the desriptions more descriptive. the contacting google seems instantaneous and i dont even get a chance to ever see it at almost ready, whatever that means"

### Changed
- Rewrote sign-in checklist stage labels on Application Portal to be more descriptive: "Requesting sign-in from Google", "Exchanging credentials with server", "Setting up your secure session", "Loading the application", "Confirming session with server"

#### `applicationportal.html` — v01.33w

##### Changed
- Sign-in checklist stages now have more descriptive labels explaining what each step does

## [v06.83r] — 2026-03-26 08:10:52 AM EST

> **Prompt:** "make it show underneath the spinner instead and have it be a checklist format instead of showing one by one. while we are making this, just do it for the application portal, not the others"

### Changed
- Converted sign-in stage indicator from single-line subtitle to a checklist format on the Application Portal — all stages are displayed as a list below the spinner with visual state progression (○ pending → ● active → ✓ done)
- SSO sign-in path hides the checklist and shows a simple "Signing in via [Source]" message instead

#### `applicationportal.html` — v01.32w

##### Changed
- Sign-in progress now shows as a visual checklist under the spinner instead of one line at a time

## [v06.82r] — 2026-03-26 08:02:27 AM EST

> **Prompt:** "ok what im looking for is a list of items that can be shown underneath the session spinner so that we know what stage of the login process we are at at any point, start with the application portal"

### Added
- Added dynamic sign-in stage indicator messages to the auth sign-in flow — users now see real-time subtitle updates under the "Signing in…" spinner showing what stage of authentication they're at: "Contacting Google…" → "Verifying your identity…" → "Sending credentials…" → "Creating your session…" → "Loading application…" → "Almost ready…"
- Added `_updateSignInStage()` helper function to the auth HTML template for centralized subtitle text updates

#### `applicationportal.html` — v01.31w

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

## [v06.78r] — 2026-03-25 11:54:00 PM EST

> **Prompt:** "nope. in the data poll, its doing the yellow pulling... once, but then moving forward always going from 0 to 14 . the data is still properly being pulled, its just the data poll countdown and polling indication that we are having issues with."

### Fixed
- Data poll timer now shows "polling..." for at least 2 seconds after each poll fires — the GAS inline-JS response arrives faster than the 1s timer tick, so `_dataPollInFlight` was clearing before the timer could display the polling state. Added a 2-second minimum display window based on `_lastDataPollTick` timestamp

#### `testauth1.html` — v03.06w
##### Fixed
- Data poll countdown now shows "polling..." indicator on every poll cycle, not just the first

## [v06.77r] — 2026-03-25 11:47:57 PM EST

> **Prompt:** "nope. to recap the state we are in, it seems like things are being polled at differennt intervals. the most accurate indicator i have to the real timing is the live indicator top left which seems to be resetting between 15-17 seconds, the dapa poll however is refreshing at random times like 4 seconds remaining going straight to 15, without saying polling or anything"

### Fixed
- Fixed data poll countdown jumping randomly mid-countdown — removed duplicate `_lastDataPollTick = Date.now()` from the `live-data` response handler that was overwriting the request-time timestamp, causing the countdown to reset to 15 at a random point during the cycle

#### `testauth1.html` — v03.05w
##### Fixed
- Data poll countdown now counts down smoothly from 15 to 0 without random jumps

## [v06.76r] — 2026-03-25 11:42:42 PM EST

> **Prompt:** "no its still not working, and it seems like the iframe is being loaded way too many times in the console i see it quickly reloading over and over"

### Fixed
- Restored `_lastDataPollTick = Date.now()` in `_sendDataPoll()` — removing it in the previous fix left the timer without a baseline, causing display issues. The timestamp is now set in both places: when the request fires (for timer baseline) and when the response arrives (for accurate countdown start)

#### `testauth1.html` — v03.04w
##### Fixed
- Minor internal improvements

## [v06.75r] — 2026-03-25 11:36:58 PM EST

> **Prompt:** "nice its pulling fresh data now. though the data poll countdown istelf after the first pull is no longer properly showing when its pulling, its going straight from 0 to 15 on a loop, but its not affecting the fresh data pulling so dont break that"

### Fixed
- Data poll timer now shows "polling..." during the request round-trip — moved `_lastDataPollTick` assignment from `_sendDataPoll()` (request sent) to the `live-data` handler (response received), so the timer stays in "polling..." state until the response arrives instead of immediately starting the countdown

#### `testauth1.html` — v03.03w
##### Fixed
- Data refresh countdown now briefly shows "polling..." before resetting, instead of jumping from 0 to 15

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

