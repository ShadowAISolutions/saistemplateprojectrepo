# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 95/100`

## [Unreleased]

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

## [v01.76r] — 2026-03-09 11:58:02 PM EST

### Changed
- Replaced live site URL text labels (`index`, `test`, `gas-project-creator`) with 🌐 globe emoji in README tree
- Changed diagram link separator from `· 📊 |` to `| 📊 |` in README tree page entries
- Added 🌐 globe emoji prefix to all page URL labels in end-of-response block rules and examples (`chat-bookends.md` and `chat-bookends-reference.md`)
- Added README tree rules for 🌐 live site links and updated 📊 diagram link separator format in `repo-docs.md`

## [v01.75r] — 2026-03-09 11:47:30 PM EST

### Changed
- Replaced `diagram` text labels with 📊 emoji in README tree page entries for diagram links
- Updated mermaid diagram rule in `.claude/rules/repo-docs.md` to specify 📊 emoji format

## [v01.74r] — 2026-03-09 11:39:47 PM EST

### Added
- mermaid.live interactive editor links for all 3 page diagrams (`index-diagram.md`, `test-diagram.md`, `gas-project-creator-diagram.md`)
- Diagram links in README tree next to each page's version numbers (clickable `diagram` link)
- "Mermaid Diagrams — mermaid.live Links" rule in `.claude/rules/repo-docs.md` — requires mermaid.live links on all diagrams going forward

### Changed
- Moved `diagrams/` directory in README tree to sit directly after `REPO-ARCHITECTURE.md` for logical grouping

## [v01.73r] — 2026-03-09 11:32:09 PM EST

### Added
- `repository-information/diagrams/` directory for per-page architecture diagrams (kept private, not deployed to GitHub Pages)
- `index-diagram.md` — component interaction diagram showing auto-refresh, splash screens, audio system, maintenance mode, and changelog popups
- `test-diagram.md` — sequence diagram showing dual HTML+GAS polling, iframe injection flow, and anti-sync protection
- `gas-project-creator-diagram.md` — user flow diagram showing the full GAS project setup workflow from account setup through Claude Code integration

## [v01.72r] — 2026-03-09 11:11:20 PM EST

### Fixed
- End-of-response URL sections were missing `test.html` and `gas-project-creator.html` — pages were listed from memory instead of discovered from filesystem

### Added
- "Page Enumeration — Mandatory Discovery" rule in `.claude/rules/chat-bookends.md` — requires running `ls live-site-pages/*.html` and reading actual version files before writing URL sections, preventing omission of pages

## [v01.71r] — 2026-03-09 11:07:23 PM EST

### Added
- Mermaid.live URL generation documentation in `.claude/rules/repo-docs.md` — covers pako encoding process, npm dependencies, generation commands, safe URL replacement via Python regex, mandatory verification, and 6 common failure modes with solutions

## [v01.70r] — 2026-03-09 11:04:18 PM EST

### Added
- Mermaid Diagram Compatibility Reference in `.claude/rules/repo-docs.md` — documents rendering support, dark-mode text fixes, and theme requirements for all 9 REPO-ARCHITECTURE.md diagram types

## [v01.69r] — 2026-03-09 10:59:19 PM EST

### Changed
- Switched Mindmap to `base` theme with `cScaleInv` overrides to force black text on all node levels including leaf nodes

## [v01.68r] — 2026-03-09 10:56:33 PM EST

### Changed
- Made Mindmap root node text black for readability — added `primaryColor` and `primaryTextColor` overrides to lighten the root circle and darken its label

## [v01.67r] — 2026-03-09 10:51:06 PM EST

### Changed
- Replaced neutral theme with custom pastel color scale for Mindmap — restores colorful appearance while keeping all text readable on dark backgrounds

## [v01.66r] — 2026-03-09 10:48:33 PM EST

### Fixed
- Fixed Mindmap dark-mode readability by adding neutral theme directive — forces light backgrounds on all node levels

## [v01.65r] — 2026-03-09 10:45:21 PM EST

### Fixed
- Fixed corrupted Sequence diagram mermaid.live link (regenerated from source)
- Fixed Mindmap dark-mode readability on GitHub by using cloud-shaped nodes for second-level categories

