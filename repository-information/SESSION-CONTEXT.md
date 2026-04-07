# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-07 05:16:00 PM EST
**Repo version:** v09.67r

### What was done
- **v09.65r–v09.67r** — Inventory Management GAS project setup + Dynamic Program Portal
- Set up the Inventory Management GAS project via `setup-gas-project.sh` (v09.65r)
- Fixed cross-project admin secret distribution — globalacl now auto-propagates the shared secret to new projects during registerSelfProject (v09.66r)
- **Dynamic Program Portal (v09.67r)** — replaced the hardcoded `PORTAL_APPS` array in programportal.gs with a dynamic `getPortalApps()` function that reads from the Master ACL spreadsheet. New auth projects now automatically appear in the portal after their first page load
- Added `#ICON` (row 5) and `#DESC` (row 6) metadata rows to the Master ACL spreadsheet schema, shifting user data from row 5+ to row 7+
- Updated `ensureMetadataRows()` and `registerSelfProject()` in the auth template + all 4 auth .gs files to support 5 metadata rows (with migration logic for existing 3-row spreadsheets)
- Updated globalacl-specific functions (`getRegisteredProjects`, `addPageColumn`) to read/write the new rows
- Added `PORTAL_ICON` and `PORTAL_DESCRIPTION` config vars to all auth .gs files and config.json files
- Added Portal Icon and Portal Description fields to gas-project-creator.html and setup-gas-project.sh

### Where we left off
- All changes pushed and merging via auto-merge workflow
- **Important deployment step:** after the GAS webhook deploys update all 4 auth projects, each project needs to be loaded once (triggering `registerSelfProject`) to populate the new #ICON and #DESC rows. Then reload the Program Portal to see all projects dynamically
- The `ensureMetadataRows` migration handles existing spreadsheets: detects #ICON is missing and inserts 2 rows after row 4, shifting user data down automatically

### Key decisions made
- User chose "Option 1" — store icon and description in the spreadsheet (new metadata rows) rather than keeping them as a hardcoded override map in programportal.gs. This keeps everything in one place
- Non-auth projects (GAS Project Creator) remain as a hardcoded fallback in `getPortalApps()` since they don't call `registerSelfProject()`
- Default icon for new projects is 📱, default description is `{TITLE} application.`

### Active context
- Branch: claude/setup-gas-inventory-project-3pG6m (pushed, auto-merging)
- Repo version: v09.67r
- gas-project-creator.html: v01.69w, inventorymanagement.gs: v01.02g, testauth1.gs: v02.60g, globalacl.gs: v01.55g, programportal.gs: v01.62g
- testauth1.html: v03.99w, globalacl.html: v01.88w, programportal.html: v01.95w, inventorymanagement.html: v01.00w, text-compare.html: v01.10w
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-07 02:44:44 PM EST
**Repo version:** v09.63r

### What was done
- **Research-only session** — no code changes, all Q&A about OAuth Client IDs and GCP credentials
- Traced the OAuth Client ID flow through the gas-project-creator
- Confirmed Client IDs can be same or different across projects — organizational choice, not technical
- Advised against deleting GCP OAuth Client IDs from the Credentials console

### Where we left off
- No code changes — purely informational session

Developed by: ShadowAISolutions
