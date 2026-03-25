var VERSION = "v02.00g";
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
var SHEET_NAME = "Live_Sheet";

// Master ACL spreadsheet — centralized access control for all GAS-powered pages.
// Two tabs:
//   "Access" — Row 1 = headers (Email, Role, page1, page2, ...). Rows 2+ = email in col A, role in col B, TRUE/FALSE per page.
//   "Roles"  — Row 1 = headers (Role, perm1, perm2, ...). Rows 2+ = role name in col A, TRUE/FALSE per permission.
// UI element gating is handled client-side via data-requires-permission and data-requires-role attributes on HTML elements.
// If configured, this replaces the old editor/viewer sharing-list check.
// Leave as placeholder to fall back to SPREADSHEET_ID editor/viewer check.
var MASTER_ACL_SPREADSHEET_ID = "1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI";
var ACL_SHEET_NAME = "Access";
var ACL_PAGE_NAME  = "testauth1";

// Unified toggleable auth configuration (see 6-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md)
// Select a preset, then apply per-project overrides.
var ACTIVE_PRESET = 'hipaa';     // 'standard' or 'hipaa'
var PROJECT_OVERRIDES = {
  ENABLE_DOMAIN_RESTRICTION: false,  // allow any Google account (override hipaa default)
  // ALLOWED_DOMAINS: ['yourdomain.com'],  // set this if you enable domain restriction
};

// ══════════════
// RBAC — Role-Based Access Control
// ══════════════
// Roles and permissions are read from the "Roles" tab of the centralized ACL spreadsheet.
// The "Access" tab has a "Role" column (col B) that assigns one role per user.
// UI element gating is handled client-side via data-requires-permission and data-requires-role HTML attributes.
// HIPAA: §164.308(a)(4)(ii) — access authorization based on role.

// Hardcoded fallback — used ONLY when the Roles tab is missing or unreadable.
// In normal operation, getRolesFromSpreadsheet() reads from the spreadsheet.
var RBAC_ROLES_FALLBACK = {
  admin:     ['read', 'write', 'delete', 'export', 'amend', 'admin'],
  clinician: ['read', 'write', 'export', 'amend'],
  billing:   ['read', 'export'],
  viewer:    ['read']
};

// Default role when ACL does not specify one (fallback access via editor/viewer list)
var RBAC_DEFAULT_ROLE = 'viewer';

// In-memory cache for the current execution (avoids repeated spreadsheet reads within a single request)
var _rbacRolesCache = null;
var _rbacRolesCacheExpiry = 0;

/**
 * Cache epoch — a counter stored in ScriptProperties that prefixes all CacheService keys.
 * Incrementing the epoch instantly orphans ALL existing cache entries (they have the old
 * prefix and will never be read again). This is a nuclear cache clear without needing to
 * know individual cache keys. The epoch is read once per execution and cached in memory.
 *
 * getEpochCache() returns a wrapper around CacheService.getScriptCache() that auto-prefixes
 * all keys with the epoch. Use this instead of CacheService.getScriptCache() directly.
 */
var _cacheEpoch = null;
function _getCacheEpoch() {
  if (_cacheEpoch !== null) return _cacheEpoch;
  _cacheEpoch = PropertiesService.getScriptProperties().getProperty('CACHE_EPOCH') || '0';
  return _cacheEpoch;
}
function getEpochCache() {
  var raw = CacheService.getScriptCache();
  var pfx = 'e' + _getCacheEpoch() + '_';
  return {
    get: function(key) { return raw.get(pfx + key); },
    put: function(key, value, ttl) { raw.put(pfx + key, value, ttl); },
    remove: function(key) { raw.remove(pfx + key); },
    removeAll: function(keys) { raw.removeAll(keys.map(function(k) { return pfx + k; })); }
  };
}

/**
 * Read roles and permissions from the "Roles" tab of the centralized ACL spreadsheet.
 * Expected layout: Row 1 = headers (Role, permission1, permission2, ...).
 *                  Rows 2+ = role name in col A, TRUE/FALSE per permission column.
 * Returns an object like { admin: ['read','write','delete',...], viewer: ['read'], ... }
 * Falls back to RBAC_ROLES_FALLBACK if the spreadsheet/tab is unavailable.
 * Results are cached in CacheService for 10 minutes and in memory for the current execution.
 */
function getRolesFromSpreadsheet() {
  // In-memory cache for same-execution reuse (avoids even CacheService overhead)
  var now = Date.now();
  if (_rbacRolesCache && now < _rbacRolesCacheExpiry) {
    return _rbacRolesCache;
  }

  var cache = getEpochCache();
  var cacheKey = 'rbac_roles_matrix';
  var cached = cache.get(cacheKey);
  if (cached) {
    try {
      _rbacRolesCache = JSON.parse(cached);
      _rbacRolesCacheExpiry = now + 60000; // 1 min in-memory
      return _rbacRolesCache;
    } catch (e) { /* fall through to spreadsheet read */ }
  }

  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (!hasAcl) {
    _rbacRolesCache = RBAC_ROLES_FALLBACK;
    _rbacRolesCacheExpiry = now + 60000;
    return RBAC_ROLES_FALLBACK;
  }

  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var rolesSheet = ss.getSheetByName('Roles');
    if (!rolesSheet) {
      Logger.log('RBAC: "Roles" tab not found — using hardcoded fallback');
      _rbacRolesCache = RBAC_ROLES_FALLBACK;
      _rbacRolesCacheExpiry = now + 60000;
      return RBAC_ROLES_FALLBACK;
    }

    var data = rolesSheet.getDataRange().getValues();
    if (data.length < 2) {
      _rbacRolesCache = RBAC_ROLES_FALLBACK;
      _rbacRolesCacheExpiry = now + 60000;
      return RBAC_ROLES_FALLBACK;
    }

    // Row 0 = headers: [Role, perm1, perm2, ...]
    var headers = data[0];
    var permNames = [];
    for (var c = 1; c < headers.length; c++) {
      permNames.push(String(headers[c]).trim().toLowerCase());
    }

    var roles = {};
    for (var r = 1; r < data.length; r++) {
      var roleName = String(data[r][0]).trim().toLowerCase();
      if (!roleName) continue;
      var perms = [];
      for (var p = 0; p < permNames.length; p++) {
        var val = data[r][p + 1];
        if (val === true || String(val).trim().toUpperCase() === 'TRUE') {
          perms.push(permNames[p]);
        }
      }
      roles[roleName] = perms;
    }

    // Cache for 10 minutes in CacheService
    cache.put(cacheKey, JSON.stringify(roles), 600);
    _rbacRolesCache = roles;
    _rbacRolesCacheExpiry = now + 60000;
    return roles;
  } catch (e) {
    Logger.log('RBAC: Error reading Roles tab — ' + e.message + ' — using hardcoded fallback');
    _rbacRolesCache = RBAC_ROLES_FALLBACK;
    _rbacRolesCacheExpiry = now + 60000;
    return RBAC_ROLES_FALLBACK;
  }
}

// Check if a role has a specific permission (reads from spreadsheet)
function hasPermission(role, permission) {
  var roles = getRolesFromSpreadsheet();
  var perms = roles[role];
  if (!perms) return false;
  return perms.indexOf(permission) !== -1;
}

// Validate and gate a data operation by permission.
// Throws PERMISSION_DENIED if the user's role lacks the required permission.
// Returns the user object (from validateSessionForData) on success.
function checkPermission(user, requiredPermission, operationName) {
  var role = user.role || RBAC_DEFAULT_ROLE;
  if (!hasPermission(role, requiredPermission)) {
    var roles = getRolesFromSpreadsheet();
    auditLog('security_alert', user.email, 'permission_denied', {
      operation: operationName,
      role: role,
      requiredPermission: requiredPermission,
      availablePermissions: (roles[role] || []).join(',')
    });
    throw new Error('PERMISSION_DENIED');
  }
  return user;
}

