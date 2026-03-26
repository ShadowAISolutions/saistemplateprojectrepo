# ​‌‌‌‌‌‌‌​​‌‌‌‌‌​Auto Update HTML & GAS Template

A GitHub Pages deployment framework with automatic version polling, auto-refresh, and Google Apps Script (GAS) embedding support.

Last updated: `2026-03-26 08:58:20 AM EST` · Repo version: `v06.87r`

You are currently using the **saistemplateprojectrepo** developed by **ShadowAISolutions**<br>
Initialize your repository and Claude will update the live site link and QR code here

**This Template Repository's URL:** [github.com/ShadowAISolutions/saistemplateprojectrepo](https://github.com/ShadowAISolutions/saistemplateprojectrepo)

<p align="center">
  <img src="repository-information/readme-qr-code.png" alt="QR code to template repo" width="200">
</p>

## Table of Contents

- [Project Structure](#project-structure)
- [Commands](#commands)
- [Copy This Repository](#copy-this-repository)
- [Initialize This Template](#initialize-this-template)
- [How It Works](#how-it-works)
- [GCP Project Setup & Troubleshooting](#gcp-project-setup--troubleshooting)

## Project Structure

> <sub>**Tip:** Links below navigate away from this page. `Right-click` → `Open link in new window` to keep this ReadMe visible while you work.</sub>

<pre>
<b>Repository Root ─────────────────────────────────────────────────────────────</b>
<a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo">saistemplateprojectrepo/</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/REPO-ARCHITECTURE.md">🧜‍♀️</a>  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/CHANGELOG.md">v02.89r</a>
│
<b>─── Live Site ────────────────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages">live-site-pages/</a>             — [template] Deployed to GitHub Pages
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/favicon.ico">favicon.ico</a>                            — Placeholder favicon (replace with your own)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/open-all.html">open-all.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/open-all.html">🌐</a>🟢  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/open-allhtml.changelog.md">v01.01w</a> · vNoGASg | [template] Open all project pages in separate tabs
│   │
│   <b>│ ─ Public Website ──────────────────────────────────────────────────────────</b>
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/index.html">index.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/">🌐</a>🟢 · <a href="https://docs.google.com/spreadsheets/d/1fZhpw9h_Ci4bIQTwyT-3txrKmtg1tWASBHM2n0UFCRY/">📊</a> · ◽ · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Index/index.gs">⛽</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/index-diagram.md">🧜‍♀️</a>  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/indexhtml.changelog.md">v01.09w</a> &middot; <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/indexgs.changelog.md">v01.01g</a> | [template] Live landing page
│   │
│   <b>│ ─ Internal Sites ──────────────────────────────────────────────────────────</b>
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/testenvironment.html">testenvironment.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/testenvironment.html">🌐</a>🟢 · <a href="https://docs.google.com/spreadsheets/d/1JSHTDKo1zknsdbQAO83EKjvGKcKp91HkuB91LrFaTzE/">📊</a> · ◽ · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Testenvironment/testenvironment.gs">⛽</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/testenvironment-diagram.md">🧜‍♀️</a>  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testenvironmenthtml.changelog.md">v01.09w</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testenvironmentgs.changelog.md">v01.01g</a> | [template] Test Title page
│   │
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gas-project-creator.html">gas-project-creator.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/gas-project-creator.html">🌐</a>🟢 · 🔸 · ◽ · 🔻 · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/gas-project-creator-diagram.md">🧜‍♀️</a>  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/gas-project-creatorhtml.changelog.md">v01.28w</a> · vNoGASg | [template] GAS project creator dashboard
│   │
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/testauth1.html">testauth1.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/testauth1.html">🌐</a>🟢 · <a href="https://docs.google.com/spreadsheets/d/1EKParBF6pP5Iz605yMiEqm1I7cKjgN-98jevkKfBYAA/">📊</a> · ◽ · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Testauth1/testauth1.gs">⛽</a> · ◽  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testauth1html.changelog.md">v03.08w</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testauth1gs.changelog.md">v02.06g</a> | [template] testauth1title page
│   │
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/globalacl.html">globalacl.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/globalacl.html">🌐</a>🟢 · <a href="https://docs.google.com/spreadsheets/d/1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI/">📊</a> · ◽ · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Globalacl/globalacl.gs">⛽</a> · ◽  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/globalaclhtml.changelog.md">v01.28w</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/globalaclgs.changelog.md">v01.25g</a> | [template] Global ACL page
│   │
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/applicationportal.html">applicationportal.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/applicationportal.html">🌐</a>🟢 · <a href="https://docs.google.com/spreadsheets/d/13k0t3aYbf1t4K6XFdvEvVWig6bsxRFDRCcxgXgV8428/">📊</a> · ◽ · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Applicationportal/applicationportal.gs">⛽</a> · ◽  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/applicationportalhtml.changelog.md">v01.35w</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/applicationportalgs.changelog.md">v01.10g</a> | [template] Application Portal page
│   │
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/rndlivedata.html">rndlivedata.html</a>  →  <a href="https://ShadowAISolutions.github.io/saistemplateprojectrepo/rndlivedata.html">🌐</a>🟢 · ◽ · ◽ · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Rndlivedata/rndlivedata.gs">⛽</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/rndlivedata-diagram.md">🧜‍♀️</a>  — <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/rndlivedatahtml.changelog.md">v01.07w</a> · <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/rndlivedatags.changelog.md">v01.06g</a> | [template] RND Live Data page
│   │
│   <b>│ ─ External Sites (Placeholder) ────────────────────────────────────────────</b>
│   │   <i>(No external-site pages yet)</i>
│   │
│   <b>│ ─ Supporting Files ──────────────────────────────────────────────────────</b>
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/.nojekyll">.nojekyll</a>               — [template] Disables Jekyll processing on GitHub Pages
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/templates">templates/</a>               — [template] Template source files for creating new pages and GAS scripts
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/HtmlAndGasTemplateAutoUpdate-noauth.html.txt">HtmlAndGasTemplateAutoUpdate-noauth.html.txt</a> — [template] HTML page template without auth
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/HtmlAndGasTemplateAutoUpdate-auth.html.txt">HtmlAndGasTemplateAutoUpdate-auth.html.txt</a> — [template] HTML page template with Google Authentication
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/gas-minimal-noauth-template-code.js.txt">gas-minimal-noauth-template-code.js.txt</a> — [template] Minimal GAS template (version display + auto-update only)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/gas-minimal-auth-template-code.js.txt">gas-minimal-auth-template-code.js.txt</a> — [template] Minimal GAS template with Google auth
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/gas-test-noauth-template-code.js.txt">gas-test-noauth-template-code.js.txt</a> — [template] Full-featured GAS template with test UI
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/templates/gas-test-auth-template-code.js.txt">gas-test-auth-template-code.js.txt</a> — [template] Full-featured GAS template with test UI &amp; Google auth
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/html-versions">html-versions/</a>           — [template] HTML page version files for auto-refresh polling
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/indexhtml.version.txt">indexhtml.version.txt</a>          — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/testenvironmenthtml.version.txt">testenvironmenthtml.version.txt</a>    — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/gas-project-creatorhtml.version.txt">gas-project-creatorhtml.version.txt</a> — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/testauth1html.version.txt">testauth1html.version.txt</a>          — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/globalaclhtml.version.txt">globalaclhtml.version.txt</a>          — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/open-allhtml.version.txt">open-allhtml.version.txt</a>           — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/applicationportalhtml.version.txt">applicationportalhtml.version.txt</a>          — [template]
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-versions/rndlivedatahtml.version.txt">rndlivedatahtml.version.txt</a>          — [template]
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/gs-versions">gs-versions/</a>             — [template] GAS version files for GAS version pill polling
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/indexgs.version.txt">indexgs.version.txt</a>            — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/testenvironmentgs.version.txt">testenvironmentgs.version.txt</a>      — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/testauth1gs.version.txt">testauth1gs.version.txt</a>            — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/globalaclgs.version.txt">globalaclgs.version.txt</a>            — [template]
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/applicationportalgs.version.txt">applicationportalgs.version.txt</a>            — [template]
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-versions/rndlivedatags.version.txt">rndlivedatags.version.txt</a>            — [template]
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/html-changelogs">html-changelogs/</a>         — [template] HTML changelogs (source of truth + deployed)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/indexhtml.changelog.md">indexhtml.changelog.md</a>                 — [template] Homepage changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/indexhtml.changelog-archive.md">indexhtml.changelog-archive.md</a>         — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testenvironmenthtml.changelog.md">testenvironmenthtml.changelog.md</a>       — [template] Testenvironment page changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testenvironmenthtml.changelog-archive.md">testenvironmenthtml.changelog-archive.md</a> — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/gas-project-creatorhtml.changelog.md">gas-project-creatorhtml.changelog.md</a>   — [template] GAS Project Creator changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/gas-project-creatorhtml.changelog-archive.md">gas-project-creatorhtml.changelog-archive.md</a>  — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testauth1html.changelog.md">testauth1html.changelog.md</a>             — [template] Testauth1 page changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/testauth1html.changelog-archive.md">testauth1html.changelog-archive.md</a>     — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/globalaclhtml.changelog.md">globalaclhtml.changelog.md</a>             — [template] Globalacl page changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/globalaclhtml.changelog-archive.md">globalaclhtml.changelog-archive.md</a>     — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/open-allhtml.changelog.md">open-allhtml.changelog.md</a>              — [template] Open All page changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/open-allhtml.changelog-archive.md">open-allhtml.changelog-archive.md</a>      — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/applicationportalhtml.changelog.md">applicationportalhtml.changelog.md</a>             — [template] Applicationportal page changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/applicationportalhtml.changelog-archive.md">applicationportalhtml.changelog-archive.md</a>     — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/rndlivedatahtml.changelog.md">rndlivedatahtml.changelog.md</a>             — [template] Rndlivedata page changelog
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/html-changelogs/rndlivedatahtml.changelog-archive.md">rndlivedatahtml.changelog-archive.md</a>     — [template] Older sections (rotated)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/gs-changelogs">gs-changelogs/</a>           — [template] GAS changelogs (source of truth + deployed)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/indexgs.changelog.md">indexgs.changelog.md</a>                   — [template] Index GAS changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/indexgs.changelog-archive.md">indexgs.changelog-archive.md</a>           — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testenvironmentgs.changelog.md">testenvironmentgs.changelog.md</a>         — [template] Testenvironment GAS changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testenvironmentgs.changelog-archive.md">testenvironmentgs.changelog-archive.md</a> — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testauth1gs.changelog.md">testauth1gs.changelog.md</a>               — [template] Testauth1 GAS changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/testauth1gs.changelog-archive.md">testauth1gs.changelog-archive.md</a>       — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/globalaclgs.changelog.md">globalaclgs.changelog.md</a>               — [template] Globalacl GAS changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/globalaclgs.changelog-archive.md">globalaclgs.changelog-archive.md</a>       — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/applicationportalgs.changelog.md">applicationportalgs.changelog.md</a>               — [template] Applicationportal GAS changelog
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/applicationportalgs.changelog-archive.md">applicationportalgs.changelog-archive.md</a>       — [template] Older sections (rotated)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/rndlivedatags.changelog.md">rndlivedatags.changelog.md</a>               — [template] Rndlivedata GAS changelog
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/gs-changelogs/rndlivedatags.changelog-archive.md">rndlivedatags.changelog-archive.md</a>       — [template] Older sections (rotated)
│   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/live-site-pages/sounds">sounds/</a>                 — [template] Audio feedback files
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/sounds/Website_Ready_Voice_1.mp3">Website_Ready_Voice_1.mp3</a>   — [template] "Website Ready" splash sound
│       └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/sounds/Code_Ready_Voice_1.mp3">Code_Ready_Voice_1.mp3</a>      — [template] "Code Ready" splash sound
│
<b>─── Google Apps Scripts ───────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts">googleAppsScripts/</a>          — [template] Google Apps Script projects
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts/Index">Index/</a>                 — [template] GAS for live-site-pages/index.html
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Index/index.gs">index.gs</a>           — [template] Self-updating GAS web app
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Index/index.config.json">index.config.json</a>  — [template] Project config (source of truth)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts/Testenvironment">Testenvironment/</a>       — [template] GAS for live-site-pages/testenvironment.html
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Testenvironment/testenvironment.gs">testenvironment.gs</a>            — [template] Self-updating GAS web app
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Testenvironment/testenvironment.config.json">testenvironment.config.json</a>   — [template] Project config (source of truth)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts/Testauth1">Testauth1/</a>             — [template] GAS for live-site-pages/testauth1.html
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Testauth1/testauth1.gs">testauth1.gs</a>              — [template] Self-updating GAS web app (auth)
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Testauth1/testauth1.config.json">testauth1.config.json</a>     — [template] Project config (source of truth)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts/Applicationportal">Applicationportal/</a>     — [template] GAS for live-site-pages/applicationportal.html
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Applicationportal/applicationportal.gs">applicationportal.gs</a>              — [template] Self-updating GAS web app (auth)
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Applicationportal/applicationportal.config.json">applicationportal.config.json</a>     — [template] Project config (source of truth)
│   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/googleAppsScripts/Rndlivedata">Rndlivedata/</a>           — [template] GAS for live-site-pages/rndlivedata.html
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Rndlivedata/rndlivedata.gs">rndlivedata.gs</a>                — [template] Self-updating GAS web app
│       └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/googleAppsScripts/Rndlivedata/rndlivedata.config.json">rndlivedata.config.json</a>       — [template] Project config (source of truth)
│
<b>─── Scripts ──────────────────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/scripts">scripts/</a>                   — [template]
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/scripts/init-repo.sh">init-repo.sh</a>            — [template] One-shot fork initialization script
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/scripts/setup-gas-project.sh">setup-gas-project.sh</a>    — [template] GAS project file creation script
│   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/scripts/compute-csp-hash.sh">compute-csp-hash.sh</a>     — [template] CSP SHA-256 hash computation for inline scripts
│
<b>─── Tests ────────────────────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/tests">tests/</a>                     — [template] Security &amp; integration tests
│   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/tests/offensive-security">offensive-security/</a>    — [template] Offensive security tests (Playwright)
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/HTML-AUTH-SECURITY-AUDIT.md">HTML-AUTH-SECURITY-AUDIT.md</a>        — [template] Independent security audit of HTML auth layer (HIPAA context)
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/README.md">README.md</a>                         — [template] Test suite documentation
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/SECURITY-FINDINGS.md">SECURITY-FINDINGS.md</a>              — [template] Comprehensive findings from all tests
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/XSS-EXPLAINER.md">XSS-EXPLAINER.md</a>                  — [template] XSS explanation, Playwright god mode, threat model context
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_01_xss_postmessage.py">test_01_xss_postmessage.py</a>        — [template] XSS via postMessage injection
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_02_session_forgery.py">test_02_session_forgery.py</a>         — [template] Session token forgery &amp; fixation
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_03_message_type_injection.py">test_03_message_type_injection.py</a>  — [template] Message type spoofing &amp; protocol confusion
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_04_csrf_token_replay.py">test_04_csrf_token_replay.py</a>       — [template] OAuth token replay &amp; CSRF attacks
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_05_clickjacking_iframe_embedding.py">test_05_clickjacking_iframe_embedding.py</a> — [template] Clickjacking &amp; iframe embedding
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_06_deploy_endpoint_abuse.py">test_06_deploy_endpoint_abuse.py</a>   — [template] Deploy endpoint probing &amp; flood
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_07_session_race_timing.py">test_07_session_race_timing.py</a>     — [template] Session race conditions &amp; timing
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_08_csp_bypass_resource_injection.py">test_08_csp_bypass_resource_injection.py</a> — [template] CSP bypass &amp; resource injection
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/test_09_auth_state_manipulation.py">test_09_auth_state_manipulation.py</a> — [template] Auth state manipulation &amp; privilege escalation
│       └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/tests/offensive-security/GAS-HIPAA-COMPLIANCE-ANALYSIS.md">GAS-HIPAA-COMPLIANCE-ANALYSIS.md</a>  — [template] GAS HIPAA compliance analysis under Workspace BAA
│
<b>─── Repository Information ───────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/repository-information">repository-information/</a>    — [template]
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/REPO-ARCHITECTURE.md">REPO-ARCHITECTURE.md</a>         — [template] System diagram (Mermaid)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/repository-information/diagrams">diagrams/</a>               — [template] Per-page architecture diagrams
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/gas-project-creator-diagram.md">gas-project-creator-diagram.md</a> — [template] GAS Project Creator user flow
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/index-diagram.md">index-diagram.md</a>              — [template] Homepage component interaction
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/testenvironment-diagram.md">testenvironment-diagram.md</a>    — [template] Testenvironment page GAS integration sequence
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/testauth1-diagram.md">testauth1-diagram.md</a>         — [template] Testauth1 page GAS integration sequence (auth)
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/applicationportal-diagram.md">applicationportal-diagram.md</a>  — [template] Application Portal page GAS integration sequence (auth)
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/diagrams/rndlivedata-diagram.md">rndlivedata-diagram.md</a>       — [template] RND Live Data page GAS integration sequence
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/CHANGELOG.md">CHANGELOG.md</a>            — [template] Version history
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/CHANGELOG-archive.md">CHANGELOG-archive.md</a>    — [template] Older changelog sections (rotated from CHANGELOG.md)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/CODING-GUIDELINES.md">CODING-GUIDELINES.md</a>    — [template] Domain-specific coding knowledge
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/DATA-POLL-ARCHITECTURE.md">DATA-POLL-ARCHITECTURE.md</a> — Data poll vs heartbeat architecture &amp; quota reference
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/01-CUSTOM-AUTH-PATTERN.md">01-CUSTOM-AUTH-PATTERN.md</a>  — [template] Custom Auth implementation reference (GAS + custom domain)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/02-GOOGLE-OAUTH-AUTH-PATTERN.md">02-GOOGLE-OAUTH-AUTH-PATTERN.md</a> — [template] Google OAuth (GIS) auth implementation reference
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/03-IMPROVED-GOOGLE-OAUTH-PATTERN.md">03-IMPROVED-GOOGLE-OAUTH-PATTERN.md</a> — [template] Improved Google OAuth pattern with server-side sessions
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/04-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md">04-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md</a> — [template] Research-validated OAuth pattern (strict origin, re-auth fallback, CacheService caveats)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/05-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md">05-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md</a> — [template] HIPAA-compliant OAuth pattern (audit logging, domain restriction, session integrity)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/06-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md">06-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md</a> — [template] Unified config-driven auth pattern (toggleable features, standard &amp; HIPAA presets)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/AUTH-DIRECT-ACCESS-FIX.md">AUTH-DIRECT-ACCESS-FIX.md</a> — Troubleshooting write-up: fixing direct URL access to authenticated GAS apps (12 attempts, root causes, final fix)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/GOVERNANCE.md">GOVERNANCE.md</a>           — [template] Project governance
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/HIPAA-CODING-REQUIREMENTS.md">HIPAA-CODING-REQUIREMENTS.md</a> — Complete HIPAA regulatory reference for coding (Security Rule, Privacy Rule, Breach Notification, 2025 NPRM, implementation checklist)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md">HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md</a> — testauth1 HIPAA compliance assessment (40 items evaluated, gaps &amp; strengths)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md">HIPAA-TESTAUTH1-IMPLEMENTATION-FOLLOWUP.md</a> — Follow-up compliance progress (v01.56g→v01.91g, v02.35w→v02.74w, updated scorecard &amp; gap analysis)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/HIPAA-PHASE-A-IMPLEMENTATION-GUIDE.md">HIPAA-PHASE-A-IMPLEMENTATION-GUIDE.md</a> — Phase A implementation guide (Privacy Rule: #19 Disclosure Accounting, #23 Right of Access, #24 Right to Amendment)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/HIPAA-COMPLIANCE-REFERENCE.md">HIPAA-COMPLIANCE-REFERENCE.md</a> — [Superseded] HIPAA Security Rule compliance reference (all safeguards, implementation status)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/IMPROVEMENTS.md">IMPROVEMENTS.md</a>         — [template] Potential improvements
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/KNOWN-CONSTRAINTS-AND-FIXES.md">KNOWN-CONSTRAINTS-AND-FIXES.md</a>    — Architectural constraints &amp; resolved bug fixes (GAS double-iframe, postMessage, HMAC, deploy webhook)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/MICROSOFT-AUTH-PLAN.md">MICROSOFT-AUTH-PLAN.md</a>  — [template] Microsoft auth implementation plan (MSAL.js + Azure AD)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/07-SECURITY-UPDATE-PLAN-TESTAUTH1.md">07-SECURITY-UPDATE-PLAN-TESTAUTH1.md</a> — [template] Security hardening plan for testauth1 (6 phases, implemented)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/08-SECURITY-UPDATE-PLAN-TESTAUTH1.md">08-SECURITY-UPDATE-PLAN-TESTAUTH1.md</a> — [template] Security update plan II for testauth1 (7 phases, 19 vulnerabilities — ready for implementation)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/09-CROSS-DEVICE-SESSION-ENFORCEMENT-PLAN.md">09-CROSS-DEVICE-SESSION-ENFORCEMENT-PLAN.md</a> — [template] Cross-device single-session enforcement plan (6 phases — ready for implementation)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/09.1-CROSS-DEVICE-SESSION-ENFORCEMENT-REVISED-PLAN.md">09.1-CROSS-DEVICE-SESSION-ENFORCEMENT-REVISED-PLAN.md</a> — [template] Revised cross-device enforcement plan (google.script.run approach — zero doGet overhead)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/09.1.1-CROSS-DEVICE-SESSION-ENFORCEMENT-DRIVE-PLAN.md">09.1.1-CROSS-DEVICE-SESSION-ENFORCEMENT-DRIVE-PLAN.md</a> — [template] Drive file approach for cross-device enforcement (zero server polling cost — with caveats)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/09.2-CROSS-DEVICE-SESSION-ENFORCEMENT-HEARTBEAT-PLAN.md">09.2-CROSS-DEVICE-SESSION-ENFORCEMENT-HEARTBEAT-PLAN.md</a> — [template] Heartbeat piggyback approach for cross-device enforcement (zero new polling — simplest mechanism)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/10-EMR-SECURITY-HARDENING-PLAN.md">10-EMR-SECURITY-HARDENING-PLAN.md</a> — [template] EMR security hardening plan — HIPAA technical safeguards for patient data protection
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/10.1-SECURITY-REMEDIATION-GUIDE.md">10.1-SECURITY-REMEDIATION-GUIDE.md</a> — [template] Implementation-ready remediation guide for all security audit findings
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md">10.2-CATEGORY3-CODE-IMPLEMENTATION-GUIDE.md</a> — [template] Category 3 code implementation guide — phased fixes for 12 must-implement findings
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/10.3-DJB2-TO-HMAC-MIGRATION-PLAN.md">10.3-DJB2-TO-HMAC-MIGRATION-PLAN.md</a> — [template] DJB2 → HMAC-SHA256 migration plan for GAS session HTML messages
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/10.4-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md">10.4-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md</a> — [template] Single-load auth optimization — reduce standard path login from 2 doGet() to 1
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/10.4.1-HIPAA-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md">10.4.1-HIPAA-SINGLE-LOAD-AUTH-OPTIMIZATION-PLAN.md</a> — [template] HIPAA single-load auth optimization — reduce HIPAA path login from 2 doGet() to 1 via innerHTML SPA technique
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/10.4.1-IMPLEMENTATION-FINDINGS.md">10.4.1-IMPLEMENTATION-FINDINGS.md</a> — [template] Implementation findings from 10.4.1 attempt — issues, learnings, and recommendations for future re-attempt
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/11-EMR-GAS-APPLICATION-LAYER-PLAN.md">11-EMR-GAS-APPLICATION-LAYER-PLAN.md</a> — [template] EMR GAS application layer plan — HIPAA data access, RBAC, consent &amp; disclosure
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/12-HIPAA-SSO-IMPLEMENTATION-PLAN.md">12-HIPAA-SSO-IMPLEMENTATION-PLAN.md</a> — [template] HIPAA-compliant SSO plan — portal HIPAA conversion + BroadcastChannel cross-page auth
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/TEMPLATE-UPDATE-PLAN.md">TEMPLATE-UPDATE-PLAN.md</a> — [template] Phased plan to sync auth templates with testauth1
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/TODO.md">TODO.md</a>                 — [template] Actionable to-do items
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/FUTURE-CONSIDERATIONS.md">FUTURE-CONSIDERATIONS.md</a> — [template] Deferred architectural ideas for scale
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/readme-qr-code.png">readme-qr-code.png</a>             — [template] QR code linking to this repo
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/REMINDERS.md">REMINDERS.md</a>            — [template] Reminders for Developer (developer's own notes)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/SESSION-CONTEXT.md">SESSION-CONTEXT.md</a>      — [template] Previous Session Context (Claude-written session log)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/SESSION-MANAGER-PLAN.md">SESSION-MANAGER-PLAN.md</a> — [template] Cross-project Session Manager implementation plan (reverted)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/SKILLS-REFERENCE.md">SKILLS-REFERENCE.md</a>     — [template] Complete Claude Code skills inventory (custom + imported + bundled)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/repository.version.txt">repository.version.txt</a>  — [template] Repo version (v01.XXr — bumps every push)
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/TOKEN-BUDGETS.md">TOKEN-BUDGETS.md</a>        — [template] Token cost reference for CLAUDE.md
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/SUPPORT.md">SUPPORT.md</a>              — [template] Getting help
│   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/repository-information/backups">backups/</a>                — Pre-change backups for safe rollback
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/backups/SSO-REVERT-INSTRUCTIONS.md">SSO-REVERT-INSTRUCTIONS.md</a>        — How to revert SSO changes
│       └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/repository-information/backups/testauth1.html.pre-sso.bak">testauth1.html.pre-sso.bak</a>        — Testauth1 backup (v02.61w, pre-SSO)
│
<b>─── Claude Code ──────────────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CLAUDE.md">CLAUDE.md</a>                   — [template] Developer instructions
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude">.claude/</a>                   — [template]
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/settings.json">settings.json</a>           — [template] Claude Code project settings
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/rules">rules/</a>                  — [template] Always-loaded + path-scoped rules
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/behavioral-rules.md">behavioral-rules.md</a>        — [template] Always loaded — execution style, pushback, etc.
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/changelogs.md">changelogs.md</a>              — [template] Path-scoped — CHANGELOG rules
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/chat-bookends.md">chat-bookends.md</a>           — [template] Always loaded — response formatting rules
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/chat-bookends-reference.md">chat-bookends-reference.md</a> — [template] Always loaded — bookend examples &amp; tables
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/gas-scripts.md">gas-scripts.md</a>             — [template] Path-scoped — GAS rules
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/html-pages.md">html-pages.md</a>             — [template] Path-scoped — HTML page rules
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/init-scripts.md">init-scripts.md</a>           — [template] Path-scoped — init script rules
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/output-formatting.md">output-formatting.md</a>      — [template] Always loaded — CLI styling, attribution
│   │   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/repo-docs.md">repo-docs.md</a>              — [template] Path-scoped — documentation rules
│   │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/rules/workflows.md">workflows.md</a>              — [template] Path-scoped — workflow rules
│   │
│   <b>│ ─ Skills ────────────────────────────────────────────────────────────────</b>
│   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills">skills/</a>                  — [template] Invokable workflow skills
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--diff-review">imported--diff-review/</a>       — [template] /diff-review — pre-push differential review
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--diff-review/SKILL.md">SKILL.md</a>                — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--frontend-design">imported--frontend-design/</a>   — [template] /frontend-design — distinctive UI creation
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--frontend-design/SKILL.md">SKILL.md</a>                — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--git-cleanup">imported--git-cleanup/</a>       — [template] /git-cleanup — stale branch/worktree cleanup
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--git-cleanup/SKILL.md">SKILL.md</a>                — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--security-review">imported--security-review/</a>   — [template] /security-review — OWASP/web security audit
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--security-review/SKILL.md">SKILL.md</a>                — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--skill-creator">imported--skill-creator/</a>     — [template] /skill-creator — create new skills
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--skill-creator/SKILL.md">SKILL.md</a>                — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/imported--webapp-testing">imported--webapp-testing/</a>    — [template] /webapp-testing — Playwright page testing
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/imported--webapp-testing/SKILL.md">SKILL.md</a>                — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/initialize">initialize/</a>          — [template] /initialize — first deployment setup
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/initialize/SKILL.md">SKILL.md</a>        — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/maintenance-mode">maintenance-mode/</a>    — [template] /maintenance-mode — toggle maintenance overlay
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/maintenance-mode/SKILL.md">SKILL.md</a>        — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/new-page">new-page/</a>            — [template] /new-page — create new HTML page with boilerplate
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/new-page/SKILL.md">SKILL.md</a>        — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/phantom-update">phantom-update/</a>      — [template] /phantom-update — timestamp alignment
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/phantom-update/SKILL.md">SKILL.md</a>        — [template]
│       ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/reconcile">reconcile/</a>           — [template] /reconcile — end multi-session mode
│       │   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/reconcile/SKILL.md">SKILL.md</a>        — [template]
│       └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.claude/skills/remember-session">remember-session/</a>    — [template] /remember-session — save session context
│           └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.claude/skills/remember-session/SKILL.md">SKILL.md</a>        — [template]
│
<b>─── GitHub Configuration ─────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.github">.github/</a>                   — [template]
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.github/workflows">workflows/</a>              — [template] CI/CD pipeline
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/tree/main/.github/ISSUE_TEMPLATE">ISSUE_TEMPLATE/</a>         — [template] Bug report &amp; feature request forms
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.github/PULL_REQUEST_TEMPLATE.md">PULL_REQUEST_TEMPLATE.md</a> — [template] PR checklist
│   ├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.github/FUNDING.yml">FUNDING.yml</a>             — [template] Sponsor button config
│   └── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.github/last-processed-commit.sha">last-processed-commit.sha</a> — [template] Inherited branch guard (commit SHA tracking)
│
<b>─── Configuration ────────────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.gitattributes">.gitattributes</a>              — [template] Line ending normalization (LF)
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.editorconfig">.editorconfig</a>               — [template] Editor formatting rules (indent, charset, EOL)
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/.gitignore">.gitignore</a>                  — [template] Git ignore patterns
│
<b>─── Community ────────────────────────────────────────────────────────────────</b>
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CITATION.cff">CITATION.cff</a>                — [template] Citation metadata
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a>          — [template] Community standards
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</a>             — [template] How to contribute
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/LICENSE.md">LICENSE.md</a>                  — [template] Proprietary license
├── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/SECURITY.md">SECURITY.md</a>                 — [template] Vulnerability reporting
└── <a href="https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/README.md">README.md</a>                   — [template] This file — project overview &amp; structure
</pre>

## Commands

<sub>[Back to Table of Contents](#table-of-contents)</sub>

> **Tip:** Links below navigate away from this page. **Ctrl + click** (or right-click → *Open in new tab*) to keep this ReadMe visible while you work.

All commands are invoked as slash commands in [Claude Code](https://github.com/anthropics/claude-code) or by typing the command name conversationally (e.g. "initialize", "remember session").

### Repo Workflow Commands

| Command | Origin | Description |
|---------|--------|-------------|
| [`/initialize`](.claude/skills/initialize/SKILL.md) | Custom | First deployment setup — resolves template placeholders, deploys to GitHub Pages |
| [`/new-page`](.claude/skills/new-page/SKILL.md) `<project-name>` | Custom | Create a new HTML page with full boilerplate (version polling, splash, auto-refresh) |
| [`/maintenance-mode`](.claude/skills/maintenance-mode/SKILL.md) `<page> <on\|off>` | Custom | Toggle maintenance overlay on/off for specific pages on the live site |
| [`/phantom-update`](.claude/skills/phantom-update/SKILL.md) | Custom | Timestamp alignment — touch every file so all share the same commit timestamp on GitHub |
| `setup gas project` | Custom | Create a new GAS project from config — run by pasting output from the Copy Config for Claude button |
| [`/remember-session`](.claude/skills/remember-session/SKILL.md) | Custom | Save session context so the next Claude session picks up where you left off |
| [`/reconcile`](.claude/skills/reconcile/SKILL.md) | Custom | End multi-session mode — bundle accumulated changes into versioned changelog sections |
| `diff rules` | Custom | Compare this fork's rules against the template repo to find additions, modifications, and upstream changes |
| `repo audit` | Custom | Comprehensive cross-system consistency audit of the entire repository |

### Code Quality Commands

| Command | Origin | Description |
|---------|--------|-------------|
| [`/diff-review`](.claude/skills/imported--diff-review/SKILL.md) | Imported | Security-focused differential review of staged changes before pushing |
| [`/security-review`](.claude/skills/imported--security-review/SKILL.md) | Imported | OWASP Top 10, XSS, and insecure defaults audit for HTML and GAS code |
| [`/webapp-testing`](.claude/skills/imported--webapp-testing/SKILL.md) | Imported | Playwright-based testing for live pages — screenshots, browser logs, UI verification |
| `/simplify` | Bundled | Review changed code for reuse, quality, and efficiency, then fix any issues found |

### Design & Tooling Commands

| Command | Origin | Description |
|---------|--------|-------------|
| [`/frontend-design`](.claude/skills/imported--frontend-design/SKILL.md) | Imported | Create distinctive, production-grade frontend interfaces with high design quality |
| [`/skill-creator`](.claude/skills/imported--skill-creator/SKILL.md) | Imported | Meta-skill for building and refining new Claude Code skills |
| [`/git-cleanup`](.claude/skills/imported--git-cleanup/SKILL.md) | Imported | Clean up stale branches, worktrees, and `claude/*` artifacts |

## Copy This Repository

<sub>[Back to Table of Contents](#table-of-contents)</sub>

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

<sub>[Back to Table of Contents](#table-of-contents)</sub>

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

<sub>[Back to Table of Contents](#table-of-contents)</sub>

### Auto-Refresh via Version Polling
Every hosted page polls a lightweight `html.version.txt` file (from `live-site-pages/html-versions/`) every 10 seconds. When a new version is deployed, the page detects the mismatch and auto-reloads — showing a green "Website Ready" splash with audio feedback. A blue "Code Ready" splash plays when GAS script updates are detected.

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

<sub>[Back to Table of Contents](#table-of-contents)</sub>

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

Developed by: ShadowAISolutions
