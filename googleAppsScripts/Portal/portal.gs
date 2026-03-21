var VERSION = "v01.15g";
var TITLE = "Portal Title";
var GITHUB_OWNER  = "ShadowAISolutions";
var GITHUB_REPO   = "saistemplateprojectrepo";
var GITHUB_BRANCH = "main";
var FILE_PATH     = "googleAppsScripts/Portal/portal.gs";
var DEPLOYMENT_ID = "AKfycbzKwEfBKj5mOy4aBtg-nWycCRO8R21s405WoJHR3dLBtPxc3SA4qfzNaQ6OGVlQE7Xm";
var EMBED_PAGE_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/portal.html";

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
var SPREADSHEET_ID = "13k0t3aYbf1t4K6XFdvEvVWig6bsxRFDRCcxgXgV8428";

// Master ACL spreadsheet — centralized access control for all GAS-powered pages.
// Row 1 = headers (Email, page1, page2, ...). Rows 2+ = email in col A, TRUE/FALSE per page column.
// If configured, this replaces the old editor/viewer sharing-list check.
// Leave as placeholder to fall back to SPREADSHEET_ID editor/viewer check.
var MASTER_ACL_SPREADSHEET_ID = "1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI";
var ACL_SHEET_NAME = "Access";
var ACL_PAGE_NAME  = "portal";

// Unified toggleable auth configuration (see 6-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md)
// Select a preset, then apply per-project overrides.
var ACTIVE_PRESET = 'standard';  // 'standard' or 'hipaa'
var PROJECT_OVERRIDES = {
  // Uncomment to override specific preset values:
  // ENABLE_AUDIT_LOG: true,
  // SESSION_EXPIRATION: 1200,
  // ENABLE_DOMAIN_RESTRICTION: true,
  // ALLOWED_DOMAINS: ['yourdomain.com'],
};

