# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 50/50`

## [Unreleased]

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

## [v02.26w] — 2026-03-17 10:56:34 PM EST — v04.65r

### Fixed
- Session timer protection now works on all sign-in paths including session resume from stored tokens

## [v02.25w] — 2026-03-17 10:43:37 PM EST — v04.64r

### Fixed
- Session timer protection now properly prevents modification via browser console
- Security test panel signature verification now works correctly when signed in

## [v02.24w] — 2026-03-17 10:14:46 PM EST — v04.62r

### Changed
- Session timeout values are now tamper-proof — cannot be modified via browser DevTools to prevent automatic logoff

## [v02.23w] — 2026-03-17 09:38:24 PM EST — v04.60r

### Changed
- Improved authentication key management — keys can no longer be overwritten by forged messages mid-session

## [v02.22w] — 2026-03-17 09:21:24 PM EST — v04.59r

### Changed
- Improved session security by removing sensitive data from cross-tab communication

## [v02.21w] — 2026-03-17 08:55:55 PM EST — v04.56r

### Changed
- Minor internal improvements

## [v02.20w] — 2026-03-17 08:48:57 PM EST — v04.55r

### Removed
- Removed third-party IP address collection — your IP is no longer sent to external services when using this page

### Changed
- Simplified internal security monitoring to no longer include IP addresses in reports

## [v02.19w] — 2026-03-17 07:33:33 PM EST — v04.54r

### Fixed
- Eliminated a console warning that appeared on page load before sign-in
- Improved internal message security with tighter origin restrictions

## [v02.18w] — 2026-03-17 07:18:47 PM EST — v04.53r

### Fixed
- Console error on page load resolved — internal messages no longer fail due to timing-dependent origin mismatch

## [v02.17w] — 2026-03-17 07:14:06 PM EST — v04.52r

### Added
- Token exchange now uses a one-time cryptographic nonce — prevents forged session creation messages
- Non-token messages are now restricted to the expected server origin

## [v02.16w] — 2026-03-17 07:03:24 PM EST — v04.50r

### Fixed
- Sign-in now completes successfully — origin validation no longer blocks legitimate server messages

## [v02.15w] — 2026-03-17 06:56:06 PM EST — v04.49r

### Added
- Messages from unexpected origins are now blocked before processing — only legitimate Google server origins are accepted
- New security test validates the origin allowlist against spoofing patterns

## [v02.14w] — 2026-03-17 06:20:58 PM EST — v04.48r

### Fixed
- Security tests no longer get stuck on "Waiting to run" for tests that verify cryptographic signatures

## [v02.13w] — 2026-03-17 06:09:12 PM EST — v04.46r

### Added
- Messages from the server are now verified using HMAC-SHA256 cryptographic signatures (Web Crypto API)
- Dual-accept migration: both new HMAC-SHA256 and legacy signatures are accepted during transition

### Changed
- Security tests updated to validate the new cryptographic verification

Developed by: ShadowAISolutions