// ══════════════
// AUTH PRESETS
// ══════════════
var PRESETS = {
  standard: {
    // SESSION_EXPIRATION: 3600,       // seconds — rolling session lifetime, reset by heartbeats (1hr)
    SESSION_EXPIRATION: 180,           // ⚡ TEST VALUE (3min) — uncomment line above and delete this line to restore
    // ABSOLUTE_SESSION_TIMEOUT: 28800, // seconds — hard ceiling, never resets regardless of activity (8hr)
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
    AUDIT_LOG_SHEET_NAME: 'SessionAuditLog',
    AUDIT_LOG_RETENTION_YEARS: 6,
    ENABLE_HMAC_INTEGRITY: true,
    HMAC_SECRET_PROPERTY: 'HMAC_SECRET',
    ENABLE_EMERGENCY_ACCESS: false,
    EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS',
    TOKEN_EXCHANGE_METHOD: 'url',
    ENABLE_CROSS_DEVICE_ENFORCEMENT: true,
    ENABLE_DATA_OP_VALIDATION: false,  // Data ops execute without session re-validation (current behavior)
    ENABLE_DOM_CLEARING_ON_EXPIRY: false,  // Auth wall overlay only (current behavior)
    ENABLE_ESCALATING_LOCKOUT: false,  // Use existing flat rate limit (5/5min)
    ENABLE_IP_LOGGING: false,          // Do not fetch or log client IP
    ENABLE_DATA_AUDIT_LOG: false,      // No per-operation audit logging (current behavior)
    DATA_AUDIT_LOG_SHEET_NAME: 'DataAuditLog'
  },
  hipaa: {
    // SESSION_EXPIRATION: 900,        // seconds — rolling session lifetime, reset by heartbeats (15min)
    SESSION_EXPIRATION: 180,           // ⚡ TEST VALUE (3min) — uncomment line above and delete this line to restore
    // ABSOLUTE_SESSION_TIMEOUT: 28800, // seconds — hard ceiling, never resets regardless of activity (8hr)
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
    AUDIT_LOG_SHEET_NAME: 'SessionAuditLog',
    AUDIT_LOG_RETENTION_YEARS: 6,
    ENABLE_HMAC_INTEGRITY: true,
    HMAC_SECRET_PROPERTY: 'HMAC_SECRET',
    ENABLE_EMERGENCY_ACCESS: true,
    EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS',
    TOKEN_EXCHANGE_METHOD: 'postMessage',
    ENABLE_CROSS_DEVICE_ENFORCEMENT: true,
    ENABLE_DATA_OP_VALIDATION: true,   // Every google.script.run data op validates session first
    ENABLE_DOM_CLEARING_ON_EXPIRY: true,   // Destroy GAS iframe content on session expiry
    ENABLE_ESCALATING_LOCKOUT: true,   // Escalating lockout tiers (5min → 30min → 6hr)
    ENABLE_IP_LOGGING: false,          // DISABLED — ipify.org lacks BAA, violates HIPAA (Phase 3: C-3)
    ENABLE_DATA_AUDIT_LOG: true,       // Log individual data access events (reads, writes)
    DATA_AUDIT_LOG_SHEET_NAME: 'DataAuditLog'
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

// ── Admin Utilities — run from the GAS Editor (select function → Run) ──

/**
 * Clear the access cache for a specific user so their next login reads the ACL fresh.
 * @param {string} email — the user's email address. When called from the GAS editor
 *   (no parameter), reads from Script Properties key "CLEAR_CACHE_EMAIL".
 *   Usage: Script Properties → CLEAR_CACHE_EMAIL = user@example.com → Run this function.
 * Note: uses the same epoch bump as clearAllAccessCache — all users are affected.
 * GAS CacheService does not support per-key enumeration, so targeted clearing is not possible.
 */
function clearAccessCacheForUser(email) {
  if (!email) {
    email = PropertiesService.getScriptProperties().getProperty('CLEAR_CACHE_EMAIL');
  }
  if (!email) {
    Logger.log('No email specified. Set Script Properties key "CLEAR_CACHE_EMAIL" or pass email as parameter.');
    return;
  }
  // Bump epoch to invalidate all cache (no way to target individual keys in GAS)
  clearAllAccessCache();
  Logger.log('Cache cleared for all users (epoch bumped). Target user: ' + email);
}

/**
 * Nuclear cache clear — increments the cache epoch so ALL existing CacheService entries
 * are instantly orphaned (they have the old epoch prefix and will never be read again).
 * No need to enumerate individual keys — everything is invalidated at once.
 * After incrementing, all users must re-authenticate on their next request.
 */
function clearAllAccessCache() {
  var props = PropertiesService.getScriptProperties();
  var oldEpoch = parseInt(props.getProperty('CACHE_EPOCH') || '0', 10);
  var newEpoch = String(oldEpoch + 1);
  props.setProperty('CACHE_EPOCH', newEpoch);

  // Reset in-memory cache for this execution
  _cacheEpoch = newEpoch;
  _rbacRolesCache = null;
  _rbacRolesCacheExpiry = 0;

  Logger.log('Cache epoch bumped from ' + oldEpoch + ' to ' + newEpoch
    + ' — ALL cached access, roles, and sessions are now invalidated.'
    + ' Old entries will expire naturally from CacheService within 10 minutes.');
}

/**
 * Diagnostic — probe all known cache key patterns and log what's found.
 * Run from the GAS editor to see what's currently in the cache.
 * Checks both the current epoch and the previous epoch (to detect stale entries).
 */
function inspectCache() {
  var props = PropertiesService.getScriptProperties();
  var epoch = parseInt(props.getProperty('CACHE_EPOCH') || '0', 10);
  var raw = CacheService.getScriptCache();

  // Collect emails from ACL + sharing list
  var emails = [];
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (hasAcl) {
    try {
      var aclSs = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
      var aclSheet = aclSs.getSheetByName(ACL_SHEET_NAME);
      if (aclSheet) {
        var data = aclSheet.getDataRange().getValues();
        for (var r = 1; r < data.length; r++) {
          var em = String(data[r][0]).trim().toLowerCase();
          if (em && em.indexOf('@') > -1) emails.push(em);
        }
      }
    } catch(e) { Logger.log('ACL read error: ' + e.message); }
  }
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  if (hasSheet) {
    try {
      var dataSs = SpreadsheetApp.openById(SPREADSHEET_ID);
      var allUsers = dataSs.getEditors().concat(dataSs.getViewers());
      for (var u = 0; u < allUsers.length; u++) {
        var ue = allUsers[u].getEmail().toLowerCase();
        if (ue && emails.indexOf(ue) === -1) emails.push(ue);
      }
    } catch(e) { Logger.log('Sharing list read error: ' + e.message); }
  }

  Logger.log('══════ CACHE INSPECTION ══════');
  Logger.log('Current epoch: ' + epoch);
  Logger.log('Users found: ' + emails.length);
  Logger.log('');

  // Check both current and previous epoch
  var epochs = [epoch, epoch - 1];
  for (var ei = 0; ei < epochs.length; ei++) {
    var ep = epochs[ei];
    if (ep < 0) continue;
    var pfx = 'e' + ep + '_';
    var label = (ep === epoch) ? 'CURRENT (e' + ep + ')' : 'PREVIOUS (e' + ep + ' — should be empty)';
    Logger.log('── ' + label + ' ──');

    // Roles matrix
    var rolesVal = raw.get(pfx + 'rbac_roles_matrix');
    Logger.log('  rbac_roles_matrix: ' + (rolesVal ? rolesVal.substring(0, 100) + '...' : '(empty)'));

    // Per-user keys
    for (var i = 0; i < emails.length; i++) {
      var email = emails[i];
      var access = raw.get(pfx + 'access_' + email);
      var role = raw.get(pfx + 'role_' + email);
      var sessions = raw.get(pfx + 'sessions_' + email);
      if (access || role || sessions) {
        Logger.log('  ' + email + ':');
        if (access) Logger.log('    access_: ' + access);
        if (role) Logger.log('    role_: ' + role);
        if (sessions) {
          try {
            var tokens = JSON.parse(sessions);
            Logger.log('    sessions_: ' + tokens.length + ' active token(s)');
            for (var t = 0; t < tokens.length; t++) {
              var sessRaw = raw.get(pfx + 'session_' + tokens[t]);
              if (sessRaw) {
                try {
                  var sess = JSON.parse(sessRaw);
                  Logger.log('      session ' + (t+1) + ': role=' + sess.role + ', created=' + new Date(sess.createdAt).toISOString());
                } catch(pe) {
                  Logger.log('      session ' + (t+1) + ': (unparseable)');
                }
              } else {
                Logger.log('      session ' + (t+1) + ': (expired/missing)');
              }
            }
          } catch(je) { Logger.log('    sessions_: (unparseable)'); }
        }
      }
    }
    Logger.log('');
  }
  Logger.log('══════ END INSPECTION ══════');
}

/**
 * List all active sessions by walking the ACL spreadsheet.
 * Admin-only — requires a valid session with 'admin' permission.
 * Called via google.script.run from the admin session panel.
 */
function listActiveSessions(sessionToken) {
  var user = validateSessionForData(sessionToken, 'listActiveSessions');
  checkPermission(user, 'admin', 'listActiveSessions');

  var cache = getEpochCache();
  var activeSessions = [];

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
          role: sess.role || RBAC_DEFAULT_ROLE,
          createdAt: sess.absoluteCreatedAt || sess.createdAt,
          lastActivity: sess.lastActivity,
          absoluteRemaining: absRemaining,
          rollingRemaining: rollingRemaining,
          isEmergencyAccess: sess.isEmergencyAccess || false,
          isSelf: (sess.email || '').toLowerCase() === (user.email || '').toLowerCase()
        });
      }
    }
  } catch (e) {
    Logger.log('listActiveSessions error: ' + e.message);
  }

  auditLog('admin_action', user.email, 'list_active_sessions',
    { sessionCount: activeSessions.length });

  return activeSessions;
}

/**
 * Sign out a specific user by email (invalidate all their sessions).
 * Admin-only — requires a valid session with 'admin' permission.
 * Called via google.script.run from the admin session panel.
 */
function adminSignOutUser(sessionToken, targetEmail) {
  var user = validateSessionForData(sessionToken, 'adminSignOutUser');
  checkPermission(user, 'admin', 'adminSignOutUser');

  if (!targetEmail) return { success: false, error: 'no_email' };

  invalidateAllSessions(targetEmail, 'admin_signout');

  auditLog('admin_action', user.email, 'admin_sign_out_user',
    { targetEmail: targetEmail });

  return { success: true, email: targetEmail };
}

// ── Live Data via CacheService ──
// PROJECT OVERRIDE: Data reads via CacheService — refreshed by installable onEdit
// trigger bound to the target spreadsheet. Spreadsheet stays private.
// processHeartbeat() piggybacks cached data on existing heartbeat calls (zero extra quota).
// Heartbeat reads re-up the cache TTL so data never expires while viewers are present.
// One-time setup: run installEditTrigger() from the script editor.

/**
 * refreshDataCache() — reads the private spreadsheet and stores data in CacheService.
 * Called by the installable onEdit trigger when the data sheet is edited, and as a
 * self-repair fallback when getCachedData() finds an empty cache.
 */
function refreshDataCache() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return;
    var data = sheet.getDataRange().getValues();
    var headers = data[0] || [];
    var rows = data.slice(1);
    var result = JSON.stringify({ headers: headers, rows: rows, ts: Date.now() });
    // 100KB CacheService limit per key — large sheets may need chunking in the future
    // 21600s (6h) TTL — heartbeat reads re-up this TTL so it never expires while viewers
    // are present. The long TTL is a safety net for gaps between the last viewer leaving
    // and the next one arriving.
    CacheService.getScriptCache().put('livedata_' + SHEET_NAME, result, 21600);
  } catch (e) {
    Logger.log('refreshDataCache error: ' + e.message);
  }
}

/**
 * getCachedData() — reads live data from CacheService with self-healing.
 * On cache hit: re-ups the TTL so data stays alive as long as viewers are present.
 * On cache miss: self-repairs by calling refreshDataCache() to read the spreadsheet.
 * Returns parsed object { headers, rows, ts } or null if spreadsheet is unavailable.
 */
function getCachedData() {
  var cache = CacheService.getScriptCache();
  var key = 'livedata_' + SHEET_NAME;
  var cached = cache.get(key);
  if (cached) {
    // Re-up TTL on every read — cache never expires while viewers are present
    cache.put(key, cached, 21600);
    return JSON.parse(cached);
  }
  // Self-repair: cache miss → read spreadsheet, warm cache
  refreshDataCache();
  cached = cache.get(key);
  return cached ? JSON.parse(cached) : null;
}

/**
 * onEditInstallable(e) — refreshes CacheService immediately when the data sheet is edited.
 * Installable trigger — required because this is a standalone script (not container-bound).
 * One-time setup: run installEditTrigger() from the Apps Script editor.
 * Only refreshes when the edited sheet matches SHEET_NAME.
 */
function onEditInstallable(e) {
  try {
    if (!e || !e.range) return;
    if (e.range.getSheet().getName() === SHEET_NAME) {
      refreshDataCache();
    }
  } catch (err) {
    Logger.log('onEditInstallable cache refresh error: ' + err.message);
  }
}

/**
 * installEditTrigger() — one-time setup function. Run this manually from the
 * Apps Script editor (Run → installEditTrigger) to create an installable onEdit
 * trigger bound to the target spreadsheet.
 * Safe to run multiple times — removes existing triggers before creating a new one.
 */
function installEditTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onEditInstallable') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('onEditInstallable')
    .forSpreadsheet(SPREADSHEET_ID)
    .onEdit()
    .create();
  Logger.log('Edit trigger installed for spreadsheet: ' + SPREADSHEET_ID);
}

/**
 * writeCell(token, row, col, value) — writes a single cell value to the data spreadsheet.
 * Validates the session first (requires 'write' permission via RBAC).
 * After writing, refreshes the cache immediately for instant feedback.
 * Returns signed response with updated live data.
 */
function writeCell(token, row, col, value) {
  var user = validateSessionForData(token, 'writeCell');
  checkPermission(user, 'write', 'writeCell');

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    return signMessage({ type: 'gas-write-error', error: 'sheet_not_found' }, user.messageKey || '');
  }

  // +2 for header row offset (row 0 = data row 0 = spreadsheet row 2), +1 for 1-indexed
  sheet.getRange(row + 2, col + 1).setValue(value);

  // Refresh cache immediately for instant feedback (onEditInstallable will also fire)
  refreshDataCache();

  auditLog('data_write', user.email, 'cell_edit', {
    row: row, col: col, sheet: SHEET_NAME
  });

  return signMessage({ type: 'gas-write-ok', liveData: getCachedData() }, user.messageKey || '');
}

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
  if (!secret || !callerEmail) return { valid: false, reason: 'missing_params' };
  var expected = getCrossProjectSecret();
  if (!expected || secret !== expected) return { valid: false, reason: 'invalid_secret' };
  // Verify caller has admin role via ACL
  var access = checkSpreadsheetAccess(callerEmail);
  if (!access.hasAccess || access.role !== 'admin') return { valid: false, reason: 'not_admin' };
  return { valid: true, email: callerEmail };
}

function listActiveSessionsInternal(callerEmail) {
  var cache = getEpochCache();
  var activeSessions = [];
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
          role: sess.role || RBAC_DEFAULT_ROLE,
          createdAt: sess.absoluteCreatedAt || sess.createdAt,
          lastActivity: sess.lastActivity,
          absoluteRemaining: absRemaining,
          rollingRemaining: rollingRemaining,
          isEmergencyAccess: sess.isEmergencyAccess || false,
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
  // Audit: Log every deploy trigger for security monitoring
  var auditCache = getEpochCache();
  var deployLog = auditCache.get('deploy_audit_log') || '[]';
  var log;
  try { log = JSON.parse(deployLog); } catch(e) { log = []; }
  log.push({
    timestamp: new Date().toISOString(),
    trigger: 'doPost(action=deploy)',
    currentVersion: VERSION
  });
  if (log.length > 20) log = log.slice(-20);
  auditCache.put('deploy_audit_log', JSON.stringify(log), 21600);

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
      var protection = sheet.protect();
      protection.setDescription('Session Audit Log — protected');
      protection.setWarningOnly(true);
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
// AUTH — Data-Level Audit Logger (Toggle-Gated, Phase 8)
// No-op when AUTH_CONFIG.ENABLE_DATA_AUDIT_LOG === false.
// Separate from session audit log — captures per-operation PHI access events.
// =============================================

function dataAuditLog(user, action, resourceType, resourceId, details) {
  if (!AUTH_CONFIG.ENABLE_DATA_AUDIT_LOG) return;
  try {
    if (!SPREADSHEET_ID || SPREADSHEET_ID === "YOUR_SPREADSHEET_ID") return;
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetName = AUTH_CONFIG.DATA_AUDIT_LOG_SHEET_NAME || 'DataAuditLog';
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        'Timestamp',
        'User',
        'Action',
        'ResourceType',
        'ResourceId',
        'Details',
        'SessionId',
        'IsEmergencyAccess'
      ]);
      var protection = sheet.protect();
      protection.setDescription('HIPAA Data Audit Log — protected');
      protection.setWarningOnly(true);
    }
    sheet.appendRow([
      new Date().toISOString(),
      user.email || user,
      action,
      resourceType,
      resourceId || '',
      JSON.stringify(details || {}),
      details && details.sessionId ? details.sessionId.substring(0, 8) + '...' : '',
      details && details.isEmergencyAccess ? 'YES' : 'NO'
    ]);
  } catch(e) {
    Logger.log('Data audit log error: ' + e.message);
  }
}

