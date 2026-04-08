# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 76/100`

## [v09.79r] — 2026-04-07 08:14:16 PM EST

> **Prompt:** "this is what it looks like on my phone, make the camera area much more compact so we have more space"

### Changed
- Made camera viewport more compact on mobile — changed aspect ratio from 1:1 (square) to 4:3 (landscape), reduced padding from 18px to 8px, tighter gap between elements. Gives ~25% more vertical space for scan history below
- Updated GAS scan-panel padding-top to match the new smaller camera height (`min(100vw,480px) * 0.75 + 50px`)

#### `inventorymanagement.html` — v01.08w

##### Changed
- Camera viewport is now more compact with a 4:3 aspect ratio

#### `inventorymanagement.gs` — v01.10g

##### Changed
- Scan history position adjusted for the smaller camera area

## [v09.78r] — 2026-04-07 08:08:27 PM EST

> **Prompt:** "adad a button that functions similarly as the testauth1 that lets the user delete an entry"

### Added
- Delete button (✕) on each scan row in the GAS-layer scan history — dims the row optimistically, deletes from the Scans sheet server-side, refreshes cache and UI on success
- `deleteScanRow(token, sheetRowIndex)` server function with session validation

#### `inventorymanagement.gs` — v01.09g

##### Added
- Delete button on each scan entry to remove it from the spreadsheet

## [v09.77r] — 2026-04-07 08:03:52 PM EST

> **Prompt:** "the optimistic doesnt seem to be working probably because the html and gas are on different layers, is there a way for there to be optimistic rows visible instantly between the layers before the data polling takes over"

### Added
- Optimistic "last scan" notification on the HTML layer — shows scanned value instantly below the camera viewport with a slide-up animation, changes from "saving..." to "✔ saved" when the GAS bridge confirms, auto-fades after 20 seconds

#### `inventorymanagement.html` — v01.07w

##### Added
- Instant scan result feedback below the camera — appears immediately when a barcode is detected, before the GAS poll picks it up

## [v09.76r] — 2026-04-07 07:45:47 PM EST

> **Prompt:** "ok, good. make it also have the same polling timer (including the visible countdown) that is used in the testauth1 live data, as well as showing the optimistic data (like in the testauth), so look at how the testauth1 works for its table and incorporate the same methodology"

### Added
- Visible poll countdown timer (`▷ 12s`) matching testauth1 pattern — updates every 1s, shows "polling..." when in-flight, time until next poll otherwise
- Optimistic data support — scans can be shown immediately at reduced opacity before server confirms, cleared when poll returns fresh data
- 15-second poll interval matching testauth1's `DATA_POLL_INTERVAL`

#### `inventorymanagement.gs` — v01.08g

##### Added
- Visible countdown showing time until next data refresh
- Optimistic scan entries that appear instantly while saving

## [v09.75r] — 2026-04-07 07:37:51 PM EST

> **Prompt:** "the scan history is hiding behind the camera view, have that appear below the coordinates, i know they are on different layers so you have to analyze their relative coordinates"

### Fixed
- GAS scan history panel now positioned below the camera widget using `padding-top: calc(min(100vw, 480px) + 80px)` — dynamically matches the camera viewport height (aspect-ratio 1:1 at max 480px) plus padding/status bar

#### `inventorymanagement.gs` — v01.07g

##### Fixed
- Scan history now appears below the camera area instead of behind it

## [v09.74r] — 2026-04-07 07:21:09 PM EST

> **Prompt:** "clicking on the flashlight button is turning on but its not turning off when i click it again. on the gas layer below the relative scanning scanning html area, make something to test our scanning app so that things are saved in the spreadsheet and we can see it. use the testauth1 with the live data as the method, polling and all"

### Fixed
- Fixed torch toggle not turning off — simplified constraint application to avoid race condition in async promise chain

### Added
- Scan results saved to "Scans" sheet in the project spreadsheet (auto-creates sheet with headers on first scan)
- GAS-side scan history UI with 10-second polling (testauth1 live data pattern) — shows timestamp, value, and format for each scan
- `getScanHistory(token)` server function for authenticated polling
- Server-side scan cache with self-healing (`_refreshScanCache` / `_getCachedScans`) — avoids repeated spreadsheet reads

#### `inventorymanagement.html` — v01.06w

##### Fixed
- Flashlight toggle now properly turns off when tapped again

#### `inventorymanagement.gs` — v01.06g

##### Added
- Scan history visible below the camera — shows saved scans with live updates

## [v09.73r] — 2026-04-07 06:51:03 PM EST

> **Prompt:** "the html is covering up the gas layer completely, only keep the camera components there, we dont need the full screen background so that i can still see the gas layer"

### Changed
- Stripped scanner HTML layer down to camera-only components: viewport, video, canvas, scan line, start button, status bar, torch, engine badge. Removed full-screen background, header, result card, history, upload, toast — GAS layer is now visible behind the camera widget
- Camera widget uses `pointer-events: none` on the container so clicks pass through to the GAS iframe, with `pointer-events: auto` only on the scanner-container itself

#### `inventorymanagement.html` — v01.05w

##### Changed
- Camera widget no longer covers the full screen — GAS layer is visible behind it

## [v09.72r] — 2026-04-07 06:41:25 PM EST

> **Prompt:** "you literally removed the gas layer. and the html toggle is not hiding all of the html, the gas toggle should still be there"

### Fixed
- Added `qr-scanner-page` to the HTML layer toggle element list — scanner now hides when HTML toggle is clicked, revealing the GAS iframe underneath

#### `inventorymanagement.html` — v01.04w

##### Fixed
- Scanner now responds to the HTML layer toggle — click HTML to hide scanner and see the app layer

## [v09.71r] — 2026-04-07 06:34:20 PM EST

> **Prompt:** "it seems like we have 3 different html layers going on here with the toggles. the layer with our pills, the one that is unaffected by scans the one saying no scans yet (might be on gas layer not sure,fix it so that its interacting with the gas toggle), and the scan layer which shows the start camera button which should not be a toggle, it should be the main page, the gas layer can be functional but then the camera shouldnt occupy the whole screen. it should essentially function how the qr-scanner6 works, but we are dividing the labor between two layers"

### Changed
- Rebuilt scanner as the main page content (always visible, not a toggle overlay) — matches qr-scanner6 layout: header, camera viewport, status bar, result card, image upload, scan history all flowing vertically
- Moved all scanner UI from GAS layer to HTML layer — GAS iframe runs in background for future Sheets integration via listener iframe bridge
- Removed SCAN toggle button — scanner is now the primary page experience
- Cleared GAS PROJECT sections (CSS, HTML, JS) — GAS doGet only renders the admin panel and auth, scanner UI is on the HTML layer

#### `inventorymanagement.html` — v01.03w

##### Changed
- Scanner is now the main page layout with full qr-scanner6 feature set

#### `inventorymanagement.gs` — v01.05g

##### Changed
- Cleared scanner result UI from GAS iframe — scanner display now handled by the embedding page

## [v09.70r] — 2026-04-07 06:14:22 PM EST

> **Prompt:** "this is what i see" (screenshot showing SCAN button not visible)

### Fixed
- Fixed SCAN toggle button not appearing — removed `display:none` that relied on a `_showGasToggle` hook that was never called; button now shows by default like the HTML/GAS buttons

#### `inventorymanagement.html` — v01.02w

##### Fixed
- Scanner toggle button now visible alongside HTML and GAS buttons

## [v09.69r] — 2026-04-07 05:58:59 PM EST

> **Prompt:** "properly put the qr-scanner6 into the inventory gas" → "getting camera error" → plan mode: minimal HTML layer via listener iframe bridge

### Added
- QR/barcode scanner architecture using listener iframe bridge pattern — camera runs on HTML layer (bare minimum: video, canvas, detection loop), scan results sent to GAS via `action=scanListener` postMessage bridge, result UI and history rendered on GAS layer
- `processBarcodeScan()` server-side function in inventory management GAS (placeholder — returns scanned data, future: Sheets lookup)
- `action=scanListener` handler in GAS `doGet()` — lightweight listener page following the established heartbeat/signout pattern
- SCAN toggle button on HTML layer for opening/closing camera overlay
- CSP updates for `media-src` (camera streams) and `script-src` (jsQR CDN)

### Changed
- Moved scanner from GAS iframe (where camera was blocked by sandbox) to split architecture: camera bridge on HTML layer, result display on GAS layer

#### `inventorymanagement.html` — v01.01w

