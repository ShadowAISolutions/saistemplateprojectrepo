// =============================================
// SELF-UPDATING GOOGLE APPS SCRIPT FROM GITHUB
// =============================================
//
// WHAT THIS IS
// ------------
// A Google Apps Script web app that pulls its own source code from
// a GitHub repository and redeploys itself. GitHub is the source of
// truth — this file (testation3.gs) is the ONLY file you need to edit.
//
// There are TWO ways updates reach the live web app:
//   1. AUTOMATIC: Push to a claude/* branch → GitHub Action merges to
//      main → calls doPost(action=deploy) → GAS pulls + deploys itself
//   2. MANUAL: Click "Pull Latest" in the web app UI
//
// PAGE RELOAD (EMBEDDING SOLUTION)
// ---------------------------------
// The GAS sandbox iframe blocks programmatic navigation from async
// callbacks. Solution: embed the web app as a full-screen iframe on
// a GitHub Pages page. The embedding page polls a version file on
// GitHub Pages to detect updates and reloads automatically.
//
// ARCHITECTURE — DYNAMIC LOADER PATTERN
// ---------------------------------------
// - doGet() serves a STATIC HTML shell (never changes)
// - All visible content is fetched at runtime via getAppData()
// - getAppData() returns {version, title} → applyData() updates DOM
// - After a pull, getAppData() runs on the NEW server code
// - This bypasses Google's aggressive server-side HTML caching
//
// AUTO-DEPLOY FLOW (push → live in ~30 seconds)
// -----------------------------------------------
//   1. Claude Code pushes to claude/* branch
//   2. GitHub Action merges to main
//   3. GitHub Action calls doPost(action=deploy)
//   4. doPost() calls pullAndDeployFromGitHub() directly
//   5. GAS pulls new code from GitHub, overwrites project, deploys
//   6. Embedding page detects version change via gs.version.txt polling
//   7. App shows new version — zero manual clicks
//
// SETUP STEPS
// -----------
// 1. Create an Apps Script project, paste this code
// 2. Enable "Show appsscript.json" in Project Settings, set contents:
//    {
//      "timeZone": "America/New_York",
//      "runtimeVersion": "V8",
//      "dependencies": {},
//      "webapp": {
//        "executeAs": "USER_DEPLOYING",
//        "access": "ANYONE_ANONYMOUS"
//      },
//      "exceptionLogging": "STACKDRIVER",
//      "oauthScopes": [
//        "https://www.googleapis.com/auth/script.projects",
//        "https://www.googleapis.com/auth/script.external_request",
//        "https://www.googleapis.com/auth/script.deployments",
//        "https://www.googleapis.com/auth/spreadsheets",
//        "https://www.googleapis.com/auth/script.send_mail"
//      ]
//    }
// 3. Create or use a GCP project where you have Owner access
// 4. Enable Apps Script API in GCP project (APIs & Services → Library)
// 5. Link GCP project in Apps Script (Project Settings → Change project)
// 6. Enable Apps Script API at script.google.com/home/usersettings
// 7. Deploy as Web app (Deploy → New deployment → Web app → Anyone)
// 8. Copy Deployment ID into DEPLOYMENT_ID below
// 9. Set GITHUB_TOKEN in Script Properties:
//      Key: GITHUB_TOKEN   Value: github_pat_... token
// 10. Run any function from editor to trigger OAuth authorization
//
// IMPORTANT — AUTO-INCREMENT VERSION ON EVERY COMMIT:
//   Whenever Claude Code edits this file, it MUST increment VERSION
//   by 0.01 (e.g. "01.00g" → "01.01g").
//
// =============================================

// ── PROJECT CONFIG ────────────────────────────────────────────────
// gas-template.config.json (same directory) is the SINGLE SOURCE OF TRUTH for
// project-unique values: TITLE, DEPLOYMENT_ID, SPREADSHEET_ID,
// SHEET_NAME, SOUND_FILE_ID. Edit config.json; the Pre-Commit
// Checklist syncs the values here and to the embedding HTML page.
//
// VERSION and repo-derived values (GITHUB_OWNER, GITHUB_REPO,
// FILE_PATH, EMBED_PAGE_URL) are managed directly in this file —
// they are NOT in config.json.

var VERSION = "01.28g";
var TITLE = "Test Title 3";                                      // ← gas-template.config.json

