#Requires AutoHotkey v2.0
#SingleInstance Force

LogFile := A_ScriptDir "\inventory.txt"
HistoryFile := A_ScriptDir "\history.txt"
UsersFile := A_ScriptDir "\users.txt"
LastModified := 0
LastHistoryModified := 0
CurrentMode := "add"  ; add, subtract, new, signin, adduser
CurrentUser := ""
CurrentUserBadge := ""
Inventory := Map()    ; Barcode -> {name, qty, lastUpdated, lastUser, image}
Users := Map()        ; Badge -> {name, image}
ViewMode := "inventory"  ; inventory or history
UserImagePath := ""   ; Current user's image path
InputResult := ""
InputResult2 := ""
InputCancelled := false

; Button enabled state tracking
SignInEnabled := false
NewEnabled := false
AddEnabled := false
SubtractEnabled := false

; === GUI Setup ===
MyGui := Gui("+Resize", "Inventory Manager")
MyGui.SetFont("s10", "Consolas")
MyGui.BackColor := "F0F0F0"

; User section (row 1)
MyGui.AddText("Section", "User:")
BtnSignIn := MyGui.AddText("ys w100 h25 +Border +Center +0x200", "Sign In")
BtnAddUser := MyGui.AddText("ys w100 h25 +Border +Center +0x200", "Add New User")
UserDisplay := MyGui.AddText("ys w200 h25 +Border +Center +0x200", "No user signed in")
UserDisplay.SetFont("s10 bold")

; User image (absolute position)
UserImage := MyGui.AddPicture("x510 y10 w80 h80 +Border", "")

; Item image display (absolute position, top right)
MyGui.AddText("x650 y10", "Selected Item:")
ItemImage := MyGui.AddPicture("x650 y30 w100 h100 +Border", "")

BtnSignIn.OnEvent("Click", (*) => TrySetMode("signin"))
BtnAddUser.OnEvent("Click", (*) => SetMode("adduser"))

; User edit section (row 2)
MyGui.AddText("x10 y45 Section", "User Edit:")
BtnLogOff := MyGui.AddButton("ys w100", "Log Off")
BtnEditUser := MyGui.AddButton("ys w100", "Edit User")

BtnLogOff.OnEvent("Click", (*) => LogOff())
BtnEditUser.OnEvent("Click", (*) => EditCurrentUser())

; Mode buttons (scan modes) (row 3)
MyGui.AddText("xs Section", "Scan Mode:")
BtnNew := MyGui.AddText("ys w120 h25 +Border +Center +0x200", "Add New Item")
BtnAdd := MyGui.AddText("ys w120 h25 +Border +Center +0x200", "Add to Stock")
BtnSubtract := MyGui.AddText("ys w120 h25 +Border +Center +0x200", "Subtract Stock")

BtnNew.OnEvent("Click", (*) => TrySetMode("new"))
BtnAdd.OnEvent("Click", (*) => TrySetMode("add"))
BtnSubtract.OnEvent("Click", (*) => TrySetMode("subtract"))

; Direct edit buttons (row 4)
MyGui.AddText("xs Section", "Item Edit:")
BtnEditItem := MyGui.AddButton("ys w120", "Edit Item")

BtnEditItem.OnEvent("Click", (*) => EditSelectedItem())

; Current mode display
ModeDisplay := MyGui.AddText("xs w700 h25 +Border +Center +0x200", "Current Mode: ADD NEW ITEM")
ModeDisplay.SetFont("s12 bold")

; View toggle buttons
MyGui.AddText("xs Section", "View:")
BtnViewInventory := MyGui.AddButton("ys w150", "Show Inventory")
BtnViewHistory := MyGui.AddButton("ys w150", "Show History")
BtnViewUsers := MyGui.AddButton("ys w150", "Show Users")

BtnViewInventory.OnEvent("Click", (*) => SetView("inventory"))
BtnViewHistory.OnEvent("Click", (*) => SetView("history"))
BtnViewUsers.OnEvent("Click", (*) => SetView("users"))

; ListView for Inventory
LV := MyGui.AddListView("xs r12 w800", ["Barcode", "Item Name", "Quantity", "Last Updated", "Last User"])
LV.ModifyCol(1, 130)
LV.ModifyCol(2, 180)
LV.ModifyCol(3, 70)
LV.ModifyCol(4, 180)
LV.ModifyCol(5, 180)
LV.OnEvent("ItemSelect", OnItemSelect)
LV.GetPos(&LVX, &LVY, &LVW, &LVH)

; ListView for History (hidden initially) - same position as LV
LVHistory := MyGui.AddListView("x" LVX " y" LVY " r12 w800 Hidden", ["Timestamp", "User", "Action", "Barcode", "Item Name", "Qty Change", "New Qty"])
LVHistory.ModifyCol(1, 150)
LVHistory.ModifyCol(2, 100)
LVHistory.ModifyCol(3, 60)
LVHistory.ModifyCol(4, 120)
LVHistory.ModifyCol(5, 150)
LVHistory.ModifyCol(6, 100)
LVHistory.ModifyCol(7, 80)

; ListView for Users (hidden initially) - same position as LV
LVUsers := MyGui.AddListView("x" LVX " y" LVY " r12 w800 Hidden", ["Badge ID", "Name"])
LVUsers.ModifyCol(1, 300)
LVUsers.ModifyCol(2, 480)

; Status bar - position below the ListViews
StatusBarY := LVY + LVH + 5
StatusBar := MyGui.AddText("x" LVX " y" StatusBarY " w800", "")

MyGui.OnEvent("Close", (*) => ExitApp())
MyGui.OnEvent("Size", GuiResize)

