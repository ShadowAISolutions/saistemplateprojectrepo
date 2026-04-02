# Changelog — Global ACL

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [globalaclhtml.changelog-archive.md](globalaclhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 68/50`

## [Unreleased]

## [v01.68w] — 2026-04-02 09:54:42 AM EST — v08.40r

### Changed
- Breach logging now captures mitigation steps and report year for full §164.404(c) compliance
- Denial notices now include appeal indicator and contact information per §164.524(d)(2)
- Legal holds form now supports status filtering, hold types, date ranges, and sheet selection
- Representative registration now tracks authority expiration dates and notes

## [v01.67w] — 2026-04-02 09:29:22 AM EST — v08.39r

### Changed
- Admin controls now appear in a compact dropdown menu instead of a long button bar

## [v01.66w] — 2026-04-02 09:20:12 AM EST — v08.38r

### Added
- Full HIPAA compliance panel suite — access disclosures, request corrections, file disagreements, manage breach logs, legal holds, and more directly from this page

## [v01.65w] — 2026-03-29 02:08:47 PM EST — v07.78r

### Fixed
- Global Sessions panel no longer stays visible during sign-out
- Sessions and Global Sessions panels now close each other when toggling between them

## [v01.64w] — 2026-03-29 01:58:46 PM EST — v07.77r

### Changed
- You can now sign yourself out from the Global Sessions panel — Sign Out and Sign Out All Projects buttons appear on your own sessions

## [v01.63w] — 2026-03-29 02:39:56 AM EST — v07.75r

### Changed
- Parent stage timers now show "group" instead of "total" to distinguish from the grand total

## [v01.62w] — 2026-03-29 02:29:20 AM EST — v07.74r

### Changed
- Total elapsed timer now counts live from the start on the final checklist row

## [v01.61w] — 2026-03-29 02:23:50 AM EST — v07.73r

### Changed
- Total elapsed time now shows on the final checklist row instead of below the checklist

## [v01.60w] — 2026-03-29 02:18:23 AM EST — v07.72r

### Added
- Total elapsed time now shown at the bottom of sign-in and sign-out checklists

## [v01.59w] — 2026-03-29 01:54:51 AM EST — v07.70r

### Added
- "Sign-out complete" final step added to sign-out checklist

## [v01.58w] — 2026-03-29 01:49:03 AM EST — v07.69r

### Changed
- Sign-out final step now reads "Waiting for sign-out confirmation"

## [v01.57w] — 2026-03-29 01:43:18 AM EST — v07.68r

### Changed
- Final sign-in step now reads "Sign-in complete" instead of "Confirming session with server"
- Reconnecting final step now reads "Session restored"

## [v01.56w] — 2026-03-29 01:36:33 AM EST — v07.67r

### Changed
- Renamed loading sub-steps to "Preparing interface" and "Initializing" for clearer descriptions

## [v01.55w] — 2026-03-29 01:09:43 AM EST — v07.65r

### Changed
- Sign-in and sign-out checklists now show all sub-steps from the start instead of revealing them one at a time

## [v01.54w] — 2026-03-28 09:11:25 PM EST — v07.63r

### Fixed
- Sign-out no longer gets stuck on "Waiting for server confirmation"

## [v01.53w] — 2026-03-28 08:50:32 PM EST — v07.62r

### Fixed
- Signing in immediately after signing out no longer gets interrupted by a false "You have been signed out" message

## [v01.52w] — 2026-03-28 08:23:32 PM EST — v07.61r

### Fixed
- Signing in immediately after signing out no longer gets interrupted by a false "You have been signed out" message

## [v01.51w] — 2026-03-28 07:48:08 PM EST — v07.60r

### Fixed
- Steps with sub-steps now show "total" next to their timer to distinguish from individual sub-step timers
- Reconnecting checklist steps now show live timers while in progress

## [v01.50w] — 2026-03-28 07:40:23 PM EST — v07.59r

### Fixed
- Step timers now appear next to each step's text instead of being displaced by sub-steps

## [v01.49w] — 2026-03-28 07:32:09 PM EST — v07.58r

### Fixed
- Sign-out "Waiting for server confirmation" now shows a live-updating timer while active
- All sign-in and sign-out checklist steps now show live timers while in progress

## [v01.48w] — 2026-03-28 06:58:25 PM EST — v07.57r

### Fixed
- Parent stage total times restored, sub-steps now complete when parent stage transitions

## [v01.47w] — 2026-03-28 06:33:14 PM EST — v07.55r

### Fixed
- Parent checklist stages with sub-steps no longer show a confusing duplicate total time

## [v01.46w] — 2026-03-28 06:19:20 PM EST — v07.54r

### Fixed
- Checklist timer values no longer carry over between sign-in and sign-out cycles

## [v01.45w] — 2026-03-28 06:19:20 PM EST — v07.53r

### Fixed
- Parent stage total time now displays separately from sub-step times

## [v01.44w] — 2026-03-28 05:55:55 PM EST — v07.52r

### Fixed
- Sub-step timers now freeze when completed — no longer show inflated times that keep growing

## [v01.43w] — 2026-03-28 05:37:53 PM EST — v07.51r

### Changed
- Checklist timers now display seconds with one decimal place instead of milliseconds

## [v01.42w] — 2026-03-28 05:04:13 PM EST — v07.50r

### Changed
- Minor internal improvements

## [v01.41w] — 2026-03-28 05:04:13 PM EST — v07.50r

### Fixed
- Sign-out sub-step timing now works correctly — wiring calls were missing from the sign-out flow

## [v01.40w] — 2026-03-28 05:01:25 PM EST — v07.49r

### Added
- Sign-in checklist now shows detailed sub-steps with live timing during "Exchanging credentials with server" and "Loading the application"
- Sign-out checklist now shows sub-steps with live timing during "Invalidating server session"

## [v01.39w] — 2026-03-27 07:18:05 PM EST — v07.13r

### Fixed
- Eliminated font loading errors that appeared on every page load

## [v01.38w] — 2026-03-27 07:00:26 PM EST — v07.11r

### Changed
- Minor internal improvements

## [v01.37w] — 2026-03-27 06:53:06 PM EST — v07.10r

### Fixed
- Eliminated font loading errors that appeared on every page load

## [v01.36w] — 2026-03-26 02:29:03 PM EST — v06.99r

### Changed
- Minor internal improvements

## [v01.35w] — 2026-03-26 01:17:37 PM EST — v06.97r

### Fixed
- Fixed re-authentication to properly auto-select the same Google account without showing the account picker

## [v01.34w] — 2026-03-26 12:58:10 PM EST — v06.96r

### Changed
- Re-authenticating now automatically signs you in with the same Google account instead of showing the account picker

## [v01.33w] — 2026-03-26 12:03:38 PM EST — v06.95r

### Fixed
- Closing the Google sign-in popup without completing sign-in now properly returns you to the sign-in screen if your session has expired

## [v01.32w] — 2026-03-26 11:14:47 AM EST — v06.94r

### Security
- Improved sign-in security — SSO token refresh now validates the correct Google account is used

## [v01.31w] — 2026-03-26 10:49:30 AM EST — v06.92r

### Fixed
- "Use Here" session reclaim no longer gets stuck on reconnecting

## [v01.30w] — 2026-03-26 09:32:01 AM EST — v06.90r

### Changed
- SSO sign-in now shows the authentication progress checklist with timing alongside the source indicator

## [v01.29w] — 2026-03-26 09:25:30 AM EST — v06.89r

### Fixed
- Fixed sign-in hanging on "Exchanging credentials with server" when the server takes longer than 30 seconds to respond — now shows a clear timeout error with a retry prompt

## [v01.28w] — 2026-03-26 08:58:20 AM EST — v06.87r

### Added
- Sign-in now shows a real-time checklist with timing for each authentication step
- Sign-out now shows a real-time checklist tracking each step of the sign-out process with timing
- Reconnecting now shows a real-time checklist tracking session verification with timing

## [v01.27w] — 2026-03-26 08:02:27 AM EST — v06.82r

### Added
- Sign-in now shows real-time progress messages ("Contacting Google…", "Verifying your identity…", "Creating your session…", "Almost ready…") so you can see exactly what stage of authentication you're at

## [v01.26w] — 2026-03-25 09:07:53 AM EST — v06.44r

### Fixed
- Panels and overlays now close properly during sign-out, preventing UI glitches

## [v01.25w] — 2026-03-23 08:38:15 AM EST — v06.17r

### Added
- New "Sign Out" and "Sign Out All" buttons — sign out of just this page or all connected pages at once

## [v01.24w] — 2026-03-23 08:20:05 AM EST — v06.16r

### Changed
- Minor internal improvements

## [v01.23w] — 2026-03-22 03:19:28 PM EST — v06.12r

### Fixed
- Session countdown timer now matches server-side 15-minute HIPAA timeout

## [v01.22w] — 2026-03-22 03:12:04 PM EST — v06.11r

### Changed
- Switched to HIPAA security defaults — sessions no longer persist across browser restarts

## [v01.21w] — 2026-03-22 03:06:49 PM EST — v06.10r

### Fixed
- No longer shows "Reconnecting" when opening the page fresh after a session has expired

## [v01.20w] — 2026-03-22 02:30:05 PM EST — v06.07r

### Fixed
- Tab duplication no longer expires the session — the new tab correctly inherits the active session

## [v01.19w] — 2026-03-22 02:12:54 PM EST — v06.06r

### Fixed
- "Signing in via Program Portal" message now appears during SSO sign-in instead of generic "Setting up your session"

## [v01.18w] — 2026-03-22 02:05:02 PM EST — v06.05r

### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

## [v01.17w] — 2026-03-22 01:34:18 PM EST — v06.04r

### Added
- Automatic sign-in via SSO when the Program Portal is open — no manual sign-in needed
- Cross-page sign-out — signing out of one app signs out all connected apps
- "Signing in via SSO..." status message during automatic authentication

## [v01.16w] — 2026-03-22 12:51:12 PM EST — v06.03r

### Changed
- Minor internal improvements

## [v01.15w] — 2026-03-22 12:45:46 PM EST — v06.02r

### Changed
- Minor internal improvements

## [v01.14w] — 2026-03-22 12:23:54 PM EST — v05.99r

### Fixed
- No longer triggers unnecessary Google re-authentication on page refresh

## [v01.13w] — 2026-03-22 12:08:17 PM EST — v05.98r

### Fixed
- SSO auto-authentication now works after page refresh

## [v01.12w] — 2026-03-22 11:38:56 AM EST — v05.97r

### Changed
- "Session Active Elsewhere" overlay now shows the application name

## [v01.11w] — 2026-03-21 06:15:12 PM EST — v05.77r

### Fixed
- GAS changelog popup title no longer shows pipe characters

## [v01.10w] — 2026-03-21 06:07:27 PM EST — v05.76r

### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

## [v01.09w] — 2026-03-21 01:01:38 PM EST — v05.64r

### Fixed
- Sign-in flow restored to working state

## [v01.08w] — 2026-03-21 12:45:23 PM EST — v05.63r

### Fixed
- Session setup now completes properly after sign-in

## [v01.07w] — 2026-03-21 12:31:09 PM EST — v05.62r

### Changed
- Session authentication now uses a secure handshake instead of passing credentials in the page address

## [v01.06w] — 2026-03-21 11:55:49 AM EST — v05.61r

### Fixed
- Sign-out now properly invalidates server-side sessions before clearing the page

### Added
- "Signing out..." overlay with spinner shown during session cleanup

## [v01.05w] — 2026-03-20 11:02:26 PM EST — v05.56r

### Changed
- Updated setup error message to reflect auto-generation of security keys on first deploy

## [v01.04w] — 2026-03-20 10:05:19 PM EST — v05.54r

### Fixed
- All popups, overlays, and background timers now properly deactivated on sign-out

## [v01.03w] — 2026-03-20 09:56:00 PM EST — v05.53r

### Fixed
- Global sessions panel now properly closes when signing out

## [v01.02w] — 2026-03-20 07:27:24 PM EST — v05.44r

### Fixed
- Sessions no longer conflict with other projects open in the same browser

## [v01.01w] — 2026-03-20 06:13:55 PM EST — v05.41r

### Added
- "Global Sessions" button for admin users to view sessions across all projects
- Dedicated green-themed panel showing sessions grouped by project with status indicators
- Ability to sign out users from individual projects or all projects at once

Developed by: ShadowAISolutions
