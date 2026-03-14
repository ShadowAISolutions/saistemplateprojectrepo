var VERSION = "v01.22g";
var TITLE = "testauth1title";
var GITHUB_OWNER  = "ShadowAISolutions";
var GITHUB_REPO   = "saistemplateprojectrepo";
var GITHUB_BRANCH = "main";
var FILE_PATH     = "googleAppsScripts/Testauth1/testauth1.gs";
var DEPLOYMENT_ID = "AKfycbzcKmQ37XpdCS5ziKpInaGoHa8tZ0w6MeIP6cMWMV6-wXG2hS1K2pmBq4e4-J7xpNL-_w";
var EMBED_PAGE_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/testauth1.html";

// Derive the parent page's origin from EMBED_PAGE_URL for postMessage targeting.
// postMessage calls from the GAS iframe to the parent page use this as the targetOrigin
// to restrict who can receive the messages. This is safer than "*" because it ensures
// only the intended embedding page can intercept session tokens and auth state.
// CRITICAL: .toLowerCase() is MANDATORY — browsers normalize origins to lowercase,
// but EMBED_PAGE_URL may contain mixed-case (e.g. "ShadowAISolutions"). Without
// toLowerCase(), the browser silently drops ALL postMessages because the targetOrigin
// doesn't match the actual lowercase origin. This exact bug (missing toLowerCase)
// broke sign-in in v02.79r and was never fixed live (the v02.80r fix never deployed
// because the auto-deploy pipeline was already broken).
var PARENT_ORIGIN = EMBED_PAGE_URL.replace(/^(https?:\/\/[^\/]+).*$/, '$1').toLowerCase();

// ══════════════
// AUTH CONFIG
// ══════════════
// Spreadsheet ID for project data (the GAS app reads/writes user data here).
var SPREADSHEET_ID = "1EKParBF6pP5Iz605yMiEqm1I7cKjgN-98jevkKfBYAA";

// Master ACL spreadsheet — centralized access control for all GAS-powered pages.
// Row 1 = headers (Email, page1, page2, ...). Rows 2+ = email in col A, TRUE/FALSE per page column.
// If configured, this replaces the old editor/viewer sharing-list check.
// Leave as placeholder to fall back to SPREADSHEET_ID editor/viewer check.
var MASTER_ACL_SPREADSHEET_ID = "YOUR_MASTER_ACL_SPREADSHEET_ID";
var ACL_SHEET_NAME = "ACL";
var ACL_PAGE_NAME  = "testauth1";

// Unified toggleable auth configuration (see 6-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md)
// Select a preset, then apply per-project overrides.
var ACTIVE_PRESET = 'hipaa';     // 'standard' or 'hipaa'
var PROJECT_OVERRIDES = {
  ENABLE_DOMAIN_RESTRICTION: false,  // allow any Google account (override hipaa default)
  // ALLOWED_DOMAINS: ['yourdomain.com'],  // set this if you enable domain restriction
};

