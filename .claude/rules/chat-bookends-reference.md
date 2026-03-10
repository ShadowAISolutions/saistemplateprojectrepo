# Chat Bookends — Summary Tables & Flow Examples

*Reference companion to `chat-bookends.md`. Both files are always-loaded (no path scope).*

## Bookend Summary — Mid-Response

| Bookend | When | Position | Timestamp | Duration |
|---------|------|----------|-----------|----------|
| `🚩🚩CODING PLAN🚩🚩 [HH:MM:SS AM EST MM/DD/YYYY]` | Response will make changes | Very first line of response (skip if purely informational) | Required | — |
| `🔗✏️PLANNED AFFECTED URLS✏️🔗` | Coding response (skip for research) | After coding plan bullets, before ESTIMATED TIME — predicted affected page URLs with current (pre-change) versions | — | — |
| `⚡⚡CODING START⚡⚡ [HH:MM:SS AM EST MM/DD/YYYY]` | Coding work is beginning | After PLANNED AFFECTED URLS + ESTIMATED TIME | Required | `⏱️` before next bookend |
| `🔬🔬RESEARCH START🔬🔬 [HH:MM:SS AM EST MM/DD/YYYY]` | Research-only response (no code changes expected) | First line of response (no CODING PLAN needed) | Required | `⏱️` before next bookend |
| `⏳⏳ESTIMATED TIME ≈ Xm⏳⏳` (overall) | Every response | After PLANNED AFFECTED URLS, immediately before CODING START or RESEARCH START (never skipped) | — | — |
| `⏳⏳ESTIMATED TIME ≈ Xm⏳⏳` (per-phase) | Next phase estimated >2 min | Immediately before the phase's bookend marker | — | — |
| `⏳⏳REVISED ESTIMATED TIME ≈ Xm⏳⏳ [HH:MM:SS AM EST]` | Estimate changed ≥1m after reads | After initial reads/exploration complete, before next action | Required | — |
| `📋📋PLAN APPROVED📋📋 [HH:MM:SS AM EST]` | User approved a plan via ExitPlanMode | Before execution begins; followed by CODING PLAN + CODING START (only allowed repeat) | Required | — |
| `✔️✔️CHECKLIST✔️✔️ [HH:MM:SS AM EST]` | A mandatory checklist is executing | Before the checklist name, during work | Required | `⏱️` before next bookend |
| `🔍🔍RESEARCHING🔍🔍 [HH:MM:SS AM EST]` | Entering a research/exploration phase | During work, before edits begin (skip if going straight to changes) | Required | `⏱️` before next bookend |
| `🔄🔄NEXT PHASE🔄🔄 [HH:MM:SS AM EST]` | Work pivots to a new sub-task | During work, between phases (never repeats CODING PLAN/CODING START) | Required | `⏱️` before next bookend |
| `🚧🚧BLOCKED🚧🚧 [HH:MM:SS AM EST]` | An obstacle was hit | During work, when the problem is encountered | Required | `⏱️` before next bookend |
| `🧪🧪VERIFYING🧪🧪 [HH:MM:SS AM EST]` | Entering a verification phase | During work, after edits are applied | Required | `⏱️` before next bookend |
| `➡️➡️CHANGES PUSHED➡️➡️ [HH:MM:SS AM EST]` | `git push` succeeded | Immediately after a successful push | Required | `⏱️` before next bookend |
| `🐟🐟AWAITING HOOK🐟🐟 [HH:MM:SS AM EST]` | Hook conditions true after all actions | After verifying; replaces CODING COMPLETE when hook will fire | Required | `⏱️` before HOOK FEEDBACK |
| `⚓⚓HOOK FEEDBACK⚓⚓ [HH:MM:SS AM EST]` | Hook feedback triggers a follow-up | First line of hook response (replaces CODING PLAN as opener) | Required | `⏱️` before end-of-response block |
| `🔃🔃CONTEXT COMPACTION RECOVERY🔃🔃 [HH:MM:SS AM EST MM/DD/YYYY]` | Context was compacted mid-session | First line after compaction (replaces all other openers) | Required | `⏱️` before next bookend |
| `⏱️ Xs` | Phase just ended | Immediately before the next bookend marker, and before `ExitPlanMode`/`AskUserQuestion` calls | — | Computed |
| `⏳⏳ACTUAL PLANNING TIME: Xm Ys (estimated Xm)⏳⏳` | About to prompt user via ExitPlanMode/AskUserQuestion | After `⏱️`, immediately before the tool call | — | Computed from response start timestamp → now |
| `⏸️⏸️AWAITING USER RESPONSE⏸️⏸️ [HH:MM:SS AM EST]` | Response ends with a question to the user | Immediately before `AskUserQuestion` (no end-of-response block) | Required | — |

