# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-05 04:38:12 PM EST
**Repo version:** v08.88r

### What was done
- **v08.86r** — Major environment code unification across portal, testauth1, and globalacl. Performed comprehensive analysis (38 differences identified), then unified all non-project-specific code with testauth1 as source of truth:
  - HTML: CSP headers (connect-src, font-src), CSS (user-select removed from pills, z-index 10012, html-layer-hidden moved to PROJECT), HTML_CONFIG (DATA_POLL_INTERVAL added, ALLOWED_DOMAINS/ENABLE_DOMAIN_RESTRICTION removed, HIPAA comments)
  - GAS: RBAC unified to 4 roles (admin/clinician/billing/viewer + amend), Phase B/C HIPAA configs added to portal/globalacl, getData/heartbeat doPost handlers added, validateSessionForData fixed (role/permission extraction from cache), placeholder strings standardized, cache management unified (epoch-bump), architecture diagram notes updated
- **v08.87r** — Unified all 4 template files (2 GAS auth, 1 HTML auth, 1 HTML noauth) to match testauth1 so gas-project-creator produces identical template code
- **v08.88r** — Fixed remaining HTML auth template drifts: checklist stage text ("Session restored", "Sign-in complete"), JS stage map, sign-in subtitle (margin-top:10px, empty content), HTML entities standardized to `&hellip;`

### Where we left off
- All changes pushed and merged to main (3 pushes this session)
- All three environments (testauth1, globalacl, programportal) now have identical template/shared code — only project-specific code differs
- All 4 template files updated to match — new projects from gas-project-creator will be identical to testauth1 except for project code
- Confirmed PROJECT-SPECIFIC items that correctly differ: `_gasSandboxSource` (testauth1 GAS iframe messaging), `_fetchPausedForGIS` (testauth1 COOP mitigation), HEARTBEAT_INTERVAL values (each env has test/production), SSO_PROVIDER (portal=true, others=false), CLIENT_ID (unique per env), auth preset timings (testauth1 uses ⚡ TEST VALUES)

### Key decisions made
- **testauth1 is source of truth** — when it differs from portal/globalacl, testauth1 is correct (user decision)
- **RBAC unified to 4 roles** — admin/clinician/billing/viewer with amend permission across all environments (user chose over keeping project-specific roles)
- **Phase B/C configs added to all** — BREACH_ALERT_CONFIG, HIPAA_RETENTION_CONFIG, LEGAL_HOLD_CONFIG, INTEGRITY_CONFIG, REPRESENTATIVE_CONFIG are shared template code, not testauth1-only
- **doPost getData/heartbeat are template code** — added to all environments (user chose over keeping project-specific)
- **validateSessionForData exception** — globalacl's robust implementation (extracts role/permissions from cache) was used instead of testauth1's simpler version (user chose this as the better fix)
- **`rc-stage-sso` in template is correct** — hidden by default, shows for SSO_PROVIDER=true pages. Not drift from testauth1

### Active context
- Branch: `claude/unify-environment-code-nQOru`
- Repo version: v08.88r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-05 03:34:38 PM EST
**Repo version:** v08.85r

### What was done
- **v08.80r–v08.85r** — Centered admin badge, shifted pills to right:22px for scrollbar clearance, added white 30px strips to GAS layers, normalized admin badge styling, propagated to all templates

### Where we left off
- All environments consistent with right-side pills, white strips, admin badge styling, toggle buttons

Developed by: ShadowAISolutions
