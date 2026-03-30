# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 84/100`

## [v08.14r] — 2026-03-30 11:36:58 AM EST

> **Prompt:** "walk me through the steps to verify that everything is functioning as intended, then write it up as part of the plan C document, also update the list of things that were done/not done"

### Added
- Added Developer Verification Walkthrough to `HIPAA-PHASE-C-IMPLEMENTATION-GUIDE.md` — 34 checks across 6 tiers covering legal holds, compliance audit, archive integrity, retention policy, cross-cutting concerns, and Phase B integration
- Added Implementation Status section to the Phase C guide with "What Was Implemented" table (14 functions, 4 utilities, 9 routes, 4 panels), post-deployment configuration items, and known limitations with regulatory risk assessments

### Changed
- Updated `HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md` scorecard — 7 items moved to ✅ Implemented: #18 6-Year Retention (Phase B+C), #19 Disclosure Accounting (Phase A+B), #23 Right of Access (Phase A), #24 Right to Amendment (Phase A), #28 Breach Detection (Phase B), #31 Breach Logging (Phase B). All current-law ❌ gaps now closed
- Updated compliance percentage from 61% to 81% (22/31 current-law items implemented + 3 N/A)
- Updated Before/After comparison table with three-column history (Original → Follow-Up → Current)
- Marked Phases A, B, and C as complete in the implementation roadmap
- Updated Phase C guide Document Information table with implementation status, GAS/HTML versions, and document history

## [v08.13r] — 2026-03-30 11:13:25 AM EST

> **Prompt:** "as long as its not part of the Phase D — Production Hardening of repository-information/HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md, then i do want you to implement it, so Phase C should be completely implemented."

### Added
- Implemented all Phase C HIPAA GAS functions in `testauth1.gs` — 14+ new functions covering legal hold management (`placeLegalHold()`, `releaseLegalHold()`, `checkLegalHold()`, `getLegalHolds()`), retention compliance audit (`auditRetentionCompliance()`, `getComplianceAuditReport()`, `setupComplianceAuditTrigger()`), archive integrity verification (`computeArchiveChecksum()`, `verifyArchiveIntegrity()`), retention policy documentation (`getRetentionPolicyDocument()`, `exportRetentionPolicy()`), and shared utilities (`computeRowsChecksum()`, `wrapRetentionOperation()`, `getHoldNotificationEmail()`, `getRetentionRelevantDate()`)
- Added `LEGAL_HOLD_CONFIG` and `INTEGRITY_CONFIG` objects to `testauth1.gs` for Phase C feature configuration
- Modified `enforceRetention()` to integrate legal hold checking, "last in effect" date calculation, and archive integrity checksums
- Added 9 Phase C doGet message routes in `testauth1.gs` for HTML↔GAS communication
- Added Phase C admin UI to `testauth1.html` — 4 new admin dropdown buttons (Legal Holds, Compliance Audit, Archive Integrity, Retention Policy) and 4 new admin panels with full CRUD functionality
- Added Phase C message routing (8 response types) and handler functions in `testauth1.html`
- Updated `showAuthWall()` in `testauth1.html` to clean up Phase C panels and clear PHI data on sign-out

### Changed
- Fixed `HIPAA-PHASE-C-IMPLEMENTATION-GUIDE.md` — corrected `auditRetentionCompliance()` scope attribution from Phase B to Phase C, updated key code location line numbers to reflect post-implementation positions, added v1.1 version mapping entry

#### `testauth1.gs` — v02.29g

##### Added
- All Phase C HIPAA retention functions: legal hold management, compliance audit, archive integrity, and policy documentation
- Integration of legal hold checking and archive checksums into the daily retention enforcement flow

#### `testauth1.html` — v03.80w

##### Added
- Phase C admin panels: Legal Holds, Compliance Audit, Archive Integrity, Retention Policy
- Phase C admin dropdown buttons with admin-only permission gating

## [v08.12r] — 2026-03-30 10:26:30 AM EST

