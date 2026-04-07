# Changelog — GAS Project Creator Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-project-creatorhtml.changelog-archive.md](gas-project-creatorhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 40/50`

## [Unreleased]

## [v01.68w] — 2026-04-07 11:22:39 AM EST — v09.63r

### Changed
- Master ACL, ACL Sheet Name, and ACL Column Name hidden when auth is disabled

## [v01.67w] — 2026-04-07 11:16:28 AM EST — v09.62r

### Fixed
- Master ACL Spreadsheet ID field now properly editable — typing no longer gets overwritten

## [v01.66w] — 2026-04-07 11:13:35 AM EST — v09.61r

### Fixed
- Master ACL Spreadsheet ID field now accepts input when toggle is unchecked

## [v01.65w] — 2026-04-07 11:08:00 AM EST — v09.60r

### Fixed
- ACL fields now enable when Master ACL Spreadsheet ID is set (manually or via toggle)

## [v01.64w] — 2026-04-07 11:03:22 AM EST — v09.59r

### Fixed
- Copy buttons no longer incorrectly show "needs: Environment Name" when Environment Name is filled

## [v01.63w] — 2026-04-07 11:01:26 AM EST — v09.58r

### Fixed
- ACL fields no longer show misleading "Enter Deployment ID first" message

## [v01.62w] — 2026-04-07 10:56:55 AM EST — v09.57r

### Fixed
- ACL fields now require Master ACL Spreadsheet ID before they can be edited
- Disabled ACL Column Name no longer misleadingly shows default value hint

## [v01.61w] — 2026-04-07 10:51:44 AM EST — v09.56r

### Fixed
- ACL and Master ACL fields now correctly reference Spreadsheet ID as their dependency

## [v01.60w] — 2026-04-07 10:45:04 AM EST — v09.55r

### Fixed
- Clear button no longer appears on fields that are auto-filled from another source

## [v01.59w] — 2026-04-07 10:40:56 AM EST — v09.54r

### Fixed
- Master ACL Spreadsheet ID field now editable when toggle is unchecked
- Disabled state shows hint about how to enable it

## [v01.58w] — 2026-04-07 10:35:23 AM EST — v09.53r

### Changed
- Master ACL Spreadsheet ID field disables with auto-fill instead of hiding when toggle is checked

## [v01.57w] — 2026-04-07 10:28:36 AM EST — v09.52r

### Changed
- Master ACL toggle moved under Spreadsheet ID with external ACL ID field for non-self ACL projects
- ACL Sheet Name and Column Name always visible

## [v01.56w] — 2026-04-07 10:12:59 AM EST — v09.51r

### Changed
- Master ACL toggle moved above Spreadsheet ID

## [v01.55w] — 2026-04-07 10:01:45 AM EST — v09.50r

### Changed
- Allowed Domains now prefills with "All" meaning any Google account can sign in

## [v01.54w] — 2026-04-07 09:55:58 AM EST — v09.49r

### Changed
- Master ACL toggle moved next to Spreadsheet ID — no separate ACL spreadsheet ID field
- ACL details appear inline when toggle is checked

## [v01.53w] — 2026-04-07 09:47:23 AM EST — v09.48r

### Changed
- Auth Preset and Allowed Domains moved under OAuth Client ID in the Authentication Settings section

## [v01.52w] — 2026-04-07 09:43:11 AM EST — v09.47r

### Changed
- OAuth Client ID now appears before Deployment ID and is required to enable it (when auth is checked)
- Master ACL section moved under Spreadsheet ID for logical grouping
- Auth settings box simplified to just Auth Preset and Allowed Domains

## [v01.51w] — 2026-04-07 08:47:47 AM EST — v09.46r

### Fixed
- Fields no longer stay disabled when a parent field is cleared and re-filled

## [v01.50w] — 2026-04-07 08:41:28 AM EST — v09.45r

### Changed
- Splash Logo URL now prefills with the default logo instead of being blank
- All three logo fields are now described as independent of each other

