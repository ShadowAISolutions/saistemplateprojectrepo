# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-13 10:51:48 PM EST
**Repo version:** v03.04r

### What was done
- **v03.00r** — Fixed heartbeat ready indicator not clearing idle on activity — `_heartbeatIdle` was not being cleared when user became active, so display stayed stuck on `(idle)` until the next 30s tick
- **v03.01r** — After heartbeat extend (`gas-heartbeat-ok`), set `_heartbeatIdle = true` so display resets to "(idle)" instead of the old "extended ✓" → "active" setTimeout flash that was getting overwritten by the 1-second timer
- **v03.02r** — Added iframe focus detection (polling `document.activeElement` for iframe + `_onHeartbeatActivity()`) to catch keyboard interaction inside cross-origin GAS iframe
- **v03.03r** — Gated iframe focus detection on `document.hasFocus()` to prevent false positives when browser tab not focused
- **v03.04r** — Removed iframe focus polling entirely — it falsely reported activity whenever iframe had focus even if user was idle. No reliable way to detect keyboard-only activity inside a cross-origin iframe from the parent

### Where we left off
All heartbeat display fixes are complete and deployed. The net changes from this session:
1. After heartbeat extend, display resets to idle (new behavior)
2. Removed the old "extended ✓" → "active" setTimeout hack (was getting overwritten)
3. Keyboard-only interaction inside the GAS iframe remains a known limitation — cross-origin iframes swallow keyboard events and there's no false-positive-free way to detect them from the parent. Mouse movement on the host page covers most real usage

### Key decisions made
- **Iframe focus polling is not viable** — tried two approaches (raw polling, then gated on `document.hasFocus()`), both produced false positives. The fundamental problem: `document.activeElement === iframe` is true even when the user is completely idle, as long as focus remains in the iframe
- **Accepted the limitation** — keyboard-only interaction in the GAS iframe won't trigger heartbeat. The only solution would be having the GAS script itself post activity messages back to the parent, which adds GAS-side complexity
- **Post-extend state should be idle** — after a successful heartbeat extend, the display resets to "(idle)" and the next tick determines if the user is still active. This is correct because the extend just happened — there's no pending activity to report

### Active context
- Repo version: v03.04r
- testauth1.html: v01.39w, testauth1.gs: v01.16g
- Security update plan still exists at `repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md` — status unknown from this session (was ready for implementation as of v02.89r context)
- Microsoft auth plan saved at `repository-information/MICROSOFT-AUTH-PLAN.md` — awaiting user decision
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
