# Inventory Management — AutoHotkey Feature Reference

Comprehensive feature catalog of `autoHotkey/Combined Inventory and Intercept.ahk` (AutoHotkey v2.0).
This document serves as the reference for features to be implemented in the web-based `inventorymanagement.html`.

**Source file:** `autoHotkey/Combined Inventory and Intercept.ahk` (1,267 lines, AutoHotkey v2.0)
**Target:** `live-site-pages/inventorymanagement.html` (web implementation)

---

## 1. User Management

### 1.1 User Registration (Add New User)
- Scan a badge (barcode/QR) to register a new user
- Prompted for: **User Name** and **User Photo** (optional)
- Photo can be selected via file browser or camera capture (camera is placeholder/future)
- Photos stored in `user_images/` folder with unique filenames (timestamp-appended if collision)
- Badge ID must be unique — duplicate badge scan shows error
- After adding first user, automatically enters "Sign In" mode
- If a user is already signed in when adding a new user, returns to "Add New Item" mode after

### 1.2 User Sign-In (Badge Scan Authentication)
- User scans their badge to sign in
- Badge must already be registered — unrecognized badge shows error with guidance to use "Add New User"
- Displays signed-in user's name prominently (green background indicator)
- Displays user's profile photo (80×80) if one was set
- After successful sign-in, automatically enters "Add New Item" mode
- All inventory operations require a signed-in user — scanning without sign-in shows error

### 1.3 User Log Off
- Dedicated "Log Off" button
- Clears current user, badge, and item image display
- Returns to "Sign In" mode
- Displays log-off confirmation in status bar

### 1.4 User Edit
- "Edit User" button (only enabled when signed in)
- Opens dialog pre-populated with current name and photo
- Can change name and/or photo
- **Name propagation**: if name is changed, updates all inventory records where user was the last user, and updates all history entries with the old name
- Displays summary of what changed (name, image, or both)
- Audio feedback (double beep) on successful edit

### 1.5 User Data Storage
- Users stored in `users.txt` (tab-separated: Badge ID, Name, Image path)
- User images stored as relative paths in `user_images/` folder
- Users displayed in a dedicated "Users" view (ListView with Badge ID and Name columns)

---

## 2. Inventory Operations

### 2.1 Scan Modes (Mutually Exclusive)
The scanner operates in one of five modes at any time. The current mode determines what happens when a barcode is scanned:

