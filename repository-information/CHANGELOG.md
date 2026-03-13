# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 11/100`

## [Unreleased]

## [v02.89r] — 2026-03-13 07:00:04 PM EST

### Changed
- Corrected security update plan failure analysis (`repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — identified that GAS was stuck at v01.15g from v02.79r onward because DEPLOY_SECRET broke auto-deploy, meaning all subsequent GAS-side fixes (v02.80r–v02.82r) never deployed to the live environment. Corrected false lessons: PARENT_ORIGIN case mismatch (not `.toLowerCase()`) was the actual root cause of persistent sign-in failure; TOKEN_EXCHANGE_METHOD='postMessage' was never properly tested (revert never deployed). Added `.toLowerCase()` to Phase 6 PARENT_ORIGIN derivation to prevent repeating the v02.79r bug

## [v02.88r] — 2026-03-13 06:46:07 PM EST

### Added
- Comprehensive security update plan for testauth1 (`repository-information/SECURITY-UPDATE-PLAN-TESTAUTH1.md`) — implementation-ready plan covering 6 phases: message-type allowlist, cryptographic message authentication, XSS prevention, session hardening, debug cleanup, error sanitization, and postMessage target origin restriction. Includes complete failure analysis of v02.75r–v02.84r (the two previous reverted attempts) with root causes documented for each, and explicit "never touch" constraints for the deploy handler and sign-in flow

## [v02.87r] — 2026-03-13 06:13:23 PM EST

### Changed
- Rotated 92 CHANGELOG sections (v02.68r–v01.77r) to archive — all non-today sections moved to CHANGELOG-archive.md with SHA enrichment for 6 versions (v02.63r–v02.68r); 86 older versions moved as-is (commits pre-date local git history)

## [v02.86r] — 2026-03-13 06:03:16 PM EST

### Added
- Protective `⚠️ CRITICAL` comment block in all GAS deploy handlers (`doPost(action=deploy)`) warning against adding authentication or guards — prevents silent breakage of the auto-update pipeline
- Deploy Handler Protection rule in `.claude/rules/gas-scripts.md` documenting why the deploy endpoint must remain unauthenticated, what happened when auth was added (v02.79r), and the pattern to watch for

#### `testauth1.gs` — v01.14g

##### Added
- Minor internal improvements

## [v02.85r] — 2026-03-13 05:44:18 PM EST

### Changed
- Full repo revert to v02.74r state — undoes all changes from v02.75r through v02.84r (security hardening, postMessage fixes, security action plan, template propagation)
- Removed `repository-information/SECURITY-ACTION-PLAN.md` (created in v02.78r)

#### `testauth1.html` — v01.26w (reverted from v01.35w)

##### Changed
- Reverted to v01.26w state — undoes security hardening changes (CSP meta tag, origin validation, postMessage security, CSRF token handling) that were applied in v02.75r–v02.84r

#### `testauth1.gs` — v01.13g (reverted from v01.17g)

##### Changed
- Reverted to v01.13g state — undoes server-side security hardening (state parameter validation, origin checks, action allowlists) from v02.79r–v02.84r

## [v02.74r] — 2026-03-13 12:58:17 PM EST

### Changed
- Removed "Back to Table of Contents" link from Project Structure section since it's directly adjacent to the TOC

## [v02.73r] — 2026-03-13 12:55:44 PM EST

### Added
- "Back to Table of Contents" shortcut links under each section heading in README.md for quick navigation back to the TOC

## [v02.72r] — 2026-03-13 12:52:19 PM EST

### Added
- Table of contents section in README.md with anchor links to all major sections, placed between the QR code and Project Structure

## [v02.71r] — 2026-03-13 12:32:54 PM EST

### Added
- Comprehensive Microsoft authentication implementation plan (`MICROSOFT-AUTH-PLAN.md`) — covers MSAL.js integration, Azure AD setup, provider toggle architecture, GAS-side token validation via Microsoft Graph, and HTML-side dual sign-in UI

## [v02.70r] — 2026-03-13 11:32:09 AM EST

### Fixed
- Removed automatic silent OAuth sign-in on page load — the Google account picker popup no longer fires when refreshing the auth wall page; sign-in only triggers when the user clicks "Sign In with Google"
- Reverted incorrect SIGNED_OUT_FLAG approach from v02.69r

#### `testauth1.html` — v01.26w

##### Fixed
- Page refresh on "Sign In Required" screen no longer auto-triggers Google sign-in popup

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — v01.26w (no change)

##### Fixed
- Same fix applied to auth HTML template for future pages

## [v02.69r] — 2026-03-13 11:23:50 AM EST

### Fixed
- Fixed auto sign-in after manual sign-out on auth pages — signing out and refreshing no longer silently re-authenticates; the account picker is now shown

#### `testauth1.html` — v01.25w

##### Fixed
- Fixed sign-out followed by page refresh auto-signing back in without account picker

#### `HtmlAndGasTemplateAutoUpdate-auth.html.txt` — v01.25w (no change)

##### Fixed
- Same sign-out fix applied to auth HTML template for future pages

