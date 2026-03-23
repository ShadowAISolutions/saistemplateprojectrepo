# HIPAA Compliance Follow-Up — testauth1 Implementation Progress

> **Follow-Up Assessment Date:** 2026-03-23
> **Original Report Date:** 2026-03-19
> **Environment:** testauth1 (GAS + GitHub Pages)
> **Active Preset:** `hipaa`
> **Version Range:** GAS v01.56g → v01.91g | HTML v02.35w → v02.74w (35 GAS + 39 HTML versions)
> **Original Report:** `HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md`
> **Regulatory Reference:** `HIPAA-CODING-REQUIREMENTS.md` (v1.0)
>
> This document is a **follow-up companion** to the original compliance report — not a replacement. It captures what was implemented between 2026-03-19 and 2026-03-23, updates compliance statuses, and provides a revised gap analysis.

---

## Revised Executive Summary

### Updated Scorecard

| Category | ✅ Implemented | ⚠️ Partial | ❌ Not Implemented | 🔄 N/A | 📋 Policy | 🔮 NPRM |
|----------|---------------|------------|-------------------|--------|-----------|---------|
| Authentication & Access Control (#1-9) | **6** (+1) | 0 (-1) | 0 | 0 | 1 | 2 |
| Encryption & Transmission Security (#10-13) | 2 | 1 | 0 | 0 | 0 | 1 |
| Audit & Logging (#14-19) | 4 | 1 | 1 | 0 | 0 | 0 |
| Data Integrity (#20-21) | 2 | 0 | 0 | 0 | 0 | 0 |
| Privacy Rule — Data Handling (#22-27) | **1** (+1) | 0 (-1) | 2 | 3 | 0 | 0 |
| Breach Preparedness (#28-31) | 1 | 1 | 1 | 0 | 1 | 0 |
| Infrastructure & Operations (#32-40) | 0 | 0 | 0 | 0 | 3 | 6 |
| **TOTAL (40 items)** | **16** (+2) | **3** (-2) | **4** | **3** | **5** | **9** |

### Before / After Comparison

| Metric | Original (2026-03-19) | Current (2026-03-23) | Change |
|--------|----------------------|---------------------|--------|
| ✅ Implemented | 14 | **16** | +2 |
| ⚠️ Partial | 5 | **3** | -2 |
| ❌ Not Implemented | 4 | 4 | — |
| Current law compliance (Implemented + N/A / 31) | 55% | **61%** | +6% |
| Partial items (current law) | 16% | **10%** | -6% |
| GAS version | v01.56g | v01.91g | +35 versions |
| HTML version | v02.35w | v02.74w | +39 versions |

**Bottom line:** Two previously partial items are now fully implemented (#5 Access Authorization, #22 Minimum Necessary). Multiple existing implementations were significantly hardened (termination procedures, token exchange, session management). Six major new security features were added that go beyond the 40-item checklist.

---

## Items With Status Changes

### #5 — Access Authorization: ⚠️ Partial → ✅ Implemented

**CFR:** §164.308(a)(4)(ii) — **Addressable**

**Original finding (2026-03-19):** "Access is binary (allowed or denied) — there is no concept of roles or permissions within the application. All authorized users have the same level of access."

**What changed:** A full Role-Based Access Control (RBAC) system was implemented.

| Aspect | Evidence | File:Line |
|--------|----------|-----------|
| RBAC system | Roles and permissions read from Master ACL Spreadsheet "Roles" tab | `testauth1.gs:48-65` — RBAC constants and fallback roles |
| Role definitions | admin, clinician, billing, viewer — each with specific permission sets | `testauth1.gs:57-63` — `RBAC_ROLES_FALLBACK` |
| Per-operation enforcement | `checkPermission()` validates every data operation against user's role | `testauth1.gs:192` — `checkPermission(user, requiredPermission, operationName)` |
| Role from ACL | Roles loaded from spreadsheet with in-memory + CacheService caching | `testauth1.gs:105` — `getRolesFromSpreadsheet()` |
| Cache invalidation | Epoch-based atomic cache invalidation — incrementing epoch orphans all cache entries | Throughout `testauth1.gs` |
| Admin session panel | Admin users can view all active sessions and remotely sign out any user | `testauth1.html:271-311` — admin panel CSS; `testauth1.html:387` — panel HTML |
| Role display | User pill shows role badge, color-coded by role | `testauth1.html` — user pill UI |

**Role permission matrix (hardcoded fallback):**

| Role | read | write | delete | export | amend | admin |
|------|------|-------|--------|--------|-------|-------|
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| clinician | ✅ | ✅ | — | ✅ | ✅ | — |
| billing | ✅ | — | — | ✅ | — | — |
| viewer | ✅ | — | — | — | — | — |

**Original gap — CLOSED:** RBAC is fully operational. Access is now differentiated by role with per-operation permission checks.

---

### #7 — Termination Procedures: ✅ Implemented → ✅ Enhanced

**CFR:** §164.308(a)(3)(ii)(C) — **Addressable**

**Original finding:** "Compliant. However, revocation requires manual ACL edit — there is no admin UI to terminate a specific user's access in real-time."

**What changed:** The original gap about no admin UI is now fully closed.

| Aspect | Evidence | File:Line |
|--------|----------|-----------|
| Admin session panel | Admin users see all active sessions with email, role, timers | `testauth1.gs:454` — `listActiveSessions()` |
| Remote sign-out ("Kick") | Admin can remotely terminate any user's session | `testauth1.gs:523` — `adminSignOutUser()` |
| Cross-page sign-out | Signing out from any page signs out ALL connected pages | `testauth1.html` — v02.62w implementation |
| "Sign Out" / "Sign Out All" | Separate buttons for single-page and all-page sign-out | `testauth1.html` — v02.74w |

**Original gap — CLOSED:** Real-time access termination is now available via the admin session panel.

---

### #22 — Minimum Necessary: ⚠️ Partial → ✅ Implemented

**CFR:** §164.502(b) — **Required**

**Original finding:** "No field-level filtering on data returns, and all authorized users see the same data."

**What changed:** RBAC now provides role-based data access differentiation.

| Aspect | Evidence | File:Line |
|--------|----------|-----------|
| Role-gated operations | `checkPermission()` enforces specific permissions per data operation | `testauth1.gs:192` |
| Permission-denied logging | Failed permission checks are audit-logged with full detail | `testauth1.gs:192-210` |
| Data audit trail | Every data operation logged with user, role, action, resource | `testauth1.gs:937` — `dataAuditLog()` |
| Token discarded | Access token intentionally NOT stored in session | `testauth1.gs` — comment in session creation |
| Session IDs truncated | Session tokens truncated to 8 chars in all logs | Audit log functions |

**Original gap — CLOSED:** Different roles now have different permission sets. A `viewer` cannot write; a `billing` role cannot delete. The `checkPermission()` gate ensures minimum necessary access per operation.

---

## Items Enhanced (Status Unchanged, But Significantly Improved)

### #2 — Person/Entity Authentication: ✅ → ✅ Hardened

**What changed:** The token exchange mechanism was completely rebuilt for security.

| Version | Improvement | File:Line |
|---------|-------------|-----------|
| v01.81g | Secure page nonce handshake — credentials delivered via private postMessage channel, not URL | `testauth1.gs` — nonce handshake flow |
| v01.83g | Secure token generation endpoint added | `testauth1.gs` |
| v01.84g | Blocked direct script URL access — only one-time tokens accepted; tokens expire in 60 seconds | `testauth1.gs` |
| v01.88g | Replaced direct-access protection with more reliable method | `testauth1.gs` |

**Impact:** Eliminated token-in-URL exposure (browser history, server logs, referrer headers). The postMessage three-phase handshake in HIPAA mode now uses one-time tokens that expire in 60 seconds.

---

### #4 — Automatic Logoff: ✅ → ✅ Enhanced with Cross-Page

**What changed:** Session management now spans across pages.

| Version | Improvement |
|---------|-------------|
| v02.62w | Cross-page sign-out — signing out from any page signs out all connected pages |
| v02.67w-v02.73w | SSO session recovery on page refresh — no unnecessary re-authentication |
| v02.74w | Separate "Sign Out" (this page) and "Sign Out All" (all pages) buttons |

**Impact:** Sessions are now managed holistically across all connected pages, not per-page.

---

### #12 — Transmission Integrity: ✅ → ✅ Hardened

**What changed:** Message signing moved from client-side to server-side.

| Version | Improvement | File:Line |
|---------|-------------|-----------|
| v01.48g | Server-side message signing replaces client-side — HMAC-SHA256 with deterministic payload | `testauth1.gs:1027` — `signMessage()` |
| v01.56g | All app messages now signed with stronger crypto | `testauth1.gs` |

**Impact:** HMAC signing is now performed server-side where the key is protected, rather than trusting the client with the signing key. Client-side verification uses Web Crypto API with non-extractable keys (`testauth1.html:1432` — `_importHmacKey()`, `testauth1.html:1450` — `_verifyHmacSha256()`).

---

### #16 — Log-in Monitoring: ✅ → ✅ Hardened

**What changed:** Attack reporting flood protection was added.

| Version | Improvement | File:Line |
|---------|-------------|-----------|
| v01.45g | Security reports capped at 50 per 5 minutes across all sources | `testauth1.gs:1768` — `processSecurityEvent()` |
| v01.43g | Server receives and logs blocked attack reports from client-side | `testauth1.html:1382` — `_reportSecurityEvent()` |

**Impact:** Prevents DoS via security event flooding while maintaining comprehensive attack logging.

---

### #17 — Security Incident Response: ✅ → ✅ Enhanced

**What changed:** Security keys now auto-generate, removing a manual setup step that could be forgotten.

| Version | Improvement |
|---------|-------------|
| v01.78g | HMAC keys auto-generate on first deploy — no manual Script Properties setup required |
| v01.77g | Cross-project admin secret moved to per-project storage |

**Impact:** Eliminates the risk of deploying without security keys configured. Fail-closed design: missing HMAC secret still prevents session creation (`testauth1.gs:260` — `ENABLE_HMAC_INTEGRITY: true`).

---

## New Security Features (Beyond the 40-Item Checklist)

These features don't map directly to a specific HIPAA checklist item but significantly strengthen the overall security posture.

### Single Sign-On (SSO) — v02.62w+

| Aspect | Detail |
|--------|--------|
| Mechanism | BroadcastChannel-based cross-page token sharing (`sais-sso-auth`) |
| How it works | Authenticated pages can respond to `sso-token-request` from other pages, sharing the Google access token for seamless authentication |
| SSO Provider flag | `SSO_PROVIDER: false` config option — when enabled, a page proactively re-acquires tokens after reconnect to serve as the SSO hub |
| Security | Same-origin only (BroadcastChannel requires same-origin access); tokens are ephemeral in-memory |
| HIPAA relevance | Reduces re-authentication friction without compromising security; each page still independently validates sessions with GAS backend |
| Code | `testauth1.html:1121-1125` — SSO state variables; `testauth1.html:487` — `SSO_PROVIDER` config |

### Admin Session Management Panel — v02.68w+

| Aspect | Detail |
|--------|--------|
| Access | Admin-role users only (enforced by `checkPermission(user, 'admin', ...)` on GAS side) |
| Capabilities | View all active sessions (email, role, timers), remotely sign out any user |
| Session detail | Creation time, last activity, remaining time (rolling + absolute), emergency access flag |
| HIPAA relevance | Directly addresses §164.308(a)(3)(ii)(C) termination procedures — admin can immediately revoke access without editing the ACL spreadsheet |
| Code | `testauth1.gs:454` — `listActiveSessions()`; `testauth1.gs:523` — `adminSignOutUser()`; `testauth1.html:271-311,387` — panel UI |

### Cross-Project Administration — v01.77g

| Aspect | Detail |
|--------|--------|
| Mechanism | Secret-based validation for cross-project admin access |
| How it works | Central admin can view/manage sessions across multiple GAS projects from a single dashboard |
| Security | Per-project admin secret stored in Script Properties; validates caller email + ACL admin role |
| Code | `testauth1.gs:637` — `validateCrossProjectAdmin()` |

### Secure Token Generation Endpoint — v01.83g-v01.84g

| Aspect | Detail |
|--------|--------|
| Problem solved | Previous flow exposed session tokens in URL parameters (browser history, server logs, referrer headers) |
| Solution | One-time tokens with 60-second expiry; direct script URL access blocked; nonce handshake via postMessage |
| HIPAA relevance | Eliminates token leakage vectors — critical for §164.312(e) transmission security |

### IP Logging Disabled (HIPAA-Aware Decision)

| Aspect | Detail |
|--------|--------|
| Decision | IP logging intentionally disabled in HIPAA preset |
| Reason | ipify.org (the IP lookup service) lacks a Business Associate Agreement (BAA) — using it would transmit user metadata to an uncovered third party |
| Code comment | `"ipify.org lacks BAA, violates HIPAA (Phase 3: C-3)"` |
| HIPAA relevance | Demonstrates Privacy Rule awareness — §164.502(a) prohibits disclosures to entities without BAA coverage |

### Auto-Registration in Master ACL — v01.77g+

| Aspect | Detail |
|--------|--------|
| Mechanism | Project auto-registers itself in the Master ACL Spreadsheet on first load |
| Creates | Metadata rows (#NAME, #URL, #AUTH) in the Access tab |
| HIPAA relevance | Ensures every project is tracked in the central access control system — no "shadow" deployments |

---

## Remaining Gaps — Updated Priority Analysis

### 🔴 Priority 1 — Current Law (Must Fix for Compliance)

#### #19 — Disclosure Accounting ❌ Not Implemented

**CFR:** §164.528 — **Required** (Privacy Rule)

**Gap:** No mechanism to track PHI disclosures to external parties. The audit log tracks internal *access* (who logged in, who read data) but not *disclosures* (instances where PHI was shared with other entities).

**What's needed:**
- Disclosure log: who was PHI disclosed to, what PHI, when, why
- 6-year history retention
- On-demand reporting endpoint (individual can request their disclosure history)
- Exemptions for treatment/payment/operations disclosures (§164.528(a)(1))

**Mitigation:** If the application never discloses PHI to external parties (all data stays within the system), the TPO exemption covers most scenarios. However, the capability must exist for non-exempt disclosures.

---

#### #23 — Right of Access ❌ Not Implemented

**CFR:** §164.524 — **Required** (Privacy Rule)

**Gap:** No data export functionality. Individuals cannot request and download their ePHI.

**What's needed:**
- Data export endpoint returning all PHI for a given individual
- Format options (at minimum: electronic format; ideally JSON/CSV)
- 30-day response window (organizational process)
- Access request logging

**Mitigation:** Currently manual export from Google Sheets is possible — does not scale for production.

---

#### #24 — Right to Amendment ❌ Not Implemented

**CFR:** §164.526 — **Required** (Privacy Rule)

**Gap:** No amendment workflow. `saveNote()` creates records but there is no update, versioning, or amendment capability.

**What's needed:**
- Amendment request submission mechanism
- Review workflow (approve or deny with documentation)
- Append-only history (never delete original, only annotate)
- Denial documentation with right to disagree
- 60-day response window

---

### 🟡 Priority 2 — Current Law (Should Fix)

#### #18 — 6-Year Retention ⚠️ Partial

**CFR:** §164.316(b)(2)(i) — **Required**

**Gap:** `AUDIT_LOG_RETENTION_YEARS: 6` is declared at `testauth1.gs:259` but the value is never read by any code — it's a configuration declaration, not enforcement.

**What's needed:**
- Scheduled archival of audit data older than retention period
- Protection against premature deletion (lock mechanism)
- Retention policy enforcement script (time-driven trigger)

**Mitigation:** Google Sheets retains data indefinitely unless manually deleted — passively meets the requirement. Document this in risk analysis.

---

#### #28 — Breach Detection ⚠️ Partial

**CFR:** §164.404

**Gap:** Security events are detected and logged (HMAC failures, brute force, tampered messages) but there is no automated alerting. A human must review audit logs to discover a breach.

**What's needed:**
- Email alerts when security events exceed a threshold (e.g., Tier 3 lockout triggers email to security officer)
- Configurable alert thresholds
- Dashboard or summary report endpoint

**Strengths already in place:** Escalating lockout (3 tiers), client-side attack reporting (`_reportSecurityEvent()`), security event processing with flood prevention (`processSecurityEvent()` at `testauth1.gs:1768`).

---

#### #31 — Breach Logging ❌ Not Implemented

**CFR:** §164.408(c)

**Gap:** No dedicated breach log separate from the security audit trail.

**What's needed:**
- Breach tracking sheet/system: confirmed breaches, risk assessments, notification timelines, affected individuals, remediation actions
- 6-year retention for breach documentation
- Structured format for HHS reporting (§164.408)

---

### 🟢 Priority 3 — Document and Monitor

#### #10 — Encryption at Rest ⚠️ Partial (Documented)

**CFR:** §164.312(a)(2)(iv) — **Addressable**

**Status unchanged.** Session data in CacheService is plaintext JSON (integrity-protected by HMAC but not encrypted). ePHI at rest relies on Google's infrastructure-level AES-256 encryption.

**Recommendation:** This is a reasonable position for an Addressable specification. Document in the organizational risk analysis:
- Google encrypts all data at rest with AES-256 (infrastructure level)
- CacheService data is ephemeral (max 6-hour TTL) and server-side only
- Application-layer encryption would add minimal security benefit given Google's infrastructure controls
- The HMAC integrity protection prevents unauthorized *modification* even if data were exposed

**NPRM impact:** If the 2025 NPRM is finalized, encryption becomes Required (no alternatives). Google's infrastructure encryption likely qualifies, but should be formally assessed.

---

## Test Configuration Warnings

**CRITICAL:** The following values are set to test values (`⚡ TEST VALUE`) and MUST be changed before production deployment. Both presets (standard and hipaa) currently use shortened values for development convenience.

### HIPAA Preset Test Values

| Config | Test Value | Production Value | File:Line |
|--------|-----------|-----------------|-----------|
| `SESSION_EXPIRATION` | 180s (3min) | 900s (15min) | `testauth1.gs:244` |
| `ABSOLUTE_SESSION_TIMEOUT` | 300s (5min) | 28800s (8hr) | `testauth1.gs:246` |
| `HEARTBEAT_INTERVAL` (GAS) | 30s | 300s (5min) | `testauth1.gs:249` |
| `OAUTH_TOKEN_LIFETIME` | 180s (3min) | 3600s (1hr) | `testauth1.gs:252` |
| `HEARTBEAT_INTERVAL` (HTML) | 30000ms (30s) | 300000ms (5min) | `testauth1.html:470` |

### Standard Preset Test Values

| Config | Test Value | Production Value | File:Line |
|--------|-----------|-----------------|-----------|
| `SESSION_EXPIRATION` | 180s (3min) | 3600s (1hr) | `testauth1.gs:213` |
| `ABSOLUTE_SESSION_TIMEOUT` | 300s (5min) | 28800s (8hr) | `testauth1.gs:215` |
| `HEARTBEAT_INTERVAL` (GAS) | 30s | 300s (5min) | `testauth1.gs:218` |
| `OAUTH_TOKEN_LIFETIME` | 180s (3min) | 3600s (1hr) | `testauth1.gs:221` |

### Project Override Active

```
PROJECT_OVERRIDES = { ENABLE_DOMAIN_RESTRICTION: false }
```

The HIPAA preset enables domain restriction (`ENABLE_DOMAIN_RESTRICTION: true`) but the project override disables it. For production with real ePHI, domain restriction should be enabled to limit access to authorized Google Workspace domains.

---

## NPRM Readiness Assessment

The 2025 HIPAA Security Rule NPRM proposes significant changes. Here is testauth1's readiness if these proposals become law:

| # | Proposed Requirement | Readiness | Notes |
|---|---------------------|-----------|-------|
| #8 | Multi-Factor Authentication | ⚠️ **Partial** | Delegated to Google OAuth — if user has Google 2FA enabled, MFA is satisfied. App does NOT enforce 2FA. Would need: (a) restrict to Workspace accounts with enforced 2FA, or (b) add app-level second factor |
| #9 | 1-Hour Access Termination | ✅ **Ready** | 15-minute session timeout (production) + immediate `invalidateAllSessions()` + admin "Kick" panel. Already exceeds 60-minute requirement |
| #13 | Mandatory Encryption | ⚠️ **Partial** | Transit: ✅ fully encrypted (HTTPS + HMAC). At-rest: Google infrastructure AES-256 — likely qualifies but needs formal assessment |
| #35 | 72-Hour Recovery | ⚠️ **Partial** | Code recovery via GitHub self-update; data recovery via Google Sheets revision history. No formal DR testing |
| #36 | Patch Management | ❌ | No patch management pipeline for GAS dependencies |
| #37 | Vulnerability Scanning | ❌ | No automated scanning |
| #38 | Penetration Testing | ❌ | Not performed |
| #39 | Network Segmentation | ✅ **Inherent** | GAS runs in Google's isolated sandbox; GitHub Pages is static. Architecturally segmented |
| #40 | Asset Inventory | ❌ | No formal technology asset inventory (though Master ACL auto-registration tracks deployed projects) |

---

## Recommended Implementation Roadmap

### Phase A — Privacy Rule Compliance (P1)
**Items:** #19 Disclosure Accounting, #23 Right of Access, #24 Right to Amendment
**Impact:** Most critical for patient rights — these are Required specifications under current law
**Approach:**
- Build a `DisclosureLog` sheet in the Project Data Spreadsheet
- Add `exportMyData(sessionToken)` GAS endpoint for individual data export (JSON format)
- Build amendment request submission and review workflow with append-only history
- All three share a common pattern: new sheet + new GAS endpoint + audit logging

### Phase B — Breach Infrastructure (P2)
**Items:** #28 Breach Detection (automated alerting), #31 Breach Logging
**Impact:** Critical for incident response readiness
**Approach:**
- Add email alerting via `MailApp.sendEmail()` when security events exceed configurable thresholds
- Create `BreachLog` sheet with structured fields: breach ID, discovery date, scope, affected individuals, risk assessment, notification status, remediation
- Time-driven trigger for periodic breach report generation

### Phase C — Retention Enforcement (P2)
**Items:** #18 6-Year Retention
**Impact:** Ensures long-term audit trail preservation
**Approach:**
- Create time-driven trigger that archives audit entries older than retention period to a separate locked spreadsheet
- Add sheet protection that prevents deletion of audit data
- Read and enforce `AUDIT_LOG_RETENTION_YEARS` config value

### Phase D — Production Hardening
**Items:** Test values → production values, domain restriction, risk analysis documentation
**Impact:** Deployment readiness
**Approach:**
- Switch all `⚡ TEST VALUE` entries to production values
- Enable `ENABLE_DOMAIN_RESTRICTION: true` (remove project override)
- Document encryption at-rest risk analysis per §164.306(b) flexibility of approach
- Conduct formal security evaluation per §164.308(a)(8)

---

## Compliance Strengths — Exceeding Requirements

These implementations go beyond HIPAA minimum requirements and demonstrate defense-in-depth:

| Area | Strength | Exceeds |
|------|----------|---------|
| Session timeout | Both rolling (15min) AND absolute (8hr) timeouts | §164.312(a)(2)(iii) only requires inactivity timeout |
| Message integrity | HMAC-SHA256 message signing on top of TLS | §164.312(e)(2)(i) only requires transport integrity |
| Audit logging | Dual audit logs: session-level + data-level | §164.312(b) requires audit controls — dual logging exceeds |
| Login monitoring | Three-tier escalating lockout (5min → 30min → 6hr) | §164.308(a)(5)(ii)(C) only requires monitoring and reporting |
| Data integrity | Fail-closed HMAC with non-extractable client keys | §164.312(c)(2) only requires corroboration mechanism |
| RBAC enforcement | Per-operation permission validation with audit trail | §164.308(a)(4)(ii) only requires access authorization policies |
| Token exchange | One-time tokens, 60s expiry, nonce handshake, no URL exposure | No specific HIPAA requirement — pure defense-in-depth |
| Admin controls | Real-time session management panel with remote sign-out | §164.308(a)(3)(ii)(C) only requires termination procedures |
| IP logging decision | Intentionally disabled due to third-party BAA gap | Demonstrates Privacy Rule awareness beyond technical controls |

---

## Document History

| Date | Version | Change |
|------|---------|--------|
| 2026-03-19 | 1.0 | Original compliance assessment — `HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md` |
| 2026-03-23 | 1.0 | Follow-up implementation progress — this document |

### Related Documents

| Document | Purpose |
|----------|---------|
| `HIPAA-TESTAUTH1-COMPLIANCE-REPORT.md` | Original 40-item compliance evaluation (2026-03-19) |
| `HIPAA-CODING-REQUIREMENTS.md` | Complete HIPAA regulatory reference (45 CFR Part 164) |
| `HIPAA-COMPLIANCE-REFERENCE.md` | Quick-reference compliance summary (superseded by CODING-REQUIREMENTS) |
| `GAS-HIPAA-COMPLIANCE-ANALYSIS.md` | Google Workspace BAA coverage analysis for Apps Script |

---

Developed by: ShadowAISolutions
