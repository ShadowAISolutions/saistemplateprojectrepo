# Changelog — testauth1title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauth1gs.changelog-archive.md](testauth1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 47/50`

## [Unreleased]

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