## Bookend Summary — End-of-Response Block

| Bookend | When | Position | Timestamp | Duration |
|---------|------|----------|-----------|----------|
| `─────────────────────────` | End-of-response block begins | After last `⏱️` | — | — |
| `END OF RESPONSE BLOCK` | Block header | After first divider, before second divider | — | — |
| `─────────────────────────` | Block header completed | After END OF RESPONSE BLOCK, before UNAFFECTED URLS | — | — |
| `🔗🛡️UNAFFECTED URLS🛡️🔗` | Every response with CODING COMPLETE | After dividers, before AGENTS USED — reference URLs + unaffected pages with current versions (never skipped for coding responses) | — | — |
| `🕵🕵AGENTS USED🕵🕵` | Response performed work | After UNAFFECTED URLS | — | — |
| `📁📁FILES CHANGED📁📁` | Files were modified/created/deleted | After AGENTS USED (skip if no files changed) | — | — |
| `📜📜COMMIT LOG📜📜` | Commits were made | After FILES CHANGED (skip if no commits made) | — | — |
| `🔖🔖WORTH NOTING🔖🔖` | Something deserves attention | After COMMIT LOG (skip if nothing worth noting) | — | — |
| `📝📝SUMMARY📝📝` | Changes were made in the response | After WORTH NOTING | — | — |
| `📋📋TODO📋📋` | Every response with CODING COMPLETE | After SUMMARY — current to-do items from TODO.md, with completed items crossed off (never skipped) | — | — |
| `📂📂NEW FOLDERS📂📂` | New directories were created | After TODO (skip entirely if no new folders created — no header, no placeholder) | — | — |
| `🔗✏️AFFECTED URLS✏️🔗` | Every response with CODING COMPLETE | After NEW FOLDERS (or TODO if no new folders) — affected pages with post-bump versions, or placeholder if none (never skipped) | — | — |
| `🔧🔧ESTIMATE CALIBRATED🔧🔧` | Estimate missed by >2 min | After AFFECTED URLS (or SUMMARY), before PLAN EXECUTION TIME / ACTUAL TOTAL COMPLETION TIME (skip if ≤2 min gap) | — | — |
| `⏳⏳PLAN EXECUTION TIME: Xm Ys (estimated Xm)⏳⏳` | Plan approval flow was used | After AFFECTED URLS (or ESTIMATE CALIBRATED), before ACTUAL TOTAL COMPLETION TIME (skip if no plan approval) | — | Computed from post-approval start timestamp → closing marker |
| `⏳⏳ACTUAL TOTAL COMPLETION TIME: Xm Ys (estimated Xm)⏳⏳` | Every response with CODING COMPLETE or RESEARCH COMPLETE | Immediately before CODING COMPLETE (coding) or RESEARCH COMPLETE (research) | — | Computed from response start timestamp → closing marker |
| `✅✅CODING COMPLETE✅✅ [HH:MM:SS AM EST MM/DD/YYYY]` | Response made code changes/commits/pushes | Very last line of coding responses (unless a post-closing marker follows) | Required | — |
| `🔬🔬RESEARCH COMPLETE🔬🔬 [HH:MM:SS AM EST MM/DD/YYYY]` | Response was purely informational (no file changes) | Very last line of research responses (no end-of-response block) | Required | — |
| `💡💡SESSION SAVED💡💡` | "Remember Session" was performed | After CODING COMPLETE — the absolute last line (post-closing marker) | — | — |

