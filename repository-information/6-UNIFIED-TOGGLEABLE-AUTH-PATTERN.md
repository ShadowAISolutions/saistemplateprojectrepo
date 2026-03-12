# Unified Toggleable Google OAuth Authentication Pattern

Implementation-ready reference for a **config-driven** Google OAuth authentication system in GAS web apps embedded via iframe. This pattern unifies patterns 3–5 into a single codebase where every HIPAA/security feature is controlled by a configuration object — deploy as standard or HIPAA-compliant by changing config values, not code.

> **Relationship to other patterns**:
> - [1-CUSTOM-AUTH-PATTERN.md](1-CUSTOM-AUTH-PATTERN.md) — custom username/password auth (separate architecture, not unified here)
> - [2-GOOGLE-OAUTH-AUTH-PATTERN.md](2-GOOGLE-OAUTH-AUTH-PATTERN.md) — basic pattern (raw token in localStorage, no server sessions)
> - [3-IMPROVED-GOOGLE-OAUTH-PATTERN.md](3-IMPROVED-GOOGLE-OAUTH-PATTERN.md) — server sessions, opaque tokens, silent re-auth
> - [4-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md](4-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md) — research-validated (strict origin, re-auth fallback, CacheService caveats)
> - [5-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md](5-HIPAA-RESEARCHED-IMPROVED-GOOGLE-OAUTH-PATTERN.md) — HIPAA-compliant (audit logging, domain restriction, HMAC integrity)
> - **This document** — unified version with toggleable features, one codebase for all security levels

> **Design philosophy**: implement the superset (pattern 5), then gate every HIPAA-specific feature behind a config toggle. The code always contains all features — the config determines which are active. This eliminates code drift between security levels and makes upgrades a config change, not a code migration.

