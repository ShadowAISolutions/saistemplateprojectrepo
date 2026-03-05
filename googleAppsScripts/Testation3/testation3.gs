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
// a GitHub Pages page. After deploy, the GAS client sends:
//   window.top.postMessage({type:'gas-reload', version: ...}, '*')
// The embedding page catches this and reloads itself.
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
//   6. postMessage tells the embedding page to reload
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
// FILE_PATH, EMBED_PAGE_URL, SPLASH_LOGO_URL) are managed directly
// in this file — they are NOT in config.json.

var VERSION = "01.14g";
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

// Logo shown on the splash screen
var SPLASH_LOGO_URL = "https://www.shadowaisolutions.com/SAIS_Logo.png";
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
        #splash { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0d47a1; z-index: 9999; transition: opacity 0.3s ease; display: flex; align-items: center; justify-content: center; }
        #splash img { max-width: 500px; max-height: 500px; }
        button { background: #2e7d32; color: white; border: none; padding: 8px 20px;
                 border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 10px; }
        button:hover { background: #1b5e20; }
        #versionCount { margin-top: 6px; font-size: 12px; color: #888; }
        #sheet-container { margin-top: 10px; width: 90%; max-width: 600px; position: relative; }
        #sheet-container h3 { text-align: center; color: #333; margin: 0 0 4px 0; }
        #token-info { position: absolute; right: -170px; top: 0; font-size: 11px; color: #666; text-align: left; line-height: 1.6; white-space: nowrap; }
        #token-info div { margin-bottom: 2px; }
        #live-b1 { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 4px; text-align: center; }
        #sheet-iframe { width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 6px; }
        #gas-pill { position: fixed; bottom: 8px; left: 8px; z-index: 9999; display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.55); color: #ccc; padding: 4px 10px; border-radius: 12px; font: 11px/1 monospace; user-select: none; cursor: pointer; transition: all 0.3s ease; }
        #gas-pill:hover { background: rgba(0,0,0,0.75); }
        #gas-pill .dot { width: 8px; height: 8px; border-radius: 50%; background: #888; transition: background 0.3s; display: flex; align-items: center; justify-content: center; font-size: 6px; line-height: 1; color: #fff; }
        #gas-pill .dot.checking { background: #ffa726; animation: gpulse 0.6s infinite alternate; }
        #gas-pill .dot.counting { background: #888; }
        #gas-pill .dot.found { background: #66bb6a; }
        @keyframes gpulse { from { opacity: 1; } to { opacity: 0.4; } }
        #gcl-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10001; display: none; align-items: center; justify-content: center; }
        #gcl-popup { background: #1a1a2e; color: #e0e0e0; border-radius: 12px; max-width: 480px; width: 90%; max-height: 70vh; display: flex; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        #gcl-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        #gcl-title { font: bold 16px/1 sans-serif; color: #fff; }
        #gcl-close { background: none; border: none; color: #888; font-size: 24px; cursor: pointer; padding: 4px 8px; line-height: 1; }
        #gcl-close:hover { color: #fff; }
        #gcl-body { padding: 16px 20px; overflow-y: auto; font: 13px/1.5 sans-serif; }
        #gcl-body h3 { font-size: 14px; color: #7c8bff; margin: 16px 0 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
        #gcl-body h3:first-child { margin-top: 0; }
        #gcl-body h4 { font-size: 12px; color: #a0a0a0; margin: 10px 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        #gcl-body ul { margin: 0 0 8px; padding-left: 20px; }
        #gcl-body li { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      <div id="splash"><img src="${SPLASH_LOGO_URL}" alt=""></div>
      <div id="gas-pill"><span class="dot"></span><span id="gas-pill-label">GAS ...</span></div>
      <div id="gcl-overlay"><div id="gcl-popup"><div id="gcl-header"><span id="gcl-title">GAS Changelog</span><button id="gcl-close">&times;</button></div><div id="gcl-body"></div></div></div>
      <h1 id="title" style="font-size: 28px; margin: 0 0 4px 0;">...</h1>
      <form id="redirect-form" method="GET" action="${EMBED_PAGE_URL}" target="_top" style="display:inline;">
        <button id="reload-btn" type="submit" style="background:#2e7d32;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:14px;margin-top:10px;">🔄 Reload Page</button>
      </form>
      <div id="versionCount"></div>

      ${SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID" ? `
      <div id="sheet-container">
        <h3>${SHEET_NAME}</h3>
        <div id="token-info">...</div>
        <div id="live-b1">...</div>
        <iframe id="sheet-iframe" src="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?rm=minimal"></iframe>
      </div>
      ` : ''}

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
            // Update the GAS version pill
            var pl = document.getElementById('gas-pill-label');
            if (pl && data.version) pl.textContent = 'GAS ' + data.version;
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
        function pollPushedVersionFromCache() {
          if (_autoPulling) return;
          google.script.run
            .withSuccessHandler(function(pushed) {
              if (!pushed) return;
              var current = (document.getElementById('version').textContent || '').trim();
              if (pushed !== current && pushed !== '') {
                _autoPulling = true;
                var reloadMsg = {type: 'gas-reload', version: pushed};
                if (_soundDataUrl) reloadMsg.soundDataUrl = _soundDataUrl;
                try { window.top.postMessage(reloadMsg, '*'); } catch(e) {}
                try { window.parent.postMessage(reloadMsg, '*'); } catch(e) {}
                setTimeout(function() { _autoPulling = false; }, 30000);
              }
            })
            .readPushedVersionFromCache();
        }

        // GAS version pill — countdown + polling integration
        (function() {
          var pill = document.getElementById('gas-pill');
          var pillDot = pill.querySelector('.dot');
          var POLL_SEC = 15;
          var cd = POLL_SEC;

          setInterval(function() {
            cd--;
            if (cd <= 0) {
              cd = POLL_SEC;
              pillDot.textContent = '';
              pillDot.className = 'dot checking';
              pollPushedVersionFromCache();
              setTimeout(function() { if (pillDot.className === 'dot checking') { pillDot.className = 'dot'; pillDot.textContent = ''; } }, 800);
            } else if (cd <= 5) {
              pillDot.textContent = cd;
              pillDot.className = 'dot counting';
            }
          }, 1000);

          // Changelog popup
          var overlay = document.getElementById('gcl-overlay');
          var clBody = document.getElementById('gcl-body');
          var clCache = null;

          pill.addEventListener('click', function(e) {
            e.stopPropagation();
            overlay.style.display = 'flex';
            if (!clCache) {
              clBody.innerHTML = '<p style="color:#888">Loading changelog\\u2026</p>';
              google.script.run
                .withSuccessHandler(function(md) {
                  clCache = parseGCL(md);
                  clBody.innerHTML = clCache;
                  var ver = (document.getElementById('version').textContent || '').trim();
                  if (ver) document.getElementById('gcl-title').textContent = 'GAS Changelog \\u2014 ' + ver;
                })
                .withFailureHandler(function() {
                  clBody.innerHTML = '<p style="color:#888">Could not load changelog.</p>';
                })
                .getGasChangelog();
            }
          });

          document.getElementById('gcl-close').addEventListener('click', function() { overlay.style.display = 'none'; });
          document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.style.display === 'flex') overlay.style.display = 'none'; });

          function parseGCL(md) {
            var lines = md.split('\\n');
            var html = '';
            var inList = false;
            for (var i = 0; i < lines.length; i++) {
              var line = lines[i];
              if (line.match(/^# /) || line.match(/^\`Sections:/) || line.match(/^All notable/) || line.match(/^Format follows/) || line.match(/^Developed by:/)) continue;
              if (line.match(/^## \\[Unreleased\\]/)) continue;
              if (line.match(/^## \\[/)) {
                if (inList) { html += '</ul>'; inList = false; }
                var m = line.match(/^## \\[([\\d.]+g)\\].*?\\u2014 (.+)/);
                if (m) html += '<h3>' + m[1] + ' \\u2014 ' + m[2] + '</h3>';
                continue;
              }
              if (line.match(/^### /)) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<h4>' + line.substring(4) + '</h4>';
                continue;
              }
              if (line.match(/^- /)) {
                if (!inList) { html += '<ul>'; inList = true; }
                html += '<li>' + line.substring(2) + '</li>';
                continue;
              }
            }
            if (inList) html += '</ul>';
            return html || '<p style="color:#888">No changelog entries yet.</p>';
          }
        })();

        // Auto-check for updates on page load (fallback if webhook missed)
        google.script.run
          .withSuccessHandler(function(result) {
            if (result.indexOf('Updated to') !== -1) {
              var reloadMsg = {type: 'gas-reload', version: result};
              if (_soundDataUrl) reloadMsg.soundDataUrl = _soundDataUrl;
              try { window.top.postMessage(reloadMsg, '*'); } catch(e) {}
              try { window.parent.postMessage(reloadMsg, '*'); } catch(e) {}
            }
          })
          .withFailureHandler(function() {})
          .pullAndDeployFromGitHub();

        setTimeout(function() {
          var splash = document.getElementById('splash');
          splash.style.opacity = '0';
          setTimeout(function() { splash.style.display = 'none'; }, 300);
        }, 1000);

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
    CacheService.getScriptCache().put("pushed_version", value, 3600);
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

function getGasChangelog() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get("gas_changelog");
  if (cached) return cached;
  var pageName = FILE_PATH.split('/').pop().replace('.gs', '');
  var changelogPath = "live-site-pages/" + pageName + "gs.changelog.txt";
  var url = "https://raw.githubusercontent.com/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/" + GITHUB_BRANCH + "/" + changelogPath;
  var GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  var headers = {};
  if (GITHUB_TOKEN) headers["Authorization"] = "token " + GITHUB_TOKEN;
  try {
    var resp = UrlFetchApp.fetch(url, { headers: headers });
    var text = resp.getContentText();
    cache.put("gas_changelog", text, 3600);
    return text;
  } catch(e) {
    return "";
  }
}

function readPushedVersionFromCache() {
  return CacheService.getScriptCache().get("pushed_version") || "";
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

  CacheService.getScriptCache().put("pushed_version", "v" + pulledVersion, 3600);

  return "Updated to v" + pulledVersion + " (deployment " + newVersion + ")" + cleanupInfo;
}
// Developed by: ShadowAISolutions