// =============================================
// AUTH — HMAC Session Integrity (Toggle-Gated)
// =============================================

function generateSessionHmac(sessionData) {
  if (!AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) return '';
  var secret = PropertiesService.getScriptProperties().getProperty(AUTH_CONFIG.HMAC_SECRET_PROPERTY);
  if (!secret) {
    // FAIL CLOSED: HMAC is enabled but secret is missing — this is a misconfiguration.
    // Log a security alert and throw to prevent session creation without integrity protection.
    auditLog('security_alert', sessionData.email || 'system', 'hmac_secret_missing',
      { property: AUTH_CONFIG.HMAC_SECRET_PROPERTY });
    throw new Error('HMAC integrity is enabled but HMAC_SECRET is not configured in Script Properties. '
      + 'This should auto-generate on first deploy via pullAndDeployFromGitHub(). '
      + 'If missing, verify deployment completed successfully or set manually: GAS Editor → Project Settings → Script Properties → Add: '
      + AUTH_CONFIG.HMAC_SECRET_PROPERTY + ' = <random-64-char-hex-string>');
  }
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
  var secret = PropertiesService.getScriptProperties().getProperty(AUTH_CONFIG.HMAC_SECRET_PROPERTY);
  if (!secret) {
    // FAIL CLOSED: cannot verify without a secret — reject the session
    auditLog('security_alert', sessionData.email || 'unknown', 'hmac_secret_missing_verify',
      { property: AUTH_CONFIG.HMAC_SECRET_PROPERTY });
    return false;
  }
  if (!sessionData.hmac) return false;  // Secret exists but session has no HMAC → reject
  var expected = generateSessionHmac(sessionData);
  return expected === sessionData.hmac;
}

// ── GAS-Side HMAC-SHA256 Message Signing ──
// Uses Utilities.computeHmacSha256Signature() — native GAS API.
// This is the SAME algorithm as Web Crypto API HMAC-SHA256.
// The outputs are byte-for-byte identical when given the same key and payload.

/**
 * Sign a message object with HMAC-SHA256 using the session's messageKey.
 * @param {Object} msgObj - The message to sign (will have _sig added)
 * @param {string} messageKey - The session's HMAC key
 * @returns {Object} - The message with _sig field containing hex-encoded signature
 */
function signMessage(msgObj, messageKey) {
  if (!messageKey) return msgObj;

  // Create a deterministic payload — sorted keys, exclude _sig
  var copy = {};
  var keys = Object.keys(msgObj).sort();
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] !== '_sig') copy[keys[i]] = msgObj[keys[i]];
  }
  var payload = JSON.stringify(copy);

  // Compute HMAC-SHA256 using GAS native API
  var signature = Utilities.computeHmacSha256Signature(payload, messageKey);

  // Convert signed byte array to hex string
  // GAS returns signed bytes (-128 to 127), must mask to unsigned (0-255)
  var hex = signature.map(function(byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');

  msgObj._sig = hex;
  return msgObj;
}

// =============================================
// AUTH — Session Management (Server-Side)
// Toggle-gated: domain restriction, HMAC, audit, emergency access
// =============================================

function exchangeTokenForSession(accessToken) {
  if (!accessToken) {
    return { success: false, error: "no_token" };
  }

  // Rate limiting: configurable via ENABLE_ESCALATING_LOCKOUT toggle
  var rlCache = getEpochCache();
  var tokenFingerprint = 'ratelimit_' + accessToken.substring(0, 16);
  var attempts = rlCache.get(tokenFingerprint);
  var attemptCount = attempts ? parseInt(attempts, 10) : 0;

  if (!AUTH_CONFIG.ENABLE_ESCALATING_LOCKOUT) {
    // Standard preset: flat rate limit (5 failures / 5-minute window)
    if (attemptCount >= 5) {
      auditLog('login_failed', '', 'rate_limited', { fingerprint: tokenFingerprint.substring(0, 20) });
      return { success: false, error: "rate_limited" };
    }
  } else {
    // HIPAA preset: escalating lockout tiers
    // Tier 1: 5 failures → 5 min lockout
    // Tier 2: 10 cumulative failures → 30 min lockout
    // Tier 3: 20 cumulative failures → 6 hr lockout
    var LOCKOUT_TIER1 = 5;
    var LOCKOUT_TIER2 = 10;
    var LOCKOUT_TIER3 = 20;
    var LOCKOUT_TIER1_DURATION = 300;    // 5 minutes
    var LOCKOUT_TIER2_DURATION = 1800;   // 30 minutes
    var LOCKOUT_TIER3_DURATION = 21600;  // 6 hours

    if (attemptCount >= LOCKOUT_TIER3) {
      auditLog('security_alert', '', 'account_locked_tier3',
        { fingerprint: tokenFingerprint.substring(0, 20), attempts: attemptCount });
      return { success: false, error: "account_locked" };
    }
    if (attemptCount >= LOCKOUT_TIER2) {
      auditLog('login_failed', '', 'rate_limited_tier2',
        { fingerprint: tokenFingerprint.substring(0, 20), attempts: attemptCount });
      return { success: false, error: "rate_limited" };
    }
    if (attemptCount >= LOCKOUT_TIER1) {
      auditLog('login_failed', '', 'rate_limited',
        { fingerprint: tokenFingerprint.substring(0, 20), attempts: attemptCount });
      return { success: false, error: "rate_limited" };
    }
  }

  // Compute lockout TTL for failed login increments
  var rlTtl = 300;  // Default: 5 minutes (standard preset flat rate limit)
  if (AUTH_CONFIG.ENABLE_ESCALATING_LOCKOUT) {
    var nextCount = attemptCount + 1;
    if (nextCount >= 20) rlTtl = 21600;       // Tier 3: 6 hours
    else if (nextCount >= 10) rlTtl = 1800;   // Tier 2: 30 minutes
    // else rlTtl stays 300 (Tier 1: 5 minutes)
  }

  var userInfo = validateGoogleToken(accessToken);
  if (!userInfo || userInfo.status === "not_signed_in") {
    auditLog('login_failed', '', 'invalid_token', { reason: 'Google token validation failed' });
    rlCache.put(tokenFingerprint, String(attemptCount + 1), rlTtl);
    return { success: false, error: "invalid_token" };
  }

  // Domain restriction (toggle-gated)
  if (AUTH_CONFIG.ENABLE_DOMAIN_RESTRICTION) {
    // Fail closed: empty allowlist with domain restriction enabled is a misconfiguration
    if (!AUTH_CONFIG.ALLOWED_DOMAINS || AUTH_CONFIG.ALLOWED_DOMAINS.length === 0) {
      auditLog('security_alert', userInfo.email, 'domain_restriction_misconfigured',
        { reason: 'ENABLE_DOMAIN_RESTRICTION is true but ALLOWED_DOMAINS is empty' });
      return { success: false, error: "domain_not_configured" };
    }
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
      rlCache.put(tokenFingerprint, String(attemptCount + 1), rlTtl);
      return { success: false, error: "domain_not_allowed" };
    }
  }

  // Check access via master ACL spreadsheet (or fall back to SPREADSHEET_ID editor/viewer list)
  // Returns RBAC-aware object: { hasAccess, role, isEmergencyAccess }
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  var accessResult = { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
  if (hasAcl || hasSheet) {
    accessResult = checkSpreadsheetAccess(userInfo.email);
    if (!accessResult.hasAccess) {
      auditLog('login_failed', userInfo.email, 'access_denied',
        { reason: 'No spreadsheet access' });
      rlCache.put(tokenFingerprint, String(attemptCount + 1), rlTtl);
      return { success: false, error: "not_authorized" };
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
    messageKey: messageKey,
    // RBAC: role and permissions stored in session for fast permission checks
    // HIPAA: §164.308(a)(4)(ii) — access authorization based on role
    role: accessResult.role,
    permissions: getRolesFromSpreadsheet()[accessResult.role] || [],
    isEmergencyAccess: accessResult.isEmergencyAccess
  };

  // HMAC integrity (toggle-gated)
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    sessionData.hmac = generateSessionHmac(sessionData);
  }

  var cache = getEpochCache();
  cache.put("session_" + sessionToken, JSON.stringify(sessionData), AUTH_CONFIG.SESSION_EXPIRATION);

  trackUserSession(userInfo.email, sessionToken);

  // Clear rate limit on successful login
  rlCache.remove(tokenFingerprint);

  auditLog('login_success', userInfo.email, 'session_created',
    { sessionId: sessionToken.substring(0, 8) + '...', role: accessResult.role,
      isEmergencyAccess: accessResult.isEmergencyAccess });

  return {
    success: true,
    sessionToken: sessionToken,
    email: userInfo.email,
    displayName: userInfo.displayName,
    absoluteTimeout: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT || 0,
    messageKey: messageKey,
    role: accessResult.role,
    permissions: getRolesFromSpreadsheet()[accessResult.role] || []
  };
}

function validateSession(sessionToken) {
  if (!sessionToken || sessionToken.length < 32) {
    return { status: "not_signed_in" };
  }

  var cache = getEpochCache();
  var raw = cache.get("session_" + sessionToken);
  if (!raw) {
    // Check for eviction tombstone — tells the client WHY the session is gone.
    // Don't remove it — let it expire naturally (5 min TTL) so both heartbeat
    // and page refresh can read it independently.
    var evictionReason = cache.get("evicted_" + sessionToken) || '';
    if (evictionReason) {
      return { status: "not_signed_in", evictionReason: evictionReason };
    }
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
    needsReauth: needsReauth,
    role: sessionData.role || RBAC_DEFAULT_ROLE,
    permissions: sessionData.permissions || getRolesFromSpreadsheet()[sessionData.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE]
  };
}

// =============================================
// AUTH — Data Operation Session Gate
// Every google.script.run that touches patient data must call this first.
// Returns the validated session data (email, etc.) or throws if invalid.
// HIPAA: 45 CFR § 164.312(a)(1) — verify identity before every data access
// =============================================

function validateSessionForData(sessionToken, operationName) {
  // Toggle check — standard preset skips validation entirely
  if (!AUTH_CONFIG.ENABLE_DATA_OP_VALIDATION) {
    return { email: 'unvalidated', displayName: '' };
  }

  if (!sessionToken || sessionToken.length < 32) {
    auditLog('security_alert', 'unknown', 'data_access_no_token',
      { operation: operationName });
    throw new Error('SESSION_EXPIRED');
  }

  var cache = getEpochCache();
  var raw = cache.get("session_" + sessionToken);
  if (!raw) {
    // Check for eviction tombstone
    var evicted = cache.get("evicted_" + sessionToken);
    auditLog('security_alert', 'unknown', 'data_access_expired_session',
      { operation: operationName, reason: evicted || 'timeout' });
    throw new Error(evicted ? 'SESSION_EVICTED' : 'SESSION_EXPIRED');
  }

  var sessionData;
  try {
    sessionData = JSON.parse(raw);
  } catch (e) {
    auditLog('security_alert', 'unknown', 'data_access_corrupt_session',
      { operation: operationName });
    throw new Error('SESSION_CORRUPT');
  }

  // HMAC verification
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY && !verifySessionHmac(sessionData)) {
    auditLog('security_alert', sessionData.email || 'unknown', 'data_access_hmac_failed',
      { operation: operationName });
    cache.remove("session_" + sessionToken);
    throw new Error('SESSION_INTEGRITY_VIOLATION');
  }

  // Absolute timeout check
  if (sessionData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
    var absElapsed = (Date.now() - sessionData.absoluteCreatedAt) / 1000;
    if (absElapsed > AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
      auditLog('security_alert', sessionData.email, 'data_access_absolute_timeout',
        { operation: operationName, elapsed: Math.round(absElapsed) + 's' });
      cache.remove("session_" + sessionToken);
      throw new Error('SESSION_EXPIRED');
    }
  }

  // Rolling timeout check
  var elapsed = (Date.now() - sessionData.createdAt) / 1000;
  if (elapsed > AUTH_CONFIG.SESSION_EXPIRATION) {
    auditLog('security_alert', sessionData.email, 'data_access_rolling_timeout',
      { operation: operationName, elapsed: Math.round(elapsed) + 's' });
    cache.remove("session_" + sessionToken);
    throw new Error('SESSION_EXPIRED');
  }

  // Session is valid — return user identity, role, and context for audit logging
  return {
    email: sessionData.email,
    displayName: sessionData.displayName,
    clientIp: sessionData.clientIp || 'not-collected',
    isEmergencyAccess: sessionData.isEmergencyAccess || false,
    role: sessionData.role || RBAC_DEFAULT_ROLE,
    permissions: sessionData.permissions || getRolesFromSpreadsheet()[sessionData.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE]
  };
}

