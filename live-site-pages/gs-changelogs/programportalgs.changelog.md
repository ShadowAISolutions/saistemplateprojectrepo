# Changelog — Program Portal (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [programportalgs.changelog-archive.md](programportalgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 34/50`

## [Unreleased]

## [v01.34g] — 2026-03-29 10:35:42 PM EST — v08.04r

### Fixed
- Fixed page header and content being cut off at the top of the screen

## [v01.33g] — 2026-03-29 10:22:14 PM EST — v08.03r

### Changed
- Website now appears first in the Public Applications list

## [v01.32g] — 2026-03-29 10:06:41 PM EST — v08.02r

### Changed
- Announcement cards show a lighter blue left border while changes are being saved to the server

## [v01.31g] — 2026-03-29 10:03:03 PM EST — v08.01r

### Changed
- New announcements now instantly show your name and the current time before the server confirms

## [v01.30g] — 2026-03-29 09:57:49 PM EST — v08.00r

### Added
- Announcements now automatically show who posted them and when — no manual entry needed
- Author name and timestamp displayed on each announcement card

## [v01.29g] — 2026-03-29 09:31:52 PM EST — v07.99r

### Added
- GAS layer visibility toggle button — hides/shows all portal content (matching TestAuth1's pattern where the GAS toggle lives inside the GAS iframe)

## [v01.28g] — 2026-03-29 07:06:43 PM EST — v07.98r

### Added
- Drag and drop reordering for announcements — grab any card and drag it to a new position
- Drag handle icon (⠿) on each announcement card for admins
- Blue highlight indicator shows where the card will be dropped

## [v01.27g] — 2026-03-29 07:03:58 PM EST — v07.97r

### Added
- "Cancel Changes" button appears alongside "Save Order" when announcement order has been modified — reverts to original order without saving

## [v01.26g] — 2026-03-29 07:01:13 PM EST — v07.96r

### Changed
- Modal dialogs can no longer be closed by clicking outside — must use Cancel or action buttons

## [v01.25g] — 2026-03-29 06:57:52 PM EST — v07.95r

### Changed
- Delete confirmation now uses a themed modal dialog instead of the browser's default popup

## [v01.24g] — 2026-03-29 06:54:54 PM EST — v07.94r

### Changed
- Reordering announcements now uses a "Save Order" button — rearrange freely with arrows, then save all changes in one click

## [v01.23g] — 2026-03-29 06:50:32 PM EST — v07.93r

### Fixed
- Rapidly clicking reorder buttons no longer causes announcements to drift past their intended position

## [v01.22g] — 2026-03-29 06:45:58 PM EST — v07.92r

### Fixed
- Rapidly reordering announcements no longer targets the wrong item — row references update correctly during optimistic swaps

## [v01.21g] — 2026-03-29 06:41:17 PM EST — v07.91r

### Changed
- All announcement actions (reorder, add, edit, delete) now use optimistic updates — changes appear instantly before the server confirms

## [v01.20g] — 2026-03-29 06:37:30 PM EST — v07.90r

### Fixed
- Announcements now display in spreadsheet row order instead of being auto-sorted by date

## [v01.19g] — 2026-03-29 06:35:05 PM EST — v07.89r

### Fixed
- Reorder, add, edit, and delete now show changes immediately without waiting for the next poll

## [v01.18g] — 2026-03-29 06:24:12 PM EST — v07.86r

### Removed
- Non-functional HTML/GAS version pills from announcements section (the embedding page already provides working version pills with changelog popups)

## [v01.17g] — 2026-03-29 06:20:23 PM EST — v07.85r

### Fixed
- Priority dropdown text is now readable (dark background on options)

### Added
- Active/inactive toggle on announcement edit form
- Reorder announcements with up/down arrow buttons
- Live data polling timer showing elapsed and countdown time
- HTML and GAS version pills in the announcements status bar
- Inactive announcements shown with reduced opacity for admins

## [v01.16g] — 2026-03-29 06:13:00 PM EST — v07.84r

### Added
- Admin users can now add, edit, and delete announcements directly from the portal
- New announcement form with title, body, and priority fields
- Edit and delete buttons on each announcement card (admin only)

## [v01.15g] — 2026-03-29 06:07:54 PM EST — v07.83r

### Added
- Announcements sheet is automatically created with headers and a welcome message on first load

## [v01.14g] — 2026-03-29 06:03:02 PM EST — v07.82r

### Added
- New Announcements section showing live announcements from a spreadsheet
- Announcements automatically refresh every 60 seconds to show new updates
- Collapsible section header with announcement count badge
- Visual priority indicators — high-priority announcements highlighted in red, normal in blue

## [v01.13g] — 2026-03-29 03:05:28 PM EST — v07.80r

### Changed
- "Homepage" app card renamed to "Website" in the portal

## [v01.12g] — 2026-03-29 02:38:38 PM EST — v07.79r

### Changed
- "Global ACL" app card renamed to "Global Access Control List" in the portal

## [v01.11g] — 2026-03-29 12:59:16 PM EST — v07.76r

### Changed
- Script renamed from Application Portal to Program Portal

## [v01.10g] — 2026-03-25 09:24:15 AM EST — v06.45r

### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces

## [v01.09g] — 2026-03-25 09:07:53 AM EST — v06.44r

### Changed
- Minor internal improvements

## [v01.08g] — 2026-03-23 07:56:51 AM EST — v06.15r

### Fixed
- Fixed session listing so Global Sessions panel correctly shows active sessions

## [v01.07g] — 2026-03-22 02:58:37 PM EST — v06.09r

### Fixed
- Cross-project admin validation now works correctly

## [v01.06g] — 2026-03-22 12:33:58 PM EST — v06.01r

### Fixed
- All emoji icons now display correctly instead of showing as escape codes

## [v01.05g] — 2026-03-21 11:48:05 PM EST — v05.91r

### Added
- Full portal dashboard with app cards, access toggles, and ACL-based visibility

## [v01.04g] — 2026-03-21 11:40:26 PM EST — v05.90r

### Fixed
- Sign-in no longer crashes — added missing page nonce validation

## [v01.03g] — 2026-03-21 11:25:17 PM EST — v05.88r

### Changed
- Set deployment ID to match the live GAS project

## [v01.02g] — 2026-03-21 11:14:52 PM EST — v05.87r

### Changed
- Reset deployment ID pending own GAS project setup

## [v01.01g] — 2026-03-21 10:45:49 PM EST — v05.85r

### Changed
- Set production deployment ID

Developed by: ShadowAISolutions
