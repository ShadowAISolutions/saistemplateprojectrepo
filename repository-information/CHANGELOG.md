# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 67/100`

## [Unreleased]

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

## [v05.91r] — 2026-03-21 11:48:05 PM EST

> **Prompt:** "we are in!, but now add all of the gas features that we had in the "portal" to the "applicationportal""

### Added
- Added full portal dashboard UI to applicationportal.gs — replaces the debug "1" placeholder with the complete application portal: app cards grid, access filter toggle, open mode toggle, per-user ACL access display
- Added `getUserAppAccess()` function to applicationportal.gs — reads per-page access from the master ACL spreadsheet

#### `applicationportal.gs` — v01.05g

##### Added
- Full portal dashboard with app cards, access toggles, and styled UI — replaces debug placeholder
- Per-user app access display from ACL spreadsheet

## [v05.90r] — 2026-03-21 11:40:26 PM EST

> **Prompt:** "Mar 21, 2026, 11:38:07 PM  Error  ReferenceError: pageNonce is not defined at doGet(Code:2146:33)"

### Fixed
- Added missing `pageNonce` variable extraction and `validatePageNonce()` function to applicationportal.gs — `doGet()` was crashing with ReferenceError because `pageNonce` was used in the template literal but never defined

#### `applicationportal.gs` — v01.04g

##### Fixed
- Sign-in no longer crashes — added missing page nonce validation that was present in testauth1 but missing from applicationportal

## [v05.89r] — 2026-03-21 11:34:54 PM EST

> **Prompt:** "we are getting login success again, but still stuck on the signing in setting up your session page"

### Added
- Debug logging in applicationportal.html postMessage handler to trace auth flow — logs every GAS message type, pending token state, and session state to browser console

#### `applicationportal.html` — v01.05w

##### Added
- Console debug logging for auth flow troubleshooting — shows all postMessage traffic and auth state

## [v05.88r] — 2026-03-21 11:25:17 PM EST

> **Prompt:** "we are still stuck on the signing in page but we are not getting login success.  i want you to use the same exact deployment variables that were used in the "portal" in the "applicationportal", but there might be extra that didnt exist for it so you might have to add those. assume that the "portal" doesnt exist anymore, just the "applicationportal" i have alreadyreplaced the gas with the applicationportal gas"

### Fixed
- Set applicationportal's deployment ID and encoded URL (`_e`) to portal's working deployment ID — user has already replaced the GAS code in that deployment with applicationportal.gs

#### `applicationportal.html` — v01.04w

##### Fixed
- Connected to working GAS deployment — sign-in flow should now complete

#### `applicationportal.gs` — v01.03g

##### Changed
- Set deployment ID to match the live GAS project

## [v05.87r] — 2026-03-21 11:14:52 PM EST

> **Prompt:** "no it is not working. keep in mind that i dont want to use the "portal" anymore, the code should be for the "applicationportal" only"

### Changed
- Decoupled applicationportal from portal's GAS deployment — applicationportal is now a standalone project that needs its own GAS deployment
- Restored `TOKEN_EXCHANGE_METHOD: 'postMessage'` to match the hipaa preset in applicationportal.gs
- Reset deployment ID to placeholder pending own GAS project deployment

#### `applicationportal.html` — v01.03w

##### Changed
- Restored postMessage token exchange (HIPAA) — requires own GAS deployment with hipaa preset
- Cleared deployment URL pending own GAS project setup

#### `applicationportal.gs` — v01.02g

##### Changed
- Reset deployment ID to placeholder pending own GAS project deployment

## [v05.86r] — 2026-03-21 11:01:21 PM EST

> **Prompt:** "the application portal, im stuck in signing in page even though we are getting login success in the session log"

### Fixed
- Fixed applicationportal sign-in getting stuck on "Signing in..." — changed TOKEN_EXCHANGE_METHOD from 'postMessage' to 'url' to match the deployed GAS backend's standard preset configuration

#### `applicationportal.html` — v01.02w

##### Fixed
- Sign-in no longer gets stuck on "Signing in..." screen

## [v05.85r] — 2026-03-21 10:45:49 PM EST

> **Prompt:** "oh yes i forgot to tell you to continue, go ahead and make it use the variables that we have in the "portal""

### Changed
- Configured applicationportal with portal's production values — OAuth Client ID, HIPAA config preset (sessionStorage, postMessage, DOM clearing, 30s test heartbeat), deployment URL encoding, and deployment ID

#### `applicationportal.html` — v01.01w

##### Changed
- Configured with portal's OAuth Client ID and HIPAA security settings
- Sessions now clear on tab close and tokens are exchanged securely

#### `applicationportal.gs` — v01.01g

