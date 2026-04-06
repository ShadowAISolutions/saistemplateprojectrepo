# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-06 09:50:43 AM EST
**Repo version:** v09.10r

### What was done
- **v09.06r** — Unified programportal.html non-project template code to match testauth1.html and globalacl.html. Major changes: restored `loadIframeViaNonce()` in showApp DOM clearing reload and storage event login sync (was incorrectly using direct `?session=` URLs), fixed 2 line-merge bugs in sign-in/sign-out stage checklist, restored client-side session expiry pre-check on page load, unified ~15 comment areas
- **v09.07r** — Fixed remaining whitespace and code ordering differences: added missing blank line in `startCountdownTimers`, moved SSO indicator click handler to match testauth1/globalacl position (after page load IIFE), unified comment text
- **v09.08r** — Unified globalacl.html: removed dead `_gasSandboxSource` code (declared/set/cleared but never read — only testauth1 uses it for `ld-init` postMessage), removed dead `_closeAllPanelsExcept(null)` call from showAuthWall (no panels registered — no-op), added missing blank line in showApp, removed `// PROJECT START` description
- **v09.09r** — Rebuilt auth HTML template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) from the unified programportal.html source using copy-and-placeholder approach. Applied 7 placeholder replacements: `TEMPLATE_TITLE`, `YOUR_CLIENT_ID`, empty `var _e`, `v01.00w`, `document.title` for sourceDisplayName, production config defaults (HEARTBEAT_INTERVAL: 300000, SSO_PROVIDER: false). Removed project-specific `_updateReconnectStage('rc-stage-sso')`
- **v09.10r** — Added template-specific guide text: `<!-- YOUR PAGE CONTENT HERE -->` in HTML PROJECT block, description on `// PROJECT START` JS comment
- Also ran dead code audit on all 3 auth pages' non-project code — found no actionable dead code (`YOUR_ORG_LOGO_URL` is a Template Variable, `GAS_ORIGIN` is consumed by testauth1 security tests)

### Where we left off
- **HTML non-project code**: 100% identical across all 3 auth pages (testauth1, globalacl, programportal). The ONLY remaining diffs are project-specific: config values (CLIENT_ID, deployment URL, SSO_PROVIDER, heartbeat/session durations, sourceDisplayName), PROJECT block content (security tests in testauth1, message types, `_gasSandboxSource` in testauth1, panel cooldown in testauth1), and trailing commas dictated by JS syntax when project entries follow
- **Auth HTML template**: synced — rebuilt from programportal.html with placeholders. Only 7 diff hunks against live pages, all expected placeholder/config differences
- **GAS non-project code**: NOT YET UNIFIED. Preliminary analysis shows:
  - All 3 files share 105 core template functions (auth, session, HIPAA compliance, audit)
  - Each adds project-specific functions: testauth1 (10 data functions), globalacl (18 ACL functions), programportal (8 announcement functions)
  - Average similarity between pairs: ~66% (vs HTML's ~85% before unification)
  - **THE NEXT TASK**: strip project-specific functions from all 3 GAS files and diff just the shared template code to determine if the 105 shared functions have drifted or are line-for-line identical. If they've drifted, unify them (same process as HTML). Then rebuild the GAS template from the cleanest file

### Key decisions made
- **`loadIframeViaNonce` is the correct approach** — changelogs (v05.59r–v05.75r) document a 12-attempt troubleshooting cycle. The hybrid design: nonce for showApp/storage-event (replay protection), direct `?session=` for initial sign-in and page load (CacheService eventual consistency). Programportal had incorrectly switched all paths to direct `?session=` — corrected to match testauth1/globalacl
- **`_gasSandboxSource` is project-specific to testauth1** — only testauth1 reads it (for `ld-init` postMessage to GAS UI). Removed from globalacl (dead code there). Programportal never had it
- **Template rebuild uses copy-and-placeholder** — instead of patching 47 individual diffs, copy the cleanest live page and replace project-specific values with template placeholders. Guarantees 100% match
- **GAS template sync requires unification first** — can't rebuild GAS template until the 3 live GAS files' shared code is verified identical

### Active context
- Repo version: v09.10r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-06 08:36:49 AM EST
**Repo version:** v09.05r

### What was done
- **v09.04r–v09.05r** — Reorganized testauth1.gs to match globalacl.gs section structure. Unified text-compare.html labels to neutral "Text A"/"Text B"

### Where we left off
- HTML shared code 100% identical between testauth1 and globalacl. GAS section structure aligned but not fully diffed for shared function drift

Developed by: ShadowAISolutions
