# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-16 12:10:39 PM EST
**Repo version:** v04.15r

### What was done
- **v04.02r–v04.08r** — Built 4 offensive security test suites using Playwright (Python, sync API):
  - test_01: XSS injection (22 attacks, all blocked)
  - test_02: Session forgery (14 attacks, all blocked)
  - test_03: Message injection (all blocked)
  - test_04: CSRF/OAuth token replay (all blocked)
- **v04.09r** — Fixed real vulnerabilities found by the tests:
  - Session fixation via storage injection — page-load resume now defers `showApp()` until `gas-auth-ok`
  - Duplicate `gas-session-created` overwriting legitimate session — first-write-wins on messageKey
  - Cross-tab storage sync calling `showApp()` directly — now defers to `gas-auth-ok`
- **v04.10r** — Fixed false positive in test_04 Attack 3 (regex for real JSON token responses vs JS variable names)
- **v04.11r** — Security Event Reporter: client-side defenses now report blocked attacks to GAS backend via hidden iframe beacons. Added `_reportSecurityEvent()` to testauth1.html, portal.html, and auth template. Server handler in testauth1.gs and portal.gs with rate limiting (20/5min/IP)
- **v04.12r** — Rate-limit-hit logging: `security_event_throttled` entry fires once at limit so defender knows events were suppressed
- **v04.13r** — Added web search verification rule to "Validate Before Asserting" for platform quota/limit/pricing claims
- **v04.14r–v04.15r** — Created `FUTURE-CONSIDERATIONS.md` for deferred scale ideas (IP blocklist, quota tracking, email alerts, heartbeat tuning, client-side expiry estimation)

### Where we left off
All 4 offensive test suites pass. Security Event Reporter is deployed to code (needs GAS redeployment). We had an extended discussion about:
- **Defender visibility** — how to know when attacks are blocked (answer: SessionAuditLog sheet)
- **GAS quotas are per-account, not per-script** — at 50 projects this matters. Heartbeats are the biggest consumer
- **IP blocking** — possible at application level in GAS but no network-level blocking (GitHub Pages + GAS don't offer it)
- Future considerations documented but deferred — not urgent at 2 projects

### Key technical context
- **Security Event Reporter flow**: client blocks attack → `_reportSecurityEvent()` creates hidden iframe → GAS `doGet(?securityEvent=...)` → `auditLog('security_event', ...)` to SessionAuditLog sheet
- **Rate limiting**: client-side 10/page-load, server-side 20/5min/IP. At count === 20, one `security_event_throttled` entry logged then silent
- **GAS quotas are PER ACCOUNT**: 20,000 executions/day (consumer), 100,000 (Workspace). All scripts share. Verified via Google official docs
- **Heartbeat test value**: currently 30s in testauth1.gs (production should be 300s). Biggest quota consumer at scale
- **Storage keys**: `gas_session_token`/`gas_user_email` (NOT `testauth1_session`/`testauth1_email`)
- **HIPAA preset active**: `TOKEN_EXCHANGE_METHOD: 'postMessage'` — URL exchange is skipped entirely
- **Template propagation**: auth template now includes security event reporter + first-write-wins messageKey guard + all 4 reporting points

### Key decisions made
- Keep security events in SessionAuditLog (not a separate sheet) — correlation with auth events is more valuable than separation
- Don't build IP blocklist yet — impractical for attackers at current scale, revisit at 10-15 projects
- Don't optimize heartbeats yet — switch to production interval first (30s→300s), then evaluate
- TODO.md is developer's personal list only — architectural deferred items go in FUTURE-CONSIDERATIONS.md
- Platform quota/limit claims must be web-search verified before asserting (new rule in behavioral-rules.md)

### Active context
- Repo version: v04.15r
- testauth1.html: v02.02w, testauth1.gs: v01.44g
- portal.html: v01.11w, portal.gs: v01.03g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`
- **GAS redeployment needed**: testauth1.gs (v01.44g) and portal.gs (v01.03g) for security event handler to be live

## Previous Sessions

**Date:** 2026-03-15 10:42:40 PM EST
**Repo version:** v04.01r

### What was done
- **v03.93r–v04.01r** — EMR Security Hardening Phases 4–8 complete: DOM clearing, content clearing, escalating lockout, IP logging, data audit logging, sheet protection, sheet rename

Developed by: ShadowAISolutions
