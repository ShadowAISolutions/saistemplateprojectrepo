# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 25/100`

## [Unreleased]

## [v08.88r] — 2026-04-05 04:35:19 PM EST

> **Prompt:** "yes continue"

### Changed
- Fixed HTML auth template checklist text to match testauth1: reconnect final stage → "Session restored", sign-in final stage → "Sign-in complete", JS stage map updated
- Fixed HTML auth template sign-in subtitle: added margin-top:10px, removed default placeholder text
- Standardized HTML entities: all auth headings now use `&hellip;` consistently (was mixing Unicode `…` and entity)

## [v08.87r] — 2026-04-05 04:28:54 PM EST

> **Prompt:** "make sure that the templates are also identical, the idea is that if we use the gas-project-creator and associated setup-gas-project.sh , we should have an identical code to the testauth1 except for project specific code. make sure that this is the case"

### Changed
- Updated GAS auth templates (minimal-auth + test-auth) to match testauth1: unified RBAC to 4 roles with amend, added getData/heartbeat doPost() handlers, improved PROJECT_OVERRIDES comments, standardized placeholder strings
- Updated HTML auth template to match testauth1: unified CSP headers, removed divergent user-select properties from pills, changed user-pill z-index to 10012, moved html-layer-hidden to PROJECT CSS, added DATA_POLL_INTERVAL, removed ALLOWED_DOMAINS/ENABLE_DOMAIN_RESTRICTION, added HIPAA comments
- Updated HTML noauth template: removed divergent user-select properties from pills

### Fixed
- Fixed validateSessionForData() in both GAS auth templates — now extracts role/permissions from cache when data validation is disabled (prevents silent permission check failures)

## [v08.86r] — 2026-04-05 04:14:37 PM EST

> **Prompt:** "do an analysis of the program portal, testauth1, and globalacl environments to identify every single difference in how they are coded, EXCEPT for project specific code in the gas layer. my goal after your analysis is to make every environment identically coded and organized other than their specific project code"

### Changed
- Unified CSP headers across all three environments (portal, testauth1, globalacl) — standardized connect-src and font-src directives
- Unified CSS styling across all environments — standardized z-index values, removed divergent user-select properties, moved html-layer-hidden to consistent location
- Unified HTML_CONFIG across all environments — added DATA_POLL_INTERVAL, removed divergent ALLOWED_DOMAINS/ENABLE_DOMAIN_RESTRICTION, standardized HIPAA comments
- Unified GAS RBAC roles to 4-role structure (admin/clinician/billing/viewer + amend permission) across all environments
- Added Phase B (breach alerting) and Phase C (retention, legal hold, integrity, representative) configuration blocks to portal and globalacl GAS scripts
- Added getData and heartbeat doPost() handlers to portal and globalacl GAS scripts (previously testauth1-only)
- Standardized cache management approach (epoch-bump) across all GAS scripts
- Standardized placeholder strings and comments across all GAS scripts
- Added Google OAuth design note to portal and globalacl architecture diagrams

### Fixed
- Fixed validateSessionForData() in portal and testauth1 — now correctly extracts role/permissions from cache when data validation is disabled (prevents silent permission check failures)

#### `programportal.html` — v01.84w

##### Changed
- Unified security headers, auth configuration, and UI styling to match across all environments

#### `programportal.gs` — v01.51g

##### Changed
- Unified RBAC roles, HIPAA compliance configs, and template code to match across all environments

##### Fixed
- Permission checks now work correctly when data validation is disabled

#### `testauth1.gs` — v02.45g

##### Fixed
- Permission checks now work correctly when data validation is disabled

#### `globalacl.html` — v01.78w

##### Changed
- Unified security headers, auth configuration, and UI styling to match across all environments

#### `globalacl.gs` — v01.42g

##### Changed
- Unified RBAC roles, HIPAA compliance configs, cache management, and template code to match across all environments

##### Fixed
- Permission checks now work correctly when data validation is disabled

