# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 80/100`

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

## [v09.03r] — 2026-04-05 11:39:42 PM EST

> **Prompt:** "get it to 100%, other than project specific code which should be clearly in a specific separated section"

### Changed
- Fixed remaining cosmetic differences in shared auth code between testauth1.html and globalacl.html — removed extra blank lines, aligned comment wording, added missing "Fall through" comment — shared code is now 100% identical

#### `testauth1.html` — v03.93w
##### Changed
- Minor internal improvements

## [v09.02r] — 2026-04-05 11:20:04 PM EST

> **Prompt:** "the following is the comparison between testauth1 and globalcl, i want their non project specific code to be idential, so address that."

### Changed
- Unified shared auth/template code between testauth1.html and globalacl.html — non-project-specific code is now identical
- Replaced fetch()-based heartbeat in testauth1 with iframe+postMessage approach (token never in URL, HIPAA-aligned)
- Removed `_fetchPausedForGIS` from both files (no longer needed with iframe-based heartbeat)
- Added `_gasSandboxSource` to globalacl (shared auth infrastructure for GAS sandbox frame communication)
- Restored `loadIframeViaNonce()` usage in globalacl for cross-tab sync and DOM clearing reload (session replay protection)
- Added comprehensive documentation to `loadIframeViaNonce()` explaining the 7-attempt history (v05.59r–v05.70r), CacheService limitations, and design tradeoffs
- Separated project-specific message types from shared `_KNOWN_GAS_MESSAGES` and `_SIG_EXEMPT` with `// PROJECT:` markers in both files
- Added stale session checks on page load in testauth1 (already in globalacl) — prevents "Reconnecting" for expired sessions
- Added `applyUIGating()` and role badge display to testauth1's `showApp()` (already in globalacl)
- Moved panel cooldown system to PROJECT section in testauth1 (shared panel registry kept as template code)
- Fixed AUTH END CSS comment formatting in testauth1 (added proper separators)
- Moved `.html-layer-hidden` CSS to PROJECT CSS section in testauth1
- Standardized SSO section comment header across both files
- Cleaned up stale comments (data poll migration, CacheService, redundant code annotations)
- Made IP logging comment generic (`your project's .gs file` instead of page-specific reference)
- Added `_closeAllPanelsExcept(null)` to globalacl's `showAuthWall()` (was missing)

#### `testauth1.html` — v03.92w
##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.82w
##### Changed
- Minor internal improvements

## [v09.01r] — 2026-04-05 10:23:46 PM EST

> **Prompt:** "have it default hide equal lines"

### Changed
- "Hide equal lines" is now checked by default on text-compare tool — differences are shown immediately without needing to toggle

#### `text-compare.html` — v01.07w

##### Changed
- Equal lines are now hidden by default — only differences are shown after comparing

## [v09.00r] — 2026-04-05 10:18:48 PM EST

> **Prompt:** "its only showing me the context lines used in the smart context AFTER i clicked the copy button, can it initially happen and as soon as its toggled"

### Fixed
- Smart context value now displays immediately when comparison runs and when the toggle is switched, not only after clicking Copy Context Diff

#### `text-compare.html` — v01.06w

##### Fixed
- Smart context value now shows as soon as comparison results appear and updates immediately when toggling smart context on/off

## [v08.99r] — 2026-04-05 10:13:25 PM EST

> **Prompt:** "yes implement that"

### Changed
- Replaced fixed context lines input with "Smart context" auto mode on text-compare tool — dynamically expands context per change hunk (up to 10 lines), filling gaps between nearby changes automatically
- Context lines input now shows the auto-computed value when smart mode is active (read-only, dimmed), and becomes editable when smart mode is unchecked

#### `text-compare.html` — v01.05w

##### Changed
- Context lines now auto-computed when "Smart context" is checked — shows the effective value in the input so you can see what's being used
- Unchecking "Smart context" makes the input editable for manual override

## [v08.98r] — 2026-04-05 10:02:05 PM EST

> **Prompt:** "ok make that clear to the user that that will be the case. also the Ignore leading/trailing whitespace Ignore case Template only toggles, do those have to be toggled before the compare button is pressed? if so then have them in a separate labeled section to the hide equal lines toggle"

