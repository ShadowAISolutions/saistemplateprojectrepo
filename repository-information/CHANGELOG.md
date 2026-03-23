# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 99/100`

## [Unreleased]

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

## [v05.58r] — 2026-03-20 11:21:18 PM EST

> **Prompt:** "yes go ahead"

### Changed
- Added CROSS_PROJECT_ADMIN_SECRET to the auto-generated properties note in gas-project-creator — all three auto-managed properties (CACHE_EPOCH, HMAC_SECRET, CROSS_PROJECT_ADMIN_SECRET) are now listed when auth is enabled

#### `gas-project-creator.html` — v01.24w
##### Changed
- Auto-generation note now mentions all three auto-managed properties

## [v05.57r] — 2026-03-20 11:17:21 PM EST

> **Prompt:** "your first option"

### Changed
- Simplified Script Properties section in gas-project-creator — removed CACHE_EPOCH and HMAC_SECRET from the visible property list since they auto-generate on first deploy; only GITHUB_TOKEN remains as a manual step
- Added auto-generation note below the property list that dynamically shows HMAC_SECRET when auth is enabled

#### `gas-project-creator.html` — v01.23w
##### Changed
- Simplified setup steps — only the GitHub token needs manual entry now

## [v05.56r] — 2026-03-20 11:02:26 PM EST

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

## [v05.55r] — 2026-03-20 10:38:42 PM EST

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

## [v05.54r] — 2026-03-20 10:05:19 PM EST

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

## [v05.53r] — 2026-03-20 09:56:00 PM EST

> **Prompt:** "in the globalacl, im noticing that if i have the global sessions open and i sign out, it still keeps the global sessions active"

### Fixed
- Global sessions panel now closes when signing out of Global ACL

#### `globalacl.html` — v01.03w

##### Fixed
- Global sessions panel is properly hidden when sign-out occurs

## [v05.52r] — 2026-03-20 09:33:47 PM EST

> **Prompt:** "the show all apps toggle is working, but the my apps should be on the left and show all should be on the right"

### Changed
- Swapped portal access toggle labels: "My apps" now on left, "Show all" on right

#### `portal.gs` — v01.13g

##### Changed
- Toggle label order swapped — "My apps" on left, "Show all" on right (with inverted logic mapping)

## [v05.51r] — 2026-03-20 09:20:40 PM EST

> **Prompt:** "can you sort it so that when showing all apps, the apps that the user doesnt have access to should come after the ones that they do"

### Changed
- Portal app cards now sort accessible apps first, inaccessible apps last within the auth section

#### `portal.gs` — v01.12g

##### Changed
- Apps you have access to now appear before apps you don't when viewing all applications

## [v05.50r] — 2026-03-20 09:13:56 PM EST

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

## [v05.49r] — 2026-03-20 09:05:01 PM EST

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

## [v05.48r] — 2026-03-20 08:42:27 PM EST

> **Prompt:** "the application portal, make it also include the globalacl"

### Added
- Global ACL added to the portal's application registry — appears as the first app card with shield icon and auth-enabled status

#### `portal.gs` — v01.09g

##### Added
- Global ACL now appears in the application portal as the first entry for centralized access control management

## [v05.47r] — 2026-03-20 08:34:24 PM EST

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

## [v05.46r] — 2026-03-20 08:10:13 PM EST

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

## [v05.45r] — 2026-03-20 07:50:37 PM EST

> **Prompt:** "add the portal to the projects in global acl"

### Changed
- Connected the portal to the global ACL system by configuring the Master ACL spreadsheet ID and correcting the ACL sheet name

#### `portal.gs` — v01.06g

##### Changed
- Set `MASTER_ACL_SPREADSHEET_ID` to the global ACL spreadsheet (was placeholder)
- Changed `ACL_SHEET_NAME` from `"ACL"` to `"Access"` to match the Master ACL spreadsheet

## [v05.44r] — 2026-03-20 07:27:24 PM EST

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

## [v05.43r] — 2026-03-20 06:56:29 PM EST

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

## [v05.42r] — 2026-03-20 06:34:44 PM EST

> **Prompt:** "the global sessions all projects is thinking that there are no active sessions found in any project"

### Fixed
- Global Sessions interface now shows local sessions even when the Projects sheet has no SELF entry — added self-project fallback to both `listGlobalSessions` and `adminGlobalSignOutUser` so the GlobalACL's own sessions are always visible and manageable

#### `globalacl.gs` — v01.13g

##### Fixed
- Sessions from the local project now appear even when the Projects sheet is missing or has no SELF row configured

## [v05.41r] — 2026-03-20 06:13:55 PM EST

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

## [v05.40r] — 2026-03-20 05:16:32 PM EST

> **Prompt:** "undo everything you did in the last prompt, but keep a note of it in a document. its currently not loading sessions, just stuck"

