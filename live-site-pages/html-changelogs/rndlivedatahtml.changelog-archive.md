# Changelog Archive — RND Live Data

Older version sections rotated from [rndlivedatahtml.changelog.md](rndlivedatahtml.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## [v01.07w] — 2026-03-25 04:52:58 PM EST — v06.56r — [ab85fab](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ab85fabb)

### Changed
- Setup instructions updated with trigger installation step

## [v01.06w] — 2026-03-25 02:58:00 PM EST — v06.54r — [81598b9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/81598b99)

### Changed
- Data now arrives via the GAS script instead of requiring a publicly shared spreadsheet
- Removed dependency on Google Charts library for faster page loading
- Connection status shows "Last updated Xs ago" instead of polling countdown
- Setup instructions updated — no longer asks to share spreadsheet publicly

## [v01.05w] — 2026-03-25 02:18:30 PM EST — v06.53r — [6c51959](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6c519597)

### Fixed
- Fixed data not loading — connection to Google's data service was being blocked

## [v01.04w] — 2026-03-25 02:13:00 PM EST — v06.52r — [5c1e40e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5c1e40e8)

### Fixed
- Fixed page stuck on "Connecting..." — browser security policy was blocking required stylesheets from loading

## [v01.03w] — 2026-03-25 02:07:29 PM EST — v06.51r — [cb0a9da](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cb0a9dab)

### Fixed
- Fixed page stuck on "Connecting..." — data now loads correctly from Google Sheets

## [v01.02w] — 2026-03-25 01:57:21 PM EST — v06.50r — [fb9c34e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fb9c34e4)

### Changed
- Redesigned as live spreadsheet data viewer with dark theme
- Data now loads directly from Google Sheets without any server calls

### Added
- Real-time data table with sortable columns and change highlighting
- Dashboard view with metric cards showing first-row values as large tiles
- Connection status indicator showing Live, Updating, or Disconnected state
- Countdown timer showing seconds until next data refresh
- User presence avatars showing who else is viewing the page
- Configuration instructions shown when spreadsheet is not yet connected

### Removed
- Data entry interface (name modal, message feed, input area)

## [v01.01w] — 2026-03-25 11:43:03 AM EST — v06.47r — [43390da](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/43390daf)

### Added
- Full data entry interface with dark theme — name entry modal, message feed with colored avatars, and input area
- Event-driven sync: auto-syncs on tab focus, stale data banner after 2+ minutes away, manual sync button
- Optimistic UI updates on message submit with automatic rollback on failure
- Status indicators: Ready (green), Syncing (yellow), Error (red), Stale (gray)

Developed by: ShadowAISolutions

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

Developed by: ShadowAISolutions
