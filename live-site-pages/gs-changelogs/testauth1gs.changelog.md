# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 43/50`

## [Unreleased]

## [v02.34g] — 2026-04-02 01:20:10 PM EST — v08.52r

### Changed
- Minor internal improvements

## [v02.32g] — 2026-03-30 01:35:41 PM EST — v08.19r

### Added
- Standalone breach alert sending function for better code organization
- Configuration introspection for breach alert settings
- Full breach log retrieval with retention-aware filtering and optional status/date filters
- Automatic duplicate prevention when logging breaches from alerts

### Changed
- Breach alert sending is now a reusable standalone operation instead of embedded in detection logic

## [v02.31g] — 2026-03-30 12:36:09 PM EST — v08.17r

### Added
- 30-day deadline extension workflows for access and amendment requests — administrators can now grant extensions with written notice
- Formal denial notice generation with all legally required elements including complaint filing instructions
- Expanded disclosure accounting to include treatment, payment, and operations disclosures with configurable lookback period
- Business associate disclosure source tracking for enhanced regulatory compliance

### Fixed
- Improved disclosure data consistency across all accounting functions

## [v02.30g] — 2026-03-30 12:00:52 PM EST — v08.15r

### Added
- Configurable compliance deadline settings — response timeframes for access requests, amendments, and breach notifications can now be adjusted without code changes
- Disclosure records now track data category classification for enhanced regulatory tracking

## [v02.29g] — 2026-03-30 11:13:25 AM EST — v08.13r

### Added
- Legal hold management — place, release, and query litigation holds that prevent automated archival of protected records
- Retention compliance audit — comprehensive analysis of all protected sheets with status assessment and findings
- Archive integrity verification — SHA-256 checksum computation and verification for archived records
- Retention policy documentation — formal policy document generation with section-by-section regulatory coverage
- Records under legal hold are now automatically excluded from the daily retention enforcement archival

### Changed
- Daily retention enforcement now uses "last in effect" date calculation instead of raw creation date for more accurate retention timing

## [v02.28g] — 2026-03-30 09:36:36 AM EST — v08.10r

### Added
- Full HIPAA Phase B compliance extension — grouped disclosure accounting, summary PHI export, third-party amendment notifications, breach detection and alerting, breach logging with annual report, retention enforcement with automated scheduling, and personal representative access management
- Breach detection now automatically evaluates security events and alerts when thresholds are exceeded
- Retention enforcement can be scheduled to run automatically via time-driven triggers

## [v02.27g] — 2026-03-30 07:29:44 AM EST — v08.07r

### Security
- Improved data export safety — values that could be interpreted as formulas are now sanitized before export

## [v02.26g] — 2026-03-28 03:49:09 PM EST — v07.46r

### Added
- Delete row now asks for confirmation before deleting — shows a styled dialog with row data preview
- Double-tap on table cells now opens the editor on mobile devices
- Mobile-friendly layout improvements for smaller screens

## [v02.25g] — 2026-03-28 02:51:47 PM EST — v07.45r

### Fixed
- Delete buttons now appear immediately when data loads instead of after the first refresh

## [v02.24g] — 2026-03-28 02:16:42 PM EST — v07.41r

### Changed
- Data freshness indicator now shows "0s" at zero seconds and removed "ago" suffix for cleaner display

## [v02.23g] — 2026-03-28 02:07:55 PM EST — v07.40r

### Fixed
- Data poll countdown now reaches 0 before polling instead of jumping from 2-3 seconds

## [v02.22g] — 2026-03-28 01:59:03 PM EST — v07.39r

### Fixed
- Toggle buttons no longer overlap when both are in their toggled-off state

## [v02.21g] — 2026-03-28 01:55:28 PM EST — v07.38r

### Fixed
- Data poll countdown now starts immediately instead of showing "--" until first poll
- Version indicator moved to leftmost position at bottom-left
- Username moved below the navigation bar to avoid overlap

## [v02.20g] — 2026-03-28 01:47:24 PM EST — v07.37r

### Fixed
- Version indicator no longer overlaps with page controls at the bottom-left corner
- Removed redundant email display that overlapped with the main header

## [v02.19g] — 2026-03-28 01:39:47 PM EST — v07.36r

### Fixed
- Toggle button no longer causes controls to overlap or disappear when used repeatedly

## [v02.18g] — 2026-03-28 12:53:44 AM EST — v07.34r

### Fixed
- Toggle button now hides/shows all elements simultaneously

## [v02.17g] — 2026-03-28 12:43:27 AM EST — v07.33r

### Changed
- Data refresh countdown now shows in the header next to the connection status

## [v02.16g] — 2026-03-28 12:35:52 AM EST — v07.32r

### Added
- "GAS" toggle button to hide/show the data interface

