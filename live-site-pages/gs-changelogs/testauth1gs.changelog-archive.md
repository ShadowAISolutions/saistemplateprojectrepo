# Changelog Archive — testauth1title (Google Apps Script)

Older version sections rotated from [testauth1gs.changelog.md](testauth1gs.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

## [v02.37g] — 2026-04-03 02:47:47 PM EST — v08.62r — [a0b6e82](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a0b6e821)

### Fixed
- Admin tools badge and menu moved to top-left corner to avoid being hidden behind the user interface

## [v02.36g] — 2026-04-03 01:30:35 PM EST — v08.59r — [28afef6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/28afef6c)

### Fixed
- Admin tools panel now properly hides when toggling the application layer visibility

## [v02.35g] — 2026-04-03 12:24:34 PM EST — v08.56r — [b3d9a37](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b3d9a37d)

### Added
- Admin tools panel now available for administrator users within the application dashboard

## [v02.34g] — 2026-04-02 01:20:10 PM EST — v08.52r — [ca08f65](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ca08f65b)

### Changed
- Minor internal improvements

## [v02.32g] — 2026-03-30 01:35:41 PM EST — v08.19r — [20c3c0e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/20c3c0e5)

### Added
- Standalone breach alert sending function for better code organization
- Configuration introspection for breach alert settings
- Full breach log retrieval with retention-aware filtering and optional status/date filters
- Automatic duplicate prevention when logging breaches from alerts

### Changed
- Breach alert sending is now a reusable standalone operation instead of embedded in detection logic

## [v02.31g] — 2026-03-30 12:36:09 PM EST — v08.17r — [6ad2d3f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6ad2d3fb)

### Added
- 30-day deadline extension workflows for access and amendment requests — administrators can now grant extensions with written notice
- Formal denial notice generation with all legally required elements including complaint filing instructions
- Expanded disclosure accounting to include treatment, payment, and operations disclosures with configurable lookback period
- Business associate disclosure source tracking for enhanced regulatory compliance

### Fixed
- Improved disclosure data consistency across all accounting functions

## [v02.30g] — 2026-03-30 12:00:52 PM EST — v08.15r — [0730fc1](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/0730fc10)

### Added
- Configurable compliance deadline settings — response timeframes for access requests, amendments, and breach notifications can now be adjusted without code changes
- Disclosure records now track data category classification for enhanced regulatory tracking

## [v02.29g] — 2026-03-30 11:13:25 AM EST — v08.13r — [a699793](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a699793d)

### Added
- Legal hold management — place, release, and query litigation holds that prevent automated archival of protected records
- Retention compliance audit — comprehensive analysis of all protected sheets with status assessment and findings
- Archive integrity verification — SHA-256 checksum computation and verification for archived records
- Retention policy documentation — formal policy document generation with section-by-section regulatory coverage
- Records under legal hold are now automatically excluded from the daily retention enforcement archival

### Changed
- Daily retention enforcement now uses "last in effect" date calculation instead of raw creation date for more accurate retention timing

## [v02.28g] — 2026-03-30 09:36:36 AM EST — v08.10r — [4f32af7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/4f32af71)

### Added
- Full HIPAA Phase B compliance extension — grouped disclosure accounting, summary PHI export, third-party amendment notifications, breach detection and alerting, breach logging with annual report, retention enforcement with automated scheduling, and personal representative access management
- Breach detection now automatically evaluates security events and alerts when thresholds are exceeded
- Retention enforcement can be scheduled to run automatically via time-driven triggers

## [v02.27g] — 2026-03-30 07:29:44 AM EST — v08.07r — [873f00b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/873f00bd)

### Security
- Improved data export safety — values that could be interpreted as formulas are now sanitized before export

## [v02.26g] — 2026-03-28 03:49:09 PM EST — v07.46r — [8cb043b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8cb043ba)

### Added
- Delete row now asks for confirmation before deleting — shows a styled dialog with row data preview
- Double-tap on table cells now opens the editor on mobile devices
- Mobile-friendly layout improvements for smaller screens

## [v02.25g] — 2026-03-28 02:51:47 PM EST — v07.45r — [5eb9447](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5eb94471)

### Fixed
- Delete buttons now appear immediately when data loads instead of after the first refresh

## [v02.24g] — 2026-03-28 02:16:42 PM EST — v07.41r — [18d3bac](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/18d3baca)

### Changed
- Data freshness indicator now shows "0s" at zero seconds and removed "ago" suffix for cleaner display

## [v02.23g] — 2026-03-28 02:07:55 PM EST — v07.40r — [a743191](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a7431913)

### Fixed
- Data poll countdown now reaches 0 before polling instead of jumping from 2-3 seconds

## [v02.22g] — 2026-03-28 01:59:03 PM EST — v07.39r — [4ce01a1](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/4ce01a10)

### Fixed
- Toggle buttons no longer overlap when both are in their toggled-off state

## [v02.21g] — 2026-03-28 01:55:28 PM EST — v07.38r — [529e0db](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/529e0db5)

### Fixed
- Data poll countdown now starts immediately instead of showing "--" until first poll
- Version indicator moved to leftmost position at bottom-left
- Username moved below the navigation bar to avoid overlap

## [v02.20g] — 2026-03-28 01:47:24 PM EST — v07.37r — [003eef9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/003eef93)

### Fixed
- Version indicator no longer overlaps with page controls at the bottom-left corner
- Removed redundant email display that overlapped with the main header

## [v02.19g] — 2026-03-28 01:39:47 PM EST — v07.36r — [0115cd2](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/0115cd2f)

### Fixed
- Toggle button no longer causes controls to overlap or disappear when used repeatedly

## [v02.18g] — 2026-03-28 12:53:44 AM EST — v07.34r — [09159d5](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/09159d5a)

### Fixed
- Toggle button now hides/shows all elements simultaneously

## [v02.17g] — 2026-03-28 12:43:27 AM EST — v07.33r — [45aa007](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/45aa0073)

### Changed
- Data refresh countdown now shows in the header next to the connection status

## [v02.16g] — 2026-03-28 12:35:52 AM EST — v07.32r — [7a4b7b7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/7a4b7b7a)

### Added
- "GAS" toggle button to hide/show the data interface

## [v02.15g] — 2026-03-28 12:28:26 AM EST — v07.31r — [3edd1c0](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/3edd1c0c)

### Changed
- Data refresh countdown now reports its state to the status panel

## [v02.14g] — 2026-03-28 12:12:58 AM EST — v07.30r — [678f9c1](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/678f9c18)

### Added
- Data table, add row, delete row, cell editing, and dashboard now run directly in the secure application layer
- Real-time data updates via direct server polling

### Changed
- All data operations now communicate directly with the server instead of relaying through the embedding page

## [v02.13g] — 2026-03-27 09:52:43 PM EST — v07.24r — [e003944](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e0039442)

### Added
- You can now delete rows from the data table

## [v02.12g] — 2026-03-27 09:14:05 PM EST — v07.21r — [e814c35](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e814c353)

### Changed
- Minor internal improvements

## [v02.11g] — 2026-03-27 08:57:54 PM EST — v07.19r — [c1a81ad](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c1a81adb)

### Changed
- Minor internal improvements

## [v02.10g] — 2026-03-27 07:51:34 PM EST — v07.17r — [c8862da](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c8862da3)

### Changed
- Minor internal improvements

## [v02.09g] — 2026-03-27 07:35:03 PM EST — v07.14r — [4f6e9ad](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/4f6e9ad4)

### Changed
- Minor internal improvements

## [v02.08g] — 2026-03-27 06:37:42 PM EST — v07.09r — [e7826e3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e7826e30)

### Fixed
- Adding rows to the live data table now works correctly

## [v02.07g] — 2026-03-27 06:14:47 PM EST — v07.08r — [75de234](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/75de234d)

### Added
- You can now add new rows to the live data table directly from the page

## [v02.06g] — 2026-03-25 11:30:27 PM EST — v06.74r — [cdfbe9c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cdfbe9cc)

### Fixed
- Data refresh now correctly validates your session before delivering updates

## [v02.05g] — 2026-03-25 11:21:12 PM EST — v06.73r — [a6d770d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a6d770db)

### Fixed
- Data refresh now works correctly with session authentication

## [v02.04g] — 2026-03-25 10:23:52 PM EST — v06.68r — [e3f0ac2](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e3f0ac21)

### Security
- Data poll endpoint now validates session token before returning spreadsheet data

## [v02.03g] — 2026-03-25 09:47:45 PM EST — v06.66r — [c8a789b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c8a789bf)

### Changed
- Data updates now arrive through a dedicated lightweight channel instead of being bundled with session management — more consistent refresh timing

## [v02.02g] — 2026-03-25 08:47:57 PM EST — v06.61r — [487e616](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/487e6160)

### Fixed
- Background data polling now works correctly — data updates are delivered reliably when you're idle

## [v02.01g] — 2026-03-25 05:56:05 PM EST — v06.59r — [e4cf2f7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e4cf2f71)

### Fixed
- Heartbeat response time restored to normal speed — data updates no longer slow down the connection check

## [v02.00g] — 2026-03-25 05:41:07 PM EST — v06.58r — [0764aa8](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/0764aa8d)

### Added
- Live data updates now arrive with every heartbeat — no extra loading or delays
- Cell editing support — changes you make in the table are saved to the spreadsheet instantly
- Data refreshes automatically when the spreadsheet is edited directly

## [v01.99g] — 2026-03-23 08:34:55 PM EST — v06.43r — [6ee5f53](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6ee5f536)

### Added
- Disagreement statement submission — when an amendment request is denied, you can now file a formal disagreement through the app

## [v01.98g] — 2026-03-23 07:32:02 PM EST — v06.39r — [dddb39f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/dddb39f4)

### Fixed
- Fixed disclosure accounting and amendment panels not loading — date values from spreadsheet are now properly converted to strings

## [v01.97g] — 2026-03-23 07:13:41 PM EST — v06.38r — [be4106c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/be4106ca)

### Removed
- Removed the temporary data seeding endpoint — test data has been populated and the endpoint is no longer needed

## [v01.96g] — 2026-03-23 06:56:11 PM EST — v06.37r — [ec35655](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ec35655e)

### Changed
- Sample data seeding now works via a direct URL call instead of through the app UI — more reliable for populating test data

## [v01.95g] — 2026-03-23 06:29:26 PM EST — v06.36r — [fd9ca5d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fd9ca5d6)

### Added
- New "Seed Sample Data" feature — populates your account with sample disclosures, amendment requests, and clinical notes for testing

## [v01.94g] — 2026-03-23 06:08:12 PM EST — v06.35r — [ee99c9b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ee99c9bc)

### Fixed
- Data download now works — you can export your data as JSON or CSV from the "My Data" panel
- Improved error messages when sessions are interrupted — you'll see a clear "please sign in again" message instead of a generic error

## [v01.93g] — 2026-03-23 02:41:17 PM EST — v06.30r — [3c16cf0](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/3c16cf00)

### Fixed
- Phase A postMessage communication — added listener page in `doGet()` for all HIPAA operations

### Added
- Admin function to list all pending amendment requests for the review panel

## [v01.92g] — 2026-03-23 02:20:16 PM EST — v06.29r — [fab7c7b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fab7c7b3)

### Added
- Disclosure accounting: track and report PHI disclosures to external parties
- Data export: download all your stored data in JSON or CSV format
- Amendment requests: submit corrections to your health records
- Admin amendment review: approve or deny submitted correction requests
- Statement of disagreement: respond to denied amendment decisions
- Amendment history: view the complete correction trail for any record

## [v01.91g] — 2026-03-22 02:58:37 PM EST — v06.09r — [76f329f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/76f329fc)

### Changed
- Minor internal improvements

## [v01.90g] — 2026-03-21 05:14:49 PM EST — v05.73r — [84cc996c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/84cc996c)

### Fixed
- Page refresh and "Use Here" now reconnect immediately

## [v01.89g] — 2026-03-21 05:08:29 PM EST — v05.72r — [a91ac08f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a91ac08f)

### Fixed
- Page refresh and "Use Here" no longer get stuck on "Reconnecting" screen

## [v01.88g] — 2026-03-21 04:51:56 PM EST — v05.70r — [f7106b5d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/f7106b5d)

### Security
- Replaced direct-access protection with a more reliable method that works correctly with the application's architecture

## [v01.87g] — 2026-03-21 03:31:22 PM EST — v05.69r — [a529846b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a529846b)

### Fixed
- Minor internal improvements to authentication flow reliability

## [v01.86g] — 2026-03-21 03:22:38 PM EST — v05.68r — [19079c4e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/19079c4e)

### Fixed
- App now confirms authentication immediately instead of waiting for a background server call

## [v01.85g] — 2026-03-21 03:06:45 PM EST — v05.66r — [2e44cbe9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/2e44cbe9)

### Changed
- Token exchange now provides a ready-to-use access token, eliminating an extra server round-trip during sign-in

## [v01.84g] — 2026-03-21 02:51:28 PM EST — v05.65r — [1da646b6](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/1da646b6)

### Changed
- Direct access to the script URL with a session token is now blocked — only one-time-use tokens are accepted
- Session token lifetime for URL loading increased from 30 to 60 seconds

### Added
- Secure token generation endpoint for the embedding page to request one-time-use access tokens

## [v01.83g] — 2026-03-21 01:01:38 PM EST — v05.64r — [c4cfe8f8](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c4cfe8f8)

### Fixed
- Minor internal improvements

## [v01.82g] — 2026-03-21 12:45:23 PM EST — v05.63r — [9140b31d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9140b31d)

### Fixed
- Session handshake now completes properly — nonce delivery uses the correct channel

## [v01.81g] — 2026-03-21 12:31:09 PM EST — v05.62r — [6799cb81](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6799cb81)

### Added
- Secure page nonce handshake — session credentials are verified via a private channel instead of being visible in the page address

## [v01.80g] — 2026-03-21 11:31:04 AM EST — v05.60r — [97679944](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/97679944)

### Fixed
- Iframe guard now correctly blocks direct navigation to session URLs

## [v01.79g] — 2026-03-21 11:09:01 AM EST — v05.59r — [82376d22](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/82376d22)

### Fixed
- Direct navigation to session URLs no longer renders the app — shows "Access denied" message instead

## [v01.78g] — 2026-03-20 11:02:26 PM EST — v05.56r — [merged]

### Added
- Security keys now auto-generate on first deploy — no manual setup needed

### Changed
- Updated setup error message to reflect auto-generation

## [v01.77g] — 2026-03-20 10:38:42 PM EST — v05.55r — [merged]

### Changed
- Cross-project admin secret now stored in secure per-project storage instead of a shared spreadsheet cell
- Secret updates from the central admin system are now accepted automatically

## [v01.76g] — 2026-03-20 08:34:24 PM EST — v05.47r — [merged]

### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

## [v01.75g] — 2026-03-20 08:10:13 PM EST — v05.46r — [merged]

### Added
- New projects now automatically get their own access control column when they register for the first time

## [v01.74g] — 2026-03-20 06:56:29 PM EST — v05.43r — [merged]

### Added
- Project now auto-registers itself for the Global Sessions feature on first page load

## [v01.73g] — 2026-03-20 06:13:55 PM EST — v05.41r — [merged]

### Added
- Cross-project session endpoints enabling the Global ACL admin to view and manage sessions on this project remotely

## [v01.72g] — 2026-03-19 02:57:40 PM EST — v05.13r — [merged]

### Added
- New diagnostic tool to view cache contents from the GAS editor

## [v01.71g] — 2026-03-19 02:53:47 PM EST — v05.12r — [merged]

### Changed
- Cache clearing now invalidates everything at once — no more stale entries from any source

## [v01.70g] — 2026-03-19 02:46:22 PM EST — v05.11r — [merged]

### Fixed
- Cache clearing now covers all users regardless of which access method originally cached them

## [v01.69g] — 2026-03-19 02:36:10 PM EST — v05.10r — [merged]

### Changed
- Minor internal improvements

## [v01.68g] — 2026-03-19 02:30:31 PM EST — v05.09r — [merged]

### Changed
- Minor internal improvements

## [v01.67g] — 2026-03-19 02:25:25 PM EST — v05.08r — [merged]

### Fixed
- Changing a user's role in the spreadsheet now takes effect immediately after clearing the cache — previously required waiting for the session to expire

## [v01.66g] — 2026-03-19 02:15:50 PM EST — v05.07r — [merged]

### Changed
- Simplified permission handling — UI element visibility is now managed entirely by the page, reducing server response size

## [v01.65g] — 2026-03-19 02:07:08 PM EST — v05.06r — [merged]

### Changed
- Roles and permissions are now managed from your spreadsheet instead of being hardcoded — changes take effect without redeploying
- The app now sends a UI element visibility map to the page so buttons and sections are automatically shown or hidden based on your role

## [v01.64g] — 2026-03-19 01:24:26 PM EST — v05.05r — [merged]

### Changed
- Minor internal improvements

## [v01.63g] — 2026-03-19 12:45:41 PM EST — v05.04r — [merged]

### Fixed
- Eviction tombstones are no longer consumed on first read, allowing multiple consumers to detect the sign-out reason

## [v01.62g] — 2026-03-19 12:37:20 PM EST — v05.03r — [merged]

### Fixed
- Admin sign-out now properly notifies the signed-out user's browser via distinct eviction reason

## [v01.61g] — 2026-03-19 12:16:19 PM EST — v05.01r — [merged]

### Added
- Admins can now view all active sessions and remotely sign out any user from the session management panel

## [v01.60g] — 2026-03-19 11:43:05 AM EST — v05.00r — [merged]

### Added
- Admin can now instantly clear cached access decisions so ACL changes take effect without waiting

## [v01.59g] — 2026-03-19 11:34:59 AM EST — v04.99r — [merged]

### Fixed
- Users not listed in the access control list are now properly denied access instead of being admitted through spreadsheet sharing permissions

## [v01.58g] — 2026-03-19 10:55:31 AM EST — v04.97r — [merged]

### Changed
- Access control now checks roles from the project's data spreadsheet — a dedicated ACL tab determines who can access the app and what role they have

## [v01.57g] — 2026-03-19 10:46:42 AM EST — v04.96r — [merged]

### Added
- Role-based access control — your account is now assigned a role (admin, clinician, billing, or viewer) that determines what actions you can perform
- Permission checks before data operations — only users with the appropriate role can save or modify records

### Changed
- Access checks now include role assignment from the access control list
- Audit logs now record which role performed each action
- Emergency access users are automatically assigned the admin role

## [v01.56g] — 2026-03-18 02:50:29 PM EST — v04.81r — [`3b44344`](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/3b44344eed6531db0a15b96169038c15a6d29d5e)

### Changed
- All messages from the app session page are now signed with stronger cryptographic protection before being sent to the host page
- Version check responses are now processed more securely on the server before delivery
- Activity detection messages are now verified server-side before reaching the host page

### Removed
- Removed legacy message signing that used a weaker algorithm

## [v01.55g] — 2026-03-18 02:02:28 PM EST — v04.80r — [`4da70c5`](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/4da70c5d555a30f36632b946d45357f99100b6b8)

### Changed
- Removed unused legacy session routes — heartbeat and sign-out now use the newer, more secure communication method

## [v01.54g] — 2026-03-18 01:12:40 PM EST — v04.78r — [`dc54c33`](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/dc54c33eded0dd9840363ca81024884793762f44)

### Changed
- Session confirmation now includes the signing key for the host page to verify messages after tab reclaim

## [v01.53g] — 2026-03-18 01:02:43 PM EST — v04.77r — [`ec195e7`](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ec195e70e79548cbcb97cebe5d89181341845e28)

### Fixed
- Session reclaim now delivers the signing key to the host page for continued message verification

## [v01.52g] — 2026-03-18 08:38:59 AM EST — v04.67r — [`caaa379`](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/caaa37933e9a7cb9ce6fe72d997bfca4dc45aad6)

### Changed
- Session heartbeats, sign-out, and security event reporting now use secure message channels instead of URL parameters — tokens no longer appear in server logs

### Added
- New secure communication endpoints for heartbeat, sign-out, and security event operations

## [v01.51g] — 2026-03-17 08:55:55 PM EST — v04.56r

### Changed
- Minor internal improvements

## [v01.50g] — 2026-03-17 08:48:57 PM EST — v04.55r

### Removed
- IP address collection and logging removed for privacy compliance
- Third-party IP lookup service dependency removed

### Changed
- Audit log entries now record 'not-collected' instead of IP addresses

## [v01.49g] — 2026-03-17 07:14:06 PM EST — v04.52r

### Changed
- Token exchange now echoes a security nonce back to the page for verification

## [v01.48g] — 2026-03-17 05:34:24 PM EST — v04.44r

### Changed
- Messages are now signed on the server before being sent, replacing the previous client-side signing approach

## [v01.47g] — 2026-03-17 05:27:44 PM EST — v04.43r

### Added
- New server-side message signing capability for stronger protection against forged messages

## [v01.46g] — 2026-03-16 03:19:06 PM EST — v04.31r

### Added
- Server-side IP format validation — rejects non-IP strings before storing in audit logs

## [v01.45g] — 2026-03-16 12:57:47 PM EST — v04.17r

### Security
- Stronger flood protection — attack reports are now capped at 50 per 5 minutes across all sources, preventing attackers from spamming the security log by rotating IP addresses

## [v01.44g] — 2026-03-16 10:52:13 AM EST — v04.12r

### Changed
- Attack report rate limiting now tells you when an attacker was cut off

## [v01.43g] — 2026-03-16 10:29:43 AM EST — v04.11r

### Added
- Server now receives and logs blocked attack reports from the page

## [v01.42g] — 2026-03-15 10:29:39 PM EST — v04.01r

### Security
- Session audit log sheet is now protected against accidental edits, matching the data audit log's protection

## [v01.41g] — 2026-03-15 10:24:53 PM EST — v04.00r

### Changed
- Security audit log tab renamed from "AuditLog" to "SessionAuditLog" for clearer distinction from the data audit log

## [v01.40g] — 2026-03-15 10:21:09 PM EST — v03.99r

### Added
- Each saved note now gets a unique identifier in the security audit trail for individual record tracing

## [v01.39g] — 2026-03-15 10:15:14 PM EST — v03.98r

### Security
- Session identifiers are now fully masked in all audit log columns to prevent token theft from shared spreadsheets

## [v01.38g] — 2026-03-15 10:07:11 PM EST — v03.97r

### Fixed
- Your IP address now reliably appears in security audit records (switched to direct fetch method)

## [v01.37g] — 2026-03-15 09:59:28 PM EST — v03.96r

### Fixed
- Your IP address now correctly appears in security audit records (was previously blank due to a sandbox restriction)

## [v01.36g] — 2026-03-15 09:38:50 PM EST — v03.95r

### Added
- IP logging: your public IP address is now captured and included in security audit records for post-incident investigation
- Data-level audit logging: every save action now creates a detailed audit record (who, what, when) in a dedicated security audit sheet
- New security settings for IP logging and per-operation audit logging

## [v01.35g] — 2026-03-15 08:44:53 PM EST — v03.93r

### Added
- Stricter sign-in protection: repeated failed sign-in attempts now trigger escalating lockout periods (HIPAA mode) instead of a single flat limit
- New security settings for content clearing on session expiry and escalating lockout

## [v01.34g] — 2026-03-15 06:46:09 PM EST — v03.83r

### Added
- Save Note now validates your session on the server before saving — if your session expired or was ended on another device, the save is blocked and you're prompted to sign in again
- New security setting to require session checks before every data action (enabled by default in HIPAA mode)

### Changed
- Save Note button now performs a real server-side save instead of a client-side simulation

## [v01.33g] — 2026-03-15 06:35:54 PM EST — v03.82r

### Changed
- Sign-in errors now include specific error codes (like missing security key) so the page can show you exactly what to fix instead of a generic "Access denied"

## [v01.32g] — 2026-03-15 06:26:01 PM EST — v03.81r

### Changed
- Session security now fails safely when the integrity key is not configured — sign-in is blocked with a clear setup message instead of silently skipping protection
- Domain restriction now detects when no allowed domains are configured — shows a configuration error instead of silently rejecting all users

## [v01.31g] — 2026-03-15 03:36:50 PM EST — v03.75r

### Added
- "Save Note" test button for simulating EMR data entry — lets you verify that session checks trigger before data actions
- Interacting with the app now notifies the host page, which triggers an immediate session validity check

## [v01.30g] — 2026-03-15 12:35:33 PM EST — v03.71r

### Added
- Cross-device session enforcement toggle: administrators can now enable or disable detection of sessions started on other devices

## [v01.29g] — 2026-03-15 12:31:39 PM EST — v03.70r

### Added
- Session expiration notifications now include a reason explaining why the session ended

### Security
- All session expiration notifications are now cryptographically signed to prevent tampering

## [v01.28g] — 2026-03-15 12:23:04 PM EST — v03.69r

### Added
- Cross-device session detection groundwork: when signing in on a new device, previous sessions now record eviction metadata for future notification support

## [v01.27g] — 2026-03-14 09:18:31 PM EST — v03.55r

### Fixed
- Fixed accessibility warning for heartbeat test input label

## [v01.26g] — 2026-03-14 06:03:06 PM EST — v03.36r

### Security
- Session data integrity verification is now enabled for all security modes

## [v01.25g] — 2026-03-14 05:58:39 PM EST — v03.35r

### Security
- Deploy events are now logged for security monitoring

## [v01.24g] — 2026-03-14 05:54:36 PM EST — v03.34r

### Security
- Login attempts are now rate-limited to prevent brute force attacks
- Heartbeat requests are now rate-limited to prevent abuse
- Maximum session duration reduced from 16 hours to 8 hours for improved security
- Error messages no longer reveal email addresses or detailed failure reasons

## [v01.23g] — 2026-03-14 01:18:46 PM EST — v03.19r

### Fixed
- Fixed blank page after sign-in when using hipaa security preset

## [v01.22g] — 2026-03-14 12:53:45 PM EST — v03.16r

### Changed
- Switched to high-security (HIPAA) configuration — enables message integrity checks, audit logging, and emergency access by default

## [v01.21g] — 2026-03-14 12:46:13 PM EST — v03.15r

### Changed
- Minor internal improvements

## [v01.20g] — 2026-03-14 12:43:08 PM EST — v03.14r

### Changed
- Session now expires after 3 minutes (for testing — production: 1 hour)
- Absolute session limit reduced to 5 minutes (for testing — production: 16 hours)
- Activity checks now happen every 30 seconds (for testing — production: 5 minutes)
- Sign-in token lifetime reduced to 3 minutes (for testing — production: 1 hour)
- "Expiring soon" warning now shows 1 minute before token expires (for testing — production: 5 minutes)

## [v01.19g] — 2026-03-14 12:39:17 PM EST — v03.13r

### Changed
- "Session expiring soon" notification now only appears in the last 5 minutes instead of the last 15 minutes

## [v01.18g] — 2026-03-13 11:17:21 PM EST — v03.07r

### Changed
- Session expiration changed to 1 hour
- Heartbeat interval changed to 5 minutes

## [v01.17g] — 2026-03-13 11:12:06 PM EST — v03.06r

### Changed
- Session expiration extended from 3 minutes to 2 hours
- Heartbeat interval increased from 30 seconds to 10 minutes

## [v01.16g] — 2026-03-13 08:58:37 PM EST — v02.94r

### Added
- Added a text input field for testing typing during heartbeat activity

## [v01.15g] — 2026-03-13 07:15:58 PM EST — v02.90r

### Added
- Cryptographic message signing for all outgoing messages
- Input sanitization to prevent code injection

### Changed
- Messages now only reach the intended embedding page
- Error details are logged server-side only, not sent to the browser
- Improved session security by removing stored credentials

### Removed
- Debug logging from token exchange

## [v01.14g] — 2026-03-13 06:03:16 PM EST — v02.86r

### Changed
- Minor internal improvements

Developed by: ShadowAISolutions

## [v01.13g] — 2026-03-12 09:47:46 PM EST — v02.64r — [squashed]

### Changed
- Minor internal improvements

## [v01.12g] — 2026-03-12 09:29:51 PM EST — v02.62r — [squashed]

### Changed
- Both access methods now work simultaneously — authorized via master ACL spreadsheet or via direct sharing-list access (either method grants entry)
- Errors in master ACL lookup no longer block access — falls through to the sharing-list check instead

## [v01.11g] — 2026-03-12 09:18:49 PM EST — v02.61r — [squashed]

### Added
- Centralized access control via master ACL spreadsheet — authorized emails are checked from a dedicated sheet instead of the spreadsheet sharing list, keeping the data spreadsheet private

### Changed
- Falls back to the previous sharing-list check if master ACL is not configured

## [v01.10g] — 2026-03-12 07:03:32 PM EST — v02.51r — [squashed]

### Changed
- Maximum session duration increased from 6 minutes (standard) / 1 hour (HIPAA) to 16 hours for both presets

## [v01.09g] — 2026-03-12 06:16:10 PM EST — v02.49r — [squashed]

### Added
- Absolute session timeout enforcement — sessions now have a hard ceiling that heartbeats cannot extend past
- New `ABSOLUTE_SESSION_TIMEOUT` configuration option in presets

## [v01.08g] — 2026-03-12 05:41:17 PM EST — v02.47r — [squashed]

### Added
- Server-side heartbeat handler that extends your session when you're actively using the page
- New `ENABLE_HEARTBEAT` and `HEARTBEAT_INTERVAL` configuration options

### Removed
- Removed `SESSION_REFRESH_WINDOW` configuration — no longer needed with the heartbeat system

## [v01.07g] — 2026-03-12 05:18:55 PM EST — v02.46r — [squashed]

### Changed
- Reduced session expiration to 3 minutes and refresh window to 1.5 minutes for testing

## [v01.06g] — 2026-03-12 02:58:04 PM EST — v02.44r — [squashed]

### Changed
- Updated to new version to test automatic code deployment

## [v01.05g] — 2026-03-12 02:50:25 PM EST — v02.43r — [squashed]

### Fixed
- Fixed automatic code updates not working — the script can now self-update when new versions are pushed to GitHub

## [v01.04g] — 2026-03-12 01:53:19 PM EST — v02.39r — [squashed]

### Fixed
- Added diagnostic logging to trace authentication response delivery

## [v01.03g] — 2026-03-12 01:43:25 PM EST — v02.38r — [squashed]

### Fixed
- Fixed sign-in confirmation not reaching the page after successful authentication

## [v01.02g] — 2026-03-12 01:22:58 PM EST — v02.36r — [squashed]

### Fixed
- Improved sign-in reliability — server errors during authentication are now reported instead of failing silently

## [v01.01g] — 2026-03-12 01:11:52 PM EST — v02.35r — [squashed]

### Added
- Added visible debug indicator to verify the app loads correctly after sign-in

Developed by: ShadowAISolutions