MyGui.Show()

; === Scanner Setup ===
ih := InputHook("V T5 L50")
ih.KeyOpt("{Tab}", "E")
ih.KeyOpt("{Enter}", "E")
ih.OnEnd := ProcessScan
ih.Start()

; === Refresh Timer ===
SetTimer(RefreshData, 500)
LoadUsers()
LoadInventory()
LoadHistory()
UpdateUserButtons()
UpdateListView()

; Set initial mode based on users
if (Users.Count = 0)
    SetMode("adduser")
else
    SetMode("signin")

SetView("inventory")

; === Functions ===

TrySetMode(mode) {
    global SignInEnabled, NewEnabled, AddEnabled, SubtractEnabled
    
    switch mode {
        case "signin":
            if (!SignInEnabled)
                return
        case "new":
            if (!NewEnabled)
                return
        case "add":
            if (!AddEnabled)
                return
        case "subtract":
            if (!SubtractEnabled)
                return
    }
    
    SetMode(mode)
}

OnItemSelect(LV, Item, Selected) {
    global Inventory, ItemImage
    
    ; Get the currently selected item (not just focused)
    SelectedRow := LV.GetNext(0)
    
    if (SelectedRow = 0) {
        try {
            ItemImage.Value := ""
        }
        return
    }
    
    Barcode := LV.GetText(SelectedRow, 1)
    
    if (Inventory.Has(Barcode) && Inventory[Barcode].image != "") {
        try {
            FullPath := GetFullImagePath(Inventory[Barcode].image)
            ItemImage.Value := "*w100 *h100 " FullPath
        } catch {
            ItemImage.Value := ""
        }
    } else {
        try {
            ItemImage.Value := ""
        }
    }
}

CustomInputBox(prompt, title, defaultValue := "") {
    global MyGui, InputResult, InputCancelled
    
    InputResult := ""
    InputCancelled := false
    
    InputGui := Gui("+Owner" MyGui.Hwnd " +AlwaysOnTop", title)
    InputGui.SetFont("s10", "Consolas")
    InputGui.AddText("w280", prompt)
    EditBox := InputGui.AddEdit("w280 vUserInput", defaultValue)
    InputGui.AddButton("w135", "OK").OnEvent("Click", (*) => SubmitInput(InputGui, EditBox))
    InputGui.AddButton("x+10 w135", "Cancel").OnEvent("Click", (*) => CancelInput(InputGui))
    InputGui.OnEvent("Close", (*) => CancelInput(InputGui))
    InputGui.OnEvent("Escape", (*) => CancelInput(InputGui))
    
    EditBox.Focus()
    InputGui.Show()
    
    WinWaitClose(InputGui.Hwnd)
    
    return {Value: InputResult, Cancelled: InputCancelled}
}

CustomUserInputBox(title, defaultName := "", defaultImage := "") {
    global MyGui, InputResult, InputResult2, InputCancelled
    
    InputResult := ""
    InputResult2 := ""
    InputCancelled := false
    SelectedImage := defaultImage
    
    InputGui := Gui("+Owner" MyGui.Hwnd " +AlwaysOnTop", title)
    InputGui.SetFont("s10", "Consolas")
    
    InputGui.AddText("w280", "User Name:")
    EditName := InputGui.AddEdit("w280 vUserName", defaultName)
    
    InputGui.AddText("w280", "User Photo (optional):")
    ImagePathDisplay := InputGui.AddEdit("w130 vImagePath ReadOnly", defaultImage)
    BtnBrowse := InputGui.AddButton("x+10 w70", "Browse...")
    BtnCamera := InputGui.AddButton("x+5 w70", "📷 Camera")
    
    ; Image preview
    InputGui.AddText("xs w280", "Preview:")
    ImagePreview := InputGui.AddPicture("xs w100 h100 +Border", "")
    if (defaultImage != "") {
        try {
            FullPath := GetFullImagePath(defaultImage)
            ImagePreview.Value := "*w100 *h100 " FullPath
        }
    }
    
    BtnBrowse.OnEvent("Click", (*) => BrowseForImage(ImagePathDisplay, ImagePreview, &SelectedImage, "user"))
    BtnCamera.OnEvent("Click", (*) => CaptureFromCamera(ImagePathDisplay, ImagePreview, &SelectedImage, "user"))
    
    InputGui.AddButton("xs w135", "OK").OnEvent("Click", (*) => SubmitUserInput(InputGui, EditName, &SelectedImage))
    InputGui.AddButton("x+10 w135", "Cancel").OnEvent("Click", (*) => CancelInput(InputGui))
    InputGui.OnEvent("Close", (*) => CancelInput(InputGui))
    InputGui.OnEvent("Escape", (*) => CancelInput(InputGui))
    
    EditName.Focus()
    InputGui.Show()
    
    WinWaitClose(InputGui.Hwnd)
    
    return {Name: InputResult, Image: InputResult2, Cancelled: InputCancelled}
}

