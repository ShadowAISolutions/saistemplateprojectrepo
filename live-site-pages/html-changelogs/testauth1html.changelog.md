# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 65/50`

## [v03.71w] — 2026-03-29 01:43:18 AM EST — v07.68r

### Changed
- Final sign-in step now reads "Sign-in complete" instead of "Confirming session with server"
- Reconnecting final step now reads "Session restored"

## [v03.70w] — 2026-03-29 01:36:33 AM EST — v07.67r

### Changed
- Renamed loading sub-steps to "Preparing interface" and "Initializing" for clearer descriptions

## [v03.69w] — 2026-03-29 01:09:43 AM EST — v07.65r

### Changed
- Sign-in and sign-out checklists now show all sub-steps from the start instead of revealing them one at a time

## [v03.68w] — 2026-03-28 09:11:25 PM EST — v07.63r

### Fixed
- Sign-out no longer gets stuck on "Waiting for server confirmation"

## [v03.67w] — 2026-03-28 08:50:32 PM EST — v07.62r

### Fixed
- Signing in immediately after signing out no longer gets interrupted by a false "You have been signed out" message

## [v03.66w] — 2026-03-28 08:23:32 PM EST — v07.61r

### Fixed
- Signing in immediately after signing out no longer gets interrupted by a false "You have been signed out" message

## [v03.65w] — 2026-03-28 07:48:08 PM EST — v07.60r

### Fixed
- Steps with sub-steps now show "total" next to their timer to distinguish from individual sub-step timers
- Reconnecting checklist steps now show live timers while in progress

## [v03.64w] — 2026-03-28 07:40:23 PM EST — v07.59r

### Fixed
- Step timers now appear next to each step's text instead of being displaced by sub-steps

## [v03.63w] — 2026-03-28 07:32:09 PM EST — v07.58r

### Fixed
- Sign-out "Waiting for server confirmation" now shows a live-updating timer while active
- All sign-in and sign-out checklist steps now show live timers while in progress

## [v03.62w] — 2026-03-28 06:58:25 PM EST — v07.57r

### Fixed
- "Exchanging credentials with server" now shows its total time again
- "Server authenticating" sub-step now turns green when sign-in moves to the next stage

## [v03.61w] — 2026-03-28 06:33:14 PM EST — v07.55r

### Fixed
- Parent checklist stages with sub-steps no longer show a confusing duplicate total time

## [v03.60w] — 2026-03-28 06:19:20 PM EST — v07.54r

### Fixed
- Checklist timer values no longer carry over between sign-in and sign-out cycles

## [v03.59w] — 2026-03-28 06:19:20 PM EST — v07.53r

### Fixed
- Parent stage total time now displays separately from sub-step times

## [v03.58w] — 2026-03-28 05:55:55 PM EST — v07.52r

### Fixed
- Sub-step timers now freeze when completed — no longer show inflated times that keep growing

## [v03.57w] — 2026-03-28 05:37:53 PM EST — v07.51r

### Changed
- Checklist timers now display seconds with one decimal place instead of milliseconds

## [v03.56w] — 2026-03-28 05:01:25 PM EST — v07.49r

### Added
- Sign-out checklist now shows sub-steps with live timing during "Invalidating server session"

## [v03.55w] — 2026-03-28 04:41:33 PM EST — v07.48r

### Fixed
- Sign-in checklist timers no longer accumulate across sign-out/sign-in cycles — timers reset cleanly on each new sign-in

## [v03.54w] — 2026-03-28 04:33:31 PM EST — v07.47r

### Added
- Sign-in checklist now shows detailed sub-steps with live timing during "Exchanging credentials with server" and "Loading the application"
- Sub-steps include: Connecting to server, Sending credentials, Server authenticating, Downloading app, and Starting up
- Active sub-steps display a real-time elapsed timer that updates every 100ms

## [v03.53w] — 2026-03-28 02:51:47 PM EST — v07.45r

### Fixed
- Admin dropdown menu now appears above open panels instead of closing them

## [v03.52w] — 2026-03-28 02:43:50 PM EST — v07.44r

### Fixed
- Admin dropdown no longer hides behind open panels

## [v03.51w] — 2026-03-28 02:39:19 PM EST — v07.43r

