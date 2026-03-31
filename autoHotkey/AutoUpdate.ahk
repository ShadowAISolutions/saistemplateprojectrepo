#Requires AutoHotkey v2.0
#SingleInstance Force

VERSION := "v01.06a"

; === GitHub Config ===
GITHUB_OWNER  := "ShadowAISolutions"
GITHUB_REPO   := "saistemplateprojectrepo"
GITHUB_BRANCH := "main"
GITHUB_TOKEN  := ""  ; Optional: set to "github_pat_..." for private repos (higher rate limit)

; === Poll Config ===
; Version files are in live-site-pages/ahk-versions/ and deployed to GitHub Pages.
; Polling GitHub Pages is free (CDN, no rate limit, works on private repos).
POLL_INTERVAL := 15000  ; 15 seconds
PAGES_BASE    := "https://" GITHUB_OWNER ".github.io/" GITHUB_REPO "/"

; === Files to Monitor ===
; Each entry: {local: filename, remote: repo path, isSelf: bool, versionFile: GitHub Pages path}
; versionFile follows the HTML/GAS convention: ahk-versions/<name>ahk.version.txt
; These are deployed to GitHub Pages via live-site-pages/
TARGETS := []
TARGETS.Push({local: "AutoUpdate.ahk", remote: "autoHotkey/AutoUpdate.ahk", isSelf: true, versionFile: "ahk-versions/autoupdateahk.version.txt"})
TARGETS.Push({local: "Combined Inventory and Intercept.ahk", remote: "autoHotkey/Combined Inventory and Intercept.ahk", isSelf: false, versionFile: "ahk-versions/combined-inventory-and-interceptahk.version.txt"})

; === State Tracking ===
LastCheckTime := ""
LastStatus := Map()
SelfUpdatePending := false
CountdownSeconds := 3  ; First check happens after 3 seconds
IsChecking := false

; ════════════════════════
; GUI Setup
; ════════════════════════

MainGui := Gui("+Resize", "AutoUpdate " VERSION)
MainGui.SetFont("s10", "Segoe UI")
MainGui.BackColor := "1E1E2E"

; Countdown display
MainGui.SetFont("s14 bold", "Segoe UI")
CountdownLabel := MainGui.AddText("w400 Center cCDD6F4", "Next check in: " CountdownSeconds "s")

; ListView for file statuses
MainGui.SetFont("s9 norm", "Consolas")
StatusLV := MainGui.AddListView("w400 h120 -Multi ReadOnly Background313244 cCDD6F4", ["File", "Local", "Remote", "Status"])
StatusLV.ModifyCol(1, 160)
StatusLV.ModifyCol(2, 70)
StatusLV.ModifyCol(3, 70)
StatusLV.ModifyCol(4, 90)

; Populate initial rows
for target in TARGETS {
    label := target.isSelf ? target.local " (self)" : target.local
    StatusLV.Add("", label, "—", "—", "waiting...")
}

; Last check time
MainGui.SetFont("s9 norm", "Segoe UI")
LastCheckLabel := MainGui.AddText("w400 Center c89B4FA", "Last check: not yet")

; Buttons row
MainGui.SetFont("s10", "Segoe UI")
BtnCheckNow := MainGui.AddButton("w120 Center", "Check Now")
BtnCheckNow.OnEvent("Click", (*) => ManualCheck())
MainGui.AddText("ys w20")
BtnHide := MainGui.AddButton("ys w120 Center", "Hide to Tray")
BtnHide.OnEvent("Click", (*) => MainGui.Hide())

; GitHub info footer
MainGui.SetFont("s8 norm", "Segoe UI")
MainGui.AddText("xm w400 Center c6C7086",
    GITHUB_OWNER "/" GITHUB_REPO " (" GITHUB_BRANCH ") · Token: "
    . (GITHUB_TOKEN != "" ? "configured" : "not set"))

; GUI close hides instead of exiting
MainGui.OnEvent("Close", (*) => MainGui.Hide())

; Show the GUI on launch
MainGui.Show("AutoSize")

; === Tray Menu Setup ===
A_TrayMenu.Delete()
A_TrayMenu.Add("Show / Hide", (*) => ToggleGui())
A_TrayMenu.Add("Check Now", (*) => ManualCheck())
A_TrayMenu.Add()
A_TrayMenu.Add("Exit", (*) => ExitApp())
A_TrayMenu.Default := "Show / Hide"
A_IconTip := "AutoUpdate " VERSION " — Monitoring " TARGETS.Length " file(s)"

; === Start Timer ===
; The 1-second countdown is the sole driver — it calls CheckForUpdates when it hits 0
SetTimer(UpdateCountdown, 1000)

Persistent()

; ════════════════════════
; GUI Helper Functions
; ════════════════════════

ToggleGui() {
    global MainGui
    if WinExist("ahk_id " MainGui.Hwnd)
        if DllCall("IsWindowVisible", "ptr", MainGui.Hwnd)
            MainGui.Hide()
        else
            MainGui.Show()
    else
        MainGui.Show()
}

ManualCheck() {
    global CountdownSeconds, POLL_INTERVAL
    CheckForUpdates()
    CountdownSeconds := POLL_INTERVAL // 1000
}

UpdateCountdown() {
    global CountdownSeconds, CountdownLabel, IsChecking, POLL_INTERVAL
    if IsChecking {
        CountdownLabel.Text := "Checking now..."
        return
    }
    if CountdownSeconds <= 0 {
        CountdownSeconds := POLL_INTERVAL // 1000
        CheckForUpdates()
        return
    }
    CountdownSeconds--
    CountdownLabel.Text := "Next check in: " CountdownSeconds "s"
}

