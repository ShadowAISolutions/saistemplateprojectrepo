# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 54/100`

## [Unreleased]

## [v01.54r] — 2026-03-09 02:46:48 PM EST

### Changed
- Documented mermaid.live URL regeneration safeguards in CLAUDE.md Pre-Commit #6 — added mandatory verification step (Python decompression check), corruption prevention guidance (use temp file instead of manual copy-paste), and Edit tool corruption warning

## [v01.53r] — 2026-03-09 02:40:34 PM EST

### Fixed
- Fixed single-character corruption in mermaid.live URL in ARCHITECTURE.md (position 1102: 'F' → 'H') — URL now decompresses correctly and loads the diagram in the interactive editor

## [v01.52r] — 2026-03-09 02:16:06 PM EST

### Fixed
- Fixed mermaid.live URL encoding — switched from Python zlib to Node.js pako + js-base64 libraries (the exact same libraries mermaid.live uses) to ensure URL compatibility

### Changed
- Updated CLAUDE.md Pre-Commit #6 mermaid.live regeneration script to use Node.js with actual pako + js-base64 npm packages instead of Python zlib

## [v01.51r] — 2026-03-09 01:59:20 PM EST

### Fixed
- Fixed mermaid.live URL encoding — switched to zlib compression with header + URL-safe base64 (matching the actual pako format mermaid.live expects)

### Changed
- Updated CLAUDE.md Pre-Commit #6 mermaid.live regeneration script to use correct `zlib.compress` + `urlsafe_b64encode` encoding

## [v01.50r] — 2026-03-09 01:47:30 PM EST

### Fixed
- Fixed mermaid.live URL encoding — switched from URL-safe base64 to standard base64 (mermaid.live uses standard base64 in URL fragments)

### Added
- Collapsible "Copy code for mermaid.live" section below the diagram in ARCHITECTURE.md with raw Mermaid code in a copyable code block

## [v01.49r] — 2026-03-09 01:36:40 PM EST

### Added
- "Open in mermaid.live" link in ARCHITECTURE.md — pako-compressed URL pre-loads the diagram in the interactive editor
- CLAUDE.md Pre-Commit #6 rule for regenerating the mermaid.live link when the diagram changes

## [v01.48r] — 2026-03-09 01:24:49 PM EST

### Fixed
- Fixed `GAS_TPL_PAGE` → `GASTPL_PAGE` style reference bug in ARCHITECTURE.md Mermaid diagram (undefined node ID caused mermaid.live syntax error)

## [v01.47r] — 2026-03-09 01:11:33 PM EST

### Changed
- Replaced `·······` no-GAS placeholder with `vNoGASg` in README project structure tree and CLAUDE.md rule

## [v01.46r] — 2026-03-09 01:05:37 PM EST

### Changed
- Moved version display links before descriptions in README project structure tree, separated by `|`
- Pages without GAS now show `·······` placeholder for visual alignment
- Moved README.md to the end of the Community group (below SECURITY.md)
- Updated CLAUDE.md #8 rule to reflect new version display format

## [v01.45r] — 2026-03-09 12:59:44 PM EST

### Added
- Version display links on live site page entries in README project structure tree — each page now shows its current HTML version (linked to its HTML changelog) and GAS version (linked to its GAS changelog)
- Pre-Commit rule in CLAUDE.md #8 to keep README tree version displays in sync when pages are modified

## [v01.44r] — 2026-03-09 12:51:13 PM EST

### Fixed
- Added missing `README.md` entry to the project structure tree in README.md

## [v01.43r] — 2026-03-09 12:43:18 PM EST

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

## [v01.42r] — 2026-03-09 10:32:50 AM EST

### Changed
- Moved Repository Information section after Scripts section in project structure tree

## [v01.41r] — 2026-03-09 10:28:38 AM EST

### Changed
- Moved GitHub Configuration and Configuration sections below the Claude Code section in project structure tree

## [v01.40r] — 2026-03-09 09:53:49 AM EST

### Changed
- Changed root label in project structure tree from `─── Repository Root ───` to `Repository Root ───` (removed leading dashes)
- Reordered sections below Project Structure: Copy This Repository → Initialize This Template → How It Works → GCP Project Setup & Troubleshooting (setup instructions now come first, informational sections follow)

## [v01.39r] — 2026-03-09 09:49:11 AM EST