> **Prompt:** "with the same amount of detail, formatting, research, and deep thought used in the repository-information/HIPAA-PHASE-A-IMPLEMENTATION-GUIDE.md and repository-information/HIPAA-PHASE-B-IMPLEMENTATION-GUIDE.md, i want you to apply that into making the HIPAA Phase C Implementation Guide, the next phase in the repository-information/HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md . Write the document in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Created `repository-information/HIPAA-PHASE-C-IMPLEMENTATION-GUIDE.md` — comprehensive 2,669-line, 18-section implementation guide for HIPAA Phase C (Retention Enforcement deep dive), covering 5 items: #18 Core Retention Enhancement with "last in effect" date handling (§164.316(b)(2)(i)), #18b Legal Hold Override for litigation preservation (FRCP Rule 37(e)), Retention Compliance Audit System (§164.308(a)(8)), Archive Integrity Verification with SHA-256 checksums (§164.312(c)(1-2)), and Retention Policy Documentation Generator (§164.316(b)(1))
- Full GAS function specifications for ~14 new functions: `placeLegalHold()`, `releaseLegalHold()`, `checkLegalHold()`, `getLegalHolds()`, `auditRetentionCompliance()`, `getComplianceAuditReport()`, `setupComplianceAuditTrigger()`, `computeArchiveChecksum()`, `verifyArchiveIntegrity()`, `getRetentionPolicyDocument()`, `exportRetentionPolicy()`, `getRetentionRelevantDate()`, `computeRowsChecksum()`, `wrapRetentionOperation()`
- Regulatory landscape section with 6 OCR enforcement cases totaling $32.7M in penalties (Anthem, Premera, CHSPSC, Excellus, Banner Health, LA Care)
- Spreadsheet schemas for 2 new sheets: `LegalHolds` (15 columns) and `RetentionIntegrityLog` (9 columns)
- 40+ test scenarios across 5 test categories with end-to-end integration test
- CFR paragraph-level regulatory compliance matrix covering §164.316(b), §164.308(a)(8), §164.312(c), §164.530(j), FRCP Rule 37(e), and §160.312
- Forward-looking regulatory preparation for Security Rule NPRM, Privacy Rule NPRM, 42 CFR Part 2, and state-level privacy laws

## [v08.11r] — 2026-03-30 09:49:15 AM EST

> **Prompt:** "write this up as part of the phase B document, also update the list of things that were done/not done"

### Added
- Added Implementation Status section to `HIPAA-PHASE-B-IMPLEMENTATION-GUIDE.md` — comprehensive tracking of what was implemented (18 functions, 11 routes, all UI elements), what requires post-deployment configuration (security officer email, MailApp authorization, retention trigger), and known limitations with regulatory risk assessment
- Added Developer Verification Walkthrough to `HIPAA-PHASE-B-IMPLEMENTATION-GUIDE.md` — 42-check structured testing guide organized by priority tier (Pre-Flight, UI Elements, P1/P2/P3 functional tests, Cross-Cutting concerns) plus a 7-step quick smoke test

### Changed
- Updated Phase B at a Glance status table from pre-implementation targets (❌/⚠️ → ✅) to post-implementation status with version numbers (v02.28g / v03.79w)
- Updated Document Information with implementation date, implemented GAS/HTML versions, and implementation status

## [v08.10r] — 2026-03-30 09:36:36 AM EST

> **Prompt:** "Think deeply and implement repository-information/HIPAA-PHASE-B-IMPLEMENTATION-GUIDE.md"

### Added
- Implemented full HIPAA Phase B compliance extension for testauth1 — 18 new GAS functions, 11 doGet() message routes, 3 config objects, and 4 shared utility functions across all 3 priority tiers (P1: Required Sub-Paragraphs, P2: Breach Infrastructure, P3: Personal Representatives)
- P1: `getGroupedDisclosureAccounting()` for §164.528(b)(2)(ii) grouped disclosures, `generateDataSummary()` for §164.524(c)(3) summary PHI export, `sendAmendmentNotifications()` + `getNotificationStatus()` + `getDisclosureRecipientsForRecord()` for §164.526(d) third-party amendment notifications
- P2: `evaluateBreachAlert()` + `sendBreachAlert()` + `getBreachAlertConfig()` for §164.404/408 breach detection and alerting, `logBreach()` + `logBreachFromAlert()` + `getBreachLog()` + `getBreachReport()` + `updateBreachStatus()` for §164.408 breach logging with annual report generation, `enforceRetention()` + `setupRetentionTrigger()` + `auditRetentionCompliance()` for §164.316 retention enforcement with automated time-driven triggers
- P3: `registerPersonalRepresentative()` + `getPersonalRepresentatives()` + `revokeRepresentative()` + `validateRepresentativeAccess()` for §164.502(g) personal representative access management
- Extended `validateIndividualAccess()` with representative authorization support
- Added `evaluateBreachAlert()` call in `processSecurityEvent()` for real-time breach detection
- Added breach dashboard panel and personal representative management panel to testauth1.html with full admin UI
- Added grouped disclosure toggle, summary export radio option with agreement checkbox, and all 11 Phase B message handlers + JavaScript handler functions to testauth1.html
- Wired data export download button to route "summary" format to Phase B `generateDataSummary()` endpoint
- Updated `showAuthWall()` to hide Phase B panels (breach dashboard, representative panel) and clear Phase B data elements
- Replaced browser `prompt()` in representative revocation with inline custom input (per "UI Dialogs — No Browser Defaults" coding guideline)