### Changed
- Split text-compare controls into labeled groups: "Before Compare" (whitespace, case, template only) and "Display" (hide equal lines) so users know which must be set before clicking Compare
- Added color-coded column headers: "Original (red = removed)" in red, "Changed (blue = added)" in blue, making the color convention immediately clear

#### `text-compare.html` — v01.04w

##### Changed
- Controls split into "Before Compare" and "Display" groups with labeled borders
- Column headers now show color coding: red for original/removed, blue for changed/added

## [v08.97r] — 2026-04-05 09:48:10 PM EST

> **Prompt:** "can you have it also have a toggle to hide all rows that are identical on both so i can see just the differences"

### Added
- "Hide equal lines" toggle on text-compare tool that hides all identical rows in the side-by-side diff view, showing only differences

#### `text-compare.html` — v01.03w

##### Added
- "Hide equal lines" checkbox that filters the visual diff to show only added, removed, and modified lines

## [v08.96r] — 2026-04-05 09:44:11 PM EST

> **Prompt:** "for testing, i am comparing the code of live-site-pages/testauth1.html and live-site-pages/globalacl.html , use that context to come up with something useful, in this example my goal is to make it so that we can quickly see whether the foundational code between the two is identical and only the project specific code is different"

### Added
- "Template Only" comparison mode to text-compare tool that strips PROJECT blocks before comparing, showing only TEMPLATE/foundational code differences
- Template-specific identical message: "Template code is identical — only PROJECT blocks differ"
- Template-only header annotation in Copy Context Diff output explaining that PROJECT blocks were stripped

#### `text-compare.html` — v01.02w

##### Added
- "Template only" toggle that strips project-specific code sections before comparing, so you can verify foundational code is identical across pages
- Enhanced "identical" message that clarifies when only project-specific sections differ
- Template-only annotation in exported diff output

## [v08.95r] — 2026-04-05 09:35:38 PM EST

> **Prompt:** "the text-compare seems to be working perfectly. ideally it would be able to show enough context so that we can extract the differences between the two texts in the case where i am comparing 2 codes, so i need it to output something that i can then give to you for you to consolidate the two in the parts where i want them identical"

### Added
- "Copy Context Diff" button on text-compare page that generates a unified-diff-style text output with configurable context lines (default 3), optimized for pasting to AI for code consolidation
- Configurable context lines input (0–50) to control how many surrounding equal lines appear around each change hunk

#### `text-compare.html` — v01.01w

##### Added
- "Copy Context Diff" export button with clipboard copy and visual feedback
- Context lines configuration (default 3 lines of surrounding context per change hunk)
- Unified diff format output (`--- Original` / `+++ Changed` / `@@ ... @@` headers / `-`/`+` line markers)

## [v08.94r] — 2026-04-05 09:14:34 PM EST

> **Prompt:** "even though it is written in the reminder and supposedly in the claude.md , you did not immediately apply the following by default "Write in small chunks — use Edit to add subsequent sections one at a time. Do not attempt to write the entire document in a single Write call — large writes can stall or fail silently. Build it up incrementally" . how can we ensure that every single time you will follow this? evaluate why you didnt this time and map out the most consistent way for you to do this moving forward"

### Changed
- Converted "Incremental Writing" rule from advisory guidance to a hard procedural gate with a strict 50-line Write limit — modeled after the Response Opener gate pattern that solved the same class of compliance failure
- Removed contradicting escape hatch ("do not force this if a single Write is simpler") from the "Large file writes" Execution Style rule — now points to the Incremental Writing gate

## [v08.93r] — 2026-04-05 08:40:51 PM EST

> **Prompt:** "make an html page which does the same as https://text-compare.com/ , where you can put two different texts in different columns, and it tells the user all the similarities and differences and points out where the differences are."

### Added
- New Text Compare tool page (`text-compare.html`) — side-by-side text comparison with line-level and character-level diff highlighting, statistics bar (equal/added/removed/modified counts), swap and clear controls, options to ignore whitespace and case, synchronized scroll, and keyboard shortcut (Ctrl+Enter)

## [v08.92r] — 2026-04-05 06:59:44 PM EST

> **Prompt:** "go ahead and get started with your remediation recommendations with emphasis on removing dead code"