BrowseForImage(pathDisplay, preview, &selectedImage, imageType := "item") {
    ImageFile := FileSelect(1, , "Select Photo", "Image Files (*.png; *.jpg; *.jpeg; *.bmp; *.gif)")
    if (ImageFile != "") {
        ; Determine target folder based on type
        if (imageType = "user") {
            TargetFolder := A_ScriptDir "\user_images"
            RelativeFolder := "user_images"
        } else {
            TargetFolder := A_ScriptDir "\item_images"
            RelativeFolder := "item_images"
        }
        
        ; Create folder if it doesn't exist
        if !DirExist(TargetFolder)
            DirCreate(TargetFolder)
        
        ; Get just the filename
        SplitPath(ImageFile, &FileName)
        
        ; Generate unique filename to avoid overwriting
        TargetPath := TargetFolder "\" FileName
        RelativePath := RelativeFolder "\" FileName
        if FileExist(TargetPath) {
            ; Add timestamp to make unique
            SplitPath(ImageFile, , , &Ext, &NameNoExt)
            FileName := NameNoExt "_" A_Now "." Ext
            TargetPath := TargetFolder "\" FileName
            RelativePath := RelativeFolder "\" FileName
        }
        
        ; Copy the file
        try {
            FileCopy(ImageFile, TargetPath, 0)
            selectedImage := RelativePath  ; Store relative path
            pathDisplay.Value := RelativePath
            preview.Value := "*w100 *h100 " TargetPath  ; Use full path for display
        } catch as err {
            MsgBox("Error copying image: " err.Message)
        }
    }
}

; Helper function to convert relative path to absolute
GetFullImagePath(imagePath) {
    if (imagePath = "")
        return ""
    ; If it's already an absolute path (contains : like C:\), return as is
    if (InStr(imagePath, ":"))
        return imagePath
    ; Otherwise, prepend script directory
    return A_ScriptDir "\" imagePath
}

; ============================================================================
; CAMERA CAPTURE FUNCTION - PLACEHOLDER
; ============================================================================
; This function should capture an image from the computer's camera/webcam.
;
; FUTURE IMPLEMENTATION NOTES:
; 1. Use DirectShow or Media Foundation to access the webcam
;    - Could use FFmpeg command line: ffmpeg -f dshow -i video="Camera Name" -frames:v 1 output.jpg
;    - Or use a COM object to interface with Windows Camera
;    - Or use PowerShell with Windows.Media.Capture
;
; 2. Display a preview window showing the live camera feed
;    - Create a new GUI window for camera preview
;    - Show live feed from webcam
;    - Add a "Capture" button to take the photo
;    - Add a "Cancel" button to close without capturing
;
; 3. When user clicks capture:
;    - Save the frame as a JPG/PNG image
;    - Save to appropriate folder (user_images or item_images based on imageType)
;    - Use timestamp for unique filename: capture_YYYYMMDDHHMMSS.jpg
;    - Store as relative path
;
; 4. Update the preview and path display in the parent dialog
;
; 5. Possible libraries/tools to consider:
;    - FFmpeg (command line, widely available)
;    - OpenCV (if willing to add dependencies)
;    - Windows Runtime APIs via PowerShell
;    - AHK WebView2 with getUserMedia JavaScript API
;    - Third-party AHK webcam libraries
;
; 6. Error handling needed for:
;    - No camera available
;    - Camera in use by another application
;    - Permission denied
;    - Failed to save image
; ============================================================================
CaptureFromCamera(pathDisplay, preview, &selectedImage, imageType := "item") {
    ; PLACEHOLDER - Show GUI message that feature is not yet implemented
    CameraMsg := Gui("+AlwaysOnTop", "Camera - Not Yet Implemented")
    CameraMsg.SetFont("s10", "Consolas")
    CameraMsg.AddText("w300", "📷 Camera capture feature coming soon!")
    CameraMsg.AddText("w300", "")
    CameraMsg.AddText("w300", "This will allow you to take a photo")
    CameraMsg.AddText("w300", "directly from your webcam.")
    CameraMsg.AddButton("w300", "OK").OnEvent("Click", (*) => CameraMsg.Destroy())
    CameraMsg.OnEvent("Close", (*) => CameraMsg.Destroy())
    CameraMsg.OnEvent("Escape", (*) => CameraMsg.Destroy())
    CameraMsg.Show()
    
    ; TODO: Implement camera capture functionality
    ; When implemented, this function should:
    ; 1. Open camera preview window
    ; 2. Let user capture image
    ; 3. Save image to appropriate folder (user_images or item_images)
    ; 4. Update selectedImage with relative path
    ; 5. Update pathDisplay.Value with the relative path
    ; 6. Update preview.Value with "*w100 *h100 " FullPath
}

SubmitUserInput(guiObj, editName, &selectedImage) {
    global InputResult, InputResult2, InputCancelled
    InputResult := editName.Value
    InputResult2 := selectedImage
    InputCancelled := false
    guiObj.Destroy()
}

CustomItemInputBox(title, defaultName := "", defaultQty := "1", defaultImage := "") {
    global MyGui, InputResult, InputResult2, InputCancelled
    
    InputResult := ""
    InputResult2 := ""
    InputCancelled := false
    SelectedImage := defaultImage
    
    InputGui := Gui("+Owner" MyGui.Hwnd " +AlwaysOnTop", title)
    InputGui.SetFont("s10", "Consolas")
    
    InputGui.AddText("w280", "Item Name:")
    EditName := InputGui.AddEdit("w280 vItemName", defaultName)
    
    InputGui.AddText("w280", "Quantity:")
    EditQty := InputGui.AddEdit("w280 vItemQty Number", defaultQty)
    
    InputGui.AddText("w280", "Item Photo (optional):")
    ImagePathDisplay := InputGui.AddEdit("w130 vImagePath ReadOnly", defaultImage)
    BtnBrowse := InputGui.AddButton("x+10 w70", "Browse...")
    BtnCamera := InputGui.AddButton("x+5 w70", "📷 Camera")
    
    ; Image preview
    InputGui.AddText("xs w280", "Preview:")
    ImagePreview := InputGui.AddPicture("xs w100 h100 +Border", "")
    if (defaultImage != "") {
        try {
            FullPath := GetFullImagePath(defaultImage)
            ImagePreview.Value := "*w100 *h100 " FullPath
        }
    }
    
    BtnBrowse.OnEvent("Click", (*) => BrowseForImage(ImagePathDisplay, ImagePreview, &SelectedImage, "item"))
    BtnCamera.OnEvent("Click", (*) => CaptureFromCamera(ImagePathDisplay, ImagePreview, &SelectedImage, "item"))
    
    InputGui.AddButton("xs w135", "OK").OnEvent("Click", (*) => SubmitItemInputWithImage(InputGui, EditName, EditQty, &SelectedImage))
    InputGui.AddButton("x+10 w135", "Cancel").OnEvent("Click", (*) => CancelInput(InputGui))
    InputGui.OnEvent("Close", (*) => CancelInput(InputGui))
    InputGui.OnEvent("Escape", (*) => CancelInput(InputGui))
    
    EditName.Focus()
    InputGui.Show()
    
    WinWaitClose(InputGui.Hwnd)
    
    return {Name: InputResult, Qty: InputResult2, Image: SelectedImage, Cancelled: InputCancelled}
}

