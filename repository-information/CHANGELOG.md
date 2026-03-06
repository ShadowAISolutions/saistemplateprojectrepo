# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 93/100`

## [Unreleased]

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

## [v03.39r] — 2026-03-05 11:57:12 PM EST

### Changed
- GAS version and title now render instantly on page load instead of loading asynchronously

#### `testation3.gs` — 01.24g

##### Changed
- Version and title display immediately on load — no more "..." placeholder while waiting for server response

## [v03.38r] — 2026-03-05 11:50:00 PM EST

### Fixed
- GAS version pill now shows the actual version immediately on page load instead of "GAS ..."

#### `testation3.html` — v01.09w

##### Fixed
- GAS version pill now fetches and displays the real version on load instead of showing placeholder dots until the first polling cycle

## [v03.37r] — 2026-03-05 11:45:52 PM EST

### Changed
- GAS version polling interval changed from 15s to 10s with 15s initial delay (5s offset from HTML polling)
- GAS version pill repositioned from bottom-left to bottom-right, just left of the HTML version pill

#### `testation3.html` — v01.08w

##### Changed
- GAS version check now polls every 10 seconds (was 15), starting after a 15-second initial delay to stay 5 seconds offset from the HTML version check
- GAS version pill moved from the far left to just left of the website version pill

## [v03.36r] — 2026-03-05 11:37:56 PM EST

### Removed
- Blue splash overlay removed from GAS iframe (no more loading screen on every page load)

#### `testation3.gs` — 01.23g

##### Removed
- Blue splash screen overlay that appeared on every page load inside the GAS iframe

## [v03.35r] — 2026-03-05 11:30:39 PM EST

### Changed
- Update-triggered reloads now differentiate between HTML and GAS updates with distinct splash screens and sounds

#### `testation3.html` — v01.07w

##### Added
- Blue "Website Ready" splash screen with website sound for HTML version updates
- Green "Code Ready" splash screen with code sound for GAS version updates
- Pre-caching of Code Ready sound for instant playback

##### Changed
- GAS update reload now shows its own green splash and plays "Code Ready" sound instead of reusing the website update behavior

## [v03.34r] — 2026-03-05 11:22:48 PM EST

### Changed
- Version bumped to 01.22g

#### `testation3.gs` — 01.22g

##### Changed
- Version bumped to 01.22g

## [v03.33r] — 2026-03-05 11:17:54 PM EST

### Added
- GAS version pill with countdown dot and changelog popup on the embedding page (moved from GAS iframe layer)

### Changed
- Large orange version number display restored in GAS iframe
- GAS changelog now fetched directly from GitHub Pages by the embedding page instead of via server-side GAS function

### Removed
- GAS pill UI, changelog overlay, and `getGasChangelog()` server function from GAS script (now handled by the embedding page)

#### `testation3.gs` — 01.21g

##### Added
- Large orange version number display restored at the top of the app

##### Removed
- GAS version pill with countdown dot and changelog popup (moved to embedding page)
- Server-side `getGasChangelog()` function (no longer needed)

#### `testation3.html` — v01.06w

##### Added
- GAS version pill (bottom-left) with countdown dot showing next check timer
- GAS changelog popup — click the GAS pill to view the script's update history

## [v03.32r] — 2026-03-05 11:06:42 PM EST

### Changed
- GAS update detection now polls `testation3gs.version.txt` from GitHub Pages instead of using GAS CacheService — mirrors the HTML auto-refresh pattern
- Removed CacheService-based version polling and postMessage reload signaling from GAS client

### Added
- GAS version deployment copy (`testation3gs.version.txt`) deployed to GitHub Pages for client-side polling

#### `testation3.gs` — 01.20g

##### Changed
- Update detection now handled by the embedding page polling a version file instead of internal cache polling

##### Removed
- CacheService-based version caching and polling
- PostMessage reload signaling to embedding page

#### `testation3.html` — v01.05w

