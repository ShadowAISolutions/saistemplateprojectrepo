var VERSION = "v01.26g";
var TITLE = "Program Portal";
var GITHUB_OWNER  = "ShadowAISolutions";
var GITHUB_REPO   = "saistemplateprojectrepo";
var GITHUB_BRANCH = "main";
var FILE_PATH     = "googleAppsScripts/Programportal/programportal.gs";
var DEPLOYMENT_ID = "AKfycbzKwEfBKj5mOy4aBtg-nWycCRO8R21s405WoJHR3dLBtPxc3SA4qfzNaQ6OGVlQE7Xm";
var EMBED_PAGE_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/programportal.html";

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
var ANNOUNCEMENTS_SHEET_NAME = "Announcements";

// Master ACL spreadsheet — centralized access control for all GAS-powered pages.
// Two tabs:
//   "Access" — Row 1 = headers (Email, Role, page1, page2, ...). Rows 2+ = email in col A, role in col B, TRUE/FALSE per page.
//   "Roles"  — Row 1 = headers (Role, perm1, perm2, ...). Rows 2+ = role name in col A, TRUE/FALSE per permission.
// UI element gating is handled client-side via data-requires-permission and data-requires-role attributes on HTML elements.
// If configured, this replaces the old editor/viewer sharing-list check.
// Leave as placeholder to fall back to SPREADSHEET_ID editor/viewer check.
var MASTER_ACL_SPREADSHEET_ID = "1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI";
var ACL_SHEET_NAME = "Access";
var ACL_PAGE_NAME  = "programportal";

// Unified toggleable auth configuration (see 6-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md)
// Select a preset, then apply per-project overrides.
var ACTIVE_PRESET = 'hipaa';     // 'standard' or 'hipaa'
var PROJECT_OVERRIDES = {
  ENABLE_DOMAIN_RESTRICTION: false,
  ALLOWED_DOMAINS: [],
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
  admin:  ['read', 'write', 'delete', 'export', 'admin'],
  editor: ['read', 'write', 'export'],
  viewer: ['read']
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
    SESSION_EXPIRATION: 3600,          // seconds — rolling session lifetime, reset by heartbeats (1hr)
    ABSOLUTE_SESSION_TIMEOUT: 28800,   // seconds — hard ceiling, never resets regardless of activity (8hr)
    ENABLE_HEARTBEAT: true,
    HEARTBEAT_INTERVAL: 300,           // seconds — how often GAS checks/extends the session when user is active (5min)
    MAX_SESSIONS_PER_USER: 1,
    OAUTH_TOKEN_LIFETIME: 3600,        // seconds — expected lifetime of the Google OAuth access token (1hr)
    OAUTH_REFRESH_BUFFER: 300,         // seconds — show "expiring soon" banner this long before token expires (5min)
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
    SESSION_EXPIRATION: 900,           // seconds — rolling session lifetime, reset by heartbeats (15min)
    ABSOLUTE_SESSION_TIMEOUT: 28800,   // seconds — hard ceiling, never resets regardless of activity (8hr)
    ENABLE_HEARTBEAT: true,
    HEARTBEAT_INTERVAL: 300,           // seconds — how often GAS checks/extends the session when user is active (5min)
    MAX_SESSIONS_PER_USER: 1,
    OAUTH_TOKEN_LIFETIME: 3600,        // seconds — expected lifetime of the Google OAuth access token (1hr)
    OAUTH_REFRESH_BUFFER: 300,         // seconds — show "expiring soon" banner this long before token expires (5min)
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
// PROJECT START — Add your project-specific functions here
// ══════════════

/**
 * refreshAnnouncementsCache() — reads the Announcements sheet, filters to Active rows,
 * sorts by Date descending, and stores in CacheService with 6-hour TTL.
 * Modeled on TestAuth1's refreshDataCache().
 */
function refreshAnnouncementsCache() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ANNOUNCEMENTS_SHEET_NAME);
    if (!sheet) {
      // Auto-create the Announcements sheet with headers and a welcome row
      sheet = ss.insertSheet(ANNOUNCEMENTS_SHEET_NAME);
      sheet.getRange('A1:E1').setValues([['Title', 'Body', 'Date', 'Priority', 'Active']]);
      sheet.getRange('A1:E1').setFontWeight('bold');
      sheet.getRange('A2:E2').setValues([['Welcome to Program Portal', 'The announcements system is now active.', new Date(), 'normal', 'TRUE']]);
      sheet.setColumnWidth(1, 200);
      sheet.setColumnWidth(2, 400);
      sheet.setColumnWidth(3, 120);
      sheet.setColumnWidth(4, 100);
      sheet.setColumnWidth(5, 80);
    }
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      // Only header row or empty — cache empty items
      var emptyResult = JSON.stringify({ items: [], ts: Date.now() });
      getEpochCache().put('announcements_' + ANNOUNCEMENTS_SHEET_NAME, emptyResult, 21600);
      return;
    }
    // Columns: A=Title, B=Body, C=Date, D=Priority, E=Active
    var rows = data.slice(1);
    var items = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var active = String(row[4]).toUpperCase() === 'TRUE';
      items.push({
        rowIndex: i, // 0-based index into data rows (for edit/delete operations)
        title: String(row[0] || ''),
        body: String(row[1] || ''),
        date: row[2] instanceof Date ? row[2].toISOString() : String(row[2] || ''),
        priority: String(row[3] || 'normal').toLowerCase(),
        active: active
      });
    }
    // Preserve spreadsheet row order — admin controls reordering via up/down buttons
    var result = JSON.stringify({ items: items, ts: Date.now() });
    getEpochCache().put('announcements_' + ANNOUNCEMENTS_SHEET_NAME, result, 21600);
  } catch (e) {
    Logger.log('refreshAnnouncementsCache error: ' + e.message);
  }
}

