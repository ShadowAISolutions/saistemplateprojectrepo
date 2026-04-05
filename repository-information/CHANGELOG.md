# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 8/100`

## [Unreleased]

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
