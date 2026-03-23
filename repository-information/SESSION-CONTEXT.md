# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-23 08:46:50 AM EST
**Repo version:** v06.17r

### What was done
SSO access control and sign-out UX improvements across 2 pushes (v06.16r–v06.17r):

- **v06.16r** — Restricted SSO token sharing to SSO_PROVIDER pages only. Previously any signed-in auth page responded to `sso-token-request` messages — now only pages with `SSO_PROVIDER: true` (Application Portal) respond. This enforces the intended hub-spoke SSO direction: Application Portal can SSO into other pages, but testauth1/globalacl cannot SSO into Application Portal
- **v06.17r** — Added dual sign-out buttons to all auth pages. Split the single "Sign Out" button into "Sign Out" (local only — signs out of the current page without broadcasting) and "Sign Out All" (broadcasts SSO sign-out to all connected pages). Added `broadcastSSO` option to `performSignOut()` function. Updated template and propagated to all three auth pages

### Key decisions made
- **SSO is one-directional** — developer confirmed SSO should only work when accessed via the Application Portal (hub → spokes, not spokes → hub). The `SSO_PROVIDER` flag now gates both token re-acquisition on reconnect AND token response to requests
- **Dual sign-out buttons** — developer wanted separate "sign out of this page" vs "sign out of all pages" buttons. Wording: "Sign Out" (local) and "Sign Out All" (global), with tooltips for clarity
- **CHANGELOG archive rotation** — 42 sections from 2026-03-20 rotated to archive (sections dropped from 101 to 59/100). SHAs marked as `[sha-unavailable]` since those commits are not in the shallow git history

### Where we left off
- All SSO changes are deployed — SSO token sharing restricted to provider, dual sign-out buttons live
- Template updated with both changes — new pages created from template will inherit the correct behavior
- No pending work or blockers

### Active context
- Branch: `claude/review-portal-console-rLaDR`
- Repo version: v06.17r
- applicationportal.html: v01.21w, applicationportal.gs: v01.08g
- testauth1.html: v02.74w, testauth1.gs: v01.91g
- globalacl.html: v01.25w, globalacl.gs: v01.24g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-22 03:22:27 PM EST
**Repo version:** v06.12r

### What was done
Major SSO and security infrastructure session across 7 pushes (v06.06r–v06.12r):

- **v06.06r–v06.12r** — SSO subtitle fix, tab duplication session expiry fix, SSO infrastructure added to template, Global Sessions JSON fix, expired session detection for localStorage, switched all projects to HIPAA preset, fixed HTML/GAS session duration mismatch

### Where we left off
- All auth pages on HIPAA preset with matching session durations
- GAS scripts need redeployment for server-side changes
- testauth1 uses intentional test values (180s/300s/30s)

Developed by: ShadowAISolutions