##### Added
- GAS version polling — fetches `testation3gs.version.txt` every 15 seconds and reloads on version change

##### Removed
- PostMessage-based GAS reload listener (replaced by direct version.txt polling)

## [v03.31r] — 2026-03-05 10:52:53 PM EST

### Changed
- Bumped Testation3 GAS version

#### `testation3.gs` — 01.19g

##### Changed
- Version bump (no functional changes)

## [v03.30r] — 2026-03-05 10:47:58 PM EST

### Fixed
- GAS auto-refresh not triggering page reload after server-side deploy

#### `testation3.gs` — 01.18g

##### Fixed
- Auto-refresh now reloads the page immediately when a new version is detected instead of re-deploying (which found "Already up to date" and skipped the reload)

## [v03.29r] — 2026-03-05 09:30:02 PM EST

### Added
- Decorative tree SVG below the spreadsheet in Testation3 GAS app

#### `testation3.gs` — 01.17g

##### Added
- Tree decoration displayed below the spreadsheet section

## [v03.28r] — 2026-03-05 09:23:06 PM EST

### Changed
- Updated time estimation heuristics with parallel batching discount — parallel tool calls count as ~15s total instead of N × 10s, producing more accurate estimates

## [v03.27r] — 2026-03-05 09:17:29 PM EST

### Fixed
- GAS auto-reload now deploys new code before sending reload signal to embedding page — matches the proven RND pattern

#### `testation3.gs` — 01.16g

##### Fixed
- App now pulls and deploys updates before triggering page reload, ensuring the new version is live when the page refreshes

## [v03.26r] — 2026-03-05 08:24:20 PM EST

### Added
- Test Sound (Drive), Test Beep (Old), and Test Vibrate buttons to Testation3 GAS app

#### `testation3.gs` — 01.15g

##### Added
- Test Sound (Drive) button to play notification sound from Google Drive
- Test Beep (Old) button to play synthesized AudioContext beep
- Test Vibrate button to trigger device vibration

## [v03.25r] — 2026-03-05 05:37:15 PM EST

### Removed
- Giant orange version number display from Testation3 GAS app (version already shown in the GAS pill)

#### `testation3.gs` — 01.14g

##### Removed
- Large orange version display at the top of the app

## [v03.24r] — 2026-03-05 05:31:24 PM EST

### Fixed
- Actually applied testation3.gs VERSION bump to 01.13g (missed in v03.23r — files were staged but never edited)
- Updated testation3gs.version.txt to 01.13g
- Updated STATUS.md GAS version for Testation3

#### `testation3.gs` — 01.13g

##### Fixed
- Version bump now actually applied (was missed in previous push)

## [v03.23r] — 2026-03-05 05:18:50 PM EST

### Changed
- Bumped Testation3 GAS version to 01.13g

#### `testation3.gs` — 01.13g

##### Changed
- Version bumped to 01.13g

## [v03.22r] — 2026-03-05 05:16:05 PM EST

### Removed
- "Pull Latest from GitHub" manual button from Testation3 GAS app (auto-update handles this now)
- Red tree emoji art from Testation3 GAS app

#### `testation3.gs` — 01.12g

##### Removed
- Manual "Pull Latest from GitHub" button (no longer needed — auto-update on page load handles updates)
- Decorative red tree art

## [v03.21r] — 2026-03-05 05:12:23 PM EST

### Changed
- Bumped Testation3 GAS version to 01.11g

#### `testation3.gs` — 01.11g

##### Changed
- Version bumped to 01.11g

## [v03.20r] — 2026-03-05 05:09:46 PM EST

### Changed
- Bumped Testation3 page version to v01.04w

#### `testation3.html` — v01.04w

##### Changed
- Version bumped to v01.04w

## [v03.19r] — 2026-03-05 05:03:00 PM EST