#### `testauth1.gs` — v02.28g

##### Added
- 18 HIPAA Phase B functions: grouped disclosure accounting, summary PHI export, amendment notifications with tracking, breach detection/alerting/logging with annual reports, retention enforcement with automated triggers, personal representative registration/management/revocation
- 3 configuration objects: BREACH_ALERT_CONFIG, HIPAA_RETENTION_CONFIG, REPRESENTATIVE_CONFIG
- 4 shared utility functions: wrapHipaaOperation, sendHipaaEmail, getRetentionCutoffDate, isRepresentativeAuthorized
- 11 doGet() message routes for all Phase B operations
- Real-time breach evaluation integrated into processSecurityEvent()
- Representative authorization support in validateIndividualAccess()

#### `testauth1.html` — v03.79w

##### Added
- Breach dashboard admin panel with log viewer, incident logging form, and annual report generation
- Personal representative management panel with registration form, list view, and revoke functionality
- Grouped disclosure toggle checkbox in disclosure accounting panel
- Summary export radio button with HIPAA agreement checkbox in data export panel
- 11 Phase B postMessage handler cases and complete JavaScript handler functions

##### Changed
- Data export download button now routes "summary" format to Phase B summary endpoint
- Auth wall now hides Phase B panels and clears Phase B data elements on sign-out
- Representative revocation uses inline input instead of browser prompt() dialog

## [v08.09r] — 2026-03-30 08:31:22 AM EST

> **Prompt:** "the same amount of detail, formatting. research, and deep thought used in the repository-information/HIPAA-PHASE-A-IMPLEMENTATION-GUIDE.md, i want you to apply that into making the HIPAA Phase B Implementation Guide, the next phase in the repository-information/HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md . Write the document in small chunks — create the file with the first few sections, then use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally: skeleton first, then flesh out each section."