// ══════════════
// AUTH PRESETS
// ══════════════
var PRESETS = {
  standard: {
    // SESSION_EXPIRATION: 3600,       // seconds — rolling session lifetime, reset by heartbeats (1hr)
    SESSION_EXPIRATION: 180,           // ⚡ TEST VALUE (3min) — uncomment line above and delete this line to restore
    // ABSOLUTE_SESSION_TIMEOUT: 57600, // seconds — hard ceiling, never resets regardless of activity (16hr)
    ABSOLUTE_SESSION_TIMEOUT: 300,     // ⚡ TEST VALUE (5min) — uncomment line above and delete this line to restore
    ENABLE_HEARTBEAT: true,
    // HEARTBEAT_INTERVAL: 300,        // seconds — how often GAS checks/extends the session when user is active (5min)
    HEARTBEAT_INTERVAL: 30,            // ⚡ TEST VALUE (30s) — uncomment line above and delete this line to restore
    MAX_SESSIONS_PER_USER: 1,
    // OAUTH_TOKEN_LIFETIME: 3600,     // seconds — expected lifetime of the Google OAuth access token (1hr)
    OAUTH_TOKEN_LIFETIME: 180,         // ⚡ TEST VALUE (3min) — uncomment line above and delete this line to restore
    // OAUTH_REFRESH_BUFFER: 300,      // seconds — show "expiring soon" banner this long before token expires (5min)
    OAUTH_REFRESH_BUFFER: 60,          // ⚡ TEST VALUE (1min) — uncomment line above and delete this line to restore
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
  hipaa: {
    // SESSION_EXPIRATION: 900,        // seconds — rolling session lifetime, reset by heartbeats (15min)
    SESSION_EXPIRATION: 180,           // ⚡ TEST VALUE (3min) — uncomment line above and delete this line to restore
    // ABSOLUTE_SESSION_TIMEOUT: 57600, // seconds — hard ceiling, never resets regardless of activity (16hr)
    ABSOLUTE_SESSION_TIMEOUT: 300,     // ⚡ TEST VALUE (5min) — uncomment line above and delete this line to restore
    ENABLE_HEARTBEAT: true,
    // HEARTBEAT_INTERVAL: 300,        // seconds — how often GAS checks/extends the session when user is active (5min)
    HEARTBEAT_INTERVAL: 30,            // ⚡ TEST VALUE (30s) — uncomment line above and delete this line to restore
    MAX_SESSIONS_PER_USER: 1,
    // OAUTH_TOKEN_LIFETIME: 3600,     // seconds — expected lifetime of the Google OAuth access token (1hr)
    OAUTH_TOKEN_LIFETIME: 180,         // ⚡ TEST VALUE (3min) — uncomment line above and delete this line to restore
    // OAUTH_REFRESH_BUFFER: 300,      // seconds — show "expiring soon" banner this long before token expires (5min)
    OAUTH_REFRESH_BUFFER: 60,          // ⚡ TEST VALUE (1min) — uncomment line above and delete this line to restore
    ENABLE_DOMAIN_RESTRICTION: true,
    ALLOWED_DOMAINS: [],
    ENABLE_AUDIT_LOG: true,
    AUDIT_LOG_SHEET_NAME: 'AuditLog',
    AUDIT_LOG_RETENTION_YEARS: 6,
    ENABLE_HMAC_INTEGRITY: true,
    HMAC_SECRET_PROPERTY: 'HMAC_SECRET',
    ENABLE_EMERGENCY_ACCESS: true,
    EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS',
    TOKEN_EXCHANGE_METHOD: 'postMessage'
  }
};

// ══════════════
// AUTH CONFIG RESOLUTION
// ══════════════
function resolveConfig(presetName, overrides) {
  var preset = PRESETS[presetName];
  if (!preset) {
    throw new Error('Unknown preset: ' + presetName + '. Valid presets: standard, hipaa');
  }
  var resolved = {};
  for (var key in preset) {
    if (preset.hasOwnProperty(key)) resolved[key] = preset[key];
  }
  for (var key in overrides) {
    if (overrides.hasOwnProperty(key)) resolved[key] = overrides[key];
  }
  if (presetName === 'hipaa') {
    if (resolved.ENABLE_DOMAIN_RESTRICTION &&
        (!resolved.ALLOWED_DOMAINS || resolved.ALLOWED_DOMAINS.length === 0)) {
      throw new Error('HIPAA preset with ENABLE_DOMAIN_RESTRICTION requires ALLOWED_DOMAINS — set your Workspace domain(s)');
    }
    if (resolved.SESSION_EXPIRATION > 900) {
      Logger.log('WARNING: HIPAA recommends SESSION_EXPIRATION ≤ 900s (15 min). Current: '
        + resolved.SESSION_EXPIRATION + 's');
    }
  }
  return resolved;
}

var AUTH_CONFIG = resolveConfig(ACTIVE_PRESET, PROJECT_OVERRIDES);
// ══════════════
// AUTH CONFIG END
// ══════════════

// ══════════════
// PROJECT START
// ══════════════

// ══════════════
// PROJECT END
// ══════════════

// ══════════════
// TEMPLATE START
// ══════════════

// =============================================
// NOAUTH — Web App Entry Point (doGet)
// Shared baseline structure; auth-specific routing added in AUTH section.
// =============================================

// (doGet is defined in the AUTH section below because it requires auth routing)

function doPost(e) {
  var action = (e && e.parameter && e.parameter.action) || "";

  // ⚠️ CRITICAL: Do NOT add authentication, secret checks, or any guards to this deploy handler.
  // The GitHub Actions workflow calls doPost(action=deploy) via webhook to trigger GAS self-update.
  // Adding auth here (e.g. DEPLOY_SECRET check) will silently break auto-updates — the workflow
  // gets "Unauthorized" and the GAS script never pulls new code from GitHub.
  // The deploy action only calls pullAndDeployFromGitHub() which is safe — it overwrites the
  // script with whatever is on GitHub (the source of truth), so there is no abuse vector.
  if (action === "deploy") {
    var result = pullAndDeployFromGitHub();
    return ContentService.createTextOutput(result);
  }

  return ContentService.createTextOutput("Unknown action");
}

function getAppData() {
  var data = { version: VERSION, title: TITLE };
  return data;
}

function pullAndDeployFromGitHub() {
  var GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");

  var apiUrl = "https://api.github.com/repos/"
    + GITHUB_OWNER + "/" + GITHUB_REPO + "/contents/" + FILE_PATH
    + "?ref=" + GITHUB_BRANCH + "&t=" + new Date().getTime();

  var fetchHeaders = { "Accept": "application/vnd.github.v3.raw" };
  if (GITHUB_TOKEN) {
    fetchHeaders["Authorization"] = "token " + GITHUB_TOKEN;
  }

  var response = UrlFetchApp.fetch(apiUrl, { headers: fetchHeaders });
  var newCode = response.getContentText();

  var versionMatch = newCode.match(/var VERSION\s*=\s*"([^"]+)"/);
  var pulledVersion = versionMatch ? versionMatch[1] : null;

  if (pulledVersion && pulledVersion === VERSION) {
    return "Already up to date (" + VERSION + ")";
  }

  var scriptId = ScriptApp.getScriptId();
  var url = "https://script.googleapis.com/v1/projects/" + scriptId + "/content";
  var current = UrlFetchApp.fetch(url, {
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() }
  });
  var currentFiles = JSON.parse(current.getContentText()).files;
  var manifest = currentFiles.find(function(f) { return f.name === "appsscript"; });

  var payload = {
    files: [
      { name: "Code", type: "SERVER_JS", source: newCode },
      manifest
    ]
  };

  UrlFetchApp.fetch(url, {
    method: "put",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload)
  });

  var versionUrl = "https://script.googleapis.com/v1/projects/" + scriptId + "/versions";
  var versionResponse = UrlFetchApp.fetch(versionUrl, {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({ description: pulledVersion + " — from GitHub " + new Date().toLocaleString() })
  });
  var newVersion = JSON.parse(versionResponse.getContentText()).versionNumber;

  var deployUrl = "https://script.googleapis.com/v1/projects/" + scriptId
    + "/deployments/" + DEPLOYMENT_ID;
  UrlFetchApp.fetch(deployUrl, {
    method: "put",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({
      deploymentConfig: {
        scriptId: scriptId,
        versionNumber: newVersion,
        description: pulledVersion + " (deployment " + newVersion + ")"
      }
    })
  });

  var cleanupInfo = "";
  try {
    var totalVersions = 0;
    var vPageToken = null;
    do {
      var vListUrl = "https://script.googleapis.com/v1/projects/" + scriptId + "/versions"
        + (vPageToken ? "?pageToken=" + vPageToken : "");
      var vListResp = UrlFetchApp.fetch(vListUrl, {
        headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() }
      });
      var vListData = JSON.parse(vListResp.getContentText());
      if (vListData.versions) totalVersions += vListData.versions.length;
      vPageToken = vListData.nextPageToken || null;
    } while (vPageToken);
    cleanupInfo = " | " + totalVersions + "/200";
  } catch(cleanupErr) {
    cleanupInfo = " | Version count error: " + cleanupErr.message;
  }

  return "Updated to " + pulledVersion + " (deployment " + newVersion + ")" + cleanupInfo;
}

