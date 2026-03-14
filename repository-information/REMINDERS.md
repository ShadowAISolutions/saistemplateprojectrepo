# Reminders for Developer

Notes and reminders the developer wants surfaced at the start of the next session. These are the developer's own notes — Claude surfaces them but does not modify, complete, or remove them without explicit developer approval.

## Active Reminders

- `2026-03-14 01:52:00 PM EST` — **Hipaa preset sign-in flow confirmed working (v01.51w / v01.23g)** — All 3 bugs fixed: (1) `event.source` instead of `gasApp.contentWindow` for postMessage exchange, (2) HMAC verification pass-through when secret not configured, (3) clear `_messageKey` on sign-out. Ready to proceed with security update phases 2-7. Test timer values still active (⚡) — restore to production values when done testing

## Completed Reminders

- ~~`2026-02-28 02:11:45 AM EST` — **Check test.html issues in Chrome DevTools** — open test.html in Chrome, use Inspect/DevTools to review all issues (Console errors, warnings, etc.) and see if we can resolve/eliminate all of them~~ — completed `2026-03-07 01:56:06 PM EST` (dismissed — test.html was removed from the repo)
- ~~`2026-02-28 02:06:00 AM EST` — **Consider creating a session recap file** — a file that logs the last few things done in each session so Claude can catch up quickly in a new session (context continuity across sessions)~~ — completed `2026-03-01 02:17:35 PM EST`

Developed by: ShadowAISolutions