### Changed
- Removed dead duplicate Phase B config blocks (BREACH_ALERT_CONFIG, HIPAA_RETENTION_CONFIG, LEGAL_HOLD_CONFIG, INTEGRITY_CONFIG, REPRESENTATIVE_CONFIG) from globalacl.gs and programportal.gs — pre-template copies were silently overwritten by auth-section copies (174 lines of dead code removed)
- Updated auth HTML template to match projects: CSS comment cleanup, signout sub-steps reordering, PROJECT block cleanup, `'Almost ready…'` → `'Sign-in complete'` text fix
- Added `_updateSubStep()` calls to auth HTML template — function definition existed but was never called (dead code until now)
- Restored missing frame-handshake-challenge handler and nonce message handlers in globalacl.html — nonce variables/function were dead code without the handlers
- Fixed section ordering in globalacl.gs (ADMIN UTILITIES → CROSS-PROJECT reversed to match template canonical order: CROSS-PROJECT → ADMIN UTILITIES)
- Moved admin utilities out of testauth1.gs PROJECT section to between CROSS-PROJECT and TEMPLATE START (matching template structure)
- Fixed `_directSessionLoad` comment in globalacl.html to match template text
- Fixed entity encoding in programportal.html (`…` → `&hellip;`)
- Removed `.html-layer-hidden` class from template CSS PROJECT block (project-specific, not template)
- Added `gas-nonce-ready`, `gas-nonce-result`, `gas-ready-for-token`, `gas-auth-ok` to globalacl.html `_SIG_EXEMPT` allowlist

#### `globalacl.html` — v01.81w
##### Changed
- Improved security (added frame verification and session nonce flow)
- Minor internal improvements

#### `globalacl.gs` — v01.43g
##### Changed
- Minor internal improvements

#### `programportal.html` — v01.87w
##### Changed
- Minor internal improvements

#### `programportal.gs` — v01.52g
##### Changed
- Minor internal improvements

#### `testauth1.gs` — v02.47g
##### Changed
- Minor internal improvements

## [v08.91r] — 2026-04-05 06:17:39 PM EST

> **Prompt:** "go ahead and ask me questions as to which options to go with in making it so that they are all identical foundationally other than designated project sections. include in the question an option to skip in case i want to leave them as is for some reason"

### Changed
- Harmonized three auth projects (testauth1, globalacl, programportal) to match the auth HTML/GAS templates foundationally — all TEMPLATE/AUTH sections now identical, with only PROJECT-designated sections differing
- Updated `YOUR_ORG_LOGO_URL` template placeholder from `logoipsum.com` to `www.shadowaisolutions.com/SAIS_Logo.png` across all templates and projects
- Added `gas-layer-toggle` button and `_toggleGasLayer` IIFE to auth HTML template AUTH section — propagated to all three auth projects (previously only testauth1 had it, in PROJECT section)
- Moved testauth1's `html-layer-toggle` and `gas-layer-toggle` from PROJECT to AUTH section to match template placement
- Moved programportal's `_validateSSOTokenEmail()` back to template-matching position (was moved earlier for project-specific reasons)
- Added PROJECT OVERRIDE markers to testauth1 auth presets for test-environment shortened timeouts
- Added PROJECT OVERRIDE markers to testauth1 `_htmlLayerEls` extra test UI elements
- Removed "(programportal only)" comment qualifiers from programportal to match template
- Removed "Data Poll timer removed" comment from testauth1 to match template
- Updated noauth template CSP `img-src` to include `www.shadowaisolutions.com`

### Fixed
- Restored `loadIframeViaNonce()` function to globalacl — was completely missing, causing lack of replay protection for iframe loading on page refresh/tab reclaim

#### `testauth1.html` — v03.91w
##### Changed
- Minor internal improvements

#### `testauth1.gs` — v02.46g
##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.80w
##### Changed
- Minor internal improvements

#### `programportal.html` — v01.86w
##### Changed
- Minor internal improvements

#### `gas-project-creator.html` — v01.30w
##### Changed
- Minor internal improvements

## [v08.90r] — 2026-04-05 05:39:43 PM EST

> **Prompt:** "go ahead and improve it"