SubmitItemInputWithImage(guiObj, editName, editQty, &selectedImage) {
    global InputResult, InputResult2, InputCancelled
    InputResult := editName.Value
    InputResult2 := editQty.Value
    InputCancelled := false
    guiObj.Destroy()
}

SubmitInput(guiObj, editBox) {
    global InputResult, InputCancelled
    InputResult := editBox.Value
    InputCancelled := false
    guiObj.Destroy()
}

SubmitItemInput(guiObj, editName, editQty) {
    global InputResult, InputResult2, InputCancelled
    InputResult := editName.Value
    InputResult2 := editQty.Value
    InputCancelled := false
    guiObj.Destroy()
}

CancelInput(guiObj) {
    global InputResult, InputResult2, InputCancelled
    InputResult := ""
    InputResult2 := ""
    InputCancelled := true
    guiObj.Destroy()
}

EditCurrentUser() {
    global CurrentUser, CurrentUserBadge, Users, Inventory, StatusBar, HistoryFile, UserImage
    
    if (CurrentUser = "") {
        SoundBeep(300, 300)
        StatusBar.Value := "ERROR: No user signed in to edit"
        return
    }
    
    OldName := CurrentUser
    OldImage := Users[CurrentUserBadge].image
    
    UserInput := CustomUserInputBox("Edit User - " OldName, OldName, OldImage)
    if (UserInput.Cancelled || UserInput.Name = "") {
        StatusBar.Value := "User edit cancelled"
        return
    }
    
    NewName := UserInput.Name
    NewImage := UserInput.Image
    
    if (NewName = OldName && NewImage = OldImage) {
        StatusBar.Value := "No changes made to user"
        return
    }
    
    NameChanged := NewName != OldName
    ImageChanged := NewImage != OldImage
    
    Users[CurrentUserBadge].name := NewName
    Users[CurrentUserBadge].image := NewImage
    CurrentUser := NewName
    
    ; Update user image display
    if (NewImage != "") {
        try {
            FullPath := GetFullImagePath(NewImage)
            UserImage.Value := "*w80 *h80 " FullPath
        }
    } else {
        try {
            UserImage.Value := ""
        }
    }
    
    ; Update inventory records if name changed
    if (NameChanged) {
        for Barcode, Data in Inventory {
            if (Data.lastUser = OldName) {
                Data.lastUser := NewName
            }
        }
        
        ; Update history file if name changed
        if FileExist(HistoryFile) {
            NewHistoryContent := ""
            Loop Read HistoryFile {
                Line := A_LoopReadLine
                if (Line = "")
                    continue
                
                Parts := StrSplit(Line, "`t")
                if (Parts.Length >= 7) {
                    if (Parts[2] = OldName)
                        Parts[2] := NewName
                    
                    NewHistoryContent .= Parts[1] "`t" Parts[2] "`t" Parts[3] "`t" Parts[4] "`t" Parts[5] "`t" Parts[6] "`t" Parts[7] "`n"
                }
            }
            
            FileDelete(HistoryFile)
            if (NewHistoryContent != "")
                FileAppend(NewHistoryContent, HistoryFile)
        }
        
        SaveInventory()
    }
    
    SaveUsers()
    LoadUsers()
    LoadHistory()
    UpdateUserButtons()
    UpdateListView()
    
    SoundBeep(1500, 100)
    SoundBeep(1500, 100)
    
    ; Build status message
    Changes := []
    if (NameChanged)
        Changes.Push("name: " OldName " -> " NewName)
    if (ImageChanged)
        Changes.Push("image updated")
    
    StatusBar.Value := "Edited user: " StrJoin(Changes, ", ")
}

