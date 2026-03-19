# Template Update Plan: Sync Auth Templates with testauth1

> **Status:** Draft — awaiting developer approval
> **Created:** 2026-03-19
> **Scope:** Update `gas-minimal-auth-template-code.js.txt`, `gas-test-auth-template-code.js.txt`, `HtmlAndGasTemplateAutoUpdate-auth.html.txt`, and `setup-gas-project.sh`

---

## Overview

testauth1 has evolved significantly beyond the current auth templates. This plan brings the templates up to parity while keeping them **generic** (no test-specific values, no project-specific RBAC roles).

### What testauth1 has that the templates don't

| Feature | GAS | HTML | Priority |
|---------|-----|------|----------|
| RBAC system (roles, permissions, spreadsheet-driven) | ✅ | ✅ (stores role/perms) | High |
| Cache epoch system (nuclear cache clear) | ✅ | — | High |
| HMAC-SHA256 cryptographic signing (Web Crypto API) | ✅ | ✅ | High |
| Admin session management (list/kick active sessions) | ✅ | ✅ (admin panel UI) | High |
| Cross-device session enforcement | ✅ | ✅ | High |
| Tab takeover system (BroadcastChannel) | — | ✅ | High |
| Warning banners (session + absolute timeout) | — | ✅ | Medium |
| CSP meta tag + changelog sanitization | — | ✅ | Medium |
| Nonce-based CSRF protection | — | ✅ | High |
| postMessage nonce exchange | — | ✅ | High |
| Origin validation function | — | ✅ | High |
| Auth UI state variations (reconnecting, signing-in) | — | ✅ | Medium |
| Deferred AudioContext initialization | — | ✅ | Low |
| Security event reporting (postMessage-based) | ✅ | ✅ | Medium |
| Data operation validation (`validateSessionForData`) | ✅ | — | Medium |
| Data audit logging | ✅ | — | Medium |
| Admin utilities (clearCache, inspectCache) | ✅ | — | Low |
| Enhanced config toggles (10+ new flags) | ✅ | ✅ | High |

---

## Phase 1: GAS Auth Template Update (`gas-minimal-auth-template-code.js.txt`)

**Estimated effort:** 1 session

### 1.1 Configuration & Presets

**Add to PRESETS (both standard and hipaa):**
- `ENABLE_CROSS_DEVICE_ENFORCEMENT` — standard: `true`, hipaa: `true`
- `ENABLE_DATA_OP_VALIDATION` — standard: `false`, hipaa: `true`
- `ENABLE_DOM_CLEARING_ON_EXPIRY` — standard: `false`, hipaa: `true`
- `ENABLE_ESCALATING_LOCKOUT` — standard: `false`, hipaa: `true`
- `ENABLE_IP_LOGGING` — both: `false` (never enable — ipify.org lacks BAA)
- `ENABLE_DATA_AUDIT_LOG` — standard: `false`, hipaa: `true`
- `DATA_AUDIT_LOG_SHEET_NAME` — both: `'DataAuditLog'`