### Changed
- Aligned reconnecting checklist in all three auth projects (testauth1, globalacl, programportal) back to the template's dynamic SSO handling — `_rcStageOrder` is now config-driven via `SSO_PROVIDER` instead of hardcoded per-project
- Restored `rc-stage-sso` HTML element in testauth1 and globalacl (hidden by default, shown dynamically when `SSO_PROVIDER: true`)
- Added `style="display:none;"` default to programportal's `rc-stage-sso` element to match template (SSO stage is shown dynamically by `showReconnecting()`)
- Restored dynamic SSO show/hide logic in `showReconnecting()` across all three projects
- Removed `// PROJECT:` markers on reconnecting checklist sections (now template-standard, no longer project customizations)

### Fixed
- Fixed missing `user-select: none` on `.warning-banner` CSS in programportal (was present in template and other projects)

#### `testauth1.html` — v03.90w

##### Changed
- Minor internal improvements

#### `globalacl.html` — v01.79w

##### Changed
- Minor internal improvements

#### `programportal.html` — v01.85w

##### Changed
- Minor internal improvements

##### Fixed
- Fixed warning banner text selection behavior

## [v08.89r] — 2026-04-05 05:11:37 PM EST

> **Prompt:** "everything that is currently identical in the other projects i.e. globalacl and program portal as well as the testauth1 should be in the templates"

### Changed
- Absorbed common auth project code into the HTML auth template (`HtmlAndGasTemplateAutoUpdate-auth.html.txt`) — all changes were already identical across testauth1, globalacl, and programportal but missing from the template
- Added `so-stage-complete` sign-out checklist stage (6th stage) to HTML body and JS `_soStageOrder` array
- Fixed sign-out confirm text: "Waiting for server confirmation" → "Waiting for sign-out confirmation"
- Reordered sign-in DOM elements: moved subtitle paragraph after checklist (H2 → spinner → checklist → subtitle)
- Moved CSS `.auth-pulse-dots` definition after all checklist styles (after `.reconnect-checklist`)
- Expanded `_resetSignOutChecklist` with timer cleanup, sub-step reset, and total ticker on the "Sign-out complete" row
- Added `_updateSignOutStage('so-stage-complete')` call in `_finalizeSignOut` before completing all stages

## [v08.88r] — 2026-04-05 04:35:19 PM EST

> **Prompt:** "yes continue"

### Changed
- Fixed HTML auth template checklist text to match testauth1: reconnect final stage → "Session restored", sign-in final stage → "Sign-in complete", JS stage map updated
- Fixed HTML auth template sign-in subtitle: added margin-top:10px, removed default placeholder text
- Standardized HTML entities: all auth headings now use `&hellip;` consistently (was mixing Unicode `…` and entity)

## [v08.87r] — 2026-04-05 04:28:54 PM EST

> **Prompt:** "make sure that the templates are also identical, the idea is that if we use the gas-project-creator and associated setup-gas-project.sh , we should have an identical code to the testauth1 except for project specific code. make sure that this is the case"

### Changed
- Updated GAS auth templates (minimal-auth + test-auth) to match testauth1: unified RBAC to 4 roles with amend, added getData/heartbeat doPost() handlers, improved PROJECT_OVERRIDES comments, standardized placeholder strings
- Updated HTML auth template to match testauth1: unified CSP headers, removed divergent user-select properties from pills, changed user-pill z-index to 10012, moved html-layer-hidden to PROJECT CSS, added DATA_POLL_INTERVAL, removed ALLOWED_DOMAINS/ENABLE_DOMAIN_RESTRICTION, added HIPAA comments
- Updated HTML noauth template: removed divergent user-select properties from pills

### Fixed
- Fixed validateSessionForData() in both GAS auth templates — now extracts role/permissions from cache when data validation is disabled (prevents silent permission check failures)

## [v08.86r] — 2026-04-05 04:14:37 PM EST

> **Prompt:** "do an analysis of the program portal, testauth1, and globalacl environments to identify every single difference in how they are coded, EXCEPT for project specific code in the gas layer. my goal after your analysis is to make every environment identically coded and organized other than their specific project code"

