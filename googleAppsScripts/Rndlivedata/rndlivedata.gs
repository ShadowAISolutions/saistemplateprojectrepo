var VERSION = "v01.00g";
var TITLE = "RND Live Data";
var GITHUB_OWNER  = "ShadowAISolutions";
var GITHUB_REPO   = "saistemplateprojectrepo";
var GITHUB_BRANCH = "main";
var FILE_PATH     = "googleAppsScripts/Rndlivedata/rndlivedata.gs";
var DEPLOYMENT_ID = "AKfycbxnhplqv-s116CtveTF-8Efdpd_MWA9RZwdJ0th4-4QK_1cRpngS0CBJemY4Znb6ND7";
var EMBED_PAGE_URL = "https://ShadowAISolutions.github.io/saistemplateprojectrepo/rndlivedata.html";

// ══════════════
// PROJECT START
// ══════════════

// ══════════════
// PROJECT END
// ══════════════

// ══════════════
// TEMPLATE START
// ══════════════

function doGet() {
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