## [v02.15g] — 2026-03-28 12:28:26 AM EST — v07.31r

### Changed
- Data refresh countdown now reports its state to the status panel

## [v02.14g] — 2026-03-28 12:12:58 AM EST — v07.30r

### Added
- Data table, add row, delete row, cell editing, and dashboard now run directly in the secure application layer
- Real-time data updates via direct server polling

### Changed
- All data operations now communicate directly with the server instead of relaying through the embedding page

## [v02.13g] — 2026-03-27 09:52:43 PM EST — v07.24r

### Added
- You can now delete rows from the data table

## [v02.12g] — 2026-03-27 09:14:05 PM EST — v07.21r

### Changed
- Minor internal improvements

## [v02.11g] — 2026-03-27 08:57:54 PM EST — v07.19r

### Changed
- Minor internal improvements

## [v02.10g] — 2026-03-27 07:51:34 PM EST — v07.17r

### Changed
- Minor internal improvements

## [v02.09g] — 2026-03-27 07:35:03 PM EST — v07.14r

### Changed
- Minor internal improvements

## [v02.08g] — 2026-03-27 06:37:42 PM EST — v07.09r

### Fixed
- Adding rows to the live data table now works correctly

## [v02.07g] — 2026-03-27 06:14:47 PM EST — v07.08r

### Added
- You can now add new rows to the live data table directly from the page

## [v02.06g] — 2026-03-25 11:30:27 PM EST — v06.74r

### Fixed
- Data refresh now correctly validates your session before delivering updates

## [v02.05g] — 2026-03-25 11:21:12 PM EST — v06.73r

### Fixed
- Data refresh now works correctly with session authentication

## [v02.04g] — 2026-03-25 10:23:52 PM EST — v06.68r

### Security
- Data poll endpoint now validates session token before returning spreadsheet data

## [v02.03g] — 2026-03-25 09:47:45 PM EST — v06.66r

### Changed
- Data updates now arrive through a dedicated lightweight channel instead of being bundled with session management — more consistent refresh timing

## [v02.02g] — 2026-03-25 08:47:57 PM EST — v06.61r

### Fixed
- Background data polling now works correctly — data updates are delivered reliably when you're idle

## [v02.01g] — 2026-03-25 05:56:05 PM EST — v06.59r

### Fixed
- Heartbeat response time restored to normal speed — data updates no longer slow down the connection check

## [v02.00g] — 2026-03-25 05:41:07 PM EST — v06.58r

### Added
- Live data updates now arrive with every heartbeat — no extra loading or delays
- Cell editing support — changes you make in the table are saved to the spreadsheet instantly
- Data refreshes automatically when the spreadsheet is edited directly

## [v01.99g] — 2026-03-23 08:34:55 PM EST — v06.43r

### Added
- Disagreement statement submission — when an amendment request is denied, you can now file a formal disagreement through the app

## [v01.98g] — 2026-03-23 07:32:02 PM EST — v06.39r

### Fixed
- Fixed disclosure accounting and amendment panels not loading — date values from spreadsheet are now properly converted to strings

## [v01.97g] — 2026-03-23 07:13:41 PM EST — v06.38r

### Removed
- Removed the temporary data seeding endpoint — test data has been populated and the endpoint is no longer needed

## [v01.96g] — 2026-03-23 06:56:11 PM EST — v06.37r

### Changed
- Sample data seeding now works via a direct URL call instead of through the app UI — more reliable for populating test data

## [v01.95g] — 2026-03-23 06:29:26 PM EST — v06.36r

### Added
- New "Seed Sample Data" feature — populates your account with sample disclosures, amendment requests, and clinical notes for testing

## [v01.94g] — 2026-03-23 06:08:12 PM EST — v06.35r

### Fixed
- Data download now works — you can export your data as JSON or CSV from the "My Data" panel
- Improved error messages when sessions are interrupted — you'll see a clear "please sign in again" message instead of a generic error

## [v01.93g] — 2026-03-23 02:41:17 PM EST — v06.30r

### Fixed
- Phase A postMessage communication — added listener page in `doGet()` for all HIPAA operations

### Added
- Admin function to list all pending amendment requests for the review panel

## [v01.92g] — 2026-03-23 02:20:16 PM EST — v06.29r

### Added
- Disclosure accounting: track and report PHI disclosures to external parties
- Data export: download all your stored data in JSON or CSV format
- Amendment requests: submit corrections to your health records
- Admin amendment review: approve or deny submitted correction requests
- Statement of disagreement: respond to denied amendment decisions
- Amendment history: view the complete correction trail for any record

## [v01.91g] — 2026-03-22 02:58:37 PM EST — v06.09r

### Changed
- Minor internal improvements