## Flow Examples

**Normal flow (with revised estimate):**
```
🚩🚩CODING PLAN🚩🚩 [01:15:00 AM EST 01/15/2026]
  - brief bullet plan of intended changes

🔗✏️PLANNED AFFECTED URLS✏️🔗

`✏️🟢🌐 Homepage (v01.13w)`
> [index.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/index.html) → [ShadowAISolutions.github.io/saistemplateprojectrepo/](https://ShadowAISolutions.github.io/saistemplateprojectrepo/) `(TEMPLATE_DEPLOY: On)`

⏳⏳ESTIMATED TIME ≈ 2m⏳⏳ — ~3 file reads + ~4 edits + commit + push cycle
⚡⚡CODING START⚡⚡ [01:15:01 AM EST 01/15/2026]
  ... reading files, searching codebase ...
⏳⏳REVISED ESTIMATED TIME ≈ 4m⏳⏳ [01:15:45 AM EST] — found 12 files to edit, not 4
  ... applying changes ...
  ⏱️ 2m 29s
✔️✔️CHECKLIST✔️✔️ [01:17:30 AM EST]
  Pre-Commit Checklist
  ... checklist items ...
  ⏱️ 30s
🧪🧪VERIFYING🧪🧪 [01:18:00 AM EST]
  ... validating edits, running hook checks ...
  ⏱️ 15s
`─────────────────────────`
`END OF RESPONSE BLOCK`
`─────────────────────────`
🔗🛡️UNAFFECTED URLS🛡️🔗

`Template & Repository`
> github.com/ShadowAISolutions/saistemplateprojectrepo

─────────────────────────

> *No URL pages were unaffected in this response*

🕵🕵AGENTS USED🕵🕵
1. Agent 0 (Main) — applied changes, ran checklists

📁📁FILES CHANGED📁📁
`file.md` (edited)
`new-file.js` (created)

📜📜COMMIT LOG📜📜
SHA: [abc1234](https://github.com/ORG/REPO/commit/abc1234...) — Add feature X

📝📝SUMMARY📝📝
- Updated X in `file.md` (edited)
- Created `new-file.js` (created)

📋📋TODO📋📋
- [x] ~~Add feature X~~
- [ ] Write tests for feature X
- [ ] Update user documentation

📂📂NEW FOLDERS📂📂
[utils/](https://github.com/ORG/REPO/tree/main/utils)

🔗✏️AFFECTED URLS✏️🔗

`✏️🟢🌐 Homepage (v01.14w)`
> [index.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/index.html) → [ShadowAISolutions.github.io/saistemplateprojectrepo/](https://ShadowAISolutions.github.io/saistemplateprojectrepo/) `(TEMPLATE_DEPLOY: On)`

⏳⏳ACTUAL TOTAL COMPLETION TIME: 3m 14s (estimated 4m)⏳⏳
✅✅CODING COMPLETE✅✅ [01:18:15 AM EST 01/15/2026]
```

