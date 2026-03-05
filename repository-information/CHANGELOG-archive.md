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
4. **Identify the oldest date group** — among the non-exempt sections (dates before today), find the **oldest date** that appears in any section header. **ALL sections sharing that date form a single date group** — this could be 1 section or 100+ sections. The entire group moves together, no matter how many sections it contains
5. **Rotate the group** — move the entire date group from CHANGELOG.md to CHANGELOG-archive.md:
   - **SHA enrichment** — as each version section is moved, look up its push commit SHA. For a header like `## [v01.05r] — 2026-02-28 ...`, run `git log --oneline --all --grep="^v01.05r " | head -1` to find the commit. Extract the short and full SHA (`git rev-parse FULL_SHA` if needed), then append ` — [SHORT_SHA](https://github.com/ORG/REPO/commit/FULL_SHA)` to the end of the header line. Resolve ORG/REPO from `git remote -v`. If the header already contains a SHA link (from older entries that were created before this rule), skip it. If the lookup fails (commit not found), move the section as-is without a SHA link
   - Remove them from CHANGELOG.md
   - Insert them into CHANGELOG-archive.md **above** any previously archived sections but below the archive header, in their original order (reverse-chronological, same as in CHANGELOG.md)
   - On the first rotation, remove the `*(No archived sections yet)*` placeholder