> **When to use this pattern**: when you need the flexibility to deploy the same codebase at different security levels (standard internal tool vs. HIPAA-regulated healthcare app) or when you want a single reference implementation that covers all cases.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Configuration System](#2-configuration-system)
3. [Presets — Standard vs HIPAA](#3-presets--standard-vs-hipaa)
4. [Config Resolution & Merging](#4-config-resolution--merging)
5. [GAS vs HTML Responsibility Split](#5-gas-vs-html-responsibility-split)
6. [Authentication Flow](#6-authentication-flow)
7. [Implementation Guide — GAS Backend](#7-implementation-guide--gas-backend)
8. [Implementation Guide — HTML Shell](#8-implementation-guide--html-shell)
9. [postMessage Protocol](#9-postmessage-protocol)
10. [Audit Logging System (Toggleable)](#10-audit-logging-system-toggleable)
11. [HMAC Integrity (Toggleable)](#11-hmac-integrity-toggleable)
12. [Domain Restriction (Toggleable)](#12-domain-restriction-toggleable)
13. [Emergency Access (Toggleable)](#13-emergency-access-toggleable)
14. [CacheService Behavioral Caveats](#14-cacheservice-behavioral-caveats)
15. [Security Checklist](#15-security-checklist)
16. [Migration Guide](#16-migration-guide)
17. [Feature Toggle Matrix](#17-feature-toggle-matrix)
18. [Six-Pattern Comparison](#18-six-pattern-comparison)
19. [Troubleshooting](#19-troubleshooting)

---

## 1. Architecture Overview

> **Where the logic lives**: identical to patterns 3–5 — the GAS server owns all security. The HTML wrapper is a thin shell. The key difference is the **config object** that controls which security features are active.

```
┌─────────────────────────────────────────────────────────────────┐
│  HTML Wrapper (GitHub Pages / Custom Domain)                    │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────────────────────┐   │
│  │  Auth Wall        │    │  GAS iframe (full-screen)         │   │
│  │  (Sign In /       │    │  ┌────────────────────────────┐  │   │
│  │   Access Denied)  │    │  │  GAS Web App               │  │   │
│  │                   │    │  │  AUTH_CONFIG controls:      │  │   │
│  │  [Sign In with    │    │  │  ✓ Session TTL             │  │   │
│  │   Google]         │    │  │  ✓ Domain restriction      │  │   │
│  └──────────────────┘    │  │  ✓ HMAC integrity          │  │   │
│                           │  │  ✓ Audit logging           │  │   │
│  ┌──────────────────┐    │  │  ✓ Emergency access        │  │   │
│  │  Token storage    │    │  │  ✓ Single-session          │  │   │
│  │  (config-driven:  │    │  └────────────────────────────┘  │   │
│  │   localStorage    │    └──────────────────────────────────┘   │
│  │   OR              │                                          │
│  │   sessionStorage) │    postMessage (strict origin-validated)  │
│  └──────────────────┘    ◄──────────────────────────────────►   │
│                                                                 │
│  HTML_CONFIG controls:                                          │
│  ✓ Storage type (localStorage/sessionStorage)                   │
│  ✓ Token exchange method (URL param/postMessage)                │
│  ✓ Inactivity timeout (optional/mandatory)                      │
│  ✓ Auto-signout behavior                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Configuration System

The configuration system uses a two-layer approach:

1. **Presets** — named configurations (`standard`, `hipaa`) that provide complete default values
2. **Overrides** — per-project values that override specific preset defaults

This design ensures:
- **Zero config for common cases** — select a preset and go
- **Full customization** — override any value without forking the preset
- **Single source of truth** — the resolved config object is the authority for all behavior
- **No code changes for security level changes** — switching presets is a config change

### Config Object Structure

The config is split into two objects: `AUTH_CONFIG` (GAS backend) and `HTML_CONFIG` (HTML wrapper). They are separate because GAS and HTML cannot share runtime state — each reads its own config independently.

**GAS Backend — `AUTH_CONFIG`**:

```javascript
var AUTH_CONFIG = {
  // --- Session ---
  SESSION_EXPIRATION: 1800,        // seconds (standard: 1800 / HIPAA: 900)
  SESSION_REFRESH_WINDOW: 300,     // seconds before expiry to trigger refresh
  MAX_SESSIONS_PER_USER: 0,        // 0 = unlimited, 1+ = enforced limit

  // --- Google OAuth ---
  OAUTH_TOKEN_LIFETIME: 3600,      // Google access tokens last ~1 hour (do not change)
  OAUTH_REFRESH_BUFFER: 900,       // seconds — refresh if less than this remaining

  // --- Domain Restriction ---
  ENABLE_DOMAIN_RESTRICTION: false, // standard: false / HIPAA: true
  ALLOWED_DOMAINS: [],              // e.g. ['yourdomain.com'] — only when enabled

  // --- Audit Logging ---
  ENABLE_AUDIT_LOG: false,          // standard: false / HIPAA: true
  AUDIT_LOG_SHEET_NAME: 'AuditLog',
  AUDIT_LOG_RETENTION_YEARS: 6,     // 45 CFR 164.316(b)(2)(i) minimum

  // --- HMAC Session Integrity ---
  ENABLE_HMAC_INTEGRITY: false,     // standard: false / HIPAA: true
  HMAC_SECRET_PROPERTY: 'HMAC_SECRET', // Script Properties key name

  // --- Emergency Access ---
  ENABLE_EMERGENCY_ACCESS: false,   // standard: false / HIPAA: true
  EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS', // Script Properties key name

  // --- Token Exchange ---
  TOKEN_EXCHANGE_METHOD: 'url',     // 'url' = URL parameter / 'postMessage' = secure handshake
};
```

**HTML Wrapper — `HTML_CONFIG`**:

```javascript
var HTML_CONFIG = {
  // --- Storage ---
  STORAGE_TYPE: 'localStorage',      // 'localStorage' / 'sessionStorage'

  // --- Token Exchange ---
  TOKEN_EXCHANGE_METHOD: 'url',      // must match AUTH_CONFIG.TOKEN_EXCHANGE_METHOD

  // --- Inactivity Timeout ---
  ENABLE_INACTIVITY_TIMEOUT: false,  // standard: false (optional) / HIPAA: true (mandatory)
  CLIENT_INACTIVITY_TIMEOUT: 720000, // ms (12 min — set ≤ SESSION_EXPIRATION)

  // --- Sign-Out ---
  ENABLE_AUTO_SIGNOUT: false,        // standard: false / HIPAA: true
};
```

---

## 3. Presets — Standard vs HIPAA

Presets provide complete, tested configurations. Select one as your baseline, then override individual values as needed.

### Standard Preset (Pattern 4 equivalent)

```javascript
var PRESETS = {
  standard: {
    gas: {
      SESSION_EXPIRATION: 1800,
      SESSION_REFRESH_WINDOW: 300,
      MAX_SESSIONS_PER_USER: 1,
      OAUTH_TOKEN_LIFETIME: 3600,
      OAUTH_REFRESH_BUFFER: 900,
      ENABLE_DOMAIN_RESTRICTION: false,
      ALLOWED_DOMAINS: [],
      ENABLE_AUDIT_LOG: false,
      AUDIT_LOG_SHEET_NAME: 'AuditLog',
      AUDIT_LOG_RETENTION_YEARS: 6,
      ENABLE_HMAC_INTEGRITY: false,
      HMAC_SECRET_PROPERTY: 'HMAC_SECRET',
      ENABLE_EMERGENCY_ACCESS: false,
      EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS',
      TOKEN_EXCHANGE_METHOD: 'url'
    },
    html: {
      STORAGE_TYPE: 'localStorage',
      TOKEN_EXCHANGE_METHOD: 'url',
      ENABLE_INACTIVITY_TIMEOUT: false,
      CLIENT_INACTIVITY_TIMEOUT: 720000,
      ENABLE_AUTO_SIGNOUT: false
    }
  }
};
```

### HIPAA Preset (Pattern 5 equivalent)

```javascript
PRESETS.hipaa = {
  gas: {
    SESSION_EXPIRATION: 900,           // 15 min (HIPAA standard)
    SESSION_REFRESH_WINDOW: 180,       // 3 min
    MAX_SESSIONS_PER_USER: 1,          // enforced
    OAUTH_TOKEN_LIFETIME: 3600,
    OAUTH_REFRESH_BUFFER: 900,
    ENABLE_DOMAIN_RESTRICTION: true,   // Workspace-only
    ALLOWED_DOMAINS: [],               // MUST be set per-project
    ENABLE_AUDIT_LOG: true,            // 45 CFR 164.312(b) — required
    AUDIT_LOG_SHEET_NAME: 'AuditLog',
    AUDIT_LOG_RETENTION_YEARS: 6,
    ENABLE_HMAC_INTEGRITY: true,       // 45 CFR 164.312(c)(1)
    HMAC_SECRET_PROPERTY: 'HMAC_SECRET',
    ENABLE_EMERGENCY_ACCESS: true,     // 45 CFR 164.312(a)(2)(ii)
    EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS',
    TOKEN_EXCHANGE_METHOD: 'postMessage' // RFC 6750 §2.3
  },
  html: {
    STORAGE_TYPE: 'sessionStorage',      // cleared on tab close
    TOKEN_EXCHANGE_METHOD: 'postMessage', // matches GAS config
    ENABLE_INACTIVITY_TIMEOUT: true,     // mandatory for HIPAA
    CLIENT_INACTIVITY_TIMEOUT: 720000,   // 12 min
    ENABLE_AUTO_SIGNOUT: true            // inactivity → auto sign-out
  }
};
```

### HIPAA Preset Validation

When using the `hipaa` preset, the config resolution step (Section 4) runs mandatory validation:

| Check | Condition | Error |
|-------|-----------|-------|
| `ALLOWED_DOMAINS` not empty | `ALLOWED_DOMAINS.length > 0` | "HIPAA preset requires ALLOWED_DOMAINS — set your Workspace domain(s)" |
| `HMAC_SECRET` exists | Script Properties has `HMAC_SECRET` key | Warning logged — HMAC will fail open until configured |
| `TOKEN_EXCHANGE_METHOD` match | GAS and HTML configs have same value | "TOKEN_EXCHANGE_METHOD mismatch between GAS and HTML configs" |
| Session timeout ≤ 15 min | `SESSION_EXPIRATION <= 900` | Warning — HIPAA standard recommends ≤15 minutes |

---

## 4. Config Resolution & Merging

Config resolution follows this priority (highest wins):

```
Per-project overrides  →  Preset defaults  →  Hardcoded fallbacks
```

### GAS Backend Resolution

```javascript
// =============================================
// CONFIG RESOLUTION — GAS Backend
// Select a preset, then apply per-project overrides.
// This runs once at script load time.
// =============================================

// Step 1: Choose your preset
var ACTIVE_PRESET = 'standard';  // Change to 'hipaa' for HIPAA compliance

// Step 2: Per-project overrides (optional)
// Only include values you want to change from the preset defaults.
var PROJECT_OVERRIDES = {
  // Example: use standard preset but enable audit logging
  // ENABLE_AUDIT_LOG: true,
  // AUDIT_LOG_SHEET_NAME: 'MyAuditLog',
};

// Step 3: Resolve config (preset + overrides)
var AUTH_CONFIG = resolveConfig(ACTIVE_PRESET, PROJECT_OVERRIDES);

/**
 * Merge preset defaults with per-project overrides.
 * Overrides take precedence — any key in PROJECT_OVERRIDES
 * replaces the preset's value for that key.
 *
 * @param {string} presetName - 'standard' or 'hipaa'
 * @param {Object} overrides - Per-project override values
 * @returns {Object} Resolved configuration object
 */
function resolveConfig(presetName, overrides) {
  var preset = PRESETS[presetName];
  if (!preset) {
    throw new Error('Unknown preset: ' + presetName + '. Valid presets: standard, hipaa');
  }

  // Shallow merge — overrides replace preset values key-by-key
  var resolved = {};
  var base = preset.gas;
  for (var key in base) {
    if (base.hasOwnProperty(key)) {
      resolved[key] = base[key];
    }
  }
  for (var key in overrides) {
    if (overrides.hasOwnProperty(key)) {
      resolved[key] = overrides[key];
    }
  }

  // HIPAA validation
  if (presetName === 'hipaa') {
    if (!resolved.ALLOWED_DOMAINS || resolved.ALLOWED_DOMAINS.length === 0) {
      throw new Error('HIPAA preset requires ALLOWED_DOMAINS — set your Workspace domain(s)');
    }
    if (resolved.SESSION_EXPIRATION > 900) {
      Logger.log('WARNING: HIPAA recommends SESSION_EXPIRATION ≤ 900s (15 min). Current: '
        + resolved.SESSION_EXPIRATION + 's');
    }
  }

  // Cross-config validation
  // Note: TOKEN_EXCHANGE_METHOD must be set consistently in both GAS and HTML.
  // This cannot be validated at runtime (GAS and HTML are separate contexts).
  // The developer must ensure they match.

  return resolved;
}
```

### HTML Wrapper Resolution

```javascript
// =============================================
// CONFIG RESOLUTION — HTML Wrapper
// Same pattern as GAS but for client-side config.
// This is defined inline in the HTML page's <script>.
// =============================================

var ACTIVE_PRESET = 'standard';  // Must match the GAS preset

var HTML_PROJECT_OVERRIDES = {
  // Example: use standard preset but enable inactivity timeout
  // ENABLE_INACTIVITY_TIMEOUT: true,
};

// Resolve using the same merge logic
var HTML_CONFIG = (function() {
  var preset = PRESETS[ACTIVE_PRESET].html;
  var resolved = {};
  for (var key in preset) {
    if (preset.hasOwnProperty(key)) resolved[key] = preset[key];
  }
  for (var key in HTML_PROJECT_OVERRIDES) {
    if (HTML_PROJECT_OVERRIDES.hasOwnProperty(key)) resolved[key] = HTML_PROJECT_OVERRIDES[key];
  }
  return resolved;
})();
```

Developed by: ShadowAISolutions
