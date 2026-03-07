# Changelog — Homepage

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [indexhtml.changelog-archive.md](indexhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 19/50`

## [v01.23w] — 2026-03-07 12:31:43 AM EST — v04.06r

### Changed
- GAS version pill repositioned slightly to the right for better spacing

## [v01.22w] — 2026-03-07 12:21:26 AM EST — v04.05r

### Changed
- Update splash now shows a blue "Website Ready" screen for page updates and a green "Code Ready" screen for GAS code updates
- Added GAS version indicator pill (bottom-right, left of the page version pill) showing the current GAS script version with live countdown
- Clicking the GAS version pill now opens a GAS changelog popup
- GAS script updates are now detected automatically via version polling (no longer requires the GAS app to send a message)

### Removed
- Removed legacy GAS reload mechanism that required the GAS app to signal the page

## [v01.20w] — 2026-03-06 08:15:21 PM EST — v03.88r

### Changed
- Changelog popup now fetches `.md` files instead of `.txt`

## [v01.18w] — 2026-03-04 09:39:40 PM EST — v02.86r

### Changed
- Developer splash logo updated

## [v01.17w] — 2026-03-01 04:15:28 PM EST — v02.07r

### Changed
- Version number updated

## [v01.16w] — 2026-03-01 03:35:27 PM EST — v02.00r

### Changed
- Changelog popup now requires the X button to close — clicking outside no longer dismisses it

## [v01.15w] — 2026-03-01 03:14:52 PM EST — v01.97r

### Changed
- Changelog popup now loads reliably when the repository is private

## [v01.14w] — 2026-03-01 03:04:05 PM EST — v01.96r

### Added
- Clicking the version number now opens a changelog popup showing recent page updates

## [v01.13w] — 2026-02-28 09:31:11 PM EST — v01.46r

### Changed
- Countdown numbers now appear starting at 5 for a cleaner look

## [v01.12w] — 2026-02-28 09:13:16 PM EST — v01.45r

### Changed
- Countdown numbers now appear starting at 8 for a smoother transition after the yellow check blink

## [v01.11w] — 2026-02-28 07:35:31 PM EST — v01.44r

### Changed
- Countdown numbers slightly larger for better readability

## [v01.10w] — 2026-02-28 07:29:42 PM EST — v01.43r

### Changed
- Countdown numbers are now smaller to fit centered in the dot

## [v01.09w] — 2026-02-28 07:26:37 PM EST — v01.42r

### Fixed
- Countdown numbers now center properly at all zoom levels — dot grows slightly when counting

## [v01.08w] — 2026-02-28 07:19:05 PM EST — v01.41r

### Fixed
- Centered countdown numbers inside the version indicator dot

## [v01.07w] — 2026-02-28 07:15:10 PM EST — v01.40r

### Changed
- Restored original smaller size for the version indicator dot

## [v01.06w] — 2026-02-28 07:08:21 PM EST — v01.39r

### Fixed
- Restored the orange blink when checking for updates — countdown numbers now show without blinking, orange pulse only appears during the actual check

## [v01.05w] — 2026-02-28 07:02:59 PM EST — v01.38r

### Fixed
- Restored blinking pulse animation during countdown — dot now pulses while showing the number

## [v01.04w] — 2026-02-28 06:58:44 PM EST — v01.37r

### Changed
- Moved countdown into the status dot — number counts down inside the circle instead of as separate text
- Countdown now appears starting at 9 for a cleaner look

## [v01.03w] — 2026-02-28 06:44:28 PM EST — v01.36r

### Added
- Added countdown timer to version indicator showing seconds until next update check

Developed by: ShadowAISolutions
