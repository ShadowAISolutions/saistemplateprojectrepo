---
paths:
  - "live-site-pages/**/*.html"
  - "live-site-pages/**/*html.version.txt"
  - "live-site-templates/**"
---

# HTML Pages Rules

*Actionable rules: see Pre-Commit Checklist items #2, #3, #4 in CLAUDE.md.*

## Build Version (Auto-Refresh for embedding pages)

- The version lives **solely** in `<page-name>html.version.txt` — the HTML contains no hardcoded version
- Format uses pipe delimiters with the version in the middle field: e.g. `|v01.11w|` → `|v01.12w|`
- Each embedding page fetches `html.version.txt` on load to establish its baseline version, then polls every 10 seconds — when the deployed version differs from the loaded version, it auto-reloads

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

### Changelog Deployment Copies
- Each page's changelog is deployed alongside the HTML page as a `.txt` file for the changelog popup to fetch. The source of truth remains in `repository-information/changelogs/` as `.md`; the deployment copy in `live-site-pages/` uses `.txt` to satisfy the unique filename rule
- Naming: `repository-information/changelogs/PAGENAMEhtml.changelog.md` → `live-site-pages/PAGENAMEhtml.changelog.txt`
- **Sync rule**: whenever Pre-Commit item #17 updates a page changelog, also copy the updated content to the corresponding `.txt` deployment file in `live-site-pages/`. This ensures the changelog popup always shows the latest entries after deployment
- The HTML pages fetch this file via a relative URL (same pattern as `html.version.txt`), so the changelog popup works regardless of whether the repo is public or private

### New Embedding Page Setup Checklist
When creating a **new** HTML embedding page, follow every step below:

1. **Copy the template** — start from `live-site-templates/HtmlTemplateAutoUpdate.html`, which already includes:
   - Version file polling logic (fetches html.version.txt on load, then polls every 10 seconds)
   - Version indicator pill (bottom-right corner)
   - Green "Website Ready" splash overlay + sound playback
   - Orange "Under Maintenance" splash overlay (triggered by `maintenance|` prefix in html.version.txt)
   - AudioContext handling and screen wake lock
