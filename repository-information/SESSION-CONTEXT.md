# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-13 11:03:12 PM EST
**Repo version:** v03.05r

### What was done
- **v03.00r** — Fixed heartbeat ready indicator not clearing idle on activity — `_heartbeatIdle` was not being cleared when user became active
- **v03.01r** — After heartbeat extend (`gas-heartbeat-ok`), set `_heartbeatIdle = true` so display resets to "(idle)" instead of the old "extended ✓" → "active" setTimeout flash
- **v03.02r** — Added iframe focus detection to catch keyboard interaction inside cross-origin GAS iframe
- **v03.03r** — Gated iframe focus detection on `document.hasFocus()` to prevent false positives when browser tab not focused
- **v03.04r** — Removed iframe focus polling entirely — falsely reported activity whenever iframe had focus even if user was idle
- **v03.05r** — Removed 15s grace period for in-flight heartbeats (urgent heartbeat makes it unnecessary). Propagated testauth1 improvements to auth template: urgent heartbeat for last-30s activity, `▶ ready` indicator replacing `(active)` label

### Where we left off
All heartbeat display and timing fixes complete and deployed. Template is now in sync with testauth1 for heartbeat features. Net changes from this session:
1. After heartbeat extend, display resets to idle (new)
2. Removed "extended ✓" → "active" setTimeout hack
3. Removed 15s grace period — urgent heartbeat covers the edge case
4. Template now has: urgent heartbeat, `▶ ready` indicator, idle-after-extend behavior
5. Keyboard-only interaction inside GAS iframe remains a known limitation (cross-origin iframes swallow keyboard events)

### Key decisions made
- **Iframe focus polling is not viable** — tried two approaches (raw polling, then gated on `document.hasFocus()`), both produced false positives. `document.activeElement === iframe` stays true even when user is completely idle
- **Grace period removed** — the urgent heartbeat (instant send when <30s remain + user active) closes the gap that the grace period was designed for
- **Post-extend state should be idle** — after a successful heartbeat extend, display resets to "(idle)" and the next tick determines activity
- **Accepted iframe keyboard limitation** — only solution would be having the GAS script post activity messages to the parent, adding GAS-side complexity

### Active context
- Repo version: v03.05r
- testauth1.html: v01.40w, testauth1.gs: v01.16g
- Security update plan at `repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md` — was ready for implementation as of v02.89r
- Microsoft auth plan at `repository-information/MICROSOFT-AUTH-PLAN.md` — awaiting user decision
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-13 07:03:11 PM EST
**Repo version:** v02.89r

### What was done
- **v02.85r** (prior session) — Full repo revert to v02.74r state, undoing all v02.75r–v02.84r security hardening attempts
- **v02.86r** (prior session) — Added protective `⚠️ CRITICAL` comment block to GAS deploy handlers and deploy handler protection rule in `.claude/rules/gas-scripts.md`
- **v02.87r** (prior session) — Rotated 92 CHANGELOG sections to archive
- **v02.88r** — Created comprehensive security update plan (`repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md`, ~930 lines). Covers 6 phases: message-type allowlist, cryptographic message authentication, XSS prevention, session hardening, debug cleanup, error sanitization, and postMessage target origin restriction
- **v02.89r** — **Critical correction** to the security plan based on user's insight: the GAS was stuck at v01.15g from v02.79r onward because DEPLOY_SECRET broke auto-deploy. Key corrections: (1) PARENT_ORIGIN case mismatch (missing `.toLowerCase()`) was the real root cause of persistent sign-in failure, (2) Fixed Phase 6 in the plan to include `.toLowerCase()`

### Where we left off
Security update plan is **ready for implementation**. The plan file contains everything needed — current code → new code for every change point across 6 phases.

Developed by: ShadowAISolutions
