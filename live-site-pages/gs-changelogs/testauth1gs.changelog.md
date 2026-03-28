# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 46/50`

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

## [v01.90g] — 2026-03-21 05:14:49 PM EST — v05.73r

### Fixed
- Page refresh and "Use Here" now reconnect immediately

## [v01.89g] — 2026-03-21 05:08:29 PM EST — v05.72r

### Fixed
- Page refresh and "Use Here" no longer get stuck on "Reconnecting" screen

## [v01.88g] — 2026-03-21 04:51:56 PM EST — v05.70r

### Security
- Replaced direct-access protection with a more reliable method that works correctly with the application's architecture

## [v01.87g] — 2026-03-21 03:31:22 PM EST — v05.69r

### Fixed
- Minor internal improvements to authentication flow reliability

## [v01.86g] — 2026-03-21 03:22:38 PM EST — v05.68r

### Fixed
- App now confirms authentication immediately instead of waiting for a background server call

## [v01.85g] — 2026-03-21 03:06:45 PM EST — v05.66r

### Changed
- Token exchange now provides a ready-to-use access token, eliminating an extra server round-trip during sign-in

## [v01.84g] — 2026-03-21 02:51:28 PM EST — v05.65r

### Changed
- Direct access to the script URL with a session token is now blocked — only one-time-use tokens are accepted
- Session token lifetime for URL loading increased from 30 to 60 seconds

### Added
- Secure token generation endpoint for the embedding page to request one-time-use access tokens

## [v01.83g] — 2026-03-21 01:01:38 PM EST — v05.64r

### Fixed
- Minor internal improvements

## [v01.82g] — 2026-03-21 12:45:23 PM EST — v05.63r

### Fixed
- Session handshake now completes properly — nonce delivery uses the correct channel

## [v01.81g] — 2026-03-21 12:31:09 PM EST — v05.62r

### Added
- Secure page nonce handshake — session credentials are verified via a private channel instead of being visible in the page address

## [v01.80g] — 2026-03-21 11:31:04 AM EST — v05.60r

### Fixed
- Iframe guard now correctly blocks direct navigation to session URLs

## [v01.79g] — 2026-03-21 11:09:01 AM EST — v05.59r

### Fixed
- Direct navigation to session URLs no longer renders the app — shows "Access denied" message instead