##### Changed
- Set production deployment ID

## [v05.84r] — 2026-03-21 10:34:56 PM EST

> **Prompt:** "then use the template to make an environment with the same variables as the "portal", but call it "applicationportal", then when you are done, ask me to tell you to continue, and you will then add the code used for the pre-recreated portal"

### Added
- New GAS project "applicationportal" — Application Portal page created from auth template with HIPAA preset, using portal's same spreadsheet, ACL, and sound file config values

## [v05.83r] — 2026-03-21 10:18:19 PM EST

> **Prompt:** "Do all groups at once"

### Changed
- Portal HIPAA conversion: Phase 1 partial — added CSP meta tag, upgraded HTML_CONFIG to HIPAA preset (sessionStorage, postMessage, single-tab, cross-device, DOM clearing), restructured auth-wall with sub-panels (signin/reconnecting/signing-in), added signing-out overlay, tab-takeover wall, session/absolute warning banners, countdown timers widget, admin session panel, role badge in user pill

#### `portal.html` — v01.19w

##### Changed
- Upgraded security settings for HIPAA compliance — sessions now clear on tab close and tokens are exchanged securely
- Added session status indicators and warning banners
- Added "Session Active Elsewhere" overlay for single-tab enforcement
- Added admin session management panel

## [v05.82r] — 2026-03-21 08:54:13 PM EST

> **Prompt:** "write up the plan with all context in a new file you need in case of interruptions, think deep, research online, write large files in chunks, etc"

### Added
- Created `12-HIPAA-SSO-IMPLEMENTATION-PLAN.md` — comprehensive two-phase plan for HIPAA-compliant SSO between portal and testauth1 (725 lines, includes gap analysis, research findings, implementation steps, testing checklist, and revert procedure)

## [v05.81r] — 2026-03-21 08:08:47 PM EST

> **Prompt:** "proceed with the detailed implementation plan, add a note somewhere so we can easily revert to how it currently is should our update not work"

### Added
- Created pre-SSO backups of `portal.html` and `testauth1.html` in `repository-information/backups/`
- Added `SSO-REVERT-INSTRUCTIONS.md` with step-by-step revert procedure

## [v05.80r] — 2026-03-21 07:08:43 PM EST

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

## [v05.79r] — 2026-03-21 06:53:58 PM EST

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

## [v05.78r] — 2026-03-21 06:28:47 PM EST

> **Prompt:** "remove the testauth2 environment"

### Removed
- Removed testauth2 environment: deleted `testauth2.html`, its HTML version file, changelog, and changelog archive
- Removed testauth2 entry from README.md structure tree

## [v05.77r] — 2026-03-21 06:15:12 PM EST

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

## [v05.76r] — 2026-03-21 06:07:27 PM EST

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

## [v05.75r] — 2026-03-21 05:47:28 PM EST

> **Prompt:** "the fixes that we have made to the testauth1, make sure those are applied to the templates"

### Changed
- Propagated testauth1 auth fixes (v05.65r–v05.74r) to both auth templates — nonce-based authentication flow, signature exemptions, CacheService eventual consistency workarounds, updated Use Here and page-load resume handlers

## [v05.74r] — 2026-03-21 05:21:32 PM EST

> **Prompt:** "refreshing a logged in page is still getting stuck on the reconnecting page" + "uppon successful login in the audit log it is logging in, showing login success, but theres also a security event as per screenshot"

### Fixed
- Fixed page refresh and "Use Here" stuck on "Reconnecting..." — replaced unreliable `loadIframeViaNonce()` (CacheService eventual consistency) with direct `?session=` iframe load on both paths. The postMessage handshake guard protects against direct URL access
- Fixed `invalid_signature` security event on login — the immediate unsigned `gas-auth-ok` was being rejected by HMAC verification when the key had already been imported from `gas-session-created`. Added `gas-auth-ok` to the HMAC signature-exempt list

#### `testauth1.html` — v02.59w
##### Fixed
- Page refresh and "Use Here" reconnect immediately instead of getting stuck
- Sign-in no longer triggers a false `invalid_signature` security event

## [v05.73r] — 2026-03-21 05:14:49 PM EST

> **Prompt:** "nope, your last change does not fix the refresh not reconnecting"

### Fixed
- Restored immediate unsigned `gas-auth-ok` postMessage before the async `google.script.run.signAppMessage()` call — v05.69r removed this and left only the async path, but `google.script.run` is too slow on the nonce/refresh path, causing the parent page to stay stuck on "Reconnecting..." indefinitely
- The immediate `gas-auth-ok` fires synchronously on page load; the signed version follows asynchronously as belt-and-suspenders