/**
 * getCachedAnnouncements() — reads announcements from CacheService with self-healing.
 * On cache miss: self-repairs by calling refreshAnnouncementsCache().
 * Returns parsed object { items, ts } or null.
 * Modeled on TestAuth1's getCachedData().
 */
function getCachedAnnouncements() {
  var cache = getEpochCache();
  var key = 'announcements_' + ANNOUNCEMENTS_SHEET_NAME;
  var cached = cache.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  // Self-repair: cache miss → read spreadsheet, warm cache
  refreshAnnouncementsCache();
  cached = cache.get(key);
  return cached ? JSON.parse(cached) : null;
}

/**
 * getAuthenticatedAnnouncements(token) — validates session then returns cached announcements.
 * Used by the GAS-internal data poll (google.script.run from the portal UI).
 * Requires 'read' permission via RBAC.
 * Modeled on TestAuth1's getAuthenticatedData().
 */
function getAuthenticatedAnnouncements(token) {
  var user = validateSessionForData(token, 'getAuthenticatedAnnouncements');
  checkPermission(user, 'read', 'getAuthenticatedAnnouncements');
  return getCachedAnnouncements();
}

/**
 * addAnnouncement(token, title, body, priority) — admin-only. Adds a new announcement row.
 * Returns updated announcements data for immediate re-render.
 */
function addAnnouncement(token, title, body, priority) {
  var user = validateSessionForData(token, 'addAnnouncement');
  checkPermission(user, 'admin', 'addAnnouncement');
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(ANNOUNCEMENTS_SHEET_NAME);
  if (!sheet) throw new Error('Announcements sheet not found');
  var p = (priority || 'normal').toLowerCase();
  if (p !== 'high' && p !== 'normal' && p !== 'low') p = 'normal';
  sheet.appendRow([title || 'Untitled', body || '', new Date(), p, 'TRUE']);
  refreshAnnouncementsCache();
  return getCachedAnnouncements();
}

/**
 * updateAnnouncement(token, rowIndex, title, body, priority, active) — admin-only.
 * Updates an existing announcement. rowIndex is 0-based (data rows, excluding header).
 * Returns updated announcements data.
 */
function updateAnnouncement(token, rowIndex, title, body, priority, active) {
  var user = validateSessionForData(token, 'updateAnnouncement');
  checkPermission(user, 'admin', 'updateAnnouncement');
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(ANNOUNCEMENTS_SHEET_NAME);
  if (!sheet) throw new Error('Announcements sheet not found');
  var sheetRow = rowIndex + 2; // +1 for header, +1 for 1-based
  if (sheetRow < 2 || sheetRow > sheet.getLastRow()) throw new Error('Invalid row index');
  var p = (priority || 'normal').toLowerCase();
  if (p !== 'high' && p !== 'normal' && p !== 'low') p = 'normal';
  var activeVal = (active === false || String(active).toUpperCase() === 'FALSE') ? 'FALSE' : 'TRUE';
  sheet.getRange(sheetRow, 1, 1, 5).setValues([[title || '', body || '', sheet.getRange(sheetRow, 3).getValue(), p, activeVal]]);
  refreshAnnouncementsCache();
  return getCachedAnnouncements();
}

/**
 * deleteAnnouncement(token, rowIndex) — admin-only.
 * Deletes an announcement row. rowIndex is 0-based (data rows, excluding header).
 * Returns updated announcements data.
 */
function deleteAnnouncement(token, rowIndex) {
  var user = validateSessionForData(token, 'deleteAnnouncement');
  checkPermission(user, 'admin', 'deleteAnnouncement');
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(ANNOUNCEMENTS_SHEET_NAME);
  if (!sheet) throw new Error('Announcements sheet not found');
  var sheetRow = rowIndex + 2;
  if (sheetRow < 2 || sheetRow > sheet.getLastRow()) throw new Error('Invalid row index');
  sheet.deleteRow(sheetRow);
  refreshAnnouncementsCache();
  return getCachedAnnouncements();
}

// --- COMMENTED OUT: per-click reorder (sequential queue approach) ---
// Kept for reference — can be re-enabled by uncommenting and removing saveAnnouncementOrder
// function reorderAnnouncement(token, fromRowIndex, direction) {
//   var user = validateSessionForData(token, 'reorderAnnouncement');
//   checkPermission(user, 'admin', 'reorderAnnouncement');
//   var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
//   var sheet = ss.getSheetByName(ANNOUNCEMENTS_SHEET_NAME);
//   if (!sheet) throw new Error('Announcements sheet not found');
//   var lastDataRow = sheet.getLastRow() - 1;
//   var toRowIndex = direction === 'up' ? fromRowIndex - 1 : fromRowIndex + 1;
//   if (toRowIndex < 0 || toRowIndex >= lastDataRow) throw new Error('Cannot move further');
//   var fromSheetRow = fromRowIndex + 2;
//   var toSheetRow = toRowIndex + 2;
//   var numCols = 5;
//   var fromVals = sheet.getRange(fromSheetRow, 1, 1, numCols).getValues();
//   var toVals = sheet.getRange(toSheetRow, 1, 1, numCols).getValues();
//   sheet.getRange(fromSheetRow, 1, 1, numCols).setValues(toVals);
//   sheet.getRange(toSheetRow, 1, 1, numCols).setValues(fromVals);
//   refreshAnnouncementsCache();
//   return getCachedAnnouncements();
// }