// ══════════════
// TEMPLATE END
// ══════════════

// ══════════════
// AUTH START
// ══════════════

// =============================================
// AUTH — HTML/JS Output Escaping (XSS Prevention)
// Prevents injection via user-controlled values in generated HTML/JS strings.
// =============================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/</g, '\\x3c')
    .replace(/>/g, '\\x3e')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

// =============================================
// AUTH — Conditional Audit Logger (Toggle-Gated)
// No-op when AUTH_CONFIG.ENABLE_AUDIT_LOG === false.
// =============================================

function auditLog(event, user, result, details) {
  if (!AUTH_CONFIG.ENABLE_AUDIT_LOG) return;
  _writeAuditLogEntry(event, user, result, details);
}

function _writeAuditLogEntry(event, user, result, details) {
  try {
    if (!SPREADSHEET_ID || SPREADSHEET_ID === "YOUR_SPREADSHEET_ID") return;
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(AUTH_CONFIG.AUDIT_LOG_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(AUTH_CONFIG.AUDIT_LOG_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Event', 'User', 'Result', 'Details']);
    }
    sheet.appendRow([
      new Date().toISOString(),
      event,
      user,
      result,
      JSON.stringify(details || {})
    ]);
  } catch(e) {
    Logger.log('Audit log error: ' + e.message);
  }
}

// =============================================
// AUTH — HMAC Session Integrity (Toggle-Gated)
// =============================================

function generateSessionHmac(sessionData) {
  if (!AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) return '';
  var secret = PropertiesService.getScriptProperties().getProperty(AUTH_CONFIG.HMAC_SECRET_PROPERTY);
  if (!secret) return '';
  var payload = sessionData.email
    + '|' + sessionData.createdAt
    + '|' + sessionData.lastActivity
    + '|' + (sessionData.absoluteCreatedAt || '')
    + '|' + (sessionData.displayName || '')
    + '|' + (sessionData.tokenObtainedAt || '');
  var signature = Utilities.computeHmacSha256Signature(payload, secret);
  return Utilities.base64Encode(signature);
}

function verifySessionHmac(sessionData) {
  if (!AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) return true;
  if (!sessionData.hmac) return false;
  var expected = generateSessionHmac(sessionData);
  return expected === sessionData.hmac;
}

// =============================================
// AUTH — Session Management (Server-Side)
// Toggle-gated: domain restriction, HMAC, audit, emergency access
// =============================================

function exchangeTokenForSession(accessToken) {
  if (!accessToken) {
    return { success: false, error: "no_token" };
  }

  var userInfo = validateGoogleToken(accessToken);
  if (!userInfo || userInfo.status === "not_signed_in") {
    auditLog('login_failed', '', 'invalid_token', { reason: 'Google token validation failed' });
    return { success: false, error: "invalid_token" };
  }

  // Domain restriction (toggle-gated)
  if (AUTH_CONFIG.ENABLE_DOMAIN_RESTRICTION) {
    var emailDomain = userInfo.email.split('@')[1].toLowerCase();
    var domainAllowed = false;
    for (var i = 0; i < AUTH_CONFIG.ALLOWED_DOMAINS.length; i++) {
      if (emailDomain === AUTH_CONFIG.ALLOWED_DOMAINS[i].toLowerCase()) {
        domainAllowed = true;
        break;
      }
    }
    if (!domainAllowed) {
      auditLog('login_failed', userInfo.email, 'domain_rejected',
        { domain: emailDomain, allowed: AUTH_CONFIG.ALLOWED_DOMAINS.join(',') });
      return { success: false, error: "domain_not_allowed", email: userInfo.email };
    }
  }

  // Check access via master ACL spreadsheet (or fall back to SPREADSHEET_ID editor/viewer list)
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  if (hasAcl || hasSheet) {
    if (!checkSpreadsheetAccess(userInfo.email)) {
      auditLog('login_failed', userInfo.email, 'access_denied',
        { reason: 'No spreadsheet access' });
      return { success: false, error: "not_authorized", email: userInfo.email };
    }
  }

  // Enforce single-session (configurable)
  if (AUTH_CONFIG.MAX_SESSIONS_PER_USER > 0) {
    invalidateAllSessions(userInfo.email);
  }

  // Create session token (cryptographically random UUID)
  var sessionToken = Utilities.getUuid() + Utilities.getUuid();
  sessionToken = sessionToken.replace(/-/g, "").substring(0, 48);

  // Generate a per-session message signing key for cryptographic message authentication.
  // GAS signs outgoing postMessages with this key; the HTML parent verifies signatures.
  var messageKey = Utilities.getUuid().replace(/-/g, '');

  var sessionData = {
    email: userInfo.email,
    displayName: userInfo.displayName,
    // accessToken intentionally NOT stored — only needed for the initial
    // validateGoogleToken() call above, then discarded (least privilege)
    createdAt: Date.now(),
    absoluteCreatedAt: Date.now(),
    lastActivity: Date.now(),
    tokenObtainedAt: Date.now(),
    messageKey: messageKey
  };

  // HMAC integrity (toggle-gated)
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    sessionData.hmac = generateSessionHmac(sessionData);
  }

  var cache = CacheService.getScriptCache();
  cache.put("session_" + sessionToken, JSON.stringify(sessionData), AUTH_CONFIG.SESSION_EXPIRATION);

  trackUserSession(userInfo.email, sessionToken);

  auditLog('login_success', userInfo.email, 'session_created',
    { sessionId: sessionToken.substring(0, 8) + '...' });

  return {
    success: true,
    sessionToken: sessionToken,
    email: userInfo.email,
    displayName: userInfo.displayName,
    absoluteTimeout: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT || 0,
    messageKey: messageKey
  };
}