6. **Re-check** — after moving one date group, re-count the non-exempt sections remaining. If still above 100, repeat steps 4–5 with the next oldest date group. Continue until ≤100 non-exempt sections remain (or only today's sections are left)

### Key rules

- **Group by date, not individually** — never split a date group across the two files. All sections from the same day move together. A date group can contain any number of sections — the count of sections in the group is irrelevant; the group always moves as a unit
- **Never rotate today** — today's sections (EST) always stay in CHANGELOG.md regardless of count. The limit is enforced against older dates only
- **Common scenario: all non-exempt sections share one date** — this happens after a busy day followed by a new day. Example: 103 sections total, 3 from today, 100 from yesterday. All 100 from yesterday form one date group → rotate all 100 at once, leaving only today's 3. Do NOT move just enough to reach 100 — the date group is indivisible
- **Preserve content verbatim** — sections are moved exactly as-is (categories, entries, timestamps). No reformatting. The only modification during rotation is SHA enrichment (step 5) — adding a commit SHA link to headers that don't already have one
- **Order in archive** — newest archived sections appear at the top of the archive (just like CHANGELOG.md uses reverse-chronological order). When appending a newly rotated date group, insert it **above** any previously archived sections but below the archive header
- **Threshold is configurable** — the limit of 100 sections is defined in Pre-Commit #7 in CLAUDE.md. To change it, update the number there

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

## [v02.22r] — 2026-03-03 10:42:39 PM EST

### Changed
- Step 2 (manifest JSON): added a "Copy" button to copy the `appsscript.json` contents to clipboard
- Step 3 (GCP project): added link to Google Cloud Console for users who need to create a new project
- Step 9 (GITHUB_TOKEN): expanded with full instructions on creating a fine-grained PAT and note that the same token works across multiple projects

#### `gas-template.html` — v01.04w
##### Changed
- Copy button on JSON manifest block for one-click clipboard copy
- GCP Console link added to step 3 for new users
- Detailed GITHUB_TOKEN creation walkthrough and reuse guidance in step 9

#### `gas-test.html` — v01.03w
##### Changed
- Copy button on JSON manifest block for one-click clipboard copy
- GCP Console link added to step 3 for new users
- Detailed GITHUB_TOKEN creation walkthrough and reuse guidance in step 9

## [v02.21r] — 2026-03-03 10:27:04 PM EST

### Changed
- Restructured GAS Template and GAS Test pages — setup instructions are now the primary section with configuration inputs embedded inline at the relevant steps (e.g. Deployment ID input appears at step 8, Spreadsheet fields at step 11)
- Replaced separate collapsible instructions + standalone config form with a unified "Setup & Configuration" flow

#### `gas-template.html` — v01.03w
##### Changed
- Setup instructions moved before config inputs — inputs now appear inline within the step where they apply
- Section header renamed from "Configuration" to "Setup & Configuration"

#### `gas-test.html` — v01.02w
##### Changed
- Setup instructions moved before config inputs — inputs now appear inline within the step where they apply
- Section header renamed from "Configuration" to "Setup & Configuration"

## [v02.20r] — 2026-03-03 10:19:44 PM EST

### Added
- Collapsible GAS Setup Instructions section on both GAS Template and GAS Test pages — step-by-step guide covering Apps Script project creation, GCP linking, deployment, and token configuration

#### `gas-template.html` — v01.02w
##### Added
- Collapsible setup instructions panel — 12-step guide for creating and configuring the Apps Script project, including manifest settings, GCP linking, deployment, and optional spreadsheet integration

#### `gas-test.html` — v01.01w
##### Added
- Collapsible setup instructions panel — same 12-step guide as the GAS Template page

## [v02.19r] — 2026-03-03 10:09:44 PM EST

### Added
- New GAS Test page (`gas-test.html`) — test instance of the GAS template for trying out configuration before modifying the template itself
- New GAS project `GasTest` with `.gs` file, config.json, and all tracking files (changelogs, version files)
- GAS Test page uses separate `gas-test-` localStorage keys so it doesn't conflict with the template page

#### `gas-test.html` — v01.00w
##### Added
- Test instance of the GAS integration status dashboard — identical functionality to gas-template with separate localStorage namespace

#### `gas-test.gs` — 01.00g
##### Added
- Test instance of the GAS template script — pulls from and deploys to GasTest directory

## [v02.18r] — 2026-03-03 09:53:51 PM EST

### Added
- Interactive configuration form on GAS Template status page — input GAS project variables directly in the browser and test the GAS iframe connection without editing repo files
- localStorage persistence for configuration values — saved settings restore automatically on page load
- Copy Config button generates exportable config.json content for easy transfer to the repository

#### `gas-template.html` — v01.01w
##### Added
- Interactive configuration form — input GAS project variables (Title, Deployment ID, Spreadsheet ID, Sheet Name, Sound File ID) directly on the status page
- Apply button saves settings to browser storage for instant GAS iframe testing without editing repo files
- Copy Config button generates exportable config.json content for easy transfer to the repository
- Clear button removes saved settings and resets the dashboard to default state
- Previously saved settings automatically restore on page load

## [v02.17r] — 2026-03-03 09:40:29 PM EST

### Added
- New GAS integration status page (`gas-template.html`) — diagnostic dashboard showing HTML and GAS layer configuration status
- New GAS project `GasTemplate` with blank template `.gs` file, config.json, and all tracking files
- GAS status reporting via postMessage — the `.gs` template sends config status to the embedding HTML page for real-time dashboard updates

#### `gas-template.html` — v01.00w
##### Added
- Dark-themed diagnostic dashboard showing GAS integration status at a glance
- HTML layer checks: Deployment ID, Page Title, Auto-Refresh, Version Polling, Audio Context, Wake Lock
- GAS layer checks: Connection status, GAS Version, GitHub Config, Spreadsheet, Sound File
- Real-time status updates — dots change color as configuration is detected

#### `gas-template.gs` — 01.00g
##### Added
- Blank GAS template with all placeholder variables ready for configuration
- Config status reporting via `getAppData()` — reports which variables are configured vs placeholder
- postMessage integration sends `gas-status` to embedding page for dashboard display

## [v02.16r] — 2026-03-03 09:16:20 PM EST

### Changed
- Deactivated maintenance mode on test page — maintenance overlay removed, page now accessible normally

#### `test.html` — v01.18w
##### Changed
- Maintenance mode deactivated — page is now accessible normally

## [v02.15r] — 2026-03-02 06:52:41 PM EST

### Fixed
- Re-applied v02.14r version bump through proper `claude/*` branch workflow (v02.14r was erroneously pushed directly to `main`)

## [v02.14r] — 2026-03-02 06:43:07 PM EST

### Changed
- Bumped repository version from v02.13r to v02.14r

## [v02.13r] — 2026-03-02 12:55:00 PM EST

### Added
- "Imported Skills — Do Not Modify" rule in behavioral-rules.md — imported skills (`.claude/skills/imported--*`) are frozen; only location pointers may be updated, preserving traceability of which skill produces which behavior

## [v02.12r] — 2026-03-02 12:18:12 PM EST

### Added
- `SKILLS-REFERENCE.md` — complete inventory of all Claude Code skills (custom, imported, and bundled/plugin) with visibility status and guidance on when to add local vs. rely on bundled

## [v02.11r] — 2026-03-02 11:58:44 AM EST

### Added
- 6 imported Claude Code Skills in `.claude/skills/` with `imported--` prefix: `/webapp-testing` (Playwright page testing, from Anthropic), `/frontend-design` (distinctive UI creation, from Anthropic), `/skill-creator` (meta-skill for creating new skills, from Anthropic), `/security-review` (OWASP/web security audit, inspired by Trail of Bits), `/git-cleanup` (stale branch/worktree cleanup, inspired by Trail of Bits), `/diff-review` (pre-push differential code review, inspired by Trail of Bits)

## [v02.10r] — 2026-03-02 11:48:51 AM EST

### Added
- Claude Code Skills — 6 invokable workflow skills in `.claude/skills/`: `/phantom-update` (timestamp alignment), `/maintenance-mode` (toggle maintenance overlay), `/new-page` (create new HTML page with boilerplate), `/reconcile` (end multi-session mode), `/remember-session` (save session context), `/initialize` (first deployment setup)

## [v02.09r] — 2026-03-01 06:17:49 PM EST — [012851c](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/012851cb4fae8015d5762db11c9d908c91954c83)

### Added
- New Soccer Ball page — animated scene with two kids kicking a soccer ball back and forth, complete with SVG stick-figure players, rolling ball, sky, clouds, sun, goal posts, and grass

#### `soccer-ball.html` — v01.01w
##### Added
- Animated soccer scene with two kids in jerseys (#7 red, #10 blue) kicking a ball between them
- Rolling soccer ball with spin animation and bouncing arc
- Scenic background with sky gradient, animated clouds, sun, goal posts, and grass tufts

## [v02.08r] — 2026-03-01 05:37:23 PM EST — [2ae5c67](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/2ae5c67d7ebd54c7296acdfab5d81e4dd46327e2)

### Changed
- Test page placed into maintenance mode — displays maintenance overlay with timestamp

#### `test.html` — v01.17w (no change)
##### Changed
- Page placed into maintenance mode — visitors see a maintenance overlay until mode is deactivated

## [v02.07r] — 2026-03-01 04:15:28 PM EST — [814b096](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/814b0968307264643af6bdc71a4da4b07aa74029)

### Changed
- Bumped all HTML page versions to v01.17w
- Per-file subheadings now show "(no change)" when a file is affected but its version was not bumped
- Updated v02.04r subheadings in CHANGELOG.md to use the new "(no change)" format

#### `index.html` — v01.17w
##### Changed
- Version number updated

#### `test.html` — v01.17w
##### Changed
- Version number updated

## [v02.06r] — 2026-03-01 04:09:11 PM EST — [7005323](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/700532355243978097b2c2a2589029e8b7c91b3f)

### Changed
- Per-file subheadings in CHANGELOG.md now show the version each page/GAS file became — format: `#### \`filename\` — vXX.XXw`
- Backfilled version numbers on existing per-file subheadings for v02.00r, v01.97r, and v01.96r

## [v02.05r] — 2026-03-01 04:02:15 PM EST — [bcd32d9](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/bcd32d948f54c9fdd5e08c9b3c49e20803c2b0af)

### Changed
- CHANGELOG.md version section headers now show only the repo version — page/GAS versions removed from headers since per-file subheadings carry that detail
- Cleaned up 13 archived CHANGELOG entries and 3 active entries to remove `w`/`g` versions from headers

## [v02.04r] — 2026-03-01 03:57:39 PM EST — [e09eabe](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/e09eabe052bba5b896586456ca74dedace8d4dfc)

### Changed
- Page and GAS changelog version headers now show repo version after the timestamp instead of in parentheses before it — format: `[vXX.XXw] — timestamp — vXX.XXr`

#### `index.html` — v01.16w (no change)
##### Changed
- Changelog version headers now show the repo version after the timestamp for easier reading

#### `test.html` — v01.16w (no change)
##### Changed
- Changelog version headers now show the repo version after the timestamp for easier reading

## [v02.03r] — 2026-03-01 03:52:24 PM EST — [9b783be](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/9b783bec379381b44ee3921d03855394f735511d)

### Changed
- CHANGELOG entries for HTML/GAS changes now use per-file subheadings (`#### \`filename\``) instead of inline bold parentheses — each affected file gets its own section with categorized entries
- Backfilled per-file subheadings for v02.00r, v01.97r, and v01.96r CHANGELOG entries

## [v02.02r] — 2026-03-01 03:46:36 PM EST — [d2e00ba](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/d2e00ba14bbd955f7b584c1c6a40a73da201af34)

### Added
- CHANGELOG entries for HTML/GAS changes now include file attribution — affected filenames appended in bold parentheses (e.g. `(**index.html**, **test.html**)`)

## [v02.01r] — 2026-03-01 03:42:24 PM EST — [549bd89](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/549bd89e64fd69b6fd090e11e5fc591b4cd6f0de)

### Changed
- Strengthened duration annotation rules to prevent skipping `⏱️` markers between consecutive bookends

## [v02.00r] — 2026-03-01 03:35:27 PM EST — [f71c2f5](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/f71c2f5541b18ac1a223094104dce81c0f8de64f)

### Changed
- Changelog popup now requires the X button to close — clicking outside the popup no longer dismisses it

#### `index.html` — v01.16w
##### Changed
- Changelog popup now requires the X button to close — clicking outside no longer dismisses it

#### `test.html` — v01.16w
##### Changed
- Changelog popup now requires the X button to close — clicking outside no longer dismisses it

## [v01.99r] — 2026-03-01 03:29:33 PM EST — [4d36715](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/4d367155b3efab518aa3684c36ba33b3b6db1ef1)

### Changed
- Session context now enforces a 2-session cap — only Latest Session + 1 Previous are retained; older entries are dropped
- Trimmed SESSION-CONTEXT.md from 7 sessions to 2

## [v01.98r] — 2026-03-01 03:22:00 PM EST — [9634884](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/96348842bf4e361d5d9fa9a8997d656316f60571)

### Added
- Private repo compatibility enforced as Pre-Commit checklist item #19 — verifies no client-side browser code references authenticated GitHub endpoints

## [v01.97r] — 2026-03-01 03:14:52 PM EST — [4c8aec9](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/4c8aec9e1c79ca1199e06f99d7a48f00a5e947da)

### Changed
- Changelog popup now fetches from same-origin deployment copy instead of raw.githubusercontent.com — works with private repos
- Added private repo compatibility rule and changelog deployment sync rule

#### `index.html` — v01.15w
##### Changed
- Changelog popup now loads reliably when the repository is private

#### `test.html` — v01.15w
##### Changed
- Changelog popup now loads reliably when the repository is private

## [v01.96r] — 2026-03-01 03:04:05 PM EST — [7d14e62](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/7d14e62a1195022f8b936ea60d192b47706fd85c)

### Added
- Clicking the version number overlay now opens a changelog popup showing the page's recent changes
- Changelog popup can be closed with the X button, clicking outside, or pressing Escape

#### `index.html` — v01.14w
##### Added
- Clicking the version number now opens a changelog popup showing recent page updates

#### `test.html` — v01.14w
##### Added
- Clicking the version number now opens a changelog popup showing recent page updates

## [v01.95r] — 2026-03-01 02:35:56 PM EST

### Changed
- Added "Read the full message first" clause to single-commit-per-interaction rule — prevents premature commits when a user message contains multiple requests

## [v01.94r] — 2026-03-01 02:25:56 PM EST

### Added
- Added `REMINDERS_DISPLAY` toggle variable — controls whether active reminders are surfaced at session start (default `On`)
- Added `SESSION_CONTEXT_DISPLAY` toggle variable — controls whether previous session context is surfaced at session start (default `On`)

## [v01.93r] — 2026-03-01 02:18:05 PM EST

### Changed
- Completed "Consider creating a session recap file" reminder — moved from Active to Completed in REMINDERS.md

## [v01.92r] — 2026-03-01 02:10:10 PM EST

### Changed
- Turned on `CHAT_BOOKENDS` toggle — mid-response bookend markers now emitted
- Updated output formatting pointer in CLAUDE.md to reflect toggle independence — removed hardcoded bookend flow description, replaced with toggle-aware summary
- Fixed remaining toggle-dependent reference in "Duration before user interaction" rule — now uses "response start timestamp" instead of "opening marker (CODING START)"

## [v01.91r] — 2026-03-01 02:05:07 PM EST

### Changed
- Made `CHAT_BOOKENDS` and `END_OF_RESPONSE_BLOCK` toggles fully independent — added silent timestamp/estimate capture so all end-of-response block features (ACTUAL TOTAL COMPLETION TIME, PLAN EXECUTION TIME, ESTIMATE CALIBRATED) work even when mid-response bookends are off, and vice versa

## [v01.90r] — 2026-03-01 01:52:37 PM EST

### Changed
- Turned on `END_OF_RESPONSE_BLOCK` toggle — end-of-response block (UNAFFECTED URLS through CODING COMPLETE) is now emitted after each response

## [v01.89r] — 2026-03-01 01:44:43 PM EST

### Changed
- Renamed `AutoUpdateOnlyHtmlTemplate` to `HtmlTemplateAutoUpdate` across all files, directories, and documentation references (HTML template, GAS template, version files, changelogs, config files)

## [v01.88r] — 2026-03-01 01:28:40 PM EST

### Changed
- Chat bookends and end-of-response block toggles set to Off for streamlined output

## [v01.87r] — 2026-03-01 01:15:52 PM EST

### Changed
- Improved AskUserQuestion Visibility rule — now covers multi-question popups (all questions shown together in chat) and echoes the user's selections back into chat after they respond

## [v01.86r] — 2026-03-01 01:09:09 PM EST

### Added
- Added "AskUserQuestion Visibility" rule — question text and all options are now shown in the chat before the popup appears, so the question context is preserved in conversation history (same pattern as Plan Mode Visibility for ExitPlanMode)

## [v01.85r] — 2026-03-01 12:53:32 PM EST

### Added
- Added multi-session mode (`MULTI_SESSION_MODE` variable) — when enabled, parallel Claude Code sessions can safely push to the same repo without merge conflicts on shared state files (repo version, README timestamp, CHANGELOG version sections, STATUS.md)
- Added "Reconcile Multi-Session" command to catch up on deferred versioning and changelog work when multi-session mode is turned off

## [v01.84r] — 2026-03-01 12:27:00 PM EST

### Changed
- Large file write status messages now include a timestamp and duration estimate so the user knows when the operation started and roughly how long to wait

## [v01.83r] — 2026-03-01 12:22:35 PM EST

### Added
- Added "Plan Mode Visibility" rule — plan content must be output as chat text before calling ExitPlanMode so the user can reference it after the approval window disappears

## [v01.82r] — 2026-03-01 12:16:34 PM EST

### Added
- Added session context staleness detection and auto-reconstruction to Session Start Checklist — when SESSION-CONTEXT.md is outdated (missed "remember session"), the system auto-recovers from CHANGELOG entries, commits, and pushes so context persists across sessions

## [v01.81r] — 2026-03-01 11:58:00 AM EST

### Changed
- Moved SESSION SAVED indicator to appear after CODING COMPLETE instead of inside the end-of-response block — ensures maximum visibility so the user cannot miss the session-save confirmation

## [v01.80r] — 2026-03-01 11:53:27 AM EST

### Added
- Added 4 sandwich ingredients to the to-do list: lettuce, sliced turkey, mustard, pickles

## [v01.79r] — 2026-03-01 11:44:57 AM EST

### Changed
- Session start now shows "📌 Reminders For Developer:" instead of "📌 Reminders from last session:"
- Session start now automatically surfaces previous session context from SESSION-CONTEXT.md (no need to type "read session context")
- Session start now shows a tip reminding the developer about the "remember session" command
- "Remember session" now recommends starting a new session in the end-of-response block to preserve saved context

## [v01.78r] — 2026-03-01 11:39:23 AM EST

### Changed
- Completed "Get bread" to-do item

## [v01.77r] — 2026-03-01 11:25:23 AM EST

### Changed
- Renamed REMINDERS.md heading to "Reminders for Developer" — clarifies these are the developer's own notes, not a system Claude manages autonomously
- Renamed SESSION-CONTEXT.md heading to "Previous Session Context" — clearly distinct from developer reminders
- Broadened "User-Owned Content" rule to cover repurposing/restructuring — never fold a new feature into an existing user-created system or assume one replaces the other without explicit approval
- Updated all references across CLAUDE.md, output-formatting.md, and README.md to use the new names

## [v01.76r] — 2026-03-01 11:20:19 AM EST

### Added
- Added "User-Owned Content — Do Not Override" rule to behavioral-rules.md — never complete, remove, or modify user-created reminders, to-do items, or notes without explicit approval

### Fixed
- Restored incorrectly completed reminder back to Active Reminders — "Consider creating a session recap file" was closed without user approval

## [v01.75r] — 2026-03-01 11:12:55 AM EST

### Added
- Created `repository-information/SESSION-CONTEXT.md` — session context log for cross-session continuity
- Added "Remember Session" command to CLAUDE.md — writes session context to SESSION-CONTEXT.md when the user says "Remember Session", enabling a future session to pick up where the previous one left off

## [v01.74r] — 2026-03-01 11:06:35 AM EST

### Fixed
- Fixed cascading indentation in end-of-response block — added mandatory blank lines between sections and flush-left content to break markdown list context that caused AGENTS USED numbered list to nest all subsequent sections

### Added
- Added "Section separation" formatting rule to end-of-response block in chat-bookends.md — blank line between every section pair, flush-left content

## [v01.73r] — 2026-03-01 10:59:10 AM EST

### Added
- Added NEW FOLDERS section to end-of-response block — shows clickable links to any new directories created during a response, positioned between TODO and AFFECTED URLS (skipped entirely when no folders were created)

## [v01.72r] — 2026-03-01 03:07:05 AM EST

### Changed
- Tightened "Single commit per interaction" rule to absolute — exactly one commit per interaction with only two exceptions (user explicitly requests multiple, or prior push already merged). Removed checkpoint exception

## [v01.71r] — 2026-03-01 03:03:55 AM EST

### Added
- Added "Single commit per interaction" rule to Pre-Commit Checklist — each user interaction should produce one commit, not split into intermediate + push commits

### Changed
- Rewritten "Rebase before push commit" rule — rebase now happens before making edits (using `git stash` if needed) instead of after, eliminating unnecessary intermediate commits

## [v01.70r] — 2026-03-01 02:57:25 AM EST

### Added
- Added "Explicit Opinion When Consulted" behavioral rule — when the user delegates a judgment call via conditional language ("if you think", "if it makes sense"), state the opinion clearly and act on it rather than silently complying
- Added "Rule Placement Autonomy" behavioral rule — autonomously choose the best location (CLAUDE.md, existing rules file, or new rules file) when the user asks to make something a rule, with mandatory contradiction scanning

## [v01.69r] — 2026-03-01 02:50:58 AM EST

### Fixed
- Restored missing estimate calibration details in `.claude/rules/chat-bookends.md` — commit cycle example, "do not over-correct" caveat, calibration output example, follow-up commit fallback, and timing note
- Restored missing placement rule rationale suffixes in `.claude/rules/behavioral-rules.md` — explanatory sentences for all 5 placement zone rules

## [v01.68r] — 2026-03-01 02:24:37 AM EST — [8fea2f9](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/8fea2f922aa17d6b6c4221eba72c084f89fa0770)

### Changed
- Deep compacted CLAUDE.md from 993 → 272 lines (73% reduction) by extracting content to 4 new always-loaded `.claude/rules/` files: `chat-bookends.md`, `chat-bookends-reference.md`, `behavioral-rules.md`, `output-formatting.md`
- Consolidated 13 individual pointer sections into a single Reference Files table
- Moved Commit Message Naming content to `.claude/rules/gas-scripts.md`
- Updated CLAUDE.md pointers and "Maintaining these checklists" section to document always-loaded vs path-scoped rules file types

## [v01.67r] — 2026-03-01 01:46:08 AM EST

### Changed
- Extracted 10 reference sections from CLAUDE.md into 6 path-scoped `.claude/rules/` files, reducing CLAUDE.md from ~1255 to ~993 lines while preserving all functionality via one-line pointers
- Populated `.claude/rules/html-pages.md` with Build Version reference (polling, maintenance mode, new page setup, directory structure)
- Populated `.claude/rules/gas-scripts.md` with Version Bumping, GAS Project Config, and Coding Guidelines Reference
- Populated `.claude/rules/workflows.md` with Merge Conflict Prevention and Commit SHA Tracking
- Populated `.claude/rules/repo-docs.md` with ARCHITECTURE.md updates, Docs Sync, Internal Link Reference, Relative Path Resolution, and Markdown Formatting
- Populated `.claude/rules/changelogs.md` with quick-reference guide for changelog formats and archive rotation
- Populated `.claude/rules/init-scripts.md` with init script details, Phantom Edit, and Line Ending Safety

## [v01.66r] — 2026-03-01 01:22:38 AM EST

### Added
- Added "Backups Before Major Changes" rule to CLAUDE.md — recommends creating `.bak` backups in `repository-information/backups/` before large-scale structural edits to critical files
- Created initial `CLAUDE.md.bak` backup in `repository-information/backups/`

## [v01.65r] — 2026-03-01 01:13:43 AM EST

### Added
- Created `.claude/rules/` directory with 6 path-scoped placeholder rule files for future CLAUDE.md content extraction (html-pages, gas-scripts, workflows, repo-docs, changelogs, init-scripts)

## [v01.64r] — 2026-03-01 01:03:17 AM EST

### Changed
- Eliminated SHA backfill commit from push cycle — CHANGELOG version headers no longer include commit SHA links at push time, reducing each push from 2 commits to 1
- SHA links are now deferred to archive rotation — when entries move from CHANGELOG.md to CHANGELOG-archive.md, the commit SHA is looked up from git log and added to the header automatically
- Removed "CHANGELOG SHA Backfill — Potential Elimination" from IMPROVEMENTS.md (now implemented)

## [v01.63r] — 2026-03-01 12:42:35 AM EST — [97b1022](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/97b102240a16332188623c42eb127771894c17fb)

### Changed
- Disabled maintenance mode on all pages (index.html and test.html) — maintenance overlay removed, pages now accessible normally

## [v01.62r] — 2026-03-01 12:37:10 AM EST — [eef6939](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/eef693974db315b1f88ac1a8db7443d092d51c9a)

### Changed
- Increased CHANGELOG archive rotation limit from 50 to 100 version sections across CLAUDE.md, CHANGELOG.md, and CHANGELOG-archive.md (including rotation logic, quick rule, examples, and capacity counter)

## [v01.61r] — 2026-03-01 12:32:47 AM EST — [766ccd3](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/766ccd368d2b5a3855d8a27e948fe00734b52dd0)

### Fixed
- Completed CHANGELOG archive rotation — moved all 50 remaining 2026-02-28 sections to archive as a single date group (previously only 7 of 57 were moved, incorrectly splitting the date group)

### Changed
- Archive rotation logic clarified: date groups are indivisible — ALL sections sharing a date move together, even if that means moving 50+ sections at once. Added "Quick rule" summary for instant recognition
- Removed incorrect "split by count" fallback from Pre-Commit #7 — date groups are never split

## [v01.60r] — 2026-03-01 12:23:20 AM EST — [78b2b32](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/78b2b320ea24b29d24467f7635165e9bca5c1aab)

### Fixed
- Performed overdue CHANGELOG archive rotation — moved 7 oldest sections (v01.01r–v01.07r) to CHANGELOG-archive.md, reducing from 59 to 52 sections

### Changed
- Archive rotation trigger reinforced in Pre-Commit #7 — capacity counter now explicitly described as a mandatory rotation trigger (when >50, rotation must run), with additional handling for single-date accumulation where all non-exempt sections share one date

## [v01.59r] — 2026-03-01 12:17:26 AM EST — [35c2de6](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/35c2de6c5358b1fbe00f79e73afd31574da44233)

### Changed
- Rebase check now uses direct `git merge-base --is-ancestor` ancestry test instead of tracking session push history — simpler, deterministic, and correct regardless of how many pushes occurred
- Pre-Push #5 simplified to a branch-exists check (rebase responsibility moved to Pre-Commit push commit cycle)
- "Push only once per branch" rule replaced with "Multiple pushes per session are safe" — reflecting actual behavior

## [v01.58r] — 2026-03-01 12:03:06 AM EST — [999344f](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/999344fe93e84189696814a3451fe3d3d2eee647)

### Changed
- Completed "Get tomato" to-do item


## [v01.57r] — 2026-02-28 11:59:43 PM EST — [d886812](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/d8868126f2debb2b9bffe3e027a1a7d9578768ff)

### Added
- Self-improvement rule: rebase-need check now runs at the START of the push commit cycle (not deferred to Pre-Push), preventing SHA backfill invalidation from post-commit rebases

### Changed
- "Rebase before push commit" rule strengthened with explicit check-before-push-commit enforcement and SHA backfill rebase interaction warning

## [v01.56r] — 2026-02-28 11:54:00 PM EST — [df73376](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/df7337643b379a7347cff43598e73b46689f233a)

### Added
- SHA commit links in CHANGELOG version section headers — each version section now links to its push commit for one-click navigation to the exact changes

### Changed
- Push commit cycle now includes a SHA backfill step: a mechanical follow-up commit inserts the SHA after the push commit is created

## [v01.55r] — 2026-02-28 11:36:34 PM EST

### Fixed
- TODO display in end-of-response block now preserves original list position for crossed-out completed items

## [v01.54r] — 2026-02-28 11:31:10 PM EST

### Changed
- Completed "Get turkey" to-do item

## [v01.53r] — 2026-02-28 11:27:12 PM EST

### Changed
- Push-once enforcement retry loop reduced from ~15s x 3 retries (45s max idle) to ~5s x 4 checks (20s max idle)
- Deployment Flow push-once bullet now cross-references Pre-Push #5 instead of duplicating exception text
- Pre-Push #5 now cross-references "Rebase before push commit" sequence instead of vague "after rebasing" instruction
- Rebase-before-push-commit rule now explicitly requires clean working tree and documents committing uncommitted changes before rebase

## [v01.52r] — 2026-02-28 11:23:24 PM EST

### Added
- `🔃🔃CONTEXT COMPACTION RECOVERY🔃🔃` bookend — visible marker when context compaction triggers mid-session recovery
- Compaction recovery override rule in Chat Bookends — replaces all other openers when compaction is detected

### Changed
- Context compaction recovery now skips reminders (already surfaced earlier in session) and focuses on resuming the interrupted task using previously gathered context

## [v01.51r] — 2026-02-28 11:05:02 PM EST

### Changed
- Context compaction recovery rule now requires resuming interrupted work after the session start checklist, preventing mid-response task abandonment

## [v01.50r] — 2026-02-28 10:55:29 PM EST

### Changed
- Removed SHA from CHANGELOG version headers — eliminates cross-push backfill dependency (~40-50s savings per push)
- Removed version numbers from all ARCHITECTURE.md Mermaid nodes — diagram shows structure only, STATUS.md is the version dashboard (~20-30s savings per push)
- Pre-Commit #6 now triggers only on structural changes, not version bumps

### Added
- Rebase-before-push-commit rule — commit intermediate work first, rebase, then do push commit cycle (eliminates stash/pop)
- Push commit efficiency rules — single timestamp call + parallel edits for independent files

## [v01.49r] — 2026-02-28 10:33:20 PM EST

### Added
- Page-scope command rule — commands that target individual pages (maintenance mode, etc.) now require specifying which pages unless "all" is explicitly stated

## [v01.48r] — 2026-02-28 10:28:23 PM EST — SHA: [`4ced202`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/4ced20283b11207f8309b4f9d6289f2283fd6ccb)

### Changed
- All live site pages placed into maintenance mode

## [v01.47r] — 2026-02-28 10:18:53 PM EST — SHA: [`9c75328`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/9c75328a1ef736537f6e32e58222144791dd3a62)

### Changed
- Affected URLs section now shows the version each page becomes after changes
- Planned Affected URLs now shows the current (pre-change) version for comparison
- Unaffected URLs now shows the current version for each page

## [v01.46r] — 2026-02-28 09:31:11 PM EST — SHA: [`6df5df7`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/6df5df7a19e035b1d3dc1cdb130c28c14c3a30ee)

### Changed
- Countdown numbers now start appearing at 5 instead of 8

## [v01.45r] — 2026-02-28 09:13:16 PM EST — SHA: [`c6cf8a6`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/c6cf8a66fcbfc1ca9c43f139c1d34091c48454d2)

### Changed
- Countdown numbers now start appearing at 8 instead of 9, restoring the original yellow blink rhythm

## [v01.44r] — 2026-02-28 07:35:31 PM EST — SHA: [`b9b59cf`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/b9b59cfadb5e3285a7e235d0ac9794cd2b60ebb5)

### Changed
- Increased countdown font from 5px to 6px for better readability while staying centered in the 8px dot

## [v01.43r] — 2026-02-28 07:29:42 PM EST — SHA: [`3ee4420`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/3ee44208627fccd450213a22d014a4ea43995846)

### Changed
- Shrunk countdown font to 5px to center numbers within the original 8px dot instead of expanding the dot

## [v01.42r] — 2026-02-28 07:26:37 PM EST — SHA: [`34d3689`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/34d3689c1050945ba6577969983ca1a7e2a0cc9a)

### Fixed
- Fixed countdown numbers not centering in the dot at 100% zoom — dot now expands to 12px when counting for reliable centering at all zoom levels

## [v01.41r] — 2026-02-28 07:19:05 PM EST — SHA: [`d5659eb`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/d5659eb5a91cf82f6c15dc09799ee464fd4639e3)

### Fixed
- Centered countdown numbers inside the version indicator dot

## [v01.40r] — 2026-02-28 07:15:10 PM EST — SHA: [`4672c2c`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/4672c2c0ff8720402afd069ffc4bec3478344087)

### Changed
- Restored original dot size (8×8px) for the version indicator countdown circle

## [v01.39r] — 2026-02-28 07:08:21 PM EST — SHA: [`bb27684`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/bb27684b5411c1233e9bd6fbd27f9400c77f0f70)

### Fixed
- Restored orange pulse during version check — `startCountdown()` was immediately overwriting the checking class, preventing the orange flash from showing
- Countdown dot is now static gray with numbers (no pulse) — orange pulse reserved for the active fetch

## [v01.38r] — 2026-02-28 07:02:59 PM EST — SHA: [`b5cc752`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/b5cc752635b74ec4eb3a89e113c927df118cd48f)

### Fixed
- Restored pulse animation on the countdown dot — `.counting` class now includes the blink animation that was missing after the dot refactor

## [v01.37r] — 2026-02-28 06:58:44 PM EST — SHA: [`98581d4`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/98581d48583c9c3dc37dd30821cf137051cf374b)

### Changed
- Moved poll countdown into the status dot circle — digit counts down 9, 8, ... 1 inside the dot instead of as separate text next to it
- Countdown starts visibly at 9 (first second after poll is hidden) for a cleaner appearance

## [v01.36r] — 2026-02-28 06:44:28 PM EST — SHA: [`53296d5`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/53296d5426d43e7016c2b43cbd31f50d0752eef7)

### Added
- Added poll countdown timer to the version indicator pill on all HTML pages — shows seconds remaining until the next version check (e.g. "10s", "9s", ... "1s"), then clears during the fetch

## [v01.35r] — 2026-02-28 06:38:00 PM EST — SHA: [`36b1e51`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/36b1e51a4efb5f14dcc6f407c661936e11e2b3bb)

### Changed
- Consolidated two specific self-improvement rules (URL format gate, Reminders compacted-context guard) into a single general "Context compaction recovery" rule in the Session Start Checklist — on compacted/continued contexts, re-read the actual CLAUDE.md rules and re-execute the full Session Start Checklist instead of relying on patterns from the session summary; covers all future cases without needing to enumerate each one

## [v01.34r] — 2026-02-28 06:33:58 PM EST — SHA: [`2908cb7`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/2908cb798ee9a60a4d284d32b7234159c38c6f8c)

### Added
- Added self-improvement rule to Reminders instruction in CLAUDE.md — explicitly states that reminders must be surfaced on compacted-context continuations and continued sessions, not just fresh sessions; prevents assuming reminders were already shown based on prior context

## [v01.33r] — 2026-02-28 06:31:13 PM EST — SHA: [`b3fd2f5`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/b3fd2f526510ddd17062630cd2d2da7ffc4e222f)

### Added
- Added "URL format gate" self-improvement rule to Unaffected URLs section in CLAUDE.md — forces re-deriving the URL display pattern from current variable values (`IS_TEMPLATE_REPO` match + `TEMPLATE_DEPLOY`) instead of copying from prior responses, preventing the wrong URL format from propagating across responses

## [v01.32r] — 2026-02-28 06:22:07 PM EST — SHA: [`5e3d201`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/5e3d2018c5f7a4ce7e3c7564d3beba26485fe0a5)

### Changed
- Changed bookend date format from `YYYY-MM-DD` to `MM/DD/YYYY` — applies to all 5 time+date bookends (CODING PLAN, CODING START, RESEARCH START, CODING COMPLETE, RESEARCH COMPLETE) and all flow examples
- Completed to-do item "Get lettuce" and removed it from TODO.md

## [v01.31r] — 2026-02-28 06:17:55 PM EST — SHA: [`0d58700`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/0d58700ccd450322f5c1ed377fbc5aa1fd836181)

### Added
- Added 5 items to to-do list: get bread, get turkey, get lettuce, get tomato, get mayo

## [v01.30r] — 2026-02-28 06:14:20 PM EST — SHA: [`9960a53`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/9960a533054121938482e0b0c85911d5c7c7360d)

### Added
- Added `📋📋TODO📋📋` section to the end-of-response block — displays current to-do items from `repository-information/TODO.md`, shows completed items crossed off with checkboxes, and auto-removes them from the file after display

## [v01.29r] — 2026-02-28 05:42:22 PM EST — SHA: [`1181e65`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/1181e65c33f79739d72e5d844af759de7fb3d10b)

### Changed
- Split the Bookend Summary table into two separate tables: "Mid-Response" bookends and "End-of-Response Block" items — makes it easier to see which bookends belong to the work phase vs. the summary block
- Added `END OF RESPONSE BLOCK` header between two backtick-wrapped divider lines at the start of the end-of-response block — provides a clear visual banner separating work output from the summary sections

## [v01.28r] — 2026-02-28 05:27:48 PM EST — SHA: [`8cc1a0b`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/8cc1a0bf696d7ecc9a556e62f2b78e2559b8dd3c)

### Added
- Added "HTML Page Config Files (html.config.json)" design consideration to IMPROVEMENTS.md — documents when and why an HTML-side config.json would become useful, with implementation design notes for future reference

## [v01.27r] — 2026-02-28 05:09:04 PM EST — SHA: [`c20f20d`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/c20f20d8ffb8e67380c77f24a1984185cf32a6a4)

### Changed
- `2026-02-28 05:06:41 PM EST` — Centralized all 12 per-page and per-GAS changelog files into `repository-information/changelogs/` — declutters `live-site-pages/`, `googleAppsScripts/`, and `live-site-templates/` directories, and eliminates false GitHub Pages deployment triggers from changelog-only edits

## [v01.26r] — 2026-02-28 04:44:00 PM EST — SHA: [`d64e6d9`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/d64e6d9845a5645409cc13fdd0876ae1b4edecc3)

### Changed
- Standardized HTML version file naming from dot-separated (`index.htmlversion.txt`) to concatenated (`indexhtml.version.txt`) — now uniform with changelog naming pattern (`indexhtml.changelog.md`) and GAS naming pattern (`indexgs.version.txt`)
- Updated JavaScript auto-refresh polling URL construction from `pageName + '.htmlversion.txt'` to `pageName + 'html.version.txt'`

## [v01.25r] — 2026-02-28 04:32:51 PM EST — SHA: [`2cf6582`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/2cf658251efcf92cd00c629098c85c75edf599fa)

### Changed
- Renamed HTML page version files to include `html` in filename — `index.version.txt` → `index.htmlversion.txt`, `test.version.txt` → `test.htmlversion.txt`, `AutoUpdateOnlyHtmlTemplate.version.txt` → `AutoUpdateOnlyHtmlTemplate.htmlversion.txt` — completing the disambiguation between HTML and GAS version files
- Updated JavaScript auto-refresh polling logic in all HTML pages to fetch `.htmlversion.txt` instead of `.version.txt`

### Added
- Added Pre-Commit #18 (unique file naming) — enforces that no two files in the repo share the same filename, with distinguishing identifiers (`html`, `gs`, etc.) for files tracking similar concepts across subsystems

## [v01.24r] — 2026-02-28 04:17:58 PM EST — SHA: [`4a26eea`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/4a26eea787f90d828529a34fbd5d50ca38eda527)

### Changed
- Renamed all changelog and GAS version files to include `html` or `gs` in filenames for disambiguation — `index.changelog.md` → `indexhtml.changelog.md` (pages) and `indexgs.changelog.md` (GAS), `index.version.txt` → `indexgs.version.txt` (GAS only — HTML version.txt keeps original name as it's a runtime dependency for auto-refresh polling)
- Updated all internal links within renamed files, CLAUDE.md naming conventions, and README structure tree

## [v01.23r] — 2026-02-28 04:09:55 PM EST — SHA: [`5c7d237`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/5c7d237a5b3c4cd6e3a113c56b892a2af169973e)

### Added
- Added per-GAS-project `<page-name>.version.txt` files that mirror the `VERSION` variable in each `.gs` file — provides external version reference without reading the code
- Added per-GAS-project user-facing changelogs (`<page-name>.changelog.md` and `<page-name>.changelog-archive.md`) in each `googleAppsScripts/` subdirectory
- Added template GAS version file and changelogs in `googleAppsScripts/AutoUpdateOnlyHtmlTemplate/`

### Changed
- Updated Pre-Commit #1 to bump GAS `<page-name>.version.txt` alongside the `.gs` VERSION variable
- Expanded Pre-Commit #17 from "Page changelog" to "Page & GAS changelogs" — now covers both HTML page and GAS script changelogs with appropriate version formats (`w` for pages, `g` for GAS)
- Updated New Embedding Page Setup Checklist with step #10 (create GAS version file and changelog)
- Updated Template Repo Guard and Phantom Edit reset rules to include GAS changelogs and version.txt files

## [v01.22r] — 2026-02-28 04:02:49 PM EST — SHA: [`196a4ed`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/196a4ede2548770e483f1a0da7cfd08cb3e5bb17)

### Changed
- Updated page changelog version section header format to include the corresponding repo version for developer cross-reference — format: `## [vXX.XXw] (vXX.XXr) — YYYY-MM-DD HH:MM:SS AM/PM EST`

## [v01.21r] — 2026-02-28 03:57:32 PM EST — SHA: [`1410eef`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/1410eefb776afbc007b91042691a35652e61d87f)

### Added
- Added user-facing per-page changelogs (`<page-name>.changelog.md` and `<page-name>.changelog-archive.md`) for each HTML page in `live-site-pages/` — describes changes from the visitor's perspective without exposing backend details
- Added template changelog files in `live-site-templates/` for new page setup
- Added Pre-Commit #17 (page changelog) to CLAUDE.md — maintains user-facing changelogs alongside the existing developer-facing repo CHANGELOG

### Changed
- Updated Template Repo Guard, Pre-Commit gate, Phantom Edit, and New Embedding Page Setup Checklist to include #17

## [v01.20r] — 2026-02-28 03:49:03 PM EST — SHA: [`38627b5`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/38627b5c4cee48b12604d9c5d013b096f3cc2637)

### Changed
- Added SHA placeholder (`— SHA: *pending next push*`) to new CHANGELOG version section headers — makes it clear a SHA will be backfilled on the next push, instead of showing nothing
- Updated Pre-Commit #7 format spec to include placeholder in new version section headers
- Updated Pre-Commit #16 backfill logic to replace the placeholder with the actual linked SHA

## [v01.19r] — 2026-02-28 03:38:51 PM EST — SHA: [`d19cddb`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/d19cddb07062c3e51e0241e59d91997de6f2e122)

### Changed
- Added "Conflict cleanup" rule to Continuous Improvement section in CLAUDE.md — when adding or modifying a rule, scan the rest of the file for conflicting text and remove/update it in the same commit
- Fixed stale backfill format in Pre-Commit #7 — was still showing date-only (`YYYY-MM-DD`) instead of the new date+time format

## [v01.18r] — 2026-02-28 03:32:19 PM EST — SHA: [`247665a`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/247665a7504155b1470e96f9a946f7d239dedb8e)

### Fixed
- Fixed CHANGELOG entries — each version section now has its own entries describing what that specific push changed, instead of accumulating entries from prior versions into a single section

### Changed
- Added "One version, one set of entries" clarification to Pre-Commit #7 in CLAUDE.md — entries belong to the version that introduced them and must not be duplicated into later version sections

## [v01.17r] — 2026-02-28 03:24:30 PM EST — SHA: [`e3e5bc2`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/e3e5bc2795fa041bc581c1f99950917155a5f9f3)

### Changed
- Moved timestamps from individual CHANGELOG entries to version section headers — each push is a single atomic unit, so one timestamp per section is sufficient
- Updated Pre-Commit #7 entry format from timestamped entries to plain `- Description`
- Updated version section header format to include full `HH:MM:SS AM/PM EST` timestamp

## [v01.16r] — 2026-02-28 03:21:17 PM EST — SHA: [`d9f668e`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/d9f668e18d95f976fbdcb6e7a1b807617bd76d23)

### Changed
- Added `SHA:` label prefix to COMMIT LOG entries and CHANGELOG version headers — makes it clear that the linked alphanumeric string is a commit SHA (Secure Hash Algorithm identifier)
- Updated Pre-Commit #7 and #16 format specs to include the `SHA:` label
- Updated flow examples in Chat Bookends to show `SHA:` prefix

## [v01.15r] — 2026-02-28 03:17:38 PM EST — SHA: [`2b4d930`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/2b4d93039d2aede730bf939be775ddc7f262426b)

### Changed
- Changed COMMIT LOG SHA links from backtick-wrapped (red/accent) to plain markdown links (clickable, non-red) — matches the style used for file path links like index.html
- Updated flow examples in Chat Bookends to show plain link format

## [v01.14r] — 2026-02-28 03:12:45 PM EST — SHA: [`16ba557`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/16ba55710c33bb6b5ce51f37265fce33540a89b8)

### Changed
- Added linked SHAs to COMMIT LOG end-of-response section — commits now link to their GitHub commit page for one-click navigation
- Updated COMMIT LOG format spec in Chat Bookends and flow examples

## [v01.13r] — 2026-02-28 03:08:41 PM EST — SHA: [`8440b6e`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/8440b6eb7a0ef05c922f7dd9f2f77baf5789a487)

### Changed
- Made CHANGELOG commit SHAs clickable links to GitHub commit pages — updated Pre-Commit #7 and #16 format specs
- Converted all 11 existing SHA entries in CHANGELOG to linked format

## [v01.12r] — 2026-02-28 02:44:13 PM EST — SHA: [`96c0667`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/96c06679947b092b9582005448aa092e84922a34)

### Changed
- Reframed "Validate Before Asserting" in CLAUDE.md — "Wait. No." moments are acceptable and expected; what matters is treating each one as a Continuous Improvement trigger to propose CLAUDE.md additions that prevent the same mistake from recurring

## [v01.11r] — 2026-02-28 02:40:29 PM EST — SHA: [`8e78453`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/8e78453c83cbccd8ceef2803b144f473f3f48909)

### Changed
- Strengthened "Validate Before Asserting" rule in CLAUDE.md — now covers mid-reasoning assertions (not just opening statements), adds explicit "Wait. No." pattern warning, and emphasizes tracing multi-step logic to completion before asserting any step works

## [v01.10r] — 2026-02-28 02:33:19 PM EST — SHA: [`3d087fe`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/3d087fe6b6518e28755197318e64541c04d2417e)

### Added
- Added "Validate Before Asserting" section to CLAUDE.md — reason through claims before stating them as fact; never lead with a confident assertion that hasn't been verified

## [v01.09r] — 2026-02-28 02:26:52 PM EST — SHA: [`8b3a82c`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/8b3a82cac958665ad2ed9bd1854b026ba9a3e48f)

### Changed
- Increased CHANGELOG archive rotation limit from 20 to 50 version sections across CLAUDE.md, CHANGELOG.md, and CHANGELOG-archive.md (including rotation logic examples)

## [v01.08r] — 2026-02-28 02:10:05 PM EST — SHA: [`eb3266b`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/eb3266b3d7176594a824ed92c44f7aab850e01ab)

### Added
- Added capacity counter (`Sections: X/20`) to CHANGELOG.md header — shows current version section count vs. rotation limit at a glance
- Added capacity counter update rule to Pre-Commit #7 — counter updates on every push commit after version section creation and archive rotation

## [v01.07r] — 2026-02-28 01:59:08 PM EST — SHA: [`8b58ebc`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/8b58ebcb7d387a5a19afed9d07712c212b677e20)

### Added
- Added Continuous Improvement section to CLAUDE.md — when Claude encounters struggles or missed steps, flag them to the user and propose CLAUDE.md additions to prevent recurrence

## [v01.06r] — 2026-02-28 01:56:27 PM EST — SHA: [`abfe8e1`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/abfe8e18dd2028b2e112165d71763e441d8f6b43)

### Changed
- Fixed SHA backfill instructions in Pre-Commit #16 — after rebase onto `origin/main`, HEAD is the workflow's `[skip ci]` commit, not the version commit; must match version prefix in `git log` output instead of using `git log -1`

## [v01.05r] — 2026-02-28 01:51:24 PM EST — SHA: [`ad76117`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/ad76117802c331ae1730c78f7ee3867a6e02d383)

### Changed
- Refined CHANGELOG archive rotation to rotate by date group (all sections sharing the oldest date move together) with current-day exemption
- Added detailed rotation logic documentation to `CHANGELOG-archive.md` (step-by-step procedure, key rules, examples)

## [v01.04r] — 2026-02-28 01:48:26 PM EST — SHA: [`2f70fd4`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/2f70fd45c4744fc9094c1807aaf91913fcc7469d)

### Added
- Added CHANGELOG archive rotation — when CHANGELOG.md exceeds 20 version sections, oldest sections are moved to `CHANGELOG-archive.md`
- Created `repository-information/CHANGELOG-archive.md` for storing rotated changelog sections

### Changed
- Updated Phantom Edit and Template Repo Guard CHANGELOG reset rules to also reset the archive file
- Fixed stale comment in README tree (`repository.version.txt` — "bumps every commit" → "bumps every push")

## [v01.03r] — 2026-02-28 01:29:17 PM EST — SHA: [`17498e8`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/17498e80290c434d072ae8011f31c8e4903fbb16)

### Changed
- Changed repo version bump (#16) from per-commit to per-push — version now increments only on the final commit before `git push`
- Changed CHANGELOG version section creation (#7) from per-commit to per-push — one section per push instead of one per commit, reducing CHANGELOG growth
- Updated commit message format (#9) to distinguish push commits (with `r` prefix) from intermediate commits (with `g`/`w` prefix or no prefix)
- Added push commit concept definition to Pre-Commit Checklist header
- Updated Commit Message Naming reference section with intermediate commit examples
- Clarified Pre-Commit #11 that repo version display stays unchanged on intermediate commits

## [v01.02r] — 2026-02-28 01:13:35 PM EST — SHA: [`dceafab`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/dceafab59bc174ef7acb32af0e990d711bc90abd)

### Added
- Added repo version display next to `Last updated:` timestamp in README.md (format: `Last updated: TIMESTAMP · Repo version: vXX.XXr`)

### Changed
- Updated Pre-Commit #11 to include repo version update alongside README timestamp
- Broadened Initialize Command no-version-bump wording to explicitly list all version file types (`repository.version.txt`, `.gs` VERSION, HTML meta tags)

## [v01.01r] — 2026-02-28 01:09:13 PM EST — SHA: [`2a376dd`](https://github.com/ShadowAISolutions/htmltemplateautoupdate/commit/2a376dd66a987d1125a1589a8ebe74b39b30ef73)

### Added
- Introduced repository version system (`v01.XXr`) — tracks every commit with a dedicated version in `repository-information/repository.version.txt`
- Added Pre-Commit #16 (repo version bump + retroactive SHA backfill in CHANGELOG version headers)
- Added `repository.version.txt` node to ARCHITECTURE.md diagram

### Changed
- Updated Pre-Commit #7 CHANGELOG format — version sections now always created (repo version bumps every commit), headers include `r`/`g`/`w` prefixes and retroactive commit SHA
- Updated Pre-Commit #9 commit message format — every commit now starts with `vXX.XXr` prefix, with `g`/`w` appended when those versions also bump
- Updated Template Repo Guard and TEMPLATE REPO GATE to include #16 in version-dependent item lists and reset rules
- Toggled `TEMPLATE_DEPLOY` to `On` — re-enabled GitHub Pages deployment on the template repo
- Documented toggle-commit deploy behavior in CLAUDE.md (Template Variables table and Template Repo Guard) — toggle takes effect on the same commit's push

Developed by: ShadowAISolutions
