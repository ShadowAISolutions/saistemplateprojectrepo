# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 48/50`

## [Unreleased]

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

## [v02.45w] — 2026-03-19 05:46:46 PM EST — v05.14r

### Fixed
- Admin session management button is now properly clickable for admin users

## [v02.44w] — 2026-03-19 02:36:10 PM EST — v05.10r

### Fixed
- Admin session management button now appears correctly for admin users

## [v02.43w] — 2026-03-19 02:15:50 PM EST — v05.07r

### Changed
- Buttons and sections are now gated using simple HTML attributes — no external configuration needed to hide features based on your role

## [v02.42w] — 2026-03-19 02:07:08 PM EST — v05.06r

### Changed
- Page elements (buttons, sections) are now automatically hidden or shown based on your role — no more seeing features you can't use

## [v02.41w] — 2026-03-19 12:45:41 PM EST — v05.04r

### Fixed
- Admin sign-out now immediately shows "An administrator ended your session" without requiring a page refresh
- Heartbeat no longer gets stuck on "sending..." when session is admin-invalidated

## [v02.40w] — 2026-03-19 12:37:20 PM EST — v05.03r

### Fixed
- Users signed out by an admin now see a clear sign-in page instead of being stuck on "Reconnecting..."
- Admin sign-out now shows "An administrator ended your session" instead of a generic expiration message

## [v02.39w] — 2026-03-19 12:24:13 PM EST — v05.02r

### Fixed
- Session management panel now loads and displays active sessions correctly

## [v02.38w] — 2026-03-19 12:16:19 PM EST — v05.01r

### Added
- New "Sessions" button for admins — view all active sessions and sign out any user directly from the page

## [v02.37w] — 2026-03-19 11:23:01 AM EST — v04.98r

### Added
- Your assigned role (e.g. admin, clinician, viewer) now appears as a badge next to your email after signing in

## [v02.36w] — 2026-03-19 10:46:42 AM EST — v04.96r

### Added
- Your role and access level are now remembered when you sign in, preparing for future role-based features

### Changed
- Sign-in and session resume now include role information from the server

## [v02.35w] — 2026-03-18 02:50:29 PM EST — v04.81r

### Changed
- Improved message verification security — all messages are now validated using a single, stronger cryptographic method
- Security self-test panel updated to reflect the stronger verification system

### Removed
- Removed support for legacy message verification (no longer needed after server-side upgrade)

## [v02.34w] — 2026-03-18 01:12:40 PM EST — v04.78r

### Fixed
- Fixed tab duplication causing an iframe reload loop instead of gracefully transferring to the new tab
- HMAC key is now properly restored after "Use Here" reclaim without causing refresh spam

## [v02.33w] — 2026-03-18 01:02:43 PM EST — v04.77r

### Fixed
- HMAC key is now properly restored after reclaiming a session with "Use Here"

## [v02.32w] — 2026-03-18 11:49:04 AM EST — v04.76r

### Fixed
- Security event reports no longer fire from tabs that have been taken over by another tab

## [v02.31w] — 2026-03-18 11:06:43 AM EST — v04.73r

### Fixed
- Removed global GAS URL exposure — deployment URL no longer accessible via `window._r`
- Minor internal improvements

## [v02.30w] — 2026-03-18 10:41:45 AM EST — v04.71r

### Added
- Prepared hash-based Content Security Policy — ready to activate when all security phases are complete

## [v02.29w] — 2026-03-18 09:45:42 AM EST — v04.69r

### Removed
- Removed unnecessary iframe startup code that was already being cancelled on every page load — cleaner initialization flow

## [v02.28w] — 2026-03-18 09:24:34 AM EST — v04.68r

### Fixed
- Security event reporting now requires an active session — improved protection against unauthorized resource usage

## [v02.27w] — 2026-03-18 08:38:59 AM EST — v04.67r

### Changed
- Session heartbeats, sign-out, and security event reporting now use secure message channels instead of URL parameters — tokens no longer appear in browser history or server logs

Developed by: ShadowAISolutions