2. **Choose the directory** — create a new subdirectory under `live-site-pages/` named after the project (e.g. `live-site-pages/my-project/`)
3. **Create the version file** — place a `<page-name>html.version.txt` file in the **same directory** as the HTML page (e.g. `indexhtml.version.txt` for `index.html`), containing the initial version string in pipe-delimited format (e.g. `|v01.00w|`). This is the **single source of truth** for the page version — the HTML contains no hardcoded version
4. **Update the polling URL in the template** — ensure the JS version-file URL derivation matches the HTML filename (the template defaults to deriving it from the page's own filename)
5. **Create `sounds/` directory** — copy the `sounds/` folder (containing `Website_Ready_Voice_1.mp3`) into the new page's directory so the splash sound works
6. **Set the initial version** — set `<page-name>html.version.txt` to `|v01.00w|`
7. **Update the page title** — replace `YOUR_PROJECT_TITLE` in `<title>` with the actual project name
8. **Register in GAS Projects table** — if this page embeds a GAS iframe, add a row to the GAS Projects table in `.claude/rules/gas-scripts.md`
9. **Create GAS config file** — if this page embeds a GAS iframe, copy `googleAppsScripts/HtmlTemplateAutoUpdate/HtmlTemplateAutoUpdate.config.json` into the new GAS project directory, renaming it to `<page-name>.config.json` (e.g. `googleAppsScripts/MyProject/my-project.config.json`). Fill in the project-specific values. This is the single source of truth for `TITLE`, `DEPLOYMENT_ID`, `SPREADSHEET_ID`, `SHEET_NAME`, and `SOUND_FILE_ID` — Pre-Commit item #15 syncs these values to `<page-name>.gs` and the embedding HTML
10. **Create GAS version file and changelog** — if this page has a GAS project, copy `HtmlTemplateAutoUpdategs.version.txt` into the GAS project directory as `<page-name>gs.version.txt` (initial value `01.00g`). Also copy `repository-information/changelogs/HtmlTemplateAutoUpdategs.changelog.md` and `repository-information/changelogs/HtmlTemplateAutoUpdategs.changelog-archive.md` into `repository-information/changelogs/` as `<page-name>gs.changelog.md` and `<page-name>gs.changelog-archive.md`, replacing `YOUR_PROJECT_TITLE` with the project name
11. **Add developer branding** — ensure `<!-- Developed by: DEVELOPER_NAME -->` is the last line of the HTML file
12. **Create page changelog** — copy `repository-information/changelogs/HtmlTemplateAutoUpdatehtml.changelog.md` into `repository-information/changelogs/` as `<page-name>html.changelog.md`. Replace `YOUR_PROJECT_TITLE` with the page's human-readable title and update the archive link filename. Also copy `repository-information/changelogs/HtmlTemplateAutoUpdatehtml.changelog-archive.md` as `<page-name>html.changelog-archive.md` and update its title and changelog link filename
13. **Create changelog deployment copy** — copy the page changelog created in step 12 to `live-site-pages/` as `<page-name>html.changelog.txt` (same content, `.txt` extension). This deployment copy is fetched by the changelog popup on the live site (see "Changelog Deployment Copies" above)

### Page Rename/Move Checklist
When **renaming** an existing HTML page (changing its filename, e.g. `gas-template.html` → `gas-project-creator.html`), follow every step below. **Renaming is high-risk for changelog drift** — the gas-template → gas-project-creator rename caused 16 missing entries in the deployment changelog because associated files were not fully synced.

1. **Rename the HTML file** — rename the page in `live-site-pages/`
2. **Rename the version file** — rename `<old-name>html.version.txt` → `<new-name>html.version.txt` in the same directory
3. **Rename the source changelog** — rename `repository-information/changelogs/<old-name>html.changelog.md` → `<new-name>html.changelog.md`. Update the title and archive link inside the file
4. **Rename the source changelog archive** — rename `<old-name>html.changelog-archive.md` → `<new-name>html.changelog-archive.md`. Update the title and changelog link inside the file
5. **Sync the deployment changelog copy** — copy the renamed source changelog (step 3) to `live-site-pages/<new-name>html.changelog.txt`. **This is the step most likely to be missed.** The deployment copy must match the full source changelog content — do not just rename the old `.txt` file, because it may already be behind the source. Always copy fresh from the source
6. **Delete the old deployment changelog** — remove `live-site-pages/<old-name>html.changelog.txt` (it now has the wrong name)
7. **Rename GAS files** (if applicable) — rename `.gs` file, `config.json`, `gs.version.txt`, GAS changelogs, and GAS changelog archives. Update the GAS Projects table in `gas-scripts.md`
8. **Update internal references** — search all files for the old page name and update: localStorage keys, HTML `<title>`, ARCHITECTURE.md, STATUS.md, README.md, and any cross-references in other pages
9. **Verify changelog continuity** — after renaming, confirm the source changelog has all version entries from v01.01w through the current version with no gaps. The rename should not lose any history

### Directory Structure (per embedding page)
```
live-site-pages/
├── <page-name>/
│   ├── index.html               # The embedding page (from template)
│   ├── indexhtml.version.txt     # Tracks index.html version (e.g. "|v01.00w|")
│   ├── indexhtml.changelog.txt   # Deployed changelog (copied from repository-information/changelogs/)
│   └── sounds/
│       └── Website_Ready_Voice_1.mp3
```
For pages that live directly in `live-site-pages/` (not in a subdirectory), the version file, changelog deployment copy, and `sounds/` folder sit alongside the HTML file (e.g. `live-site-pages/index.html` + `live-site-pages/indexhtml.version.txt` + `live-site-pages/indexhtml.changelog.txt`).

Per-page and per-GAS changelogs are centralized in `repository-information/changelogs/` (e.g. `indexhtml.changelog.md`, `indexgs.changelog.md`) — see Pre-Commit item #17.

## GAS UI Layout Awareness

*Rule: see `.claude/rules/gas-scripts.md` — section "GAS UI Layout Awareness". GAS elements are guests in the host HTML page and must defer to its layout.*

Developed by: ShadowAISolutions