/**
 * saveAnnouncementOrder(token, orderJSON) — admin-only.
 * Receives the full desired row order as a JSON array of rowIndex values,
 * rewrites all data rows in the spreadsheet to match that order in one batch.
 * Returns updated announcements data.
 */
function saveAnnouncementOrder(token, orderJSON) {
  var user = validateSessionForData(token, 'saveAnnouncementOrder');
  checkPermission(user, 'admin', 'saveAnnouncementOrder');
  var order = JSON.parse(orderJSON); // array of original rowIndex values in desired order
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(ANNOUNCEMENTS_SHEET_NAME);
  if (!sheet) throw new Error('Announcements sheet not found');
  var data = sheet.getDataRange().getValues();
  var header = data[0];
  var rows = data.slice(1);
  // Build reordered rows based on the order array
  var reordered = [];
  for (var i = 0; i < order.length; i++) {
    var idx = order[i];
    if (idx >= 0 && idx < rows.length) {
      reordered.push(rows[idx]);
    }
  }
  // Append any rows not in the order array (safety — shouldn't happen)
  for (var j = 0; j < rows.length; j++) {
    if (order.indexOf(j) === -1) reordered.push(rows[j]);
  }
  // Write all rows back in new order
  if (reordered.length > 0) {
    sheet.getRange(2, 1, reordered.length, header.length).setValues(reordered);
  }
  refreshAnnouncementsCache();
  return getCachedAnnouncements();
}

// ══════════════
// PROJECT END
// ══════════════

// ══════════════
// CROSS-PROJECT SESSION MANAGEMENT
// Enables the GlobalACL "Global Sessions" feature to query and manage
// sessions on this project remotely via UrlFetchApp. The shared secret
// is read from the "Config" tab of the Master ACL Spreadsheet.
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

/**
 * Read the cross-project admin secret from Script Properties.
 * Cached in-memory for the duration of a single GAS execution.
 */
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

/**
 * Validate a cross-project request: shared secret must match and caller must be admin.
 */
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

/**
 * List active sessions for cross-project aggregation (skips session-token validation).
 * Called by the cross-project listSessions endpoint after secret+admin validation.
 */
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
// ADMIN UTILITIES — run from the GAS Editor (select function → Run)
// These are generic admin tools that work with any auth project.
// ══════════════

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
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "TEMPLATE_SPREADSHEET_ID";
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
    if (!SPREADSHEET_ID || SPREADSHEET_ID === "TEMPLATE_SPREADSHEET_ID") return;
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
    if (!SPREADSHEET_ID || SPREADSHEET_ID === "TEMPLATE_SPREADSHEET_ID") return;
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
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "TEMPLATE_SPREADSHEET_ID";
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
// Add your project-specific data operations here. Example:
//
// function saveRecord(sessionToken, recordData) {
//   var user = validateSessionForData(sessionToken, 'saveRecord');
//   checkPermission(user, 'write', 'saveRecord');
//   // ... your data operation here ...
//   return { success: true, email: user.email };
// }
// =============================================

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
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "TEMPLATE_SPREADSHEET_ID";
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

