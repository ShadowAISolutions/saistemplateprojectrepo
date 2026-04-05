# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 4/100`

## [Unreleased]

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