### Changed
- Unified CSP headers across all three environments (portal, testauth1, globalacl) — standardized connect-src and font-src directives
- Unified CSS styling across all environments — standardized z-index values, removed divergent user-select properties, moved html-layer-hidden to consistent location
- Unified HTML_CONFIG across all environments — added DATA_POLL_INTERVAL, removed divergent ALLOWED_DOMAINS/ENABLE_DOMAIN_RESTRICTION, standardized HIPAA comments
- Unified GAS RBAC roles to 4-role structure (admin/clinician/billing/viewer + amend permission) across all environments
- Added Phase B (breach alerting) and Phase C (retention, legal hold, integrity, representative) configuration blocks to portal and globalacl GAS scripts
- Added getData and heartbeat doPost() handlers to portal and globalacl GAS scripts (previously testauth1-only)
- Standardized cache management approach (epoch-bump) across all GAS scripts
- Standardized placeholder strings and comments across all GAS scripts
- Added Google OAuth design note to portal and globalacl architecture diagrams

### Fixed
- Fixed validateSessionForData() in portal and testauth1 — now correctly extracts role/permissions from cache when data validation is disabled (prevents silent permission check failures)

#### `programportal.html` — v01.84w

##### Changed
- Unified security headers, auth configuration, and UI styling to match across all environments

#### `programportal.gs` — v01.51g

##### Changed
- Unified RBAC roles, HIPAA compliance configs, and template code to match across all environments

##### Fixed
- Permission checks now work correctly when data validation is disabled

#### `testauth1.gs` — v02.45g

##### Fixed
- Permission checks now work correctly when data validation is disabled

#### `globalacl.html` — v01.78w

##### Changed
- Unified security headers, auth configuration, and UI styling to match across all environments

#### `globalacl.gs` — v01.42g

##### Changed
- Unified RBAC roles, HIPAA compliance configs, cache management, and template code to match across all environments

##### Fixed
- Permission checks now work correctly when data validation is disabled

## [v08.85r] — 2026-04-05 03:20:35 PM EST

> **Prompt:** "ok, now these changes we have made to all of these, make them also apply to the templates and associated setup-gas-project.sh for the gas-project-creator"

### Changed
- Propagated pill and admin badge positioning changes to all 6 template files and gas-project-creator.html
- HTML templates (noauth + auth): right-side pills `right: 8px` → `right: 22px`, html-layer-toggle `bottom: 8px` → `bottom: 7px`
- GAS templates (all 4): `#version` `bottom: 8px` → `bottom: 9px`, gas-layer-toggle `bottom: 8px` → `bottom: 7px`
- GAS auth templates (2): admin badge normalized (dark bg, border, opacity hover, `top: 7px; left: 12px`), dropdown `top: 31px; left: 12px`
- gas-project-creator.html: version indicator `right: 8px` → `right: 22px`
- setup-gas-project.sh: no changes needed (copies from templates)

#### `gas-project-creator.html` — v01.29w

##### Changed
- Version indicator no longer overlaps with the browser scrollbar

## [v08.84r] — 2026-04-05 03:11:35 PM EST

> **Prompt:** "the font color for the gas version in bottom left corner of the program portal is white so we cant see it, should be same color as the other environments, see if theres any more inconsistencies that can be normalized"

### Fixed
- Fixed programportal.gs `#version` color from `rgba(255,255,255,0.3)` (invisible on white strip) to `#1565c0` (blue, matching testauth1 and globalacl)
- Fixed programportal.gs `#version` font-size from 11px to 12px (matching other environments)

### Changed
- Normalized admin badge styling on globalacl.gs and programportal.gs to match testauth1: dark semi-transparent background (`rgba(0,0,0,0.55)`), border, 10px border-radius, opacity hover effect
- Added `onmouseover`/`onmouseout` opacity handlers to admin badge HTML on both environments

#### `globalacl.gs` — v01.41g

##### Changed
- Admin button style normalized to match other pages

#### `programportal.gs` — v01.50g

##### Fixed
- Version label in bottom-left corner now visible (was white on white)

##### Changed
- Admin button style normalized to match other pages

## [v08.83r] — 2026-04-05 03:06:33 PM EST

> **Prompt:** "idk what you just did but you still dont have padding like we have on the testauth1, im talking about the white space at the top and bottom"

### Changed
- Added `#acl-main` wrapper to globalacl.gs with `position: fixed; top: 30px; bottom: 30px` — creates white strips at top/bottom matching testauth1's `#live-data-app` pattern
- Added `#portal-main` wrapper to programportal.gs with same fixed positioning — moves gradient background to inset container, exposing white body strips
- Body overflow set to `hidden` on both, wrapper handles scrolling
- Updated gas layer toggle element lists to use new wrapper IDs