EditSelectedItem() {
    global LV, Inventory, CurrentUser, StatusBar, HistoryFile, ViewMode, ItemImage
    
    if (CurrentUser = "") {
        SoundBeep(300, 300)
        StatusBar.Value := "ERROR: Please sign in first!"
        return
    }
    
    if (ViewMode != "inventory") {
        SoundBeep(300, 300)
        StatusBar.Value := "ERROR: Switch to Inventory view to edit item"
        return
    }
    
    SelectedRow := LV.GetNext(0, "Focused")
    if (SelectedRow = 0) {
        SoundBeep(300, 300)
        StatusBar.Value := "ERROR: Please select an item first"
        return
    }
    
    Barcode := LV.GetText(SelectedRow, 1)
    
    if !Inventory.Has(Barcode) {
        SoundBeep(300, 300)
        StatusBar.Value := "ERROR: Item not found in inventory"
        return
    }
    
    OldQty := Inventory[Barcode].qty
    OldName := Inventory[Barcode].name
    OldImage := Inventory[Barcode].image
    Timestamp := FormatTime(, "yyyy-MM-dd HH:mm:ss")
    
    ItemInput := CustomItemInputBox("Edit Item - " Barcode, OldName, String(OldQty), OldImage)
    if (ItemInput.Cancelled || ItemInput.Name = "") {
        StatusBar.Value := "Edit cancelled"
        return
    }
    
    if !IsInteger(ItemInput.Qty) {
        SoundBeep(300, 300)
        StatusBar.Value := "ERROR: Please enter a valid number for quantity"
        return
    }
    
    NewQty := Integer(ItemInput.Qty)
    NewName := ItemInput.Name
    NewImage := ItemInput.Image
    
    if (NewQty < 0) {
        SoundBeep(300, 300)
        StatusBar.Value := "ERROR: Quantity cannot be negative"
        return
    }
    
    if (NewQty = OldQty && NewName = OldName && NewImage = OldImage) {
        StatusBar.Value := "No changes made to " OldName
        return
    }
    
    NameChanged := NewName != OldName
    QtyChanged := NewQty != OldQty
    ImageChanged := NewImage != OldImage
    QtyChange := NewQty - OldQty
    
    Inventory[Barcode].name := NewName
    Inventory[Barcode].qty := NewQty
    Inventory[Barcode].lastUpdated := Timestamp
    Inventory[Barcode].lastUser := CurrentUser
    Inventory[Barcode].image := NewImage
    
    ; Update item image display
    if (NewImage != "") {
        try {
            FullPath := GetFullImagePath(NewImage)
            ItemImage.Value := "*w100 *h100 " FullPath
        }
    } else {
        try {
            ItemImage.Value := ""
        }
    }
    
    ; Update history if name changed
    if (NameChanged && FileExist(HistoryFile)) {
        NewHistoryContent := ""
        Loop Read HistoryFile {
            Line := A_LoopReadLine
            if (Line = "")
                continue
            
            Parts := StrSplit(Line, "`t")
            if (Parts.Length >= 7) {
                if (Parts[4] = Barcode && Parts[5] = OldName)
                    Parts[5] := NewName
                
                NewHistoryContent .= Parts[1] "`t" Parts[2] "`t" Parts[3] "`t" Parts[4] "`t" Parts[5] "`t" Parts[6] "`t" Parts[7] "`n"
            }
        }
        
        FileDelete(HistoryFile)
        if (NewHistoryContent != "")
            FileAppend(NewHistoryContent, HistoryFile)
    }
    
    SoundBeep(1000, 100)
    SaveInventory()
    
    ; Log to history
    Action := "EDIT"
    HistoryLine := Timestamp "`t" CurrentUser "`t" Action "`t" Barcode "`t" NewName "`t" QtyChange "`t" NewQty "`n"
    FileAppend(HistoryLine, HistoryFile)
    LoadHistory()
    UpdateListView()
    
    ; Build status message
    Changes := []
    if (NameChanged)
        Changes.Push("name: " OldName " -> " NewName)
    if (QtyChanged)
        Changes.Push("qty: " OldQty " -> " NewQty)
    if (ImageChanged)
        Changes.Push("image updated")
    
    StatusBar.Value := "Edited " NewName ": " StrJoin(Changes, ", ") " by " CurrentUser
}

StrJoin(arr, delimiter) {
    result := ""
    for index, value in arr {
        if (index > 1)
            result .= delimiter
        result .= value
    }
    return result
}

SetView(view) {
    global ViewMode, LV, LVHistory, LVUsers, BtnViewInventory, BtnViewHistory, BtnViewUsers
    ViewMode := view
    
    LV.Visible := false
    LVHistory.Visible := false
    LVUsers.Visible := false
    BtnViewInventory.Enabled := true
    BtnViewHistory.Enabled := true
    BtnViewUsers.Enabled := true
    
    switch view {
        case "inventory":
            LV.Visible := true
            BtnViewInventory.Enabled := false
        case "history":
            LVHistory.Visible := true
            BtnViewHistory.Enabled := false
        case "users":
            LVUsers.Visible := true
            BtnViewUsers.Enabled := false
    }
    UpdateListView()
}

UpdateUserButtons() {
    global BtnSignIn, BtnLogOff, BtnEditUser, BtnAddUser, CurrentUser, UserDisplay, Users
    global BtnNew, BtnAdd, BtnSubtract, BtnEditItem, CurrentMode, Inventory
    global SignInEnabled, NewEnabled, AddEnabled, SubtractEnabled
    global UserImage, CurrentUserBadge, ItemImage
    
    DisabledBg := "CCCCCC"
    DisabledFg := "888888"
    DefaultBg := "E0E0E0"
    DefaultFg := "000000"
    
    if (CurrentUser = "") {
        ; Sign In enabled only if there are users to sign in with
        SignInEnabled := (Users.Count > 0)
        if (SignInEnabled) {
            BtnSignIn.Opt("Background" DefaultBg " c" DefaultFg)
        } else {
            BtnSignIn.Opt("Background" DisabledBg " c" DisabledFg)
        }
        
        BtnLogOff.Enabled := false
        BtnEditUser.Enabled := false
        
        ; Show different message based on whether users exist
        if (Users.Count = 0) {
            UserDisplay.Value := "Create Initial Username"
        } else {
            UserDisplay.Value := "No user signed in"
        }
        UserDisplay.Opt("BackgroundCCCCCC")
        
        ; Clear user image
        try {
            UserImage.Value := ""
        }
        
        ; Disable inventory buttons when not signed in
        NewEnabled := false
        AddEnabled := false
        SubtractEnabled := false
        BtnNew.Opt("Background" DisabledBg " c" DisabledFg)
        BtnAdd.Opt("Background" DisabledBg " c" DisabledFg)
        BtnSubtract.Opt("Background" DisabledBg " c" DisabledFg)
        BtnEditItem.Enabled := false
    } else {
        ; User is signed in - disable sign in button
        SignInEnabled := false
        BtnSignIn.Opt("Background" DisabledBg " c" DisabledFg)
        
        BtnLogOff.Enabled := true
        BtnEditUser.Enabled := true
        UserDisplay.Value := CurrentUser
        UserDisplay.Opt("Background00CC66")
        
        ; Show user image if available
        if (CurrentUserBadge != "" && Users.Has(CurrentUserBadge)) {
            UserData := Users[CurrentUserBadge]
            if (UserData.image != "") {
                try {
                    FullPath := GetFullImagePath(UserData.image)
                    UserImage.Value := "*w80 *h80 " FullPath
                }
            } else {
                try {
                    UserImage.Value := ""
                }
            }
        }
        
        ; Enable inventory buttons when signed in
        NewEnabled := true
        AddEnabled := true
        SubtractEnabled := true
        
        ; Edit Item only enabled if there are items to edit
        BtnEditItem.Enabled := (Inventory.Count > 0)
        
        ; Refresh mode to restore proper colors
        SetMode(CurrentMode)
    }
}

