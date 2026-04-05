# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-05 07:45:47 PM EST
**Repo version:** v08.92r

### What was done
- **Research phase** — Deep analysis comparing `setup-gas-project.sh` + GAS project creator output against the 3 existing auth projects (testauth1, globalacl, programportal). Used structural diffs, section extraction, and function-level comparisons across all HTML/GAS files and templates
- **v08.92r** — Implemented 13-step remediation plan with emphasis on dead code removal:
  1. **Removed 174 lines of dead duplicate Phase B config blocks** from globalacl.gs and programportal.gs — `BREACH_ALERT_CONFIG`, `HIPAA_RETENTION_CONFIG`, `LEGAL_HOLD_CONFIG`, `INTEGRITY_CONFIG`, `REPRESENTATIVE_CONFIG` were each defined twice (pre-template + auth section); JavaScript `var` re-declaration meant auth-section copies silently overwrote the pre-template copies
  2. **Updated auth HTML template** to match projects: stripped dead CSS comments (`/* ○ */`), reordered signout sub-steps CSS, emptied CSS PROJECT block (removed `.html-layer-hidden`), changed `'Almost ready…'` → `'Sign-in complete'`
  3. **Added 7 `_updateSubStep()` calls to template** — function definition existed but was never called (dead code). Now matches the call pattern all 3 projects share
  4. **Restored missing frame-handshake-challenge handler** in globalacl.html (template and other projects had it)
  5. **Restored nonce message handlers** in globalacl.html — `_pendingNonceToken`, `_nonceCallback`, `loadIframeViaNonce()` were dead code without the `gas-nonce-ready`/`gas-nonce-result` handlers
  6. **Added missing entries to globalacl `_SIG_EXEMPT`** — `gas-ready-for-token`, `gas-auth-ok`, `gas-nonce-ready`, `gas-nonce-result`
  7. **Fixed section ordering in globalacl.gs** — ADMIN UTILITIES → CROSS-PROJECT was reversed to match template canonical order (CROSS-PROJECT → ADMIN UTILITIES)
  8. **Moved admin utilities out of testauth1.gs PROJECT section** — 5 generic admin functions relocated to between CROSS-PROJECT and TEMPLATE START
  9. **Fixed `_directSessionLoad` comment** in globalacl.html and entity encoding in programportal.html

### Where we left off
- All changes pushed via `claude/analyze-gas-creator-setup-jZ4GO` — workflow will auto-merge to main
- **All 3 auth projects now have consistent section ordering**: PROJECT → CROSS-PROJECT → ADMIN UTILITIES → TEMPLATE START
- **No more duplicate config blocks** — each config variable defined exactly once in every file
- **Template is now ahead of (or equal to) projects** for the common auth flow features (`_updateSubStep` calls, nonce flow, frame-handshake, 'Sign-in complete' text)
- **Remaining differences between projects and template are all legitimately project-specific**: testauth1's HIPAA Phase A, test timeouts, live data UI; globalacl's global admin functions; programportal's announcements, portal dashboard, SSO_PROVIDER

### Key decisions made
- **Auth-section Phase B configs are the canonical copies** — pre-template copies were dead code (overwritten by `var` re-declaration), so we removed the pre-template copies from globalacl/programportal. TestAuth1 only has pre-template copies (no auth-section duplicates) so those stay
- **Template canonical section order is: PROJECT → CROSS-PROJECT → ADMIN UTILITIES → TEMPLATE** — globalacl was reversed, testauth1 had admin utils inside PROJECT. Both fixed to match template
- **`_updateSubStep()` calls belong in the template** — all 3 projects share the same 7 call sites, so they're foundational, not project-specific. Sign-out sub-step calls (`sub-so-connecting`, `sub-so-sending`) are project-specific
- **`.html-layer-hidden` CSS class removed from template** — it's project-specific (used by testauth1 in body `<style>`, empty in globalacl/programportal)

### Active context
- Branch: `claude/analyze-gas-creator-setup-jZ4GO`
- Repo version: v08.92r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-05 06:22:37 PM EST
**Repo version:** v08.91r

### What was done
- **v08.91r** — Harmonized all 3 auth projects (testauth1, globalacl, programportal) with the auth templates, resolving 9 identified drift issues (gas-layer-toggle, loadIframeViaNonce, logo URLs, PROJECT OVERRIDE markers, function ordering, etc.)

### Where we left off
- All 3 auth projects foundationally identical to auth templates — TEMPLATE and AUTH sections match, with only PROJECT-designated sections differing

Developed by: ShadowAISolutions