##### Added
- Camera scanner overlay with QR/barcode detection

#### `inventorymanagement.gs` — v01.04g

##### Added
- Scan result display panel with history
- Barcode scan processing endpoint

##### Changed
- Removed non-functional camera code from GAS iframe (sandbox blocks getUserMedia)

## [v09.68r] — 2026-04-07 05:24:49 PM EST

> **Prompt:** "properly put the qr-scanner6 into the inventory gas"

### Added
- Integrated QR & Barcode scanner into the Inventory Management GAS app — camera-based scanning with native BarcodeDetector and jsQR fallback, image upload scanning, torch toggle, scan history, and type classification (URL, email, phone, SMS, WiFi, text, product, barcode)

#### `inventorymanagement.gs` — v01.03g

##### Added
- Built-in QR code and barcode scanner with camera support
- Image upload scanning from gallery
- Flashlight toggle for low-light scanning
- Scan history with up to 10 recent scans
- Auto-detection of scan type (URL, email, phone, WiFi, product code)

## [v09.67r] — 2026-04-07 05:02:49 PM EST

> **Prompt:** "plan it but please take into account the pros and cons so i can decide whether we move forward with it"

### Added
- Dynamic Program Portal — portal app list now reads from the Master ACL spreadsheet metadata rows instead of a hardcoded array. New auth projects automatically appear after their first page load
- Added `#ICON` (row 5) and `#DESC` (row 6) metadata rows to the Master ACL spreadsheet schema — user data rows shifted from row 5+ to row 7+
- Added `PORTAL_ICON` and `PORTAL_DESCRIPTION` config variables to all auth GAS scripts and config.json files
- Added Portal Icon and Portal Description input fields to the GAS Project Creator form

### Changed
- Updated `ensureMetadataRows()` and `registerSelfProject()` in auth GAS template and all 4 auth .gs files to support 5 metadata rows
- Updated `getRegisteredProjects()` and `addPageColumn()` in globalacl.gs to read/write the new metadata rows
- Updated `getUserAppAccess()` in programportal.gs to read user data from row 7+ instead of row 5+
- Updated `setup-gas-project.sh` to accept and substitute `PORTAL_ICON` and `PORTAL_DESCRIPTION`

#### `gas-project-creator.html` — v01.69w

##### Added
- Portal Icon and Portal Description fields in the project creator form

#### `programportal.gs` — v01.62g

##### Changed
- Application list now loads dynamically — new projects appear automatically

#### `globalacl.gs` — v01.55g

##### Changed
- Minor internal improvements

#### `testauth1.gs` — v02.60g

##### Changed
- Minor internal improvements

#### `inventorymanagement.gs` — v01.02g

##### Changed
- Minor internal improvements

## [v09.66r] — 2026-04-07 03:20:19 PM EST

> **Prompt:** "im signing into the global acl manager but its not auto propagating figure out why and make it happen moving forward"

### Fixed
- Fixed cross-project admin secret not distributing to newly registered projects — `ensureCrossProjectSecret()` in GlobalACL now detects when the registered auth-project count changes (via cache comparison) and re-distributes the existing secret to all projects, so new projects automatically receive it on the next GlobalACL page load

#### `globalacl.gs` — v01.54g

##### Fixed
- Admin session management now works for newly added projects without manual secret setup

## [v09.65r] — 2026-04-07 03:07:14 PM EST

> **Prompt:** "i did option 1, but it didnt work. check the setup-gas-project.sh , i noticed that you ran into some errors, so fix it there and in our script"

### Fixed
- Fixed HMAC_SECRET chicken-and-egg bug: `ensureScriptProperties_()` was only called from `pullAndDeployFromGitHub()` (deploy-time), but HMAC is required on first page load for session creation — added call to `doGet()` in the auth GAS template so HMAC_SECRET auto-generates on first visit
- Fixed `setup-gas-project.sh` Phase 9 workflow deploy step insertion: replaced fragile `sed -i` with multiline `\n` escapes with a temp file + `sed r` approach that reliably inserts the deploy block

### Changed
- Propagated `ensureScriptProperties_()` doGet fix to all 4 auth GAS scripts (inventorymanagement, testauth1, globalacl, programportal) via template propagation

#### `inventorymanagement.gs` — v01.01g

##### Fixed
- Sign-in now works on first deployment — setup properties auto-generate on first visit

#### `testauth1.gs` — v02.59g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.53g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.61g

##### Changed
- Minor internal improvements

## [v09.64r] — 2026-04-07 02:51:01 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.

bash scripts/setup-gas-project.sh <<'CONFIG'
{
  "PROJECT_ENVIRONMENT_NAME": "inventorymanagement",
  "TITLE": "Inventory Management",
  "DEPLOYMENT_ID": "AKfycby0Eh2XhbibpLptNk94g8GAoIwgfzQ7ozRz6YBKfyXyXBYyANZJjCuYdFzi4_WIKYbKBw",
  "SPREADSHEET_ID": "1_dtm8U7uIug4aUcD4KD9ylwzZvm05xWBtXMrikWi8Pg",
  "SHEET_NAME": "Live_Sheet",
  "DEVELOPER_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "YOUR_ORG_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "SPLASH_LOGO_URL": "https://www.shadowaisolutions.com/SAIS_Logo.png",
  "INCLUDE_AUTH": true,
  "CLIENT_ID": "216764502068-7j0j6svmparsrfgdf784dneltlirpac2.apps.googleusercontent.com",
  "AUTH_PRESET": "hipaa",
  "MASTER_ACL_SPREADSHEET_ID": "1HASSFzjdqTrZiOAJTEfHu8e-a_6huwouWtSFlbU8wLI",
  "ACL_SHEET_NAME": "Access",
  "ACL_PAGE_NAME": "inventorymanagement"
}
CONFIG"

### Added
- Set up new GAS project: Inventory Management (inventorymanagement) with auth, HIPAA preset, and full ACL configuration
- Created inventorymanagement.html embedding page, inventorymanagement.gs GAS script, and inventorymanagement.config.json
- Created version files (html.version.txt, gs.version.txt), changelogs, and per-environment diagram
- Added Deploy Inventorymanagement step to auto-merge workflow for GAS webhook auto-deploy
- Registered Inventorymanagement in GAS Projects table, REPO-ARCHITECTURE.md, and README.md tree

## [v09.63r] — 2026-04-07 11:22:39 AM EST

> **Prompt:** "good. now, if we are not including google authentication (toggle at the top is off), then the fields related to authentication should not be there, i.e. the master acl spreadsheet id, etc. verify that we wouldnt need those fields in this scenario"

### Changed
- Auth-only fields (Master ACL section, ACL Sheet Name, ACL Column Name) now hidden when "Include Google Authentication" toggle is off — verified against the noauth GAS template which has none of these variables

#### `gas-project-creator.html` — v01.68w

##### Changed
- Master ACL, ACL Sheet Name, and ACL Column Name hidden when auth is disabled

## [v09.62r] — 2026-04-07 11:16:28 AM EST

> **Prompt:** "no, the master acl spreadsheet id when enabled is still not letting me type into it"

### Fixed
- Master ACL Spreadsheet ID field now accepts user input — `toggleMasterAcl()` now tracks state changes and only overwrites the value on actual toggle transitions (checked↔unchecked), not on repeated calls with the same state
- Root cause: `updateFieldStates()` called `toggleMasterAcl()` on every input event, and the unchecked branch was overwriting `aclIdField.value` with `_aclValueBeforeToggle` (empty) on every keystroke

#### `gas-project-creator.html` — v01.67w

##### Fixed
- Master ACL Spreadsheet ID field now properly editable — typing no longer gets overwritten

## [v09.61r] — 2026-04-07 11:13:35 AM EST

> **Prompt:** "ok the toggle is properly showing the acl sheet name and acl column name fields as enabled, but when the toggle is off, its not letting me type into the master acl spreadsheet id field"

### Fixed
- Master ACL Spreadsheet ID field now editable when toggle is unchecked — added `setFieldDisabled('cfg-master-acl-id', false)` before `toggleMasterAcl()` to properly restore the field from its disabled state (clears the `disabled` attribute and restores saved value)

#### `gas-project-creator.html` — v01.66w

##### Fixed
- Master ACL Spreadsheet ID field now accepts input when toggle is unchecked

## [v09.60r] — 2026-04-07 11:08:00 AM EST

> **Prompt:** "the acl sheet name and acl column name fields are not properly being enabled after the master acl spreadsheet id is set"

