# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-15 10:42:40 PM EST
**Repo version:** v04.01r

### What was done
- **v03.93r** — EMR Security Hardening Phases 4–5: DOM clearing on session expiry (`ENABLE_DOM_CLEARING_ON_EXPIRY`), content clearing on expiry (`ENABLE_CONTENT_CLEARING_ON_EXPIRY`), and escalating lockout (`ENABLE_ESCALATING_LOCKOUT`) with new security settings in both standard and hipaa presets
- **v03.94r** — Phase 6: Escalating lockout refinements
- **v03.95r** — Phase 7 & 8: IP logging (`ENABLE_IP_LOGGING`) via `api.ipify.org` + Data-level audit logging (`ENABLE_DATA_AUDIT_LOG`) with `DataAuditLog` sheet, `dataAuditLog()` function, and `validateSessionForData()` gate
- **v03.96r** — Fix: moved IP fetch from GAS iframe to host page (GAS sandbox blocks `fetch()`), forwarded via `host-client-ip` postMessage
- **v03.97r** — Fix: added direct `XMLHttpRequest` to `api.ipify.org` inside GAS iframe (XHR works in sandbox, `fetch` doesn't), with host-page postMessage as fallback — this one worked
- **v03.98r** — Security: truncated sessionId in DataAuditLog Details JSON to 8 chars (was full token) to prevent token theft, with undo comment
- **v03.99r** — Added `Utilities.getUuid()` as resourceId for patient note audit entries
- **v04.00r** — Renamed `AuditLog` sheet to `SessionAuditLog` for clarity alongside `DataAuditLog`
- **v04.01r** — Added `sheet.protect()` to SessionAuditLog for parity with DataAuditLog's tamper-resistant protection

### Where we left off
**All 8 phases of the EMR Security Hardening Plan (10-EMR-SECURITY-HARDENING-PLAN.md) are COMPLETE.** Post-implementation polish is done (IP fix, sessionId truncation, resourceId, sheet rename, sheet protection).

**Plan 11 (GAS Application Layer — `11-EMR-GAS-APPLICATION-LAYER-PLAN.md`) is written but NOT yet started.** It has 7 phases: RBAC, Minimum Necessary, Input Validation, PHI Segmentation, Data Retention, Consent Tracking, Disclosure Logging.

### Key technical context
- **GAS iframe sandbox restrictions**: `fetch()` is blocked, `postMessage` from host to inner frame doesn't reach the GAS HTML (Google wraps it in nested iframes), but `XMLHttpRequest` works — this is the reliable method for in-iframe network requests
- **Dual audit logs**: `SessionAuditLog` (security events — logins, lockouts, alerts, expirations) and `DataAuditLog` (PHI access — who touched what data, when, with what resourceId). Both are needed — different audiences, different HIPAA requirements
- **SessionId truncation**: first 8 chars only in both the SessionId column AND the Details JSON — prevents token theft from audit spreadsheets. Undo comment in `saveNote()`: "To log the full token, change the line below to: sessionId: sessionToken,"
- **IP logging architecture**: XHR to `api.ipify.org` inside GAS iframe (primary), host-page postMessage (fallback). IP passed directly as 3rd parameter to `saveNote()`, not reliant on heartbeat round-trip
- **Sheet protection**: both audit log sheets use `setWarningOnly(true)` — warns editors but doesn't hard-block (Google Sheets limitation — only the owner can set strict protection)

### Key decisions made
- Keep full IP and full resourceId in audit logs (not secrets — unlike sessionId which IS a secret)
- Keep both SessionAuditLog and DataAuditLog (different purposes, one overlap in `saveNote()` is by design)
- Existing spreadsheet tabs created before protection was added need manual protection or recreation

### Active context
- Repo version: v04.01r
- testauth1.html: v01.99w, testauth1.gs: v01.42g
- portal.html: v01.08w
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-15 08:32:43 PM EST
**Repo version:** v03.92r

### What was done
- **v03.81r–v03.83r** — EMR Security Hardening Phases 1–3: HMAC fail-closed, domain restriction validation, server-side data operation validation
- **v03.84r–v03.92r** — "Use Here" tab-reclaim UX fixes (blank iframe, rate limiting, token transfer, flicker, absolute timer preservation, false expiry warnings)

Developed by: ShadowAISolutions
