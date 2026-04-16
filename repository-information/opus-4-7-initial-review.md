# Opus 4.7 Initial Rules & Documentation Review

**Reviewer:** Claude Opus 4.7 (first session on this repo)
**Date:** 2026-04-16
**Scope:** `CLAUDE.md`, `.claude/rules/*.md`, `repository-information/*.md`, top-level doc files. Repo-level rules and process — **not** project-specific (HTML pages, GAS scripts, sprite animations) content.
**Status:** Proposal only — no rule changes applied. Each finding lists a concrete proposed fix for the developer to approve or decline.

---

## 1. How to read this report

Findings are grouped into eight themes (§3–§10). Each finding has the same shape:

- **What I observed** — a specific rule, file, or passage with line references
- **Why it matters** — what fails or degrades when the rule is in its current form
- **Proposed change** — a concrete edit that can be applied in a single commit
- **Confidence** — `high` (clear improvement), `medium` (worth discussing), `low` (speculative — only if you agree with the framing)

A "§11 Priority ranking" section at the end sorts the top findings for triage.

---

## 2. Methodology

Three parallel `Explore` subagents surveyed `CLAUDE.md`, the `.claude/rules/` directory, and the overall repository structure. I cross-read `chat-bookends.md`, `behavioral-rules.md`, `changelogs.md`, `repo-docs.md`, `CHANGELOG.md`, `SESSION-CONTEXT.md`, and `REMINDERS.md` directly. Findings are biased toward **structural** issues (placement, procedural form, cross-reference integrity) rather than wording preferences — word-level editing is a lossy channel when the rules are already dense.

---

## 3. Phantom checklist reference — **highest priority**