#### `globalacl.gs` — v01.40g

##### Changed
- Page content now has visible top and bottom margins matching other pages

#### `programportal.gs` — v01.49g

##### Changed
- Page content now has visible top and bottom margins matching other pages

## [v08.82r] — 2026-04-05 03:00:10 PM EST

> **Prompt:** "i want the others to also have the top and bottom padding on the gas layer that the testauth1 has"

### Changed
- Added 30px top/bottom body padding to globalacl and programportal GAS layers, matching testauth1's layout strips for admin badge and version/toggle elements

#### `globalacl.gs` — v01.39g

##### Changed
- Added top and bottom padding to match testauth1 layout

#### `programportal.gs` — v01.48g

##### Changed
- Added top and bottom padding to match testauth1 layout

## [v08.81r] — 2026-04-05 02:52:59 PM EST

> **Prompt:** "ok good. we have made a bunch of changes in the last 2 sessions with the gas and html layer toggles and positioning of pills in testauth1. i want those changes to be propagated to the other environments, i.e. globalacl and programportal"

### Changed
- Propagated pill positioning and admin badge centering changes from testauth1 to globalacl and programportal
- All right-side pills shifted from right: 8px to right: 22px on both pages (version indicator, GAS pill, SSO indicator, auth timers, user pill, warning banners)
- Admin badge centered vertically in top strip (top: 12px → 7px) on both GAS files
- Admin dropdown position adjusted (top: 36px → 31px) on both GAS files
- GAS version label centered in bottom strip (bottom: 8px → 9px) on both GAS files
- HTML/GAS layer toggle buttons centered (bottom: 8px → 7px) on both environments

#### `globalacl.html` — v01.77w

##### Changed
- Controls no longer overlap with the browser scrollbar
- Bottom toggle buttons better centered in their area

#### `globalacl.gs` — v01.38g

##### Changed
- Admin button better centered in the header bar
- GAS toggle button better centered in its area

#### `programportal.html` — v01.83w

##### Changed
- Controls no longer overlap with the browser scrollbar
- Bottom toggle buttons better centered in their area

#### `programportal.gs` — v01.47g

##### Changed
- Admin button better centered in the header bar
- GAS toggle button better centered in its area

## [v08.80r] — 2026-04-05 02:42:37 PM EST

> **Prompt:** "as per the screenshot in testauth1, make it so that the admin button is centered vertically in the white area, same of the other elements on the html layer within the white areas, also make it so that the pills on the right side are moved a bit to the left so that when a scollbar appears they are not overlapping it"

### Changed
- Centered admin badge vertically in the top 30px strip of the GAS layer (top: 12px → 7px)
- Adjusted admin dropdown position to match badge shift (top: 36px → 31px)
- Centered HTML/GAS layer toggle buttons vertically in the bottom strip (bottom: 8px → 7px)
- Moved all right-side pills from right: 8px to right: 22px to prevent scrollbar overlap: version indicator, GAS pill, SSO indicator, auth timers, user pill, and warning banners
- Moved GAS user-email display from right: 8px to right: 22px for consistency

#### `testauth1.html` — v03.89w

##### Changed
- Controls no longer overlap with the browser scrollbar
- Bottom toggle buttons better centered in their area

#### `testauth1.gs` — v02.44g

##### Changed
- Admin button better centered in the header bar
- User info positioned to avoid scrollbar overlap

## [v08.79r] — 2026-04-05 01:22:20 PM EST

> **Prompt:** "plan it out in its own document, include all context in particular what we tried and didnt work"

### Added
- Created `DEFERRED-GAS-IFRAME-PLAN.md` — comprehensive implementation plan documenting the goal of deferring GAS iframe creation until after authentication, what was tried (moving to `showApp()` broke auth, the CORS blocker for `fetch()`-based exchange), and viable alternatives (hidden auth iframe, current toggle-hiding approach)

## [v08.78r] — 2026-04-05 01:10:05 PM EST

> **Prompt:** "unfortunately, now we are getting stuck at requesting sign-in from google" / "wait so if its going to load it anyway, just revert it to how we had it"

### Fixed
- Reverted deferred GAS iframe creation — restored iframe loading on page load (needed for auth token exchange with GAS backend)
- GAS toggle button now hidden on sign-in page and shown only after authentication — `showAuthWall()` hides it, `showApp()` shows it