## [v01.64r] — 2026-03-09 10:37:06 PM EST

### Added
- Added 7 new diagram sections to REPO-ARCHITECTURE.md: State (page lifecycle), Git Graph (branching strategy), Architecture (system topology, mermaid.live only), C4 Context (system boundaries, mermaid.live only), Mindmap (concept hierarchy), ER (file dependencies), Class (component model)
- All GitHub-supported diagrams include both inline mermaid blocks and mermaid.live links
- Reorganized REPO-ARCHITECTURE.md with numbered sections (1-9) ranked by usefulness

## [v01.63r] — 2026-03-09 10:27:12 PM EST

### Added
- Added inline Sequence diagram to REPO-ARCHITECTURE.md (GitHub-rendered mermaid block with mermaid.live link)

## [v01.62r] — 2026-03-09 10:20:06 PM EST

### Changed
- Restructured Architecture diagram layout from horizontal to vertical flow for better readability

## [v01.61r] — 2026-03-09 10:16:20 PM EST

### Fixed
- Fixed Architecture diagram link in REPO-ARCHITECTURE.md (simplified to flat groups, removed special characters from labels)

## [v01.60r] — 2026-03-09 10:11:51 PM EST

### Fixed
- Fixed Architecture diagram link in REPO-ARCHITECTURE.md (replaced `-->` arrow syntax with `--` plain edges for mermaid.live compatibility)

## [v01.59r] — 2026-03-09 10:05:10 PM EST

### Fixed
- Fixed C4 Context and Architecture diagram links in REPO-ARCHITECTURE.md (simplified syntax for mermaid.live compatibility)

### Removed
- Removed copy-code-for-mermaid.live details block from REPO-ARCHITECTURE.md (redundant with working link)

## [v01.58r] — 2026-03-09 09:54:51 PM EST

### Added
- C4 Context, Sequence, and Architecture diagram links in REPO-ARCHITECTURE.md — alternative mermaid.live views of the repo's system interactions

## [v01.57r] — 2026-03-09 08:31:56 PM EST

### Changed
- Reorganized README `.claude/` section: moved `settings.json` to top of folder listing, added Skills sub-divider before `skills/` directory, updated tree connectors

## [v01.56r] — 2026-03-09 03:22:47 PM EST

### Changed
- Simplified commit message format (Pre-Commit #9) — push commits now show only the repo version prefix (`v01.XXr`), no longer append `g`/`w` version prefixes

## [v01.55r] — 2026-03-09 03:12:42 PM EST

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

## [v01.54r] — 2026-03-09 02:46:48 PM EST

### Changed
- Documented mermaid.live URL regeneration safeguards in CLAUDE.md Pre-Commit #6 — added mandatory verification step (Python decompression check), corruption prevention guidance (use temp file instead of manual copy-paste), and Edit tool corruption warning

## [v01.53r] — 2026-03-09 02:40:34 PM EST

### Fixed
- Fixed single-character corruption in mermaid.live URL in REPO-ARCHITECTURE.md (position 1102: 'F' → 'H') — URL now decompresses correctly and loads the diagram in the interactive editor

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
- Collapsible "Copy code for mermaid.live" section below the diagram in REPO-ARCHITECTURE.md with raw Mermaid code in a copyable code block

## [v01.49r] — 2026-03-09 01:36:40 PM EST

### Added
- "Open in mermaid.live" link in REPO-ARCHITECTURE.md — pako-compressed URL pre-loads the diagram in the interactive editor
- CLAUDE.md Pre-Commit #6 rule for regenerating the mermaid.live link when the diagram changes

## [v01.48r] — 2026-03-09 01:24:49 PM EST

### Fixed
- Fixed `GAS_TPL_PAGE` → `GASTPL_PAGE` style reference bug in REPO-ARCHITECTURE.md Mermaid diagram (undefined node ID caused mermaid.live syntax error)

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
- Reordered page listings across all files to: Landing Page (index), Test, GAS Project Creator — applied to README.md project structure tree, README.md supporting file listings (html-versions, html-changelogs), STATUS.md table, and REPO-ARCHITECTURE.md Mermaid diagram

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
