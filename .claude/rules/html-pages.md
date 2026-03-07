---
paths:
  - "live-site-pages/**/*.html"
  - "live-site-pages/html-versions/**"
  - "live-site-templates/**"
---

# HTML Pages Rules

*Actionable rules: see Pre-Commit Checklist items #2, #3, #4 in CLAUDE.md.*

## Build Version (Auto-Refresh for embedding pages)

- The version lives **solely** in `<page-name>html.version.txt` — the HTML contains no hardcoded version
- Format uses pipe delimiters with the version in the middle field: e.g. `|v01.11w|` → `|v01.12w|`
- Each embedding page fetches `html.version.txt` from `live-site-pages/html-versions/` on load to establish its baseline version, then polls every 10 seconds — when the deployed version differs from the loaded version, it auto-reloads

### Auto-Refresh via html.version.txt Polling
- **All embedding pages must use the `html.version.txt` polling method** — do NOT poll the page's own HTML
- **Version file naming**: the version file must be named `<page-name>html.version.txt`, matching the HTML file it tracks (e.g. `index.html` → `indexhtml.version.txt`, `dashboard.html` → `dashboardhtml.version.txt`). The `html.version.txt` extension distinguishes HTML page version files from GAS version files (`<page-name>gs.version.txt`) and the repo version file (`repository.version.txt`)
- Each version file uses pipe delimiters: `|v01.08w|`. The version is always the middle field (between the pipes). The polling logic splits on `|` and reads `parts[1]`, stripping the `v` prefix for internal comparison. The pipes stay in place at all times — switching to maintenance mode only changes the first field
- **html.version.txt is the single source of truth** — the HTML pages contain a `<meta name="build-version">` tag for informational purposes, but the polling logic does **not** read it. On page load, the polling logic immediately fetches html.version.txt, stores the version as the baseline, creates the version indicator pill, and begins the 10-second polling loop. This means bumping the version in html.version.txt alone (without editing the HTML meta tag) will trigger a reload correctly — after the reload, the page establishes the new version as its baseline, preventing an infinite loop. The meta tag is kept in sync with html.version.txt during commits for visibility, but it is never involved in the reload mechanism
- The polling logic fetches the version file (~7 bytes) instead of the full HTML page, reducing bandwidth per poll from kilobytes to bytes
- URL resolution: derive the version file URL relative to the current page's directory, using the page's own filename. See the template file (`live-site-templates/HtmlTemplateAutoUpdate.html`) for the implementation
- **The `if (!pageName)` fallback is critical** — when a page is accessed via a directory URL (e.g. `https://example.github.io/myapp/`), `pageName` resolves to an empty string. Without the fallback to `'index'`, the poll fetches `html.version.txt` (wrong file) and triggers an infinite reload loop
- Cache-bust with a query param: `fetch(versionUrl + '?_cb=' + Date.now(), { cache: 'no-store' })`
- The template in `live-site-templates/HtmlTemplateAutoUpdate.html` already implements this pattern — use it as a starting point for new projects