LogOff() {
    global CurrentUser, CurrentUserBadge, StatusBar, ItemImage
    PrevUser := CurrentUser
    CurrentUser := ""
    CurrentUserBadge := ""
    
    ; Clear item image when logging off
    try {
        ItemImage.Value := ""
    }
    
    UpdateUserButtons()
    SetMode("signin")
    StatusBar.Value := "User " PrevUser " logged off - please sign in"
}

SetMode(mode) {
    global CurrentMode, ModeDisplay, BtnNew, BtnAdd, BtnSubtract, BtnSignIn, BtnAddUser, CurrentUser, Users
    global SignInEnabled, NewEnabled, AddEnabled, SubtractEnabled
    CurrentMode := mode
    
    ; Default colors (inactive state)
    DefaultBg := "E0E0E0"
    DefaultFg := "000000"
    DisabledBg := "CCCCCC"
    DisabledFg := "888888"
    ActiveBg := "66CCFF"
    
    ; Only update Sign In button if NO user is signed in
    ; This prevents visual changes when user is already signed in
    if (CurrentUser = "") {
        SignInEnabled := (Users.Count > 0)
        if (SignInEnabled)
            BtnSignIn.Opt("Background" DefaultBg " c" DefaultFg)
        else
            BtnSignIn.Opt("Background" DisabledBg " c" DisabledFg)
        BtnSignIn.Text := "Sign In"
    }
    ; If user IS signed in, don't touch Sign In button at all - it stays disabled
    
    ; Add User is always enabled
    BtnAddUser.Opt("Background" DefaultBg " c" DefaultFg)
    
    ; Inventory buttons - only enabled if user is signed in
    if (CurrentUser != "") {
        NewEnabled := true
        AddEnabled := true
        SubtractEnabled := true
        BtnNew.Opt("Background" DefaultBg " c" DefaultFg)
        BtnAdd.Opt("Background" DefaultBg " c" DefaultFg)
        BtnSubtract.Opt("Background" DefaultBg " c" DefaultFg)
    } else {
        NewEnabled := false
        AddEnabled := false
        SubtractEnabled := false
        BtnNew.Opt("Background" DisabledBg " c" DisabledFg)
        BtnAdd.Opt("Background" DisabledBg " c" DisabledFg)
        BtnSubtract.Opt("Background" DisabledBg " c" DisabledFg)
    }
    
    ; Reset button texts (except Sign In which is handled above)
    BtnAddUser.Text := "Add New User"
    BtnNew.Text := "Add New Item"
    BtnAdd.Text := "Add to Stock"
    BtnSubtract.Text := "Subtract Stock"
    
    switch mode {
        case "signin":
            ModeDisplay.Value := "Current Mode: SCAN BADGE TO SIGN IN"
            ModeDisplay.Opt("BackgroundAA00AA cFFFFFF")
            if (SignInEnabled) {
                BtnSignIn.Opt("Background" ActiveBg " c000000")
                BtnSignIn.Text := "► Sign In"
            }
        case "adduser":
            ModeDisplay.Value := "Current Mode: SCAN BADGE FOR NEW USER"
            ModeDisplay.Opt("BackgroundCC00CC cFFFFFF")
            BtnAddUser.Opt("Background" ActiveBg " c000000")
            BtnAddUser.Text := "► Add New User"
        case "new":
            ModeDisplay.Value := "Current Mode: ADD NEW ITEM"
            ModeDisplay.Opt("Background00AA00 cFFFFFF")
            if (NewEnabled) {
                BtnNew.Opt("Background" ActiveBg " c000000")
                BtnNew.Text := "► Add New Item"
            }
        case "add":
            ModeDisplay.Value := "Current Mode: ADD TO STOCK"
            ModeDisplay.Opt("Background0066CC cFFFFFF")
            if (AddEnabled) {
                BtnAdd.Opt("Background" ActiveBg " c000000")
                BtnAdd.Text := "► Add to Stock"
            }
        case "subtract":
            ModeDisplay.Value := "Current Mode: SUBTRACT STOCK"
            ModeDisplay.Opt("BackgroundCC6600 cFFFFFF")
            if (SubtractEnabled) {
                BtnSubtract.Opt("Background" ActiveBg " c000000")
                BtnSubtract.Text := "► Subtract Stock"
            }
    }
}

