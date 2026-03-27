# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

## Latest Session

**Date:** 2026-03-27 08:10:18 AM EST
**Repo version:** v07.03r

### What was done
- **Research-only session** — brainstormed approaches for synchronizing data poll timing across all users and applications connected through the Application Portal
- Explored 8 approaches: Server-Anchored Clock, Epoch-Aligned Intervals, Static Heartbeat File, BroadcastChannel Leader Election, SharedWorker, SSE via Intermediary, Firebase Push, and Hybrid (Epoch + BroadcastChannel)
- Deep-dived into **Option B (Epoch-Aligned Intervals)** as the preferred approach — aligning all clients to fixed wall-clock boundaries (Unix epoch modulo interval)
- Analyzed **thundering herd risk** in detail: GAS has a 30-concurrent-execution limit per deploying account (shared across ALL scripts). Each `processDataPoll()` takes ~500ms (cache hit), giving ~60 requests/sec throughput
- Scaled analysis to 50 users × 5 apps = 250 requests/cycle — determined that epoch alignment requires 8-10s jitter at this scale, which defeats the sync purpose
- Explored **BroadcastChannel cross-app leader election** to reduce 250 requests to 50 (one per user) — but realized each app polls a **different GAS backend** (different deployment, different spreadsheet, different data), so one app can't poll on behalf of another. Combined with single-tab enforcement (1 tab per app), there are zero redundant calls to eliminate
- **Final conclusion: leaving the current design as-is is actually optimal** — random page-load times naturally distribute 250 requests across the full 15s window (~17/sec average), well under the 60/sec capacity. Epoch alignment would concentrate load and require jitter to compensate, effectively recreating the random distribution that already exists. No code changes were made

### Where we left off
- No code changes — this was a pure research/brainstorming session
- The current independent-random-poll architecture scales comfortably to ~150 users × 5 apps before hitting the 30-concurrent GAS execution limit
- True cross-user visual sync ("everyone sees data update at the same time") fundamentally requires server-push (Firebase, SSE), not any client-pull timing scheme

### Key decisions made
- **No data poll sync implementation** — after thorough analysis, the current design's natural load distribution is superior to any synchronized approach at the current and near-future scale
- **Each app's data poll is unique and non-redundant** — different apps poll different GAS backends (different deployment IDs, different spreadsheets, different data). BroadcastChannel leader election can't reduce calls because no app can poll on behalf of another
- **Scaling ceiling is ~150 users × 5 apps** — beyond that, the 30-concurrent GAS execution limit becomes a bottleneck regardless of timing strategy. The path past this ceiling is server-push (Firebase/SSE), not client-side optimization

### Active context
- Branch: `claude/sync-data-poll-0HXJj`
- Repo version: v07.03r
- TODO items: Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles
- No active reminders
- `TEMPLATE_DEPLOY` = `On`, `CHAT_BOOKENDS` = `On`, `END_OF_RESPONSE_BLOCK` = `On`
- `MULTI_SESSION_MODE` = `Off`

## Previous Sessions

**Date:** 2026-03-26 02:48:13 PM EST
**Repo version:** v06.99r

### What was done
- **v06.95r–v06.98r** — Fixed several auth UX issues: re-authentication login_hint not capturing email before session clear, SSO indicator badge showing on auth wall in Application Portal (added auth-wall guard to `_updateSsoIndicator`)
- **v06.99r** — Ported the SSO indicator system from `applicationportal.html` into the auth template and propagated to all auth pages
- **Research:** Analyzed testauth1.html and globalacl.html for other features that should be template-level — determined remaining PROJECT-section features are genuinely page-specific

### Where we left off
- All changes committed and pushed (v06.99r on `claude/fix-signin-timer-popup-1WdyA`) — workflow will auto-merge to main
- All 4 auth pages + template are now fully synchronized on SSO indicator system

Developed by: ShadowAISolutions