### Changed
- Moved `CLAUDE.md` above `.claude/` folder in the Claude Code section of the project structure tree
- Restored separate "Repository Root" bold group label above the left-aligned `saistemplateprojectrepo/` link in the project structure tree

## [v01.38r] — 2026-03-09 09:43:08 AM EST

### Changed
- Moved `CLAUDE.md` from Documentation section into the Claude Code section (as a sibling of `.claude/`) in the project structure tree
- Moved `CITATION.cff` into the Community section (citation metadata fits alongside LICENSE, CONTRIBUTING, etc.)
- Removed the now-empty Documentation section from the project structure tree

## [v01.37r] — 2026-03-09 09:39:53 AM EST

### Changed
- Consolidated root label in project structure tree — removed separate "Repository Root" line and put the `saistemplateprojectrepo/` link directly on the bold label line

## [v01.36r] — 2026-03-09 09:36:44 AM EST

### Changed
- Changed root `saistemplateprojectrepo/` in project structure tree back to plain link with a "Repository Root" bold group label above it (matching the style of other section labels)
- Moved Claude Code section below Configuration section in the project structure tree

## [v01.35r] — 2026-03-09 09:32:27 AM EST

### Changed
- Added bold group label to the root `saistemplateprojectrepo/` entry in the project structure tree
- Moved all informational sections (How It Works, GCP Project Setup & Troubleshooting) below Project Structure to match the original intended order: Project Structure → How It Works → GCP Project Setup → Copy This Repository → Initialize This Template

## [v01.34r] — 2026-03-09 09:27:29 AM EST

### Changed
- Moved "Copy This Repository" and "Initialize This Template" sections below the "Project Structure" section in README.md for improved reading flow — setup instructions now follow the structure overview

## [v01.33r] — 2026-03-09 09:22:53 AM EST

### Changed
- Reordered page listings across all files to: Landing Page (index), Test, GAS Project Creator — applied to README.md project structure tree, README.md supporting file listings (html-versions, html-changelogs), STATUS.md table, and ARCHITECTURE.md Mermaid diagram

## [v01.32r] — 2026-03-09 09:16:20 AM EST

### Changed
- Rearranged live page entries in project structure tree: live site link now appears before the description (with `→` separator), and link text uses the page name without `.html` extension (e.g. `index`, `gas-project-creator`, `test`) instead of generic "live"

## [v01.31r] — 2026-03-09 09:12:09 AM EST