#### `testauth1.html` — v03.88w

##### Fixed
- Fixed sign-in getting stuck at "Requesting sign-in from Google"
- GAS toggle button no longer visible on the sign-in page

## [v08.77r] — 2026-04-05 01:03:54 PM EST

> **Prompt:** "yes go ahead, make a note somewhere in case we need to revert"

### Security
- Deferred GAS iframe creation until after authentication — the iframe is no longer loaded on the sign-in page, preventing unauthenticated users from accessing the GAS deployment URL, app structure, and JavaScript logic via DevTools

#### `testauth1.html` — v03.87w

##### Changed
- Improved login security — backend connection deferred until after sign-in

## [v08.76r] — 2026-04-05 12:52:45 PM EST

> **Prompt:** "comment out the gas toggle in the gas layer (in case i want to enable it), and add the gas toggle to the html layer, make it so that the new gas toggle on the html layer is shown only when the gas layer exists"

### Changed
- Moved GAS layer toggle from GAS layer to HTML layer — now hides/shows the entire GAS iframe instead of individual elements within it, enabling true full hide of the GAS layer
- GAS toggle in GAS layer commented out (preserved for re-enable if needed)
- HTML-layer GAS toggle only appears when the `#gas-app` iframe exists in the DOM

#### `testauth1.gs` — v02.43g

##### Changed
- Minor internal improvements

#### `testauth1.html` — v03.86w

##### Added
- Added GAS layer toggle that fully hides the GAS iframe

## [v08.75r] — 2026-04-05 12:37:59 PM EST

> **Prompt:** "when i said same fond i meant the color too, should go back to the blue it was"

### Fixed
- Restored admin badge text color to original blue (`#90caf9`) — was incorrectly changed to `#ccc` when matching GAS toggle pill style

#### `testauth1.gs` — v02.42g

##### Fixed
- Restored admin button text to its original blue color

## [v08.74r] — 2026-04-05 12:34:16 PM EST

> **Prompt:** "the admin font can stay as is but make the pill colors the same as the gas toggle pill by default and on hover, remove the user select none on all pills"

### Changed
- Updated admin badge pill to match GAS toggle pill styling — dark semi-transparent background with opacity hover effect instead of color-swap hover
- Removed `user-select: none` from all pill elements (version indicator, GAS pill, SSO indicator, user pill, auth timers, admin badge) so text is selectable with Ctrl+A

#### `testauth1.gs` — v02.41g

##### Changed
- Admin button now matches the style of other control pills

#### `testauth1.html` — v03.85w

##### Changed
- Control pills are now text-selectable

## [v08.73r] — 2026-04-05 12:22:23 PM EST

> **Prompt:** "undo your last change, i literally mean the admin dropdown button, when i hover over it, i cant see it anymore might be blending with the white background. theres nothing wrong with the list after i click it."

### Fixed
- Reverted dropdown `top` change (28px back to 36px) — the dropdown click behavior was not the issue
- Fixed admin badge colors blending with the white top strip background — changed from light-on-light (`rgba(255,255,255,0.12)` bg, `#90caf9`/`#fff` text) to dark-on-light (`rgba(0,0,0,0.12)` bg, `#1565c0`/`#0d47a1` text) so the badge and its hover state are visible against the white strip

#### `testauth1.gs` — v02.40g

##### Fixed
- Fixed admin button becoming invisible when hovered — now uses darker colors visible on light backgrounds

## [v08.72r] — 2026-04-05 12:17:33 PM EST

> **Prompt:** "the admin dropdown on hover is disappearing"

### Fixed
- Fixed admin dropdown disappearing when moving mouse from badge to dropdown — reduced gap between badge and dropdown by moving dropdown from `top: 36px` to `top: 28px`

#### `testauth1.gs` — v02.39g

##### Fixed
- Fixed admin menu disappearing when trying to select an option

## [v08.71r] — 2026-04-05 12:10:48 PM EST

> **Prompt:** "in the screenshot you can see in testauth1 we have a little strip of space at the bottom for the gas layer, i want a similar strip of space at the top for the gas layer also"

### Changed
- Added 30px top strip space for the GAS layer in testauth1, mirroring the existing bottom strip — gives GAS UI elements (admin badge, user email) a dedicated top area

