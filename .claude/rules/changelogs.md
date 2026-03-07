---
paths:
  - "repository-information/CHANGELOG.md"
  - "repository-information/CHANGELOG-archive.md"
  - "live-site-pages/html-changelogs/**"
  - "live-site-pages/gs-changelogs/**"
---

# Changelog Rules

*Actionable rules: see Pre-Commit Checklist items #7 and #17 in CLAUDE.md.*

## Quick Reference

### Repo CHANGELOG (Pre-Commit #7)
- Entries go under `## [Unreleased]` during intermediate commits
- On the **push commit**, entries move from `[Unreleased]` into a new version section
- Version section header format: `## [vXX.XXr] — YYYY-MM-DD HH:MM:SS AM/PM EST`
  - Header always shows only the repo version — `w`/`g` versions are carried by per-file subheadings in the body
  - No commit SHA in the header — SHAs are added during archive rotation (see CHANGELOG-archive.md "SHA enrichment")
- Categories follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/): `### Added`, `### Changed`, `### Fixed`, `### Deprecated`, `### Removed`, `### Security`
- Only include categories that have entries — no empty headings
- Entry format: `- Description` (no per-entry timestamps)
- **Per-file subheadings**: when a version section includes changes to HTML pages or GAS scripts that have their own changelogs, add `#### \`filename\` — vXX.XXw` (or `#### \`filename\` — XX.XXg` for GAS) subheadings after the main category entries, showing the version that file became. If a change affects a file but does not bump its version, use `#### \`filename\` — vXX.XXw (no change)` to show the current version with a "(no change)" note. Each file subheading lists that file's user-facing changes with `#####` category headings. Repo-only entries do not get subheadings
- Capacity counter (`Sections: X/100`) must be updated on every push commit
- **Archive rotation** triggers when counter exceeds 100 — see `repository-information/CHANGELOG-archive.md` for the full rotation logic

### Page & GAS Changelogs (Pre-Commit #17)
- **User-facing** — describe what a visitor/user would notice, not internal details
- Writing style: "Faster page loading" not "Optimized database queries"
- Never mention file names, function names, commit SHAs, deployment IDs, or internal architecture
- Version section format for pages: `## [vXX.XXw] — YYYY-MM-DD HH:MM:SS AM/PM EST — vXX.XXr`
- Version section format for GAS: `## [XX.XXg] — YYYY-MM-DD HH:MM:SS AM/PM EST — vXX.XXr`
- Skip changelog entry if the change is purely internal with no user-visible effect
- Same 100-section archive rotation as the repo CHANGELOG
- **Single source of truth** — page changelogs live directly in `live-site-pages/html-changelogs/` (`.md` files) and GAS changelogs in `live-site-pages/gs-changelogs/` (`.md` files). These are both the source of truth and the deployed files fetched by the live site's changelog popup — no separate deployment copy is needed

### Archive Rotation Summary
- **Quick rule**: 100 triggers, date groups move. A date group is ALL sections sharing the same date — could be 1 section or 500. Never split a date group. Today's sections (EST) are always exempt. Repeat until ≤100 non-exempt sections remain
- Full rotation logic is documented in `repository-information/CHANGELOG-archive.md` (see "Rotation Logic" section)
- SHA enrichment happens during rotation — see CHANGELOG-archive.md for details

Developed by: ShadowAISolutions
