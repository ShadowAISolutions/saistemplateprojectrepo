# Changelog — RND Live Data

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [rndlivedatahtml.changelog-archive.md](rndlivedatahtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 3/50`

## [Unreleased]

## [v01.03w] — 2026-03-25 02:07:29 PM EST — v06.51r

### Fixed
- Fixed page stuck on "Connecting..." — data now loads correctly from Google Sheets

## [v01.02w] — 2026-03-25 01:57:21 PM EST — v06.50r

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

## [v01.01w] — 2026-03-25 11:43:03 AM EST — v06.47r

### Added
- Full data entry interface with dark theme — name entry modal, message feed with colored avatars, and input area
- Event-driven sync: auto-syncs on tab focus, stale data banner after 2+ minutes away, manual sync button
- Optimistic UI updates on message submit with automatic rollback on failure
- Status indicators: Ready (green), Syncing (yellow), Error (red), Stale (gray)

Developed by: ShadowAISolutions