### Added
- GitHub Actions workflow step to auto-deploy Testation3 GAS after merge to main
- Page-load auto-check in Testation3 GAS — silently calls pullAndDeployFromGitHub on every page load as a fallback when the webhook misses

#### `testation3.gs` — 01.10g

##### Added
- Automatic update check on page load — app now self-updates when visited, even if the deploy webhook was missed

## [v03.18r] — 2026-03-05 04:49:19 PM EST

### Changed
- Bumped Testation3 GAS version to 01.09g

#### `testation3.gs` — 01.09g

##### Changed
- Version bumped to 01.09g

## [v03.17r] — 2026-03-05 04:08:59 PM EST

### Added
- Re-added "Pull Latest from GitHub" button to the Testation3 GAS web app for manual update triggering

#### `testation3.gs` — 01.08g

##### Added
- "Pull Latest from GitHub" button for manually triggering code updates from GitHub

## [v03.16r] — 2026-03-05 04:01:02 PM EST

### Changed
- GAS version indicator moved from the HTML embedding layer to the GAS iframe layer — the pill now renders inside the GAS iframe where it naturally belongs
- GAS changelog popup now uses server-side `google.script.run` to fetch changelog data instead of cross-origin browser fetch

### Removed
- GAS indicator CSS and JavaScript from the HTML embedding page (now handled entirely within the GAS layer)

#### `testation3.html` — v01.03w

##### Removed
- GAS version indicator CSS and JavaScript — moved to the GAS layer where it belongs

#### `testation3.gs` — 01.07g

##### Added
- GAS version pill with countdown timer rendered directly in the GAS iframe
- GAS changelog popup accessible by clicking the version pill
- Server-side changelog fetching via `getGasChangelog()` using GitHub raw content API

## [v03.15r] — 2026-03-05 03:47:47 PM EST

### Fixed
- GAS version indicator now appears immediately on page load instead of staying hidden
- GAS version polling now uses self-reporting from the iframe instead of unreliable cross-origin parent-to-iframe messaging

#### `testation3.html` — v01.02w

##### Fixed
- GAS version indicator now visible immediately (shows "GAS ..." while waiting for first report)
- Removed unreliable parent-to-iframe version polling

#### `testation3.gs` — 01.06g

##### Changed
- Version is now reported to the embedding page every 15 seconds automatically

## [v03.14r] — 2026-03-05 03:34:35 PM EST

### Added
- GAS version indicator pill (bottom-left) on Testation3 embedding page with countdown timer and GAS changelog popup
- GAS iframe now reports its version to the embedding page via `postMessage` on load and on request
- GAS changelog deployment copy (`testation3gs.changelog.txt`) for live site access

#### `testation3.html` — v01.01w

##### Added
- GAS version indicator at bottom-left with countdown to next version check
- GAS changelog popup (click the GAS version pill to view)

#### `testation3.gs` — 01.05g

##### Added
- Reports version to embedding page on load for the GAS version indicator
- Responds to version-request messages from embedding page

## [v03.13r] — 2026-03-05 03:26:01 PM EST

### Removed
- "Pull Latest from GitHub" button — updates are now fully automatic via the workflow deploy pipeline

#### `testation3.gs` — 01.04g

##### Removed
- Manual "Pull Latest from GitHub" button — updates happen automatically

## [v03.12r] — 2026-03-05 03:21:18 PM EST

### Fixed
- Multi-tab auto-refresh race condition — `pollPushedVersionFromCache` now sends `postMessage` reload directly instead of calling `checkForUpdates()`, preventing the second tab from updating its DOM text without actually reloading

#### `testation3.gs` — 01.03g

##### Fixed
- All open tabs now reliably auto-refresh when updates are deployed

## [v03.11r] — 2026-03-05 03:14:41 PM EST

### Fixed
- Auto-refresh not triggering when workflow deploys GAS update before client polls — `checkForUpdates()` now calls `getAppData()` on "Already up to date" and triggers reload if displayed version is stale

