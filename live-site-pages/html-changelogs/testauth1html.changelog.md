# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 37/50`

## [Unreleased]

## [v02.36w] — 2026-03-18 11:09:45 PM EST — v04.89r

### Changed
- Faster sign-in — the app now loads in a single step instead of requiring two separate page loads during HIPAA-mode login

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

## [v02.12w] — 2026-03-16 03:19:06 PM EST — v04.31r

### Added
- IP address validation before logging — malformed values are now rejected instead of stored as-is

## [v02.11w] — 2026-03-16 02:54:36 PM EST — v04.28r

### Changed
- "Signing in…" now shows a spinning ring, "Reconnecting…" now shows pulsing dots — visually distinct animations for each state

## [v02.10w] — 2026-03-16 02:50:53 PM EST — v04.27r

### Added
- Spinning loading indicator on the "Signing in…" and "Reconnecting…" screens

## [v02.09w] — 2026-03-16 02:40:38 PM EST — v04.26r

### Changed
- Tab count now updates instantly when the overlay appears instead of relying on a background timer

## [v02.08w] — 2026-03-16 02:33:18 PM EST — v04.25r

### Added
- "Session Active in Another Tab" overlay now shows how many other tabs have this page open

## [v02.07w] — 2026-03-16 02:22:46 PM EST — v04.24r

### Fixed
- Restored centering on the sign-in page

### Added
- "Signing in…" screen now appears after selecting your Google account while your session is being set up

## [v02.06w] — 2026-03-16 02:16:05 PM EST — v04.23r

### Changed
- Sign-in page now shows "Reconnecting… Verifying your session" during page reload instead of briefly showing the sign-in form
- "Use Here" button now shows "Reconnecting…" while verifying your session

## [v02.05w] — 2026-03-16 02:08:13 PM EST — v04.22r

### Fixed
- Restored logo display on the sign-in page
- Restored splash screen sound playback

## [v02.04w] — 2026-03-16 02:02:55 PM EST — v04.21r

### Security
- Stronger protection against unauthorized resource loading (deny-all fallback policy)
- Blocked web worker and manifest injection attacks
- Restricted image loading to trusted Google domains only (previously allowed any HTTPS source)
- Auto-upgrade protection for mixed content

## [v02.03w] — 2026-03-16 01:47:48 PM EST — v04.20r

### Security
- Added protection against form-based data exfiltration attacks

## [v02.02w] — 2026-03-16 10:29:43 AM EST — v04.11r

### Added
- Blocked attacks are now reported to the server for security monitoring

## [v02.01w] — 2026-03-16 09:57:31 AM EST — v04.09r

### Security
- Sign-in screen now stays visible during page reload until the server re-confirms your session is valid
- A second sign-in attempt from an untrusted source is now rejected entirely instead of overwriting your session

## [v02.00w] — 2026-03-16 09:43:13 AM EST — v04.08r

### Security
- Sign-in screen now stays visible until the server confirms your session is valid, preventing a potential UI spoofing issue


Developed by: ShadowAISolutions