**Plan mode flow (with duration before user input):**
```
🚩🚩CODING PLAN🚩🚩 [01:15:00 AM EST 01/15/2026]
  - Research the codebase and design an approach
  - Present plan for approval

🔗✏️PLANNED AFFECTED URLS✏️🔗
> *No URL pages expected to be affected*

⏳⏳ESTIMATED TIME ≈ 5m⏳⏳ — ~research + plan design + implementation
⚡⚡CODING START⚡⚡ [01:15:01 AM EST 01/15/2026]
🔍🔍RESEARCHING🔍🔍 [01:15:01 AM EST]
  ... reading files, exploring codebase, designing solution ...
  ⏱️ 2m 30s
⏳⏳ACTUAL PLANNING TIME: 2m 30s (estimated 5m)⏳⏳
  ← ExitPlanMode called, user reviews plan →
  ⏱️ 45s
📋📋PLAN APPROVED📋📋 [01:18:16 AM EST]

🚩🚩CODING PLAN🚩🚩 [01:18:16 AM EST 01/15/2026]
  - Edit file X
  - Update file Y
  - Commit and push

🔗✏️PLANNED AFFECTED URLS✏️🔗
> *No URL pages expected to be affected*

⏳⏳ESTIMATED TIME ≈ 2m⏳⏳ — ~3 edits + commit + push cycle
⚡⚡CODING START⚡⚡ [01:18:16 AM EST 01/15/2026]
  ... applying changes ...
  ⏱️ 1m 15s
`─────────────────────────`
`END OF RESPONSE BLOCK`
`─────────────────────────`
🔗🛡️UNAFFECTED URLS🛡️🔗

`Template & Repository`
> github.com/ShadowAISolutions/saistemplateprojectrepo

─────────────────────────

`🟢🌐 Homepage (v01.13w)`
> [index.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/index.html) → [ShadowAISolutions.github.io/saistemplateprojectrepo/](https://ShadowAISolutions.github.io/saistemplateprojectrepo/) `(TEMPLATE_DEPLOY: On)`

🕵🕵AGENTS USED🕵🕵
1. Agent 0 (Main) — researched, planned, implemented

📁📁FILES CHANGED📁📁
`file.md` (edited)

📝📝SUMMARY📝📝
- Updated X in `file.md`

📋📋TODO📋📋
> *No to-do items*

🔗✏️AFFECTED URLS✏️🔗
> *No URL pages were affected in this response*

⏳⏳PLAN EXECUTION TIME: 1m 15s (estimated 2m)⏳⏳
⏳⏳ACTUAL TOTAL COMPLETION TIME: 4m 30s (estimated 5m)⏳⏳
✅✅CODING COMPLETE✅✅ [01:19:31 AM EST 01/15/2026]
```

**Hook anticipated flow:**
```
🚩🚩CODING PLAN🚩🚩 [01:15:00 AM EST 01/15/2026]
  - brief bullet plan of intended changes

🔗✏️PLANNED AFFECTED URLS✏️🔗
> *No URL pages expected to be affected*

⏳⏳ESTIMATED TIME ≈ 3m⏳⏳ — ~4 file edits + commit + push cycle
⚡⚡CODING START⚡⚡ [01:15:01 AM EST 01/15/2026]
  ... work (commit without push) ...
  ⏱️ 1m 44s
🐟🐟AWAITING HOOK🐟🐟 [01:16:45 AM EST]
  ← hook fires →
  ⏱️ 5s
⚓⚓HOOK FEEDBACK⚓⚓ [01:16:50 AM EST]
  ... push ...
  ⏱️ 15s
➡️➡️CHANGES PUSHED➡️➡️ [01:17:05 AM EST]
  Pushed to `claude/feature-xyz` — workflow will auto-merge to main
  ⏱️ 5s
`─────────────────────────`
`END OF RESPONSE BLOCK`
`─────────────────────────`
🔗🛡️UNAFFECTED URLS🛡️🔗

`Template & Repository`
> github.com/ShadowAISolutions/saistemplateprojectrepo

─────────────────────────

`🟢🌐 Homepage (v01.13w)`
> [index.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/index.html) → [ShadowAISolutions.github.io/saistemplateprojectrepo/](https://ShadowAISolutions.github.io/saistemplateprojectrepo/) `(TEMPLATE_DEPLOY: On)`

🕵🕵AGENTS USED🕵🕵
1. Agent 0 (Main) — applied changes, pushed

📁📁FILES CHANGED📁📁
`file.md` (edited)

📜📜COMMIT LOG📜📜
SHA: [abc1234](https://github.com/ORG/REPO/commit/abc1234...) — Add feature X

📝📝SUMMARY📝📝
- Updated X in `file.md`
- Pushed to remote

📋📋TODO📋📋
- [ ] Write tests for feature X
- [ ] Update user documentation

🔗✏️AFFECTED URLS✏️🔗
> *No URL pages were affected in this response*
⏳⏳ACTUAL TOTAL COMPLETION TIME: 2m 9s (estimated 3m)⏳⏳
✅✅CODING COMPLETE✅✅ [01:17:10 AM EST 01/15/2026]
```