// =============================================
// DATA OPERATIONS — Session-gated
// Every function that reads/writes data must call validateSessionForData() first.
// =============================================

// Phase 3: clientIp parameter removed — to re-enable, change signature to:
// function saveNote(sessionToken, noteText, clientIp) {
function saveNote(sessionToken, noteText) {
  var user = validateSessionForData(sessionToken, 'saveNote');
  // RBAC: require 'write' permission — throws PERMISSION_DENIED if denied
  checkPermission(user, 'write', 'saveNote');
  // Phase 3 (C-3): Client IP no longer collected — use 'not-collected' for audit trail
  // To re-enable: var ip = clientIp || user.clientIp || '';
  var ip = user.clientIp || 'not-collected';
  // Data operation (only runs if session is valid AND permission granted)
  // Security: sessionId omitted from session audit log details (it's already in the SessionId column via dataAuditLog)
  auditLog('data_access', user.email, 'write',
    { operation: 'saveNote', noteLength: (noteText || '').length, clientIp: ip,
      role: user.role });
  // Data-level audit log (Phase 8 — HIPAA per-operation logging)
  // Security: sessionId truncated to 8 chars to prevent token theft from audit logs.
  // To log the full token, change the line below to: sessionId: sessionToken,
  var truncatedSessionId = sessionToken ? sessionToken.substring(0, 8) + '...' : '';
  var noteId = Utilities.getUuid();
  dataAuditLog(user, 'write', 'patient_note', noteId, {
    sessionId: truncatedSessionId,
    isEmergencyAccess: user.isEmergencyAccess,
    noteLength: (noteText || '').length,
    clientIp: ip,
    role: user.role,
    permissionChecked: 'write'
  });
  return { success: true, email: user.email, note: noteText, role: user.role };
}

// ═══════════════════════════════════════════════════════
// PHASE A — SHARED UTILITIES
// Implements patient rights per 45 CFR §164.524, §164.526, §164.528
// ═══════════════════════════════════════════════════════

/**
 * Generates a unique request ID for tracking compliance requests.
 * Format: PREFIX-YYYYMMDD-UUID8 (e.g. REQ-20260323-a1b2c3d4)
 */
function generateRequestId(prefix) {
  prefix = prefix || 'REQ';
  var date = Utilities.formatDate(new Date(), 'America/New_York', 'yyyyMMdd');
  var uuid = Utilities.getUuid().replace(/-/g, '').substring(0, 8);
  return prefix + '-' + date + '-' + uuid;
}

/**
 * Returns an EST-formatted ISO timestamp for audit entries.
 * Consistent with existing auditLog() timestamp format.
 */
function formatHipaaTimestamp() {
  return Utilities.formatDate(new Date(), 'America/New_York', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}

/**
 * Validates that the authenticated user can access the specified individual's data.
 * Self-service: user can only access their OWN data.
 * Admin: can access any individual's data.
 *
 * @param {Object} user - Session user object (from validateSessionForData)
 * @param {string} targetEmail - The individual whose data is being accessed
 * @param {string} operationName - Name of the calling operation (for audit)
 * @returns {boolean} true if access is permitted
 * @throws {Error} 'ACCESS_DENIED' if user cannot access this individual's data
 */
function validateIndividualAccess(user, targetEmail, operationName) {
  if (hasPermission(user.role, 'admin')) {
    auditLog('individual_access', user.email, 'admin_access', {
      operation: operationName,
      targetEmail: targetEmail,
      accessType: 'admin_override'
    });
    return true;
  }
  if (user.email.toLowerCase() !== targetEmail.toLowerCase()) {
    auditLog('security_alert', user.email, 'individual_access_denied', {
      operation: operationName,
      targetEmail: targetEmail,
      reason: 'non_admin_accessing_other_user_data'
    });
    throw new Error('ACCESS_DENIED');
  }
  return true;
}

/**
 * Gets or creates a sheet in the Project Data Spreadsheet.
 * Follows the existing _writeAuditLogEntry() auto-creation pattern.
 *
 * @param {string} sheetName - Name of the sheet to get/create
 * @param {string[]} headers - Column headers for new sheet creation
 * @returns {Sheet} The Google Sheet object
 */
function getOrCreateSheet(sheetName, headers) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    var protection = sheet.protect().setDescription('HIPAA Protected — ' + sheetName);
    protection.setWarningOnly(true);
    auditLog('sheet_created', 'system', 'success', {
      sheetName: sheetName,
      columnCount: headers.length,
      protection: 'warning_only'
    });
  }
  return sheet;
}

/**
 * Wraps a Phase A operation with standard error handling.
 * Catches known error types and returns structured responses.
 * HIPAA: never leaks PHI in error messages.
 */
