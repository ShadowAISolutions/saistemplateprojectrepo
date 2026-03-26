# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 46/50`

## [Unreleased]

## [v02.91w] — 2026-03-25 09:00:26 PM EST — v06.62r

### Changed
- Data updates twice as fast when you step away — background polling now runs every 15 seconds instead of 30

## [v02.90w] — 2026-03-25 08:47:57 PM EST — v06.61r

### Fixed
- Background data polling now works correctly when idle — the table updates with the latest spreadsheet data even when you step away

## [v02.89w] — 2026-03-25 07:14:40 PM EST — v06.60r

### Changed
- Data stays live even when you step away — a lightweight background poll keeps the table updated without extending your session
- Heartbeat timer now shows different icons: `▶` when actively extending your session, `◇` when just polling for data in the background

## [v02.88w] — 2026-03-25 05:56:05 PM EST — v06.59r

### Fixed
- Data now updates correctly when the spreadsheet is edited — changes appear on the next heartbeat cycle

## [v02.87w] — 2026-03-25 05:41:07 PM EST — v06.58r

### Added
- Live data table replacing the placeholder content area — view your spreadsheet data in real-time with sortable columns
- Cell change detection with green flash animation when data updates
- Dashboard card view as an alternative to the table layout
- Connection status indicator showing how fresh the data is
- Double-click any cell to edit it directly (requires write permission)
- View toggle to switch between Table and Dashboard layouts

## [v02.86w] — 2026-03-23 08:34:55 PM EST — v06.43r

### Added
- New "Disagree" button — if your correction request is denied, you can now file a formal statement of disagreement that is permanently attached to your record

## [v02.85w] — 2026-03-23 08:05:48 PM EST — v06.42r

### Changed
- Panel buttons now only open — closing is done via the X button or by switching panels
- Cooldown reduced to 1 second

## [v02.84w] — 2026-03-23 07:55:08 PM EST — v06.41r

### Changed
- Other panel buttons now appear visually disabled during the cooldown period

## [v02.83w] — 2026-03-23 07:44:01 PM EST — v06.40r

### Changed
- Navigation panels no longer overlap — only one panel can be open at a time
- Added a brief cooldown between switching panels to prevent rapid toggling

## [v02.82w] — 2026-03-23 06:56:11 PM EST — v06.37r

### Removed
- Removed "Seed Sample Data" button from the My Data panel (seeding is now done via direct URL)

## [v02.81w] — 2026-03-23 06:29:26 PM EST — v06.36r

### Added
- "Seed Sample Data" button in the My Data panel (admin-only) — one click to populate test data across all HIPAA features

## [v02.80w] — 2026-03-23 05:53:51 PM EST — v06.34r

### Fixed
- Panels and overlays now close immediately when you sign out — no more lingering popups during the sign-out process

## [v02.79w] — 2026-03-23 03:17:49 PM EST — v06.33r

### Fixed
- HIPAA panels now close and clear all data when you sign out or your session expires — no leftover information visible

## [v02.78w] — 2026-03-23 03:11:50 PM EST — v06.32r

### Fixed
- HIPAA panels now correctly read your active session — no more "session expired" errors

## [v02.77w] — 2026-03-23 03:06:26 PM EST — v06.31r

### Fixed
- HIPAA panels now load correctly — message types were being blocked by security allowlist

## [v02.76w] — 2026-03-23 02:41:17 PM EST — v06.30r

### Fixed
- HIPAA panels (Disclosures, My Data, Corrections, Amendments) now load and respond correctly

## [v02.75w] — 2026-03-23 02:20:16 PM EST — v06.29r

### Added
- HIPAA Privacy Rule compliance buttons: Disclosure History, Download My Data, Request Correction, Review Amendments
- Disclosure accounting panel showing your PHI disclosure history with JSON/CSV export
- Data export panel for downloading all your stored data (JSON or CSV format)
- Amendment request form for submitting record correction requests
- Admin amendment review panel for approving or denying correction requests

## [v02.74w] — 2026-03-23 08:38:15 AM EST — v06.17r

### Added
- New "Sign Out" and "Sign Out All" buttons — sign out of just this page or all connected pages at once

## [v02.73w] — 2026-03-23 08:20:05 AM EST — v06.16r

### Changed
- Minor internal improvements

## [v02.72w] — 2026-03-22 02:30:05 PM EST — v06.07r

### Changed
- Minor internal improvements

