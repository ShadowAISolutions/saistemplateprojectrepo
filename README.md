# ​‌‌‌‌‌‌‌​​‌‌‌‌‌​Auto Update HTML & GAS Template

A GitHub Pages deployment framework with automatic version polling, auto-refresh, and Google Apps Script (GAS) embedding support.

Last updated: `2026-03-09 08:40:55 AM EST` · Repo version: `v01.25r`

You are currently using the **saistemplateprojectrepo** developed by **ShadowAISolutions**<br>
Initialize your repository and Claude will update the live site link and QR code here

**This Template Repository's URL:** [github.com/ShadowAISolutions/saistemplateprojectrepo](https://github.com/ShadowAISolutions/saistemplateprojectrepo)

<p align="center">
  <img src="repository-information/readme-qr-code.png" alt="QR code to template repo" width="200">
</p>

## Copy This Repository

### Method 1: Use This Template (Recommended)

> <sub>**Tip:** Link below navigates away from this page. `Shift + click` (or `Right-click` → `Open link in new window`) to keep this ReadMe visible while you work.</sub>

1. Click the green **Use this template** button at the top of this page, or go to [**Create from template**](https://github.com/new?template_name=saistemplateprojectrepo&template_owner=ShadowAISolutions)
2. Fill in the **Repository name** field with a descriptive name of your choice
3. Click **Create repository**

### Method 2: GitHub Importer

1. Click the `⧉` button below to copy this template's URL:

```
https://github.com/ShadowAISolutions/saistemplateprojectrepo
```

   > <sub>**Tip:** Link below navigates away from this page. `Shift + click` (or `Right-click` → `Open link in new window`) to keep this ReadMe visible while you work.</sub>

2. Go to [**GitHub Importer**](https://github.com/new/import) and paste what you just copied into the `The URL for your source repository *` field
3. Fill in the `Repository name *` field with a descriptive name of your choice
4. Click the green `Begin import` button

## Initialize This Template

> **Important:** The links in steps 1 and 2 below point to the settings of **whichever repo you are viewing this page from**. Make sure you are using the links below while on `YOUR OWN COPY` of the repository, not on the original template repo — otherwise the links will lead to a 404 page.

> <sub>**Tip:** Links below navigate away from this page. `Right-click` → `Open link in new window` to keep this ReadMe visible while you work.</sub>

### 1. Enable GitHub Pages

Go to your repository's [**Pages settings**](../../settings/pages) and configure:

- **Source**: Select **GitHub Actions** (not "Deploy from a branch")

  This allows the included workflow to deploy your `live-site-pages/` directory automatically.

### 2. Configure the `github-pages` Environment

Go to your repository's [**Environments settings**](../../settings/environments), click into the `github-pages` environment, and:

- Select the dropdown next to the **Deployment branches and tags** heading and choose **No restriction**

### 3. Run Claude Code and Type `initialize`

> The initialization process takes approximately **~5 minutes** from when you send `initialize` to when Claude has finished all its actions.

Open the repo with Claude Code and type **`initialize`** as your first prompt. Claude will automatically:

&emsp;Detect your new repo name and org<br>
&emsp;Update all references throughout the codebase<br>
&emsp;Replace the placeholder text above with your live site link<br>
&emsp;Commit and push — triggering the workflow to deploy to GitHub Pages

Your site will be live at `https://<your-org>.github.io/<your-repo>/`

## How It Works

### Auto-Refresh via Version Polling
Every hosted page polls a lightweight `html.version.txt` file (from `live-site-pages/html-versions/`) every 10 seconds. When a new version is deployed, the page detects the mismatch and auto-reloads — showing a green "Website Ready" splash with audio feedback.

### CI/CD Auto-Merge Flow
1. Push to a `claude/*` branch
2. GitHub Actions automatically merges into `main`, deploys to GitHub Pages, and cleans up the branch
3. No pull requests needed — the workflow handles everything

### GAS Embedding Architecture
Google Apps Script projects are embedded as iframes in GitHub Pages. The framework handles:

&emsp;Automatic GAS deployment via `doPost` when `.gs` files change<br>
&emsp;"Code Ready" blue splash on GAS updates (client-side polling)<br>
&emsp;Google Sign-In from the parent page (stable OAuth origin)

## GCP Project Setup & Troubleshooting

> **Tip:** Links below navigate away from this page. **Ctrl + click** (or right-click → *Open in new tab*) to keep this ReadMe visible while you work.

Each GAS web app deployment requires a Google Cloud Platform (GCP) project. To set up:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a **new project**
2. **Critical**: set the project **Location** to your organization root or "No organization" — do **not** place it inside any managed folder
3. Copy the **project number** (not project ID) from the project dashboard
4. In the GCP project, enable the **Apps Script API**: APIs & Services → Library → search "Apps Script API" → Enable
5. In Apps Script, go to Project Settings (gear icon) → Google Cloud Platform (GCP) Project → Change project → paste the project number

### "You cannot switch to a Cloud Platform project in an Apps Script-managed folder"

This error occurs when the GCP project you're targeting lives inside Google's hidden `apps-script` managed folder (`organization → system-gsuite → apps-script`). Even projects created from [console.cloud.google.com](https://console.cloud.google.com/) can end up there on Workspace accounts.

**How to diagnose:**
1. Go to [Google Cloud Console → Manage Resources](https://console.cloud.google.com/cloud-resource-manager)
2. Look for a folder hierarchy: **your org → system-gsuite → apps-script**
3. If your GCP project is inside the `apps-script` folder, that's the problem

**How to fix — Option A (move the project):**

Moving a project out of the managed folder requires the **Project Mover** IAM role, which you likely don't have by default — even as the organization owner/admin.

1. Go to [IAM & Admin](https://console.cloud.google.com/iam-admin/iam) → use the top dropdown to select your **organization** (not a project or folder)
2. Click **Grant Access** → enter your own email
3. In "Select a role" → **Resource Manager** → **Project Mover** → **Save**
4. Go to [Manage Resources](https://console.cloud.google.com/cloud-resource-manager) → find your project inside the `apps-script` folder
5. Click the three-dot menu → **Migrate**
6. Move it to your organization root or "No organization"
7. Retry changing the GCP project in Apps Script settings

**How to fix — Option B (create a new project):**
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a new project
2. When setting the **Location**, explicitly choose your organization root or "No organization"
3. Verify the project number does **not** start with `sys-` (those are auto-created default projects and won't work)
4. Enable the Apps Script API in the new project
5. Use this project's number in Apps Script settings

**Key requirements:**
- The GCP project must be a **manually created, standard project** — not an auto-generated one
- It must live **outside** the `system-gsuite → apps-script` managed folder
- Project numbers starting with `sys-` are auto-created defaults and cannot be used
- You need **Project Browser** and **OAuth Config Editor** roles (or equivalent) on the project
- Moving projects requires the **Project Mover** role (`roles/resourcemanager.projectMover`) granted at the **organization level** — even org owners/admins don't have this by default
- Switching from a default project to a standard project is one-way — you cannot switch back
- On Google Workspace accounts, the GCP project must be in the **same Cloud Organization** as the script owner, just not inside the managed folder

### "Apps Script API has not been used in project X"

This error means the Apps Script API is not enabled in the GCP project associated with your script. Fix:
1. Note the project number from the error message
2. Go to [Google Cloud Console](https://console.cloud.google.com/) → select that project
3. APIs & Services → Library → search "Apps Script API" → **Enable**
4. If the project number doesn't match any project you own, your script is using a default GCP project that you can't access — follow the "cannot switch" fix above to assign your own GCP project first

## Project Structure

> <sub>**Tip:** Links below navigate away from this page. `Right-click` → `Open link in new window` to keep this ReadMe visible while you work.</sub>

[saistemplateprojectrepo/](https://github.com/ShadowAISolutions/saistemplateprojectrepo)
├── [live-site-pages/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages) — [template] Deployed to GitHub Pages
│   ├── [.nojekyll](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/.nojekyll) — [template] Disables Jekyll processing on GitHub Pages
│   ├── [index.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/index.html) — [template] Live landing page
│   ├── [gas-project-creator.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gas-project-creator.html) — [template] GAS project creator dashboard
│   ├── [test.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/test.html) — [template] Test Title page
│   ├── [templates/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/templates) — [template] Template source files for creating new pages and GAS scripts
│   │   ├── [HtmlAndGasTemplateAutoUpdate.html.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/HtmlAndGasTemplateAutoUpdate.html.txt) — [template] HTML page template (GAS features auto-activate when gs.version.txt exists)
│   │   ├── [HtmlAndGasTemplateAutoUpdatehtml.version.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/HtmlAndGasTemplateAutoUpdatehtml.version.txt) — [template] Template version file (frozen at v01.00w)
│   │   └── [gas-project-creator-code.js.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/gas-project-creator-code.js.txt) — [template] GAS script template
│   ├── [html-versions/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/html-versions) — [template] HTML page version files for auto-refresh polling
│   │   ├── [indexhtml.version.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/indexhtml.version.txt) — [template]
│   │   ├── [gas-project-creatorhtml.version.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/gas-project-creatorhtml.version.txt) — [template]
│   │   └── [testhtml.version.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/testhtml.version.txt) — [template]
│   ├── [gs-versions/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/gs-versions) — [template] GAS version files for GAS version pill polling
│   │   ├── [indexgs.version.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/indexgs.version.txt) — [template]
│   │   └── [testgs.version.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/testgs.version.txt) — [template]
│   ├── [html-changelogs/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/html-changelogs) — [template] HTML changelogs (source of truth + deployed)
│   │   ├── [indexhtml.changelog.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/indexhtml.changelog.md) — [template] Homepage changelog
│   │   ├── [indexhtml.changelog-archive.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/indexhtml.changelog-archive.md) — [template] Older sections (rotated)
│   │   ├── [gas-project-creatorhtml.changelog.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/gas-project-creatorhtml.changelog.md) — [template] GAS Project Creator changelog
│   │   ├── [gas-project-creatorhtml.changelog-archive.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/gas-project-creatorhtml.changelog-archive.md) — [template] Older sections (rotated)
│   │   ├── [testhtml.changelog.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testhtml.changelog.md) — [template] Test page changelog
│   │   └── [testhtml.changelog-archive.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testhtml.changelog-archive.md) — [template] Older sections (rotated)
│   ├── [gs-changelogs/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/gs-changelogs) — [template] GAS changelogs (source of truth + deployed)
│   │   ├── [indexgs.changelog.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/indexgs.changelog.md) — [template] Index GAS changelog
│   │   ├── [indexgs.changelog-archive.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/indexgs.changelog-archive.md) — [template] Older sections (rotated)
│   │   ├── [testgs.changelog.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testgs.changelog.md) — [template] Test GAS changelog
│   │   └── [testgs.changelog-archive.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testgs.changelog-archive.md) — [template] Older sections (rotated)
│   └── [sounds/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/sounds) — [template] Audio feedback files
│       ├── [Website_Ready_Voice_1.mp3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/sounds/Website_Ready_Voice_1.mp3) — [template] "Website Ready" splash sound
│       └── [Code_Ready_Voice_1.mp3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/sounds/Code_Ready_Voice_1.mp3) — [template] "Code Ready" splash sound
├── [googleAppsScripts/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts) — [template] Google Apps Script projects
│   ├── [Index/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts/Index) — [template] GAS for live-site-pages/index.html
│   │   ├── [index.gs](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Index/index.gs) — [template] Self-updating GAS web app
│   │   └── [index.config.json](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Index/index.config.json) — [template] Project config (source of truth)
│   └── [Test/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts/Test) — [template] GAS for live-site-pages/test.html
│       ├── [test.gs](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Test/test.gs) — [template] Self-updating GAS web app
│       └── [test.config.json](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Test/test.config.json) — [template] Project config (source of truth)
├── [.claude/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude) — [template]
│   ├── [rules/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/rules) — [template] Always-loaded + path-scoped rules
│   │   ├── [behavioral-rules.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/behavioral-rules.md) — [template] Always loaded — execution style, pushback, etc.
│   │   ├── [changelogs.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/changelogs.md) — [template] Path-scoped — CHANGELOG rules
│   │   ├── [chat-bookends.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/chat-bookends.md) — [template] Always loaded — response formatting rules
│   │   ├── [chat-bookends-reference.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/chat-bookends-reference.md) — [template] Always loaded — bookend examples & tables
│   │   ├── [gas-scripts.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/gas-scripts.md) — [template] Path-scoped — GAS rules
│   │   ├── [html-pages.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/html-pages.md) — [template] Path-scoped — HTML page rules
│   │   ├── [init-scripts.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/init-scripts.md) — [template] Path-scoped — init script rules
│   │   ├── [output-formatting.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/output-formatting.md) — [template] Always loaded — CLI styling, attribution
│   │   ├── [repo-docs.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/repo-docs.md) — [template] Path-scoped — documentation rules
│   │   └── [workflows.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/workflows.md) — [template] Path-scoped — workflow rules
│   ├── [skills/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills) — [template] Invokable workflow skills
│   │   ├── [imported--diff-review/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--diff-review) — [template] /diff-review — pre-push differential review
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--diff-review/SKILL.md) — [template]
│   │   ├── [imported--frontend-design/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--frontend-design) — [template] /frontend-design — distinctive UI creation
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--frontend-design/SKILL.md) — [template]
│   │   ├── [imported--git-cleanup/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--git-cleanup) — [template] /git-cleanup — stale branch/worktree cleanup
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--git-cleanup/SKILL.md) — [template]
│   │   ├── [imported--security-review/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--security-review) — [template] /security-review — OWASP/web security audit
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--security-review/SKILL.md) — [template]
│   │   ├── [imported--skill-creator/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--skill-creator) — [template] /skill-creator — create new skills
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--skill-creator/SKILL.md) — [template]
│   │   ├── [imported--webapp-testing/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--webapp-testing) — [template] /webapp-testing — Playwright page testing
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--webapp-testing/SKILL.md) — [template]
│   │   ├── [initialize/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/initialize) — [template] /initialize — first deployment setup
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/initialize/SKILL.md) — [template]
│   │   ├── [maintenance-mode/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/maintenance-mode) — [template] /maintenance-mode — toggle maintenance overlay
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/maintenance-mode/SKILL.md) — [template]
│   │   ├── [new-page/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/new-page) — [template] /new-page — create new HTML page with boilerplate
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/new-page/SKILL.md) — [template]
│   │   ├── [phantom-update/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/phantom-update) — [template] /phantom-update — timestamp alignment
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/phantom-update/SKILL.md) — [template]
│   │   ├── [reconcile/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/reconcile) — [template] /reconcile — end multi-session mode
│   │   │   └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/reconcile/SKILL.md) — [template]
│   │   └── [remember-session/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/remember-session) — [template] /remember-session — save session context
│   │       └── [SKILL.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/remember-session/SKILL.md) — [template]
│   └── [settings.json](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/settings.json) — [template] Claude Code project settings
├── [.github/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.github) — [template]
│   ├── [workflows/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.github/workflows) — [template] CI/CD pipeline
│   ├── [ISSUE_TEMPLATE/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.github/ISSUE_TEMPLATE) — [template] Bug report & feature request forms
│   ├── [PULL_REQUEST_TEMPLATE.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.github/PULL_REQUEST_TEMPLATE.md) — [template] PR checklist
│   ├── [FUNDING.yml](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.github/FUNDING.yml) — [template] Sponsor button config
│   └── [last-processed-commit.sha](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.github/last-processed-commit.sha) — [template] Inherited branch guard (commit SHA tracking)
├── [repository-information/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/repository-information) — [template]
│   ├── [ARCHITECTURE.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/ARCHITECTURE.md) — [template] System diagram (Mermaid)
│   ├── [CHANGELOG.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/CHANGELOG.md) — [template] Version history
│   ├── [CHANGELOG-archive.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/CHANGELOG-archive.md) — [template] Older changelog sections (rotated from CHANGELOG.md)
│   ├── [CODING-GUIDELINES.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/CODING-GUIDELINES.md) — [template] Domain-specific coding knowledge
│   ├── [GOVERNANCE.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/GOVERNANCE.md) — [template] Project governance
│   ├── [IMPROVEMENTS.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/IMPROVEMENTS.md) — [template] Potential improvements
│   ├── [STATUS.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/STATUS.md) — [template] Project status dashboard
│   ├── [TODO.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/TODO.md) — [template] Actionable to-do items
│   ├── [readme-qr-code.png](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/readme-qr-code.png) — [template] QR code linking to this repo
│   ├── [REMINDERS.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/REMINDERS.md) — [template] Reminders for Developer (developer's own notes)
│   ├── [SESSION-CONTEXT.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/SESSION-CONTEXT.md) — [template] Previous Session Context (Claude-written session log)
│   ├── [SKILLS-REFERENCE.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/SKILLS-REFERENCE.md) — [template] Complete Claude Code skills inventory (custom + imported + bundled)
│   ├── [repository.version.txt](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/repository.version.txt) — [template] Repo version (v01.XXr — bumps every push)
│   ├── [TOKEN-BUDGETS.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/TOKEN-BUDGETS.md) — [template] Token cost reference for CLAUDE.md
│   └── [SUPPORT.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/SUPPORT.md) — [template] Getting help
├── [scripts/](https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/scripts) — [template]
│   ├── [init-repo.sh](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/scripts/init-repo.sh) — [template] One-shot fork initialization script
│   └── [setup-gas-project.sh](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/scripts/setup-gas-project.sh) — [template] GAS project file creation script
├── [.gitattributes](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.gitattributes) — [template] Line ending normalization (LF)
├── [.editorconfig](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.editorconfig) — [template] Editor formatting rules (indent, charset, EOL)
├── [.gitignore](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.gitignore) — [template] Git ignore patterns
├── [CITATION.cff](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CITATION.cff) — [template] Citation metadata
├── [CLAUDE.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CLAUDE.md) — [template] Developer instructions
├── [CODE_OF_CONDUCT.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CODE_OF_CONDUCT.md) — [template] Community standards
├── [CONTRIBUTING.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CONTRIBUTING.md) — [template] How to contribute
├── [LICENSE.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/LICENSE.md) — [template] Proprietary license
└── [SECURITY.md](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/SECURITY.md) — [template] Vulnerability reporting

## Documentation

> <sub>**Tip:** Links below navigate away from this page. `Right-click` → `Open link in new window` to keep this ReadMe visible while you work.</sub>

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](repository-information/ARCHITECTURE.md) | Visual system diagram (Mermaid) |
| [CHANGELOG.md](repository-information/CHANGELOG.md) | Version history |
| [CHANGELOG-archive.md](repository-information/CHANGELOG-archive.md) | Older changelog sections |
| [CLAUDE.md](CLAUDE.md) | Developer instructions and conventions |
| [IMPROVEMENTS.md](repository-information/IMPROVEMENTS.md) | Potential improvements to explore |
| [REMINDERS.md](repository-information/REMINDERS.md) | Reminders for Developer (developer's own notes) |
| [SESSION-CONTEXT.md](repository-information/SESSION-CONTEXT.md) | Previous Session Context (Claude-written) |
| [STATUS.md](repository-information/STATUS.md) | Current project status and versions |
| [TODO.md](repository-information/TODO.md) | Actionable planned items |

## Community

> <sub>**Tip:** Links below navigate away from this page. `Right-click` → `Open link in new window` to keep this ReadMe visible while you work.</sub>

| Document | Description |
|----------|-------------|
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community standards and expectations |
| [Contributing](CONTRIBUTING.md) | How to contribute to this project |
| [Security Policy](SECURITY.md) | How to report vulnerabilities |
| [Support](repository-information/SUPPORT.md) | Getting help |
| [Governance](repository-information/GOVERNANCE.md) | Project ownership and decision making |

Developed by: ShadowAISolutions
