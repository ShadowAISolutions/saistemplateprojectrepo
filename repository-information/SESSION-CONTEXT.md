# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-07 02:44:44 PM EST
**Repo version:** v09.63r

### What was done
- **Research-only session** — no code changes, all Q&A about OAuth Client IDs and GCP credentials
- Traced the OAuth Client ID flow through the gas-project-creator: from input field → Copy Config JSON → `setup-gas-project.sh` sed replacement → auth HTML template's `var CLIENT_ID` → 6 `initTokenClient()` calls at runtime
- Confirmed Client IDs can be same or different across projects — testauth1/programportal share one (`...7j0j`), globalacl uses a different one (`...k9hj`). Choice is organizational, not technical
- Confirmed Client ID is public by design (not a secret) — safe to have in HTML source. Only requires Authorized JavaScript Origins to include the GitHub Pages domain
- Advised against deleting GCP OAuth Client IDs from the Credentials console — named ones (`template-portal-oauth`, `global-acl`, `testauth1-github-pages`) are actively used by live pages; auto-generated "Apps Script" ones are Google-managed and shouldn't be touched
- Explained Client Secrets are unused in this architecture (client-side token flow via GIS doesn't need them) and don't need to be stored anywhere — can be regenerated if ever needed

### Where we left off
- No code changes — purely informational session
- Developer was considering cleaning up GCP OAuth credentials for organization
- All pages still at same versions as previous session

### Key decisions made
- None — research only, no changes requested

### Active context
- Repo version: v09.63r
- gas-project-creator.html: v01.68w
- testauth1.html: v03.99w, globalacl.html: v01.88w, programportal.html: v01.95w, text-compare.html: v01.10w
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-07 11:26:48 AM EST
**Repo version:** v09.63r

### What was done
- **v09.42r–v09.63r** — Major gas-project-creator restructure: removed dead SOUND_FILE_ID, renamed LOGO_URL → SPLASH_LOGO_URL, made 3 logo variables independent, field dependency cascade (Auth toggle → Client ID → Deployment ID → Env Name), Master ACL redesign, auth-only field visibility

### Where we left off
- gas-project-creator.html at v01.68w with fully restructured form layout

Developed by: ShadowAISolutions