// ══════════════
// AUTH PRESETS
// ══════════════
var PRESETS = {
  standard: {
    SESSION_EXPIRATION: 3600,
    ABSOLUTE_SESSION_TIMEOUT: 57600,
    ENABLE_HEARTBEAT: true,
    HEARTBEAT_INTERVAL: 300,
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
  hipaa: {
    SESSION_EXPIRATION: 900,
    ABSOLUTE_SESSION_TIMEOUT: 57600,
    ENABLE_HEARTBEAT: true,
    HEARTBEAT_INTERVAL: 300,
    MAX_SESSIONS_PER_USER: 1,
    OAUTH_TOKEN_LIFETIME: 3600,
    OAUTH_REFRESH_BUFFER: 900,
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
    if (!resolved.ALLOWED_DOMAINS || resolved.ALLOWED_DOMAINS.length === 0) {
      throw new Error('HIPAA preset requires ALLOWED_DOMAINS — set your Workspace domain(s)');
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
// CROSS-PROJECT SESSION MANAGEMENT
// ══════════════

/**
 * Check if a row in the Access tab is a metadata row (#NAME, #URL, #AUTH).
 */
function isMetadataRow(row) { return String(row[0]).trim().charAt(0) === '#'; }

/**
 * Ensure the Access tab has the 3 metadata rows (#NAME, #URL, #AUTH) after the header.
 * If missing, inserts them and shifts existing user data down.
 */
function ensureMetadataRows(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2 || String(data[1][0]).trim() !== '#NAME') {
    sheet.insertRowsAfter(1, 3);
    sheet.getRange(2, 1).setValue('#NAME');
    sheet.getRange(3, 1).setValue('#URL');
    sheet.getRange(4, 1).setValue('#AUTH');
  }
}

/**
 * Auto-register this project in the Access tab metadata rows of the Master ACL Spreadsheet.
 * Metadata is stored in rows 2-4 (#NAME, #URL, #AUTH) under the project's page column.
 * Runs once per execution (cached flag).
 */
var _selfRegistered = false;
function registerSelfProject() {
  if (_selfRegistered) return;
  _selfRegistered = true;
  // Guard against placeholder Master ACL ID
  if (!MASTER_ACL_SPREADSHEET_ID || MASTER_ACL_SPREADSHEET_ID === 'YOUR_MASTER_ACL_SPREADSHEET_ID') return;
  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return;

    ensureMetadataRows(sheet);

    // Find column for this project
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var colIdx = -1;
    for (var c = 0; c < headers.length; c++) {
      if (String(headers[c]).trim().toLowerCase() === ACL_PAGE_NAME.toLowerCase()) {
        colIdx = c;
        break;
      }
    }

    // If column doesn't exist, add it
    if (colIdx === -1) {
      colIdx = headers.length;
      sheet.getRange(1, colIdx + 1).setValue(ACL_PAGE_NAME);
      sheet.getRange(2, colIdx + 1).setValue('');
      sheet.getRange(3, colIdx + 1).setValue('');
      sheet.getRange(4, colIdx + 1).setValue(false);
      var lastRow = sheet.getLastRow();
      if (lastRow > 4) {
        var falseValues = [];
        for (var f = 0; f < lastRow - 4; f++) falseValues.push([false]);
        sheet.getRange(5, colIdx + 1, lastRow - 4, 1).setValues(falseValues);
        sheet.getRange(5, colIdx + 1, lastRow - 4, 1).insertCheckboxes();
      }
    }

    // Determine this project's URL
    var isSelfProject = (ACL_PAGE_NAME === 'globalacl');
    var myUrl = isSelfProject ? 'SELF'
      : (DEPLOYMENT_ID && DEPLOYMENT_ID !== 'YOUR_DEPLOYMENT_ID')
        ? 'https://script.google.com/macros/s/' + DEPLOYMENT_ID + '/exec'
        : '';
    if (!myUrl) return;

    // Write/update metadata rows for this project's column
    var col = colIdx + 1;
    sheet.getRange(2, col).setValue(TITLE);
    sheet.getRange(3, col).setValue(myUrl);
    sheet.getRange(4, col).setValue(true);
  } catch (e) {
    Logger.log('registerSelfProject error: ' + e.message);
  }
}

var _crossProjectSecret = null;
function getCrossProjectSecret() {
  if (_crossProjectSecret) return _crossProjectSecret;
  try {
    _crossProjectSecret = PropertiesService.getScriptProperties()
      .getProperty('CROSS_PROJECT_ADMIN_SECRET') || '';
    return _crossProjectSecret;
  } catch (e) {
    Logger.log('getCrossProjectSecret error: ' + e.message);
  }
  return '';
}

function validateCrossProjectAdmin(params) {
  var secret = (params && params.secret) || '';
  var callerEmail = (params && params.callerEmail) || '';
  if (!secret || !callerEmail) return false;
  var expected = getCrossProjectSecret();
  if (!expected || secret !== expected) return false;
  if (!MASTER_ACL_SPREADSHEET_ID || MASTER_ACL_SPREADSHEET_ID === 'YOUR_MASTER_ACL_SPREADSHEET_ID') return false;
  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return false;
    var data = sheet.getDataRange().getValues();
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][0]).trim().toLowerCase() === callerEmail.toLowerCase()) {
        var role = String(data[r][1]).trim().toLowerCase();
        return role === 'admin';
      }
    }
  } catch (e) {
    Logger.log('validateCrossProjectAdmin error: ' + e.message);
  }
  return false;
}

function listActiveSessionsInternal(callerEmail) {
  var cache = CacheService.getScriptCache();
  var activeSessions = [];
  if (!MASTER_ACL_SPREADSHEET_ID || MASTER_ACL_SPREADSHEET_ID === 'YOUR_MASTER_ACL_SPREADSHEET_ID') return activeSessions;
  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return activeSessions;
    var data = sheet.getDataRange().getValues();
    for (var r = 1; r < data.length; r++) {
      var email = String(data[r][0]).trim().toLowerCase();
      if (!email || email.indexOf('@') === -1) continue;
      var trackKey = 'sessions_' + email;
      var raw = cache.get(trackKey);
      if (!raw) continue;
      var tokens;
      try { tokens = JSON.parse(raw); } catch (e) { continue; }
      for (var i = 0; i < tokens.length; i++) {
        var sessionRaw = cache.get('session_' + tokens[i]);
        if (!sessionRaw) continue;
        var sess;
        try { sess = JSON.parse(sessionRaw); } catch (e) { continue; }
        var absRemaining = 0;
        if (sess.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
          absRemaining = Math.max(0, Math.round(
            AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT - ((Date.now() - sess.absoluteCreatedAt) / 1000)
          ));
        }
        var rollingRemaining = Math.max(0, Math.round(
          AUTH_CONFIG.SESSION_EXPIRATION - ((Date.now() - sess.createdAt) / 1000)
        ));
        activeSessions.push({
          email: sess.email,
          displayName: sess.displayName || '',
          role: sess.role || 'viewer',
          createdAt: sess.absoluteCreatedAt || sess.createdAt,
          lastActivity: sess.lastActivity,
          absoluteRemaining: absRemaining,
          rollingRemaining: rollingRemaining,
          isEmergencyAccess: false,
          isSelf: (sess.email || '').toLowerCase() === (callerEmail || '').toLowerCase(),
          project: TITLE
        });
      }
    }
  } catch (e) {
    Logger.log('listActiveSessionsInternal error: ' + e.message);
  }
  return activeSessions;
}

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

