# Changelog — Application Portal

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [applicationportalhtml.changelog-archive.md](applicationportalhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 19/50`

## [Unreleased]

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