## [v08.85r] — 2026-04-05 03:20:35 PM EST

> **Prompt:** "ok, now these changes we have made to all of these, make them also apply to the templates and associated setup-gas-project.sh for the gas-project-creator"

### Changed
- Propagated pill and admin badge positioning changes to all 6 template files and gas-project-creator.html
- HTML templates (noauth + auth): right-side pills `right: 8px` → `right: 22px`, html-layer-toggle `bottom: 8px` → `bottom: 7px`
- GAS templates (all 4): `#version` `bottom: 8px` → `bottom: 9px`, gas-layer-toggle `bottom: 8px` → `bottom: 7px`
- GAS auth templates (2): admin badge normalized (dark bg, border, opacity hover, `top: 7px; left: 12px`), dropdown `top: 31px; left: 12px`
- gas-project-creator.html: version indicator `right: 8px` → `right: 22px`
- setup-gas-project.sh: no changes needed (copies from templates)

#### `gas-project-creator.html` — v01.29w

##### Changed
- Version indicator no longer overlaps with the browser scrollbar

## [v08.84r] — 2026-04-05 03:11:35 PM EST

> **Prompt:** "the font color for the gas version in bottom left corner of the program portal is white so we cant see it, should be same color as the other environments, see if theres any more inconsistencies that can be normalized"

### Fixed
- Fixed programportal.gs `#version` color from `rgba(255,255,255,0.3)` (invisible on white strip) to `#1565c0` (blue, matching testauth1 and globalacl)
- Fixed programportal.gs `#version` font-size from 11px to 12px (matching other environments)

### Changed
- Normalized admin badge styling on globalacl.gs and programportal.gs to match testauth1: dark semi-transparent background (`rgba(0,0,0,0.55)`), border, 10px border-radius, opacity hover effect
- Added `onmouseover`/`onmouseout` opacity handlers to admin badge HTML on both environments

#### `globalacl.gs` — v01.41g

##### Changed
- Admin button style normalized to match other pages

#### `programportal.gs` — v01.50g

##### Fixed
- Version label in bottom-left corner now visible (was white on white)

##### Changed
- Admin button style normalized to match other pages

## [v08.83r] — 2026-04-05 03:06:33 PM EST

> **Prompt:** "idk what you just did but you still dont have padding like we have on the testauth1, im talking about the white space at the top and bottom"

### Changed
- Added `#acl-main` wrapper to globalacl.gs with `position: fixed; top: 30px; bottom: 30px` — creates white strips at top/bottom matching testauth1's `#live-data-app` pattern
- Added `#portal-main` wrapper to programportal.gs with same fixed positioning — moves gradient background to inset container, exposing white body strips
- Body overflow set to `hidden` on both, wrapper handles scrolling
- Updated gas layer toggle element lists to use new wrapper IDs

#### `globalacl.gs` — v01.40g

##### Changed
- Page content now has visible top and bottom margins matching other pages

#### `programportal.gs` — v01.49g

##### Changed
- Page content now has visible top and bottom margins matching other pages

## [v08.82r] — 2026-04-05 03:00:10 PM EST

> **Prompt:** "i want the others to also have the top and bottom padding on the gas layer that the testauth1 has"

### Changed
- Added 30px top/bottom body padding to globalacl and programportal GAS layers, matching testauth1's layout strips for admin badge and version/toggle elements

#### `globalacl.gs` — v01.39g

##### Changed
- Added top and bottom padding to match testauth1 layout

#### `programportal.gs` — v01.48g

##### Changed
- Added top and bottom padding to match testauth1 layout

## [v08.81r] — 2026-04-05 02:52:59 PM EST

> **Prompt:** "ok good. we have made a bunch of changes in the last 2 sessions with the gas and html layer toggles and positioning of pills in testauth1. i want those changes to be propagated to the other environments, i.e. globalacl and programportal"

