# Changelog Archive — testauth1title

Older version sections rotated from [testauth1html.changelog.md](testauth1html.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

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

## [v02.26w] — 2026-03-17 10:56:34 PM EST — v04.65r — [merged]

### Fixed
- Session timer protection now works on all sign-in paths including session resume from stored tokens

## [v02.25w] — 2026-03-17 10:43:37 PM EST — v04.64r — [merged]

### Fixed
- Session timer protection now properly prevents modification via browser console
- Security test panel signature verification now works correctly when signed in

## [v02.24w] — 2026-03-17 10:14:46 PM EST — v04.62r — [merged]

### Changed
- Session timeout values are now tamper-proof — cannot be modified via browser DevTools to prevent automatic logoff

## [v02.23w] — 2026-03-17 09:38:24 PM EST — v04.60r — [merged]

### Changed
- Improved authentication key management — keys can no longer be overwritten by forged messages mid-session

## [v02.22w] — 2026-03-17 09:21:24 PM EST — v04.59r — [merged]

### Changed
- Improved session security by removing sensitive data from cross-tab communication

## [v02.21w] — 2026-03-17 08:55:55 PM EST — v04.56r — [merged]

### Changed
- Minor internal improvements

## [v02.20w] — 2026-03-17 08:48:57 PM EST — v04.55r — [merged]

### Removed
- Removed third-party IP address collection — your IP is no longer sent to external services when using this page

### Changed
- Simplified internal security monitoring to no longer include IP addresses in reports

## [v02.19w] — 2026-03-17 07:33:33 PM EST — v04.54r — [merged]

### Fixed
- Eliminated a console warning that appeared on page load before sign-in
- Improved internal message security with tighter origin restrictions

## [v02.18w] — 2026-03-17 07:18:47 PM EST — v04.53r — [merged]

### Fixed
- Console error on page load resolved — internal messages no longer fail due to timing-dependent origin mismatch

## [v02.17w] — 2026-03-17 07:14:06 PM EST — v04.52r — [merged]

### Added
- Token exchange now uses a one-time cryptographic nonce — prevents forged session creation messages
- Non-token messages are now restricted to the expected server origin

## [v02.16w] — 2026-03-17 07:03:24 PM EST — v04.50r — [merged]

### Fixed
- Sign-in now completes successfully — origin validation no longer blocks legitimate server messages

## [v02.15w] — 2026-03-17 06:56:06 PM EST — v04.49r — [merged]

### Added
- Messages from unexpected origins are now blocked before processing — only legitimate Google server origins are accepted
- New security test validates the origin allowlist against spoofing patterns

## [v02.14w] — 2026-03-17 06:20:58 PM EST — v04.48r — [merged]

### Fixed
- Security tests no longer get stuck on "Waiting to run" for tests that verify cryptographic signatures

## [v02.13w] — 2026-03-17 06:09:12 PM EST — v04.46r — [merged]

### Added
- Messages from the server are now verified using HMAC-SHA256 cryptographic signatures (Web Crypto API)
- Dual-accept migration: both new HMAC-SHA256 and legacy signatures are accepted during transition

### Changed
- Security tests updated to validate the new cryptographic verification

## [v02.12w] — 2026-03-16 03:19:06 PM EST — v04.31r — [merged]

### Added
- IP address validation before logging — malformed values are now rejected instead of stored as-is

## [v02.11w] — 2026-03-16 02:54:36 PM EST — v04.28r — [merged]

### Changed
- "Signing in…" now shows a spinning ring, "Reconnecting…" now shows pulsing dots — visually distinct animations for each state

## [v02.10w] — 2026-03-16 02:50:53 PM EST — v04.27r — [merged]

### Added
- Spinning loading indicator on the "Signing in…" and "Reconnecting…" screens

## [v02.09w] — 2026-03-16 02:40:38 PM EST — v04.26r — [merged]

### Changed
- Tab count now updates instantly when the overlay appears instead of relying on a background timer

## [v02.08w] — 2026-03-16 02:33:18 PM EST — v04.25r — [merged]

### Added
- "Session Active in Another Tab" overlay now shows how many other tabs have this page open

## [v02.07w] — 2026-03-16 02:22:46 PM EST — v04.24r — [merged]

### Fixed
- Restored centering on the sign-in page

### Added
- "Signing in…" screen now appears after selecting your Google account while your session is being set up

## [v02.06w] — 2026-03-16 02:16:05 PM EST — v04.23r — [merged]

### Changed
- Sign-in page now shows "Reconnecting… Verifying your session" during page reload instead of briefly showing the sign-in form
- "Use Here" button now shows "Reconnecting…" while verifying your session

## [v02.05w] — 2026-03-16 02:08:13 PM EST — v04.22r — [merged]

### Fixed
- Restored logo display on the sign-in page
- Restored splash screen sound playback

## [v02.04w] — 2026-03-16 02:02:55 PM EST — v04.21r — [merged]

### Security
- Stronger protection against unauthorized resource loading (deny-all fallback policy)
- Blocked web worker and manifest injection attacks
- Restricted image loading to trusted Google domains only (previously allowed any HTTPS source)
- Auto-upgrade protection for mixed content

## [v02.03w] — 2026-03-16 01:47:48 PM EST — v04.20r — [merged]

### Security
- Added protection against form-based data exfiltration attacks

## [v02.02w] — 2026-03-16 10:29:43 AM EST — v04.11r — [merged]

### Added
- Blocked attacks are now reported to the server for security monitoring

## [v02.01w] — 2026-03-16 09:57:31 AM EST — v04.09r — [merged]

### Security
- Sign-in screen now stays visible during page reload until the server re-confirms your session is valid
- A second sign-in attempt from an untrusted source is now rejected entirely instead of overwriting your session

## [v02.00w] — 2026-03-16 09:43:13 AM EST — v04.08r — [merged]

### Security
- Sign-in screen now stays visible until the server confirms your session is valid, preventing a potential UI spoofing issue


## [v01.99w] — 2026-03-15 09:59:28 PM EST — v03.96r

### Fixed
- Your IP address is now reliably captured for security audit records

## [v01.98w] — 2026-03-15 09:38:50 PM EST — v03.95r

### Added
- Your public IP address is now captured and forwarded to the server for security audit records

## [v01.97w] — 2026-03-15 08:44:53 PM EST — v03.93r

### Added
- Session expiry now fully clears any displayed data from the page (HIPAA mode) — prevents data from remaining visible in browser tools after your session ends
- Improved error messages when sign-in is blocked due to too many failed attempts

## [v01.96w] — 2026-03-15 08:28:17 PM EST — v03.92r

### Fixed
- "Session expiring soon" warning no longer appears incorrectly after reclaiming a session with "Use Here"

## [v01.95w] — 2026-03-15 08:12:32 PM EST — v03.91r

### Fixed
- Reclaiming a session with "Use Here" now correctly preserves the absolute session timer countdown

## [v01.94w] — 2026-03-15 08:07:39 PM EST — v03.90r

### Fixed
- GAS app now properly reappears after clicking "Use Here" — the app UI and timers are activated once the GAS server confirms the session is valid

## [v01.93w] — 2026-03-15 08:03:31 PM EST — v03.89r

### Fixed
- Reclaiming a session with "Use Here" no longer resets the absolute session timer — the timer continues from when you originally signed in

## [v01.92w] — 2026-03-15 07:59:08 PM EST — v03.88r

### Fixed
- Clicking "Use Here" no longer causes a brief GAS iframe flicker — the app appears smoothly after the session is confirmed

## [v01.91w] — 2026-03-15 07:51:52 PM EST — v03.87r

### Fixed
- Clicking "Use Here" on a tab that was displaced by another tab's sign-in now seamlessly reclaims the session instead of briefly showing the app then signing you out

## [v01.90w] — 2026-03-15 07:40:16 PM EST — v03.86r

### Changed
- Interacting with the app no longer forces an immediate heartbeat — activity is tracked and the regular heartbeat cycle handles session extension naturally

## [v01.89w] — 2026-03-15 07:29:52 PM EST — v03.85r

### Fixed
- Interacting with the app no longer causes constant "sending..." in the heartbeat display — heartbeats are now rate-limited during active use
- Heartbeat can no longer get permanently stuck on "sending..." if a server response is lost

## [v01.88w] — 2026-03-15 06:58:02 PM EST — v03.84r

### Fixed
- Clicking "Use Here" on a tab whose session was ended (by signing in on another tab) now properly shows the sign-in screen instead of a blank page

## [v01.87w] — 2026-03-15 06:46:09 PM EST — v03.83r

### Added
- If a data operation (like Save Note) detects your session is no longer valid, the sign-in screen now appears automatically with a specific reason message

## [v01.86w] — 2026-03-15 06:35:54 PM EST — v03.82r

### Changed
- Sign-in errors now show specific setup instructions instead of generic "Access denied" — tells you exactly what's missing (e.g. HMAC secret, domain configuration)

## [v01.85w] — 2026-03-15 03:36:50 PM EST — v03.75r

### Added
- Interacting with the app (typing, clicking) now triggers an immediate session check — if your session was ended by another device, you see the overlay within seconds instead of waiting for the next automatic check

## [v01.84w] — 2026-03-15 01:22:15 PM EST — v03.74r

### Added
- "Force Heartbeat" button for testing session validity on demand without waiting for the automatic heartbeat interval

## [v01.83w] — 2026-03-15 12:44:45 PM EST — v03.73r

### Added
- 4 new security tests for cross-device session enforcement: configuration toggle, state tracking, heartbeat reason processing, and overlay text management (42 tests total)

## [v01.82w] — 2026-03-15 12:39:33 PM EST — v03.72r

### Added
- Cross-device session detection: if you sign in on another device or browser, this page now shows a "Session Active Elsewhere" overlay with a "Sign In Here" button instead of a generic expiration message
- Same-browser tab conflicts continue to show the original "session active in another tab" message with the "Use Here" reclaim button


## [v01.81w] — 2026-03-14 11:31:37 PM EST — [v03.64r](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/272faf69c1b430946561e376538ed6f16250e2c8)

### Changed
- Single-tab enforcement is now enabled — only one browser tab can be active at a time

## [v01.80w] — 2026-03-14 11:28:52 PM EST — [v03.63r](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/945e1df49343ff090345ed1c2f41de1e81d08228)

### Added
- Single-tab enforcement — when enabled, only one browser tab can be active at a time (toggle in settings, off by default)

## [v01.79w] — 2026-03-14 11:05:05 PM EST — [v03.62r](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/79ab09f98ef1d3303d39a077d71b0716285f8a17)

### Changed
- Session expiry warning now appears with 30 seconds left instead of 60, so interacting with the page immediately extends the session

## [v01.78w] — 2026-03-14 10:50:11 PM EST — [v03.61r](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/af6b70606188ee058c03449f1ea8c1d16714c8d3)

### Changed
- Session and absolute expiry warning banners now display a live countdown showing time remaining

## [v01.77w] — 2026-03-14 10:39:09 PM EST — [v03.60r](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ffeca3606c2c5a0771e781ccaac6146cd7428184)

### Fixed
- Re-authentication now properly reloads the app after clicking Sign In on the expiry banner

## [v01.76w] — 2026-03-14 10:25:03 PM EST — [v03.59r](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/97402e6b4a60017954645b2e67907c6210fe1c96)

### Fixed
- Clicking "Sign In" on the session expiry banner now properly reloads the app and resets all timers after re-authentication
- Countdown timers and heartbeat are stopped before starting the sign-in flow so they cannot trigger sign-out mid-authentication

## [v01.75w] — 2026-03-14 10:06:00 PM EST — v03.57r

### Changed
- Session expiry warning now says "interact with the page to stay signed in" instead of prompting to sign in again
- Absolute session expiry now shows its own warning banner with a sign-in button when time is nearly up
- Warning banners appear below the user info pill instead of across the top of the page
- Both banners stack neatly when both are visible at the same time

## [v01.74w] — 2026-03-14 09:30:14 PM EST — v03.56r

### Fixed
- Sound system no longer triggers a console warning on page load

## [v01.73w] — 2026-03-14 08:59:29 PM EST — v03.54r

### Changed
- Minor internal improvements

## [v01.72w] — 2026-03-14 08:53:11 PM EST — v03.53r

### Added
- Added placeholder favicon — no more missing icon in browser tab

## [v01.71w] — 2026-03-14 08:45:29 PM EST — v03.52r

### Fixed
- Fixed console warning appearing during normal sign-in flow

## [v01.70w] — 2026-03-14 08:31:03 PM EST — v03.50r

### Changed
- Removed 27 fake and trivial security tests that were testing variable assignments or DOM existence instead of actual behavior (38 real tests remain)

## [v01.69w] — 2026-03-14 08:19:27 PM EST — v03.49r

### Changed
- Merged "No document.write" and "No eval() Usage" tests into a single "Code Safety Scan" test (65 tests total)

## [v01.68w] — 2026-03-14 08:15:12 PM EST — v03.48r

### Fixed
- Fixed "No eval() Usage" security test failing with "allScripts is not defined" error

## [v01.67w] — 2026-03-14 08:05:17 PM EST — v03.47r

### Changed
- "Run Security Tests" button now shows all 66 tests as pending first, then a "Run All" button runs them one-by-one with live pass/fail transitions

## [v01.66w] — 2026-03-14 07:47:04 PM EST — v03.46r

### Fixed
- Fixed security tests causing sign-out and "Access denied" when clicking "Run Security Tests" — destructive function calls replaced with safe code inspection

## [v01.65w] — 2026-03-14 07:24:28 PM EST — v03.45r

### Changed
- Upgraded security tests from existence-only checks to behavioral verification — tests now actively call functions, verify side effects, and confirm state transitions instead of just checking if code exists

## [v01.64w] — 2026-03-14 07:12:06 PM EST — v03.44r

### Fixed
- Fixed three security test false positives: "document.write" and "eval()" tests no longer flag themselves, and clickjacking test correctly reports that frame-ancestors is an HTTP-header-only directive

## [v01.63w] — 2026-03-14 06:52:15 PM EST — v03.43r

### Added
- Expanded security tests from 23 to 65 — added CSP directive audits, OAuth configuration checks, sanitizer deep tests, session lifecycle verification, UI state checks, code safety scans, and storage security audits

## [v01.62w] — 2026-03-14 06:43:09 PM EST — v03.42r

### Fixed
- "Session expiring soon" warning now appears automatically when less than 60 seconds remain, instead of only showing on page refresh

## [v01.61w] — 2026-03-14 06:35:29 PM EST — v03.41r

### Fixed
- Fixed a console error (404) that appeared when running security tests

## [v01.60w] — 2026-03-14 06:29:20 PM EST — v03.40r

### Added
- Added 11 more security tests covering signature verification, iframe presence, token exchange method, CSP auditing, XSS vector testing, and session cleanup

## [v01.59w] — 2026-03-14 06:25:11 PM EST — v03.39r

### Fixed
- Fixed the "Changelog Sanitization" security test showing as failed

## [v01.58w] — 2026-03-14 06:21:23 PM EST — v03.38r

### Added
- Added a "Run Security Tests" button that verifies all implemented security features are working correctly

## [v01.57w] — 2026-03-14 06:10:46 PM EST — v03.37r

### Security
- Added protection against unauthorized sign-in attempts from other websites (CSRF defense)

## [v01.56w] — 2026-03-14 06:03:06 PM EST — v03.36r

### Security
- Added protection against replayed authentication messages
- Message signing key is now locked after first delivery to prevent tampering

## [v01.55w] — 2026-03-14 05:54:36 PM EST — v03.34r

### Security
- Authentication error messages now show a generic "Access denied" notice instead of detailed error information

## [v01.54w] — 2026-03-14 05:46:37 PM EST — v03.33r

### Security
- Added protection against unauthorized scripts and plugin injection
- Changelog content is now sanitized before display to prevent potential code injection

## [v01.53w] — 2026-03-14 02:11:03 PM EST — v03.23r

### Added
- Signing out now signs you out of all open tabs (previously only worked with the standard security mode)

## [v01.52w] — 2026-03-14 01:52:33 PM EST — v03.21r

### Changed
- Minor internal improvements

## [v01.51w] — 2026-03-14 01:25:57 PM EST — v03.20r

### Fixed
- Signing out and signing back in no longer gets stuck on the sign-in page

## [v01.50w] — 2026-03-14 01:09:05 PM EST — v03.18r

### Fixed
- Fixed sign-in getting stuck when using the hipaa security preset

## [v01.49w] — 2026-03-14 12:59:12 PM EST — v03.17r

### Fixed
- Fixed sign-in getting stuck after selecting a Google account

## [v01.48w] — 2026-03-14 12:53:45 PM EST — v03.16r

### Changed
- Sessions are now cleared when you close the browser tab (previously persisted across tabs)
- Sign-in tokens are now exchanged more securely (no longer visible in the browser address bar)

## [v01.47w] — 2026-03-14 12:46:13 PM EST — v03.15r

### Changed
- Minor internal improvements

## [v01.46w] — 2026-03-14 12:43:08 PM EST — v03.14r

### Changed
- Session now expires after 3 minutes (for testing — production: 1 hour)
- Absolute session limit reduced to 5 minutes (for testing — production: 16 hours)
- Activity checks now happen every 30 seconds (for testing — production: 5 minutes)

## [v01.45w] — 2026-03-14 12:32:39 PM EST — v03.12r

### Security
- Your sign-in credentials are now better protected from being accidentally shared with other websites
- Strengthened how sign-in tokens are transmitted between your browser and the app

## [v01.44w] — 2026-03-13 11:38:31 PM EST — v03.09r

### Changed
- Status pins now stack vertically in the bottom-right corner — session timer on top, GAS version in the middle, HTML version on the bottom

## [v01.43w] — 2026-03-13 11:23:52 PM EST — v03.08r

### Added
- Session countdown pill now shows ▶ when your activity is being tracked

## [v01.42w] — 2026-03-13 11:17:21 PM EST — v03.07r

### Changed
- Session now lasts 1 hour instead of 2 hours
- Heartbeat checks happen every 5 minutes instead of every 10 minutes

## [v01.41w] — 2026-03-13 11:12:06 PM EST — v03.06r

### Changed
- Session now lasts 2 hours instead of 3 minutes
- Heartbeat checks happen every 10 minutes instead of every 30 seconds

## [v01.40w] — 2026-03-13 11:00:25 PM EST — v03.05r

### Removed
- Removed grace period delay before session expiry — sessions now expire immediately when the timer runs out

## [v01.39w] — 2026-03-13 10:46:46 PM EST — v03.04r

### Removed
- Removed false activity detection that kept the session active even when you weren't interacting

## [v01.38w] — 2026-03-13 10:39:53 PM EST — v03.03r

### Fixed
- Session no longer falsely shows activity when you switch to another tab or window

## [v01.37w] — 2026-03-13 10:34:59 PM EST — v03.02r

### Fixed
- Typing in text boxes inside the app now keeps your session active

## [v01.36w] — 2026-03-13 10:24:41 PM EST — v03.01r

### Fixed
- Heartbeat indicator now resets to idle after session extension instead of briefly flashing "ready"

## [v01.35w] — 2026-03-13 10:08:56 PM EST — v03.00r

### Fixed
- Heartbeat "ready" indicator now appears immediately when you interact with the page

## [v01.34w] — 2026-03-13 10:03:03 PM EST — v02.99r

### Changed
- Heartbeat countdown now shows a "ready" indicator when your session will be extended on the next heartbeat

## [v01.33w] — 2026-03-13 09:43:38 PM EST — v02.98r

### Added
- Session now extends immediately when you're active in the last 30 seconds before expiry, preventing unexpected sign-outs

## [v01.32w] — 2026-03-13 09:25:41 PM EST — v02.97r

### Changed
- Reverted heartbeat display to original approach for simplicity

## [v01.31w] — 2026-03-13 09:15:09 PM EST — v02.96r

### Fixed
- Fixed cursor flickering when heartbeat status updates in the session timer

## [v01.30w] — 2026-03-13 09:08:32 PM EST — v02.95r

### Fixed
- Fixed cursor flickering from text caret to pointer during heartbeat checks

## [v01.29w] — 2026-03-13 08:37:51 PM EST — v02.93r

### Fixed
- Session no longer times out while a heartbeat response is in transit — shows "extending..." instead of immediately signing out

## [v01.28w] — 2026-03-13 08:14:29 PM EST — v02.92r

### Fixed
- Version headers now appear in the GAS changelog popup with timestamps

## [v01.27w] — 2026-03-13 07:15:58 PM EST — v02.90r

### Added
- Enhanced security for messages received from the app backend

### Changed
- Improved session handling and authentication flow reliability

### Removed
- Verbose debug logging from sign-in and session management

## [v01.26w] — 2026-03-13 11:32:09 AM EST — v02.70r

### Fixed
- Refreshing the sign-in page no longer auto-triggers the Google sign-in popup — you must click "Sign In with Google" to choose your account

## [v01.25w] — 2026-03-13 11:23:50 AM EST — v02.69r

### Fixed
- Signing out and refreshing the page no longer auto-signs you back in — you'll see the account picker to choose which account to use

## [v01.24w] — 2026-03-12 10:36:32 PM EST — [d495d5e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d495d5e3f72c712cb915782e2d81f2512bb6dccc)

### Added
- Signing in on one tab now automatically signs in all other open tabs of the same page
- Signing out on one tab now instantly signs out all other open tabs (previously took up to 30 seconds)

## [v01.23w] — 2026-03-12 09:36:14 PM EST — [d7f0c1b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d7f0c1bbfe93134753f82b1768a9ea934a21a4a8)

### Fixed
- After auto-refresh when your session has timed out, you now see the sign-in screen where you can choose which account to use, instead of being automatically signed back in

## [v01.22w] — 2026-03-12 08:48:00 PM EST — v02.60r

### Fixed
- Session timer no longer covers the version number in the bottom-left corner

## [v01.21w] — 2026-03-12 08:36:16 PM EST — v02.59r

### Changed
- Session timers are now a compact pill showing the session countdown — click to expand for full timer details

## [v01.20w] — 2026-03-12 08:30:29 PM EST — v02.58r

### Removed
- Removed debug test button from session timers

## [v01.19w] — 2026-03-12 07:48:34 PM EST — v02.57r

### Changed
- Sign-in screen now displays the company logo and environment title
- Version indicators are now visible on the sign-in screen

## [v01.18w] — 2026-03-12 07:41:03 PM EST — v02.56r

### Changed
- Sign-in now always asks which Google account to use instead of automatically picking one
- Re-authentication shows account chooser for easier account switching

## [v01.17w] — 2026-03-12 07:29:04 PM EST — v02.55r

### Fixed
- GAS app content no longer disappears every 30 seconds — session heartbeats now work in the background without affecting the visible app

## [v01.16w] — 2026-03-12 07:22:08 PM EST — v02.54r

### Changed
- Session timers now start minimized — click the "Session Timers" header to expand and see timer details

## [v01.15w] — 2026-03-12 07:14:59 PM EST — v02.53r

### Changed
- Absolute session timer now shows hours format (e.g. "16:00:00") instead of minutes-only format

## [v01.14w] — 2026-03-12 07:12:02 PM EST — v02.52r

### Changed
- Session timers reordered: Absolute timeout shown first, then Session, then Heartbeat
- When your session reaches the maximum duration, the sign-out message now tells you how long it was (e.g. "Your 16-hour session has ended")

### Removed
- Inactivity timer — session expiry is now handled entirely by the heartbeat system (stops extending when you're idle, session expires naturally on the server)

## [v01.13w] — 2026-03-12 07:03:32 PM EST — v02.51r

### Changed
- Maximum session duration increased from 6 minutes to 16 hours

### Added
- Automatic sign-out when your session expires — you'll see a clear message explaining why and can sign in again immediately

## [v01.12w] — 2026-03-12 06:16:10 PM EST — v02.49r

### Added
- New "Absolute" countdown timer showing the hard session ceiling that cannot be extended by activity

## [v01.11w] — 2026-03-12 05:53:24 PM EST — v02.48r

### Changed
- Heartbeat display now counts down to the next heartbeat check, showing whether it will extend the session or skip

## [v01.10w] — 2026-03-12 05:41:17 PM EST — v02.47r

### Added
- Session heartbeat that monitors your activity and automatically extends your session while you're using the page
- Heartbeat status indicator in the timer panel showing when your session is being extended

### Removed
- Removed refresh window display — replaced by the heartbeat system

## [v01.09w] — 2026-03-12 05:18:55 PM EST — v02.46r

### Changed
- Shortened session timer to 3 minutes and refresh window to 1.5 minutes for testing
- Added a "Test GAS Call" button to manually check if your session is still valid

## [v01.08w] — 2026-03-12 04:38:41 PM EST — v02.45r

### Added
- Added live countdown timers showing session time remaining, refresh window status, and inactivity timeout

## [v01.07w] — 2026-03-12 02:42:21 PM EST — v02.42r

### Fixed
- Fixed session being lost when refreshing the page — the app now correctly resumes your authenticated session after a page reload

## [v01.06w] — 2026-03-12 02:33:17 PM EST — v02.41r

### Fixed
- Fixed "Session expired" error still appearing on first visit — strengthened the iframe cancellation to fully prevent premature navigation

## [v01.05w] — 2026-03-12 02:21:14 PM EST — v02.40r

### Fixed
- Fixed false "Session expired" error appearing on first visit before sign-in completes

## [v01.04w] — 2026-03-12 01:53:19 PM EST — v02.39r

### Fixed
- Fixed app not loading after successful sign-in — the page now properly loads the app content after authentication

## [v01.03w] — 2026-03-12 01:30:39 PM EST — v02.37r

### Fixed
- Fixed sign-in flow failing after Google popup closes — deployment URL now persists for token exchange

## [v01.02w] — 2026-03-12 01:22:58 PM EST — v02.36r

### Changed
- Minor internal improvements

## [v01.01w] — 2026-03-12 01:03:01 PM EST — v02.34r

### Fixed
- Fixed Google sign-in not working — updated authentication configuration to allow sign-in from the live site

Developed by: ShadowAISolutions