| Mode | Label | Description | Color |
|------|-------|-------------|-------|
| `signin` | Scan Badge to Sign In | Scanned barcode is treated as a user badge | Purple (#AA00AA) |
| `adduser` | Scan Badge for New User | Scanned barcode becomes a new user's badge ID | Magenta (#CC00CC) |
| `new` | Add New Item | Scanned barcode creates a new inventory item (prompts for name, qty, photo) | Green (#00AA00) |
| `add` | Add to Stock | Scanned barcode increments quantity by 1 for an existing item | Blue (#0066CC) |
| `subtract` | Subtract Stock | Scanned barcode decrements quantity by 1 for an existing item | Orange (#CC6600) |

- Active mode button is highlighted (blue #66CCFF background, `►` prefix)
- Mode buttons are disabled (grayed out) when no user is signed in
- Sign In button is disabled when a user is already signed in

### 2.2 Add New Item (Mode: `new`)
- Scan a barcode that doesn't exist in inventory
- Opens dialog prompting for: **Item Name**, **Quantity** (default: 1), **Item Photo** (optional)
- Item photo can be selected via file browser or camera (placeholder)
- Photos stored in `item_images/` folder with unique filenames
- Barcode must be unique — scanning an existing barcode shows error
- Validates: name required, quantity must be a non-negative integer
- Logs action as "NEW" in history

### 2.3 Add to Stock (Mode: `add`)
- Scan an existing item's barcode
- Automatically increments quantity by 1
- Updates last-updated timestamp and last-user
- If barcode doesn't exist, shows error directing to "Add New Item" mode
- Logs action as "ADD" in history with qty change of +1

### 2.4 Subtract from Stock (Mode: `subtract`)
- Scan an existing item's barcode
- Automatically decrements quantity by 1
- Prevents going below zero — shows error if item is already at 0
- Updates last-updated timestamp and last-user
- If barcode doesn't exist, shows error
- Logs action as "SUB" in history with qty change of -1

### 2.5 Edit Item
- "Edit Item" button (only enabled when signed in AND items exist)
- Must select an item in the Inventory ListView first
- Opens dialog pre-populated with current: Name, Quantity, Photo
- Can change any combination of name, quantity, and photo
- **Name propagation**: if name changes, updates all history entries for that barcode with the old name
- Validates: name required, quantity must be a non-negative integer
- Logs action as "EDIT" in history with the quantity delta
- Displays summary of changes (name, qty, image)

### 2.6 Item Data Model
Each inventory item stores:
| Field | Description |
|-------|-------------|
| `barcode` | Unique identifier (scanned value) |
| `name` | Human-readable item name |
| `qty` | Current stock quantity (integer, ≥0) |
| `lastUpdated` | Timestamp of last modification (yyyy-MM-dd HH:mm:ss) |
| `lastUser` | Name of user who last modified the item |
| `image` | Relative path to item photo (optional) |

---

## 3. Scanner / Input System

### 3.1 Barcode Scanner Input Hook
- Uses AutoHotkey's `InputHook` to intercept scanner input
- Settings: visible input (`V`), 5-second timeout (`T5`), max 50 characters (`L50`)
- Terminates on Tab or Enter key (standard scanner terminator)
- Minimum 5 characters required to process (filters accidental keystrokes)
- After processing, deletes the scanned characters from the active text field (sends Backspace × input length + 1)
- Automatically restarts the input hook after every scan to be ready for the next one

### 3.2 Input Validation
- All scans must be ≥5 characters
- Must end with Tab or Enter (EndKey)
- Quantity inputs validated as integers (≥0)
- Item names cannot be empty
- Badge IDs must be unique (for user registration)
- Barcodes must be unique (for new item creation)
- Barcodes must exist (for add/subtract operations)

---

## 4. Views (Display Modes)

### 4.1 Inventory View
- Default view — shows all items in a sortable ListView
- Columns: **Barcode**, **Item Name**, **Quantity**, **Last Updated**, **Last User**
- Column widths: 130, 180, 70, 180, 180
- Status bar shows: "Unique items: X | Total quantity: Y"
- Clicking an item shows its photo (100×100) in the "Selected Item" display area
- Items are selectable for the "Edit Item" action

### 4.2 History View
- Shows all inventory actions in reverse chronological order (newest first)
- Columns: **Timestamp**, **User**, **Action**, **Barcode**, **Item Name**, **Qty Change**, **New Qty**
- Column widths: 150, 100, 60, 120, 150, 100, 80
- Status bar shows: "Total history entries: X"
- Actions logged: NEW, ADD, SUB, EDIT

### 4.3 Users View
- Shows all registered users
- Columns: **Badge ID**, **Name**
- Column widths: 300, 480
- Status bar shows: "Total users: X"

### 4.4 View Toggle
- Three toggle buttons: "Show Inventory", "Show History", "Show Users"
- Only one view visible at a time (others hidden)
- Active view's button is disabled (can't re-select current view)
- All three ListViews share the same screen position (overlapping, visibility toggled)

---

## 5. Image Management

### 5.1 User Images
- Stored in `user_images/` folder (relative to script directory)
- Displayed at 80×80 in the main GUI when signed in
- Supported formats: PNG, JPG, JPEG, BMP, GIF
- File collision handling: appends timestamp to filename

### 5.2 Item Images
- Stored in `item_images/` folder (relative to script directory)
- Displayed at 100×100 in the "Selected Item" area when an item is selected in the inventory
- Same format support and collision handling as user images
- Cleared when user logs off

### 5.3 Image Sources
- **File browser**: opens a file select dialog for local image files
- **Camera capture**: placeholder/future feature — shows "coming soon" dialog
  - Future implementation notes in the source: FFmpeg, DirectShow, PowerShell, AHK WebView2 with getUserMedia

### 5.4 Image Path Storage
- All images stored as **relative paths** (e.g. `user_images/photo.jpg`)
- Helper function `GetFullImagePath()` converts relative to absolute by prepending script directory
- Absolute paths (containing `:`) are used as-is

---

## 6. Data Persistence

### 6.1 File Format
All data files use **tab-separated values** (TSV):

| File | Fields |
|------|--------|
| `inventory.txt` | Barcode, Name, Qty, LastUpdated, LastUser, ImagePath |
| `history.txt` | Timestamp, User, Action, Barcode, ItemName, QtyChange, NewQty |
| `users.txt` | BadgeID, Name, ImagePath |

### 6.2 Auto-Refresh (File Watching)
- 500ms polling timer checks file modification timestamps
- If `inventory.txt` or `history.txt` changed externally, automatically reloads data
- Enables multi-instance support — changes from one instance appear in another
- Compares `FileGetTime` (modification time) against last known value

### 6.3 Save Operations
- Inventory: full file rewrite on every change (delete + rewrite all records)
- History: append-only (new entries appended to end of file)
- Users: full file rewrite on every change
- History entries are immutable once written (except for name propagation edits)

---

## 7. Audio Feedback

| Sound | Meaning |
|-------|---------|
| Single beep (1000 Hz, 100ms) | Successful inventory operation (add, subtract, new item, edit) |
| Double beep (1500 Hz, 100ms × 2) | User-related success (sign in, user added, user edited) |
| Error beep (300 Hz, 300ms) | Any error condition (not signed in, item not found, duplicate, zero stock, etc.) |

---

## 8. GUI Layout

### 8.1 Main Window Structure
```
Row 1: User section     — [User:] [Sign In] [Add New User] [Username Display]  [User Photo 80×80]
                                                                                 [Selected Item: Photo 100×100]
Row 2: User edit         — [User Edit:] [Log Off] [Edit User]
Row 3: Scan modes        — [Scan Mode:] [Add New Item] [Add to Stock] [Subtract Stock]
Row 4: Item edit         — [Item Edit:] [Edit Item]
Row 5: Mode display      — [Current Mode: ___________] (full width, colored by mode)
Row 6: View toggles      — [View:] [Show Inventory] [Show History] [Show Users]
Row 7+: Data display     — [ListView — 800px wide, ~12 rows]  (inventory/history/users, overlapping)
Bottom: Status bar       — [Status message]
```

### 8.2 Window Behavior
- Resizable — ListViews and status bar dynamically adjust to window size
- Fixed-position elements: User photo (x:510, y:10), Item photo (x:650, y:30)
- Font: Consolas, size 10 (monospace for alignment)
- Background: #F0F0F0 (light gray)

### 8.3 Button States
- Buttons use visual state management (enabled/disabled with color changes)
- Disabled: gray background (#CCCCCC), gray text (#888888)
- Default: light gray background (#E0E0E0), black text
- Active mode: blue background (#66CCFF), black text, `►` prefix
- Signed-in user display: green background (#00CC66)

---

## 9. Error Handling

All errors follow the same pattern:
1. Error beep (300 Hz, 300ms)
2. Status bar displays `ERROR: <message>`
3. Operation is aborted — no data changes

| Error Condition | Message |
|----------------|---------|
| Badge already registered | "Badge already registered to [name]" |
| Badge not recognized (sign-in) | "Badge not recognized! Use 'Add New User' first." |
| Not signed in | "Please sign in first!" |
| Barcode already exists (new item) | "[barcode] already exists!" |
| Barcode not found (add/subtract) | "[barcode] not found! Use 'Add New Item' first." |
| Stock at zero (subtract) | "[name] is already at 0!" |
| No user to edit | "No user signed in to edit" |
| No item selected for edit | "Please select an item first" |
| Wrong view for edit | "Switch to Inventory view to edit item" |
| Item not found for edit | "Item not found in inventory" |
| Invalid quantity | "Please enter a valid number for quantity" |
| Negative quantity | "Quantity cannot be negative" |
| Empty item name | Treated as cancellation |
| Image copy failure | "Error copying image: [error message]" |

---

## 10. Additional Infrastructure

### 10.1 Version Tracking
- `VERSION := "v01.00a"` — script version constant
- `#SingleInstance Force` — prevents multiple instances of the script

### 10.2 Auto-Reload
- `#Include ReloadHandler.ahk` + `InitReloadHandler()` — automatically reloads the script when the `.ahk` file is modified (development convenience)

### 10.3 Custom Dialog System
- Custom input dialogs built with AHK GUI (not system InputBox)
- All dialogs are modal (owned by main window, always-on-top)
- Support Escape key and close button for cancellation
- Three dialog types:
  - **Simple input**: single text field (used for basic prompts)
  - **User input**: name field + photo picker (browse + camera buttons) + image preview
  - **Item input**: name field + quantity field + photo picker (browse + camera buttons) + image preview

---

## Feature Implementation Priority Map

For reference when implementing features in `inventorymanagement.html`. Features are grouped by what already exists in the web app vs. what's new.

### Already Implemented (web app has these)
- ✅ Barcode/QR scanning (camera-based, not USB scanner)
- ✅ Add scanned data to spreadsheet (Google Sheets backend)
- ✅ Live data polling (15s auto-refresh from spreadsheet)
- ✅ Scan history (in-session, client-side)
- ✅ User authentication (GAS-based SSO)
- ✅ Camera auto-resume on tab switch
- ✅ Camera auto-start when permission granted

### New Features from AHK (not yet in web app)
- ❌ **Scan modes** (add new item, add to stock, subtract from stock)
- ❌ **Item management** (named items with quantities, not just raw barcode data)
- ❌ **Quantity tracking** (+1/-1 per scan, manual edit)
- ❌ **Item editing** (change name, quantity, photo after creation)
- ❌ **User management** (badge-based sign-in separate from SSO, add/edit/logoff users)
- ❌ **Item photos** (image upload/capture per item)
- ❌ **User photos** (profile image per user)
- ❌ **Multiple views** (inventory view, history view, users view)
- ❌ **History logging** (timestamp, user, action, barcode, item, qty change, new qty)
- ❌ **Status bar** (total items, total quantity, operation feedback)
- ❌ **Audio feedback** (success/error beeps)
- ❌ **Name propagation** (renaming user/item updates all related records)
- ❌ **Stock validation** (prevent negative quantities, duplicate items)
- ❌ **Multi-instance file watching** (external change detection)

Developed by: ShadowAISolutions