### Added
- Created `repository-information/HIPAA-PHASE-B-IMPLEMENTATION-GUIDE.md` — comprehensive Phase B implementation guide (3,067 lines, 20 sections) covering 7 HIPAA items across 3 priority tiers: P1 Required sub-paragraphs (#19b Grouped Disclosure Accounting, #23b Summary PHI Export, #24b Third-Party Amendment Notifications), P2 Breach Infrastructure (#18 Retention Enforcement, #28 Breach Detection Alerting, #31 Breach Logging), P3 Personal Representatives (#25 Personal Representative Access). Includes full GAS function specifications with code examples, 3 new spreadsheet schemas (AmendmentNotifications, BreachLog, PersonalRepresentatives), security checklist, CFR paragraph-level regulatory compliance matrix, before/after comparison tables (compliance 74%→90%), 55+ test scenarios with end-to-end integration test, troubleshooting guide, and forward-looking regulatory preparation covering pending NPRM impacts and state-level privacy law considerations

## [v08.08r] — 2026-03-30 07:39:58 AM EST

> **Prompt:** "Stop hook feedback: uncommitted changes (archive rotation ordering fix)"

### Fixed
- Fixed testauth1 HTML changelog archive section ordering — rotated sections now appear in newest-first (reverse chronological) order as required

## [v08.07r] — 2026-03-30 07:29:44 AM EST

> **Prompt:** "analyze the repository-information/HIPAA-PHASE-A-IMPLEMENTATION-GUIDE.md and determine where we are in the process of implementing it in testauth1. then prepare to continue implementing"

### Security
- Fixed CSV injection vulnerability in `convertToCSV()` — values starting with `=`, `+`, `@`, or `-` are now prefixed with a single quote to prevent formula injection when CSV files are opened in Excel/Sheets

### Fixed
- Added missing `data-requires-permission="admin"` attribute to the amendment review button — non-admin users could see the button (though server-side permissions still blocked the action)

#### `testauth1.gs` — v02.27g

##### Security
- Added CSV injection prevention in `convertToCSV()` — sanitizes formula injection characters (`=`, `+`, `@`, `-`) with single-quote prefix before RFC 4180 escaping

#### `testauth1.html` — v03.78w

##### Fixed
- Added `data-requires-permission="admin"` to the amendment review button so it's only visible to admins

## [v08.06r] — 2026-03-29 10:52:39 PM EST

> **Prompt:** "for the up and down arrows, disable the up button on the top most item, and same for the down button on the bottom most button. if there is only 1 both should be disabled. when i mean disabled i mean unclickable but still visible"

### Changed
- Disabled move-up arrow on the first announcement and move-down arrow on the last announcement (visually dimmed and unclickable). Both arrows disabled when only one announcement exists

#### `programportal.gs` — v01.36g

##### Changed
- Added boundary checks on move up/down buttons: first item's up and last item's down get `disabled` attribute and `.disabled` CSS class
- Added `.ann-admin-btn.move.disabled` CSS with `opacity: 0.3`, `cursor: default`, and `pointer-events: none`

## [v08.05r] — 2026-03-29 10:45:35 PM EST

> **Prompt:** "make the add announcement ,save order, and cancel changes buttons be on the same row"

### Changed
- Placed Add Announcement, Save Order, and Cancel Changes buttons on a single horizontal row using a flex container instead of stacking vertically

#### `programportal.gs` — v01.35g

##### Changed
- Added `.ann-btn-row` flex container to hold all three admin buttons in a single row
- Changed buttons from `width: 100%` to `flex: 1` so they share the row equally

## [v08.04r] — 2026-03-29 10:35:42 PM EST

> **Prompt:** "the top of the gas in the program portal is being cut off, fix it so everything is properly shown"

### Fixed
- Fixed Program Portal GAS content being cut off at the top by changing body CSS from `justify-content: center` to `justify-content: flex-start` — vertical centering was pushing content above the visible viewport when the page was taller than the screen

#### `programportal.gs` — v01.34g

##### Fixed
- Fixed page content being cut off at the top when scrolling

## [v08.03r] — 2026-03-29 10:22:14 PM EST

> **Prompt:** "make the website be the first one on the public applications list."

### Changed
- Reordered PORTAL_APPS array in `programportal.gs` to place Website before Test Environment and GAS Project Creator in the public applications section

#### `programportal.gs` — v01.33g

##### Changed
- Moved Website entry from position 4 to position 3 in PORTAL_APPS array (first public app)

## [v08.02r] — 2026-03-29 10:06:41 PM EST

> **Prompt:** "while its optimistic have this side thing be a slightly different blue"

### Added
- Optimistic state visual indicator: announcement cards show a lighter blue left border (`#90caf9`) while pending server confirmation, reverting to normal priority color once the server responds
- `_optimistic` flag on locally-added/edited items; `.optimistic` CSS class overrides `border-left-color`
- Flag is automatically cleared when `_forceRenderAnnouncements` replaces local items with server data

#### `programportal.gs` — v01.32g

##### Added
- `.announcement-card.optimistic { border-left-color: #90caf9; }` CSS
- `_optimistic: true` flag on optimistic add and edit items
- `optimistic` class applied conditionally in card rendering

## [v08.01r] — 2026-03-29 10:03:03 PM EST

> **Prompt:** "can the optimistic show it? i would hope that everything that we expect to be the result will always be done in the optimistic"

### Changed
- Optimistic add now includes author (`_userName` from session) and current timestamp — new announcements show "by YourName" instantly without waiting for server response
- Optimistic edit now preserves the existing author field — prevents author from disappearing during the optimistic re-render
- Added `_userName` client-side variable (injected from `session.displayName || session.email`) for optimistic author display

#### `programportal.gs` — v01.31g

##### Changed
- Optimistic add item now includes `author: _userName`
- Optimistic edit item now includes `author: _annLocalItems[u].author` (preserved from existing)
- Added `var _userName` client-side injection from session data

## [v08.00r] — 2026-03-29 09:57:49 PM EST

> **Prompt:** "in program portal, make it so that the announcements auto put who made the announcement as well as the timestamp"

### Added
- Author column (F) added to the Announcements spreadsheet schema — auto-populated from session user's displayName or email when adding an announcement
- Author field included in cached announcement data and displayed on announcement cards alongside the date (`Mar 29, 2026 · by Shadow`)
- Auto-create template now generates 6 columns (Title, Body, Date, Priority, Active, Author) with "System" as the welcome row author

### Changed
- `updateAnnouncement()` now preserves the existing author and date when editing (only title, body, priority, and active status are editable)

#### `programportal.gs` — v01.30g

##### Added
- `author` field in cached announcement items (from spreadsheet column F)
- Auto-populated author in `addAnnouncement()` from `user.displayName || user.email`
- Author display in card rendering: `dateStr · by authorName`

##### Changed
- Auto-create headers expanded from A-E to A-F with "Author" column
- `updateAnnouncement` preserves existing author (column F) and date (column C) on edits

## [v07.99r] — 2026-03-29 09:31:52 PM EST

> **Prompt:** "the gas toggle, why is it showing on the sign in page if there not supposed to be any gas visible, if there is gas that is supposedly visible in the sign in page address it" + "it should be like the testauth1" + "the gas toggle is on the gas layer itself"

### Changed
- Moved GAS layer toggle button from `programportal.html` (embedding page, visible on sign-in) to `programportal.gs` (GAS iframe, only visible after authentication) — matching TestAuth1's pattern where the GAS toggle lives inside the GAS layer

### Removed
- GAS toggle button and `_toggleGasLayer` JS from `programportal.html` — replaced by the GAS-layer version

### Added
- GAS toggle button inside `programportal.gs` doGet HTML template (fixed bottom-left at `left:135px`, same position as TestAuth1)
- `_toggleGasLayer()` JS in the GAS iframe PROJECT block — toggles visibility of portal header, app sections, announcements, footer, and version display using `.gas-layer-hidden` CSS class
- `.gas-layer-hidden { display: none !important; }` CSS in the GAS iframe
- `id` attributes on portal header and footer divs for toggle targeting

#### `programportal.html` — v01.73w

##### Removed
- GAS toggle button and `_toggleGasLayer()` function (moved to GAS layer)

#### `programportal.gs` — v01.29g

##### Added
- GAS layer toggle button and `_toggleGasLayer()` function (moved from embedding page)

## [v07.98r] — 2026-03-29 07:06:43 PM EST

> **Prompt:** "can you make it so that the user can drag the announcements to reorder them?"

### Added
- HTML5 drag-and-drop reordering for announcement cards (admin only) — drag any card to a new position, local-only until Save Order is clicked
- Drag handle icon (⠿) on each card title, grab cursor on hover, reduced opacity during drag, blue top-border indicator on drop target
- Cards get `draggable="true"` and `data-drag-idx` attributes; `dragstart`/`dragover`/`drop`/`dragend` event listeners handle the reorder logic
- Drag reorder integrates with existing Save Order / Cancel Changes workflow

#### `programportal.gs` — v01.28g

##### Added
- Drag-and-drop event handlers on announcement cards (dragstart, dragover, drop, dragend)
- `.dragging`, `.drag-over`, `.ann-drag-handle` CSS classes
- Drag handle (⠿) prepended to announcement titles for admin users

## [v07.97r] — 2026-03-29 07:03:58 PM EST

> **Prompt:** "add a cancel changes button for the save order that will revert to what it was before changes to order, right now the only way to have it revert is by manually doing it"

### Added
- "Cancel Changes" button next to "Save Order" that reverts announcement order to the last saved/synced state
- `_annOriginalItems` deep copy for full item state restoration on cancel
- `_cancelOrderChanges()` function restores items from snapshot and re-renders

#### `programportal.gs` — v01.27g

##### Added
- Cancel Changes button in render, `_cancelOrderChanges()`, `_annOriginalItems` snapshot
- `_checkOrderDirty()` now toggles both Save Order and Cancel Changes buttons
- `_forceRenderAnnouncements()` resets `_annOriginalItems` on server sync

## [v07.96r] — 2026-03-29 07:01:13 PM EST

> **Prompt:** "make it so that you cant close the modals clicking somewhere off of them, for edit and delete and any others"

### Changed
- Removed click-outside-to-dismiss from both the add/edit modal and the delete confirmation modal — modals can only be closed via their Cancel or action buttons

#### `programportal.gs` — v01.26g

##### Changed
- Removed overlay click listeners that called `overlay.remove()` on click-outside from both `_openAnnModal()` and `_deleteAnnouncement()`

## [v07.95r] — 2026-03-29 06:57:52 PM EST

> **Prompt:** "the delete button should have its confirmation handled by the gas not the browser"

### Changed
- Replaced browser `confirm()` dialog with a custom themed modal for delete confirmation — dark background, "Cancel" and red "Delete" buttons, click-outside-to-dismiss, consistent with the add/edit modal styling

#### `programportal.gs` — v01.25g

##### Changed
- `_deleteAnnouncement()` now creates a custom `ann-modal-overlay` confirmation dialog instead of calling `confirm()`

## [v07.94r] — 2026-03-29 06:54:54 PM EST

> **Prompt:** "your method did work, so i want you to comment it out in case we want to add it back in. but yes implement that approach instead"

### Changed
- Replaced per-click sequential reorder queue with "Save Order" button approach — arrow clicks now only rearrange locally (no server calls), a "Save Order" button appears when order has changed, clicking it sends the entire order to the server in one `saveAnnouncementOrder()` batch call
- Commented out `reorderAnnouncement()` server function and client-side sequential queue code (preserved for reference)
- Added `saveAnnouncementOrder(token, orderJSON)` server function that rewrites all spreadsheet rows in the desired order in a single batch

#### `programportal.gs` — v01.24g

##### Changed
- Arrow reorder buttons now only swap items locally in `_annLocalItems` with no server call
- New `_saveAnnouncementOrder()` client function sends the full row order as JSON when "Save Order" is clicked
- `_checkOrderDirty()` compares current order against original to show/hide the Save Order button
- `_forceRenderAnnouncements()` resets `_annOriginalOrder` on server sync

##### Added
- `saveAnnouncementOrder(token, orderJSON)` server-side function — batch rewrite of all data rows
- `.ann-save-order-btn` CSS for the Save Order button

## [v07.93r] — 2026-03-29 06:50:32 PM EST

> **Prompt:** "kinda working, lets keep using the same example of row 1, i move it down 2 optimistically. after we wait for the sync, it moves it down from 1 to 2, then after a delay it then moves it from 2 to 3. any way you can think to prevent this?"

### Fixed
- Replaced parallel reorder server calls with a sequential queue — rapid clicks now queue individual swap calls that execute one at a time, and only the final response re-renders the UI. Intermediate server responses are ignored (tracked via generation counter) so the UI doesn't jump back to stale positions between calls

#### `programportal.gs` — v01.23g

##### Fixed
- Replaced direct `google.script.run` reorder calls with `_reorderQueue` + `_processReorderQueue()` pattern — sequential execution prevents the race condition where parallel server calls each move the row one extra position

## [v07.92r] — 2026-03-29 06:45:58 PM EST

> **Prompt:** "the thing is if i click on the thing i want to move while its in its optimistic state, it thinks im referring to the one that was there. so for example if i move row 1 down to 2, then i click on 2 (which was 1) before syncing, it thinks i moved the old 2 down"

### Fixed
- Optimistic reorder now swaps `rowIndex` values between items during the local swap, so subsequent clicks before server sync correctly reference the item's new spreadsheet position

#### `programportal.gs` — v01.22g

##### Fixed
- Added `rowIndex` swap during optimistic reorder — prevents stale row references when clicking rapidly before server reconciliation

## [v07.91r] — 2026-03-29 06:41:17 PM EST

> **Prompt:** "it seems to be working, but use the same method (hopeful i think its called) as the testauth1, so that its instantaneous the effect of what is expected"

### Changed
- Announcements CRUD now uses optimistic updates (same pattern as TestAuth1's live data): local data array is mutated and re-rendered instantly before the server call, then reconciled with authoritative server data when the response arrives
- Reorder: swaps items in local array immediately, renders, then sends server call
- Delete: removes item from local array immediately, renders, then sends server call
- Add: appends new item to local array immediately, closes modal, renders, then sends server call
- Edit: updates item in local array immediately, closes modal, renders, then sends server call

#### `programportal.gs` — v01.21g

##### Changed
- Added `_annLocalItems` array and `_optimisticRender()` helper for optimistic UI updates
- All CRUD handlers now mutate local state first, render, then fire server call with `_forceRenderAnnouncements` as success handler for authoritative reconciliation

## [v07.90r] — 2026-03-29 06:37:30 PM EST

> **Prompt:** "check the sorting, because no matter what i do, even refreshing the page doesnt show it in the same order as on the spreadsheet"

### Fixed
- Removed automatic date-descending sort from `refreshAnnouncementsCache()` — announcements now display in spreadsheet row order, which admins control via the up/down reorder buttons

#### `programportal.gs` — v01.20g

##### Fixed
- Removed `items.sort()` by date in cache refresh — preserves spreadsheet row order for reorder buttons to work correctly

## [v07.89r] — 2026-03-29 06:35:05 PM EST

> **Prompt:** "the up and down order arrows are affecting the spreadsheet, but there is no immediate feedback in this page. use the same method we are using in testauth1 for immediate feedback"

### Fixed
- All announcements CRUD operations (reorder, add, edit, delete) now force an immediate re-render by resetting the change-detection JSON before applying server response data, ensuring the UI updates instantly without waiting for the next 60-second poll

#### `programportal.gs` — v01.19g

##### Fixed
- Added `_forceRenderAnnouncements()` helper that resets `_announcementsPrevJSON` before rendering, bypassing the JSON comparison skip. All CRUD success handlers now use this instead of `_renderAnnouncements` directly

## [v07.88r] — 2026-03-29 06:31:20 PM EST

> **Prompt:** "when both toggled they overlap"

### Fixed
- Increased spacing between HTML and GAS toggle buttons (`left: 112px` → `126px`) to prevent overlap when toggled text includes the circle indicator

#### `programportal.html` — v01.72w

##### Fixed
- GAS toggle button position adjusted to prevent overlap with HTML toggle when both show "○" indicator

## [v07.87r] — 2026-03-29 06:28:19 PM EST

> **Prompt:** "i dont see the html/gas toggles"

### Added
- HTML/GAS layer visibility toggle buttons on the Program Portal embedding page (`programportal.html`), matching TestAuth1's implementation
- HTML toggle hides/shows version pills, GAS pill, auth timers, changelogs, SSO indicator
- GAS toggle hides/shows the GAS iframe
- `.html-layer-hidden` CSS class with `!important` to avoid race conditions with other display logic

#### `programportal.html` — v01.71w

##### Added
- HTML and GAS layer toggle buttons (fixed bottom-left, matching TestAuth1's position and styling)
- `_toggleHtmlLayer()` and `_toggleGasLayer()` functions in PROJECT JS block
- `.html-layer-hidden` CSS class

## [v07.86r] — 2026-03-29 06:24:12 PM EST

> **Prompt:** "the html and gas buttons arent letting me click them, put them in the same spot and work the same way as the testauth1"

### Removed
- Non-functional HTML/GAS version pills from the GAS iframe announcements section — these were duplicates of the working version pills on the embedding page (`programportal.html`) which already provide changelog popups at fixed bottom-right position, matching TestAuth1's layout

#### `programportal.gs` — v01.18g

##### Removed
- Removed `ann-version-toggles`, `ann-version-pill` CSS, HTML elements, and JS references from the announcements section — the embedding page's template-level version pills (with changelog popup support) are the correct implementation

## [v07.85r] — 2026-03-29 06:20:23 PM EST

> **Prompt:** "few things, the priority dropdown backgrounds makes it so i cant read the text, there is no option for active true/false like on the spreadsheet, make it so i can re-order them, have it show the data polling timers and the html/gas toggles"

### Fixed
- Priority dropdown option background now uses dark theme color for readable text

### Added
- Active/Inactive toggle in the announcement edit modal (maps to spreadsheet Active column)
- Reorder announcements via up/down arrow buttons with server-side row swap (`reorderAnnouncement()`)
- Data polling status bar showing live/polling dot, elapsed time, and countdown to next poll
- HTML and GAS version pills in the announcements section status bar
- Inactive announcements visible to admins at reduced opacity with "(inactive)" tag
- Cache now includes all items (active + inactive) with `active` field; client-side filters for non-admins

#### `programportal.gs` — v01.17g

##### Fixed
- Select dropdown option backgrounds now readable with `background: #1e1e3a` on option elements

##### Added
- `reorderAnnouncement(token, fromRowIndex, direction)` server-side function for row swapping
- Active toggle, reorder buttons, poll countdown display, version pills in client-side UI
- `active` field in cached announcement data for client-side filtering

## [v07.84r] — 2026-03-29 06:13:00 PM EST

> **Prompt:** "i see it now. make it editable from here, only admins for now"

### Added
- Admin CRUD for announcements in Program Portal — add, edit, and delete announcements directly from the portal UI
- Server-side functions: `addAnnouncement()`, `updateAnnouncement()`, `deleteAnnouncement()` with admin-only permission checks via `checkPermission(user, 'admin', ...)`
- Modal form UI for adding/editing announcements with title, body, and priority fields
- Edit/Delete buttons on each announcement card (visible only to admin users)
- `rowIndex` field in cached announcement data for client-side edit/delete targeting
- `_userRole` client-side variable injected from session data for admin detection

#### `programportal.gs` — v01.16g

##### Added
- addAnnouncement(), updateAnnouncement(), deleteAnnouncement() server-side functions in PROJECT block
- Admin modal form, edit/delete buttons, and CRUD event handlers in client-side JS
- _userRole variable for role-based UI rendering

## [v07.83r] — 2026-03-29 06:07:54 PM EST

> **Prompt:** "im pretty sure you can make it happen in the gas if the tab doesnt exist"

### Added
- Auto-creation of "Announcements" sheet tab in `refreshAnnouncementsCache()` — if the tab doesn't exist, it creates it with headers (Title, Body, Date, Priority, Active), column widths, and a welcome row

#### `programportal.gs` — v01.15g

##### Added
- Auto-create Announcements sheet with headers and welcome row when tab doesn't exist

## [v07.82r] — 2026-03-29 06:03:02 PM EST

> **Prompt:** "in the program portal i want there to be an "Announcements" section which i want set up similar to the live data in the testauth1, use the same data polling setup as that."

### Added
- Announcements section in the Program Portal with live data polling from a Google Sheets "Announcements" tab
- Server-side cache functions (refreshAnnouncementsCache, getCachedAnnouncements, getAuthenticatedAnnouncements) using CacheService with 6-hour TTL, modeled on TestAuth1's data polling pattern
- Client-side 60-second setTimeout-chaining poll via google.script.run, with flight guard and change detection
- Announcements rendered as priority-colored cards (red=high, blue=normal, gray=low) with collapsible section header and badge count
- Initial announcements data loaded server-side and injected inline for immediate rendering
- ANNOUNCEMENTS_SHEET_NAME config variable in programportal.config.json and programportal.gs
- Spreadsheet sheet columns: Title, Body, Date, Priority, Active (filtered server-side, sorted by date descending)

#### `programportal.gs` — v01.14g

##### Added
- refreshAnnouncementsCache(), getCachedAnnouncements(), getAuthenticatedAnnouncements(token) in PROJECT block
- Announcements HTML section, CSS styles, and client-side JS polling/rendering in doGet() template
- ANNOUNCEMENTS_SHEET_NAME config variable

## [v07.81r] — 2026-03-29 03:17:42 PM EST

> **Prompt:** "we havent been able to properly make SHAs for a loooong time, can you make a plan to fix it up to work properly"

### Fixed
- SHA enrichment during CHANGELOG archive rotation now works reliably — added `git fetch --unshallow` step before SHA lookups to fix shallow clone issue that made older commits invisible
- Historical backfill: enriched all 343 previously missing SHA links in CHANGELOG-archive.md

### Changed
- Updated archive rotation rules in CLAUDE.md and changelogs.md to include the shallow clone fix and `[SHA unavailable]` fallback

## [v07.80r] — 2026-03-29 03:05:28 PM EST

> **Prompt:** "change the Homepage to say Website"

### Changed
- Renamed "Homepage" to "Website" in the Program Portal app card display

#### `programportal.gs` — v01.13g

##### Changed
- Renamed Homepage app card to "Website"

## [v07.79r] — 2026-03-29 02:38:38 PM EST

> **Prompt:** "ok then edit that array to instead of saying Global ACL, have it say Global Access Control List"

### Changed
- Renamed "Global ACL" to "Global Access Control List" in the Program Portal app card display

#### `programportal.gs` — v01.12g

##### Changed
- Renamed Global ACL app card to "Global Access Control List"

## [v07.78r] — 2026-03-29 02:08:47 PM EST

> **Prompt:** "the global sessions menu is showing when signing out."

### Fixed
- Global Sessions panel now closes automatically when sign-out begins — registered both session panels in the panel registry so `_closeAllPanelsExcept(null)` includes them

#### `globalacl.html` — v01.65w

##### Fixed
- Global Sessions panel no longer stays visible during sign-out
- Sessions and Global Sessions panels are now mutually exclusive — opening one closes the other

## [v07.77r] — 2026-03-29 01:58:46 PM EST

> **Prompt:** "in the global sessions, make it so that we can also sign out ourselves. for some reason sometimes it fails to show myself on the list, as shown in one of these examples"

### Changed
- Global Sessions panel now shows Sign Out and Sign Out All Projects buttons for the current user's own sessions (previously only shown for other users)

#### `globalacl.html` — v01.64w

##### Changed
- Sign Out and Sign Out All Projects buttons now appear on your own sessions in Global Sessions

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