### Fixed
- ACL Sheet Name and ACL Column Name now properly enable when Master ACL Spreadsheet ID is filled — added `oninput="updateFieldStates()"` to the Master ACL ID field and added ACL field re-evaluation in `toggleMasterAcl()`
- Root cause: the Master ACL ID input had no `oninput` handler to trigger field state updates, and the toggle didn't re-evaluate ACL field states after auto-filling the ID

#### `gas-project-creator.html` — v01.65w

##### Fixed
- ACL fields now enable when Master ACL Spreadsheet ID is set (manually or via toggle)

## [v09.59r] — 2026-04-07 11:03:22 AM EST

> **Prompt:** "actually something else is also going on also, the buttons think that the environment name isnt there, so fix these bugs"

### Fixed
- Copy buttons (Code.gs, HTML, Config) now correctly detect Environment Name — `updateDeployGate()` is called at the end of `updateFieldStates()` so it reads field values after all save/restore operations complete
- Root cause: `updateDeployGate()` was called from `oninput` before `updateFieldStates()` had restored the saved env name value

#### `gas-project-creator.html` — v01.64w

##### Fixed
- Copy buttons no longer incorrectly show "needs: Environment Name" when Environment Name is filled

## [v09.58r] — 2026-04-07 11:01:26 AM EST

> **Prompt:** "the acl sheet name and the acl column name are showing to enter deployment ID first but it shouldnt be tied to that, it should be if the master acl spreadsheet ID is set up"

### Fixed
- ACL Sheet Name and ACL Column Name now gated solely behind Master ACL Spreadsheet ID — no longer inherit the project field cascade reason ("Enter Deployment ID first"), always show "Enter Master ACL Spreadsheet ID first" when that field is empty

#### `gas-project-creator.html` — v01.63w

##### Fixed
- ACL fields no longer show misleading "Enter Deployment ID first" message

## [v09.57r] — 2026-04-07 10:56:55 AM EST

> **Prompt:** "the acl column name should not mention defaults to if disabled, should also say enter spreadsheet id first instead. also if the master ACL spreadsheet ID is not filled either manually or through the toggle, the ACL sheet name and ACL column name should be disabled"

### Fixed
- ACL Sheet Name and ACL Column Name now gated behind Master ACL Spreadsheet ID being filled (either manually or via toggle) — show "Enter Master ACL Spreadsheet ID first" when empty
- ACL Column Name no longer shows "Defaults to:" placeholder when disabled — only shows the default hint when the field is active and editable

#### `gas-project-creator.html` — v01.62w

##### Fixed
- ACL fields now require Master ACL Spreadsheet ID before they can be edited
- Disabled ACL Column Name no longer misleadingly shows default value hint

## [v09.56r] — 2026-04-07 10:51:44 AM EST

> **Prompt:** "the allowed domains should also default to all if blank. the acl sheet name and acl column name fields should be disabled if there is no spreadsheet id, same for the master acl spreadsheet id, it shouldnt refer to the entering environment name first"

### Fixed
- ACL Sheet Name, ACL Column Name, and Master ACL Spreadsheet ID now show "Enter Spreadsheet ID first" when Spreadsheet ID is empty (was incorrectly showing "Enter Environment Name first")
- Moved ACL fields out of the generic project fields group into a Spreadsheet ID-dependent group
- Blank Allowed Domains already treated as "All" (no domain restriction) — both blank and "All" skip domain restriction in copyGsCode and copyConfig

#### `gas-project-creator.html` — v01.61w

##### Fixed
- ACL and Master ACL fields now correctly reference Spreadsheet ID as their dependency

## [v09.55r] — 2026-04-07 10:45:04 AM EST

> **Prompt:** "in this scenario, the clear X button should not be there since the field pulling from somewhere else, this should apply everywhere in the gas-project-creator for similar situations"

### Fixed
- Clear (X) button now hidden on readOnly fields (auto-filled from another field) — applied globally via `updateEmptyClasses()` so any current or future readOnly auto-fill field automatically gets this behavior

#### `gas-project-creator.html` — v01.60w

##### Fixed
- Clear button no longer appears on fields that are auto-filled from another source

## [v09.54r] — 2026-04-07 10:40:56 AM EST

> **Prompt:** "that disabled field should mention what would enable the field like the other disabled fields. but the field should not be disabled if this spreadsheet is not the master acl, i should be able to put what the master acl spreadsheet id is"

### Fixed
- Master ACL Spreadsheet ID field now shows "Uncheck master ACL toggle to edit" hint when toggle is checked (consistent with other disabled fields)
- Field is now properly editable when toggle is unchecked — fixed bug where `disabled` attribute from `setFieldDisabled` wasn't cleared by `toggleMasterAcl()`

#### `gas-project-creator.html` — v01.59w

##### Fixed
- Master ACL Spreadsheet ID field now editable when toggle is unchecked
- Disabled state shows hint about how to enable it

## [v09.53r] — 2026-04-07 10:35:23 AM EST

> **Prompt:** "actually instead of hiding the master acl spreadsheet id field, have it disabled if the checkmark is pressed."

### Changed
- Master ACL Spreadsheet ID field now stays visible but becomes disabled/readOnly when toggle is checked (auto-fills with Spreadsheet ID), instead of hiding
- Restores the user's previous value when unchecked
- `syncMasterAclId()` keeps the ACL ID field synced with Spreadsheet ID while toggle is checked

#### `gas-project-creator.html` — v01.58w

##### Changed
- Master ACL Spreadsheet ID field disables with auto-fill instead of hiding when toggle is checked

## [v09.52r] — 2026-04-07 10:28:36 AM EST

> **Prompt:** "lets review the master ACL toggle. if unchecked should have a field to put the master ACL spreadsheet ID, if unchecked that field should be removed. the acl sheet name and acl column name should always be visible. the toggle should be moved to underneath the spreadsheet id field"

### Changed
- Redesigned master ACL section: toggle moved under Spreadsheet ID, external ACL ID field shows when unchecked (for referencing another spreadsheet as ACL), hides when checked (uses own Spreadsheet ID)
- ACL Sheet Name and ACL Column Name are now always visible — no longer hidden based on toggle state
- `copyGsCode()` and `copyConfig()` now support both modes: checked = own Spreadsheet ID as ACL, unchecked = external ACL spreadsheet ID

#### `gas-project-creator.html` — v01.57w

##### Changed
- Master ACL toggle moved under Spreadsheet ID with external ACL ID field for non-self ACL projects
- ACL Sheet Name and Column Name always visible

## [v09.51r] — 2026-04-07 10:12:59 AM EST

> **Prompt:** "the master ACL toggle should be right above the spreadsheet ID, having it untoggled should not be hiding the fields, dont we need to use them anyway? or if unchecked do we not need the ACL sheet name and column name?"

### Changed
- Moved master ACL toggle above Spreadsheet ID field for better visual flow
- ACL detail fields (Sheet Name, Column Name) still show/hide based on toggle — when unchecked, no ACL is configured and those fields are not needed (the GAS code checks `hasAcl` and skips ACL logic when the ID is a placeholder)

#### `gas-project-creator.html` — v01.56w

##### Changed
- Master ACL toggle moved above Spreadsheet ID

## [v09.50r] — 2026-04-07 10:01:45 AM EST

> **Prompt:** "the Allowed Domains should be prefilled to say "All" , and that should be equivalent to any google account can sign in."

### Changed
- Allowed Domains field in gas-project-creator now prefills with "All" — treated as no domain restriction (any Google account can sign in)
- `copyGsCode()` and `copyConfig()` skip domain restriction when value is "All"

#### `gas-project-creator.html` — v01.55w

##### Changed
- Allowed Domains now prefills with "All" meaning any Google account can sign in

## [v09.49r] — 2026-04-07 09:55:58 AM EST

> **Prompt:** "the master acl spreadsheet id field is still there, i want it removed, i just want it consolidated with the spreadsheet ID, so the toggle should be moved next to the spreadsheet ID"

### Changed
- Removed the separate Master ACL Spreadsheet ID field — when the "master ACL" toggle is checked, the project's Spreadsheet ID is used directly as the master ACL
- Moved the master ACL toggle to sit directly under Spreadsheet ID field
- ACL detail fields (Sheet Name, Column Name) now show/hide based on toggle state instead of depending on a separate ID field
- Simplified `toggleMasterAcl()`, `toggleAclDetails()`, `copyGsCode()`, and `copyConfig()` to use Spreadsheet ID directly