/**
 * Ensure HMAC_SECRET and CACHE_EPOCH exist in Script Properties.
 * Called after a successful deploy — generates defaults if missing.
 * Existing values are never overwritten.
 */
function ensureScriptProperties_() {
  try {
    var props = PropertiesService.getScriptProperties();
    if (!props.getProperty('CACHE_EPOCH')) {
      props.setProperty('CACHE_EPOCH', '1');
    }
    if (!props.getProperty('HMAC_SECRET')) {
      var chars = '0123456789abcdef';
      var secret = '';
      for (var i = 0; i < 64; i++) {
        secret += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      props.setProperty('HMAC_SECRET', secret);
    }
  } catch (e) {
    Logger.log('ensureScriptProperties_ error: ' + e.message);
  }
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

  // Auto-initialize required Script Properties on first deploy
  ensureScriptProperties_();

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
// PORTAL — Per-App Access Lookup
// Reads the Master ACL spreadsheet to determine which apps the user has access to.
// Returns an object mapping page names (column headers) to boolean access values.
// =============================================

function getUserAppAccess(email) {
  var accessMap = {};
  if (!email) return accessMap;
  var lowerEmail = email.toLowerCase();

  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (!hasAcl) return accessMap; // No ACL configured — return empty (caller treats empty as "all accessible")

  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return accessMap;

    var data = sheet.getDataRange().getValues();
    if (data.length < 5) return accessMap; // Need at least header + 4 metadata rows + 1 data row

    var headers = data[0]; // Row 1: column headers (Email, Role, page1, page2, ...)

    // Find user's row (rows 5+ are user data, index 4+)
    var userRow = null;
    for (var r = 4; r < data.length; r++) {
      if (String(data[r][0]).trim().toLowerCase() === lowerEmail) {
        userRow = data[r];
        break;
      }
    }

    // Build access map from column headers (skip col A=Email, col B=Role)
    for (var c = 2; c < headers.length; c++) {
      var pageName = String(headers[c]).trim().toLowerCase();
      if (!pageName) continue;
      if (userRow) {
        var val = userRow[c];
        accessMap[pageName] = (val === true || String(val).trim().toUpperCase() === 'TRUE');
      } else {
        accessMap[pageName] = false; // User not in ACL — no access
      }
    }
  } catch(e) {
    // ACL spreadsheet error — return empty (treat as all accessible)
  }

  return accessMap;
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

  // Auto-register this project in the cross-project registry
  registerSelfProject();

  // ── Cross-project action routes (called by globalacl via UrlFetchApp) ──
  var action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'listSessions') {
    if (!validateCrossProjectAdmin(e.parameter)) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var cpSessions = listActiveSessionsInternal((e.parameter && e.parameter.callerEmail) || '');
    return ContentService.createTextOutput(JSON.stringify(cpSessions))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Cross-project admin secret distribution — called by globalacl's distributeSecret_()
  if (action === 'setAdminSecret') {
    var newSecret = (e.parameter && e.parameter.newSecret) || '';
    var oldSecret = (e.parameter && e.parameter.oldSecret) || '';
    if (!newSecret) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'missing_secret' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var props = PropertiesService.getScriptProperties();
    var current = props.getProperty('CROSS_PROJECT_ADMIN_SECRET') || '';
    // Accept if: no current secret (first setup) OR oldSecret matches current
    if (current && oldSecret !== current) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    props.setProperty('CROSS_PROJECT_ADMIN_SECRET', newSecret);
    _crossProjectSecret = null; // clear cache
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'adminSignOut') {
    if (!validateCrossProjectAdmin(e.parameter)) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var cpTarget = (e.parameter && e.parameter.targetEmail) || '';
    if (cpTarget) {
      invalidateAllSessions(cpTarget);
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, email: cpTarget }))
      .setMimeType(ContentService.MimeType.JSON);
  }

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

  // Security event reporting: client-side defenses report blocked attacks
  var securityEvent = (e && e.parameter && e.parameter.securityEvent) || '';
  if (securityEvent) {
    var seCache = CacheService.getScriptCache();
    var seRlKey = 'se_ratelimit_' + securityEvent.substring(0, 20);
    var seAttempts = seCache.get(seRlKey);
    var seCount = seAttempts ? parseInt(seAttempts, 10) : 0;
    if (seCount < 20) {
      seCache.put(seRlKey, String(seCount + 1), 300);
      var seDetails = {};
      try { seDetails = JSON.parse((e.parameter.details || '{}').substring(0, 500)); } catch(ex) {}
      auditLog('security_event', 'unknown', securityEvent.substring(0, 50), {
        details: seDetails,
        userAgent: (e && e.parameter && e.parameter.ua) || '',
        page: EMBED_PAGE_URL
      });
    } else if (seCount === 20) {
      seCache.put(seRlKey, String(seCount + 1), 300);
      auditLog('security_event_throttled', 'unknown', securityEvent.substring(0, 50), {
        message: 'Rate limit reached — further events from this IP/type suppressed for 5 minutes',
        page: EMBED_PAGE_URL
      });
    }
    var seHtml = '<!DOCTYPE html><html><body></body></html>';
    return HtmlService.createHtmlOutput(seHtml)
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

  // Look up per-app access for the current user (for the access toggle)
  var userAppAccess = getUserAppAccess(session.email);
  var userAppAccessJson = JSON.stringify(userAppAccess);

  // Session valid — build the portal dashboard UI
  var html = `
    <html>
    <head>
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
      <style>
        html, body { height: 100%; margin: 0; overflow: auto; }
        body {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 100vh;
          background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
          font-family: sans-serif; padding: 20px; box-sizing: border-box;
        }
        .portal-header { text-align: center; margin-bottom: 40px; }
        .portal-header img { max-width: 80px; max-height: 80px; margin-bottom: 16px; border-radius: 12px; }
        .portal-header h1 { color: #fff; font-size: 28px; font-weight: bold; margin: 0 0 8px; }
        .portal-header .portal-subtitle { color: rgba(255,255,255,0.6); font-size: 14px; }
        .portal-user-info {
          color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 12px;
          background: rgba(255,255,255,0.1); padding: 6px 16px; border-radius: 20px;
        }
        .portal-apps {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px; max-width: 720px; width: 100%;
        }
        .portal-app-card {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 24px 20px;
          text-decoration: none; color: #fff;
          transition: all 0.2s ease; cursor: pointer;
          display: flex; flex-direction: column; gap: 8px;
        }
        .portal-app-card:hover {
          background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .portal-app-card .app-icon { font-size: 32px; margin-bottom: 4px; }
        .portal-app-card .app-name { font-size: 16px; font-weight: bold; }
        .portal-app-card .app-desc { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.4; }
        .portal-app-card .app-status { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px; }
        .portal-app-card .app-status.connected { color: #66bb6a; }
        .portal-app-card.no-access { opacity: 0.45; }
        .portal-app-card.no-access .app-status::after { content: ' \\2022 No access'; color: #ef5350; }
        .portal-section { max-width: 720px; width: 100%; margin-bottom: 28px; }
        .portal-section-title {
          color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600;
          margin: 0 0 12px; padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .portal-empty {
          color: rgba(255,255,255,0.35); font-size: 13px; text-align: center;
          padding: 24px 0; font-style: italic;
        }
        .portal-toggles { display: flex; gap: 24px; max-width: 720px; width: 100%; margin-bottom: 16px; justify-content: flex-end; flex-wrap: wrap; }
        .portal-footer { margin-top: 40px; text-align: center; color: rgba(255,255,255,0.3); font-size: 11px; }
        .portal-open-toggle {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 10px; max-width: 720px; width: 100%; margin-bottom: 12px;
          color: rgba(255,255,255,0.6); font-size: 13px;
        }
        .portal-open-toggle label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .portal-open-toggle input[type="checkbox"] { display: none; }
        .toggle-track {
          width: 36px; height: 20px; background: rgba(255,255,255,0.2);
          border-radius: 10px; position: relative; transition: background 0.2s;
        }
        .toggle-track::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 16px; height: 16px; background: #fff; border-radius: 50%;
          transition: transform 0.2s;
        }
        .portal-open-toggle input:checked + .toggle-track { background: #66bb6a; }
        .portal-open-toggle input:checked + .toggle-track::after { transform: translateX(16px); }
        #version { position: fixed; bottom: 8px; left: 8px; z-index: 9999; color: rgba(255,255,255,0.3); font-size: 11px; margin: 0; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="portal-header">
        <img src="https://www.shadowaisolutions.com/SAIS_Logo.png" alt=""
             onerror="this.style.display='none'">
        <h1>Application Portal</h1>
        <div class="portal-subtitle">Central authentication gateway</div>
        <div class="portal-user-info">${escapeHtml(session.displayName || session.email)} &mdash; ${escapeHtml(session.email)}</div>
      </div>

      <div class="portal-toggles">
        <div class="portal-open-toggle">
          <label>
            <span>My apps</span>
            <input type="checkbox" id="portal-access-toggle">
            <span class="toggle-track"></span>
            <span>Show all</span>
          </label>
        </div>
        <div class="portal-open-toggle">
          <label>
            <span>Open in new tab</span>
            <input type="checkbox" id="portal-window-toggle">
            <span class="toggle-track"></span>
            <span>New window</span>
          </label>
        </div>
      </div>

      <div class="portal-section" id="portal-section-auth">
        <h2 class="portal-section-title">\uD83D\uDD10 Authentication-Enabled Applications</h2>
        <div class="portal-apps" id="portal-apps-auth"></div>
        <div class="portal-empty" id="portal-empty-auth" style="display:none">No authorized applications</div>
      </div>
      <div class="portal-section" id="portal-section-public">
        <h2 class="portal-section-title">\uD83C\uDF10 Public Applications</h2>
        <div class="portal-apps" id="portal-apps-public"></div>
      </div>

      <div class="portal-footer">Developed by: ShadowAISolutions</div>
      <div id="version">${escapeHtml(VERSION)}</div>

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

        // =============================================
        // PORTAL — Application Registry (with per-user access data)
        // =============================================
        var USER_APP_ACCESS = ${userAppAccessJson};
        var ACL_CONFIGURED = ${Object.keys(userAppAccess).length > 0 ? 'true' : 'false'};

        var PORTAL_APPS = [
          { name: 'Global ACL', url: 'globalacl.html', icon: '\\uD83D\\uDEE1', description: 'Centralized access control and user management across all projects.', requiresAuth: true },
          { name: 'Test Auth 1', url: 'testauth1.html', icon: '\\uD83D\\uDD10', description: 'Authentication testing environment with full security features.', requiresAuth: true },
          { name: 'Test Environment', url: 'testenvironment.html', icon: '\\uD83E\\uDDEA', description: 'General testing environment for development.', requiresAuth: false },
          { name: 'Homepage', url: 'index.html', icon: '\\uD83C\\uDFE0', description: 'Main landing page.', requiresAuth: false },
          { name: 'GAS Project Creator', url: 'gas-project-creator.html', icon: '\\u2699\\uFE0F', description: 'Create and configure new Google Apps Script projects.', requiresAuth: false }
        ];

        // Compute userHasAccess for each app
        PORTAL_APPS.forEach(function(app) {
          if (!app.requiresAuth) {
            app.userHasAccess = true; // Public apps are always accessible
          } else if (!ACL_CONFIGURED) {
            app.userHasAccess = true; // No ACL configured — treat all as accessible
          } else {
            var pageName = app.url.replace(/\\.html$/, '').toLowerCase();
            app.userHasAccess = USER_APP_ACCESS[pageName] === true;
          }
        });

        // =============================================
        // PORTAL — Open Mode Toggle
        // =============================================
        var PORTAL_OPEN_MODE_KEY = 'portal_open_mode';
        function getOpenInWindow() {
          try { return localStorage.getItem(PORTAL_OPEN_MODE_KEY) === 'window'; } catch(e) { return false; }
        }
        function setOpenMode(val) {
          try { localStorage.setItem(PORTAL_OPEN_MODE_KEY, val); } catch(e) {}
        }
        (function() {
          var toggle = document.getElementById('portal-window-toggle');
          toggle.checked = getOpenInWindow();
          toggle.addEventListener('change', function() {
            setOpenMode(this.checked ? 'window' : 'tab');
          });
        })();

        // =============================================
        // PORTAL — Access Filter Toggle
        // =============================================
        var PORTAL_ACCESS_FILTER_KEY = 'portal_access_filter';
        function getAccessFilterOn() {
          try {
            var val = localStorage.getItem(PORTAL_ACCESS_FILTER_KEY);
            return val === null ? true : val === '1'; // Default ON (My apps only)
          } catch(e) { return true; }
        }
        function setAccessFilter(on) {
          try { localStorage.setItem(PORTAL_ACCESS_FILTER_KEY, on ? '1' : '0'); } catch(e) {}
        }

        function filterApps() {
          var filterOn = getAccessFilterOn();
          var authCards = document.querySelectorAll('#portal-apps-auth .portal-app-card');
          var visibleCount = 0;
          for (var i = 0; i < authCards.length; i++) {
            var hasAccess = authCards[i].getAttribute('data-has-access') === 'true';
            if (filterOn && !hasAccess) {
              authCards[i].style.display = 'none';
            } else {
              authCards[i].style.display = '';
              authCards[i].className = 'portal-app-card' + (!hasAccess ? ' no-access' : '');
              visibleCount++;
            }
          }
          var emptyMsg = document.getElementById('portal-empty-auth');
          emptyMsg.style.display = visibleCount === 0 ? '' : 'none';
        }

        (function() {
          var toggle = document.getElementById('portal-access-toggle');
          toggle.checked = !getAccessFilterOn();
          toggle.addEventListener('change', function() {
            setAccessFilter(!this.checked);
            filterApps();
          });
        })();

        // =============================================
        // PORTAL — Render App Cards (sectioned)
        // =============================================
        (function() {
          var authContainer = document.getElementById('portal-apps-auth');
          var publicContainer = document.getElementById('portal-apps-public');
          var embedUrl = '${escapeJs(EMBED_PAGE_URL)}';
          var baseDir = embedUrl.substring(0, embedUrl.lastIndexOf('/') + 1);

          // Sort: accessible apps first, then inaccessible (within each section)
          PORTAL_APPS.sort(function(a, b) {
            if (a.userHasAccess === b.userHasAccess) return 0;
            return a.userHasAccess ? -1 : 1;
          });

          PORTAL_APPS.forEach(function(app) {
            var card = document.createElement('a');
            card.className = 'portal-app-card' + (!app.userHasAccess ? ' no-access' : '');
            card.setAttribute('data-has-access', app.userHasAccess ? 'true' : 'false');
            var targetUrl = baseDir + app.url;
            card.href = targetUrl;
            card.addEventListener('click', function(e) {
              if (getOpenInWindow()) {
                e.preventDefault();
                var w = Math.round(screen.width * 0.8);
                var h = Math.round(screen.height * 0.8);
                var left = Math.round((screen.width - w) / 2);
                var top = Math.round((screen.height - h) / 2);
                window.open(this.href, '_blank',
                  'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top
                  + ',noopener,noreferrer');
              }
            });
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            card.innerHTML = '<span class="app-icon">' + app.icon + '</span>'
              + '<span class="app-name">' + app.name + '</span>'
              + '<span class="app-desc">' + app.description + '</span>'
              + '<span class="app-status' + (app.requiresAuth ? ' connected' : '') + '">'
              + (app.requiresAuth ? '\\uD83D\\uDD12 Auth-enabled' : '\\uD83C\\uDF10 Public') + '</span>';

            if (app.requiresAuth) {
              authContainer.appendChild(card);
            } else {
              publicContainer.appendChild(card);
            }
          });

          // Apply initial filter
          filterApps();
        })();
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
