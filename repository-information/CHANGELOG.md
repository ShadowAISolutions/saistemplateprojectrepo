# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 13/100`

## [Unreleased]

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