function validateSession(sessionToken) {
  if (!sessionToken || sessionToken.length < 32) {
    return { status: "not_signed_in" };
  }

  var cache = CacheService.getScriptCache();
  var raw = cache.get("session_" + sessionToken);
  if (!raw) {
    return { status: "not_signed_in" };
  }

  var sessionData;
  try {
    sessionData = JSON.parse(raw);
  } catch (e) {
    return { status: "not_signed_in" };
  }

  // HMAC verification (toggle-gated)
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    if (!verifySessionHmac(sessionData)) {
      auditLog('security_alert', sessionData.email || 'unknown', 'hmac_mismatch',
        { sessionId: sessionToken.substring(0, 8) + '...' });
      cache.remove("session_" + sessionToken);
      return { status: "not_signed_in" };
    }
  }

  // Absolute session timeout — hard ceiling that heartbeats cannot extend
  if (sessionData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
    var absoluteElapsed = (Date.now() - sessionData.absoluteCreatedAt) / 1000;
    if (absoluteElapsed > AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
      auditLog('session_expired', sessionData.email, 'absolute_timeout',
        { elapsed: Math.round(absoluteElapsed) + 's', limit: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT + 's' });
      cache.remove("session_" + sessionToken);
      return { status: "not_signed_in" };
    }
  }

  // Authoritative expiry check (rolling — reset by heartbeats)
  var elapsed = (Date.now() - sessionData.createdAt) / 1000;
  if (elapsed > AUTH_CONFIG.SESSION_EXPIRATION) {
    auditLog('session_expired', sessionData.email, 'timeout',
      { elapsed: Math.round(elapsed) + 's', limit: AUTH_CONFIG.SESSION_EXPIRATION + 's' });
    cache.remove("session_" + sessionToken);
    return { status: "not_signed_in" };
  }

  // Check if Google token needs refresh
  var needsReauth = checkGoogleTokenExpiry(sessionData);

  // Update last activity (extends the CacheService TTL)
  sessionData.lastActivity = Date.now();
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    sessionData.hmac = generateSessionHmac(sessionData);
  }
  cache.put("session_" + sessionToken, JSON.stringify(sessionData), AUTH_CONFIG.SESSION_EXPIRATION);

  return {
    status: "authorized",
    email: sessionData.email,
    displayName: sessionData.displayName,
    needsReauth: needsReauth
  };
}

