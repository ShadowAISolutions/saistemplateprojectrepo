var VERSION = "v01.04g";
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

// PROJECT OVERRIDE: Data reads via CacheService — refreshed by time trigger.
// Spreadsheet stays private. writePresence/getActiveUsers piggyback cached data
// on existing calls so viewers incur zero additional GAS quota for data reads.

/**
 * refreshDataCache() — reads the private spreadsheet and stores data in CacheService.
 * Called by a time-driven trigger (every 1 minute). This is the ONLY function that
 * hits the Spreadsheet API for live data — all viewer-facing calls read from cache.
 * Set up trigger: Apps Script editor → Triggers → Add → refreshDataCache → Time-driven → Every minute.
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
    CacheService.getScriptCache().put('livedata_' + SHEET_NAME, result, 90);
  } catch (e) {
    Logger.log('refreshDataCache error: ' + e.message);
  }
}

/**
 * getCachedData() — reads live data from CacheService (no spreadsheet hit).
 * Returns parsed object { headers, rows, ts } or null if cache is empty.
 */
function getCachedData() {
  var cached = CacheService.getScriptCache().get('livedata_' + SHEET_NAME);
  return cached ? JSON.parse(cached) : null;
}

/**
 * writePresence(userName) — writes a heartbeat to the hidden _Presence sheet.
 * Creates the sheet with "User"/"Last Seen" headers if it doesn't exist.
 * Updates existing user rows or appends new ones.
 * Called from the HTML page via GAS iframe every 30 seconds.
 * Returns cached live data piggybacked on the response (zero extra quota).
 */
function writePresence(userName) {
  if (!userName || typeof userName !== 'string') return getCachedData();
  userName = userName.substring(0, 50);
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('_Presence');
  if (!sheet) {
    sheet = ss.insertSheet('_Presence');
    sheet.appendRow(['User', 'Last Seen']);
    sheet.hideSheet();
  }
  var now = new Date().toISOString();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userName) {
      sheet.getRange(i + 1, 2).setValue(now);
      return getCachedData();
    }
  }
  sheet.appendRow([userName, now]);
  return getCachedData();
}

/**
 * getActiveUsers() — returns object with active users (within 60s) and cached live data.
 * Format: { users: [...], data: { headers, rows, ts } | null }
 */
function getActiveUsers() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('_Presence');
  if (!sheet) return { users: [], data: getCachedData() };
  var data = sheet.getDataRange().getValues();
  var cutoff = Date.now() - 60000;
  var active = [];
  for (var i = 1; i < data.length; i++) {
    var lastSeen = new Date(data[i][1]).getTime();
    if (lastSeen > cutoff) {
      active.push(data[i][0]);
    }
  }
  return { users: active, data: getCachedData() };
}

// ══════════════
// PROJECT END
// ══════════════

// ══════════════
// TEMPLATE START
// ══════════════

function doGet(e) {
  // PROJECT OVERRIDE START: GAS iframe embeds cached spreadsheet data on load and
  // receives updated data via writePresence/getActiveUsers responses.
  // Data is served from CacheService (refreshed by time trigger) — zero direct spreadsheet reads per viewer.
  // GAS iframe handles: (1) presence heartbeat + live data piggyback, (2) active user + data queries, (3) version checks, (4) on-demand data requests.
  // PROJECT OVERRIDE END
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
      </style>
    </head>
    <body>
      <h2 id="version">${VERSION}</h2>
      <p style="font-size:13px;color:#888;margin:8px;">Live data via CacheService (private spreadsheet)</p>

      <script>
        // Initial data embedded at iframe load time — zero extra calls
        var _initialData = ${initialDataJSON};
        if (_initialData) {
          top.postMessage({type: 'live-data', data: _initialData}, '*');
        }

        // Generate or retrieve viewer name
        var _viewerName = sessionStorage.getItem('rnd-viewer');
        if (!_viewerName) {
          _viewerName = 'Viewer_' + Math.random().toString(16).substring(2, 6).toUpperCase();
          sessionStorage.setItem('rnd-viewer', _viewerName);
        }

        // Presence heartbeat — write every 30 seconds, piggybacks live data on response
        function sendPresence() {
          google.script.run
            .withSuccessHandler(function(data) {
              if (data) top.postMessage({type: 'live-data', data: data}, '*');
            })
            .withFailureHandler(function() {})
            .writePresence(_viewerName);
        }
        sendPresence();
        setInterval(sendPresence, 30000);

        // Listen for requests from parent
        window.addEventListener('message', function(e) {
          if (e.data && e.data.type === 'get-active-users') {
            google.script.run
              .withSuccessHandler(function(result) {
                var users = (result && result.users) || [];
                var data = (result && result.data) || null;
                top.postMessage({type: 'active-users', users: users}, '*');
                if (data) top.postMessage({type: 'live-data', data: data}, '*');
              })
              .withFailureHandler(function() {
                top.postMessage({type: 'active-users', users: []}, '*');
              })
              .getActiveUsers();
          }
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
          if (e.data && e.data.type === 'get-live-data') {
            google.script.run
              .withSuccessHandler(function(data) {
                top.postMessage({type: 'live-data', data: data}, '*');
              })
              .withFailureHandler(function() {
                top.postMessage({type: 'live-data', data: null}, '*');
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