#### `testation3.gs` — 01.02g

##### Fixed
- Page now auto-refreshes when updates are deployed by the workflow

## [v03.10r] — 2026-03-05 02:56:41 PM EST

### Added
- Red tree decoration at the bottom of Testation3 GAS web app UI

#### `testation3.gs` — 01.01g

##### Added
- Red tree emoji art displayed at the bottom of the app interface

## [v03.09r] — 2026-03-05 02:48:36 PM EST

### Added
- New GAS project "Testation3" — 10 files created via setup script (HTML page, GAS script, config, version files, changelogs)
- Registered Testation3 in GAS Projects table, STATUS.md, ARCHITECTURE.md, and README.md structure tree

## [v03.08r] — 2026-03-05 02:05:59 PM EST

### Changed
- `setup-gas-project.sh` now fully automates all post-setup steps: updates ARCHITECTURE.md (Mermaid diagram), README.md (structure tree), STATUS.md (both tables), and fixes .gs comment references — no manual edits needed after running the script
- Added "Setup GAS Project Command" section to CLAUDE.md for deterministic execution (like Initialize Command)
- Simplified Copy Config for Claude button output to a minimal prompt — script handles everything

#### `gas-project-creator.html` — v01.54w

##### Changed
- Copy Config button now generates a shorter prompt since the setup script handles all documentation updates automatically

## [v03.07r] — 2026-03-05 01:57:34 PM EST

### Added
- New GAS project "Testation2" with full embedding page, GAS script, config, version files, and changelogs (10 files created via setup script)
- Testation2 registered in GAS Projects table, STATUS.md, ARCHITECTURE.md diagram, and README.md structure tree

#### `testation2.html` — v01.00w

##### Added
- New page for Testation2 GAS web app

#### `testation2.gs` — 01.01g

##### Added
- New self-updating GAS script for Testation2

## [v03.06r] — 2026-03-05 01:37:09 PM EST

### Changed
- "Copy Config for Claude" output now lists the three template source files so Claude knows exactly which templates the setup script copies from

#### `gas-project-creator.html` — v01.53w

##### Changed
- Copy Config button output now lists the template files used for new project creation

## [v03.05r] — 2026-03-05 01:32:42 PM EST

### Changed
- "Copy Config for Claude" button now includes a natural-language preamble and post-script steps, so Claude Code knows the full intent and follow-up actions without guessing

#### `gas-project-creator.html` — v01.52w

##### Changed
- Copy Config button output now includes setup instructions and post-script checklist for Claude Code

## [v03.04r] — 2026-03-05 11:25:27 AM EST

### Added
- Shell script `scripts/setup-gas-project.sh` automates GAS project file creation — replaces the 13-step manual Claude prompt with a single command that creates 10+ files (HTML page, .gs script, config, versions, changelogs)
- Script supports both create mode (new projects) and update mode (sync config into existing projects)

### Changed
- "Copy Config for Claude" button now copies a setup script command instead of a natural language prompt — paste into Claude Code or run directly in terminal

#### `gas-project-creator.html` — v01.51w

##### Changed
- Copy Config button now outputs a shell script command instead of a Claude prompt — faster, deterministic project creation

## [v03.03r] — 2026-03-05 10:34:03 AM EST

### Added
- Spreadsheet display section with embedded Google Sheets iframe, live B1 polling, and live quotas sidebar added to GAS template and Copy Code.gs template — new GAS projects created via GAS Project Creator now include these features out of the box

#### `gas-template.gs` — 01.02g

##### Added
- Embedded Google Sheets iframe showing the configured spreadsheet when SPREADSHEET_ID is set
- Live B1 value display with 15-second cache-backed polling
- Live quotas sidebar showing GitHub rate limit, email quota, and service estimates (updates every 60 seconds)
- Server-side functions: `readB1FromCacheOrSheet()`, `onEditWriteB1ToCache()`, `fetchGitHubQuotaAndLimits()`