// GitHub config — where to pull code from
var GITHUB_OWNER  = "ShadowAISolutions";
var GITHUB_REPO   = "htmltemplateautoupdate";
var GITHUB_BRANCH = "main";
var FILE_PATH     = "googleAppsScripts/Testation3/testation3.gs";

// Apps Script deployment ID (from Deploy → Manage deployments)
var DEPLOYMENT_ID = "AKfycbzE--oM0T_h3Ox4tzj6haZyVEjrVfRMt-8AJnGrUGcyW8bGMr3emggbbT1AJeiaSWIL";                        // ← gas-template.config.json

// Google Sheets config (optional — for version tracking)
var SPREADSHEET_ID = "1uTw8VG5Wi5KOr_KVmBz6yz25TJQpEUFfT3xsM_vajw8";                      // ← gas-template.config.json
var SHEET_NAME     = "Live_Sheet";                               // ← gas-template.config.json

// Sound config (optional — Google Drive file ID for notification sound)
var SOUND_FILE_ID = "1bzVp6wpTHdJ4BRX8gbtDN73soWpmq1kN";                                          // ← gas-template.config.json

// Embedding page URL — the GitHub Pages page that iframes this GAS app
var EMBED_PAGE_URL = "https://ShadowAISolutions.github.io/htmltemplateautoupdate/testation3.html";

// ──────────────────────────────────────────────────────────────────