## [v02.71w] — 2026-03-22 02:05:02 PM EST — v06.05r

### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

## [v02.70w] — 2026-03-22 12:51:12 PM EST — v06.03r

### Changed
- Minor internal improvements

## [v02.69w] — 2026-03-22 12:45:46 PM EST — v06.02r

### Changed
- Minor internal improvements

## [v02.68w] — 2026-03-22 12:23:54 PM EST — v05.99r

### Fixed
- No longer triggers unnecessary Google re-authentication on page refresh

## [v02.67w] — 2026-03-22 12:08:17 PM EST — v05.98r

### Fixed
- SSO auto-authentication now works after page refresh

## [v02.66w] — 2026-03-22 11:38:56 AM EST — v05.97r

### Changed
- "Session Active Elsewhere" overlay now shows the application name

## [v02.65w] — 2026-03-22 01:26:48 AM EST — v05.95r

### Fixed
- "Signing in via [source]" subtitle now correctly displays during SSO authentication

## [v02.64w] — 2026-03-22 01:19:31 AM EST — v05.94r

### Changed
- Sign-in screen now shows which page provided your credentials when signing in via SSO

## [v02.63w] — 2026-03-22 01:03:31 AM EST — v05.93r

### Fixed
- Session timeout on other pages no longer disrupts your session — only deliberate sign-outs affect all pages

## [v02.62w] — 2026-03-22 12:27:41 AM EST — v05.92r

### Added
- Single sign-on support — auto-authenticates when another auth page (like Application Portal) is already signed in
- Cross-page sign-out — signing out from any connected page signs out all pages

### Changed
- Shared Google OAuth client for unified sign-in experience across all auth pages

## [v02.61w] — 2026-03-21 06:15:12 PM EST — v05.77r

### Fixed
- GAS changelog popup title no longer shows pipe characters

## [v02.60w] — 2026-03-21 06:07:27 PM EST — v05.76r

### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

## [v02.59w] — 2026-03-21 05:21:32 PM EST — v05.74r

### Fixed
- Page refresh and "Use Here" no longer get stuck on "Reconnecting" screen
- Sign-in no longer triggers a false security alert in the audit log

## [v02.58w] — 2026-03-21 04:51:56 PM EST — v05.70r

### Security
- Improved protection against unauthorized direct access to the application

## [v02.57w] — 2026-03-21 03:31:22 PM EST — v05.69r

### Fixed
- Sign-in now works reliably — resolved a background timing issue that could prevent the app from loading

## [v02.56w] — 2026-03-21 03:22:38 PM EST — v05.68r

### Fixed
- Sign-in now completes immediately without getting stuck on loading screen

## [v02.55w] — 2026-03-21 03:12:33 PM EST — v05.67r

### Fixed
- Fixed sign-in flow being blocked when returning to the page with an existing session

## [v02.54w] — 2026-03-21 03:06:45 PM EST — v05.66r

### Fixed
- Fixed sign-in getting stuck on "Signing in..." screen

## [v02.53w] — 2026-03-21 02:51:28 PM EST — v05.65r

### Changed
- Session tokens are no longer exposed in browser URLs — all authentication now uses one-time-use tokens that expire in 60 seconds
- Sign-in, session restore, and tab switching all use the new secure token flow

## [v02.52w] — 2026-03-21 01:01:38 PM EST — v05.64r

### Fixed
- Sign-in flow restored to working state

## [v02.51w] — 2026-03-21 12:45:23 PM EST — v05.63r

### Fixed
- Session setup now completes properly after sign-in

## [v02.50w] — 2026-03-21 12:31:09 PM EST — v05.62r

### Changed
- Session authentication now uses a secure handshake instead of passing credentials in the page address

## [v02.49w] — 2026-03-21 11:55:49 AM EST — v05.61r

### Fixed
- Sign-out now properly invalidates server-side sessions before clearing the page

### Added
- "Signing out..." overlay with spinner shown during session cleanup

## [v02.48w] — 2026-03-20 11:02:26 PM EST — v05.56r

### Changed
- Updated setup error message to reflect auto-generation of security keys on first deploy

## [v02.47w] — 2026-03-20 10:05:19 PM EST — v05.54r

### Fixed
- Popups and overlays no longer persist on screen after signing out

## [v02.46w] — 2026-03-20 07:27:24 PM EST — v05.44r

### Fixed
- Sessions no longer conflict with other projects open in the same browser

Developed by: ShadowAISolutions
