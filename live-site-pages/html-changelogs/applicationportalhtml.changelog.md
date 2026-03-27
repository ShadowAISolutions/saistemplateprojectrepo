# Changelog — Application Portal

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [applicationportalhtml.changelog-archive.md](applicationportalhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 46/50`

## [v01.46w] — 2026-03-27 07:18:05 PM EST — v07.13r

### Fixed
- Eliminated font loading errors that appeared on every page load

## [v01.45w] — 2026-03-27 07:00:26 PM EST — v07.11r

### Changed
- Minor internal improvements

## [v01.44w] — 2026-03-27 06:53:06 PM EST — v07.10r

### Fixed
- Eliminated font loading errors that appeared on every page load

## [v01.43w] — 2026-03-26 02:29:03 PM EST — v06.99r

### Changed
- Minor internal improvements

## [v01.42w] — 2026-03-26 01:58:55 PM EST — v06.98r

### Fixed
- SSO status badge no longer appears when signed out or on the sign-in screen

## [v01.41w] — 2026-03-26 01:17:37 PM EST — v06.97r

### Fixed
- Fixed re-authentication to properly auto-select the same Google account without showing the account picker

## [v01.40w] — 2026-03-26 12:58:10 PM EST — v06.96r

### Changed
- Re-authenticating now automatically signs you in with the same Google account instead of showing the account picker

## [v01.39w] — 2026-03-26 10:49:30 AM EST — v06.92r

### Fixed
- "Use Here" session reclaim no longer gets stuck on reconnecting

## [v01.38w] — 2026-03-26 09:47:33 AM EST — v06.91r

### Security
- SSO re-acquisition after page refresh now verifies that the selected Google account matches your signed-in account — selecting a different account no longer falsely enables SSO for other applications

## [v01.37w] — 2026-03-26 09:32:01 AM EST — v06.90r

### Changed
- SSO sign-in now shows the authentication progress checklist with timing alongside the source indicator

## [v01.36w] — 2026-03-26 09:25:30 AM EST — v06.89r

### Fixed
- Fixed sign-in hanging on "Exchanging credentials with server" when the server takes longer than 30 seconds to respond — now shows a clear timeout error with a retry prompt

## [v01.35w] — 2026-03-26 08:35:21 AM EST — v06.86r

### Added
- Sign-out now shows a real-time checklist (clearing session, notifying tabs, signing out connected apps, invalidating server session, waiting for confirmation) with timing for each step
- Reconnecting now shows a real-time checklist (verifying session, preparing linked app sign-in, confirming with server) with timing for each step

## [v01.34w] — 2026-03-26 08:23:47 AM EST — v06.85r

### Added
- Each sign-in step now shows how long it took to complete

## [v01.33w] — 2026-03-26 08:19:16 AM EST — v06.84r

### Changed
- Sign-in checklist steps now have clearer descriptions explaining what's happening at each stage

## [v01.32w] — 2026-03-26 08:10:52 AM EST — v06.83r

### Changed
- Sign-in progress now shows as a visual checklist under the spinner — you can see all steps at once with checkmarks as each completes

## [v01.31w] — 2026-03-26 08:02:27 AM EST — v06.82r

### Added
- Sign-in now shows real-time progress messages ("Contacting Google…", "Verifying your identity…", "Creating your session…", "Almost ready…") so you can see exactly what stage of authentication you're at

## [v01.30w] — 2026-03-25 09:07:53 AM EST — v06.44r

### Fixed
- Panels and overlays now close properly during sign-out, preventing UI glitches

## [v01.29w] — 2026-03-23 10:12:15 AM EST — v06.25r

### Added
- Click the SSO indicator when it shows "retry" to re-attempt Google sign-in for SSO

## [v01.28w] — 2026-03-23 10:04:38 AM EST — v06.24r

### Added
- SSO indicator now shows "dismissed" (red) when you close the Google sign-in popup without signing in

## [v01.27w] — 2026-03-23 09:52:01 AM EST — v06.23r

### Fixed
- SSO indicator no longer gets stuck on "pending" after closing the Google sign-in popup — now correctly shows "off"

## [v01.26w] — 2026-03-23 09:42:59 AM EST — v06.22r

### Fixed
- SSO indicator no longer stays on "pending" if you close the Google sign-in popup without signing in

## [v01.25w] — 2026-03-23 09:34:07 AM EST — v06.21r

### Fixed
- SSO readiness indicator now accurately tracks when the portal is ready to authenticate other applications

## [v01.24w] — 2026-03-23 09:24:08 AM EST — v06.20r

### Fixed
- SSO readiness indicator no longer hidden behind other status elements

## [v01.23w] — 2026-03-23 09:19:18 AM EST — v06.19r

### Changed
- Replaced GIS popup indicator with standalone SSO readiness indicator — shows whether the portal is ready to authenticate other applications (off/pending/ready)

## [v01.22w] — 2026-03-23 09:06:12 AM EST — v06.18r

### Added
- GIS popup state indicator in the auth timers panel — shows whether Google sign-in is idle, running silently, or has a popup open

## [v01.21w] — 2026-03-23 08:38:15 AM EST — v06.17r

### Added
- New "Sign Out" and "Sign Out All" buttons — sign out of just this page or all connected pages at once

## [v01.20w] — 2026-03-23 08:20:05 AM EST — v06.16r

### Fixed
- Single sign-on now only shares authentication when this page is the designated SSO hub — other pages can no longer provide sign-in tokens to this portal

## [v01.19w] — 2026-03-23 07:30:39 AM EST — v06.13r

### Fixed
- Removed verbose debug logging that could expose sensitive session information in browser console

## [v01.18w] — 2026-03-22 03:19:28 PM EST — v06.12r

### Fixed
- Session countdown timer now matches server-side 15-minute HIPAA timeout

## [v01.17w] — 2026-03-22 02:30:05 PM EST — v06.07r

### Changed
- Minor internal improvements

## [v01.16w] — 2026-03-22 02:05:02 PM EST — v06.05r

### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

## [v01.15w] — 2026-03-22 12:51:12 PM EST — v06.03r

### Fixed
- SSO preparation during reconnect now works reliably

## [v01.14w] — 2026-03-22 12:45:46 PM EST — v06.02r

### Changed
- SSO preparation now happens during reconnect instead of after sign-in completes

## [v01.13w] — 2026-03-22 12:29:36 PM EST — v06.00r

### Changed
- Reconnecting message now mentions that sign-in for linked apps is being prepared

## [v01.12w] — 2026-03-22 12:23:54 PM EST — v05.99r

### Changed
- Portal now designated as SSO provider — re-acquires Google token after reconnect for seamless child app authentication

## [v01.11w] — 2026-03-22 12:08:17 PM EST — v05.98r

### Fixed
- SSO auto-authentication now works after page refresh

## [v01.10w] — 2026-03-22 11:38:56 AM EST — v05.97r

### Changed
- "Session Active Elsewhere" overlay now shows the application name

## [v01.09w] — 2026-03-22 01:26:48 AM EST — v05.95r

### Fixed
- "Signing in via [source]" subtitle now correctly displays during SSO authentication

## [v01.08w] — 2026-03-22 01:19:31 AM EST — v05.94r

### Changed
- Sign-in screen now shows which page provided your credentials when signing in via SSO

## [v01.07w] — 2026-03-22 01:03:31 AM EST — v05.93r

### Fixed
- Session timeout on other pages no longer disrupts your session — only deliberate sign-outs affect all pages

## [v01.06w] — 2026-03-22 12:27:41 AM EST — v05.92r

### Added
- Single sign-on support — sign in once, other auth pages auto-authenticate without a sign-in prompt
- Cross-page sign-out — signing out from any connected page signs out all pages

## [v01.05w] — 2026-03-21 11:34:54 PM EST — v05.89r

### Added
- Debug logging for sign-in flow troubleshooting — check browser console (F12) during sign-in

## [v01.04w] — 2026-03-21 11:25:17 PM EST — v05.88r

### Fixed
- Connected to working GAS deployment — sign-in should now complete successfully

## [v01.03w] — 2026-03-21 11:14:52 PM EST — v05.87r

### Changed
- Now requires its own GAS deployment — no longer shares portal's backend
- Restored secure postMessage token exchange

## [v01.02w] — 2026-03-21 11:01:21 PM EST — v05.86r

### Fixed
- Sign-in no longer gets stuck on "Signing in..." screen

## [v01.01w] — 2026-03-21 10:45:49 PM EST — v05.85r

### Changed
- Configured with portal's OAuth Client ID and HIPAA security settings
- Sessions now clear on tab close and tokens are exchanged securely

Developed by: ShadowAISolutions
