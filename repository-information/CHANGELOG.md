# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 88/100`

## [Unreleased]

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

## [v05.16r] — 2026-03-19 08:28:19 PM EST

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

## [v05.15r] — 2026-03-19 07:17:21 PM EST

> **Prompt:** "update the gas and html templates to match what we have in the testauth1 environment. make sure you therefore fix the scripts to work on the new template code"

### Added
- `TEMPLATE-UPDATE-PLAN.md` — phased implementation plan for syncing auth templates with testauth1's evolved feature set (RBAC, HMAC-SHA256, admin panel, cache epoch, cross-device enforcement, tab takeover, CSP, and 10+ new config toggles)

## [v05.14r] — 2026-03-19 05:46:46 PM EST

> **Prompt:** "in the testauth1, for an admin user, i am no longer able to click on the button to see who is logged in to log them out anymore, think deep"

### Fixed
- Admin Sessions button unclickable for admin users — `applyUIGating()` set `el.style.display = ''` to show gated elements, but the `#admin-sessions-btn` CSS has `display: none` as default, so clearing the inline style just exposed the stylesheet rule and the button stayed hidden. Changed to `display: 'inline-block'` for visible state

#### `testauth1.html` — v02.45w

##### Fixed
- Admin Sessions button now properly visible and clickable for admin users

## [v05.13r] — 2026-03-19 02:57:40 PM EST

> **Prompt:** "ok then is there a function that can do get and do it for each key name"

### Added
- `inspectCache()` diagnostic function — probes all known cache key patterns for each user and logs what's found, including current and previous epoch entries

#### `testauth1.gs` — v01.72g

##### Added
- New diagnostic tool to view cache contents from the GAS editor

## [v05.12r] — 2026-03-19 02:53:47 PM EST

> **Prompt:** "still not working, are you able to clear entire cache instead of just specific cache"

### Changed
- Implemented cache epoch system — `clearAllAccessCache()` now increments a counter in ScriptProperties, instantly orphaning ALL CacheService entries without needing to know individual keys
- All CacheService access now goes through `getEpochCache()` wrapper that auto-prefixes keys with the epoch number
- Running `clearAllAccessCache()` from the GAS editor is now a true nuclear clear — guaranteed to invalidate everything

#### `testauth1.gs` — v01.71g

##### Changed
- Cache clearing now invalidates everything at once — no more stale entries from any source

## [v05.11r] — 2026-03-19 02:46:22 PM EST

> **Prompt:** "i think its something to do with the cache because after moving the ACL to its own spreadsheet, the clearallaccesscache is not working, its still holding on to old values"

### Fixed
- `clearAllAccessCache()` now collects emails from BOTH the ACL spreadsheet AND the SPREADSHEET_ID sharing list — previously only read the ACL tab, so users cached from the old sharing-list method (before ACL migration) were never cleared

#### `testauth1.gs` — v01.70g

##### Fixed
- Cache clearing now covers all users regardless of which access method originally cached them

## [v05.10r] — 2026-03-19 02:36:10 PM EST

> **Prompt:** "this is what i currently see, it wont let me click on the top to see who is logged in like it used to"

### Fixed
- Sessions button hidden for admin users — `applyUIGating()` was checking permissions array for "admin" but the spreadsheet Roles tab may not have "admin" as a permission column. Added `data-requires-role` attribute support alongside `data-requires-permission`, and switched the Sessions button to use role-based gating

#### `testauth1.html` — v02.44w

##### Fixed
- Admin session management button now appears correctly for admin users

#### `testauth1.gs` — v01.69g

##### Changed
- Minor internal improvements

## [v05.09r] — 2026-03-19 02:30:31 PM EST

> **Prompt:** "if i run the clearaccesscacheforuser function, how exactly am i supposed to specify which user"

### Changed
- `clearAccessCacheForUser()` now accepts an email parameter and falls back to Script Properties key `CLEAR_CACHE_EMAIL` — no longer requires editing the source code

#### `testauth1.gs` — v01.68g

##### Changed
- Cache clearing for individual users now reads the target email from a Script Properties setting instead of requiring a code edit

## [v05.08r] — 2026-03-19 02:25:25 PM EST

> **Prompt:** "the clearallaccesscache is not reseting the permissions, i changed a user to editor and when logging in still says viewer"

### Fixed
- `clearAllAccessCache()` now invalidates all active sessions, forcing users to re-authenticate with fresh roles — previously only cleared the access lookup cache while existing sessions kept the old role
- `clearAccessCacheForUser()` also invalidates the target user's sessions for the same reason

#### `testauth1.gs` — v01.67g

##### Fixed
- Clearing the access cache now forces all users to sign in again so role changes take effect immediately

## [v05.07r] — 2026-03-19 02:15:50 PM EST

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

## [v05.06r] — 2026-03-19 02:07:08 PM EST

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

## [v05.05r] — 2026-03-19 01:24:26 PM EST

> **Prompt:** "lets start first by using a new dedicated spreadsheet, its spreadsheet ID is 1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI"

