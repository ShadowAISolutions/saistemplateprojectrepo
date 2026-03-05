---
paths:
  - "googleAppsScripts/**/*.gs"
  - "googleAppsScripts/**/*.config.json"
  - "googleAppsScripts/**/*gs.version.txt"
  - "live-site-pages/**/*.html"
  - "live-site-pages/*-code.js.txt"
---

# Google Apps Script Rules

*Actionable rules: see Pre-Commit Checklist items #1, #15 in CLAUDE.md.*

## Version Bumping

- The `VERSION` variable is near the top of each `.gs` file (look for `var VERSION = "..."`)
- Format includes a `g` suffix: e.g. `"01.13g"` → `"01.14g"`
- Each GAS project also has a `<page-name>gs.version.txt` that mirrors the `VERSION` variable value (e.g. `01.00g`). This file is bumped alongside `VERSION` by Pre-Commit #1
- Do NOT bump VERSION if the commit doesn't touch the `.gs` file

### GAS Projects
Each GAS project has a code file and a corresponding embedding page. Register them in the table below as you add them. *For step-by-step instructions on adding a new GAS deploy step to the workflow, see the "HOW TO ADD A NEW GAS PROJECT" comment block at the top of `.github/workflows/auto-merge-claude.yml`.*

| Project | Code File | Config File | Embedding Page |
|---------|-----------|-------------|----------------|
| Index | `googleAppsScripts/Index/index.gs` | `googleAppsScripts/Index/index.config.json` | `live-site-pages/index.html` |
| Test | `googleAppsScripts/Test/test.gs` | `googleAppsScripts/Test/test.config.json` | `live-site-pages/test.html` |
| GasTemplate | `googleAppsScripts/GasTemplate/gas-template.gs` | `googleAppsScripts/GasTemplate/gas-template.config.json` | `live-site-pages/gas-template.html` |
| TestLinkGas1App | `googleAppsScripts/TestLinkGas1App/test_link_gas_1_app.gs` | `googleAppsScripts/TestLinkGas1App/test_link_gas_1_app.config.json` | `live-site-pages/test_link_gas_1_app.html` |
| Testation2 | `googleAppsScripts/Testation2/testation2.gs` | `googleAppsScripts/Testation2/testation2.config.json` | `live-site-pages/testation2.html` |


## GAS Project Config (config.json)

Each GAS project directory contains a `<page-name>.config.json` file that is the **single source of truth** for project-unique variables. This mirrors the `version.txt` pattern — one small file to edit, with sync rules that propagate values to `<page-name>.gs` and the embedding HTML page.

### Naming convention
All GAS files are named after the HTML page they serve — mirroring the `indexhtml.version.txt` pattern:
- `index.gs` — GAS code for `index.html`
- `index.config.json` — config for `index.html`
- `dashboard.gs` — GAS code for `dashboard.html`
- `dashboard.config.json` — config for `dashboard.html`

The `.config.json` double extension ensures the config file sorts **after** the `.gs` file alphabetically (same reasoning as `html.version.txt` sorting after `.html`).

### Config file contents

| Key | Description | Syncs to |
|-----|-------------|----------|
| `TITLE` | Project title shown in browser tabs and GAS UI | `<page-name>.gs` `var TITLE`, HTML `<title>` tag |
| `DEPLOYMENT_ID` | GAS deployment ID (`AKfycb...` string) | `<page-name>.gs` `var DEPLOYMENT_ID`, HTML `var _e` inside GAS IIFE (reverse+base64 encoded) |
| `SPREADSHEET_ID` | Google Sheets ID for version tracking | `<page-name>.gs` `var SPREADSHEET_ID` |
| `SHEET_NAME` | Sheet tab name | `<page-name>.gs` `var SHEET_NAME` |
| `SOUND_FILE_ID` | Google Drive file ID for deploy notification sound | `<page-name>.gs` `var SOUND_FILE_ID` |

### What is NOT in config.json
- `VERSION` — auto-bumped by Pre-Commit item #1, lives only in `<page-name>.gs`
- `GITHUB_OWNER`, `GITHUB_REPO`, `FILE_PATH` — derived from repo structure, managed by init script
- `EMBED_PAGE_URL`, `SPLASH_LOGO_URL` — repo-wide settings, managed by init script
- `GITHUB_BRANCH` — always `main`

### Obfuscated deployment URL (var _e inside GAS IIFE)
The encoded deployment URL lives in `var _e` inside the GAS iframe IIFE — not as a global variable. This keeps it out of the browser console and DevTools Sources panel. The decode logic is inline (no named function). Derivation from `DEPLOYMENT_ID`:
- If `DEPLOYMENT_ID` is not a placeholder:
  1. Construct the full URL: `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`
  2. Reverse the URL string
  3. Base64-encode the reversed string
  4. Store as `var _e = 'encoded_value';` inside the GAS IIFE
- If `DEPLOYMENT_ID` is a placeholder (`YOUR_DEPLOYMENT_ID`) → `var _e = '';` (empty, IIFE exits early)

To generate via command line: `echo -n 'https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec' | rev | base64 -w0`

The inline decode reverses this: `atob()` then string-reverse. The iframe is created dynamically via srcdoc trampoline (no `src` attribute set). This is obfuscation, not security — the Network tab still shows the URL