UpdateGuiRow(index, localVer, remoteVer, status) {
    global StatusLV
    StatusLV.Modify(index, "", , localVer, remoteVer, status)
}

; ════════════════════════
; Core Functions
; ════════════════════════

CheckForUpdates() {
    global LastCheckTime, SelfUpdatePending, CountdownSeconds, POLL_INTERVAL
    global LastCheckLabel, IsChecking, TARGETS, LastStatus

    IsChecking := true
    LastCheckTime := FormatTime(, "yyyy-MM-dd hh:mm:ss tt")
    LastCheckLabel.Text := "Last check: " LastCheckTime

    ; Poll each target's version file from GitHub Pages (CDN, no rate limit, works on private repos)
    selfTarget := ""
    selfIndex := 0
    idx := 0

    for target in TARGETS {
        idx++
        remoteVer := FetchRemoteVersionFile(target.versionFile)
        localVer := ReadLocalVersionFile(target.versionFile)

        if remoteVer = "" {
            UpdateGuiRow(idx, localVer, "?", "✗ ver err")
            LastStatus[target.local] := "Error: could not fetch version file"
            continue
        }

        if localVer = remoteVer {
            UpdateGuiRow(idx, localVer, remoteVer, "✓ current")
            LastStatus[target.local] := localVer " — up to date"
            continue
        }

        ; Version mismatch — need to fetch full file and update
        if target.isSelf {
            selfTarget := target
            selfIndex := idx
            continue  ; Process self last
        }

        UpdateOneFile(target, idx, localVer, remoteVer)
    }

    ; Self-update is always last (Reload terminates execution)
    if selfTarget != "" {
        remoteVer := FetchRemoteVersionFile(selfTarget.versionFile)
        localVer := ReadLocalVersionFile(selfTarget.versionFile)
        if remoteVer != "" && localVer != remoteVer {
            UpdateOneFile(selfTarget, selfIndex, localVer, remoteVer)
        }
        if SelfUpdatePending {
            WriteLocalVersionFile(selfTarget.versionFile, remoteVer)
            Reload()
        }
    }

    IsChecking := false
    CountdownSeconds := POLL_INTERVAL // 1000
}

UpdateOneFile(target, rowIndex, localVersion, remoteVersion) {
    global LastStatus, SelfUpdatePending

    UpdateGuiRow(rowIndex, localVersion, remoteVersion, "↓ fetching")

    ; Fetch full file content from GitHub API (only when version mismatch confirmed)
    remoteContent := FetchRemoteContent(target.remote)
    if remoteContent = "" {
        LastStatus[target.local] := "Error: failed to fetch full file"
        UpdateGuiRow(rowIndex, localVersion, remoteVersion, "✗ fetch err")
        return
    }

    ; File needs updating
    updated := UpdateFile(target, remoteContent, localVersion, remoteVersion)
    if updated {
        ; Write the new version to the local version file
        WriteLocalVersionFile(target.versionFile, remoteVersion)
        LastStatus[target.local] := localVersion " → " remoteVersion " — updated"
        UpdateGuiRow(rowIndex, remoteVersion, remoteVersion, "↑ updated")
        TrayTip("Updated: " target.local, "AutoUpdate: " localVersion " → " remoteVersion, "Mute")
    } else {
        LastStatus[target.local] := "Error: update failed"
        UpdateGuiRow(rowIndex, localVersion, remoteVersion, "✗ failed")
    }
}

ReadLocalVersionFile(versionFilePath) {
    ; Read version from local version file (pipe-delimited: |v01.00a|)
    ; versionFilePath is relative to GitHub Pages root (e.g. "ahk-versions/autoupdateahk.version.txt")
    ; Stored locally in A_ScriptDir\ahk-versions\ for comparison
    localPath := A_ScriptDir "\" StrReplace(versionFilePath, "/", "\")
    if !FileExist(localPath)
        return "—"
    try {
        content := Trim(FileRead(localPath), " `t`r`n")
        return StrReplace(content, "|", "")
    }
    return "—"
}

FetchRemoteVersionFile(versionFilePath) {
    global PAGES_BASE
    ; Fetch per-file version from GitHub Pages (CDN, no rate limit, works on private repos)
    url := PAGES_BASE versionFilePath "?t=" A_TickCount
    try {
        req := ComObject("WinHttp.WinHttpRequest.5.1")
        req.Open("GET", url, false)
        req.SetRequestHeader("User-Agent", "AHK-AutoUpdate/" VERSION)
        req.Send()
        if req.Status = 200 {
            content := Trim(req.ResponseText, " `t`r`n")
            return StrReplace(content, "|", "")
        }
        return ""
    } catch {
        return ""
    }
}

WriteLocalVersionFile(versionFilePath, version) {
    ; Write version to local version file with pipe delimiters
    localPath := A_ScriptDir "\" StrReplace(versionFilePath, "/", "\")
    ; Ensure the directory exists
    SplitPath(localPath, , &dir)
    if !DirExist(dir)
        DirCreate(dir)
    WriteLocalFile(localPath, "|" version "|")
}

WriteLocalFile(path, content) {
    try {
        f := FileOpen(path, "w", "UTF-8")
        f.Write(content)
        f.Close()
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
        f := FileOpen(localPath, "w", "UTF-8")
        f.Write(newContent)
        f.Close()
    } catch as err {
        TrayTip("Update failed", "AutoUpdate: Could not write to " target.local "`n" err.Message, "Mute")
        return false
    }

    if target.isSelf {
        SelfUpdatePending := true
    } else {
        if WinExist(target.local) {
            try {
                Run(localPath)
            }
        }
    }

    return true
}

UriEncode(str) {
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

; Developed by: ShadowAISolutions