### Changed
- Propagated pill positioning and admin badge centering changes from testauth1 to globalacl and programportal
- All right-side pills shifted from right: 8px to right: 22px on both pages (version indicator, GAS pill, SSO indicator, auth timers, user pill, warning banners)
- Admin badge centered vertically in top strip (top: 12px → 7px) on both GAS files
- Admin dropdown position adjusted (top: 36px → 31px) on both GAS files
- GAS version label centered in bottom strip (bottom: 8px → 9px) on both GAS files
- HTML/GAS layer toggle buttons centered (bottom: 8px → 7px) on both environments

#### `globalacl.html` — v01.77w

##### Changed
- Controls no longer overlap with the browser scrollbar
- Bottom toggle buttons better centered in their area

#### `globalacl.gs` — v01.38g

##### Changed
- Admin button better centered in the header bar
- GAS toggle button better centered in its area

#### `programportal.html` — v01.83w

##### Changed
- Controls no longer overlap with the browser scrollbar
- Bottom toggle buttons better centered in their area

#### `programportal.gs` — v01.47g

##### Changed
- Admin button better centered in the header bar
- GAS toggle button better centered in its area

## [v08.80r] — 2026-04-05 02:42:37 PM EST

> **Prompt:** "as per the screenshot in testauth1, make it so that the admin button is centered vertically in the white area, same of the other elements on the html layer within the white areas, also make it so that the pills on the right side are moved a bit to the left so that when a scollbar appears they are not overlapping it"

### Changed
- Centered admin badge vertically in the top 30px strip of the GAS layer (top: 12px → 7px)
- Adjusted admin dropdown position to match badge shift (top: 36px → 31px)
- Centered HTML/GAS layer toggle buttons vertically in the bottom strip (bottom: 8px → 7px)
- Moved all right-side pills from right: 8px to right: 22px to prevent scrollbar overlap: version indicator, GAS pill, SSO indicator, auth timers, user pill, and warning banners
- Moved GAS user-email display from right: 8px to right: 22px for consistency

#### `testauth1.html` — v03.89w

##### Changed
- Controls no longer overlap with the browser scrollbar
- Bottom toggle buttons better centered in their area

#### `testauth1.gs` — v02.44g

##### Changed
- Admin button better centered in the header bar
- User info positioned to avoid scrollbar overlap

## [v08.79r] — 2026-04-05 01:22:20 PM EST

> **Prompt:** "plan it out in its own document, include all context in particular what we tried and didnt work"

### Added
- Created `DEFERRED-GAS-IFRAME-PLAN.md` — comprehensive implementation plan documenting the goal of deferring GAS iframe creation until after authentication, what was tried (moving to `showApp()` broke auth, the CORS blocker for `fetch()`-based exchange), and viable alternatives (hidden auth iframe, current toggle-hiding approach)

## [v08.78r] — 2026-04-05 01:10:05 PM EST

> **Prompt:** "unfortunately, now we are getting stuck at requesting sign-in from google" / "wait so if its going to load it anyway, just revert it to how we had it"

### Fixed
- Reverted deferred GAS iframe creation — restored iframe loading on page load (needed for auth token exchange with GAS backend)
- GAS toggle button now hidden on sign-in page and shown only after authentication — `showAuthWall()` hides it, `showApp()` shows it

#### `testauth1.html` — v03.88w

##### Fixed
- Fixed sign-in getting stuck at "Requesting sign-in from Google"
- GAS toggle button no longer visible on the sign-in page

## [v08.77r] — 2026-04-05 01:03:54 PM EST

> **Prompt:** "yes go ahead, make a note somewhere in case we need to revert"

### Security
- Deferred GAS iframe creation until after authentication — the iframe is no longer loaded on the sign-in page, preventing unauthenticated users from accessing the GAS deployment URL, app structure, and JavaScript logic via DevTools

#### `testauth1.html` — v03.87w

##### Changed
- Improved login security — backend connection deferred until after sign-in

