# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 67/100`

## [Unreleased]

## [v04.06r] — 2026-03-07 12:31:43 AM EST

### Changed

- Moved GAS version pill 24px to the right (`right: 170px` → `right: 146px`) in the template and all pages

#### `index.html` — v01.23w

##### Changed
- GAS version pill repositioned slightly to the right

#### `gas-project-creator.html` — v01.61w

##### Changed
- GAS version pill repositioned slightly to the right

#### `testation7.html` — v01.04w

##### Changed
- GAS version pill repositioned slightly to the right

#### `testation8.html` — v01.03w

##### Changed
- GAS version pill repositioned slightly to the right

## [v04.05r] — 2026-03-07 12:21:26 AM EST

### Changed

- Propagated universal template features to `index.html` and `gas-project-creator.html` — both pages now match the template's dual splash system (blue Website Ready + green Code Ready), reusable `showUpdateSplash()` function, Code Ready sound caching, GAS version pill with countdown dot, GAS changelog popup, `gs.version.txt` polling with auto-detect, and `window._htmlPollTime` anti-sync guard

### Removed

- Removed legacy `postMessage`-based GAS reload mechanism from `index.html` — replaced by `gs.version.txt` polling (same mechanism used by all other pages)

#### `index.html` — v01.22w

##### Changed
- Updated splash system from single green splash to dual blue (Website Ready) + green (Code Ready) splashes
- Added GAS version pill with countdown dot and GAS changelog popup
- Replaced inline splash/sound code with reusable `showUpdateSplash()` function
- Added Code Ready sound caching and `gs.version.txt` polling for GAS auto-refresh

##### Removed
- Removed legacy `postMessage`-based GAS reload mechanism

#### `gas-project-creator.html` — v01.60w

##### Changed
- Updated splash system from single green splash to dual blue (Website Ready) + green (Code Ready) splashes
- Added GAS version pill with countdown dot and GAS changelog popup
- Replaced inline splash/sound code with reusable `showUpdateSplash()` function
- Added Code Ready sound caching and `gs.version.txt` polling for GAS auto-refresh

## [v04.04r] — 2026-03-07 12:09:07 AM EST

### Changed

