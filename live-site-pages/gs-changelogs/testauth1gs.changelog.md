# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 49/50`

## [Unreleased]

## [v01.91g] — 2026-03-22 02:58:37 PM EST — v06.09r

### Changed
- Minor internal improvements

## [v01.90g] — 2026-03-21 05:14:49 PM EST — v05.73r

### Fixed
- Page refresh and "Use Here" now reconnect immediately

## [v01.89g] — 2026-03-21 05:08:29 PM EST — v05.72r

### Fixed
- Page refresh and "Use Here" no longer get stuck on "Reconnecting" screen

## [v01.88g] — 2026-03-21 04:51:56 PM EST — v05.70r

### Security
- Replaced direct-access protection with a more reliable method that works correctly with the application's architecture

## [v01.87g] — 2026-03-21 03:31:22 PM EST — v05.69r

### Fixed
- Minor internal improvements to authentication flow reliability

## [v01.86g] — 2026-03-21 03:22:38 PM EST — v05.68r

### Fixed
- App now confirms authentication immediately instead of waiting for a background server call

## [v01.85g] — 2026-03-21 03:06:45 PM EST — v05.66r

### Changed
- Token exchange now provides a ready-to-use access token, eliminating an extra server round-trip during sign-in

## [v01.84g] — 2026-03-21 02:51:28 PM EST — v05.65r

### Changed
- Direct access to the script URL with a session token is now blocked — only one-time-use tokens are accepted
- Session token lifetime for URL loading increased from 30 to 60 seconds

### Added
- Secure token generation endpoint for the embedding page to request one-time-use access tokens

## [v01.83g] — 2026-03-21 01:01:38 PM EST — v05.64r

### Fixed
- Minor internal improvements

## [v01.82g] — 2026-03-21 12:45:23 PM EST — v05.63r

### Fixed
- Session handshake now completes properly — nonce delivery uses the correct channel

## [v01.81g] — 2026-03-21 12:31:09 PM EST — v05.62r

### Added
- Secure page nonce handshake — session credentials are verified via a private channel instead of being visible in the page address

## [v01.80g] — 2026-03-21 11:31:04 AM EST — v05.60r

### Fixed
- Iframe guard now correctly blocks direct navigation to session URLs

## [v01.79g] — 2026-03-21 11:09:01 AM EST — v05.59r

### Fixed
- Direct navigation to session URLs no longer renders the app — shows "Access denied" message instead

## [v01.78g] — 2026-03-20 11:02:26 PM EST — v05.56r

### Added
- Security keys now auto-generate on first deploy — no manual setup needed

### Changed
- Updated setup error message to reflect auto-generation

## [v01.77g] — 2026-03-20 10:38:42 PM EST — v05.55r

### Changed
- Cross-project admin secret now stored in secure per-project storage instead of a shared spreadsheet cell
- Secret updates from the central admin system are now accepted automatically

## [v01.76g] — 2026-03-20 08:34:24 PM EST — v05.47r

### Changed
- Project metadata (name, URL, auth status) is now stored directly in the Access tab as metadata rows instead of a separate Projects tab — simplifies the spreadsheet layout

## [v01.75g] — 2026-03-20 08:10:13 PM EST — v05.46r

### Added
- New projects now automatically get their own access control column when they register for the first time

## [v01.74g] — 2026-03-20 06:56:29 PM EST — v05.43r

### Added
- Project now auto-registers itself for the Global Sessions feature on first page load

## [v01.73g] — 2026-03-20 06:13:55 PM EST — v05.41r

### Added
- Cross-project session endpoints enabling the Global ACL admin to view and manage sessions on this project remotely

## [v01.72g] — 2026-03-19 02:57:40 PM EST — v05.13r

### Added
- New diagnostic tool to view cache contents from the GAS editor

## [v01.71g] — 2026-03-19 02:53:47 PM EST — v05.12r

### Changed
- Cache clearing now invalidates everything at once — no more stale entries from any source

## [v01.70g] — 2026-03-19 02:46:22 PM EST — v05.11r

### Fixed
- Cache clearing now covers all users regardless of which access method originally cached them

## [v01.69g] — 2026-03-19 02:36:10 PM EST — v05.10r

### Changed
- Minor internal improvements

## [v01.68g] — 2026-03-19 02:30:31 PM EST — v05.09r

### Changed
- Minor internal improvements

## [v01.67g] — 2026-03-19 02:25:25 PM EST — v05.08r

### Fixed
- Changing a user's role in the spreadsheet now takes effect immediately after clearing the cache — previously required waiting for the session to expire

## [v01.66g] — 2026-03-19 02:15:50 PM EST — v05.07r

### Changed
- Simplified permission handling — UI element visibility is now managed entirely by the page, reducing server response size

## [v01.65g] — 2026-03-19 02:07:08 PM EST — v05.06r

### Changed
- Roles and permissions are now managed from your spreadsheet instead of being hardcoded — changes take effect without redeploying
- The app now sends a UI element visibility map to the page so buttons and sections are automatically shown or hidden based on your role

## [v01.64g] — 2026-03-19 01:24:26 PM EST — v05.05r

### Changed
- Minor internal improvements

## [v01.63g] — 2026-03-19 12:45:41 PM EST — v05.04r

### Fixed
- Eviction tombstones are no longer consumed on first read, allowing multiple consumers to detect the sign-out reason

## [v01.62g] — 2026-03-19 12:37:20 PM EST — v05.03r

### Fixed
- Admin sign-out now properly notifies the signed-out user's browser via distinct eviction reason

## [v01.61g] — 2026-03-19 12:16:19 PM EST — v05.01r

### Added
- Admins can now view all active sessions and remotely sign out any user from the session management panel

## [v01.60g] — 2026-03-19 11:43:05 AM EST — v05.00r

### Added
- Admin can now instantly clear cached access decisions so ACL changes take effect without waiting

## [v01.59g] — 2026-03-19 11:34:59 AM EST — v04.99r

### Fixed
- Users not listed in the access control list are now properly denied access instead of being admitted through spreadsheet sharing permissions

## [v01.58g] — 2026-03-19 10:55:31 AM EST — v04.97r

### Changed
- Access control now checks roles from the project's data spreadsheet — a dedicated ACL tab determines who can access the app and what role they have

## [v01.57g] — 2026-03-19 10:46:42 AM EST — v04.96r

### Added
- Role-based access control — your account is now assigned a role (admin, clinician, billing, or viewer) that determines what actions you can perform
- Permission checks before data operations — only users with the appropriate role can save or modify records

### Changed
- Access checks now include role assignment from the access control list
- Audit logs now record which role performed each action
- Emergency access users are automatically assigned the admin role

## [v01.56g] — 2026-03-18 02:50:29 PM EST — v04.81r

### Changed
- All messages from the app session page are now signed with stronger cryptographic protection before being sent to the host page
- Version check responses are now processed more securely on the server before delivery
- Activity detection messages are now verified server-side before reaching the host page

### Removed
- Removed legacy message signing that used a weaker algorithm

## [v01.55g] — 2026-03-18 02:02:28 PM EST — v04.80r

### Changed
- Removed unused legacy session routes — heartbeat and sign-out now use the newer, more secure communication method

## [v01.54g] — 2026-03-18 01:12:40 PM EST — v04.78r

### Changed
- Session confirmation now includes the signing key for the host page to verify messages after tab reclaim

## [v01.53g] — 2026-03-18 01:02:43 PM EST — v04.77r

### Fixed
- Session reclaim now delivers the signing key to the host page for continued message verification

## [v01.52g] — 2026-03-18 08:38:59 AM EST — v04.67r

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