### Changed
- Moved `.nojekyll` from the live pages group to the Supporting Files group in the project structure tree (it's a config file, not a live page)
- Added live site URL links (→ live) next to each HTML page entry in the project structure tree (`index.html`, `gas-project-creator.html`, `test.html`)

## [v01.30r] — 2026-03-09 09:09:01 AM EST

### Added
- Added "Supporting Files" subheading within the `live-site-pages/` section of the project structure tree, separating live HTML pages from supporting folders (templates, versions, changelogs, sounds)

## [v01.29r] — 2026-03-09 09:03:31 AM EST

### Added
- Added bold group labels for each root-level folder in the project structure tree (Live Site, Google Apps Scripts, Claude Code, GitHub Configuration, Repository Information, Scripts) — all folder sections are now visually categorized like the root-level file groups

## [v01.28r] — 2026-03-09 08:57:08 AM EST

### Added
- Added bold group labels (Configuration, Documentation, Community) as visual subheadings within the project structure tree, using `<b>` tags inside the `<pre>` block

### Removed
- Removed `## Documentation` and `## Community` sections from README — now consolidated as labeled groups within the project structure tree, eliminating redundant file listings

## [v01.27r] — 2026-03-09 08:51:34 AM EST

### Fixed
- Fixed README project structure tree rendering as a continuous paragraph — switched from plain markdown (no line break preservation) to HTML `<pre>` block with `<a href>` tags, restoring monospace formatting and proper tree structure while keeping all filenames clickable

### Changed
- Updated CLAUDE.md Pre-Commit #8 to document `<pre>` + `<a href>` format for tree entries

## [v01.26r] — 2026-03-09 08:46:00 AM EST

### Added
- Added mandatory gate block at the top of CLAUDE.md — a high-visibility warning ensuring Session Start Checklist and Chat Bookends are never skipped, even for casual or simple questions

## [v01.25r] — 2026-03-09 08:40:55 AM EST

### Changed
- Converted README.md project structure tree from fenced code block to plain markdown with clickable GitHub links — every filename and directory name is now a navigable link to its blob/tree view
- Changed tree description separator from `#` to `—` for markdown compatibility outside code blocks
- Added link tip blockquote to Project Structure section
- Updated CLAUDE.md Pre-Commit #8 to document the linked tree entry format

## [v01.24r] — 2026-03-08 05:34:53 PM EST

### Added
- Set up new GAS project "Test" with full page, script, config, version files, changelogs, and workflow deploy step
- Added Test project row to STATUS.md Hosted Pages table
- Added Test project nodes and relationships to ARCHITECTURE.md diagram
- Added Test project files to README.md project structure tree
- Added GAS deploy step for Test in auto-merge workflow

## [v01.23r] — 2026-03-08 05:23:48 PM EST

### Fixed
- Added explicit `permissions` block (`pages: write`, `id-token: write`) to the deploy job in auto-merge workflow — fixes "Ensure GITHUB_TOKEN has permission id-token: write" error on GitHub Pages deployment

## [v01.22r] — 2026-03-08 05:16:55 PM EST

### Changed
- Added "immediate fix proposal" rule to Continuous Improvement section — acknowledging a mistake without proposing a concrete structural fix in the same response is now explicitly prohibited

## [v01.21r] — 2026-03-08 05:14:03 PM EST

### Changed
- Added compaction recovery closure rule to CLAUDE.md — after context compaction, if no work remains, the recovery response must still end with the full end-of-response block and closing marker instead of informal text

## [v01.20r] — 2026-03-08 05:07:22 PM EST

### Changed
- Consolidated all template files into `live-site-pages/templates/` — moved `HtmlAndGasTemplateAutoUpdate.html` (renamed to `.html.txt`) and `gas-project-creator-code.js.txt` from separate directories into a single templates folder
- Removed `live-site-templates/` and `live-site-pages/gas-code-templates/` directories
- Updated all references across 15 files (CLAUDE.md, rules, skills, scripts, ARCHITECTURE.md, README.md, STATUS.md, CONTRIBUTING.md, IMPROVEMENTS.md)

#### `gas-project-creator.html` — v01.01w

##### Changed
- Updated template file fetch path to new location

## [v01.19r] — 2026-03-08 04:54:56 PM EST

### Changed
- Merged "Hosted Pages" and "GAS Projects" into a single "Hosted Pages & GAS Projects" table in STATUS.md — each page row now shows its associated GAS file and version inline

## [v01.18r] — 2026-03-08 04:49:52 PM EST

### Changed
- Clarified template names in STATUS.md — renamed "Universal Template" to "HTML Page Template (with GAS embedding)" and "GAS Code Template" to "GAS Script Template" for unambiguous identification

## [v01.17r] — 2026-03-08 04:46:19 PM EST

### Changed
- Added GAS Code Template entry to STATUS.md Templates table — `gas-project-creator-code.js.txt` is now tracked alongside the Universal Template as the GAS-specific code template

## [v01.16r] — 2026-03-08 04:25:29 PM EST

### Fixed
- Corrected QR code to point to GitHub repo URL instead of GitHub Pages URL
- Updated Pre-Commit #14 rule and init script to generate QR codes with the repo URL
- Fixed stale `HtmlTemplateAutoUpdate` file references in `html-pages.md` and `imported--frontend-design` skill after repo rename

## [v01.15r] — 2026-03-08 04:19:59 PM EST

### Fixed
- Regenerated QR code in README to point to the correct live site URL after repo rename

## [v01.14r] — 2026-03-08 04:08:05 PM EST

### Changed
- Renamed project from "Auto Update HTML Template" to "Auto Update HTML & GAS Template" in README title, init script, and phantom update commit message references

## [v01.13r] — 2026-03-08 03:48:05 PM EST

### Changed
- Renamed all instances of `htmltemplateautoupdate` to `saistemplateprojectrepo` across the entire repo (13 files, 41 occurrences) in preparation for repo copy/rename

## [v01.12r] — 2026-03-08 03:38:44 PM EST

### Removed
- Deleted `repository-information/backups/CLAUDE.md.bak` and the `backups/` directory (stale backup no longer needed)

## [v01.11r] — 2026-03-08 03:34:16 PM EST

### Changed
- Extended STATUS.md Origin column to four-tier system: `template`, `initialized`, `modified`, `initialized · modified`, or empty (fork-added) — matching the README tree and ARCHITECTURE.md label tiers
- Updated Pre-Commit #5 with transition rules: `initialized` → `initialized · modified` and `template` → `modified` on post-init file edits

## [v01.10r] — 2026-03-08 03:31:41 PM EST

### Changed
- Upgraded template origin labels from three-tier to four-tier system: added `[template · initialized · modified]` state to distinguish post-init customizations of init-modified files from post-init customizations of untouched template files
- Made init script Phase 5b surgical — only upgrades `[template]` → `[template · initialized]` for files that init actually modifies (based on REPLACE_FILES array), leaving untouched template files as `[template]`
- Updated Pre-Commit #6 (ARCHITECTURE.md) and #8 (README tree) rules: `[template · initialized]` → `[template · initialized · modified]` on post-init edit; `[template]` → `[template · modified]` on post-init edit

## [v01.09r] — 2026-03-08 03:23:13 PM EST

### Added
- Added three-tier template origin label system: `[template]` (template repo), `[template · initialized]` (fork after init), `[template · modified]` (fork after customization) — distinguishes initialization changes from genuine post-init customizations
- Added Phase 5b to init script (`scripts/init-repo.sh`) — upgrades all `[template]` labels to `[template · initialized]` in README.md tree, ARCHITECTURE.md diagram, and STATUS.md Origin column during fork initialization

### Changed
- Updated Pre-Commit #5, #6, #8 template origin label rules to document the three-tier system and the `[template · initialized]` intermediate state

## [v01.08r] — 2026-03-08 03:12:53 PM EST

### Added
- Added `[template]` origin labels to ARCHITECTURE.md Mermaid diagram — file nodes and file-centric subgraphs are prefixed with `[template]` to distinguish template-origin components from fork-added ones
- Added `Origin` column to all STATUS.md tables — template-origin entries show `template`, making it immediately visible which rows came from the template
- Added template origin label rules to Pre-Commit #5 (STATUS.md Origin column) and #6 (ARCHITECTURE.md node/subgraph labels), including `[template · modified]` tracking on non-template repos

## [v01.07r] — 2026-03-08 03:04:33 PM EST

### Added
- Added `[template · modified]` label rule to Pre-Commit #8 — on non-template repos, template-origin files update their label to `[template · modified]` when edited, showing the file was customized from the original template

## [v01.06r] — 2026-03-08 03:01:03 PM EST

### Added
- Added `[template]` origin labels to every entry in README project structure tree — distinguishes template-origin files from files added in forks

## [v01.05r] — 2026-03-08 02:53:07 PM EST

### Fixed
- Added missing sound files (`Website_Ready_Voice_1.mp3`, `Code_Ready_Voice_1.mp3`) to README project structure tree — `sounds/` directory was listed but its contents were not expanded
- Added completeness audit rule to Pre-Commit #8 (README.md structure tree) — directories must have their contents fully expanded, not just listed as leaf nodes

## [v01.04r] — 2026-03-08 02:48:28 PM EST

### Fixed
- Added missing `.editorconfig` and `.gitignore` to README project structure tree

## [v01.03r] — 2026-03-08 02:31:16 PM EST

### Removed
- Removed testation7 and testation8 environments — deleted HTML pages, GAS scripts, config files, version files, changelogs, and changelog archives (18 files total)
- Removed testation7 and testation8 GAS deploy steps from auto-merge workflow
- Removed testation7 and testation8 entries from STATUS.md hosted pages and GAS projects tables

## [v01.02r] — 2026-03-08 02:05:10 PM EST

### Fixed
- Fixed non-index page URLs in chat bookends ending with `/` instead of `.html` — added explicit rule for non-index pages (e.g. `testation7.html`) to use `.html` suffix in live site URLs
- Fixed init script not resetting `TEMPLATE_DEPLOY` to `Off` on forks — forks no longer inherit the template's `On` state, preventing false template-repo detection in URL display logic

## [v01.01r] — 2026-03-07 03:15:58 PM EST

### Changed
- Re-enabled `TEMPLATE_DEPLOY` toggle (`Off` → `On`) to restore GitHub Pages deployment on the template repo