### Removed
- Reverted Session Manager panel from Global ACL page — the multi-iframe implementation broke the existing Sessions dropdown by cross-contaminating admin session message routing (GAS postMessages lack project identifiers, making disambiguation impossible)

### Added
- `SESSION-MANAGER-PLAN.md` in `repository-information/` — preserves the full Session Manager implementation notes, architecture decisions, what broke, and three fix options for a future attempt

#### `globalacl.html` — v01.00w (reverted from v01.01w)

##### Removed
- Session Manager panel, CSS, and JavaScript (~360 lines) — reverted to pre-Session Manager state
- Modifications to existing admin session message handlers that caused routing conflicts

## [v05.39r] — 2026-03-20 04:59:04 PM EST

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

## [v05.38r] — 2026-03-20 04:30:27 PM EST

> **Prompt:** "ok then why are you still not using the bookends"

### Changed
- Rewrote "Response Opener" section in chat-bookends.md from descriptive advice to a hard 3-step procedural gate (Step 1: `date` call → Step 2: opening text → Step 3: everything else) — previous descriptive version was violated in the same response it was created, proving that "don't do this" rules don't work; only procedural gates with no exceptions create compliance

## [v05.37r] — 2026-03-20 04:26:46 PM EST

> **Prompt:** "why did you not do your bookends. make sure you handle it so it never happens again"

### Added
- "Response Opener — Zero Tool Calls Before First Text" prevention section in chat-bookends.md — catches the failure pattern where the entire protocol (Session Start Checklist, CODING PLAN, timestamps, bookends, end-of-response block) is skipped because the model jumps straight to tool calls without outputting text first

## [v05.36r] — 2026-03-20 04:20:50 PM EST

> **Prompt:** "in the globalacl environment, right now whenever i make a change to someones permissions, it highlights that field, but if i put it back to how it was originally it should unhighlight itself"

### Fixed
- Permission highlight now resets when a field is reverted to its original value — checkboxes and role dropdowns unhighlight automatically, and the row/Save button state updates accordingly

#### `globalacl.gs` — v01.11g

##### Fixed
- Changed fields that are reverted to their original state now correctly remove the dirty-cell highlight, dirty-row marker, and Save button visibility

## [v05.35r] — 2026-03-20 02:44:10 PM EST

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

## [v05.34r] — 2026-03-20 02:35:04 PM EST

> **Prompt:** "i meant a single save button for all changes, not per user, but you can denote by highlighting the checkboxes somehow the ones that are going to be affected"

### Changed
- ACL inline editing now uses a single "Save Changes" toolbar button instead of per-row Save buttons — modified cells get an amber highlight and the user's email turns orange to indicate pending changes

#### `globalacl.gs` — v01.09g

##### Changed
- Replaced per-row Save buttons with a single "Save Changes" button in the toolbar
- Modified checkboxes and dropdowns now get an amber background highlight to show pending changes
- User email turns orange for rows with unsaved changes
- All dirty rows are saved in parallel when clicking Save Changes

## [v05.33r] — 2026-03-20 02:29:38 PM EST

> **Prompt:** "i still want there to be a save button, not to save it after every change"

### Changed
- ACL inline editing now requires clicking a Save button per row instead of auto-saving on every change — Save button appears when a role or page access value is modified

#### `globalacl.gs` — v01.08g

##### Changed
- Inline editing now shows a Save button per row when changes are made, instead of auto-saving on every toggle

## [v05.32r] — 2026-03-20 02:25:08 PM EST

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

## [v05.31r] — 2026-03-20 02:21:26 PM EST

> **Prompt:** "yes add it. but also make sure that we dont miss this for new projects moving forward"

### Fixed
- Added missing Globalacl deploy webhook step to the auto-merge workflow — GAS auto-update from GitHub was not working because the workflow had no deploy step for Globalacl

### Changed
- Improved `setup-gas-project.sh` to show prominent warnings when the workflow deploy step is skipped due to a placeholder DEPLOYMENT_ID, including a banner at end of script output with re-run instructions

## [v05.30r] — 2026-03-20 02:09:38 PM EST

> **Prompt:** "when running functions such as delete, its showing a browser ui to confirm, have it be our own ui"

### Changed
- Replaced browser `confirm()` dialog in ACL delete with a custom styled modal that matches the existing UI

#### `globalacl.gs` — v01.06g

##### Changed
- Delete confirmation now uses a styled in-app dialog instead of the browser's default confirm popup

## [v05.29r] — 2026-03-20 02:05:14 PM EST

> **Prompt:** "wherever it creates true/false on the spreadsheet, can you have it auto format as a checkbox?"

### Added
- ACL spreadsheet page columns now auto-format as checkboxes when adding users, updating users, or adding new page columns

#### `globalacl.gs` — v01.05g

