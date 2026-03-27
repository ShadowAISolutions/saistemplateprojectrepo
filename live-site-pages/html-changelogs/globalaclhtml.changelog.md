# Changelog — Global ACL

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [globalaclhtml.changelog-archive.md](globalaclhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 37/50`

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
- "Signing in via Application Portal" message now appears during SSO sign-in instead of generic "Setting up your session"

## [v01.18w] — 2026-03-22 02:05:02 PM EST — v06.05r

### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

## [v01.17w] — 2026-03-22 01:34:18 PM EST — v06.04r

### Added
- Automatic sign-in via SSO when the Application Portal is open — no manual sign-in needed
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
