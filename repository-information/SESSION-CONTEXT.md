# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-27 07:03:38 PM EST
**Repo version:** v07.11r

### What was done
- **v07.04r–v07.07r** — Adjusted testauth1 live data table layout: changed from full-page fixed overlay to a contained panel (`top: 36px; bottom: 120px`) that sits below the user-pill sign-out bar and above the version indicators. Moved Force Heartbeat and Security Tests buttons to fixed bottom-left (`bottom: 34px; left: 8px`) to avoid overlapping the GAS version indicator
- **v07.08r** — Added `addRow()` function to testauth1 GAS script and input fields to the HTML page for testing multi-user writes to the live data spreadsheet. Input bar appears below tabs for users with write permission, with placeholders that dynamically match spreadsheet column headers
- **v07.09r** — Fixed addRow silently failing — `google.script.run` was mangling the array parameter. Changed to pass values as JSON string (serialize in GAS iframe, parse on server)
- **v07.10r** — Added `font-src` to CSP on all auth pages (testauth1, globalacl, applicationportal) and auth template to fix 47 font loading errors from Google Identity Services
- **v07.11r** — Removed external font CDN domains (`fonts.gstatic.com`, `slant.co`) from CSP `font-src` per developer preference for no external dependencies — now `'self' data:` only. GIS falls back to system fonts

### Where we left off
- All changes committed and pushed (v07.11r) — workflow will auto-merge to main
- The add-row feature on testauth1 was deployed but **not yet confirmed working** by the developer — the addRow fix (JSON string serialization) was pushed but the developer hasn't tested it yet
- The 47 CSP font errors will still appear as console warnings (GIS tries to load external fonts that CSP blocks) but they're harmless — sign-in renders fine with system fonts

### Key decisions made
- **No external font dependencies** — developer explicitly wants no external CDN dependencies in CSP. GIS font loading errors are acceptable as harmless warnings
- **Live data table is a contained panel, not full-page** — sits between the user-pill bar and version indicators, leaving both visible
- **Testing buttons are fixed bottom-left** — separate from the live data table, positioned above the GAS version indicator
- **addRow uses JSON string serialization** — `google.script.run` mangles array parameters, so values are serialized to JSON on the client and parsed on the server

### Active context
- Branch: `claude/adjust-testauth1-layout-8PyEB`
- Repo version: v07.11r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-27 08:10:18 AM EST
**Repo version:** v07.03r

### What was done
- **Research-only session** — brainstormed approaches for synchronizing data poll timing across all users and applications connected through the Application Portal
- Explored 8 approaches, deep-dived into Epoch-Aligned Intervals, analyzed thundering herd risk
- **Final conclusion: leaving the current design as-is is actually optimal** — random page-load times naturally distribute requests, epoch alignment would concentrate load

### Where we left off
- No code changes — pure research session
- Current independent-random-poll architecture scales to ~150 users × 5 apps

Developed by: ShadowAISolutions