## [v08.76r] — 2026-04-05 12:52:45 PM EST

> **Prompt:** "comment out the gas toggle in the gas layer (in case i want to enable it), and add the gas toggle to the html layer, make it so that the new gas toggle on the html layer is shown only when the gas layer exists"

### Changed
- Moved GAS layer toggle from GAS layer to HTML layer — now hides/shows the entire GAS iframe instead of individual elements within it, enabling true full hide of the GAS layer
- GAS toggle in GAS layer commented out (preserved for re-enable if needed)
- HTML-layer GAS toggle only appears when the `#gas-app` iframe exists in the DOM

#### `testauth1.gs` — v02.43g

##### Changed
- Minor internal improvements

#### `testauth1.html` — v03.86w

##### Added
- Added GAS layer toggle that fully hides the GAS iframe

## [v08.75r] — 2026-04-05 12:37:59 PM EST

> **Prompt:** "when i said same fond i meant the color too, should go back to the blue it was"

### Fixed
- Restored admin badge text color to original blue (`#90caf9`) — was incorrectly changed to `#ccc` when matching GAS toggle pill style

#### `testauth1.gs` — v02.42g

##### Fixed
- Restored admin button text to its original blue color

## [v08.74r] — 2026-04-05 12:34:16 PM EST

> **Prompt:** "the admin font can stay as is but make the pill colors the same as the gas toggle pill by default and on hover, remove the user select none on all pills"

### Changed
- Updated admin badge pill to match GAS toggle pill styling — dark semi-transparent background with opacity hover effect instead of color-swap hover
- Removed `user-select: none` from all pill elements (version indicator, GAS pill, SSO indicator, user pill, auth timers, admin badge) so text is selectable with Ctrl+A

#### `testauth1.gs` — v02.41g

##### Changed
- Admin button now matches the style of other control pills

#### `testauth1.html` — v03.85w

##### Changed
- Control pills are now text-selectable

## [v08.73r] — 2026-04-05 12:22:23 PM EST

> **Prompt:** "undo your last change, i literally mean the admin dropdown button, when i hover over it, i cant see it anymore might be blending with the white background. theres nothing wrong with the list after i click it."

### Fixed
- Reverted dropdown `top` change (28px back to 36px) — the dropdown click behavior was not the issue
- Fixed admin badge colors blending with the white top strip background — changed from light-on-light (`rgba(255,255,255,0.12)` bg, `#90caf9`/`#fff` text) to dark-on-light (`rgba(0,0,0,0.12)` bg, `#1565c0`/`#0d47a1` text) so the badge and its hover state are visible against the white strip

#### `testauth1.gs` — v02.40g

##### Fixed
- Fixed admin button becoming invisible when hovered — now uses darker colors visible on light backgrounds

## [v08.72r] — 2026-04-05 12:17:33 PM EST

> **Prompt:** "the admin dropdown on hover is disappearing"

### Fixed
- Fixed admin dropdown disappearing when moving mouse from badge to dropdown — reduced gap between badge and dropdown by moving dropdown from `top: 36px` to `top: 28px`

#### `testauth1.gs` — v02.39g

##### Fixed
- Fixed admin menu disappearing when trying to select an option

## [v08.71r] — 2026-04-05 12:10:48 PM EST

> **Prompt:** "in the screenshot you can see in testauth1 we have a little strip of space at the bottom for the gas layer, i want a similar strip of space at the top for the gas layer also"

### Changed
- Added 30px top strip space for the GAS layer in testauth1, mirroring the existing bottom strip — gives GAS UI elements (admin badge, user email) a dedicated top area

#### `testauth1.gs` — v02.38g

##### Changed
- Adjusted layout spacing to show a control strip at the top of the page

## [v08.70r] — 2026-04-04 10:13:01 PM EST

> **Prompt:** "in tests folder, add a defensive-security folder, and add something we can use to test defensive security"

