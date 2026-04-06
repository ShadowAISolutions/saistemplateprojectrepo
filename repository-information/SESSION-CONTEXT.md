# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-04-05 11:42:35 PM EST
**Repo version:** v09.03r

### What was done
- **v09.02r** — Unified shared auth/template code between testauth1.html and globalacl.html. Major changes:
  - Replaced fetch()-based heartbeat in testauth1 with iframe+postMessage approach (HIPAA-aligned, token never in URL)
  - Removed `_fetchPausedForGIS` from both files (obsolete with iframe heartbeat)
  - Added `_gasSandboxSource` to globalacl (shared auth infrastructure)
  - Restored `loadIframeViaNonce()` in globalacl (session replay protection — documented the 7-attempt history from v05.59r–v05.70r)
  - Separated project-specific message types from shared `_KNOWN_GAS_MESSAGES` and `_SIG_EXEMPT` using `// PROJECT:` markers
  - Added stale session checks, `applyUIGating()`, and role badge to testauth1's `showApp()`
  - Moved panel cooldown to PROJECT section in testauth1
  - Added `_closeAllPanelsExcept(null)` to globalacl's `showAuthWall()`
- **v09.03r** — Fixed remaining cosmetic differences (blank lines, comment wording) for 100% shared code parity

### Where we left off
- Both pushes merged to main via auto-merge workflow
- Shared (non-project-specific) auth code is now 100% identical between testauth1.html and globalacl.html
- All project-specific code is clearly separated in `// PROJECT:` marked blocks or inside `<!-- PROJECT START/END -->` sections
- Remaining expected differences: build-version, title, CLIENT_ID, deployment URL (_e), timer values (test vs prod), sourceDisplayName, PROJECT sections content

### Key decisions made
- **Timer values are project-specific** — testauth1 keeps test values (180s/300s/60s), globalacl keeps production (900/28800/300000). Not shared code
- **Heartbeat approach: iframe-based** — globalacl's iframe+postMessage approach chosen over testauth1's fetch() approach. Token never appears in URL, no COOP conflicts with GIS popup
- **`_fetchPausedForGIS` removed from both** — no longer needed with iframe heartbeat (its purpose was guarding fetch() calls to Google domains during GIS popup)
- **`_gasSandboxSource` is shared auth code** — globalacl needed it added (captures GAS sandbox WindowProxy for postMessage communication)
- **Nonce loading (`loadIframeViaNonce`) is the shared standard** — restored in globalacl. Direct `?session=` only used for initial sign-in (CacheService eventual consistency) and page-load resume. Added comprehensive documentation explaining the 7-attempt history and tradeoffs
- **HMAC liveData stripping is testauth1 project-specific** — marked with `// PROJECT:` (only needed for live-data feature)
- **Panel cooldown is testauth1 project-specific** — simple `_panelRegistry`/`_registerPanel`/`_closeAllPanelsExcept` is shared; cooldown system (`_panelCooldownUntil`, `_isPanelCooldownActive`, `_startPanelCooldown`) moved to PROJECT section

### Active context
- Branch: `claude/unify-shared-code-L2hYs`
- Repo version: v09.03r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-04-05 10:29:41 PM EST
**Repo version:** v09.01r

### What was done
- **v08.95r–v09.01r** — Enhanced Text Compare tool with Copy Context Diff, Template Only mode, Hide equal lines (default on), Smart context, labeled control groups, color-coded headers

### Where we left off
- Text Compare tool feature-complete, all pushes merged

Developed by: ShadowAISolutions