function doGet() {
  var html = `
    <html>
    <head>
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
      <style>
        html, body { height: 100%; margin: 0; overflow: auto; }
        body { font-family: Arial; display: flex; flex-direction: column; align-items: center; padding: 20px 0; box-sizing: border-box; }
        button { background: #2e7d32; color: white; border: none; padding: 8px 20px;
                 border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 10px; }
        button:hover { background: #1b5e20; }
        #versionCount { margin-top: 6px; font-size: 12px; color: #888; }
        #main-content { position: relative; width: 90%; max-width: 600px; text-align: center; }
        #sheet-container { margin-top: 10px; }
        #sheet-container h3 { text-align: center; color: #333; margin: 0 0 4px 0; }
        #token-info { position: fixed; top: 10px; right: 10px; font-size: 11px; color: #666; text-align: left; line-height: 1.6; white-space: nowrap; }
        #token-info div { margin-bottom: 2px; }
        #live-b1 { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 4px; text-align: center; }
        #sheet-iframe { width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 6px; }
        #version { position: fixed; bottom: 8px; left: 8px; z-index: 9999; color: #1565c0; font-size: 12px; margin: 0; font-family: monospace; opacity: 0.8; }
      </style>
    </head>
    <body>
      <h2 id="version">v${VERSION}</h2>
      <h1 id="title" style="font-size: 28px; margin: 0 0 4px 0;">${TITLE}</h1>
      <div id="token-info">...</div>
      <div id="main-content">
        <form id="redirect-form" method="GET" action="${EMBED_PAGE_URL}" target="_top" style="display:inline;">
          <button id="reload-btn" type="submit" style="background:#2e7d32;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:14px;margin-top:10px;">🔄 Reload Page</button>
        </form>
        <div id="versionCount"></div>

        ${SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID" ? `
        <div id="sheet-container">
          <h3>${SHEET_NAME}</h3>
          <div id="live-b1">...</div>
          <iframe id="sheet-iframe" src="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?rm=minimal" style="width:100%;height:300px;border:1px solid #ddd;border-radius:6px;"></iframe>
        </div>
        ` : ''}
      </div>

      <div style="margin-top:10px;">
        <button onclick="playReadySound()" style="background:#1565c0;color:white;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px;">🔊 Test Sound (Drive)</button>
        <button onclick="playBeep()" style="background:#6a1b9a;color:white;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px;margin-left:6px;">🔔 Test Beep (Old)</button>
        <button onclick="testVibrate()" style="background:#2e7d32;color:white;border:none;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:13px;margin-left:6px;">📳 Test Vibrate</button>
      </div>

      <div style="margin-top:30px;text-align:center;">
        <svg width="200" height="260" viewBox="0 0 200 260">
          <!-- ground shadow -->
          <ellipse cx="100" cy="242" rx="70" ry="12" fill="#c4b199" opacity="0.4"/>
          <!-- trunk -->
          <rect x="88" y="175" width="24" height="55" rx="4" fill="#8B5E3C"/>
          <rect x="91" y="175" width="6" height="55" rx="2" fill="#A0714F" opacity="0.5"/>
          <!-- tree layers (bottom to top, with overlap shadows) -->
          <polygon points="100,85 15,190 185,190" fill="#4CAF50"/>
          <polygon points="100,85 30,175 170,175" fill="#43A047" opacity="0.5"/>
          <polygon points="100,45 35,145 165,145" fill="#388E3C"/>
          <polygon points="100,45 50,130 150,130" fill="#2E7D32" opacity="0.4"/>
          <polygon points="100,10 50,100 150,100" fill="#2E7D32"/>
          <polygon points="100,10 60,90 140,90" fill="#1B5E20" opacity="0.35"/>
        </svg>
      </div>

      <script>
        var _soundDataUrl = null;
        google.script.run
          .withSuccessHandler(function(dataUrl) { _soundDataUrl = dataUrl; })
          .withFailureHandler(function() {})
          .getSoundBase64();

        function playBeep() {
          try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.3;
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
          } catch(e) {}
        }

        function playReadySound() {
          if (!_soundDataUrl) return;
          try {
            var audio = new Audio(_soundDataUrl);
            audio.play().catch(function() {});
          } catch(e) {}
        }

        function testVibrate() {
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
        }

        function applyData(data) {
          for (var key in data) {
            var el = document.getElementById(key);
            if (el) {
              el.textContent = data[key];
              if (key === 'versionCount' && data[key].indexOf('LIMIT') !== -1) {
                el.style.color = '#d32f2f';
                el.style.fontWeight = 'bold';
              }
            }
          }
        }

        google.script.run
          .withSuccessHandler(function(data) {
            applyData(data);
          })
          .getAppData();

        // Poll cell B1 from cache every 15s (cache is updated by onEditWriteB1ToCache trigger)
        function pollB1FromCache() {
          google.script.run
            .withSuccessHandler(function(val) {
              var el = document.getElementById('live-b1');
              if (el) el.textContent = val;
            })
            .readB1FromCacheOrSheet();
        }
        if (document.getElementById('live-b1')) {
          pollB1FromCache();
          setInterval(pollB1FromCache, 15000);
        }

        // Poll token/quota usage (on load + every 60s)
        function pollQuotaAndLimits() {
          google.script.run
            .withSuccessHandler(function(t) {
              var el = document.getElementById('token-info');
              if (el) {
                el.innerHTML =
                  '<div style="font-weight:bold;color:#1b5e20;margin-bottom:3px;">Live Quotas</div>'
                  + '<div>GitHub: ' + t.github + '</div>'
                  + '<div>Mail: ' + t.mail + '</div>'
                  + '<div style="border-top:1px solid #ccc;margin:4px 0;"></div>'
                  + '<div style="font-weight:bold;color:#666;margin-bottom:3px;">Estimates</div>'
                  + '<div>UrlFetch: ' + t.urlFetch + '</div>'
                  + '<div>Sheets: ' + t.spreadsheet + '</div>'
                  + '<div>Exec: ' + t.execTime + '</div>';
              }
            })
            .fetchGitHubQuotaAndLimits();
        }
        if (document.getElementById('token-info')) {
          pollQuotaAndLimits();
          setInterval(pollQuotaAndLimits, 60000);
        }

        var _autoPulling = false;
        function checkForUpdates() {
          if (_autoPulling) return;
          _autoPulling = true;
          google.script.run
            .withSuccessHandler(function(result) {
              setTimeout(function() { _autoPulling = false; }, 30000);
            })
            .withFailureHandler(function() {
              setTimeout(function() { _autoPulling = false; }, 30000);
            })
            .pullAndDeployFromGitHub();
        }

        // Auto-check for updates on page load (fallback if webhook missed)
        checkForUpdates();

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

  if (action === "deploy") {
    var result = pullAndDeployFromGitHub();
    return ContentService.createTextOutput(result);
  }

  if (action === "writeC1") {
    var value = (e.parameter.value) || "";
    if (SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID") {
      try {
        var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        var sheet = ss.getSheetByName(SHEET_NAME);
        if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
        sheet.getRange("C1").setValue(value + " — " + new Date().toLocaleString());
      } catch(e) {}
    }
    return ContentService.createTextOutput("OK");
  }

  return ContentService.createTextOutput("Unknown action");
}

function getAppData() {
  var data = { version: "v" + VERSION, title: TITLE };

  var cache = CacheService.getScriptCache();
  var vStatus = cache.get("version_count_status");
  if (!vStatus) {
    try {
      var scriptId = ScriptApp.getScriptId();
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
      vStatus = totalVersions + "/200 versions";
      if (totalVersions >= 180) vStatus += " — APPROACHING LIMIT!";
      cache.put("version_count_status", vStatus, 21600);
    } catch(e) {
      vStatus = "Unable to check version count";
    }
  }
  data.versionCount = vStatus;
  return data;
}

function getSoundBase64() {
  if (!SOUND_FILE_ID || SOUND_FILE_ID === "") return null;
  var url = "https://drive.google.com/uc?export=download&id=" + SOUND_FILE_ID;
  var response = UrlFetchApp.fetch(url, { followRedirects: true });
  var blob = response.getBlob();
  var base64 = Utilities.base64Encode(blob.getBytes());
  var contentType = blob.getContentType() || "audio/mpeg";
  return "data:" + contentType + ";base64," + base64;
}


function writeVersionToSheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "YOUR_SPREADSHEET_ID") return;
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange("A1").setValue("v" + VERSION + " — " + new Date().toLocaleString());
  } catch(e) {}
}

function readB1FromCacheOrSheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "YOUR_SPREADSHEET_ID") return "";
  var cache = CacheService.getScriptCache();
  var cached = cache.get("live_b1");
  if (cached !== null) return cached;

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return "";
  var val = sheet.getRange("B1").getValue();
  var result = val !== null && val !== undefined ? String(val) : "";
  cache.put("live_b1", result, 21600);
  return result;
}

// Installable onEdit trigger. Writes B1 value to CacheService when edited.
// Install: Apps Script editor → Triggers → + Add Trigger →
//   Function: onEditWriteB1ToCache, Event source: From spreadsheet, Event type: On edit
function onEditWriteB1ToCache(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  if (e.range.getRow() !== 1 || e.range.getColumn() !== 2) return;
  var val = e.range.getValue();
  var result = val !== null && val !== undefined ? String(val) : "";
  CacheService.getScriptCache().put("live_b1", result, 21600);
}

function fetchGitHubQuotaAndLimits() {
  var result = {};

  // GitHub API rate limit (queryable)
  var GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  var headers = {};
  if (GITHUB_TOKEN) {
    headers["Authorization"] = "token " + GITHUB_TOKEN;
  }
  try {
    var resp = UrlFetchApp.fetch("https://api.github.com/rate_limit", { headers: headers });
    var data = JSON.parse(resp.getContentText());
    var core = data.resources.core;
    result.github = core.remaining + "/" + core.limit + "/hr";
  } catch(e) {
    result.github = "error";
  }

  // UrlFetchApp: 20,000/day (not queryable — show limit only)
  result.urlFetch = "20,000/day";

  // SpreadsheetApp: ~20,000/day (not queryable — show limit only)
  result.spreadsheet = "~20,000/day";

  // Apps Script execution time: 90 min/day (not queryable)
  result.execTime = "90 min/day";

  // MailApp remaining daily quota (requires script.send_mail scope)
  try {
    var mailRemaining = MailApp.getRemainingDailyQuota();
    result.mail = mailRemaining + " remaining/day";
  } catch(e) {
    result.mail = "scope error: " + e.message;
  }

  return result;
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
    return "Already up to date (v" + VERSION + ")";
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
    payload: JSON.stringify({ description: "v" + pulledVersion + " — from GitHub " + new Date().toLocaleString() })
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
        description: "v" + pulledVersion + " (deployment " + newVersion + ")"
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
    cleanupInfo = " | " + totalVersions + "/200 versions";
    var versionStatus = totalVersions + "/200 versions";
    if (totalVersions >= 180) versionStatus += " — APPROACHING LIMIT!";
    CacheService.getScriptCache().put("version_count_status", versionStatus, 21600);
  } catch(cleanupErr) {
    cleanupInfo = " | Version count error: " + cleanupErr.message;
  }

  return "Updated to v" + pulledVersion + " (deployment " + newVersion + ")" + cleanupInfo;
}
// Developed by: ShadowAISolutions
