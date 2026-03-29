# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-29 04:20:43 PM EST
**Repo version:** v07.81r

### What was done
- **v07.76r** — Renamed applicationportal to programportal across the entire repo (10 files renamed, 22 files content-updated: HTML, GAS, config, changelogs, diagrams, workflow, documentation)
- **v07.77r** — Added self-sign-out to Global Sessions panel (removed `!sess.isSelf` guard so Sign Out / Sign Out All Projects buttons show for your own sessions)
- **v07.78r** — Fixed Global Sessions panel staying visible during sign-out (registered both Sessions and Global Sessions panels in `_panelRegistry` so `_closeAllPanelsExcept(null)` in `performSignOut()` closes them; also made the two panels mutually exclusive)
- **v07.79r** — Renamed "Global ACL" to "Global Access Control List" in Program Portal's `PORTAL_APPS` array
- **v07.80r** — Renamed "Homepage" to "Website" in Program Portal's `PORTAL_APPS` array. CHANGELOG archive rotation ran (25 sections from 2026-03-26 moved to archive)
- **v07.81r** — Fixed SHA enrichment for CHANGELOG archive rotation: root cause was shallow clone (`git rev-parse --is-shallow-repository` = true, only ~50 commits visible). Added `git fetch --unshallow origin main` step to rotation rules. Ran historical backfill enriching all 343 previously missing SHA links in CHANGELOG-archive.md (100% success rate)

### Where we left off
- All changes committed and pushed (v07.81r)
- programportal.html: v01.70w, programportal.gs: v01.13g
- globalacl.html: v01.65w, globalacl.gs: v01.27g
- testauth1.html: v03.77w, testauth1.gs: v02.26g
- GAS code for programportal needs manual update in Apps Script editor (FILE_PATH, ACL_PAGE_NAME, TITLE, PORTAL_APPS changes)
- Page changelogs still over 50-section limit — archive rotation needed (programportal HTML: 70/50, testauth1 HTML: 71/50, globalacl HTML: 65/50)

### Key decisions made
- **Rename sequence for GAS projects**: push code → rename spreadsheet column header → manually update GAS code in Apps Script editor → run nuclearCacheClear to flush stale access cache
- **Cache caused access denied after rename**: old deployed GAS code cached "access denied" for 10 minutes because it searched for the old column name. nuclearCacheClear in globalacl fixed it
- **Global Sessions panel not in _panelRegistry**: was the root cause of it staying visible during sign-out. Both Sessions and Global Sessions panels are now registered
- **SHA enrichment fix**: shallow clone was the only issue — once `git fetch --unshallow` ran, every single missing SHA was found (343/343). Added the unshallow step to the rotation rules in CLAUDE.md and changelogs.md
- **PORTAL_APPS is hardcoded**: the app cards in Program Portal come from a static array in programportal.gs `doGet()`, not from the ACL spreadsheet

### Active context
- Branch: `claude/rename-application-to-program-ykMOg`
- Repo version: v07.81r
- programportal.html: v01.70w, programportal.gs: v01.13g
- globalacl.html: v01.65w, globalacl.gs: v01.27g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`
- Page changelogs need archive rotation (programportal HTML: 70/50, testauth1 HTML: 71/50, globalacl HTML: 65/50)
- CHANGELOG at 77/100

## Previous Sessions

**Date:** 2026-03-29 02:48:16 AM EST
**Repo version:** v07.75r

### What was done
- **v07.65r–v07.75r** — Checklist improvements across all 3 auth pages: always-visible sub-steps, globalacl gas-auth-ok fix, label renames, sign-out complete finish line, embedded ACL data, total elapsed timer, live-ticking timer, group vs total suffix

### Where we left off
- All changes committed and pushed (v07.75r)
- testauth1.html: v03.77w, programportal.html: v01.69w, globalacl.html: v01.63w

Developed by: ShadowAISolutions