#### `testauth1.gs` — v01.90g
##### Fixed
- Page refresh and "Use Here" now complete immediately instead of waiting for async server round-trip

## [v05.72r] — 2026-03-21 05:08:29 PM EST

> **Prompt:** "alright so this is working now, but now when i refresh the page, it is perpetually stuck on "reconnecting verifying your session" page. same deal when using the "Use Here" button"

### Fixed
- Skip postMessage handshake guard on `?page_nonce=` path — nonces are one-time-use so a copied nonce URL is already useless (no handshake needed for replay protection). The handshake was blocking the page refresh and "Use Here" flows because it ran unconditionally

#### `testauth1.gs` — v01.89g
##### Fixed
- Handshake guard now only runs on `?session=` path (initial sign-in); nonce-loaded pages skip it

## [v05.71r] — 2026-03-21 04:58:52 PM EST

> **Prompt:** "applause, you got it working! write up in its own document everything you have learned throughout this implementation troubleshooting, what worked, what was happening, and what ended up working"

### Added
- Created `AUTH-DIRECT-ACCESS-FIX.md` — comprehensive write-up of the multi-session troubleshooting effort to fix direct URL access to authenticated GAS apps, covering all 12 attempts (v05.59r through v05.70r), root causes discovered (GAS multi-iframe nesting, CacheService eventual consistency, impossibility of server-side origin detection), and the final postMessage handshake guard solution

## [v05.70r] — 2026-03-21 04:51:56 PM EST

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

## [v05.69r] — 2026-03-21 03:31:22 PM EST

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

## [v05.68r] — 2026-03-21 03:22:38 PM EST

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

## [v05.67r] — 2026-03-21 03:12:33 PM EST

> **Prompt:** "still not working stuck on log in page. in the session logs we are getting the 3 lines that you see in the screenshot"

### Fixed
- Added `gas-ready-for-token` to HMAC signature-exempt list — this message comes from the token exchange listener page which has no signing key; when a user re-signs in with an existing HMAC key from a prior session, the message was being rejected as `invalid_signature`

#### `testauth1.html` — v02.55w
##### Fixed
- Sign-in flow no longer blocked by HMAC verification of unsigned token exchange messages

## [v05.66r] — 2026-03-21 03:06:45 PM EST

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

## [v05.65r] — 2026-03-21 02:51:28 PM EST

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

## [v05.64r] — 2026-03-21 01:01:38 PM EST

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

## [v05.63r] — 2026-03-21 12:45:23 PM EST

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

## [v05.62r] — 2026-03-21 12:31:09 PM EST

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

## [v05.61r] — 2026-03-21 11:55:49 AM EST

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

## [v05.60r] — 2026-03-21 11:31:04 AM EST

> **Prompt:** "no ive already done that. in the network checker, the exec seems to be guarded (i.e.https://script.google.com/a/macros/shadowaisolutions.com/s/AKfycbzcKmQ37XpdCS5ziKpInaGoHa8tZ0w6MeIP6cMWMV6-wXG2hS1K2pmBq4e4-J7xpNL-_w/exec). but the second exec with a question mark opens up the page with it thinking its authenticated (i.e.https://script.google.com/a/macros/shadowaisolutions.com/s/AKfycbzcKmQ37XpdCS5ziKpInaGoHa8tZ0w6MeIP6cMWMV6-wXG2hS1K2pmBq4e4-J7xpNL-_w/exec?session=92d25e2381aa4ad7a3b3590c76f60bc91ec612308a674b37)"

### Fixed
- Fixed GAS iframe guard — `window.self === window.top` never fires because GAS always runs inside Google's sandbox iframe; changed to `window.parent === window.top` which correctly detects direct navigation vs legitimate embedding
- Applied the same fix to both auth GAS templates (minimal and test)

#### `testauth1.gs` — v01.80g
##### Fixed
- Iframe guard now correctly blocks direct navigation to session URLs (was previously dead code due to GAS sandbox nesting)

## [v05.59r] — 2026-03-21 11:09:01 AM EST

> **Prompt:** "trouble in paradise. as per the screenshot which was done in the testauth1, you can see an exec?session= link and that link opens up the gas script, which is opening up the gas. unfortunately it is opening as if the user was logged in"

### Fixed
- Added iframe guard to GAS auth app HTML — prevents direct navigation to `exec?session=TOKEN` URLs from rendering the authenticated app outside the embedding iframe
- Applied the same fix to both auth GAS templates (minimal and test) for consistency

#### `testauth1.gs` — v01.79g
##### Fixed
- Direct navigation to session URLs no longer renders the app — shows "Access denied" message instead


Developed by: ShadowAISolutions
