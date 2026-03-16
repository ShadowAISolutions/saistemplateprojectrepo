# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 46/50`

## [Unreleased]

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

## [v01.13g] — 2026-03-12 09:47:46 PM EST — v02.64r

### Changed
- Minor internal improvements

## [v01.12g] — 2026-03-12 09:29:51 PM EST — v02.62r

### Changed
- Both access methods now work simultaneously — authorized via master ACL spreadsheet or via direct sharing-list access (either method grants entry)
- Errors in master ACL lookup no longer block access — falls through to the sharing-list check instead

## [v01.11g] — 2026-03-12 09:18:49 PM EST — v02.61r

### Added
- Centralized access control via master ACL spreadsheet — authorized emails are checked from a dedicated sheet instead of the spreadsheet sharing list, keeping the data spreadsheet private

### Changed
- Falls back to the previous sharing-list check if master ACL is not configured

## [v01.10g] — 2026-03-12 07:03:32 PM EST — v02.51r

### Changed
- Maximum session duration increased from 6 minutes (standard) / 1 hour (HIPAA) to 16 hours for both presets

## [v01.09g] — 2026-03-12 06:16:10 PM EST — v02.49r

### Added
- Absolute session timeout enforcement — sessions now have a hard ceiling that heartbeats cannot extend past
- New `ABSOLUTE_SESSION_TIMEOUT` configuration option in presets

## [v01.08g] — 2026-03-12 05:41:17 PM EST — v02.47r

### Added
- Server-side heartbeat handler that extends your session when you're actively using the page
- New `ENABLE_HEARTBEAT` and `HEARTBEAT_INTERVAL` configuration options

### Removed
- Removed `SESSION_REFRESH_WINDOW` configuration — no longer needed with the heartbeat system

## [v01.07g] — 2026-03-12 05:18:55 PM EST — v02.46r

### Changed
- Reduced session expiration to 3 minutes and refresh window to 1.5 minutes for testing

## [v01.06g] — 2026-03-12 02:58:04 PM EST — v02.44r

### Changed
- Updated to new version to test automatic code deployment

## [v01.05g] — 2026-03-12 02:50:25 PM EST — v02.43r

### Fixed
- Fixed automatic code updates not working — the script can now self-update when new versions are pushed to GitHub

## [v01.04g] — 2026-03-12 01:53:19 PM EST — v02.39r

### Fixed
- Added diagnostic logging to trace authentication response delivery

## [v01.03g] — 2026-03-12 01:43:25 PM EST — v02.38r

### Fixed
- Fixed sign-in confirmation not reaching the page after successful authentication

## [v01.02g] — 2026-03-12 01:22:58 PM EST — v02.36r

### Fixed
- Improved sign-in reliability — server errors during authentication are now reported instead of failing silently

## [v01.01g] — 2026-03-12 01:11:52 PM EST — v02.35r

### Added
- Added visible debug indicator to verify the app loads correctly after sign-in

Developed by: ShadowAISolutions