## [v01.49w] — 2026-04-07 08:34:10 AM EST — v09.44r

### Changed
- Environment Name field now requires Deployment ID to be filled before it can be edited

## [v01.48w] — 2026-04-07 08:26:38 AM EST — v09.43r

### Changed
- Logo configuration now has 3 separate fields: Developer Logo, Org Logo, and Splash Logo
- Splash Logo defaults to Developer Logo when left blank

## [v01.47w] — 2026-04-07 07:57:43 AM EST — v09.42r

### Removed
- Removed Sound File ID form field (was unused by any live feature)

## [v01.46w] — 2026-04-06 11:16:59 PM EST — v09.41r

### Changed
- Action buttons now show which fields are needed before they can be used
- Disabled buttons use the same red tint as other disabled elements

## [v01.45w] — 2026-04-06 11:11:14 PM EST — v09.40r

### Fixed
- Disabled dropdown and test button now match the red disabled tint of other fields

## [v01.44w] — 2026-04-06 11:06:44 PM EST — v09.39r

### Fixed
- Clearing a field now correctly shows the empty-field background tint

## [v01.43w] — 2026-04-06 11:03:59 PM EST — v09.38r

### Changed
- ACL Column Name label now indicates it defaults to Environment Name
- Clear buttons hidden on empty or disabled fields

## [v01.42w] — 2026-04-06 10:56:44 PM EST — v09.37r

### Fixed
- ACL Column Name now correctly shows the environment name as its default when enabled
- Empty ACL fields now show the correct background tint

## [v01.41w] — 2026-04-06 10:50:41 PM EST — v09.36r

### Changed
- Step 15 updated to generic trigger instructions
- Field background tints adjusted for better visibility

## [v01.40w] — 2026-04-06 10:46:49 PM EST — v09.35r

### Changed
- Adjusted background tint colors for better visibility and subtlety
- Disabled field placeholder text now visually indented with dashes

## [v01.39w] — 2026-04-06 10:41:18 PM EST — v09.34r

### Changed
- Disabled fields now show what prerequisite is needed instead of showing prefilled values
- Background tints lightened for better visibility

## [v01.38w] — 2026-04-06 10:36:51 PM EST — v09.33r

### Changed
- Empty fields now have a very subtle green background tint to indicate they're available
- Disabled fields now have a very subtle red background tint to indicate they're unavailable

## [v01.37w] — 2026-04-06 10:30:21 PM EST — v09.32r

### Fixed
- Master ACL toggle no longer leaves the project spreadsheet ID in the field after unchecking

## [v01.36w] — 2026-04-06 10:25:37 PM EST — v09.31r

### Changed
- Optional fields now describe their default behavior in the label
- Form fields disabled until their prerequisite required fields are filled

## [v01.35w] — 2026-04-06 10:16:16 PM EST — v09.30r

### Changed
- Form fields now show as disabled when their prerequisites are not met, rather than being hidden
- Sheet name field pre-filled with default value
- ACL fields become required when Master ACL is configured

## [v01.34w] — 2026-04-06 10:02:14 PM EST — v09.29r

### Changed
- ACL configuration fields now appear only when relevant
- Default security preset changed to HIPAA
- Default ACL sheet name updated to match existing projects
- Clearer labeling for page identification in ACL settings

## [v01.33w] — 2026-04-06 07:41:52 PM EST — v09.28r

### Added
- New option to copy the embedding page HTML with your project settings pre-filled
- GitHub Branch configuration field

### Changed
- Minor internal improvements

## [v01.32w] — 2026-04-06 07:14:03 PM EST — v09.27r

### Changed
- Minor internal improvements

## [v01.31w] — 2026-04-06 05:03:52 PM EST — v09.26r

### Changed
- Simplified project creation workflow

## [v01.30w] — 2026-04-05 06:17:39 PM EST — v08.91r

### Changed
- Minor internal improvements

## [v01.29w] — 2026-04-05 03:20:35 PM EST — v08.85r

### Changed
- Version indicator no longer overlaps with the browser scrollbar