- Added cross-reference pointer in `gas-scripts.md` linking to the template source propagation rule in `html-pages.md` (Pre-Commit #20) — ensures the propagation rule is visible when working on GAS files even if `html-pages.md` isn't loaded

## [v04.03r] — 2026-03-07 12:02:36 AM EST

### Added

- Template source propagation rule (Pre-Commit #20) — when either template source (`HtmlAndGasTemplateAutoUpdate.html` or `gas-project-creator-code.js.txt`) is modified, changes are now automatically propagated to all existing pages and GAS scripts, with conflict detection to alert the developer before applying changes that would break page-specific customizations

## [v04.02r] — 2026-03-06 11:40:01 PM EST

### Changed

- Consolidated to a single universal HTML template — deleted `HtmlTemplateAutoUpdate.html` (HTML-only) and its version file; `HtmlAndGasTemplateAutoUpdate.html` now serves both HTML-only and GAS-enabled pages (GAS features auto-activate when `gs.version.txt` exists, stay hidden otherwise)
- Updated template references across 9 files: CLAUDE.md Pre-Commit #4, CONTRIBUTING.md, README.md tree, STATUS.md, ARCHITECTURE.md diagram, `init-repo.sh` file list, `html-pages.md` rules, `new-page` skill, and IMPROVEMENTS.md

### Removed

- Deleted `live-site-templates/HtmlTemplateAutoUpdate.html` — redundant with the universal template
- Deleted `live-site-templates/HtmlTemplateAutoUpdatehtml.version.txt` — associated version file no longer needed

## [v04.01r] — 2026-03-06 11:26:53 PM EST

### Fixed

- HTML+GAS template (`HtmlAndGasTemplateAutoUpdate.html`): GAS version pill and GAS polling now only activate when `gs.version.txt` exists — previously the pill showed unconditionally and polling started even on pure HTML pages with no GAS project, causing error dots and failed fetches. The template now works seamlessly as a pure HTML page when no GAS project is configured

## [v04.00r] — 2026-03-06 11:02:58 PM EST

### Changed

- Clarified changelog security rule: repo CHANGELOG (`repository-information/CHANGELOG.md`) is exempt from HIPAA/PHI and attack surface restrictions — it is never deployed publicly and should use technically precise descriptions for developer context and audit trails; security restrictions apply only to publicly deployed page and GAS changelogs in `live-site-pages/`

## [v03.99r] — 2026-03-06 10:55:54 PM EST

### Added

- Implemented per-page changelog popup toggle (`SHOW_CHANGELOG` variable) — version indicator pill remains visible but clicking it is gated when `SHOW_CHANGELOG = false`; also gates GAS changelog pill on GAS-enabled pages; cursor changes to `default` when disabled
- Updated changelogs rules to reflect implemented toggle (removed "planned for future session" note)

#### `index.html` — v01.21w

##### Added

- Added `SHOW_CHANGELOG` config variable for per-page changelog popup toggle

#### `testation7.html` — v01.03w

##### Added

- Added `SHOW_CHANGELOG` config variable for per-page changelog popup toggle

#### `testation8.html` — v01.02w

##### Added

- Added `SHOW_CHANGELOG` config variable for per-page changelog popup toggle

#### `gas-project-creator.html` — v01.59w

##### Added

- Added `SHOW_CHANGELOG` config variable for per-page changelog popup toggle

## [v03.98r] — 2026-03-06 10:44:03 PM EST

### Added

- Added changelog security rule covering HIPAA/PHI omission and attack surface obfuscation — mandatory for all changelogs (public and repo-level), with detailed examples of unsafe vs. safe entry writing
- Added per-page changelog popup toggle design (`SHOW_CHANGELOG` variable) — planned for future implementation, documented in changelogs rules file

## [v03.97r] — 2026-03-06 10:11:52 PM EST

### Added

- Documented `.nojekyll` requirement in `.claude/rules/html-pages.md` — explains why the file exists, why it must never be deleted, and the bug it prevents (Jekyll processing `.md` changelog files into HTML breaks the regex-based parsers)

## [v03.96r] — 2026-03-06 10:06:18 PM EST

### Fixed

- Fixed changelog popup showing "No changelog entries yet." on all pages — root cause was GitHub Pages Jekyll processing converting `.md` changelog files into rendered HTML instead of serving raw markdown; added `.nojekyll` file to disable Jekyll

## [v03.95r] — 2026-03-06 09:43:17 PM EST

### Changed

- Bumped testation8.html version from v01.00w to v01.01w
- Bumped testation8.gs VERSION from 01.01g to 01.02g
- Added sample text to testation8 HTML and GAS changelogs

#### `testation8.html` — v01.01w

##### Added

- Fresh page styling with improved layout
- Sample content section for testing purposes

##### Changed

- Updated build version to v01.01w

#### `testation8.gs` — 01.02g

##### Added

- Enhanced app data display with richer formatting
- Improved quota monitoring dashboard layout

##### Changed

- Version bumped to 01.02g for sample content update

## [v03.94r] — 2026-03-06 09:35:13 PM EST

### Changed

- Bumped testation8.gs VERSION from 01.00g to 01.01g

#### `testation8.gs` — 01.01g

##### Changed

- Version bump to 01.01g

## [v03.93r] — 2026-03-06 09:31:21 PM EST

### Added

- Set up new GAS project Testation8 with full template scaffolding (10 files, workflow deploy step, all table registrations)

### Fixed

- Fixed `setup-gas-project.sh` Phase 12 verification crash — removed undefined `HTML_CL_DEPLOY` and `GAS_CL_DEPLOY` variables from expected files array

## [v03.92r] — 2026-03-06 08:52:54 PM EST

### Changed

- Applied "remove awaiting GAS, reload immediately" fix to `HtmlAndGasTemplateAutoUpdate.html` template
- Bumped testation7.gs VERSION from 01.02g to 01.03g

#### `testation7.gs` — 01.03g

##### Changed

- Version bump to 01.03g

## [v03.91r] — 2026-03-06 08:47:22 PM EST

### Changed

- Removed "Awaiting GAS update" polling flow — GAS version change now triggers immediate page reload
- Removed `waitForGasDeploy` function and related iframe version-check handshake

#### `testation7.html` — v01.02w

##### Changed

- GAS version change detection now reloads the page immediately instead of entering an "awaiting" state
- Removed unused `waitForGasDeploy` function and associated variables (`targetGasVersion`, `gasCheckInterval`, `GAS_CHECK_INTERVAL`, `GAS_DEPLOY_TIMEOUT`)

## [v03.90r] — 2026-03-06 08:34:42 PM EST

### Changed

- Bumped testation7.gs VERSION from 01.01g to 01.02g

#### `testation7.gs` — 01.02g

##### Changed

- Version bump to 01.02g

## [v03.89r] — 2026-03-06 08:26:23 PM EST

### Changed

- Renamed `LICENSE` to `LICENSE.md` and formatted as markdown with heading, bold copyright, and disclaimer section
- Updated all references to LICENSE in README.md tree, CLAUDE.md Template Variables, repo-docs.md path table, and init-repo.sh

## [v03.88r] — 2026-03-06 08:15:21 PM EST

### Changed

- Consolidated changelog files — eliminated duplicate `.md` source + `.txt` deployment copy pattern. Changelogs now live directly in `live-site-pages/html-changelogs/` and `live-site-pages/gs-changelogs/` as `.md` files (single source of truth + deployed). Removed `repository-information/changelogs/` directory entirely
- Updated JavaScript fetch code in all HTML pages and templates to use `.md` extension instead of `.txt`
- Updated `setup-gas-project.sh` to create changelog files directly in `live-site-pages/` subdirectories (no separate deployment copy step)
- Updated CLAUDE.md Pre-Commit #17 — removed deployment copy sync rule (no longer needed)
- Moved all changelog archive files from `repository-information/changelogs/` to their respective `live-site-pages/` subdirectories

#### `index.html` — v01.20w

##### Changed
- Changelog popup now fetches `.md` files instead of `.txt`

#### `gas-project-creator.html` — v01.58w

##### Changed
- Changelog popup now fetches `.md` files instead of `.txt`

#### `testation7.html` — v01.01w

##### Changed
- Changelog popup now fetches `.md` files instead of `.txt`

## [v03.87r] — 2026-03-06 06:41:54 PM EST

### Removed

- Deleted Test project environment — `test.html`, `googleAppsScripts/Test/` (test.gs, test.config.json), all associated version/changelog files (testhtml.version.txt, testgs.version.txt, 4 changelog MDs, 2 deployment copies)

## [v03.86r] — 2026-03-06 06:22:15 PM EST

### Changed

- Renamed `GasExample.html` → `HtmlAndGasTemplateAutoUpdate.html` (and version file) for clearer naming — this is the GAS-enabled HTML page template used by `setup-gas-project.sh`

## [v03.85r] — 2026-03-06 03:00:24 PM EST

### Changed

- Consolidated GAS template to a single source of truth: `live-site-pages/gas-code/gas-project-creator-code.js.txt` — eliminated `HtmlTemplateAutoUpdate.gs` and its duplicate sync rule
- Updated `setup-gas-project.sh` to use the `.js.txt` file as the GAS template source instead of `HtmlTemplateAutoUpdate.gs`
- Updated ARCHITECTURE.md diagram to use `GASTPL_CODE` as the template source node for new GAS projects

### Removed

- Deleted `googleAppsScripts/HtmlTemplateAutoUpdate/` directory (`.gs` + `.config.json`) — redundant with `gas-project-creator-code.js.txt`
- Deleted HtmlTemplateAutoUpdate version files (`HtmlTemplateAutoUpdategs.version.txt`) and all associated changelogs (4 changelog files + 1 deployed copy)
- Removed mandatory sync rule from `gas-scripts.md` — no longer needed with single source

## [v03.84r] — 2026-03-06 02:33:04 PM EST

### Changed

- Renamed `live-site-pages/gas-project-creator/` subfolder to `live-site-pages/gas-code/` — generic name for future GAS code `.js.txt` files from multiple projects
- Updated all fetch paths and documentation references to use the new `gas-code/` path

#### `gas-project-creator.html` — v01.57w

##### Changed

- Updated Copy Code.gs fetch path to new `gas-code/` subfolder

## [v03.83r] — 2026-03-06 02:28:14 PM EST

### Changed

- Moved `gas-project-creator-code.js.txt` into `live-site-pages/gas-project-creator/` subfolder for consistent directory structure
- Updated all references to the new path across HTML pages, rules, README tree, and ARCHITECTURE.md

#### `gas-project-creator.html` — v01.56w

##### Changed

- Updated Copy Code.gs fetch path to new subfolder location

## [v03.82r] — 2026-03-06 02:22:45 PM EST

### Removed

- Deleted 8 project environments: GasExample, Soccer Ball, TestLinkGas1App, Testation2–6
  - GAS project directories (`googleAppsScripts/`), HTML pages, version files, changelog deployment copies, source changelogs, and all associated archives
- Removed Testation3 and Testation6 webhook deploy steps from auto-merge workflow

### Changed

- Updated `setup-gas-project.sh` to use HtmlTemplateAutoUpdate as GAS template source (previously used deleted GasExample)
- Cleaned up GAS Projects table, STATUS.md, ARCHITECTURE.md, and README tree

## [v03.81r] — 2026-03-06 02:13:47 PM EST

### Removed

- Deleted `RND_GAS/` folder — R&D GAS scripts no longer needed
- Deleted `RND_GAS_AND_WEBSITE/` folder — R&D combined GAS/website files no longer needed
- Deleted `originalworkinggas/` folder — original working GAS code no longer needed
- Deleted `RND_WEBSITE/` folder — R&D website files no longer needed

## [v03.80r] — 2026-03-06 02:04:49 PM EST

### Changed

- Renamed GasTemplate project to GasExample across the entire repo — GAS script, config, HTML page, all version files, changelogs, and documentation
- Added postMessage listener to HtmlTemplateAutoUpdate.gs for parent page version check requests (synced to gas-project-creator-code.js.txt)
- Fixed setup-gas-project.sh to replace config.json references when creating new projects (previously left stale `gas-template.config.json` comments)
- Fixed stale `gas-template.config.json` comments in all testation GAS scripts (2–7) to reference their own config files
- Removed duplicate PascalCase changelog files (GasTemplatehtml.changelog.md and archive) — consolidated to kebab-case naming

#### `gas-example.gs` — 01.04g

##### Changed

- Renamed from gas-template.gs to gas-example.gs with all internal references updated

#### `gas-example.html` — v01.03w

##### Changed

- Renamed from gas-template.html with title updated to "GAS Example"

#### `HtmlTemplateAutoUpdate.gs` — 01.02g

##### Added

- Responds to version check requests from the parent page for smoother auto-updates

## [v03.79r] — 2026-03-06 01:33:55 PM EST

### Added

- Documented confirmed GAS webhook auto-deploy behavior in `.claude/rules/gas-scripts.md` — Testation7 successfully updated from 01.00g to 01.01g via workflow webhook without the page being open

## [v03.78r] — 2026-03-06 01:28:05 PM EST

### Changed

- Bumped Testation7 GAS version to 01.01g to test workflow webhook auto-deploy

#### `testation7.gs` — 01.01g

##### Changed

- Bumped GAS version to 01.01g

## [v03.77r] — 2026-03-06 01:23:28 PM EST

### Added

- Set up Testation7 GAS project — created 11 files (HTML page, GAS script, config, version files, changelogs), registered in GAS Projects table, STATUS.md, README tree, and auto-merge workflow

## [v03.76r] — 2026-03-06 01:13:59 PM EST

### Changed

- Cleaned up header comments in `testation6.gs`, `gas-template.gs`, and `gas-project-creator-code.js.txt` to reflect webhook-only update flow (removed "MANUAL: Pull Latest" references)

#### `testation6.gs` — 01.09g

##### Changed

- Updated header comments to reflect webhook-only update flow

#### `gas-template.gs` — 01.00g (no change)

##### Changed

- Updated header comments to reflect webhook-only update flow

#### `gas-project-creator-code.js.txt` — (no change)

##### Changed

- Updated header comments to reflect webhook-only update flow

## [v03.75r] — 2026-03-06 01:09:40 PM EST

### Removed

#### `testation6.gs` — 01.08g

##### Removed

- Removed client-side auto-pull on page load — GAS updates are now handled exclusively by the workflow webhook (`doPost(action=deploy)`), eliminating redundant `pullAndDeployFromGitHub()` calls on every page refresh

#### `gas-template.gs` — 01.00g (no change)

##### Removed

- Removed client-side auto-pull on page load from template — new GAS projects will rely on the workflow webhook for updates

#### `gas-project-creator-code.js.txt` — (no change)

##### Removed

- Removed client-side auto-pull code from the GAS code template used by the project creator

## [v03.74r] — 2026-03-06 01:01:24 PM EST

### Added

- Automated workflow deploy step in `setup-gas-project.sh` — new GAS projects now get a webhook deploy step in `auto-merge-claude.yml` automatically, enabling GAS self-update on push without needing the page open

### Changed

- Updated CLAUDE.md Setup GAS Project Command to document the new workflow deploy step

## [v03.73r] — 2026-03-06 12:56:23 PM EST

### Added

- Workflow deploy step for Testation6 GAS — pushes to `testation6.gs` now auto-trigger `doPost(action=deploy)` via the auto-merge workflow, enabling GAS self-update without the page being open

## [v03.72r] — 2026-03-06 12:42:40 PM EST

### Changed

#### `testation6.gs` — 01.07g

##### Changed

- Bumped GAS version to 01.07g for polling test

## [v03.71r] — 2026-03-06 12:28:33 PM EST

### Changed

#### `testation6.gs` — 01.06g

##### Changed

- Bumped GAS version to 01.06g

## [v03.70r] — 2026-03-06 12:24:38 PM EST

### Changed

#### `testation3.html` — v01.18w

##### Changed

- Increased GAS deploy verification timeout from 60s to 3 minutes for more reliable auto-updates
- Added debug logging for GAS version polling

#### `testation4.html` — v01.03w

##### Changed

- Increased GAS deploy verification timeout from 60s to 3 minutes for more reliable auto-updates
- Added debug logging for GAS version polling

#### `testation5.html` — v01.03w

##### Changed

- Increased GAS deploy verification timeout from 60s to 3 minutes for more reliable auto-updates
- Added debug logging for GAS version polling

#### `testation6.html` — v01.03w

##### Changed

- Increased GAS deploy verification timeout from 60s to 3 minutes for more reliable auto-updates
- Added debug logging for GAS version polling

#### `GasTemplate.html` — v01.00w (no change)

##### Changed

- Increased GAS deploy verification timeout from 60s to 3 minutes for more reliable auto-updates
- Added debug logging for GAS version polling

## [v03.69r] — 2026-03-06 12:12:47 PM EST

### Changed

#### `testation6.gs` — 01.05g

##### Changed

- Bumped GAS version to 01.05g

## [v03.68r] — 2026-03-06 12:03:29 PM EST

### Changed

#### `testation6.gs` — 01.04g

##### Changed

- Bumped GAS version to 01.04g

## [v03.67r] — 2026-03-06 11:52:48 AM EST

### Added

- Two-phase GAS version polling — when `gs.version.txt` reports a new version, the HTML page now verifies the GAS iframe is actually running the new code via postMessage before reloading, preventing premature reloads that show stale GAS behavior
- postMessage listener in all 7 active GAS scripts (testation2–6, gas-template, test_link_gas_1_app) — responds to `gas-version-check` requests from the parent page with the running GAS version
- `waitForGasDeploy()` function in GAS-enabled HTML pages — polls the GAS iframe every 5 seconds via postMessage, with 60-second safety timeout fallback

#### `testation3.html` — v01.17w

##### Added

- Two-phase GAS version detection with postMessage-based verification before reload

#### `testation4.html` — v01.02w

##### Added

- Two-phase GAS version detection with postMessage-based verification before reload

#### `testation5.html` — v01.02w

##### Added

- Two-phase GAS version detection with postMessage-based verification before reload

#### `testation6.html` — v01.02w

##### Added

- Two-phase GAS version detection with postMessage-based verification before reload

#### `testation3.gs` — 01.36g

##### Added

- postMessage listener for version check requests from parent page

#### `testation4.gs` — 01.01g

##### Added

- postMessage listener for version check requests from parent page

#### `testation5.gs` — 01.01g

##### Added

- postMessage listener for version check requests from parent page

#### `testation6.gs` — 01.03g

##### Added

- postMessage listener for version check requests from parent page

#### `gas-template.gs` — 01.03g

##### Added

- postMessage listener for version check requests from parent page

#### `test_link_gas_1_app.gs` — 01.04g

##### Added

- postMessage listener for version check requests from parent page

#### `testation2.gs` — 01.02g

##### Added

- postMessage listener for version check requests from parent page

## [v03.66r] — 2026-03-06 11:13:56 AM EST

### Changed

#### `testation6.gs` — 01.02g

##### Changed

- Bumped GAS version to 01.02g

## [v03.65r] — 2026-03-06 11:10:33 AM EST

### Removed

- Removed 41 backward-compatibility stub files from flat `live-site-pages/` — stubs served their purpose (nudging cached pages to reload with new subfolder-aware JavaScript) and are no longer needed

## [v03.64r] — 2026-03-06 11:06:50 AM EST

### Fixed

- Added backward-compatibility stub files at old flat `live-site-pages/` locations for version and changelog files — pages cached before the subfolder reorganization (v03.63r) were polling 404 URLs, preventing auto-refresh and GAS version detection; stubs provide a one-time nudge that triggers a page reload, after which new JavaScript uses the correct subfolder paths

## [v03.63r] — 2026-03-06 10:59:11 AM EST

### Changed

- Reorganized version and changelog deployment files in `live-site-pages/` into 4 dedicated subfolders: `html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/` — replaces flat file layout for cleaner directory structure
- Updated JavaScript polling logic in all 11 HTML pages and both templates to construct URLs with subfolder paths for version and changelog file fetching
- Updated `setup-gas-project.sh` path constants and README tree insertion logic to target new subfolder locations
- Updated all rules files, skills files, and CLAUDE.md references to reflect new file locations

#### `index.html` — v01.19w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `html-changelogs/`)

#### `test.html` — v01.20w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `html-changelogs/`)

#### `soccer-ball.html` — v01.03w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `html-changelogs/`)

#### `gas-project-creator.html` — v01.55w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `html-changelogs/`)

#### `gas-template.html` — v01.02w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/`)

#### `test_link_gas_1_app.html` — v01.02w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/`)

#### `testation2.html` — v01.01w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/`)

#### `testation3.html` — v01.16w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/`)

#### `testation4.html` — v01.01w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/`)

#### `testation5.html` — v01.01w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/`)

#### `testation6.html` — v01.01w

##### Changed

- Updated version and changelog polling URLs to use subfolder paths (`html-versions/`, `gs-versions/`, `html-changelogs/`, `gs-changelogs/`)

## [v03.62r] — 2026-03-06 10:29:44 AM EST

### Changed

- Consolidated GAS version files — eliminated duplicate `gs.version.txt` from all `googleAppsScripts/` directories; `live-site-pages/` is now the single location (polled by HTML layer for GAS version display)
- Updated `setup-gas-project.sh` to create GAS version file directly in `live-site-pages/` instead of `googleAppsScripts/` with a separate deployment copy
- Updated Pre-Commit #1, rules files, and skills files to reference `live-site-pages/` as the single `gs.version.txt` location

### Removed

- Removed 10 redundant `gs.version.txt` files from `googleAppsScripts/` directories (Index, Test, GasTemplate, TestLinkGas1App, Testation2–6, HtmlTemplateAutoUpdate) — these were unused copies; the `.gs` file's `VERSION` variable is the source of truth and `live-site-pages/` is the deployment location

## [v03.61r] — 2026-03-06 09:57:09 AM EST

### Changed

#### `testation6.gs` — 01.01g

##### Changed

- Bumped GAS version to 01.01g

## [v03.60r] — 2026-03-06 09:54:15 AM EST

### Added

- Set up Testation6 GAS project (`Testing test 6`) with spreadsheet integration, deployment ID, and sound file — 12 files created including GAS deployment copies

## [v03.59r] — 2026-03-06 09:47:59 AM EST

### Fixed

- Added missing GAS deployment copies (`gs.version.txt` and `gs.changelog.txt`) to `live-site-pages/` for all GAS projects — the HTML page's GAS version pill polls these files from the deployed site, but they were only being created in `googleAppsScripts/` (not deployed)
- Updated `setup-gas-project.sh` to create GAS deployment copies (`gs.version.txt` and `gs.changelog.txt` in `live-site-pages/`) alongside the existing HTML changelog deployment copy

## [v03.58r] — 2026-03-06 09:37:30 AM EST

### Added

- Set up Testation5 GAS project (`Test title 5`) with spreadsheet integration, deployment ID, and sound file — 10 files created, registered in GAS Projects table, STATUS.md, ARCHITECTURE.md, and README.md

## [v03.57r] — 2026-03-06 09:21:13 AM EST

### Fixed

- Removed incorrect backslash escaping from template literals in `gas-project-creator-code.js.txt` — `\${...}` and `` \` `` were being copied as literal text instead of JavaScript template expressions, causing GAS `doGet()` output to render raw `${SPREADSHEET_ID...}` text instead of evaluating conditionals

## [v03.56r] — 2026-03-06 09:10:42 AM EST

### Added

- New GAS project: Testation4 — "This is my title 4" with full GAS integration (10 files created, registered in all tables)

## [v03.55r] — 2026-03-06 08:52:56 AM EST

### Changed

- Updated GAS template (`gas-template.gs`) and HTML template (`GasTemplate.html`) to use testation3 codebase as the new baseline — includes dual splash screens, GAS changelog popup, anti-sync countdown logic, audio system, wake lock, and flex layout
- Updated `gas-project-creator-code.js.txt` with matching template code and proper placeholders for the "Copy Code.gs for GAS" button

## [v03.54r] — 2026-03-06 08:23:52 AM EST

### Changed

#### `testation3.gs` — 01.35g

##### Removed

- Decorative tree graphic removed from the bottom of the web app

#### `testation3.html` — v01.15w

##### Fixed

- Version countdown timers between GAS and page polls no longer occasionally sync up — anti-drift logic re-establishes the 5-second gap if they converge

## [v03.53r] — 2026-03-06 01:14:31 AM EST

### Changed

#### `testation3.html` — v01.14w

##### Changed

- Increased gap between GAS and HTML version badges to prevent overlap during update status text

## [v03.52r] — 2026-03-06 01:10:49 AM EST

### Changed

#### `testation3.html` — v01.13w

##### Changed

- Adjusted spacing between GAS and HTML version badges

## [v03.51r] — 2026-03-06 01:06:14 AM EST

### Changed

#### `testation3.html` — v01.12w

##### Changed

- Moved the GAS version badge closer to the HTML version badge

## [v03.50r] — 2026-03-06 01:02:00 AM EST

### Changed

#### `testation3.gs` — 01.34g

##### Changed

- Made Live Quotas and Estimates labels static in the UI so they display immediately without waiting for data to load

## [v03.49r] — 2026-03-06 12:55:49 AM EST

### Fixed
- Version count now strips trailing "versions" text from cached values client-side

#### `testation3.gs` — 01.33g

##### Fixed
- Version display no longer shows "versions" suffix (handles old cached values)

## [v03.48r] — 2026-03-06 12:52:21 AM EST

### Changed
- Reload button now renders on a single line (added white-space:nowrap)
- Version count display now shows "Versions: X/200" with a label, removing trailing "versions" text

#### `testation3.gs` — 01.32g

##### Changed
- Reload button forced to single line
- Version display reformatted to "Versions: X/200"

## [v03.47r] — 2026-03-06 12:47:04 AM EST

### Changed
- Reorganized GAS header: Live_Sheet name, version count, and B1 content now displayed inline in header area
- Added "B1 Content:" label to the B1 value display
- Reload button rendered as single line (removed extra margin)

#### `testation3.gs` — 01.31g

##### Changed
- Sheet name and B1 content moved into header next to title and controls
- Added "B1 Content:" label for clarity
- Reload button displays as single line

## [v03.46r] — 2026-03-06 12:41:24 AM EST

### Fixed
- Restored full-width spreadsheet layout — moved sheet container out of flex row so it no longer gets squashed

#### `testation3.gs` — 01.30g

##### Fixed
- Spreadsheet restored to full width below the title and controls area

## [v03.45r] — 2026-03-06 12:36:18 AM EST

### Changed
- Live quotas and estimates repositioned from fixed top-right corner to inline next to the title and header content

#### `testation3.gs` — 01.29g

##### Changed
- Live quotas and estimates moved from fixed corner to inline layout next to header

## [v03.44r] — 2026-03-06 12:24:44 AM EST

### Changed
- Live quotas and estimates pinned to top-right corner of the GAS app

#### `testation3.gs` — 01.28g

##### Changed
- Live quotas and estimates moved to fixed top-right corner position

## [v03.43r] — 2026-03-06 12:19:57 AM EST

### Changed
- GAS app layout refined: reload button re-centered, live quotas/estimates positioned to the right of the main content area

#### `testation3.gs` — 01.27g

##### Changed
- Reload button re-centered with live quotas and estimates displayed to its right
- Version count and spreadsheet remain centered below the reload button

## [v03.42r] — 2026-03-06 12:14:16 AM EST

### Changed
- GAS pill blinking indicator lightened to brighter blue
- GAS app UI rearranged: sound/beep/vibrate buttons moved between spreadsheet and tree, live quotas moved next to reload button

#### `testation3.html` — v01.11w

##### Changed
- GAS version checking indicator lightened to brighter blue

#### `testation3.gs` — 01.26g

##### Changed
- Sound test buttons moved below the spreadsheet
- Live quotas and estimates moved next to the reload button

## [v03.41r] — 2026-03-06 12:08:15 AM EST

### Changed
- GAS version pill blinking indicator changed from orange to blue

#### `testation3.html` — v01.10w

##### Changed
- GAS version checking indicator now blinks blue instead of orange

## [v03.40r] — 2026-03-06 12:03:36 AM EST

### Changed
- GAS version display moved from large centered orange to small fixed bottom-left blue

#### `testation3.gs` — 01.25g

##### Changed
- Version moved to bottom-left corner as a small blue label instead of large centered orange text