### Template config
`googleAppsScripts/HtmlTemplateAutoUpdate/HtmlTemplateAutoUpdate.config.json` contains placeholder values. When creating a new GAS project, copy it to the new project directory and fill in the real values.

## Commit Message Naming
*Rule: see Pre-Commit Checklist item #9 in CLAUDE.md.*
- All version types use the `v` prefix — suffix indicates type: `r` = repository, `g` = Google Apps Script, `w` = website
- The **push commit** (final commit before `git push`) starts with the repo version prefix (`v01.XXr`) since repo version bumps on the push commit
- When `.gs` or HTML versions are also bumped on the push commit, append them in order: `r`, `g`, `w`
- **Intermediate commits** (earlier commits in the same session) use `g`/`w` prefixes only if those versions were bumped on that commit; otherwise, use a plain descriptive message
- Push commit examples:
  - `v01.05r Fix typo in CLAUDE.md` (repo-only change)
  - `v01.06r v01.19g Fix sign-in popup to auto-close after authentication`
  - `v01.07r v01.19g v01.12w Add auth wall with build version bump`
- Intermediate commit examples:
  - `v01.14g Fix sign-in popup timing` (GAS change, no repo version)
  - `v01.02w Update page layout` (HTML change, no repo version)
  - `Fix typo in CLAUDE.md` (no version bumps at all)
- SHA backfill commit: always uses `Backfill CHANGELOG SHA` — no version prefix, exempt from all push commit rules (see Pre-Commit #7)

## Coding Guidelines Reference

Domain-specific coding constraints are maintained in a dedicated reference file. Consult these when working on the relevant feature area:

| Topic | Reference |
|-------|-----------|
| GAS Code Constraints | *See `repository-information/CODING-GUIDELINES.md` — section "GAS Code Constraints"* |
| Race Conditions — Config vs. Data Fetch | *See `repository-information/CODING-GUIDELINES.md` — section "Race Conditions — Config vs. Data Fetch"* |
| API Call Optimization (Scaling Goal) | *See `repository-information/CODING-GUIDELINES.md` — section "API Call Optimization (Scaling Goal)"* |
| UI Dialogs — No Browser Defaults | *See `repository-information/CODING-GUIDELINES.md` — section "UI Dialogs — No Browser Defaults"* |
| AudioContext & Browser Autoplay Policy | *See `repository-information/CODING-GUIDELINES.md` — section "AudioContext & Browser Autoplay Policy"* |
| Google Sign-In (GIS) for GAS Embedded Apps | *See `repository-information/CODING-GUIDELINES.md` — section "Google Sign-In (GIS) for GAS Embedded Apps"* |
| GCP Project Setup & Troubleshooting | *See `repository-information/CODING-GUIDELINES.md` — section "GCP Project Setup & Troubleshooting"* |
| Testation2 | `googleAppsScripts/Testation2/testation2.gs` | `googleAppsScripts/Testation2/testation2.config.json` | `live-site-pages/testation2.html` |
| Testation3 | `googleAppsScripts/Testation3/testation3.gs` | `googleAppsScripts/Testation3/testation3.config.json` | `live-site-pages/testation3.html` |

## Copy Code.gs Deployment File

GAS-enabled HTML pages include a "Copy Code.gs" button that lets users copy the full `.gs` source to their clipboard. All pages fetch from a **single shared deployment copy**: `live-site-pages/gas-project-creator-code.js.txt`.

**Single source**: `gas-project-creator-code.js.txt` is a verbatim copy of `googleAppsScripts/HtmlTemplateAutoUpdate/HtmlTemplateAutoUpdate.gs` — the base GAS template with placeholder values (`YOUR_DEPLOYMENT_ID`, `YOUR_SPREADSHEET_ID`, `YOUR_ORG_NAME`, etc.). Each HTML page's config form fields do find-and-replace on the copied code before it reaches the clipboard, so users get their values injected automatically.

**Mandatory sync rule**: whenever `HtmlTemplateAutoUpdate.gs` (the base template) is modified, `gas-project-creator-code.js.txt` must be updated to match. Simply copy the `.gs` file to the `.js.txt` path.

**Why this exists**: the HTML pages are served from GitHub Pages (`live-site-pages/`), but the `.gs` files live in `googleAppsScripts/` which is not part of the deployed site. The `.js.txt` file bridges this gap — it's deployed alongside the HTML so the browser `fetch()` can access it.

## GAS UI Layout Awareness

GAS UI elements (iframe panels, toggle buttons, status indicators, overlays) are **guests** inside the host HTML page. They must defer to the host page's existing layout — the HTML page should never need to accommodate GAS elements. When making changes to GAS-related UI on any HTML page:
- **Check for conflicts** with the version indicator (`#version-indicator`, fixed bottom-right), changelog overlay, splash screens, and any other fixed/absolute elements already on the page
- **Avoid overlapping** interactive elements — if two fixed-position controls would occupy the same corner or edge, move the GAS element to an unoccupied position
- **Test mental layout** — before finalizing CSS for any new fixed-position GAS UI element, mentally walk through all existing fixed elements on the page and verify no visual or interactive overlap occurs at any viewport size
- This rule applies automatically to all GAS UI changes — the developer does not need to explicitly request layout-awareness each time

Developed by: ShadowAISolutions