function getUserAppAccess(email) {
  var accessMap = {};
  if (!email) return accessMap;
  var lowerEmail = email.toLowerCase();

  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (!hasAcl) return accessMap;

  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return accessMap;

    var data = sheet.getDataRange().getValues();
    if (data.length < 5) return accessMap;

    var headers = data[0];

    var userRow = null;
    for (var r = 4; r < data.length; r++) {
      if (String(data[r][0]).trim().toLowerCase() === lowerEmail) {
        userRow = data[r];
        break;
      }
    }

    for (var c = 2; c < headers.length; c++) {
      var pageName = String(headers[c]).trim().toLowerCase();
      if (!pageName) continue;
      if (userRow) {
        var val = userRow[c];
        accessMap[pageName] = (val === true || String(val).trim().toUpperCase() === 'TRUE');
      } else {
        accessMap[pageName] = false;
      }
    }
  } catch(e) {}

  return accessMap;
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
  return signMessage({type: 'gas-heartbeat-ok', expiresIn: AUTH_CONFIG.SESSION_EXPIRATION, absoluteRemaining: hbAbsRemaining}, msgKey);
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

  // Auto-register this project in the Master ACL Projects sheet
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

  // Cross-project session listing — called by GlobalACL's Global Sessions feature
  // Returns JSON via ContentService (not HTML). Authenticated by shared secret.
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

  // Cross-project admin sign-out — called by GlobalACL to kick a user from this project
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

  // Look up per-app access for the current user (for the access toggle)
  var userAppAccess = getUserAppAccess(session.email);
  var userAppAccessJson = JSON.stringify(userAppAccess);

  // PROJECT: Load initial announcements for inline rendering (avoids waiting for first poll)
  var initialAnnouncements = getCachedAnnouncements();
  var initialAnnouncementsJSON = initialAnnouncements ? JSON.stringify(initialAnnouncements) : 'null';

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
        /* PROJECT: Announcements section styles */
        .announcements-header { display: flex; align-items: center; justify-content: space-between; }
        .announcements-badge {
          background: rgba(255,255,255,0.15); border-radius: 10px; padding: 2px 8px;
          font-size: 11px; color: rgba(255,255,255,0.6); margin-left: 8px;
        }
        .announcements-chevron { transition: transform 0.2s; }
        .announcements-collapsed .announcements-chevron { transform: rotate(-90deg); }
        .announcements-collapsed #announcements-container { display: none; }
        .announcement-card {
          background: rgba(255,255,255,0.06); border-left: 3px solid rgba(255,255,255,0.2);
          border-radius: 8px; padding: 16px 20px; margin-bottom: 10px;
          transition: background 0.2s;
        }
        .announcement-card:hover { background: rgba(255,255,255,0.1); }
        .announcement-card.priority-high { border-left-color: #ef5350; }
        .announcement-card.priority-normal { border-left-color: #42a5f5; }
        .announcement-card.priority-low { border-left-color: rgba(255,255,255,0.2); }
        .announcement-title { color: #fff; font-size: 15px; font-weight: 600; }
        .announcement-body { color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.5; margin-top: 6px; }
        .announcement-date { color: rgba(255,255,255,0.35); font-size: 11px; margin-top: 8px; }
        .announcement-card.new-announcement { animation: announcement-flash 1.5s ease-out; }
        @keyframes announcement-flash { 0% { background: rgba(66,165,245,0.25); } 100% { background: rgba(255,255,255,0.06); } }
        /* PROJECT: Admin controls for announcements */
        .ann-admin-controls { display: flex; gap: 6px; position: absolute; top: 12px; right: 12px; }
        .ann-admin-btn {
          background: rgba(255,255,255,0.1); border: none; border-radius: 6px;
          color: rgba(255,255,255,0.6); cursor: pointer; padding: 4px 8px; font-size: 12px;
          transition: all 0.2s;
        }
        .ann-admin-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
        .ann-admin-btn.delete:hover { background: rgba(239,83,80,0.3); color: #ef5350; }
        .announcement-card { position: relative; }
        .ann-add-btn {
          background: rgba(255,255,255,0.08); border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 8px; padding: 12px 20px; color: rgba(255,255,255,0.5);
          cursor: pointer; font-size: 13px; width: 100%; text-align: center;
          transition: all 0.2s; margin-bottom: 10px;
        }
        .ann-add-btn:hover { background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.3); }
        .ann-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); z-index: 10000;
          display: flex; align-items: center; justify-content: center;
        }
        .ann-modal {
          background: #1e1e3a; border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 24px; width: 420px; max-width: 90vw;
        }
        .ann-modal h3 { color: #fff; margin: 0 0 16px; font-size: 16px; }
        .ann-modal label { display: block; color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 4px; margin-top: 12px; }
        .ann-modal input, .ann-modal textarea, .ann-modal select {
          width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 13px;
          font-family: inherit; box-sizing: border-box;
        }
        .ann-modal select option { background: #1e1e3a; color: #fff; }
        .ann-toggle-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
        .ann-toggle-row label { margin: 0; }
        .ann-toggle { position: relative; width: 36px; height: 20px; cursor: pointer; }
        .ann-toggle input { display: none; }
        .ann-toggle .ann-toggle-track {
          width: 36px; height: 20px; background: rgba(255,255,255,0.2);
          border-radius: 10px; position: relative; transition: background 0.2s; display: block;
        }
        .ann-toggle .ann-toggle-track::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 16px; height: 16px; background: #fff; border-radius: 50%;
          transition: transform 0.2s;
        }
        .ann-toggle input:checked + .ann-toggle-track { background: #66bb6a; }
        .ann-toggle input:checked + .ann-toggle-track::after { transform: translateX(16px); }
        .ann-modal textarea { min-height: 80px; resize: vertical; }
        .ann-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
        .ann-modal-btn {
          padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;
          font-size: 13px; transition: all 0.2s;
        }
        .ann-modal-btn.primary { background: #42a5f5; color: #fff; }
        .ann-modal-btn.primary:hover { background: #1e88e5; }
        .ann-modal-btn.secondary { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
        .ann-modal-btn.secondary:hover { background: rgba(255,255,255,0.2); }
        .ann-admin-btn.move { font-size: 11px; padding: 2px 6px; }
        .ann-save-order-btn {
          background: #42a5f5; border: none; border-radius: 8px; padding: 10px 20px;
          color: #fff; cursor: pointer; font-size: 13px; width: 100%; text-align: center;
          margin-bottom: 10px; transition: all 0.2s; font-weight: 600;
        }
        .ann-save-order-btn:hover { background: #1e88e5; }
        .ann-save-order-btn:disabled { opacity: 0.6; cursor: wait; }
        .ann-status-bar {
          display: flex; align-items: center; gap: 12px; padding: 6px 0; margin-bottom: 8px;
          font-size: 11px; color: rgba(255,255,255,0.5);
        }
        .ann-poll-status { display: flex; align-items: center; gap: 6px; }
        .ann-poll-dot { width: 6px; height: 6px; border-radius: 50%; background: #3fb950; }
        .ann-poll-dot.polling { background: #d29922; animation: ann-pulse 1s infinite; }
        @keyframes ann-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .ann-poll-status { margin-left: auto; }
      </style>
    </head>
    <body>
      <div class="portal-header">
        <img src="https://www.shadowaisolutions.com/SAIS_Logo.png" alt=""
             onerror="this.style.display='none'">
        <h1>Program Portal</h1>
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

      <!-- PROJECT: Announcements section -->
      <div class="portal-section" id="announcements-section" style="display:none">
        <h2 class="portal-section-title announcements-header" id="announcements-header" style="cursor:pointer;">
          <span>📢 Announcements <span class="announcements-badge" id="announcements-badge"></span></span>
          <span class="announcements-chevron" id="announcements-chevron">▾</span>
        </h2>
        <div class="ann-status-bar" id="ann-status-bar">
          <div class="ann-poll-status">
            <div class="ann-poll-dot" id="ann-poll-dot"></div>
            <span id="ann-poll-label">Live</span>
            <span id="ann-poll-countdown">--</span>
          </div>
        </div>
        <div id="announcements-container"></div>
      </div>

      <div class="portal-section" id="portal-section-auth">
        <h2 class="portal-section-title">🔐 Authentication-Enabled Applications</h2>
        <div class="portal-apps" id="portal-apps-auth"></div>
        <div class="portal-empty" id="portal-empty-auth" style="display:none">No authorized applications</div>
      </div>
      <div class="portal-section" id="portal-section-public">
        <h2 class="portal-section-title">🌐 Public Applications</h2>
        <div class="portal-apps" id="portal-apps-public"></div>
      </div>

      <div class="portal-footer">Developed by: ShadowAISolutions</div>
      <div id="version">${escapeHtml(VERSION)}</div>

      <script>
        // PostMessage handshake guard: verify we are embedded in the correct parent page.
        // Only runs on the ?session= path. Skipped on the ?page_nonce= path because
        // nonces are one-time-use — a copied nonce URL is already useless.
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

        // =============================================
        // PORTAL — Application Registry (with per-user access data)
        // =============================================
        var USER_APP_ACCESS = ${userAppAccessJson};
        var ACL_CONFIGURED = ${Object.keys(userAppAccess).length > 0 ? 'true' : 'false'};

        var PORTAL_APPS = [
          { name: 'Global Access Control List', url: 'globalacl.html', icon: '🛡', description: 'Centralized access control and user management across all projects.', requiresAuth: true },
          { name: 'Test Auth 1', url: 'testauth1.html', icon: '🔐', description: 'Authentication testing environment with full security features.', requiresAuth: true },
          { name: 'Test Environment', url: 'testenvironment.html', icon: '🧪', description: 'General testing environment for development.', requiresAuth: false },
          { name: 'Website', url: 'index.html', icon: '🏠', description: 'Main landing page.', requiresAuth: false },
          { name: 'GAS Project Creator', url: 'gas-project-creator.html', icon: '⚙️', description: 'Create and configure new Google Apps Script projects.', requiresAuth: false }
        ];

        // Compute userHasAccess for each app
        PORTAL_APPS.forEach(function(app) {
          if (!app.requiresAuth) {
            app.userHasAccess = true;
          } else if (!ACL_CONFIGURED) {
            app.userHasAccess = true;
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
            return val === null ? true : val === '1';
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
              + (app.requiresAuth ? '🔒 Auth-enabled' : '🌐 Public') + '</span>';

            if (app.requiresAuth) {
              authContainer.appendChild(card);
            } else {
              publicContainer.appendChild(card);
            }
          });

          filterApps();
        })();

        // Session token for data operation validation (Phase 3)
        var _sessionToken = '${escapeJs(sessionToken)}';
        // PROJECT: User role for admin-only announcements editing
        var _userRole = '${escapeJs(session.role || RBAC_DEFAULT_ROLE)}';
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
        window.top.postMessage({type: 'gas-auth-ok', version: '${escapeJs(VERSION)}',
          needsReauth: ${session.needsReauth || false},
          messageKey: '${escapeJs(appMsgKey)}',
          role: '${escapeJs(session.role || RBAC_DEFAULT_ROLE)}',
          permissions: ${JSON.stringify(session.permissions || getRolesFromSpreadsheet()[session.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE])}}, '${PARENT_ORIGIN}');

        // Also send a signed version via google.script.run (belt-and-suspenders)
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

        // PROJECT START — Announcements section: rendering, collapse toggle, and polling

        // ── Initial data (injected server-side to avoid waiting for first poll) ──
        var _announcementsData = ${initialAnnouncementsJSON};
        var _announcementsPrevJSON = '';
        var _annPollInFlight = false;
        var _annLastPollTick = 0;
        var ANNOUNCEMENTS_POLL_INTERVAL = 60000; // 60 seconds

        var _annSection = document.getElementById('announcements-section');
        var _annContainer = document.getElementById('announcements-container');
        var _annBadge = document.getElementById('announcements-badge');
        var _annHeader = document.getElementById('announcements-header');
        var _annChevron = document.getElementById('announcements-chevron');

        var _isAdmin = (_userRole === 'admin');

        // Simple HTML escape for announcement content
        function _escapeHtml(str) {
          var div = document.createElement('div');
          div.appendChild(document.createTextNode(str));
          return div.innerHTML;
        }

        // ── Render announcements ──
        function _renderAnnouncements(data) {
          if (!data || !data.items) data = { items: [] };

          // Filter: admins see all (including inactive), non-admins see only active
          var displayItems = _isAdmin ? data.items : data.items.filter(function(it) { return it.active !== false; });

          // Show section for admins even when empty (so they can add), hide for non-admins when empty
          if (displayItems.length === 0 && !_isAdmin) {
            _annSection.style.display = 'none';
            return;
          }
          _annSection.style.display = '';

          var currentJSON = JSON.stringify(displayItems);
          if (currentJSON === _announcementsPrevJSON) return; // No change — skip re-render

          var oldTitles = {};
          if (_announcementsPrevJSON) {
            try {
              var oldItems = JSON.parse(_announcementsPrevJSON);
              for (var o = 0; o < oldItems.length; o++) oldTitles[oldItems[o].title + oldItems[o].date] = true;
            } catch(e) {}
          }
          _announcementsPrevJSON = currentJSON;

          var activeCount = data.items.filter(function(it) { return it.active !== false; }).length;
          _annBadge.textContent = activeCount || '';
          _annContainer.innerHTML = '';

          // Admin: Add button and Save Order button at top
          if (_isAdmin) {
            var addBtn = document.createElement('div');
            addBtn.className = 'ann-add-btn';
            addBtn.textContent = '+ Add Announcement';
            addBtn.addEventListener('click', function() { _openAnnModal('add'); });
            _annContainer.appendChild(addBtn);

            var saveBtn = document.createElement('button');
            saveBtn.id = 'ann-save-order-btn';
            saveBtn.className = 'ann-save-order-btn';
            saveBtn.textContent = 'Save Order';
            saveBtn.style.display = _annOrderDirty ? '' : 'none';
            saveBtn.addEventListener('click', function() { _saveAnnouncementOrder(); });
            _annContainer.appendChild(saveBtn);
          }

          for (var i = 0; i < displayItems.length; i++) {
            var item = displayItems[i];
            var priority = item.priority || 'normal';
            if (priority !== 'high' && priority !== 'normal' && priority !== 'low') priority = 'normal';

            var card = document.createElement('div');
            card.className = 'announcement-card priority-' + priority;
            if (item.active === false) card.style.opacity = '0.45';

            // Flash animation for new announcements (not on initial render)
            var itemKey = item.title + item.date;
            if (Object.keys(oldTitles).length > 0 && !oldTitles[itemKey]) {
              card.classList.add('new-announcement');
            }

            var dateStr = '';
            if (item.date) {
              try {
                var d = new Date(item.date);
                if (!isNaN(d.getTime())) {
                  dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                } else {
                  dateStr = item.date;
                }
              } catch(e) { dateStr = item.date; }
            }

            var adminHtml = '';
            if (_isAdmin) {
              adminHtml = '<div class="ann-admin-controls">'
                + '<button class="ann-admin-btn move" data-idx="' + item.rowIndex + '" data-dir="up" title="Move up">▲</button>'
                + '<button class="ann-admin-btn move" data-idx="' + item.rowIndex + '" data-dir="down" title="Move down">▼</button>'
                + '<button class="ann-admin-btn edit" data-idx="' + item.rowIndex + '" data-title="' + _escapeHtml(item.title) + '" data-body="' + _escapeHtml(item.body) + '" data-priority="' + priority + '" data-active="' + (item.active !== false) + '">Edit</button>'
                + '<button class="ann-admin-btn delete" data-idx="' + item.rowIndex + '">Delete</button>'
                + '</div>';
            }

            var inactiveTag = (item.active === false) ? ' <span style="color:#ef5350;font-size:11px;">(inactive)</span>' : '';

            card.innerHTML = adminHtml
              + '<div class="announcement-title">' + _escapeHtml(item.title) + inactiveTag + '</div>'
              + (item.body ? '<div class="announcement-body">' + _escapeHtml(item.body) + '</div>' : '')
              + (dateStr ? '<div class="announcement-date">' + _escapeHtml(dateStr) + '</div>' : '');

            _annContainer.appendChild(card);
          }

          // Attach admin event listeners
          if (_isAdmin) {
            _annContainer.querySelectorAll('.ann-admin-btn.edit').forEach(function(btn) {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                _openAnnModal('edit', {
                  rowIndex: parseInt(this.dataset.idx),
                  title: this.dataset.title,
                  body: this.dataset.body,
                  priority: this.dataset.priority,
                  active: this.dataset.active === 'true'
                });
              });
            });
            _annContainer.querySelectorAll('.ann-admin-btn.delete').forEach(function(btn) {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                _deleteAnnouncement(parseInt(this.dataset.idx));
              });
            });
            _annContainer.querySelectorAll('.ann-admin-btn.move').forEach(function(btn) {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                _reorderAnnouncement(parseInt(this.dataset.idx), this.dataset.dir);
              });
            });
          }
        }

        // ── Admin: Modal form for add/edit ──
        function _openAnnModal(mode, item) {
          var overlay = document.createElement('div');
          overlay.className = 'ann-modal-overlay';
          var isEdit = (mode === 'edit' && item);
          var activeChecked = isEdit ? (item.active !== false) : true;
          overlay.innerHTML = '<div class="ann-modal">'
            + '<h3>' + (isEdit ? 'Edit Announcement' : 'New Announcement') + '</h3>'
            + '<label>Title</label>'
            + '<input type="text" id="ann-form-title" value="' + (isEdit ? _escapeHtml(item.title) : '') + '" placeholder="Announcement title">'
            + '<label>Body</label>'
            + '<textarea id="ann-form-body" placeholder="Announcement details (optional)">' + (isEdit ? _escapeHtml(item.body) : '') + '</textarea>'
            + '<label>Priority</label>'
            + '<select id="ann-form-priority">'
            + '<option value="normal"' + (isEdit && item.priority === 'normal' ? ' selected' : '') + '>Normal</option>'
            + '<option value="high"' + (isEdit && item.priority === 'high' ? ' selected' : '') + '>High</option>'
            + '<option value="low"' + (isEdit && item.priority === 'low' ? ' selected' : '') + '>Low</option>'
            + '</select>'
            + '<div class="ann-toggle-row">'
            + '<label>Active</label>'
            + '<label class="ann-toggle"><input type="checkbox" id="ann-form-active"' + (activeChecked ? ' checked' : '') + '><span class="ann-toggle-track"></span></label>'
            + '</div>'
            + '<div class="ann-modal-actions">'
            + '<button class="ann-modal-btn secondary" id="ann-form-cancel">Cancel</button>'
            + '<button class="ann-modal-btn primary" id="ann-form-save">' + (isEdit ? 'Save' : 'Add') + '</button>'
            + '</div></div>';
          document.body.appendChild(overlay);

          overlay.querySelector('#ann-form-cancel').addEventListener('click', function() {
            overlay.remove();
          });
          // Modal can only be closed via Cancel/Save buttons — no click-outside dismiss

          overlay.querySelector('#ann-form-save').addEventListener('click', function() {
            var title = overlay.querySelector('#ann-form-title').value.trim();
            var body = overlay.querySelector('#ann-form-body').value.trim();
            var priority = overlay.querySelector('#ann-form-priority').value;
            var active = overlay.querySelector('#ann-form-active').checked;
            if (!title) { overlay.querySelector('#ann-form-title').style.borderColor = '#ef5350'; return; }
            this.disabled = true;
            this.textContent = 'Saving...';

            if (isEdit) {
              // Optimistic: update local item immediately
              for (var u = 0; u < _annLocalItems.length; u++) {
                if (_annLocalItems[u].rowIndex === item.rowIndex) {
                  _annLocalItems[u] = { rowIndex: item.rowIndex, title: title, body: body, date: _annLocalItems[u].date, priority: priority, active: active };
                  break;
                }
              }
              overlay.remove();
              _optimisticRender();
              google.script.run
                .withSuccessHandler(_forceRenderAnnouncements)
                .withFailureHandler(function(err) { console.error('Update error:', err); })
                .updateAnnouncement(_sessionToken, item.rowIndex, title, body, priority, active);
            } else {
              // Optimistic: add to local array immediately
              _annLocalItems.push({ rowIndex: _annLocalItems.length, title: title, body: body, date: new Date().toISOString(), priority: priority, active: true });
              overlay.remove();
              _optimisticRender();
              google.script.run
                .withSuccessHandler(_forceRenderAnnouncements)
                .withFailureHandler(function(err) { console.error('Add error:', err); })
                .addAnnouncement(_sessionToken, title, body, priority);
            }
          });

          // Focus title input
          setTimeout(function() { overlay.querySelector('#ann-form-title').focus(); }, 50);
        }

        // ── Optimistic update helpers ──
        // Keep a local copy of the current items for optimistic mutations
        var _annLocalItems = (_announcementsData && _announcementsData.items) ? _announcementsData.items.slice() : [];

        function _forceRenderAnnouncements(data) {
          _announcementsPrevJSON = '';
          if (data) {
            _annLocalItems = data.items ? data.items.slice() : [];
            _annOriginalOrder = _annLocalItems.map(function(it) { return it.rowIndex; });
            _annOrderDirty = false;
            _renderAnnouncements(data);
          }
        }

        function _optimisticRender() {
          _announcementsPrevJSON = '';
          _renderAnnouncements({ items: _annLocalItems, ts: Date.now() });
        }

        // ── Admin: Delete announcement (optimistic) ──
        function _deleteAnnouncement(rowIndex) {
          // Custom confirmation modal (no browser confirm())
          var overlay = document.createElement('div');
          overlay.className = 'ann-modal-overlay';
          overlay.innerHTML = '<div class="ann-modal">'
            + '<h3>Delete Announcement</h3>'
            + '<p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 20px;">Are you sure you want to delete this announcement? This cannot be undone.</p>'
            + '<div class="ann-modal-actions">'
            + '<button class="ann-modal-btn secondary" id="ann-del-cancel">Cancel</button>'
            + '<button class="ann-modal-btn primary" id="ann-del-confirm" style="background:#ef5350;">Delete</button>'
            + '</div></div>';
          document.body.appendChild(overlay);
          overlay.querySelector('#ann-del-cancel').addEventListener('click', function() { overlay.remove(); });
          // Modal can only be closed via Cancel/Delete buttons — no click-outside dismiss
          overlay.querySelector('#ann-del-confirm').addEventListener('click', function() {
            overlay.remove();
            // Optimistic: remove from local array immediately
            _annLocalItems = _annLocalItems.filter(function(it) { return it.rowIndex !== rowIndex; });
            _optimisticRender();
            // Server: authoritative update
            google.script.run
              .withSuccessHandler(_forceRenderAnnouncements)
              .withFailureHandler(function(err) { console.error('Delete error:', err); })
              .deleteAnnouncement(_sessionToken, rowIndex);
          });
        }

        // --- COMMENTED OUT: per-click reorder with sequential server queue ---
        // Kept for reference — can be re-enabled by uncommenting and removing the Save Order approach below
        // var _reorderQueue = [];
        // var _reorderProcessing = false;
        // var _reorderGeneration = 0;
        // function _processReorderQueue() { ... }
        // function _reorderAnnouncement(rowIndex, direction) { ... }
        // See git history v01.23g for the full implementation

        // ── Admin: Reorder announcement (local-only swaps + Save Order button) ──
        // Arrow clicks only rearrange locally. A "Save Order" button appears when
        // the order has changed. Clicking it sends the entire order to the server
        // in one batch call — no race conditions, no per-click server overhead.
        var _annOriginalOrder = _annLocalItems.map(function(it) { return it.rowIndex; });
        var _annOrderDirty = false;

        function _checkOrderDirty() {
          var currentOrder = _annLocalItems.map(function(it) { return it.rowIndex; });
          _annOrderDirty = (JSON.stringify(currentOrder) !== JSON.stringify(_annOriginalOrder));
          var saveBtn = document.getElementById('ann-save-order-btn');
          if (saveBtn) saveBtn.style.display = _annOrderDirty ? '' : 'none';
        }

        function _reorderAnnouncement(rowIndex, direction) {
          // Local-only swap — no server call
          var fromIdx = -1;
          for (var i = 0; i < _annLocalItems.length; i++) {
            if (_annLocalItems[i].rowIndex === rowIndex) { fromIdx = i; break; }
          }
          var toIdx = direction === 'up' ? fromIdx - 1 : fromIdx + 1;
          if (fromIdx >= 0 && toIdx >= 0 && toIdx < _annLocalItems.length) {
            var temp = _annLocalItems[fromIdx];
            _annLocalItems[fromIdx] = _annLocalItems[toIdx];
            _annLocalItems[toIdx] = temp;
            _optimisticRender();
            _checkOrderDirty();
          }
        }

        function _saveAnnouncementOrder() {
          var btn = document.getElementById('ann-save-order-btn');
          if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
          var order = _annLocalItems.map(function(it) { return it.rowIndex; });
          google.script.run
            .withSuccessHandler(function(data) {
              _forceRenderAnnouncements(data);
              _annOriginalOrder = _annLocalItems.map(function(it) { return it.rowIndex; });
              _annOrderDirty = false;
              var btn2 = document.getElementById('ann-save-order-btn');
              if (btn2) { btn2.style.display = 'none'; btn2.disabled = false; btn2.textContent = 'Save Order'; }
            })
            .withFailureHandler(function(err) {
              console.error('Save order error:', err);
              var btn2 = document.getElementById('ann-save-order-btn');
              if (btn2) { btn2.disabled = false; btn2.textContent = 'Save Order'; }
            })
            .saveAnnouncementOrder(_sessionToken, JSON.stringify(order));
        }

        // ── Poll countdown display ──
        var _annPollDot = document.getElementById('ann-poll-dot');
        var _annPollLabel = document.getElementById('ann-poll-label');
        var _annPollCountdown = document.getElementById('ann-poll-countdown');
        var _annCountdownTimer = setInterval(function() {
          if (_annPollInFlight) {
            _annPollDot.classList.add('polling');
            _annPollLabel.textContent = 'Polling';
            _annPollCountdown.textContent = '';
          } else if (_annLastPollTick) {
            _annPollDot.classList.remove('polling');
            _annPollLabel.textContent = 'Live';
            var elapsed = Math.floor((Date.now() - _annLastPollTick) / 1000);
            var remaining = Math.max(0, Math.floor(ANNOUNCEMENTS_POLL_INTERVAL / 1000) - elapsed);
            _annPollCountdown.textContent = elapsed + 's | ' + remaining + 's';
          }
        }, 1000);

        // ── Collapse toggle ──
        var _annCollapsedKey = 'portal_announcements_collapsed';
        var _annCollapsed = localStorage.getItem(_annCollapsedKey) === 'true';

        function _applyCollapseState() {
          if (_annCollapsed) {
            _annSection.classList.add('announcements-collapsed');
            _annChevron.textContent = '▸';
          } else {
            _annSection.classList.remove('announcements-collapsed');
            _annChevron.textContent = '▾';
          }
        }

        _annHeader.addEventListener('click', function() {
          _annCollapsed = !_annCollapsed;
          localStorage.setItem(_annCollapsedKey, _annCollapsed);
          _applyCollapseState();
        });

        _applyCollapseState();

        // ── Polling (setTimeout chaining, same pattern as TestAuth1) ──
        function _doAnnouncementsPoll() {
          if (_annPollInFlight) return;
          _annPollInFlight = true;
          google.script.run
            .withSuccessHandler(function(data) {
              _annPollInFlight = false;
              _annLastPollTick = Date.now();
              if (data) {
                try { _annLocalItems = data.items ? data.items.slice() : []; _renderAnnouncements(data); }
                catch(e) { console.error('Announcements poll error:', e); }
              }
              setTimeout(_doAnnouncementsPoll, ANNOUNCEMENTS_POLL_INTERVAL);
            })
            .withFailureHandler(function() {
              _annPollInFlight = false;
              _annLastPollTick = Date.now();
              setTimeout(_doAnnouncementsPoll, ANNOUNCEMENTS_POLL_INTERVAL);
            })
            .getAuthenticatedAnnouncements(_sessionToken);
        }

        // ── Initialize: render initial data immediately, start poll chain ──
        if (_announcementsData) _renderAnnouncements(_announcementsData);
        _annLastPollTick = Date.now();
        setTimeout(_doAnnouncementsPoll, ANNOUNCEMENTS_POLL_INTERVAL);

        // PROJECT END
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
