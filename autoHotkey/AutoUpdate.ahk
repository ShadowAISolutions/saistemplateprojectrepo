#Requires AutoHotkey v2.0
#SingleInstance Force

VERSION := "v01.01a"

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

; === Start Timers ===
SetTimer(CheckForUpdates, -3000)        ; One-shot: check 3 seconds after launch
SetTimer(CheckForUpdates, POLL_INTERVAL) ; Recurring check
SetTimer(UpdateCountdown, 1000)          ; Countdown ticks every 1 second

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
    ; Reset the recurring timer so next auto-check is a full interval from now
    SetTimer(CheckForUpdates, POLL_INTERVAL)
}

UpdateCountdown() {
    global CountdownSeconds, CountdownLabel, IsChecking
    if IsChecking {
        CountdownLabel.Text := "Checking now..."
        return
    }
    if CountdownSeconds > 0
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
    global LastCheckLabel, IsChecking
    IsChecking := true
    LastCheckTime := FormatTime(, "yyyy-MM-dd hh:mm:ss tt")
    LastCheckLabel.Text := "Last check: " LastCheckTime
    selfTarget := ""
    selfIndex := 0
    idx := 0

    for target in TARGETS {
        idx++
        if target.isSelf {
            selfTarget := target
            selfIndex := idx
            continue
        }
        CheckOneFile(target, idx)
    }

    ; Self-update is always last (Reload terminates execution)
    if selfTarget != "" {
        CheckOneFile(selfTarget, selfIndex)
        if SelfUpdatePending {
            Reload()
        }
    }

    IsChecking := false
    CountdownSeconds := POLL_INTERVAL // 1000
}

CheckOneFile(target, rowIndex) {
    global LastStatus, SelfUpdatePending

    UpdateGuiRow(rowIndex, "...", "...", "checking")

    ; Fetch remote file content from GitHub
    remoteContent := FetchRemoteContent(target.remote)
    if remoteContent = "" {
        LastStatus[target.local] := "Error: failed to fetch remote"
        UpdateGuiRow(rowIndex, "?", "?", "✗ fetch err")
        return "error"
    }

    ; Extract remote version
    remoteVersion := ExtractVersion(remoteContent)
    if remoteVersion = "" {
        LastStatus[target.local] := "Error: no VERSION found in remote"
        UpdateGuiRow(rowIndex, "?", "—", "✗ no ver")
        return "error"
    }

    ; Read local file and extract version
    localPath := A_ScriptDir "\" target.local
    if !FileExist(localPath) {
        LastStatus[target.local] := "Error: local file not found"
        UpdateGuiRow(rowIndex, "—", remoteVersion, "✗ missing")
        return "error"
    }

    try {
        localContent := FileRead(localPath)
    } catch {
        LastStatus[target.local] := "Error: could not read local file"
        UpdateGuiRow(rowIndex, "?", remoteVersion, "✗ read err")
        return "error"
    }

    localVersion := ExtractVersion(localContent)
    if localVersion = "" {
        LastStatus[target.local] := "Warning: no VERSION in local file"
        UpdateGuiRow(rowIndex, "—", remoteVersion, "✗ no ver")
        return "no-version"
    }

    ; Compare versions
    if localVersion = remoteVersion {
        LastStatus[target.local] := localVersion " — up to date"
        UpdateGuiRow(rowIndex, localVersion, remoteVersion, "✓ current")
        return "current"
    }

    ; Update needed
    updated := UpdateFile(target, remoteContent, localVersion, remoteVersion)
    if updated {
        LastStatus[target.local] := localVersion " → " remoteVersion " — updated"
        UpdateGuiRow(rowIndex, remoteVersion, remoteVersion, "↑ updated")
        TrayTip("Updated: " target.local, "AutoUpdate: " localVersion " → " remoteVersion, "Mute")
        return "updated"
    } else {
        LastStatus[target.local] := "Error: update failed"
        UpdateGuiRow(rowIndex, localVersion, remoteVersion, "✗ failed")
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