function invalidateSession(sessionToken) {
  if (!sessionToken) return;
  var cache = CacheService.getScriptCache();
  var raw = cache.get("session_" + sessionToken);
  if (raw) {
    try {
      var sessionData = JSON.parse(raw);
      removeUserSession(sessionData.email, sessionToken);
      auditLog('sign_out', sessionData.email, 'session_invalidated',
        { sessionId: sessionToken.substring(0, 8) + '...' });
    } catch (e) {}
  }
  cache.remove("session_" + sessionToken);
}

function invalidateAllSessions(email) {
  if (!email) return;
  var cache = CacheService.getScriptCache();
  var trackKey = "sessions_" + email.toLowerCase();
  var raw = cache.get(trackKey);
  if (!raw) return;
  try {
    var tokens = JSON.parse(raw);
    for (var i = 0; i < tokens.length; i++) {
      cache.remove("session_" + tokens[i]);
    }
    if (tokens.length > 0) {
      auditLog('session_management', email, 'all_sessions_invalidated',
        { count: tokens.length });
    }
  } catch (e) {}
  cache.remove(trackKey);
}

// =============================================
// AUTH — Google Token Operations (Server-Side Only)
// =============================================

function validateGoogleToken(accessToken) {
  try {
    var resp = UrlFetchApp.fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { "Authorization": "Bearer " + accessToken },
        muteHttpExceptions: true
      }
    );
    if (resp.getResponseCode() !== 200) {
      return { status: "not_signed_in" };
    }
    var info = JSON.parse(resp.getContentText());
    if (!info.email) {
      return { status: "not_signed_in" };
    }
    var prefix = info.email.split("@")[0];
    var displayName = prefix.split(/[._-]/).map(function(part) {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }).join(" ");
    return { status: "authorized", email: info.email, displayName: displayName };
  } catch (e) {
    return { status: "not_signed_in" };
  }
}

function checkGoogleTokenExpiry(sessionData) {
  var tokenAge = (Date.now() - sessionData.tokenObtainedAt) / 1000;
  return tokenAge >= (AUTH_CONFIG.OAUTH_TOKEN_LIFETIME - AUTH_CONFIG.OAUTH_REFRESH_BUFFER);
}

// =============================================
// AUTH — Session Tracking (for single-session enforcement)
// =============================================

function trackUserSession(email, sessionToken) {
  var cache = CacheService.getScriptCache();
  var trackKey = "sessions_" + email.toLowerCase();
  var raw = cache.get(trackKey);
  var tokens = [];
  if (raw) {
    try { tokens = JSON.parse(raw); } catch (e) {}
  }
  tokens.push(sessionToken);
  cache.put(trackKey, JSON.stringify(tokens), AUTH_CONFIG.SESSION_EXPIRATION);
}

function removeUserSession(email, sessionToken) {
  if (!email) return;
  var cache = CacheService.getScriptCache();
  var trackKey = "sessions_" + email.toLowerCase();
  var raw = cache.get(trackKey);
  if (!raw) return;
  try {
    var tokens = JSON.parse(raw);
    tokens = tokens.filter(function(t) { return t !== sessionToken; });
    if (tokens.length > 0) {
      cache.put(trackKey, JSON.stringify(tokens), AUTH_CONFIG.SESSION_EXPIRATION);
    } else {
      cache.remove(trackKey);
    }
  } catch (e) {}
}

// =============================================
// AUTH — Authorization (Spreadsheet Access + Emergency Access)
// Toggle-gated: emergency access override
// =============================================

