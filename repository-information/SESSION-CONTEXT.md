# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-08 09:20:59 PM EST
**Repo version:** v10.17r

### What was done
- **Title and duplicate scan fix (v10.10r–v10.11r)** — Set `<title>` to "Inventory Management" (was `TEMPLATE_TITLE` placeholder). Changed add-to-inventory logic from permanent per-barcode tracking (`_qrAddedScans`) to per-scan tracking (`_qrCurrentScanAdded`) — same item can be added multiple times across scans, but only once per scan. Fixed stale "...adding" button text on new scans.
- **Mobile layout improvements (v10.12r–v10.13r)** — Reduced camera viewport from 1:1 to 4:3 aspect ratio with 260px max-height on mobile. Added 40px top padding to scanner header to clear the user-pill/sign-out bar. Added `viewport-fit=cover` for safe-area support. Added desktop media query (≥600px) for larger viewport. Made data table horizontally scrollable on mobile.
- **Camera auto-resume on tab/app switch (v10.14r)** — Added `visibilitychange` listener with `_qrCameraWasActive` flag. Camera stops cleanly when page hidden, auto-resumes when visible. Graceful fallback if camera permission revoked while away.
- **Camera auto-start when permission granted (v10.15r)** — `showQrPanel()` now checks `navigator.permissions.query({ name: 'camera' })` and auto-starts if `granted`. Falls back to START CAMERA button on unsupported browsers (Safari).
- **Camera on/off toggle button (v10.16r)** — Circular toggle button in viewport next to torch button. Teal when camera on, red when off. Stops/starts camera without leaving scanner panel.
- **AHK feature reference document (v10.17r)** — Created comprehensive `repository-information/inventorymanagement-ahk-features.md` cataloging all features from the AutoHotkey inventory management script (10 sections: user management, inventory operations, scan modes, views, image management, data persistence, audio feedback, GUI layout, error handling, infrastructure). Includes implementation priority map comparing existing web features vs. new AHK features.

### Where we left off
- **Inventory management scanner is fully functional with improved UX** — camera auto-starts, auto-resumes on tab switch, has on/off toggle, mobile layout is clean
- The page is live at `ShadowAISolutions.github.io/saistemplateprojectrepo/inventorymanagement.html`
- Next step: implement AHK features into the web app using `inventorymanagement-ahk-features.md` as the reference

### Key decisions made
- **Per-scan add tracking** — replaced permanent `_qrAddedScans` object with `_qrCurrentScanAdded` boolean that resets on each new scan or history click. Allows same barcode to be added to inventory multiple times across different scans.
- **Inline camera stop on visibility hide** — does NOT call `stopQrCamera()` because that shows the start screen and sets "Camera inactive" status. Instead, inline-stops tracks/srcObject/flags to avoid visual flicker on auto-resume.
- **Permissions API for auto-start** — `navigator.permissions.query({ name: 'camera' })` wrapped in try-catch for Safari compatibility. Auto-starts only when `state === 'granted'`.
- **Camera toggle as overlay button** — positioned at `bottom: 8px; right: 48px` (next to torch at `right: 8px`). Uses `stopQrCamera()` then re-shows itself in `.off` state so user can toggle back on.

### Active context
- Branch: claude/inventory-duplicate-scan-fix-faFkz
- Repo version: v10.17r
- inventorymanagement.html: v01.14w, inventorymanagement.gs: v01.02g
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`, `MULTI_SESSION_MODE` = `Off`
- AHK feature reference ready at `repository-information/inventorymanagement-ahk-features.md`

## Previous Sessions

**Date:** 2026-04-08 02:46:00 PM EST
**Repo version:** v10.09r

### What was done
- Integrated QR scanner into inventory management HTML layer (v10.03r–v10.09r) — full-screen scanner as main interface, GAS backend for spreadsheet writes, live data polling with testauth1-style status badge

### Where we left off
- Inventory management QR scanner fully functional — scan → add to spreadsheet → live polling → entries table

Developed by: ShadowAISolutions
