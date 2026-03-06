---
name: new-page
description: Create a new HTML embedding page with all required boilerplate — version files, changelogs, sounds, and optional GAS project setup. Usage — /new-page <project-name>
user-invocable: true
disable-model-invocation: true
argument-hint: <project-name>
---

# New Embedding Page Setup

Create a new HTML embedding page with all the required files and boilerplate.

## Arguments

- `$0` — project name (e.g. `my-project`, `dashboard`). Used for the directory name and file naming

## Steps

1. **Copy the template** — start from `live-site-templates/HtmlTemplateAutoUpdate.html`, which includes:
   - Version file polling logic (fetches html.version.txt on load, polls every 10s)
   - Version indicator pill (bottom-right corner)
   - Green "Website Ready" splash overlay + sound playback
   - Orange "Under Maintenance" splash overlay
   - AudioContext handling and screen wake lock

2. **Create the directory** — `live-site-pages/$0/`

3. **Create the version file** — `live-site-pages/html-versions/$0html.version.txt` (note: lives in the shared `html-versions/` folder, not the page subdirectory) with initial content `|v01.00w|`

4. **Create the sounds directory** — copy `live-site-pages/sounds/` into `live-site-pages/$0/sounds/`

5. **Update the page title** — replace `YOUR_PROJECT_TITLE` in `<title>` with a human-readable project name (ask the user if not obvious from the project name)

6. **Add developer branding** — ensure `<!-- Developed by: DEVELOPER_NAME -->` is the last line (resolve from Template Variables)

7. **Create page changelog** — copy `repository-information/changelogs/HtmlTemplateAutoUpdatehtml.changelog.md` to `repository-information/changelogs/$0html.changelog.md`. Update the title and archive link filename. Also copy the archive template as `$0html.changelog-archive.md`

8. **Create changelog deployment copy** — copy the new changelog to `live-site-pages/html-changelogs/$0html.changelog.txt` (note: lives in the shared `html-changelogs/` folder)

9. **Ask about GAS** — ask the user if this page needs a Google Apps Script project embedded. If yes:
   - Create `googleAppsScripts/<ProjectName>/` directory
   - Copy `live-site-pages/gas-code/gas-project-creator-code.js.txt` → `$0.gs`
   - Create `$0.config.json` with placeholder values
   - Create `live-site-pages/gs-versions/$0gs.version.txt` with content `01.00g` (GAS version file — lives in `live-site-pages/gs-versions/` only)
   - Create GAS changelogs: `$0gs.changelog.md` and `$0gs.changelog-archive.md`
   - Register in the GAS Projects table in `.claude/rules/gas-scripts.md`

10. **Update repo docs** — update ARCHITECTURE.md diagram, README.md project structure tree, and any other docs that reference the list of pages

11. **Commit and push** — standard Pre-Commit and Pre-Push checklists apply

## File Naming Convention

- HTML version files: `live-site-pages/html-versions/<page-name>html.version.txt`
- HTML changelog deploys: `live-site-pages/html-changelogs/<page-name>html.changelog.txt`
- GAS version files: `live-site-pages/gs-versions/<page-name>gs.version.txt`
- GAS changelog deploys: `live-site-pages/gs-changelogs/<page-name>gs.changelog.txt`
- HTML changelog sources: `repository-information/changelogs/<page-name>html.changelog.md`
- GAS changelog sources: `repository-information/changelogs/<page-name>gs.changelog.md`
- No two files in the repo may share the same basename (Pre-Commit #18)

Developed by: ShadowAISolutions