function checkSpreadsheetAccess(email, opt_ss) {
  if (!email) return false;
  var lowerEmail = email.toLowerCase();

  // Emergency access override (toggle-gated)
  if (AUTH_CONFIG.ENABLE_EMERGENCY_ACCESS) {
    var emergencyEmails = PropertiesService.getScriptProperties()
      .getProperty(AUTH_CONFIG.EMERGENCY_ACCESS_PROPERTY);
    if (emergencyEmails) {
      var emergencyList = emergencyEmails.split(',').map(function(e) {
        return e.trim().toLowerCase();
      });
      if (emergencyList.indexOf(lowerEmail) > -1) {
        auditLog('emergency_access', email, 'granted',
          { reason: 'Emergency access override via Script Properties' });
        return true;
      }
    }
  }

  var cache = CacheService.getScriptCache();
  var cacheKey = "access_" + lowerEmail;
  var cached = cache.get(cacheKey);
  if (cached !== null) return cached === "1";

  // Method 1: Master ACL spreadsheet (row-based lookup — email in col A, TRUE/FALSE per page column)
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (hasAcl) {
    try {
      var aclSs = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
      var aclSheet = aclSs.getSheetByName(ACL_SHEET_NAME);
      if (aclSheet) {
        var data = aclSheet.getDataRange().getValues();
        if (data.length >= 2) {
          var headers = data[0];
          var colIdx = -1;
          for (var c = 0; c < headers.length; c++) {
            if (String(headers[c]).trim().toLowerCase() === ACL_PAGE_NAME.toLowerCase()) {
              colIdx = c; break;
            }
          }
          if (colIdx !== -1) {
            for (var r = 1; r < data.length; r++) {
              if (String(data[r][0]).trim().toLowerCase() === lowerEmail) {
                var val = data[r][colIdx];
                if (val === true || String(val).trim().toUpperCase() === 'TRUE') {
                  cache.put(cacheKey, "1", 600);
                  return true;
                }
                break; // Found email but not granted — continue to method 2
              }
            }
          }
        }
      }
    } catch(e) { /* ACL spreadsheet error — continue to method 2 */ }
  }

  // Method 2: Editor/viewer sharing-list check on SPREADSHEET_ID
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  if (hasSheet) {
    var ss = opt_ss || SpreadsheetApp.openById(SPREADSHEET_ID);
    var editors = ss.getEditors();
    for (var i = 0; i < editors.length; i++) {
      if (editors[i].getEmail().toLowerCase() === lowerEmail) {
        cache.put(cacheKey, "1", 600);
        return true;
      }
    }
    var viewers = ss.getViewers();
    for (var i = 0; i < viewers.length; i++) {
      if (viewers[i].getEmail().toLowerCase() === lowerEmail) {
        cache.put(cacheKey, "1", 600);
        return true;
      }
    }
  }

  // Neither method granted access (or neither is configured)
  if (!hasAcl && !hasSheet) return true; // No access control configured — allow all
  cache.put(cacheKey, "0", 600);
  return false;
}

// =============================================
// AUTH — Web App Entry Point (doGet)
// Toggle-gated: TOKEN_EXCHANGE_METHOD controls token exchange path.
// =============================================

