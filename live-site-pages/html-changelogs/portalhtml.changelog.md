# Changelog — Portal Title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [portalhtml.changelog-archive.md](portalhtml.changelog-archive.md) when this file exceeds 100 version sections.

`Sections: 14/100`

## [Unreleased]

## [v01.14w] — 2026-03-20 10:05:19 PM EST — v05.54r

### Fixed
- Popups and overlays no longer persist on screen after signing out

## [v01.13w] — 2026-03-20 07:27:24 PM EST — v05.44r

### Fixed
- Sessions no longer conflict with other projects open in the same browser

## [v01.12w] — 2026-03-18 11:06:43 AM EST — v04.73r

### Fixed
- Removed global GAS URL exposure — deployment URL no longer accessible via `window._r`
- Minor internal improvements

## [v01.11w] — 2026-03-16 10:29:43 AM EST — v04.11r

### Added
- Blocked attacks are now reported to the server for security monitoring
- Additional protection against session key overwriting attacks

## [v01.10w] — 2026-03-16 09:57:31 AM EST — v04.09r

### Security
- Sign-in screen now stays visible during page reload until the server re-confirms your session is valid
- A second sign-in attempt from an untrusted source is now rejected entirely instead of overwriting your session

## [v01.09w] — 2026-03-16 09:43:13 AM EST — v04.08r

### Security
- Sign-in screen now stays visible until the server confirms your session is valid, preventing a potential UI spoofing issue

## [v01.08w] — 2026-03-14 08:59:29 PM EST — v03.54r

### Changed
- Minor internal improvements

## [v01.07w] — 2026-03-14 08:53:11 PM EST — v03.53r

### Added
- Added placeholder favicon — no more missing icon in browser tab

## [v01.06w] — 2026-03-14 05:29:45 PM EST — v03.32r

### Fixed
- Fixed false "Session expired" message appearing on fresh page load
- Sign-in now works correctly on first visit without needing to reload

## [v01.05w] — 2026-03-14 05:16:28 PM EST — v03.31r

### Changed
- Portal dashboard now loads inside the GAS iframe instead of being built into the page directly
- Sign-in now uses server-side session management through Google Apps Script
- Added GAS version indicator pill showing the current script version

## [v01.04w] — 2026-03-14 03:19:37 PM EST — v03.29r

### Added
- Toggle to choose between opening applications in a new tab or a new window — preference is remembered

## [v01.03w] — 2026-03-14 03:15:42 PM EST — v03.28r

### Changed
- Applications now open in a new window instead of a new tab

## [v01.02w] — 2026-03-14 03:12:36 PM EST — v03.27r

### Changed
- Applications now open in a new browser tab instead of navigating away from the portal

## [v01.01w] — 2026-03-14 03:06:27 PM EST — v03.26r

### Changed
- Portal now shows all available applications including the project configuration tool

Developed by: ShadowAISolutions