### Maintenance Mode via html.version.txt
The html.version.txt polling system supports a **maintenance mode** that displays a full-screen orange overlay when the first field is `maintenance`. The format always uses pipe (`|`) delimiters — you never need to add or remove pipes, just edit the fields:
- **Activate**: change the first field from empty to `maintenance` **and** fill the third field with the **exact display string** — the JS renders it verbatim with no reformatting. Use `As of:` prefix and pre-formatted date (e.g. `|v01.02w|` → `maintenance|v01.02w|As of: 10:00:00 PM EST 02/26/2026`). To get the value, run `TZ=America/New_York date '+As of: %I:%M:%S %p EST %m/%d/%Y'`. Custom messages also work (e.g. `maintenance|v01.02w|Back online soon!` → displays "Back online soon!")
- **Deactivate**: clear the first field back to empty (e.g. `maintenance|v01.02w|` → `|v01.02w|`)
- When the polling logic detects the `maintenance` prefix, it displays an orange full-screen overlay with the developer logo centered and a "🔧This Webpage is Undergoing Maintenance🔧" title — similar to the green "Website Ready" splash but persistent
- The overlay stays visible as long as the html.version.txt content starts with `maintenance` — it does not auto-dismiss
- The version indicator pill remains visible on top of the maintenance overlay (the maintenance overlay uses `z-index: 9998`, below the version indicator's `z-index: 9999`)
- When the `maintenance` prefix is removed: if the underlying version also changed, the page auto-reloads; if the version is unchanged, the overlay fades out gracefully
- **No version bump for standalone maintenance activation** — if the user's request is solely to activate (or deactivate) maintenance mode and nothing else, do NOT bump the version in html.version.txt or the HTML meta tag. Only edit the first and third fields of html.version.txt (the `maintenance` prefix and the timestamp/message). The version field (middle) stays unchanged. If the user requests maintenance mode **combined** with other changes that would normally trigger a version bump (e.g. editing the HTML page, updating a `.gs` file), then bump the version as usual per Pre-Commit Checklist item #2

### Private Repo Compatibility
- **All client-side code in HTML pages must only access resources available on the public GitHub Pages URL.** The repo may be private while GitHub Pages remains public — `raw.githubusercontent.com` and `api.github.com` require authentication on private repos and will fail silently from browser JavaScript. Instead, deploy any needed resources alongside the HTML pages in `live-site-pages/` so they're served through the public GitHub Pages domain
- The GAS scripts (server-side) are exempt — they use authenticated API calls via `GITHUB_TOKEN` from script properties
- This applies to all existing and future features that run in the browser on the deployed site

### Changelog Files
- Each page's changelog lives directly in `live-site-pages/html-changelogs/` as a `.md` file — this is both the source of truth and the deployed file fetched by the changelog popup. No separate deployment copy is needed
- Naming: `live-site-pages/html-changelogs/PAGENAMEhtml.changelog.md`
- GAS changelogs follow the same pattern: `live-site-pages/gs-changelogs/PAGENAMEgs.changelog.md`
- Archive files live alongside their changelogs in the same subdirectory
- The HTML pages fetch changelog files via a relative URL from `html-changelogs/` (same base-path pattern as the version files in `html-versions/`), so the changelog popup works regardless of whether the repo is public or private

### New Embedding Page Setup Checklist
> **Automated by `scripts/setup-gas-project.sh`** — for GAS-embedded pages, the setup script handles all mechanical file creation (steps 1–13). Claude runs the script, then handles ARCHITECTURE.md, README.md tree, STATUS.md, and commit/push.

When creating a **new** HTML embedding page, follow every step below:

1. **Copy the template** — start from `live-site-templates/HtmlTemplateAutoUpdate.html`, which already includes:
   - Version file polling logic (fetches html.version.txt on load, then polls every 10 seconds)
   - Version indicator pill (bottom-right corner)
   - Green "Website Ready" splash overlay + sound playback
   - Orange "Under Maintenance" splash overlay (triggered by `maintenance|` prefix in html.version.txt)
   - AudioContext handling and screen wake lock
2. **Choose the directory** — create a new subdirectory under `live-site-pages/` named after the project (e.g. `live-site-pages/my-project/`)
3. **Create the version file** — place a `<page-name>html.version.txt` file in `live-site-pages/html-versions/` (e.g. `html-versions/indexhtml.version.txt` for `index.html`), containing the initial version string in pipe-delimited format (e.g. `|v01.00w|`). This is the **single source of truth** for the page version — the HTML contains no hardcoded version
4. **Update the polling URL in the template** — ensure the JS version-file URL derivation matches the HTML filename (the template defaults to deriving it from the page's own filename)
5. **Create `sounds/` directory** — copy the `sounds/` folder (containing `Website_Ready_Voice_1.mp3`) into the new page's directory so the splash sound works
6. **Set the initial version** — set `<page-name>html.version.txt` to `|v01.00w|`
7. **Update the page title** — replace `YOUR_PROJECT_TITLE` in `<title>` with the actual project name
8. **Register in GAS Projects table** — if this page embeds a GAS iframe, add a row to the GAS Projects table in `.claude/rules/gas-scripts.md`
9. **Create GAS config file** — if this page embeds a GAS iframe, copy `googleAppsScripts/HtmlTemplateAutoUpdate/HtmlTemplateAutoUpdate.config.json` into the new GAS project directory, renaming it to `<page-name>.config.json` (e.g. `googleAppsScripts/MyProject/my-project.config.json`). Fill in the project-specific values. This is the single source of truth for `TITLE`, `DEPLOYMENT_ID`, `SPREADSHEET_ID`, `SHEET_NAME`, and `SOUND_FILE_ID` — Pre-Commit item #15 syncs these values to `<page-name>.gs` and the embedding HTML
10. **Create GAS version file and changelog** — if this page has a GAS project, create `<page-name>gs.version.txt` in `live-site-pages/gs-versions/` (initial value `01.00g`). Also create `<page-name>gs.changelog.md` and `<page-name>gs.changelog-archive.md` in `live-site-pages/gs-changelogs/`, replacing `YOUR_PROJECT_TITLE` with the project name
11. **Add developer branding** — ensure `<!-- Developed by: DEVELOPER_NAME -->` is the last line of the HTML file
12. **Create page changelog** — create `<page-name>html.changelog.md` in `live-site-pages/html-changelogs/`. Replace `YOUR_PROJECT_TITLE` with the page's human-readable title and update the archive link filename. Also create `<page-name>html.changelog-archive.md` in the same directory and update its title and changelog link filename

### Page Rename/Move Checklist
When **renaming** an existing HTML page's project environment, follow every step below. **Renaming is high-risk for changelog drift** — the `gas-template` → `gas-example` rename caused 16 missing entries in the deployment changelog because associated files were not fully synced.

**Project Environment Name** (required) — the base name shared by the HTML page and all its associated files. This is the name without extensions — e.g. `gas-example`, `test`, `index`. All file paths below are derived from this name:
- **Old name**: `OLD` (e.g. `gas-example`)
- **New name**: `NEW` (e.g. `my-new-project`)

| # | File | Old path | New path |
|---|------|----------|----------|
| 1 | HTML page | `live-site-pages/OLD.html` | `live-site-pages/NEW.html` |
| 2 | Version file | `live-site-pages/html-versions/OLDhtml.version.txt` | `live-site-pages/html-versions/NEWhtml.version.txt` |
| 3 | Changelog | `live-site-pages/html-changelogs/OLDhtml.changelog.md` | `live-site-pages/html-changelogs/NEWhtml.changelog.md` |
| 4 | Changelog archive | `live-site-pages/html-changelogs/OLDhtml.changelog-archive.md` | `live-site-pages/html-changelogs/NEWhtml.changelog-archive.md` |
| 5 | GAS script (if applicable) | `googleAppsScripts/OLD_PROJECT/OLD.gs` | `googleAppsScripts/NEW_PROJECT/NEW.gs` |
| 6 | GAS config (if applicable) | `googleAppsScripts/OLD_PROJECT/OLD.config.json` | `googleAppsScripts/NEW_PROJECT/NEW.config.json` |
| 7 | GAS version file | `live-site-pages/gs-versions/OLDgs.version.txt` | `live-site-pages/gs-versions/NEWgs.version.txt` |
| 8 | GAS changelog | `live-site-pages/gs-changelogs/OLDgs.changelog.md` | `live-site-pages/gs-changelogs/NEWgs.changelog.md` |
| 9 | GAS changelog archive | `live-site-pages/gs-changelogs/OLDgs.changelog-archive.md` | `live-site-pages/gs-changelogs/NEWgs.changelog-archive.md` |

**Steps:**
1. **Rename all files** — rename every file in the table above from old path to new path. Update titles, archive links, and internal references within each renamed file
2. **Delete old files** — remove all old-path files that were renamed (they now have the wrong name)
4. **Update GAS Projects table** — if the page has a GAS project, update the row in `.claude/rules/gas-scripts.md` with the new environment name, file paths, and directory
5. **Update internal references** — search all files for the old environment name and update: localStorage keys, HTML `<title>`, ARCHITECTURE.md, STATUS.md, README.md, and any cross-references in other pages
6. **Verify changelog continuity** — after renaming, confirm the source changelog has all version entries from v01.01w through the current version with no gaps. The rename should not lose any history

### Directory Structure (per embedding page)
```
live-site-pages/
├── <page-name>/
│   ├── index.html               # The embedding page (from template)
│   └── sounds/
│       └── Website_Ready_Voice_1.mp3
├── html-versions/
│   └── indexhtml.version.txt     # Tracks index.html version (e.g. "|v01.00w|")
├── gs-versions/
│   └── indexgs.version.txt       # Tracks GAS version (e.g. "01.00g")
├── html-changelogs/
│   ├── indexhtml.changelog.md         # HTML changelog (source of truth + deployed)
│   └── indexhtml.changelog-archive.md # Older changelog sections (rotated)
└── gs-changelogs/
    ├── indexgs.changelog.md           # GAS changelog (source of truth + deployed)
    └── indexgs.changelog-archive.md   # Older changelog sections (rotated)
```
Version files live in `live-site-pages/html-versions/` and `live-site-pages/gs-versions/`. Changelogs and their archives live in `live-site-pages/html-changelogs/` and `live-site-pages/gs-changelogs/` — these are both the source of truth and the deployed files fetched by the changelog popup. See Pre-Commit item #17.

## GAS UI Layout Awareness

*Rule: see `.claude/rules/gas-scripts.md` — section "GAS UI Layout Awareness". GAS elements are guests in the host HTML page and must defer to its layout.*

Developed by: ShadowAISolutions
