# Changelog — testauth1title

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1html.changelog-archive.md](testauth1html.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 40/50`

## [v03.82w] — 2026-03-30 01:35:41 PM EST — v08.19r

### Fixed
- Grouped disclosure toggle now defaults to the grouped view as intended
- Disclosure recipients section now shows a functional list of prior recipients instead of being empty

### Added
- Breach log viewer showing all breaches within the retention period with status indicators and summary statistics
- Approving an amendment now automatically shows prior disclosure recipients for easy notification

## [v03.81w] — 2026-03-30 12:36:09 PM EST — v08.17r

### Added
- Extension Workflow panel — administrators can grant 30-day deadline extensions for access and amendment requests with written justification
- Formal Denial Notice panel — generates structured denial documents with all required regulatory elements including appeal rights and complaint filing instructions
- EHR Disclosures panel — view expanded disclosure accounting including treatment, payment, and operations disclosures with source tracking

## [v03.80w] — 2026-03-30 11:13:25 AM EST — v08.13r

### Added
- Legal hold management panel for administrators — place, view, and release litigation holds on protected health data
- Retention compliance audit panel — run comprehensive audits and export reports in JSON or text format
- Archive integrity verification panel — verify SHA-256 checksums of archived records
- Retention policy documentation panel — generate and export formal retention policy documents

## [v03.79w] — 2026-03-30 09:36:36 AM EST — v08.10r

### Added
- Breach dashboard for administrators — view breach log, log new incidents, and generate annual reports
- Personal representative management panel — register, view, and revoke authorized representatives
- Grouped disclosure toggle — combine repeated disclosures to the same recipient in the disclosure accounting view
- Summary export option — download a metadata-only summary of your health information instead of full records

## [v03.78w] — 2026-03-30 07:29:44 AM EST — v08.07r

### Fixed
- Amendment review button now correctly hidden for non-admin users

## [v03.77w] — 2026-03-29 02:39:56 AM EST — v07.75r

### Changed
- Parent stage timers now show "group" instead of "total" to distinguish from the grand total

## [v03.76w] — 2026-03-29 02:29:20 AM EST — v07.74r

### Changed
- Total elapsed timer now counts live from the start on the final checklist row

## [v03.75w] — 2026-03-29 02:23:50 AM EST — v07.73r

### Changed
- Total elapsed time now shows on the final checklist row instead of below the checklist

## [v03.74w] — 2026-03-29 02:18:23 AM EST — v07.72r

### Added
- Total elapsed time now shown at the bottom of sign-in and sign-out checklists

## [v03.73w] — 2026-03-29 01:54:51 AM EST — v07.70r

### Added
- "Sign-out complete" final step added to sign-out checklist

## [v03.72w] — 2026-03-29 01:49:03 AM EST — v07.69r

### Changed
- Sign-out final step now reads "Waiting for sign-out confirmation"

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

Developed by: ShadowAISolutions
