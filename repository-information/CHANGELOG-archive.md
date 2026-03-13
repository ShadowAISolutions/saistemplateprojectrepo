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
   - **SHA enrichment** — as each version section is moved, look up its push commit SHA. For a header like `## [v01.05r] — 2026-02-28 ...`, run `git log --oneline --all --grep="^v01.05r " | head -1` to find the commit. Extract the short and full SHA (`git rev-parse FULL_SHA` if needed), then append ` — [SHORT_SHA](https://github.com/ORG/REPO/commit/FULL_SHA)` to the end of the header line. Resolve ORG/REPO from `git remote -v`. If the header already contains a SHA link (from older entries that were created before this rule), skip it. If the lookup fails (commit not found), move the section as-is without a SHA link
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