#### `testauth1.gs` — v02.38g

##### Changed
- Adjusted layout spacing to show a control strip at the top of the page

## [v08.70r] — 2026-04-04 10:13:01 PM EST

> **Prompt:** "in tests folder, add a defensive-security folder, and add something we can use to test defensive security"

### Added
- Created `tests/defensive-security/` folder with `test_01_csp_headers_validation.py` — Playwright-based defensive security test that validates CSP meta tags, required directives, Referrer-Policy, auth wall presence/absence, external script source whitelisting, and inline event handler detection across all deployed pages

## [v08.69r] — 2026-04-04 09:58:18 PM EST

> **Prompt:** "in live-site-pages add a "images" folder, and move the barcode-test-sheet.png which is currently in the root to that new images folder"

### Changed
- Moved `barcode-test-sheet.png` from repo root to new `live-site-pages/images/` folder — now accessible via GitHub Pages
- Added `images/` directory with file entry to README tree

## [v08.68r] — 2026-04-04 09:42:26 PM EST

> **Prompt:** "in the (No public-site pages yet) , mention the index.html goes here"

### Changed
- Updated Public Website placeholder in README tree to mention index.html goes there

## [v08.67r] — 2026-04-04 09:37:16 PM EST

> **Prompt:** "remove the index environment completely, in the project structure leave the public website divider but have it say (No public-site pages yet)"

### Removed
- Completely removed the index environment — deleted index.html, Index/ GAS directory, all version/changelog files, and index-diagram.md
- Removed index.html from programportal.gs navigation menu (bumped v01.45g → v01.46g)
- Removed Index from GAS Projects table in gas-scripts.md
- Removed INDEX/GAS_INDEX nodes and all edges from REPO-ARCHITECTURE.md flowchart diagram
- Updated README tree: replaced index.html entry with "(No public-site pages yet)" placeholder under Public Website divider
- Updated gas-project-creator-diagram.md, html-pages.md, and gas-scripts.md to remove index-specific references

#### `programportal.gs` — v01.46g
##### Changed
- Removed Website (index.html) entry from the project navigation menu

## [v08.66r] — 2026-04-04 09:25:47 PM EST

> **Prompt:** "in the repository-information , move all the .md files in that folder into a sub folder called "archive info" except for the following which should remain there. repository.version.txt, readme-qr-code.png, TOKEN-BUDGETS.md, TODO.md, SUPPORT.md, SKILLS-REFERENCE.md, SESSION-CONTEXT.md, REPO-ARCHITECTURE.md, REMINDERS.md, KNOWN-CONSTRAINTS-AND-FIXES.md, IMPROVEMENTS.md, HIPAA-CODING-REQUIREMENTS.md, GOVERNANCE.md, FUTURE-CONSIDERATIONS.md, DATA-POLL-ARCHITECTURE.md, CODING-GUIDELINES.md, CHANGELOG.md, CHANGELOG-archive.md"

### Changed
- Moved 33 archive/plan .md files from `repository-information/` into new `repository-information/archive info/` subfolder to declutter the directory — kept 16 actively-used .md files in place
- Updated README tree structure with `archive info/` subtree and corrected all GitHub URLs
- Updated cross-reference in HIPAA-CODING-REQUIREMENTS.md and tests/offensive-security/GAS-HIPAA-COMPLIANCE-ANALYSIS.md to reflect new paths

## [v08.65r] — 2026-04-04 09:10:16 PM EST

> **Prompt:** "completely remove the testenvironment, rndlivedata, and open-all environments"

### Removed
- Completely removed three environments: testenvironment, rndlivedata, and open-all — deleted 22+ files (HTML pages, GAS scripts, configs, version files, changelogs, diagrams) and cleaned all references from workflow, documentation, and navigation

#### `programportal.gs` — v01.45g
##### Changed
- Removed Test Environment entry from the project navigation menu

## [v08.64r] — 2026-04-04 08:46:47 PM EST

> **Prompt:** "go ahead and archive all of our changelogs for all projects, so they should all end up 0/50 or 0/100 ,etc."

### Changed
- Archived all 484 version sections across 15 changelogs (repo, 8 HTML page, 6 GAS) to their respective archive files with SHA enrichment — all changelogs now at 0 sections
