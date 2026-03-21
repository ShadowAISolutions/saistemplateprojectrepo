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
