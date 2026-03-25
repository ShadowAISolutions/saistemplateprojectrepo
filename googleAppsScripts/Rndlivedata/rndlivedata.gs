var VERSION = "v01.02g";
var TITLE = "RND Live Data";
var GITHUB_OWNER  = "ShadowAISolutions";
var GITHUB_REPO   = "saistemplateprojectrepo";
var GITHUB_BRANCH = "main";
var FILE_PATH     = "googleAppsScripts/Rndlivedata/rndlivedata.gs";
var DEPLOYMENT_ID = "AKfycbxnhplqv-s116CtveTF-8Efdpd_MWA9RZwdJ0th4-4QK_1cRpngS0CBJemY4Znb6ND7";
var SPREADSHEET_ID = "1b50Le6G6ocKtx2nMUnCKPjhujSQlabcqUBBAGwlIsaU";
var SHEET_NAME = "Live_Sheet";
var SOUND_FILE_ID = "1bzVp6wpTHdJ4BRX8gbtDN73soWpmq1kN";
var EMBED_PAGE_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/rndlivedata.html";

// ══════════════
// PROJECT START
// ══════════════

var CACHE_KEY = 'rndlivedata_entries';
var VERSION_KEY = 'rndlivedata_version';
var CACHE_TTL = 600;
var MAX_ENTRIES = 200;

/**
 * Handle GET API requests routed from doGet.
 * @param {string} action - The action parameter from the query string.
 * @param {Object} params - All query parameters.
 * @returns {Object} JSON-serializable response.
 */
function handleGetAction_(action, params) {
  if (action === 'fetch') {
    return fetchEntries_();
  }
  return { success: false, error: 'Unknown GET action: ' + action };
}

/**
 * Handle POST API requests routed from doPost.
 * @param {string} action - The action from the parsed JSON body.
 * @param {Object} payload - The full parsed JSON body.
 * @returns {Object} JSON-serializable response.
 */
function handlePostAction_(action, payload) {
  if (action === 'submit') {
    return submitEntry_(payload);
  }
  return { success: false, error: 'Unknown POST action: ' + action };
}

/**
 * Fetch all entries from CacheService (fast) or Sheet (fallback).
 */
function fetchEntries_() {
  try {
    var cache = CacheService.getScriptCache();
    var cached = cache.get(CACHE_KEY);
    var version = cache.get(VERSION_KEY) || '0';

    if (cached) {
      return { success: true, data: JSON.parse(cached), version: version };
    }

    var data = readFromSheet_();
    version = String(Date.now());
    cache.put(CACHE_KEY, JSON.stringify(data), CACHE_TTL);
    cache.put(VERSION_KEY, version, CACHE_TTL);
    return { success: true, data: data, version: version };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Submit a new entry. Uses LockService to prevent concurrent write collisions.
 * Returns the full fresh dataset after writing.
 */
function submitEntry_(payload) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    var user = String(payload.user || '').substring(0, 50).trim();
    var message = String(payload.message || '').substring(0, 1000).trim();
    if (!user || !message) {
      return { success: false, error: 'User and message are required' };
    }

    var sheet = getOrCreateSheet_();
    var entryId = Utilities.getUuid();
    var timestamp = new Date();

    sheet.appendRow([timestamp, user, message, entryId]);
    SpreadsheetApp.flush();

    var data = readFromSheet_();
    var version = String(Date.now());
    var cache = CacheService.getScriptCache();
    cache.put(CACHE_KEY, JSON.stringify(data), CACHE_TTL);
    cache.put(VERSION_KEY, version, CACHE_TTL);

    return { success: true, data: data, version: version };
  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Read entries from the Sheet, capped at MAX_ENTRIES (most recent).
 * Dates are serialized to ISO strings to avoid google.script.run Date issues.
 */
function readFromSheet_() {
  var sheet = getOrCreateSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var range = sheet.getRange(2, 1, lastRow - 1, 4);
  var values = range.getValues();

  if (values.length > MAX_ENTRIES) {
    values = values.slice(values.length - MAX_ENTRIES);
  }

  return values.map(function(row) {
    return {
      timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
      user: String(row[1]),
      message: String(row[2]),
      entryId: String(row[3])
    };
  });
}

/**
 * Get or create the data sheet with headers.
 */
function getOrCreateSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'User', 'Message', 'EntryID']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * One-time setup: ensures the Sheet tab exists with headers.
 * Run this manually from the Apps Script editor after first deploy.
 */
function setupSheet() {
  getOrCreateSheet_();
  Logger.log('Sheet "' + SHEET_NAME + '" is ready.');
}

// ══════════════
// PROJECT END
// ══════════════

// ══════════════
// TEMPLATE START
// ══════════════

function doGet(e) {
  // PROJECT OVERRIDE START: REST API routing for rndlivedata data entry
  // When ?action= is present, return JSON API response instead of iframe HTML
  var action = (e && e.parameter && e.parameter.action) || '';
  if (action) {
    var result = handleGetAction_(action, e.parameter);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // PROJECT OVERRIDE END
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
      </style>
    </head>
    <body>
      <h2 id="version">${VERSION}</h2>

      <script>
        window.addEventListener('message', function(e) {
          if (e.data && e.data.type === 'gas-version-check') {
            google.script.run
              .withSuccessHandler(function(data) {
                top.postMessage({type: 'gas-version', version: data.version}, '*');
              })
              .withFailureHandler(function() {
                top.postMessage({type: 'gas-version', version: null}, '*');
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

  // PROJECT OVERRIDE START: REST API routing for rndlivedata data entry
  // POST body is text/plain JSON (avoids CORS preflight). Parse and route by action.
  if (e && e.postData && e.postData.contents) {
    try {
      var payload = JSON.parse(e.postData.contents);
      if (payload.action && payload.action !== 'deploy') {
        var postResult = handlePostAction_(payload.action, payload);
        return ContentService.createTextOutput(JSON.stringify(postResult))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch (parseError) {
      // Not valid JSON — fall through to default
    }
  }
  // PROJECT OVERRIDE END

  return ContentService.createTextOutput("Unknown action");
}

function getAppData() {
  var data = { version: VERSION, title: TITLE };
  return data;
}

/**
 * Ensure CACHE_EPOCH exists in Script Properties.
 * Called after a successful deploy — generates default if missing.
 * Existing value is never overwritten.
 */
function ensureScriptProperties_() {
  try {
    var props = PropertiesService.getScriptProperties();
    if (!props.getProperty('CACHE_EPOCH')) {
      props.setProperty('CACHE_EPOCH', '1');
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
// Developed by: ShadowAISolutions