GuiResize(thisGui, MinMax, Width, Height) {
    global LV, LVHistory, LVUsers, StatusBar, ModeDisplay
    if MinMax = -1
        return
    
    ; Get current ListView position
    LV.GetPos(&LVX, &LVY)
    
    ; Calculate new dimensions
    NewWidth := Width - LVX - 20
    NewHeight := Height - LVY - 40
    
    ; Apply to all ListViews at the same position
    LV.Move(LVX, LVY, NewWidth, NewHeight)
    LVHistory.Move(LVX, LVY, NewWidth, NewHeight)
    LVUsers.Move(LVX, LVY, NewWidth, NewHeight)
    
    ; Position status bar below
    StatusBar.Move(LVX, LVY + NewHeight + 5, NewWidth)
}

ProcessScan(hook) {
    global LogFile, HistoryFile, CurrentMode, CurrentUser, CurrentUserBadge, Inventory, Users, StatusBar, MyGui
    
    InputLength := StrLen(hook.Input)
    Barcode := hook.Input
    
    if (Barcode != "" && hook.EndReason = "EndKey" && InputLength >= 5) {
        Send("{Backspace " InputLength + 1 "}")
        
        Timestamp := FormatTime(, "yyyy-MM-dd HH:mm:ss")
        Success := false
        Action := ""
        QtyChange := 0
        NewQty := 0
        ItemName := ""
        
        ; Handle add user mode
        if (CurrentMode = "adduser") {
            if Users.Has(Barcode) {
                SoundBeep(300, 300)
                StatusBar.Value := "ERROR: Badge already registered to " Users[Barcode].name
                SetMode("new")
                hook.Start()
                return
            }
            
            UserInput := CustomUserInputBox("New User - Badge: " Barcode)
            if (UserInput.Cancelled || UserInput.Name = "") {
                StatusBar.Value := "User creation cancelled"
                SetMode("new")
                hook.Start()
                return
            }
            
            Users[Barcode] := {name: UserInput.Name, image: UserInput.Image}
            SaveUsers()
            LoadUsers()
            UpdateUserButtons()
            UpdateListView()
            SoundBeep(1500, 100)
            SoundBeep(1500, 100)
            StatusBar.Value := "Added new user: " UserInput.Name " (Badge: " Barcode ")"
            
            if (CurrentUser = "") {
                SetMode("signin")
                StatusBar.Value := "Added new user: " UserInput.Name " - please scan badge to sign in"
            } else {
                SetMode("new")
            }
            
            hook.Start()
            return
        }
        
        ; Handle sign in mode
        if (CurrentMode = "signin") {
            if Users.Has(Barcode) {
                CurrentUserBadge := Barcode
                CurrentUser := Users[Barcode].name
                UpdateUserButtons()
                SoundBeep(1500, 100)
                SoundBeep(1500, 100)
                StatusBar.Value := "Signed in as: " CurrentUser
                SetMode("new")
            } else {
                SoundBeep(300, 300)
                StatusBar.Value := "ERROR: Badge not recognized! Use 'Add New User' first."
            }
            hook.Start()
            return
        }
        
        ; Check if user is signed in
        if (CurrentUser = "") {
            SoundBeep(300, 300)
            StatusBar.Value := "ERROR: Please sign in first!"
            hook.Start()
            return
        }
        
        switch CurrentMode {
            case "new":
                if Inventory.Has(Barcode) {
                    SoundBeep(300, 300)
                    StatusBar.Value := "ERROR: " Barcode " already exists!"
                } else {
                    ; Prompt for item name, quantity, and image
                    ItemInput := CustomItemInputBox("New Item - " Barcode, "", "1", "")
                    if (ItemInput.Cancelled || ItemInput.Name = "") {
                        StatusBar.Value := "Item creation cancelled"
                        hook.Start()
                        return
                    }
                    
                    if !IsInteger(ItemInput.Qty) {
                        SoundBeep(300, 300)
                        StatusBar.Value := "ERROR: Please enter a valid number for quantity"
                        hook.Start()
                        return
                    }
                    
                    NewQty := Integer(ItemInput.Qty)
                    if (NewQty < 0) {
                        SoundBeep(300, 300)
                        StatusBar.Value := "ERROR: Quantity cannot be negative"
                        hook.Start()
                        return
                    }
                    
                    ItemName := ItemInput.Name
                    ItemImagePath := ItemInput.Image
                    Inventory[Barcode] := {name: ItemName, qty: NewQty, lastUpdated: Timestamp, lastUser: CurrentUser, image: ItemImagePath}
                    Success := true
                    Action := "NEW"
                    QtyChange := NewQty
                    StatusBar.Value := "Added new item: " ItemName " (qty: " NewQty ") by " CurrentUser
                }
            case "add":
                if Inventory.Has(Barcode) {
                    Inventory[Barcode].qty += 1
                    Inventory[Barcode].lastUpdated := Timestamp
                    Inventory[Barcode].lastUser := CurrentUser
                    Success := true
                    Action := "ADD"
                    QtyChange := 1
                    NewQty := Inventory[Barcode].qty
                    ItemName := Inventory[Barcode].name
                    StatusBar.Value := "Added stock: " ItemName " (now: " NewQty ") by " CurrentUser
                } else {
                    SoundBeep(300, 300)
                    StatusBar.Value := "ERROR: " Barcode " not found! Use 'Add New Item' first."
                }
            case "subtract":
                if Inventory.Has(Barcode) {
                    if Inventory[Barcode].qty > 0 {
                        Inventory[Barcode].qty -= 1
                        Inventory[Barcode].lastUpdated := Timestamp
                        Inventory[Barcode].lastUser := CurrentUser
                        Success := true
                        Action := "SUB"
                        QtyChange := -1
                        NewQty := Inventory[Barcode].qty
                        ItemName := Inventory[Barcode].name
                        StatusBar.Value := "Subtracted stock: " ItemName " (now: " NewQty ") by " CurrentUser
                    } else {
                        SoundBeep(300, 300)
                        StatusBar.Value := "ERROR: " Inventory[Barcode].name " is already at 0!"
                    }
                } else {
                    SoundBeep(300, 300)
                    StatusBar.Value := "ERROR: " Barcode " not found!"
                }
        }
        
        if Success {
            SoundBeep(1000, 100)
            SaveInventory()
            HistoryLine := Timestamp "`t" CurrentUser "`t" Action "`t" Barcode "`t" ItemName "`t" QtyChange "`t" NewQty "`n"
            FileAppend(HistoryLine, HistoryFile)
            LoadHistory()
            UpdateListView()
        }
    }
    
    hook.Start()
}