### Added
- Created `tests/defensive-security/` folder with `test_01_csp_headers_validation.py` — Playwright-based defensive security test that validates CSP meta tags, required directives, Referrer-Policy, auth wall presence/absence, external script source whitelisting, and inline event handler detection across all deployed pages

## [v08.69r] — 2026-04-04 09:58:18 PM EST

> **Prompt:** "in live-site-pages add a "images" folder, and move the barcode-test-sheet.png which is currently in the root to that new images folder"

### Changed
- Moved `barcode-test-sheet.png` from repo root to new `live-site-pages/images/` folder — now accessible via GitHub Pages
- Added `images/` directory with file entry to README tree

## [v08.68r] — 2026-04-04 09:42:26 PM EST

> **Prompt:** "in the (No public-site pages yet) , mention the index.html goes here"

### Changed
- Updated Public Website placeholder in README tree to mention index.html goes there

## [v08.67r] — 2026-04-04 09:37:16 PM EST

> **Prompt:** "remove the index environment completely, in the project structure leave the public website divider but have it say (No public-site pages yet)"

### Removed
- Completely removed the index environment — deleted index.html, Index/ GAS directory, all version/changelog files, and index-diagram.md
- Removed index.html from programportal.gs navigation menu (bumped v01.45g → v01.46g)
- Removed Index from GAS Projects table in gas-scripts.md
- Removed INDEX/GAS_INDEX nodes and all edges from REPO-ARCHITECTURE.md flowchart diagram
- Updated README tree: replaced index.html entry with "(No public-site pages yet)" placeholder under Public Website divider
- Updated gas-project-creator-diagram.md, html-pages.md, and gas-scripts.md to remove index-specific references

#### `programportal.gs` — v01.46g
##### Changed
- Removed Website (index.html) entry from the project navigation menu

## [v08.66r] — 2026-04-04 09:25:47 PM EST

> **Prompt:** "in the repository-information , move all the .md files in that folder into a sub folder called "archive info" except for the following which should remain there. repository.version.txt, readme-qr-code.png, TOKEN-BUDGETS.md, TODO.md, SUPPORT.md, SKILLS-REFERENCE.md, SESSION-CONTEXT.md, REPO-ARCHITECTURE.md, REMINDERS.md, KNOWN-CONSTRAINTS-AND-FIXES.md, IMPROVEMENTS.md, HIPAA-CODING-REQUIREMENTS.md, GOVERNANCE.md, FUTURE-CONSIDERATIONS.md, DATA-POLL-ARCHITECTURE.md, CODING-GUIDELINES.md, CHANGELOG.md, CHANGELOG-archive.md"

### Changed
- Moved 33 archive/plan .md files from `repository-information/` into new `repository-information/archive info/` subfolder to declutter the directory — kept 16 actively-used .md files in place
- Updated README tree structure with `archive info/` subtree and corrected all GitHub URLs
- Updated cross-reference in HIPAA-CODING-REQUIREMENTS.md and tests/offensive-security/GAS-HIPAA-COMPLIANCE-ANALYSIS.md to reflect new paths

## [v08.65r] — 2026-04-04 09:10:16 PM EST

> **Prompt:** "completely remove the testenvironment, rndlivedata, and open-all environments"

### Removed
- Completely removed three environments: testenvironment, rndlivedata, and open-all — deleted 22+ files (HTML pages, GAS scripts, configs, version files, changelogs, diagrams) and cleaned all references from workflow, documentation, and navigation

#### `programportal.gs` — v01.45g
##### Changed
- Removed Test Environment entry from the project navigation menu

## [v08.64r] — 2026-04-04 08:46:47 PM EST

> **Prompt:** "go ahead and archive all of our changelogs for all projects, so they should all end up 0/50 or 0/100 ,etc."

### Changed
- Archived all 484 version sections across 15 changelogs (repo, 8 HTML page, 6 GAS) to their respective archive files with SHA enrichment — all changelogs now at 0 sections
