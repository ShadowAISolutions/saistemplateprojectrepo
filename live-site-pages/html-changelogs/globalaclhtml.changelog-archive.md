# Changelog Archive — Global ACL

Older version sections rotated from [globalaclhtml.changelog.md](globalaclhtml.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## [v01.76w] — 2026-04-03 02:21:25 PM EST — v08.61r — [ef351b5](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ef351b56)

### Changed
- Global sessions management moved from page layer to application layer for consistency

## [v01.75w] — 2026-04-03 02:06:38 PM EST — v08.60r — [97a9d29](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/97a9d297)

### Fixed
- Sign-in via Program Portal now works — the page was previously unable to complete authentication when opened from the portal

## [v01.74w] — 2026-04-03 12:08:19 PM EST — v08.55r — [ac33900](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ac339008)

### Removed
- Admin dropdown and settings panels removed from page — admin features now load within the application dashboard

## [v01.72w] — 2026-04-02 10:35:03 AM EST — v08.44r — [63dbdd3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/63dbdd31)

### Fixed
- HTML toggle now always visible; admin dropdown closes properly when selecting options

## [v01.71w] — 2026-04-02 10:28:07 AM EST — v08.43r — [5c12e6b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/5c12e6b1)

### Fixed
- HTML toggle now only appears after sign-in; GAS toggle moved to the application layer where it belongs

## [v01.70w] — 2026-04-02 10:11:41 AM EST — v08.42r — [7ab92ab](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/7ab92ab6)

### Fixed
- Layer toggle buttons now stay visible when toggling HTML or GAS layers on and off

## [v01.69w] — 2026-04-02 10:06:03 AM EST — v08.41r — [dd61b5f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/dd61b5ff)

### Added
- HTML and GAS Layer Toggles — quickly hide or show each layer for a clean view

## [v01.68w] — 2026-04-02 09:54:42 AM EST — v08.40r — [a1e7767](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a1e77677)

### Changed
- Breach logging now captures mitigation steps and report year for full §164.404(c) compliance
- Denial notices now include appeal indicator and contact information per §164.524(d)(2)
- Legal holds form now supports status filtering, hold types, date ranges, and sheet selection
- Representative registration now tracks authority expiration dates and notes

## [v01.67w] — 2026-04-02 09:29:22 AM EST — v08.39r — [4b652e5](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/4b652e5f)

### Changed
- Admin controls now appear in a compact dropdown menu instead of a long button bar

## [v01.66w] — 2026-04-02 09:20:12 AM EST — v08.38r — [0c89a44](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/0c89a44b)

### Added
- Full HIPAA compliance panel suite — access disclosures, request corrections, file disagreements, manage breach logs, legal holds, and more directly from this page

## [v01.65w] — 2026-03-29 02:08:47 PM EST — v07.78r — [04bbd2a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/04bbd2a1)

### Fixed
- Global Sessions panel no longer stays visible during sign-out
- Sessions and Global Sessions panels now close each other when toggling between them

## [v01.64w] — 2026-03-29 01:58:46 PM EST — v07.77r — [d29d7a0](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d29d7a0a)

### Changed
- You can now sign yourself out from the Global Sessions panel — Sign Out and Sign Out All Projects buttons appear on your own sessions

## [v01.63w] — 2026-03-29 02:39:56 AM EST — v07.75r — [b629793](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b6297935)

### Changed
- Parent stage timers now show "group" instead of "total" to distinguish from the grand total

## [v01.62w] — 2026-03-29 02:29:20 AM EST — v07.74r — [62e6604](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/62e6604b)

### Changed
- Total elapsed timer now counts live from the start on the final checklist row

## [v01.61w] — 2026-03-29 02:23:50 AM EST — v07.73r — [ed6ee05](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ed6ee059)

### Changed
- Total elapsed time now shows on the final checklist row instead of below the checklist

## [v01.60w] — 2026-03-29 02:18:23 AM EST — v07.72r — [fc6fa50](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fc6fa504)

### Added
- Total elapsed time now shown at the bottom of sign-in and sign-out checklists

## [v01.59w] — 2026-03-29 01:54:51 AM EST — v07.70r — [76bf94b](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/76bf94bf)

### Added
- "Sign-out complete" final step added to sign-out checklist

## [v01.58w] — 2026-03-29 01:49:03 AM EST — v07.69r — [17cfcb3](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/17cfcb3d)

### Changed
- Sign-out final step now reads "Waiting for sign-out confirmation"

## [v01.57w] — 2026-03-29 01:43:18 AM EST — v07.68r — [7b763ad](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/7b763ada)

### Changed
- Final sign-in step now reads "Sign-in complete" instead of "Confirming session with server"
- Reconnecting final step now reads "Session restored"

## [v01.56w] — 2026-03-29 01:36:33 AM EST — v07.67r — [33ecb4a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/33ecb4a9)

### Changed
- Renamed loading sub-steps to "Preparing interface" and "Initializing" for clearer descriptions

## [v01.55w] — 2026-03-29 01:09:43 AM EST — v07.65r — [c986e07](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c986e07e)

### Changed
- Sign-in and sign-out checklists now show all sub-steps from the start instead of revealing them one at a time

## [v01.54w] — 2026-03-28 09:11:25 PM EST — v07.63r — [ad3f32a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ad3f32a6)

### Fixed
- Sign-out no longer gets stuck on "Waiting for server confirmation"

## [v01.53w] — 2026-03-28 08:50:32 PM EST — v07.62r — [c9302e1](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c9302e11)

### Fixed
- Signing in immediately after signing out no longer gets interrupted by a false "You have been signed out" message

## [v01.52w] — 2026-03-28 08:23:32 PM EST — v07.61r — [62794da](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/62794dac)

### Fixed
- Signing in immediately after signing out no longer gets interrupted by a false "You have been signed out" message

## [v01.51w] — 2026-03-28 07:48:08 PM EST — v07.60r — [15c9517](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/15c95177)

### Fixed
- Steps with sub-steps now show "total" next to their timer to distinguish from individual sub-step timers
- Reconnecting checklist steps now show live timers while in progress

## [v01.50w] — 2026-03-28 07:40:23 PM EST — v07.59r — [79001e7](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/79001e78)

### Fixed
- Step timers now appear next to each step's text instead of being displaced by sub-steps

## [v01.49w] — 2026-03-28 07:32:09 PM EST — v07.58r — [7e828fd](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/7e828fda)

### Fixed
- Sign-out "Waiting for server confirmation" now shows a live-updating timer while active
- All sign-in and sign-out checklist steps now show live timers while in progress

## [v01.48w] — 2026-03-28 06:58:25 PM EST — v07.57r — [e7ebd82](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e7ebd82d)

### Fixed
- Parent stage total times restored, sub-steps now complete when parent stage transitions

## [v01.47w] — 2026-03-28 06:33:14 PM EST — v07.55r — [27aef21](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/27aef21f)

### Fixed
- Parent checklist stages with sub-steps no longer show a confusing duplicate total time

## [v01.46w] — 2026-03-28 06:19:20 PM EST — v07.54r — [b95ba39](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b95ba39c)

### Fixed
- Checklist timer values no longer carry over between sign-in and sign-out cycles

## [v01.45w] — 2026-03-28 06:19:20 PM EST — v07.53r — [ac22478](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ac224780)

### Fixed
- Parent stage total time now displays separately from sub-step times

## [v01.44w] — 2026-03-28 05:55:55 PM EST — v07.52r — [177fb81](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/177fb817)

### Fixed
- Sub-step timers now freeze when completed — no longer show inflated times that keep growing

## [v01.43w] — 2026-03-28 05:37:53 PM EST — v07.51r — [3c7b73c](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/3c7b73c1)

### Changed
- Checklist timers now display seconds with one decimal place instead of milliseconds

## [v01.42w] — 2026-03-28 05:04:13 PM EST — v07.50r — [e41b902](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e41b9021)

### Changed
- Minor internal improvements

## [v01.41w] — 2026-03-28 05:04:13 PM EST — v07.50r — [e41b902](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e41b9021)

### Fixed
- Sign-out sub-step timing now works correctly — wiring calls were missing from the sign-out flow

## [v01.40w] — 2026-03-28 05:01:25 PM EST — v07.49r — [2597b3a](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/2597b3ae)

### Added
- Sign-in checklist now shows detailed sub-steps with live timing during "Exchanging credentials with server" and "Loading the application"
- Sign-out checklist now shows sub-steps with live timing during "Invalidating server session"

## [v01.39w] — 2026-03-27 07:18:05 PM EST — v07.13r — [eac3b54](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/eac3b541)

### Fixed
- Eliminated font loading errors that appeared on every page load

## [v01.38w] — 2026-03-27 07:00:26 PM EST — v07.11r — [bcef27f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/bcef27f2)

### Changed
- Minor internal improvements

## [v01.37w] — 2026-03-27 06:53:06 PM EST — v07.10r — [1147ef4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/1147ef40)

### Fixed
- Eliminated font loading errors that appeared on every page load

## [v01.36w] — 2026-03-26 02:29:03 PM EST — v06.99r — [0f3d15d](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/0f3d15dd)

### Changed
- Minor internal improvements

## [v01.35w] — 2026-03-26 01:17:37 PM EST — v06.97r — [c72027f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c72027f4)

### Fixed
- Fixed re-authentication to properly auto-select the same Google account without showing the account picker

## [v01.34w] — 2026-03-26 12:58:10 PM EST — v06.96r — [c645e17](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c645e17b)

### Changed
- Re-authenticating now automatically signs you in with the same Google account instead of showing the account picker

## [v01.33w] — 2026-03-26 12:03:38 PM EST — v06.95r — [1122d29](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/1122d29e)

### Fixed
- Closing the Google sign-in popup without completing sign-in now properly returns you to the sign-in screen if your session has expired

## [v01.32w] — 2026-03-26 11:14:47 AM EST — v06.94r — [c6a0324](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c6a03246)

### Security
- Improved sign-in security — SSO token refresh now validates the correct Google account is used

## [v01.31w] — 2026-03-26 10:49:30 AM EST — v06.92r — [a88695f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a88695ff)

### Fixed
- "Use Here" session reclaim no longer gets stuck on reconnecting

## [v01.30w] — 2026-03-26 09:32:01 AM EST — v06.90r — [78fa23f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/78fa23f2)

### Changed
- SSO sign-in now shows the authentication progress checklist with timing alongside the source indicator

## [v01.29w] — 2026-03-26 09:25:30 AM EST — v06.89r — [31dbf54](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/31dbf546)

### Fixed
- Fixed sign-in hanging on "Exchanging credentials with server" when the server takes longer than 30 seconds to respond — now shows a clear timeout error with a retry prompt

## [v01.28w] — 2026-03-26 08:58:20 AM EST — v06.87r — [65d631f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/65d631f3)

### Added
- Sign-in now shows a real-time checklist with timing for each authentication step
- Sign-out now shows a real-time checklist tracking each step of the sign-out process with timing
- Reconnecting now shows a real-time checklist tracking session verification with timing

## [v01.27w] — 2026-03-26 08:02:27 AM EST — v06.82r — [491ff0e](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/491ff0e0)

### Added
- Sign-in now shows real-time progress messages ("Contacting Google…", "Verifying your identity…", "Creating your session…", "Almost ready…") so you can see exactly what stage of authentication you're at

## [v01.26w] — 2026-03-25 09:07:53 AM EST — v06.44r — [8845bc4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/8845bc44)

### Fixed
- Panels and overlays now close properly during sign-out, preventing UI glitches

## [v01.25w] — 2026-03-23 08:38:15 AM EST — v06.17r — [a9f4842](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a9f48420)

### Added
- New "Sign Out" and "Sign Out All" buttons — sign out of just this page or all connected pages at once

## [v01.24w] — 2026-03-23 08:20:05 AM EST — v06.16r — [bc7e7f4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/bc7e7f4e)

### Changed
- Minor internal improvements

## [v01.23w] — 2026-03-22 03:19:28 PM EST — v06.12r — [3f380b4](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/3f380b44)

### Fixed
- Session countdown timer now matches server-side 15-minute HIPAA timeout

## [v01.22w] — 2026-03-22 03:12:04 PM EST — v06.11r — [09d57c0](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/09d57c0e)

### Changed
- Switched to HIPAA security defaults — sessions no longer persist across browser restarts

## [v01.21w] — 2026-03-22 03:06:49 PM EST — v06.10r — [d4c9c45](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d4c9c451)

### Fixed
- No longer shows "Reconnecting" when opening the page fresh after a session has expired

## [v01.20w] — 2026-03-22 02:30:05 PM EST — v06.07r — [99debf5](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/99debf55)

### Fixed
- Tab duplication no longer expires the session — the new tab correctly inherits the active session

## [v01.19w] — 2026-03-22 02:12:54 PM EST — v06.06r — [b3d2f63](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/b3d2f63c)

### Fixed
- "Signing in via Program Portal" message now appears during SSO sign-in instead of generic "Setting up your session"

## [v01.18w] — 2026-03-22 02:05:02 PM EST — v06.05r — [d9ef905](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/d9ef9056)

### Fixed
- Session expiry warning no longer appears incorrectly when you have plenty of session time remaining

## [v01.17w] — 2026-03-22 01:34:18 PM EST — v06.04r — [c814444](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c814444c)

### Added
- Automatic sign-in via SSO when the Program Portal is open — no manual sign-in needed
- Cross-page sign-out — signing out of one app signs out all connected apps
- "Signing in via SSO..." status message during automatic authentication

## [v01.16w] — 2026-03-22 12:51:12 PM EST — v06.03r — [6f2bb24](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6f2bb24b)

### Changed
- Minor internal improvements

## [v01.15w] — 2026-03-22 12:45:46 PM EST — v06.02r — [1e13b23](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/1e13b230)

### Changed
- Minor internal improvements

## [v01.14w] — 2026-03-22 12:23:54 PM EST — v05.99r — [525b128](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/525b1284)

### Fixed
- No longer triggers unnecessary Google re-authentication on page refresh

## [v01.13w] — 2026-03-22 12:08:17 PM EST — v05.98r — [ef32524](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/ef325246)

### Fixed
- SSO auto-authentication now works after page refresh

## [v01.12w] — 2026-03-22 11:38:56 AM EST — v05.97r — [e07ca56](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e07ca56e)

### Changed
- "Session Active Elsewhere" overlay now shows the application name

## [v01.11w] — 2026-03-21 06:15:12 PM EST — v05.77r — [eefc841](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/eefc8413)

### Fixed
- GAS changelog popup title no longer shows pipe characters

## [v01.10w] — 2026-03-21 06:07:27 PM EST — v05.76r — [fea9002](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/fea90027)

### Changed
- GAS version polling now parses pipe-delimited format from gs.version.txt

## [v01.09w] — 2026-03-21 01:01:38 PM EST — v05.64r — [c4cfe8f](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/c4cfe8f8)

### Fixed
- Sign-in flow restored to working state

## [v01.08w] — 2026-03-21 12:45:23 PM EST — v05.63r — [9140b31](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/9140b31d)

### Fixed
- Session setup now completes properly after sign-in

## [v01.07w] — 2026-03-21 12:31:09 PM EST — v05.62r — [6799cb8](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/6799cb81)

### Changed
- Session authentication now uses a secure handshake instead of passing credentials in the page address

## [v01.06w] — 2026-03-21 11:55:49 AM EST — v05.61r — [650a7b9](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/650a7b90)

### Fixed
- Sign-out now properly invalidates server-side sessions before clearing the page

### Added
- "Signing out..." overlay with spinner shown during session cleanup

## [v01.05w] — 2026-03-20 11:02:26 PM EST — v05.56r — [e56d019](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e56d0197)

### Changed
- Updated setup error message to reflect auto-generation of security keys on first deploy

## [v01.04w] — 2026-03-20 10:05:19 PM EST — v05.54r — [e5e0036](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/e5e0036d)

### Fixed
- All popups, overlays, and background timers now properly deactivated on sign-out

## [v01.03w] — 2026-03-20 09:56:00 PM EST — v05.53r — [a60ada1](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/a60ada1d)

### Fixed
- Global sessions panel now properly closes when signing out

## [v01.02w] — 2026-03-20 07:27:24 PM EST — v05.44r — [05f3571](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/05f35710)

### Fixed
- Sessions no longer conflict with other projects open in the same browser

## [v01.01w] — 2026-03-20 06:13:55 PM EST — v05.41r — [cca1815](https://github.com/ShadowAISolutions/saistemplateprojectrepo/commit/cca18151)

### Added
- "Global Sessions" button for admin users to view sessions across all projects
- Dedicated green-themed panel showing sessions grouped by project with status indicators
- Ability to sign out users from individual projects or all projects at once

Developed by: ShadowAISolutions

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

Developed by: ShadowAISolutions