**Research-only flow (no code changes):**
```
⏳⏳ESTIMATED TIME ≈ 1m⏳⏳ — ~5 file reads + codebase search
🔬🔬RESEARCH START🔬🔬 [01:15:00 AM EST 01/15/2026]
🔍🔍RESEARCHING🔍🔍 [01:15:00 AM EST]
  ... reading files, searching codebase, analyzing code ...
  ⏱️ 1m 30s
⏳⏳ACTUAL TOTAL COMPLETION TIME: 1m 30s (estimated 1m)⏳⏳
🔬🔬RESEARCH COMPLETE🔬🔬 [01:16:30 AM EST 01/15/2026]
```

**Awaiting user response flow (ends with question):**
```
🚩🚩CODING PLAN🚩🚩 [01:15:00 AM EST 01/15/2026]
  - Research the two possible approaches
  - Ask user which approach to take

🔗✏️PLANNED AFFECTED URLS✏️🔗
> *No URL pages expected to be affected*

⏳⏳ESTIMATED TIME ≈ 3m⏳⏳ — ~research + implementation after user decision
⚡⚡CODING START⚡⚡ [01:15:01 AM EST 01/15/2026]
🔍🔍RESEARCHING🔍🔍 [01:15:01 AM EST]
  ... reading files, exploring options ...
  ⏱️ 1m 15s
⏳⏳ACTUAL PLANNING TIME: 1m 15s (estimated 3m)⏳⏳
⏸️⏸️AWAITING USER RESPONSE⏸️⏸️ [01:16:16 AM EST]
  ← AskUserQuestion called, user responds →
  ⏱️ 30s
🔄🔄NEXT PHASE🔄🔄 [01:16:46 AM EST]
  User chose option B — proceeding with implementation
  ... applying changes, committing, pushing ...
  ⏱️ 1m 30s
`─────────────────────────`
`END OF RESPONSE BLOCK`
`─────────────────────────`
🔗🛡️UNAFFECTED URLS🛡️🔗

`Template & Repository`
> github.com/ShadowAISolutions/saistemplateprojectrepo

─────────────────────────

`🟢🌐 Homepage (v01.13w)`
> [index.html](https://github.com/ShadowAISolutions/saistemplateprojectrepo/blob/main/live-site-pages/index.html) → [ShadowAISolutions.github.io/saistemplateprojectrepo/](https://ShadowAISolutions.github.io/saistemplateprojectrepo/) `(TEMPLATE_DEPLOY: On)`

🕵🕵AGENTS USED🕵🕵
1. Agent 0 (Main) — researched options, implemented user's choice

📁📁FILES CHANGED📁📁
`file.md` (edited)

📝📝SUMMARY📝📝
- Updated X in `file.md`

📋📋TODO📋📋
> *No to-do items*

🔗✏️AFFECTED URLS✏️🔗
> *No URL pages were affected in this response*
⏳⏳ACTUAL TOTAL COMPLETION TIME: 3m 15s (estimated 3m)⏳⏳
✅✅CODING COMPLETE✅✅ [01:18:16 AM EST 01/15/2026]
```

Developed by: ShadowAISolutions
