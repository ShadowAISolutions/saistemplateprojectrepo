# Changelog Archive — RND Live Data (Google Apps Script)

Older version sections rotated from [rndlivedatags.changelog.md](rndlivedatags.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## [v01.06g] — 2026-03-25 04:52:58 PM EST — v06.56r — [ab85fab](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ab85fabb)

### Fixed
- Data now refreshes instantly when the spreadsheet is edited

### Added
- One-time setup step to connect the edit trigger to your spreadsheet

## [v01.05g] — 2026-03-25 04:36:47 PM EST — v06.55r — [a365357](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a3653571)

### Added
- Data cache now refreshes instantly when the spreadsheet is edited — no more waiting up to 60 seconds

### Changed
- Cache stays alive as long as viewers are present — data no longer disappears during quiet periods
- No time-driven trigger setup needed — everything is automatic

## [v01.04g] — 2026-03-25 02:58:00 PM EST — v06.54r — [81598b9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/81598b99)

### Changed
- Added CacheService-based data serving — spreadsheet data cached server-side
- Presence heartbeats now also deliver live data to viewers (zero extra calls)
- Active user queries include live data alongside the user list

## [v01.03g] — 2026-03-25 01:57:21 PM EST — v06.50r — [fb9c34e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fb9c34e4)

### Changed
- Replaced data entry backend with lightweight presence tracking
- Now only handles heartbeat writes and active user queries

### Removed
- Data fetch and submission endpoints — data reads moved to client-side Visualization API

## [v01.02g] — 2026-03-25 11:55:30 AM EST — v06.48r — [486c1a9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/486c1a9e)

### Changed
- Connected to actual Google Sheet for data storage

## [v01.01g] — 2026-03-25 11:43:03 AM EST — v06.47r — [43390da](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/43390daf)

### Added
- Data entry and retrieval — submit entries and view all entries from other users
- Fast data reads from cache with automatic fallback to spreadsheet
- Safe concurrent writes — multiple users can submit simultaneously without data loss

Developed by: ShadowAISolutions

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

Developed by: ShadowAISolutions