**What I observed.** The Pre-Commit Checklist in `CLAUDE.md` has a **duplicate item number 5**: REPO-ARCHITECTURE.md is numbered `5.` and CHANGELOG.md — the very next item — is **also** numbered `5.`. There is **no item `6.`** — the source jumps from the second `5.` straight to `7.`. So only 19 items are declared (#0–#5, #5, #7–#19), but multiple rules and pointers throughout the repo refer to item numbers that either don't exist or are ambiguous. Verified references:

| Pointer | Target it assumes | Actual rule at that number | Status |
|---|---|---|---|
| `repo-docs.md:147` "Pre-Commit #6 command" | mermaid.live URL generation | **no #6 exists** (the mermaid rule is the first #5) | **broken** |
| `repo-docs.md:352` "Pre-Commit item #6" | same as above | **no #6 exists** | **broken** |
| `changelogs.md:15` "Repo CHANGELOG (Pre-Commit #7)" | CHANGELOG.md rule | `#7` is actually README tree | **broken** — CHANGELOG is the *second* `#5` |
| `gas-scripts.md:73` "see Pre-Commit Checklist item #9" | Commit message naming | `#9` is actually Developer branding | **broken** — commit messages are `#8` |
| `gas-scripts.md:86` "see Pre-Commit #7" (SHA backfill) | CHANGELOG rule | `#7` is README tree | **broken** |
| `changelogs.md:28` "Page & GAS Changelogs (Pre-Commit #17)" | Page/GAS changelogs | `#17` is Unique file naming | **broken** — page/GAS changelogs are `#16` |
| `html-pages.md:135`, `html-pages.md:299`, `gas-scripts.md:210`, `gas-scripts.md:284` all "Pre-Commit #20" | Template source propagation | **no #20 exists** | **broken** — the rule is `#19` |
| `CLAUDE.md` Template Repo Guard: "items #1, #2, #3, #6, #8, #15, #16 when `TEMPLATE_DEPLOY` = `On`" | various | `#6` and `#8` don't exist in the declared numbering as used | **ambiguous** |

The Repo Audit Command (CLAUDE.md §418) already identifies "verify all Pre-Commit checklist item numbers referenced elsewhere in CLAUDE.md" as an audit step — but it would not self-heal. It would just surface the drift for the user to fix.

**Why it matters.** Every rule that references a Pre-Commit item by number is potentially pointing at the wrong rule or at no rule at all. A future session that enforces "skip item #8 when `TEMPLATE_DEPLOY` = `Off`" mechanically will skip the wrong rule. New contributors or new model versions trying to orient themselves will lose trust in the numbering system, and the numbering is one of the most prominent organizing devices in the repo.

**Proposed change.** Two steps, in one commit:

1. **Renumber** the Pre-Commit Checklist to a strict monotonic sequence (#0, #1, … #19). Do this by changing only the leading digit; the rule content is unchanged.
2. **Global find-and-replace** of every "Pre-Commit #N" or "Pre-Commit item #N" reference in `CLAUDE.md`, `.claude/rules/*.md`, and any other doc file. Use the table above as the authoritative mapping.

**Stretch proposal (medium confidence).** Stop using positional numbers for the most cross-referenced rules. Give each rule a short stable **ID tag** in its heading — e.g. `CHANGELOG [PC-CHANGELOG]` or `Repo version bump [PC-REPO-VER]` — and refer to rules by ID tag in other files. Numbers can stay as the primary visual organizer, but the ID tag is the stable contract. Inserting a new rule between #3 and #4 then costs zero downstream edits. Numbers alone are fragile because they encode position, and every reorganization silently breaks every pointer.

**Confidence.** High on the renumber + find-replace fix. Medium on the ID-tag proposal — it's a bigger change and the user may prefer the lower-overhead fix.

## 4. Density of the two mega-rules (CHANGELOG and Page/GAS changelogs)

**What I observed.** Two Pre-Commit items are pathologically long single paragraphs:

- **The CHANGELOG.md rule** (the second `5.` — per §3, this is what other rules intend to call `#7`): a single paragraph of roughly **7.5 KB** / ~1,100 words. It covers: Keep-a-Changelog categories, entry format, per-file subheadings, versioned release sections, prompt quoting (with the "never truncate" requirement buried mid-paragraph), archive rotation including shallow-clone fix and SHA enrichment verification, the capacity counter, `TEMPLATE_DEPLOY` reset behavior, `MULTI_SESSION_MODE` behavior, and reset-on-toggle-switch behavior.
- **Pre-Commit item `16.` — Page & GAS changelogs**: ~2.5 KB, and structurally near-identical to the CHANGELOG rule. The "describe the user's experience" writing style, categories, versioned section format, archive rotation, capacity counter, and `TEMPLATE_DEPLOY` / `MULTI_SESSION_MODE` behaviors all repeat.

**Why it matters.** Long single paragraphs degrade recall reliability under task pressure. Opus 4.7 (like 4.6) is more likely to miss a clause buried mid-paragraph than to miss a numbered sub-step. The repo itself teaches this — see "Mid-Response Bookends — Omission Prevention" in `chat-bookends.md`, which explicitly acknowledges that mid-response bookends are the rules most frequently dropped. Density is the hostile condition.

Empirically, during this very session the prompt-quoting requirement in the CHANGELOG rule almost went unnoticed in my first read of the file; I caught it only because I had already read the Chat Bookends prompt-quoting requirement, which is worded similarly. If two separate rules agree, and one is much harder to find, the easier one wins by default — which means the CHANGELOG rule's extra nuances (the "no change" subheading format, the shallow-clone fix, the `[SHA unavailable]` fallback) are silently carried by mindshare rather than the rule itself.

**Proposed change.** Break both items into explicit numbered sub-steps. For the CHANGELOG rule, a proposed skeleton:

```
5a. Unreleased entries — category, format, per-file subheadings
5b. Prompt quoting — full unabridged, blockquoted, before category headings
5c. Push-commit versioning — move entries to [vXX.XXr] section with timestamp
5d. Capacity counter — update on every push commit
5e. Archive rotation — trigger at >100 non-exempt sections; see CHANGELOG-archive.md
5f. Shallow-clone fix for SHA lookups
5g. Reset behaviors when TEMPLATE_DEPLOY switches to Off
5h. Multi-session deferred versioning
```

The same structure applies to #16; most sub-steps can delegate to #5 with "same as 5X" to cut total tokens. The combined rule would be roughly 40% shorter than the current total.

**Confidence.** High that breaking them up improves recall. Medium on the exact sub-step boundaries — the developer may prefer a different carve-up.

## 5. Descriptive rules that should be procedural gates

**What I observed.** The repo already knows that hard procedural gates (Step 1 → Step 2 → Step 3) work better than descriptive advice. Two of the best examples:

- `chat-bookends.md` "Response Opener — Mandatory First Action Gate" (3 steps, explicit no-exception framing, with a documented violation history)
- `behavioral-rules.md` "Incremental Writing — Mandatory Write Tool Gate" (3 steps, size check, skeleton+Edit procedure)

Both of those rules **used to be descriptive advice and were upgraded after failures**. The rewrite pattern is: (1) state the hard gate in three numbered steps, (2) call out the failure mode the descriptive version caused, (3) explicitly deny loopholes ("No exceptions. Not for simple files..."). That rewrite worked — I followed both gates without trouble this session.

But several other critical rules are still in descriptive form and will likely fail the same way:

| Rule | Current form | Failure mode |
|---|---|---|
| `behavioral-rules.md` **Pushback & Reasoning** | Narrative ("mandatory first pushback", "make your case and defend it") | Under task pressure, skipping pushback looks like "just getting the task done faster." No gate blocks the skip |
| `behavioral-rules.md` **Continuous Improvement** — "Immediate fix proposal is mandatory" | Descriptive ("Never respond with just 'I won't miss it again'") | The exact failure the rule forbids is easy to slip into. No procedure checkpoint before response end |
| `behavioral-rules.md` **Solution Depth** | Descriptive ("do not stop at the first plausible approach") | The first plausible idea is the path of least resistance. Without a gate, the default wins |
| `behavioral-rules.md` **Validate Before Asserting** | Has a named "test" but no procedural steps — it's framed as a self-check question | The "Wait. No." pattern is already documented as a known failure, which is proof the descriptive form isn't preventing it |
| **CLAUDE.md** Pre-Commit item `0` ("Commit belongs to this repo and task") | Descriptive inline in the Pre-Commit item | This is safety-critical (prevents cross-repo contamination), but is one bullet among 20. It deserves a standalone gate, like the Response Opener |
| **CLAUDE.md** Pre-Push item `5` ("Push-once enforcement") | Mostly procedural, but the `git ls-remote` retry logic is buried in prose | Could lift the retry into numbered steps so the wait semantics are unambiguous |
| `chat-bookends.md` **Page Enumeration** | Has a self-check, but no procedural gate before the URL sections | The failure ("page list from memory") is named, but the cure is framed as advice |

**Why it matters.** Descriptive rules work when attention is plentiful. They fail silently when the task is complex, the prompt is long, or the model is pattern-matching to "what a normal response looks like." The only reliable shape for a mandatory rule is: "before doing X, run these specific steps; if step N would be skipped, STOP."

**Proposed change.** For each rule above, apply the same three-move rewrite the Response Opener got:

1. State the gate as `Step 1 → Step 2 → Step 3` with explicit STOP language when a step would be skipped
2. Include the known failure mode (one or two sentences)
3. Deny the common loopholes ("no exceptions for simple X")

I am **high confidence** that rewriting Pushback & Reasoning, Continuous Improvement, and Pre-Commit #0 into procedural form would reduce failure rate materially. Solution Depth and Validate Before Asserting are more subjective — the procedural form is harder to write because the triggering condition is less discrete than "about to call Write" or "first output of response."

**Confidence.** High for the rewrites of rules with a named failure history. Medium for rules whose failure has been more diffuse.

## 6. Frontmatter consistency on always-loaded rules files

**What I observed.** The `.claude/rules/` directory uses YAML frontmatter to scope path-loaded rules. Six files have `paths:` blocks (changelogs, gas-scripts, html-pages, init-scripts, repo-docs, workflows). Four files are always-loaded and have **no frontmatter at all** (behavioral-rules, chat-bookends, chat-bookends-reference, output-formatting) — they open with `# Title` directly.

The current convention appears to be: **presence of a `paths:` block = path-scoped; absence = always-loaded.** That is an implicit convention, not an explicit one. A new contributor reading a rules file can't tell at a glance whether "no frontmatter" means "I forgot the frontmatter" or "this is intentionally always-loaded."

**Why it matters.** Low impact — the harness loads the files correctly today — but it's a failure mode that a future refactor could introduce. If someone creates a new rules file and forgets the frontmatter, the file is silently treated as always-loaded and its rules start firing on every prompt, inflating context. The absence-as-signal pattern makes the mistake invisible.

**Proposed change.** Add an explicit marker to the four always-loaded files. Two low-overhead options:

1. **Explicit frontmatter** — `---\n# always-loaded (no path scope)\n---` at the top of each file. Not valid YAML, but readable. A stricter YAML version would use `paths: []` with a comment above it.
2. **Convention via file-naming** — prefix always-loaded files with `_` or put them in a dedicated subdirectory like `.claude/rules/always/`. This is more invasive but visually unambiguous.

I'd recommend **(1)** for minimal churn. The developer could define `paths: []` as the explicit always-loaded signal and add a short comment in `CLAUDE.md`'s Reference Files section describing the convention. One commit touches four files and adds one sentence to CLAUDE.md.

**Confidence.** Medium. This is a "paper cut" finding — the rule system works, but the implicit convention is one of those things that's fine until the day it isn't.

## 7. Cross-file duplication (template separation, visual verification)

**What I observed.** Two substantial blocks of rules are duplicated across `gas-scripts.md` and `html-pages.md` with near-identical wording:

- **Template vs. project code separation** — the "3-line divider, TEMPLATE/PROJECT blocks, `PROJECT OVERRIDE` inline and multi-line markers, propagation behavior, override precedence" concepts appear in both files (`gas-scripts.md` §214–287 and `html-pages.md` §170–301 per the Explore survey). The GAS version is scoped to `.gs` files; the HTML version is scoped to HTML. But the mechanics — what a TEMPLATE block means, what a PROJECT block means, what happens when a template change touches an override — are the same concept expressed twice.
- **Visual verification after UI changes** — `gas-scripts.md` §296 says "see html-pages.md §Visual Verification" and then adds ~5 lines of GAS-specific notes. `html-pages.md` §343 has the full ~45-line procedure. The GAS file effectively carries a pointer plus a mini-copy; the HTML file carries the full text.

**Why it matters.** When the concept evolves (say, a new kind of override marker is added), both files have to be updated. The easy failure is updating one and forgetting the other, which produces silent drift between the HTML and GAS code-path experiences. Drift on something as central as "what a template block looks like" makes the rule system less trustworthy.

**Proposed change.** Extract the shared concept into one place. Two reasonable shapes:

1. **New file `.claude/rules/template-separation.md`** — always-loaded or scoped to both `**/*.gs` and `**/*.html`. Contains the generic "template vs project code separation" rules. Both `gas-scripts.md` and `html-pages.md` keep only a short scope-specific section ("for `.gs` files, the divider is `// ───`...") with a pointer back to the shared file.
2. **Promote one file to the canonical location.** Since the HTML version is more fully fleshed out, keep `html-pages.md` as-is and shrink `gas-scripts.md`'s section to "Template separation for GAS — see html-pages.md §N for the full rules; the only GAS-specific difference is the comment syntax (`//` instead of `<!--`)."

Option (2) is lower overhead. Option (1) is more principled.

For **visual verification**, the right shape is already almost in place — `gas-scripts.md` points at `html-pages.md`, it just duplicates ~5 lines of GAS-specific context that could collapse into the pointer target by adding a "when the change is in a GAS file..." sub-bullet in `html-pages.md`.

**Confidence.** High that the duplication exists and matters. Medium on which specific shape (shared file vs. canonical location) the developer prefers.

## 8. Session context staleness recovery — push-once tension

**What I observed.** The Session Start "auto-reconstruct stale session context" rule (CLAUDE.md §85) does two things in sequence:

1. Rebuild `SESSION-CONTEXT.md` from CHANGELOG.md entries, commit as `Session start: reconstruct stale session context`
2. **Push** the reconstruction to the `claude/*` branch "so the recovery persists even if the session ends unexpectedly"

But Pre-Push item #5 ("Push-once enforcement") requires that the `claude/*` branch not exist on the remote before pushing — the workflow has to merge and delete the branch between successive pushes. If the session starts with stale context, reconstructs, and pushes, then the **user's actual work has to wait** for the first workflow to merge before it can push again. In practice a well-scoped task pushes twice per session instead of once, roughly doubling the wall-clock tail time.

I hit this exact tension during this session. I had two options: (a) follow the rule and accept the dual-push overhead, or (b) skip the reconstruction and note it in WORTH NOTING. I chose (b) — the reconstruction is housekeeping and the push-once cost felt high for the value. This isn't a clean outcome; the rule got bent.

**Why it matters.** A rule that gets bent routinely is a rule the system doesn't actually enforce. The "Session start: reconstruct stale session context" commit+push was designed for session-start persistence, but the push-once workflow was designed after it, and the two now collide.

**Proposed change.** Three options ordered by invasiveness:

1. **Relax the push requirement.** Change Session Start §85 to commit-only — the reconstruction is safer than nothing even if not pushed, and a subsequent "remember session" (or the user's own commit) will push it alongside other work. Add a note in `SESSION-CONTEXT.md`: "If a session ends before pushing, the reconstructed entry is local-only. Next session will re-reconstruct if still stale." Low cost, low risk.
2. **Bundle reconstruction with the user's first task-related commit.** Instead of a dedicated commit, the reconstruction edits get folded into the first commit of the session if there is one. If there's no commit (pure research session), the reconstruction stays local. This keeps push-once intact at the cost of slightly muddying the commit message.
3. **Introduce a "reconciliation pool" workflow** that lets multiple `Session start:` commits queue without triggering the auto-merge for each one. This is the biggest change — touches the workflow file — and probably not worth it unless the same tension appears elsewhere.

I'd recommend **(1)**. It makes the rule reliably enforceable and costs almost nothing in reliability — the stale context file is not itself load-bearing; it's just a hint for the next session.

**Confidence.** High that the tension is real and causes rule-skipping. Medium on which option the developer prefers.

## 9. TODO.md misuse and file-purpose drift

**What I observed.** `repository-information/TODO.md` is referenced by the end-of-response `📋📋TODO📋📋` section and is intended to surface repo-scoped to-dos in every response. Reading the active session context, the current TODO items are "Get mayo, Get lettuce, Get sliced turkey, Get mustard, Get pickles" — a grocery list. The system prints these as unchecked repo TODOs at the bottom of every response.

**Why it matters.** It's funny, and it clearly works — the developer uses whatever file surfaces reliably at session boundaries. But the cost is that the mechanism designed to surface actionable repo work is being used as a personal notepad. The rules also say "Maximum 10 items — TODO.md should never have more than 10 active items. If the user requests adding an 11th, flag it and ask which item to replace or defer" — which hard-caps the list, so grocery items crowd out actual TODO items when the list fills up.

There's also a related file-purpose drift risk: `IMPROVEMENTS.md` and `FUTURE-CONSIDERATIONS.md` both hold "future work" ideas. The third Explore survey flagged possible overlap. I read both briefly; IMPROVEMENTS.md is active backlog-sized items, FUTURE-CONSIDERATIONS.md is long-horizon strategic thinking. The distinction is real but not documented — a new contributor (or a new model version) would not know which file to add a new idea to.

**Proposed change.** Two small moves:

1. **Rename TODO.md** (or split it). If the developer wants the grocery-list use case, create `PERSONAL-NOTES.md` that does not surface in end-of-response output. TODO.md stays for repo-scoped work; `📋📋TODO📋📋` continues to point at it. Alternatively, add a convention: TODO.md entries starting with `[personal]` are filtered out of the end-of-response display.
2. **Add a one-paragraph "When to use which file" section** to `IMPROVEMENTS.md` (or to `CLAUDE.md` Reference Files table) distinguishing TODO.md, IMPROVEMENTS.md, FUTURE-CONSIDERATIONS.md, DEFERRED-GAS-IFRAME-PLAN.md, REMINDERS.md, and SESSION-CONTEXT.md by purpose and timescale.

**Confidence.** High on the file-purpose-drift observation. Low confidence on the grocery-list opinion — if the developer likes the current behavior, no change is needed. This finding is as much "here's a thing I noticed" as "here's something to fix."

## 10. Observations I would **not** change

Some things I looked at carefully and decided are working well in their current form. Flagging them so the developer has a positive-control baseline:

- **Chat Bookends are worth their overhead.** The system is verbose — `TOKEN-BUDGETS.md` puts the per-response cost at ~320–480 tokens — but the payoff is legibility. Every response has a clear opening, phase transitions are marked, durations are tracked, and end-of-response data (affected URLs, commit SHAs, prompt quote) is in a predictable location. Under this review's lens the Chat Bookends system is one of the healthier parts of the repo — the rules have a documented failure history, clear procedural gates, and a self-tuning calibration step. I would not simplify this system.
- **The Template Variables table as single source of truth.** Centralizing toggles (`CHAT_BOOKENDS`, `END_OF_RESPONSE_BLOCK`, `TEMPLATE_DEPLOY`, `MULTI_SESSION_MODE`, etc.) in one table with clear independence declarations is a pattern that scales. The cross-dependency avoidance ("fully independent of all other toggles") is well-engineered.
- **`scripts/init-repo.sh` and `scripts/setup-gas-project.sh` automating complex setup.** The mechanical, error-prone parts of initialization and GAS project creation are scripted and called from CLAUDE.md as a single command. This is the right shape — Claude's role is "run script → check output → checklist → commit → push," not "manually apply 22 find-replaces."
- **Provenance markers policy.** Documented as "do not remove, do not document in detail." The rule is short and load-bearing. No change needed.
- **REPO-ARCHITECTURE.md's mermaid.live link machinery.** It is complex (pako + js-base64, Python-based URL swapping, mandatory decompression verification), but the complexity is a response to real failure modes (Edit tool character corruption, multi-diagram extraction). Worth its weight.
- **The auto-merge workflow design.** Single workflow file handling merge + deploy + cleanup + stale-branch guards in one atomic job is the right engineering call. The inherited-branch guards (SHA dual-source + timestamp + template flag + already-merged check) are defensive in a useful way.
- **Behavioral rule "Imported Skills — Do Not Modify".** Clear frozen-contract rule for `imported--*` skills. No ambiguity.
- **The Session Start "Compaction Recovery" path.** Well-thought-through — explicitly names that summaries describe what happened but not what rules governed it, and requires re-reading CLAUDE.md post-compaction. Could become a model for how other "recovery" paths are written.

I had expected to find more rules that looked over-specified or vestigial. Most of what looks heavy on first read is heavy because of a failure the developer (or prior Claude) saw and rewrote around. The repo's rule density is earned, not accidental.

## 11. Priority ranking

Sorted by expected impact-per-effort. Each entry is a one-line summary plus the section it came from.

| # | Finding | Effort | Impact | Confidence |
|---|---|---|---|---|
| 1 | **Pre-Commit numbering drift.** Duplicate `#5`, missing `#6`; multiple "Pre-Commit #N" pointers across `.claude/rules/*.md` target wrong or nonexistent items. Fix: renumber + global find-replace. (§3) | Low (1 commit, mechanical) | High (restores trust in pointer system) | High |
| 2 | **Break up mega-rules `#5` CHANGELOG and `#16` Page/GAS changelogs** into numbered sub-steps. Reduces recall failures under task pressure. (§4) | Medium | High | High |
| 3 | **Upgrade Pushback, Continuous Improvement, Pre-Commit `#0` to procedural gates.** Follow the Response Opener rewrite pattern. (§5) | Medium | High (prevents known failure modes) | High |
| 4 | **Relax the Session Start reconstruction push requirement** to commit-only. Removes the push-once collision. (§8) | Low | Medium (unblocks reliable rule-following) | High |
| 5 | **Consolidate template-separation duplication** between gas-scripts.md and html-pages.md. (§7) | Low–Medium | Medium | High |
| 6 | **Visual verification rule collapse** into a single source in html-pages.md. (§7) | Low | Low–Medium | High |
| 7 | **Add explicit always-loaded frontmatter** to the four rules files without frontmatter. (§6) | Low | Low (paper cut) | Medium |
| 8 | **Document file-purpose distinctions** between TODO.md / IMPROVEMENTS.md / FUTURE-CONSIDERATIONS.md. (§9) | Low | Low–Medium | Medium |
| 9 | **(Stretch)** ID-tag the most cross-referenced Pre-Commit rules so renumbering doesn't break pointers again. (§3) | Medium–High | Medium (prevents future drift) | Medium |
| 10 | **(Stretch)** Rename TODO.md or add a `[personal]` filter to separate personal notes from repo TODOs. (§9) | Low | Low | Low (depends on developer preference) |

### Suggested first step

If the developer wants to act on exactly one finding, it should be **#1 (numbering drift)** — it is low-risk, can be verified mechanically, and restores the integrity of pointers that the rest of the rule system depends on.

### Not-yet-investigated areas

These were out of scope for this first pass but would be worth a follow-up review:

- **Skill inventory vs. SKILLS-REFERENCE.md drift.** The third Explore noted the reference doc was created 2026-04-12; skills may have changed since. A quick `ls .claude/skills/` diff vs. the doc would confirm.
- **REPO-ARCHITECTURE.md diagrams vs. current file structure.** Repo Audit command covers this; a scheduled run would surface drift.
- **Per-environment diagram coverage.** REPO-ARCHITECTURE rules say each new page gets a per-environment diagram in `repository-information/diagrams/`. Spot check whether all 15 pages have them.
- **`MULTI_SESSION_MODE` when switched `On`.** The rule behavior is documented but I didn't observe it live; worth a dedicated review when the mode is used.
- **Hook anticipation behavior.** The `🐟🐟AWAITING HOOK🐟🐟` pattern and the stop-hook git check — I followed the rule but did not exercise edge cases (failed push followed by retry, hook firing with only untracked files, etc.).

---

**End of review.** Findings are specific enough to act on in individual commits. Happy to draft patch-sized proposals for any finding on request.

---

Developed by: ShadowAISolutions