function doGet(e) {
  var sessionToken = (e && e.parameter && e.parameter.session) || "";
  var signOutToken = (e && e.parameter && e.parameter.signOut) || "";
  var heartbeatToken = (e && e.parameter && e.parameter.heartbeat) || "";

  // Message signing key from URL parameter (used by heartbeat iframe for signing)
  var msgKey = (e && e.parameter && e.parameter.msgKey) || '';

  // Heartbeat flow: validate session + reset createdAt to extend it
  if (heartbeatToken && AUTH_CONFIG.ENABLE_HEARTBEAT) {
    var cache = CacheService.getScriptCache();
    var raw = cache.get("session_" + heartbeatToken);
    if (!raw) {
      var hbExpiredHtml = '<!DOCTYPE html><html><body><script>'
        + 'window.top.postMessage({type:"gas-heartbeat-expired"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
        + '</' + 'script></body></html>';
      return HtmlService.createHtmlOutput(hbExpiredHtml)
        .setTitle(TITLE)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    var hbData;
    try { hbData = JSON.parse(raw); } catch (err) {
      var hbErrHtml = '<!DOCTYPE html><html><body><script>'
        + 'window.top.postMessage({type:"gas-heartbeat-expired"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
        + '</' + 'script></body></html>';
      return HtmlService.createHtmlOutput(hbErrHtml)
        .setTitle(TITLE)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    // Check HMAC if enabled
    if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY && !verifySessionHmac(hbData)) {
      cache.remove("session_" + heartbeatToken);
      var hbHmacHtml = '<!DOCTYPE html><html><body><script>'
        + 'window.top.postMessage({type:"gas-heartbeat-expired"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
        + '</' + 'script></body></html>';
      return HtmlService.createHtmlOutput(hbHmacHtml)
        .setTitle(TITLE)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    // Check absolute session timeout — hard ceiling, heartbeats cannot extend past this
    if (hbData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
      var hbAbsElapsed = (Date.now() - hbData.absoluteCreatedAt) / 1000;
      if (hbAbsElapsed > AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
        cache.remove("session_" + heartbeatToken);
        auditLog('session_expired', hbData.email, 'absolute_timeout_heartbeat',
          { elapsed: Math.round(hbAbsElapsed) + 's', limit: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT + 's' });
        var hbAbsHtml = '<!DOCTYPE html><html><body><script>'
          + 'window.top.postMessage({type:"gas-heartbeat-expired"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
          + '</' + 'script></body></html>';
        return HtmlService.createHtmlOutput(hbAbsHtml)
          .setTitle(TITLE)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      }
    }
    // Check if already expired (rolling session timeout)
    var hbElapsed = (Date.now() - hbData.createdAt) / 1000;
    if (hbElapsed > AUTH_CONFIG.SESSION_EXPIRATION) {
      cache.remove("session_" + heartbeatToken);
      auditLog('session_expired', hbData.email, 'heartbeat_too_late',
        { elapsed: Math.round(hbElapsed) + 's' });
      var hbLateHtml = '<!DOCTYPE html><html><body><script>'
        + 'window.top.postMessage({type:"gas-heartbeat-expired"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
        + '</' + 'script></body></html>';
      return HtmlService.createHtmlOutput(hbLateHtml)
        .setTitle(TITLE)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    // Session is valid — reset createdAt to extend the session
    hbData.createdAt = Date.now();
    hbData.lastActivity = Date.now();
    if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
      hbData.hmac = generateSessionHmac(hbData);
    }
    cache.put("session_" + heartbeatToken, JSON.stringify(hbData), AUTH_CONFIG.SESSION_EXPIRATION);
    var hbAbsRemaining = hbData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT
      ? Math.round(AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT - ((Date.now() - hbData.absoluteCreatedAt) / 1000))
      : 0;
    var hbOkHtml = '<!DOCTYPE html><html><body><script>'
      + 'var k=' + JSON.stringify(msgKey) + ';'
      + 'function s(m){if(!k)return m;var p=JSON.stringify(m)+"|"+k;var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h|=0;}m._sig=h.toString(36);return m;}'
      + 'window.top.postMessage(s({type:"gas-heartbeat-ok",expiresIn:' + AUTH_CONFIG.SESSION_EXPIRATION + ',absoluteRemaining:' + hbAbsRemaining + '}), ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(hbOkHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Sign-out flow: invalidate session and return confirmation
  if (signOutToken) {
    // Read messageKey before invalidation (for signing the response)
    var soCache = CacheService.getScriptCache();
    var soRaw = soCache.get("session_" + signOutToken);
    var soMsgKey = '';
    if (soRaw) { try { soMsgKey = JSON.parse(soRaw).messageKey || ''; } catch(e) {} }
    invalidateSession(signOutToken);
    var signOutHtml = '<!DOCTYPE html><html><body><script>'
      + 'var k=' + JSON.stringify(soMsgKey) + ';'
      + 'function s(m){if(!k)return m;var p=JSON.stringify(m)+"|"+k;var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h|=0;}m._sig=h.toString(36);return m;}'
      + 'window.top.postMessage(s({type:"gas-signed-out",success:true}), ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(signOutHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // URL-parameter token exchange (standard mode)
  if (AUTH_CONFIG.TOKEN_EXCHANGE_METHOD === 'url') {
    var exchangeToken = (e && e.parameter && e.parameter.exchangeToken) || "";
    if (exchangeToken) {
      var result;
      try {
        result = exchangeTokenForSession(exchangeToken);
      } catch (err) {
        Logger.log("Token exchange error: " + (err.message || String(err)));
        result = { success: false, error: "server_error" };
      }
      var payload = JSON.stringify({
            type: "gas-session-created",
            success: result.success,
            sessionToken: result.sessionToken || "",
            email: result.email || "",
            displayName: result.displayName || "",
            error: result.error || "",
            absoluteTimeout: result.absoluteTimeout || 0,
            messageKey: result.messageKey || ""
          });
      var exchangeHtml = '<!DOCTYPE html><html><body><script>'
        + 'try { window.top.postMessage(' + payload + ', ' + JSON.stringify(PARENT_ORIGIN) + '); } catch(e) {}'
        + '</' + 'script></body></html>';
      return HtmlService.createHtmlOutput(exchangeHtml)
        .setTitle(TITLE)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
  }

  // postMessage token exchange (HIPAA mode)
  if (AUTH_CONFIG.TOKEN_EXCHANGE_METHOD === 'postMessage' && !sessionToken) {
    var listenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'window.addEventListener("message", function(e) {'
      + '  if (!e.data || e.data.type !== "exchange-token") return;'
      + '  var token = e.data.accessToken;'
      + '  if (!token) return;'
      + '  google.script.run'
      + '    .withSuccessHandler(function(result) {'
      + '      window.top.postMessage({'
      + '        type: "gas-session-created",'
      + '        success: result.success,'
      + '        sessionToken: result.sessionToken || "",'
      + '        email: result.email || "",'
      + '        displayName: result.displayName || "",'
      + '        error: result.error || "",'
      + '        absoluteTimeout: result.absoluteTimeout || 0,'
      + '        messageKey: result.messageKey || ""'
      + '      }, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '    })'
      + '    .withFailureHandler(function(err) {'
      + '      window.top.postMessage({'
      + '        type: "gas-session-created",'
      + '        success: false,'
      + '        error: "server_error"'
      + '      }, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '    })'
      + '    .exchangeTokenForSession(token);'
      + '});'
      + 'window.top.postMessage({ type: "gas-ready-for-token" }, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(listenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Normal flow: validate session token
  var session = validateSession(sessionToken);

  if (session.status !== "authorized") {
    var authHtml = '<!DOCTYPE html><html><body><script>'
      + 'window.top.postMessage({type:"gas-needs-auth",authStatus:"' + escapeJs(session.status) + '",email:"' + escapeJs(session.email || '') + '",version:"' + escapeJs(VERSION) + '"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(authHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Retrieve messageKey from session data for signing outgoing messages
  var appMsgKey = '';
  try {
    var appCache = CacheService.getScriptCache();
    var appRaw = appCache.get("session_" + sessionToken);
    if (appRaw) { appMsgKey = JSON.parse(appRaw).messageKey || ''; }
  } catch(e) {}

  // Session valid — build the app HTML (same as noauth doGet but with user context)
  var html = `
    <html>
    <head>
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
      <style>
        html, body { height: 100%; margin: 0; overflow: auto; }
        body { font-family: Arial; display: flex; justify-content: center; align-items: center; }
        #debug-marker { font-size: 200px; color: #1565c0; font-weight: bold; }
        #version { position: fixed; bottom: 8px; left: 8px; z-index: 9999; color: #1565c0; font-size: 12px; margin: 0; font-family: monospace; opacity: 0.8; }
        #user-email { position: fixed; top: 8px; left: 8px; z-index: 9999; color: #666; font-size: 11px; font-family: monospace; opacity: 0.7; }
        #hb-test-area { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 9999; text-align: center; }
        #hb-test-area label { display: block; font-size: 11px; color: #999; margin-bottom: 4px; font-family: monospace; }
        #hb-test-input { width: 300px; padding: 8px 12px; font-size: 14px; font-family: monospace; border: 2px solid #1565c0; border-radius: 6px; outline: none; }
        #hb-test-input:focus { border-color: #0d47a1; box-shadow: 0 0 0 3px rgba(21,101,192,0.2); }
      </style>
    </head>
    <body>
      <div id="debug-marker">1</div>
      <div id="hb-test-area">
        <label>Type here to test heartbeat interruption</label>
        <input type="text" id="hb-test-input" placeholder="Type continuously and watch for disruption..." autocomplete="off">
      </div>
      <h2 id="version">${escapeHtml(VERSION)}</h2>
      <div id="user-email">${escapeHtml(session.email)}</div>

      <script>
        // Message signing for cryptographic authentication
        var _mk = '${escapeJs(appMsgKey)}';
        function _s(m) {
          if (!_mk) return m;
          var p = JSON.stringify(m) + '|' + _mk;
          var h = 0;
          for (var i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0; }
          m._sig = h.toString(36);
          return m;
        }

        // Notify wrapper that auth is OK
        window.top.postMessage(_s({type: 'gas-auth-ok', version: '${escapeJs(VERSION)}', needsReauth: ${session.needsReauth || false}}), '${PARENT_ORIGIN}');

        window.addEventListener('message', function(e) {
          if (e.data && e.data.type === 'gas-version-check') {
            google.script.run
              .withSuccessHandler(function(data) {
                top.postMessage(_s({type: 'gas-version', version: data.version}), '${PARENT_ORIGIN}');
              })
              .withFailureHandler(function() {
                top.postMessage(_s({type: 'gas-version', version: null}), '${PARENT_ORIGIN}');
              })
              .getAppData();
          }
        });
      </script>
    </body>
    </html>
  `;
  return HtmlService.createHtmlOutput(html)
    .setTitle(TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function serverSignOut(sessionToken) {
  invalidateSession(sessionToken);
  return { success: true };
}

// ══════════════
// AUTH END
// ══════════════
// Developed by: ShadowAISolutions