function wrapPhaseAOperation(operationName, sessionToken, operationFn) {
  try {
    var user = validateSessionForData(sessionToken, operationName);
    return operationFn(user);
  } catch (e) {
    var errorType = e.message || 'UNKNOWN_ERROR';
    var safeErrors = {
      'SESSION_EXPIRED': { success: false, error: 'SESSION_EXPIRED', message: 'Your session has expired. Please sign in again.' },
      'SESSION_INVALID': { success: false, error: 'SESSION_INVALID', message: 'Invalid session. Please sign in again.' },
      'SESSION_EVICTED': { success: false, error: 'SESSION_EVICTED', message: 'Your session was ended. Please sign in again.' },
      'SESSION_CORRUPT': { success: false, error: 'SESSION_CORRUPT', message: 'Session data is corrupted. Please sign in again.' },
      'SESSION_INTEGRITY_VIOLATION': { success: false, error: 'SESSION_INTEGRITY_VIOLATION', message: 'Session integrity check failed. Please sign in again.' },
      'PERMISSION_DENIED': { success: false, error: 'PERMISSION_DENIED', message: 'You do not have permission for this operation.' },
      'ACCESS_DENIED': { success: false, error: 'ACCESS_DENIED', message: 'You can only access your own data.' },
      'NOT_FOUND': { success: false, error: 'NOT_FOUND', message: 'The requested record was not found.' },
      'INVALID_INPUT': { success: false, error: 'INVALID_INPUT', message: 'Invalid input provided.' }
    };
    if (safeErrors[errorType]) {
      return safeErrors[errorType];
    }
    auditLog('phase_a_error', 'system', 'error', {
      operation: operationName,
      errorType: errorType,
      errorMessage: e.message,
      stack: e.stack
    });
    return { success: false, error: 'INTERNAL_ERROR', message: 'An internal error occurred. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
// PHASE A — ITEM #19: DISCLOSURE ACCOUNTING (§164.528)
// ═══════════════════════════════════════════════════════

/**
 * Records a PHI disclosure to the DisclosureLog sheet.
 * Called whenever PHI is shared with an external party.
 */
function recordDisclosure(params) {
  var required = ['recipientName', 'recipientType', 'phiDescription', 'purpose', 'individualEmail'];
  for (var i = 0; i < required.length; i++) {
    if (!params[required[i]]) {
      throw new Error('INVALID_INPUT');
    }
  }
  var disclosureId = generateRequestId('DISC');
  var timestamp = formatHipaaTimestamp();
  var isExempt = params.isExempt || false;
  var exemptionType = params.exemptionType || '';
  var triggeredBy = 'system';
  if (params.sessionToken) {
    try {
      var user = validateSessionForData(params.sessionToken, 'recordDisclosure');
      triggeredBy = user.email;
    } catch (e) {
      triggeredBy = 'system_automated';
    }
  }
  var headers = [
    'Timestamp', 'DisclosureID', 'IndividualEmail', 'RecipientName',
    'RecipientType', 'PHIDescription', 'Purpose', 'IsExempt',
    'ExemptionType', 'TriggeredBy'
  ];
  var sheet = getOrCreateSheet('DisclosureLog', headers);
  sheet.appendRow([
    timestamp, disclosureId, params.individualEmail, params.recipientName,
    params.recipientType, params.phiDescription, params.purpose, isExempt,
    exemptionType, triggeredBy
  ]);
  auditLog('disclosure_recorded', triggeredBy, 'success', {
    disclosureId: disclosureId,
    recipientName: params.recipientName,
    purpose: params.purpose,
    isExempt: isExempt,
    individualEmail: params.individualEmail
  });
  return { success: true, disclosureId: disclosureId };
}

/**
 * Returns the disclosure accounting for the authenticated individual.
 * Filters to non-exempt disclosures within the past 6 years.
 */
function getDisclosureAccounting(sessionToken, targetEmail) {
  return wrapPhaseAOperation('getDisclosureAccounting', sessionToken, function(user) {
    checkPermission(user, 'read', 'getDisclosureAccounting');
    var lookupEmail = targetEmail || user.email;
    validateIndividualAccess(user, lookupEmail, 'getDisclosureAccounting');
    var requestId = generateRequestId('ACCT');
    var now = new Date();
    var sixYearsAgo = new Date(now.getTime() - (6 * 365.25 * 24 * 60 * 60 * 1000));
    var headers = [
      'Timestamp', 'DisclosureID', 'IndividualEmail', 'RecipientName',
      'RecipientType', 'PHIDescription', 'Purpose', 'IsExempt',
      'ExemptionType', 'TriggeredBy'
    ];
    var sheet = getOrCreateSheet('DisclosureLog', headers);
    var data = sheet.getDataRange().getValues();
    var disclosures = [];
    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var rowEmail = String(row[2]).toLowerCase();
      var rowIsExempt = row[7] === true || row[7] === 'TRUE' || row[7] === 'true';
      var rowDate = new Date(row[0]);
      if (rowEmail === lookupEmail.toLowerCase() && !rowIsExempt && rowDate >= sixYearsAgo) {
        disclosures.push({
          disclosureId: row[1],
          date: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
          recipientName: row[3],
          recipientType: row[4],
          phiDescription: row[5],
          purpose: row[6]
        });
      }
    }
    disclosures.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    dataAuditLog(user, 'read', 'disclosure_accounting', requestId, {
      targetEmail: lookupEmail,
      disclosureCount: disclosures.length,
      periodStart: sixYearsAgo.toISOString(),
      periodEnd: now.toISOString()
    });
    return {
      success: true, requestId: requestId, individualEmail: lookupEmail,
      disclosures: disclosures, count: disclosures.length,
      periodStart: sixYearsAgo.toISOString(), periodEnd: now.toISOString(),
      generatedAt: formatHipaaTimestamp()
    };
  });
}

/**
 * Exports the disclosure accounting in JSON or CSV format.
 */
function exportDisclosureAccounting(sessionToken, format) {
  return wrapPhaseAOperation('exportDisclosureAccounting', sessionToken, function(user) {
    checkPermission(user, 'export', 'exportDisclosureAccounting');
    var accounting = getDisclosureAccounting(sessionToken);
    if (!accounting.success) return accounting;
    format = (format || 'json').toLowerCase();
    var dateStr = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
    var filename = 'disclosure-accounting-' + dateStr;
    if (format === 'csv') {
      var csvRows = ['Date,DisclosureID,RecipientName,RecipientType,PHIDescription,Purpose'];
      for (var i = 0; i < accounting.disclosures.length; i++) {
        var d = accounting.disclosures[i];
        csvRows.push([
          '"' + d.date + '"',
          '"' + d.disclosureId + '"',
          '"' + (d.recipientName || '').replace(/"/g, '""') + '"',
          '"' + d.recipientType + '"',
          '"' + (d.phiDescription || '').replace(/"/g, '""') + '"',
          '"' + d.purpose + '"'
        ].join(','));
      }
      return { success: true, format: 'csv', data: csvRows.join('\n'), filename: filename + '.csv' };
    }
    return { success: true, format: 'json', data: JSON.stringify(accounting, null, 2), filename: filename + '.json' };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE A — ITEM #23: RIGHT OF ACCESS (§164.524)
// ═══════════════════════════════════════════════════════

/**
 * Creates an access request and immediately generates the export.
 * For testauth1 (small dataset), export is synchronous.
 */
function requestDataExport(sessionToken, format) {
  return wrapPhaseAOperation('requestDataExport', sessionToken, function(user) {
    checkPermission(user, 'export', 'requestDataExport');
    var requestId = generateRequestId('ACCESS');
    var requestDate = formatHipaaTimestamp();
    format = (format || 'json').toLowerCase();
    var arHeaders = [
      'RequestID', 'IndividualEmail', 'RequestDate', 'Format',
      'Status', 'ResponseDate', 'Notes'
    ];
    var arSheet = getOrCreateSheet('AccessRequests', arHeaders);
    arSheet.appendRow([requestId, user.email, requestDate, format, 'Processing', '', '']);
    var individualData;
    try {
      individualData = getIndividualData(sessionToken);
    } catch (e) {
      updateAccessRequestStatus(arSheet, requestId, 'Failed', 'Export generation failed: ' + e.message);
      throw e;
    }
    var dateStr = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
    var filename = 'my-data-export-' + dateStr;
    var exportData;
    if (format === 'csv') {
      exportData = convertToCSV(individualData);
      filename += '.csv';
    } else {
      exportData = JSON.stringify(individualData, null, 2);
      filename += '.json';
    }
    var responseDate = formatHipaaTimestamp();
    updateAccessRequestStatus(arSheet, requestId, 'Completed', '');
    dataAuditLog(user, 'export', 'designated_record_set', requestId, {
      format: format,
      recordCount: individualData.summary.totalRecords,
      sheetsQueried: individualData.summary.sheetsQueried
    });
    return {
      success: true, requestId: requestId, format: format,
      data: exportData, filename: filename,
      requestDate: requestDate, responseDate: responseDate
    };
  });
}

/** Helper: update AccessRequests sheet status by requestId */
function updateAccessRequestStatus(sheet, requestId, status, notes) {
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === requestId) {
      sheet.getRange(r + 1, 5).setValue(status);
      sheet.getRange(r + 1, 6).setValue(formatHipaaTimestamp());
      if (notes) sheet.getRange(r + 1, 7).setValue(notes);
      return;
    }
  }
}

/**
 * Retrieves ALL records from the Designated Record Set for the authenticated individual.
 */
function getIndividualData(sessionToken) {
  var user = validateSessionForData(sessionToken, 'getIndividualData');
  checkPermission(user, 'read', 'getIndividualData');
  var email = user.email.toLowerCase();
  var result = {
    individual: {
      email: user.email, displayName: user.displayName,
      role: user.role, exportDate: formatHipaaTimestamp(),
      generatedBy: 'testauth1 v' + VERSION
    },
    records: {},
    summary: { totalRecords: 0, sheetsQueried: 0 }
  };
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheetNames = [
    { name: SHEET_NAME, key: 'notes' },
    { name: 'SessionAuditLog', key: 'sessionHistory' },
    { name: 'DataAuditLog', key: 'dataAccessHistory' },
    { name: 'DisclosureLog', key: 'disclosures' },
    { name: 'AmendmentRequests', key: 'amendments' },
    { name: 'AccessRequests', key: 'accessRequests' }
  ];
  for (var i = 0; i < sheetNames.length; i++) {
    var s = ss.getSheetByName(sheetNames[i].name);
    if (s) {
      result.records[sheetNames[i].key] = extractRecordsForEmail(s, email, sheetNames[i].key);
      result.summary.sheetsQueried++;
    }
  }
  for (var key in result.records) {
    result.summary.totalRecords += result.records[key].length;
  }
  return result;
}

/**
 * Extracts rows from a sheet that match the individual's email.
 * Generic helper — searches all columns for email match.
 */
function extractRecordsForEmail(sheet, email, recordType) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  var records = [];
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var matched = false;
    for (var c = 0; c < row.length; c++) {
      if (String(row[c]).toLowerCase() === email) {
        matched = true;
        break;
      }
    }
    if (matched) {
      var record = { _recordType: recordType, _rowIndex: r + 1 };
      for (var h = 0; h < headers.length; h++) {
        var _val = row[h];
        record[String(headers[h])] = _val instanceof Date ? _val.toISOString() : _val;
      }
      records.push(record);
    }
  }
  return records;
}

/**
 * Converts the getIndividualData() output to CSV format.
 */
function convertToCSV(individualData) {
  var lines = [];
  lines.push('# Data Export for ' + individualData.individual.email);
  lines.push('# Generated: ' + individualData.individual.exportDate);
  lines.push('# By: ' + individualData.individual.generatedBy);
  lines.push('');
  for (var recordType in individualData.records) {
    var records = individualData.records[recordType];
    if (records.length === 0) continue;
    lines.push('# === ' + recordType.toUpperCase() + ' (' + records.length + ' records) ===');
    var headers = [];
    for (var key in records[0]) {
      if (key.charAt(0) !== '_') headers.push(key);
    }
    lines.push(headers.join(','));
    for (var i = 0; i < records.length; i++) {
      var values = [];
      for (var h = 0; h < headers.length; h++) {
        var val = String(records[i][headers[h]] || '');
        if (val.indexOf(',') > -1 || val.indexOf('"') > -1 || val.indexOf('\n') > -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        values.push(val);
      }
      lines.push(values.join(','));
    }
    lines.push('');
  }
  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════
// PHASE A — ITEM #24: RIGHT TO AMENDMENT (§164.526)
// ═══════════════════════════════════════════════════════

/**
 * Creates an amendment request for a specific record.
 */
function requestAmendment(sessionToken, recordId, currentContent, proposedChange, reason) {
  return wrapPhaseAOperation('requestAmendment', sessionToken, function(user) {
    checkPermission(user, 'amend', 'requestAmendment');
    if (!recordId || !proposedChange || !reason) {
      throw new Error('INVALID_INPUT');
    }
    var amendmentId = generateRequestId('AMEND');
    var requestDate = formatHipaaTimestamp();
    var deadline = new Date();
    deadline.setDate(deadline.getDate() + 60);
    var deadlineStr = Utilities.formatDate(deadline, 'America/New_York', "yyyy-MM-dd'T'HH:mm:ss");
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    sheet.appendRow([
      amendmentId, user.email, recordId, requestDate,
      currentContent, proposedChange, reason, 'Pending',
      '', '', '', '', '', deadlineStr, ''
    ]);
    dataAuditLog(user, 'create', 'amendment_request', amendmentId, {
      recordId: recordId, reason: reason, deadline: deadlineStr
    });
    auditLog('amendment_requested', user.email, 'success', {
      amendmentId: amendmentId, recordId: recordId
    });
    return {
      success: true, amendmentId: amendmentId, status: 'Pending',
      deadline: deadlineStr,
      message: 'Your amendment request has been submitted. You will be notified of the decision within 60 days.'
    };
  });
}

/**
 * Reviews an amendment request — approves or denies it.
 * Only users with 'admin' permission can review amendments.
 */
function reviewAmendment(sessionToken, amendmentId, decision, decisionReason) {
  return wrapPhaseAOperation('reviewAmendment', sessionToken, function(user) {
    checkPermission(user, 'admin', 'reviewAmendment');
    if (!amendmentId || !decision) throw new Error('INVALID_INPUT');
    if (decision !== 'Approved' && decision !== 'Denied') throw new Error('INVALID_INPUT');
    if (decision === 'Denied' && !decisionReason) throw new Error('INVALID_INPUT');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    var amendmentRow = null;
    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === amendmentId) {
        rowIndex = r + 1;
        amendmentRow = data[r];
        break;
      }
    }
    if (rowIndex === -1) throw new Error('NOT_FOUND');
    var currentStatus = amendmentRow[7];
    if (currentStatus !== 'Pending' && currentStatus !== 'UnderReview') {
      return { success: false, error: 'INVALID_STATE', message: 'This amendment is in status "' + currentStatus + '" and cannot be reviewed.' };
    }
    var decisionDate = formatHipaaTimestamp();
    sheet.getRange(rowIndex, 8).setValue(decision);
    sheet.getRange(rowIndex, 9).setValue(user.email);
    sheet.getRange(rowIndex, 10).setValue(decisionDate);
    sheet.getRange(rowIndex, 11).setValue(decisionReason || '');
    dataAuditLog(user, 'review', 'amendment_request', amendmentId, {
      decision: decision, decisionReason: decisionReason || '',
      individualEmail: amendmentRow[1], recordId: amendmentRow[2]
    });
    auditLog('amendment_reviewed', user.email, decision.toLowerCase(), {
      amendmentId: amendmentId, individualEmail: amendmentRow[1]
    });
    var message = decision === 'Approved'
      ? 'Amendment approved. The correction has been appended to the record.'
      : 'Amendment denied. Reason: ' + decisionReason + '. The individual has the right to file a statement of disagreement.';
    return { success: true, amendmentId: amendmentId, decision: decision, decisionDate: decisionDate, message: message };
  });
}

/**
 * Allows an individual to file a statement of disagreement after a denial.
 * Per §164.526(d)(3), the statement is appended to the record.
 */
function submitDisagreement(sessionToken, amendmentId, statement) {
  return wrapPhaseAOperation('submitDisagreement', sessionToken, function(user) {
    checkPermission(user, 'amend', 'submitDisagreement');
    if (!amendmentId || !statement) throw new Error('INVALID_INPUT');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    var amendmentRow = null;
    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === amendmentId) {
        rowIndex = r + 1;
        amendmentRow = data[r];
        break;
      }
    }
    if (rowIndex === -1) throw new Error('NOT_FOUND');
    validateIndividualAccess(user, amendmentRow[1], 'submitDisagreement');
    if (amendmentRow[7] !== 'Denied') {
      return { success: false, error: 'INVALID_STATE', message: 'A statement of disagreement can only be filed for denied amendments.' };
    }
    if (amendmentRow[11]) {
      return { success: false, error: 'ALREADY_EXISTS', message: 'A statement of disagreement has already been filed for this amendment.' };
    }
    var disagreementDate = formatHipaaTimestamp();
    sheet.getRange(rowIndex, 8).setValue('Denied — Disagreement Filed');
    sheet.getRange(rowIndex, 12).setValue(statement);
    sheet.getRange(rowIndex, 13).setValue(disagreementDate);
    dataAuditLog(user, 'create', 'disagreement_statement', amendmentId, {
      statementLength: statement.length
    });
    auditLog('disagreement_filed', user.email, 'success', { amendmentId: amendmentId });
    return { success: true, amendmentId: amendmentId, status: 'Denied — Disagreement Filed', message: 'Your statement of disagreement has been recorded and appended to the amendment record.' };
  });
}

/**
 * Returns the complete amendment history for a specific record.
 */
function getAmendmentHistory(sessionToken, recordId) {
  return wrapPhaseAOperation('getAmendmentHistory', sessionToken, function(user) {
    checkPermission(user, 'read', 'getAmendmentHistory');
    if (!recordId) throw new Error('INVALID_INPUT');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var amendments = [];
    for (var r = 1; r < data.length; r++) {
      if (data[r][2] === recordId) {
        validateIndividualAccess(user, data[r][1], 'getAmendmentHistory');
        var _rd = data[r][3], _dd = data[r][9], _dgd = data[r][12];
        amendments.push({
          amendmentId: data[r][0], requestDate: _rd instanceof Date ? _rd.toISOString() : String(_rd || ''),
          currentContent: data[r][4], proposedChange: data[r][5],
          reason: data[r][6], status: data[r][7],
          reviewerEmail: data[r][8] || null, decisionDate: _dd instanceof Date ? _dd.toISOString() : (_dd || null),
          decisionReason: data[r][10] || null,
          hasDisagreement: !!data[r][11], disagreementDate: _dgd instanceof Date ? _dgd.toISOString() : (_dgd || null)
        });
      }
    }
    amendments.sort(function(a, b) { return new Date(b.requestDate) - new Date(a.requestDate); });
    dataAuditLog(user, 'read', 'amendment_history', recordId, {
      amendmentCount: amendments.length
    });
    return { success: true, recordId: recordId, amendments: amendments, count: amendments.length };
  });
}

/**
 * Returns all pending/under-review amendment requests (admin only).
 * Used by the amendment review panel to list amendments needing action.
 */
function getPendingAmendments(sessionToken) {
  return wrapPhaseAOperation('getPendingAmendments', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getPendingAmendments');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var pending = [];
    for (var r = 1; r < data.length; r++) {
      var status = data[r][7];
      if (status === 'Pending' || status === 'UnderReview') {
        pending.push({
          amendmentId: data[r][0], individualEmail: data[r][1],
          recordId: data[r][2], requestDate: data[r][3] instanceof Date ? data[r][3].toISOString() : String(data[r][3]),
          currentContent: data[r][4], proposedChange: data[r][5],
          reason: data[r][6], status: status, deadline: data[r][13] instanceof Date ? data[r][13].toISOString() : String(data[r][13])
        });
      }
    }
    pending.sort(function(a, b) { return new Date(a.requestDate) - new Date(b.requestDate); });
    auditLog('admin_action', user.email, 'list_pending_amendments', { count: pending.length });
    return pending;
  });
}

