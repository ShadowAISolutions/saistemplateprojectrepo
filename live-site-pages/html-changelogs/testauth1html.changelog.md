# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 39/50`

## [v03.25w] — 2026-03-27 07:12:09 PM EST — v07.12r

### Fixed
- Fixed spreadsheet writes not working — input field submissions and cell edits now correctly reach the server

## [v03.24w] — 2026-03-27 07:00:26 PM EST — v07.11r

### Changed
- Minor internal improvements

## [v03.23w] — 2026-03-27 06:53:06 PM EST — v07.10r

### Fixed
- Eliminated font loading errors that appeared on every page load

## [v03.22w] — 2026-03-27 06:14:47 PM EST — v07.08r

### Added
- New input bar for adding rows directly to the live data table — type values and press Enter or click Add Row

## [v03.21w] — 2026-03-27 05:23:48 PM EST — v07.07r

### Fixed
- Testing buttons no longer overlap the version indicator at the bottom of the page

## [v03.20w] — 2026-03-27 05:16:57 PM EST — v07.06r

### Changed
- Testing buttons moved to bottom-left corner near the version indicators, no longer inside the data table area

## [v03.19w] — 2026-03-27 04:31:41 PM EST — v07.05r

### Changed
- Live data table now appears as a contained panel in the center of the page instead of covering the entire screen, keeping navigation and status indicators visible

## [v03.18w] — 2026-03-27 04:25:25 PM EST — v07.04r

### Changed
- Testing buttons now appear in a fixed bottom bar below the data table instead of floating over the content

## [v03.17w] — 2026-03-26 02:29:03 PM EST — v06.99r

### Changed
- Minor internal improvements

## [v03.16w] — 2026-03-26 01:17:37 PM EST — v06.97r

### Fixed
- Fixed re-authentication to properly auto-select the same Google account without showing the account picker

## [v03.15w] — 2026-03-26 12:58:10 PM EST — v06.96r

### Changed
- Re-authenticating now automatically signs you in with the same Google account instead of showing the account picker

## [v03.14w] — 2026-03-26 12:03:38 PM EST — v06.95r

### Fixed
- Closing the Google sign-in popup without completing sign-in now properly returns you to the sign-in screen if your session has expired

## [v03.13w] — 2026-03-26 11:14:47 AM EST — v06.94r

### Security
- Improved sign-in security — SSO token refresh now validates the correct Google account is used

## [v03.12w] — 2026-03-26 11:06:12 AM EST — v06.93r

### Changed
- Page title updated to "Testauth1 Title"

## [v03.11w] — 2026-03-26 10:49:30 AM EST — v06.92r

### Fixed
- "Use Here" session reclaim no longer gets stuck on reconnecting

## [v03.10w] — 2026-03-26 09:32:01 AM EST — v06.90r

### Changed
- SSO sign-in now shows the authentication progress checklist with timing alongside the source indicator

## [v03.09w] — 2026-03-26 09:25:30 AM EST — v06.89r

### Fixed
- Fixed sign-in hanging on "Exchanging credentials with server" when the server takes longer than 30 seconds to respond — now shows a clear timeout error with a retry prompt

## [v03.08w] — 2026-03-26 08:58:20 AM EST — v06.87r

### Added
- Sign-in now shows a real-time checklist with timing for each authentication step
- Sign-out now shows a real-time checklist tracking each step of the sign-out process with timing
- Reconnecting now shows a real-time checklist tracking session verification with timing

## [v03.07w] — 2026-03-26 08:02:27 AM EST — v06.82r

### Added
- Sign-in now shows real-time progress messages ("Contacting Google…", "Verifying your identity…", "Creating your session…", "Almost ready…") so you can see exactly what stage of authentication you're at

## [v03.06w] — 2026-03-25 11:54:00 PM EST — v06.78r

### Fixed
- Data poll countdown now shows "polling..." indicator on every poll cycle, not just the first

## [v03.05w] — 2026-03-25 11:47:57 PM EST — v06.77r

### Fixed
- Data poll countdown now counts down smoothly from 15 to 0 without random jumps

## [v03.04w] — 2026-03-25 11:42:42 PM EST — v06.76r

### Fixed
- Minor internal improvements

## [v03.03w] — 2026-03-25 11:36:58 PM EST — v06.75r

### Fixed
- Data refresh countdown now briefly shows "polling..." before resetting, instead of jumping from 0 to 15

## [v03.02w] — 2026-03-25 11:30:27 PM EST — v06.74r

### Fixed
- Data refresh recovers faster when the server reports an error

## [v03.01w] — 2026-03-25 11:21:12 PM EST — v06.73r

### Fixed
- Data refresh now updates reliably on every poll cycle

## [v03.00w] — 2026-03-25 11:11:53 PM EST — v06.72r

### Changed
- Minor internal improvements

## [v02.99w] — 2026-03-25 11:04:58 PM EST — v06.71r

### Fixed
- Data refresh now works reliably — no longer requires a heartbeat to trigger

## [v02.98w] — 2026-03-25 10:57:30 PM EST — v06.70r

### Fixed
- Data refresh countdown timer no longer gets stuck at 0:00 after a slow server response

## [v02.97w] — 2026-03-25 10:23:52 PM EST — v06.68r

### Security
- Data requests now include session authentication — unauthenticated data access is no longer possible

## [v02.96w] — 2026-03-25 10:05:15 PM EST — v06.67r

### Fixed
- Heartbeat timer countdown now remains visible during idle state — shows time until next tick with idle indicator

## [v02.95w] — 2026-03-25 09:47:45 PM EST — v06.66r

### Changed
- Data polling now runs continuously via dedicated pipeline, independent of user activity state
- Data poll timer always shows countdown when active, not just when idle

## [v02.94w] — 2026-03-25 09:17:26 PM EST — v06.65r

### Changed
- All timer rows are now always visible — the Data Poll row shows `--` when inactive instead of disappearing

## [v02.93w] — 2026-03-25 09:11:17 PM EST — v06.64r

### Changed
- Idle data poll now has its own separate countdown row in the timers panel, making it easy to distinguish from the heartbeat countdown

## [v02.92w] — 2026-03-25 09:05:04 PM EST — v06.63r

### Changed
- When idle, the timer now counts down to the next background data poll so you can see exactly when fresh data will arrive

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