#### `gas-project-creator.html` — v01.54w

##### Changed
- Master ACL toggle moved next to Spreadsheet ID — no separate ACL spreadsheet ID field
- ACL details appear inline when toggle is checked

## [v09.48r] — 2026-04-07 09:47:23 AM EST

> **Prompt:** "the authentication settings should be under the oauth client ID that we just moved up"

### Changed
- Merged Auth Preset and Allowed Domains into the Authentication Settings box under OAuth Client ID — removed the separate auth-fields box that was further down the form
- All auth-related fields (Client ID, Auth Preset, Allowed Domains) are now consolidated in one section at the top

#### `gas-project-creator.html` — v01.53w

##### Changed
- Auth Preset and Allowed Domains moved under OAuth Client ID in the Authentication Settings section

## [v09.47r] — 2026-04-07 09:43:11 AM EST

> **Prompt:** "instead of having a separate master ACL spreadsheet ID field, the toggle should be moved to next to the spreadsheet ID to modify it if toggled. the ACL sheet name and column name can be moved under that also. the oauth client id can be moved to before the deployment id, and i think it should be required before enabling the deployment id field, the authentication settings fields should be labeled as such"

### Changed
- Restructured gas-project-creator form layout: OAuth Client ID moved before Deployment ID in its own "Authentication Settings" box, gates Deployment ID when auth is enabled
- Master ACL section (toggle, ID, sheet name, column name) moved from auth settings box to under Spreadsheet ID — now depends on Spreadsheet ID being filled, not Client ID
- Auth settings box now only contains Auth Preset and Allowed Domains
- New dependency cascade: Client ID → Deployment ID → Env Name → project fields → Spreadsheet ID → Master ACL

#### `gas-project-creator.html` — v01.52w

##### Changed
- OAuth Client ID now appears before Deployment ID and is required to enable it (when auth is checked)
- Master ACL section moved under Spreadsheet ID for logical grouping
- Auth settings box simplified to just Auth Preset and Allowed Domains

## [v09.46r] — 2026-04-07 08:47:47 AM EST

> **Prompt:** "if i add deployment id, add project environment name, then delete deployment id and re ad deployment ID, the fields are disabled even though we still had a project environment name there before, fix this same bug everywhere in the gas-project-creator"

### Fixed
- Fixed field dependency cascade bug in gas-project-creator: when a parent field was cleared and re-filled, child fields stayed disabled because `updateFieldStates()` read dependent values before `setFieldDisabled()` had a chance to restore them. Now re-reads `hasEnvName`, `hasSpreadsheet`, and `hasClientId` after their fields have been restored, so downstream fields correctly re-enable

#### `gas-project-creator.html` — v01.51w

##### Fixed
- Fields no longer stay disabled when a parent field is cleared and re-filled

## [v09.45r] — 2026-04-07 08:41:28 AM EST

> **Prompt:** "make the splash logo URL prefill to https://www.shadowaisolutions.com/SAIS_Logo.png , the splash logo URL defaulting to developer logo, what happens if the developer logo is blank, i think these should not depend on eachother, they should be independent in case i want some to be blank on purpose."

### Changed
- Made all 3 logo variables fully independent — `SPLASH_LOGO_URL` is now a standalone string value in all templates and pages, no longer a reference to `DEVELOPER_LOGO_URL`
- Splash Logo URL field in gas-project-creator now prefills with the default SAIS logo URL
- Updated field hints to clarify all 3 logos are independent of each other
- Updated `copyHtmlCode()` regex to match the new single-quoted string format for `SPLASH_LOGO_URL`
- Updated `setup-gas-project.sh` to handle `SPLASH_LOGO_URL` with proper default and consistent substitution pattern

#### `gas-project-creator.html` — v01.50w

##### Changed
- Splash Logo URL now prefills with the default logo instead of being blank
- All three logo fields are now described as independent of each other

#### `testauth1.html` — v03.99w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.88w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.95w

##### Changed
- Minor internal improvements

#### `text-compare.html` — v01.10w

##### Changed
- Minor internal improvements

## [v09.44r] — 2026-04-07 08:34:10 AM EST

> **Prompt:** "make it so that the deployment ID being filled is a requirement for the Project Environment Name to be active"

### Changed
- Project Environment Name field in gas-project-creator is now disabled until Deployment ID is filled
- All downstream project config fields cascade: Deployment ID → Environment Name → project fields

#### `gas-project-creator.html` — v01.49w

##### Changed
- Environment Name field now requires Deployment ID to be filled before it can be edited
- Deployment ID field changes now trigger field state updates for the full cascade

## [v09.43r] — 2026-04-07 08:26:38 AM EST

> **Prompt:** "i guess we should have a field for each logo, developer, org, and splash"