##### Added
- Page access columns now display as checkboxes in the spreadsheet when adding users, updating users, or adding new page columns

## [v05.28r] — 2026-03-20 02:00:06 PM EST

> **Prompt:** "it lets me do a single edit, then it makes everything i do permission denied"

### Fixed
- Fixed ACL management destroying all sessions after every edit — `clearAccessCacheForUser` was bumping the cache epoch (nuclear clear), orphaning all session data. Now uses targeted key removal (`access_EMAIL`, `role_EMAIL`, `rbac_roles_matrix`) so sessions remain valid while permissions are refreshed
- Renamed the epoch-bumping function to `nuclearCacheClear` for emergencies only

#### `globalacl.gs` — v01.04g

##### Fixed
- Fixed session being destroyed after each ACL edit — cache clearing now removes only permission keys instead of wiping all sessions

## [v05.27r] — 2026-03-20 01:46:22 PM EST

> **Prompt:** "ok well, after loading its showing the same error message, when i press refresh still get that error of no access"

### Fixed
- Fixed persistent PERMISSION_DENIED error in ACL management — `validateSessionForData` now extracts role/permissions from the session cache even when standard preset skips full validation, so `checkPermission('admin')` succeeds for admin users

#### `globalacl.gs` — v01.03g

##### Fixed
- Fixed PERMISSION_DENIED error when using ACL management — admin role is now correctly read from the session even when standard preset skips full validation

## [v05.26r] — 2026-03-20 01:42:16 PM EST

> **Prompt:** "when initially signing in i see this error message for a few seconds"

### Fixed
- Fixed race condition in Global ACL management UI where `loadData()` fired before session was confirmed, causing a brief "PERMISSION_DENIED" error on initial sign-in

#### `globalacl.gs` — v01.02g

##### Fixed
- Fixed brief "PERMISSION_DENIED" error on initial sign-in by deferring data load until session is confirmed

## [v05.25r] — 2026-03-20 01:33:40 PM EST

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

## [v05.24r] — 2026-03-20 01:17:27 PM EST

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

## [v05.23r] — 2026-03-20 10:34:16 AM EST

> **Prompt:** "move the include test/diagnostic features to below the authentication settings section, right before the copy code.gs for GAS button"

### Changed
- Moved "Include test/diagnostic features" checkbox to just before the Copy Code.gs button, after all configuration and authentication settings

#### `gas-project-creator.html` — v01.21w

##### Changed
- "Include test/diagnostic features" checkbox moved to just above the Copy Code.gs button, after all configuration fields and auth settings

## [v05.22r] — 2026-03-20 10:28:46 AM EST

> **Prompt:** "move the google authentication checkbox to the top of the setup and configuration instead since it affects the layout of the steps below it"

### Changed
- Moved "Include Google Authentication" checkbox to the top of the Setup & Configuration section, before all numbered steps, since toggling it changes which steps are visible

#### `gas-project-creator.html` — v01.20w

##### Changed
- "Include Google Authentication" checkbox moved to the very top of the Setup & Configuration section, above all steps, since it affects which steps are visible

## [v05.21r] — 2026-03-20 10:22:10 AM EST

> **Prompt:** "move the checkbox for include google authentication to the top of step 7 in the gas project settings"

### Changed
- Moved "Include Google Authentication" checkbox from the project configuration area to the top of the GAS Project Settings section for better discoverability

#### `gas-project-creator.html` — v01.19w

##### Changed
- "Include Google Authentication" checkbox moved to the top of the GAS Project Settings section for earlier visibility

## [v05.20r] — 2026-03-20 10:10:59 AM EST

> **Prompt:** "move up the hmac secret generator to where the set script properties is"

### Changed
- HMAC Secret generator field relocated from Authentication Settings to the Script Properties setup step for a more logical workflow

#### `gas-project-creator.html` — v01.18w

##### Changed
- HMAC Secret generator moved up to the Script Properties setup step for easier access when setting properties
- HMAC_SECRET property hint updated to reference the generator directly below instead of Auth Settings

## [v05.19r] — 2026-03-20 10:03:45 AM EST

> **Prompt:** "each script property needs its own copy button, and also the hmac secret also should have a copy button"

### Changed
- Script Properties list in gas-project-creator now has individual copy buttons per property name (CACHE_EPOCH, GITHUB_TOKEN, HMAC_SECRET) instead of a single "Copy Names" button
- HMAC Secret field now has a dedicated Copy button alongside the existing Generate and Clear buttons

#### `gas-project-creator.html` — v01.17w

##### Changed
- Each script property name now has its own individual copy button for one-click copying
- HMAC Secret field now includes a Copy button to easily copy the generated secret value

## [v05.18r] — 2026-03-20 09:55:14 AM EST

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

## [v05.17r] — 2026-03-20 09:08:46 AM EST

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


Developed by: ShadowAISolutions
