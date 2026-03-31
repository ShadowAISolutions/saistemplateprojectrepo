#Requires AutoHotkey v2.0
#SingleInstance Force

VERSION := "v01.00a"

; === GitHub Config ===
GITHUB_OWNER  := "ShadowAISolutions"
GITHUB_REPO   := "saistemplateprojectrepo"
GITHUB_BRANCH := "main"
GITHUB_TOKEN  := ""  ; Optional: set to "github_pat_..." for private repos (higher rate limit)

; === Poll Config ===
POLL_INTERVAL := 120000  ; 120 seconds (safe for unauthenticated GitHub API 60 req/hr limit)

; === Files to Monitor ===
; Each entry: {local: filename, remote: repo path, isSelf: bool}
TARGETS := []
TARGETS.Push({local: "AutoUpdate.ahk", remote: "autoHotkey/AutoUpdate.ahk", isSelf: true})
TARGETS.Push({local: "Combined Inventory and Intercept.ahk", remote: "autoHotkey/Combined Inventory and Intercept.ahk", isSelf: false})

; === State Tracking ===
LastCheckTime := ""
LastStatus := Map()
SelfUpdatePending := false

; === Tray Menu Setup ===
A_TrayMenu.Delete()
A_TrayMenu.Add("Check Now", (*) => CheckForUpdates())
A_TrayMenu.Add("Status", (*) => ShowStatusDialog())
A_TrayMenu.Add()
A_TrayMenu.Add("Exit", (*) => ExitApp())
A_IconTip := "AutoUpdate " VERSION " — Monitoring " TARGETS.Length " file(s)"

; === Start Timers ===
SetTimer(CheckForUpdates, -3000)       ; One-shot: check 3 seconds after launch
SetTimer(CheckForUpdates, POLL_INTERVAL) ; Recurring check

; Keep script running
Persistent()

; ════════════════════════
; Core Functions
; ════════════════════════

CheckForUpdates() {
    global LastCheckTime, SelfUpdatePending
    LastCheckTime := FormatTime(, "yyyy-MM-dd hh:mm:ss tt")
    selfTarget := ""

    for target in TARGETS {
        if target.isSelf {
            selfTarget := target  ; Process self-update last
            continue
        }
        CheckOneFile(target)
    }

    ; Self-update is always last (Reload terminates execution)
    if selfTarget != "" {
        result := CheckOneFile(selfTarget)
        if SelfUpdatePending {
            Reload()  ; This line ends current execution
        }
    }
}

CheckOneFile(target) {
    global LastStatus, SelfUpdatePending

    ; Fetch remote file content from GitHub
    remoteContent := FetchRemoteContent(target.remote)
    if remoteContent = "" {
        LastStatus[target.local] := "Error: failed to fetch remote"
        return "error"
    }

    ; Extract remote version
    remoteVersion := ExtractVersion(remoteContent)
    if remoteVersion = "" {
        LastStatus[target.local] := "Error: no VERSION found in remote"
        return "error"
    }

    ; Read local file and extract version
    localPath := A_ScriptDir "\" target.local
    if !FileExist(localPath) {
        LastStatus[target.local] := "Error: local file not found"
        return "error"
    }

    try {
        localContent := FileRead(localPath)
    } catch {
        LastStatus[target.local] := "Error: could not read local file"
        return "error"
    }

    localVersion := ExtractVersion(localContent)
    if localVersion = "" {
        LastStatus[target.local] := "Warning: no VERSION in local file"
        return "no-version"
    }

    ; Compare versions
    if localVersion = remoteVersion {
        LastStatus[target.local] := localVersion " — up to date"
        return "current"
    }

    ; Update needed
    updated := UpdateFile(target, remoteContent, localVersion, remoteVersion)
    if updated {
        LastStatus[target.local] := localVersion " → " remoteVersion " — updated"
        TrayTip("Updated: " target.local, "AutoUpdate: " localVersion " → " remoteVersion, "Mute")
        return "updated"
    } else {
        LastStatus[target.local] := "Error: update failed"
        return "error"
    }
}

FetchRemoteContent(remotePath) {
    global GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, GITHUB_TOKEN

    url := "https://api.github.com/repos/" GITHUB_OWNER "/" GITHUB_REPO
        . "/contents/" UriEncode(remotePath)
        . "?ref=" GITHUB_BRANCH
        . "&t=" A_TickCount  ; Cache buster

    try {
        req := ComObject("WinHttp.WinHttpRequest.5.1")
        req.Open("GET", url, false)
        req.SetRequestHeader("Accept", "application/vnd.github.v3.raw")
        req.SetRequestHeader("User-Agent", "AHK-AutoUpdate/" VERSION)

        if GITHUB_TOKEN != "" {
            req.SetRequestHeader("Authorization", "token " GITHUB_TOKEN)
        }

        req.Send()

        if req.Status = 200 {
            return req.ResponseText
        } else if req.Status = 403 {
            ; Rate limited — skip this cycle
            TrayTip("Rate limited", "AutoUpdate: GitHub API rate limit hit. Consider adding a token.", "Mute")
            return ""
        } else {
            return ""
        }
    } catch as err {
        return ""
    }
}

ExtractVersion(content) {
    if RegExMatch(content, 'VERSION\s*:=\s*"([^"]+)"', &match) {
        return match[1]
    }
    return ""
}

UpdateFile(target, newContent, oldVersion, newVersion) {
    global SelfUpdatePending
    localPath := A_ScriptDir "\" target.local

    try {
        ; Write new content to file (AHK doesn't lock .ahk files while running)
        f := FileOpen(localPath, "w", "UTF-8")
        f.Write(newContent)
        f.Close()
    } catch as err {
        TrayTip("Update failed", "AutoUpdate: Could not write to " target.local "`n" err.Message, "Mute")
        return false
    }

    if target.isSelf {
        ; Flag self-update — Reload happens after all targets are processed
        SelfUpdatePending := true
    } else {
        ; Restart the target script if it's running
        ; #SingleInstance Force in the target will replace the old instance
        if WinExist(target.local) {
            try {
                Run(localPath)
            }
        }
    }

    return true
}

UriEncode(str) {
    ; Percent-encode for URL path segments (spaces, special chars)
    encoded := ""
    loop parse, str {
        c := A_LoopField
        if RegExMatch(c, "[A-Za-z0-9\-_.~/]") {
            encoded .= c
        } else {
            code := Ord(c)
            encoded .= "%" Format("{:02X}", code)
        }
    }
    return encoded
}

ShowStatusDialog() {
    global LastCheckTime, LastStatus, TARGETS, VERSION

    msg := "AutoUpdate " VERSION "`n"
    msg .= "Last check: " (LastCheckTime != "" ? LastCheckTime : "not yet") "`n`n"

    for target in TARGETS {
        status := LastStatus.Has(target.local) ? LastStatus[target.local] : "not checked yet"
        label := target.isSelf ? target.local " (self)" : target.local
        msg .= label "`n  → " status "`n`n"
    }

    msg .= "Poll interval: " (POLL_INTERVAL / 1000) " seconds`n"
    msg .= "GitHub: " GITHUB_OWNER "/" GITHUB_REPO " (" GITHUB_BRANCH ")`n"
    msg .= "Token: " (GITHUB_TOKEN != "" ? "configured" : "not set (60 req/hr limit)")

    MsgBox(msg, "AutoUpdate Status")
}

; Developed by: ShadowAISolutions