### Changed
- Renamed `LOGO_URL` → `SPLASH_LOGO_URL` in all HTML templates and 5 live pages — the runtime pointer used by splash screens now has a descriptive name
- Restructured gas-project-creator logo fields: replaced single "Splash Logo URL" field with 3 separate fields (Developer Logo, Org Logo, Splash Logo)
- Updated `copyHtmlCode()` to substitute all 3 logo variables in HTML templates
- Removed dead `SPLASH_LOGO_URL` substitution from `copyGsCode()` (logo variables don't exist in GAS templates)
- Updated `setup-gas-project.sh` to parse and apply `DEVELOPER_LOGO_URL`, `YOUR_ORG_LOGO_URL`, and `SPLASH_LOGO_URL` separately
- Removed stale `SPLASH_LOGO_URL` references from workflow comments (not a GAS variable)
- Updated CLAUDE.md, gas-scripts.md, and IMPROVEMENTS.md documentation references

#### `gas-project-creator.html` — v01.48w

##### Changed
- Logo configuration now has 3 separate fields: Developer Logo, Org Logo, and Splash Logo
- Splash Logo defaults to Developer Logo when left blank

#### `testauth1.html` — v03.98w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.87w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.94w

##### Changed
- Minor internal improvements

#### `text-compare.html` — v01.09w

##### Changed
- Minor internal improvements

## [v09.42r] — 2026-04-07 07:57:43 AM EST

> **Prompt:** "in the gas-project-creator , are we actually using the Sound File ID for anything anymore? if not remove it"

### Removed
- Removed `SOUND_FILE_ID` variable from all GAS templates, live GAS scripts, config.json files, gas-project-creator form, setup script, workflow comments, and documentation — the variable was declared but never referenced after the `testSoundFetch` test function was archived

#### `gas-project-creator.html` — v01.47w

##### Removed
- Removed Sound File ID form field (was unused by any live feature)

#### `testauth1.gs` — v02.58g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.52g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.60g

##### Changed
- Minor internal improvements

## [v09.41r] — 2026-04-06 11:16:59 PM EST

> **Prompt:** "make the copy code.gs for Gas and the Copy Config For Claude buttons the same red when they are disabled, and have the text mention which fields are missing to enable,, still need to know what the button name is so maybe separate missing and name with --"

### Changed
- Copy Code.gs, Copy HTML, and Copy Config buttons now show red disabled tint (`#1e1114`) when disabled
- Disabled buttons now show which fields are missing: e.g. "Copy Code.gs for GAS ── needs: Deployment ID, Environment Name"
- Button text reverts to normal label when all required fields are filled

#### `gas-project-creator.html` — v01.46w

##### Changed
- Action buttons now show which fields are needed before they can be used
- Disabled buttons use the same red tint as other disabled elements

## [v09.40r] — 2026-04-06 11:11:14 PM EST

> **Prompt:** "can the auth preset dropdown be the same red when disabled, and make the optional test gas connection button the same red when disabled"

### Fixed
- Auth Preset dropdown now shows red disabled tint (`#1e1114`) when disabled — added `!important` to override inline background style
- Test GAS Connection button now shows red disabled tint instead of green when disabled — separated from the generic disabled rule and given explicit `background: #1e1114`

#### `gas-project-creator.html` — v01.45w

##### Fixed
- Disabled dropdown and test button now match the red disabled tint of other fields

## [v09.39r] — 2026-04-06 11:06:44 PM EST

> **Prompt:** "also using the clear X button should show the green again, it currently doesnt on most fields"

### Fixed
- Fixed clear (X) button not triggering green empty-field tint — `clearField()` now calls `updateEmptyClasses()` after clearing the value

#### `gas-project-creator.html` — v01.44w

##### Fixed
- Clearing a field now correctly shows the empty-field background tint

## [v09.38r] — 2026-04-06 11:03:59 PM EST

> **Prompt:** "yes make that change, also when the fields are either disabled or blank, dont have the X button which clears there"

### Changed
- Changed ACL Column Name label from "(required — identifies this page)" to "(defaults to Environment Name — identifies this page)" when active — reflects that the field auto-fills from Environment Name and is safe to leave blank
- Clear (X) buttons now hidden when field is disabled or blank — only visible when the field has content that can be cleared

#### `gas-project-creator.html` — v01.43w

##### Changed
- ACL Column Name label now indicates it defaults to Environment Name
- Clear buttons hidden on empty or disabled fields

## [v09.37r] — 2026-04-06 10:56:44 PM EST

> **Prompt:** "in the scenario where i fill out the environment name before toiggling the master ACL spreadsheet, the ACL Column Name is not auto filling from the environment name, and note that its not green when blank either"

### Fixed
- Fixed ACL Column Name placeholder not showing "Defaults to: {envName}" after enabling — `syncAclPagePlaceholder()` now called when ACL detail fields transition to active
- Fixed ACL detail fields not getting green empty-field tint after becoming enabled — `updateEmptyClasses()` now called at end of `toggleAclDetails()`

#### `gas-project-creator.html` — v01.42w

##### Fixed
- ACL Column Name now correctly shows the environment name as its default when enabled
- Empty ACL fields now show the correct background tint

## [v09.36r] — 2026-04-06 10:50:41 PM EST

> **Prompt:** "in section 15, we dont use onEditWriteB1ToCache in any functions anymore so that specific function name can be removed here, i still want this section as a placeholder for any future installable triggers, just that part is not relevant anymore . and the green needs to be lighter, and the red needs to be twice as much increased as you will increase the lightness of the green"

### Changed
- Removed `onEditWriteB1ToCache` reference from step 15 — now a generic installable trigger placeholder
- Lightened green empty-field tint from `#101d18` to `#112a1c` (more visible green)
- Lightened red disabled-field tint from `#141012` to `#1e1114` (2x the green adjustment, more visible warm red)

#### `gas-project-creator.html` — v01.41w

##### Changed
- Step 15 updated to generic trigger instructions
- Field background tints adjusted for better visibility

## [v09.35r] — 2026-04-06 10:46:49 PM EST

> **Prompt:** "the green is close but still too dark, and the red is way off, twice as far so adjust those. also make there be an indent for those which are disabled i.e. ----- Enter Environment Name first------ , also the acl sheet name and acl column name should have the disabled coloring also"

### Changed
- Adjusted field background tints: green empty `#101d18` (slightly brighter), red disabled `#141012` (much closer to base `#0d1117` — halved the distance)
- Disabled field placeholders now use box-drawing dashes as visual indent: `───  Enter Environment Name first  ───`
- ACL Sheet Name and ACL Column Name fields now properly receive disabled background tint via `setFieldDisabled()` in `toggleAclDetails()`

#### `gas-project-creator.html` — v01.40w

##### Changed
- Adjusted background tint colors for better visibility and subtlety
- Disabled field placeholder text now visually indented with dashes

## [v09.34r] — 2026-04-06 10:41:18 PM EST

> **Prompt:** "they are too dark, also make it so that if they are disabled have the fields not be prefilled. in fact it should mention what field needs to be filled for that particular field to be activated"

### Changed
- Lightened field background tints: empty enabled fields from `#0e1513` to `#0f1a16`, disabled fields from `#140e0e` to `#1a0f0f`
- Disabled fields now clear their prefilled values and show placeholder text explaining what prerequisite is needed (e.g. "Enter Environment Name first", "Enter Spreadsheet ID first", "Enter OAuth Client ID first", "Enter Master ACL Spreadsheet ID first")
- Values are saved before disabling and restored when the field becomes enabled again
- Refactored `setFieldDisabled()` to accept a `reason` parameter and manage value save/restore lifecycle
- Updated `toggleAclDetails()` to use `setFieldDisabled()` for ACL detail fields with reason text

#### `gas-project-creator.html` — v01.39w

##### Changed
- Disabled fields now show what prerequisite is needed instead of showing prefilled values
- Background tints lightened for better visibility

## [v09.33r] — 2026-04-06 10:36:51 PM EST

> **Prompt:** "the fields that are blank but available to be edited, have their background be veeery opaque light green, same tone as the dark blue/black, the fields that are disabled have a veeery opaque light red, same dark tone, they should be very subtle"

### Changed
- Added subtle background color tints to gas-project-creator form fields: empty enabled fields get a very subtle green tint (`#0e1513`), disabled fields get a very subtle red tint (`#140e0e`) — both blend with the dark `#0d1117` base
- Added `updateEmptyClasses()` function that applies/removes the `.field-empty` CSS class based on field state
- Added global `input` event listener to keep empty-class state in sync as the user types

#### `gas-project-creator.html` — v01.38w

##### Changed
- Empty fields now have a very subtle green background tint to indicate they're available
- Disabled fields now have a very subtle red background tint to indicate they're unavailable

## [v09.32r] — 2026-04-06 10:30:21 PM EST

> **Prompt:** "the master acl spreadsheet toggle when active then removed is showing the projects spreadsheet as the master ACL, it should be removing what was put in the field if the toggle is removed, unless the user had already personally put information there before they toggled, but it shouldnt hold onto the spreadsheet ID above"

### Fixed
- Fixed Master ACL toggle retaining the project's Spreadsheet ID after unchecking — now saves the user's pre-toggle value and restores it on uncheck (empty if they hadn't entered anything, their custom ID if they had)

#### `gas-project-creator.html` — v01.37w

##### Fixed
- Master ACL toggle no longer leaves the project spreadsheet ID in the field after unchecking

## [v09.31r] — 2026-04-06 10:25:37 PM EST

> **Prompt:** "in the optional fields that will do something when left blank, write in what it will do/say, i.e. for the Title (Optional) etc . also make it so that the relevant sectiosn that have a required component, make it s othat the other fields are disabled while the required field is empty, i.e. Project Environment Name (required) and OAuth Client ID (required for auth)"

### Changed
- Updated all optional field labels to describe their default behavior when left blank (Title, Spreadsheet ID, Sheet Tab Name, Sound File ID, Splash Logo, GitHub Branch, Allowed Domains)
- Updated field hints to describe what happens when the field is empty
- Project config fields (Title through GitHub Branch) now disabled until Environment Name is filled
- Auth sub-fields (Auth Preset, Allowed Domains, Master ACL section) now disabled until OAuth Client ID is filled
- Refactored `updateFieldStates()` to manage the full dependency chain: Environment Name → project fields, Spreadsheet ID → Sheet Tab Name, Client ID → auth sub-fields

#### `gas-project-creator.html` — v01.36w

##### Changed
- Optional fields now describe their default behavior in the label
- Form fields disabled until their prerequisite required fields are filled

## [v09.30r] — 2026-04-06 10:16:16 PM EST

> **Prompt:** "make the sheet name also prefill itself as Live_Sheet, change the Sheet Name (optional) to mention that its referring to the tab. make it so that if master ACL spreadsheet ID is field, not only does it show the extra 2 fields, but those now become required. also if the spreadsheet ID is not entered, the other fields which depend on that should not be shown either, i.e. the sheet name, authentication settings, etc. actually instead of hiding all of these fields if not relevant, just make the fields inactive so that we can see that something is missing before filling them out. if they will never be relevant no matter what, for example when not using google authentication then you can hide them"

### Changed
- Pre-filled Sheet Tab Name with `Live_Sheet` default value and renamed label from "Sheet Name (optional)" to "Sheet Tab Name (optional)"
- ACL Sheet Name and ACL Column Name fields now become required (with red label) when Master ACL Spreadsheet ID is filled
- ACL detail fields now show as disabled/inactive instead of hidden when no Master ACL ID is present — visible but grayed out to indicate a prerequisite is missing
- Sheet Tab Name field becomes disabled when Spreadsheet ID is empty — signals the dependency
- Master ACL checkbox becomes disabled when no Spreadsheet ID is entered (can't auto-fill from nothing)
- Added `updateFieldStates()` function to manage dependent field disabled states based on Spreadsheet ID presence

#### `gas-project-creator.html` — v01.35w

##### Changed
- Form fields now show as disabled when their prerequisites are not met, rather than being hidden
- Sheet name field pre-filled with default value
- ACL fields become required when Master ACL is configured

## [v09.29r] — 2026-04-06 10:02:14 PM EST

> **Prompt:** "change the default sheet name to Access to match what we are already using. also make it more clear what the ACL Page Name means, in reference to identifying this page, i know that its in the description but i need it to be clear by the heading name. also have the ACL Page Name default to whatever the user put in their project environment name (i think thats how we already have it with the other projects, verify if thats true) . any fields that should not be filled when not relevant should be hidden in the gas-project-creator when relevant conditions are met.  also the button "Copy Embedding Page HTML — optional, the setup script creates this automatically" should have the "optional" text as the prefix instead of how it is. the default auth preset should be set to hipaa instead of standard"

### Changed
- Changed ACL Sheet Name default from `"ACL"` to `"Access"` in gas-project-creator form field, copyGsCode fallback, copyConfig fallback, and setup script — matches what all existing projects use
- Renamed "ACL Page Name" label to "ACL Column Name (identifies this page)" for clarity
- Added live placeholder sync on ACL Column Name field — shows "Defaults to: {envName}" as user types Environment Name
- Hidden ACL Sheet Name and ACL Column Name fields by default — they now appear only when a Master ACL Spreadsheet ID is present (either via checkbox auto-fill or manual entry)
- Reordered Copy HTML button text to prefix with "Optional" instead of appending it
- Changed default auth preset from `standard` to `hipaa` in gas-project-creator dropdown and setup script — matches the GAS template's existing default
- Updated setup script's ACTIVE_PRESET sed condition and pattern to match the new `hipaa` template default

#### `gas-project-creator.html` — v01.34w

##### Changed
- ACL configuration fields now appear only when relevant
- Default security preset changed to HIPAA
- Default ACL sheet name updated to match existing projects
- Clearer labeling for page identification in ACL settings

## [v09.28r] — 2026-04-06 07:41:52 PM EST

> **Prompt:** "analyze the gas-project-creator and associated setup-gas-project.sh to see if using it on a new program will create html and gas non project specific (template) code identical to any of the environments we have (testauth1, globalacl, programportal). if not, address whatever is not correctly set up, all projects should foundationally have identical code, except for project specific code."

### Changed
- Changed noauth GAS template SHEET_NAME default from `"Live_Sheet"` to `"YOUR_SHEET_NAME"` for consistency with auth template
- Added GITHUB_BRANCH form field to gas-project-creator with hint to use `main` for setup script
- Added GITHUB_BRANCH substitution in `copyGsCode()` — now replaces template default with form field value
- Made setup script read GITHUB_BRANCH from config JSON (with `main` default) instead of hardcoding
- Changed setup script SHEET_NAME default from `'Live_Sheet'` to `'YOUR_SHEET_NAME'` for consistency with templates

### Added
- Added optional "Copy Embedding Page HTML" button to gas-project-creator — fetches auth/noauth HTML template, substitutes config values (title, deployment URL, CLIENT_ID, logo), copies to clipboard. Minimal styling to indicate it's optional (the setup script handles this automatically)

#### `gas-project-creator.html` — v01.33w

##### Added
- New option to copy the embedding page HTML with your project settings pre-filled
- GitHub Branch configuration field

##### Changed
- Minor internal improvements

## [v09.27r] — 2026-04-06 07:14:03 PM EST

> **Prompt:** "move the archived test functions from live-site-pages/templates/gas-test-functions-reference.js.txt to repository-information/archive info/GAS-TEST-FUNCTIONS-REFERENCE.md as a proper markdown document with code blocks. Delete the .js.txt version."

### Changed
- Moved archived GAS test functions reference from `live-site-pages/templates/gas-test-functions-reference.js.txt` to `repository-information/archive info/GAS-TEST-FUNCTIONS-REFERENCE.md` as a proper markdown document with code blocks

### Removed
- Deleted `live-site-pages/templates/gas-test-functions-reference.js.txt` (content migrated to archive info)

#### `gas-project-creator.html` — v01.32w

##### Changed
- Updated internal reference comment to point to new archive location

## [v09.26r] — 2026-04-06 05:03:52 PM EST

> **Prompt:** "review the testauth1, globalacl, programportal, and related templates, html and gas files; to see how close they are to having identical in code, whitespace, cosmetic diffs, and code ordering in their non project specific html and gas codes, our goal is to have all of them match exactly for non project specific code"

### Changed
- Added `// PROJECT OVERRIDE:` markers to testauth1.html for HEARTBEAT_INTERVAL test value (60000) and session duration test values (180s/300s) — prevents template propagation from overwriting project-specific test configurations
- Added `// PROJECT OVERRIDE:` markers to programportal.html for HEARTBEAT_INTERVAL test value (30000) and SSO_PROVIDER (true)
- Removed "Include Test Features" checkbox and test template logic from gas-project-creator.html — all new projects now use minimal GAS templates only
- Updated setup-gas-project.sh to remove INCLUDE_TEST support — template selection is now auth/noauth only

### Removed
- Deleted `gas-test-auth-template-code.js.txt` and `gas-test-noauth-template-code.js.txt` — consolidated into minimal templates to eliminate confusion between 4 template variants
- Removed test template references from `.claude/rules/gas-scripts.md`, `.claude/rules/html-pages.md`, `REPO-ARCHITECTURE.md`, and `README.md`

### Added
- Created `gas-test-functions-reference.js.txt` — archived 6 test/diagnostic GAS functions (extended getAppData, getSoundBase64, writeVersionToSheet, readB1FromCacheOrSheet, onEditWriteB1ToCache, fetchGitHubQuotaAndLimits) for future reuse

#### `testauth1.html` — v03.97w
##### Changed
- Minor internal improvements

#### `programportal.html` — v01.93w
##### Changed
- Minor internal improvements

#### `gas-project-creator.html` — v01.31w
##### Changed
- Simplified project creation workflow

## [v09.25r] — 2026-04-06 03:36:19 PM EST

> **Prompt:** "can you make the gas cleanly separated also, removing orphan components, and considering all components in all projects to be considered template code. so address every issue you mentioned considering"

### Changed
- Reclassified shared template code: removed `PROJECT: ` prefix from admin role detection, admin panel styles, admin badge, admin panel logic, and sign-in/sign-out checklist markers across all GAS and HTML files — these are template code, not project code
- Fixed orphan `// PROJECT END` in GAS test-auth template (had 3 ENDs vs 2 STARTs, now 2/2)
- Wrapped multi-line project-specific code blocks in testauth1.html with proper `// PROJECT START/END` pairs (message types, signature-exempt types, sandbox capture, auth context send, panel cooldown)
- Wrapped globalacl.html message type whitelist with `// PROJECT START/END` pair
- Applied same admin marker reclassification to `gas-minimal-auth-template-code.js.txt`

#### `testauth1.html` — v03.96w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.86w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.92w

##### Changed
- Minor internal improvements

#### `testauth1.gs` — v02.57g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.51g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.59g

##### Changed
- Minor internal improvements

## [v09.24r] — 2026-04-06 01:50:46 PM EST

> **Prompt:** "review the testauth1, globalacl, programportal, and related templates, html and gas files; to see how close they are to having identical in code, whitespace, and code ordering in their non project specific html and gas codes, our goal is to have all of them match exactly for non project specific code"

### Changed
- Fixed `sourceDisplayName` in all 3 auth HTML pages to use `document.title` instead of hardcoded strings — matches the auth template
- Normalized `// PROJECT START` comment in all 3 auth HTML pages to include ` — Add your project-specific JavaScript here` suffix — matches the auth template
- Added missing `<!-- YOUR PAGE CONTENT HERE -->` placeholder comment to programportal.html PROJECT block — matches the auth template
- Fixed HEARTBEAT_INTERVAL comment in auth template from inaccurate "poll GAS for fresh data" to correct "check for activity and send heartbeat"

#### `testauth1.html` — v03.95w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.85w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.91w

##### Changed
- Minor internal improvements

## [v09.23r] — 2026-04-06 01:27:02 PM EST

> **Prompt:** "the ~4 cosmetic blank line diffs around PROJECT markers should also match"

### Changed
- Fixed all remaining blank line inconsistencies around PROJECT markers in testauth1.gs, globalacl.gs, and programportal.gs — stripped non-project code now has zero blank-line diffs against the template

#### `testauth1.gs` — v02.56g
##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.50g
##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.58g
##### Changed
- Minor internal improvements

## [v09.22r] — 2026-04-06 01:09:51 PM EST

> **Prompt:** "continue"

### Changed
- Added version display (`<h2 id="version">`), user-email display (`<div id="user-email">`), and gas-layer-toggle button + JS to minimal-auth GAS template — these elements were present in all production auth scripts but missing from the minimal template
- Added `#user-email` CSS to minimal-auth GAS template to match test-auth template

## [v09.21r] — 2026-04-06 01:03:28 PM EST

> **Prompt:** "continue"

### Changed
- Added admin panel JS logic (~478 lines) to minimal-auth GAS template — all production auth scripts share this code but it was missing from the minimal template, forcing manual addition for every new project
- Fixed blank line inconsistency in testauth1.gs doGet to match template (single → double blank before admin role detection)

#### `testauth1.gs` — v02.55g
##### Changed
- Minor internal improvements

## [v09.20r] — 2026-04-06 12:55:06 PM EST

> **Prompt:** "continue"

### Changed
- Removed unnecessary `// PROJECT START — testauth1 admin panel logic` / `// PROJECT END` wrapper from testauth1.gs — admin panel code is template code with inline `// PROJECT:` marker, matching globalacl and programportal
- Fixed extra `// ══════════════` separator lines around empty PROJECT block in globalacl.gs to match template format
- Added `// PROJECT:` markers to `_gasSandboxSource` variable and gas-auth-ok handler extension in testauth1.html for template propagation awareness

#### `testauth1.gs` — v02.54g
##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.49g
##### Changed
- Minor internal improvements

## [v09.19r] — 2026-04-06 12:43:26 PM EST

> **Prompt:** "review the testauth1, globalacl, programportal, and related templates, html and gas files; to see how close they are to having identical in code, whitespace, and code ordering in their non project specific html and gas codes, our goal is to have all of them match exactly for non project specific code"

### Changed
- Removed ~160 lines of programportal-specific code (portal header, app cards, toggles, registry) that had leaked into the GAS auth template (`gas-minimal-auth-template-code.js.txt`)
- Added HMAC liveData stripping to HTML auth template and all three auth pages — prevents JSON.stringify mismatches between GAS V8 and browser engines for messages containing nested objects
- Normalized testauth1.html HMAC comment to match template (removed PROJECT marker since this is now standard template code)

#### `testauth1.html` — v03.94w
##### Changed
- Improved message signature verification for nested data

#### `globalacl.html` — v01.84w
##### Changed
- Improved message signature verification for nested data

#### `programportal.html` — v01.90w
##### Changed
- Improved message signature verification for nested data

## [v09.18r] — 2026-04-06 12:03:46 PM EST

> **Prompt:** "yes"

### Changed
- Fixed CSS baseline in both noauth GAS templates: `overflow: auto` → `overflow: hidden`, `font-family: Arial` → `font-family: sans-serif`

## [v09.17r] — 2026-04-06 11:56:31 AM EST

> **Prompt:** "now apply the same to the templates"

### Changed
- Synchronized GAS auth template files to match canonical programportal.gs shared code
- Fixed CSS baseline in both auth templates: `overflow: auto` → `overflow: hidden`, `font-family: Arial` → `font-family: sans-serif`
- Fixed action handler ordering in `gas-test-auth-template-code.js.txt`: moved `getNonce` before `phaseA` to match canonical order
- Replaced simplified `listActiveSessionsInternal()` in test-auth template with the canonical spreadsheet-based implementation

## [v09.16r] — 2026-04-06 11:45:32 AM EST

> **Prompt:** "make all 3 match identically in non project specific code"

### Changed
- Synchronized non-project-specific (shared template) code across all 3 GAS files (testauth1.gs, globalacl.gs, programportal.gs) to be character-for-character identical using programportal as canonical source
- Added missing JSDoc comments and cross-project section headers to testauth1.gs and globalacl.gs
- Canonicalized comment style, verbosity, and inline comment format across all shared functions
- Reordered doGet action handlers in testauth1.gs to match canonical order (listSessions/setAdminSecret/adminSignOut/getNonce before phaseA)
- Added missing PostMessage handshake guard to globalacl.gs client-side JS
- Added missing HMAC migration and Phase 3 IP logging comments to globalacl.gs
- Wrapped leaked project-specific code in proper PROJECT markers across all 3 files:
  - testauth1: version display, user-email div, GAS toggle, admin panel JS, CSS overrides
  - globalacl: cross-project admin functions, ACL management UI logic, custom confirm dialog, version display, ACL table HTML, base CSS overrides
  - programportal: portal header/layout HTML, portal application registry JS
- Standardized CSS baseline across all files (overflow: hidden, font-family: sans-serif)

#### `testauth1.gs` — v02.53g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.48g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.57g

##### Changed
- Minor internal improvements

## [v09.15r] — 2026-04-06 10:42:45 AM EST

> **Prompt:** "continue"

### Changed
- Rebuilt GAS auth template (`gas-minimal-auth-template-code.js.txt`) from unified programportal.gs source using copy-and-placeholder approach
- Template now matches all 3 live auth GAS files exactly in shared code — only 13 diff hunks remain, all expected config placeholders and empty PROJECT blocks
- Replaced 12 config values with template placeholders: VERSION → `v01.00g`, TITLE → `TEMPLATE_TITLE`, GITHUB_OWNER → `TEMPLATE_GITHUB_OWNER`, GITHUB_REPO → `TEMPLATE_GITHUB_REPO`, FILE_PATH → `TEMPLATE_FILE_PATH`, DEPLOYMENT_ID → `TEMPLATE_DEPLOYMENT_ID`, EMBED_PAGE_URL → `TEMPLATE_EMBED_PAGE_URL`, SPREADSHEET_ID → `YOUR_SPREADSHEET_ID`, SHEET_NAME → `YOUR_SHEET_NAME`, SOUND_FILE_ID → `YOUR_SOUND_FILE_ID`, MASTER_ACL_SPREADSHEET_ID → `YOUR_MASTER_ACL_SPREADSHEET_ID`, ACL_PAGE_NAME → `TEMPLATE_ACL_PAGE_NAME`
- Stripped all 7 PROJECT blocks to empty placeholders with generic guide descriptions
- Removed programportal-specific ANNOUNCEMENTS_SHEET_NAME config, `_userRole`/`_userName` JS variables
- Fixed body CSS to template defaults (`overflow: auto`, `font-family: Arial`)
- Template reduced from 6,802 → 6,528 lines (cleaner project code stripping)

## [v09.14r] — 2026-04-06 10:36:57 AM EST

> **Prompt:** "continue"

### Changed
- Added `<!-- PROJECT START -->` / `<!-- PROJECT END -->` block markers in doGet HTML body for testauth1 (Live Data App + delete modal) and programportal (announcements + app cards + footer + GAS toggle)
- Converted `// PROJECT: Live Data App` JS single-line marker to `// PROJECT START` / `// PROJECT END` block in testauth1.gs (wrapping ~555 lines of live data table UI logic)
- Converted `// PROJECT: Global sessions loader` JS single-line marker to `// PROJECT START` / `// PROJECT END` block in globalacl.gs (wrapping ~78 lines of cross-project session management)
- Removed orphaned `// PROJECT END` before `</script>` in testauth1.gs and globalacl.gs (no matching START — were leftover from original file creation)
- All 3 GAS files now have balanced PROJECT START/END markers: testauth1 (8 pairs), globalacl (6 pairs), programportal (7 pairs)

#### `testauth1.gs` — v02.52g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.47g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.56g

##### Changed
- Minor internal improvements

## [v09.13r] — 2026-04-06 10:30:24 AM EST

> **Prompt:** "continue with next phase"

### Changed
- Added proper `/* PROJECT START */` / `/* PROJECT END */` CSS block markers in doGet HTML template for all 3 auth GAS files — wrapping testauth1's Live Data App styles (130 lines), globalacl's ACL table/modal/toolbar styles (75 lines), and programportal's portal layout + announcements styles (186 lines)
- Fixed misleading phaseA handler comment in programportal.gs and globalacl.gs (was `// Security event action`, now correctly `// Phase A — HIPAA Privacy Rule operations listener`)
- Added missing `// Security event action` comment before actual securityEvent handler in programportal.gs and globalacl.gs
- Converted single-line `/* PROJECT: */` CSS annotations to proper block markers with clear start/end boundaries

#### `testauth1.gs` — v02.51g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.46g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.55g

##### Changed
- Minor internal improvements

## [v09.12r] — 2026-04-06 10:23:27 AM EST

> **Prompt:** "continue with next phase"

### Changed
- Unified doGet action handler comments across all 3 auth GAS files — fixed misleading `// Security event action` comment (was labeling phaseA handler), added `// Security event action` comment before actual securityEvent handler in programportal.gs and globalacl.gs, removed misplaced `// Cross-project admin sign-out` comment from programportal.gs setAdminSecret section, unified `// Auto-register` and `// Normal flow:` comments
- Added `// PROJECT START`/`// PROJECT END` markers around testauth1's `getData` action handler
- Added `// PROJECT START`/`// PROJECT END` markers around globalacl's `adminGlobalSessions` action handler
- Marked `ensureCrossProjectSecret()` call in globalacl doGet with `// PROJECT:` annotation
- Added `// PROJECT START`/`// PROJECT END` markers around project-specific pre-HTML data loading in all 3 files (testauth1: `getCachedData()`, globalacl: `loadACLData()`, programportal: `getUserAppAccess()` + `getCachedAnnouncements()`)
- Unified `// Session valid` comment before `var html` across all 3 files
- Removed extra `// Both paths are valid` comment block from testauth1

#### `testauth1.gs` — v02.50g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.45g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.54g

##### Changed
- Minor internal improvements

## [v09.11r] — 2026-04-06 10:10:52 AM EST

> **Prompt:** "continue where we left off in SESSION-CONTEXT"

### Changed
- Added proper `// PROJECT START` / `// PROJECT END` markers around project-specific data operation functions in all 3 auth GAS files — `saveNote` and `processDataPoll` in testauth1.gs, 12 ACL management functions in globalacl.gs, `getUserAppAccess` in programportal.gs
- Added template example comments to DATA OPERATIONS section header in testauth1.gs and globalacl.gs (matching programportal.gs)
- Removed duplicate `// AUTH — Page Nonce (postMessage handshake)` section headers from testauth1.gs and globalacl.gs (programportal.gs has just the plain function comment)
- Fixed extra blank line before HIPAA COMPLIANCE section in testauth1.gs
- Unified blank line patterns around PROJECT markers for consistent stripping

#### `testauth1.gs` — v02.49g

##### Changed
- Minor internal improvements

#### `globalacl.gs` — v01.44g

##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.53g

##### Changed
- Minor internal improvements

## [v09.10r] — 2026-04-06 09:45:41 AM EST

> **Prompt:** "now that the non project specific code between testauth1, globalacl, and programportal are identical, update the template html and gs codes to match the non project specific code identically (other than the placeholders used by the templates with the corresponding setup-gas-project.sh script through gas-project-creator which should also be updated so that projects created moving forward have identical non project specific code."

### Changed
- Added `<!-- YOUR PAGE CONTENT HERE -->` placeholder back to auth template's HTML PROJECT block
- Added description suffix to `// PROJECT START` JS comment in auth template

## [v09.09r] — 2026-04-06 09:42:41 AM EST

> **Prompt:** "now that the non project specific code between testauth1, globalacl, and programportal are identical, update the template html and gs codes to match the non project specific code identically (other than the placeholders used by the templates with the corresponding setup-gas-project.sh script through gas-project-creator which should also be updated so that projects created moving forward have identical non project specific code."

### Changed
- Rebuilt auth HTML template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) from the unified programportal.html source — template non-project code now matches all 3 live auth pages exactly
- Applied placeholder replacements: `TEMPLATE_TITLE`, `YOUR_CLIENT_ID`, empty `var _e`, `v01.00w` initial version, `document.title` for sourceDisplayName, production config defaults (HEARTBEAT_INTERVAL: 300000, SSO_PROVIDER: false)
- Removed project-specific `_updateReconnectStage('rc-stage-sso')` from template
- GAS template sync deferred — live GAS files need unification first (same process as HTML)

## [v09.08r] — 2026-04-06 09:18:24 AM EST

> **Prompt:** "whatever makes them match 100%"

### Changed
- Removed dead `_gasSandboxSource` code from globalacl.html (declared, set, and cleared but never read — only testauth1 uses it for ld-init postMessage)
- Removed dead `_closeAllPanelsExcept(null)` call from globalacl.html showAuthWall (no panels registered — call was a no-op)
- Unified globalacl.html whitespace and comment text to match programportal/testauth1 template code

#### `globalacl.html` — v01.83w

##### Removed
- Dead `_gasSandboxSource` variable and all references (4 locations)
- Dead `_closeAllPanelsExcept(null)` call in showAuthWall

##### Fixed
- Added missing blank line in showApp after `_ssoUserEmail` assignment
- Removed description from `// PROJECT START` comment to match other pages

## [v09.07r] — 2026-04-06 09:08:47 AM EST

> **Prompt:** "get it to 100% addressing whitespace and code ordering. it should in theory also match the globalacl at the point"

### Changed
- Achieved 100% non-project template code unification between programportal.html, testauth1.html, and globalacl.html

#### `programportal.html` — v01.89w

##### Fixed
- Added missing blank line before SSO indicator comment in startCountdownTimers
- Moved SSO indicator click handler from before "Use Here" to after page load IIFE (matching testauth1/globalacl position)
- Unified SSO indicator click handler comment text ("when user clicks 'retry'" matching testauth1/globalacl)

## [v09.06r] — 2026-04-06 08:56:31 AM EST

> **Prompt:** "yes"

### Changed
- Unified programportal.html non-project template code to match testauth1.html and globalacl.html

#### `programportal.html` — v01.88w

##### Fixed
- Restored `loadIframeViaNonce()` in showApp DOM clearing reload and storage event login sync (was incorrectly using direct `?session=` URLs — breaks replay protection)
- Fixed line-merge bugs in sign-in and sign-out stage checklist logic (comment and `var` declaration merged onto same line)
- Restored client-side session expiry pre-check on page load (absolute + rolling timeout) to match testauth1/globalacl
- Restored `_expectingSession` comment in page load session resume
- Unified "Use Here" tab reclaim handler structure to match testauth1/globalacl
- Unified comment formatting across ~15 template code areas (SSO section header, heartbeat interval, data poll interval, sign-in checklist, sign-out checklist, auth error comments, performSignOut SSO comments, nonce flow documentation)

## [v09.05r] — 2026-04-06 08:31:35 AM EST

> **Prompt:** "if there is identical code, i want them in exactly the same place (relatively)"

### Changed
- Reorganized testauth1.gs to match globalacl.gs section structure — HIPAA config variables (BREACH_ALERT_CONFIG, HIPAA_RETENTION_CONFIG, LEGAL_HOLD_CONFIG, INTEGRITY_CONFIG, REPRESENTATIVE_CONFIG, HIPAA_DEADLINES) and shared utility functions (generateRequestId, formatHipaaTimestamp, validateIndividualAccess, getOrCreateSheet, wrapPhaseAOperation) moved from mid-file to after serverSignOut(), with globalacl-style section headers (HIPAA COMPLIANCE — Configuration, Shared Utilities, Phase A/B/C)
- Fixed processHeartbeat() return from 2-line assignment+return to 1-line inline return to match globalacl
- Marked evaluateBreachAlert call as PROJECT-specific (was labeled Phase B)

#### `testauth1.gs` — v02.48g
##### Changed
- Minor internal improvements

## [v09.04r] — 2026-04-06 08:10:11 AM EST

> **Prompt:** "review the text-compare.html we made, in the screenshot you can see the testauth1 on the left and the globalacl on the right. it doesnt really make sense for the left to be original and the right to be changed, it should be able to show me the differences between the two, and it doesnt make sense that i dont see the project specific code for the globalacl, is the project specific code in the right location in the code?"

### Changed
- Updated text-compare.html labeling from directional "Original"/"Changed" to neutral "Text A"/"Text B" terminology — the tool now works as a peer comparison tool rather than implying one side is the source of truth
- Updated stats labels from "Added"/"Removed" to "Only in B"/"Only in A" for neutral language
- Updated diff headers from "Original (red = removed)"/"Changed (blue = added)" to "Text A (red = only in A)"/"Text B (blue = only in B)"
- Updated unified diff output header from "--- Original/+++ Changed" to "--- Text A/+++ Text B"

#### `text-compare.html` — v01.08w
##### Changed
- Changed panel labels from "Original Text" / "Changed Text" to "Text A" / "Text B"
- Changed diff headers, stats labels, and copy-diff output to use neutral comparison language

