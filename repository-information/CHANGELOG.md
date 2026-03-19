# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 87/100`

## [Unreleased]

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