### Changed
- Admin navigation buttons (Sessions, Disclosures, My Data, Correction, Amendments, Disagree) now appear in a dropdown menu under the ADMIN badge instead of inline

## [v03.50w] — 2026-03-28 02:24:26 PM EST — v07.42r

### Changed
- Removed unused external font source from security policy

## [v03.49w] — 2026-03-28 01:55:28 PM EST — v07.38r

### Changed
- Toggle button repositioned to make room for version indicator at bottom-left

## [v03.48w] — 2026-03-28 01:34:55 PM EST — v07.35r

### Fixed
- Toggle button no longer causes controls to overlap or disappear when used repeatedly

## [v03.47w] — 2026-03-28 12:53:44 AM EST — v07.34r

### Fixed
- Toggle button now hides/shows all controls simultaneously

## [v03.46w] — 2026-03-28 12:43:27 AM EST — v07.33r

### Changed
- Data refresh countdown moved from the session panel into the data interface header

## [v03.45w] — 2026-03-28 12:35:52 AM EST — v07.32r

### Added
- "HTML" toggle button to hide/show page controls

## [v03.44w] — 2026-03-28 12:28:26 AM EST — v07.31r

### Changed
- Data refresh countdown timer restored in the status panel

## [v03.43w] — 2026-03-28 12:12:58 AM EST — v07.30r

### Changed
- Data table and controls now load inside the secure application layer for improved security

## [v03.42w] — 2026-03-27 11:48:48 PM EST — v07.29r

### Fixed
- "Sending..." indicator on new rows now disappears as soon as the row is saved, not after the next data refresh

## [v03.41w] — 2026-03-27 11:44:05 PM EST — v07.28r

### Changed
- New rows now show a "Sending..." overlay while being saved — no delete button until confirmed

## [v03.40w] — 2026-03-27 11:32:41 PM EST — v07.27r

### Fixed
- Data updates are now more resilient — automatic recovery if a network request stalls

## [v03.39w] — 2026-03-27 11:21:05 PM EST — v07.26r

### Fixed
- Add Row button now enables immediately if you type new values while a previous row is still being sent

## [v03.38w] — 2026-03-27 11:13:56 PM EST — v07.25r

### Changed
- Deleting a row now shows a "Deleting..." indicator on the row while it's being removed

## [v03.37w] — 2026-03-27 09:52:43 PM EST — v07.24r

### Added
- Delete button on each row — removes the row instantly with one click

## [v03.36w] — 2026-03-27 09:46:47 PM EST — v07.23r

### Changed
- Add Row button is now disabled when all fields are empty
- New rows appear in the table instantly — no more waiting for the server response

## [v03.35w] — 2026-03-27 09:40:42 PM EST — v07.22r

### Changed
- Add Row button now shows "Sending..." feedback while your new row is being saved

## [v03.34w] — 2026-03-27 09:14:05 PM EST — v07.21r

### Fixed
- Restored working sign-in flow

## [v03.33w] — 2026-03-27 09:09:21 PM EST — v07.20r

### Fixed
- Eliminated remaining console errors that appeared during sign-out and re-sign-in

## [v03.32w] — 2026-03-27 08:57:54 PM EST — v07.19r

### Fixed
- Eliminated console errors that appeared during sign-in and sign-out

## [v03.31w] — 2026-03-27 08:32:28 PM EST — v07.18r

### Added
- Data polling and session checks now pause while the sign-in popup is open

## [v03.30w] — 2026-03-27 07:51:34 PM EST — v07.17r

### Fixed
- Eliminated remaining console errors from background session checks

## [v03.29w] — 2026-03-27 07:42:13 PM EST — v07.16r

### Fixed
- Fixed data polling blocked after redirect to response server

## [v03.28w] — 2026-03-27 07:39:38 PM EST — v07.15r

### Fixed
- Fixed data polling blocked by content security policy after sign-in

## [v03.27w] — 2026-03-27 07:35:03 PM EST — v07.14r

### Fixed
- Eliminated console errors caused by data synchronization

## [v03.26w] — 2026-03-27 07:18:05 PM EST — v07.13r

### Fixed
- Eliminated font loading errors that appeared on every page load

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

Developed by: ShadowAISolutions
