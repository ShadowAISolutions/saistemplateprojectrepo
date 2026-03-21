# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-20 11:31:06 PM EST
**Repo version:** v05.58r

### What was done
Major security, UX, and infrastructure improvements across 10 pushes (v05.49r–v05.58r):

- **v05.49r–v05.50r** — Portal access control and app sorting improvements
- **v05.51r** — Sort portal auth apps by access — accessible apps first, inaccessible second
- **v05.52r** — Swap portal toggle labels — My Apps left, Show All right
- **v05.53r** — Fix global sessions panel staying open after sign-out
- **v05.54r** — **Comprehensive auth wall UI deactivation** — when auth is enabled but user isn't signed in, all interactive elements (buttons, inputs, panels, toggles) are now disabled/hidden behind the auth wall across all projects and templates
- **v05.55r** — **Migrate cross-project admin secret from spreadsheet to Script Properties** — `CROSS_PROJECT_ADMIN_SECRET` moved from the ACL spreadsheet's `#SECRET` metadata row to GAS Script Properties. GlobalACL auto-distributes it to registered projects via `distributeAdminSecret()`. All projects read from Script Properties instead of spreadsheet
- **v05.56r** — **Auto-initialize HMAC_SECRET and CACHE_EPOCH in Script Properties** — `ensureScriptProperties_()` runs at end of `pullAndDeployFromGitHub()`, auto-generating both values on first deploy. Eliminates manual Script Properties setup entirely
- **v05.57r** — Simplified gas-project-creator Script Properties section — only GITHUB_TOKEN needs manual entry now. HMAC_SECRET generation UI removed. Auto-generation note added for CACHE_EPOCH/HMAC_SECRET
- **v05.58r** — Added CROSS_PROJECT_ADMIN_SECRET to the auto-generation note in gas-project-creator

### Where we left off
- All changes committed and pushed through v05.58r
- **Approved plan pending implementation**: Auto-initialize HMAC_SECRET and CACHE_EPOCH — plan approved but was the session's last push (v05.56r already implemented this; the plan in the plan file may be stale/from before implementation)
- GAS project setup is now nearly zero-config: only `GITHUB_TOKEN` needs manual entry; `CACHE_EPOCH`, `HMAC_SECRET`, and `CROSS_PROJECT_ADMIN_SECRET` are all auto-managed
- CHANGELOG at 92/100 sections (getting close to archive rotation threshold)

### Key decisions made
- **Auth wall deactivation pattern** — disable all interactive UI behind auth wall rather than just hiding content; prevents partial interaction states
- **Script Properties over spreadsheet for secrets** — `CROSS_PROJECT_ADMIN_SECRET` moved from spreadsheet metadata row to Script Properties for better security (not visible in spreadsheet UI)
- **GlobalACL distributes secrets** — GlobalACL is the single source of truth for `CROSS_PROJECT_ADMIN_SECRET`; it auto-distributes to registered projects via their deployment URLs
- **Auto-initialize on deploy** — `ensureScriptProperties_()` runs at end of `pullAndDeployFromGitHub()` with "if not exists" guards, safe for existing projects
- **Only GITHUB_TOKEN manual** — all other Script Properties are auto-managed, simplifying the setup guide

### Active context
- Branch: `claude/add-app-access-toggle-wl5VC`
- Repo version: v05.58r
- CHANGELOG at 92/100 sections
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-20 08:47:30 PM EST
**Repo version:** v05.48r

### What was done
Several ACL infrastructure improvements across 4 pushes:

- **v05.45r** — Connected Portal to Global ACL
- **v05.46r** — Auto-add Access tab column on project registration
- **v05.47r** — **Major: Consolidated Projects tab into Access tab metadata rows** — `#`-prefixed metadata rows (#NAME, #URL, #AUTH) in rows 2-4
- **v05.48r** — Added Global ACL to the portal's PORTAL_APPS registry

### Where we left off
- All changes committed and pushed through v05.48r
- Access tab layout: Row 1 = headers, Rows 2-4 = metadata, Rows 5+ = user data

Developed by: ShadowAISolutions