## [v03.02r] — 2026-03-05 10:25:03 AM EST

### Changed
- Replaced "Open in Google Sheets" link button with embedded Google Sheets iframe in test_link_gas_1_app GAS web app

#### `test_link_gas_1_app.gs` — 01.03g

##### Changed
- Spreadsheet section now shows embedded Google Sheets iframe instead of external link button

## [v03.01r] — 2026-03-05 10:09:45 AM EST

### Added
- Spreadsheet data section in test_link_gas_1_app GAS web app — shows sheet name, live B1 value with "Open in Google Sheets" button, and live quotas sidebar

#### `test_link_gas_1_app.gs` — 01.02g

##### Added
- Spreadsheet data section showing sheet name, live B1 value, and "Open in Google Sheets" button when spreadsheet is configured
- Live B1 value updates automatically every 15 seconds via cache-backed polling
- Live quotas sidebar showing GitHub rate limit, email quota, and service estimates

## [v03.00r] — 2026-03-05 09:55:36 AM EST

### Changed
- Updated test_link_gas_1_app GAS project config: TITLE changed from "optional title" to "Test Title"

#### `test_link_gas_1_app.html` — v01.01w

##### Changed
- Page title updated to "Test Title"

#### `test_link_gas_1_app.gs` — 01.01g

##### Changed
- App title updated to "Test Title"

## [v02.99r] — 2026-03-05 09:42:31 AM EST

### Fixed
- Re-trigger GitHub Pages deployment after transient GitHub API 500 error during prior deploy

## [v02.98r] — 2026-03-05 09:33:31 AM EST

### Fixed
- Copy Code.gs now injects `GITHUB_OWNER`, `GITHUB_REPO`, and `FILE_PATH` from the page URL and environment name — previously these were left as template placeholders, causing 404 errors when the GAS app tried to pull from GitHub

#### `gas-project-creator.html` — v01.50w

##### Fixed
- Copy Code.gs now automatically sets the GitHub owner, repo, and file path so the pasted code can pull updates without manual edits

## [v02.97r] — 2026-03-05 09:22:51 AM EST

### Added
- Created full `test_link_gas_1_app` GAS project ecosystem: HTML embedding page, `.gs` file, config.json, version files, changelogs, and deployment changelog copy
- Registered TestLinkGas1App in GAS Projects table

#### `test_link_gas_1_app.html` — v01.00w

##### Added
- New embedding page for Test Link Gas 1 App GAS project with full template features (auto-refresh, version polling, maintenance mode, changelog popup)

## [v02.96r] — 2026-03-05 09:07:01 AM EST

### Changed
- Copy Code.gs now injects `EMBED_PAGE_URL` using the Project Environment Name, so the `.gs` code knows its containing HTML page for redirects

#### `gas-project-creator.html` — v01.49w

##### Changed
- Copy Code.gs now sets the embedding page URL automatically from the environment name
- Copy Code.gs button now requires both Deployment ID and Project Environment Name (was Deployment ID only)

## [v02.95r] — 2026-03-05 08:52:11 AM EST

### Changed
- "Copy Config for Claude" prompt now uses an explicit **Project Environment Name** field instead of inferring file paths from the project title

#### `gas-project-creator.html` — v01.48w

##### Added
- Project Environment Name input field (required) — specifies the base name for all project files (e.g. `test` creates `test.html`, `test.gs`, etc.)

##### Changed
- "Copy Config for Claude" button now requires both Deployment ID and Project Environment Name to be filled
- Copied prompt now references the Page Setup Checklist and uses the environment name for all file paths

## [v02.94r] — 2026-03-05 08:41:02 AM EST

### Changed
- Restructured Page Rename/Move Checklist to use a **Project Environment Name** field — specify just the base name (e.g. `gas-template` → `gas-project-creator`) and all 10 file paths are derived automatically via a lookup table


Developed by: ShadowAISolutions