### Changed
- Switched testauth1 ACL to use a new dedicated centralized spreadsheet for access control, separating ACL management from project data

#### `testauth1.gs` — v01.64g

##### Changed
- Updated MASTER_ACL_SPREADSHEET_ID to point to new dedicated ACL spreadsheet

## [v05.04r] — 2026-03-19 12:45:41 PM EST

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

## [v05.03r] — 2026-03-19 12:37:20 PM EST

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

## [v05.02r] — 2026-03-19 12:24:13 PM EST

> **Prompt:** "right now its just saying loading sessions. where is it pulling the list of active sessions?"

### Fixed
- Fixed admin session panel stuck on "Loading sessions..." — the postMessage was being sent to the GAS outer shell iframe (`contentWindow`) instead of the inner sandbox frame where the listener runs. Now uses `event.source` from the `gas-admin-sessions-ready` signal to target the correct sandbox frame (same pattern as `gas-ready-for-token`)

#### `testauth1.html` — v02.39w

##### Fixed
- Session management panel now loads and displays active sessions correctly

## [v05.01r] — 2026-03-19 12:16:19 PM EST

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

## [v05.00r] — 2026-03-19 11:43:05 AM EST

> **Prompt:** "you can add these things to the gas for me"

### Added
- Added admin utility functions to testauth1.gs for clearing the server-side access cache — `clearAccessCacheForUser()` clears a single user, `clearAllAccessCache()` clears all ACL-listed users

#### `testauth1.gs` — v01.60g

##### Added
- Admin utility to clear access cache for a specific user or all users, so ACL changes take effect immediately without waiting 10 minutes

## [v04.99r] — 2026-03-19 11:34:59 AM EST

> **Prompt:** "im testing on another user and they are showing up as admin, even if they are not on the ACL list"

### Fixed
- Fixed bug where users not in the ACL tab could still sign in via the spreadsheet's editor/viewer sharing list (Method 2 fallback). When the ACL tab is configured, it is now the sole authority — the sharing-list check is skipped entirely

#### `testauth1.gs` — v01.59g

##### Fixed
- Users not listed in the ACL tab are now properly denied access instead of being admitted through the spreadsheet sharing list

## [v04.98r] — 2026-03-19 11:23:01 AM EST

> **Prompt:** "ok i did it, can you have it show the role i am when i log in to confirm"

### Changed
- Added role badge display to the user pill after sign-in, showing the user's assigned RBAC role (e.g. admin, clinician, viewer) from the ACL spreadsheet

#### `testauth1.html` — v02.37w

##### Changed
- Show user's role badge in the top-right corner after sign-in

## [v04.97r] — 2026-03-19 10:55:31 AM EST

> **Prompt:** "for now use the testauth1 spreadsheet as the ACL while we are testing, set up the tab for it"

### Changed
- Configured `MASTER_ACL_SPREADSHEET_ID` to use the existing testauth1 data spreadsheet (`1EKParBF6pP5Iz605yMiEqm1I7cKjgN-98jevkKfBYAA`) as the ACL source for testing — activates RBAC role lookups from the ACL tab

#### `testauth1.gs` — v01.58g

##### Changed
- ACL spreadsheet ID set to testauth1 data spreadsheet — RBAC now reads roles from the ACL tab in the same spreadsheet

## [v04.96r] — 2026-03-19 10:46:42 AM EST

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

## [v04.95r] — 2026-03-19 09:15:01 AM EST

> **Prompt:** "review the repository-information/HIPAA-CODING-REQUIREMENTS.md , and analyze which parts are missing/completed in our testauth1 environment. think deeply and create a report document with your findings"

### Added
- Created `HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md` — comprehensive compliance assessment evaluating all 40 HIPAA coding checklist items against the testauth1 environment. Reports 14 fully implemented, 5 partial, 4 not implemented, 3 N/A, 5 policy/process, and 9 NPRM items. Identifies 7 priority gaps (disclosure accounting, right of access, right to amendment, RBAC, retention enforcement, breach alerting, breach logging) and 5 strengths exceeding requirements (dual timeouts, HMAC integrity, dual audit logs, escalating lockout, fail-closed design). Includes test-value warnings for production deployment

## [v04.94r] — 2026-03-19 08:48:12 AM EST

> **Prompt:** "make a complete document which lists every single unabridged HIPAA requirement for coding to be used as our source of truth for HIPAA compliance moving forward. This is very important to get right, think deeply, research online. When writing a large document or file, write it in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Created `HIPAA-CODING-REQUIREMENTS.md` — comprehensive 950-line regulatory reference document containing every HIPAA requirement relevant to software development, derived from the unabridged text of 45 CFR Part 164 (Security Rule, Privacy Rule, Breach Notification Rule), supplemented by NIST SP 800-66r2 guidance and the 2025 NPRM proposed changes. Includes 13 sections covering applicability, definitions, all 5 Security Rule safeguard categories, Privacy Rule coding requirements, breach notification, de-identification standards, summary counts, and a 40-item coding implementation checklist. Supersedes `HIPAA-COMPLIANCE-REFERENCE.md` as the project's HIPAA source of truth

