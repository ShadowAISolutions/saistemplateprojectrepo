# Changelog — RND Live Data (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [rndlivedatags.changelog-archive.md](rndlivedatags.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 4/50`

## [Unreleased]

## [v01.04g] — 2026-03-25 02:58:00 PM EST — v06.54r

### Changed
- Added CacheService-based data serving — spreadsheet data cached server-side
- Presence heartbeats now also deliver live data to viewers (zero extra calls)
- Active user queries include live data alongside the user list

## [v01.03g] — 2026-03-25 01:57:21 PM EST — v06.50r

### Changed
- Replaced data entry backend with lightweight presence tracking
- Now only handles heartbeat writes and active user queries

### Removed
- Data fetch and submission endpoints — data reads moved to client-side Visualization API

## [v01.02g] — 2026-03-25 11:55:30 AM EST — v06.48r

### Changed
- Connected to actual Google Sheet for data storage

## [v01.01g] — 2026-03-25 11:43:03 AM EST — v06.47r

### Added
- Data entry and retrieval — submit entries and view all entries from other users
- Fast data reads from cache with automatic fallback to spreadsheet
- Safe concurrent writes — multiple users can submit simultaneously without data loss

Developed by: ShadowAISolutions