**Use production values (NOT testauth1's test values):**
- `SESSION_EXPIRATION` — standard: `3600`, hipaa: `900`
- `ABSOLUTE_SESSION_TIMEOUT` — both: `28800`
- `HEARTBEAT_INTERVAL` — both: `300`
- `OAUTH_TOKEN_LIFETIME` — both: `3600`
- `OAUTH_REFRESH_BUFFER` — both: `300`

### 1.2 RBAC System

**Add (from testauth1 lines 48-205):**
- `RBAC_ROLES_FALLBACK` — generic roles: `admin`, `editor`, `viewer` (NOT clinician/billing — those are project-specific)
- `getRolesFromSpreadsheet()` — 3-tier caching (execution → CacheService → spreadsheet)
- `hasPermission(role, permission)` — simple permission check
- `checkPermission(user, requiredPermission, operationName)` — throws PERMISSION_DENIED

**Generic role structure:**
```javascript
var RBAC_ROLES_FALLBACK = {
  admin:  ['read', 'write', 'delete', 'export', 'admin'],
  editor: ['read', 'write', 'export'],
  viewer: ['read']
};
```

### 1.3 Cache Epoch System

**Add (from testauth1 lines 71-95):**
- `_getCacheEpoch()` — reads/writes epoch to ScriptProperties
- `getEpochCache()` — returns wrapper that auto-prefixes cache keys

### 1.4 HMAC-SHA256 Signing

**Replace** the existing simple hash with (from testauth1 lines 794-870):
- `generateSessionHmac(sessionData)` — server-side HMAC-SHA256
- `verifySessionHmac(sessionData)` — verify session integrity
- `signMessage(msgObj, messageKey)` — sign outgoing postMessages

### 1.5 Enhanced Session Management

**Add:**
- `validateSessionForData(sessionToken, operationName)` — per-operation session+permission validation
- Role and permissions in session data object
- Cross-device enforcement logic in `validateSession()`

### 1.6 Admin Functions

**Add (from testauth1 lines 454-551):**
- `listActiveSessions(sessionToken)` — admin-only session list
- `adminSignOutUser(sessionToken, targetEmail)` — admin kick

### 1.7 Admin Utilities

**Add (from testauth1 lines 312-447):**
- `clearAccessCacheForUser(email)`
- `clearAllAccessCache()` — increment cache epoch
- `inspectCache()` — diagnostic tool

### 1.8 Data Audit Logging

**Add (from testauth1 lines 752-792):**
- `dataAuditLog(user, action, resourceType, resourceId, details)` — toggle-gated

### 1.9 Security Event Processing

**Add (from testauth1 lines 1550-1586):**
- `processSecurityEvent(eventType, details)` — server-side event handler

### 1.10 Enhanced doGet()

**Update doGet() to include:**
- Security event reporting endpoint
- Admin session list endpoint
- Admin signout endpoint
- User activity tracking via postMessage
- Return role + permissions in app HTML response
- Signed messages using HMAC

### 1.11 Signout Processing

**Add (from testauth1 lines 1534-1549):**
- `processSignOut(token)` — dedicated signout with signed response

---

## Phase 2: HTML Auth Template Update (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`)

**Estimated effort:** 1 session

### 2.1 Security Hardening

- **CSP meta tag** — add with `unsafe-inline` default + commented hardened version
- **Changelog sanitization** — `sanitizeChangelogHtml()` function
- **Origin validation** — `_isValidGasOrigin()` function
- **Nonce-based CSRF** — `_authNonce` for token requests
- **postMessage nonce exchange** — `_pendingNonce` with `crypto.getRandomValues()`

### 2.2 HMAC-SHA256 Client-Side

**Replace** simple hash verification with:
- `_hmacKey`, `_hmacKeySet` — Web Crypto API key objects
- `_importHmacKey()` — async key import
- `_verifyHmacSha256()` — async signature verification
- Async message verification pipeline

### 2.3 Session Storage Enhancements

- Add `ROLE_KEY` and `PERMISSIONS_KEY` to storage
- Enhance `saveSession()` to accept and save role + permissions
- Enhance `loadSession()` to return role + permissions

### 2.4 Tab Takeover System

- **CSS:** `.auth-spinner`, `.auth-pulse-dots` animations
- **HTML:** `#tab-takeover-wall` overlay with "Use Here" button
- **JS:** BroadcastChannel-based `_signOutChannel`, `_tabId`, tab-roll-call/present/takeover protocol
- **Config:** `SINGLE_TAB_ENFORCEMENT` toggle

### 2.5 Warning Banners

- **Replace** single `#reauth-banner` with dual banners:
  - `#session-warning-banner` (yellow — rolling session expiring)
  - `#absolute-warning-banner` (red — absolute timeout approaching)
- Both with countdown text and reauth button

### 2.6 Admin Session Management Panel

- **CSS:** Admin button, panel, session list, role badges, emergency styling
- **HTML:** `#admin-sessions-btn`, `#admin-sessions-panel`, `#admin-sessions-iframe`
- **JS:** Admin panel open/close/refresh, session list rendering, kick button handlers
- **RBAC gating:** `data-requires-role="admin"` attribute

### 2.7 Auth UI State Variations

- **HTML:** Three auth-wall states: `#auth-wall-signin`, `#auth-wall-reconnecting`, `#auth-wall-signing-in`
- **JS:** Dynamic state switching based on auth flow

### 2.8 Config Additions

**Add to HTML_CONFIG:**
- `SINGLE_TAB_ENFORCEMENT: true`
- `CROSS_DEVICE_ENFORCEMENT: true`
- `ENABLE_DOM_CLEARING_ON_EXPIRY: false` (standard default)
- `ENABLE_IP_LOGGING: false`

### 2.9 Security Event Reporting

**Replace** iframe-based reporting with postMessage-based:
- `_reportSecurityEvent()` with rate limiting
- Hidden iframe with `action=securityEvent`
- Wait for `gas-security-event-ready` signal

### 2.10 New Message Types

**Add handlers for:**
- `gas-heartbeat-error`, `gas-heartbeat-ready`
- `gas-signout-ready`, `gas-security-event-ready`
- `gas-user-activity`, `gas-session-invalid`
- `gas-admin-sessions-ready`, `gas-admin-sessions-list`, `gas-admin-sessions-error`
- `gas-admin-signout-result`, `gas-admin-signout-error`

### 2.11 Deferred AudioContext

- Change `_audioCtx` from immediate creation to `null`
- Add `_ensureAudioCtx()` function called on first user gesture

### 2.12 Cross-Device Enforcement Client-Side

- `_evictedByRemote` flag
- Heartbeat error detection for cross-device eviction
- "Session Active Elsewhere" overlay

---

## Phase 3: GAS Test Auth Template Update (`gas-test-auth-template-code.js.txt`)

**Estimated effort:** 0.5 session (mostly inherits from Phase 1)

The test-auth template is the minimal-auth template + test/diagnostic functions. After Phase 1 updates the minimal-auth template, the test-auth template needs:

- All Phase 1 changes propagated to the auth section
- Existing test/diagnostic functions preserved (getSoundBase64, writeVersionToSheet, readB1, etc.)
- doGet() updated to include all new endpoints alongside test UI
- Fix `postMessage` target to use `PARENT_ORIGIN` instead of `"*"` (security gap inherited from test template)

---

## Phase 4: Script Updates (`setup-gas-project.sh`)

**Estimated effort:** 0.5 session

### 4.1 New Placeholder Handling

The setup script needs new sed patterns for auth templates:

| New Placeholder | Replacement Source |
|----------------|-------------------|
| `MASTER_ACL_SPREADSHEET_ID` | Already handled |
| `ACL_SHEET_NAME` | Already handled |
| `ACL_PAGE_NAME` | Already handled |
| (No new placeholders needed for most new features — they use config toggles, not project-specific values) |

### 4.2 Template Pattern Updates

If variable declarations change format (spacing, quotes, etc.) during the template update, corresponding sed patterns in setup-gas-project.sh must be updated to match. **Document all sed pattern dependencies** and verify each one after template changes.

Key patterns to verify:
- `var TITLE = .*;` — spacing and semicolon
- `var DEPLOYMENT_ID = .*;`
- `var SHEET_NAME     = .*;` — exact multi-space alignment
- `var GITHUB_OWNER  = .*;` — exact two-space alignment
- `var GITHUB_REPO   = .*;` — exact three-space alignment
- `var _e = '[^']*';` — single-quote string
- `<title>.*</title>` — greedy match
- `var CLIENT_ID = '[^']*';` — auth-only
- `var ACTIVE_PRESET = '[^']*';` — auth-only
- `ALLOWED_DOMAINS: \[\]` — auth-only
- `ENABLE_DOMAIN_RESTRICTION: false` — auth-only

### 4.3 Config JSON Updates

If `<page-name>.config.json` structure changes (new fields), update:
- The JSON template in setup-gas-project.sh
- The sync logic in Pre-Commit #15 (GAS config sync)

---

## Phase 5: Noauth Template Sync

**Estimated effort:** 0.25 session

Features from the auth template that also apply to noauth:
- CSP meta tag (with simpler policy — no auth endpoints)
- Changelog sanitization
- Deferred AudioContext initialization
- Any CSS/structural improvements

Features that do NOT apply to noauth:
- Everything auth-related (session, HMAC, admin, RBAC, tab takeover, warning banners, etc.)

---

## What gets EXCLUDED from templates

These testauth1-specific items are **not** brought to the templates:

1. **Test timeout values** — 30s heartbeat, 3min session, etc. → use production values
2. **Project-specific RBAC roles** — `clinician`, `billing` → use generic `admin`, `editor`, `viewer`
3. **Security test panel UI** — `#security-test-panel`, "Run Security Tests" button → project-specific diagnostic
4. **Force heartbeat panel** — `#force-heartbeat-panel` → test-only
5. **`saveNote()` function** — example data operation → leave as commented example or remove
6. **Test value override comments** — `⚡ TEST VALUE` annotations → not applicable to templates

---

## Execution Order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
  GAS       HTML      Test GAS   Scripts   Noauth
```

Each phase is one commit+push cycle. Phases can be done across sessions.

---

## Risk Mitigation

1. **Backup templates before starting** — `repository-information/backups/`
2. **Verify setup-gas-project.sh after each phase** — dry-run the script to confirm sed patterns still match
3. **Test propagation** — after template updates, verify Pre-Commit #20 (Template Source Propagation) correctly identifies the changes that should propagate to existing pages
4. **Preserve PROJECT OVERRIDE markers** — any overrides in existing pages (testauth1, etc.) must be respected during propagation

Developed by: ShadowAISolutions
