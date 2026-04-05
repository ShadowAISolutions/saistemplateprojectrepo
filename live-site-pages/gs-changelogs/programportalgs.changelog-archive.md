# Changelog Archive — Program Portal (Google Apps Script)

Older version sections rotated from [programportalgs.changelog.md](programportalgs.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## [v01.44g] — 2026-04-03 02:47:47 PM EST — v08.62r — [a0b6e82](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a0b6e821)

### Fixed
- Admin tools badge and menu moved to top-left corner to avoid being hidden behind the user interface

## [v01.43g] — 2026-04-03 12:45:15 PM EST — v08.57r — [c3fb31f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c3fb31f9)

### Fixed
- Fixed a deployment error caused by incomplete internal function — script can now deploy successfully

## [v01.42g] — 2026-04-03 12:24:34 PM EST — v08.56r — [b3d9a37](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b3d9a37d)

### Removed
- Removed legacy admin panel that loaded in a separate window — admin tools are now part of the main dashboard

## [v01.41g] — 2026-04-03 11:33:43 AM EST — v08.54r — [740a887](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/740a887f)

### Changed
- Admin tools now appear directly in the portal dashboard instead of a separate popup — no extra windows or overlays
- Session management integrated into the admin panel alongside compliance tools

## [v01.40g] — 2026-04-03 10:54:25 AM EST — v08.53r — [2cc1099](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/2cc10992)

### Added
- New Compliance Tools admin panel — all HIPAA features now load inside a dedicated panel with organized navigation tabs
- Server-filtered menu — only shows tools you have permission to access

## [v01.39g] — 2026-04-02 01:20:10 PM EST — v08.52r — [ca08f65](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ca08f65b)

### Changed
- Minor internal improvements

## [v01.36g] — 2026-03-29 10:52:39 PM EST — v08.06r — [95c3e15](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/95c3e157)

### Changed
- Move-up arrow is now disabled on the first announcement and move-down arrow on the last — they remain visible but unclickable

## [v01.35g] — 2026-03-29 10:45:35 PM EST — v08.05r — [9837ca6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9837ca6f)

### Changed
- Add Announcement, Save Order, and Cancel Changes buttons now appear side by side in a single row

## [v01.34g] — 2026-03-29 10:35:42 PM EST — v08.04r — [b2af781](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b2af7819)

### Fixed
- Fixed page header and content being cut off at the top of the screen

## [v01.33g] — 2026-03-29 10:22:14 PM EST — v08.03r — [29fd407](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/29fd407f)

### Changed
- Website now appears first in the Public Applications list

## [v01.32g] — 2026-03-29 10:06:41 PM EST — v08.02r — [5fbd87a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5fbd87a6)

### Changed
- Announcement cards show a lighter blue left border while changes are being saved to the server

## [v01.31g] — 2026-03-29 10:03:03 PM EST — v08.01r — [ed66b2c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ed66b2c2)

### Changed
- New announcements now instantly show your name and the current time before the server confirms

## [v01.30g] — 2026-03-29 09:57:49 PM EST — v08.00r — [8596b63](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8596b63c)

### Added
- Announcements now automatically show who posted them and when — no manual entry needed
- Author name and timestamp displayed on each announcement card

## [v01.29g] — 2026-03-29 09:31:52 PM EST — v07.99r — [ccacaaf](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ccacaaf0)

### Added
- GAS layer visibility toggle button — hides/shows all portal content (matching TestAuth1's pattern where the GAS toggle lives inside the GAS iframe)

## [v01.28g] — 2026-03-29 07:06:43 PM EST — v07.98r — [6109c1a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6109c1a0)

### Added
- Drag and drop reordering for announcements — grab any card and drag it to a new position
- Drag handle icon (⠿) on each announcement card for admins
- Blue highlight indicator shows where the card will be dropped

## [v01.27g] — 2026-03-29 07:03:58 PM EST — v07.97r — [985fe0b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/985fe0b9)

### Added
- "Cancel Changes" button appears alongside "Save Order" when announcement order has been modified — reverts to original order without saving

## [v01.26g] — 2026-03-29 07:01:13 PM EST — v07.96r — [7a0acf4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/7a0acf41)

### Changed
- Modal dialogs can no longer be closed by clicking outside — must use Cancel or action buttons

## [v01.25g] — 2026-03-29 06:57:52 PM EST — v07.95r — [ab4dd32](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ab4dd32c)

### Changed
- Delete confirmation now uses a themed modal dialog instead of the browser's default popup

## [v01.24g] — 2026-03-29 06:54:54 PM EST — v07.94r — [9f13623](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9f13623a)

### Changed
- Reordering announcements now uses a "Save Order" button — rearrange freely with arrows, then save all changes in one click

## [v01.23g] — 2026-03-29 06:50:32 PM EST — v07.93r — [9da8b9f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9da8b9f7)

### Fixed
- Rapidly clicking reorder buttons no longer causes announcements to drift past their intended position

## [v01.22g] — 2026-03-29 06:45:58 PM EST — v07.92r — [06f58f1](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/06f58f11)

### Fixed
- Rapidly reordering announcements no longer targets the wrong item — row references update correctly during optimistic swaps

## [v01.21g] — 2026-03-29 06:41:17 PM EST — v07.91r — [7bd7671](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/7bd76715)

### Changed
- All announcement actions (reorder, add, edit, delete) now use optimistic updates — changes appear instantly before the server confirms

## [v01.20g] — 2026-03-29 06:37:30 PM EST — v07.90r — [fd37152](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fd371523)

### Fixed
- Announcements now display in spreadsheet row order instead of being auto-sorted by date

## [v01.19g] — 2026-03-29 06:35:05 PM EST — v07.89r — [2a7fc8e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/2a7fc8ec)

### Fixed
- Reorder, add, edit, and delete now show changes immediately without waiting for the next poll

## [v01.18g] — 2026-03-29 06:24:12 PM EST — v07.86r — [d66143e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d66143e5)

### Removed
- Non-functional HTML/GAS version pills from announcements section (the embedding page already provides working version pills with changelog popups)

## [v01.17g] — 2026-03-29 06:20:23 PM EST — v07.85r — [73929bf](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/73929bfa)

### Fixed
- Priority dropdown text is now readable (dark background on options)

### Added
- Active/inactive toggle on announcement edit form
- Reorder announcements with up/down arrow buttons
- Live data polling timer showing elapsed and countdown time
- HTML and GAS version pills in the announcements status bar
- Inactive announcements shown with reduced opacity for admins

## [v01.16g] — 2026-03-29 06:13:00 PM EST — v07.84r — [666ada9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/666ada97)

### Added
- Admin users can now add, edit, and delete announcements directly from the portal
- New announcement form with title, body, and priority fields
- Edit and delete buttons on each announcement card (admin only)

## [v01.15g] — 2026-03-29 06:07:54 PM EST — v07.83r — [1ae4590](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/1ae45906)

### Added
- Announcements sheet is automatically created with headers and a welcome message on first load

## [v01.14g] — 2026-03-29 06:03:02 PM EST — v07.82r — [5f6ee14](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5f6ee149)

### Added
- New Announcements section showing live announcements from a spreadsheet
- Announcements automatically refresh every 60 seconds to show new updates
- Collapsible section header with announcement count badge
- Visual priority indicators — high-priority announcements highlighted in red, normal in blue

## [v01.13g] — 2026-03-29 03:05:28 PM EST — v07.80r — [401070d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/401070db)

### Changed
- "Homepage" app card renamed to "Website" in the portal

## [v01.12g] — 2026-03-29 02:38:38 PM EST — v07.79r — [c85dccb](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c85dccb8)

### Changed
- "Global ACL" app card renamed to "Global Access Control List" in the portal

## [v01.11g] — 2026-03-29 12:59:16 PM EST — v07.76r — [21443cf](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/21443cfd)

### Changed
- Script renamed from Application Portal to Program Portal

## [v01.10g] — 2026-03-25 09:24:15 AM EST — v06.45r — [8e76a68](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8e76a687)

### Added
- Secure nonce endpoint for page authentication — replaces insecure session token URLs with one-time-use nonces

## [v01.09g] — 2026-03-25 09:07:53 AM EST — v06.44r — [8845bc4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8845bc44)

### Changed
- Minor internal improvements

## [v01.08g] — 2026-03-23 07:56:51 AM EST — v06.15r — [6f81405](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6f814052)

### Fixed
- Fixed session listing so Global Sessions panel correctly shows active sessions

## [v01.07g] — 2026-03-22 02:58:37 PM EST — v06.09r — [76f329f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/76f329fc)

### Fixed
- Cross-project admin validation now works correctly

## [v01.06g] — 2026-03-22 12:33:58 PM EST — v06.01r — [f6c455e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/f6c455eb)

### Fixed
- All emoji icons now display correctly instead of showing as escape codes

## [v01.05g] — 2026-03-21 11:48:05 PM EST — v05.91r — [81b9b6e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/81b9b6e3)

### Added
- Full portal dashboard with app cards, access toggles, and ACL-based visibility

## [v01.04g] — 2026-03-21 11:40:26 PM EST — v05.90r — [9bbdd2c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9bbdd2c3)

### Fixed
- Sign-in no longer crashes — added missing page nonce validation

## [v01.03g] — 2026-03-21 11:25:17 PM EST — v05.88r — [34659e8](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/34659e88)

### Changed
- Set deployment ID to match the live GAS project

## [v01.02g] — 2026-03-21 11:14:52 PM EST — v05.87r — [39f0dfb](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/39f0dfb8)

### Changed
- Reset deployment ID pending own GAS project setup

## [v01.01g] — 2026-03-21 10:45:49 PM EST — v05.85r — [b04d3ca](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b04d3ca7)

### Changed
- Set production deployment ID

Developed by: ShadowAISolutions

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

Developed by: ShadowAISolutions