function invalidateSession(sessionToken) {
  if (!sessionToken) return;
  var cache = getEpochCache();
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

// =============================================
// AUTH — Page Nonce (postMessage handshake)
// =============================================
// Generates a one-time-use nonce that binds a validated session to a single page load.
// Flow: GAS serves handshake page → parent sends session token via postMessage →
// handshake page calls generatePageNonce() → navigates to ?page_nonce=NONCE →
// doGet() validates nonce → serves authenticated content.
// This ensures the session token NEVER appears in the URL.

function generatePageNonce(sessionToken) {
  var session = validateSession(sessionToken);
  if (session.status !== 'authorized') {
    return { success: false, error: session.status };
  }
  var nonce = Utilities.getUuid();
  var cache = getEpochCache();
  // Store nonce → session token mapping with 60-second TTL (one-time use).
  // 60s allows for the two-step flow: load getNonce listener → get nonce → reload iframe.
  cache.put('page_nonce_' + nonce, sessionToken, 60);
  return { success: true, nonce: nonce };
}

function validatePageNonce(nonce) {
  if (!nonce || nonce.length < 10) return null;
  var cache = getEpochCache();
  var sessionToken = cache.get('page_nonce_' + nonce);
  if (!sessionToken) return null;
  // One-time use: delete the nonce immediately
  cache.remove('page_nonce_' + nonce);
  return sessionToken;
}

function invalidateAllSessions(email, reason) {
  if (!email) return;
  var evictionReason = reason || 'new_sign_in';
  var cache = getEpochCache();
  var trackKey = "sessions_" + email.toLowerCase();
  var raw = cache.get(trackKey);
  if (!raw) return;
  try {
    var tokens = JSON.parse(raw);
    for (var i = 0; i < tokens.length; i++) {
      cache.remove("session_" + tokens[i]);
      // Leave a tombstone so the heartbeat/validateSession handler knows WHY
      // the session disappeared. Short TTL (5 minutes) — just needs to survive
      // until the old device's next heartbeat fires or page refresh.
      // After that, natural expiry is assumed (no tombstone = timed out normally).
      cache.put("evicted_" + tokens[i], evictionReason, 300);
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
  var cache = getEpochCache();
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
  var cache = getEpochCache();
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

// checkSpreadsheetAccess returns an RBAC-aware result object:
//   { hasAccess: true,  role: 'admin', isEmergencyAccess: false }
//   { hasAccess: false, role: null,    isEmergencyAccess: false }
// Legacy boolean callers: use checkSpreadsheetAccess(email).hasAccess
function checkSpreadsheetAccess(email, opt_ss) {
  var denied = { hasAccess: false, role: null, isEmergencyAccess: false };
  if (!email) return denied;
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
        return { hasAccess: true, role: 'admin', isEmergencyAccess: true };
      }
    }
  }

  var cache = getEpochCache();
  var cacheKey = "access_" + lowerEmail;
  var roleCacheKey = "role_" + lowerEmail;
  var cached = cache.get(cacheKey);
  if (cached !== null) {
    if (cached === "1") {
      var cachedRole = cache.get(roleCacheKey) || RBAC_DEFAULT_ROLE;
      return { hasAccess: true, role: cachedRole, isEmergencyAccess: false };
    }
    return denied;
  }

  // Method 1: Master ACL spreadsheet
  // Expected layout: col A = Email, col B = Role, cols C+ = page names (TRUE/FALSE)
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (hasAcl) {
    try {
      var aclSs = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
      var aclSheet = aclSs.getSheetByName(ACL_SHEET_NAME);
      if (aclSheet) {
        var data = aclSheet.getDataRange().getValues();
        if (data.length >= 2) {
          var headers = data[0];
          // Find the page column index (page access TRUE/FALSE)
          var colIdx = -1;
          for (var c = 0; c < headers.length; c++) {
            if (String(headers[c]).trim().toLowerCase() === ACL_PAGE_NAME.toLowerCase()) {
              colIdx = c; break;
            }
          }
          // Find the Role column index (expected col B, but search by header name for flexibility)
          var roleColIdx = -1;
          for (var rc = 0; rc < headers.length; rc++) {
            if (String(headers[rc]).trim().toLowerCase() === 'role') {
              roleColIdx = rc; break;
            }
          }
          if (colIdx !== -1) {
            for (var r = 1; r < data.length; r++) {
              if (String(data[r][0]).trim().toLowerCase() === lowerEmail) {
                var val = data[r][colIdx];
                if (val === true || String(val).trim().toUpperCase() === 'TRUE') {
                  // Read role from the Role column (default to RBAC_DEFAULT_ROLE if missing)
                  var userRole = RBAC_DEFAULT_ROLE;
                  if (roleColIdx !== -1 && data[r][roleColIdx]) {
                    var rawRole = String(data[r][roleColIdx]).trim().toLowerCase();
                    if (getRolesFromSpreadsheet()[rawRole]) {
                      userRole = rawRole;
                    }
                  }
                  cache.put(cacheKey, "1", 600);
                  cache.put(roleCacheKey, userRole, 600);
                  return { hasAccess: true, role: userRole, isEmergencyAccess: false };
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
  // ONLY used when the ACL tab is NOT configured — when ACL exists, it is the
  // sole authority and the sharing list is not consulted.
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  if (!hasAcl && hasSheet) {
    var ss = opt_ss || SpreadsheetApp.openById(SPREADSHEET_ID);
    var editors = ss.getEditors();
    for (var i = 0; i < editors.length; i++) {
      if (editors[i].getEmail().toLowerCase() === lowerEmail) {
        cache.put(cacheKey, "1", 600);
        cache.put(roleCacheKey, RBAC_DEFAULT_ROLE, 600);
        return { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
      }
    }
    var viewers = ss.getViewers();
    for (var i = 0; i < viewers.length; i++) {
      if (viewers[i].getEmail().toLowerCase() === lowerEmail) {
        cache.put(cacheKey, "1", 600);
        cache.put(roleCacheKey, RBAC_DEFAULT_ROLE, 600);
        return { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
      }
    }
  }

  // Neither method granted access (or neither is configured)
  if (!hasAcl && !hasSheet) {
    return { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
  }
  cache.put(cacheKey, "0", 600);
  return denied;
}

// =============================================
// AUTH — Web App Entry Point (doGet)
// Toggle-gated: TOKEN_EXCHANGE_METHOD controls token exchange path.
// =============================================

// ── Phase 7 (H-5): Server-side heartbeat processing ──
// Called via google.script.run from the heartbeat listener page (action=heartbeat).
// Token is received via postMessage, NOT URL parameters — eliminates token-in-URL exposure.
function processHeartbeat(token) {
  if (!token || !AUTH_CONFIG.ENABLE_HEARTBEAT) {
    return {type: 'gas-heartbeat-error', error: 'invalid_request'};
  }

  var cache = getEpochCache();

  // Rate limit: max 20 per session per 5-minute window
  var hbRlKey = 'hb_ratelimit_' + token.substring(0, 16);
  var hbAttempts = cache.get(hbRlKey);
  var hbCount = hbAttempts ? parseInt(hbAttempts, 10) : 0;
  if (hbCount >= 20) {
    return {type: 'gas-heartbeat-error', error: 'rate_limited'};
  }
  cache.put(hbRlKey, String(hbCount + 1), 300);

  var raw = cache.get("session_" + token);
  if (!raw) {
    var evictionReason = cache.get("evicted_" + token) || 'timeout';
    // Don't remove the tombstone — let it expire naturally (5 min TTL).
    // Multiple consumers may need it: heartbeat, page refresh (validateSession),
    // and the same heartbeat may retry if the first response was dropped.
    return {type: 'gas-heartbeat-expired', reason: evictionReason};
  }

  var hbData;
  try { hbData = JSON.parse(raw); } catch (err) {
    return {type: 'gas-heartbeat-expired', reason: 'corrupt_session'};
  }

  // Retrieve messageKey from session data for signing response
  var msgKey = hbData.messageKey || '';

  // Check HMAC if enabled
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY && !verifySessionHmac(hbData)) {
    cache.remove("session_" + token);
    return signMessage({type: 'gas-heartbeat-expired', reason: 'integrity_violation'}, msgKey);
  }

  // Absolute session timeout — hard ceiling, heartbeats cannot extend past this
  if (hbData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
    var hbAbsElapsed = (Date.now() - hbData.absoluteCreatedAt) / 1000;
    if (hbAbsElapsed > AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
      cache.remove("session_" + token);
      auditLog('session_expired', hbData.email, 'absolute_timeout_heartbeat',
        { elapsed: Math.round(hbAbsElapsed) + 's', limit: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT + 's', clientIp: 'not-collected' });
      return signMessage({type: 'gas-heartbeat-expired', reason: 'absolute_timeout'}, msgKey);
    }
  }

  // Rolling session timeout
  var hbElapsed = (Date.now() - hbData.createdAt) / 1000;
  if (hbElapsed > AUTH_CONFIG.SESSION_EXPIRATION) {
    cache.remove("session_" + token);
    auditLog('session_expired', hbData.email, 'heartbeat_too_late',
      { elapsed: Math.round(hbElapsed) + 's', clientIp: 'not-collected' });
    return signMessage({type: 'gas-heartbeat-expired', reason: 'timeout'}, msgKey);
  }

  // Session valid — reset createdAt to extend
  hbData.createdAt = Date.now();
  hbData.lastActivity = Date.now();
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    hbData.hmac = generateSessionHmac(hbData);
  }
  cache.put("session_" + token, JSON.stringify(hbData), AUTH_CONFIG.SESSION_EXPIRATION);

  var hbAbsRemaining = hbData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT
    ? Math.round(AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT - ((Date.now() - hbData.absoluteCreatedAt) / 1000))
    : 0;
  return signMessage({type: 'gas-heartbeat-ok', expiresIn: AUTH_CONFIG.SESSION_EXPIRATION, absoluteRemaining: hbAbsRemaining, liveData: getCachedData()}, msgKey);
}

// ── Phase 7 (H-6): Server-side sign-out processing ──
// Called via google.script.run from the signout listener page (action=signout).
// Token is received via postMessage, NOT URL parameters.
function processSignOut(token) {
  if (!token) {
    return {type: 'gas-signed-out', success: false, error: 'no_token'};
  }
  // Read messageKey before invalidation (for signing the response)
  var cache = getEpochCache();
  var raw = cache.get("session_" + token);
  var msgKey = '';
  if (raw) { try { msgKey = JSON.parse(raw).messageKey || ''; } catch(e) {} }
  invalidateSession(token);
  return signMessage({type: 'gas-signed-out', success: true}, msgKey);
}

// ── Phase 7 (M-4): Server-side security event processing ──
// Called via google.script.run from the securityEvent listener page (action=securityEvent).
// Event details are received via postMessage, NOT URL parameters.
function processSecurityEvent(eventType, details) {
  if (!eventType) return;
  var cache = getEpochCache();

  // Global rate limit: max 50 security events per 5-minute window
  var seGlobalKey = 'se_ratelimit_global';
  var seGlobalAttempts = cache.get(seGlobalKey);
  var seGlobalCount = seGlobalAttempts ? parseInt(seGlobalAttempts, 10) : 0;

  if (seGlobalCount < 50) {
    cache.put(seGlobalKey, String(seGlobalCount + 1), 300);
    var seDetails = {};
    try {
      if (typeof details === 'string') {
        seDetails = JSON.parse(details.substring(0, 500));
      } else if (details && typeof details === 'object') {
        seDetails = details;
      }
    } catch(ex) {}
    auditLog('security_event', 'not-collected', String(eventType).substring(0, 50), {
      details: seDetails,
      clientIp: 'not-collected',
      page: EMBED_PAGE_URL
    });
  } else if (seGlobalCount === 50) {
    cache.put(seGlobalKey, String(seGlobalCount + 1), 300);
    auditLog('security_event_flood', 'system', 'Global rate limit reached', {
      message: 'Max 50 security events per 5 minutes — further events suppressed regardless of source IP',
      lastEvent: String(eventType).substring(0, 50),
      page: EMBED_PAGE_URL
    });
  }
}

// ── DJB2→HMAC Migration: Server-side message signing for GAS session HTML ──
// Called via google.script.run from the session HTML inline script.
// Replaces client-side _s() (DJB2) with server-side HMAC-SHA256 signing.
// Same pattern as processHeartbeat/processSignOut (Phase 7).
function signAppMessage(sessionToken, messageType, params) {
  if (!sessionToken || !messageType) {
    return { type: 'error', error: 'missing_parameters' };
  }

  var cache = getEpochCache();

  // Validate session — retrieve messageKey from cache regardless of session validity
  var raw = cache.get('session_' + sessionToken);
  var msgKey = '';
  if (raw) {
    try { msgKey = JSON.parse(raw).messageKey || ''; } catch(e) {}
  }

  var session = validateSession(sessionToken);
  if (session.status !== 'authorized') {
    // Session is invalid — expected for 'gas-session-invalid' callers.
    // Use recovered messageKey from cache (may still exist even after expiry).
    return signMessage({
      type: 'gas-session-invalid',
      reason: 'SESSION_EXPIRED'
    }, msgKey);
  }

  switch (messageType) {
    case 'gas-auth-ok':
      var authRole = session.role || RBAC_DEFAULT_ROLE;
      return signMessage({
        type: 'gas-auth-ok',
        version: VERSION,
        needsReauth: session.needsReauth || false,
        messageKey: msgKey,
        role: authRole,
        permissions: session.permissions || getRolesFromSpreadsheet()[authRole] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE]
      }, msgKey);

    case 'gas-version':
      var appData = getAppData();
      return signMessage({
        type: 'gas-version',
        version: appData.version
      }, msgKey);

    case 'gas-user-activity':
      return signMessage({
        type: 'gas-user-activity'
      }, msgKey);

    case 'gas-session-invalid':
      return signMessage({
        type: 'gas-session-invalid',
        reason: (params && params.reason) || 'unknown'
      }, msgKey);

    default:
      return { type: 'error', error: 'unknown_message_type' };
  }
}

function doGet(e) {
  var sessionToken = (e && e.parameter && e.parameter.session) || "";
  // Phase 7: signOutToken, heartbeatToken, and msgKey URL parameters removed —
  // heartbeat and sign-out now use postMessage via action listener pages
  // (processHeartbeat/processSignOut called via google.script.run)

  // Phase 3 (C-3): Client IP collection removed — ipify.org lacks BAA coverage.
  // GAS doGet(e) does not expose client IP — no compliant server-side method exists.
  // All audit log entries use 'not-collected' for the IP field.
  // To re-enable, uncomment below and set AUTH_CONFIG.ENABLE_IP_LOGGING = true:
  // var rawIp = (e && e.parameter && e.parameter.clientIp) || '';
  // var clientIp = '';
  // if (rawIp) {
  //   var t = String(rawIp).trim().substring(0, 45);
  //   clientIp = (/^(\d{1,3}\.){3}\d{1,3}$/.test(t) || /^[0-9a-fA-F:]+$/.test(t)) ? t : 'invalid';
  // }
  var clientIp = 'not-collected';

  // Auto-register this project in the cross-project registry
  registerSelfProject();

  // ── Phase 7: postMessage-based action routes ──
  // These routes return lightweight listener pages that receive sensitive data
  // via postMessage instead of URL parameters. The listener pages use
  // google.script.run to call the server-side processing functions.
  var action = (e && e.parameter && e.parameter.action) || '';

  // Heartbeat action — returns page that listens for token via postMessage
  if (action === 'heartbeat') {
    var hbListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-heartbeat-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "heartbeat-token") return;'
      + '  google.script.run'
      + '    .withSuccessHandler(function(r) {'
      + '      window.top.postMessage(r, PARENT_ORIGIN);'
      + '    })'
      + '    .withFailureHandler(function(e) {'
      + '      window.top.postMessage({type:"gas-heartbeat-error",'
      + '        error:String(e)}, PARENT_ORIGIN);'
      + '    })'
      + '    .processHeartbeat(evt.data.token);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(hbListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Sign-out action — returns page that listens for token via postMessage
  if (action === 'signout') {
    var soListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-signout-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "signout-token") return;'
      + '  google.script.run'
      + '    .withSuccessHandler(function(r) {'
      + '      window.top.postMessage(r, PARENT_ORIGIN);'
      + '    })'
      + '    .withFailureHandler(function(e) {'
      + '      window.top.postMessage({type:"gas-signed-out", success:false,'
      + '        error:String(e)}, PARENT_ORIGIN);'
      + '    })'
      + '    .processSignOut(evt.data.token);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(soListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Admin session management — returns page that listens for admin commands via postMessage
  if (action === 'adminSessions') {
    var adminListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-admin-sessions-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data) return;'
      + '  if (evt.data.type === "admin-list-sessions") {'
      + '    google.script.run'
      + '      .withSuccessHandler(function(r) {'
      + '        window.top.postMessage({type:"gas-admin-sessions-list", sessions:r}, PARENT_ORIGIN);'
      + '      })'
      + '      .withFailureHandler(function(e) {'
      + '        window.top.postMessage({type:"gas-admin-sessions-error",'
      + '          error:String(e)}, PARENT_ORIGIN);'
      + '      })'
      + '      .listActiveSessions(evt.data.token);'
      + '  }'
      + '  if (evt.data.type === "admin-signout-user") {'
      + '    google.script.run'
      + '      .withSuccessHandler(function(r) {'
      + '        window.top.postMessage({type:"gas-admin-signout-result", result:r}, PARENT_ORIGIN);'
      + '      })'
      + '      .withFailureHandler(function(e) {'
      + '        window.top.postMessage({type:"gas-admin-signout-error",'
      + '          error:String(e)}, PARENT_ORIGIN);'
      + '      })'
      + '      .adminSignOutUser(evt.data.token, evt.data.email);'
      + '  }'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(adminListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Phase A — HIPAA Privacy Rule operations listener
  if (action === 'phaseA') {
    var phaseAListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"phase-a-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data) return;'
      + '  var d = evt.data;'
      + '  function ok(type, payload) { window.top.postMessage(Object.assign({type:type}, payload), PARENT_ORIGIN); }'
      + '  function fail(type, e) { window.top.postMessage({type:type, error:String(e)}, PARENT_ORIGIN); }'
      // Disclosure Accounting
      + '  if (d.type === "phase-a-get-disclosures") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-disclosures-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-disclosures-result", {result:{success:false,message:String(e)}}); })'
      + '      .getDisclosureAccounting(d.token);'
      + '  }'
      + '  if (d.type === "phase-a-export-disclosures") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-export-disclosures-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-export-disclosures-result", {result:{success:false,message:String(e)}}); })'
      + '      .exportDisclosureAccounting(d.token, d.format);'
      + '  }'
      // Right of Access
      + '  if (d.type === "phase-a-request-export") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-export-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-export-result", {result:{success:false,message:String(e)}}); })'
      + '      .requestDataExport(d.token, d.format);'
      + '  }'
      // Right to Amendment
      + '  if (d.type === "phase-a-request-amendment") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-amendment-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-amendment-result", {result:{success:false,message:String(e)}}); })'
      + '      .requestAmendment(d.token, d.recordId, d.currentContent, d.proposedChange, d.reason);'
      + '  }'
      + '  if (d.type === "phase-a-get-pending-amendments") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-pending-amendments-result", {amendments:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-pending-amendments-result", {amendments:[],error:String(e)}); })'
      + '      .getPendingAmendments(d.token);'
      + '  }'
      + '  if (d.type === "phase-a-review-amendment") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-review-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-review-result", {result:{success:false,message:String(e)}}); })'
      + '      .reviewAmendment(d.token, d.amendmentId, d.decision, d.decisionReason);'
      + '  }'
      + '  if (d.type === "phase-a-submit-disagreement") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-disagreement-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-disagreement-result", {result:{success:false,message:String(e)}}); })'
      + '      .submitDisagreement(d.token, d.amendmentId, d.statement);'
      + '  }'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(phaseAListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Cross-project session listing — called by globalacl's listGlobalSessions via UrlFetchApp
  if (action === 'listSessions') {
    var cpParams = { secret: (e.parameter && e.parameter.secret) || '', callerEmail: (e.parameter && e.parameter.callerEmail) || '' };
    var cpAuth = validateCrossProjectAdmin(cpParams);
    if (!cpAuth.valid) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: cpAuth.reason }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var cpSessions = listActiveSessionsInternal(cpAuth.email);
    return ContentService.createTextOutput(JSON.stringify({ success: true, sessions: cpSessions, project: TITLE }))
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

  // Cross-project admin sign-out — called by globalacl's adminGlobalSignOutUser via UrlFetchApp
  if (action === 'adminSignOut') {
    var cpParams2 = { secret: (e.parameter && e.parameter.secret) || '', callerEmail: (e.parameter && e.parameter.callerEmail) || '' };
    var cpAuth2 = validateCrossProjectAdmin(cpParams2);
    if (!cpAuth2.valid) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var cpTarget = (e.parameter && e.parameter.targetEmail) || '';
    if (cpTarget) {
      invalidateAllSessions(cpTarget, 'admin_signout');
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, email: cpTarget }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Security event action — returns page that listens for event data via postMessage
  if (action === 'securityEvent') {
    var seListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-security-event-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "security-event-report") return;'
      + '  google.script.run'
      + '    .processSecurityEvent(evt.data.eventType, evt.data.details);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(seListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Nonce generation action — returns page that generates a one-time-use page nonce
  // via google.script.run, replacing the insecure ?session=TOKEN URL pattern.
  // The parent page loads this, sends the session token via postMessage, and receives
  // a short-lived nonce to use in ?page_nonce=NONCE for the actual app load.
  if (action === 'getNonce') {
    var nonceListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-nonce-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "request-nonce") return;'
      + '  google.script.run'
      + '    .withSuccessHandler(function(r) {'
      + '      window.top.postMessage({type:"gas-nonce-result", success:r.success, nonce:r.nonce||"", error:r.error||""}, PARENT_ORIGIN);'
      + '    })'
      + '    .withFailureHandler(function(e) {'
      + '      window.top.postMessage({type:"gas-nonce-result", success:false, error:String(e)}, PARENT_ORIGIN);'
      + '    })'
      + '    .generatePageNonce(evt.data.sessionToken);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(nonceListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Security event reporting — client-side defense layers report blocked attacks
  // Phase 7: URL-parameter path kept for backwards compatibility during migration
  var securityEvent = (e && e.parameter && e.parameter.securityEvent) || '';
  if (securityEvent) {
    var seCache = getEpochCache();

    // Global rate limit: max 50 security events per 5-minute window (all sources combined)
    // Uses a single key independent of clientIp — prevents bypass via IP rotation
    var seGlobalKey = 'se_ratelimit_global';
    var seGlobalAttempts = seCache.get(seGlobalKey);
    var seGlobalCount = seGlobalAttempts ? parseInt(seGlobalAttempts, 10) : 0;

    if (seGlobalCount < 50) {
      seCache.put(seGlobalKey, String(seGlobalCount + 1), 300);
      var seDetails = {};
      try { seDetails = JSON.parse((e.parameter.details || '{}').substring(0, 500)); } catch(ex) {}
      auditLog('security_event', clientIp || 'unknown', securityEvent.substring(0, 50), {
        details: seDetails,
        clientIp: clientIp,
        userAgent: (e && e.parameter && e.parameter.ua) || '',
        page: EMBED_PAGE_URL
      });
    } else if (seGlobalCount === 50) {
      seCache.put(seGlobalKey, String(seGlobalCount + 1), 300);
      auditLog('security_event_flood', 'system', 'Global rate limit reached', {
        message: 'Max 50 security events per 5 minutes — further events suppressed regardless of source IP',
        lastClientIp: clientIp,
        lastEvent: securityEvent.substring(0, 50),
        page: EMBED_PAGE_URL
      });
    }
    // Return minimal response — no app HTML needed
    var seHtml = '<!DOCTYPE html><html><body></body></html>';
    return HtmlService.createHtmlOutput(seHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Phase 7 cleanup: Legacy URL-parameter heartbeat (?heartbeat=TOKEN) and
  // sign-out (?signOut=TOKEN) routes removed. These are now handled by:
  //   - processHeartbeat() via google.script.run from action=heartbeat listener page
  //   - processSignOut() via google.script.run from action=signout listener page
  // The postMessage-based approach eliminates token-in-URL exposure (H-5, H-6).

  // URL-parameter token exchange (standard mode)
  if (AUTH_CONFIG.TOKEN_EXCHANGE_METHOD === 'url') {
    var exchangeToken = (e && e.parameter && e.parameter.exchangeToken) || "";
    if (exchangeToken) {
      var result;
      try {
        result = exchangeTokenForSession(exchangeToken);
      } catch (err) {
        var errMsg = err.message || String(err);
        Logger.log("Token exchange error: " + errMsg);
        // Surface specific misconfiguration errors so the admin sees what to fix
        var errorCode = "server_error";
        if (errMsg.indexOf('HMAC_SECRET') !== -1) errorCode = "hmac_secret_missing";
        result = { success: false, error: errorCode };
      }
      var payload = JSON.stringify({
            type: "gas-session-created",
            success: result.success,
            sessionToken: result.sessionToken || "",
            email: result.email || "",
            displayName: result.displayName || "",
            error: result.error || "",
            absoluteTimeout: result.absoluteTimeout || 0,
            messageKey: result.messageKey || "",
            role: result.role || "",
            permissions: result.permissions || []
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
      + '  var nonce = e.data.nonce || "";'  // Phase 2: echo nonce back for verification
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
      + '        messageKey: result.messageKey || "",'
      + '        role: result.role || "",'
      + '        permissions: result.permissions || [],'
      + '        nonce: nonce'
      + '      }, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '    })'
      + '    .withFailureHandler(function(err) {'
      + '      var code = "server_error";'
      + '      if (err && err.message && err.message.indexOf("HMAC_SECRET") !== -1) code = "hmac_secret_missing";'
      + '      window.top.postMessage({'
      + '        type: "gas-session-created",'
      + '        success: false,'
      + '        error: code,'
      + '        nonce: nonce'
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

  // ── Page nonce validation ──
  // The page_nonce is a one-time-use token generated by generatePageNonce()
  // via the action=getNonce listener page. It binds a validated session to a
  // single page load without ever exposing the session token in the URL.
  var pageNonce = (e && e.parameter && e.parameter.page_nonce) || '';
  if (pageNonce) {
    sessionToken = validatePageNonce(pageNonce) || '';
  }

  // Normal flow: validate session token (from page_nonce or ?session= parameter)
  // Both paths are valid: ?session= is used for initial sign-in (from gas-session-created),
  // ?page_nonce= is used for page refresh, tab reclaim, and cross-tab sync.
  // The postMessage handshake guard blocks direct URL access.
  var session = validateSession(sessionToken);

  if (session.status !== "authorized") {
    var evReason = session.evictionReason || '';
    var authHtml = '<!DOCTYPE html><html><body><script>'
      + 'window.top.postMessage({type:"gas-needs-auth",authStatus:"' + escapeJs(session.status) + '",email:"' + escapeJs(session.email || '') + '",version:"' + escapeJs(VERSION) + '",evictionReason:"' + escapeJs(evReason) + '"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(authHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Retrieve messageKey from session data for signing outgoing messages
  var appMsgKey = '';
  try {
    var appCache = getEpochCache();
    var appRaw = appCache.get("session_" + sessionToken);
    if (appRaw) { appMsgKey = JSON.parse(appRaw).messageKey || ''; }
  } catch(e) {}

  // Session valid — build the app HTML with live data table
  var initialData = getCachedData();
  var initialDataJSON = initialData ? JSON.stringify(initialData) : 'null';
  var html = `
    <html>
    <head>
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
      <style>
        html, body { height: 100%; margin: 0; overflow: auto; }
        body { font-family: Arial; }
        #version { position: fixed; bottom: 8px; left: 8px; z-index: 9999; color: #1565c0; font-size: 12px; margin: 0; font-family: monospace; opacity: 0.8; }
        #user-email { position: fixed; top: 8px; left: 8px; z-index: 9999; color: #666; font-size: 11px; font-family: monospace; opacity: 0.7; }
      </style>
    </head>
    <body>
      <h2 id="version">${escapeHtml(VERSION)}</h2>
      <div id="user-email">${escapeHtml(session.email)}</div>

      <script>
        // PostMessage handshake guard: verify we are embedded in the correct parent page.
        // Only runs on the ?session= path (initial sign-in). Skipped on the ?page_nonce=
        // path (refresh, tab reclaim, cross-tab sync) because nonces are one-time-use —
        // a copied nonce URL is already useless, providing equivalent replay protection.
        // The old iframe guard (window.parent === window.top) was permanently broken because
        // GAS wraps content in multiple nested iframes — window.parent is always Google's
        // wrapper, never window.top, regardless of how the URL is accessed.
        var _loadedViaNonce = ${pageNonce ? 'true' : 'false'};
        if (!_loadedViaNonce) {
          document.body.style.visibility = 'hidden';
          var _hsId = Math.random().toString(36).substring(2) + Date.now().toString(36);
          var _hsOk = false;
          window.addEventListener('message', function(ev) {
            if (ev.data && ev.data.type === 'frame-handshake-response' && ev.data.handshakeId === _hsId) {
              _hsOk = true;
              document.body.style.visibility = 'visible';
            }
          });
          window.top.postMessage({type: 'frame-handshake-challenge', handshakeId: _hsId}, '${PARENT_ORIGIN}');
          setTimeout(function() {
            if (!_hsOk) {
              document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;color:#666;"><p>Access denied. This application must be accessed through its authorized embedding page.</p></div>';
              document.body.style.visibility = 'visible';
            }
          }, 2000);
        }

        // Session token for data operation validation (Phase 3)
        var _sessionToken = '${escapeJs(sessionToken)}';
        // DJB2→HMAC migration complete: _s() and _mk removed.
        // All message signing now happens server-side via signAppMessage()
        // (called through google.script.run — same pattern as Phase 7 heartbeat/signout).

        // Phase 3 (C-3): Client IP collection removed — ipify.org lacks BAA coverage.
        // To re-enable, uncomment below and set AUTH_CONFIG.ENABLE_IP_LOGGING = true:
        // var _clientIp = '';
        // function _valIp(v) {
        //   if (!v || typeof v !== 'string') return 'unknown';
        //   var t = v.trim().substring(0, 45);
        //   if (/^(\\d{1,3}\\.){3}\\d{1,3}$/.test(t) || /^[0-9a-fA-F:]+$/.test(t)) return t;
        //   return 'invalid';
        // }
        // if (${AUTH_CONFIG.ENABLE_IP_LOGGING}) {
        //   try {
        //     var _ipXhr = new XMLHttpRequest();
        //     _ipXhr.open('GET', 'https://api.ipify.org?format=text', true);
        //     _ipXhr.timeout = 5000;
        //     _ipXhr.onload = function() { if (_ipXhr.status === 200) _clientIp = _valIp(_ipXhr.responseText); };
        //     _ipXhr.onerror = function() { _clientIp = 'unknown'; };
        //     _ipXhr.ontimeout = function() { _clientIp = 'unknown'; };
        //     _ipXhr.send();
        //   } catch(e) { _clientIp = 'unknown'; }
        // }

        // Notify wrapper that auth is OK — send immediately so the host page
        // can show the app without waiting for the async google.script.run call.
        // Without this immediate send, page refresh and "Use Here" get stuck on
        // "Reconnecting..." because google.script.run.signAppMessage() may be slow.
        window.top.postMessage({type: 'gas-auth-ok', version: '${escapeJs(VERSION)}',
          needsReauth: ${session.needsReauth || false},
          messageKey: '${escapeJs(appMsgKey)}',
          role: '${escapeJs(session.role || RBAC_DEFAULT_ROLE)}',
          permissions: ${JSON.stringify(session.permissions || getRolesFromSpreadsheet()[session.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE])}}, '${PARENT_ORIGIN}');

        // Also send a signed version via google.script.run (belt-and-suspenders —
        // if the unsigned one above is processed first, this signed one is a no-op;
        // if HMAC verification rejects the unsigned one, this signed one succeeds)
        google.script.run
          .withSuccessHandler(function(signed) {
            window.top.postMessage(signed, '${PARENT_ORIGIN}');
          })
          .withFailureHandler(function(err) {
            // Fallback: send unsigned gas-auth-ok so the host page at least knows
            // the session is valid (verification will pass because no key is set yet)
            window.top.postMessage({type: 'gas-auth-ok', version: '${escapeJs(VERSION)}',
              needsReauth: ${session.needsReauth || false},
              messageKey: '${escapeJs(appMsgKey)}',
              role: '${escapeJs(session.role || RBAC_DEFAULT_ROLE)}',
              permissions: ${JSON.stringify(session.permissions || getRolesFromSpreadsheet()[session.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE])}}, '${PARENT_ORIGIN}');
          })
          .signAppMessage(_sessionToken, 'gas-auth-ok');

        window.addEventListener('message', function(e) {
          // Phase 3: IP receiver removed — uncomment to re-enable
          // if (e.data && e.data.type === 'host-client-ip') {
          //   _clientIp = _valIp(e.data.ip);
          // }
          if (e.data && e.data.type === 'gas-version-check') {
            // DJB2→HMAC migration: signed server-side via signAppMessage()
            google.script.run
              .withSuccessHandler(function(signed) {
                top.postMessage(signed, '${PARENT_ORIGIN}');
              })
              .withFailureHandler(function() {
                // Don't send an unsigned response — the version poll is periodic and will retry.
                // A missing response is safer than an unsigned one that gets dropped by HMAC verify.
              })
              .signAppMessage(_sessionToken, 'gas-version');
          }
        });

        // Activity detection — notify host page on user interaction so it can
        // trigger an immediate heartbeat (catches expired sessions before data loss)
        // DJB2→HMAC migration: signed server-side via signAppMessage()
        var _lastActivityNotify = 0;
        var _pendingActivity = false;
        function _notifyActivity() {
          var now = Date.now();
          if (now - _lastActivityNotify < 5000) return; // 5s debounce
          if (_pendingActivity) return; // Prevent stacking server calls
          _lastActivityNotify = now;
          _pendingActivity = true;
          google.script.run
            .withSuccessHandler(function(signed) {
              _pendingActivity = false;
              window.top.postMessage(signed, '${PARENT_ORIGIN}');
            })
            .withFailureHandler(function() {
              _pendingActivity = false;
              // Silently drop — next activity event will retry
            })
            .signAppMessage(_sessionToken, 'gas-user-activity');
        }
        document.addEventListener('keydown', _notifyActivity, true);
        document.addEventListener('click', _notifyActivity, true);
        document.addEventListener('input', _notifyActivity, true);

        // Initial data embedded at iframe load time — zero extra calls
        var _initialData = ${initialDataJSON};
        if (_initialData) {
          top.postMessage({type: 'live-data', data: _initialData}, '${PARENT_ORIGIN}');
        }

        // Listen for write-cell requests from parent
        window.addEventListener('message', function(evt) {
          if (evt.origin !== '${PARENT_ORIGIN}') return;
          if (evt.data && evt.data.type === 'write-cell') {
            google.script.run
              .withSuccessHandler(function(result) {
                top.postMessage(result, '${PARENT_ORIGIN}');
              })
              .withFailureHandler(function(err) {
                top.postMessage({type: 'gas-write-error', error: String(err)}, '${PARENT_ORIGIN}');
              })
              .writeCell(evt.data.token, evt.data.row, evt.data.col, evt.data.value);
          }
          if (evt.data && evt.data.type === 'get-live-data') {
            google.script.run
              .withSuccessHandler(function(data) {
                top.postMessage({type: 'live-data', data: data}, '${PARENT_ORIGIN}');
              })
              .withFailureHandler(function() {
                top.postMessage({type: 'live-data', data: null}, '${PARENT_ORIGIN}');
              })
              .getCachedData();
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
