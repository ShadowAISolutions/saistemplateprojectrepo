# Divergence Note — Template vs. `pfc` Fork

> **⚠️ This file marks a permanent historical boundary.** Do not delete or rename.

## The Divergence Event

On **2026-04-19 at 07:21:50 PM EST**, immediately before repo version **v11.59r** was cut, the `pfc` repo was initialized as a fresh fork of this template repo (`saistemplateprojectrepo`).

From **v11.59r onward**, the two repos diverge. This is the first version on this template repo that does NOT exist on the `pfc` repo.

## What Each Side Owns After Divergence

### Template repo (`saistemplateprojectrepo`) — this repo
- Template source files (`live-site-pages/templates/*`)
- Template-wide rule refinements (`CLAUDE.md`, `.claude/rules/*`)
- Cross-cutting utilities that apply to all forks
- Template-ships-as pages (`marquee1`, `marquee2`, `text-compare`, etc.)
- Any improvement that should be available to future forks

### `pfc` fork repo
- Project-specific pages and GAS scripts
- Custom branding, logos, copy
- Client-specific configuration and data handling
- `PROJECT OVERRIDE:` customizations within template regions
- Anything that would not make sense in a generic template

## Last Common Version

- **v11.58r** — the final version both repos share identical history up through
- All commits up to and including v11.58r exist on both repos
- v11.59r onward exists only here (or only on `pfc`, for `pfc`-side changes)

## Sync Workflow Going Forward

Neither repo auto-syncs with the other. When you want to move a change across the divergence boundary:

### Template → `pfc` (pushing template improvements to the fork)
Use the `Diff Rules Command` (or the manual equivalent) documented in `CLAUDE.md`:
1. On `pfc`, add a `template` git remote pointing at this repo
2. Run `git fetch template main` to see new template-side commits
3. Cherry-pick or port specific changes — do NOT blindly merge
4. Alternative: use the `/diff rules` command to surface rule-level drift specifically

### `pfc` → Template (backporting fork-side improvements)
Only applies when a fork-side change is truly generic and would benefit all forks:
1. On this template repo, review the `pfc` change
2. Genericize it (strip project-specific IDs, branding, copy)
3. Apply as a new commit here
4. Manually trigger the forward sync if desired

## Why This Matters

Without this note, it's easy to forget that the two repos share history but have intentionally diverged. Common failure modes:

- Assuming a bug fix in one repo automatically applies to the other
- Forgetting to backport a template-side improvement to active forks
- Porting fork-specific code (e.g. a client's custom branding) back to the template

If you're reading this file and about to make a "obvious" change in either repo, pause and ask: **does this belong on both sides, or only one?**

Developed by: ShadowAISolutions
