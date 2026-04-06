# Changelog — Text Compare Tool

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [text-comparehtml.changelog-archive.md](text-comparehtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 8/50`

## [Unreleased]

## [v01.08w] — 2026-04-06 08:10:11 AM EST — v09.04r

### Changed
- Panel labels updated from "Original" / "Changed" to "Text A" / "Text B" for neutral comparison
- Stats labels updated from "Added" / "Removed" to "Only in B" / "Only in A"
- Diff column headers updated to show "unique to A" / "unique to B" instead of "removed" / "added"

## [v01.07w] — 2026-04-05 10:23:46 PM EST — v09.01r

### Changed
- Equal lines are now hidden by default — only differences are shown after comparing

## [v01.06w] — 2026-04-05 10:18:48 PM EST — v09.00r

### Fixed
- Smart context value now shows immediately when comparison results appear, not only after clicking copy

## [v01.05w] — 2026-04-05 10:13:25 PM EST — v08.99r

### Changed
- Context lines are now auto-computed by default ("Smart context") — adjusts dynamically per change, showing the effective value so you know what's being used
- Uncheck "Smart context" to set a custom fixed number of context lines

## [v01.04w] — 2026-04-05 10:02:05 PM EST — v08.98r

### Changed
- Controls split into labeled groups so it's clear which options must be set before comparing and which work on the fly
- Column headers now show color coding: red for original/removed side, blue for changed/added side

## [v01.03w] — 2026-04-05 09:48:10 PM EST — v08.97r

### Added
- "Hide equal lines" toggle that filters the comparison view to show only the differences

## [v01.02w] — 2026-04-05 09:44:11 PM EST — v08.96r

### Added
- "Template only" toggle that strips project-specific code sections before comparing, letting you verify that shared foundational code is identical across pages
- Enhanced results message that clarifies when only project-specific sections differ

## [v01.01w] — 2026-04-05 09:35:38 PM EST — v08.95r

### Added
- "Copy Context Diff" button that generates a copyable text output showing differences with surrounding context lines
- Configurable context lines setting to control how much surrounding code is included in the output

Developed by: ShadowAISolutions