LoadUsers() {
    global UsersFile, Users, LVUsers
    
    Users := Map()
    LVUsers.Delete()
    
    if !FileExist(UsersFile)
        return
    
    Loop Read UsersFile {
        Line := A_LoopReadLine
        if (Line = "")
            continue
        
        Parts := StrSplit(Line, "`t")
        if (Parts.Length >= 2) {
            Badge := Parts[1]
            Name := Parts[2]
            Image := (Parts.Length >= 3) ? Parts[3] : ""
            Users[Badge] := {name: Name, image: Image}
            LVUsers.Add(, Badge, Name)
        }
    }
}

SaveUsers() {
    global UsersFile, Users
    
    FileContent := ""
    for Badge, Data in Users {
        FileContent .= Badge "`t" Data.name "`t" Data.image "`n"
    }
    
    if FileExist(UsersFile)
        FileDelete(UsersFile)
    if FileContent != ""
        FileAppend(FileContent, UsersFile)
}

LoadInventory() {
    global LogFile, Inventory
    
    Inventory := Map()
    
    if !FileExist(LogFile)
        return
    
    Loop Read LogFile {
        Line := A_LoopReadLine
        if (Line = "")
            continue
        
        Parts := StrSplit(Line, "`t")
        if (Parts.Length >= 5) {
            Barcode := Parts[1]
            ItemName := Parts[2]
            Qty := Integer(Parts[3])
            LastUpdated := Parts[4]
            LastUser := Parts[5]
            Image := (Parts.Length >= 6) ? Parts[6] : ""
            Inventory[Barcode] := {name: ItemName, qty: Qty, lastUpdated: LastUpdated, lastUser: LastUser, image: Image}
        }
    }
}

LoadHistory() {
    global HistoryFile, LVHistory
    
    LVHistory.Delete()
    
    if !FileExist(HistoryFile)
        return
    
    Lines := []
    Loop Read HistoryFile {
        if (A_LoopReadLine != "")
            Lines.Push(A_LoopReadLine)
    }
    
    Loop Lines.Length {
        Line := Lines[Lines.Length - A_Index + 1]
        Parts := StrSplit(Line, "`t")
        if (Parts.Length >= 7) {
            LVHistory.Add(, Parts[1], Parts[2], Parts[3], Parts[4], Parts[5], Parts[6], Parts[7])
        }
    }
}

SaveInventory() {
    global LogFile, Inventory
    
    FileContent := ""
    for Barcode, Data in Inventory {
        FileContent .= Barcode "`t" Data.name "`t" Data.qty "`t" Data.lastUpdated "`t" Data.lastUser "`t" Data.image "`n"
    }
    
    if FileExist(LogFile)
        FileDelete(LogFile)
    if FileContent != ""
        FileAppend(FileContent, LogFile)
}

UpdateListView() {
    global LV, Inventory, StatusBar, ViewMode, LVHistory, LVUsers, Users, BtnEditItem, CurrentUser
    
    switch ViewMode {
        case "inventory":
            LV.Delete()
            TotalItems := 0
            TotalQty := 0
            
            for Barcode, Data in Inventory {
                LV.Add(, Barcode, Data.name, Data.qty, Data.lastUpdated, Data.lastUser)
                TotalItems++
                TotalQty += Data.qty
            }
            
            StatusBar.Value := "Unique items: " TotalItems " | Total quantity: " TotalQty
            
            ; Update Edit Item button state based on inventory count
            if (CurrentUser != "")
                BtnEditItem.Enabled := (Inventory.Count > 0)
        case "history":
            StatusBar.Value := "Total history entries: " LVHistory.GetCount()
        case "users":
            StatusBar.Value := "Total users: " Users.Count
    }
}

RefreshData() {
    global LogFile, HistoryFile, UsersFile, LastModified, LastHistoryModified
    
    NeedRefresh := false
    
    if !FileExist(LogFile) {
        if (LastModified != 0) {
            LoadInventory()
            NeedRefresh := true
        }
        LastModified := 0
    } else {
        CurrentModified := FileGetTime(LogFile, "M")
        if (CurrentModified != LastModified) {
            LastModified := CurrentModified
            LoadInventory()
            NeedRefresh := true
        }
    }
    
    if !FileExist(HistoryFile) {
        if (LastHistoryModified != 0) {
            LoadHistory()
            NeedRefresh := true
        }
        LastHistoryModified := 0
    } else {
        CurrentHistoryModified := FileGetTime(HistoryFile, "M")
        if (CurrentHistoryModified != LastHistoryModified) {
            LastHistoryModified := CurrentHistoryModified
            LoadHistory()
            NeedRefresh := true
        }
    }
    
    if NeedRefresh
        UpdateListView()
}
